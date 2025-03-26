import React from "react";
import Image from "next/image";

interface ProductImageGalleryProps {
  images: string[];
  name: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  name,
}) => {
  return (
    <div className="flex items-center justify-center gap-10">
      <div className="flex flex-col items-center justify-center gap-4">
        {images.map((img, index) => (
          <Image
            key={index}
            src={img}
            alt={name}
            width={140}
            height={140}
            className=" p-6 bg-gray-100 cursor-pointer hover:opacity-80"
          />
        ))}
      </div>
      <div className="bg-gray-100 flex items-center justify-center">
        <Image src={images[0]} alt={name} width={540} height={540} />
      </div>
    </div>
  );
};

export default ProductImageGallery;
