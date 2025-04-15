import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn, Maximize2 } from "lucide-react";

interface ProductImageGalleryProps {
  images: string[];
  name: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  name,
}) => {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Update selectedIndex when selectedImage changes
  useEffect(() => {
    const index = images.findIndex((img) => img === selectedImage);
    if (index !== -1) {
      setSelectedIndex(index);
    }
  }, [selectedImage, images]);

  const handleImageSelect = (img: string, index: number) => {
    setSelectedImage(img);
    setSelectedIndex(index);
    setIsZoomed(false);
  };

  const handlePrevImage = () => {
    const newIndex =
      selectedIndex === 0 ? images.length - 1 : selectedIndex - 1;
    setSelectedImage(images[newIndex]);
    setSelectedIndex(newIndex);
    setIsZoomed(false);
  };

  const handleNextImage = () => {
    const newIndex =
      selectedIndex === images.length - 1 ? 0 : selectedIndex + 1;
    setSelectedImage(images[newIndex]);
    setSelectedIndex(newIndex);
    setIsZoomed(false);
  };

  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
  };

  const handleFullScreenToggle = () => {
    setIsFullScreen(!isFullScreen);
    setIsZoomed(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;

    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100; // normalize to 0-100
    const y = ((e.clientY - top) / height) * 100;

    setMousePosition({ x, y });
  };

  return (
    <div
      className={`relative ${
        isFullScreen ? "fixed inset-0 z-50 bg-white p-4" : ""
      }`}
    >
      {isFullScreen && (
        <button
          onClick={handleFullScreenToggle}
          className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
        >
          <Maximize2 size={20} />
        </button>
      )}

      <div
        className={`flex ${
          isFullScreen ? "h-full" : ""
        } flex-col md:flex-row gap-6`}
      >
        {/* Thumbnails */}
        <div
          className={`flex md:flex-col gap-3 ${
            isFullScreen
              ? "md:max-h-screen overflow-y-auto"
              : "md:max-h-[540px] overflow-x-auto md:overflow-y-auto"
          }`}
        >
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => handleImageSelect(img, index)}
              className={`relative border-2 rounded-xl p-1 transition-all duration-200 ${
                selectedImage === img
                  ? "border-blue-600 shadow-md"
                  : "border-gray-200 hover:border-blue-400"
              }`}
            >
              <div className="relative w-20 h-20">
                <Image
                  src={img}
                  alt={`${name} thumbnail ${index + 1}`}
                  fill
                  sizes="80px"
                  className="rounded-lg object-cover"
                  priority={index < 2}
                />
              </div>
              {selectedImage === img && (
                <div className="absolute inset-0 bg-blue-600 bg-opacity-10 rounded-xl"></div>
              )}
            </button>
          ))}
        </div>

        {/* Main Image Container */}
        <div
          className={`relative flex-1 ${
            isFullScreen ? "flex items-center justify-center" : ""
          }`}
        >
          {/* Navigation Arrows */}
          <div className="absolute inset-y-0 left-2 flex items-center z-10">
            <button
              onClick={handlePrevImage}
              className="bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all transform hover:scale-105"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
          </div>

          <div className="absolute inset-y-0 right-2 flex items-center z-10">
            <button
              onClick={handleNextImage}
              className="bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all transform hover:scale-105"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Zoom and Fullscreen Controls */}
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <button
              onClick={handleZoomToggle}
              className={`bg-white rounded-full p-2 shadow-md transition-all ${
                isZoomed ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
              }`}
              aria-label={isZoomed ? "Exit zoom" : "Zoom image"}
            >
              <ZoomIn size={20} />
            </button>

            {!isFullScreen && (
              <button
                onClick={handleFullScreenToggle}
                className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-all"
                aria-label="View fullscreen"
              >
                <Maximize2 size={20} />
              </button>
            )}
          </div>

          {/* Main Image */}
          <div
            className={`flex items-center justify-center ${
              isFullScreen ? "h-full" : "bg-gray-50 rounded-2xl p-6"
            } overflow-hidden`}
            onMouseMove={handleMouseMove}
            style={{ cursor: isZoomed ? "zoom-out" : "zoom-in" }}
            onClick={handleZoomToggle}
          >
            <div
              className={`relative ${
                isFullScreen ? "max-h-full max-w-full" : "h-[500px] w-full"
              } overflow-hidden rounded-xl`}
            >
              <Image
                src={selectedImage}
                alt={name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={`object-contain transition-all duration-300 ${
                  isZoomed ? "scale-150" : "scale-100"
                }`}
                style={
                  isZoomed
                    ? {
                        transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                        objectPosition: "center",
                      }
                    : {}
                }
                priority
              />
            </div>
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-6 left-6 bg-white bg-opacity-80 px-3 py-1 rounded-full text-sm text-gray-700 shadow-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductImageGallery;
