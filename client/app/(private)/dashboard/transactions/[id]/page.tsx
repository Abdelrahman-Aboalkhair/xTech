"use client";

import {
  useGetTransactionQuery,
  useUpdateTransactionStatusMutation,
} from "@/app/store/apis/TransactionApi";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  ArrowLeft,
  Truck,
  CreditCard,
  User,
  MapPin,
  Clock,
  ShoppingBag,
} from "lucide-react";
import useToast from "@/app/hooks/ui/useToast";

const TransactionDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const { data, isLoading, error } = useGetTransactionQuery(id);
  const [updateTransactionStatus] = useUpdateTransactionStatusMutation();
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState("");

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

  const handleUpdateStatus = async () => {
    if (!newStatus) return;

    setIsUpdating(true);
    try {
      await updateTransactionStatus({
        id: data.transaction.id,
        status: newStatus,
      }).unwrap();
      showToast("Transaction status updated successfully", "success");
    } catch (err) {
      console.error("Failed to update status:", err);
      showToast("Failed to update transaction status", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleGoBack = () => {
    router.push("/dashboard/transactions");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100);
  };

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="font-medium">Error loading transaction</p>
          <p>{error.message || "Failed to load transaction details"}</p>
          <button
            onClick={handleGoBack}
            className="mt-3 flex items-center text-red-700 hover:text-red-900"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to transactions
          </button>
        </div>
      </div>
    );
  }

  const { transaction } = data;
  const { order } = transaction;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <button
            onClick={handleGoBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-2"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to transactions
          </button>
          <h1 className="text-2xl font-bold">Transaction Details</h1>
          <p className="text-sm text-gray-500">
            View detailed information about this transaction
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {!isUpdating ? (
            <>
              <select
                value={newStatus || transaction.status}
                onChange={(e) => setNewStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {TRANSACTION_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <button
                onClick={handleUpdateStatus}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Update Status
              </button>
            </>
          ) : (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
              <span>Updating...</span>
            </div>
          )}
        </div>
      </div>

      {/* Transaction Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h2 className="text-lg font-semibold mb-4">Transaction Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
              <div>
                <p className="text-sm text-gray-500">Transaction ID</p>
                <p className="font-mono">{transaction.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-mono">{transaction.orderId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Transaction Date</p>
                <p>{formatDate(transaction.transactionDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p>{formatDate(transaction.updatedAt)}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <p className="text-sm text-gray-500 mb-1">Current Status</p>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                transaction.status
              )}`}
            >
              {transaction.status}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:col-span-2">
          <div className="flex items-center mb-4">
            <ShoppingBag className="mr-2 text-blue-600" size={20} />
            <h2 className="text-lg font-semibold">Order Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
            <div>
              <p className="text-sm text-gray-500">Order Amount</p>
              <p className="font-medium">{formatCurrency(order.amount)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Order Date</p>
              <p>{formatDate(order.orderDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Created At</p>
              <p>{formatDate(order.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Updated At</p>
              <p>{formatDate(order.updatedAt)}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="mt-6">
            <h3 className="text-md font-semibold mb-3">Order Items</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item ID
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product ID
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.orderItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-3 py-4 whitespace-nowrap text-sm font-mono">
                        {item.id.substring(0, 8)}...
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm font-mono">
                        {item.productId.substring(0, 8)}...
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm">
                        {item.quantity}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm">
                        {formatCurrency(item.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <User className="mr-2 text-blue-600" size={20} />
            <h2 className="text-lg font-semibold">Customer Information</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Customer Name</p>
              <p>{order.user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p>{order.user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Customer ID</p>
              <p className="font-mono">{order.user.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p>{order.user.role}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Payment Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <CreditCard className="mr-2 text-blue-600" size={20} />
            <h2 className="text-lg font-semibold">Payment Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
            <div>
              <p className="text-sm text-gray-500">Payment ID</p>
              <p className="font-mono">{order.payment.id.substring(0, 8)}...</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Payment Method</p>
              <p className="capitalize">{order.payment.method}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Amount</p>
              <p className="font-medium">
                {formatCurrency(order.payment.amount)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  order.payment.status === "PAID"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {order.payment.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Created At</p>
              <p>{formatDate(order.payment.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Updated At</p>
              <p>{formatDate(order.payment.updatedAt)}</p>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Truck className="mr-2 text-blue-600" size={20} />
            <h2 className="text-lg font-semibold">Shipment Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
            <div>
              <p className="text-sm text-gray-500">Shipment ID</p>
              <p className="font-mono">
                {order.shipment.id.substring(0, 8)}...
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Carrier</p>
              <p>{order.shipment.carrier}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tracking Number</p>
              <p className="font-mono">{order.shipment.trackingNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Shipped Date</p>
              <p>{formatDate(order.shipment.shippedDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Expected Delivery</p>
              <p>{formatDate(order.shipment.deliveryDate)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
        <div className="flex items-center mb-4">
          <MapPin className="mr-2 text-blue-600" size={20} />
          <h2 className="text-lg font-semibold">Shipping Address</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-3 gap-x-6">
          <div>
            <p className="text-sm text-gray-500">Street</p>
            <p>{order.address.street}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">City</p>
            <p>{order.address.city}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">State</p>
            <p>{order.address.state}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Country</p>
            <p>{order.address.country}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">ZIP</p>
            <p>{order.address.zip}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Address ID</p>
            <p className="font-mono">{order.address.id.substring(0, 8)}...</p>
          </div>
        </div>
      </div>

      {/* Timeline and Activity Log (placeholder for future enhancement) */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
        <div className="flex items-center mb-4">
          <Clock className="mr-2 text-blue-600" size={20} />
          <h2 className="text-lg font-semibold">Transaction Timeline</h2>
        </div>
        <div className="border-l-2 border-gray-200 pl-4 ml-2">
          <div className="mb-4 relative">
            <div className="absolute -left-6 mt-1 w-4 h-4 rounded-full bg-blue-500"></div>
            <p className="text-sm text-gray-500">
              {formatDate(transaction.createdAt)}
            </p>
            <p className="font-medium">Transaction created</p>
            <p className="text-sm text-gray-600">
              Initial status: {transaction.status}
            </p>
          </div>
          <div className="mb-4 relative">
            <div className="absolute -left-6 mt-1 w-4 h-4 rounded-full bg-gray-300"></div>
            <p className="text-sm text-gray-500">
              {formatDate(order.payment.createdAt)}
            </p>
            <p className="font-medium">Payment processed</p>
            <p className="text-sm text-gray-600">
              Status: {order.payment.status}
            </p>
          </div>
          {transaction.status !== "PENDING" && (
            <div className="mb-4 relative">
              <div className="absolute -left-6 mt-1 w-4 h-4 rounded-full bg-gray-300"></div>
              <p className="text-sm text-gray-500">
                {formatDate(transaction.updatedAt)}
              </p>
              <p className="font-medium">Status updated</p>
              <p className="text-sm text-gray-600">
                Current status: {transaction.status}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailPage;
