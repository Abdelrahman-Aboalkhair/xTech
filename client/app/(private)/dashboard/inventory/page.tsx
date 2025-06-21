'use client';
import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_INVENTORY_SUMMARY,
  GET_RESTOCKS,
  RESTOCK_PRODUCT,
  GET_ALL_PRODUCTS,
  GET_PRODUCT_ATTRIBUTES,
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
  const [selectedAttributes, setSelectedAttributes] = useState<{ attributeId: string; valueId: string }[]>([]);
  const [formData, setFormData] = useState({
    productId: '',
    quantity: 0,
    notes: '',
    attributes: [] as { attributeId: string; valueIds: string[]; quantity: number }[],
  });

  // Fetch inventory summary
  const { data: inventoryData, loading: inventoryLoading, error: inventoryError } = useQuery(GET_INVENTORY_SUMMARY, {
    variables: { params: { first: 100, skip: 0, filter: { lowStockOnly: false, productName: null } } },
  });
  console.log('inventoryData => ', inventoryData);

  // Fetch restocks
  const { data: restocksData, loading: restocksLoading, error: restocksError } = useQuery(GET_RESTOCKS, {
    variables: {
      params: {
        first: 10,
        skip: 0,
        productId: null,
        startDate: "2024-01-01T00:00:00.000Z",
        endDate: "2025-12-31T23:59:59.999Z",
      },
    },
  });
  console.log('restocksData => ', restocksData);

  // Fetch products for restock modal dropdown
  const { data: productsData } = useQuery(GET_ALL_PRODUCTS, {
    variables: { first: 100, skip: 0 },
  });

  // Fetch attributes for selected product
  const { data: productAttributesData } = useQuery(GET_PRODUCT_ATTRIBUTES, {
    variables: { productId: selectedProductId || '' },
    skip: !selectedProductId,
  });
  console.log('productAttributesData => ', productAttributesData);

  // Restock mutation
  const [restockProduct, { loading: isRestocking }] = useMutation(RESTOCK_PRODUCT, {
    refetchQueries: [{ query: GET_INVENTORY_SUMMARY }, { query: GET_RESTOCKS }],
    onError: (error) => showToast(`Failed to restock product: ${error.message}`, 'error'),
    onCompleted: () => {
      showToast('Product restocked successfully', 'success');
      setIsRestockModalOpen(false);
      setFormData({ productId: '', quantity: 0, notes: '', attributes: [] });
      setSelectedProductId(null);
      setSelectedAttributes([]);
    },
  });

  // Transform inventory data to show attribute-specific rows
  const attributeInventoryData = useMemo(() => {
    if (!inventoryData?.inventorySummary) return [];
    const result: any[] = [];
    inventoryData.inventorySummary.forEach((item: any) => {
      if (item.product?.attributes?.length) {
        const attributeCombinations = item.product.attributes.reduce(
          (acc: any[], attr: any) => {
            const values = attr.valueId ? [attr.valueId] : attr.valueIds || [];
            if (!acc.length) {
              return values.map((valueId: string) => [{ attributeId: attr.attributeId, valueId }]);
            }
            return acc.flatMap((combo: any[]) =>
              values.map((valueId: string) => [...combo, { attributeId: attr.attributeId, valueId }])
            );
          },
          []
        );
        attributeCombinations.forEach((combo: any[]) => {
          const stock = item.product.attributes
            .filter((attr: any) =>
              combo.some((c: any) => c.attributeId === attr.attributeId && (attr.valueId === c.valueId || attr.valueIds?.includes(c.valueId)))
            )
            .reduce((sum: number, attr: any) => sum + (attr.stock || 0), 0);
          result.push({
            product: item.product,
            stock,
            lowStock: stock < item.product.lowStockThreshold,
            attributeCombo: combo,
          });
        });
      } else {
        result.push(item);
      }
    });
    return result;
  }, [inventoryData]);

  // Inventory summary table columns
  const inventoryColumns = [
    {
      key: 'product.name',
      label: 'Product',
      sortable: true,
      width: '25%',
      render: (row: any) => row.product?.name || '-',
    },
    {
      key: 'attributes',
      label: 'Attributes',
      sortable: false,
      width: '25%',
      render: (row: any) => {
        if (!row.attributeCombo) return '-';
        return row.attributeCombo
          .map((combo: any) => {
            const attr = row.product.attributes.find((a: any) => a.attributeId === combo.attributeId);
            const value = attr?.attribute.values.find((v: any) => v.id === combo.valueId)?.value || '-';
            return `${attr?.attribute.name}: ${value}`;
          })
          .join('; ');
      },
    },
    {
      key: 'stock',
      label: 'Stock',
      sortable: true,
      width: '15%',
      render: (row: any) => row.stock ?? '-',
    },
    {
      key: 'lowStock',
      label: 'Low Stock',
      sortable: true,
      width: '15%',
      render: (row: any) => (
        <span
          className={row.lowStock ? 'bg-red-100 text-red-800 font-medium px-2 py-1 rounded-lg' : 'bg-green-100 text-green-800 font-medium px-2 py-1 rounded-lg'}
        >
          {row.lowStock ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '20%',
      render: (row: any) => (
        <button
          onClick={() => {
            setSelectedProductId(row.product.id);
            setSelectedAttributes(row.attributeCombo || []);
            setFormData({
              productId: row.product.id,
              quantity: 0,
              notes: '',
              attributes: row.attributeCombo
                ? [{ attributeId: row.attributeCombo[0].attributeId, valueIds: [row.attributeCombo[0].valueId], quantity: 0 }]
                : [],
            });
            setIsRestockModalOpen(true);
          }}
          className="text-indigo-600 hover:text-indigo-800"
        >
          Restock
        </button>
      ),
    },
  ];

  // Restocks table columns
  const restockColumns = [
    {
      key: 'product.name',
      label: 'Product',
      sortable: true,
      width: '25%',
      render: (row: any) => row.product?.name || '-',
    },
    {
      key: 'attributes',
      label: 'Attributes',
      sortable: false,
      width: '25%',
      render: (row: any) =>
        row.attributes
          ?.map((attr: any) => {
            const values =
              attr.valueIds
                ?.map((id: string) =>
                  attr.values?.find((v: any) => v.id === id)?.value ||
                  attr.attribute?.values?.find((v: any) => v.id === id)?.value
                )
                .filter(Boolean)
                .join(', ') ||
              (attr.valueId
                ? attr.values?.find((v: any) => v.id === attr.valueId)?.value ||
                attr.attribute?.values?.find((v: any) => v.id === attr.valueId)?.value ||
                attr.valueId
                : '-');
            return `${attr.attribute?.name || 'Unknown'}: ${values}`;
          })
          .join('; ') || '-',
    },
    {
      key: 'quantity',
      label: 'Quantity',
      sortable: true,
      width: '15%',
      render: (row: any) => row.quantity ?? '-',
    },
    {
      key: 'notes',
      label: 'Notes',
      sortable: true,
      width: '20%',
      render: (row: any) => row.notes || '-',
    },
    {
      key: 'createdAt',
      label: 'Date',
      sortable: true,
      width: '15%',
      render: (row: any) => (row.createdAt ? new Date(row.createdAt).toLocaleString() : '-'),
    },
  ];

  // Handle attribute selection
  const handleAttributeChange = (attributeId: string, valueIds: string[], quantity: number) => {
    setFormData((prev) => {
      const existingAttrs = prev.attributes.filter((attr) => attr.attributeId !== attributeId);
      return {
        ...prev,
        attributes: [...existingAttrs, { attributeId, valueIds, quantity }],
      };
    });
  };

  // Handle restock form submission
  const handleRestock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productId) {
      showToast('Please select a product', 'error');
      return;
    }
    if (!formData.attributes.length) {
      showToast('Please select at least one attribute combination', 'error');
      return;
    }
    if (formData.attributes.some((attr) => attr.quantity <= 0)) {
      showToast('Please enter a valid quantity for each attribute combination', 'error');
      return;
    }
    const attributesInput = formData.attributes.map(({ attributeId, valueIds }) => ({
      attributeId,
      valueIds,
    }));
    await restockProduct({
      variables: {
        input: {
          productId: formData.productId,
          quantity: formData.attributes.reduce((sum, attr) => sum + attr.quantity, 0),
          notes: formData.notes || null,
          attributes: attributesInput,
        },
      },
    });
  };

  // Handle CSV export
  const handleExport = (data: any[]) => {
    const exportData = data.map((item) => ({
      Product: item.product?.name || '-',
      Attributes: item.attributeCombo
        ?.map((combo: any) => {
          const attr = item.product.attributes.find((a: any) => a.attributeId === combo.attributeId);
          const value = attr?.attribute.values.find((v: any) => v.id === combo.valueId)?.value || '-';
          return `${attr?.attribute.name}: ${value}`;
        })
        .join('; ') || '-',
      Stock: item.stock ?? '-',
      'Low Stock': item.lowStock ? 'Yes' : 'No',
    }));
    exportToCSV(exportData, 'inventory_summary.csv');
    showToast('Inventory exported successfully', 'success');
  };

  // Handle errors
  if (inventoryError || restocksError) {
    showToast('Failed to load data', 'error');
  }

  // Unique attributes for modal
  const uniqueAttributes = useMemo(() => {
    if (!productAttributesData?.getProductAttributes) return [];
    const attrMap = new Map();
    productAttributesData.getProductAttributes.forEach((attr: any) => {
      if (!attrMap.has(attr.attributeId)) {
        attrMap.set(attr.attributeId, {
          attributeId: attr.attributeId,
          name: attr.attribute.name,
          type: attr.attribute.type,
          values: attr.attribute.values,
        });
      }
    });
    return Array.from(attrMap.values());
  }, [productAttributesData]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-semibold">Inventory Management</h1>
          <p className="text-sm text-gray-500">Track and manage stock levels</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => {
              setSelectedProductId(null);
              setSelectedAttributes([]);
              setFormData({ productId: '', quantity: 0, notes: '', attributes: [] });
              setIsRestockModalOpen(true);
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            Restock Product
          </button>
          <button
            onClick={() => handleExport(attributeInventoryData)}
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
          data={attributeInventoryData}
          columns={inventoryColumns}
          isLoading={inventoryLoading}
          emptyMessage="No inventory data available"
          title="Inventory Overview"
          showSearchBar={true}
          showPaginationDetails={true}
          totalPages={1} // Adjust based on backend pagination
          totalResults={attributeInventoryData.length}
          currentPage={1}
          onExport={handleExport}
        />
      </div>

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
              onChange={(e) => {
                setFormData({ ...formData, productId: e.target.value, attributes: [] });
                setSelectedProductId(e.target.value);
                setSelectedAttributes([]);
              }}
              className="w-full border rounded-md p-2 mt-1"
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
          {uniqueAttributes.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Attributes</label>
              {uniqueAttributes.map((attr: any) => (
                <div key={attr.attributeId} className="mt-2">
                  <label className="block text-sm font-medium text-gray-600">{attr.name}</label>
                  <select
                    multiple={attr.type === 'multiselect'}
                    onChange={(e) => {
                      const valueIds = Array.from(e.target.selectedOptions).map((opt) => opt.value);
                      const quantity = formData.attributes.find((a) => a.attributeId === attr.attributeId)?.quantity || 0;
                      handleAttributeChange(attr.attributeId, valueIds, quantity);
                    }}
                    className="w-full border rounded-md p-2 mt-1"
                    value={
                      formData.attributes.find((a) => a.attributeId === attr.attributeId)?.valueIds || selectedAttributes.find((a) => a.attributeId === attr.attributeId)?.valueId || []
                    }
                  >
                    {attr.values.map((val: any) => (
                      <option key={val.id} value={val.id}>
                        {val.value} (Stock: {productAttributesData?.getProductAttributes.find((pa: any) => pa.valueId === val.id)?.stock || 0})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={formData.attributes.find((a) => a.attributeId === attr.attributeId)?.quantity || 0}
                    onChange={(e) => {
                      const valueIds = formData.attributes.find((a) => a.attributeId === attr.attributeId)?.valueIds || [];
                      handleAttributeChange(attr.attributeId, valueIds, Number(e.target.value));
                    }}
                    className="w-full border rounded-md p-2 mt-1"
                    min="0"
                  />
                </div>
              ))}
            </div>
          )}
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