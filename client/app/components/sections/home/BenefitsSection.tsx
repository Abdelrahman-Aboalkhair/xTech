import { Truck, Headphones, ShieldCheck } from "lucide-react";
import { JSX } from "react";

interface Benefit {
  icon: string;
  title: string;
  description: string;
}

interface BenefitsSectionProps {
  data?: {
    content: Benefit[];
  };
  isPreview?: boolean;
}

const iconMap: { [key: string]: JSX.Element } = {
  Truck: <Truck size={24} />,
  Headphones: <Headphones size={24} />,
  ShieldCheck: <ShieldCheck size={24} />,
};

const previewIconMap: { [key: string]: JSX.Element } = {
  Truck: <Truck size={16} />,
  Headphones: <Headphones size={16} />,
  ShieldCheck: <ShieldCheck size={16} />,
};

const defaultBenefits: Benefit[] = [
  {
    icon: "Truck",
    title: "Sample Delivery",
    description: "Fast and reliable delivery.",
  },
  {
    icon: "Headphones",
    title: "Sample Support",
    description: "Support when you need it.",
  },
  {
    icon: "ShieldCheck",
    title: "Sample Security",
    description: "Shop with confidence.",
  },
];

const BenefitsSection = ({ data, isPreview = false }: BenefitsSectionProps) => {
  const benefits =
    Array.isArray(data?.content) && data.content.length > 0
      ? data.content
      : defaultBenefits;

  return (
    <section
      className={`w-full ${
        isPreview ? "max-w-full scale-75" : "max-w-[80%]"
      } mx-auto ${isPreview ? "my-2" : "my-12"}`}
    >
      <div
        className={`flex flex-row flex-wrap justify-center ${
          isPreview ? "gap-4" : "md:grid md:grid-cols-3 gap-8"
        } text-center`}
      >
        {benefits.map((benefit: Benefit, index: number) => (
          <div
            key={index}
            className={`flex flex-col items-center ${
              isPreview ? "w-24" : "w-full"
            }`}
          >
            <div
              className={`bg-gray-200 rounded-full flex items-center justify-center ${
                isPreview ? "p-1.5" : "p-4"
              }`}
            >
              <div
                className={`bg-black text-white rounded-full ${
                  isPreview ? "p-1.5" : "p-3"
                }`}
              >
                {isPreview
                  ? previewIconMap[benefit.icon] || (
                      <span className="text-[8px]">Icon Missing</span>
                    )
                  : iconMap[benefit.icon] || (
                      <span className="text-xs">Icon Missing</span>
                    )}
              </div>
            </div>
            <h3
              className={`mt-2 font-semibold ${
                isPreview ? "text-xs" : "text-lg"
              }`}
            >
              {benefit.title}
            </h3>
            <p
              className={`text-gray-500 ${
                isPreview ? "text-[10px] line-clamp-2" : "text-base"
              }`}
            >
              {benefit.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BenefitsSection;
