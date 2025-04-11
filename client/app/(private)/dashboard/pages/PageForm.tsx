import { Controller, UseFormReturn } from "react-hook-form";
import { FileText } from "lucide-react";
import Switch from "@/app/components/atoms/Switch";

export interface PageFormData {
  id?: number; // Optional for create
  slug: string;
  title: string;
  isVisible: boolean;
  showInNavbar: boolean;
  isPublished: boolean;
  metaTitle: string;
  metaDescription: string;
  createdAt: Date;
}

interface PageFormProps {
  form: UseFormReturn<PageFormData>;
  onSubmit: (data: PageFormData) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

const PageForm: React.FC<PageFormProps> = ({
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
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
                placeholder="Page Title"
              />
            )}
          />
          <FileText
            className="absolute left-3 top-3.5 text-gray-400"
            size={18}
          />
        </div>
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Slug
        </label>
        <Controller
          name="slug"
          control={control}
          rules={{ required: "Slug is required" }}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
              placeholder="page-slug"
            />
          )}
        />
        {errors.slug && (
          <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>
        )}
      </div>

      {/* Switches */}
      <div className="grid grid-cols-3 gap-4">
        <Controller
          name="isVisible"
          control={control}
          render={() => <Switch name="isVisible" label="Visible" />}
        />
        <Controller
          name="showInNavbar"
          control={control}
          render={() => <Switch name="showInNavbar" label="In Navbar" />}
        />
        <Controller
          name="isPublished"
          control={control}
          render={() => <Switch name="isPublished" label="Published" />}
        />
      </div>

      {/* Meta Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meta Title
        </label>
        <Controller
          name="metaTitle"
          control={control}
          rules={{ required: "Meta Title is required" }}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
              placeholder="SEO Title"
            />
          )}
        />
        {errors.metaTitle && (
          <p className="text-red-500 text-sm mt-1">
            {errors.metaTitle.message}
          </p>
        )}
      </div>

      {/* Meta Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meta Description
        </label>
        <Controller
          name="metaDescription"
          control={control}
          rules={{ required: "Meta Description is required" }}
          render={({ field }) => (
            <textarea
              {...field}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
              placeholder="SEO Description"
            />
          )}
        />
        {errors.metaDescription && (
          <p className="text-red-500 text-sm mt-1">
            {errors.metaDescription.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className={`px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default PageForm;
