"use client";
import Image from "next/image";

interface Promo {
  headline: string;
  buttonText: string;
  buttonColor: string;
  backgroundColor: string;
  image: string;
  imageAlt: string;
}

interface PromotionalSectionProps {
  data?: {
    content: Promo;
  };
  isPreview?: boolean;
}

const defaultPromo: Promo = {
  headline: "Sample Promotion",
  buttonText: "Shop Now",
  buttonColor: "#22c55e",
  backgroundColor: "#000000",
  image: "/images/placeholder.png",
  imageAlt: "Placeholder Product",
};

const PromotionalSection = ({
  data,
  isPreview = false,
}: PromotionalSectionProps) => {
  const promo =
    data?.content && typeof data.content === "object"
      ? data.content
      : defaultPromo;

  return (
    <section
      className={`relative w-full ${
        isPreview ? "max-w-full scale-75 h-32" : "max-w-[80%] h-[500px]"
      } mx-auto rounded-lg overflow-hidden flex items-center ${
        isPreview ? "px-4 my-2" : "px-8 my-[5rem]"
      }`}
      style={{ backgroundColor: promo.backgroundColor }}
    >
      <div
        className={`text-white ${
          isPreview ? "max-w-[50%] space-y-2" : "max-w-xl space-y-4"
        }`}
      >
        <h1
          className={`font-bold leading-tight ${
            isPreview ? "text-lg" : "text-[65px]"
          }`}
        >
          {promo.headline.split(" ").map((word, index) => (
            <span key={index}>
              {word}
              {index < promo.headline.split(" ").length - 1 && !isPreview ? (
                <br />
              ) : (
                " "
              )}
            </span>
          ))}
        </h1>
        <button
          className={`font-semibold tracking-wider rounded hover:opacity-90 transition text-black ${
            isPreview ? "py-1 px-4 text-xs" : "py-[14px] px-12 mt-2"
          }`}
          style={{ backgroundColor: promo.buttonColor }}
        >
          {promo.buttonText}
        </button>
      </div>

      <div
        className={`absolute right-0 top-1/2 transform -translate-y-1/2 ${
          isPreview ? "w-[40%]" : "w-[50%]"
        }`}
      >
        <Image
          src={promo.image}
          alt={promo.imageAlt}
          width={isPreview ? 150 : 650}
          height={isPreview ? 120 : 500}
          className="object-contain"
        />
      </div>
    </section>
  );
};

export default PromotionalSection;
