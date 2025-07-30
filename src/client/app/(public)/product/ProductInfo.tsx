"use client";
import useToast from "@/app/hooks/ui/useToast";

interface ProductInfoProps {
  id: string;
  name: string;
  description: string;
  price: number;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  id,
  name,
  description,
  price,
}) => {
  const { showToast } = useToast();

  return (
    <div id={id} className="flex flex-col gap-4 px-4 md:px-8 py-6">
      <h1 className="text-3xl font-bold text-gray-900">{name}</h1>

      {/* Price */}
      <div className="text-2xl font-semibold text-gray-900">
        ${price.toFixed(2)}
      </div>

      {/* Description */}
      <p className="text-gray-700 leading-relaxed text-sm mt-2">
        {description}
      </p>
    </div>
  );
};

export default ProductInfo;
