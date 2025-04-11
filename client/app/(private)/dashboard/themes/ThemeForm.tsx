import { useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { Palette } from "lucide-react";
import { ChromePicker, ColorResult } from "react-color";

export interface ThemeFormData {
  id?: number; // Optional for create
  name: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  isActive: boolean;
}

interface ThemeFormProps {
  form: UseFormReturn<ThemeFormData>;
  onSubmit: (data: ThemeFormData) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

const ThemeForm: React.FC<ThemeFormProps> = ({
  form,
  onSubmit,
  isLoading,
  submitLabel = "Save",
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;
  const [primaryColor, setPrimaryColor] = useState<string>(
    form.getValues("primaryColor") || "#3B82F6"
  );
  const [secondaryColor, setSecondaryColor] = useState<string>(
    form.getValues("secondaryColor") || "#F59E0B"
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Name
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
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                placeholder="Theme Name"
              />
            )}
          />
          <Palette
            className="absolute left-3 top-3.5 text-gray-400"
            size={18}
          />
        </div>
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Primary Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Primary Color
        </label>
        <Controller
          name="primaryColor"
          control={control}
          rules={{ required: "Primary color is required" }}
          render={({ field }) => (
            <>
              <ChromePicker
                color={primaryColor}
                onChange={(color: ColorResult) => {
                  setPrimaryColor(color.hex);
                  field.onChange(color.hex);
                }}
                className="w-full"
              />
              <input type="hidden" {...field} value={primaryColor} />
            </>
          )}
        />
        {errors.primaryColor && (
          <p className="text-red-500 text-sm mt-1">
            {errors.primaryColor.message}
          </p>
        )}
      </div>

      {/* Secondary Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Secondary Color
        </label>
        <Controller
          name="secondaryColor"
          control={control}
          rules={{ required: "Secondary color is required" }}
          render={({ field }) => (
            <>
              <ChromePicker
                color={secondaryColor}
                onChange={(color: ColorResult) => {
                  setSecondaryColor(color.hex);
                  field.onChange(color.hex);
                }}
                className="w-full"
              />
              <input type="hidden" {...field} value={secondaryColor} />
            </>
          )}
        />
        {errors.secondaryColor && (
          <p className="text-red-500 text-sm mt-1">
            {errors.secondaryColor.message}
          </p>
        )}
      </div>

      {/* Font Family */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Font Family
        </label>
        <Controller
          name="fontFamily"
          control={control}
          rules={{ required: "Font family is required" }}
          render={({ field }) => (
            <select
              {...field}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            >
              <option value="Poppins">Poppins</option>
              <option value="Roboto">Roboto</option>
              <option value="Inter">Inter</option>
              <option value="Open Sans">Open Sans</option>
            </select>
          )}
        />
        {errors.fontFamily && (
          <p className="text-red-500 text-sm mt-1">
            {errors.fontFamily.message}
          </p>
        )}
      </div>

      {/* Is Active */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Active
        </label>
        <Controller
          name="isActive"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              value={field.value ? "true" : "false"}
              onChange={(e) => field.onChange(e.target.value === "true")}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          )}
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default ThemeForm;
