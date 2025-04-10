"use client";
import { useGetAllSectionsQuery } from "@/app/store/apis/SectionApi";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Layout, Loader2, AlertCircle, Pencil, Plus } from "lucide-react";
import Modal from "@/app/components/organisms/Modal";
import useToast from "@/app/hooks/ui/useToast";
import Image from "next/image";

interface SectionData {
  id: number;
  title: string;
  type: string;
  content: any; // Can be array or object depending on type
  order: number;
  isVisible: boolean;
  pageId: number;
  createdAt: string;
  updatedAt: string;
}

const SectionsDashboard = () => {
  const { showToast } = useToast();
  const { data, isLoading, error, refetch } = useGetAllSectionsQuery({});
  const sections = data?.sections || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<SectionData | null>(
    null
  );

  const handleEditSection = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedSection: Partial<SectionData> = {
      id: editingSection?.id,
      title: formData.get("title") as string,
      type: formData.get("type") as string,
      order: Number(formData.get("order")),
      isVisible: formData.get("isVisible") === "true",
      pageId: Number(formData.get("pageId")),
      // Content would need more complex handling depending on type; simplified here
    };

    try {
      // Placeholder for update API call (e.g., useUpdateSectionMutation)
      console.log("Updated section:", updatedSection);
      setIsModalOpen(false);
      setEditingSection(null);
      refetch();
      showToast("Section updated successfully", "success");
    } catch (err) {
      console.error("Failed to update section:", err);
      showToast("Failed to update section", "error");
    }
  };

  const renderSectionPreview = (section: SectionData) => {
    switch (section.type) {
      case "Benefits":
        return (
          <div className="flex flex-wrap gap-4">
            {(section.content as any[]).map((item, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <span className="text-gray-500">{item.icon}</span>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        );
      case "NewArrivals":
        return (
          <div className="grid grid-cols-2 gap-4">
            {(section.content as any[]).map((item, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={40}
                  height={40}
                  className="object-cover rounded-md"
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        );
      case "PromoBanner":
        const banner = section.content as {
          image: string;
          headline: string;
          buttonText: string;
          buttonColor: string;
          backgroundColor: string;
        };
        return (
          <div
            className="p-4 rounded-md"
            style={{ backgroundColor: banner.backgroundColor }}
          >
            <Image
              src={banner.image}
              alt={banner?.imageAlt || "Banner"}
              width={80}
              height={80}
              className="object-cover rounded-md mb-2"
            />
            <p className="text-sm font-medium text-white">{banner.headline}</p>
            <button
              className="mt-2 px-3 py-1 text-xs text-white rounded-md"
              style={{ backgroundColor: banner.buttonColor }}
            >
              {banner.buttonText}
            </button>
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
            <Layout className="h-8 w-8 text-teal-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              Sections Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {sections.length} {sections.length === 1 ? "section" : "sections"}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setEditingSection(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg shadow-md hover:bg-teal-700 transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              New Section
            </motion.button>
          </div>
        </div>

        {/* Sections Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-teal-500 animate-spin" />
            <span className="ml-2 text-gray-600">Loading sections...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12 text-red-600">
            <AlertCircle className="h-8 w-8 mr-2" />
            <span>Error loading sections. Please try again.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map((section) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {section.title}
                  </h3>
                  <button
                    onClick={() => {
                      setEditingSection(section);
                      setIsModalOpen(true);
                    }}
                    className="text-teal-600 hover:text-teal-800 transition-colors"
                  >
                    <Pencil size={18} />
                  </button>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Type:</span> {section.type}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Order:</span> {section.order}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Visible:</span>{" "}
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        section.isVisible
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {section.isVisible ? "Yes" : "No"}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Page ID:</span>{" "}
                    {section.pageId}
                  </p>
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700">
                      Preview:
                    </p>
                    {renderSectionPreview(section)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Edit Section Modal */}
      {isModalOpen && (
        <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              {editingSection ? "Edit Section" : "Create Section"}
            </h2>
            <form onSubmit={handleEditSection} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingSection?.title || ""}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  name="type"
                  defaultValue={editingSection?.type || "Benefits"}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Benefits">Benefits</option>
                  <option value="NewArrivals">New Arrivals</option>
                  <option value="PromoBanner">Promotional Banner</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Order
                </label>
                <input
                  type="number"
                  name="order"
                  defaultValue={editingSection?.order || 1}
                  min={1}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Visible
                </label>
                <select
                  name="isVisible"
                  defaultValue={editingSection?.isVisible ? "true" : "false"}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                  defaultValue={editingSection?.pageId || ""}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              {/* Note: Content editing is simplified here; expand for specific types */}
              <p className="text-sm text-gray-500">
                Content editing is type-specific and requires additional fields.
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
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                >
                  {editingSection ? "Update" : "Create"}
                </motion.button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SectionsDashboard;
