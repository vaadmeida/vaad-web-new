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
  user: Profile;
  tokens: Tokens;
}

export interface SignUpRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  termsAndCondition: boolean;
}

export interface SignUpResponse {
  profile: Profile;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  profile: {
    _id: string;
    email: string;
    __v: number;
    createdAt: string;
    deletedAt: string | null;
    fullName: string;
    phoneNumber: string;
    status: string;
    updatedAt: string;
  };
  token: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface GenerateTokensRequest {
  email: string;
  token: string;
}

export interface GenerateTokensResponse extends Tokens {}

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
    
    // Store tokens and user info in cookies
    if (response?.token) {
      cookieService.setAuthCookies(
        {
          accessToken: response.token.accessToken,
          refreshToken: response.token.refreshToken,
        },
        response.profile,
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
    if (response) {
      const accessToken = (response as any).accessToken || (response as any).access;
      const refreshToken = (response as any).refreshToken || (response as any).refresh;
      
      if (accessToken && refreshToken) {
        cookieService.setAuthCookies(
          { accessToken, refreshToken },
          {},
          data.email
        );
      }
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
  async forgotPassword(data: ForgotPasswordRequest): Promise<any> {
    return apiClient.post("/auth/users/forget-password", data);
  }

  async resetPassword(data: ResetPasswordRequest): Promise<any> {
    return apiClient.post("/auth/users/reset-password", data);
  }

  // ------------------------------
  // 👤 CURRENT USER
  // ------------------------------
  async getCurrentUser(): Promise<Profile> {
    // First try to get from cookies
    const userFromCookie = cookieService.getUser<Profile>();
    if (userFromCookie) return userFromCookie;
    
    // If not in cookies, fetch from API
    const user = await apiClient.get<Profile>("/auth/users/me");
    
    // Store in cookie for future use
    if (user) {
      cookieService.setCookie('user', JSON.stringify(user));
    }
    
    return user;
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