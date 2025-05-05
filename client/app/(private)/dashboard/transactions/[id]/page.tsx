"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import useToast from "@/app/hooks/ui/useToast";
import {
  useGetTransactionQuery,
  useUpdateTransactionStatusMutation,
} from "@/app/store/apis/TransactionApi";

import ErrorState from "../ErrorState";
import PageHeader from "../PageHeader";
import TransactionOverview from "../TransactionOverview";
import OrderInformation from "../OrderInformation";
import CustomerInformation from "../CustomerInformation";
import PaymentInformation from "../PaymentInformation";
import ShipmentInformation from "../ShipmentInformation";
import ShippingAddress from "../ShippingAddress";
import TransactionTimeline from "../TransactionTimeline";
import CustomLoader from "@/app/components/feedback/CustomLoader";

const TransactionDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const { data, isLoading, error } = useGetTransactionQuery(id);
  const [updateTransactionStatus] = useUpdateTransactionStatusMutation();
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const TRANSACTION_STATUSES = [
    { label: "PENDING", value: "PENDING" },
    { label: "PROCESSING", value: "PROCESSING" },
    { label: "SHIPPED", value: "SHIPPED" },
    { label: "IN_TRANSIT", value: "IN_TRANSIT" },
    { label: "DELIVERED", value: "DELIVERED" },
    { label: "CANCELED", value: "CANCELED" },
    { label: "RETURNED", value: "RETURNED" },
    { label: "REFUNDED", value: "REFUNDED" },
  ];

  const handleUpdateStatus = async () => {
    if (!newStatus) return;

    setIsUpdating(true);
    try {
      await updateTransactionStatus({
        id: data.transaction.id,
        status: newStatus,
      }).unwrap();
      showToast("Transaction status updated successfully", "success");
    } catch (err: any) {
      console.error("Failed to update status:", err);
      showToast("Failed to update transaction status", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleGoBack = () => {
    router.push("/dashboard/transactions");
  };

  if (isLoading) {
    return <CustomLoader />;
  }

  if (error) {
    return (
      <ErrorState
        message={"Failed to load transaction details"}
        onBack={handleGoBack}
      />
    );
  }

  const { transaction } = data;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <PageHeader
        transaction={transaction}
        onBack={handleGoBack}
        onUpdateStatus={handleUpdateStatus}
        isUpdating={isUpdating}
        newStatus={newStatus}
        setNewStatus={setNewStatus}
        statusOptions={TRANSACTION_STATUSES}
      />

      <div className="space-y-6">
        <TransactionOverview transaction={transaction} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <OrderInformation
            order={transaction.order}
            className="lg:col-span-2"
          />
          <CustomerInformation user={transaction.order.user} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PaymentInformation payment={transaction.order.payment} />
          <ShipmentInformation shipment={transaction.order.shipment} />
        </div>

        <ShippingAddress address={transaction.order.address} />
        <TransactionTimeline
          transaction={transaction}
          payment={transaction.order.payment}
        />
      </div>
    </div>
  );
};

export default TransactionDetailPage;
