import HeroSection from "./(public)/(home)/HeroSection";
import ProductSection from "./(public)/product/ProductSection";
import MainLayout from "./components/templates/MainLayout";

const Home = () => {
  return (
    <MainLayout>
      <HeroSection />
      <ProductSection title="Featured" showTitle />
      <ProductSection title="Trending" showTitle />
      <ProductSection title="New Arrivals" showTitle />
      <ProductSection title="Best Sellers" showTitle />
    </MainLayout>
  );
};

export default Home;
