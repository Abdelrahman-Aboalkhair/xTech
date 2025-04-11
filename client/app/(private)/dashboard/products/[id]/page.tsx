"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useGetAllProductsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "@/app/store/apis/ProductApi";
import { useGetAllCategoriesQuery } from "@/app/store/apis/CategoryApi";
import useToast from "@/app/hooks/ui/useToast";
import { Trash2, ArrowLeft } from "lucide-react";
import { ProductFormData } from "../page";
import ProductForm from "../ProductForm";
import ConfirmModal from "@/app/components/organisms/ConfirmModal";
import { useForm } from "react-hook-form";

const ProductDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();

  // Fetch product and categories
  const {
    data: productsData,
    isLoading: productsLoading,
    refetch,
  } = useGetAllProductsQuery({});
  const { data: categoriesData } = useGetAllCategoriesQuery({});
  const product = productsData?.products.find((p) => p.id === id);
  const categories =
    categoriesData?.categories.map((c) => ({
      label: c.name,
      value: c.id,
    })) || [];

  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  // Form setup
  const form = useForm<ProductFormData>({
    defaultValues: product
      ? {
          id: product.id,
          name: product.name,
          price: product.price,
          discount: product.discount,
          stock: product.stock,
          categoryId: product.categoryId,
          description: product.description || "",
          images: product.images || [""],
        }
      : undefined,
  });

  // Deletion state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Handle update
  const onSubmit = async (data: ProductFormData) => {
    const formattedData = {
      ...data,
      price: Number(data.price),
      discount: Number(data.discount),
      stock: Number(data.stock),
    };
    try {
      await updateProduct(formattedData).unwrap();
      refetch();
      showToast("Product updated successfully", "success");
    } catch (err) {
      console.error("Failed to update product:", err);
      showToast("Failed to update product", "error");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      await deleteProduct(id as string).unwrap();
      showToast("Product deleted successfully", "success");
      router.push("/dashboard/products");
    } catch (err) {
      console.error("Failed to delete product:", err);
      showToast("Failed to delete product", "error");
    }
  };

  if (productsLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <span className="text-gray-600">Loading product...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6 flex items-center justify-center">
        <span className="text-red-600">Product not found</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard/products")}
            className="flex items-center gap-2 text-teal-600 hover:text-teal-800"
          >
            <ArrowLeft size={20} />
            Back to Products
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">
            {product.name}
          </h1>
        </div>
        <button
          onClick={() => setIsConfirmModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
          disabled={isDeleting}
        >
          <Trash2 size={16} />
          {isDeleting ? "Deleting..." : "Delete Product"}
        </button>
      </div>

      {/* Product Form */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <ProductForm
          form={form}
          onSubmit={onSubmit}
          categories={categories}
          isLoading={isUpdating}
          submitLabel={isUpdating ? "Saving..." : "Save Changes"}
        />
      </div>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        message="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmModalOpen(false)}
      />
    </div>
  );
};

export default ProductDetailPage;
