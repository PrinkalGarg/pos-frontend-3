import React, { useEffect, useState } from "react";
import UserInfoCard from "../../components/common/UserDetails";
import StatsCard from "../../components/common/StatsCard";

import UserStatsCard from "../../components/common/UserStatsCard";
import { getDashboardStats } from "../../api/dashboard.api";
import SalesPage from "./sales/SalesPage";

function CashierDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Dashboard error:", error);
      }
    };

    fetchStats();
  }, []);

  if (!stats) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="p-6 space-y-8">

      {/* Title */}
      <h1 className="text-2xl font-semibold">
        Cashier Dashboard
      </h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <UserInfoCard />
        <StatsCard
          title="Inventory"
          extraData={{
            sku: stats.totalSku,
            categories: stats.totalCategories
          }}
        />
        {/* Users Card */}
        <div className="flex flex-col gap-1">
          <StatsCard
            title="Today's Invoices"
            value={stats.todayInvoices}
          />


          {/* Today's Sales */}
          <StatsCard
            title="Today's Sales"
            value={`₹${stats.todaySales}`}
          />
        </div>

      </div>

      {/* Sales Details */}
      <div className="mt-6">
        <SalesPage />
      </div>


    </div>
  );
}

export default CashierDashboard;