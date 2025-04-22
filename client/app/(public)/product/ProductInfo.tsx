import React from "react";
import Rating from "@/app/components/feedback/Rating";
import { CheckCircle, Truck, RotateCcw } from "lucide-react";
import { useAddToCartMutation } from "@/app/store/apis/CartApi";
import useToast from "@/app/hooks/ui/useToast";

interface ProductInfoProps {
  id: string;
  name: string;
  averageRating: number;
  reviewCount: number;
  stock: number;
  price: number;
  discount: number;
  description: string | null | undefined;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  id,
  name,
  averageRating,
  reviewCount,
  stock,
  price,
  discount,
  description,
}) => {
  const { showToast } = useToast();
  const discountedPrice = (price * (1 - discount / 100)).toFixed(2);
  const isDiscounted = discount > 0;
  const [addToCart, { isLoading }] = useAddToCartMutation();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await addToCart({ productId: id, quantity: 1 });
    } catch (error: any) {
      showToast(error.data.message, "error");
      console.error("Error adding to cart:", error);
    }
  };
  return (
    <div className="flex flex-col gap-4 px-4 md:px-8 py-6">
      {/* Product Name */}
      <h1 className="text-3xl font-bold text-gray-900">{name}</h1>

      {/* Rating and Stock */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Rating rating={averageRating} />
        <span>({reviewCount} reviews)</span>
        <span className="text-green-600 font-medium ml-2">
          {stock > 0 ? `${stock} in stock` : "Out of stock"}
        </span>
      </div>

      {/* Price */}
      <div className="flex items-center gap-3">
        <span className="text-2xl font-semibold text-black">
          ${discountedPrice}
        </span>
        {isDiscounted && (
          <>
            <span className="text-sm text-gray-500 line-through">
              ${price.toFixed(2)}
            </span>
            <span className="text-sm bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
              -{discount}%
            </span>
          </>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="text-gray-700 leading-relaxed text-sm">{description}</p>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row items-stretch gap-2">
        <button
          disabled={!stock}
          onClick={handleAddToCart}
          className={`w-full sm:w-auto px-8 py-3 text-sm font-medium text-white rounded-xl transition duration-300 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          } ${
            stock
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {stock > 0 ? "Add to Cart" : "Out of Stock"}
        </button>
        <button
          disabled={!stock}
          className={`w-full sm:w-auto px-8 py-3 text-sm font-medium border-[2px] rounded-xl transition duration-300 ${
            stock
              ? "border-indigo-600 text-indigo-600 hover:bg-gray-100"
              : "border-gray-300 text-gray-400 cursor-not-allowed"
          }`}
        >
          Buy Now
        </button>
      </div>

      {/* Delivery & Return */}
      <div className="mt-6 space-y-3 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Truck size={18} className="text-green-600" />
          <span>Free Delivery on orders over $50</span>
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw size={18} className="text-blue-600" />
          <span>30-Day Hassle-Free Returns</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle size={18} className="text-primary" />
          <span>100% Quality Guarantee</span>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
