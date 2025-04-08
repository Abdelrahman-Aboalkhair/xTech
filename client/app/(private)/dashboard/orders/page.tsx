"use client";
import Table from "@/app/components/layout/Table";
import { useGetAllOrdersQuery } from "@/app/store/apis/OrderApi";
import React from "react";

const Orders = () => {
  const { data, isLoading, error } = useGetAllOrdersQuery({});
  if (error) {
    console.log("error: ", error);
  }
  const orders = data?.orders || [];
  console.log("orders => ", orders);

  // Define the columns for the Table component
  const columns = [
    {
      key: "id",
      label: "Order ID",
      sortable: true,
    },
    {
      key: "orderDate",
      label: "Order Date",
      sortable: true,
      render: (row: any) => new Date(row.orderDate).toLocaleString(),
    },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (row: any) => `$${row.amount.toFixed(2)}`,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
    },
    {
      key: "orderItems",
      label: "Order Items",
      render: (row: any) =>
        row.orderItems.map((item: any) => item.product.name).join(", "),
    },
    {
      key: "tracking.status",
      label: "Tracking Status",
      render: (row: any) => row.tracking?.status || "Not available",
    },
  ];

  return (
    <>
      <Table data={orders} columns={columns} isLoading={isLoading} />
    </>
  );
};

export default Orders;
