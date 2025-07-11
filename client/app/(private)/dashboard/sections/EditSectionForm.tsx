'use client'

import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Check, X } from "lucide-react";
import Dropdown from "@/app/components/molecules/Dropdown";
import ImageUploader from "@/app/components/molecules/ImageUploader";

const EditSectionForm = ({ section, onUpdate, onCancel, isLoading }) => {
  const {
    handleSubmit,
    register,
    control,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      title: section.title || "",
      description: section.description || "",
      ctaText: section.ctaText || "",
      type: section.type || "",
      isVisible: section.isVisible || false,
    },
  });

  const sectionTypes = [
    { label: "Hero", value: "HERO" },
    { label: "Promotional", value: "PROMOTIONAL" },
    { label: "Benefits", value: "BENEFITS" },
    { label: "New Arrivals", value: "NEW_ARRIVALS" },
  ];

  const handleUpdateSection = (formData) => {
    const payload = new FormData();
    payload.append("title", formData.title || "");
    payload.append("description", formData.description || "");
    payload.append("type", formData.type || "");
    payload.append("ctaText", formData.ctaText || "");
    payload.append("isVisible", formData.isVisible || false);

    // Handling image uploads
    if (formData.images && Array.isArray(formData.images)) {
      formData.images.forEach((file) => {
        if (file instanceof File) {
          payload.append("images", file);
        }
      });
    }

    onUpdate(section.type, payload);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        Edit Section: {section.title || section.type}
      </h2>
      <form
        encType="multipart/form-data"
        onSubmit={handleSubmit(handleUpdateSection)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="md:col-span-2">
          <ImageUploader
            label={"Section Images"}
            control={control}
            errors={errors}
            setValue={setValue}
            watch={watch}
            existingImages={section.images}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Section Title
          </label>
          <input
            placeholder="50% off all our products, BLACK FRIDAY!"
            {...register("title")}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CTA Button Text
          </label>
          <input
            placeholder="Explore now!"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
            {...register("ctaText")}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            placeholder="This is the description of the section"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 min-h-24"
            {...register("description")}
          />
        </div>

        <div>
          <Controller
            name="type"
            control={control}
            rules={{ required: "Section type is required" }}
            render={({ field, fieldState }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Section Type
                </label>
                <Dropdown
                  onChange={field.onChange}
                  options={sectionTypes}
                  value={field.value}
                  label="Select a type"
                  className="w-full"
                />
                {fieldState.error && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        <div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              {...register("isVisible")}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Visible on website
            </span>
          </label>
        </div>

        <div className="md:col-span-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <span className="flex items-center gap-2">
              <X size={18} />
              Cancel
            </span>
          </button>
          <button
            type="submit"
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${isLoading
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span>Updating...</span>
            ) : (
              <>
                <Check size={18} />
                <span>Update Section</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditSectionForm;
