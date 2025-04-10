"use client";
import { useGetAllBannersQuery } from "@/app/store/apis/BannerApi";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ImageIcon, Loader2, AlertCircle, Pencil, Plus } from "lucide-react";
import useToast from "@/app/hooks/ui/useToast";
import Modal from "@/app/components/organisms/Modal";
import Image from "next/image";

interface BannerData {
  id: number;
  title: string;
  type: string;
  config: {
    image: string;
    headline: string;
    buttonText: string;
    buttonColor: string;
    backgroundColor: string;
    link: string;
  };
  isVisible: boolean;
  order: number;
  pageId: number;
  createdAt: string;
  updatedAt: string;
}

const BannersDashboard = () => {
  const { showToast } = useToast();
  const { data, isLoading, error, refetch } = useGetAllBannersQuery({});
  const banners = data?.banners || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerData | null>(null);

  const handleEditBanner = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedBanner: Partial<BannerData> = {
      id: editingBanner?.id,
      title: formData.get("title") as string,
      type: formData.get("type") as string,
      config: {
        image: formData.get("image") as string,
        headline: formData.get("headline") as string,
        buttonText: formData.get("buttonText") as string,
        buttonColor: formData.get("buttonColor") as string,
        backgroundColor: formData.get("backgroundColor") as string,
        link: formData.get("link") as string,
      },
      isVisible: formData.get("isVisible") === "true",
      order: Number(formData.get("order")),
      pageId: Number(formData.get("pageId")),
    };

    try {
      // Placeholder for update API call (e.g., useUpdateBannerMutation)
      console.log("Updated banner:", updatedBanner);
      setIsModalOpen(false);
      setEditingBanner(null);
      refetch();
      showToast("Banner updated successfully", "success");
    } catch (err) {
      console.error("Failed to update banner:", err);
      showToast("Failed to update banner", "error");
    }
  };

  const renderBannerPreview = (banner: BannerData) => {
    const { config } = banner;
    return (
      <div
        className="p-4 rounded-md shadow-sm"
        style={{ backgroundColor: config.backgroundColor }}
      >
        <Image
          src={config.image}
          alt={config.headline}
          width={120}
          height={80}
          className="object-cover rounded-md mb-2"
        />
        <p
          className="text-sm font-medium truncate"
          style={{
            color: config.backgroundColor === "#000000" ? "#FFFFFF" : "#000000",
          }}
        >
          {config.headline}
        </p>
        <button
          className="mt-2 px-3 py-1 text-xs text-white rounded-md"
          style={{ backgroundColor: config.buttonColor }}
        >
          {config.buttonText}
        </button>
      </div>
    );
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
            <ImageIcon className="h-8 w-8 text-orange-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              Banners Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {banners.length} {banners.length === 1 ? "banner" : "banners"}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setEditingBanner(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg shadow-md hover:bg-orange-700 transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              New Banner
            </motion.button>
          </div>
        </div>

        {/* Banners Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
            <span className="ml-2 text-gray-600">Loading banners...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12 text-red-600">
            <AlertCircle className="h-8 w-8 mr-2" />
            <span>Error loading banners. Please try again.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map((banner) => (
              <motion.div
                key={banner.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {banner.title}
                  </h3>
                  <button
                    onClick={() => {
                      setEditingBanner(banner);
                      setIsModalOpen(true);
                    }}
                    className="text-orange-600 hover:text-orange-800 transition-colors"
                  >
                    <Pencil size={18} />
                  </button>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Type:</span> {banner.type}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Order:</span> {banner.order}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Visible:</span>{" "}
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        banner.isVisible
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {banner.isVisible ? "Yes" : "No"}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Page ID:</span>{" "}
                    {banner.pageId}
                  </p>
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700">
                      Preview:
                    </p>
                    {renderBannerPreview(banner)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Edit Banner Modal */}
      {isModalOpen && (
        <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              {editingBanner ? "Edit Banner" : "Create Banner"}
            </h2>
            <form onSubmit={handleEditBanner} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingBanner?.title || ""}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  name="type"
                  defaultValue={editingBanner?.type || "FullWidth"}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="FullWidth">Full Width</option>
                  <option value="Sidebar">Sidebar</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Image URL
                </label>
                <input
                  type="text"
                  name="image"
                  defaultValue={editingBanner?.config.image || ""}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Headline
                </label>
                <input
                  type="text"
                  name="headline"
                  defaultValue={editingBanner?.config.headline || ""}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Button Text
                </label>
                <input
                  type="text"
                  name="buttonText"
                  defaultValue={editingBanner?.config.buttonText || ""}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Button Color
                </label>
                <input
                  type="text"
                  name="buttonColor"
                  defaultValue={editingBanner?.config.buttonColor || "#000000"}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="#HEXCODE"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Background Color
                </label>
                <input
                  type="text"
                  name="backgroundColor"
                  defaultValue={
                    editingBanner?.config.backgroundColor || "#FFFFFF"
                  }
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="#HEXCODE"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Link
                </label>
                <input
                  type="text"
                  name="link"
                  defaultValue={editingBanner?.config.link || ""}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Order
                </label>
                <input
                  type="number"
                  name="order"
                  defaultValue={editingBanner?.order || 1}
                  min={1}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Visible
                </label>
                <select
                  name="isVisible"
                  defaultValue={editingBanner?.isVisible ? "true" : "false"}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Page ID
                </label>
                <input
                  type="number"
                  name="pageId"
                  defaultValue={editingBanner?.pageId || ""}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                >
                  {editingBanner ? "Update" : "Create"}
                </motion.button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BannersDashboard;
