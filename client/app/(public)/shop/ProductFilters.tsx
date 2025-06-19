"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { X, SlidersHorizontal, Tag, Percent } from "lucide-react";
import Dropdown from "@/app/components/molecules/Dropdown";
import CheckBox from "@/app/components/atoms/CheckBox";
import { debounce } from "lodash";

export interface FilterValues {
  search: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
}

interface ProductFiltersProps {
  initialFilters: FilterValues;
  onFilterChange: (filters: FilterValues) => void;
  categories: Array<{ id: string; name: string }>;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  initialFilters,
  onFilterChange,
  categories,
  isMobile = false,
  onCloseMobile,
}) => {
  const { control, watch, reset, handleSubmit } = useForm<FilterValues>({
    defaultValues: initialFilters,
  });

  // Watch form values
  const formValues = watch();

  // Debounced search update
  const debouncedSearch = debounce((searchValue: string) => {
    onFilterChange({ ...formValues, search: searchValue });
  }, 500);

  // Handle search input change
  const handleSearchChange = (value: string) => {
    debouncedSearch(value);
  };

  // Handle form submission (Apply Filters)
  const onSubmit = (data: FilterValues) => {
    onFilterChange(data);
    if (isMobile && onCloseMobile) onCloseMobile();
  };

  // Reset all filters
  const handleReset = () => {
    reset({
      search: "",
      categoryId: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      isNew: undefined,
      isFeatured: undefined,
      isTrending: undefined,
      isBestSeller: undefined,
    });
    onFilterChange({
      search: "",
      categoryId: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      isNew: undefined,
      isFeatured: undefined,
      isTrending: undefined,
      isBestSeller: undefined,
    });
    if (isMobile && onCloseMobile) onCloseMobile();
  };

  // Format categories for dropdown
  const categoryOptions = [
    { label: "All Categories", value: "" },
    ...categories.map((category) => ({
      label: category.name,
      value: category.id,
    })),
  ];

  // Count active filters
  const activeFilterCount = Object.values(formValues).filter(
    (value) => value !== undefined && value !== "" && value !== false
  ).length;

  return (
    <aside
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 ${isMobile
          ? "fixed inset-0 z-50 overflow-y-auto"
          : "sticky top-24 h-fit max-h-[calc(100vh-120px)] overflow-y-auto"
        }`}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-gray-600" />
            <h2 className="font-semibold text-gray-800">Filters</h2>
            {activeFilterCount > 0 && (
              <span className="bg-primary/10 text-primary text-xs font-medium rounded-full px-2 py-0.5">
                {activeFilterCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <X size={14} />
                Clear all
              </button>
            )}
            {isMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-1 rounded-md bg-gray-100 hover:bg-gray-200"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Filters Content */}
        <div className="space-y-6">
          {/* Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Search</label>
            <Controller
              name="search"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleSearchChange(e.target.value);
                  }}
                />
              )}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Category
            </label>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Dropdown
                  options={categoryOptions}
                  value={field.value || ""}
                  onChange={(val) => field.onChange(val || undefined)}
                  className="w-full"
                />
              )}
            />
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Price Range
            </label>
            <div className="flex items-center space-x-2">
              <Controller
                name="minPrice"
                control={control}
                render={({ field }) => (
                  <input
                    type="number"
                    placeholder="Min"
                    className="border border-gray-200 rounded-lg p-2.5 w-1/2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                  />
                )}
              />
              <Controller
                name="maxPrice"
                control={control}
                render={({ field }) => (
                  <input
                    type="number"
                    placeholder="Max"
                    className="border border-gray-200 rounded-lg p-2.5 w-1/2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                  />
                )}
              />
            </div>
          </div>

          {/* Product Flags */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Product Status
            </label>
            <div className="space-y-3 pl-1">
              <CheckBox
                name="isNew"
                control={control}
                label="New"
              />
              <CheckBox name="isFeatured" control={control} label="Featured" />
              <CheckBox name="isTrending" control={control} label="Trending" />
              <CheckBox
                name="isBestSeller"
                control={control}
                label="Best Seller"
              />
            </div>
          </div>

          {/* Apply Filters Button */}
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2.5 rounded-lg hover:bg-indigo-600 transition-colors duration-300 font-medium"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </aside>
  );
};

export default ProductFilters;
