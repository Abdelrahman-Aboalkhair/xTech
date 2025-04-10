import React, { useMemo } from "react";
import { motion } from "framer-motion";
import useFormatPrice from "@/app/hooks/ui/useFormatPrice";

const OrderSummary = ({ order }) => {
  const formatPrice = useFormatPrice();
  const shippingCost = 75.0;
  const platformFees = 94.0;
  const subtotal = order.amount;
  const total = useMemo(() => {
    return formatPrice(subtotal + shippingCost + platformFees);
  }, [subtotal, shippingCost, platformFees]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-white rounded-lg shadow p-6"
      >
        <h2 className="font-bold mb-4">Order Summary</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <p>Product Price</p>
            <div className="flex items-center">
              <span>{order.orderItems.length} Item(s)</span>
              <span className="ml-8 font-medium">{formatPrice(subtotal)}</span>
            </div>
          </div>
          <div className="flex justify-between">
            <p>Shipping Cost</p>
            <span className="font-medium">{formatPrice(shippingCost)}</span>
          </div>
          <div className="flex justify-between">
            <p>Platform Fees</p>
            <span className="font-medium">{formatPrice(platformFees)}</span>
          </div>
          <div className="flex justify-between">
            <p>Total</p>
            <span className="font-medium">{total}</span>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default OrderSummary;
