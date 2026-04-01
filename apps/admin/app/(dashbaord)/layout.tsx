// apps/admin/app/(dashboard)/layout.tsx
"use client";

import { Sidebar } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "../components/layout/Header";
import { useAdmin, AdminProvider } from "../contexts/admin-context";
import { useAuthContext } from "../contexts/auth-context";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { isSidebarCollapsed, toggleSidebar } = useAdmin();
  const { isAuthenticated, isLoading } = useAuthContext();
  const router = useRouter();

  // Protect dashboard routes - redirect to login if not authenticated
//   useEffect(() => {
//     if (!isLoading && !isAuthenticated) {
//       router.push("/admin/login");
//     }
//   }, [isAuthenticated, isLoading, router]);

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0088b5]" />
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return null;
//   }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={toggleSidebar} 
      />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"}`}>
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