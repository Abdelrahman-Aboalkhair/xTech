import React, { useState } from "react";
import Image from "next/image";

interface ProductImageGalleryProps {
  images: string[];
  name: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  name,
}) => {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:max-h-[540px]">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(img)}
            className={`border-2 rounded-xl p-1 transition-all duration-200 ${
              selectedImage === img ? "border-black" : "border-transparent"
            } hover:border-black`}
          >
            <Image
              src={img}
              alt={`${name} thumbnail ${index + 1}`}
              width={80}
              height={80}
              className="rounded-lg object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-2xl p-4">
        <Image
          src={selectedImage}
          alt={name}
          width={500}
          height={500}
          className="rounded-xl object-contain max-h-[500px] w-auto"
          priority
        />
      </div>
    </div>
  );
};

export default ProductImageGallery;
