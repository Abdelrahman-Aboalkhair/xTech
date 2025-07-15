"use client";
import React from "react";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { ApolloError } from "@apollo/client";
import ProductCard from "./ProductCard";
import { Product } from "@/app/types/productTypes";

interface ProductSectionProps {
  title: string;
  products: Product[];
  loading: boolean;
  error: ApolloError | undefined;
  showTitle?: boolean;
}

const ProductSection: React.FC<ProductSectionProps> = ({ title, products, loading, error, showTitle = false }) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-red-500">Error loading {title.toLowerCase()}: {error.message}</p>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center py-12">
        <Package size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-lg text-gray-600">No {title.toLowerCase()} found</p>
      </div>
    );
  }

  return (
    <div className="w-full p-12">
      {showTitle && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-[2rem]"
        >
          <div className="flex items-center space-x-3">
            <div className="h-6 w-1 rounded-full bg-primary"></div>
            <span className="ml-2 text-xl font-extrabold font-sans tracking-wide text-gray-700 capitalize">
              {title}
            </span>
          </div>
        </motion.div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(ProductSection);