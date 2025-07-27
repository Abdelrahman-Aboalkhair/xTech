"use client";
import React, { useState } from "react";
import {
  useCreateSectionMutation,
  useDeleteSectionMutation,
  useGetAllSectionsQuery,
  useUpdateSectionMutation,
} from "@/app/store/apis/SectionApi";
import { Plus, X } from "lucide-react";
import SectionCard from "./SectionCard";
import EditSectionForm from "./EditSectionForm";
import SectionForm from "./SectionForm";

export interface Section {
  id: number;
  type: "HERO" | "PROMOTIONAL" | "BENEFITS" | "NEW_ARRIVALS";
  title?: string;
  description?: string;
  images?: string[];
  icons?: string;
  link?: string;
  ctaText?: string;
  isVisible?: boolean;
  primaryColor?: string;
  secondaryColor?: string;
}

const SectionsDashboard = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    data,
    error,
    isLoading: isLoadingSections,
  } = useGetAllSectionsQuery(undefined);

  const [deleteSection, { error: deleteError }] = useDeleteSectionMutation();
  console.log("deleteError => ", deleteError);
  const [updateSection, { error: updateError }] = useUpdateSectionMutation();
  console.log("update error => ", updateError);
  const [createSection, { isLoading: isCreating, error: createError }] =
    useCreateSectionMutation();
  console.log("createError => ", createError);

  const handleDeleteSection = async (type: string) => {
    try {
      await deleteSection(type).unwrap();
    } catch (error) {
      console.error("Error deleting section:", error);
    }
  };

  const handleEditSection = (section: Section) => {
    setEditingSection(section);
    setIsFormVisible(false);
  };

  const handleUpdateSection = async (type: string, formData: FormData) => {
    setIsUpdating(true);
    try {
      await updateSection({ type, data: formData }).unwrap();
      setEditingSection(null);
    } catch (error) {
      console.error("Error updating section:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateSection = async (formData: FormData) => {
    try {
      await createSection(formData).unwrap();
      setIsFormVisible(false);
    } catch (error) {
      console.error("Error creating section:", error);
    }
  };

  const cancelEdit = () => {
    setEditingSection(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Website Sections
            </h1>
            {!editingSection && (
              <button
                onClick={() => setIsFormVisible(!isFormVisible)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
              >
                {isFormVisible ? (
                  <>
                    <X size={18} />
                    <span>Cancel</span>
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    <span>Add Section</span>
                  </>
                )}
              </button>
            )}
          </div>

          {editingSection && (
            <EditSectionForm
              section={editingSection}
              onUpdate={handleUpdateSection}
              onCancel={cancelEdit}
              isLoading={isUpdating}
            />
          )}

          {isFormVisible && !editingSection && (
            <SectionForm
              onSubmit={handleCreateSection}
              onCancel={() => setIsFormVisible(false)}
              isLoading={isCreating}
            />
          )}
        </div>

        {/* Sections List */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              All Sections
            </h2>
            <span className="text-sm text-gray-500">
              {data?.sections
                ? `${data.sections.length} sections`
                : "0 sections"}
            </span>
          </div>

          {isLoadingSections ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Loading sections...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
              <p>Error loading sections. Please try again.</p>
            </div>
          ) : data?.sections && data.sections.length > 0 ? (
            <div className="grid gap-4">
              {data.sections.map((section) => (
                <SectionCard
                  key={section.id}
                  section={section}
                  onDelete={handleDeleteSection}
                  onEdit={handleEditSection}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <div className="mx-auto w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                <Plus size={24} className="text-indigo-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                No sections yet
              </h3>
              <p className="text-gray-500 mb-6">
                Create your first section to display on your website
              </p>
              <button
                onClick={() => setIsFormVisible(true)}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
              >
                <Plus size={18} />
                <span>Add First Section</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SectionsDashboard;
