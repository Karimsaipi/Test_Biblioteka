import React, { createContext, useContext, useEffect, useState } from "react";
import type { IUser } from "../models/IUser";

export interface AuthContextType {
  isAuth: boolean;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  logout: () => void;
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>; 
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuth, setIsAuth] = useState(() => Boolean(localStorage.getItem("token")));
  const [user, setUser] = useState<IUser | null>(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? (JSON.parse(raw) as IUser) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!isAuth) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  }, [isAuth]);

  const logout = () => setIsAuth(false);

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth, logout, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
