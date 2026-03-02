import { createContext, useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Check authentication on app load / refresh
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch (error) {
        setUser(null);
        console.log(user);
        
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 🔐 Login
  const login = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });
  setUser(res.data.user);
  toast.success("Login successful");
  return res.data.user; // ⭐ IMPORTANT
};

  // 🚪 Logout
  const logout = async () => {
    await api.post("/users/logout");
    setUser(null);
    toast.info("Logged out");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
