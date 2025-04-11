import {
  BestSellingSection,
  NewArrivalSection,
  PromotionalBanner,
  BenefitsSection,
} from "./components/sections/home";
import HeroSection from "./components/sections/home/HeroSection";
import MainLayout from "./components/templates/MainLayout";

const Home = () => {
  return (
    <MainLayout>
      <HeroSection />
      <BestSellingSection />
      <PromotionalBanner />
      <NewArrivalSection />
      <BenefitsSection />
    </MainLayout>
  );
};

export default Home;
