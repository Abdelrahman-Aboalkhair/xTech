"use client";
import React from "react";
import { Heart, Eye } from "lucide-react";
import { Product } from "@/app/types/productTypes";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden relative h-full flex flex-col">
      {/* Image Container */}
      <div className="relative w-full h-40 bg-gray-50 flex items-center justify-center overflow-hidden">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={product.images[0] || "/placeholder-image.jpg"}
            alt={product.name}
            width={160}
            height={160}
            className="object-contain mx-auto"
          />
        </Link>

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex space-x-1 z-10">
          <button
            className="bg-white rounded-full p-1.5 shadow-sm hover:bg-gray-100 transition"
            aria-label="Add to wishlist"
          >
            <Heart size={16} className="text-gray-600" />
          </button>
          <Link href={`/product/${product.slug}`}>
            <div
              className="bg-white rounded-full p-1.5 shadow-sm hover:bg-gray-100 transition"
              aria-label="View product details"
            >
              <Eye size={16} className="text-gray-600" />
            </div>
          </Link>
        </div>
      </div>

      <div className="p-3 flex flex-col flex-grow">
        <Link href={`/product/${product.slug}`} className="block flex-grow">
          <h3 className="font-medium text-gray-800 text-base mb-1.5 line-clamp-1 hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
