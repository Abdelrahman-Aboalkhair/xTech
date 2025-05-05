"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useGetAllCategoriesQuery,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from "@/app/store/apis/CategoryApi";
import useToast from "@/app/hooks/ui/useToast";
import { Trash2, ArrowLeft } from "lucide-react";
import ConfirmModal from "@/app/components/organisms/ConfirmModal";
import { useForm } from "react-hook-form";
import CategoryForm, { CategoryFormData } from "../CategoryForm";

const CategoryDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();

  // Fetch category
  const { data, isLoading } = useGetAllCategoriesQuery({});
  const category = data?.categories.find((c) => c.id === id);
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  // Form setup
  const form = useForm<CategoryFormData>({
    defaultValues: category
      ? {
        id: category.id,
        name: category.name,
        slug: category.slug,
      }
      : { id: "", name: "", slug: "" },
  });

  // Deletion state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Handle update
  const onSubmit = async (data: CategoryFormData) => {
    try {
      await updateCategory({ ...data, id }).unwrap();
      showToast("Category updated successfully", "success");
    } catch (err) {
      console.error("Failed to update category:", err);
      showToast("Failed to update category", "error");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      await deleteCategory(id as string).unwrap();
      showToast("Category deleted successfully", "success");
      router.push("/dashboard/categories");
    } catch (err) {
      console.error("Failed to delete category:", err);
      showToast("Failed to delete category", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <span className="text-gray-600">Loading category...</span>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="p-6 flex items-center justify-center">
        <span className="text-red-600">Category not found</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard/categories")}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
          >
            <ArrowLeft size={20} />
            Back to Categories
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">
            {category.name}
          </h1>
        </div>
        <button
          onClick={() => setIsConfirmModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
          disabled={isDeleting}
        >
          <Trash2 size={16} />
          {isDeleting ? "Deleting..." : "Delete Category"}
        </button>
      </div>

      {/* Category Form */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <CategoryForm
          form={form}
          onSubmit={onSubmit}
          isLoading={isUpdating}
          submitLabel="Save Changes"
        />
      </div>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        message="Are you sure you want to delete this category? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmModalOpen(false)}
        title="Delete Category"
        type="danger"
      />
    </div>
  );
};

export default CategoryDetailPage;
