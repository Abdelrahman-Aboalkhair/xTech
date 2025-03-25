import {
  BestSellingSection,
  CategoryBrowser,
  ExploreProductsSection,
  NewArrivalSection,
  FlashSaleSection,
  MainSection,
  PromotionalBanner,
  BenefitsSection,
} from "./components/sections/home";
import MainLayout from "./components/templates/MainLayout";

const Home = () => {
  return (
    <MainLayout>
      <MainSection />
      <FlashSaleSection />
      <CategoryBrowser />
      <BestSellingSection />
      <PromotionalBanner />
      <ExploreProductsSection />
      <NewArrivalSection />
      <BenefitsSection />
    </MainLayout>
  );
};

export default Home;
