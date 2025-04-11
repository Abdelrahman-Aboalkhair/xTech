import { Controller, UseFormReturn } from "react-hook-form";
import { Sliders } from "lucide-react";

export interface WidgetFormData {
  id?: number; // Optional for create
  name: string;
  type: string;
  isVisible: boolean;
  location: string;
  order: number;
}

interface WidgetFormProps {
  form: UseFormReturn<WidgetFormData>;
  onSubmit: (data: WidgetFormData) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

const WidgetForm: React.FC<WidgetFormProps> = ({
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
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
                placeholder="Widget Name"
              />
            )}
          />
          <Sliders
            className="absolute left-3 top-3.5 text-gray-400"
            size={18}
          />
        </div>
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
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
            <select
              {...field}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text

-gray-800"
            >
              <option value="PromoSection">Promo Section</option>
              <option value="Topbar">Topbar</option>
            </select>
          )}
        />
        {errors.type && (
          <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
        )}
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location
        </label>
        <Controller
          name="location"
          control={control}
          rules={{ required: "Location is required" }}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
              placeholder="e.g., Homepage"
            />
          )}
        />
        {errors.location && (
          <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
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
          rules={{
            required: "Order is required",
            min: { value: 1, message: "Order must be at least 1" },
          }}
          render={({ field }) => (
            <input
              {...field}
              type="number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
              placeholder="1"
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          )}
        />
      </div>

      {/* Note about Config */}
      <p className="text-sm text-gray-500">
        Config editing is type-specific and requires additional fields.
      </p>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className={`px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default WidgetForm;
