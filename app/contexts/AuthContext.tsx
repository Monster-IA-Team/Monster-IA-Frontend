import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { authAPI } from "../services/auth";
import type { User, LoginRequest } from "../services/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.login(credentials);

      if (!response.is_success) {
        throw new Error(response.message || "Login failed");
      }

      const userData: User = {
        id: response.data.user_id,
        email: response.data.email,
        username: response.data.username,
        roles: response.data.roles,
      };

      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authAPI.logout();
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
}: {
  children: ReactNode;
  requireAuth?: boolean;
}) {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (requireAuth && !isAuthenticated) {
      navigate("/login");
    } else if (!requireAuth && isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, loading, requireAuth, navigate]);

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-lime-500">Loading...</div>;
  }

  return <>{children}</>;
}
