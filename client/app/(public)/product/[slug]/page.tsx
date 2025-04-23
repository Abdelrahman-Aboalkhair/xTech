"use client";
import MainLayout from "@/app/components/templates/MainLayout";
import BreadCrumb from "@/app/components/feedback/BreadCrumb";
import { useParams } from "next/navigation";
import ProductImageGallery from "../ProductImageGallery";
import ProductInfo from "../ProductInfo";
import ProductReviews from "../ProductReviews";
import { useQuery } from "@apollo/client";
import { GET_SINGLE_PRODUCT } from "@/app/gql/Product";

const ProductDetailsPage = () => {
  const { slug } = useParams();
  const { data, loading } = useQuery(GET_SINGLE_PRODUCT, {
    variables: { slug },
  });
  const product = data?.product;

  if (loading)
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      </MainLayout>
    );

  return (
    <MainLayout>
      <div className="flex items-start justify-start mt-8 px-[10%]">
        <BreadCrumb />
      </div>

      <div className="w-[84%] mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10 pt-[3rem] bg-white rounded">
        <ProductImageGallery images={product.images} name={product.name} />
        <ProductInfo
          id={product.id}
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
        <ProductReviews reviews={product.reviews} productId={product.id} />
      </div>
    </MainLayout>
  );
};

export default ProductDetailsPage;
