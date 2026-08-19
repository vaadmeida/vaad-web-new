// app/lib/cookies/cookie-service.ts
import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import { GetServerSidePropsContext } from 'next';

export interface CookieOptions {
  maxAge?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  httpOnly?: boolean;
}

export class CookieService {
  private static defaultOptions: CookieOptions = {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  };

  // Set a cookie
  static setCookie(
    key: string,
    value: string | object,
    options?: CookieOptions,
    context?: GetServerSidePropsContext
  ): void {
    const stringValue = typeof value === 'object' ? JSON.stringify(value) : value;
    setCookie(key, stringValue, { 
      ...this.defaultOptions, 
      ...options,
      ...(context || {})
    });
  }

  // Get a cookie
  static getCookie(
    key: string,
    context?: GetServerSidePropsContext
  ): string | null {
    const value = getCookie(key, context || {});
    return value?.toString() || null;
  }

  // Get JSON cookie
  static getJsonCookie<T>(
    key: string,
    context?: GetServerSidePropsContext
  ): T | null {
    const value = this.getCookie(key, context);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }

  // Delete a cookie
  static deleteCookie(
    key: string,
    options?: CookieOptions,
    context?: GetServerSidePropsContext
  ): void {
    deleteCookie(key, { 
      ...this.defaultOptions, 
      ...options,
      ...(context || {})
    });
  }

  // Set authentication cookies
  static setAuthCookies(
    tokens: { accessToken: string; refreshToken: string },
    user: object,
    email: string
  ): void {
    this.setCookie('access_token', tokens.accessToken, {
      maxAge: 15 * 60, // 15 minutes
    });
    this.setCookie('refresh_token', tokens.refreshToken, {
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });
    this.setCookie('user', JSON.stringify(user), {
      maxAge: 7 * 24 * 60 * 60,
    });
    this.setCookie('user_email', email, {
      maxAge: 7 * 24 * 60 * 60,
    });
  }

  // Clear authentication cookies
  static clearAuthCookies(): void {
    this.deleteCookie('access_token');
    this.deleteCookie('refresh_token');
    this.deleteCookie('user');
    this.deleteCookie('user_email');
  }

  // Get access token
  static getAccessToken(context?: GetServerSidePropsContext): string | null {
    return this.getCookie('access_token', context);
  }

  // Get refresh token
  static getRefreshToken(): string | null {
  return this.getCookie("refreshToken") || this.getCookie("refresh_token") || null;
}

  // Get user from cookie
  static getUser<T>(context?: GetServerSidePropsContext): T | null {
    return this.getJsonCookie<T>('user', context);
  }

  // Get user email
  static getUserEmail(context?: GetServerSidePropsContext): string | null {
    return this.getCookie('user_email', context);
  }

  // Check if user is authenticated
  static isAuthenticated(context?: GetServerSidePropsContext): boolean {
    return !!this.getAccessToken(context);
  }

  // Decode JWT token to check expiration
  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp && payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}

export const cookieService = CookieService;