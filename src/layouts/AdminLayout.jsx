import { useState, useRef, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/sidebar/AdminSideBar";
import DashboardNavbar from "../components/navbar/DashBoardNavbar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  // Close sidebar on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close sidebar on mobile when route changes
  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed lg:relative z-40 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <AdminSidebar
          open={sidebarOpen}
          setOpen={setSidebarOpen}
        />
      </div>

      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Navbar */}
        <DashboardNavbar
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Page content */}
        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden bg-gray-100 p-4 lg:p-6">
          <Outlet context={{ closeSidebarOnMobile }} />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;