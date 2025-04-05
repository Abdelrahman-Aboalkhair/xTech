"use client";
import BreadCrumb from "@/app/components/feedback/BreadCrumb";
import MainLayout from "@/app/components/templates/MainLayout";
import { Trash2 } from "lucide-react";
import React, { useMemo } from "react";
import Image from "next/image";
import Table from "@/app/components/organisms/Table";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import CartSummary from "@/app/components/sections/cart/CartSummary";
import { useGetUserCartQuery } from "@/app/store/apis/CartApi";
import QuantitySelector from "@/app/components/atoms/QuantitySelector";

const Cart = () => {
  const { control } = useForm();
  const { data, isLoading } = useGetUserCartQuery({});
  console.log("data: ", data);
  const cartItems = data?.cart?.cartItems;

  const subtotal = useMemo(() => {
    if (!cartItems || cartItems.length === 0) return 0;
    return cartItems.reduce((sum: number, item: any) => {
      return sum + item.product.price * item.quantity;
    }, 0);
  }, [cartItems]);
  console.log("subtotal: ", subtotal);

  const columns = [
    {
      key: "product",
      label: "Product",
      render: (row: any) => (
        <div className="flex items-center space-x-4">
          <button className="text-red-500 text-lg">
            <Trash2 size={18} />
          </button>
          <Image
            src={row.product.images[0]}
            alt={row.name + " image"}
            width={50}
            height={50}
          />
          <span>{row.name}</span>
        </div>
      ),
    },
    {
      key: "price",
      label: "Price",
      render: (row: any) => `$${row.product.price}`,
    },
    {
      key: "quantity",
      label: "Quantity",
      render: (row: any) => (
        <Controller
          name={`quantity-${row.product._id}`}
          defaultValue={row.quantity}
          control={control}
          render={({ field }) => (
            <QuantitySelector
              value={field.value}
              onChange={field.onChange}
              productId={row.product.id}
            />
          )}
        />
      ),
    },

    {
      key: "subtotal",
      label: "Subtotal",
      render: (row: any) => `$${row.product.price * row.quantity}`,
    },
  ];

  return (
    <MainLayout>
      <div className="flex flex-col items-start gap-4 mt-8 px-[10%]">
        <BreadCrumb />
        <div className="w-full mt-6">
          <Table data={cartItems} columns={columns} isLoading={isLoading} />
        </div>
        <div className="flex justify-between w-full mt-6">
          <Link href={"/cartItems"} className="border px-6 py-2">
            Return To Shop
          </Link>
          <button className="border px-6 py-2">Update Cart</button>
        </div>
        <CartSummary subtotal={subtotal} />
      </div>
    </MainLayout>
  );
};

export default Cart;
