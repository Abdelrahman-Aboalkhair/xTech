"use client";
import React, { useState } from "react";
import { Product } from "@/app/types/productTypes";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import ProductCard from "./ProductCard";
import PaginationComponent from "@/app/components/organisms/Pagination";
import { useQuery } from "@apollo/client";
import { GET_ALL_PRODUCTS } from "@/app/gql/Product";

interface ProductSectionProps {
  title: string;
  showTitle?: boolean;
  viewAllButton?: boolean;
  showPagination?: boolean;
}

const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  showTitle = false,
  viewAllButton = false,
  showPagination = false,
}) => {
  const { data, loading, error } = useQuery(GET_ALL_PRODUCTS);
  console.log("data from gql => ", data);
  console.log("error => ", error);
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);

  const noProductsFound = data?.products?.length === 0;

  return (
    <div className="w-full p-8">
      {(showTitle || viewAllButton) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-[2rem]"
        >
          {showTitle && (
            <div className="flex items-center space-x-3">
              <div className="h-6 w-1 rounded-full bg-primary"></div>
              <span className="ml-2 text-md font-semibold tracking-wider text-gray-700 uppercase">
                {title}
              </span>
            </div>
          )}
          {viewAllButton && (
            <button className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-300 font-medium">
              View All
            </button>
          )}
        </motion.div>
      )}

      {loading && (
        <div className="text-center py-12">
          <Package
            size={48}
            className="mx-auto text-gray-400 mb-4 animate-pulse"
          />
          <p className="text-lg text-gray-600">Loading products...</p>
        </div>
      )}
      {error && (
        <div className="text-center py-12">
          <p className="text-lg text-red-500">Error loading products</p>
        </div>
      )}
      {noProductsFound && !loading && !error && (
        <div className="text-center py-12">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-lg text-gray-600">No products found</p>
        </div>
      )}

      {/* Product Grid */}
      {!loading && !error && !noProductsFound && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data?.products.map((product: Product) => (
              <ProductCard
                key={product.id}
                product={product}
                hoveredProductId={hoveredProductId}
                setHoveredProductId={setHoveredProductId}
              />
            ))}
          </div>

          {showPagination && data?.totalPages > 1 && (
            <div className="mt-8">
              <PaginationComponent totalPages={data.totalPages} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductSection;
