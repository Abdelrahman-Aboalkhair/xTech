"use client";
import {
  useGetAllThemesQuery,
  useCreateThemeMutation,
  useUpdateThemeMutation,
  useDeleteThemeMutation,
} from "@/app/store/apis/ThemeApi";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette,
  Loader2,
  AlertCircle,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import useToast from "@/app/hooks/ui/useToast";
import { useForm } from "react-hook-form";
import ThemeForm, { ThemeFormData } from "./ThemeForm";
import ConfirmModal from "@/app/components/organisms/ConfirmModal";

const ThemesDashboard = () => {
  const { showToast } = useToast();
  const { data, isLoading, error, refetch } = useGetAllThemesQuery({});
  const [createTheme, { isLoading: isCreating }] = useCreateThemeMutation();
  const [updateTheme, { isLoading: isUpdating }] = useUpdateThemeMutation();
  const [deleteTheme, { isLoading: isDeleting }] = useDeleteThemeMutation();
  const themes = data?.themes || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTheme, setEditingTheme] = useState<ThemeFormData | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [themeToDelete, setThemeToDelete] = useState<number | null>(null);

  const form = useForm<ThemeFormData>({
    defaultValues: {
      name: "",
      primaryColor: "#3B82F6",
      secondaryColor: "#F59E0B",
      fontFamily: "Poppins",
      isActive: false,
    },
  });

  const handleCreateOrUpdate = async (data: ThemeFormData) => {
    try {
      if (editingTheme) {
        await updateTheme({ id: editingTheme.id!, ...data }).unwrap();
        showToast("Theme updated successfully", "success");
      } else {
        await createTheme(data).unwrap();
        showToast("Theme created successfully", "success");
      }
      setIsModalOpen(false);
      setEditingTheme(null);
      form.reset();
      refetch();
    } catch (err) {
      console.error("Failed to save theme:", err);
      showToast("Failed to save theme", "error");
    }
  };

  const handleDelete = async () => {
    if (!themeToDelete) return;
    try {
      await deleteTheme(themeToDelete).unwrap();
      setIsConfirmModalOpen(false);
      setThemeToDelete(null);
      refetch();
      showToast("Theme deleted successfully", "success");
    } catch (err) {
      console.error("Failed to delete theme:", err);
      showToast("Failed to delete theme", "error");
    }
  };

  const renderThemePreview = (theme: ThemeFormData) => {
    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-4">
          <div
            className="w-10 h-10 rounded-full border border-gray-200"
            style={{ backgroundColor: theme.primaryColor }}
          />
          <p className="text-sm text-gray-600">
            Primary: <span className="font-mono">{theme.primaryColor}</span>
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div
            className="w-10 h-10 rounded-full border border-gray-200"
            style={{ backgroundColor: theme.secondaryColor }}
          />
          <p className="text-sm text-gray-600">
            Secondary: <span className="font-mono">{theme.secondaryColor}</span>
          </p>
        </div>
        <p className="text-sm text-gray-600">
          Font:{" "}
          <span style={{ fontFamily: theme.fontFamily }}>
            {theme.fontFamily}
          </span>
        </p>
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
            <Palette className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              Themes Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {themes.length} {themes.length === 1 ? "theme" : "themes"}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setEditingTheme(null);
                form.reset();
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              New Theme
            </motion.button>
          </div>
        </div>

        {/* Themes Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            <span className="ml-2 text-gray-600">Loading themes...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12 text-red-600">
            <AlertCircle className="h-8 w-8 mr-2" />
            <span>Error loading themes. Please try again.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {themes.map((theme) => (
              <motion.div
                key={theme.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {theme.name}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingTheme(theme);
                        form.reset(theme);
                        setIsModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => {
                        setThemeToDelete(theme.id);
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
                    <span className="font-medium">Active:</span>{" "}
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        theme.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {theme.isActive ? "Yes" : "No"}
                    </span>
                  </p>
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700">
                      Preview:
                    </p>
                    {renderThemePreview(theme)}
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
                  {editingTheme ? "Edit Theme" : "Create Theme"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <ThemeForm
                form={form}
                onSubmit={handleCreateOrUpdate}
                isLoading={editingTheme ? isUpdating : isCreating}
                submitLabel={editingTheme ? "Update" : "Create"}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        message="Are you sure you want to delete this theme? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmModalOpen(false)}
        title="Delete Theme"
        type="danger"
      />
    </div>
  );
};

export default ThemesDashboard;
