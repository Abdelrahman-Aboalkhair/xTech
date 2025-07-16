"use client";
import BreadCrumb from "@/app/components/feedback/BreadCrumb";
import MainLayout from "@/app/components/templates/MainLayout";
import { Trash2, ShoppingCart } from "lucide-react";
import React, { useMemo } from "react";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import CartSummary from "@/app/(public)/cart/CartSummary";
import {
  useGetCartQuery,
  useRemoveFromCartMutation,
} from "@/app/store/apis/CartApi";
import QuantitySelector from "@/app/components/molecules/QuantitySelector";
import { motion } from "framer-motion";

// Helper function to format variant name from SKU
const formatVariantName = (item: any) => {
  const { name } = item.variant.product;
  const sku = item.variant.sku;
  // Parse SKU (e.g., "TSH-RED-M" -> "Red, Medium")
  const parts = sku.split("-").slice(1); // Remove prefix (e.g., "TSH")
  const variantDetails = parts.join(", "); // Join color and size
  return `${name} - ${variantDetails}`;
};

const Cart = () => {
  const { control } = useForm();
  const { data, isLoading } = useGetCartQuery({});
  const [removeFromCart] = useRemoveFromCartMutation();
  const cartItems = data?.cart?.cartItems || [];
  console.log("items => ", cartItems);

  const subtotal = useMemo(() => {
    if (!cartItems.length) return 0;
    return cartItems.reduce(
      (sum, item) => sum + item.variant.price * item.quantity,
      0
    );
  }, [cartItems]);
  console.log("subtotal => ", subtotal);

  const handleRemoveFromCart = async (id) => {
    try {
      await removeFromCart(id).unwrap();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <BreadCrumb />

        {/* Cart Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-2 mt-6 mb-8"
        >
          <h1 className="text-2xl font-bold text-gray-800">Your Cart</h1>
          <span className="text-gray-500">({cartItems.length} items)</span>
        </motion.div>

        {/* Cart Content */}
        {isLoading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-lg text-gray-600">Your cart is empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white rounded-xl p-6 border border-gray-200 flex items-center space-x-4"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden shadow-sm">
                    <Image
                      src={item.variant.product.images[0]}
                      alt={formatVariantName(item)}
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  </div>

                  {/* Variant Details */}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                      {formatVariantName(item)}
                    </p>
                    <p className="text-sm text-gray-500">
                      ${item.variant.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Selector */}
                  <Controller
                    name={`quantity-${item.variant.id}`}
                    defaultValue={item.quantity}
                    control={control}
                    render={({ field }) => (
                      <QuantitySelector
                        itemId={item.id}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />

                  {/* Subtotal and Remove */}
                  <div className="text-right space-y-2">
                    <p className="font-medium text-gray-800">
                      ${(item.variant.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="text-red-500 hover:text-red-600 transition-colors duration-200"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Cart Summary */}
            <CartSummary
              subtotal={subtotal}
              totalItems={cartItems.length}
              cartId={data?.cart?.id}
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Cart;
