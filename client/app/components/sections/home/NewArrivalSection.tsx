"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { useGetSectionByPageSlugQuery } from "@/app/store/apis/SectionApi";

const NewArrivalSection = () => {
  const { data: sectionsData, isLoading } =
    useGetSectionByPageSlugQuery("landing");

  // Find the NewArrivals section from the API response
  const newArrivalsSection = sectionsData?.sections?.find(
    (section: any) => section.type === "NewArrivals"
  );
  const arrivals = newArrivalsSection?.content || []; // Default to empty array if no data

  return (
    <section className="max-w-7xl px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center space-x-3 mb-8"
      >
        <Package size={24} className="text-indigo-500" />
        <h2 className="text-2xl font-bold text-gray-800 capitalize">
          New Arrivals
        </h2>
      </motion.div>

      {/* Grid Layout */}
      {isLoading ? (
        <div className="text-center">Loading new arrivals...</div>
      ) : arrivals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Large Featured Item (First Item) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2 md:row-span-2 relative h-[450px] rounded-xl overflow-hidden group"
          >
            <Image
              src={arrivals[0].image}
              alt={arrivals[0].title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white z-20">
              <h3 className="text-xl font-semibold">{arrivals[0].title}</h3>
              <p className="text-sm mt-1">{arrivals[0].description}</p>
              <button className="mt-3 text-sm font-medium text-indigo-300 hover:text-indigo-100 transition-colors duration-200 w-fit">
                Shop Now
              </button>
            </div>
          </motion.div>

          {/* Smaller Items */}
          {arrivals.slice(1).map((item: any, index: number) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative h-[200px] rounded-xl overflow-hidden group"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-4 text-white z-20">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-xs mt-1 line-clamp-2">{item.description}</p>
                <button className="mt-2 text-xs font-medium text-indigo-300 hover:text-indigo-100 transition-colors duration-200 w-fit">
                  Shop Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center">No new arrivals available</div>
      )}
    </section>
  );
};

export default NewArrivalSection;
