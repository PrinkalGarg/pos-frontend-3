import { forwardRef } from "react";
import { NavLink } from "react-router-dom";

const InventoryManagerSidebar = forwardRef(({ open, setOpen }, ref) => {
  const closeSidebar = () => setOpen(false);
  const toggleSidebar = () => setOpen(!open);

  // SVG Icons
  const DashboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );

  const ProductsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );

  const StockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  );

  const PersonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );

  const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-blue-900 text-white shadow-lg md:hidden"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      {/* Sidebar */}
      <aside
        ref={ref}
        className={`fixed md:relative h-screen bg-linear-to-b from-blue-900 to-blue-950 text-white transition-all duration-300
          ${open ? "w-64" : "w-16"}
          overflow-hidden border-r border-blue-800/50 z-40 flex flex-col`}
      >
        {/* Toggle Button for Desktop */}
        <div className="hidden md:flex justify-end p-3">
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg hover:bg-blue-800 transition-colors"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {/* Inventory Manager Panel Header - Reduced spacing */}
        {open ? (
          <div className="flex flex-col items-center py-4 border-b border-blue-800/50">
            <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center mb-1">
              <PersonIcon />
            </div>
            <h2 className="text-base font-semibold text-blue-100">Inventory Manager</h2>
          </div>
        ) : (
          /* Inventory Manager Panel Icon when closed - Reduced spacing */
          <div className="flex flex-col items-center py-4 border-b border-blue-800/50">
            <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center">
              <PersonIcon />
            </div>
          </div>
        )}

        {/* Navigation Items - Further reduced spacing */}
        <div className="flex flex-col items-center pt-4 space-y-2 px-3">
          {/* Dashboard - Link style varies based on open state */}
          {open ? (
            <NavLink 
              to="/inventory" 
              end 
              className={({ isActive }) =>
                `w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-blue-100 hover:bg-blue-700/60"
                }`
              } 
              onClick={closeSidebar}
            >
              <DashboardIcon />
              <span className="flex-1">Dashboard</span>
            </NavLink>
          ) : (
            <NavLink 
              to="/inventory" 
              end 
              className={({ isActive }) =>
                `p-2.5 rounded-lg transition-all flex items-center justify-center
                ${isActive ? "bg-blue-600 text-white shadow-md" : "text-blue-100 hover:bg-blue-700/60"}`
              } 
              onClick={closeSidebar}
              title="Dashboard"
            >
              <DashboardIcon />
            </NavLink>
          )}

          {/* Products */}
          {open ? (
            <NavLink 
              to="/inventory/products" 
              className={({ isActive }) =>
                `w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-blue-100 hover:bg-blue-700/60"
                }`
              } 
              onClick={closeSidebar}
            >
              <ProductsIcon />
              <span className="flex-1">Products</span>
            </NavLink>
          ) : (
            <NavLink 
              to="/inventory/products" 
              className={({ isActive }) =>
                `p-2.5 rounded-lg transition-all flex items-center justify-center
                ${isActive ? "bg-blue-600 text-white shadow-md" : "text-blue-100 hover:bg-blue-700/60"}`
              } 
              onClick={closeSidebar}
              title="Products"
            >
              <ProductsIcon />
            </NavLink>
          )}

          {/* Stock */}
          {open ? (
            <NavLink 
              to="/inventory/stock" 
              className={({ isActive }) =>
                `w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-blue-100 hover:bg-blue-700/60"
                }`
              } 
              onClick={closeSidebar}
            >
              <StockIcon />
              <span className="flex-1">Stock</span>
            </NavLink>
          ) : (
            <NavLink 
              to="/inventory/stock" 
              className={({ isActive }) =>
                `p-2.5 rounded-lg transition-all flex items-center justify-center
                ${isActive ? "bg-blue-600 text-white shadow-md" : "text-blue-100 hover:bg-blue-700/60"}`
              } 
              onClick={closeSidebar}
              title="Stock"
            >
              <StockIcon />
            </NavLink>
          )}
        </div>
      </aside>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={closeSidebar}
        />
      )}
    </>
  );
});

export default InventoryManagerSidebar;