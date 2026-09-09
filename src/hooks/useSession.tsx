"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  changePassword as changePasswordRequest,
  getCurrentUser,
  login as loginRequest,
  type ChangePasswordPayload,
} from "@/services/auth";
import {
  clearAccessToken,
  getAccessToken,
  saveAccessToken,
} from "@/services/session";
import type { AuthUser, LoginCredentials } from "@/types/auth";

interface SessionContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  changePassword: (payload: ChangePasswordPayload) => Promise<void>;
  logout: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const hasStoredToken = typeof window !== "undefined" && getAccessToken() !== null;
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(hasStoredToken);

  useEffect(() => {
    if (!getAccessToken()) {
      return;
    }
    let cancelled = false;
    getCurrentUser()
      .then((currentUser) => {
        if (!cancelled) {
          setUser(currentUser);
        }
      })
      .catch(() => {
        if (!cancelled) {
          clearAccessToken();
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const token = await loginRequest(credentials);
    saveAccessToken(token.access_token);
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    return currentUser;
  }, []);

  const changePassword = useCallback(
    async (payload: ChangePasswordPayload) => {
      const token = await changePasswordRequest(payload);
      saveAccessToken(token.access_token);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    },
    [],
  );

  const logout = useCallback(() => {
    clearAccessToken();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, changePassword, logout }),
    [user, loading, login, changePassword, logout],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession debe usarse dentro de SessionProvider");
  }
  return context;
}