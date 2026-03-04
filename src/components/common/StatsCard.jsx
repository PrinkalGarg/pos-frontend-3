import { Users, UserCheck, UserX, TrendingUp, TrendingDown, Clock } from "lucide-react";

const StatsCard = ({ 
  title, 
  value, 
  type = "active",
  trend = null,
  trendValue = null,
  subtitle = null,
  icon: CustomIcon = null,
  loading = false,
  onClick = null
}) => {

  const typeConfig = {
    active: {
      icon: UserCheck,
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
      borderColor: "border-emerald-100",
      label: "Active users"
    },
    inactive: {
      icon: UserX,
      bgColor: "bg-rose-50",
      textColor: "text-rose-600",
      borderColor: "border-rose-100",
      label: "Inactive users"
    },
    total: {
      icon: Users,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      borderColor: "border-blue-100",
      label: "Total users"
    }
  };

  const config = typeConfig[type] || typeConfig.active;
  const IconComponent = CustomIcon || config.icon;

  const formatValue = (val) => {
    if (typeof val !== "number") return val;
    if (val >= 1000000) return (val / 1000000).toFixed(1) + "M";
    if (val >= 1000) return (val / 1000).toFixed(1) + "K";
    return val.toString();
  };

  const getTrendIcon = () => {
    if (trend === "up") return <TrendingUp size={12} className="text-emerald-600" />;
    if (trend === "down") return <TrendingDown size={12} className="text-rose-600" />;
    return null;
  };

  return (
    <div
      className={`
        bg-white p-4 rounded-xl border border-slate-200
        shadow-sm hover:shadow-md transition-all
        ${onClick ? "cursor-pointer hover:scale-[1.01]" : ""}
      `}
      onClick={onClick}
    >

      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div className="space-y-0.5">
          <p className="text-slate-400 text-[11px] font-medium uppercase tracking-wider">
            {title || config.label}
          </p>

          {subtitle && (
            <p className="text-[11px] text-slate-400">{subtitle}</p>
          )}
        </div>

        <div
          className={`size-8 rounded-lg flex items-center justify-center
          ${config.bgColor} ${config.textColor} border ${config.borderColor}`}
        >
          <IconComponent size={16} />
        </div>
      </div>

      {/* Value */}
      <div className="flex items-end gap-2 mb-2">
        <p className="text-2xl font-bold text-slate-900">
          {loading ? "---" : formatValue(value)}
        </p>

        {trend && trendValue && (
          <div
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium
            ${trend === "up"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
              }`}
          >
            {getTrendIcon()}
            <span>{trendValue}%</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
        <span className="flex items-center gap-1">
          <span
            className={`size-1.5 rounded-full 
            ${type === "active" ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`}
          />
          Live
        </span>

        <span className="flex items-center gap-1 text-slate-300">
          <Clock size={10} />
          now
        </span>
      </div>
    </div>
  );
};

export default StatsCard;