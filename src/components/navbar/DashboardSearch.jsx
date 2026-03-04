import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTE_SEARCH } from "../../app/routeConfigeFile";
import useAuth from "../../hooks/useAuth";

const DashboardSearch = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const allowedRoutes = ROUTE_SEARCH.filter((route) =>
    route.roles.includes(user?.role)
  );

  const filteredRoutes = allowedRoutes.filter((route) =>
    route.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative hidden md:flex w-[500px]">

      <input
        type="text"
        placeholder="Search pages..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
       className="w-full bg-gray-800 rounded-lg px-5 py-2.5 text-sm text-white outline-none"
      />

      {query && (
        <div className="absolute top-12 left-0 w-full bg-gray-900 border border-gray-800 rounded-xl shadow-xl z-50">
          {filteredRoutes.map((route) => (
            <div
              key={route.path}
              onClick={() => {
                navigate(route.path);
                setQuery("");
              }}
              className="px-4 py-2 hover:bg-gray-800 cursor-pointer text-sm text-gray-200"
            >
              {route.label}
            </div>
          ))}

          {filteredRoutes.length === 0 && (
            <div className="px-4 py-2 text-gray-500 text-sm">
              No results
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardSearch;