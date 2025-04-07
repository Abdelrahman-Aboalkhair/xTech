"use client";
import { useGetAllCategoriesQuery } from "@/app/store/apis/CategoryApi";
import CheckBox from "../atoms/CheckBox";
import { Filter, SortAsc } from "lucide-react";
import useQueryParams from "@/app/hooks/network/useQueryParams";
import { useForm } from "react-hook-form";

const FilterBar: React.FC = () => {
  const { control } = useForm();
  const { data } = useGetAllCategoriesQuery({});
  const { updateQuery } = useQueryParams();
  const sortOptions = [
    { label: "Price: High to Low", id: 1 },
    { label: "Newest", id: 2 },
    { label: "Popularity", id: 3 },
  ];

  // This function will update the query string based on checkbox selections
  const handleFilterChange = (name: string, value: boolean) => {
    if (value) {
      // If the checkbox is checked, include the category in the query string
      updateQuery({ category: name });
    } else {
      // If the checkbox is unchecked, remove the category from the query string
      updateQuery({ category: undefined });
    }
  };

  return (
    <aside className="w-[16%] min-h-screen p-6 border-r border-gray-200">
      <div className="space-y-6">
        <div className="border-gray-200">
          <h3 className="text-md font-semibold text-gray-700 mb-6 flex justify-start items-center gap-1">
            <Filter size={19} /> Filters
          </h3>
          <CheckBox
            className="pb-[20px]"
            control={control}
            name="BestSelling"
            label="Best selling"
            onChangeExtra={handleFilterChange}
          />
          <CheckBox
            className="pb-[20px]"
            control={control}
            name="featured"
            label="Featured"
            onChangeExtra={handleFilterChange}
          />
          {data?.categories.map((category) => (
            <div key={category.id} className="pb-[20px]">
              <CheckBox
                control={control}
                name={category.name}
                label={category.name}
                onChangeExtra={handleFilterChange}
              />
            </div>
          ))}
        </div>
        <div className="border border-gray-200 w-[16.4rem]" />
        <div>
          <h3 className="text-md font-semibold text-gray-700 mb-6 flex items-center justify-start gap-1">
            <SortAsc size={22} /> Sorting
          </h3>
          {sortOptions.map((opt) => (
            <div key={opt.id} className="pb-[20px]">
              <CheckBox
                control={control}
                name={opt.label}
                label={opt.label}
                onChangeExtra={handleFilterChange}
              />
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default FilterBar;
