import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const SectionCard = ({ section, onDelete, onEdit }) => {
  const typeColors = {
    HERO: "bg-blue-100 text-blue-800 border-blue-300",
    PROMOTIONAL: "bg-purple-100 text-purple-800 border-purple-300",
    BENEFITS: "bg-green-100 text-green-800 border-green-300",
    NEW_ARRIVALS: "bg-amber-100 text-amber-800 border-amber-300",
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const typeColorClass =
    typeColors[section.type] || "bg-gray-100 text-gray-800 border-gray-300";

  const handleDelete = async (e) => {
    e.stopPropagation();
    setIsDeleting(true);
    try {
      await onDelete(section.type);
    } catch (error) {
      console.error("Error deleting section:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(section);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg border border-gray-100">
      <div
        className="flex justify-between items-center p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${typeColorClass}`}
          >
            {section.type}
          </span>
          <h3 className="font-medium text-gray-800">
            {section.title || "Untitled Section"}
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleEdit}
            className="p-1 hover:bg-gray-100 rounded-full"
            title="Edit section"
          >
            <Edit size={18} className="text-gray-500" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 hover:bg-gray-100 rounded-full"
            title="Delete section"
            disabled={isDeleting}
          >
            <Trash2
              size={18}
              className={`${isDeleting ? "text-gray-300" : "text-gray-500"}`}
            />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Description</p>
              <p className="text-sm text-gray-700">
                {section.description || "No description"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">CTA Text</p>
              <p className="text-sm text-gray-700">
                {section.ctaText || "No CTA text"}
              </p>
            </div>
            {section.images && section.images.length > 0 && (
              <div className="col-span-2">
                <p className="text-sm text-gray-500 mb-1">Images</p>
                <div className="flex flex-wrap gap-2">
                  {section.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center overflow-hidden"
                    >
                      {typeof img === "string" && (
                        <Image
                          src={img}
                          alt="Section"
                          width={400}
                          height={400}
                          className="object-cover w-full h-full"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionCard;
