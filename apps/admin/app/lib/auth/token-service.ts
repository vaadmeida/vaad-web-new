/* eslint-disable @typescript-eslint/no-explicit-any */
// app/lib/auth/token-service.ts
import { cookieService } from "@/app/lib/cookies/cookie-service";

export interface Tokens {
  accessToken?: string;
  refreshToken?: string;
  access?: string;
  refresh?: string;
  [key: string]: any;
}

export class TokenService {
  static setTokens(tokens: any, email?: string): void {
    if (typeof window === "undefined") return;

    const accessToken = tokens.accessToken || tokens.access;
    const refreshToken = tokens.refreshToken || tokens.refresh;

    if (accessToken && refreshToken) {
      cookieService.setAuthCookies(
        { accessToken, refreshToken },
        {},
        email || cookieService.getUserEmail?.() || ""
      );
    }
  }

  static getAccessToken(): string | null {
    // Prefer dedicated helper, fall back to getCookie
    if (typeof cookieService.getAccessToken === "function") {
      return cookieService.getAccessToken();
    }
    return (
      cookieService.getCookie("accessToken") ||
      cookieService.getCookie("access_token") ||
      cookieService.getCookie("token") ||
      null
    );
  }

  static getRefreshToken(): string | null {
    if (typeof cookieService.getRefreshToken === "function") {
      return cookieService.getRefreshToken();
    }
    return (
      cookieService.getCookie("refreshToken") ||
      cookieService.getCookie("refresh_token") ||
      null
    );
  }

  static setUserEmail(email: string): void {
    cookieService.setCookie("user_email", email);
  }

  static getUserEmail(): string | null {
    if (typeof cookieService.getUserEmail === "function") {
      return cookieService.getUserEmail();
    }
    return cookieService.getCookie("user_email");
  }

  static setUser(user: object): void {
    cookieService.setCookie("user", JSON.stringify(user));
  }

  static getUser<T>(): T | null {
    if (typeof cookieService.getUser === "function") {
      return cookieService.getUser<T>();
    }
    const raw = cookieService.getCookie("user");
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  static clearTokens(): void {
    cookieService.clearAuthCookies();
  }

  static isAuthenticated(): boolean {
    if (typeof cookieService.isAuthenticated === "function") {
      return cookieService.isAuthenticated();
    }
    return Boolean(TokenService.getAccessToken());
  }

  static isTokenExpired(token: string): boolean {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp && payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}