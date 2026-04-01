// apps/admin/app/components/AdminLayoutContent.tsx
"use client";

import { useState } from "react";
import { AdminProvider } from "../contexts/admin-context";
import Sidebar from "./layout/Sidebar";
import Header from "./layout/Header";

export default function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <AdminProvider>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        />
        <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"}`}>
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </AdminProvider>
  );
}