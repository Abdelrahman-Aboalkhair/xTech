"use client";
import React, { useState } from "react";
import Rating from "@/app/components/feedback/Rating";
import { CheckCircle, Truck, RotateCcw } from "lucide-react";
import { useAddToCartMutation } from "@/app/store/apis/CartApi";
import useToast from "@/app/hooks/ui/useToast";

interface ProductAttribute {
  id: string;
  attribute: { id: string; name: string; type: string; slug: string };
  value?: { id: string; value: string; slug: string };
  customValue?: string;
}

interface ProductInfoProps {
  id: string;
  name: string;
  averageRating: number;
  reviewCount: number;
  stock: number;
  price: number;
  discount: number;
  description: string | null | undefined;
  attributes: ProductAttribute[];
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
      const missingAttributes = attributes.filter(
        (attr) => !selectedAttributes[attr.attribute.id]
      );
      if (missingAttributes.length > 0) {
        showToast(
          `Please select ${missingAttributes
            .map((a) => a.attribute.name)
            .join(", ")}`,
          "error"
        );
        return;
      }

      // Format attributes for cart
      const cartAttributes = Object.entries(selectedAttributes).map(
        ([attributeId, value]) => ({
          attributeId,
          valueId: value.valueId,
          customValue: value.customValue,
        })
      );

      await addToCart({
        productId: id,
        quantity: 1,
        attributes: cartAttributes,
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
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-900">Options</h3>
          <div className="mt-2 space-y-4">
            {attributes.map((attr) => (
              <div key={attr.id} className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  {attr.attribute.name}
                </label>
                {attr.attribute.type === "select" &&
                attr.attribute.values?.length ? (
                  <div className="flex gap-2">
                    {attr.attribute.values.map((value) => (
                      <button
                        key={value.id}
                        onClick={() =>
                          handleAttributeChange(attr.attribute.id, value.id)
                        }
                        className={`px-4 py-2 text-sm rounded border ${
                          selectedAttributes[attr.attribute.id]?.valueId ===
                          value.id
                            ? "bg-primary text-white border-primary"
                            : "border-gray-300 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {value.value}
                      </button>
                    ))}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={
                      selectedAttributes[attr.attribute.id]?.customValue || ""
                    }
                    onChange={(e) =>
                      handleAttributeChange(
                        attr.attribute.id,
                        undefined,
                        e.target.value
                      )
                    }
                    className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={`Enter ${attr.attribute.name}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      {description && (
        <p className="text-gray-700 leading-relaxed text-sm mt-4">
          {description}
        </p>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row items-stretch gap-2">
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
