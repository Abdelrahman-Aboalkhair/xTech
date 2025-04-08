"use client";
import React from "react";
import useQueryParams from "@/app/hooks/network/useQueryParams";

interface PaginationComponentProps {
  totalPages: number;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({
  totalPages,
}) => {
  const { query, updateQuery } = useQueryParams();
  const currentPage = Number(query.page) || 1;

  const changePage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    updateQuery({ page: newPage });
  };

  return (
    <div className="flex justify-center items-center space-x-2 mt-6">
      <button
        onClick={() => changePage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-3 py-1 bg-gray-300 disabled:opacity-50"
      >
        Prev
      </button>
      {Array.from({ length: totalPages }).map((_, i) => {
        const pageNum = i + 1;
        return (
          <button
            key={pageNum}
            onClick={() => changePage(pageNum)}
            className={`px-3 py-1 rounded ${
              currentPage === pageNum ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {pageNum}
          </button>
        );
      })}
      <button
        onClick={() => changePage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-3 py-1 bg-gray-300 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default PaginationComponent;
