"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import SplashScreen from "./components/SplashScreen";
import { useAuthContext } from "./contexts/auth-context";

export default function AdminHomePage() {
  const router = useRouter();
  const { user, isLoading: authLoading, isAuthenticated } = useAuthContext();

  const [splashDone, setSplashDone] = useState(false);

  /**
   * 🔹 Determine redirect path (pure logic, no side effects)
   */
  const redirectPath = useMemo(() => {
    if (authLoading) return null;

    if (!isAuthenticated) return "/admin/login";

    if (user?.status !== "ACTIVE") {
      return "/admin/login";
    }

    return "/dashboard";
  }, [authLoading, isAuthenticated, user]);

  /**
   * 🔹 Handle invalid session cleanup
   */
  useEffect(() => {
    if (!authLoading && isAuthenticated && user?.status !== "ACTIVE") {
      localStorage.removeItem("vaad_user");
      localStorage.removeItem("vaad_access_token");
      localStorage.removeItem("vaad_refresh_token");
    }
  }, [authLoading, isAuthenticated, user]);

  /**
   * 🔹 Single redirect effect (no race conditions)
   */
  useEffect(() => {
    if (!redirectPath || !splashDone) return;

    router.replace(redirectPath); // replace > push (no back navigation)
  }, [redirectPath, splashDone, router]);

  /**
   * 🔹 Splash screen (guaranteed single lifecycle)
   */
  if (!splashDone || authLoading) {
    return (
      <SplashScreen
        minDisplayTime={2000}
        onComplete={() => setSplashDone(true)}
      />
    );
  }

  /**
   * 🔹 Fallback (rare)
   */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0088b5] mx-auto mb-4" />
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}