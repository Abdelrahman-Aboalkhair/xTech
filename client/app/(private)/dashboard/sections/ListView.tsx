// components/sections/ListView.tsx
import { Section } from "./types";
import SectionListItem from "./SectionListItem";
import { UseFormReturn } from "react-hook-form";
import { SectionFormData } from "./types";

interface ListViewProps {
  sections: Section[];
  setEditingSection: (section: Section | null) => void;
  setIsModalOpen: (open: boolean) => void;
  form: UseFormReturn<SectionFormData>;
  handleDuplicateSection: (section: Section) => void;
}

const ListView = ({
  sections,
  setEditingSection,
  setIsModalOpen,
  form,
  handleDuplicateSection,
}: ListViewProps) => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
      <ul className="divide-y divide-gray-200">
        {sections.map((section) => (
          <SectionListItem
            key={section.id}
            section={section}
            setEditingSection={setEditingSection}
            setIsModalOpen={setIsModalOpen}
            form={form}
            handleDuplicateSection={handleDuplicateSection}
          />
        ))}
      </ul>
    </div>
  );
};

export default ListView;
