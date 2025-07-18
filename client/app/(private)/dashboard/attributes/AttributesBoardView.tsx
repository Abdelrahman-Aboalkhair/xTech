"use client";

import React, { useState } from "react";
import { Plus, Tag, Users, Settings, DollarSign } from "lucide-react";
import AttributeCard from "./AttributesCard";
import StatsCard from "@/app/components/organisms/StatsCard";

const AttributesBoardView = ({ attributes = [] }) => {
  const [newValue, setNewValue] = useState({});
  const [isCreatingValue, setIsCreatingValue] = useState(false);

  const handleDeleteAttribute = (id) => {
    if (confirm("Are you sure you want to delete this attribute?")) {
      console.log("Deleting attribute:", id);
      // Implementation for delete
    }
  };

  const handleAddValue = async (attributeId) => {
    const value = newValue[attributeId]?.trim();
    if (!value) return;

    setIsCreatingValue(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log("Adding value:", value, "to attribute:", attributeId);
    setNewValue((prev) => ({ ...prev, [attributeId]: "" }));
    setIsCreatingValue(false);
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
      <div className="min-w-h-full mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Attributes"
            value={attributes.length || 0}
            percentage={0}
            caption="since last period"
            icon={<DollarSign className="w-5 h-5" />}
          />
          <StatsCard
            title="Total Attribute Values"
            value={totalAttributeValues || 0}
            percentage={0}
            caption="since last period"
            icon={<Tag className="w-5 h-5" />}
          />
          <StatsCard
            title="Categories"
            value={uniqueCategories || 0}
            percentage={0}
            caption="since last period"
            icon={<Settings className="w-5 h-5" />}
          />
        </div>

        {/* Attributes Board */}
        {attributes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="max-w-md mx-auto">
              <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No attributes yet
              </h3>
              <p className="text-gray-600 mb-6">
                Get started by creating your first attribute
              </p>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
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
                onDelete={handleDeleteAttribute}
                onAddValue={handleAddValue}
                newValue={newValue}
                setNewValue={setNewValue}
                isCreatingValue={isCreatingValue}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttributesBoardView;
