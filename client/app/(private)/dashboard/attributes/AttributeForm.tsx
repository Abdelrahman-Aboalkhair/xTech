"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useCreateAttributeMutation } from "@/app/store/apis/AttributeApi";
import useToast from "@/app/hooks/ui/useToast";

interface AttributeFormState {
  name: string;
}

const AttributeForm: React.FC = () => {
  const { showToast } = useToast();
  const [createAttribute, { isLoading: isCreatingAttribute, error }] =
    useCreateAttributeMutation();
  const [newAttribute, setNewAttribute] = useState<AttributeFormState>({
    name: "",
  });

  const handleCreateAttribute = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAttribute({ name: newAttribute.name }).unwrap();
      showToast("Attribute created successfully", "success");
      setNewAttribute({ name: "" });
    } catch (err) {
      console.error("Failed to create attribute:", err);
      showToast("Failed to create attribute", "error");
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-8 max-w-lg mx-auto mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Create New Attribute
      </h2>
      <form onSubmit={handleCreateAttribute} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Attribute Name
          </label>
          <input
            type="text"
            value={newAttribute.name}
            onChange={(e) => setNewAttribute({ ...prev, name: e.target.value })}
            placeholder="e.g., Color, Size, Material"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isCreatingAttribute || !newAttribute.name}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          <Plus size={20} />
          {isCreatingAttribute ? "Creating..." : "Create Attribute"}
        </button>
      </form>
    </div>
  );
};

export default AttributeForm;
