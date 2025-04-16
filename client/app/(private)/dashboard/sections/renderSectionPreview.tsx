import { BenefitsSection, NewArrivalSection } from "@/app/(public)/(home)";
import HeroSection from "@/app/(public)/(home)/HeroSection";
import PromotionalSection from "@/app/(public)/(home)/PromotionalBanner";
import React from "react";

interface SectionData {
  id: number;
  title: string;
  type: string;
  content: any;
  order: number;
  isVisible: boolean;
  pageId: number;
  createdAt: string;
  updatedAt: string;
}

const renderSectionPreview = (section: SectionData) => {
  console.log("section => ", section);
  try {
    switch (section.title) {
      case "Hero Section":
        return <HeroSection data={section} isPreview={true} />;
      case "Benefits":
        return <BenefitsSection data={section} isPreview={true} />;
      case "New Arrivals":
        return <NewArrivalSection data={section} isPreview={true} />;
      case "Promotional Banner":
        return <PromotionalSection data={section} isPreview={true} />;
      default:
        return (
          <div className="text-sm text-gray-600 p-2">No preview available</div>
        );
    }
  } catch (error) {
    console.error(`Error rendering preview for section ${section.id}:`, error);
    return (
      <div className="text-sm text-red-600 p-2">Error loading preview</div>
    );
  }
};

export default renderSectionPreview;
