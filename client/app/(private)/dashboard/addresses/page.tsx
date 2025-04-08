"use client";
import Table from "@/app/components/layout/Table";
import { useGetAllAddressesQuery } from "@/app/store/apis/AddressApi";
import React from "react";

const Addresses = () => {
  const { data, isLoading, error } = useGetAllAddressesQuery({});

  if (error) {
    console.log("error: ", error);
  }

  const addresses = data?.addresses || [];

  // Define the columns for the Table component
  const columns = [
    {
      key: "id",
      label: "Address ID",
      sortable: true,
    },
    {
      key: "street",
      label: "Street",
      sortable: true,
    },
    {
      key: "city",
      label: "City",
      sortable: true,
    },
    {
      key: "state",
      label: "State",
      sortable: true,
    },
    {
      key: "country",
      label: "Country",
      sortable: true,
    },
    {
      key: "zipCode",
      label: "Zip Code",
      sortable: true,
    },
  ];

  return (
    <>
      <Table data={addresses} columns={columns} isLoading={isLoading} />
    </>
  );
};

export default Addresses;
