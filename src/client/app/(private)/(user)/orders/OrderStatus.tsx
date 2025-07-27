import {
  CheckCircle,
  Clock,
  CreditCard,
  ShoppingBag,
  Truck,
} from "lucide-react";
import React from "react";
import { motion } from "framer-motion";
import getStatusStep from "@/app/utils/getStatusStep";
import formatDate from "@/app/utils/formatDate";

const OrderStatus = ({ order }) => {
  const currentStep = getStatusStep(order.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
    >
      <div className="border-b border-gray-100 pb-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <p className="font-medium bg-blue-100 text-blue-600 px-3 py-1 rounded-full flex items-center">
            <Clock size={18} className="mr-2" />
            {order.status === "DELIVERED"
              ? "Delivered"
              : order.status === "SHIPPED"
              ? "With courier en route"
              : "Processing"}
          </p>
        </div>
      </div>

      {/* Status Steps */}
      <div className="flex flex-wrap justify-between relative mt-6">
        {/* Progress line */}
        <div
          className="absolute top-5 left-0 h-1 bg-gray-200 w-full"
          style={{ zIndex: 1 }}
        ></div>
        <div
          className="absolute top-5 left-0 h-1 bg-blue-500 transition-all duration-500"
          style={{ zIndex: 2, width: `${(currentStep - 1) * 33.33}%` }}
        ></div>

        {/* Step 1: Order Made */}
        <motion.div
          className="flex flex-col items-center z-10 w-1/4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className={`w-12 h-12 rounded-md flex items-center justify-center mb-2 ${
              currentStep >= 1
                ? "bg-blue-100 text-blue-500"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            <ShoppingBag size={24} />
          </div>
          <span className="text-sm font-medium">Order Made</span>
          <span className="text-xs text-gray-500">
            {formatDate(order.createdAt)}
          </span>
        </motion.div>

        {/* Step 2: Order Paid */}
        <motion.div
          className="flex flex-col items-center z-10 w-1/4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div
            className={`w-12 h-12 rounded-md flex items-center justify-center mb-2 ${
              currentStep >= 2
                ? "bg-blue-100 text-blue-500"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            <CreditCard size={24} />
          </div>
          <span className="text-sm font-medium">Order Paid</span>
          <span className="text-xs text-gray-500">
            {order.payment?.createdAt
              ? formatDate(order.payment.createdAt)
              : "N/A"}
          </span>
        </motion.div>

        {/* Step 3: Shipped */}
        <motion.div
          className="flex flex-col items-center z-10 w-1/4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div
            className={`w-12 h-12 rounded-md flex items-center justify-center mb-2 ${
              currentStep >= 3
                ? "bg-blue-100 text-blue-500"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            <Truck size={24} />
          </div>
          <span className="text-sm font-medium">Shipped</span>
          <span className="text-xs text-gray-500">
            {order.shipment?.shippedDate
              ? formatDate(order.shipment.shippedDate)
              : "Pending"}
          </span>
        </motion.div>

        {/* Step 4: Completed */}
        <motion.div
          className="flex flex-col items-center z-10 w-1/4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div
            className={`w-12 h-12 rounded-md flex items-center justify-center mb-2 ${
              currentStep >= 4
                ? "bg-blue-100 text-blue-500"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            <CheckCircle size={24} />
          </div>
          <span className="text-sm font-medium">Completed</span>
          <span className="text-xs text-gray-500">
            {order.shipment?.deliveryDate
              ? formatDate(order.shipment.deliveryDate)
              : "Pending"}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OrderStatus;
