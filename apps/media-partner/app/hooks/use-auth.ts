/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/app/lib/auth/auth-service";
import { cookieService } from "@/app/lib/cookies/cookie-service";

import type {
  Profile,
  LoginRequest,
  SignUpRequest,
  ForgotPasswordRequest,
} from "@/app/lib/auth/auth-service";

export function useAuth() {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // =============================
  // 🔄 LOAD USER FROM COOKIES
  // =============================
  const loadUser = useCallback(async () => {
    setIsLoading(true);

    try {
      // Prefer stored user in cookie
      const storedUser = cookieService.getUser<Profile>();

      if (storedUser) {
        setUser(storedUser);
      } else {
        // Try to fetch current user from backend (cookies will be sent automatically)
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (err) {
          // Not authenticated or failed to fetch
          setUser(null);
        }
      }
    } catch (err) {
      console.error("Failed to load user:", err);
      // clear any stale cookies
      cookieService.clearAuthCookies();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // =============================
  // 🔑 LOGIN
  // =============================
  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login({ email, password });

      // Extract data from the new response structure
      const { accessToken, refreshToken } = response.data.tokens;
      const profile = response.data.profile;

      // Store user profile in cookie (authService.login already sets tokens cookies)
      cookieService.setCookie("user", JSON.stringify(profile));
      setUser(profile);

      router.push("/");
    } catch (err: any) {
      console.error("❌ Login error:", err);
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // =============================
  // 📝 SIGN UP
  // =============================
  const signUp = async (data: SignUpRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const signUpRes = await authService.signUp(data);
      return signUpRes;
    } catch (err: any) {
      setError(err.message || "Sign up failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // =============================
  // 📧 FORGOT PASSWORD
  // =============================
  const forgotPassword = async (data: ForgotPasswordRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.forgotPassword(data);
    } catch (err: any) {
      setError(err.message || "Failed to send reset link");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // =============================
  // 🔒 RESET PASSWORD
  // =============================
  const resetPassword = async (data: {
    email: string;
    token: string;
    password: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.resetPassword(data);
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // =============================
  // 🚪 LOGOUT
  // =============================
  const logout = async () => {
    setIsLoading(true);

    try {
      await authService.logout();
      setUser(null);
      router.push("/media-partner/login");
    } catch (err: any) {
      setError(err.message || "Logout failed");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,

    login,
    signUp,
    forgotPassword,
    resetPassword,
    logout,

    refetchUser: loadUser,
  };
}