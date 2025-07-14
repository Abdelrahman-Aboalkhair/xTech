"use client"; // Mark as Client Component to support dynamic imports and useQuery
import dynamic from "next/dynamic";
import { useQuery } from "@apollo/client";
import { GET_HOME_PAGE_DATA } from "./gql/queries";

const HeroSection = dynamic(() => import("./(public)/(home)/HeroSection"), { ssr: false });
const ProductSection = dynamic(() => import("./(public)/product/ProductSection"), { ssr: false });
const MainLayout = dynamic(() => import("./components/templates/MainLayout"), { ssr: false });

const Home = () => {
  const { data, loading, error } = useQuery(GET_HOME_PAGE_DATA, {
    variables: { first: 8, skip: 0 },
    // Use cache-first to leverage any pre-loaded SSR data if available
    fetchPolicy: "cache-first",
  });
  console.log('Home page data:', data);

  if (loading) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </MainLayout>
    );
  }
  if (error) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-lg text-red-500">Error loading home data: {error.message}</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <HeroSection />
      <ProductSection title="Featured" dataKey="featuredProducts" showTitle />
      <ProductSection title="Trending" dataKey="trendingProducts" showTitle />
      <ProductSection title="New Arrivals" dataKey="newProducts" showTitle />
      <ProductSection title="Best Sellers" dataKey="bestSellerProducts" showTitle />
    </MainLayout>
  );
};

export default Home;