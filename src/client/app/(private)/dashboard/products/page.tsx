// client/app/components/organisms/ProductsDashboard.tsx
"use client";
import Table from "@/app/components/layout/Table";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetAllProductsQuery,
  useUpdateProductMutation,
} from "@/app/store/apis/ProductApi";
import { useState } from "react";
import ProductModal from "./ProductModal";
import { Trash2, Edit } from "lucide-react";
import ConfirmModal from "@/app/components/organisms/ConfirmModal";
import useToast from "@/app/hooks/ui/useToast";
import { usePathname } from "next/navigation";
import { ProductFormData } from "./product.types";
import Image from "next/image";

const ProductsDashboard = () => {
  const { showToast } = useToast();
  const [createProduct, { isLoading: isCreating, error: createError }] =
    useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating, error: updateError }] =
    useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const pathname = usePathname();
  const shouldFetchProducts = pathname === "/dashboard/products";

  const { data, isLoading } = useGetAllProductsQuery(
    { select: { category: true } }, // Include category
    { skip: !shouldFetchProducts }
  );
  const products = data?.products || [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductFormData | null>(
    null
  );
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const handleCreateProduct = async (data: ProductFormData) => {
    const payload = new FormData();
    payload.append("name", data.name);
    payload.append("price", data.price.toString());
    if (data.description) payload.append("description", data.description);
    if (data.categoryId) payload.append("categoryId", data.categoryId);
    if (data.images && Array.isArray(data.images)) {
      data.images.forEach((image, index) => {
        if (image instanceof File) {
          payload.append("files", image);
        } else {
          payload.append(`images[${index}]`, image);
        }
      });
    }
    if (data.video instanceof File) {
      payload.append("files", data.video);
    } else if (data.video) {
      payload.append("videoUrl", data.video);
    }

    try {
      await createProduct(payload).unwrap();
      setIsModalOpen(false);
      showToast("Product created successfully", "success");
    } catch (err) {
      console.error("Failed to create product:", err);
      showToast("Failed to create product", "error");
    }
  };

  const handleUpdateProduct = async (data: ProductFormData) => {
    if (!editingProduct?.id) return;

    const payload = new FormData();
    if (data.name) payload.append("name", data.name);
    if (data.price) payload.append("price", data.price.toString());
    if (data.description) payload.append("description", data.description);
    if (data.categoryId) payload.append("categoryId", data.categoryId);
    if (data.images && Array.isArray(data.images)) {
      data.images.forEach((image, index) => {
        if (image instanceof File) {
          payload.append("files", image);
        } else {
          payload.append(`images[${index}]`, image);
        }
      });
    }
    if (data.video instanceof File) {
      payload.append("files", data.video);
    } else if (data.video) {
      payload.append("videoUrl", data.video);
    }

    try {
      await updateProduct({ id: editingProduct.id, data: payload }).unwrap();
      setIsModalOpen(false);
      setEditingProduct(null);
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
      label: "Name",
      sortable: true,
      render: (row: any) => (
        <div className="flex items-center space-x-2">
          {row.images?.[0] && (
            <Image
              src={row.images[0]}
              alt={row.name}
              fill
              className="w-10 h-10 object-cover rounded"
            />
          )}
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
      key: "category",
      label: "Category",
      sortable: true,
      render: (row: any) => row.category?.name || "Uncategorized",
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
                description: row.description || "",
                categoryId: row.categoryId || "",
                images: row.images || [],
                video: row.videoUrl || "",
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
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Create Product
        </button>
      </div>

      <Table
        data={products}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No products available"
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
        initialData={editingProduct ?? undefined}
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
