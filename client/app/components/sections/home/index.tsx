import ProductSection from "../products/ProductSection";

export const BestSellingSection = () => (
  <ProductSection title="Best Selling Products" showTitle />
);

export const RelatedContentSection = () => (
  <ProductSection title="Related Content" showTitle />
);
export const ExploreProductsSection = () => (
  <ProductSection title="Explore Our Products" showTitle />
);
export const FlashSaleSection = () => (
  <ProductSection title="Flash Sales" showTitle />
);

export { default as MainSection } from "./MainSection";
export { default as PromotionalBanner } from "./PromotionalBanner";
export { default as CategoryBrowser } from "./CategoryBrowser";
export { default as NewArrivalSection } from "./NewArrivalSection";
export { default as BenefitsSection } from "./BenefitsSection";
