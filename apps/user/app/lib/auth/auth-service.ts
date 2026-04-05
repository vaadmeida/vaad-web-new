/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/app/lib/api/client";
import { Tokens } from "./token-service";
import { cookieService } from "@/app/lib/cookies/cookie-service";

// ==============================
// 📦 TYPES
// ==============================
export interface Profile {
  _id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  [key: string]: any;
}

export interface AuthResponse {
  status: string;
  data: {
    profile: Profile;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

export interface SignUpRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  termsAndCondition: boolean;
}

export interface SignUpResponse {
  status: string;
  data: {
    profile: Profile;
    token: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  data: {
    profile: Profile;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

export interface GenerateTokensRequest {
  email: string;
  token: string;
}

export interface GenerateTokensResponse {
  status?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
  };
  accessToken?: string;
  refreshToken?: string;
  access?: string;
  refresh?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  password: string;
}

// ==============================
// 🔐 AUTH SERVICE
// ==============================
export class AuthService {
  // ------------------------------
  // 📝 SIGN UP
  // ------------------------------
  async signUp(data: SignUpRequest): Promise<SignUpResponse> {
    return apiClient.post<SignUpResponse>("/auth/users/sign-up", data);
  }

  // ------------------------------
  // 🔑 LOGIN
  // ------------------------------
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>("/auth/users/login", data);
    
    // Store tokens and user info in cookies using the new response structure
    if (response?.data?.tokens) {
      cookieService.setAuthCookies(
        {
          accessToken: response.data.tokens.accessToken,
          refreshToken: response.data.tokens.refreshToken,
        },
        response.data.profile,
        data.email
      );
    }
    
    return response;
  }

  // ------------------------------
  // 🔁 GENERATE TOKENS (VERIFY)
  // ------------------------------
  async generateTokens(
    data: GenerateTokensRequest,
  ): Promise<GenerateTokensResponse> {
    const response = await apiClient.post<GenerateTokensResponse>("/auth/users/generate-tokens", data);
    
    // Update tokens in cookies
    // Handle both possible response structures
    const accessToken = response?.data?.accessToken || response?.accessToken || (response as any)?.access;
    const refreshToken = response?.data?.refreshToken || response?.refreshToken || (response as any)?.refresh;
    
    if (accessToken && refreshToken) {
      cookieService.setAuthCookies(
        { accessToken, refreshToken },
        {},
        data.email
      );
    }
    
    return response;
  }

  // ------------------------------
  // 📧 VERIFY EMAIL
  // ------------------------------
  async verifyEmail(token: string): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>("/auth/users/verify-email", { token });
  }

  // ------------------------------
  // 🔒 PASSWORD RESET
  // ------------------------------
  async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>("/auth/users/forget-password", data);
  }

  async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>("/auth/users/reset-password", data);
  }

  // ------------------------------
  // 👤 CURRENT USER
  // ------------------------------
  async getCurrentUser(): Promise<Profile> {
    // First try to get from cookies
    const userFromCookie = cookieService.getUser<Profile>();
    if (userFromCookie) return userFromCookie;
    
    // If not in cookies, fetch from API
    const response = await apiClient.get<{ status: string; data: { profile: Profile } }>("/auth/users/me");
    
    // Handle response structure
    const profile = response?.data?.profile || response as any;
    
    // Store in cookie for future use
    if (profile && profile._id) {
      cookieService.setCookie('user', JSON.stringify(profile));
    }
    
    return profile;
  }

  // ------------------------------
  // 🚪 LOGOUT
  // ------------------------------
  async logout(): Promise<void> {
    try {
      // Optional: backend invalidation
      // await apiClient.post("/auth/users/logout");
    } finally {
      // Clear all auth cookies
      cookieService.clearAuthCookies();
    }
  }
}

export const authService = new AuthService();