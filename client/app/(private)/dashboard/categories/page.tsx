"use client";
import React, { useState } from "react";
import {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/app/store/apis/CategoryApi";
import Table from "@/app/components/layout/Table";
import { motion } from "framer-motion";
import { Tag, Trash2, Plus } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import Modal from "@/app/components/organisms/Modal";
import ConfirmModal from "@/app/components/organisms/ConfirmModal";

const CategoriesDashboard = () => {
  const { data, isLoading, error } = useGetAllCategoriesQuery({});
  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();
  const categories = data?.categories || [];

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const columns = [
    {
      key: "slug",
      label: "Slug",
      sortable: true,
      render: (row) => (
        <span className="text-gray-600">{row?.slug || "N/A"}</span>
      ),
    },
    {
      key: "name",
      label: "Category Name",
      sortable: true,
      render: (row) => (
        <span className="font-medium text-gray-800">{row?.name || "N/A"}</span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleDeletePrompt(row?.id)}
            className="p-1 text-red-500 hover:text-red-600 transition-colors duration-200"
            aria-label="Delete category"
            disabled={isDeleting}
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  const handleDeletePrompt = (id: string) => {
    if (!id) return;
    setCategoryToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategory(categoryToDelete).unwrap();
      setIsConfirmModalOpen(false);
      setCategoryToDelete(null);
    } catch (err) {
      console.error("Failed to delete category:", err);
    }
  };

  const onSubmit = async (formData) => {
    try {
      await createCategory(formData).unwrap();
      setIsCreateModalOpen(false);
      reset({ name: "", slug: "" });
    } catch (err) {
      console.error("Failed to create category:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center space-x-3">
          <Tag size={24} className="text-indigo-500" />
          <h1 className="text-2xl font-bold text-gray-800">
            Categories Dashboard
          </h1>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-300 flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Add Category</span>
        </button>
      </motion.div>

      {/* Content */}
      {isLoading ? (
        <div className="text-center py-12">
          <Tag size={48} className="mx-auto text-gray-400 mb-4 animate-pulse" />
          <p className="text-lg text-gray-600">Loading categories...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-lg text-red-500">
            Error loading categories: {error.message || "Unknown error"}
          </p>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12">
          <Tag size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-lg text-gray-600">No categories available</p>
        </div>
      ) : (
        <Table
          data={categories}
          columns={columns}
          isLoading={isLoading}
          className="bg-white rounded-xl shadow-md border border-gray-100"
        />
      )}

      {/* Create Category Modal */}
      <Modal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      >
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Create Category
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name
            </label>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              rules={{ required: "Category name is required" }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
                  placeholder="Enter category name"
                />
              )}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug
            </label>
            <Controller
              name="slug"
              control={control}
              defaultValue=""
              rules={{ required: "Slug is required" }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
                  placeholder="Enter slug"
                />
              )}
            />
            {errors.slug && (
              <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>
            )}
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className={`px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-300 ${
                isCreating ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isCreating ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </Modal>

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

export default CategoriesDashboard;
