"use client";
import React from "react";
import { useGetUserOrdersQuery } from "@/app/store/apis/OrderApi";
import Table from "@/app/components/layout/Table";
import MainLayout from "@/app/components/templates/MainLayout";
import { motion } from "framer-motion";
import { Package, Calendar, ExternalLink } from "lucide-react";
import ToggleableId from "@/app/components/atoms/ToggleableId";
import Link from "next/link";

const UserOrders = () => {
  const { data, isLoading, error } = useGetUserOrdersQuery({});
  const orders = data?.orders || [];

  const columns = [
    {
      key: "id",
      label: "Order ID",
      sortable: true,
      render: (row) => <ToggleableId id={row?.id || "N/A"} />,
    },
    {
      key: "orderDate",
      label: "Order Date",
      sortable: true,
      render: (row) => (
        <div className="flex items-center space-x-2">
          <Calendar size={16} className="text-indigo-500" />
          <span>
            {row?.orderDate ? new Date(row.orderDate).toLocaleString() : "N/A"}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-sm font-medium ${
            row?.status === "DELIVERED"
              ? "bg-green-100 text-green-600"
              : row?.status === "SHIPPED"
              ? "bg-blue-100 text-blue-600"
              : row?.status === "PAID"
              ? "bg-yellow-100 text-yellow-600"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {row?.status || "UNKNOWN"}
        </span>
      ),
    },
    {
      key: "track",
      label: "Track Order",
      render: (row) => (
        <Link
          href={`/orders/${row?.id || ""}`}
          className="flex items-center space-x-2 text-indigo-500 hover:text-indigo-600 transition-colors duration-200"
        >
          <ExternalLink size={16} />
          <span>Track</span>
        </Link>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto w-full px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-3 mb-8"
        >
          <Package size={24} className="text-indigo-500" />
          <h1 className="text-2xl font-bold text-gray-800">Your Orders</h1>
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <div className="text-center py-12">
            <Package
              size={48}
              className="mx-auto text-gray-400 mb-4 animate-pulse"
            />
            <p className="text-lg text-gray-600">Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-lg text-red-500">
              Error loading orders: {error.message || "Unknown error"}
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-lg text-gray-600">You have no orders yet</p>
            <Link
              href="/products"
              className="mt-4 inline-block text-indigo-500 hover:text-indigo-600 font-medium transition-colors duration-200"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <Table
            data={orders}
            columns={columns}
            isLoading={isLoading}
            className="bg-white rounded-xl shadow-md border border-gray-100"
          />
        )}
      </div>
    </MainLayout>
  );
};

export default UserOrders;
