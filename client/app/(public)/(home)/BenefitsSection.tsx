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
  Truck: <Truck size={28} />,
  Headphones: <Headphones size={28} />,
  ShieldCheck: <ShieldCheck size={28} />,
};

const previewIconMap: { [key: string]: JSX.Element } = {
  Truck: <Truck size={16} />,
  Headphones: <Headphones size={16} />,
  ShieldCheck: <ShieldCheck size={16} />,
};

const defaultBenefits: Benefit[] = [
  {
    icon: "Truck",
    title: "Fast Delivery",
    description: "Reliable and quick delivery service to your doorstep.",
  },
  {
    icon: "Headphones",
    title: "24/7 Support",
    description: "Friendly assistance anytime you need it.",
  },
  {
    icon: "ShieldCheck",
    title: "Secure Shopping",
    description: "Safe and encrypted transactions guaranteed.",
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
        isPreview ? "max-w-full scale-90" : "max-w-7xl"
      } mx-auto ${isPreview ? "my-4" : "my-16 px-4 md:px-0"}`}
    >
      <div
        className={`grid ${
          isPreview ? "gap-4" : "gap-8"
        } grid-cols-1 sm:grid-cols-2 md:grid-cols-3 text-center`}
      >
        {benefits.map((benefit: Benefit, index: number) => (
          <div
            key={index}
            className={`flex flex-col items-center bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 ${
              isPreview ? "p-3" : "p-6"
            }`}
          >
            <div
              className={`bg-indigo-100 rounded-full flex items-center justify-center ${
                isPreview ? "p-2" : "p-4"
              } mb-4`}
            >
              <div
                className={`bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-full ${
                  isPreview ? "p-2" : "p-3"
                }`}
              >
                {isPreview
                  ? previewIconMap[benefit.icon] || (
                      <span className="text-[8px]">Icon</span>
                    )
                  : iconMap[benefit.icon] || (
                      <span className="text-xs">Icon</span>
                    )}
              </div>
            </div>
            <h3
              className={`font-semibold text-indigo-800 ${
                isPreview ? "text-sm" : "text-xl"
              } mb-1`}
            >
              {benefit.title}
            </h3>
            <p
              className={`text-gray-500 ${
                isPreview ? "text-xs text-center" : "text-base"
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
