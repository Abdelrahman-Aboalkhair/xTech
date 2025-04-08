import {
  Loader2,
  ArrowUpDown,
  Search,
  Filter,
  FileText,
  RefreshCw,
} from "lucide-react";
import React, { useState } from "react";

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: any) => React.ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
}

interface TableProps {
  data: any[];
  columns: Column[];
  isLoading?: boolean;
  emptyMessage?: string;
  title?: string;
  subtitle?: string;
  onRefresh?: () => void;
}

const Table: React.FC<TableProps> = ({
  data,
  columns,
  isLoading = false,
  emptyMessage = "No data available",
  title = "Data Table",
  subtitle = "Manage and view your data",
  onRefresh,
}) => {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-blue-50 overflow-hidden">
      {/* Table Header */}
      <div className="p-4 sm:p-6 border-b border-blue-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-semibold text-lg text-blue-900">{title}</h2>
          <p className="text-blue-500 text-sm">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400"
            />
            <input
              type="text"
              placeholder="Search..."
              className="pl-9 pr-4 py-2 rounded-lg border border-blue-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-blue-50"
            />
          </div>

          <button className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
            <Filter size={16} />
          </button>

          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            >
              <RefreshCw size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="w-full overflow-x-auto scrollbar-hide">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-50">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-4 text-${
                    column.align || "left"
                  } text-blue-700 font-medium text-sm ${
                    column.width ? `w-${column.width}` : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && (
                      <button
                        onClick={() => handleSort(column.key)}
                        className={`p-1 rounded hover:bg-blue-100 ${
                          sortKey === column.key
                            ? "text-blue-600"
                            : "text-blue-300"
                        }`}
                      >
                        <ArrowUpDown
                          size={14}
                          className={
                            sortKey === column.key
                              ? "transform transition-transform"
                              : ""
                          }
                        />
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-16">
                  <div className="flex flex-col items-center justify-center text-blue-400">
                    <Loader2 size={30} className="animate-spin mb-2" />
                    <span>Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr
                  key={row.id || row._id || rowIndex}
                  className="hover:bg-blue-50/50 transition-colors text-sm"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-6 py-4 text-${column.align || "left"} ${
                        rowIndex % 2 === 0 ? "bg-white" : "bg-blue-50/30"
                      }`}
                    >
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-16">
                  <div className="flex flex-col items-center text-blue-300">
                    <FileText size={32} className="mb-2 opacity-50" />
                    <p>{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="px-6 py-4 bg-white border-t border-blue-50 flex justify-between items-center text-sm text-blue-600">
        <div>
          {data.length > 0 &&
            `Showing ${data.length} ${data.length === 1 ? "item" : "items"}`}
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled={data.length === 0}
            className="px-3 py-1 rounded border border-blue-100 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            disabled={data.length === 0}
            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;
