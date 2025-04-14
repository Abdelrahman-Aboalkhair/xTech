"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import Img1 from "@/app/assets/images/woman.png";
import Img2 from "@/app/assets/images/speakers.png";
import Img3 from "@/app/assets/images/gucci.png";
interface Arrival {
  image: string;
  title: string;
  description: string;
}

interface NewArrivalSectionProps {
  data?: {
    content: Arrival[];
  };
  isPreview?: boolean;
}

const defaultArrivals: Arrival[] = [
  {
    image: Img1,
    title: "Featured Arrival",
    description: "Discover our latest flagship product.",
  },
  {
    image: Img2,
    title: "New Release",
    description: "A stylish addition to our collection.",
  },
  {
    image: Img3,
    title: "Hot Pick",
    description: "Explore this trending item today.",
  },
];

const NewArrivalSection = ({
  data,
  isPreview = false,
}: NewArrivalSectionProps) => {
  const arrivals =
    Array.isArray(data?.content) && data.content.length > 0
      ? data.content
      : defaultArrivals;

  return (
    <section
      className={`w-full my-[6%] ${
        isPreview ? "max-w-full scale-75 py-4 px-2" : ""
      } rounded-2xl`}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`flex items-center space-x-3 my-10 ${
          isPreview ? "mb-4" : "mb-10"
        }`}
      >
        <div className="h-6 w-1 rounded-full bg-gradient-to-b from-indigo-500 to-purple-600"></div>
        <span className="ml-2 text-md font-semibold tracking-wider text-gray-700 uppercase">
          New Arrivals
        </span>
      </motion.div>

      {/* Grid Layout */}
      <div
        className={`grid grid-cols-1 ${
          isPreview ? "md:grid-cols-2 gap-4" : "md:grid-cols-4 gap-8"
        }`}
      >
        {/* Large Featured Item (First Item) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className={`${
            isPreview
              ? "md:col-span-1 md:row-span-1 h-40"
              : "md:col-span-2 md:row-span-2 h-[500px]"
          } relative rounded-2xl overflow-hidden shadow-lg group bg-white`}
          role="article"
          aria-labelledby={`featured-title-${arrivals[0].title}`}
        >
          <Image
            src={arrivals[0].image}
            alt={arrivals[0].title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10"></div>
          <div
            className={`absolute inset-0 flex flex-col justify-end text-white z-20 ${
              isPreview ? "p-3" : "p-8"
            }`}
          >
            <h3
              id={`featured-title-${arrivals[0].title}`}
              className={`font-semibold tracking-tight ${
                isPreview ? "text-base" : "text-2xl"
              }`}
            >
              {arrivals[0].title}
            </h3>
            <p
              className={`mt-2 line-clamp-2 ${
                isPreview ? "text-xs" : "text-base"
              } opacity-90`}
            >
              {arrivals[0].description}
            </p>
            <button
              className={`${
                isPreview
                  ? "mt-2 text-xs px-4 py-1.5"
                  : "mt-4 text-sm px-6 py-2"
              } font-medium bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
              aria-label={`Shop ${arrivals[0].title}`}
            >
              Shop Now
            </button>
          </div>
        </motion.div>

        {/* Smaller Items */}
        {arrivals.slice(1).map((item: Arrival, index: number) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className={`relative ${
              isPreview ? "h-32" : "h-[240px]"
            } rounded-2xl overflow-hidden shadow-md group bg-white`}
            role="article"
            aria-labelledby={`item-title-${item.title}`}
          >
            <Image
              src={item.image}
              alt={item.title}
              width={300}
              height={200}
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10"></div>
            <div
              className={`absolute inset-0 flex flex-col justify-end text-white z-20 ${
                isPreview ? "p-3" : "p-5"
              }`}
            >
              <h3
                id={`item-title-${item.title}`}
                className={`font-semibold tracking-tight ${
                  isPreview ? "text-sm" : "text-lg"
                }`}
              >
                {item.title}
              </h3>
              <p
                className={`mt-1 line-clamp-2 ${
                  isPreview ? "text-[10px]" : "text-sm"
                } opacity-90`}
              >
                {item.description}
              </p>
              <button
                className={`${
                  isPreview
                    ? "mt-2 text-[10px] px-3 py-1"
                    : "mt-3 text-xs px-4 py-1.5"
                } font-medium bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                aria-label={`Shop ${item.title}`}
              >
                Shop Now
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default NewArrivalSection;
