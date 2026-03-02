import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  // ⏳ While auth is being checked
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-medium">
          Checking authentication...
        </p>
      </div>
    );
  }

  // 🔒 Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🛑 Role mismatch
  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ Access granted
  return children;
};

export default ProtectedRoute;
