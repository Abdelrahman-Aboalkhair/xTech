"use client";
import React from "react";
import { Heart, Eye, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/app/types/productTypes";
import Image from "next/image";
import Link from "next/link";
import Rating from "../../feedback/Rating";
import { useAddToCartMutation } from "@/app/store/apis/CartApi";

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

  const handleAddToCart = async () => {
    try {
      await addToCart({ productId: product.id, quantity: 1 }).unwrap();
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden relative group"
      onHoverStart={() => setHoveredProductId(product.id)}
      onHoverEnd={() => setHoveredProductId(null)}
      initial={{ opacity: 0.9 }}
      whileHover={{ scale: 1.03, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image */}
      <div className="relative w-full h-48 bg-gray-50 flex items-center justify-center">
        <Image
          src={product.images[0]}
          alt={product.name}
          width={180}
          height={180}
          className="object-cover"
        />
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2 z-10">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-white rounded-full p-2 shadow-sm hover:bg-gray-100 transition"
          >
            <Heart size={18} className="text-gray-600" />
          </motion.button>
          <Link href={`/product/${product.slug}`}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-white rounded-full p-2 shadow-sm hover:bg-gray-100 transition"
            >
              <Eye size={18} className="text-gray-600" />
            </motion.div>
          </Link>
        </div>
      </div>

      {/* Details */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-lg mb-2 line-clamp-1">
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

        <AnimatePresence>
          {hoveredProductId === product.id && (
            <motion.button
              onClick={handleAddToCart}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className={`w-full bg-indigo-500 text-white py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-indigo-600 transition-colors duration-300 ${
                isLoading ? "bg-gray-400 cursor-not-allowed" : ""
              }`}
            >
              <ShoppingCart size={16} />
              <span>Add to Cart</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ProductCard;
