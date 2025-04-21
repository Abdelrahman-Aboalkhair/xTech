import { Controller, UseFormReturn } from "react-hook-form";
import { DollarSign, Package, Tag } from "lucide-react";
import Dropdown from "@/app/components/molecules/Dropdown";
import ImageUploader from "@/app/components/molecules/ImageUploader";
import { ProductFormData } from "./page";

interface ProductFormProps {
  form: UseFormReturn<ProductFormData>;
  onSubmit: (data: ProductFormData) => void;
  categories?: { label: string; value: string }[];
  isLoading?: boolean;
  error?: any;
  submitLabel?: string;
}

const ProductForm: React.FC<ProductFormProps> = ({
  form,
  onSubmit,
  categories = [],
  isLoading,
  error,
  submitLabel = "Save",
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
      {/* Product Name */}
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
                onChange={field.onChange}
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
          label="Product Images"
          control={control}
          errors={errors}
          setValue={setValue}
          watch={watch}
          existingImages={watch("images") || []}
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
          className={`px-6 py-3 text-white rounded-lg shadow-md font-medium flex items-center justify-center min-w-24 ${
            isLoading
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
