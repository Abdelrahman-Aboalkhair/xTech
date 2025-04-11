"use client";
import {
  useGetAllSectionsQuery,
  useUpdateSectionMutation,
} from "@/app/store/apis/SectionApi";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layout,
  Loader2,
  AlertCircle,
  Edit2,
  Plus,
  X,
  Eye,
  EyeOff,
  Search,
  Filter,
  ChevronDown,
  Menu,
  Trash2,
  Copy,
  MoreVertical,
  ArrowUpDown,
  Layers,
} from "lucide-react";
import useToast from "@/app/hooks/ui/useToast";
import renderSectionPreview from "./renderSectionPreview";
import { SectionFormData } from "./SectionForm";
import SectionForm from "./SectionForm";
import { useForm } from "react-hook-form";

const SectionsDashboard = () => {
  const { showToast } = useToast();
  const { data, isLoading, error, refetch } = useGetAllSectionsQuery({});
  const [updateSection, { isLoading: isUpdating }] = useUpdateSectionMutation();
  const [sections, setSections] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVisible, setFilterVisible] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [activeMenu, setActiveMenu] = useState(null);

  useEffect(() => {
    if (data?.sections) {
      let filteredSections = [...data.sections];

      if (searchQuery) {
        filteredSections = filteredSections.filter(
          (section) =>
            section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            section.type.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (filterVisible !== "all") {
        filteredSections = filteredSections.filter((section) =>
          filterVisible === "visible" ? section.isVisible : !section.isVisible
        );
      }

      filteredSections.sort((a, b) => {
        return sortOrder === "asc" ? a.order - b.order : b.order - a.order;
      });

      setSections(filteredSections);
    }
  }, [data, searchQuery, filterVisible, sortOrder]);

  const form = useForm<SectionFormData>({
    defaultValues: {
      id: 0,
      title: "",
      type: "",
      content: {},
      order: 0,
      isVisible: true,
      pageId: 1,
    },
  });

  const handleEditSubmit = async (data: SectionFormData) => {
    try {
      const updatedData = {
        ...data,
        content: JSON.parse(
          typeof data.content === "string"
            ? data.content
            : JSON.stringify(data.content)
        ),
      };
      await updateSection(updatedData).unwrap();
      setIsModalOpen(false);
      setEditingSection(null);
      refetch();
      showToast("Section updated successfully", "success");
    } catch (err) {
      console.error("Failed to update section:", err);
      showToast("Failed to update section", "error");
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setFilterVisible("all");
    setSortOrder("asc");
    setShowFilters(false);
  };

  const toggleSectionMenu = (id) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  const handleDuplicateSection = (section) => {
    setEditingSection({
      ...section,
      id: 0, // Reset ID for new section
      title: `${section.title} (Copy)`,
    });
    form.reset({
      ...section,
      id: 0,
      title: `${section.title} (Copy)`,
    });
    setIsModalOpen(true);
    setActiveMenu(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Layers className="h-6 w-6 text-blue-600" />
              <h1 className="ml-3 text-xl font-semibold text-gray-800">
                Sections
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setEditingSection(null);
                  form.reset({
                    id: 0,
                    title: "",
                    type: "",
                    content: {},
                    order: 0,
                    isVisible: true,
                    pageId: 1,
                  });
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Section
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
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

          {/* Expanded Filters */}
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

          {/* Results count */}
          {!isLoading && !error && (
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>
                {sections.length}{" "}
                {sections.length === 1 ? "section" : "sections"} found
                {data?.sections.length !== sections.length &&
                  ` (filtered from ${data?.sections.length})`}
              </span>
            </div>
          )}
        </div>

        {/* Main Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            <span className="ml-2 text-gray-600">Loading sections...</span>
          </div>
        ) : error ? (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error loading sections
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    Please try refreshing the page or contact support if the
                    problem persists.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : sections.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
              <Layout className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No sections found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {data?.sections.length > 0
                ? "Try adjusting your filters or search query."
                : "Get started by creating your first section."}
            </p>
            {data?.sections.length === 0 && (
              <div className="mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setEditingSection(null);
                    form.reset({
                      id: 0,
                      title: "",
                      type: "",
                      content: {},
                      order: 0,
                      isVisible: true,
                      pageId: 1,
                    });
                    setIsModalOpen(true);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Section
                </motion.button>
              </div>
            )}
          </div>
        ) : viewMode === "grid" ? (
          // Grid View
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white shadow rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                  <div className="flex items-center">
                    {section.isVisible ? (
                      <Eye className="h-4 w-4 text-green-500 mr-2" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400 mr-2" />
                    )}
                    <h3 className="font-medium text-gray-900 truncate max-w-[180px]">
                      {section.title}
                    </h3>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => toggleSectionMenu(section.id)}
                      className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full focus:outline-none"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>
                    {activeMenu === section.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                        <button
                          onClick={() => {
                            setEditingSection(section);
                            form.reset(section);
                            setIsModalOpen(true);
                            setActiveMenu(null);
                          }}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <Edit2 className="h-4 w-4 mr-2 text-gray-500" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDuplicateSection(section)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <Copy className="h-4 w-4 mr-2 text-gray-500" />
                          Duplicate
                        </button>
                        <button className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left">
                          <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-gray-500">
                      Type:{" "}
                      <span className="font-medium text-gray-900">
                        {section.type}
                      </span>
                    </span>
                    <span className="text-gray-500">
                      Order:{" "}
                      <span className="font-medium text-gray-900">
                        {section.order}
                      </span>
                    </span>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-md p-3 h-28 overflow-hidden relative">
                    <div className="overflow-hidden max-h-full">
                      {renderSectionPreview(section)}
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-gray-50 to-transparent"></div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Page ID: {section.pageId}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setEditingSection(section);
                        form.reset(section);
                        setIsModalOpen(true);
                      }}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Edit2 className="h-3 w-3 mr-1" />
                      Edit
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          // List View
          <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
            <ul className="divide-y divide-gray-200">
              {sections.map((section) => (
                <motion.li
                  key={section.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center min-w-0">
                        {section.isVisible ? (
                          <Eye className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                        )}
                        <p className="text-sm font-medium text-blue-600 truncate">
                          {section.title}
                        </p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {section.type}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500 mr-6">
                          Order: {section.order}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          Page ID: {section.pageId}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm sm:mt-0">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setEditingSection(section);
                            form.reset(section);
                            setIsModalOpen(true);
                          }}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2"
                        >
                          <Edit2 className="h-3 w-3 mr-1" />
                          Edit
                        </motion.button>
                        <div className="relative">
                          <button
                            onClick={() => toggleSectionMenu(section.id)}
                            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full focus:outline-none"
                          >
                            <MoreVertical className="h-5 w-5" />
                          </button>
                          {activeMenu === section.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                              <button
                                onClick={() => handleDuplicateSection(section)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <Copy className="h-4 w-4 mr-2 text-gray-500" />
                                Duplicate
                              </button>
                              <button className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left">
                                <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-filter backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{
                duration: 0.3,
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">
                    {editingSection ? "Edit Section" : "New Section"}
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="px-6 py-4 max-h-[80vh] overflow-y-auto">
                <SectionForm
                  form={form}
                  onSubmit={handleEditSubmit}
                  isLoading={isUpdating}
                  submitLabel={
                    editingSection ? "Save Changes" : "Create Section"
                  }
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SectionsDashboard;
