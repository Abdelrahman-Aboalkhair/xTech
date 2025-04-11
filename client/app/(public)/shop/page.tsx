import React from "react";
import FilterBar from "@/app/components/organisms/FilterBar";
import ProductSection from "@/app/components/sections/products/ProductSection";
import Header from "@/app/components/layout/Header";

const ShopPage = () => {
  return (
    <>
      <Header />
      <div className="flex items-start justify-between px-[2%]">
        <FilterBar />
        <ProductSection title="Shop now" showPagination />
      </div>
    </>
  );
};

export default ShopPage;
