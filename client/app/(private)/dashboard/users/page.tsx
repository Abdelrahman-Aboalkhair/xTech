"use client";
import Table from "@/app/components/layout/Table";
import { useGetAllUsersQuery } from "@/app/store/apis/UserApi";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { Users, Loader2, AlertCircle } from "lucide-react";

const UsersDashboard = () => {
  const { data, isLoading, error } = useGetAllUsersQuery({});

  // Handle error and loading states gracefully
  const users = data?.users || [];

  // Define table columns with enhanced rendering
  const columns = [
    {
      key: "id",
      label: "User ID",
      sortable: true,
      render: (row: any) => (
        <span className="text-sm text-gray-600 font-mono">{row.id}</span>
      ),
    },
    {
      key: "name",
      label: "Name",
      render: (row: any) => (
        <div className="flex items-center space-x-3">
          <Image
            src={row.avatar || "/default-avatar.png"} // Fallback image
            alt={row.name}
            width={36}
            height={36}
            className="object-cover rounded-full border border-gray-200 shadow-sm"
          />
          <span className="text-sm font-medium text-gray-800">{row.name}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: "email",
      label: "Email",
      render: (row: any) => (
        <a
          href={`mailto:${row.email}`}
          className="text-sm text-blue-600 hover:underline"
        >
          {row.email}
        </a>
      ),
      sortable: true,
    },
    {
      key: "role",
      label: "Role",
      render: (row: any) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.role === "admin"
              ? "bg-purple-100 text-purple-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {row.role}
        </span>
      ),
      sortable: true,
    },
    {
      key: "emailVerified",
      label: "Verified",
      render: (row: any) => (
        <span
          className={`text-sm ${
            row.emailVerified ? "text-green-600" : "text-red-600"
          }`}
        >
          {row.emailVerified ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      sortable: true,
      render: (row: any) => (
        <span className="text-sm text-gray-600">
          {new Date(row.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "updatedAt",
      label: "Updated",
      sortable: true,
      render: (row: any) => (
        <span className="text-sm text-gray-600">
          {new Date(row.updatedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen  p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="min-w-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              Users Dashboard
            </h1>
          </div>
          <div className="text-sm text-gray-500">
            {users.length} {users.length === 1 ? "user" : "users"} found
          </div>
        </div>

        {/* Card Container */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              <span className="ml-2 text-gray-600">Loading users...</span>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="flex items-center justify-center py-12 text-red-600">
              <AlertCircle className="h-8 w-8 mr-2" />
              <span>Error loading users. Please try again.</span>
            </div>
          )}

          {/* Table */}
          {!isLoading && !error && (
            <Table
              data={users}
              columns={columns}
              isLoading={isLoading}
              className="w-full"
            />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UsersDashboard;
