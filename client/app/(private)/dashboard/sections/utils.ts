import { Section } from "./types";

export const filterAndSortSections = (
  sections: Section[],
  searchQuery: string,
  filterVisible: string,
  sortOrder: string
): Section[] => {
  let filteredSections = [...sections];

  if (searchQuery) {
    filteredSections = filteredSections.filter(
      (section) =>
        section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (filterVisible !== "all") {
    filteredSections = filteredSections.filter((section) =>
      filterVisible === "visible" ? section.isVisible : !section.isVisible
    );
  }

  filteredSections.sort((a, b) => {
    return sortOrder === "asc" ? a.order - b.order : b.order - b.order;
  });

  return filteredSections;
};
