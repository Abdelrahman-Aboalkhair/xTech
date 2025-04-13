// components/sections/TopNav.tsx
import { Plus, Layers } from "lucide-react";
import { motion } from "framer-motion";
import { UseFormReturn } from "react-hook-form";
import { SectionFormData } from "./types";

interface TopNavProps {
  setIsModalOpen: (open: boolean) => void;
  setEditingSection: (section: any) => void;
  form: UseFormReturn<SectionFormData>;
}

const TopNav = ({ setIsModalOpen, setEditingSection, form }: TopNavProps) => {
  const handleNewSection = () => {
    setEditingSection(null);
    form.reset({
      id: 0,
      title: "",
      type: "",
      content: {},
      order: 0,
      isVisible: true,
      pageId: 1,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Layers className="h-6 w-6 text-blue-600" />
            <h1 className="ml-3 text-xl font-semibold text-gray-800">
              Sections
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNewSection}
              className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Section
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNav;
