"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { getCurrentUser, logout as logoutApi, type AuthUser } from "@/lib/api";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  setAuthenticatedUser: (user: AuthUser) => void;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function clearUserScopedStorage(userId?: string | null) {
  window.localStorage.removeItem("audvertax.settings");
  window.localStorage.removeItem("audvertax.application");
  if (userId) window.sessionStorage.removeItem(`audvertax.currentApplicationId:${userId}`);
  window.sessionStorage.removeItem("audvertax.currentApplicationId");
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const requestId = useRef(0);

  const setAuthenticatedUser = (nextUser: AuthUser) => {
    ++requestId.current;
    setUser((currentUser) => {
      if (currentUser && currentUser.email !== nextUser.email)
        clearUserScopedStorage(currentUser.id);
      return nextUser;
    });
    setLoading(false);
  };

  const refreshUser = async () => {
    const id = ++requestId.current;

    try {
      const response = await getCurrentUser();
      const nextUser = response.data.user;
      if (id !== requestId.current) return;

      setUser((currentUser) => {
        const changedAccount = currentUser && nextUser && currentUser.email !== nextUser.email;
        if (changedAccount) clearUserScopedStorage(currentUser.id);
        return nextUser;
      });
      setLoading(false);
    } catch {
      if (id === requestId.current) {
        setUser(null);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const id = requestId.current + 1;
    requestId.current = id;

    getCurrentUser()
      .then((response) => {
        if (id !== requestId.current) return;
        setUser(response.data.user);
      })
      .catch(() => {
        if (id === requestId.current) setUser(null);
      })
      .finally(() => {
        if (id === requestId.current) setLoading(false);
      });
  }, []);

  const logout = async () => {
    ++requestId.current;
    const currentUserId = user?.id;
    try {
      await logoutApi();
    } finally {
      setUser(null);
      setLoading(false);
      clearUserScopedStorage(currentUserId);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, setAuthenticatedUser, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
