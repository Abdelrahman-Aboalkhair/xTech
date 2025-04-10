"use client";
import Image from "next/image";
import Link from "next/link";
import CategoriesBar from "../../molecules/CategoriesBar";
import ImageSlider from "../../organisms/ImageSlider";
import { useGetHeroPromoQuery } from "@/app/store/apis/WidgetApi";

const HeroSection = () => {
  const { data: promoData, isLoading } = useGetHeroPromoQuery();
  console.log("promoData => ", promoData);

  const fallbackPromo = {
    backgroundColor: "#000000",
    sliderImages: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
      "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    ],
    promoText: "Up to 10% off Voucher",
    productName: "iPhone 12 Pro Max",
    productIcon: "/icons/apple.png",
    link: "/shop",
  };

  const promo = promoData?.widgets?.[0]?.config || fallbackPromo;

  return (
    <main className="flex items-center justify-between px-[10%] gap-10">
      <div className="w-[20%]">
        <CategoriesBar />
      </div>
      <section
        className="flex items-center justify-between px-10 py-16 mt-4 w-full text-white"
        style={{ backgroundColor: promo.backgroundColor }}
      >
        {isLoading ? (
          <div>Loading promotion...</div>
        ) : (
          <>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-5">
                {promo.productIcon && (
                  <Image
                    src={promo.productIcon}
                    alt={`${promo.productName} Logo`}
                    width={30}
                    height={30}
                  />
                )}
                <span className="text-lg font-medium">{promo.productName}</span>
              </div>
              <h1 className="text-7xl leading-tight font-extrabold">
                {promo.promoText}
              </h1>
              <Link
                href={promo.link}
                className="text-lg font-semibold border-b-2 border-white w-max cursor-pointer hover:opacity-80"
              >
                Shop Now
              </Link>
            </div>
            <div>
              <ImageSlider
                images={promo.sliderImages}
                interval={4000}
                autoPlay={true}
              />
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default HeroSection;
