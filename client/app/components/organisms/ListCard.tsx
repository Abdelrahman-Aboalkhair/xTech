import { ArrowUpRight } from "lucide-react";

interface Item {
  id: number | string;
  name: string;
  subtitle: string;
  primaryInfo: string;
  secondaryInfo: string;
}

interface ListCardProps {
  title?: string;
  viewAllLink?: string;
  items: Item[];
  itemType?: "product" | "user";
}

interface ListItemProps {
  item: Item;
  itemType: "product" | "user";
}

// Header subcomponent
const ListCardHeader: React.FC<{ title: string; viewAllLink: string }> = ({
  title,
  viewAllLink,
}) => (
  <div className="flex justify-between items-center mb-4">
    <h2 className="font-semibold text-lg text-gray-800">{title}</h2>
    <a
      href={viewAllLink}
      className="text-gray-500 text-sm hover:text-gray-700 flex items-center transition-colors duration-200"
    >
      View All
    </a>
  </div>
);

// ListItem subcomponent
const ListItem: React.FC<ListItemProps> = ({ item, itemType }) => {
  const getImageClass = () => {
    if (itemType === "user") return "rounded-full";
    return "rounded-md";
  };

  return (
    <div className="flex items-center justify-between py-3 px-2 rounded-lg transition-all duration-200 hover:bg-gray-50 hover:shadow-md cursor-pointer group">
      {/* Left: Item info with image placeholder */}
      <div className="flex items-center space-x-3">
        <div
          className={`w-10 h-10 bg-gray-200 ${getImageClass()} group-hover:scale-105 transition-transform duration-200`}
        />
        <div>
          <h3 className="font-medium text-sm text-gray-700 group-hover:text-blue-600 transition-colors duration-200">
            {item.name}
          </h3>
          <p className="text-xs text-gray-400">{item.subtitle}</p>
        </div>
      </div>

      {/* Middle: Primary Info */}
      <div className="text-sm font-medium text-gray-600">
        {item.primaryInfo}
      </div>

      {/* Right: Secondary Info and arrow */}
      <div className="flex items-center space-x-3">
        <span className="text-sm text-gray-400">{item.secondaryInfo}</span>
        <button className="p-1 text-gray-400 group-hover:text-blue-500 group-hover:bg-blue-50 rounded-full transition-all duration-200 transform group-hover:rotate-45">
          <ArrowUpRight size={16} />
        </button>
      </div>
    </div>
  );
};

// Main ListCard component
export default function ListCard({
  title = "Top Items",
  viewAllLink = "#",
  items = [],
  itemType = "product",
}: ListCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 w-full">
      <ListCardHeader title={title} viewAllLink={viewAllLink} />

      {items.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm">No items available</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <ListItem key={item.id} item={item} itemType={itemType} />
          ))}
        </div>
      )}
    </div>
  );
}
