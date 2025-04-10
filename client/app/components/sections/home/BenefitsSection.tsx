"use client";
import { useGetSectionByPageSlugQuery } from "@/app/store/apis/SectionApi";
import { Truck, Headphones, ShieldCheck } from "lucide-react";
import { JSX } from "react";

// Map string icon names to Lucide components
const iconMap: { [key: string]: JSX.Element } = {
  Truck: <Truck size={32} />,
  Headphones: <Headphones size={32} />,
  ShieldCheck: <ShieldCheck size={32} />,
};

const BenefitsSection = () => {
  const { data: sectionsData, isLoading } =
    useGetSectionByPageSlugQuery("landing");

  const benefitsSection = sectionsData?.sections?.find(
    (section: any) => section.type === "Benefits"
  );
  console.log("benefitsSection: ", benefitsSection);
  const benefits = benefitsSection?.content || [];

  return (
    <section className="w-full max-w-[80%] mx-auto my-12">
      {isLoading ? (
        <div className="text-center">Loading benefits...</div>
      ) : benefits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {benefits.map((benefit: any, index: number) => (
            <div key={index} className="flex flex-col items-center">
              <div className="p-4 bg-gray-200 rounded-full flex items-center justify-center">
                <div className="bg-black text-white p-4 rounded-full">
                  {iconMap[benefit.icon] || <span>Icon Missing</span>}
                </div>
              </div>
              <h3 className="mt-4 text-lg font-semibold">{benefit.title}</h3>
              <p className="text-gray-500">{benefit.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">No benefits available</div>
      )}
    </section>
  );
};

export default BenefitsSection;
