import React from "react";
import Link from "next/link";
import { Truck, Clock, Gift } from "lucide-react";
import { useGetTopbarQuery } from "@/app/store/apis/WidgetApi";

const Topbar = () => {
  const { data, isLoading, error } = useGetTopbarQuery();

  const topbar = data?.widgets[0] || {
    config: {
      shippingText: "Free Shipping on Orders $50+",
      dispatchText: "Same Day Dispatch Before 2PM",
      giftCardText: "Gift Cards Available",
      shopLink: "/shop",
      shopText: "Shop Now",
    },
    isVisible: true,
    location: "topbar",
    order: 1,
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading topbar data</div>;
  }

  return (
    <div className="bg-indigo-950 text-white py-[19px]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center">
              <Truck size={14} className="mr-2" />
              <span>{topbar.config.shippingText}</span>
            </div>
            <div className="hidden md:flex items-center">
              <Clock size={14} className="mr-2" />
              <span>{topbar.config.dispatchText}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center">
              <Gift size={14} className="mr-2" />
              <span>{topbar.config.giftCardText}</span>
            </div>
            <Link
              href={topbar.config.shopLink}
              className="text-sm font-medium underline hover:text-gray-300 transition-colors"
            >
              {topbar.config.shopText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
