import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetAllCategoriesQuery } from "@/app/store/apis/CategoryApi";
import { ProductFormData } from "./page";
import ProductForm from "./ProductForm";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
  initialData: ProductFormData;
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
  const { data } = useGetAllCategoriesQuery({});
  console.log('categories data => ', data);
  const [selectedCategoryAttributes, setSelectedCategoryAttributes] = useState<any[]>([]);

  const categories = data?.categories?.map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const form = useForm<ProductFormData>({
    defaultValues: {
      id: "",
      name: "",
      sku: "",
      isNew: false,
      isTrending: false,
      isFeatured: false,
      isBestSeller: false,
      price: 0,
      discount: 0,
      stock: 0,
      categoryId: "",
      description: "",
      images: [],
      attributes: [], // Initialize as empty array
    },
  });

  const watchedCategoryId = form.watch("categoryId");

  useEffect(() => {
    if (watchedCategoryId && data?.categories) {
      const selectedCategory = data.categories.find(cat => cat.id === watchedCategoryId);
      if (selectedCategory) {
        setSelectedCategoryAttributes(selectedCategory.CategoryAttribute || []);
        // Reset attributes when category changes
        form.setValue("attributes", []);
      }
    } else {
      setSelectedCategoryAttributes([]);
      form.setValue("attributes", []);
    }
  }, [watchedCategoryId, data?.categories, form]);

  useEffect(() => {
    if (initialData) {
      console.log("initialData", initialData);
      // Transform initialData.attributes if needed
      const formattedAttributes = initialData.attributes
        ? Array.isArray(initialData.attributes)
          ? initialData.attributes
          : Object.entries(initialData.attributes).map(([attributeId, valueId]) => ({
            attributeId,
            valueId,
          }))
        : [];
      form.reset({
        id: initialData.id || "",
        name: initialData.name || "",
        sku: initialData.sku || "",
        isNew: initialData.isNew || false,
        isTrending: initialData.isTrending || false,
        isFeatured: initialData.isFeatured || false,
        isBestSeller: initialData.isBestSeller || false,
        price: initialData.price || 0,
        discount: initialData.discount || 0,
        stock: initialData.stock || 0,
        categoryId: initialData.categoryId || "",
        description: initialData.description || "",
        images: initialData.images || [],
        attributes: formattedAttributes,
      });
    } else {
      form.reset({
        id: "",
        name: "",
        sku: "",
        isNew: false,
        isTrending: false,
        isFeatured: false,
        isBestSeller: false,
        price: 0,
        discount: 0,
        stock: 0,
        categoryId: "",
        description: "",
        images: [],
        attributes: [],
      });
    }
  }, [initialData, form]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl max-h-[80%] overflow-auto border border-gray-100"
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
              categoryAttributes={selectedCategoryAttributes}
              isLoading={isLoading}
              error={error}
              submitLabel={initialData ? "Update" : "Create"}
              existingImages={initialData?.images || []}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;