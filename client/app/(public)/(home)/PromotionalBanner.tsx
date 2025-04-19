"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import SpeakerImg from "@/app/assets/images/speaker.png";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useGetPromoQuery } from "@/app/store/apis/SectionApi";

interface PromoSection {
  id: number;
  type: string;
  title?: string;
  description?: string;
  images?: string[];
  link?: string;
  ctaText?: string;
  isVisible?: boolean;
  primaryColor?: string;
  secondaryColor?: string;
}

interface PromotionalSectionProps {
  isPreview?: boolean;
}

// Default fallback content if API data is missing
const defaultPromo = {
  title: "Enhance Your Music Experience",
  description: "Premium audio that transforms your listening journey",
  ctaText: "Shop Now",
  buttonColor: "#22c55e",
  backgroundColor: "#000000",
  textColor: "#ffffff",
  images: [SpeakerImg],
  imageAlt: "Placeholder Product",
  accent: "#22c55e",
};

const PromotionalSection = ({ isPreview = false }: PromotionalSectionProps) => {
  const { data, isLoading } = useGetPromoQuery(undefined);
  console.log("data promo => ", data);
  const [isVisible, setIsVisible] = useState(false);

  // Extract promo section from API data
  const promoSection = data?.promo || null;

  // Determine what content to display based on API data availability
  const headline = promoSection?.title || defaultPromo.title;
  const subheadline = promoSection?.description || defaultPromo.description;
  const buttonText = promoSection?.ctaText || defaultPromo.ctaText;
  const backgroundColor =
    promoSection?.primaryColor || defaultPromo.backgroundColor;
  const buttonColor = promoSection?.secondaryColor || defaultPromo.buttonColor;
  const textColor = defaultPromo.textColor; // Use default as this might not come from API
  const image = promoSection?.images?.[0] || defaultPromo.images[0];
  const imageAlt = promoSection?.title || defaultPromo.imageAlt;
  const accent = buttonColor; // Use buttonColor as accent if not specified

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Split headline for animation
  const headlineWords = headline.split(" ");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const imageVariants = {
    hidden: { x: 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: "easeOut", delay: 0.3 },
    },
  };

  // Show loading state when data is being fetched
  if (isLoading && !isPreview) {
    return (
      <div className="w-full mx-auto my-16 h-64 bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <section
      className={`relative w-full ${
        isPreview ? "max-w-full scale-75 h-32" : "h-[500px]"
      } mx-auto rounded-2xl overflow-hidden ${
        isPreview ? "my-2" : "my-16"
      } shadow-2xl`}
      style={{
        background: `linear-gradient(135deg, ${backgroundColor}, ${adjustColorBrightness(
          backgroundColor,
          -15
        )})`,
      }}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -right-24 -top-24 w-64 h-64 rounded-full opacity-20"
          style={{ background: accent }}
        ></div>
        <div
          className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full opacity-10"
          style={{ background: accent }}
        ></div>
      </div>

      <div
        className={`relative z-10 flex flex-col justify-center h-full ${
          isPreview ? "px-4" : "px-12 lg:px-16"
        }`}
      >
        <div className="flex flex-col lg:flex-row items-center">
          <motion.div
            className={`${
              isPreview ? "max-w-[50%] space-y-1" : "w-full lg:w-1/2 space-y-6"
            }`}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <div className="space-y-2">
              <motion.h1
                className={`font-bold leading-tight ${
                  isPreview ? "text-lg" : "text-5xl md:text-6xl"
                }`}
                style={{ color: textColor }}
              >
                {isPreview ? (
                  headline
                ) : (
                  <>
                    {headlineWords.map((word, index) => (
                      <motion.span
                        key={index}
                        variants={itemVariants}
                        className="inline-block mr-4"
                      >
                        {word}
                      </motion.span>
                    ))}
                  </>
                )}
              </motion.h1>

              {!isPreview && subheadline && (
                <motion.p
                  className="text-lg opacity-80 mt-3 max-w-lg"
                  style={{ color: textColor }}
                  variants={itemVariants}
                >
                  {subheadline}
                </motion.p>
              )}
            </div>

            <motion.div variants={itemVariants}>
              <button
                className={`group flex items-center border-2 text-white font-semibold tracking-wider rounded-full transition-all duration-300 ${
                  isPreview ? "py-1 px-4 text-xs" : "py-4 px-8 text-base"
                } hover:shadow-lg`}
                style={{
                  borderColor: buttonColor,
                  boxShadow: `0 10px 25px -5px ${hexToRgba(buttonColor, 0.4)}`,
                }}
              >
                {buttonText}
                {!isPreview && (
                  <ArrowRight
                    size={18}
                    className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
                  />
                )}
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-1/3`}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={imageVariants}
          >
            <Image
              src={image}
              alt={imageAlt}
              width={230}
              height={230}
              className="object-contain drop-shadow-2xl"
              priority
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Helper functions
function adjustColorBrightness(hex: string, percent: number) {
  // Convert hex to RGB
  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);

  // Adjust brightness
  r = Math.max(0, Math.min(255, r + percent));
  g = Math.max(0, Math.min(255, g + percent));
  b = Math.max(0, Math.min(255, b + percent));

  // Convert back to hex
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getContrastingTextColor(hexColor: string) {
  // Convert hex to RGB
  const r = parseInt(hexColor.substring(1, 3), 16);
  const g = parseInt(hexColor.substring(3, 5), 16);
  const b = parseInt(hexColor.substring(5, 7), 16);

  // Calculate luminance (perceived brightness)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return white for dark backgrounds, black for light backgrounds
  return luminance > 0.5 ? "#000000" : "#ffffff";
}

export default PromotionalSection;
