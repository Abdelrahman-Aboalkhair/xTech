"use client";
import Table from "@/app/components/layout/Table";
import useQueryParams from "@/app/hooks/network/useQueryParams";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetAllProductsQuery,
  useUpdateProductMutation,
} from "@/app/store/apis/ProductApi";
import Image from "next/image";
import { useState } from "react";
import { Trash2, Edit, Package, Loader2 } from "lucide-react";
import ConfirmModal from "@/app/components/organisms/ConfirmModal";
import Modal from "@/app/components/organisms/Modal";
import useToast from "@/app/hooks/ui/useToast";
import { motion } from "framer-motion";

export interface ProductFormData {
  id: string;
  name: string;
  price: number;
  discount: number;
  stock: number;
  categoryId: string;
  description: string;
  images: string[];
}

const ProductsDashboard = () => {
  const { showToast } = useToast();
  const { query } = useQueryParams();
  const [createProduct, { isLoading: isCreating, error: createError }] =
    useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating, error: updateError }] =
    useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const { data, isLoading, refetch } = useGetAllProductsQuery(query);
  const products = data?.products || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductFormData | null>(
    null
  );
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: ProductFormData = {
      id: editingProduct?.id || "",
      name: formData.get("name") as string,
      price: Number(formData.get("price")),
      discount: Number(formData.get("discount")),
      stock: Number(formData.get("stock")),
      categoryId: formData.get("categoryId") as string,
      description: formData.get("description") as string,
      images: formData.get("images") ? [formData.get("images") as string] : [],
    };

    try {
      if (editingProduct) {
        await updateProduct({ ...data, id: editingProduct.id }).unwrap();
        showToast("Product updated successfully", "success");
      } else {
        await createProduct(data).unwrap();
        showToast("Product created successfully", "success");
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      refetch();
    } catch (err) {
      console.error("Failed to save product:", err);
      showToast("Failed to save product", "error");
    }
  };

  const handleDeleteProduct = (id: string) => {
    setProductToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete).unwrap();
      setIsConfirmModalOpen(false);
      setProductToDelete(null);
      refetch();
      showToast("Product deleted successfully", "success");
    } catch (err) {
      console.error("Failed to delete product:", err);
      showToast("Failed to delete product", "error");
    }
  };

  const columns = [
    {
      key: "name",
      label: "Product Name",
      sortable: true,
      render: (row: any) => (
        <div className="flex items-center space-x-3">
          <Image
            src={row.images[0] || "/placeholder-image.jpg"}
            alt={row.name}
            width={40}
            height={40}
            className="object-cover rounded-md border border-gray-200"
            onError={(e) => (e.currentTarget.src = "/placeholder-image.jpg")}
          />
          <span className="text-sm font-medium text-gray-800">{row.name}</span>
        </div>
      ),
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
      render: (row: any) => (
        <span className="text-sm text-gray-700">${row.price.toFixed(2)}</span>
      ),
    },
    {
      key: "discount",
      label: "Discount",
      sortable: true,
      render: (row: any) => (
        <span className="text-sm text-green-600">{row.discount}%</span>
      ),
    },
    {
      key: "stock",
      label: "Stock",
      sortable: true,
      render: (row: any) => (
        <span
          className={`text-sm ${
            row.stock > 0 ? "text-gray-700" : "text-red-600"
          }`}
        >
          {row.stock}
        </span>
      ),
    },
    {
      key: "salesCount",
      label: "Sales",
      sortable: true,
      render: (row: any) => (
        <span className="text-sm text-gray-600">{row.salesCount}</span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: any) => (
        <div className="flex space-x-3">
          <button
            onClick={() => {
              setEditingProduct({
                id: row.id,
                name: row.name,
                price: row.price,
                discount: row.discount,
                stock: row.stock,
                categoryId: row.categoryId,
                description: row.description || "",
                images: row.images || [],
              });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Edit size={16} />
            Edit
          </button>
          <button
            onClick={() => handleDeleteProduct(row.id)}
            className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors"
            disabled={isDeleting}
          >
            <Trash2 size={16} />
            {isDeleting && productToDelete === row.id
              ? "Deleting..."
              : "Delete"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Package className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              Products Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {products.length} {products.length === 1 ? "product" : "products"}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setEditingProduct(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
            >
              + New Product
            </motion.button>
          </div>
        </div>

        {/* Table Card */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              <span className="ml-2 text-gray-600">Loading products...</span>
            </div>
          ) : (
            <Table
              data={products}
              columns={columns}
              isLoading={isLoading}
              emptyMessage="No products available"
              onRefresh={refetch}
              totalPages={data?.totalPages}
              totalResults={data?.totalResults}
              resultsPerPage={data?.resultsPerPage}
              currentPage={data?.currentPage}
            />
          )}
        </motion.div>
      </motion.div>

      {/* Reusable Modal for Create/Edit */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {editingProduct ? "Edit Product" : "Create Product"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                defaultValue={editingProduct?.name || ""}
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  defaultValue={editingProduct?.price || ""}
                  step="0.01"
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Discount (%)
                </label>
                <input
                  type="number"
                  name="discount"
                  defaultValue={editingProduct?.discount || 0}
                  min="0"
                  max="100"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                defaultValue={editingProduct?.stock || ""}
                min="0"
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category ID
              </label>
              <input
                type="text"
                name="categoryId"
                defaultValue={editingProduct?.categoryId || ""}
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                defaultValue={editingProduct?.description || ""}
                rows={3}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Image URL
              </label>
              <input
                type="text"
                name="images"
                defaultValue={editingProduct?.images[0] || ""}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isCreating || isUpdating}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
              >
                {isCreating || isUpdating
                  ? "Saving..."
                  : editingProduct
                  ? "Update"
                  : "Create"}
              </motion.button>
            </div>
          </form>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        message="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setIsConfirmModalOpen(false)}
      />
    </div>
  );
};

export default ProductsDashboard;
