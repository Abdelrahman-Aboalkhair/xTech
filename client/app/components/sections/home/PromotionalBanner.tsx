"use client";
import { useGetSectionByPageSlugQuery } from "@/app/store/apis/SectionApi";
import Image from "next/image";

const PromotionalBanner = () => {
  const { data: sectionsData, isLoading } =
    useGetSectionByPageSlugQuery("landing");

  const promoSection = sectionsData?.sections?.find(
    (section: any) => section.type === "PromoBanner"
  );
  const promo = promoSection?.content || {
    headline: "Enhance Your Music Experience",
    buttonText: "Buy Now!",
    buttonColor: "#22c55e",
    backgroundColor: "#000000",
    image: "/images/speaker.png",
    imageAlt: "Speaker",
  };

  return (
    <section
      className="relative w-full max-w-[80%] mx-auto h-[500px] rounded-lg overflow-hidden flex items-center px-8 my-[5rem]"
      style={{ backgroundColor: promo.backgroundColor }}
    >
      {isLoading ? (
        <div className="text-white text-center w-full">
          Loading promotion...
        </div>
      ) : (
        <>
          <div className="text-white max-w-xl space-y-4">
            <h1 className="text-[65px] font-bold leading-tight">
              {promo.headline.split(" ").map((word, index) => (
                <span key={index}>
                  {word}
                  {index < promo.headline.split(" ").length - 1 ? <br /> : " "}
                </span>
              ))}
            </h1>
            <button
              className="font-semibold tracking-wider py-[14px] px-12 rounded hover:opacity-90 transition mt-2 text-black"
              style={{ backgroundColor: promo.buttonColor }}
            >
              {promo.buttonText}
            </button>
          </div>

          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[50%]">
            <Image
              src={promo.image}
              alt={promo.imageAlt}
              width={650}
              height={500}
              className="object-contain"
            />
          </div>
        </>
      )}
    </section>
  );
};

export default PromotionalBanner;
