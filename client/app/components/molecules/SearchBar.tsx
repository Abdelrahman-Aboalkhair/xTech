import React, { useState } from "react";
import { Search } from "lucide-react";
import { useForm } from "react-hook-form";
import useStorage from "@/app/hooks/state/useStorage";

type SearchFormValues = {
  searchQuery: string;
};

interface SearchBarProps {
  onSearch: (data: SearchFormValues) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const { register, handleSubmit, setValue } = useForm<SearchFormValues>({
    defaultValues: {
      searchQuery: "",
    },
  });

  const [recentQueries, setRecentQueries] = useStorage<string[]>(
    "recentQueries",
    []
  );
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (data: SearchFormValues) => {
    const query = data.searchQuery.trim();
    if (query && !recentQueries.includes(query)) {
      const updatedQueries = [query, ...recentQueries.slice(0, 4)];
      setRecentQueries(updatedQueries);
    }
    onSearch(data);
  };

  const handleSelectRecentQuery = (query: string) => {
    setValue("searchQuery", query);
    onSearch({ searchQuery: query });
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit(handleSearch)} className="flex items-center">
        <div className="relative flex items-center w-full">
          <Search className="absolute left-3 text-gray-800" size={20} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full py-2 pl-10 pr-4 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-[2px] focus:ring-blue-500 text-sm"
            {...register("searchQuery")}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoComplete="off"
          />
        </div>
      </form>

      {isFocused && recentQueries.length > 0 && (
        <div className="absolute w-full mt-2 bg-gray-50 rounded-lg shadow-lg z-10 border border-gray-100">
          <ul className="max-h-40 overflow-y-auto">
            {recentQueries.map((query, index) => (
              <li
                key={index}
                className="p-3 cursor-pointer hover:bg-gray-100 text-gray-800 text-sm"
                onMouseDown={() => handleSelectRecentQuery(query)}
              >
                {query}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
