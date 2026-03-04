import { createContext, useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // fetch user helper
  const fetchUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
      return res.data.user;
    } catch (error) {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // run on app load
  useEffect(() => {
    fetchUser();
  }, []);

  // login
  const login = async (email, password) => {
    try {
      await api.post("/auth/login", { email, password });

      // wait a moment for cookie to register
      const userData = await fetchUser();

      toast.success("Login successful");

      return userData;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
      throw error;
    }
  };

  // logout
  const logout = async () => {
    try {
      await api.post("/users/logout");
      setUser(null);
      toast.info("Logged out");
    } catch (error) {
      console.error(error);
    }
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