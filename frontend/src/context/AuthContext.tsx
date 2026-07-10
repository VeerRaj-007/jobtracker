"use client";

import { createContext, useContext, useState } from "react";

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Initialize state directly — no useEffect needed
function getInitialToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function getInitialUser(): User | null {
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem("user");
  return saved ? JSON.parse(saved) : null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(getInitialUser);
  const [token, setToken] = useState<string | null>(getInitialToken);
  const [isLoading] = useState(false);

  const login = (token: string, user: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
