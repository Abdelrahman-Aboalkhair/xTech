// client/app/components/organisms/ProductModal.tsx
"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetAllCategoriesQuery } from "@/app/store/apis/CategoryApi";
import { ProductFormData } from "./product.types";
import ProductForm from "./ProductForm";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
  initialData?: ProductFormData;
  isLoading?: boolean;
  error?: any;
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
  error,
}) => {
  const { data: categoriesData } = useGetAllCategoriesQuery({});
  const categories =
    categoriesData?.categories?.map((category) => ({
      label: category.name,
      value: category.id,
    })) || [];

  const form = useForm<ProductFormData>({
    defaultValues: {
      id: "",
      name: "",
      price: 0,
      images: [],
      video: "",
      categoryId: "",
      description: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        id: initialData.id || "",
        name: initialData.name || "",
        price: initialData.price || 0,
        images: initialData.images || [],
        video: initialData.video || "",
        categoryId: initialData.categoryId || "",
        description: initialData.description || "",
      });
    } else {
      form.reset({
        id: "",
        name: "",
        price: 0,
        images: [],
        video: "",
        categoryId: "",
        description: "",
      });
    }
  }, [initialData, form]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-4xl max-h-[80%] overflow-auto border border-gray-100"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                {initialData ? "Edit Product" : "Create Product"}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-700 transition-colors duration-200 rounded-full p-1 hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>

            <ProductForm
              form={form}
              onSubmit={onSubmit}
              categories={categories}
              isLoading={isLoading}
              error={error}
              submitLabel={initialData ? "Update" : "Create"}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;
