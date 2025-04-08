"use client";
import React from "react";
import { Heart, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/app/types/productTypes";
import Image from "next/image";
import Link from "next/link";
import Rating from "../../feedback/Rating";
import { useAddToCartMutation } from "@/app/store/apis/CartApi";
import CustomLoader from "../../feedback/CustomLoader";

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
  const [addToCart, { isLoading, error }] = useAddToCartMutation();

  if (error) {
    console.error("Error adding to cart:", error);
  }

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart({
        productId: product.id,
        quantity: 1,
      }).unwrap();
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <motion.div
      key={product.id}
      className="flex flex-col items-center justify-center bg-white rounded-md shadow-md overflow-hidden relative group"
      onHoverStart={() => setHoveredProductId(product.id)}
      onHoverEnd={() => setHoveredProductId(null)}
      initial={{ opacity: 0.9 }}
      whileHover={{
        scale: 1.05,
        opacity: 1,
        transition: { duration: 0.3 },
      }}
    >
      <div className="absolute top-4 right-4 flex space-x-2 z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-white/70 rounded-full p-2 hover:bg-white/90 transition"
        >
          <Heart size={20} className="text-gray-600" />
        </motion.button>
        <Link
          href={`/product/${product.slug}`}
          className="bg-white/70 rounded-full p-2 hover:bg-white/90 transition"
        >
          <Eye size={20} className="text-gray-600" />
        </Link>
      </div>

      <Image
        src={product.images[0]}
        alt={product.name}
        width={140}
        height={140}
        className="block mx-auto"
      />

      <div className="p-4 relative">
        <h3 className="font-medium text-lg mb-2">{product.name}</h3>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-red-500 font-semibold mr-2">
              ${product.price}
            </span>
            <span className="text-gray-400 line-through">
              ${product.discount + product.price}
            </span>
          </div>

          <div className="flex items-center">
            <Rating rating={product.averageRating} />
            <span className="text-gray-500 ml-2 text-sm">
              ({product.ratings})
            </span>
          </div>
        </div>

        <AnimatePresence>
          {hoveredProductId === product.id && (
            <motion.button
              onClick={() => handleAddToCart(product)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{
                duration: 0.1,
                bounce: 0.3,
                ease: "easeInOut",
              }}
              disabled={isLoading}
              className={`absolute bottom-0 left-0 right-0 bg-primary text-white py-2 transition z-20 ${
                isLoading ? "cursor-not-allowed bg-gray-700 " : ""
              }`}
            >
              {isLoading ? <CustomLoader /> : "Add to Cart"}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ProductCard;
