import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import {
  ASSIGN_ATTRIBUTE_TO_CATEGORY,
  ASSIGN_ATTRIBUTE_TO_PRODUCT,
} from "@/app/gql/Product";
import useToast from "@/app/hooks/ui/useToast";
import { TagsIcon, Box } from "lucide-react";
import Dropdown from "@/app/components/molecules/Dropdown";

interface Attribute {
  id: string;
  name: string;
}

interface AttributeAssignmentProps {
  attributes: Attribute[];
  refetchAttributes: () => void;
}

const AttributeAssignment: React.FC<AttributeAssignmentProps> = ({
  attributes,
  refetchAttributes,
}) => {
  const { showToast } = useToast();
  const [assignAttributeToCategory, { loading: isAssigningToCategory }] =
    useMutation(ASSIGN_ATTRIBUTE_TO_CATEGORY);
  const [assignAttributeToProduct, { loading: isAssigningToProduct }] =
    useMutation(ASSIGN_ATTRIBUTE_TO_PRODUCT);

  const [assignData, setAssignData] = useState({
    attributeId: "",
    categoryId: "",
    productId: "",
    isRequired: false,
  });

  // Format attributes for dropdown
  const attributeOptions = attributes.map((attr) => ({
    label: attr.name,
    value: attr.id,
  }));

  // Handle assigning attribute to category
  const handleAssignToCategory = async () => {
    if (!assignData.attributeId || !assignData.categoryId) {
      showToast("Please select an attribute and enter a category ID", "error");
      return;
    }

    try {
      await assignAttributeToCategory({
        variables: {
          attributeId: assignData.attributeId,
          categoryId: assignData.categoryId,
          isRequired: assignData.isRequired,
        },
      });
      showToast("Attribute assigned to category", "success");
      setAssignData((prev) => ({ ...prev, categoryId: "", attributeId: "" }));
      refetchAttributes();
    } catch (err) {
      console.log("err => ", err);
      showToast("Failed to assign attribute to category", "error");
    }
  };

  // Handle assigning attribute to product
  const handleAssignToProduct = async () => {
    if (!assignData.attributeId || !assignData.productId) {
      showToast("Please select an attribute and enter a product ID", "error");
      return;
    }

    try {
      await assignAttributeToProduct({
        variables: {
          attributeId: assignData.attributeId,
          productId: assignData.productId,
        },
      });
      showToast("Attribute assigned to product", "success");
      setAssignData((prev) => ({ ...prev, productId: "", attributeId: "" }));
      refetchAttributes();
    } catch (err) {
      console.log("err => ", err);
      showToast("Failed to assign attribute to product", "error");
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-xl p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Assign Attributes
      </h2>

      <div className="space-y-6">
        {/* Attribute Selection - Common for both category and product */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Attribute
          </label>
          <Dropdown
            options={attributeOptions}
            value={assignData.attributeId}
            onChange={(value) =>
              setAssignData((prev) => ({ ...prev, attributeId: value || "" }))
            }
          />
        </div>

        {/* Category Assignment */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <TagsIcon size={16} className="text-primary" />
            <h3 className="text-md font-medium">Assign to Category</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category ID
              </label>
              <input
                type="text"
                value={assignData.categoryId}
                onChange={(e) =>
                  setAssignData((prev) => ({
                    ...prev,
                    categoryId: e.target.value,
                  }))
                }
                placeholder="Enter category ID"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isRequired"
                checked={assignData.isRequired}
                onChange={(e) =>
                  setAssignData((prev) => ({
                    ...prev,
                    isRequired: e.target.checked,
                  }))
                }
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label
                htmlFor="isRequired"
                className="ml-2 text-sm text-gray-700"
              >
                Required attribute
              </label>
            </div>

            <button
              onClick={handleAssignToCategory}
              disabled={
                isAssigningToCategory ||
                !assignData.attributeId ||
                !assignData.categoryId
              }
              className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAssigningToCategory ? "Assigning..." : "Assign to Category"}
            </button>
          </div>
        </div>

        {/* Product Assignment */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Box size={16} className="text-primary" />
            <h3 className="text-md font-medium">Assign to Product</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product ID
              </label>
              <input
                type="text"
                value={assignData.productId}
                onChange={(e) =>
                  setAssignData((prev) => ({
                    ...prev,
                    productId: e.target.value,
                  }))
                }
                placeholder="Enter product ID"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <button
              onClick={handleAssignToProduct}
              disabled={
                isAssigningToProduct ||
                !assignData.attributeId ||
                !assignData.productId
              }
              className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAssigningToProduct ? "Assigning..." : "Assign to Product"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttributeAssignment;
