import Image from "next/image";
import Speaker from "@/app/assets/images/speaker.png";

const PromotionalBanner = () => {
  return (
    <section className="relative w-full max-w-[80%] mx-auto h-[500px] bg-black rounded-lg overflow-hidden flex items-center px-8 my-[5rem]">
      <div className="text-white max-w-xl space-y-4">
        <p className="text-green-500 font-semibold">Categories</p>
        <h1 className="text-[65px] font-bold leading-tight">
          Enhance Your <br /> Music Experience
        </h1>
        <button className="bg-green-500 text-black font-semibold tracking-wider py-[14px] px-12 rounded hover:bg-green-600 transition mt-2">
          Buy Now!
        </button>
      </div>

      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[50%] ">
        <Image
          src={Speaker}
          alt="Speaker"
          width={650}
          height={500}
          className="object-contain"
        />
      </div>
    </section>
  );
};

export default PromotionalBanner;
