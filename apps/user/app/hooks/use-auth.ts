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
  // 🔄 LOAD USER FROM STORAGE
  // =============================
  const loadUser = useCallback(async () => {
    setIsLoading(true);

    try {
      // Check if we have valid tokens
      const hasTokens = TokenService.isAuthenticated();
      const storedUser = localStorage.getItem("vaad_user");

      if (hasTokens && storedUser) {
        // Restore user from localStorage
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // Check if token is expired by decoding JWT
        const accessToken = TokenService.getAccessToken();
        if (accessToken) {
          try {
            // Decode JWT to check expiration
            const payload = JSON.parse(atob(accessToken.split(".")[1]));
            const isExpired = payload.exp && payload.exp * 1000 < Date.now();

            if (isExpired) {
              // Token expired, try to refresh
              console.log("Token expired, attempting refresh...");
              const refreshToken = TokenService.getRefreshToken();
              const userEmail = TokenService.getUserEmail();

              if (refreshToken && userEmail) {
                try {
                  const tokens = await authService.generateTokens({
                    email: userEmail,
                    token: refreshToken,
                  });

                  TokenService.setTokens({
                    access: tokens.accessToken || tokens.access,
                    refresh: tokens.refreshToken || tokens.refresh,
                  });

                  // Keep user data, token refreshed successfully
                  console.log("Token refreshed successfully");
                } catch (refreshErr) {
                  console.error("Token refresh failed:", refreshErr);
                  // Refresh failed, clear everything
                  TokenService.clearTokens();
                  localStorage.removeItem("vaad_user");
                  setUser(null);
                }
              } else {
                // No refresh token or email, clear everything
                TokenService.clearTokens();
                localStorage.removeItem("vaad_user");
                setUser(null);
              }
            }
          } catch (decodeErr) {
            // Invalid token format, clear everything
            console.error("Invalid token format:", decodeErr);
            TokenService.clearTokens();
            localStorage.removeItem("vaad_user");
            setUser(null);
          }
        }
      } else if (hasTokens && !storedUser) {
        // We have tokens but no user data - clear tokens
        TokenService.clearTokens();
        setUser(null);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Failed to load user:", err);
      TokenService.clearTokens();
      localStorage.removeItem("vaad_user");
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

      const { accessToken, refreshToken } = response.token;

      // Set the tokens
      TokenService.setTokens({
        access: accessToken,
        refresh: refreshToken,
      });

      // Store email for token refresh
      TokenService.setUserEmail(email);

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
