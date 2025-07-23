"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "@remix-run/react";

interface Column<T> {
  header: string;
  accessor: (row: T) => React.ReactNode;
}

interface GenericTableProps<T> {
  columns: Column<T>[];
  data: T[];
  itemsPerPage?: number;
  header: string;
  addUrl?: {
    title: string;
    url: string;
  };
  isLoading?: boolean;
  hideTopBar?: boolean;
}

export function GenericTable<T>({
  header,
  columns,
  data,
  itemsPerPage = 5,
  addUrl,
  hideTopBar = false,
  isLoading = false,
}: GenericTableProps<T>) {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    return data.filter((row) =>
      JSON.stringify(row).toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, data]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = filteredData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {!hideTopBar && (
        <div className="p-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800">{header}</h2>
          <div className=" flex flex-col sm:flex-row gap-3 md:gap-4 items-stretch md:items-center w-full md:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="border border-gray-200 rounded-md pl-10 pr-4 py-3 w-full text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
              />
              <Search
                className="absolute left-3 top-3.5 text-gray-400"
                size={18}
              />
            </div>
            {addUrl && (
              <Link
                to={addUrl.url}
                className="rounded-md px-4 whitespace-nowrap py-2 bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 flex items-center justify-center space-x-1"
              >
                <span className="text-lg">+</span>
                <span>{addUrl.title}</span>
              </Link>
            )}
          </div>
        </div>
      )}
      {isLoading ? (
        <div className="border-t py-20 flex flex-col items-center justify-center text-gray-500">
          <Loader2 className="h-8 w-8 mb-3 text-amber-500 animate-spin" />
          <span className="text-lg font-medium">Please wait...</span>
          <span className="mt-2 text-sm text-gray-400">Loading data</span>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="sticky top-0  bg-gray-50">
                <tr className="text-left text-gray-600 text-sm border-y">
                  <th className="px-3 sm:px-6 py-2 sm:py-3 w-10 whitespace-nowrap">
                    #
                  </th>
                  {columns.map((col, i) => (
                    <th
                      key={i}
                      className="px-3 sm:px-6 py-2 sm:py-3 font-medium whitespace-nowrap"
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr className="border-t">
                    <td
                      colSpan={columns.length + 1}
                      className="text-center py-4"
                    >
                      No data found.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((row, i) => (
                    <tr
                      key={i}
                      className="border-t border-gray-100 hover:bg-gray-50 whitespace-nowrap"
                    >
                      <td className="px-6 py-4 text-gray-500">
                        {(page - 1) * itemsPerPage + i + 1}
                      </td>
                      {columns.map((col, j) => (
                        <td key={j} className="px-6 py-4 text-gray-600">
                          {col.accessor(row)}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 0 && (
            <div className="flex justify-between items-center px-4 py-3 border-t ">
              <div className="text-sm text-gray-500">
                Showing {page} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size={"icon"}
                  onClick={handlePrev}
                  disabled={page === 1}
                >
                  <ChevronLeft size={16} />
                </Button>
                <Button
                  size={"icon"}
                  onClick={handleNext}
                  disabled={page === totalPages}
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
