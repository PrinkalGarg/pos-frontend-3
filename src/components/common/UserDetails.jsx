import useAuth from "../../hooks/useAuth";
import { User, Mail, Shield, Store, Calendar } from "lucide-react";

const UserInfoCard = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">

      {/* Header */}
      <div className="flex items-center gap-4 ">

        <div className="size-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
          <User size={22} />
        </div>

        <div className="min-w-0">
          <h2 className="text-lg font-bold text-slate-900 truncate">
            {user?.name}
          </h2>

          <p className="text-sm text-slate-500 truncate">
            {user?.email}
          </p>
        </div>

      </div>

      {/* Details */}
      <div className="space-y-3 m-4 text-sm">

        <div className="flex items-center justify-between">
          <span className="text-slate-400 flex items-center gap-2">
            <Shield size={16} />
            Role
          </span>
          <span className="font-medium text-slate-900">
            {user?.role}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400 flex items-center gap-2">
            <Mail size={16} />
            Email
          </span>
          <span className="text-slate-600 truncate">
            {user?.email}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400 flex items-center gap-2">
            <Calendar size={16} />
            Joined
          </span>
          <span className="text-slate-600">
            {new Date(user?.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400 flex items-center gap-2">
            <Shield size={16} />
            Status
          </span>

          {user?.isActive ? (
            <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">
              Active
            </span>
          ) : (
            <span className="text-xs font-semibold bg-red-100 text-red-700 px-2 py-1 rounded-full">
              Inactive
            </span>
          )}
        </div>

        {/* Store Info */}
        {user?.store && (
          <>
            <div className="border-t border-slate-200 my-2"></div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-2">
                <Store size={16} />
                Store
              </span>
              <span className="font-medium text-slate-900">
                {user?.store?.name}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-2">
                <Store size={16} />
                Store Code
              </span>
              <span className="text-slate-600">
                {user?.store?.storeCode}
              </span>
            </div>
          </>
        )}
      </div>

    </div>
  );
};

export default UserInfoCard;