"use client";
import React, { useState } from "react";
import { Heart, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Define the product type
interface Product {
  id: number;
  name: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
}

const BestSellingSection: React.FC = () => {
  // State to track which product is being hovered
  const [hoveredProductId, setHoveredProductId] = useState<number | null>(null);

  // Placeholder product data
  const products: Product[] = [
    {
      id: 1,
      name: "HAVIT HV-G92 Gamepad",
      originalPrice: 160,
      discountedPrice: 120,
      discountPercentage: 40,
      rating: 5,
      reviewCount: 88,
    },
    {
      id: 2,
      name: "AK-900 Wired Keyboard",
      originalPrice: 160,
      discountedPrice: 960,
      discountPercentage: 35,
      rating: 5,
      reviewCount: 75,
    },
    {
      id: 3,
      name: "IPS LCD Gaming Monitor",
      originalPrice: 400,
      discountedPrice: 370,
      discountPercentage: 30,
      rating: 5,
      reviewCount: 99,
    },
    {
      id: 4,
      name: "S-Series Comfort Chair",
      originalPrice: 400,
      discountedPrice: 375,
      discountPercentage: 25,
      rating: 5,
      reviewCount: 99,
    },
  ];

  // Render star rating
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
    <div className="container mx-auto px-4 py-[5%]">
      {/* Header Section with Title & Button */}
      <div className="flex items-center justify-between mb-8">
        <h2
          className="text-2xl font-semibold capitalize relative before:content-[''] 
        before:absolute before:left-0 before:top-[-2px] before:w-[6px] before:rounded before:h-[2.5rem] before:bg-[#db4444] text-[#db4444] pl-6"
        >
          Best selling products
        </h2>

        <button className="bg-primary text-white px-8 py-[12px] rounded-sm tracking-wider hover:bg-red-600 transition">
          View All
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
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
                    ${product.originalPrice}
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
    </div>
  );
};

export default BestSellingSection;
