"use client";
import HeroSection from "./(public)/(home)/HeroSection";
import ProductSection from "./(public)/product/ProductSection";
import MainLayout from "./components/templates/MainLayout";
import {
  GET_BEST_SELLER_PRODUCTS,
  GET_FEATURED_PRODUCTS,
  GET_NEW_PRODUCTS,
  GET_TRENDING_PRODUCTS,
} from "./gql/Product";

const Home = () => {
  return (
    <MainLayout>
      <HeroSection />
      <ProductSection
        title="Featured"
        query={GET_FEATURED_PRODUCTS}
        showTitle
      />
      <ProductSection
        title="Trending"
        query={GET_TRENDING_PRODUCTS}
        showTitle
      />
      <ProductSection title="New Arrivals" query={GET_NEW_PRODUCTS} showTitle />
      <ProductSection
        title="Best Sellers"
        query={GET_BEST_SELLER_PRODUCTS}
        showTitle
      />
    </MainLayout>
  );
};

export default Home;
