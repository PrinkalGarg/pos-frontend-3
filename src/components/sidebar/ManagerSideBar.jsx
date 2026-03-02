import React, { forwardRef } from "react";
import { NavLink } from "react-router-dom";

const ManagerSidebar = forwardRef(({ open, setOpen }, ref) => {
  const linkClass = ({ isActive }) =>
    `flex items-center ${open ? "justify-start px-4 py-3" : "justify-center p-2"} rounded text-sm transition-all ${
      isActive
        ? "bg-blue-700 text-white"
        : "text-white hover:bg-blue-800"
    }`;

  const close = () => setOpen(false);
  
  const toggleSidebar = () => {
    setOpen(!open);
  };

  // Menu items with icons
  const menuItems = [
    { 
      path: "/manager/dashboard", 
      label: "Dashboard", 
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
    },
    { 
      path: "/manager/staff", 
      label: "Staff", 
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13 0h-6" 
    },
    { 
      path: "/manager/sales", 
      label: "Sales", 
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
    },
     { 
    path: "/manager/products", 
    label: "Products", 
    icon: "M20 13V7a2 2 0 00-2-2h-3V3H9v2H6a2 2 0 00-2 2v6m16 0v6a2 2 0 01-2 2h-3m-6 0H6a2 2 0 01-2-2v-6m16 0H4"
  },
  ];

  return (
    <aside
      ref={ref}
      className={`bg-blue-900 transition-all duration-300 ${
        open ? "w-64" : "w-16"
      } overflow-hidden flex flex-col h-full`}
    >
      {/* Toggle Button */}
      <div className={`flex ${open ? "justify-end" : "justify-center"} p-4`}>
        <button
          onClick={toggleSidebar}
          className="text-white hover:bg-blue-800 rounded-lg p-2 transition-colors"
          title={open ? "Close sidebar" : "Open sidebar"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* When sidebar is open: Full user profile section */}
      {open ? (
        <>
          {/* Centered User Profile */}
          <div className="flex flex-col items-center justify-center mb-8 px-4">
            {/* Profile Icon with Blue Circle */}
            <div className="w-20 h-20 rounded-full bg-blue-700 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            
            {/* Manager Panel Text */}
            <h3 className="text-white text-lg font-bold">Manager Panel</h3>
          </div>

          {/* Navigation Menu */}
          <div className="flex flex-col items-stretch space-y-1 px-3 w-full">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/manager/dashboard"}
                className={linkClass}
                onClick={close}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </>
      ) : (
        /* When sidebar is closed: Only icons */
        <>
          {/* Navigation Menu - Only icons */}
          <div className="flex flex-col items-center space-y-4 px-2 w-full mt-4">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/manager/dashboard"}
                className={linkClass}
                onClick={close}
                title={item.label}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
              </NavLink>
            ))}
          </div>

          {/* User Icon at bottom when closed */}
          <div className="mt-auto mb-6 flex justify-center">
            <div 
              className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center"
              title="Manager Panel"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>
        </>
      )}
    </aside>
  );
});

ManagerSidebar.displayName = "ManagerSidebar";

export default ManagerSidebar;