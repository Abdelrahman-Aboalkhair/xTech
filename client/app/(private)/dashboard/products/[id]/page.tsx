"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useGetAllProductsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "@/app/store/apis/ProductApi";
import { useGetAllCategoriesQuery } from "@/app/store/apis/CategoryApi";
import useToast from "@/app/hooks/ui/useToast";
import {
  Trash2,
  ArrowLeft,
  Save,
  Package,
  AlertCircle,
  Loader2,
  XCircle,
  Archive,
} from "lucide-react";
import { ProductFormData } from "../page";
import ProductForm from "../ProductForm";
import ConfirmModal from "@/app/components/organisms/ConfirmModal";
import { useForm } from "react-hook-form";

const ProductDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();

  // Fetch product and categories
  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
    refetch,
  } = useGetAllProductsQuery({});
  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetAllCategoriesQuery({});
  const product = productsData?.products.find((p) => p.id === id);
  const categories =
    categoriesData?.categories.map((c) => ({
      label: c.name,
      value: c.id,
    })) || [];

  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  // Form setup
  const form = useForm<ProductFormData>({
    defaultValues: product
      ? {
          id: product.id,
          name: product.name,
          price: product.price,
          discount: product.discount,
          stock: product.stock,
          categoryId: product.categoryId,
          description: product.description || "",
          images: product.images || [""],
        }
      : undefined,
  });

  // Deletion state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Handle update
  const onSubmit = async (data: ProductFormData) => {
    const formattedData = {
      ...data,
      price: Number(data.price),
      discount: Number(data.discount),
      stock: Number(data.stock),
    };
    try {
      await updateProduct(formattedData).unwrap();
      refetch();
      showToast("Product updated successfully", "success");
    } catch (err) {
      console.error("Failed to update product:", err);
      showToast("Failed to update product", "error");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      await deleteProduct(id as string).unwrap();
      showToast("Product deleted successfully", "success");
      router.push("/dashboard/products");
    } catch (err) {
      console.error("Failed to delete product:", err);
      showToast("Failed to delete product", "error");
    }
  };

  if (productsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-t-teal-600 border-r-teal-200 border-b-teal-200 border-l-teal-200 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium">
          Loading product details...
        </p>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <XCircle size={48} className="text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error Loading Product
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn&apos;t retrieve the product information. Please try again
            later.
          </p>
          <button
            onClick={() => router.push("/dashboard/products")}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Return to Products
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <AlertCircle size={48} className="text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The product with ID #{id} could not be found.
          </p>
          <button
            onClick={() => router.push("/dashboard/products")}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Return to Products
          </button>
        </div>
      </div>
    );
  }

  const formattedPrice =
    typeof product.price === "number"
      ? `$${product.price.toFixed(2)}`
      : "$0.00";

  const hasDiscount = product.discount && product.discount > 0;
  const discountedPrice = hasDiscount
    ? `$${(product.price * (1 - product.discount / 100)).toFixed(2)}`
    : null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Navigation Bar */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/dashboard/products")}
            className="flex items-center gap-2 text-teal-600 hover:text-teal-800 font-medium transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Back to Products</span>
          </button>
        </div>

        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-teal-100 p-3 rounded-full">
                <Package className="text-teal-600" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {product.name}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-semibold text-gray-900">
                    {formattedPrice}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-sm text-gray-500 line-through">
                        {formattedPrice}
                      </span>
                      <span className="text-sm bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">
                        {product.discount}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.stock > 10
                    ? "bg-green-100 text-green-700"
                    : product.stock > 0
                    ? "bg-amber-100 text-amber-700"
                    : "bg-rose-100 text-rose-700"
                }`}
              >
                {product.stock > 10
                  ? "In Stock"
                  : product.stock > 0
                  ? "Low Stock"
                  : "Out of Stock"}
              </span>
              <button
                onClick={() => setIsConfirmModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-rose-100 text-rose-700 rounded-md hover:bg-rose-200 transition-colors disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
                <span className="hidden sm:inline">
                  {isDeleting ? "Deleting..." : "Delete"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Summary Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">
                  Product Summary
                </h2>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {/* Product ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Product ID
                    </label>
                    <p className="font-medium text-gray-800">{product.id}</p>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Category
                    </label>
                    <p className="font-medium text-gray-800">
                      {categoriesData?.categories.find(
                        (c) => c.id === product.categoryId
                      )?.name || "Uncategorized"}
                    </p>
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Stock Level
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">
                        {product.stock} units
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          product.stock > 10
                            ? "bg-green-100 text-green-700"
                            : product.stock > 0
                            ? "bg-amber-100 text-amber-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {product.stock > 10
                          ? "In Stock"
                          : product.stock > 0
                          ? "Low Stock"
                          : "Out of Stock"}
                      </span>
                    </div>
                  </div>

                  {/* Price Details */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Price Details
                    </label>
                    <div>
                      <p className="font-medium text-gray-800">
                        Base Price: {formattedPrice}
                      </p>
                      {hasDiscount && (
                        <>
                          <p className="text-sm text-gray-600">
                            Discount: {product.discount}%
                          </p>
                          <p className="font-medium text-teal-600">
                            Final Price: {discountedPrice}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="text-base font-medium text-gray-800 mb-4">
                    Quick Actions
                  </h3>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                      onClick={() => form.handleSubmit(onSubmit)()}
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Save size={16} />
                      )}
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                      onClick={() =>
                        router.push(
                          `/dashboard/products/inventory/${product.id}`
                        )
                      }
                    >
                      <Archive size={16} />
                      Manage Inventory
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">
                  Edit Product
                </h2>
              </div>

              <div className="p-6">
                <ProductForm
                  form={form}
                  onSubmit={onSubmit}
                  categories={categories}
                  isLoading={isUpdating}
                  submitLabel={isUpdating ? "Saving..." : "Save Changes"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        message="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmModalOpen(false)}
      />
    </div>
  );
};

export default ProductDetailPage;
