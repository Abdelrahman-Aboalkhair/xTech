"use client";
import Table from "@/app/components/layout/Table";
import { useGetAllPaymentsQuery } from "@/app/store/apis/PaymentApi";
import React from "react";

const Payments = () => {
  const { data, isLoading, error } = useGetAllPaymentsQuery({});

  if (error) {
    console.log("error: ", error);
  }

  const payments = data?.payments || [];

  // Define the columns for the Table component
  const columns = [
    {
      key: "id",
      label: "Payment ID",
      sortable: true,
    },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (row: any) => `$${row.amount.toFixed(2)}`,
    },
    {
      key: "paymentMethod",
      label: "Payment Method",
      sortable: true,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
    },
    {
      key: "createdAt",
      label: "Date",
      sortable: true,
      render: (row: any) => new Date(row.createdAt).toLocaleString(),
    },
  ];

  return (
    <>
      <Table data={payments} columns={columns} isLoading={isLoading} />
    </>
  );
};

export default Payments;
