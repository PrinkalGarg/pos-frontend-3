import { Users, UserCheck, UserX, Clock } from "lucide-react";

const UserStatsCard = ({ activeUsers = 0, inactiveUsers = 0 }) => {
  const totalUsers = activeUsers + inactiveUsers;

  return (
    <div
      className="
        bg-white p-6 rounded-2xl border border-slate-200
        shadow-sm hover:shadow-lg transition-all duration-300
      "
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-1">
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">
            Total Users
          </p>
          <p className="text-3xl font-bold text-slate-900 tracking-tight">
            {totalUsers.toLocaleString()}
          </p>
        </div>

        <div className="size-10 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600 border border-blue-100 shadow-sm">
          <Users size={18} />
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Active */}
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
          <div className="flex items-center gap-2 mb-1">
            <div className="size-7 bg-emerald-100 rounded-lg flex items-center justify-center">
              <UserCheck size={16} className="text-emerald-600" />
            </div>

            <span className="text-xs font-medium text-emerald-700 uppercase tracking-wider">
              Active
            </span>
          </div>

          <p className="text-2xl font-bold text-emerald-600">
            {activeUsers.toLocaleString()}
          </p>
        </div>

        {/* Inactive */}
        <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
          <div className="flex items-center gap-2 mb-1">
            <div className="size-7 bg-rose-100 rounded-lg flex items-center justify-center">
              <UserX size={16} className="text-rose-600" />
            </div>

            <span className="text-xs font-medium text-rose-600 uppercase tracking-wider">
              Inactive
            </span>
          </div>

          <p className="text-2xl font-bold text-rose-600">
            {inactiveUsers.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Footer (same style as StatsCard) */}
      <div className="mt-3 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs">
          <span className="size-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-slate-400">Live data</span>
        </div>

        <div className="flex items-center gap-1 text-slate-300">
          <Clock size={12} />
          <span className="text-xs">Updated now</span>
        </div>
      </div>
    </div>
  );
};

export default UserStatsCard;