"use client";
import Table from "@/app/components/layout/Table";
import { useState } from "react";
import { Trash2, PenLine, ExternalLink } from "lucide-react";
import ConfirmModal from "@/app/components/organisms/ConfirmModal";
import useToast from "@/app/hooks/ui/useToast";
import { usePathname, useRouter } from "next/navigation";
import {
  useDeleteTransactionMutation,
  useGetAllTransactionsQuery,
  useUpdateTransactionStatusMutation,
} from "@/app/store/apis/TransactionApi";

const TransactionsDashboard = () => {
  const { showToast } = useToast();
  const router = useRouter();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const pathname = usePathname();
  const shouldFetchTransactions = pathname === "/dashboard/transactions";

  const { data, isLoading } = useGetAllTransactionsQuery(undefined, {
    skip: !shouldFetchTransactions,
  });
  const [updateTransactionStatus] = useUpdateTransactionStatusMutation();
  const [deleteTransaction] = useDeleteTransactionMutation();

  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(
    null
  );

  const handleDeleteTransaction = (id: string) => {
    setIsConfirmModalOpen(true);
    setTransactionToDelete(id);
  };

  const handleUpdateStatus = (transaction: any) => {
    setSelectedTransaction(transaction);
    setNewStatus(transaction.status);
    setIsStatusModalOpen(true);
  };

  const handleViewDetails = (id: string) => {
    router.push(`/dashboard/transactions/${id}`);
  };

  const confirmDelete = async () => {
    if (!transactionToDelete) return;
    setIsConfirmModalOpen(false);
    try {
      await deleteTransaction(transactionToDelete).unwrap();
      setTransactionToDelete(null);
      showToast("Transaction deleted successfully", "success");
    } catch (err) {
      console.error("Failed to delete transaction:", err);
      showToast("Failed to delete transaction", "error");
    }
  };

  const confirmStatusUpdate = async () => {
    if (!selectedTransaction || !newStatus) return;
    setIsStatusModalOpen(false);
    try {
      await updateTransactionStatus({
        id: selectedTransaction.id,
        status: newStatus,
      }).unwrap();
      showToast("Status updated successfully", "success");
    } catch (err) {
      console.error("Failed to update status:", err);
      showToast("Failed to update status", "error");
    }
  };

  const TRANSACTION_STATUSES = [
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "IN_TRANSIT",
    "DELIVERED",
    "CANCELED",
    "RETURNED",
    "REFUNDED",
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800";
      case "SHIPPED":
        return "bg-indigo-100 text-indigo-800";
      case "IN_TRANSIT":
        return "bg-purple-100 text-purple-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELED":
        return "bg-red-100 text-red-800";
      case "RETURNED":
        return "bg-orange-100 text-orange-800";
      case "REFUNDED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const columns = [
    {
      key: "id",
      label: "Transaction ID",
      sortable: true,
      render: (row: any) => (
        <div className="flex items-center space-x-2">
          <span className="font-mono text-sm">{row.id.substring(0, 8)}...</span>
        </div>
      ),
    },
    {
      key: "orderId",
      label: "Order ID",
      sortable: true,
      render: (row: any) => (
        <span className="font-mono text-sm">
          {row.orderId.substring(0, 8)}...
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row: any) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            row.status
          )}`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "transactionDate",
      label: "Date",
      sortable: true,
      render: (row: any) => (
        <span>{new Date(row.transactionDate).toLocaleDateString()}</span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: any) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewDetails(row.id)}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <ExternalLink size={16} />
            View
          </button>
          <button
            onClick={() => handleUpdateStatus(row)}
            className="text-green-600 hover:text-green-800 flex items-center gap-1"
          >
            <PenLine size={16} />
            Update
          </button>
          <button
            onClick={() => handleDeleteTransaction(row.id)}
            className="text-red-600 hover:text-red-800 flex items-center gap-1"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      ),
    },
  ];

  const cancelDelete = () => {
    setIsConfirmModalOpen(false);
  };

  const cancelStatusUpdate = () => {
    setIsStatusModalOpen(false);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Transaction List</h1>
        <p className="text-sm text-gray-500">
          Manage and view your transactions
        </p>
      </div>

      <Table
        data={data?.transactions}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No transactions available"
        onRefresh={() => console.log("refreshed")}
        totalPages={data?.totalPages}
        totalResults={data?.totalResults}
        resultsPerPage={data?.resultsPerPage}
        currentPage={data?.currentPage}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      {/* Status Update Modal */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${
          isStatusModalOpen ? "" : "hidden"
        }`}
      >
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-lg font-semibold mb-4">
            Update Transaction Status
          </h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transaction ID
            </label>
            <input
              type="text"
              value={selectedTransaction?.id || ""}
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
              disabled
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {TRANSACTION_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={cancelStatusUpdate}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmStatusUpdate}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsDashboard;
