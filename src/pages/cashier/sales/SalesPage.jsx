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

  // 🟢 Helper: Get Monday of current week
  const getMonday = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(today.setDate(diff));
  };

  const fetchSales = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/reports/${type}-sales`, {
        withCredentials: true,
      });

      let rawData = res?.data?.data || [];

      if (!Array.isArray(rawData)) {
        rawData = [rawData];
      }

      let formattedData = [];

      // 🟢 DAILY
      if (type === "daily") {
        const today = new Date().toLocaleDateString();

        const totalSales = rawData[0]?.totalSales || 0;
        const totalOrders =
          rawData[0]?.totalOrders ||
          rawData[0]?.totalInvoices ||
          0;

        formattedData = [
          {
            label: today,
            totalSales,
            totalOrders,
          },
        ];
      }

    // 🟢 WEEKLY (Use graphData from backend)
if (type === "weekly") {
  const weekDays = [
    "Mon","Tue","Wed","Thu","Fri","Sat","Sun"
  ];

  const graphData =
    res?.data?.data?.graphData || {};

  const graphOrders =
    res?.data?.data?.graphDataOrders || {};

  formattedData = weekDays.map((day) => ({
    label: day,
    totalSales: graphData[day] || 0,
    totalOrders: graphOrders[day] || 0,
  }));
}
// 🟢 MONTHLY
if (type === "monthly") {
  const graphData =
    res?.data?.data?.graphData || {};

  const graphDataOrders =
    res?.data?.data?.graphDataOrders || {};

  formattedData = Object.keys(graphData).map(
    (week) => ({
      label: week,
      totalSales: graphData[week] || 0,
      totalOrders: graphDataOrders[week] || 0,
    })
  );
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold capitalize">
          {type} Sales Report
        </h1>

        <button
          onClick={() => setShowGraph(!showGraph)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {showGraph ? "Table View" : "Graph View"}
        </button>
      </div>

      <div className="flex gap-3 mb-4">
        {["daily", "weekly", "monthly"].map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`px-4 py-2 rounded ${
              type === t
                ? "bg-green-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {loading && <p>Loading sales data...</p>}

      {/* TABLE */}
      {!loading && !showGraph && (
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">
                {type === "monthly"
                  ? "Date"
                  : type === "weekly"
                  ? "Day"
                  : "Today"}
              </th>
              <th className="p-2">Total Sales</th>
              <th className="p-2">Orders</th>
            </tr>
          </thead>
          <tbody>
            {salesData.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-4 text-center">
                  No data available
                </td>
              </tr>
            ) : (
              salesData.map((sale, index) => (
                <tr key={index} className="text-center border-t">
                  <td className="p-2">{sale.label}</td>
                  <td className="p-2">
                    ₹{sale.totalSales}
                  </td>
                  <td className="p-2">
                    {sale.totalOrders}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* GRAPH */}
      {!loading && showGraph && (
        <div style={{ width: "100%", height: 400 }}>
          {salesData.length === 0 ? (
            <p className="text-center mt-10">
              No data available
            </p>
          ) : (
            <ResponsiveContainer>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalSales" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      )}
    </div>
  );
};

export default Salespage;