"use client";
import { createContext, useContext, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

interface User {
  id: number;
  name: string;
  role: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
  fetchUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const setUser = (user: User | null) => {
    setUserState(user);
  };

  const clearAuth = () => {
    setUserState(null);
    axiosInstance.post("/logout").catch((error) => {
      console.error("Failed to logout", error);
    });
  };

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/users/me");
      console.log("user fetched from server", res.data);
      setUserState(res.data);
    } catch (error: any) {
      console.error("Failed to fetch user data", error);
      if (error.response?.status === 401) {
        setUserState(null);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, setUser, clearAuth, fetchUserData }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
