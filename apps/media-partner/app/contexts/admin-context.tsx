// apps/admin/app/contexts/admin-context.tsx
"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface AdminContextType {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
  notifications: number;
  setNotifications: (count: number) => void;
  clearNotifications: () => void;
  addNotification: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Helper function to get initial sidebar state from localStorage
const getInitialSidebarState = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    const savedState = localStorage.getItem("admin-sidebar-collapsed");
    return savedState === "true";
  } catch (error) {
    console.error("Failed to load sidebar state:", error);
    return false;
  }
};

// Helper function to get initial notifications
const getInitialNotifications = (): number => {
  if (typeof window === "undefined") return 3;
  try {
    const savedNotifications = localStorage.getItem("admin-notifications");
    return savedNotifications ? parseInt(savedNotifications, 10) : 3;
  } catch (error) {
    return 3;
  }
};

export function AdminProvider({ children }: { children: ReactNode }) {
  // Initialize state directly with values from localStorage
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(getInitialSidebarState);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [notifications, setNotifications] = useState(getInitialNotifications);

  // Save to localStorage whenever state changes - this is fine in useEffect
  // but we're doing it directly in the state setter callbacks
  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed(prev => {
      const newState = !prev;
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("admin-sidebar-collapsed", String(newState));
        } catch (error) {
          console.error("Failed to save sidebar state:", error);
        }
      }
      return newState;
    });
  }, []);

  const setSidebarCollapsed = useCallback((collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("admin-sidebar-collapsed", String(collapsed));
      } catch (error) {
        console.error("Failed to save sidebar state:", error);
      }
    }
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications(0);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("admin-notifications", "0");
      } catch (error) {
        console.error("Failed to save notifications:", error);
      }
    }
  }, []);

  const addNotification = useCallback(() => {
    setNotifications(prev => {
      const newCount = prev + 1;
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("admin-notifications", String(newCount));
        } catch (error) {
          console.error("Failed to save notifications:", error);
        }
      }
      return newCount;
    });
  }, []);

  const setNotificationsCount = useCallback((count: number) => {
    setNotifications(count);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("admin-notifications", String(count));
      } catch (error) {
        console.error("Failed to save notifications:", error);
      }
    }
  }, []);

  return (
    <AdminContext.Provider
      value={{
        isSidebarCollapsed,
        toggleSidebar,
        setSidebarCollapsed,
        activeMenu,
        setActiveMenu,
        notifications,
        setNotifications: setNotificationsCount,
        clearNotifications,
        addNotification,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};