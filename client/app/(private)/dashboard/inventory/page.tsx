'use client';
import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_INVENTORY_SUMMARY,
  GET_STOCK_MOVEMENTS,
  GET_RESTOCKS,
  RESTOCK_PRODUCT,
  GET_ALL_PRODUCTS,
} from '@/app/gql/Product';
import Table from '@/app/components/layout/Table';
import { Plus, Download } from 'lucide-react';
import useToast from '@/app/hooks/ui/useToast';
import { exportToCSV } from '@/app/utils/export';
import Modal from '@/app/components/organisms/Modal';

const InventoryDashboard = () => {
  const { showToast } = useToast();
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    productId: '',
    quantity: 0,
    notes: '',
  });

  // Fetch inventory summary
  const { data: inventoryData, loading: inventoryLoading, error: inventoryError } = useQuery(GET_INVENTORY_SUMMARY, {
    variables: { params: { first: 10, skip: 0, filter: { lowStockOnly: false, productName: null } } },
  });

  // Fetch stock movements
  const { data: stockMovementsData, loading: movementsLoading, error: movementsError } = useQuery(GET_STOCK_MOVEMENTS, {
    variables: {
      params: {
        first: 10,
        skip: 0,
        productId: null,
        startDate: null,
        endDate: null,
      },
    },
  });

  console.log('stock movements => ', stockMovementsData);

  // Fetch restocks
  const { data: restocksData, loading: restocksLoading, error: restocksError } = useQuery(GET_RESTOCKS, {
    variables: {
      params: {
        first: 10,
        skip: 0,
        productId: null,
        startDate: null,
        endDate: null,
      },
    },
  });

  // Fetch products for restock modal dropdown
  const { data: productsData } = useQuery(GET_ALL_PRODUCTS, {
    variables: { first: 100, skip: 0 },
  });

  // Restock mutation
  const [restockProduct, { loading: isRestocking }] = useMutation(RESTOCK_PRODUCT, {
    refetchQueries: [{ query: GET_INVENTORY_SUMMARY }, { query: GET_STOCK_MOVEMENTS }, { query: GET_RESTOCKS }],
    onError: (error) => showToast(`Failed to restock product: ${error.message}`, 'error'),
    onCompleted: () => {
      showToast('Product restocked successfully', 'success');
      setIsRestockModalOpen(false);
      setFormData({ productId: '', quantity: 0, notes: '' });
      setSelectedProductId(null);
    },
  });

  // Inventory summary table columns
  const inventoryColumns = [
    { key: 'product.name', label: 'Product', sortable: true, width: '30%' },
    { key: 'stock', label: 'Stock', sortable: true, width: '20%' },
    {
      key: 'lowStock',
      label: 'Low Stock',
      sortable: true,
      width: '20%',
      render: (row: any) => (row.lowStock ? 'Yes' : 'No'),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '30%',
      render: (row: any) => (
        <button
          onClick={() => {
            setSelectedProductId(row.product.id);
            setFormData({ ...formData, productId: row.product.id });
            setIsRestockModalOpen(true);
          }}
          className="text-indigo-600 hover:text-indigo-800"
        >
          Restock
        </button>
      ),
    },
  ];

  // Stock movements table columns
  const movementColumns = [
    { key: 'product.name', label: 'Product', sortable: true, width: '30%' },
    { key: 'quantity', label: 'Quantity', sortable: true, width: '20%' },
    { key: 'reason', label: 'Reason', sortable: true, width: '30%' },
    {
      key: 'createdAt',
      label: 'Date',
      sortable: true,
      width: '20%',
      render: (row: any) => new Date(row.createdAt).toLocaleString(),
    },
  ];

  // Restocks table columns
  const restockColumns = [
    { key: 'product.name', label: 'Product', sortable: true, width: '30%' },
    { key: 'quantity', label: 'Quantity', sortable: true, width: '20%' },
    { key: 'notes', label: 'Notes', sortable: true, width: '30%' },
    {
      key: 'createdAt',
      label: 'Date',
      sortable: true,
      width: '20%',
      render: (row: any) => new Date(row.createdAt).toLocaleString(),
    },
  ];

  // Handle restock form submission
  const handleRestock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.quantity <= 0 || !formData.productId) {
      showToast('Please select a product and enter a valid quantity', 'error');
      return;
    }
    await restockProduct({
      variables: {
        productId: formData.productId,
        quantity: formData.quantity,
        notes: formData.notes || null,
      },
    });
  };

  // Handle CSV export
  const handleExport = (data: any[]) => {
    const exportData = data.map((item) => ({
      Product: item.product.name,
      Stock: item.stock,
      'Low Stock': item.lowStock ? 'Yes' : 'No',
    }));
    exportToCSV(exportData, 'inventory_summary.csv');
    showToast('Inventory exported successfully', 'success');
  };

  // Handle errors
  if (inventoryError || movementsError || restocksError) {
    showToast('Failed to load data', 'error');
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-semibold">Inventory Management</h1>
          <p className="text-sm text-gray-500">Track and manage stock levels</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsRestockModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            Restock Product
          </button>
          <button
            onClick={() => handleExport(inventoryData?.inventorySummary || [])}
            className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Inventory Summary</h2>
        <Table
          data={inventoryData?.inventorySummary || []}
          columns={inventoryColumns}
          isLoading={inventoryLoading}
          emptyMessage="No inventory data available"
          title="Inventory Overview"
          showSearchBar={true}
          showPaginationDetails={true}
          totalPages={1} // Adjust based on backend pagination
          totalResults={inventoryData?.inventorySummary?.length || 0}
          currentPage={1}
          onExport={handleExport}
        />
      </div>

      {/* <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Stock Movement History</h2>
        <Table
          data={stockMovementsData?.stockMovements || []}
          columns={movementColumns}
          isLoading={movementsLoading}
          emptyMessage="No stock movements recorded"
          title="Stock Movements"
          showSearchBar={true}
          showPaginationDetails={true}
          totalPages={1} // Adjust based on backend pagination
          totalResults={stockMovementsData?.stockMovementsByProduct?.length || 0}
          currentPage={1}
        />
      </div> */}

      <div>
        <h2 className="text-lg font-medium mb-2">Restock History</h2>
        <Table
          data={restocksData?.restocks || []}
          columns={restockColumns}
          isLoading={restocksLoading}
          emptyMessage="No restocks recorded"
          title="Restock Records"
          showSearchBar={true}
          showPaginationDetails={true}
          totalPages={1} // Adjust based on backend pagination
          totalResults={restocksData?.restocks?.length || 0}
          currentPage={1}
        />
      </div>

      <Modal open={isRestockModalOpen} onClose={() => setIsRestockModalOpen(false)}>
        <form onSubmit={handleRestock} className="space-y-4">
          <h2 className="text-lg font-semibold">Restock Product</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Product</label>
            <select
              value={formData.productId}
              onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
              className="w-full border rounded-md p-2 mt-1"
              disabled={!!selectedProductId}
              required
            >
              <option value="">Select Product</option>
              {productsData?.products?.products.map((product: any) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
              className="w-full border rounded-md p-2 mt-1"
              min="1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full border rounded-md p-2 mt-1"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsRestockModalOpen(false)}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isRestocking}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {isRestocking ? 'Restocking...' : 'Restock'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default InventoryDashboard;