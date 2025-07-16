"use client";
import { useState } from "react";
import MainLayout from "@/app/components/templates/MainLayout";
import BreadCrumb from "@/app/components/feedback/BreadCrumb";
import { useParams } from "next/navigation";
import ProductImageGallery from "../ProductImageGallery";
import ProductInfo from "../ProductInfo";
import ProductReviews from "../ProductReviews";
import { useQuery } from "@apollo/client";
import { GET_SINGLE_PRODUCT, Product } from "@/app/gql/Product";
import CustomLoader from "@/app/components/feedback/CustomLoader";

const ProductDetailsPage = () => {
  const { slug } = useParams();
  const { data, loading, error } = useQuery<{ product: Product }>(
    GET_SINGLE_PRODUCT,
    {
      variables: { slug: typeof slug === "string" ? slug : slug[0] },
      fetchPolicy: "no-cache",
    }
  );

  const [selectedVariant, setSelectedVariant] = useState<
    Product["variants"][0] | null
  >(null);

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

  // Group attributes by type for variant selection
  const attributeGroups = product.variants.reduce((acc, variant) => {
    variant.attributes.forEach(({ attribute, value }) => {
      if (!acc[attribute.name]) {
        acc[attribute.name] = {
          type: attribute.type,
          values: new Set<string>(),
        };
      }
      acc[attribute.name].values.add(value.value);
    });
    return acc;
  }, {} as Record<string, { type: string; values: Set<string> }>);

  // Handle variant selection based on attribute values
  const handleVariantChange = (attributeName: string, value: string) => {
    const variant = product.variants.find((v) =>
      v.attributes.some(
        (attr) =>
          attr.attribute.name === attributeName && attr.value.value === value
      )
    );
    setSelectedVariant(variant || null);
  };

  return (
    <MainLayout>
      <div className="flex items-start justify-start mt-8 px-[10%]">
        <BreadCrumb />
      </div>

      <div className="w-[84%] mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10 pt-[3rem] bg-white rounded">
        <ProductImageGallery images={product.images} name={product.name} />
        <div>
          <ProductInfo
            id={product.id}
            name={product.name}
            averageRating={product.averageRating}
            reviewCount={product.reviewCount}
            description={product.description || "No description available"}
            variants={product.variants}
            selectedVariant={selectedVariant}
            onVariantChange={handleVariantChange}
            attributeGroups={attributeGroups}
          />
        </div>
      </div>

      <div className="w-[84%] mx-auto p-6">
        <ProductReviews reviews={product.reviews} productId={product.id} />
      </div>
    </MainLayout>
  );
};

export default ProductDetailsPage;
