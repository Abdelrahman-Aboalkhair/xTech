import ProductSection from "../products/ProductSection";

export const BestSellingSection = () => (
  <ProductSection
    title="Best Selling Products"
    queryParams={{ bestSelling: true }}
  />
);

export const RelatedContentSection = () => (
  <ProductSection
    title="Related Content"
    queryParams={{ relatedContent: true }}
  />
);
export const ExploreProductsSection = () => (
  <ProductSection title="Explore Our Products" />
);
export const FlashSaleSection = () => (
  <ProductSection title="Flash Sales" queryParams={{ onSale: true }} />
);

export { default as MainSection } from "./MainSection";
export { default as PromotionalBanner } from "./PromotionalBanner";
export { default as CategoryBrowser } from "./CategoryBrowser";
export { default as NewArrivalSection } from "./NewArrivalSection";
export { default as BenefitsSection } from "./BenefitsSection";
