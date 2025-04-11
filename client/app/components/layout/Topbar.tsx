"use client";
import React from "react";

interface TopbarProps {
  config?: {
    shopLink: string;
    shopText: string;
    dispatchText: string;
    giftCardText: string;
    shippingText: string;
  };
  isPreview?: boolean;
}

const Topbar = ({ config, isPreview = false }: TopbarProps) => {
  const fallbackConfig = {
    shopLink: "/shop",
    shopText: "Shop Now",
    dispatchText: "Same Day Dispatch Before 2PM",
    giftCardText: "Gift Cards Available",
    shippingText: "Free Shipping on Orders $50+",
  };

  const { shopLink, shopText, dispatchText, giftCardText, shippingText } =
    config || fallbackConfig;

  return (
    <div
      className={`bg-gray-800 text-white ${
        isPreview ? "p-2 text-xs" : "p-4 text-sm"
      }`}
    >
      <div
        className={`flex ${
          isPreview ? "flex-col gap-1" : "justify-between items-center"
        }`}
      >
        <a href={shopLink} className="hover:underline">
          {shopText}
        </a>
        <span>{dispatchText}</span>
        <span>{giftCardText}</span>
        <span>{shippingText}</span>
      </div>
    </div>
  );
};

export default Topbar;
