"use client";
import Table from "@/app/components/layout/Table";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import ConfirmModal from "@/app/components/organisms/ConfirmModal";
import useToast from "@/app/hooks/ui/useToast";
import { usePathname } from "next/navigation";
import {
  useDeleteTransactionMutation,
  useGetAllTransactionsQuery,
} from "@/app/store/apis/TransactionApi";

const TransactionsDashboard = () => {
  const { showToast } = useToast();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const pathname = usePathname();

  const shouldFetchTransactions = pathname === "/dashboard/transactions";

  const { data, isLoading } = useGetAllTransactionsQuery(undefined, {
    skip: !shouldFetchTransactions,
  });
  console.log("Transactions data => ", data);
  const [deleteTransaction] = useDeleteTransactionMutation();

  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(
    null
  );

  const handleDeleteTransaction = (id: string) => {
    setIsConfirmModalOpen(true);
    setTransactionToDelete(id);
  };

  const confirmDelete = async () => {
    if (!transactionToDelete) return;
    setIsConfirmModalOpen(false);
    try {
      await deleteTransaction(transactionToDelete).unwrap();
      setTransactionToDelete(null);

      showToast("transaction deleted successfully", "success");
    } catch (err) {
      console.error("Failed to delete transaction:", err);
      showToast("Failed to delete transaction", "error");
    }
  };

  const columns = [
    {
      key: "id",
      label: "Transaction ID",
      sortable: true,
      render: (row: any) => (
        <div className="flex items-center space-x-2">
          <span>{row.id}</span>
        </div>
      ),
    },
    {
      key: "orderId",
      label: "Order ID",
      sortable: true,
      render: (row: any) => row.orderId,
    },

    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row: any) => row.status,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: any) => (
        <div className="flex space-x-2">
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

  return (
    <div className="p-6">
      <div>
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

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default TransactionsDashboard;
