// client/app/components/organisms/ProductForm.tsx
"use client";
import { Controller, UseFormReturn } from "react-hook-form";
import { Tag, DollarSign, Image as ImageIcon, Video, List } from "lucide-react";
import { ProductFormData } from "./product.types";
import { useState } from "react";
import Image from "next/image";

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
    formState: { errors },
  } = form;
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreview, setVideoPreview] = useState<string>("");

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: any) => void
  ) => {
    const files = Array.from(e.target.files || []);
    onChange(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleVideoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: any) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      setVideoPreview(URL.createObjectURL(file));
    } else {
      onChange("");
      setVideoPreview("");
    }
  };

  return (
    <form
      encType="multipart/form-data"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
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
            Price
          </label>
          <div className="relative">
            <Controller
              name="price"
              control={control}
              rules={{
                required: "Price is required",
                min: { value: 0, message: "Price must be non-negative" },
              }}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  step="0.01"
                  className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200"
                  placeholder="19.99"
                />
              )}
            />
            <DollarSign
              className="absolute left-3 top-3.5 text-gray-400"
              size={18}
            />
          </div>
          {errors.price && (
            <p className="text-red-500 text-xs mt-1 pl-10">
              {errors.price.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <div className="relative">
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            )}
          />
          <List className="absolute left-3 top-3.5 text-gray-400" size={18} />
        </div>
        {errors.categoryId && (
          <p className="text-red-500 text-xs mt-1 pl-10">
            {errors.categoryId.message}
          </p>
        )}
      </div>

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
              rows={4}
            />
          )}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Images
        </label>
        <div className="relative">
          <Controller
            name="images"
            control={control}
            render={({ field }) => (
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleImageChange(e, field.onChange)}
                className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200"
              />
            )}
          />
          <ImageIcon
            className="absolute left-3 top-3.5 text-gray-400"
            size={18}
          />
        </div>
        {(form.getValues("images") as string[])?.length > 0 && (
          <div className="mt-2 grid grid-cols-4 gap-2">
            {(form.getValues("images") as string[]).map((image: any, index) => (
              <Image
                key={index}
                src={image instanceof File ? URL.createObjectURL(image) : image}
                fill
                alt={`Preview ${index}`}
                className="w-full h-24 object-cover rounded"
              />
            ))}
          </div>
        )}
        {imagePreviews.length > 0 && (
          <div className="mt-2 grid grid-cols-4 gap-2">
            {imagePreviews.map((preview, index) => (
              <Image
                key={index}
                src={preview}
                alt={`New Preview ${index}`}
                fill
                className="w-full h-24 object-cover rounded"
              />
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Video
        </label>
        <div className="relative">
          <Controller
            name="video"
            control={control}
            rules={{
              validate: (value) =>
                !value ||
                (value instanceof File && value.size <= 10 * 1024 * 1024) ||
                typeof value === "string" ||
                "Video file must be under 10MB",
            }}
            render={({ field }) => (
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleVideoChange(e, field.onChange)}
                className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200"
              />
            )}
          />
          <Video className="absolute left-3 top-3.5 text-gray-400" size={18} />
        </div>
        {form.getValues("video") && (
          <div className="mt-2">
            {typeof form.getValues("video") === "string" ? (
              <video
                src={form.getValues("video") as string}
                controls
                className="w-full h-48 object-cover rounded"
              />
            ) : (
              videoPreview && (
                <video
                  src={videoPreview}
                  controls
                  className="w-full h-48 object-cover rounded"
                />
              )
            )}
          </div>
        )}
        {errors.video && (
          <p className="text-red-500 text-xs mt-1 pl-10">
            {errors.video.message}
          </p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-600 text-sm font-medium">
            {error.data?.message || "An error occurred"}
          </p>
        </div>
      )}

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
