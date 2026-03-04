import { forwardRef } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, LayoutDashboard, Users, Store, BarChart3, User } from "lucide-react";

const AdminSidebar = forwardRef(({ open, setOpen }, ref) => {
  const toggleSidebar = () => setOpen(!open);
  const closeSidebar = () => setOpen(false);

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <LayoutDashboard size={20} />,
      end: true,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <Users size={20} />,
    },
    {
      name: "Stores",
      path: "/admin/stores",
      icon: <Store size={20} />,
    },
    {
      name: "Reports",
      path: "/admin/reports",
      icon: <BarChart3 size={20} />,
    },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-blue-700 text-white shadow-lg md:hidden"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        ref={ref}
        className={`fixed md:relative h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black 
        text-gray-200 transition-all duration-300 ease-in-out
        ${open ? "w-64" : "w-20"}
        z-40 flex flex-col`}
      >
        {/* Desktop Toggle */}
        <div className="hidden md:flex items-center justify-center h-16">
          <button
            onClick={toggleSidebar}
            className="flex items-center justify-center 
                       h-10 w-10 
                       rounded-xl 
                       hover:bg-gray-800 
                       transition-all duration-200"
          >
            {open ? (
              <X size={22} strokeWidth={2.5} />
            ) : (
              <Menu size={22} strokeWidth={2.5} />
            )}
          </button>
        </div>

        {/* Header */}
        

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xs px-3 py-3 text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "hover:bg-gray-800 hover:text-white"
                } 
                ${open ? "" : "justify-center"}`
              }
              title={!open ? item.name : ""}
            >
              {item.icon}
              {open && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={closeSidebar}
        />
      )}
    </>
  );
});

export default AdminSidebar;