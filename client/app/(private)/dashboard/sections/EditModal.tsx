// components/sections/EditModal.tsx
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import SectionForm from "./SectionForm";
import { UseFormReturn } from "react-hook-form";
import { Section, SectionFormData } from "./types";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: UseFormReturn<SectionFormData>;
  onSubmit: (data: SectionFormData) => void;
  isLoading: boolean;
  editingSection: Section | null;
}

const EditModal = ({
  isOpen,
  onClose,
  form,
  onSubmit,
  isLoading,
  editingSection,
}: EditModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-filter backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{
              duration: 0.3,
              type: "spring",
              stiffness: 500,
              damping: 30,
            }}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                  {editingSection ? "Edit Section" : "New Section"}
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="px-6 py-4 max-h-[80vh] overflow-y-auto">
              <SectionForm
                form={form}
                onSubmit={onSubmit}
                isLoading={isLoading}
                submitLabel={editingSection ? "Save Changes" : "Create Section"}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditModal;
