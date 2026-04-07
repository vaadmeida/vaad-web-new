/* eslint-disable @typescript-eslint/no-explicit-any */
// app/lib/auth/token-service.ts
import { cookieService } from '@/app/lib/cookies/cookie-service';
import { GetServerSidePropsContext } from 'next';

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

    // Handle different possible formats
    const accessToken = tokens.accessToken || tokens.access;
    const refreshToken = tokens.refreshToken || tokens.refresh;

    if (accessToken && refreshToken) {
      cookieService.setAuthCookies(
        { accessToken, refreshToken },
        {},
        email || cookieService.getUserEmail() || ''
      );
    }
  }

  static getAccessToken(context?: GetServerSidePropsContext): string | null {
    return cookieService.getAccessToken(context);
  }

  static getRefreshToken(context?: GetServerSidePropsContext): string | null {
    return cookieService.getRefreshToken(context);
  }

  static setUserEmail(email: string): void {
    cookieService.setCookie('user_email', email);
  }

  static getUserEmail(context?: GetServerSidePropsContext): string | null {
    return cookieService.getUserEmail(context);
  }

  static setUser(user: object): void {
    cookieService.setCookie('user', JSON.stringify(user));
  }

  static getUser<T>(context?: GetServerSidePropsContext): T | null {
    return cookieService.getUser<T>(context);
  }

  static clearTokens(): void {
    cookieService.clearAuthCookies();
  }

  static isAuthenticated(context?: GetServerSidePropsContext): boolean {
    return cookieService.isAuthenticated(context);
  }

  static isTokenExpired(token: string): boolean {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp && payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}