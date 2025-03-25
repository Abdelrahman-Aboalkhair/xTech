import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const CategoriesBar = () => {
  const categories = [
    { name: "Electronics", slug: "electronics" },
    { name: "Clothing", slug: "clothing" },
    { name: "Home & Kitchen", slug: "home-kitchen" },
    { name: "Beauty", slug: "beauty" },
    { name: "Sports", slug: "sports" },
    { name: "Books", slug: "books" },
    { name: "Educational materials", slug: "educational-materials" },
  ];

  return (
    <div className="w-full">
      <div className="container mx-auto border-r-2 border-gray-200">
        <div className="flex flex-col gap-8 items-start justify-between overflow-x-auto py-[18px] whitespace-nowrap">
          {categories.map((category, index) => (
            <React.Fragment key={category.slug + index}>
              <Link
                href={`/category/${category.slug}`}
                className="flex items-center text-gray-700 hover:text-black transition-colors font-medium text-[16px]"
              >
                {category.name}
                <ChevronRight size={16} className="ml-1" />
              </Link>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesBar;
