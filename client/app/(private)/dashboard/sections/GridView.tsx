// components/sections/GridView.tsx
import { Section } from "./types";
import SectionCard from "./SectionCard";
import { UseFormReturn } from "react-hook-form";
import { SectionFormData } from "./types";

interface GridViewProps {
  sections: Section[];
  setEditingSection: (section: Section | null) => void;
  setIsModalOpen: (open: boolean) => void;
  form: UseFormReturn<SectionFormData>;
  handleDuplicateSection: (section: Section) => void;
}

const GridView = ({
  sections,
  setEditingSection,
  setIsModalOpen,
  form,
  handleDuplicateSection,
}: GridViewProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {sections.map((section) => (
        <SectionCard
          key={section.id}
          section={section}
          setEditingSection={setEditingSection}
          setIsModalOpen={setIsModalOpen}
          form={form}
          handleDuplicateSection={handleDuplicateSection}
        />
      ))}
    </div>
  );
};

export default GridView;
