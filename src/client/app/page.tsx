"use client";
import dynamic from "next/dynamic";

const ProductSection = dynamic(
  () => import("./(public)/product/ProductSection"),
  { ssr: false }
);
const MainLayout = dynamic(() => import("./components/templates/MainLayout"), {
  ssr: false,
});

const Home = () => {
  return (
    <MainLayout>
      <ProductSection
        title="Featured"
        products={[]}
        loading={false}
        showTitle
      />
    </MainLayout>
  );
};

export default Home;
