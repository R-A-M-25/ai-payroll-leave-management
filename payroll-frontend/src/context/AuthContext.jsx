import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔑 Restore session on refresh
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    if (storedToken && storedRole) {
      setIsAuthenticated(true);
      setToken(storedToken);
      setRole(storedRole);
    }

    setLoading(false);
  }, []);

  const login = ({ token, role }) => {
    setIsAuthenticated(true);
    setRole(role);
    setToken(token);

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRole(null);
    setToken(null);
    localStorage.clear();
  };

  // ⏳ Prevent route flicker
  if (loading) return null;

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, role, token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
