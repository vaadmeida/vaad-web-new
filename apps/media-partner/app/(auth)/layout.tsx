// apps/admin/app/(auth)/layout.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthContext } from "../contexts/auth-context";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuthContext();
  const router = useRouter();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0088b5]" />
      </div>
    );
  }

  return (
    <div className="">
      <div className="">
        <div className="w-full">
          {children}
        </div>
      </div>
    </div>
  );
}