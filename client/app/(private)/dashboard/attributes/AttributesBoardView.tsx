"use client";

import React, { useState } from "react";
import { Plus, Tag, Settings, DollarSign } from "lucide-react";
import AttributeCard from "./AttributesCard";
import StatsCard from "@/app/components/organisms/StatsCard";
import {
  useCreateAttributeValueMutation,
  useDeleteAttributeMutation,
} from "@/app/store/apis/AttributeApi";
import useToast from "@/app/hooks/ui/useToast";
import ConfirmModal from "@/app/components/organisms/ConfirmModal";

const AttributesBoardView = ({ attributes = [] }) => {
  const { showToast } = useToast();
  const [createAttributeValue, { isLoading: isCreatingValue }] =
    useCreateAttributeValueMutation();
  const [deleteAttribute, { error: deleteAttributeError }] =
    useDeleteAttributeMutation();
  console.log("deleteAttributeError => ", deleteAttributeError);
  const [newValue, setNewValue] = useState<Record<string, string>>({});
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    attributeId: string | null;
  }>({
    isOpen: false,
    attributeId: null,
  });
  console.log("deleteModal => ", deleteModal);

  // Handle adding a new value
  const handleAddValue = async (attributeId: string) => {
    const value = newValue[attributeId]?.trim();
    if (!value) return;

    try {
      await createAttributeValue({ attributeId, value });
      showToast("Attribute value created successfully", "success");
      setNewValue((prev) => ({ ...prev, [attributeId]: "" }));
    } catch (err) {
      console.error("Error creating attribute value:", err);
      showToast("Failed to create attribute value", "error");
    }
  };

  // Handle confirming attribute deletion
  const handleConfirmDelete = async () => {
    if (!deleteModal.attributeId) return;
    try {
      await deleteAttribute(deleteModal.attributeId);
      showToast("Attribute deleted successfully", "success");
    } catch (err) {
      console.error("Error deleting attribute:", err);
      showToast("Failed to delete attribute", "error");
    } finally {
      setDeleteModal({ isOpen: false, attributeId: null });
    }
  };

  // Calculate unique categories
  const uniqueCategories = new Set(
    attributes.flatMap(
      (attr) => attr.categories?.map((cat) => cat.category?.id) || []
    )
  ).size;

  const totalAttributeValues = attributes.reduce(
    (sum, attr) => sum + (attr.values?.length || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Attributes"
            value={attributes.length || 0}
            percentage={0}
            caption="since last period"
            icon={<DollarSign className="w-5 h-5 text-blue-600" />}
          />
          <StatsCard
            title="Total Attribute Values"
            value={totalAttributeValues || 0}
            percentage={0}
            caption="since last period"
            icon={<Tag className="w-5 h-5 text-green-600" />}
          />
          <StatsCard
            title="Categories"
            value={uniqueCategories || 0}
            percentage={0}
            caption="since last period"
            icon={<Settings className="w-5 h-5 text-purple-600" />}
          />
        </div>

        {/* Attributes Board */}
        {attributes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="max-w-md mx-auto">
              <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No attributes yet
              </h3>
              <p className="text-gray-600 mb-6">
                Get started by creating your first attribute
              </p>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                <Plus size={20} />
                Create Attribute
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attributes.map((attribute) => (
              <AttributeCard
                key={attribute.id}
                attribute={attribute}
                onDelete={() =>
                  setDeleteModal({ isOpen: true, attributeId: attribute.id })
                }
                onAddValue={handleAddValue}
                newValue={newValue[attribute.id] || ""}
                setNewValue={(value) =>
                  setNewValue((prev) => ({ ...prev, [attribute.id]: value }))
                }
                isCreatingValue={isCreatingValue}
              />
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={deleteModal.isOpen}
          message="Are you sure you want to delete this attribute? This action cannot be undone."
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteModal({ isOpen: false, attributeId: null })}
          title="Confirm Delete"
          type="danger"
        />
      </div>
    </div>
  );
};

export default AttributesBoardView;
