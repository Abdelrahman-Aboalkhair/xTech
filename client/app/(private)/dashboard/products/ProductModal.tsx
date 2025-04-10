import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { X, Upload, DollarSign, Package, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Dropdown from "@/app/components/molecules/Dropdown";
import { useGetAllCategoriesQuery } from "@/app/store/apis/CategoryApi";
import { ProductFormData } from "./page";
import ImageUploader from "@/app/components/molecules/ImageUploader";
import CustomLoader from "@/app/components/feedback/CustomLoader";

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
  const categories = data?.categories.map((category) => {
    return {
      label: category.name,
      value: category.id,
    };
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      name: "",
      price: 0,
      discount: 0,
      stock: 0,
      categoryId: "",
      description: "",
      images: [""],
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        name: "",
        price: 0,
        discount: 0,
        stock: 0,
        categoryId: "",
        description: "",
        images: [""],
      });
    }
  }, [initialData, reset]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0  bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl max-h-[80%] overflow-auto  border border-gray-100"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
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
                        className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200"
                        placeholder="Amazing Product"
                      />
                    )}
                  />
                  <Tag
                    className="absolute left-3 top-3.5 text-gray-400"
                    size={18}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1 pl-10">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Price & Discount - Side by side */}
              <div className="grid grid-cols-2 gap-4">
                {/* Price */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <div className="relative">
                    <Controller
                      name="price"
                      control={control}
                      rules={{
                        required: "Required",
                        min: { value: 0, message: "Must be positive" },
                      }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          step="0.01"
                          className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200"
                          placeholder="99.99"
                        />
                      )}
                    />
                    <DollarSign
                      className="absolute left-3 top-3.5 text-gray-400"
                      size={18}
                    />
                  </div>
                  {errors.price && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                {/* Discount */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount (%)
                  </label>
                  <Controller
                    name="discount"
                    control={control}
                    rules={{
                      min: { value: 0, message: "Min 0%" },
                      max: { value: 100, message: "Max 100%" },
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        className="pl-4 pr-4 py-3 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200"
                        placeholder="10"
                      />
                    )}
                  />
                  {errors.discount && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.discount.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <div className="relative">
                    <Controller
                      name="stock"
                      control={control}
                      rules={{
                        required: "Required",
                        min: { value: 0, message: "Must be positive" },
                      }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200"
                          placeholder="100"
                        />
                      )}
                    />
                    <Package
                      className="absolute left-3 top-3.5 text-gray-400"
                      size={18}
                    />
                  </div>
                  {errors.stock && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.stock.message}
                    </p>
                  )}
                </div>

                {/* Category */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <div className="relative">
                    <Controller
                      name="categoryId"
                      control={control}
                      render={({ field }) => (
                        <Dropdown
                          onChange={field.onChange}
                          options={categories}
                          value={field.value}
                          label="eg. Electronics"
                          className="py-[14px]"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      className="px-4 py-3 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200"
                      placeholder="Describe your amazing product here..."
                      rows={3}
                    />
                  )}
                />
              </div>

              <ImageUploader
                control={control}
                errors={errors}
                setValue={setValue}
                watch={watch}
              />

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-red-600 text-sm font-medium">
                    {error.data?.message || "An error occurred"}
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-8">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-3 text-white rounded-lg shadow-md font-medium flex items-center justify-center min-w-24 ${
                    isLoading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  } transition-all duration-200`}
                >
                  {isLoading ? (
                    <CustomLoader />
                  ) : (
                    <Upload className="mr-2" size={16} />
                  )}
                  {isLoading ? "Saving..." : initialData ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;
