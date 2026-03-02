import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { ROLES } from "../auth/roles";

const HomeRedirect = () => {
  const { user, loading } = useAuth();

  // ⏳ Wait until auth check finishes
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-medium">Loading...</p>
      </div>
    );
  }

  // 🔒 Not logged in → login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Logged in → role based redirect
  switch (user.role) {
    case ROLES.ADMIN:
      return <Navigate to="/admin" replace />;
    case ROLES.MANAGER:
      return <Navigate to="/manager" replace />;
    case ROLES.INVENTORY_MANAGER:
      return <Navigate to="/inventory" replace />;
    case ROLES.CASHIER:
      return <Navigate to="/cashier" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default HomeRedirect;
