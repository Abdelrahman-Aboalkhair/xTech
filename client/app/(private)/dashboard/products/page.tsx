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
import ProductModal from "./ProductModal";
import { Trash2, Edit } from "lucide-react";
import ConfirmModal from "@/app/components/organisms/ConfirmModal";
import useToast from "@/app/hooks/ui/useToast";

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
  const [deleteProduct, { isLoading: isDeleting, error: deleteError }] =
    useDeleteProductMutation();
  console.log("deleteError => ", deleteError);
  const { data, isLoading, refetch } = useGetAllProductsQuery(query);
  const products = data?.products || [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductFormData | null>(
    null
  );
  console.log("editing product => ", editingProduct);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const handleCreateProduct = async (data: ProductFormData) => {
    const formattedPrice = Number(data.price);
    const formattedDiscount = Number(data.discount);
    const formattedStock = Number(data.stock);

    data.price = formattedPrice;
    data.discount = formattedDiscount;
    data.stock = formattedStock;
    try {
      await createProduct(data).unwrap();
      setIsModalOpen(false);
      refetch();
      showToast("Product created successfully", "success");
    } catch (err) {
      console.error("Failed to create product:", err);
      showToast("Failed to create product", "error");
    }
  };

  const handleUpdateProduct = async (data: ProductFormData) => {
    console.log("submitten form data => ", data);
    if (!editingProduct) return;

    const formattedPrice = Number(data.price);
    const formattedDiscount = Number(data.discount);
    const formattedStock = Number(data.stock);

    try {
      await updateProduct({
        ...data,
        price: formattedPrice,
        discount: formattedDiscount,
        stock: formattedStock,
        id: editingProduct.id,
      }).unwrap();
      setIsModalOpen(false);
      setEditingProduct(null);
      refetch();
      showToast("Product updated successfully", "success");
    } catch (err) {
      console.error("Failed to update product:", err);
      showToast("Failed to update product", "error");
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

  const cancelDelete = () => {
    setIsConfirmModalOpen(false);
    setProductToDelete(null);
  };

  const columns = [
    {
      key: "name",
      label: "Product Name",
      sortable: true,
      render: (row: any) => (
        <div className="flex items-center space-x-2">
          <Image
            src={row.images[0] || "/placeholder-image.jpg"}
            alt={row.name}
            width={40}
            height={40}
            className="object-cover rounded-md"
            onError={(e) => {
              e.currentTarget.src = "/placeholder-image.jpg";
            }}
          />
          <span>{row.name}</span>
        </div>
      ),
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
      render: (row: any) => `$${row.price.toFixed(2)}`,
    },
    {
      key: "discount",
      label: "Discount",
      sortable: true,
      render: (row: any) => `${row.discount}%`,
    },
    {
      key: "stock",
      label: "Stock",
      sortable: true,
      render: (row: any) => row.stock,
    },
    {
      key: "salesCount",
      label: "Sales Count",
      sortable: true,
      render: (row: any) => row.salesCount,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: any) => (
        <div className="flex space-x-2">
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
                images: row.images || [""],
              });
              setIsModalOpen(true);
            }}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <Edit size={16} />
            Edit
          </button>
          <button
            onClick={() => handleDeleteProduct(row.id)}
            className="text-red-600 hover:text-red-800 flex items-center gap-1"
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-semibold">Product List</h1>
          <p className="text-sm text-gray-500">Manage and view your products</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Create Product
        </button>
      </div>

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

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
        initialData={editingProduct!}
        isLoading={editingProduct ? isUpdating : isCreating}
        error={editingProduct ? updateError : createError}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        message="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default ProductsDashboard;
