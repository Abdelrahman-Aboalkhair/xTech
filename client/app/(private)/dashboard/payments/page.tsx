"use client";
import React from "react";
import { useGetAllPaymentsQuery } from "@/app/store/apis/PaymentApi";
import Table from "@/app/components/layout/Table";
import { motion } from "framer-motion";
import { CreditCard, DollarSign, Calendar, FileText, Eye } from "lucide-react";
import ToggleableText from "@/app/components/atoms/ToggleableText";
import { usePathname, useRouter } from "next/navigation";

const PaymentsDashboard = () => {
  const router = useRouter();
  const pathname = usePathname();

  const shouldFetchPayments = pathname === "/dashboard/payments";

  const { data, isLoading, error } = useGetAllPaymentsQuery(undefined, {
    skip: !shouldFetchPayments,
  });
  const payments = data?.payments || [];

  const columns = [
    {
      key: "id",
      label: "Payment ID",
      sortable: true,
      render: (row) => (
        <ToggleableText content={row?.id || "N/A"} truncateLength={10} />
      ),
    },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (row) => (
        <div className="flex items-center space-x-2">
          <DollarSign size={16} className="text-indigo-500" />
          <span>
            ${typeof row?.amount === "number" ? row.amount.toFixed(2) : "0.00"}
          </span>
        </div>
      ),
    },
    {
      key: "paymentMethod",
      label: "Payment Method",
      sortable: true,
      render: (row) => (
        <div className="flex items-center space-x-2">
          <CreditCard size={16} className="text-indigo-500" />
          <span>{row?.method || "N/A"}</span>
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
            row?.status === "COMPLETED"
              ? "bg-green-100 text-green-600"
              : row?.status === "PENDING"
              ? "bg-yellow-100 text-yellow-600"
              : row?.status === "FAILED"
              ? "bg-red-100 text-red-600"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {row?.status || "UNKNOWN"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      sortable: true,
      render: (row) => (
        <div className="flex items-center space-x-2">
          <Calendar size={16} className="text-indigo-500" />
          <span>
            {row?.createdAt ? new Date(row.createdAt).toLocaleString() : "N/A"}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <button
          onClick={() => router.push(`/dashboard/payments/${row.id}`)}
          className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
        >
          <Eye size={16} />
          Details
        </button>
      ),
    },
  ];

  return (
    <div className="max-w-7xl min-w-full px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center space-x-3 mb-8"
      >
        <CreditCard size={24} className="text-indigo-500" />
        <h1 className="text-2xl font-bold text-gray-800">Payments Dashboard</h1>
      </motion.div>

      {/* Content */}
      {isLoading ? (
        <div className="text-center py-12">
          <CreditCard
            size={48}
            className="mx-auto text-gray-400 mb-4 animate-pulse"
          />
          <p className="text-lg text-gray-600">Loading payments...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-lg text-red-500">
            Error loading payments: {(error as any)?.message || "Unknown error"}
          </p>
        </div>
      ) : payments.length === 0 ? (
        <div className="text-center py-12">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-lg text-gray-600">No payments recorded</p>
        </div>
      ) : (
        <Table
          data={payments}
          columns={columns}
          isLoading={isLoading}
          className="bg-white rounded-xl shadow-md border border-gray-100"
        />
      )}
    </div>
  );
};

export default PaymentsDashboard;
