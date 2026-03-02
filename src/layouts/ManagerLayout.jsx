import { useState, useRef, useEffect } from "react";
import { Outlet } from "react-router-dom";
import DashboardNavbar from "../components/navbar/DashBoardNavbar";
import ManagerSidebar from "../components/sidebar/ManagerSideBar";
const ManagerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <ManagerSidebar
        ref={sidebarRef}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      <div className="flex flex-1 flex-col">
        <DashboardNavbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ManagerLayout;