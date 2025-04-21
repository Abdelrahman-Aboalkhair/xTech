"use client";
import React, { useEffect } from "react";
import { Heart, Eye } from "lucide-react";
import { motion } from "framer-motion";
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
    <motion.div
      className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden relative group h-full flex flex-col"
      onHoverStart={() => setHoveredProductId(product.id)}
      onHoverEnd={() => setHoveredProductId(null)}
      initial={{ opacity: 0.9 }}
      whileHover={{ scale: 1.03, opacity: 1 }}
      transition={{ duration: 0.3 }}
      onClick={handleClick}
    >
      {/* Image Container */}
      <div className="relative w-full h-48 bg-gray-50 flex items-center justify-center overflow-hidden">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={180}
            height={180}
            className="object-contain mx-auto transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2 z-10">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-white rounded-full p-2 shadow-sm hover:bg-gray-100 transition"
            aria-label="Add to wishlist"
          >
            <Heart size={18} className="text-gray-600" />
          </motion.button>
          <Link href={`/product/${product.slug}`}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-white rounded-full p-2 shadow-sm hover:bg-gray-100 transition"
              aria-label="View product details"
            >
              <Eye size={18} className="text-gray-600" />
            </motion.div>
          </Link>
        </div>

        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {Math.round(
              (product.discount / (product.price + product.discount)) * 100
            )}
            % OFF
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <Link href={`/product/${product.slug}`} className="block flex-grow">
          <h3 className="font-semibold text-gray-800 text-lg mb-2 line-clamp-1 hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-indigo-500 font-semibold">
                ${product.price.toFixed(2)}
              </span>
              {product.discount > 0 && (
                <span className="text-gray-400 line-through text-sm">
                  ${(product.price + product.discount).toFixed(2)}
                </span>
              )}
            </div>
            <div className="flex items-center">
              <Rating rating={product.averageRating} />
              <span className="text-gray-500 text-sm ml-1">
                ({product.reviewCount})
              </span>
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
};

export default ProductCard;
