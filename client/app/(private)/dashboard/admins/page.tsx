"use client";
import Table from "@/app/components/layout/Table";
import {
  useCreateAdminMutation,
  useDeleteUserMutation,
  useGetAllUsersQuery,
} from "@/app/store/apis/UserApi";
import Image from "next/image";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Loader2, AlertCircle, Trash2 } from "lucide-react";
import ConfirmModal from "@/app/components/organisms/ConfirmModal";
import Modal from "@/app/components/organisms/Modal";
import useToast from "@/app/hooks/ui/useToast";
import ToggleableText from "@/app/components/atoms/ToggleableText";

interface AdminFormData {
  name: string;
  email: string;
  avatar?: string;
}

const AdminsDashboard = () => {
  const { showToast } = useToast();
  const { data, isLoading, error, refetch } = useGetAllUsersQuery({});
  const [createUser, { isLoading: isCreating }] = useCreateAdminMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const admins =
    data?.users?.filter((user: any) => user.role === "ADMIN") || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<string | null>(null);

  const handleCreateAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: AdminFormData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      avatar: (formData.get("avatar") as string) || "/default-avatar.png",
    };

    try {
      await createUser({ ...data, role: "ADMIN" }).unwrap();
      setIsModalOpen(false);
      refetch();
      showToast("Admin created successfully", "success");
    } catch (err) {
      console.error("Failed to create admin:", err);
      showToast("Failed to create admin", "error");
    }
  };

  const handleDeleteAdmin = async () => {
    if (!adminToDelete) return;
    try {
      await deleteUser(adminToDelete).unwrap();
      setIsConfirmModalOpen(false);
      setAdminToDelete(null);
      refetch();
      showToast("Admin deleted successfully", "success");
    } catch (err) {
      console.error("Failed to delete admin:", err);
      showToast("Failed to delete admin", "error");
    }
  };

  const columns = [
    {
      key: "id",
      label: "Admin ID",
      sortable: true,
      render: (row: any) => (
        <ToggleableText content={row.id} truncateLength={10} />
      ),
    },
    {
      key: "name",
      label: "Name",
      render: (row: any) => (
        <div className="flex items-center space-x-3">
          <Image
            src={row.avatar || "/default-avatar.png"}
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
      key: "emailVerified",
      label: "Verified",
      render: (row: any) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.emailVerified
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
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
    {
      key: "actions",
      label: "Actions",
      render: (row: any) => (
        <button
          onClick={() => {
            setAdminToDelete(row.id);
            setIsConfirmModalOpen(true);
          }}
          className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors"
          disabled={isDeleting && adminToDelete === row.id}
        >
          <Trash2 size={16} />
          {isDeleting && adminToDelete === row.id ? "Deleting..." : "Delete"}
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="min-w-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <ShieldCheck className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              Admins Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {admins.length} {admins.length === 1 ? "admin" : "admins"}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition-colors"
            >
              + New Admin
            </motion.button>
          </div>
        </div>

        {/* Card Container */}
        <motion.div
          className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
              <span className="ml-2 text-gray-600">Loading admins...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12 text-red-600">
              <AlertCircle className="h-8 w-8 mr-2" />
              <span>Error loading admins. Please try again.</span>
            </div>
          ) : (
            <Table
              data={admins}
              columns={columns}
              isLoading={isLoading}
              className="w-full"
            />
          )}
        </motion.div>
      </motion.div>

      {/* Create Admin Modal */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Create Admin</h2>
          <form onSubmit={handleCreateAdmin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Avatar URL (Optional)
              </label>
              <input
                type="text"
                name="avatar"
                placeholder="/default-avatar.png"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isCreating}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-400 transition-colors"
              >
                {isCreating ? "Creating..." : "Create"}
              </motion.button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        message="Are you sure you want to delete this admin? This action cannot be undone."
        onConfirm={handleDeleteAdmin}
        onCancel={() => setIsConfirmModalOpen(false)}
      />
    </div>
  );
};

export default AdminsDashboard;
