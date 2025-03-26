"use client";
import { Minus, Plus } from "lucide-react";
import React, { useState } from "react";

const QuantitySelector = () => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex items-center border border-gray-300 rounded-md">
      <button
        className="p-2 font-bold"
        onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
      >
        <Minus size={16} />
      </button>
      <p className="px-6 font-semibold">{quantity}</p>
      <button
        className="bg-primary p-[15px] px-[18px] text-white font-bold"
        onClick={() => setQuantity((prev) => prev + 1)}
      >
        <Plus size={16} />
      </button>
    </div>
  );
};

export default QuantitySelector;
