/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/app/lib/api/client";
import { Tokens } from "./token-service";

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
    return apiClient.post("/auth/users/sign-up", data);
  }

  // ------------------------------
  // 🔑 LOGIN
  // ------------------------------
  async login(data: LoginRequest): Promise<LoginResponse> {
    return apiClient.post("/auth/users/login", data);
  }

  // ------------------------------
  // 🔁 GENERATE TOKENS (VERIFY)
  // ------------------------------
  async generateTokens(
    data: GenerateTokensRequest,
  ): Promise<GenerateTokensResponse> {
    return apiClient.post("/auth/users/generate-tokens", data);
  }

  // ------------------------------
  // 📧 VERIFY EMAIL
  // ------------------------------
  async verifyEmail(token: string): Promise<{ message: string }> {
    return apiClient.post("/auth/users/verify-email", { token });
  }

  // ------------------------------
  // 🔒 PASSWORD RESET
  // ------------------------------
  async forgotPassword(data: ForgotPasswordRequest) {
    return apiClient.post("/auth/users/forget-password", data);
  }

  async resetPassword(data: ResetPasswordRequest) {
    return apiClient.post("/auth/users/reset-password", data);
  }

  // ------------------------------
  // 👤 CURRENT USER
  // ------------------------------
  async getCurrentUser(): Promise<Profile> {
    return apiClient.get("/auth/users/me");
  }

  // ------------------------------
  // 🚪 LOGOUT
  // ------------------------------
  async logout(): Promise<void> {
    try {
      // Optional: backend invalidation
      // await apiClient.post("/auth/users/logout");
    } finally {
      // Keep side effects OUTSIDE ideally
    }
  }
}

export const authService = new AuthService();