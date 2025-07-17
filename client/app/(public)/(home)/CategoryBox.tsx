import Image from "next/image";
import Link from "next/link";

interface CategoryBoxProps {
  title: string;
  items: Array<{
    name: string;
    image: any;
  }>;
  ctaText: string;
  ctaLink: string;
}

const CategoryBox = ({ title, items }: CategoryBoxProps) => {
  return (
    <div className="bg-white p-4 px-8 pb-8 rounded-lg shadow-md flex flex-col h-full">
      <h2 className="font-bold text-lg mb-2">{title}</h2>
      <div className="grid grid-cols-2 gap-2 flex-grow">
        {items.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="relative w-full aspect-square mb-1 overflow-hidden">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover rounded-md"
              />
            </div>
            <span className="text-xs text-gray-700 truncate w-full text-center">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryBox;
