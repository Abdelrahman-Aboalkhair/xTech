'use client';
import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_INVENTORY_SUMMARY,
  GET_STOCK_MOVEMENTS,
  RESTOCK_PRODUCT,
  ADJUST_STOCK,
  GET_ALL_PRODUCTS,
} from '@/app/gql/Product';
import Table from '@/app/components/layout/Table';
import RestockModal from './RestockModal';
import { Plus, Download } from 'lucide-react';
import useToast from '@/app/hooks/ui/useToast';
import { exportToCSV } from '@/app/utils/export';

const InventoryDashboard = () => {
  const { showToast } = useToast();
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Fetch inventory summary
  const { data: inventoryData, loading: inventoryLoading, error: inventoryError } = useQuery(GET_INVENTORY_SUMMARY, {
    variables: { first: 10, skip: 0, filter: {} },
  });

  // Fetch stock movements
  const { data: stockMovementsData, loading: movementsLoading, error: movementsError } = useQuery(GET_STOCK_MOVEMENTS, {
    variables: { first: 10, skip: 0 },
  });

  // Restock mutation
  const [restockProduct, { loading: isRestocking }] = useMutation(RESTOCK_PRODUCT, {
    refetchQueries: [{ query: GET_INVENTORY_SUMMARY }, { query: GET_STOCK_MOVEMENTS }],
    onError: () => showToast('Failed to restock product', 'error'),
    onCompleted: () => showToast('Product restocked successfully', 'success'),
  });

  // Adjust stock mutation
  const [adjustStock, { loading: isAdjusting }] = useMutation(ADJUST_STOCK, {
    refetchQueries: [{ query: GET_INVENTORY_SUMMARY }, { query: GET_STOCK_MOVEMENTS }],
    onError: () => showToast('Failed to adjust stock', 'error'),
    onCompleted: () => showToast('Stock adjusted successfully', 'success'),
  });

  // Define table columns for inventory summary
  const inventoryColumns = [
    { key: 'product.name', label: 'Product', sortable: true },
    { key: 'stock', label: 'Stock', sortable: true },
    {
      key: 'lowStock',
      label: 'Low Stock',
      render: (row: any) => (row.lowStock ? 'Yes' : 'No'),
      sortable: true,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row: any) => (
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setSelectedProductId(row.product.id);
              setIsRestockModalOpen(true);
            }}
            className="text-indigo-600 hover:text-indigo-800"
          >
            Restock
          </button>
          <button
            onClick={() => {
              setSelectedProductId(row.product.id);
              setIsAdjustModalOpen(true);
            }}
            className="text-blue-600 hover:text-blue-800"
          >
            Adjust
          </button>
        </div>
      ),
    },
  ];

  // Define table columns for stock movements
  const movementColumns = [
    { key: 'product.name', label: 'Product', sortable: true },
    { key: 'quantity', label: 'Quantity', sortable: true },
    { key: 'reason', label: 'Reason', sortable: true },
    {
      key: 'createdAt',
      label: 'Date',
      sortable: true,
      render: (row: any) => new Date(row.createdAt).toLocaleString(),
    },
  ];

  // Handle restock submission
  const handleRestock = async (data: { productId: string; quantity: number; notes?: string }) => {
    await restockProduct({
      variables: {
        productId: data.productId,
        quantity: data.quantity,
        notes: data.notes,
      },
    });
    setIsRestockModalOpen(false);
    setSelectedProductId(null);
  };

  // Handle adjust stock submission
  const handleAdjustStock = async (data: { productId: string; quantity: number; reason: string }) => {
    await adjustStock({
      variables: {
        productId: data.productId,
        quantity: data.quantity,
        reason: data.reason,
      },
    });
    setIsAdjustModalOpen(false);
    setSelectedProductId(null);
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
  if (inventoryError || movementsError) {
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
          onExport={handleExport}
        />
      </div>

      <div>
        <h2 className="text-lg font-medium mb-2">Stock Movement History</h2>
        <Table
          data={stockMovementsData?.stockMovementsByProduct || []}
          columns={movementColumns}
          isLoading={movementsLoading}
          emptyMessage="No stock movements recorded"
        />
      </div>

      <RestockModal
        isOpen={isRestockModalOpen}
        onClose={() => {
          setIsRestockModalOpen(false);
          setSelectedProductId(null);
        }}
        onSubmit={handleRestock}
        isLoading={isRestocking}
        initialProductId={selectedProductId}
      />


    </div>
  );
};

export default InventoryDashboard;