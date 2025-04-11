"use client";
import {
  useGetAllBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} from "@/app/store/apis/BannerApi";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ImageIcon,
  Loader2,
  AlertCircle,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import useToast from "@/app/hooks/ui/useToast";
import { useForm } from "react-hook-form";
import BannerForm, { BannerFormData } from "./BannerForm";
import ConfirmModal from "@/app/components/organisms/ConfirmModal";
import Image from "next/image";

const BannersDashboard = () => {
  const { showToast } = useToast();
  const { data, isLoading, error, refetch } = useGetAllBannersQuery({});
  const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();
  const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation();
  const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation();
  const banners = data?.banners || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerFormData | null>(
    null
  );
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<number | null>(null);

  const form = useForm<BannerFormData>({
    defaultValues: {
      title: "",
      type: "FullWidth",
      config: {
        image: "",
        headline: "",
        buttonText: "",
        buttonColor: "#000000",
        backgroundColor: "#FFFFFF",
        link: "",
      },
      isVisible: true,
      order: 1,
      pageId: 0,
    },
  });

  const handleCreateOrUpdate = async (data: BannerFormData) => {
    try {
      if (editingBanner) {
        await updateBanner({ id: editingBanner.id!, ...data }).unwrap();
        showToast("Banner updated successfully", "success");
      } else {
        await createBanner(data).unwrap();
        showToast("Banner created successfully", "success");
      }
      setIsModalOpen(false);
      setEditingBanner(null);
      form.reset();
      refetch();
    } catch (err) {
      console.error("Failed to save banner:", err);
      showToast("Failed to save banner", "error");
    }
  };

  const handleDelete = async () => {
    if (!bannerToDelete) return;
    try {
      await deleteBanner(bannerToDelete).unwrap();
      setIsConfirmModalOpen(false);
      setBannerToDelete(null);
      refetch();
      showToast("Banner deleted successfully", "success");
    } catch (err) {
      console.error("Failed to delete banner:", err);
      showToast("Failed to delete banner", "error");
    }
  };

  const renderBannerPreview = (banner: BannerFormData) => {
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
                form.reset();
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
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingBanner(banner);
                        form.reset(banner);
                        setIsModalOpen(true);
                      }}
                      className="text-orange-600 hover:text-orange-800 transition-colors"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => {
                        setBannerToDelete(banner.id);
                        setIsConfirmModalOpen(true);
                      }}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      disabled={isDeleting}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
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

      {/* Create/Edit Modal */}
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
              className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 border border-gray-100 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingBanner ? "Edit Banner" : "Create Banner"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <BannerForm
                form={form}
                onSubmit={handleCreateOrUpdate}
                isLoading={editingBanner ? isUpdating : isCreating}
                submitLabel={editingBanner ? "Update" : "Create"}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        message="Are you sure you want to delete this banner? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmModalOpen(false)}
        title="Delete Banner"
        type="danger"
      />
    </div>
  );
};

export default BannersDashboard;
