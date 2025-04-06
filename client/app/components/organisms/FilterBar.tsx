import Dropdown from "../molecules/Dropdown";
import { Controller } from "react-hook-form";
import Input from "../atoms/Input";
import useQueryParams from "@/app/hooks/network/useQueryParams";

interface FilterBarProps {
  sortOptions: string[];
  filterOptions: string[];
  control: any;
  errors: any;
  filterBy: string;
  sortBy: string;
}

const FilterBar: React.FC<FilterBarProps> = ({
  filterBy,
  sortBy,
  sortOptions,
  filterOptions,
  control,
  errors,
}) => {
  const { updateQuery } = useQueryParams();

  return (
    <aside className="w-64 min-h-screen p-6 bg-gray-100 border-r border-gray-200">
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Filter By
          </h3>
          <Controller
            name={filterBy}
            control={control}
            render={({ field }) => (
              <Dropdown
                label={field.value || "Select filter"}
                options={filterOptions}
                {...field}
                onChange={(value) => {
                  field.onChange(value);
                  updateQuery({ filterBy: value });
                }}
                className="w-full"
              />
            )}
          />
        </div>

        {/* Sort Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Sort By</h3>
          <Controller
            name={sortBy}
            control={control}
            render={({ field }) => (
              <Dropdown
                label={field.value || "Select sorting"}
                options={sortOptions}
                {...field}
                onChange={(value) => {
                  field.onChange(value);
                  updateQuery({ sort: value });
                }}
                className="w-full"
              />
            )}
          />
        </div>
      </div>
    </aside>
  );
};

export default FilterBar;
