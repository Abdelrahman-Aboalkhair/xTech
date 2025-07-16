"use client";
import Rating from "@/app/components/feedback/Rating";
import { CheckCircle, Truck, RotateCcw } from "lucide-react";
import { useAddToCartMutation } from "@/app/store/apis/CartApi";
import useToast from "@/app/hooks/ui/useToast";

interface ProductInfoProps {
  id: string;
  name: string;
  averageRating: number;
  reviewCount: number;
  description?: string | null;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  id,
  name,
  averageRating,
  reviewCount,
  description,
}) => {
  const { showToast } = useToast();
  const [addToCart, { isLoading }] = useAddToCartMutation();

  // Handle adding to cart with selected attributes
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await addToCart({
        productId: id,
        quantity: 1,
        // attributes: cartAttributes,
      });
      showToast("Product added to cart", "success");
    } catch (error: any) {
      showToast(error.data?.message || "Failed to add to cart", "error");
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 px-4 md:px-8 py-6">
      {/* Product Name */}
      <h1 className="text-3xl font-bold text-gray-900">{name}</h1>

      {/* Rating and Stock */}
      {/* <div className="flex items-center gap-2 text-sm text-gray-600">
        <Rating rating={averageRating} />
        <span>({reviewCount || 0} reviews)</span>
        <span className="text-primary font-medium ml-2">
          {stock > 0 ? `${stock} in stock` : "Out of stock"}
        </span>
      </div> */}

      {/* Description */}
      {description && (
        <p className="text-gray-700 leading-relaxed text-sm mt-2">
          {description}
        </p>
      )}

      {/* Action Buttons */}
      {/* <div className="mt-2 flex flex-col sm:flex-row items-stretch gap-2">
        <button
          disabled={!stock || isLoading}
          onClick={handleAddToCart}
          className={`w-full sm:w-auto px-12 py-3 text-sm font-medium text-white rounded transition duration-300 ${
            isLoading || !stock ? "opacity-50 cursor-not-allowed" : ""
          } ${stock ? "bg-primary" : "bg-gray-400 cursor-not-allowed"}`}
        >
          {stock > 0
            ? isLoading
              ? "Adding..."
              : "Add to Cart"
            : "Out of Stock"}
        </button>
        <button
          disabled={!stock}
          className={`w-full sm:w-auto px-12 py-3 text-sm font-medium border-[2px] rounded transition duration-300 ${
            stock
              ? "border-primary text-primary hover:bg-gray-100"
              : "border-gray-300 text-gray-400 cursor-not-allowed"
          }`}
        >
          Buy Now
        </button>
      </div> */}

      {/* Delivery & Return */}
      <div className="mt-6 space-y-3 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Truck size={18} className="text-green-600" />
          <span>Free Delivery on orders over $50</span>
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw size={18} className="text-green-600" />
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
