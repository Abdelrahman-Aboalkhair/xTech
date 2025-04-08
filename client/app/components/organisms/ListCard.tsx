import { ArrowUpRight } from "lucide-react";

export default function ListCard({
  title = "Top Items",
  viewAllLink = "#",
  items = [],
  itemType = "product", // Can be "product", "user", etc.
}) {
  // Default items for static display (products example)
  const defaultProducts = [
    {
      id: 1,
      name: "Product Names",
      subtitle: "SKU: SP00910SK",
      primaryInfo: "$5/item",
      secondaryInfo: "1.2k sold",
    },
    {
      id: 2,
      name: "Product Names",
      subtitle: "SKU: SP00910SK",
      primaryInfo: "$5/item",
      secondaryInfo: "1.2k sold",
    },
    {
      id: 3,
      name: "Product Names",
      subtitle: "SKU: SP00910SK",
      primaryInfo: "$5/item",
      secondaryInfo: "1.2k sold",
    },
    {
      id: 4,
      name: "Product Names",
      subtitle: "SKU: SP00910SK",
      primaryInfo: "$5/item",
      secondaryInfo: "1.2k sold",
    },
  ];

  // Use provided items or fallback to defaults
  const displayItems = items.length > 0 ? items : defaultProducts;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">{title}</h2>
        <a
          href={viewAllLink}
          className="text-gray-500 text-sm hover:text-gray-700 flex items-center"
        >
          View All
        </a>
      </div>

      {/* Items List */}
      <div className="space-y-2">
        {displayItems.map((item) => (
          <ListItem key={item.id} item={item} itemType={itemType} />
        ))}
      </div>
    </div>
  );
}

function ListItem({ item, itemType }) {
  const getImageClass = () => {
    if (itemType === "user") return "rounded-full"; // Circle for users
    return "rounded-md"; // Square/rounded for products and others
  };

  return (
    <div className="flex items-center justify-between py-3 px-2 rounded-lg transition-all duration-200 hover:bg-gray-50 hover:shadow-md cursor-pointer group">
      {/* Left: Item info with image placeholder */}
      <div className="flex items-center space-x-3">
        <div
          className={`w-10 h-10 bg-gray-200 ${getImageClass()} group-hover:scale-105 transition-transform duration-200`}
        ></div>
        <div>
          <h3 className="font-medium text-sm group-hover:text-blue-600 transition-colors">
            {item.name}
          </h3>
          <p className="text-xs text-gray-400">{item.subtitle}</p>
        </div>
      </div>

      {/* Middle: Primary Info */}
      <div className="text-sm font-medium">{item.primaryInfo}</div>

      {/* Right: Secondary Info and arrow */}
      <div className="flex items-center space-x-3">
        <span className="text-sm text-gray-400">{item.secondaryInfo}</span>
        <button className="p-1 text-gray-400 group-hover:text-blue-500 group-hover:bg-blue-50 rounded-full transition-all duration-200 transform group-hover:rotate-45">
          <ArrowUpRight size={16} />
        </button>
      </div>
    </div>
  );
}
