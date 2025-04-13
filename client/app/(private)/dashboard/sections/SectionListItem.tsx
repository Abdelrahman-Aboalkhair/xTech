// components/sections/SectionListItem.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Edit2, MoreVertical, Copy, Trash2 } from "lucide-react";
import { Section } from "./types";
import { UseFormReturn } from "react-hook-form";
import { SectionFormData } from "./types";

interface SectionListItemProps {
  section: Section;
  setEditingSection: (section: Section | null) => void;
  setIsModalOpen: (open: boolean) => void;
  form: UseFormReturn<SectionFormData>;
  handleDuplicateSection: (section: Section) => void;
}

const SectionListItem = ({
  section,
  setEditingSection,
  setIsModalOpen,
  form,
  handleDuplicateSection,
}: SectionListItemProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.li
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center min-w-0">
            {section.isVisible ? (
              <Eye className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
            ) : (
              <EyeOff className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
            )}
            <p className="text-sm font-medium text-blue-600 truncate">
              {section.title}
            </p>
          </div>
          <div className="ml-2 flex-shrink-0 flex">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {section.type}
            </span>
          </div>
        </div>
        <div className="mt-2 sm:flex sm:justify-between">
          <div className="sm:flex">
            <p className="flex items-center text-sm text-gray-500 mr-6">
              Order: {section.order}
            </p>
            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
              Page ID: {section.pageId}
            </p>
          </div>
          <div className="mt-2 flex items-center text-sm sm:mt-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setEditingSection(section);
                form.reset(section);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2"
            >
              <Edit2 className="h-3 w-3 mr-1" />
              Edit
            </motion.button>
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full focus:outline-none"
              >
                <MoreVertical className="h-5 w-5" />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                  <button
                    onClick={() => {
                      handleDuplicateSection(section);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <Copy className="h-4 w-4 mr-2 text-gray-500" />
                    Duplicate
                  </button>
                  <button className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left">
                    <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.li>
  );
};

export default SectionListItem;
