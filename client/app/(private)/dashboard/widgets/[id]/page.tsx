"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useGetAllWidgetsQuery,
  useUpdateWidgetMutation,
  useDeleteWidgetMutation,
} from "@/app/store/apis/WidgetApi";
import useToast from "@/app/hooks/ui/useToast";
import { ArrowLeft, Trash2, Save, Eye, Sparkles, Loader2 } from "lucide-react";
import ConfirmModal from "@/app/components/organisms/ConfirmModal";
import { useForm } from "react-hook-form";
import Topbar from "@/app/components/layout/Topbar";
import HeroSection from "@/app/components/sections/home/HeroSection";
import WidgetForm, { WidgetFormData } from "../WidgetForm";

const WidgetDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("edit"); // "edit" or "preview"

  // Fetch widget
  const { data, isLoading, refetch } = useGetAllWidgetsQuery({});
  const widget = data?.widgets.find((w) => w.id.toString() === id);
  const [updateWidget, { isLoading: isUpdating }] = useUpdateWidgetMutation();
  const [deleteWidget, { isLoading: isDeleting }] = useDeleteWidgetMutation();

  // Form setup
  const form = useForm<WidgetFormData>({
    defaultValues: widget || {
      name: "",
      type: "PromoSection",
      isVisible: true,
      location: "",
      order: 1,
    },
  });

  // Reset form when widget data loads
  useEffect(() => {
    if (widget) {
      form.reset(widget);
    }
  }, [widget, form]);

  // Deletion state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Handle update
  const onSubmit = async (data: WidgetFormData) => {
    try {
      await updateWidget({ id: parseInt(id as string), ...data }).unwrap();
      refetch();
      showToast("Widget updated successfully", "success");
    } catch (err) {
      console.error("Failed to update widget:", err);
      showToast("Failed to update widget", "error");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      await deleteWidget(parseInt(id as string)).unwrap();
      showToast("Widget deleted successfully", "success");
      router.push("/dashboard/widgets");
    } catch (err) {
      console.error("Failed to delete widget:", err);
      showToast("Failed to delete widget", "error");
    }
  };

  // Preview function
  const renderWidgetPreview = (widget: WidgetFormData & { config: any }) => {
    switch (widget.type) {
      case "PromoSection":
        return <HeroSection data={widget.config} isPreview={true} />;
      case "Topbar":
        return <Topbar config={widget.config} isPreview={true} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
            <Sparkles className="text-gray-400 mb-2" size={48} />
            <p className="text-gray-500 font-medium">
              No preview available for this widget type
            </p>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="animate-spin text-purple-600 mb-2" size={32} />
          <span className="text-gray-600 animate-pulse">Loading widget...</span>
        </div>
      </div>
    );
  }

  if (!widget) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md">
          <h2 className="text-red-600 font-semibold text-lg mb-2">
            Widget Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The widget you&apos;re looking for doesn&apos;t exist or may have
            been deleted.
          </p>
          <button
            onClick={() => router.push("/dashboard/widgets")}
            className="flex items-center justify-center gap-2 mx-auto px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-black transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Widgets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard/widgets")}
            className="flex items-center justify-center gap-1 text-gray-700 hover:text-black transition-colors p-2 rounded-full hover:bg-gray-100"
            aria-label="Back to widgets"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 truncate max-w-xs sm:max-w-md">
            {widget.name}
          </h1>
          {widget.isVisible ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Visible
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Hidden
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setIsConfirmModalOpen(true)}
            className="flex items-center justify-center gap-2 px-3 py-2 border border-red-200 text-red-600 rounded-md hover:bg-red-50 transition-colors"
            disabled={isDeleting}
          >
            <Trash2 size={16} />
            <span className="hidden sm:inline">
              {isDeleting ? "Deleting..." : "Delete"}
            </span>
          </button>
          <button
            type="button"
            onClick={() => form.handleSubmit(onSubmit)()}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("edit")}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === "edit"
                ? "border-purple-500 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Edit Widget
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex items-center gap-1 py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === "preview"
                ? "border-purple-500 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Eye size={16} />
            Preview
          </button>
        </nav>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {activeTab === "edit" ? (
          <div className="p-6">
            <WidgetForm
              form={form}
              onSubmit={onSubmit}
              isLoading={isUpdating}
              submitLabel="Save Changes"
            />
          </div>
        ) : (
          <div className="p-6">
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Preview Mode
              </h3>
              <div className="flex gap-2 items-center">
                <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                <span className="text-sm text-gray-600">
                  This is how your widget will appear on the website
                </span>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white opacity-0 hover:opacity-20 pointer-events-none"></div>
              {renderWidgetPreview(widget)}
            </div>
          </div>
        )}
      </div>

      {/* Widget Meta Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-base font-medium text-gray-900 mb-4">
            Widget Details
          </h3>
          <dl className="grid grid-cols-1 gap-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Type</dt>
              <dd className="mt-1 text-sm text-gray-900">{widget.type}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Location</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {widget.location || "Not specified"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Display Order
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{widget.order}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Widget ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{id}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-base font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => {
                form.setValue("isVisible", !form.watch("isVisible"));
                form.handleSubmit(onSubmit)();
              }}
              className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors"
            >
              <span className="text-sm font-medium text-gray-700">
                {form.watch("isVisible") ? "Hide Widget" : "Show Widget"}
              </span>
              <Eye size={16} className="text-gray-500" />
            </button>
            <button
              onClick={() => {
                // Clone widget logic would go here
                showToast("Widget cloning not implemented yet", "info");
              }}
              className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors"
            >
              <span className="text-sm font-medium text-gray-700">
                Clone Widget
              </span>
              <Sparkles size={16} className="text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        message="Are you sure you want to delete this widget? This action cannot be undone and will permanently remove it from your website."
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmModalOpen(false)}
        title={`Delete "${widget.name}"`}
        type="danger"
      />
    </div>
  );
};

export default WidgetDetailPage;
