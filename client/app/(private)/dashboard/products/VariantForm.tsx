"use client";
import { Controller, useFieldArray, UseFormReturn } from "react-hook-form";
import { Trash2, Plus } from "lucide-react";
import Dropdown from "@/app/components/molecules/Dropdown";
import { ProductFormData } from "./product.types";

interface VariantFormProps {
  form: UseFormReturn<ProductFormData>;
  categoryAttributes: { id: string; name: string; isRequired: boolean; values: { id: string; value: string; slug: string }[] }[];
}

const VariantForm: React.FC<VariantFormProps> = ({ form, categoryAttributes }) => {
  const { control, formState: { errors } } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });
  console.log('categoryAttributes:', categoryAttributes);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">Variants</label>
        <button
          type="button"
          onClick={() =>
            append({
              sku: "",
              price: 0,
              stock: 0,
              lowStockThreshold: 10,
              barcode: "",
              warehouseLocation: "",
              attributes: categoryAttributes
                .filter((attr) => attr.isRequired)
                .map((attr) => ({ attributeId: attr.id, valueId: "" })),
            })
          }
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <Plus size={16} className="mr-1" />
          Add Variant
        </button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="border p-4 rounded-lg bg-gray-50 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Variant {index + 1}</h3>
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <Controller
                name={`variants.${index}.sku`}
                control={control}
                rules={{ required: "SKU is required", pattern: { value: /^[a-zA-Z0-9-]+$/, message: "SKU must be alphanumeric with dashes" } }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="px-4 py-3 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="TSH-RED-S"
                  />
                )}
              />
              {errors.variants?.[index]?.sku && (
                <p className="text-red-500 text-xs mt-1">{errors.variants[index].sku?.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <Controller
                name={`variants.${index}.price`}
                control={control}
                rules={{ required: "Price is required", min: { value: 0.01, message: "Price must be positive" } }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    step="0.01"
                    className="px-4 py-3 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="19.99"
                  />
                )}
              />
              {errors.variants?.[index]?.price && (
                <p className="text-red-500 text-xs mt-1">{errors.variants[index].price?.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <Controller
                name={`variants.${index}.stock`}
                control={control}
                rules={{ required: "Stock is required", min: { value: 0, message: "Stock cannot be negative" } }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    className="px-4 py-3 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="50"
                  />
                )}
              />
              {errors.variants?.[index]?.stock && (
                <p className="text-red-500 text-xs mt-1">{errors.variants[index].stock?.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Threshold</label>
              <Controller
                name={`variants.${index}.lowStockThreshold`}
                control={control}
                rules={{ min: { value: 0, message: "Low stock threshold cannot be negative" } }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    className="px-4 py-3 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="10"
                  />
                )}
              />
              {errors.variants?.[index]?.lowStockThreshold && (
                <p className="text-red-500 text-xs mt-1">{errors.variants[index].lowStockThreshold?.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Barcode</label>
              <Controller
                name={`variants.${index}.barcode`}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="px-4 py-3 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="123456789012"
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse Location</label>
              <Controller
                name={`variants.${index}.warehouseLocation`}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="px-4 py-3 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="WH-A1"
                  />
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Attributes</label>
            {categoryAttributes.map((attr) => (
              <div key={attr.id}>
                <label className="block text-sm font-medium text-gray-600 mb-1">{attr.name} {attr.isRequired && <span className="text-red-500">*</span>}</label>
                <Controller
                  name={`variants.${index}.attributes[${categoryAttributes.indexOf(attr)}].valueId`}
                  control={control}
                  rules={attr.isRequired ? { required: `${attr.name} is required` } : undefined}
                  render={({ field }) => (
                    <Dropdown
                      options={attr.values.map((v) => ({ label: v.value, value: v.id }))}
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        form.setValue(`variants.${index}.attributes[${categoryAttributes.indexOf(attr)}].attributeId`, attr.id);
                      }}
                      label={`Select ${attr.name}`}
                      className="py-[14px]"
                    />
                  )}
                />
                {errors.variants?.[index]?.attributes?.[categoryAttributes.indexOf(attr)]?.valueId && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.variants[index].attributes?.[categoryAttributes.indexOf(attr)]?.valueId?.message}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      {errors.variants && !Array.isArray(errors.variants) && (
        <p className="text-red-500 text-xs mt-1">At least one variant is required</p>
      )}
    </div>
  );
};

export default VariantForm;