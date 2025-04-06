"use client";
import React, { useState } from "react";
import { useGetAllProductsQuery } from "@/app/store/apis/ProductApi";
import ProductCard from "../products/ProductCard";
import { Product } from "@/app/types/productTypes";

interface ProductSectionProps {
  title: string;
  showTitle?: boolean;
  queryParams?: object;
  viewAllButton?: boolean;
}

const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  showTitle = false,
  queryParams = {},
  viewAllButton = false,
}) => {
  const { data } = useGetAllProductsQuery(queryParams);
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);

  return (
    <div className="container mx-auto px-4 py-[3%]">
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
    </div>
  );
};

export default ProductSection;
