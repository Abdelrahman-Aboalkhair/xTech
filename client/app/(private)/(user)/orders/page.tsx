"use client";
import Table from "@/app/components/layout/Table";
import MainLayout from "@/app/components/templates/MainLayout";
import { useGetUserOrdersQuery } from "@/app/store/apis/OrderApi";
import Link from "next/link";
import React from "react";

const UserOrders = () => {
  const { data, isLoading, error } = useGetUserOrdersQuery({});
  console.log("data => ", data);
  if (error) {
    console.log("error: ", error);
  }
  const orders = data?.orders || [];
  console.log("orders => ", orders);

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
      key: "order.tracking",
      label: "Links",
      render: (row: any) => (
        <Link href={`/orders/${row.id}`}>Track your order</Link>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="p-8">
        <Table data={orders} columns={columns} isLoading={isLoading} />
      </div>
    </MainLayout>
  );
};

export default UserOrders;
