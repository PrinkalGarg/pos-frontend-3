import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import useAuth from "../../../hooks/useAuth";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const Salespage = () => {
  const { user, loading: authLoading } = useAuth();

  const [salesData, setSalesData] = useState([]);
  const [showGraph, setShowGraph] = useState(false);
  const [type, setType] = useState("daily");
  const [loading, setLoading] = useState(false);

  const fetchSales = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/reports/${type}-sales`, {
        withCredentials: true,
      });

      let rawData = res?.data?.data || [];

      if (!Array.isArray(rawData)) rawData = [rawData];

      let formattedData = [];

      if (type === "daily") {
        const today = new Date().toLocaleDateString();

        const totalSales = rawData[0]?.totalSales || 0;
        const totalOrders =
          rawData[0]?.totalOrders || rawData[0]?.totalInvoices || 0;

        formattedData = [
          {
            label: today,
            totalSales,
            totalOrders,
          },
        ];
      }

      if (type === "weekly") {
        const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

        const graphData = res?.data?.data?.graphData || {};
        const graphOrders = res?.data?.data?.graphDataOrders || {};

        formattedData = weekDays.map((day) => ({
          label: day,
          totalSales: graphData[day] || 0,
          totalOrders: graphOrders[day] || 0,
        }));
      }

      if (type === "monthly") {
        const graphData = res?.data?.data?.graphData || {};
        const graphOrders = res?.data?.data?.graphDataOrders || {};

        formattedData = Object.keys(graphData).map((week) => ({
          label: week,
          totalSales: graphData[week] || 0,
          totalOrders: graphOrders[week] || 0,
        }));
      }

      setSalesData(formattedData);
    } catch (err) {
      console.log("ERROR 👉", err?.response?.data || err.message);
      setSalesData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchSales();
    }
  }, [type, authLoading, user]);

  if (authLoading) return <p>Checking authentication...</p>;

  return (
    <div className="p-6">

      {/* CARD */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        {/* HEADER */}

        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

            <div>
              <h1 className="text-xl font-semibold text-slate-900 capitalize">
                {type} Sales Report
              </h1>
              
            </div>

            <button
              onClick={() => setShowGraph(!showGraph)}
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
            >
              {showGraph ? "Table View" : "Graph View"}
            </button>

          </div>

          {/* FILTER BUTTONS */}

          <div className="flex gap-3 mt-4">
            {["daily", "weekly", "monthly"].map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-4 py-2 text-sm rounded-xl font-medium transition
                ${
                  type === t
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

        </div>

        {/* CONTENT */}

        <div className="p-6">

          {loading && (
            <p className="text-center text-slate-500">
              Loading sales data...
            </p>
          )}

          {/* TABLE VIEW */}

          {!loading && !showGraph && (
            <div className="overflow-x-auto">

              <table className="min-w-full divide-y divide-slate-200">

                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                      {type === "monthly"
                        ? "Week"
                        : type === "weekly"
                        ? "Day"
                        : "Today"}
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                      Total Sales
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                      Invoices
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">

                  {salesData.length === 0 ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-6 py-10 text-center text-slate-500"
                      >
                        No data available
                      </td>
                    </tr>
                  ) : (
                    salesData.map((sale, index) => (
                      <tr
                        key={index}
                        className="hover:bg-indigo-50 transition"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-slate-700">
                          {sale.label}
                        </td>

                        <td className="px-6 py-4 font-semibold text-slate-900">
                          ₹{sale.totalSales}
                        </td>

                        <td className="px-6 py-4 text-slate-700">
                          {sale.totalOrders}
                        </td>
                      </tr>
                    ))
                  )}

                </tbody>

              </table>

            </div>
          )}

          {/* GRAPH VIEW */}

          {!loading && showGraph && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">

              {salesData.length === 0 ? (
                <p className="text-center text-slate-500">
                  No data available
                </p>
              ) : (
                <div style={{ width: "100%", height: 350 }}>
                  <ResponsiveContainer>

                    <BarChart data={salesData}>

                      <CartesianGrid strokeDasharray="3 3" />

                      <XAxis dataKey="label" />

                      <YAxis />

                      <Tooltip
                        formatter={(value) => `₹${value}`}
                      />

                      <Bar
                        dataKey="totalSales"
                        radius={[6, 6, 0, 0]}
                      />

                    </BarChart>

                  </ResponsiveContainer>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default Salespage;