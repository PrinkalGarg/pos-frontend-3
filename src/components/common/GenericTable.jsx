import React, { useState } from "react";
import { Search, Filter, ChevronDown, Menu, X } from "lucide-react";

const GenericTable = ({
  columns,
  data,
  searchFilters = [],
  onRowClick,
  rowActions,
  loading = false,
  emptyMessage = "No data found",
  searchPlaceholder = "Search...",
  onSearch,
  striped = true,
  hoverable = true,
  compact = false,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // 🔍 Search handler
  const handleSearch = (value) => {
    setSearchValue(value);
    onSearch && onSearch(value);
  };

  // 🔧 Column value renderer
  const getColumnValue = (row, column) => {
    if (column.render) {
      return column.render(row);
    }

    switch (column.type) {
      case "badge":
        const badgeVal = row[column.key];
        return (
          <span className="inline-flex rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-xs font-semibold">
            {badgeVal}
          </span>
        );

      case "status":
        const statusValue = row[column.key];
        return (
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
              statusValue
                ? "bg-green-50 text-green-700 ring-green-200"
                : "bg-gray-50 text-gray-600 ring-gray-200"
            }`}
          >
            <span
              className={`mr-2 h-2 w-2 rounded-full ${
                statusValue ? "bg-green-500" : "bg-gray-400"
              }`}
            ></span>
            {statusValue ? "ACTIVE" : "INACTIVE"}
          </span>
        );

      case "avatar":
        const name = row[column.key] || "";
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
              {name.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium text-gray-900">{name}</span>
          </div>
        );

      default:
        return <span className="text-gray-700">{row[column.key]}</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Mobile Filter Toggle */}
      <div className="block sm:hidden">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="w-full flex items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700"
        >
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters & Search
          </div>
          {showMobileFilters ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Search + Filters */}
        <div
          className={`border-b border-gray-200 bg-gray-50 p-4 ${
            showMobileFilters ? "block" : "hidden sm:block"
          }`}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Filters button */}
            {searchFilters.length > 0 && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm"
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
            )}
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {searchFilters.map((filter, i) => (
                <div key={i}>
                  <label className="text-sm font-medium text-gray-700">
                    {filter.label}
                  </label>

                  <select
                    value={filter.value}
                    onChange={(e) => filter.onChange(e.target.value)}
                    className="w-full mt-1 rounded-lg border border-gray-300 py-2 px-3 text-sm"
                  >
                    {filter.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Header */}
            <thead className="bg-gray-100">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    {column.header}
                  </th>
                ))}

                {rowActions && (
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            {/* Body */}
            <tbody
              className={`divide-y divide-gray-200 ${
                striped ? "even:bg-gray-50" : ""
              }`}
            >
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length + (rowActions ? 1 : 0)}
                    className="px-6 py-12 text-center"
                  >
                    Loading...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (rowActions ? 1 : 0)}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <tr
                    key={row.id || i}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`${
                      hoverable ? "hover:bg-blue-50 cursor-pointer" : ""
                    }`}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`px-6 ${
                          compact ? "py-2" : "py-4"
                        }`}
                      >
                        {getColumnValue(row, column)}
                      </td>
                    ))}

                    {rowActions && (
                      <td className="px-6 py-4 text-right">
                        {rowActions(row)}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GenericTable;