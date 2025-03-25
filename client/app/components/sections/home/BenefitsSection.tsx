import { Truck, Headphones, ShieldCheck } from "lucide-react";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: <Truck size={32} />,
      title: "FREE AND FAST DELIVERY",
      description: "Free delivery for all orders over $140",
    },
    {
      icon: <Headphones size={32} />,
      title: "24/7 CUSTOMER SERVICE",
      description: "Friendly 24/7 customer support",
    },
    {
      icon: <ShieldCheck size={32} />,
      title: "MONEY BACK GUARANTEE",
      description: "We return money within 30 days",
    },
  ];

  return (
    <section className="w-full max-w-[80%] mx-auto my-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="p-4 bg-gray-200 rounded-full flex items-center justify-center">
              <div className="bg-black text-white p-4 rounded-full">
                {benefit.icon}
              </div>
            </div>
            <h3 className="mt-4 text-lg font-semibold">{benefit.title}</h3>
            <p className="text-gray-500">{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BenefitsSection;
