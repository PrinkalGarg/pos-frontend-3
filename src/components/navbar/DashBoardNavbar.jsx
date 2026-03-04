import { useState, useRef, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import DashboardSearch from "./DashboardSearch";

import {
  Menu,
  User,
  ChevronDown,
  LogOut,
  Bell,
  Store,
} from "lucide-react";

const DashboardNavbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const roleDashboard = {
    ADMIN: "Admin Dashboard",
    INVENTORY_MANAGER: "Inventory Dashboard",
    CASHIER: "Cashier Dashboard",
    MANAGER: "Manager Dashboard",
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex h-20 items-center justify-between bg-gradient-to-r from-gray-950 via-gray-900 to-black px-6 border-b border-gray-800 text-gray-200">

      {/* LEFT SECTION */}
      <div className="flex items-center gap-4">

        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition"
        >
          <Menu size={20} />
        </button>

        <h1 className="text-lg font-semibold text-white tracking-wide">
          {roleDashboard[user?.role] || "Dashboard"}
        </h1>

        {/* Store Badge */}
        {user?.store && (
          <div className="hidden md:flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-lg text-xs text-gray-300">
            <Store size={14} />
            {user.store.name}
          </div>
        )}
      </div>

      {/* SEARCH */}
      <DashboardSearch />

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-4">

        {/* Notifications */}
       

        {/* PROFILE */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 rounded-xl px-4 py-2 hover:bg-gray-800 transition"
          >
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center">
              <User size={18} />
            </div>

            <div className="hidden sm:flex flex-col text-left">
              <span className="text-sm font-medium text-white truncate">
                {user?.name}
              </span>
              <span className="text-xs text-gray-400">
                {user?.role}
              </span>
            </div>

            <ChevronDown
              size={16}
              className={`transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* DROPDOWN */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 origin-top-right rounded-lg bg-gray-900 border border-gray-800 shadow-2xl p-4 z-50">

              {/* Arrow */}
              <div className="absolute right-4 -top-2 w-4 h-4 bg-gray-900 rotate-45 border-l border-t border-gray-800"></div>

              {/* USER INFO */}
              <div className="mb-4 border-b border-gray-800 pb-3">
                <p className="text-sm font-semibold text-white">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-400">
                  {user?.email}
                </p>
              </div>

              {/* DETAILS */}
              <div className="space-y-2 text-sm">

                <div className="flex justify-between text-gray-400">
                  <span>Role</span>
                  <span className="text-white">{user?.role}</span>
                </div>

                <div className="flex justify-between text-gray-400">
                  <span>Status</span>
                  <span
                    className={`font-medium ${
                      user?.isActive ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {user?.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {user?.store && (
                  <>
                    <div className="border-t border-gray-800 my-2"></div>

                    <div className="flex justify-between text-gray-400">
                      <span>Store</span>
                      <span className="text-white">
                        {user.store.name}
                      </span>
                    </div>

                    <div className="flex justify-between text-gray-400">
                      <span>Store Code</span>
                      <span className="text-white">
                        {user.store.storeCode}
                      </span>
                    </div>

                    <div className="flex justify-between text-gray-400">
                      <span>Address</span>
                      <span className="text-white text-right max-w-[120px] truncate">
                        {user.store.address || "N/A"}
                      </span>
                    </div>
                  </>
                )}

                <div className="flex justify-between text-gray-400">
                  <span>Joined</span>
                  <span className="text-white">
                    {new Date(user?.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* LOGOUT */}
              <button
                onClick={logout}
                className="mt-5 w-full flex items-center justify-center gap-2 rounded-lg bg-red-700 hover:bg-red-600 transition py-2 text-sm font-medium text-white"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;