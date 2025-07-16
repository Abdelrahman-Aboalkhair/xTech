"use client";
import MainLayout from "@/app/components/templates/MainLayout";
import BreadCrumb from "@/app/components/feedback/BreadCrumb";
import { useParams } from "next/navigation";
import ProductImageGallery from "../ProductImageGallery";
import ProductInfo from "../ProductInfo";
import ProductReviews from "../ProductReviews";
import { useQuery } from "@apollo/client";
import { GET_SINGLE_PRODUCT } from "@/app/gql/Product";
import CustomLoader from "@/app/components/feedback/CustomLoader";

const ProductDetailsPage = () => {
  const { slug } = useParams();
  const { data, loading, error } = useQuery(GET_SINGLE_PRODUCT, {
    variables: { slug },
    fetchPolicy: "no-cache", // Avoid cache issues
  });

  if (loading) return <CustomLoader />;

  if (error) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-lg text-red-500">
            Error loading product: {error.message}
          </p>
        </div>
      </MainLayout>
    );
  }

  const product = data?.product;

  if (!product) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">Product not found</p>
        </div>
      </MainLayout>
    );
  }

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
          description={product.description || ""} // Add description if available
        />
      </div>

      <div className="w-[84%] mx-auto p-6">
        <ProductReviews reviews={product.reviews} productId={product.id} />
      </div>
    </MainLayout>
  );
};

export default ProductDetailsPage;
