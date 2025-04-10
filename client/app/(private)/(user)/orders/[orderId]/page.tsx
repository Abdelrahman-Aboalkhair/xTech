"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  CreditCard,
  Truck,
  CheckCircle,
  ChevronRight,
  Clock,
} from "lucide-react";
import useFormatPrice from "@/app/hooks/ui/useFormatPrice";
import { useGetOrderQuery } from "@/app/store/apis/OrderApi";
import { useParams } from "next/navigation";
import MainLayout from "@/app/components/templates/MainLayout";

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const formatPrice = useFormatPrice();
  const { data, isLoading, error } = useGetOrderQuery(orderId);
  const order = data?.order;
  console.log("order => ", order);

  const shippingDiscount = 77.5;
  const platformFees = 94.0;
  const total = useMemo(() => {
    return formatPrice(32 - shippingDiscount - platformFees);
  }, []);

  const getStatusStep = (status) => {
    switch (status) {
      case "DELIVERED":
        return 4;
      case "SHIPPED":
        return 3;
      case "PAID":
        return 2;
      case "PENDING":
      default:
        return 1;
    }
  };

  const currentStep = 2;

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Order ID: {order?.id}</h1>
          <p className="text-gray-500 text-sm">
            Let&apos;s boost your sales with powerful insights and effective
            strategies today
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow p-6 mb-6"
        >
          <div className="flex items-center mb-4">
            <Clock size={20} className="text-orange-500 mr-2" />
            <p className="font-medium">With courier en route.</p>
            <span className="ml-auto text-gray-500">No Resi: 34u2394y239y</span>
          </div>

          <div className="flex flex-wrap justify-between relative mt-10">
            {/* Progress line */}
            <div
              className="absolute top-5 left-0 h-1 bg-gray-200 w-full"
              style={{ zIndex: 1 }}
            ></div>
            <div
              className="absolute top-5 left-0 h-1 bg-orange-500 transition-all duration-500"
              style={{ zIndex: 2, width: `${(currentStep - 1) * 33.33}%` }}
            ></div>

            {/* Step 1 */}
            <motion.div
              className="flex flex-col items-center z-10 w-1/4"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className={`w-12 h-12 rounded-md flex items-center justify-center mb-2 ${
                  currentStep >= 1
                    ? "bg-orange-100 text-orange-500"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <ShoppingBag size={24} />
              </div>
              <span className="text-sm font-medium">Order made</span>
              <span className="text-xs text-gray-500">Create order</span>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              className="flex flex-col items-center z-10 w-1/4"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div
                className={`w-12 h-12 rounded-md flex items-center justify-center mb-2 ${
                  currentStep >= 2
                    ? "bg-orange-100 text-orange-500"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <CreditCard size={24} />
              </div>
              <span className="text-sm font-medium">Order Paid</span>
              <span className="text-xs text-gray-500">Customer payment</span>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              className="flex flex-col items-center z-10 w-1/4"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div
                className={`w-12 h-12 rounded-md flex items-center justify-center mb-2 ${
                  currentStep >= 3
                    ? "bg-orange-100 text-orange-500"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <Truck size={24} />
              </div>
              <span className="text-sm font-medium">Shipped</span>
              <span className="text-xs text-gray-500">On delivery</span>
            </motion.div>

            {/* Step 4 */}
            <motion.div
              className="flex flex-col items-center z-10 w-1/4"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div
                className={`w-12 h-12 rounded-md flex items-center justify-center mb-2 ${
                  currentStep >= 4
                    ? "bg-orange-100 text-orange-500"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <CheckCircle size={24} />
              </div>
              <span className="text-sm font-medium">Completed</span>
              <span className="text-xs text-gray-500">Order completed</span>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-lg shadow p-6 items-center"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold">Shipping To</h2>
            <ChevronRight size={18} className="text-gray-400" />
          </div>
          <div className="space-y-1 text-gray-700">
            <p className="font-medium">Rucas Royal</p>
            <p>4567 Elm Street, Apt 3B,</p>
            <p>Philadelphia, PA 19104, USA, Near</p>
            <p>University City</p>
          </div>
        </motion.div>

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-lg shadow p-6 mb-6"
        >
          <h2 className="font-bold mb-4">Order Item</h2>

          <div className="space-y-6">
            {/* {order.orderItems.map((item, index) => (
            <div
              key={index}
              className="flex items-start border-b pb-4 last:border-0 last:pb-0"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center mr-4">
                <Package size={24} className="text-gray-400" />
              </div>
              <div className="flex-1">
                <div className="mb-1">
                  <p className="text-xs text-gray-500">{item.brand}</p>
                  <p className="font-medium">{item.name}</p>
                </div>
                <div className="flex text-sm text-gray-500">
                  <p>Color: {item.color}</p>
                  <p className="ml-4">Size: {item.size}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  1 X RP {item.price.toLocaleString()}
                </p>
              </div>
            </div>
          ))} */}
          </div>
        </motion.div>

        {/* Order Summary */}
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
                <span>2 Item</span>
                <span className="ml-8 font-medium">2343.00</span>
              </div>
            </div>
            <div className="flex justify-between">
              <p>Shipping Cost Subtotal</p>
              <span className="font-medium text-red-500">3432.5</span>
            </div>

            <div className="flex justify-between">
              <p>Platform fees</p>
              <span className="font-medium">3243</span>
            </div>

            <div className="flex justify-between">
              <p>Total</p>
              <span className="font-medium">3243</span>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default OrderTrackingPage;
