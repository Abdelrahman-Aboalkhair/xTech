"use client";

import { useGetOrderQuery } from "@/app/store/apis/OrderApi";
import { useParams } from "next/navigation";
import MainLayout from "@/app/components/templates/MainLayout";
import ShippingAddressCard from "../ShippingAddressCard";
import OrderSummary from "../OrderSummary";
import OrderStatus from "../OrderStatus";
import formatDate from "@/app/utils/formatDate";
import OrderItems from "../OrderItems";
import ToggleableId from "@/app/components/atoms/ToggleableId";
import { Calendar } from "lucide-react";

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const { data, isLoading, error } = useGetOrderQuery(orderId);
  const order = data?.order;

  if (isLoading) return <div>Loading...</div>;
  if (error || !order)
    return <div>Error loading order or order not found.</div>;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 text-center">
          <div
            className="flex gap-2 items-center justify-center
          "
          >
            <h1 className="text-xl font-semibold">Order ID:</h1>
            <ToggleableId id={order.id} />
          </div>
          <p className="flex gap-2 items-center justify-center text-gray-500 text-sm">
            <Calendar size={15} className="" />
            Placed on {formatDate(order.orderDate)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <OrderItems order={order} />

          <div className="col-span-2 space-y-6">
            <OrderStatus order={order} />

            <OrderSummary order={order} />
          </div>

          <ShippingAddressCard order={order} />
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderTrackingPage;
