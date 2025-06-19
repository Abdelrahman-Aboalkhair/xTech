import { Controller, UseFormReturn } from "react-hook-form";
import { DollarSign, Package, Tag, Hash } from "lucide-react";
import Dropdown from "@/app/components/molecules/Dropdown";
import ImageUploader from "@/app/components/molecules/ImageUploader";
import { ProductFormData } from "./page";
import CheckBox from "@/app/components/atoms/CheckBox";

interface ProductFormProps {
  form: UseFormReturn<ProductFormData>;
  onSubmit: (data: ProductFormData) => void;
  categories?: { label: string; value: string }[];
  categoryAttributes?: any[];
  isLoading?: boolean;
  error?: any;
  submitLabel?: string;
  existingImages?: string[];
}

const ProductForm: React.FC<ProductFormProps> = ({
  form,
  onSubmit,
  categories = [],
  categoryAttributes = [],
  isLoading,
  error,
  submitLabel = "Save",
  existingImages = [],
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;

  return (
    <form
      encType="multipart/form-data"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* Product Name & SKU */}
      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name
          </label>
          <div className="relative">
            <Controller
              name="name"
              control={control}
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200"
                  placeholder="Amazing Product"
                />
              )}
            />
            <Tag className="absolute left-3 top-3.5 text-gray-400" size={18} />
          </div>
          {errors.name && (
            <p className="text-red-500 text-xs mt-1 pl-10">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SKU
          </label>
          <div className="relative">
            <Controller
              name="sku"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200"
                  placeholder="PROD-12345"
                />
              )}
            />
            <Hash className="absolute left-3 top-3.5 text-gray-400" size={18} />
          </div>
          {errors.sku && (
            <p className="text-red-500 text-xs mt-1 pl-10">
              {errors.sku.message}
            </p>
          )}
        </div>
      </div>

      {/* Price & Discount */}
      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price
          </label>
          <div className="relative">
            <Controller
              name="price"
              control={control}
              rules={{
                required: "Required",
                min: { value: 0, message: "Must be positive" },
              }}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  step="0.01"
                  className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200"
                  placeholder="99.99"
                />
              )}
            />
            <DollarSign
              className="absolute left-3 top-3.5 text-gray-400"
              size={18}
            />
          </div>
          {errors.price && (
            <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
          )}
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Discount (%)
          </label>
          <Controller
            name="discount"
            control={control}
            rules={{
              min: { value: 0, message: "Min 0%" },
              max: { value: 100, message: "Max 100%" },
            }}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                className="pl-4 pr-4 py-3 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200"
                placeholder="10"
              />
            )}
          />
          {errors.discount && (
            <p className="text-red-500 text-xs mt-1">
              {errors.discount.message}
            </p>
          )}
        </div>
      </div>

      {/* Stock & Category */}
      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stock
          </label>
          <div className="relative">
            <Controller
              name="stock"
              control={control}
              rules={{
                required: "Required",
                min: { value: 0, message: "Must be positive" },
              }}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200"
                  placeholder="100"
                />
              )}
            />
            <Package
              className="absolute left-3 top-3.5 text-gray-400"
              size={18}
            />
          </div>
          {errors.stock && (
            <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>
          )}
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <Controller
            name="categoryId"
            control={control}
            rules={{ required: "Category is required" }}
            render={({ field }) => (
              <Dropdown
                onChange={(value) => {
                  field.onChange(value);
                  setValue("attributes", []); // Reset attributes on category change
                }}
                options={categories}
                value={field.value}
                label="eg. Electronics"
                className="py-[14px]"
              />
            )}
          />
          {errors.categoryId && (
            <p className="text-red-500 text-xs mt-1">
              {errors.categoryId.message}
            </p>
          )}
        </div>
      </div>

      {/* Product Attributes */}
      {categoryAttributes.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Attributes
          </label>
          <div className="grid grid-cols-1 gap-4">
            {categoryAttributes.map((categoryAttr) => (
              <div key={categoryAttr.attribute.id} className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {categoryAttr.attribute.name}
                  {categoryAttr.isRequired && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                {categoryAttr.attribute.type === "multiselect" ? (
                  <div className="space-y-2">
                    <Controller
                      name={`attributes`}
                      control={control}
                      rules={
                        categoryAttr.isRequired
                          ? {
                            validate: (attributes) => {
                              const attr = attributes.find(
                                (a: any) => a.attributeId === categoryAttr.attribute.id
                              );
                              return attr && attr.valueIds && attr.valueIds.length > 0
                                ? true
                                : `${categoryAttr.attribute.name} requires at least one selection`;
                            },
                          }
                          : {}
                      }
                      render={({ field }) => (
                        <>
                          {categoryAttr.attribute.values.map((value: any) => (
                            <CheckBox
                              key={value.id}
                              name={`attributes.${categoryAttr.attribute.id}.${value.id}`}
                              control={control}
                              label={value.value}
                              defaultValue={false}
                              checked={
                                field.value
                                  ?.find((a: any) => a.attributeId === categoryAttr.attribute.id)
                                  ?.valueIds?.includes(value.id) || false
                              }
                              onChangeExtra={(name, checked) => {
                                const currentAttributes = Array.isArray(field.value)
                                  ? field.value
                                  : [];
                                const existingAttr = currentAttributes.find(
                                  (a: any) => a.attributeId === categoryAttr.attribute.id
                                );
                                const currentValueIds = existingAttr?.valueIds || [];
                                const newValueIds = checked
                                  ? [...currentValueIds, value.id]
                                  : currentValueIds.filter((id: string) => id !== value.id);
                                const newAttributes = [
                                  ...currentAttributes.filter(
                                    (a: any) => a.attributeId !== categoryAttr.attribute.id
                                  ),
                                  {
                                    attributeId: categoryAttr.attribute.id,
                                    valueIds: newValueIds,
                                  },
                                ].filter((a: any) => a.valueIds?.length > 0 || a.valueId);
                                field.onChange(newAttributes);
                              }}
                            />
                          ))}
                        </>
                      )}
                    />
                    {errors.attributes && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.attributes.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <Controller
                    name={`attributes`}
                    control={control}
                    rules={
                      categoryAttr.isRequired
                        ? {
                          validate: (attributes) => {
                            const attr = attributes.find(
                              (a: any) => a.attributeId === categoryAttr.attribute.id
                            );
                            return attr && attr.valueId
                              ? true
                              : `${categoryAttr.attribute.name} is required`;
                          },
                        }
                        : {}
                    }
                    render={({ field }) => (
                      <Dropdown
                        onChange={(value) => {
                          const currentAttributes = Array.isArray(field.value)
                            ? field.value
                            : [];
                          const newAttributes = [
                            ...currentAttributes.filter(
                              (a: any) => a.attributeId !== categoryAttr.attribute.id
                            ),
                            {
                              attributeId: categoryAttr.attribute.id,
                              valueId: value,
                            },
                          ].filter((a: any) => a.valueId || a.valueIds?.length > 0);
                          field.onChange(newAttributes);
                        }}
                        options={categoryAttr.attribute.values.map((value: any) => ({
                          label: value.value,
                          value: value.id,
                        }))}
                        value={
                          field.value?.find(
                            (a: any) => a.attributeId === categoryAttr.attribute.id
                          )?.valueId || ""
                        }
                        label={`Select ${categoryAttr.attribute.name.toLowerCase()}`}
                        className="py-[14px]"
                      />
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Flags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Flags
        </label>
        <div className="grid grid-cols-2 gap-4">
          <CheckBox
            name="isNew"
            control={control}
            label="New Product"
            defaultValue={false}
          />
          <CheckBox
            name="isBestSeller"
            control={control}
            label="Best Seller"
            defaultValue={false}
          />
          <CheckBox
            name="isFeatured"
            control={control}
            label="Featured"
            defaultValue={false}
          />
          <CheckBox
            name="isTrending"
            control={control}
            label="Trending"
            defaultValue={false}
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              className="px-4 py-3 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200"
              placeholder="Describe your amazing product here..."
              rows={3}
            />
          )}
        />
      </div>

      <div className="md:col-span-2">
        <ImageUploader
          label="Category Images"
          control={control}
          errors={errors}
          setValue={setValue}
          watch={watch}
          name="images"
          maxFiles={5}
          existingImages={existingImages}
          disabled={isLoading}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-600 text-sm font-medium">
            {error.data?.message || "An error occurred"}
          </p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className={`px-6 py-3 text-white rounded-lg shadow-md font-medium flex items-center justify-center min-w-24 ${isLoading
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            } transition-all duration-200`}
        >
          {isLoading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;