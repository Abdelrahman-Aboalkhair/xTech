"use client";
import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useUpdateCartItemMutation } from "@/app/store/apis/CartApi";
import Button from "../atoms/Button";

type QuantitySelectorProps = {
  value: number;
  onChange: (value: number) => void;
  productId: string;
};

const QuantitySelector = ({
  value,
  onChange,
  productId,
}: QuantitySelectorProps) => {
  const [updateCartItem, { data, error, isLoading }] =
    useUpdateCartItemMutation();
  console.log("updateCartItem: ", data);
  if (error) {
    console.log("error: ", error);
  }
  const [localQty, setLocalQty] = useState(value);

  const handleUpdate = async (newQty: number) => {
    if (newQty < 1) return;
    try {
      setLocalQty(newQty);
      onChange(newQty);
      const res = await updateCartItem({
        productId,
        quantity: newQty,
      }).unwrap();
      console.log("res: ", res);
    } catch (error) {
      console.error("Failed to update quantity:", error);
      setLocalQty(value);
    }
  };

  useEffect(() => {
    setLocalQty(value);
  }, [value]);

  return (
    <div className="flex items-center border rounded-md w-fit px-2">
      <Button
        type="button"
        onClick={() => handleUpdate(localQty - 1)}
        disabled={isLoading || localQty <= 1}
        className=""
      >
        <Minus size={16} />
      </Button>
      <span className="px-4">{localQty}</span>
      <Button
        type="button"
        onClick={() => handleUpdate(localQty + 1)}
        disabled={isLoading}
        className=""
      >
        <Plus size={16} />
      </Button>
    </div>
  );
};

export default QuantitySelector;
