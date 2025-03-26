"use client";
import { useGetProductBySlugQuery } from "@/app/store/apis/ProductApi";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Minus, Plus, Heart } from "lucide-react";
import MainLayout from "@/app/components/templates/MainLayout";
import BreadCrumb from "@/app/components/feedback/BreadCrumb";

const ProductDetailsPage = ({ params }: { params: { slug: string } }) => {
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    params.then((resolvedParams) => {
      setSlug(resolvedParams.slug);
    });
  }, [params]);
  const [quantity, setQuantity] = useState(1);
  const { data } = useGetProductBySlugQuery(slug || "");

  if (!data || !data.success) return <div>Loading...</div>;

  const product = data.product;
  const discountedPrice = (
    product.price *
    (1 - product.discount / 100)
  ).toFixed(2);

  return (
    <MainLayout>
      <BreadCrumb />

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10 pt-[3rem]">
        <div className="flex gap-4">
          <div className="flex flex-col gap-4">
            {product.images.map((img: string, index: number) => (
              <Image
                key={index}
                src={img}
                alt={product.name}
                width={80}
                height={80}
                className="rounded-lg border cursor-pointer hover:opacity-80"
              />
            ))}
          </div>
          <Image
            src={product.images[0]}
            alt={product.name}
            width={500}
            height={500}
            className="rounded-lg"
          />
        </div>

        <div className="flex flex-col items-start justify-start gap-2 ml-12">
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <div className="flex items-center gap-2">
            <p className="text-lg font-semibold text-gray-700">
              ${discountedPrice}
            </p>
            {product.discount > 0 && (
              <p className="text-sm text-gray-500 line-through">
                ${product.price}
              </p>
            )}
          </div>
          <p className="text-sm text-gray-600">{product.description}</p>

          {/* Size Options */}
          <div className="mt-4">
            <p className="font-medium">Size:</p>
            <div className="flex gap-2 mt-1">
              {["XS", "S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  className="border rounded px-3 py-1 hover:bg-gray-100"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center border rounded">
              <button
                className="p-2"
                onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
              >
                <Minus size={16} />
              </button>
              <p className="px-4">{quantity}</p>
              <button
                className="p-2"
                onClick={() => setQuantity((prev) => prev + 1)}
              >
                <Plus size={16} />
              </button>
            </div>
            <button className="bg-primary text-white px-6 py-2 rounded hover:bg-red-600">
              Buy Now
            </button>
            <button className="border p-2 rounded hover:bg-gray-100">
              <Heart size={20} />
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 border-t pt-4">
            <p className="text-gray-600">✔ Free Delivery</p>
            <p className="text-gray-600">↩ Free 30 Days Return</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetailsPage;
