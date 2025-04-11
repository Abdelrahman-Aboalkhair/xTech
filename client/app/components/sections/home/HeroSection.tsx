"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import adjustColor from "@/app/utils/adjustColor";

interface HeroContent {
  backgroundColor: string;
  sliderImages: string[];
  promoText: string;
  productName: string;
  productIcon?: string;
  link: string;
  buttonText?: string;
  secondaryText?: string;
}

interface HeroSectionProps {
  data?: {
    content: HeroContent;
  };
  isPreview?: boolean;
}

const defaultContent: HeroContent = {
  backgroundColor: "#1a1a1a",
  sliderImages: [
    "/images/hero-placeholder1.jpg",
    "/images/hero-placeholder2.jpg",
    "/images/hero-placeholder3.jpg",
  ],
  promoText: "Discover Premium Products for Your Lifestyle",
  secondaryText: "Limited time offers with exclusive benefits",
  productName: "Featured Collection",
  productIcon: "/icons/product-placeholder.png",
  link: "/shop",
  buttonText: "Explore Now",
};

const HeroSection = ({ data, isPreview = false }: HeroSectionProps) => {
  const content =
    data?.content && typeof data.content === "object"
      ? { ...defaultContent, ...data.content }
      : defaultContent;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === content.sliderImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? content.sliderImages.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    if (!isPreview && !isHovering) {
      const interval = setInterval(() => {
        nextImage();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isPreview, isHovering]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const imageVariants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
      };
    },
  };

  return (
    <main
      className={`relative w-[80%] mx-auto ${
        isPreview ? "scale-90 my-2" : "my-12"
      } overflow-hidden rounded-xl`}
      style={{
        background: `linear-gradient(135deg, ${
          content.backgroundColor
        }, ${adjustColor(content.backgroundColor, -20)})`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent z-10"></div>

      <motion.div
        className="relative z-20 flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div
          className={`flex flex-col w-full lg:w-1/2 text-white space-y-4 lg:space-y-6 ${
            isPreview ? "text-center lg:text-left" : "text-center lg:text-left"
          }`}
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center space-x-3 mb-2"
          >
            {content.productIcon && (
              <div className="bg-white/10 backdrop-blur-sm p-2 rounded-full">
                <Image
                  src={content.productIcon}
                  alt={`${content.productName} Logo`}
                  width={isPreview ? 24 : 32}
                  height={isPreview ? 24 : 32}
                  className="object-contain"
                  aria-hidden="true"
                />
              </div>
            )}
            <span
              className={`font-medium text-indigo-200 ${
                isPreview ? "text-sm" : "text-lg"
              }`}
            >
              {content.productName}
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className={`font-extrabold leading-tight tracking-tight ${
              isPreview
                ? "text-2xl lg:text-3xl line-clamp-2"
                : "text-4xl lg:text-6xl"
            }`}
          >
            {content.promoText}
          </motion.h1>

          {content.secondaryText && (
            <motion.p
              variants={itemVariants}
              className={`font-light ${
                isPreview ? "text-sm line-clamp-2" : "text-lg lg:text-xl"
              }`}
            >
              {content.secondaryText}
            </motion.p>
          )}

          <motion.div variants={itemVariants} className="pt-4">
            <Link
              href={content.link}
              className={`group inline-flex items-center ${
                isPreview ? "text-sm px-4 py-2" : "px-6 py-3"
              } font-semibold bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all 
              duration-300 shadow-lg hover:shadow-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
              aria-label={`Shop ${content.productName}`}
            >
              {content.buttonText || "Shop Now"}
              <ArrowRight
                size={isPreview ? 16 : 20}
                className="ml-2 group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </motion.div>
        </div>

        {/* Image slider */}
        <div
          className={`relative ${
            isPreview
              ? "w-full mt-6 lg:mt-0 max-w-sm mx-auto lg:max-w-none lg:w-1/2"
              : "w-full mt-8 lg:mt-0 lg:w-1/2"
          }`}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div
            className={`relative overflow-hidden rounded-xl shadow-2xl ${
              isPreview ? "h-56" : "h-72 lg:h-96"
            }`}
          >
            {content.sliderImages.map((image, index) => (
              <motion.div
                key={index}
                custom={index < currentImageIndex ? -1 : 1}
                variants={imageVariants}
                initial="enter"
                animate={index === currentImageIndex ? "center" : "exit"}
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.5 },
                }}
                className="absolute inset-0"
                style={{
                  display: index === currentImageIndex ? "block" : "none",
                }}
              >
                <Image
                  src={image}
                  alt={`Product image ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={index === currentImageIndex}
                  className="object-cover object-center"
                />
              </motion.div>
            ))}

            {!isPreview && (
              <>
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-30">
                  {content.sliderImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex
                          ? "bg-white w-6"
                          : "bg-white/50"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all z-30"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all z-30"
                  aria-label="Next image"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Visual elements for modern look */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/20 blur-3xl rounded-full z-0"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-500/10 blur-3xl rounded-full z-0"></div>
    </main>
  );
};

// Helper function to adjust color brightness

export default HeroSection;
