"use client";
import {
  useGetAllWidgetsQuery,
  useCreateWidgetMutation,
  useUpdateWidgetMutation,
  useDeleteWidgetMutation,
} from "@/app/store/apis/WidgetApi";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sliders,
  Loader2,
  AlertCircle,
  Pencil,
  Plus,
  Trash2,
  X,
  Eye,
  EyeOff,
  Search,
  ArrowRight,
  Sparkles,
  RefreshCw,
  LayoutGrid,
  List,
} from "lucide-react";
import useToast from "@/app/hooks/ui/useToast";
import Topbar from "@/app/components/layout/Topbar";
import HeroSection from "@/app/components/sections/home/HeroSection";
import { useForm } from "react-hook-form";
import WidgetForm, { WidgetFormData } from "./WidgetForm";
import ConfirmModal from "@/app/components/organisms/ConfirmModal";
import { useRouter } from "next/navigation";

const WidgetsDashboard = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const { data, isLoading, error, refetch } = useGetAllWidgetsQuery({});
  const [createWidget, { isLoading: isCreating }] = useCreateWidgetMutation();
  const [updateWidget, { isLoading: isUpdating }] = useUpdateWidgetMutation();
  const [deleteWidget, { isLoading: isDeleting }] = useDeleteWidgetMutation();
  const [widgets, setWidgets] = useState([]);

  // UI States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWidget, setEditingWidget] = useState<WidgetFormData | null>(
    null
  );
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [widgetToDelete, setWidgetToDelete] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // "all", "visible", "hidden"
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Form setup
  const form = useForm<WidgetFormData>({
    defaultValues: {
      name: "",
      type: "PromoSection",
      isVisible: true,
      location: "",
      order: 1,
    },
  });

  // Process and filter widgets when data changes
  useEffect(() => {
    if (data?.widgets) {
      let filteredWidgets = [...data.widgets];

      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredWidgets = filteredWidgets.filter(
          (widget) =>
            widget.name.toLowerCase().includes(query) ||
            widget.type.toLowerCase().includes(query) ||
            widget.location?.toLowerCase().includes(query)
        );
      }

      // Apply visibility filter
      if (activeFilter === "visible") {
        filteredWidgets = filteredWidgets.filter((widget) => widget.isVisible);
      } else if (activeFilter === "hidden") {
        filteredWidgets = filteredWidgets.filter((widget) => !widget.isVisible);
      }

      setWidgets(filteredWidgets);
    }
  }, [data, searchQuery, activeFilter]);

  // Handle refresh animation
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 700); // Keep spinner visible briefly
  };

  const handleCreateOrUpdate = async (data: WidgetFormData) => {
    try {
      if (editingWidget) {
        await updateWidget({ id: editingWidget.id!, ...data }).unwrap();
        showToast("Widget updated successfully", "success");
      } else {
        await createWidget(data).unwrap();
        showToast("Widget created successfully", "success");
      }
      setIsModalOpen(false);
      setEditingWidget(null);
      form.reset();
      refetch();
    } catch (err) {
      console.error("Failed to save widget:", err);
      showToast("Failed to save widget", "error");
    }
  };

  const handleDelete = async () => {
    if (!widgetToDelete) return;
    try {
      await deleteWidget(widgetToDelete).unwrap();
      setIsConfirmModalOpen(false);
      setWidgetToDelete(null);
      refetch();
      showToast("Widget deleted successfully", "success");
    } catch (err) {
      console.error("Failed to delete widget:", err);
      showToast("Failed to delete widget", "error");
    }
  };

  const handleToggleVisibility = async (widget) => {
    try {
      await updateWidget({
        id: widget.id,
        ...widget,
        isVisible: !widget.isVisible,
      }).unwrap();
      refetch();
      showToast(
        `Widget ${!widget.isVisible ? "shown" : "hidden"} successfully`,
        "success"
      );
    } catch (err) {
      console.error("Failed to update widget visibility:", err);
      showToast("Failed to update widget", "error");
    }
  };

  const renderWidgetPreview = (widget: WidgetFormData & { config: any }) => {
    switch (widget.type) {
      case "PromoSection":
        return <HeroSection config={widget.config} isPreview={true} />;
      case "Topbar":
        return <Topbar config={widget.config} isPreview={true} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center py-6 bg-gray-50 rounded-lg">
            <Sparkles className="text-gray-400 mb-2" size={24} />
            <p className="text-sm text-gray-500">No preview available</p>
          </div>
        );
    }
  };

  const renderEmptyState = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-16 px-6 bg-white rounded-xl shadow-sm border border-gray-100"
    >
      <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4">
        <Sliders className="h-8 w-8 text-purple-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        No widgets found
      </h3>
      <p className="text-gray-500 text-center max-w-md mb-6">
        {searchQuery || activeFilter !== "all"
          ? "Try adjusting your search or filters to find what you're looking for."
          : "Get started by creating your first widget to enhance your website."}
      </p>
      {searchQuery || activeFilter !== "all" ? (
        <button
          onClick={() => {
            setSearchQuery("");
            setActiveFilter("all");
          }}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Clear filters
        </button>
      ) : (
        <button
          onClick={() => {
            setEditingWidget(null);
            form.reset();
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Create your first widget
        </button>
      )}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-6 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Sliders className="h-6 w-6 text-purple-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              Widgets Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Refresh widgets"
            >
              <RefreshCw
                className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setEditingWidget(null);
                form.reset();
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow-sm hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">New Widget</span>
              <span className="sm:hidden">New</span>
            </motion.button>
          </div>
        </div>

        {/* Filters & Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search widgets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="flex gap-2">
            <div className="border border-gray-200 rounded-lg p-1 flex">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded ${
                  viewMode === "grid"
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded ${
                  viewMode === "list"
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
                aria-label="List view"
              >
                <List size={16} />
              </button>
            </div>
            <div className="relative inline-block">
              <div className="border border-gray-200 rounded-lg flex">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-l-lg ${
                    activeFilter === "all"
                      ? "bg-purple-100 text-purple-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveFilter("visible")}
                  className={`px-3 py-1.5 text-sm font-medium ${
                    activeFilter === "visible"
                      ? "bg-purple-100 text-purple-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Visible
                </button>
                <button
                  onClick={() => setActiveFilter("hidden")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-r-lg ${
                    activeFilter === "hidden"
                      ? "bg-purple-100 text-purple-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Hidden
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Status Info */}
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {isLoading ? (
              <span className="flex items-center">
                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                Loading widgets...
              </span>
            ) : widgets.length > 0 ? (
              <span>
                Showing <span className="font-medium">{widgets.length}</span>{" "}
                {widgets.length === 1 ? "widget" : "widgets"}
                {(searchQuery || activeFilter !== "all") && " (filtered)"}
              </span>
            ) : null}
          </div>
        </div>

        {/* Widgets Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <div className="flex flex-col items-center">
              <Loader2 className="h-10 w-10 text-purple-500 animate-spin mb-3" />
              <span className="text-gray-500">Loading widgets...</span>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 bg-red-50 rounded-xl border border-red-100">
            <AlertCircle className="h-10 w-10 text-red-500 mb-3" />
            <h3 className="text-lg font-semibold text-red-700 mb-1">
              Something went wrong
            </h3>
            <p className="text-red-600 mb-4 text-center max-w-md">
              There was an error loading your widgets. Please try again later.
            </p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Try again
            </button>
          </div>
        ) : widgets.length === 0 ? (
          renderEmptyState()
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {widgets.map((widget) => (
                <motion.div
                  key={widget.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3
                        className="text-lg font-semibold text-gray-800 truncate"
                        title={widget.name}
                      >
                        {widget.name}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleToggleVisibility(widget)}
                          className={`p-1.5 rounded-full hover:bg-gray-100 transition-colors ${
                            widget.isVisible
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                          title={
                            widget.isVisible ? "Hide widget" : "Show widget"
                          }
                        >
                          {widget.isVisible ? (
                            <Eye size={16} />
                          ) : (
                            <EyeOff size={16} />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setEditingWidget(widget);
                            form.reset(widget);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-full text-purple-600 hover:bg-purple-50 transition-colors"
                          title="Edit widget"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setWidgetToDelete(widget.id);
                            setIsConfirmModalOpen(true);
                          }}
                          className="p-1.5 rounded-full text-red-600 hover:bg-red-50 transition-colors"
                          disabled={isDeleting}
                          title="Delete widget"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                          Type
                        </span>
                        <span className="text-sm text-gray-800 bg-gray-100 px-2 py-0.5 rounded">
                          {widget.type}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                            Location
                          </span>
                          <span className="text-sm text-gray-800">
                            {widget.location || "—"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                            Order
                          </span>
                          <span className="text-sm text-gray-800">
                            {widget.order}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                          Status
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            widget.isVisible
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {widget.isVisible ? "Visible" : "Hidden"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-100">
                    <div className="p-3 bg-gray-50">
                      <div className="overflow-hidden rounded-md h-32">
                        {renderWidgetPreview(widget)}
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-100">
                    <button
                      onClick={() =>
                        router.push(`/dashboard/widgets/${widget.id}`)
                      }
                      className="w-full py-2.5 px-4 flex items-center justify-center gap-1 text-sm font-medium text-purple-600 hover:bg-purple-50 transition-colors"
                    >
                      View Details
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="grid grid-cols-12 px-4 py-3 bg-gray-50 border-b border-gray-100 text-xs font-medium uppercase tracking-wider text-gray-500">
              <div className="col-span-4 sm:col-span-3">Name</div>
              <div className="col-span-3 sm:col-span-2">Type</div>
              <div className="hidden sm:block sm:col-span-2">Location</div>
              <div className="hidden sm:block sm:col-span-1">Order</div>
              <div className="col-span-3 sm:col-span-2">Status</div>
              <div className="col-span-2 sm:col-span-2 text-right">Actions</div>
            </div>
            <div className="divide-y divide-gray-100">
              <AnimatePresence>
                {widgets.map((widget) => (
                  <motion.div
                    key={widget.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-12 px-4 py-3 items-center hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className="col-span-4 sm:col-span-3 font-medium text-gray-900 truncate"
                      title={widget.name}
                    >
                      {widget.name}
                    </div>
                    <div className="col-span-3 sm:col-span-2 text-sm text-gray-600">
                      {widget.type}
                    </div>
                    <div className="hidden sm:block sm:col-span-2 text-sm text-gray-600">
                      {widget.location || "—"}
                    </div>
                    <div className="hidden sm:block sm:col-span-1 text-sm text-gray-600">
                      {widget.order}
                    </div>
                    <div className="col-span-3 sm:col-span-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          widget.isVisible
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {widget.isVisible ? "Visible" : "Hidden"}
                      </span>
                    </div>
                    <div className="col-span-2 sm:col-span-2 flex items-center justify-end space-x-1">
                      <button
                        onClick={() => handleToggleVisibility(widget)}
                        className={`p-1.5 rounded-full hover:bg-gray-100 transition-colors ${
                          widget.isVisible ? "text-green-600" : "text-gray-400"
                        }`}
                        title={widget.isVisible ? "Hide widget" : "Show widget"}
                      >
                        {widget.isVisible ? (
                          <Eye size={16} />
                        ) : (
                          <EyeOff size={16} />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setEditingWidget(widget);
                          form.reset(widget);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 rounded-full text-purple-600 hover:bg-purple-50 transition-colors"
                        title="Edit widget"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() =>
                          router.push(`/dashboard/widgets/${widget.id}`)
                        }
                        className="p-1.5 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                        title="View details"
                      >
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 border border-gray-100 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingWidget ? "Edit Widget" : "Create New Widget"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <WidgetForm
                form={form}
                onSubmit={handleCreateOrUpdate}
                isLoading={editingWidget ? isUpdating : isCreating}
                submitLabel={editingWidget ? "Update Widget" : "Create Widget"}
              />
              {editingWidget && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => {
                      setWidgetToDelete(editingWidget.id);
                      setIsConfirmModalOpen(true);
                      setIsModalOpen(false);
                    }}
                    className="flex items-center text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    <Trash2 size={14} className="mr-1" />
                    Delete this widget
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      router.push(`/dashboard/widgets/${editingWidget.id}`)
                    }
                    className="flex items-center text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    View full details
                    <ArrowRight size={14} className="ml-1" />
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        message="Are you sure you want to delete this widget? This action cannot be undone and will permanently remove it from your website."
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmModalOpen(false)}
        title="Delete Widget"
        type="danger"
      />
    </div>
  );
};

export default WidgetsDashboard;
