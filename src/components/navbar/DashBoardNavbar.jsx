import { useState, useRef, useEffect } from "react";
import useAuth from "../../hooks/useAuth";

const DashboardNavbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
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
    <header className="flex h-14 md:h-16 items-center justify-between bg-blue-900 px-4 md:px-6 text-white">
      {/* Left - Menu button for mobile */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded hover:bg-blue-800 transition-colors"
          aria-label="Open menu"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-6 h-6"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="text-base md:text-lg font-semibold truncate">Dashboard</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-2 rounded-lg px-3 md:px-4 py-2 hover:bg-blue-800 transition-colors text-sm md:text-base"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-5 h-5"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="hidden sm:inline">Profile</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 sm:w-64 bg-white rounded-md shadow-lg py-3 z-50 border border-gray-200">
              {/* User Header */}
              <div className="px-3 sm:px-4 py-3 border-b border-gray-100 bg-blue-50">
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>

              {/* User Information List */}
              <div className="py-2">
                <div className="px-3 sm:px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex justify-between">
                  <span className="text-gray-500">Role:</span>
                  <span className="font-medium truncate pl-2">Administrator</span>
                </div>
                <div className="px-3 sm:px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex justify-between">
                  <span className="text-gray-500">User ID:</span>
                  <span className="font-medium truncate pl-2">#{user?.id || "N/A"}</span>
                </div>
                <div className="px-3 sm:px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className="font-medium text-green-600 truncate pl-2">Active</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Separate Logout Button */}
        <button
          onClick={logout}
          className="rounded bg-red-500 px-3 md:px-4 py-2 text-xs md:text-sm hover:bg-red-400 transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default DashboardNavbar;