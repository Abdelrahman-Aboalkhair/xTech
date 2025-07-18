"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TagsIcon, Box } from "lucide-react";
import useToast from "@/app/hooks/ui/useToast";
import Dropdown from "@/app/components/molecules/Dropdown";
import { useGetAllCategoriesQuery } from "@/app/store/apis/CategoryApi";
import { useGetAllProductsQuery } from "@/app/store/apis/ProductApi";
import {
  useAssignAttributeToCategoryMutation,
  useAssignAttributeToProductMutation,
} from "@/app/store/apis/AttributeApi";

interface Attribute {
  id: string;
  name: string;
}

interface AssignFormData {
  attributeId: string;
  categoryId: string;
  productId: string;
  isRequired: boolean;
}

interface AttributeAssignmentProps {
  attributes: Attribute[];
}

// Separate component for Category Assignment
const CategoryAssignmentSection: React.FC<{
  control: any;
  handleSubmit: any;
  onAssignToCategory: any;
  categoryOptions: any[];
  isAssigningToCategory: boolean;
  watch: any;
}> = ({
  control,
  handleSubmit,
  onAssignToCategory,
  categoryOptions,
  isAssigningToCategory,
  watch,
}) => (
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
    <div className="flex items-center gap-2 mb-4">
      <TagsIcon size={18} className="text-blue-600" />
      <h3 className="text-base font-semibold text-gray-800">
        Assign to Category
      </h3>
    </div>

    <form onSubmit={handleSubmit(onAssignToCategory)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Category
        </label>
        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <Dropdown
              options={categoryOptions}
              value={field.value}
              onChange={field.onChange}
              label="Choose a category"
            />
          )}
        />
      </div>

      <div className="flex items-center gap-2">
        <Controller
          name="isRequired"
          control={control}
          render={({ field }) => (
            <input
              type="checkbox"
              id="isRequired"
              checked={field.value}
              onChange={field.onChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          )}
        />
        <label
          htmlFor="isRequired"
          className="text-sm font-medium text-gray-700"
        >
          Mark as required attribute
        </label>
      </div>

      <button
        type="submit"
        disabled={
          isAssigningToCategory || !watch("attributeId") || !watch("categoryId")
        }
        className="w-full px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
      >
        {isAssigningToCategory ? "Assigning..." : "Assign to Category"}
      </button>
    </form>
  </div>
);

// Separate component for Product Assignment
const ProductAssignmentSection: React.FC<{
  control: any;
  handleSubmit: any;
  onAssignToProduct: any;
  productOptions: any[];
  isAssigningToProduct: boolean;
  watch: any;
}> = ({
  control,
  handleSubmit,
  onAssignToProduct,
  productOptions,
  isAssigningToProduct,
  watch,
}) => (
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
    <div className="flex items-center gap-2 mb-4">
      <Box size={18} className="text-green-600" />
      <h3 className="text-base font-semibold text-gray-800">
        Assign to Product
      </h3>
    </div>

    <form onSubmit={handleSubmit(onAssignToProduct)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Product
        </label>
        <Controller
          name="productId"
          control={control}
          render={({ field }) => (
            <Dropdown
              options={productOptions}
              value={field.value}
              onChange={field.onChange}
              label="Choose a product"
            />
          )}
        />
      </div>

      <button
        type="submit"
        disabled={
          isAssigningToProduct || !watch("attributeId") || !watch("productId")
        }
        className="w-full px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600"
      >
        {isAssigningToProduct ? "Assigning..." : "Assign to Product"}
      </button>
    </form>
  </div>
);

// Main component
const AttributeAssignment: React.FC<AttributeAssignmentProps> = ({
  attributes,
}) => {
  const { showToast } = useToast();
  const { control, handleSubmit, reset, watch, setValue } =
    useForm<AssignFormData>({
      defaultValues: {
        attributeId: "",
        categoryId: "",
        productId: "",
        isRequired: false,
      },
    });

  // API queries
  const { data: categoriesData } = useGetAllCategoriesQuery(undefined);
  const { data: productsData } = useGetAllProductsQuery(undefined);

  // Mutations
  const [assignAttributeToCategory, { isLoading: isAssigningToCategory }] =
    useAssignAttributeToCategoryMutation();
  const [assignAttributeToProduct, { isLoading: isAssigningToProduct }] =
    useAssignAttributeToProductMutation();

  // Dropdown options
  const attributeOptions =
    attributes?.map((attr) => ({
      label: attr.name,
      value: attr.id,
    })) || [];

  const categoryOptions =
    categoriesData?.categories?.map((cat: any) => ({
      label: cat.name,
      value: cat.id,
    })) || [];

  const productOptions =
    productsData?.products?.map((prod: any) => ({
      label: prod.name,
      value: prod.id,
    })) || [];

  // Handle category assignment
  const onAssignToCategory = async (data: AssignFormData) => {
    if (!data.attributeId || !data.categoryId) {
      showToast("Please select an attribute and category", "error");
      return;
    }

    try {
      await assignAttributeToCategory({
        categoryId: data.categoryId,
        attributeId: data.attributeId,
        isRequired: data.isRequired,
      });
      showToast("Attribute assigned to category successfully", "success");
      setValue("categoryId", "");
      setValue("isRequired", false);
    } catch (err) {
      console.error("Error assigning to category:", err);
      showToast("Failed to assign attribute to category", "error");
    }
  };

  // Handle product assignment
  const onAssignToProduct = async (data: AssignFormData) => {
    if (!data.attributeId || !data.productId) {
      showToast("Please select an attribute and product", "error");
      return;
    }

    try {
      await assignAttributeToProduct({
        attributeId: data.attributeId,
        productId: data.productId,
      });
      showToast("Attribute assigned to product successfully", "success");
      setValue("productId", "");
    } catch (err) {
      console.error("Error assigning to product:", err);
      showToast("Failed to assign attribute to product", "error");
    }
  };

  const handleAttributeChange = (value: string) => {
    setValue("attributeId", value);
    setValue("categoryId", "");
    setValue("productId", "");
    setValue("isRequired", false);
  };

  return (
    <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Assign Attributes
        </h2>
        <p className="text-sm text-gray-600">
          Select an attribute and assign it to categories or products
        </p>
      </div>

      <div className="space-y-6">
        {/* Attribute Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Attribute
          </label>
          <Controller
            name="attributeId"
            control={control}
            render={({ field }) => (
              <Dropdown
                options={attributeOptions}
                value={field.value}
                onChange={handleAttributeChange}
                label="Choose an attribute"
              />
            )}
          />
        </div>

        {/* Assignment Sections */}
        {watch("attributeId") && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CategoryAssignmentSection
              control={control}
              handleSubmit={handleSubmit}
              onAssignToCategory={onAssignToCategory}
              categoryOptions={categoryOptions}
              isAssigningToCategory={isAssigningToCategory}
              watch={watch}
            />

            <ProductAssignmentSection
              control={control}
              handleSubmit={handleSubmit}
              onAssignToProduct={onAssignToProduct}
              productOptions={productOptions}
              isAssigningToProduct={isAssigningToProduct}
              watch={watch}
            />
          </div>
        )}

        {!watch("attributeId") && (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <TagsIcon size={32} className="mx-auto" />
            </div>
            <p className="text-sm text-gray-500">
              Select an attribute to begin assignment
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttributeAssignment;
