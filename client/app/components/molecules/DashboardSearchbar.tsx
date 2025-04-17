"use client";
import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useLazyQuery } from "@apollo/client";
import { SEARCH_DASHBOARD } from "@/app/gql/Dashboard";

interface SearchResult {
  type: "product" | "category" | "user" | "transaction";
  id: string;
  title: string;
  description?: string;
}

interface DashboardSearchBarProps {
  placeholder?: string;
  className?: string;
}

const DashboardSearchBar: React.FC<DashboardSearchBarProps> = ({
  placeholder = "Search dashboard (Ctrl + K)",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  // GraphQL Lazy Query
  const [searchDashboard, { data, loading }] = useLazyQuery(SEARCH_DASHBOARD);

  console.log("search dashboard data => ", data);

  // Trigger search when query changes
  useEffect(() => {
    if (query && isOpen) {
      searchDashboard({
        variables: {
          params: {
            searchQuery: query,
          },
        },
      });
    }
  }, [query, isOpen, searchDashboard]);

  const searchResults: SearchResult[] = (data?.searchDashboard || []).map(
    (result: SearchResult) => ({
      ...result,
      action: () => {
        switch (result.type) {
          case "transaction":
            router.push(`/transactions/${result.id}`);
          case "product":
            router.push(`/dashboard/products/${result.id}`);
            break;
          case "category":
            router.push(`/dashboard/categories/${result.id}`);
            break;
          case "user":
            router.push(`/dashboard/users/${result.id}`);
            break;
          default:
            break;
        }
      },
    })
  );

  // Ctrl + K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        if (!isOpen) setQuery("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Handler to navigate and close modal
  const handleResultClick = (action): void => {
    action();
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${className}`}
        aria-label="Open dashboard search (Ctrl + K)"
        title="Search (Ctrl + K)"
      >
        <Search size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-50"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-4 border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative flex items-center">
                <Search className="absolute left-3 text-gray-500" size={20} />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={placeholder}
                  className="w-full py-3 pl-10 pr-12 border-b border-gray-200 focus:outline-none focus:border-teal-500 text-gray-800 text-sm"
                  autoFocus
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute right-3 text-gray-500 hover:text-gray-700"
                  aria-label="Close search"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-2 max-h-96 overflow-y-auto">
                {loading ? (
                  <p className="p-3 text-gray-500 text-sm">Loading...</p>
                ) : query && searchResults.length === 0 ? (
                  <p className="p-3 text-gray-500 text-sm">No results found.</p>
                ) : (
                  searchResults.map((result) => (
                    <motion.div
                      key={`${result.type}-${result.id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors flex items-center justify-between"
                      onClick={() => handleResultClick(result.action)}
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {result.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {result.description}
                        </p>
                      </div>
                      <span className="text-xs text-teal-600 font-medium">
                        {result.type.charAt(0).toUpperCase() +
                          result.type.slice(1)}
                      </span>
                    </motion.div>
                  ))
                )}
              </div>

              <div className="mt-2 text-xs text-gray-500 text-center">
                Press Ctrl + K to close
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardSearchBar;
