import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  // ⏳ While auth is being checked
  if (loading) {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-gray-50">
      
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>

      <p className="text-lg font-medium text-gray-700">
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
