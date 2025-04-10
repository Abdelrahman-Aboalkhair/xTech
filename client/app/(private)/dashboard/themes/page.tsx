"use client";
import { useGetAllThemesQuery } from "@/app/store/apis/ThemeApi";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Palette, Loader2, AlertCircle, Pencil, Plus } from "lucide-react";
import Modal from "@/app/components/organisms/Modal";
import useToast from "@/app/hooks/ui/useToast";
import { ChromePicker, ColorResult } from "react-color";

interface ThemeData {
  id: number;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const ThemesDashboard = () => {
  const { showToast } = useToast();
  const { data, isLoading, error, refetch } = useGetAllThemesQuery({});
  const themes = data?.themes || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTheme, setEditingTheme] = useState<ThemeData | null>(null);
  const [primaryColor, setPrimaryColor] = useState<string>(
    editingTheme?.primaryColor || "#3B82F6"
  );
  const [secondaryColor, setSecondaryColor] = useState<string>(
    editingTheme?.secondaryColor || "#F59E0B"
  );

  // Update color states when editingTheme changes
  React.useEffect(() => {
    if (editingTheme) {
      setPrimaryColor(editingTheme.primaryColor);
      setSecondaryColor(editingTheme.secondaryColor);
    }
  }, [editingTheme]);

  const handleEditTheme = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedTheme: Partial<ThemeData> = {
      id: editingTheme?.id,
      name: formData.get("name") as string,
      primaryColor,
      secondaryColor,
      fontFamily: formData.get("fontFamily") as string,
      isActive: formData.get("isActive") === "true",
    };

    try {
      // Placeholder for update API call (e.g., useUpdateThemeMutation)
      console.log("Updated theme:", updatedTheme);
      setIsModalOpen(false);
      setEditingTheme(null);
      refetch();
      showToast("Theme updated successfully", "success");
    } catch (err) {
      console.error("Failed to update theme:", err);
      showToast("Failed to update theme", "error");
    }
  };

  const renderThemePreview = (theme: ThemeData) => {
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
                setPrimaryColor("#3B82F6");
                setSecondaryColor("#F59E0B");
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
                  <button
                    onClick={() => {
                      setEditingTheme(theme);
                      setIsModalOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Pencil size={18} />
                  </button>
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

      {/* Edit Theme Modal */}
      {isModalOpen && (
        <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              {editingTheme ? "Edit Theme" : "Create Theme"}
            </h2>
            <form onSubmit={handleEditTheme} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingTheme?.name || ""}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Primary Color
                </label>
                <ChromePicker
                  color={primaryColor}
                  onChange={(color: ColorResult) => setPrimaryColor(color.hex)}
                  className="mt-1"
                />
                <input type="hidden" name="primaryColor" value={primaryColor} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Secondary Color
                </label>
                <ChromePicker
                  color={secondaryColor}
                  onChange={(color: ColorResult) =>
                    setSecondaryColor(color.hex)
                  }
                  className="mt-1"
                />
                <input
                  type="hidden"
                  name="secondaryColor"
                  value={secondaryColor}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Font Family
                </label>
                <select
                  name="fontFamily"
                  defaultValue={editingTheme?.fontFamily || "Poppins"}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Poppins">Poppins</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Inter">Inter</option>
                  <option value="Open Sans">Open Sans</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Active
                </label>
                <select
                  name="isActive"
                  defaultValue={editingTheme?.isActive ? "true" : "false"}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editingTheme ? "Update" : "Create"}
                </motion.button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ThemesDashboard;
