"use client";
import { useGetProductBySlugQuery } from "@/app/store/apis/ProductApi";
import MainLayout from "@/app/components/templates/MainLayout";
import BreadCrumb from "@/app/components/feedback/BreadCrumb";
import { useParams } from "next/navigation";
import ProductImageGallery from "../ProductImageGallery";
import ProductInfo from "../ProductInfo";
import ProductReviews from "../ProductReviews";
import { useAppSelector } from "@/app/store/hooks";

const ProductDetailsPage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { slug } = useParams();
  const { data: product, isLoading } = useGetProductBySlugQuery(slug || "");

  const userId = user?.id;
  const isAdmin = user?.role === "ADMIN";

  if (isLoading)
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      </MainLayout>
    );

  if (!product || !product.success)
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-red-500">Product not found</div>
        </div>
      </MainLayout>
    );

  return (
    <MainLayout>
      <div className="flex items-start justify-start mt-8 px-[10%]">
        <BreadCrumb />
      </div>

      <div className="w-[84%] mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10 pt-[3rem]">
        <ProductImageGallery images={product.images} name={product.name} />
        <ProductInfo
          name={product.name}
          averageRating={product.averageRating}
          reviewCount={product.reviewCount}
          stock={product.stock}
          price={product.price}
          discount={product.discount}
          description={product.description}
        />
      </div>

      <div className="w-[84%] mx-auto p-6">
        <ProductReviews
          productId={product.id}
          userId={userId}
          isAdmin={isAdmin}
        />
      </div>
    </MainLayout>
  );
};

export default ProductDetailsPage;
