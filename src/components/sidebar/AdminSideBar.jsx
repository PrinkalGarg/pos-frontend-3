import React, { forwardRef } from "react";
import { NavLink } from "react-router-dom";

const AdminSidebar = forwardRef(({ open, setOpen }, ref) => {
  const linkClass = ({ isActive }) =>
    `flex items-center ${
      open ? "justify-start px-4 py-3" : "justify-center p-2"
    } rounded text-sm transition-all ${
      isActive
        ? "bg-blue-700 text-white"
        : "text-white hover:bg-blue-800"
    }`;

  const close = () => setOpen(false);

  const toggleSidebar = () => {
    setOpen(!open);
  };

  // ✅ Admin menu items
  const menuItems = [
    {
      path: "/admin",
      label: "Dashboard",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    },
    {
      path: "/admin/users",
      label: "Users",
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13 0h-6",
    },
    {
      path: "/admin/stores",
      label: "Stores",
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    },
    {
      path: "/admin/reports",
      label: "Reports",
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    },
  ];

  return (
    <aside
      ref={ref}
      className={`bg-blue-900 transition-all duration-300 ${
        open ? "w-64" : "w-16"
      } overflow-hidden flex flex-col h-full`}
    >
      {/* ✅ Toggle Button */}
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* ✅ Open Sidebar */}
      {open ? (
        <>
          {/* Admin Header */}
          <div className="flex flex-col items-center justify-center mb-8 px-4">
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

            <h3 className="text-white text-lg font-bold">Admin Panel</h3>
          </div>

          {/* Menu */}
          <div className="flex flex-col space-y-1 px-3 w-full">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={item.icon}
                  />
                </svg>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </>
      ) : (
        /* ✅ Closed Sidebar (Icons only) */
        <>
          <div className="flex flex-col items-center space-y-4 px-2 w-full mt-4">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={item.icon}
                  />
                </svg>
              </NavLink>
            ))}
          </div>

          <div className="mt-auto mb-6 flex justify-center">
            <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center">
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

AdminSidebar.displayName = "AdminSidebar";

export default AdminSidebar;
