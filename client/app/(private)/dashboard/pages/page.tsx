"use client";
import {
  useCreatePageMutation,
  useGetAllPagesQuery,
  useUpdatePageMutation,
} from "@/app/store/apis/PageApi";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Loader2, AlertCircle, Pencil } from "lucide-react";
import Table from "@/app/components/layout/Table";
import useToast from "@/app/hooks/ui/useToast";
import { FormProvider, useForm } from "react-hook-form";
import Switch from "@/app/components/atoms/Switch";
import Modal from "@/app/components/organisms/Modal";
import ToggleableText from "@/app/components/atoms/ToggleableText";

interface PageData {
  id: number;
  slug: string;
  title: string;
  isVisible: boolean;
  showInNavbar: boolean;
  isPublished: boolean;
  metaTitle: string;
  metaDescription: string;
  createdAt: string;
  updatedAt: string;
  sections: any[];
  banners: any[];
}

const PagesDashboard = () => {
  const { showToast } = useToast();
  const { data, isLoading, error, refetch } = useGetAllPagesQuery({});
  const [updatePage, { error: updateError }] = useUpdatePageMutation();
  if (updateError) {
    console.log("updateError => ", updateError);
  }
  const [createPage, { error: createError }] = useCreatePageMutation();
  if (createError) {
    console.log("createError => ", createError);
  }
  const pages = data?.pages || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<PageData | null>(null);

  const methods = useForm<PageData>({
    defaultValues: editingPage || {
      id: 0,
      slug: "",
      title: "",
      isVisible: true,
      showInNavbar: true,
      isPublished: true,
      metaTitle: "",
      metaDescription: "",
    },
  });

  const { handleSubmit, reset } = methods;

  React.useEffect(() => {
    if (editingPage) {
      reset(editingPage);
    } else {
      reset({
        slug: "",
        title: "",
        isVisible: true,
        showInNavbar: true,
        isPublished: true,
        metaTitle: "",
        metaDescription: "",
      });
    }
  }, [editingPage, reset]);

  const onSubmit = async (data: PageData) => {
    const updatedPage: Partial<PageData> = {
      ...data,
    };

    console.log("updatedPage => ", updatedPage);

    try {
      if (editingPage) {
        await updatePage({
          pageId: editingPage?.id || 0,
          updatedPage,
        }).unwrap();
      } else {
        await createPage(data).unwrap();
      }
      setIsModalOpen(false);
      setEditingPage(null);
      refetch();
      showToast("Page updated successfully", "success");
    } catch (err) {
      console.error("Failed to update page:", err);
      showToast("Failed to update page", "error");
    }
  };

  const columns = [
    {
      key: "id",
      label: "Page ID",
      sortable: true,
      render: (row: PageData) => (
        <span className="text-sm text-gray-600 font-mono">{row.id}</span>
      ),
    },
    {
      key: "title",
      label: "Title",
      sortable: true,
      render: (row: PageData) => (
        <span className="text-sm font-medium text-gray-800">{row.title}</span>
      ),
    },
    {
      key: "slug",
      label: "Slug",
      sortable: true,
      render: (row: PageData) => (
        <span className="text-sm text-gray-600">{row.slug}</span>
      ),
    },
    {
      key: "isVisible",
      label: "Visible",
      render: (row: PageData) => (
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
      render: (row: PageData) => (
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
      render: (row: PageData) => (
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
      render: (row: PageData) => (
        <span className="text-sm text-gray-600 truncate max-w-xs">
          {row.metaTitle}
        </span>
      ),
    },
    {
      key: "metaDescription",
      label: "Meta Description",
      render: (row: PageData) => (
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
      render: (row: PageData) => (
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
      render: (row: PageData) => (
        <button
          onClick={() => {
            setEditingPage(row);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <Pencil size={16} />
          Edit
        </button>
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

      {/* Edit Page Modal */}
      {isModalOpen && (
        <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                {editingPage ? "Edit Page" : "Create Page"}
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  {...methods.register("title", { required: true })}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Slug
                </label>
                <input
                  {...methods.register("slug", { required: true })}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Switch name="isVisible" label="Visible" />
                <Switch name="showInNavbar" label="In Navbar" />
                <Switch name="isPublished" label="Published" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Meta Title
                </label>
                <input
                  {...methods.register("metaTitle", { required: true })}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Meta Description
                </label>
                <textarea
                  {...methods.register("metaDescription", { required: true })}
                  rows={3}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  {editingPage ? "Update" : "Create"}
                </motion.button>
              </div>
            </form>
          </FormProvider>
        </Modal>
      )}
    </div>
  );
};

export default PagesDashboard;
