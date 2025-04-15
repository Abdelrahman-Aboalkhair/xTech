"use client";
import React, { useState } from "react";
import { useGetAllProductsQuery } from "@/app/store/apis/ProductApi";
import { Product } from "@/app/types/productTypes";
import useQueryParams from "@/app/hooks/network/useQueryParams";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import ProductCard from "./ProductCard";
import PaginationComponent from "@/app/components/organisms/Pagination";

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
  const { query } = useQueryParams();
  const { data, isLoading, isError } = useGetAllProductsQuery(query);
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);

  const noProductsFound = data?.products?.length === 0;

  return (
    <div className="w-full p-8">
      {/* Header */}
      {(showTitle || viewAllButton) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-[2rem]"
        >
          {showTitle && (
            <div className="flex items-center space-x-3">
              <div className="h-6 w-1 rounded-full bg-gradient-to-b from-indigo-500 to-purple-600"></div>
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

      {/* Pagination Info */}
      {showPagination && data && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm text-gray-600 mb-6"
        >
          Showing {data.totalResults} results
          {data.currentPage && ` (Page ${data.currentPage})`}
          {data.totalResults > 0 && data.resultsPerPage
            ? `, ${data.resultsPerPage} items per page`
            : ""}
        </motion.p>
      )}

      {/* Loading/Error/Empty States */}
      {isLoading && (
        <div className="text-center py-12">
          <Package
            size={48}
            className="mx-auto text-gray-400 mb-4 animate-pulse"
          />
          <p className="text-lg text-gray-600">Loading products...</p>
        </div>
      )}
      {isError && (
        <div className="text-center py-12">
          <p className="text-lg text-red-500">Error loading products</p>
        </div>
      )}
      {noProductsFound && !isLoading && !isError && (
        <div className="text-center py-12">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-lg text-gray-600">No products found</p>
        </div>
      )}

      {/* Product Grid */}
      {!isLoading && !isError && !noProductsFound && (
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
