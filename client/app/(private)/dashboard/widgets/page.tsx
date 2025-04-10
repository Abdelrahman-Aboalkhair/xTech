"use client";
import { useGetAllWidgetsQuery } from "@/app/store/apis/WidgetApi";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sliders, Loader2, AlertCircle, Pencil, Plus } from "lucide-react";
import Modal from "@/app/components/organisms/Modal";
import useToast from "@/app/hooks/ui/useToast";
import Image from "next/image";

interface WidgetData {
  id: number;
  name: string;
  type: string;
  config: any; // Varies by type (PromoSection or Topbar)
  isVisible: boolean;
  location: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

const WidgetsDashboard = () => {
  const { showToast } = useToast();
  const { data, isLoading, error, refetch } = useGetAllWidgetsQuery({});
  const widgets = data?.widgets || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWidget, setEditingWidget] = useState<WidgetData | null>(null);

  const handleEditWidget = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedWidget: Partial<WidgetData> = {
      id: editingWidget?.id,
      name: formData.get("name") as string,
      type: formData.get("type") as string,
      isVisible: formData.get("isVisible") === "true",
      location: formData.get("location") as string,
      order: Number(formData.get("order")),
      // Config editing simplified; expand for type-specific fields
    };

    try {
      // Placeholder for update API call (e.g., useUpdateWidgetMutation)
      console.log("Updated widget:", updatedWidget);
      setIsModalOpen(false);
      setEditingWidget(null);
      refetch();
      showToast("Widget updated successfully", "success");
    } catch (err) {
      console.error("Failed to update widget:", err);
      showToast("Failed to update widget", "error");
    }
  };

  const renderWidgetPreview = (widget: WidgetData) => {
    switch (widget.type) {
      case "PromoSection":
        const promoConfig = widget.config as {
          link: string;
          promoText: string;
          productIcon: string;
          productName: string;
          sliderImages: string[];
          backgroundColor: string;
        };
        return (
          <div
            className="p-4 rounded-md"
            style={{ backgroundColor: promoConfig.backgroundColor }}
          >
            <div className="flex items-center space-x-3 mb-2">
              <Image
                src={promoConfig.productIcon}
                alt={promoConfig.productName}
                width={40}
                height={40}
                className="object-cover rounded-full"
              />
              <div>
                <p className="text-sm font-medium text-white">
                  {promoConfig.productName}
                </p>
                <p className="text-xs text-gray-200">{promoConfig.promoText}</p>
              </div>
            </div>
            <div className="flex space-x-2 overflow-x-auto">
              {promoConfig.sliderImages.slice(0, 3).map((img, idx) => (
                <Image
                  key={idx}
                  src={img}
                  alt={`Slide ${idx + 1}`}
                  width={60}
                  height={60}
                  className="object-cover rounded-md"
                />
              ))}
            </div>
          </div>
        );
      case "Topbar":
        const topbarConfig = widget.config as {
          shopLink: string;
          shopText: string;
          dispatchText: string;
          giftCardText: string;
          shippingText: string;
        };
        return (
          <div className="bg-gray-800 p-2 rounded-md text-white text-xs">
            <div className="flex justify-between items-center">
              <span>{topbarConfig.shopText}</span>
              <span>{topbarConfig.dispatchText}</span>
              <span>{topbarConfig.giftCardText}</span>
              <span>{topbarConfig.shippingText}</span>
            </div>
          </div>
        );
      default:
        return <p className="text-sm text-gray-600">No preview available</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Sliders className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              Widgets Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {widgets.length} {widgets.length === 1 ? "widget" : "widgets"}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setEditingWidget(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              New Widget
            </motion.button>
          </div>
        </div>

        {/* Widgets Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
            <span className="ml-2 text-gray-600">Loading widgets...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12 text-red-600">
            <AlertCircle className="h-8 w-8 mr-2" />
            <span>Error loading widgets. Please try again.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {widgets.map((widget) => (
              <motion.div
                key={widget.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {widget.name}
                  </h3>
                  <button
                    onClick={() => {
                      setEditingWidget(widget);
                      setIsModalOpen(true);
                    }}
                    className="text-purple-600 hover:text-purple-800 transition-colors"
                  >
                    <Pencil size={18} />
                  </button>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Type:</span> {widget.type}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Location:</span>{" "}
                    {widget.location}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Order:</span> {widget.order}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Visible:</span>{" "}
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        widget.isVisible
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {widget.isVisible ? "Yes" : "No"}
                    </span>
                  </p>
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700">
                      Preview:
                    </p>
                    {renderWidgetPreview(widget)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Edit Widget Modal */}
      {isModalOpen && (
        <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              {editingWidget ? "Edit Widget" : "Create Widget"}
            </h2>
            <form onSubmit={handleEditWidget} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingWidget?.name || ""}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  name="type"
                  defaultValue={editingWidget?.type || "PromoSection"}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="PromoSection">Promo Section</option>
                  <option value="Topbar">Topbar</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  defaultValue={editingWidget?.location || ""}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Order
                </label>
                <input
                  type="number"
                  name="order"
                  defaultValue={editingWidget?.order || 1}
                  min={1}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Visible
                </label>
                <select
                  name="isVisible"
                  defaultValue={editingWidget?.isVisible ? "true" : "false"}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              {/* Config editing simplified; expand for type-specific fields */}
              <p className="text-sm text-gray-500">
                Config editing is type-specific and requires additional fields.
              </p>
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
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  {editingWidget ? "Update" : "Create"}
                </motion.button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default WidgetsDashboard;
