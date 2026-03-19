/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/app/lib/auth/auth-service";
import { TokenService } from "@/app/lib/auth/token-service";

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
  // 🔄 LOAD USER
  // =============================
  const loadUser = useCallback(async () => {
    if (!TokenService.isAuthenticated()) {
      setIsLoading(false);
      return;
    }

    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (err) {
      console.error("Failed to load user:", err);
      TokenService.clearTokens();
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

      // Direct access based on your known response structure
      const { accessToken, refreshToken } = response.token;

      // Set the tokens
      TokenService.setTokens({
        access: accessToken,
        refresh: refreshToken,
      });

      // Store user profile
      setUser(response.profile);
      localStorage.setItem("vaad_user", JSON.stringify(response.profile));

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
  // 📝 SIGN UP + AUTO LOGIN FLOW
  // =============================
  const signUp = async (data: SignUpRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Signup
      const signUpRes = await authService.signUp(data);

      // Step 2: Generate tokens using the verification token
      const tokens = await authService.generateTokens({
        email: data.email,
        token: signUpRes.token,
      });

      // Step 3: Save tokens (handle different token structures)
      TokenService.setTokens({
        access: tokens.accessToken || tokens.access,
        refresh: tokens.refreshToken || tokens.refresh,
      });

      // Step 4: Set user
      setUser(signUpRes.profile);
      localStorage.setItem("vaad_user", JSON.stringify(signUpRes.profile));

      router.push("/auth/login");

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

      TokenService.clearTokens();
      localStorage.removeItem("vaad_user");

      setUser(null);

      router.push("/auth/login");
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
