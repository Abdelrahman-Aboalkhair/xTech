"use client";
import React from "react";
import { useForm } from "react-hook-form";
import FilterBar from "@/app/components/organisms/FilterBar";
import ProductSection from "@/app/components/sections/products/ProductSection";
import { useGetAllCategoriesQuery } from "@/app/store/apis/CategoryApi";
import useQueryParams from "@/app/hooks/network/useQueryParams";
import Topbar from "@/app/components/layout/Topbar";
import Navbar from "@/app/components/layout/Navbar";

const ShopPage = () => {
  const { query } = useQueryParams();
  console.log("query: ", query);
  const {
    control,
    formState: { errors },
  } = useForm();

  const { data: categoryData } = useGetAllCategoriesQuery({});
  console.log("categoryData: ", categoryData);

  const sortOptions = [
    "Price: Low to High",
    "Price: High to Low",
    "Newest",
    "Popularity",
  ];
  const queryParams = {
    ...query,
  };

  return (
    <>
      <Topbar />
      <Navbar />
      <div className="flex">
        <FilterBar
          sortOptions={sortOptions}
          filterOptions={categoryData?.categories || []}
          control={control}
          errors={errors}
          filterBy="filterBy"
          sortBy="sortBy"
        />
        <ProductSection title="Shop now" queryParams={queryParams} />
      </div>
    </>
  );
};

export default ShopPage;
