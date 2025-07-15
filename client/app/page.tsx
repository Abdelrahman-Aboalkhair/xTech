"use client";
import dynamic from "next/dynamic";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "./gql/Product";

const HeroSection = dynamic(() => import("./(public)/(home)/HeroSection"), { ssr: false });
const ProductSection = dynamic(() => import("./(public)/product/ProductSection"), { ssr: false });
const MainLayout = dynamic(() => import("./components/templates/MainLayout"), { ssr: false });

const Home = () => {
  const pageSize = 8;

  const { data: featuredData, loading: featuredLoading, error: featuredError } = useQuery(GET_PRODUCTS, {
    variables: { first: pageSize, skip: 0, filters: { isFeatured: true } },
    fetchPolicy: "no-cache",
  });

  const { data: newData, loading: newLoading, error: newError } = useQuery(GET_PRODUCTS, {
    variables: { first: pageSize, skip: 0, filters: { isNew: true } },
    fetchPolicy: "no-cache",
  });

  const { data: trendingData, loading: trendingLoading, error: trendingError } = useQuery(GET_PRODUCTS, {
    variables: { first: pageSize, skip: 0, filters: { isTrending: true } },
    fetchPolicy: "no-cache",
  });

  const { data: bestSellerData, loading: bestSellerLoading, error: bestSellerError } = useQuery(GET_PRODUCTS, {
    variables: { first: pageSize, skip: 0, filters: { isBestSeller: true } },
    fetchPolicy: "no-cache",
  });

  return (
    <MainLayout>
      <HeroSection />
      <ProductSection
        title="Featured"
        products={featuredData?.products.products || []}
        loading={featuredLoading}
        error={featuredError}
        showTitle
      />
      <ProductSection
        title="Trending"
        products={trendingData?.products.products || []}
        loading={trendingLoading}
        error={trendingError}
        showTitle
      />
      <ProductSection
        title="New Arrivals"
        products={newData?.products.products || []}
        loading={newLoading}
        error={newError}
        showTitle
      />
      <ProductSection
        title="Best Sellers"
        products={bestSellerData?.products.products || []}
        loading={bestSellerLoading}
        error={bestSellerError}
        showTitle
      />
    </MainLayout>
  );
};

export default Home;