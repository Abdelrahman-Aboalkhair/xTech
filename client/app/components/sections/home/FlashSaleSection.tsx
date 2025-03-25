"use client";
import React, { useState } from "react";
import { Heart, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetAllProductsQuery } from "@/app/store/apis/ProductApi";

// Define the product type
interface Product {
  id: number;
  name: string;
  price: number;
  discountedPrice: number;
  discountPercentage: number;
  ratings: number;
  averageRating: number;
}

const FlashSaleSection: React.FC = () => {
  const { data, error } = useGetAllProductsQuery({});
  const [hoveredProductId, setHoveredProductId] = useState<number | null>(null);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-yellow-500 ${
          index < rating ? "text-opacity-100" : "text-opacity-30"
        }`}
      >
        ★
      </span>
    ));
  };

  return (
    <>
      <div className="container mx-auto px-4 py-[5%]">
        <div className="flex items-center justify-between mb-8">
          <h2
            className="text-2xl font-semibold capitalize relative before:content-[''] 
        before:absolute before:left-0 before:top-[-2px] before:w-[6px] before:rounded before:h-[2.5rem] before:bg-[#db4444] text-[#db4444] pl-6"
          >
            Today&apos; Flash Sales
          </h2>{" "}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data?.products?.map((product: Product) => (
            <motion.div
              key={product.id}
              className="bg-white rounded-md shadow-md overflow-hidden relative group"
              onHoverStart={() => setHoveredProductId(product.id)}
              onHoverEnd={() => setHoveredProductId(null)}
              initial={{ opacity: 0.9 }}
              whileHover={{
                scale: 1.05,
                opacity: 1,
                transition: { duration: 0.3 },
              }}
            >
              {/* Discount Badge */}
              <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-md text-sm z-10">
                -{product.discountPercentage}%
              </div>

              {/* Wishlist and Quick View Icons */}
              <div className="absolute top-4 right-4 flex space-x-2 z-10">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-white/70 rounded-full p-2 hover:bg-white/90 transition"
                >
                  <Heart size={20} className="text-gray-600" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-white/70 rounded-full p-2 hover:bg-white/90 transition"
                >
                  <Eye size={20} className="text-gray-600" />
                </motion.button>
              </div>

              {/* Placeholder Image */}
              <div className="bg-gray-200 h-48 w-full flex items-center justify-center">
                Placeholder Image
              </div>

              {/* Product Details */}
              <div className="p-4 relative">
                <h3 className="font-medium text-lg mb-2">{product.name}</h3>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-red-500 font-semibold mr-2">
                      ${product.discountedPrice}
                    </span>
                    <span className="text-gray-400 line-through">
                      ${product.price}
                    </span>
                  </div>

                  <div className="flex items-center">
                    {renderStars(product.rating)}
                    <span className="text-gray-500 ml-2 text-sm">
                      ({product.reviewCount})
                    </span>
                  </div>
                </div>

                <AnimatePresence>
                  {hoveredProductId === product.id && (
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{
                        duration: 0.1,
                        bounce: 0.3,
                        ease: "easeInOut",
                      }}
                      className="absolute bottom-0 left-0 right-0 bg-primary text-white py-2 hover:bg-red-600 transition z-20"
                    >
                      Add To Cart
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <button className="bg-primary text-white px-12 py-3 rounded-sm tracking-wider hover:bg-red-600 transition">
            View All Products
          </button>
        </div>
      </div>

      <div className="border-t border-gray-300" />
    </>
  );
};

export default FlashSaleSection;
