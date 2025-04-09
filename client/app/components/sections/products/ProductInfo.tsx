import React from "react";
import Rating from "@/app/components/feedback/Rating";
import SizeSelector from "@/app/components/atoms/SizeSelector";

interface ProductInfoProps {
  name: string;
  averageRating: number;
  ratings: number;
  stock: number;
  price: number;
  discount: number;
  description: string | null | undefined;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  name,
  averageRating,
  ratings,
  stock,
  price,
  discount,
  description,
}) => {
  const discountedPrice = (price * (1 - discount / 100)).toFixed(2);

  return (
    <div className="flex flex-col items-start justify-start gap-2 ml-12">
      <h1 className="text-2xl font-semibold">{name}</h1>
      <div className="flex items-center">
        <Rating rating={averageRating} />
        <span className="text-gray-500 ml-2 text-sm">
          ({ratings}) Reviews |
        </span>
        <span className="text-green-700 ml-2 text-sm">{stock} In Stock</span>
      </div>

      <div className="flex items-center gap-2">
        <p className="text-lg font-semibold text-gray-700">
          ${discountedPrice}
        </p>
        {discount > 0 && (
          <p className="text-sm text-gray-500 line-through">${price}</p>
        )}
      </div>

      <p className="text-sm text-gray-800">{description}</p>

      <SizeSelector />

      <div className="mt-4 flex items-center gap-4">
        <button
          disabled={!stock}
          className={`${
            !stock && "opacity-50 cursor-not-allowed"
          } font-medium text-white px-[3rem] py-[12px] rounded hover:bg-red-600 bg-primary`}
        >
          {!stock ? "Out of Stock" : "Buy Now"}
        </button>
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-gray-600">✔ Free Delivery</p>
        <p className="text-gray-600">↩ Free 30 Days Return</p>
      </div>
    </div>
  );
};

export default ProductInfo;
