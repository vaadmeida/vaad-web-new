"use client";

import Header from "../../components/layout/Header";
import { AdminProvider } from "../../contexts/admin-context";
import Sidebar from "../../components/layout/Sidebar";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300`}>
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </AdminProvider>
  );
}