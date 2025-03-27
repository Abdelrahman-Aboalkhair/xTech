import React, { useMemo } from "react";

interface CartSummaryProps {
  subtotal: number;
  taxRate?: number;
  currency?: string;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  taxRate = 0.1,
  currency = "$",
}) => {
  const taxAmount = useMemo(() => subtotal * taxRate, [subtotal, taxRate]);
  const total = useMemo(() => subtotal + taxAmount, [subtotal, taxAmount]);

  return (
    <div className="border border-gray-300 rounded-lg p-8 px-16 shadow-md bg-white w-full max-w-sm">
      <h2 className="text-lg font-semibold mb-2">Cart Summary</h2>
      <div className="flex justify-between">
        <span>Subtotal:</span>
        <span>
          {currency}
          {subtotal.toFixed(2)}
        </span>
      </div>
      <div className="flex justify-between">
        <span>Tax ({(taxRate * 100).toFixed(0)}%):</span>
        <span>
          {currency}
          {taxAmount.toFixed(2)}
        </span>
      </div>
      <hr className="my-2 text-gray-300" />
      <div className="flex justify-between font-semibold text-lg">
        <span>Total:</span>
        <span>
          {currency}
          {total.toFixed(2)}
        </span>
      </div>
      <button className="mt-4 w-full bg-primary text-white p-3 rounded-md">
        Process to checkout
      </button>
    </div>
  );
};

export default CartSummary;
