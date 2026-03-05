import React, { useEffect, useState } from "react";
import UserInfoCard from "../../components/common/UserDetails";
import StatsCard from "../../components/common/StatsCard";

import UserStatsCard from "../../components/common/UserStatsCard";
import { getDashboardStats } from "../../api/dashboard.api";

function ManagerDashboard() {
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
        Manager Dashboard
      </h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <UserInfoCard />
        {/* Users Card */}
        <UserStatsCard
          activeUsers={stats.activeUsers}
          inactiveUsers={stats.inactiveUsers}
        />

        {/* Today's Sales */}
         <div className="flex flex-col gap-1">
        <StatsCard
          title="Today's Sales"
          value={`₹${stats.todaySales}`}
        />
        {/* Inventory */}
        <StatsCard
          title="Inventory"
          extraData={{
            sku: stats.totalSku,
            categories: stats.totalCategories
          }}
        />
        </div>

      </div>

      {/* User Details */}
      

    </div>
  );
}

export default ManagerDashboard;