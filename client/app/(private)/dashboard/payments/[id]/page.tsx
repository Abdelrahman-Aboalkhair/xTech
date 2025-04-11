"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetAllPaymentsQuery } from "@/app/store/apis/PaymentApi";
import {
  ArrowLeft,
  CreditCard,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  HelpCircle,
  Clipboard,
  ChevronRight,
} from "lucide-react";
import ToggleableText from "@/app/components/atoms/ToggleableText";

interface PaymentData {
  id: string | number;
  amount: number;
  method: string;
  status: string;
  createdAt: string;
  [key: string]: any; // For additional fields not in table
}

const PaymentDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading, error } = useGetAllPaymentsQuery({});
  const payment = data?.payments.find((p) => p.id.toString() === id) as
    | PaymentData
    | undefined;

  // Function to render status icon based on payment status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="text-emerald-500" size={20} />;
      case "PENDING":
        return <Clock className="text-amber-500" size={20} />;
      case "FAILED":
        return <XCircle className="text-rose-500" size={20} />;
      default:
        return <HelpCircle className="text-gray-500" size={20} />;
    }
  };

  // Function to copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real app, you might want to show a toast notification here
  };

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-t-indigo-600 border-r-indigo-200 border-b-indigo-200 border-l-indigo-200 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium">
          Loading payment details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <XCircle size={48} className="text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error Loading Payment
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn&apos;t retrieve the payment information. Please try again
            later.
          </p>
          <button
            onClick={() => router.push("/dashboard/payments")}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Return to Payments
          </button>
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <HelpCircle size={48} className="text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Payment Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The payment with ID #{id} could not be found.
          </p>
          <button
            onClick={() => router.push("/dashboard/payments")}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Return to Payments
          </button>
        </div>
      </div>
    );
  }

  // Format date for better display
  const formattedDate = payment.createdAt
    ? new Date(payment.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  const formattedTime = payment.createdAt
    ? new Date(payment.createdAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  // Get additional details
  const additionalDetails = Object.fromEntries(
    Object.entries(payment).filter(
      ([key]) =>
        !["id", "amount", "method", "status", "createdAt"].includes(key)
    )
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Navigation Bar */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/dashboard/payments")}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Back to Payments</span>
          </button>
        </div>

        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 p-3 rounded-full">
                <CreditCard className="text-indigo-600" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Payment Details
                </h1>
                <p className="text-gray-500">Transaction #{payment.id}</p>
              </div>
            </div>
            <div
              className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                payment.status === "COMPLETED"
                  ? "bg-emerald-100 text-emerald-700"
                  : payment.status === "PENDING"
                  ? "bg-amber-100 text-amber-700"
                  : payment.status === "FAILED"
                  ? "bg-rose-100 text-rose-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {getStatusIcon(payment.status)}
              <span className="font-medium">{payment.status || "UNKNOWN"}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Payment Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">
                  Payment Information
                </h2>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                  {/* Payment ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Payment ID
                    </label>
                    <div className="flex items-center gap-2">
                      <ToggleableText
                        content={payment.id.toString()}
                        truncateLength={10}
                        className="font-medium text-gray-800"
                      />
                      <button
                        onClick={() => copyToClipboard(payment.id.toString())}
                        className="text-indigo-500 hover:text-indigo-700 transition-colors"
                        title="Copy to clipboard"
                      >
                        <Clipboard size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Date & Time
                    </label>
                    <div className="flex items-center gap-2">
                      <Calendar
                        size={16}
                        className="text-indigo-500 flex-shrink-0"
                      />
                      <span className="font-medium text-gray-800">
                        {formattedDate}
                        {formattedTime && (
                          <span className="text-gray-500 ml-1">
                            {formattedTime}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Amount
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="bg-indigo-100 p-1 rounded">
                        <DollarSign size={16} className="text-indigo-600" />
                      </div>
                      <span className="text-xl font-semibold text-gray-800">
                        $
                        {typeof payment.amount === "number"
                          ? payment.amount.toFixed(2)
                          : "0.00"}
                      </span>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Payment Method
                    </label>
                    <div className="flex items-center gap-2">
                      <CreditCard size={16} className="text-indigo-500" />
                      <span className="font-medium text-gray-800">
                        {payment.method || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timeline - can be expanded in a real application */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h3 className="text-base font-medium text-gray-800 mb-4">
                    Payment Timeline
                  </h3>
                  <div className="flex items-start gap-3">
                    <div className="bg-emerald-100 p-1 rounded-full mt-0.5">
                      <CheckCircle size={16} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        Payment {payment?.status?.toLowerCase() || "unknown"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formattedDate} at {formattedTime}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Side Panel - Additional Details */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">
                  Additional Details
                </h2>
              </div>

              <div className="p-6">
                {Object.keys(additionalDetails).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(additionalDetails).map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-500 capitalize mb-1">
                          {key.replace(/([A-Z])/g, " $1").trim()}{" "}
                          {/* Convert camelCase to spaces */}
                        </label>
                        <p className="font-medium text-gray-800">
                          {typeof value === "object"
                            ? JSON.stringify(value)
                            : String(value)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    No additional details available for this payment.
                  </p>
                )}
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">Actions</h2>
              </div>

              <div className="p-4">
                <button className="w-full text-left px-4 py-3 flex items-center justify-between rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="font-medium text-gray-800">
                    Download Receipt
                  </span>
                  <ChevronRight size={18} className="text-gray-400" />
                </button>

                <button className="w-full text-left px-4 py-3 flex items-center justify-between rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="font-medium text-gray-800">
                    Report Issue
                  </span>
                  <ChevronRight size={18} className="text-gray-400" />
                </button>

                <button className="w-full text-left px-4 py-3 flex items-center justify-between rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="font-medium text-gray-800">
                    View All Transactions
                  </span>
                  <ChevronRight size={18} className="text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailPage;
