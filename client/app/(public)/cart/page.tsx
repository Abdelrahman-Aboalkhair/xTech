"use client";
import BreadCrumb from "@/app/components/feedback/BreadCrumb";
import MainLayout from "@/app/components/templates/MainLayout";
import { Trash2 } from "lucide-react";
import React from "react";
import Image from "next/image";
import Table from "@/app/components/organisms/Table";
import Link from "next/link";
import Dropdown from "@/app/components/molecules/Dropdown";
import { Controller, useForm } from "react-hook-form";
import CartSummary from "@/app/components/sections/cart/CartSummary";
import { useGetUserCartQuery } from "@/app/store/apis/CartApi";

const Cart = () => {
  const { control } = useForm();
  const { data, isLoading } = useGetUserCartQuery({});
  console.log("data: ", data);
  const cartItems = data?.cart?.cartItems;

  // const subtotal = useMemo(
  //   () =>
  //     cartItems.reduce(
  //       (sum: number, item: any) => sum + item.price * item.quantity,
  //       0
  //     ),
  //   [cartItems]
  // );

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
            alt={row.name}
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
      render: () => (
        <Controller
          name="quantity"
          control={control}
          render={({ field }) => (
            <Dropdown
              label="Quantity"
              options={["1", "2", "3", "4", "5"]}
              {...field}
              className="max-w-[130px]"
            />
          )}
        />
      ),
    },
    {
      key: "subtotal",
      label: "Subtotal",
      render: (row: any) => `$${row.price}`,
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
        <CartSummary subtotal={22} />
      </div>
    </MainLayout>
  );
};

export default Cart;
