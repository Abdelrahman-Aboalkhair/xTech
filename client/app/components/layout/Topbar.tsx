import React from "react";
import Link from "next/link";
import { Truck, Clock, Gift } from "lucide-react";

const Topbar = () => {
  return (
    <div className="bg-indigo-950 text-white py-[19px]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center">
              <Truck size={14} className="mr-2" />
              <span>Free Shipping on Orders $50+</span>
            </div>
            <div className="hidden md:flex items-center">
              <Clock size={14} className="mr-2" />
              <span>Same Day Dispatch Before 2PM</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center">
              <Gift size={14} className="mr-2" />
              <span>Gift Cards Available</span>
            </div>
            <Link
              href="/shop"
              className="text-sm font-medium underline hover:text-gray-300 transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
