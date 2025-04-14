"use client";
import MainLayout from "@/app/components/templates/MainLayout";
import { useGetAllPagesQuery } from "@/app/store/apis/PageApi";
import { notFound, useParams } from "next/navigation";

const DynamicPage = () => {
  const { slug } = useParams();
  const { data: pagesData, isLoading } = useGetAllPagesQuery({});
  const page = pagesData?.pages?.find(
    (p: any) => p.slug === slug && p.isPublished && p.isVisible
  );

  if (isLoading) {
    return <div className="text-center py-12">Loading page...</div>;
  }

  if (!page) {
    notFound();
  }

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-6">{page.title}</h1>
      <p>This is the {page.title} page. More content coming soon!</p>
    </MainLayout>
  );
};

export default DynamicPage;
