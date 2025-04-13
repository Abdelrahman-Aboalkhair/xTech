"use client";
import {
  useCreatePageMutation,
  useGetAllPagesQuery,
  useUpdatePageMutation,
  useDeletePageMutation,
} from "@/app/store/apis/PageApi";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Loader2,
  AlertCircle,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import Table from "@/app/components/layout/Table";
import useToast from "@/app/hooks/ui/useToast";
import { useForm } from "react-hook-form";
import ToggleableText from "@/app/components/atoms/ToggleableText";
import PageForm, { PageFormData } from "./PageForm";
import ConfirmModal from "@/app/components/organisms/ConfirmModal";

const PagesDashboard = () => {
  const { showToast } = useToast();
  const { data, isLoading, error, refetch } = useGetAllPagesQuery({});
  const [createPage, { isLoading: isCreating }] = useCreatePageMutation();
  const [updatePage, { isLoading: isUpdating }] = useUpdatePageMutation();
  const [deletePage, { isLoading: isDeleting }] = useDeletePageMutation();
  const pages = data?.pages || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<PageFormData | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<number | null>(null);

  const form = useForm<PageFormData>({
    defaultValues: {
      slug: "",
      title: "",
      isVisible: true,
      showInNavbar: true,
      isPublished: true,
      metaTitle: "",
      metaDescription: "",
      createdAt: new Date(),
    },
  });

  const handleCreateOrUpdate = async (data: PageFormData) => {
    console.log("data being submitted => ", data);
    try {
      if (editingPage) {
        console.log("editingPage => ", editingPage);
        await updatePage({
          pageId: editingPage.id || 0,
          updatedPage: data,
        }).unwrap();
        showToast("Page updated successfully", "success");
      } else {
        await createPage(data).unwrap();
        showToast("Page created successfully", "success");
      }
      setIsModalOpen(false);
      setEditingPage(null);
      form.reset();
      refetch();
    } catch (err) {
      console.error("Failed to save page:", err);
      showToast("Failed to save page", "error");
    }
  };

  const handleDelete = async () => {
    if (!pageToDelete) return;
    try {
      await deletePage(pageToDelete).unwrap();
      setIsConfirmModalOpen(false);
      setPageToDelete(null);
      refetch();
      showToast("Page deleted successfully", "success");
    } catch (err) {
      console.error("Failed to delete page:", err);
      showToast("Failed to delete page", "error");
    }
  };

  const columns = [
    {
      key: "id",
      label: "Page ID",
      sortable: true,
      render: (row: PageFormData) => (
        <span className="text-sm text-gray-600 font-mono">{row.id}</span>
      ),
    },
    {
      key: "title",
      label: "Title",
      sortable: true,
      render: (row: PageFormData) => (
        <span className="text-sm font-medium text-gray-800">{row.title}</span>
      ),
    },
    {
      key: "slug",
      label: "Slug",
      sortable: true,
      render: (row: PageFormData) => (
        <span className="text-sm text-gray-600">{row.slug}</span>
      ),
    },
    {
      key: "isVisible",
      label: "Visible",
      render: (row: PageFormData) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.isVisible
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.isVisible ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: "showInNavbar",
      label: "In Navbar",
      render: (row: PageFormData) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.showInNavbar
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.showInNavbar ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: "isPublished",
      label: "Published",
      render: (row: PageFormData) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.isPublished
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.isPublished ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: "metaTitle",
      label: "Meta Title",
      render: (row: PageFormData) => (
        <span className="text-sm text-gray-600 truncate max-w-xs">
          {row.metaTitle}
        </span>
      ),
    },
    {
      key: "metaDescription",
      label: "Meta Description",
      render: (row: PageFormData) => (
        <ToggleableText
          content={row.metaDescription}
          truncateLength={20}
          className="text-sm text-gray-600"
        />
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      sortable: true,
      render: (row: PageFormData) => (
        <span className="text-sm text-gray-600">
          {new Date(row.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: PageFormData) => (
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setEditingPage(row);
              form.reset(row);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <Pencil size={16} />
            Edit
          </button>
          <button
            onClick={() => {
              setPageToDelete(row.id);
              setIsConfirmModalOpen(true);
            }}
            className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors"
            disabled={isDeleting}
          >
            <Trash2 size={16} />
            {isDeleting && pageToDelete === row.id ? "Deleting..." : "Delete"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="min-w-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              Pages Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {pages.length} {pages.length === 1 ? "page" : "pages"}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setEditingPage(null);
                form.reset();
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
            >
              + New Page
            </motion.button>
          </div>
        </div>

        {/* Table Card */}
        <motion.div
          className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
              <span className="ml-2 text-gray-600">Loading pages...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12 text-red-600">
              <AlertCircle className="h-8 w-8 mr-2" />
              <span>Error loading pages. Please try again.</span>
            </div>
          ) : (
            <Table
              data={pages}
              columns={columns}
              isLoading={isLoading}
              className="w-full"
            />
          )}
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingPage ? "Edit Page" : "Create Page"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <PageForm
                form={form}
                onSubmit={handleCreateOrUpdate}
                isLoading={editingPage ? isUpdating : isCreating}
                submitLabel={editingPage ? "Update" : "Create"}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        message="Are you sure you want to delete this page? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmModalOpen(false)}
        title="Delete Page"
        type="danger"
      />
    </div>
  );
};

export default PagesDashboard;
