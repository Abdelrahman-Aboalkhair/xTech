"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useGetAllBannersQuery,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} from "@/app/store/apis/BannerApi";
import useToast from "@/app/hooks/ui/useToast";
import { ArrowLeft, Trash2 } from "lucide-react";
import ConfirmModal from "@/app/components/organisms/ConfirmModal";
import { useForm } from "react-hook-form";
import Image from "next/image";
import BannerForm, { BannerFormData } from "../BannerForm";

const BannerDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();

  // Fetch banner
  const { data, isLoading, refetch } = useGetAllBannersQuery({});
  const banner = data?.banners.find((b) => b.id.toString() === id);
  const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation();
  const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation();

  // Form setup
  const form = useForm<BannerFormData>({
    defaultValues: banner || {
      title: "",
      type: "FullWidth",
      config: {
        image: "",
        headline: "",
        buttonText: "",
        buttonColor: "#000000",
        backgroundColor: "#FFFFFF",
        link: "",
      },
      isVisible: true,
      order: 1,
      pageId: 0,
    },
  });

  // Deletion state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Handle update
  const onSubmit = async (data: BannerFormData) => {
    try {
      await updateBanner({ id: parseInt(id as string), ...data }).unwrap();
      refetch();
      showToast("Banner updated successfully", "success");
    } catch (err) {
      console.error("Failed to update banner:", err);
      showToast("Failed to update banner", "error");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      await deleteBanner(parseInt(id as string)).unwrap();
      showToast("Banner deleted successfully", "success");
      router.push("/dashboard/banners");
    } catch (err) {
      console.error("Failed to delete banner:", err);
      showToast("Failed to delete banner", "error");
    }
  };

  // Preview function
  const renderBannerPreview = (banner: BannerFormData) => {
    const { config } = banner;
    return (
      <div
        className="p-4 rounded-md shadow-sm"
        style={{ backgroundColor: config.backgroundColor }}
      >
        <Image
          src={config.image}
          alt={config.headline}
          width={120}
          height={80}
          className="object-cover rounded-md mb-2"
        />
        <p
          className="text-sm font-medium truncate"
          style={{
            color: config.backgroundColor === "#000000" ? "#FFFFFF" : "#000000",
          }}
        >
          {config.headline}
        </p>
        <button
          className="mt-2 px-3 py-1 text-xs text-white rounded-md"
          style={{ backgroundColor: config.buttonColor }}
        >
          {config.buttonText}
        </button>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <span className="text-gray-600">Loading banner...</span>
      </div>
    );
  }

  if (!banner) {
    return (
      <div className="p-6 flex items-center justify-center">
        <span className="text-red-600">Banner not found</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard/banners")}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-800"
          >
            <ArrowLeft size={20} />
            Back to Banners
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">
            {banner.title}
          </h1>
        </div>
        <button
          onClick={() => setIsConfirmModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
          disabled={isDeleting}
        >
          <Trash2 size={16} />
          {isDeleting ? "Deleting..." : "Delete Banner"}
        </button>
      </div>

      {/* Banner Form */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <BannerForm
          form={form}
          onSubmit={onSubmit}
          isLoading={isUpdating}
          submitLabel="Save Changes"
        />
        {/* Preview */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Preview</h3>
          {renderBannerPreview(banner)}
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        message="Are you sure you want to delete this banner? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmModalOpen(false)}
        title="Delete Banner"
        type="danger"
      />
    </div>
  );
};

export default BannerDetailPage;
