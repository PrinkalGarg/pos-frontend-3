import React, { useEffect, useState } from "react";
import UserInfoCard from "../../components/common/UserDetails";
import StatsCard from "../../components/common/StatsCard";
import { getDashboardStats } from "../../api/dashboard.api";
import UserStatsCard from "../../components/common/UserStatsCard";
import TopSalesTable from "../../components/common/TopSaleTable";

function AdminDashboard() {
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

  if (!stats) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 space-y-4 ">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold">
        Admin Dashboard
      </h1>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* User Details */}
        <UserInfoCard />

        {/* Users Stats */}
        <UserStatsCard
          activeUsers={stats.activeUsers}
          inactiveUsers={stats.inactiveUsers}
        />

        {/* Stores + Sales Column */}
        <div className="flex flex-col gap-1">
          <StatsCard
            title="Total Stores"
            value={stats.totalStores}
          />

          <StatsCard
            title="Today's Sales"
            value={`₹${stats.todaySales}`}
          />
        </div>

      </div>
      <div className="mt-6">
  <h2 className="text-lg font-semibold mb-4">
    Top Performing Stores
  </h2>

  <TopSalesTable />
</div>
    </div>
  );
}

export default AdminDashboard;