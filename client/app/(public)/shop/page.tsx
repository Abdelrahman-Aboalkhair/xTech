import React from "react";
import FilterBar from "@/app/components/organisms/FilterBar";
import MainLayout from "@/app/components/templates/MainLayout";
import ProductSection from "../product/ProductSection";

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
