import {
  Truck,
  Headphones,
  ShieldCheck,
  Star,
  ThumbsUp,
  Clock,
  Zap,
  Heart,
} from "lucide-react";
import { JSX } from "react";

interface Benefit {
  icon: string;
  title: string;
  description: string;
}

interface BenefitsSectionProps {
  data?: {
    content: Benefit[];
    title?: string;
    subtitle?: string;
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
  };
  isPreview?: boolean;
}

const iconMap: { [key: string]: JSX.Element } = {
  Truck: <Truck size={28} strokeWidth={2} />,
  Headphones: <Headphones size={28} strokeWidth={2} />,
  ShieldCheck: <ShieldCheck size={28} strokeWidth={2} />,
  Star: <Star size={28} strokeWidth={2} />,
  ThumbsUp: <ThumbsUp size={28} strokeWidth={2} />,
  Clock: <Clock size={28} strokeWidth={2} />,
  Zap: <Zap size={28} strokeWidth={2} />,
  Heart: <Heart size={28} strokeWidth={2} />,
};

const previewIconMap: { [key: string]: JSX.Element } = {
  Truck: <Truck size={18} strokeWidth={2} />,
  Headphones: <Headphones size={18} strokeWidth={2} />,
  ShieldCheck: <ShieldCheck size={18} strokeWidth={2} />,
  Star: <Star size={18} strokeWidth={2} />,
  ThumbsUp: <ThumbsUp size={18} strokeWidth={2} />,
  Clock: <Clock size={18} strokeWidth={2} />,
  Zap: <Zap size={18} strokeWidth={2} />,
  Heart: <Heart size={18} strokeWidth={2} />,
};

const defaultBenefits: Benefit[] = [
  {
    icon: "Truck",
    title: "Fast Delivery",
    description: "Free worldwide shipping on all orders over $50.",
  },
  {
    icon: "ShieldCheck",
    title: "Secure Shopping",
    description: "100% secure payment processing and data protection.",
  },
  {
    icon: "Headphones",
    title: "24/7 Support",
    description: "Dedicated support team available around the clock.",
  },
];

const BenefitsSection = ({ data, isPreview = false }: BenefitsSectionProps) => {
  const benefits =
    Array.isArray(data?.content) && data.content.length > 0
      ? data.content
      : defaultBenefits;

  const title = data?.title || "Why Choose Us";
  const subtitle =
    data?.subtitle || "We provide the best experience for our customers";
  const backgroundColor = data?.backgroundColor || "bg-gray-50";
  const textColor = data?.textColor || "text-gray-900";
  const accentColor = data?.accentColor || "indigo";

  // Color mappings for the accent color
  const colorMappings = {
    indigo: {
      light: "bg-indigo-50",
      medium: "bg-indigo-100",
      gradient: "from-indigo-500 to-indigo-700",
      text: "text-indigo-700",
      hover: "group-hover:bg-indigo-600",
      border: "border-indigo-200",
    },
    blue: {
      light: "bg-blue-50",
      medium: "bg-blue-100",
      gradient: "from-blue-500 to-blue-700",
      text: "text-blue-700",
      hover: "group-hover:bg-blue-600",
      border: "border-blue-200",
    },
    teal: {
      light: "bg-teal-50",
      medium: "bg-teal-100",
      gradient: "from-teal-500 to-teal-700",
      text: "text-teal-700",
      hover: "group-hover:bg-teal-600",
      border: "border-teal-200",
    },
    purple: {
      light: "bg-purple-50",
      medium: "bg-purple-100",
      gradient: "from-purple-500 to-purple-700",
      text: "text-purple-700",
      hover: "group-hover:bg-purple-600",
      border: "border-purple-200",
    },
    amber: {
      light: "bg-amber-50",
      medium: "bg-amber-100",
      gradient: "from-amber-500 to-amber-700",
      text: "text-amber-700",
      hover: "group-hover:bg-amber-600",
      border: "border-amber-200",
    },
  };

  // Select color set based on accentColor, default to indigo
  const colorSet =
    colorMappings[accentColor as keyof typeof colorMappings] ||
    colorMappings.indigo;

  return (
    <section
      className={`w-full ${backgroundColor} ${textColor} py-12 ${
        isPreview ? "scale-95" : ""
      }`}
    >
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${
          isPreview ? "py-2" : "py-6"
        }`}
      >
        {!isPreview && (
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-3">
              {title}
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-500">
              {subtitle}
            </p>
          </div>
        )}

        <div
          className={`grid ${
            isPreview ? "gap-3" : "gap-6 lg:gap-10"
          } grid-cols-1 md:grid-cols-3`}
        >
          {benefits.map((benefit: Benefit, index: number) => (
            <div
              key={index}
              className={`group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 
                          border ${colorSet.border} overflow-hidden ${
                isPreview ? "p-4" : "p-6"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex-shrink-0 ${colorSet.medium} rounded-lg p-3`}
                >
                  <div
                    className={`bg-gradient-to-br ${colorSet.gradient} text-white rounded-lg p-2 
                                transform transition-transform duration-300 group-hover:scale-110`}
                  >
                    {isPreview
                      ? previewIconMap[benefit.icon] || (
                          <span className="text-xs">Icon</span>
                        )
                      : iconMap[benefit.icon] || (
                          <span className="text-sm">Icon</span>
                        )}
                  </div>
                </div>
                <div>
                  <h3
                    className={`${colorSet.text} font-semibold ${
                      isPreview ? "text-sm" : "text-xl"
                    } mb-2`}
                  >
                    {benefit.title}
                  </h3>
                  <p
                    className={`text-gray-600 ${
                      isPreview ? "text-xs" : "text-base"
                    } leading-relaxed`}
                  >
                    {benefit.description}
                  </p>
                </div>
              </div>
              <div
                className={`absolute inset-0 opacity-0 ${colorSet.light} mix-blend-multiply 
                              transition-opacity duration-300 group-hover:opacity-100`}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
