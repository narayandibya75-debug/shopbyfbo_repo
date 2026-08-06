import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import { api } from "../lib/api";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // Add this line

  // Refresh logged-in user from backend using stored JWT
  const refresh = useCallback(async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data);
      // Check if user has admin role
      setIsAdmin(data?.role === "admin"); // Add this line
    } catch (err) {
      setUser(null);
      setIsAdmin(false); // Add this line
    } finally {
      setLoading(false);
    }
  }, []);

  // On app load, check for stored token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    // Inject token into axios headers
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    refresh();
  }, [refresh]);

  // api.js dispatches this when a background token refresh fails (refresh
  // token itself expired/revoked) - i.e. the session is genuinely over, not
  // just a single request that 401'd. Clear state here so ProtectedRoute /
  // AdminRoute redirect to /login on their own; no direct navigate() needed.
  useEffect(() => {
    const handleLoggedOut = () => {
      setUser(null);
      setIsAdmin(false);
    };
    window.addEventListener("auth:logged-out", handleLoggedOut);
    return () => window.removeEventListener("auth:logged-out", handleLoggedOut);
  }, []);

  // Email / password login
  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.access_token);
    api.defaults.headers.common["Authorization"] = `Bearer ${data.access_token}`;
    await refresh();
    return data;
  };

  // Email / password register
  const register = async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    localStorage.setItem("token", data.access_token);
    api.defaults.headers.common["Authorization"] = `Bearer ${data.access_token}`;
    await refresh();
    return data;
  };

  // Google login — sends the raw ID token (credential) to the backend, which
  // verifies it with Google before trusting any claims from it, and returns
  // our own JWT. Do NOT send client-decoded email/name/picture instead of
  // the token: those are unverifiable claims and the backend will (correctly)
  // reject a request that doesn't include the token itself.
  const googleLogin = async (credential) => {
    const { data } = await api.post("/auth/google-login", { credential });
    localStorage.setItem("token", data.access_token);
    api.defaults.headers.common["Authorization"] = `Bearer ${data.access_token}`;
    await refresh();
    return data;
  };

  // Logout
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (_) {}
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    setIsAdmin(false); // Add this line
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin, // Add this line
        login,
        register,
        googleLogin,
        logout,
        refresh,
        setUser,
        setIsAdmin, // Add this line
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
