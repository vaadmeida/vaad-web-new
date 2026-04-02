/* eslint-disable @typescript-eslint/no-explicit-any */
// app/lib/auth/token-service.ts
export interface Tokens {
  // Support both naming conventions
  accessToken?: string;
  refreshToken?: string;
  access?: string;
  refresh?: string;
  [key: string]: any;
}

export class TokenService {
  private static ACCESS_TOKEN_KEY = "vaad_access_token";
  private static REFRESH_TOKEN_KEY = "vaad_refresh_token";
  private static USER_EMAIL_KEY = "vaad_user_email";

  static setTokens(tokens: any): void {
    if (typeof window === "undefined") return;

    // Handle different possible formats
    const accessToken = tokens.accessToken || tokens.access;
    const refreshToken = tokens.refreshToken || tokens.refresh;

    if (accessToken) {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    }

    if (refreshToken) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  static getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static setUserEmail(email: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem(this.USER_EMAIL_KEY, email);
  }

  static getUserEmail(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(this.USER_EMAIL_KEY);
  }

  static clearTokens() {
    if (typeof window === "undefined") return;

    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_EMAIL_KEY);
    localStorage.removeItem("vaad_user");
  }

  static isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;

    const token = this.getAccessToken();
    if (!token) return false;

    // Check if token is expired by decoding JWT
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const isExpired = payload.exp && payload.exp * 1000 < Date.now();

      // If token is expired, clear it
      if (isExpired) {
        this.clearTokens();
        return false;
      }

      return true;
    } catch {
      // Invalid token format
      this.clearTokens();
      return false;
    }
  }
}
