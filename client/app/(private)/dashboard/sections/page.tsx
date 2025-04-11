"use client";
import { useGetAllSectionsQuery } from "@/app/store/apis/SectionApi";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Layout, Loader2, AlertCircle, Pencil, Plus } from "lucide-react";
import useToast from "@/app/hooks/ui/useToast";
import renderSectionPreview from "./renderSectionPreview";

export interface SectionData {
  id: number;
  title: string;
  type: string;
  content: any;
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
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Preview:
                    </p>
                    <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 overflow-hidden">
                      {renderSectionPreview(section)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SectionsDashboard;
