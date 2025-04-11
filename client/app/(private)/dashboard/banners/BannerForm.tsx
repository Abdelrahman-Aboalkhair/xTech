import { Controller, UseFormReturn } from "react-hook-form";
import { ImageIcon } from "lucide-react";

export interface BannerFormData {
  id?: number; // Optional for create
  title: string;
  type: string;
  config: {
    image: string;
    headline: string;
    buttonText: string;
    buttonColor: string;
    backgroundColor: string;
    link: string;
  };
  isVisible: boolean;
  order: number;
  pageId: number;
}

interface BannerFormProps {
  form: UseFormReturn<BannerFormData>;
  onSubmit: (data: BannerFormData) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

const BannerForm: React.FC<BannerFormProps> = ({
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
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800"
                placeholder="Banner Title"
              />
            )}
          />
          <ImageIcon
            className="absolute left-3 top-3.5 text-gray-400"
            size={18}
          />
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
            <select
              {...field}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800"
            >
              <option value="FullWidth">Full Width</option>
              <option value="Sidebar">Sidebar</option>
            </select>
          )}
        />
        {errors.type && (
          <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
        )}
      </div>

      {/* Image URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image URL
        </label>
        <Controller
          name="config.image"
          control={control}
          rules={{ required: "Image URL is required" }}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800"
              placeholder="https://example.com/image.jpg"
            />
          )}
        />
        {errors.config?.image && (
          <p className="text-red-500 text-sm mt-1">
            {errors.config.image.message}
          </p>
        )}
      </div>

      {/* Headline */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Headline
        </label>
        <Controller
          name="config.headline"
          control={control}
          rules={{ required: "Headline is required" }}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800"
              placeholder="Banner Headline"
            />
          )}
        />
        {errors.config?.headline && (
          <p className="text-red-500 text-sm mt-1">
            {errors.config.headline.message}
          </p>
        )}
      </div>

      {/* Button Text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Button Text
        </label>
        <Controller
          name="config.buttonText"
          control={control}
          rules={{ required: "Button text is required" }}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800"
              placeholder="Click Here"
            />
          )}
        />
        {errors.config?.buttonText && (
          <p className="text-red-500 text-sm mt-1">
            {errors.config.buttonText.message}
          </p>
        )}
      </div>

      {/* Button Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Button Color
        </label>
        <Controller
          name="config.buttonColor"
          control={control}
          rules={{ required: "Button color is required" }}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800"
              placeholder="#HEXCODE"
            />
          )}
        />
        {errors.config?.buttonColor && (
          <p className="text-red-500 text-sm mt-1">
            {errors.config.buttonColor.message}
          </p>
        )}
      </div>

      {/* Background Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Background Color
        </label>
        <Controller
          name="config.backgroundColor"
          control={control}
          rules={{ required: "Background color is required" }}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800"
              placeholder="#HEXCODE"
            />
          )}
        />
        {errors.config?.backgroundColor && (
          <p className="text-red-500 text-sm mt-1">
            {errors.config.backgroundColor.message}
          </p>
        )}
      </div>

      {/* Link */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Link
        </label>
        <Controller
          name="config.link"
          control={control}
          rules={{ required: "Link is required" }}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800"
              placeholder="https://example.com"
            />
          )}
        />
        {errors.config?.link && (
          <p className="text-red-500 text-sm mt-1">
            {errors.config.link.message}
          </p>
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800"
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800"
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
          rules={{ required: "Page ID is required" }}
          render={({ field }) => (
            <input
              {...field}
              type="number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800"
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
          className={`px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-300 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default BannerForm;
