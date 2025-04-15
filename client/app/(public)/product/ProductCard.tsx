"use client";
import React from "react";
import { Heart, Eye, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/app/types/productTypes";
import Image from "next/image";
import Link from "next/link";
import { useAddToCartMutation } from "@/app/store/apis/CartApi";
import Rating from "@/app/components/feedback/Rating";

interface ProductCardProps {
  product: Product;
  hoveredProductId: string | null;
  setHoveredProductId: (id: string | null) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  hoveredProductId,
  setHoveredProductId,
}) => {
  const [addToCart, { isLoading }] = useAddToCartMutation();
  const isHovered = hoveredProductId === product.id;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any bubbling that might trigger unwanted navigation
    try {
      await addToCart({ productId: product.id, quantity: 1 }).unwrap();
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden relative group h-full flex flex-col"
      onHoverStart={() => setHoveredProductId(product.id)}
      onHoverEnd={() => setHoveredProductId(null)}
      initial={{ opacity: 0.9 }}
      whileHover={{ scale: 1.03, opacity: 1 }}
      transition={{ duration: 0.3 }}
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

      {/* Details Container - Flex Grow to take available space */}
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
                ({product.ratings})
              </span>
            </div>
          </div>
        </Link>

        {/* Button Container - Always takes up the same height whether visible or not */}
        <div className="h-10 mt-auto relative">
          <AnimatePresence>
            {isHovered ? (
              <motion.button
                onClick={handleAddToCart}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`absolute inset-0 w-full bg-indigo-500 text-white py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-indigo-600 transition-colors duration-300 ${
                  isLoading ? "bg-gray-400 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                <ShoppingCart size={16} />
                <span>Add to Cart</span>
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex items-center"
              >
                <span className="text-sm text-gray-500">
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
