"use client";
import React, { useState } from "react";
import { useGetAllProductsQuery } from "@/app/store/apis/ProductApi";
import ProductCard from "../products/ProductCard";
import { Product } from "@/app/types/productTypes";
import useQueryParams from "@/app/hooks/network/useQueryParams";

interface ProductSectionProps {
  title: string;
  showTitle?: boolean;
  viewAllButton?: boolean;
}

const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  showTitle = false,
  viewAllButton = false,
}) => {
  const { query } = useQueryParams();
  const { data, isLoading, isError } = useGetAllProductsQuery(query);
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);

  // Handle the case where no products are found
  const noProductsFound = data?.products.length === 0;

  return (
    <div className="px-[3.5%] py-[3%] w-full">
      <div className="flex items-center justify-between mb-8">
        {showTitle && (
          <h2
            className="text-2xl font-semibold capitalize relative before:content-[''] 
         before:absolute before:left-0 before:top-[-2px] before:w-[6px] before:rounded before:h-[2.5rem] before:bg-[#db4444] text-[#db4444] pl-6"
          >
            {title}
          </h2>
        )}
        {viewAllButton && (
          <button className="bg-primary text-white px-8 py-[12px] rounded-sm tracking-wider hover:bg-red-600 transition">
            View All
          </button>
        )}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="text-center text-gray-500">Loading products...</div>
      )}

      {/* Error state */}
      {isError && (
        <div className="text-center text-red-500">
          An error occurred while loading products.
        </div>
      )}

      {/* No products found */}
      {noProductsFound && (
        <div className="text-center text-gray-500">
          No products found. Please try adjusting your filters.
        </div>
      )}

      {/* Display products if available */}
      {!isLoading && !isError && !noProductsFound && (
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
      )}
    </div>
  );
};

export default ProductSection;
