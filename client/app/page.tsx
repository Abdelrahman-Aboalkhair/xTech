import {
  NewArrivalSection,
  PromotionalBanner,
  BenefitsSection,
} from "./components/sections/home";
import HeroSection from "./components/sections/home/HeroSection";
import ProductSection from "./components/sections/products/ProductSection";
import MainLayout from "./components/templates/MainLayout";

const Home = () => {
  return (
    <MainLayout>
      <HeroSection />
      <ProductSection title="Featured Products" showTitle />

      <PromotionalBanner />
      <NewArrivalSection />
      <BenefitsSection />
    </MainLayout>
  );
};

export default Home;
