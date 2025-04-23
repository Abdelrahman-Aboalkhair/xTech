import React from "react";
import FilterBar from "@/app/components/organisms/FilterBar";
import MainLayout from "@/app/components/templates/MainLayout";
import ProductSection from "../product/ProductSection";
import { GET_ALL_PRODUCTS } from "@/app/gql/Product";

const ShopPage = () => {
  return (
    <MainLayout>
      <div className="flex items-start justify-between w-full">
        <FilterBar />
        <ProductSection title="Shop now" query={GET_ALL_PRODUCTS} />
      </div>
    </MainLayout>
  );
};

export default ShopPage;
