/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Tokens {
  // Support both naming conventions
  accessToken?: string;
  refreshToken?: string;
  access?: string;
  refresh?: string;
}

export class TokenService {
  private static readonly ACCESS_TOKEN_KEY = "vaad_access_token";
  private static readonly REFRESH_TOKEN_KEY = "vaad_refresh_token";

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

  static clearTokens(): void {
    if (typeof window === "undefined") return;

    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  static isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}
