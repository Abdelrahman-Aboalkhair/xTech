import React, { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import useToast from "@/app/hooks/ui/useToast";
import AttributeValueItem from "./AttributeValueItem";
import { useCreateAttributeValueMutation, useDeleteAttributeMutation } from "@/app/store/apis/AttributeApi";

interface AttributeValue {
  id: string;
  value: string;
}

interface Attribute {
  id: string;
  name: string;
  type: string;
  slug: string;
  values?: AttributeValue[];
}

interface AttributesListProps {
  attributes: Attribute[];
}

const AttributesList: React.FC<AttributesListProps> = ({
  attributes,
}) => {
  const { showToast } = useToast();

  const [createAttributeValue, { isLoading: isCreatingValue }] = useCreateAttributeValueMutation()
  const [deleteAttribute, { isLoading: isDeleting }] = useDeleteAttributeMutation()

  const [newValue, setNewValue] = useState<{ [key: string]: string }>({});
  const [expandedAttribute, setExpandedAttribute] = useState<string | null>(
    null
  );

  // Handle creating a new attribute value
  const handleCreateValue = async (attributeId: string) => {
    const value = newValue[attributeId];
    if (!value) return;

    try {
      await createAttributeValue({
        attributeId,
        value,
      });
      showToast("Attribute value created successfully", "success");
      setNewValue((prev) => ({ ...prev, [attributeId]: "" }));

    } catch (err) {
      console.log("err => ", err);

      showToast("Failed to create attribute value", "error");
    }
  };

  // Handle deleting an attribute
  const handleDeleteAttribute = async (id: string) => {
    if (confirm("Are you sure you want to delete this attribute?")) {
      try {
        await deleteAttribute({ variables: { id } });
        showToast("Attribute deleted successfully", "success");

      } catch (err) {
        console.log("err => ", err);
        showToast("Failed to delete attribute", "error");
      }
    }
  };

  const toggleExpand = (id: string) => {
    if (expandedAttribute === id) {
      setExpandedAttribute(null);
    } else {
      setExpandedAttribute(id);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-xl p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Existing Attributes
      </h2>

      {attributes.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No attributes found.</p>
          <p className="text-sm text-gray-400 mt-1">
            Create your first attribute using the form on the left.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {attributes.map((attr) => (
            <div
              key={attr.id}
              className="border border-gray-100 rounded-lg overflow-hidden"
            >
              {/* Attribute Header */}
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleExpand(attr.id)}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-md font-medium">{attr.name}</h3>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full">
                      {attr.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">Slug: {attr.slug}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAttribute(attr.id);
                    }}
                    disabled={isDeleting}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedAttribute === attr.id && (
                <div className="p-4 bg-gray-50 border-t border-gray-100">
                  {/* Attribute Values */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Values
                    </h4>
                    {attr.values && attr.values.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {attr.values.map((value) => (
                          <AttributeValueItem
                            key={value.id}
                            value={value}
                            attributeId={attr.id}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No values added yet.
                      </p>
                    )}
                  </div>

                  {/* Add New Value Form */}
                  {attr.type !== "text" && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Add New Value
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newValue[attr.id] || ""}
                          onChange={(e) =>
                            setNewValue((prev) => ({
                              ...prev,
                              [attr.id]: e.target.value,
                            }))
                          }
                          placeholder="e.g., Red, Large, Cotton"
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCreateValue(attr.id);
                          }}
                          disabled={isCreatingValue || !newValue[attr.id]}
                          className="flex items-center gap-1 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus size={16} />
                          Add
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttributesList;
