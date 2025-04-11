"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useGetAllPagesQuery,
  useUpdatePageMutation,
  useDeletePageMutation,
} from "@/app/store/apis/PageApi";
import useToast from "@/app/hooks/ui/useToast";
import { ArrowLeft, Trash2 } from "lucide-react";
import ConfirmModal from "@/app/components/organisms/ConfirmModal";
import { useForm } from "react-hook-form";
import PageForm, { PageFormData } from "../PageForm";

const PageDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();

  // Fetch page
  const { data, isLoading, refetch } = useGetAllPagesQuery({});
  const page = data?.pages.find((p) => p.id.toString() === id);
  const [updatePage, { isLoading: isUpdating }] = useUpdatePageMutation();
  const [deletePage, { isLoading: isDeleting }] = useDeletePageMutation();

  // Form setup
  const form = useForm<PageFormData>({
    defaultValues: page || {
      slug: "",
      title: "",
      isVisible: true,
      showInNavbar: true,
      isPublished: true,
      metaTitle: "",
      metaDescription: "",
    },
  });

  // Deletion state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Handle update
  const onSubmit = async (data: PageFormData) => {
    try {
      await updatePage({
        pageId: parseInt(id as string),
        updatedPage: data,
      }).unwrap();
      refetch();
      showToast("Page updated successfully", "success");
    } catch (err) {
      console.error("Failed to update page:", err);
      showToast("Failed to update page", "error");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      await deletePage(parseInt(id as string)).unwrap();
      showToast("Page deleted successfully", "success");
      router.push("/dashboard/pages");
    } catch (err) {
      console.error("Failed to delete page:", err);
      showToast("Failed to delete page", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <span className="text-gray-600">Loading page...</span>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="p-6 flex items-center justify-center">
        <span className="text-red-600">Page not found</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard/pages")}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
          >
            <ArrowLeft size={20} />
            Back to Pages
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">{page.title}</h1>
        </div>
        <button
          onClick={() => setIsConfirmModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
          disabled={isDeleting}
        >
          <Trash2 size={16} />
          {isDeleting ? "Deleting..." : "Delete Page"}
        </button>
      </div>

      {/* Page Form */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <PageForm
          form={form}
          onSubmit={onSubmit}
          isLoading={isUpdating}
          submitLabel="Save Changes"
        />
      </div>

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

export default PageDetailPage;
