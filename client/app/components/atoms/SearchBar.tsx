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
      console.log("updatedQueries:", updatedQueries);
      setRecentQueries(updatedQueries);
    }
    onSearch(data);
  };

  const handleSelectRecentQuery = (query: string) => {
    console.log("Selected query:", query);
    setValue("searchQuery", query);
    onSearch({ searchQuery: query });
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit(handleSearch)}>
        <input
          type="text"
          placeholder="What're you looking for?"
          className="py-[15px] pl-6 pr-16 rounded-md bg-[#F5F5F5] focus:outline-none focus:border-transparent"
          {...register("searchQuery")}
          onFocus={() => {
            console.log("Input focused");
            setIsFocused(true);
          }}
          onBlur={() => {
            console.log("Input blurred");
            setIsFocused(false);
          }}
          autoComplete="off"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          <Search size={25} />
        </button>
      </form>

      {isFocused && recentQueries.length > 0 && (
        <div className="absolute w-full mt-[10px] bg-gray-50 rounded-lg shadow-md z-10">
          <ul className="max-h-40 overflow-y-auto">
            {recentQueries.map((query, index) => {
              console.log("Rendering query:", query);
              return (
                <li
                  key={index}
                  className="p-4 cursor-pointer hover:bg-gray-100/80"
                  onMouseDown={() => {
                    handleSelectRecentQuery(query);
                  }}
                >
                  {query}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
