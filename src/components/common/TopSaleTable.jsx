import { useEffect, useState, useMemo } from "react";
import { getTopStores, downloadTopStoresExcel } from "../../api/dashboard.api";
import {
  TrendingUp,
  TrendingDown,
  Store,
  User,
  Award,
  Download,
  Search,
  RefreshCw,
  ArrowUpDown,
} from "lucide-react";

const TopSalesTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({
    key: "sales",
    direction: "desc",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  useEffect(() => {
    fetchStores();
  }, [selectedPeriod]);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const res = await getTopStores(selectedPeriod);
      setData(res);
    } catch (err) {
      console.error("Top stores error", err);
    } finally {
      setLoading(false);
    }
  };

  /* SORTING */

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    const sorted = [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortConfig.direction === "asc"
        ? aValue - bValue
        : bValue - aValue;
    });

    return sorted;
  }, [data, sortConfig]);

  /* SEARCH */

  const filteredData = sortedData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  /* RANK ICON */

  const getRankIcon = (index) => {
    if (index === 0) return <Award size={18} className="text-yellow-500" />;
    if (index === 1) return <Award size={18} className="text-gray-400" />;
    if (index === 2) return <Award size={18} className="text-amber-600" />;
    return null;
  };

  /* SALES FORMAT */

  const formatSales = (sales) => {
    if (sales >= 1000000) return `₹${(sales / 1000000).toFixed(1)}M`;
    if (sales >= 1000) return `₹${(sales / 1000).toFixed(1)}K`;
    return `₹${sales.toLocaleString()}`;
  };

  const columns = [
    { key: "rank", header: "Rank", sortable: false },
    { key: "name", header: "Store", sortable: true },
    { key: "manager", header: "Manager", sortable: true },
    { key: "sales", header: "Sales", sortable: true },
    { key: "growth", header: "Growth", sortable: true },
    { key: "status", header: "Status", sortable: false },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      
      {/* HEADER */}

      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="size-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Store size={20} className="text-indigo-600" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Top Performing Stores
              </h2>
              <p className="text-xs text-slate-500">
                Highest sales by store
              </p>
            </div>
          </div>

          {/* CONTROLS */}

          <div className="flex items-center gap-2">

            {/* PERIOD FILTER */}

            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 3 Months</option>
              <option value="year">Last 12 Months</option>
            </select>

            {/* DOWNLOAD */}

            <button
              onClick={() => downloadTopStoresExcel(selectedPeriod)}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              <Download size={18} />
            </button>

            {/* REFRESH */}

            <button
              onClick={fetchStores}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>

          </div>
        </div>

        {/* SEARCH */}

        <div className="mt-4 relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search stores or managers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* TABLE */}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">

          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase"
                >
                  {column.sortable ? (
                    <button
                      onClick={() => handleSort(column.key)}
                      className="flex items-center gap-1"
                    >
                      {column.header}
                      <ArrowUpDown size={14} className="text-slate-400" />
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">

            {loading ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center">
                  Loading stores...
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center">
                  No stores found
                </td>
              </tr>
            ) : (
              filteredData.map((row, index) => (
                <tr key={row.id} className="hover:bg-indigo-50">

                  {/* RANK */}

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getRankIcon(index)}
                      <span className="text-sm text-slate-400">
                        #{index + 1}
                      </span>
                    </div>
                  </td>

                  {/* STORE */}

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">

                      <div className="size-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white">
                        <Store size={18} />
                      </div>

                      <div>
                        <div className="font-semibold text-slate-900">
                          {row.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          {row.location || "Main Branch"}
                        </div>
                      </div>

                    </div>
                  </td>

                  {/* MANAGER */}

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">

                      <div className="size-8 bg-slate-100 rounded-full flex items-center justify-center">
                        <User size={14} className="text-slate-500" />
                      </div>

                      <span className="text-sm text-slate-700">
                        {row.manager}
                      </span>

                    </div>
                  </td>

                  {/* SALES */}

                  <td className="px-6 py-4 font-bold text-slate-900">
                    {formatSales(row.sales)}
                  </td>

                  {/* GROWTH */}

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">

                      {row.growth > 0 ? (
                        <>
                          <TrendingUp size={16} className="text-green-500" />
                          <span className="text-green-600">
                            +{row.growth}%
                          </span>
                        </>
                      ) : (
                        <>
                          <TrendingDown size={16} className="text-red-500" />
                          <span className="text-red-600">
                            {row.growth}%
                          </span>
                        </>
                      )}

                    </div>
                  </td>

                  {/* STATUS */}

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        row.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>

                </tr>
              ))
            )}

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopSalesTable;