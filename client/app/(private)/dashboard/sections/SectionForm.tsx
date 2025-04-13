import { Controller, UseFormReturn } from "react-hook-form";
import { Layout } from "lucide-react";

export interface SectionFormData {
  id: number;
  title: string;
  type: string;
  content: any; // JSON object, editable as string
  order: number;
  isVisible: boolean;
  pageId: number;
}

interface SectionFormProps {
  form: UseFormReturn<SectionFormData>;
  onSubmit: (data: SectionFormData) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

const SectionForm: React.FC<SectionFormProps> = ({
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title
        </label>
        <div className="relative">
          <Controller
            name="title"
            control={control}
            rules={{ required: "Title is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800"
                placeholder="Section Title"
              />
            )}
          />
          <Layout className="absolute left-3 top-3.5 text-gray-400" size={18} />
        </div>
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type
        </label>
        <Controller
          name="type"
          control={control}
          rules={{ required: "Type is required" }}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800"
              placeholder="e.g., Hero, Footer"
            />
          )}
        />
        {errors.type && (
          <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
        )}
      </div>

      {/* Order */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Order
        </label>
        <Controller
          name="order"
          control={control}
          rules={{ required: "Order is required", min: 0 }}
          render={({ field }) => (
            <input
              {...field}
              type="number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800"
              placeholder="0"
            />
          )}
        />
        {errors.order && (
          <p className="text-red-500 text-sm mt-1">{errors.order.message}</p>
        )}
      </div>

      {/* Is Visible */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Visible
        </label>
        <Controller
          name="isVisible"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              value={field.value ? "true" : "false"}
              onChange={(e) => field.onChange(e.target.value === "true")}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          )}
        />
      </div>

      {/* Page ID */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Page ID
        </label>
        <Controller
          name="pageId"
          control={control}
          rules={{ required: "Page ID is required", min: 1 }}
          render={({ field }) => (
            <input
              {...field}
              type="number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800"
              placeholder="1"
            />
          )}
        />
        {errors.pageId && (
          <p className="text-red-500 text-sm mt-1">{errors.pageId.message}</p>
        )}
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className={`px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-300 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default SectionForm;
