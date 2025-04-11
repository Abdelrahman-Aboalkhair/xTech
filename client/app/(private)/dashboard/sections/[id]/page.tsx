"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useGetAllSectionsQuery,
  useUpdateSectionMutation,
} from "@/app/store/apis/SectionApi";
import useToast from "@/app/hooks/ui/useToast";
import {
  ArrowLeft,
  Layers,
  Eye,
  EyeOff,
  LayoutTemplate,
  FileText,
  Loader2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import SectionForm, { SectionFormData } from "../SectionForm";
import renderSectionPreview from "../renderSectionPreview";

const SectionDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">(
    "desktop"
  );

  // Fetch section data
  const { data, isLoading, refetch } = useGetAllSectionsQuery({});
  const section = data?.sections.find((s) => s.id === parseInt(id as string));
  const [updateSection, { isLoading: isUpdating }] = useUpdateSectionMutation();

  // Form setup
  const form = useForm<SectionFormData>({
    defaultValues: {
      id: 0,
      title: "",
      type: "",
      content: {},
      order: 0,
      isVisible: true,
      pageId: 1,
    },
  });

  // Set form values when section data is available
  useEffect(() => {
    if (section) {
      form.reset({
        ...section,
        content:
          typeof section.content === "string"
            ? section.content
            : JSON.stringify(section.content, null, 2),
      });
    }
  }, [section, form]);

  // Handle update
  const onSubmit = async (data: SectionFormData) => {
    try {
      const updatedData = {
        ...data,
        content: JSON.parse(
          typeof data.content === "string"
            ? data.content
            : JSON.stringify(data.content)
        ),
      };
      await updateSection(updatedData).unwrap();
      refetch();
      showToast("Section updated successfully", "success");
    } catch (err) {
      console.error("Failed to update section:", err);
      showToast("Failed to update section", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 text-teal-500 animate-spin" />
          <p className="text-gray-600 font-medium">
            Loading section information...
          </p>
        </div>
      </div>
    );
  }

  if (!section) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-red-500 text-center">
          <FileText className="h-12 w-12 mx-auto mb-2 text-red-400" />
          <h2 className="text-xl font-bold">Section Not Found</h2>
          <p className="mt-2 text-gray-600">
            The requested section could not be found or has been deleted.
          </p>
          <button
            onClick={() => router.push("/dashboard/sections")}
            className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
          >
            Return to Sections List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      {/* Breadcrumb & Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/dashboard/sections")}
          className="flex items-center gap-1 text-sm text-teal-600 hover:text-teal-800 mb-4 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Sections</span>
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-teal-100 p-2 rounded-lg">
              <Layers size={20} className="text-teal-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {section.title}
              </h1>
              <div className="flex items-center text-gray-500 text-sm mt-1">
                <LayoutTemplate size={14} className="mr-1" />
                <span>Type: {section.type}</span>
                {section.isVisible ? (
                  <span className="ml-3 flex items-center text-green-600">
                    <Eye size={14} className="mr-1" />
                    Visible
                  </span>
                ) : (
                  <span className="ml-3 flex items-center text-gray-500">
                    <EyeOff size={14} className="mr-1" />
                    Hidden
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 py-1 px-2 bg-gray-100 rounded-md">
            <span className="text-xs text-gray-500">Preview:</span>
            <button
              onClick={() => setPreviewMode("desktop")}
              className={`px-2 py-1 rounded text-xs font-medium ${
                previewMode === "desktop"
                  ? "bg-teal-500 text-white"
                  : "bg-white text-gray-600"
              }`}
            >
              Desktop
            </button>
            <button
              onClick={() => setPreviewMode("mobile")}
              className={`px-2 py-1 rounded text-xs font-medium ${
                previewMode === "mobile"
                  ? "bg-teal-500 text-white"
                  : "bg-white text-gray-600"
              }`}
            >
              Mobile
            </button>
          </div>
        </div>
      </div>

      {/* Section Information & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section Form */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <h2 className="font-semibold text-lg mb-4 text-gray-800">
            Edit Section
          </h2>
          <SectionForm
            form={form}
            onSubmit={onSubmit}
            isLoading={isUpdating}
            submitLabel={isUpdating ? "Saving Changes..." : "Save Changes"}
          />
        </div>

        {/* Preview Card */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <h2 className="font-semibold text-lg mb-4 text-gray-800">Preview</h2>
          <div
            className={`border border-gray-200 rounded-lg bg-gray-50 overflow-hidden ${
              previewMode === "mobile" ? "max-w-xs mx-auto" : "w-full"
            }`}
          >
            <div className="bg-gray-200 p-2 text-xs text-gray-600 flex justify-between items-center">
              <span>Section Preview</span>
              <span>Order: {section.order}</span>
            </div>
            <div className={`p-4 ${previewMode === "mobile" ? "p-2" : "p-4"}`}>
              {renderSectionPreview(section)}
            </div>
          </div>

          {/* Section Metadata */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Section Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">ID</p>
                <p className="text-sm font-medium">{section.id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Page ID</p>
                <p className="text-sm font-medium">{section.pageId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Order</p>
                <p className="text-sm font-medium">{section.order}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Visibility</p>
                <p className="text-sm font-medium">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      section.isVisible
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {section.isVisible ? "Visible" : "Hidden"}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Content Structure */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Content Structure
            </h3>
            <div className="bg-gray-50 p-3 rounded-md border border-gray-200 overflow-auto max-h-60">
              <pre className="text-xs text-gray-600">
                {typeof section.content === "object"
                  ? JSON.stringify(section.content, null, 2)
                  : section.content}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Related Sections (if any) */}
      {data?.sections.filter(
        (s) => s.pageId === section.pageId && s.id !== section.id
      ).length > 0 && (
        <div className="mt-6 bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <h2 className="font-semibold text-lg mb-4 text-gray-800">
            Related Sections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.sections
              .filter((s) => s.pageId === section.pageId && s.id !== section.id)
              .map((relatedSection) => (
                <div
                  key={relatedSection.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-teal-300 transition-colors cursor-pointer"
                  onClick={() =>
                    router.push(`/dashboard/sections/${relatedSection.id}`)
                  }
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-gray-100 p-1 rounded">
                      <Layers size={14} className="text-gray-600" />
                    </div>
                    <p className="font-medium text-gray-800">
                      {relatedSection.title}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Order: {relatedSection.order}</span>
                    {relatedSection.isVisible ? (
                      <span className="flex items-center text-green-600">
                        <Eye size={12} className="mr-1" />
                        Visible
                      </span>
                    ) : (
                      <span className="flex items-center text-gray-500">
                        <EyeOff size={12} className="mr-1" />
                        Hidden
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionDetailPage;
