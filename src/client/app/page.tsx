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
  const products = [
    {
      id: "id-1",
      name: "Product 1",
      slug: "product-1",
      images: ["/placeholder-image.jpg"],
      price: 29.99,
      description: "This is a description for product 1.",
      category: "Category 1",
    },
  ];
  return (
    <MainLayout>
      <ProductSection
        title="Products"
        products={products}
        loading={false}
        showTitle
      />
    </MainLayout>
  );
};

export default Home;
