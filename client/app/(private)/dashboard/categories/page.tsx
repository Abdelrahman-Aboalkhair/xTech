"use client";
import Table from "@/app/components/layout/Table";
import { useGetAllCategoriesQuery } from "@/app/store/apis/CategoryApi";
import React from "react";

const Categories = () => {
  const { data, isLoading, error } = useGetAllCategoriesQuery({});
  if (error) {
    console.log("error: ", error);
  }
  const categories = data?.categories || [];
  console.log("categories => ", categories);

  const columns = [
    {
      key: "slug",
      label: "Slug",
      sortable: true,
    },
    {
      key: "name",
      label: "Category Name",
      sortable: true,
    },
  ];

  return (
    <>
      <Table data={categories} columns={columns} isLoading={isLoading} />
    </>
  );
};

export default Categories;
