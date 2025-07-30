"use client";
import MainLayout from "@/app/components/templates/MainLayout";
import BreadCrumb from "@/app/components/feedback/BreadCrumb";
import { useParams } from "next/navigation";
import ProductImageGallery from "../ProductImageGallery";
import ProductInfo from "../ProductInfo";

const ProductDetailsPage = () => {
  const { slug } = useParams();

  const product = {
    name: "Sample Product",
    id: "1",
    description: "This is a sample product description.",
    price: 29.99,
    images: [],
  }; // Replace with actual product fetching logic

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
        <ProductImageGallery
          images={product.images}
          defaultImage={product.images[0]}
          name={product.name}
        />
        <div>
          <ProductInfo
            id={product.id}
            name={product.name}
            description={product.description || "No description available"}
            price={product.price}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetailsPage;
