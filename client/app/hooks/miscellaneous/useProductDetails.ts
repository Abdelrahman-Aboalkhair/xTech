"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
} from "@/app/store/apis/ProductApi";
import { useGetAllCategoriesQuery } from "@/app/store/apis/CategoryApi";
import useToast from "@/app/hooks/ui/useToast";
import { ProductFormData } from "@/app/(private)/dashboard/products/page";

export const useProductDetail = () => {
  const { id } = useParams();
  console.log("product id from params: ", id);
  const router = useRouter();
  const { showToast } = useToast();

  const {
    data: product,
    isLoading: productsLoading,
    error: productsError,
  } = useGetProductByIdQuery(id);
  console.log("found product => ", product);

  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetAllCategoriesQuery({});

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
          images: product.images || [],
        }
      : undefined,
  });

  // Deletion state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Handle update
  const onSubmit = async (data: ProductFormData) => {
    const payload = new FormData();
    payload.append("name", data.name || "");
    payload.append("price", data.price.toString());
    payload.append("discount", data.discount.toString());
    payload.append("stock", data.stock.toString());
    payload.append("description", data.description || "");
    payload.append("categoryId", data.categoryId || "");

    if (data.images && Array.isArray(data.images)) {
      data.images.forEach((file: any) => {
        payload.append("images", file);
      });
    }

    // Log payload for debugging
    console.log("FormData payload:");
    for (const [key, value] of payload.entries()) {
      console.log(`${key}: ${value instanceof File ? value.name : value}`);
    }

    try {
      await updateProduct({
        id: id as string,
        data: payload,
      }).unwrap();
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

  return {
    product,
    categories,
    productsLoading,
    categoriesLoading,
    productsError,
    form,
    isUpdating,
    isDeleting,
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    onSubmit,
    handleDelete,
    router,
  };
};
