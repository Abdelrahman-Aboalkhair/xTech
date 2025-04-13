// components/sections/Filters.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  ChevronDown,
  ArrowUpDown,
  Layout,
  Menu,
} from "lucide-react";

interface FiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterVisible: string;
  setFilterVisible: (filter: string) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
  viewMode: string;
  setViewMode: (mode: string) => void;
  sectionsCount: number;
  totalSections: number;
}

const Filters = ({
  searchQuery,
  setSearchQuery,
  filterVisible,
  setFilterVisible,
  sortOrder,
  setSortOrder,
  viewMode,
  setViewMode,
  sectionsCount,
  totalSections,
}: FiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const resetFilters = () => {
    setSearchQuery("");
    setFilterVisible("all");
    setSortOrder("asc");
    setShowFilters(false);
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search sections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-3 py-2 border ${
              showFilters
                ? "border-blue-500 text-blue-600 bg-blue-50"
                : "border-gray-300 text-gray-700"
            } rounded-md shadow-sm text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            <ChevronDown
              className={`h-4 w-4 ml-2 transition-transform ${
                showFilters ? "transform rotate-180" : ""
              }`}
            />
          </button>
          <div className="border-l border-gray-300 h-8 mx-2"></div>
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-2 border border-gray-300 rounded-l-md text-sm font-medium ${
                viewMode === "grid"
                  ? "bg-gray-100 text-gray-700"
                  : "bg-white text-gray-500"
              } hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500`}
            >
              <Layout className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-2 border border-gray-300 border-l-0 rounded-r-md text-sm font-medium ${
                viewMode === "list"
                  ? "bg-gray-100 text-gray-700"
                  : "bg-white text-gray-500"
              } hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500`}
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white p-4 rounded-md shadow-sm border border-gray-200 overflow-hidden mb-4"
          >
            <div className="flex flex-wrap gap-4">
              <div className="w-full sm:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Visibility
                </label>
                <select
                  value={filterVisible}
                  onChange={(e) => setFilterVisible(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="all">All Sections</option>
                  <option value="visible">Visible Only</option>
                  <option value="hidden">Hidden Only</option>
                </select>
              </div>
              <div className="w-full sm:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort Order
                </label>
                <button
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  className="flex items-center justify-between w-full sm:w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <span>
                    Order {sortOrder === "asc" ? "Ascending" : "Descending"}
                  </span>
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              </div>
              <div className="w-full sm:w-auto flex items-end">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          {sectionsCount} {sectionsCount === 1 ? "section" : "sections"} found
          {totalSections !== sectionsCount &&
            ` (filtered from ${totalSections})`}
        </span>
      </div>
    </div>
  );
};

export default Filters;
