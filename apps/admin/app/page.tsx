"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import SplashScreen from "./components/SplashScreen";
import { useAuthContext } from "./contexts/auth-context";

export default function AdminHomePage() {
  const router = useRouter();
  const { user, isLoading: authLoading, isAuthenticated } = useAuthContext();

  const hasRedirected = useRef(false);

  useEffect(() => {
    if (authLoading || hasRedirected.current) return;

    let path = "/admin/login";

    if (isAuthenticated && user?.status === "ACTIVE") {
      path = "/dashboard";
    }

    hasRedirected.current = true;

    // 🔥 Immediate redirect (no waiting for state updates)
    router.replace(path);
  }, [authLoading, isAuthenticated, user, router]);

  /**
   * 🔹 ALWAYS render splash
   * Never render fallback UI → eliminates flicker completely
   */
  return <SplashScreen minDisplayTime={2000} />;
}