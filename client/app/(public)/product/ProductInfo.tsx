"use client";
import React, { useState } from "react";
import Rating from "@/app/components/feedback/Rating";
import { CheckCircle, Truck, RotateCcw } from "lucide-react";
import { useAddToCartMutation } from "@/app/store/apis/CartApi";
import useToast from "@/app/hooks/ui/useToast";

interface Attribute {
  id: string;
  name: string;
  type: string; // "select" | "multiselect" | "text" | "boolean"
  slug: string;
}

interface AttributeValue {
  id: string;
  value: string;
  slug: string;
}

interface ProductAttribute {
  id: string;
  attribute: Attribute;
  value?: AttributeValue; // Only present for select/multiselect types
  customValue?: string; // Only present for text/boolean types
}

interface ProductInfoProps {
  id: string;
  name: string;
  averageRating: number;
  reviewCount: number;
  stock: number;
  price: number;
  discount: number;
  description?: string | null;
  attributes: ProductAttribute[];
  selectedAttributes?: Record<string, { valueId?: string; customValue?: string }>;
  onAttributeChange?: (
    attributeId: string,
    valueId?: string,
    customValue?: string
  ) => void;
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
  attributes,
}) => {
  console.log("attributes => ", attributes);
  const { showToast } = useToast();
  const [addToCart, { isLoading }] = useAddToCartMutation();

  // State to track selected attribute values
  const [selectedAttributes, setSelectedAttributes] = useState<{
    [attributeId: string]: { valueId?: string; customValue?: string };
  }>({});

  const discountedPrice = (price * (1 - discount / 100)).toFixed(2);
  const isDiscounted = discount > 0;

  // Handle attribute selection
  const handleAttributeChange = (
    attributeId: string,
    valueId?: string,
    customValue?: string
  ) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeId]: { valueId, customValue },
    }));
  };

  // Handle adding to cart with selected attributes
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      // Validate that all required attributes are selected
      // const missingAttributes = attributes.filter(
      //   (attr) => !selectedAttributes[attr.attribute.id]
      // );
      // if (missingAttributes.length > 0) {
      //   showToast(
      //     `Please select ${missingAttributes
      //       .map((a) => a.attribute.name)
      //       .join(", ")}`,
      //     "error"
      //   );
      //   return;
      // }

      // Format attributes for cart
      // const cartAttributes = Object.entries(selectedAttributes).map(
      //   ([attributeId, value]) => ({
      //     attributeId,
      //     valueId: value.valueId,
      //     customValue: value.customValue,
      //   })
      // );

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
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Rating rating={averageRating} />
        <span>({reviewCount || 0} reviews)</span>
        <span className="text-primary font-medium ml-2">
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

      {/* Attributes */}
      {attributes.length > 0 && (
        <div>
          <div className="mt-2 flex gap-4 items-start justify-start space-y-4">
            {attributes.map((attr) => (
              <div key={attr.id} className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700 capitalize">
                  {attr.attribute.name}
                </label>

                {/* For SELECT/MULTISELECT attributes with values */}
                {['select', 'multiselect'].includes(attr.attribute.type) && attr.value && (
                  <div className="flex gap-2">
                    <span className="px-4 py-2 text-sm rounded border border-gray-300 bg-gray-100 text-gray-700 capitalize">
                      {attr.value.value}
                    </span>
                  </div>
                )}

                {/* For TEXT/BOOLEAN attributes with custom values */}
                {attr.attribute.type === 'text' && attr.customValue && (
                  <span className="text-sm text-gray-700">
                    {attr.customValue}
                  </span>
                )}

                {attr.attribute.type === 'boolean' && (
                  <span className="text-sm text-gray-700">
                    {attr.customValue || 'No'}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      {description && (
        <p className="text-gray-700 leading-relaxed text-sm mt-2">
          {description}
        </p>
      )}

      {/* Action Buttons */}
      <div className="mt-2 flex flex-col sm:flex-row items-stretch gap-2">
        <button
          disabled={!stock || isLoading}
          onClick={handleAddToCart}
          className={`w-full sm:w-auto px-12 py-3 text-sm font-medium text-white rounded transition duration-300 ${isLoading || !stock ? "opacity-50 cursor-not-allowed" : ""
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
          className={`w-full sm:w-auto px-12 py-3 text-sm font-medium border-[2px] rounded transition duration-300 ${stock
            ? "border-primary text-primary hover:bg-gray-100"
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
