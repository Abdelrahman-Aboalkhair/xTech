import Image from "next/image";
import Apple from "@/app/assets/icons/apple.png";
import ImageSlider from "../../organisms/ImageSlider";
import CategoriesBar from "../../molecules/CategoriesBar";

const images = [
  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
  "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
  "https://images.unsplash.com/photo-1521747116042-5a810fda9664",
  "https://images.unsplash.com/photo-1512496015851-a90fb38ba796",
];

const MainSection = () => {
  return (
    <main className="flex items-center justify-between px-[12rem] gap-10">
      <div className="w-[20%]">
        <CategoriesBar />
      </div>
      <section className="bg-black text-white flex items-center justify-between px-10 py-16 mt-4 w-full">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-5">
            <Image src={Apple} alt="Apple Logo" width={30} height={30} />
            <span className="text-lg font-medium">iPhone 12 Pro Max</span>
          </div>
          <h1 className="text-7xl leading-tight font-extrabold">
            Up to 10% off Voucher
          </h1>
          <span className="text-lg font-semibold border-b-2 border-white w-max cursor-pointer hover:opacity-80">
            Shop Now
          </span>
        </div>
        <div>
          <ImageSlider images={images} interval={4000} autoPlay={true} />
        </div>
      </section>
    </main>
  );
};

export default MainSection;
