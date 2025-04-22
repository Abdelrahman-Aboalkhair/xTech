"use client";
import React, { useEffect } from "react";
import { Heart, Eye } from "lucide-react";
import { Product } from "@/app/types/productTypes";
import Image from "next/image";
import Link from "next/link";
import Rating from "@/app/components/feedback/Rating";
import useTrackInteraction from "@/app/hooks/miscellaneous/useTrackInteraction";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product;
  hoveredProductId: string | null;
  setHoveredProductId: (id: string | null) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  setHoveredProductId,
}) => {
  const { trackInteraction } = useTrackInteraction();
  const router = useRouter();

  useEffect(() => {
    trackInteraction(product.id, "view");
  }, [product.id, trackInteraction]);

  const handleClick = () => {
    trackInteraction(product.id, "click");
    router.push(`/product/${product.slug}`);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden relative h-full flex flex-col"
      onMouseEnter={() => setHoveredProductId(product.id)}
      onMouseLeave={() => setHoveredProductId(null)}
      onClick={handleClick}
    >
      {/* Image Container */}
      <div className="relative w-full h-40 bg-gray-50 flex items-center justify-center overflow-hidden">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={product.images[0]}
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

        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
            {Math.round(
              (product.discount / (product.price + product.discount)) * 100
            )}
            % OFF
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-grow">
        <Link href={`/product/${product.slug}`} className="block flex-grow">
          <h3 className="font-medium text-gray-800 text-base mb-1.5 line-clamp-1 hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5">
              <span className="text-indigo-500 font-medium text-sm">
                ${product.price.toFixed(2)}
              </span>
              {product.discount > 0 && (
                <span className="text-gray-400 line-through text-xs">
                  ${(product.price + product.discount).toFixed(2)}
                </span>
              )}
            </div>
            <div className="flex items-center">
              <Rating rating={product.averageRating} />
              <span className="text-gray-500 text-xs ml-1">
                ({product.reviewCount || 0} reviews)
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
