"use client";
import { useGetProductBySlugQuery } from "@/app/store/apis/ProductApi";
import MainLayout from "@/app/components/templates/MainLayout";
import BreadCrumb from "@/app/components/feedback/BreadCrumb";
import { useParams } from "next/navigation";
import ProductImageGallery from "../ProductImageGallery";
import ProductInfo from "../ProductInfo";

const ProductDetailsPage = () => {
  const { slug } = useParams();
  const { data } = useGetProductBySlugQuery(slug || "");

  if (!data || !data.success) return <div>Loading...</div>;

  const product = data.product;

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
          ratings={product.ratings}
          stock={product.stock}
          price={product.price}
          discount={product.discount}
          description={product.description}
        />
      </div>
    </MainLayout>
  );
};

export default ProductDetailsPage;
