import {
  BestSellingSection,
  ExploreProductsSection,
  NewArrivalSection,
  FlashSaleSection,
  PromotionalBanner,
  BenefitsSection,
} from "./components/sections/home";
import HeroSection from "./components/sections/home/HeroSection";
import MainLayout from "./components/templates/MainLayout";

const Home = () => {
  return (
    <MainLayout>
      <HeroSection />
      <FlashSaleSection />
      <BestSellingSection />
      <PromotionalBanner />
      <ExploreProductsSection />
      <NewArrivalSection />
      <BenefitsSection />
    </MainLayout>
  );
};

export default Home;
