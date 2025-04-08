import { useInitiateCheckoutMutation } from "@/app/store/apis/CheckoutApi";
import React, { useMemo } from "react";
import { loadStripe } from "@stripe/stripe-js";
import useToast from "@/app/hooks/ui/useToast";
import { useClearCartMutation } from "@/app/store/apis/CartApi";

interface CartSummaryProps {
  subtotal: number;
  shippingRate?: number;
  currency?: string;
  totalItems: number;
  cartId: string;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  shippingRate = 0.01,
  currency = "$",
  totalItems,
  cartId,
}) => {
  const { showToast } = useToast();
  const stripePromise = loadStripe(
    "pk_test_51R9gs72KGvEXtMtXXTm7UscmmHYsvk9j3ktaM8vxRb3evNJgG1dpD05YWACweIfcPtpCgOIs4HkpGrTCKE1dZD0p00sLC6iIBg"
  );

  const [initiateCheckout, { isLoading, error }] =
    useInitiateCheckoutMutation();
  const [clearCart] = useClearCartMutation();
  if (error) {
    console.log("error: ", error);
  }

  const shippingFee = useMemo(
    () => subtotal * shippingRate,
    [subtotal, shippingRate]
  );
  const total = useMemo(() => subtotal + shippingFee, [subtotal, shippingFee]);

  const handleInitiateCheckout = async () => {
    try {
      const res = await initiateCheckout({}).unwrap();
      console.log("res => ", res);

      const stripe = await stripePromise;
      const result = await stripe?.redirectToCheckout({
        sessionId: res.sessionId,
      });

      if (result?.error) {
        showToast(result.error?.message, "error");
        console.error(result.error.message);
      }

      await clearCart(cartId).unwrap();
    } catch (error) {
      console.log("Error checking out: ", error);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-8 px-16 mt-4 space-y-3 shadow-sm w-full max-w-md">
      <h2 className="text-lg font-semibold mb-4 text-center">Cart Summary</h2>
      <div className="flex justify-between">
        <span>Total items</span>
        <span>{totalItems}</span>
      </div>
      <div className="flex justify-between">
        <span>Subtotal</span>
        <span>
          {currency}
          {subtotal.toFixed(2)}
        </span>
      </div>
      <div className="flex justify-between">
        <span>Shipping ({(shippingRate * 100).toFixed(0)}%):</span>
        <span>
          {currency}
          {shippingFee.toFixed(2)}
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
      <button
        disabled={isLoading}
        onClick={handleInitiateCheckout}
        className="mt-4 w-full bg-primary text-white p-3 rounded-md"
      >
        {isLoading ? "Loading..." : "Proceed to checkout"}
      </button>
    </div>
  );
};

export default CartSummary;
