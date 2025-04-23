"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Filter } from "lucide-react";
import { GET_ALL_PRODUCTS, GET_CATEGORIES } from "@/app/gql/Product";
import { Product } from "@/app/types/productTypes";
import ProductCard from "../product/ProductCard";
import MainLayout from "@/app/components/templates/MainLayout";
import ProductFilters, { FilterValues } from "./ProductFilters";

const ShopPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const initialFilters = {
    search: searchParams.get("search") || "",
    isNew: searchParams.get("isNew") === "true" || undefined,
    isFeatured: searchParams.get("isFeatured") === "true" || undefined,
    isTrending: searchParams.get("isTrending") === "true" || undefined,
    isBestSeller: searchParams.get("isBestSeller") === "true" || undefined,
    minPrice: searchParams.get("minPrice")
      ? parseFloat(searchParams.get("minPrice")!)
      : undefined,
    maxPrice: searchParams.get("maxPrice")
      ? parseFloat(searchParams.get("maxPrice")!)
      : undefined,
    categoryId: searchParams.get("categoryId") || undefined,
  };

  // State for products display
  const [filters, setFilters] = useState<FilterValues>(initialFilters);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const pageSize = 12;

  // Fetch categories
  const { data: categoriesData } = useQuery(GET_CATEGORIES);
  const categories = categoriesData?.categories || [];

  const { data, loading, error, fetchMore } = useQuery(GET_ALL_PRODUCTS, {
    variables: { first: pageSize, skip: 0, filters },
    onCompleted: (data) => {
      setDisplayedProducts(data.products.products);
      setHasMore(data.products.hasMore);
    },
  });

  // Update filters when URL changes
  useEffect(() => {
    setFilters(initialFilters);
    setSkip(0);
    setDisplayedProducts([]);
  }, [searchParams]);

  const handleShowMore = () => {
    setIsFetchingMore(true);
    const newSkip = skip + pageSize;
    fetchMore({
      variables: { first: pageSize, skip: newSkip, filters },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        const newProducts = fetchMoreResult.products.products;
        const newHasMore = fetchMoreResult.products.hasMore;

        setDisplayedProducts((prevProducts) => [
          ...prevProducts,
          ...newProducts,
        ]);
        setSkip(newSkip);
        setHasMore(newHasMore);
        setIsFetchingMore(false);

        return {
          products: {
            ...fetchMoreResult.products,
            products: [...prev.products.products, ...newProducts],
          },
        };
      },
    });
  };

  const updateFilters = (newFilters: FilterValues) => {
    const query = new URLSearchParams();

    if (newFilters.search) query.set("search", newFilters.search);
    if (newFilters.isNew) query.set("isNew", "true");
    if (newFilters.isFeatured) query.set("isFeatured", "true");
    if (newFilters.isTrending) query.set("isTrending", "true");
    if (newFilters.isBestSeller) query.set("isBestSeller", "true");
    if (newFilters.minPrice)
      query.set("minPrice", newFilters.minPrice.toString());
    if (newFilters.maxPrice)
      query.set("maxPrice", newFilters.maxPrice.toString());
    if (newFilters.categoryId) query.set("categoryId", newFilters.categoryId);

    router.push(`/shop?${query.toString()}`);
  };

  const noProductsFound = displayedProducts.length === 0 && !loading && !error;

  return (
    <MainLayout>
      <div className="container py-8 mx-auto">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Filter size={16} />
            <span>Filters</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-full md:min-w-[350px]">
            <ProductFilters
              initialFilters={initialFilters}
              onFilterChange={updateFilters}
              categories={categories}
            />
          </div>

          {/* Mobile Sidebar */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="md:hidden fixed inset-0 bg-black/30 z-40"
                onClick={() => setSidebarOpen(false)}
              >
                <motion.div
                  initial={{ x: -300 }}
                  animate={{ x: 0 }}
                  exit={{ x: -300 }}
                  transition={{ type: "spring", damping: 25 }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-[85vw] max-w-md h-full bg-white"
                >
                  <ProductFilters
                    initialFilters={initialFilters}
                    onFilterChange={updateFilters}
                    categories={categories}
                    isMobile={true}
                    onCloseMobile={() => setSidebarOpen(false)}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products Area */}
          <div className="flex-grow">
            {/* Loading State */}
            {loading && !displayedProducts.length && (
              <div className="text-center py-12">
                <Package
                  size={48}
                  className="mx-auto text-gray-400 mb-4 animate-pulse"
                />
                <p className="text-lg text-gray-600">Loading products...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-lg text-red-500">Error loading products</p>
              </div>
            )}

            {/* Empty State */}
            {noProductsFound && (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
                <Package size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-lg text-gray-600 mb-2">No products found</p>
                <p className="text-gray-500">Try adjusting your filters</p>
              </div>
            )}

            {/* Products Grid */}
            {!noProductsFound && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedProducts.map((product: Product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard
                        product={product}
                        hoveredProductId={null}
                        setHoveredProductId={() => {}}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="mt-12 text-center">
                    <button
                      onClick={handleShowMore}
                      disabled={isFetchingMore}
                      className={`bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition-colors duration-300 font-medium ${
                        isFetchingMore ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isFetchingMore ? "Loading..." : "Show More Products"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ShopPage;
