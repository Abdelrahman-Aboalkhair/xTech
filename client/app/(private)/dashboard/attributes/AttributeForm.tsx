import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_ATTRIBUTE } from "@/app/gql/Product";
import { Plus } from "lucide-react";
import useToast from "@/app/hooks/ui/useToast";
import Dropdown from "@/app/components/molecules/Dropdown";

interface AttributeFormProps {
  refetchAttributes: () => void;
}

const AttributeForm: React.FC<AttributeFormProps> = ({ refetchAttributes }) => {
  const { showToast } = useToast();
  const [createAttribute, { loading: isCreatingAttribute }] =
    useMutation(CREATE_ATTRIBUTE);

  const [newAttribute, setNewAttribute] = useState({
    name: "",
    type: "select",
  });

  const attributeTypeOptions = [
    { label: "Select", value: "select" },
    { label: "Text", value: "text" },
    { label: "Multi-Select", value: "multiselect" },
  ];

  const handleCreateAttribute = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAttribute({ variables: newAttribute });
      showToast("Attribute created successfully", "success");
      setNewAttribute({ name: "", type: "select" });
      refetchAttributes();
    } catch (err) {
      console.log("error => ", err);
      showToast("Failed to create attribute", "error");
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-xl p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Create New Attribute
      </h2>
      <form onSubmit={handleCreateAttribute} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Attribute Name
          </label>
          <input
            type="text"
            value={newAttribute.name}
            onChange={(e) =>
              setNewAttribute((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="e.g., Color, Size, Material"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Attribute Type
          </label>
          <Dropdown
            options={attributeTypeOptions}
            value={newAttribute.type}
            onChange={(value) =>
              setNewAttribute((prev) => ({ ...prev, type: value || "select" }))
            }
          />
        </div>

        <button
          type="submit"
          disabled={isCreatingAttribute || !newAttribute.name}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={18} />
          {isCreatingAttribute ? "Creating..." : "Create Attribute"}
        </button>
      </form>
    </div>
  );
};

export default AttributeForm;
