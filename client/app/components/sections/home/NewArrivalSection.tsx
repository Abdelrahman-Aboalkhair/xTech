import Image from "next/image";
import Woman from "@/app/assets/images/woman.png";
import Gucci from "@/app/assets/images/gucci.png";
import Speakers from "@/app/assets/images/speakers.png";
import PlayStation from "@/app/assets/images/playstation.png";

const NewArrivalSection = () => {
  return (
    <section className="w-full max-w-[80%] mx-auto my-12">
      <div className="flex items-center justify-between mb-8">
        <h2
          className="text-2xl font-semibold capitalize relative before:content-[''] 
        before:absolute before:left-0 before:top-[-2px] before:w-[6px] before:rounded before:h-[2.5rem] before:bg-[#db4444] text-[#db4444] pl-6"
        >
          New Arrivals
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* PlayStation 5 - Large Left Column */}
        <div className="relative h-[500px] rounded-lg overflow-hidden">
          <Image
            src={PlayStation}
            alt="PlayStation 5"
            fill
            className="object-cover z-10"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 z-0"></div>
          <div className="absolute inset-0 flex flex-col justify-end p-6 text-white z-20">
            <h3 className="text-lg font-semibold">PlayStation 5</h3>
            <p className="text-sm">
              Black and White version of the PS5 coming out on sale.
            </p>
            <button className="mt-2 text-sm font-semibold border-b-2 border-white w-fit">
              Shop Now
            </button>
          </div>
        </div>

        {/* Right Column with 3 Items */}
        <div className="grid grid-rows-3 gap-4">
          {/* Women's Collection */}
          <div className="relative h-[160px] rounded-lg overflow-hidden">
            <Image
              src={Woman}
              alt="Women's Collection"
              fill
              className="object-cover z-10"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 z-0"></div>
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white z-20">
              <h3 className="text-lg font-semibold">Women's Collections</h3>
              <p className="text-sm">
                Featured woman collections that give you another vibe.
              </p>
              <button className="mt-2 text-sm font-semibold border-b-2 border-white w-fit">
                Shop Now
              </button>
            </div>
          </div>

          {/* Speakers */}
          <div className="relative h-[160px] rounded-lg overflow-hidden">
            <Image
              src={Speakers}
              alt="Speakers"
              fill
              className="object-cover z-10"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 z-0"></div>
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white z-20">
              <h3 className="text-lg font-semibold">Speakers</h3>
              <p className="text-sm">Amazon wireless speakers</p>
              <button className="mt-2 text-sm font-semibold border-b-2 border-white w-fit">
                Shop Now
              </button>
            </div>
          </div>

          {/* Gucci Perfume */}
          <div className="relative h-[160px] rounded-lg overflow-hidden">
            <Image
              src={Gucci}
              alt="Perfume"
              fill
              className="object-cover z-10"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 z-0"></div>
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white z-20">
              <h3 className="text-lg font-semibold">Perfume</h3>
              <p className="text-sm">GUCCI INTENSE OUD EDP</p>
              <button className="mt-2 text-sm font-semibold border-b-2 border-white w-fit">
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewArrivalSection;
