"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { apiService, type UserProfile, type ProfileUpdateData } from "./api";
import { AuthLoadingScreen } from "@/components/auth-loading";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string, fullName?: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  refreshGoogleSheetStatus: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  confirmPasswordReset: (
    accessToken: string,
    newPassword: string
  ) => Promise<void>;
  getAccessToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);


  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem("accessToken");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setAccessToken(storedToken);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        // Clear invalid data
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);


  const login = async (email: string, password: string, fullName?: string) => {
    try {
      const response = await apiService.login({ email, password });

      if (response.status === "success" && response.data) {
        const userData: User = {
          id: response.data.user_id,
          email: response.data.email,
          name: fullName || email.split("@")[0], // Use email prefix if no full name
        };

        setUser(userData);
        setAccessToken(response.data.access_token);
        setIsAuthenticated(true);

        // Store in localStorage
        localStorage.setItem("accessToken", response.data.access_token);
        localStorage.setItem("user", JSON.stringify(userData));

        console.log("Login successful!");
      }
    } catch (error) {
      throw error;
    }
  };

  const signup = async (email: string, password: string, fullName: string) => {
    try {
      const response = await apiService.signup({
        email,
        password,
        full_name: fullName,
      })

      if (response.status === "success") {
        // Don't automatically log in after signup
        // User needs to log in manually
        console.log("Signup successful! Please log in.");
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      // No need to call backend logout API
      // Just clear local state and localStorage
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear state and localStorage
      setUser(null);
      setAccessToken(null);
      setIsAuthenticated(false);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      localStorage.removeItem("dashboardVisited"); // Reset dashboard visited flag
      localStorage.removeItem("googleSheetStatus");
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const refreshGoogleSheetStatus = async () => {
    try {
      const sheetStatus = await apiService.checkGoogleSheetStatus();
      localStorage.setItem("googleSheetStatus", JSON.stringify(sheetStatus));
      console.log("Google Sheet status refreshed successfully:", sheetStatus);
    } catch (error) {
      console.error("Error refreshing Google Sheet status:", error);
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      await apiService.requestPasswordReset({ email });
    } catch (error) {
      throw error;
    }
  };

  const confirmPasswordReset = async (
    accessToken: string,
    newPassword: string
  ) => {
    try {
      await apiService.confirmPasswordReset({
        access_token: accessToken,
        new_password: newPassword,
      });
    } catch (error) {
      throw error;
    }
  };

  // Get access token function
  const getAccessToken = () => accessToken;

  // Provide context even during initialization to prevent useAuth errors
  const value: AuthContextType = {
    user,
    isAuthenticated,
    accessToken,
    isLoading: !isInitialized,
    login,
    signup,
    logout,
    updateUser,
    refreshGoogleSheetStatus,
    requestPasswordReset,
    confirmPasswordReset,
    getAccessToken,
  };

  // Show loading screen only if not initialized
  if (!isInitialized) {
    return <AuthLoadingScreen />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuth must be used within an AuthProvider. Make sure your component is wrapped with <AuthProvider> in your app layout."
    );
  }
  return context;
}
