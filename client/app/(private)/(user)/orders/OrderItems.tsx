import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import useFormatPrice from "@/app/hooks/ui/useFormatPrice";
import { ShoppingCart } from "lucide-react";

const OrderItems = ({ order }) => {
  const formatPrice = useFormatPrice();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="col-span-1 bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex items-center space-x-2 mb-4">
        <ShoppingCart size={18} className="text-indigo-500" />
        <h2 className="font-semibold text-gray-800">Order Items</h2>
      </div>

      <div className="space-y-6">
        {order.orderItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center border-b border-gray-100 pb-4 last:border-0 last:pb-0"
          >
            {/* Product Image */}
            <div className="w-[60] h-[60] bg-gray-50 rounded-lg flex items-center justify-center mr-4 overflow-hidden shadow-sm">
              <Image
                src={item.product.images[0]}
                alt={item.product.name}
                width={50}
                height={50}
                className="object-cover"
              />
            </div>

            {/* Product Details */}
            <div className="flex-1">
              <p className="font-semibold text-gray-800 text-sm">
                {item.product.name}
              </p>
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="font-medium text-gray-800">
                {formatPrice(item.product.price * item.quantity)}
              </p>
              <p className="text-xs text-gray-500">
                {item.quantity} x {formatPrice(item.product.price)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default OrderItems;
