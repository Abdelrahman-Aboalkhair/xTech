"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useGetAllThemesQuery,
  useUpdateThemeMutation,
  useDeleteThemeMutation,
} from "@/app/store/apis/ThemeApi";
import useToast from "@/app/hooks/ui/useToast";
import {
  ArrowLeft,
  Trash2,
  Palette,
  Check,
  Type,
  SquareSlash,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import ConfirmModal from "@/app/components/organisms/ConfirmModal";
import { useForm } from "react-hook-form";
import ThemeForm, { ThemeFormData } from "../ThemeForm";

const ThemeDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();

  // Fetch theme data
  const { data, isLoading, refetch } = useGetAllThemesQuery({});
  const [updateTheme, { isLoading: isUpdating }] = useUpdateThemeMutation();
  const [deleteTheme, { isLoading: isDeleting }] = useDeleteThemeMutation();

  // Find the current theme
  const theme = data?.themes.find((t) => t.id.toString() === id);

  // Form setup
  const form = useForm<ThemeFormData>({
    defaultValues: {
      name: "",
      primaryColor: "#3B82F6",
      secondaryColor: "#F59E0B",
      fontFamily: "Poppins",
      isActive: false,
    },
  });

  // Set form values when theme data is available
  useEffect(() => {
    if (theme) {
      form.reset(theme);
    }
  }, [theme, form]);

  // Deletion state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Handle update
  const onSubmit = async (data: ThemeFormData) => {
    try {
      await updateTheme({ id: parseInt(id as string), ...data }).unwrap();
      refetch();
      showToast("Theme updated successfully", "success");
    } catch (err) {
      console.error("Failed to update theme:", err);
      showToast("Failed to update theme", "error");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      await deleteTheme(parseInt(id as string)).unwrap();
      showToast("Theme deleted successfully", "success");
      router.push("/dashboard/themes");
    } catch (err) {
      console.error("Failed to delete theme:", err);
      showToast("Failed to delete theme", "error");
    }
  };

  // Set as active theme
  const handleSetActive = async () => {
    if (theme && !theme.isActive) {
      try {
        await updateTheme({
          id: parseInt(id as string),
          ...theme,
          isActive: true,
        }).unwrap();
        refetch();
        showToast("Theme set as active successfully", "success");
      } catch (err) {
        console.error("Failed to set theme as active:", err);
        showToast("Failed to set theme as active", "error");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          <p className="text-gray-600 font-medium">
            Loading theme information...
          </p>
        </div>
      </div>
    );
  }

  if (!theme) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-red-500 text-center">
          <Palette className="h-12 w-12 mx-auto mb-2 text-red-400" />
          <h2 className="text-xl font-bold">Theme Not Found</h2>
          <p className="mt-2 text-gray-600">
            The requested theme could not be found or has been deleted.
          </p>
          <button
            onClick={() => router.push("/dashboard/themes")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Return to Themes List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      {/* Breadcrumb & Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push("/dashboard/themes")}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mb-4 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Themes</span>
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div
                className="w-12 h-12 rounded-md shadow-md"
                style={{ backgroundColor: theme.primaryColor }}
              ></div>
              <div
                className="w-6 h-6 rounded-md shadow-sm absolute -bottom-2 -right-2"
                style={{ backgroundColor: theme.secondaryColor }}
              ></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{theme.name}</h1>
              <div className="flex items-center text-gray-500 text-sm">
                <Type size={14} className="mr-1" />
                <span style={{ fontFamily: theme.fontFamily || "inherit" }}>
                  {theme.fontFamily}
                </span>
                {theme.isActive && (
                  <span className="ml-3 flex items-center text-green-600">
                    <CheckCircle2 size={14} className="mr-1" />
                    Active Theme
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            {!theme.isActive && (
              <button
                onClick={handleSetActive}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors w-full md:w-auto"
              >
                <Check size={16} />
                <span>Set as Active</span>
              </button>
            )}
            <button
              onClick={() => setIsConfirmModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 w-full md:w-auto"
              disabled={isDeleting}
            >
              <Trash2 size={16} />
              <span>{isDeleting ? "Deleting..." : "Delete Theme"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Theme Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <h2 className="font-semibold text-lg mb-4 text-gray-800">
              Theme Preview
            </h2>

            {/* Preview Card */}
            <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
              {/* Header */}
              <div
                className="p-4 text-white"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <h3
                  className="font-bold text-lg mb-1"
                  style={{ fontFamily: theme.fontFamily || "inherit" }}
                >
                  Sample Header
                </h3>
                <p
                  className="text-sm opacity-90"
                  style={{ fontFamily: theme.fontFamily || "inherit" }}
                >
                  This is how your theme will appear
                </p>
              </div>

              {/* Content */}
              <div className="p-4 bg-white">
                <div
                  className="mb-3 p-2 rounded text-white text-sm"
                  style={{ backgroundColor: theme.secondaryColor }}
                >
                  Secondary Color Element
                </div>
                <p
                  className="text-gray-800 mb-3"
                  style={{ fontFamily: theme.fontFamily || "inherit" }}
                >
                  This sample content shows how text will appear with the{" "}
                  {theme.fontFamily} font family.
                </p>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 rounded text-white text-sm"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    Primary Button
                  </button>
                  <button
                    className="px-3 py-1 rounded text-sm border"
                    style={{
                      color: theme.secondaryColor,
                      borderColor: theme.secondaryColor,
                    }}
                  >
                    Secondary Button
                  </button>
                </div>
              </div>
            </div>

            {/* Color & Font Info */}
            <div className="mt-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Colors</h3>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center">
                    <div
                      className="w-6 h-6 rounded mr-2"
                      style={{ backgroundColor: theme.primaryColor }}
                    ></div>
                    <span className="text-xs font-mono">
                      {theme.primaryColor}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div
                      className="w-6 h-6 rounded mr-2"
                      style={{ backgroundColor: theme.secondaryColor }}
                    ></div>
                    <span className="text-xs font-mono">
                      {theme.secondaryColor}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700">Font</h3>
                <p
                  className="mt-1 text-base"
                  style={{ fontFamily: theme.fontFamily || "inherit" }}
                >
                  {theme.fontFamily} Sample
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700">Status</h3>
                <div className="mt-1">
                  {theme.isActive ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle2 size={12} className="mr-1" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      <SquareSlash size={12} className="mr-1" />
                      Inactive
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Theme Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <h2 className="font-semibold text-lg mb-4 text-gray-800">
              Edit Theme
            </h2>
            <ThemeForm
              form={form}
              onSubmit={onSubmit}
              isLoading={isUpdating}
              submitLabel={isUpdating ? "Saving Changes..." : "Save Changes"}
            />
          </div>
        </div>
      </div>

      {/* Theme Usage */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h2 className="font-semibold text-lg mb-4 text-gray-800">
          Theme Usage
        </h2>
        {data?.themes.some((t) => t.isActive && t.id === theme.id) ? (
          <div className="p-4 bg-green-50 border border-green-100 rounded-lg flex items-start gap-3">
            <CheckCircle2 className="text-green-500 h-5 w-5 mt-0.5" />
            <div>
              <p className="font-medium text-green-700">
                This theme is currently active
              </p>
              <p className="text-sm text-green-600 mt-1">
                The {theme.name} theme is being applied to your website. All
                visitors will see this theme.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-start gap-3">
            <SquareSlash className="text-gray-500 h-5 w-5 mt-0.5" />
            <div>
              <p className="font-medium text-gray-700">
                This theme is currently inactive
              </p>
              <p className="text-sm text-gray-600 mt-1">
                To use this theme, click the Set as Active button above. Only
                one theme can be active at a time.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        message={`Are you sure you want to delete the "${theme.name}" theme? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmModalOpen(false)}
        title="Delete Theme"
        type="danger"
      />
    </div>
  );
};

export default ThemeDetailPage;
