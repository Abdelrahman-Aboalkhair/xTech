"use client";
import React from "react";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import ProductCard from "./ProductCard";
import { useApolloClient } from "@apollo/client";

interface ProductSectionProps {
  title: string;
  dataKey: string;
  showTitle?: boolean;
}

const ProductSection: React.FC<ProductSectionProps> = ({ title, dataKey, showTitle = false }) => {
  const client = useApolloClient();
  const pageSize = 8;
  const cachedData = client.readQuery({ query: GET_HOME_PAGE_DATA, variables: { first: pageSize, skip: 0 } }) as any;
  const sectionData = cachedData?.[dataKey] as { products: any[]; hasMore: boolean } | undefined;
  const products = sectionData?.products || [];
  const hasMore = sectionData?.hasMore || false;

  const handleShowMore = () => {
    client.query({
      query: GET_HOME_PAGE_DATA,
      variables: { first: pageSize, skip: products.length },
      fetchPolicy: "cache-first", // Use cache, fall back to network if needed
    }).then((result) => {
      const newSectionData = result.data?.[dataKey] as { products: any[]; hasMore: boolean } | undefined;
      if (newSectionData) {
        client.writeQuery({
          query: GET_HOME_PAGE_DATA,
          variables: { first: pageSize, skip: 0 },
          data: {
            [dataKey]: {
              ...newSectionData,
              products: [...products, ...newSectionData.products],
            },
          },
        });
      }
    });
  };

  if (!products.length) {
    return (
      <div className="text-center py-12">
        <Package size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-lg text-gray-600">No products found</p>
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
      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={handleShowMore}
            className="bg-primary text-white px-8 py-3 rounded transition-colors duration-300 font-medium"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
};

export default React.memo(ProductSection);

import { GET_HOME_PAGE_DATA } from "../../gql/queries"; // Add this import at the top