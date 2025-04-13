import React from "react";
import FilterBar from "@/app/components/organisms/FilterBar";
import ProductSection from "@/app/components/sections/products/ProductSection";
import MainLayout from "@/app/components/templates/MainLayout";

const ShopPage = () => {
  return (
    <MainLayout>
      <div className="flex items-start justify-between w-full">
        <FilterBar />
        <ProductSection title="Shop now" showPagination />
      </div>
    </MainLayout>
  );
};

export default ShopPage;
