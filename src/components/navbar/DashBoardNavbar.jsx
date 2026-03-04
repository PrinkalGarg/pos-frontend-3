import { useState, useRef, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { Menu, User, ChevronDown, LogOut } from "lucide-react";

const DashboardNavbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="flex h-20 items-center  justify-between bg-gradient-to-r from-gray-950 via-gray-900 to-black px-6 border-b border-gray-800 text-gray-200">
      
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold text-white tracking-wide">
          Dashboard
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">

        {/* Profile */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-3 rounded-xl px-4 py-2 hover:bg-gray-800 transition"
          >
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center">
              <User size={18} />
            </div>

            <div className="hidden sm:flex flex-col text-left">
              <span className="text-sm font-medium text-white truncate">
                {user?.name}
              </span>
              <span className="text-xs text-gray-400 truncate">
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

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-gray-900 border border-gray-800 shadow-2xl p-4 z-50 animate-fadeIn">

              {/* User Info */}
              <div className="mb-4 border-b border-gray-800 pb-3">
                <p className="text-sm font-semibold text-white truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Role</span>
                  <span className="text-white font-medium">
                    {user?.role}
                  </span>
                </div>

                <div className="flex justify-between text-gray-400">
                  <span>User ID</span>
                  <span className="text-white font-medium">
                    #{user?.id || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between text-gray-400">
                  <span>Status</span>
                  <span className="text-green-500 font-medium">
                    Active
                  </span>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={logout}
                className="mt-5 w-full flex items-center justify-center gap-2 rounded-lg bg-red-600 hover:bg-red-500 transition py-2 text-sm font-medium text-white"
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