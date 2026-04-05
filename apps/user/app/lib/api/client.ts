/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
} from "axios";
import { env } from "@/app/config/env";
import { TokenService } from "../auth/token-service";
import { cookieService } from "../cookies/cookie-service";

type FailedRequest = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

export class ApiClient {
  private static instance: ApiClient;

  private api: AxiosInstance;
  private refreshClient: AxiosInstance;

  private isRefreshing = false;
  private failedQueue: FailedRequest[] = [];

  private constructor() {
    this.api = axios.create({
      baseURL: env.apiUrl,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // ✅ Cookies will be sent automatically
    });

    // Separate client for refresh (NO interceptors)
    this.refreshClient = axios.create({
      baseURL: env.apiUrl,
      timeout: 30000,
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  // =============================
  // 🔐 INTERCEPTORS
  // =============================
  private setupInterceptors() {
    // ✅ REMOVED manual Authorization header - cookies handle it automatically
    this.api.interceptors.request.use(
      (config) => {
        // No need to manually add Authorization header
        // Cookies are sent automatically with withCredentials: true
        return config;
      },
      (error) => Promise.reject(this.normalizeError(error)),
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean;
        };

        const status = error.response?.status;

        // Only handle 401
        if (status === 401 && !originalRequest?._retry) {
          const refreshToken = TokenService.getRefreshToken();

          if (!refreshToken) {
            this.handleAuthFailure();
            return Promise.reject(this.normalizeError(error));
          }

          // If already refreshing → queue request
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({
                resolve: (token: string) => {
                  // No need to set Authorization header
                  resolve(this.api(originalRequest));
                },
                reject,
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const newTokens = await this.refreshTokens();

            TokenService.setTokens(newTokens);

            // Process queued requests
            this.processQueue(null, newTokens.access);

            // Retry original request (cookies will be sent automatically)
            return this.api(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError, null);
            this.handleAuthFailure();
            return Promise.reject(this.normalizeError(refreshError));
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(this.normalizeError(error));
      },
    );
  }

  // =============================
  // 🔁 TOKEN REFRESH
  // =============================
  private async refreshTokens(): Promise<{
    access: string;
    refresh: string;
  }> {
    const refreshToken = TokenService.getRefreshToken();

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    // Get user email from cookie
    const userEmail = cookieService.getUserEmail() || TokenService.getUserEmail();

    const { data } = await this.refreshClient.post(
      "/auth/users/generate-tokens",
      { 
        email: userEmail,
        token: refreshToken 
      },
    );

    return {
      access: data.accessToken || data.access,
      refresh: data.refreshToken || data.refresh,
    };
  }

  private processQueue(error: unknown, token: string | null) {
    this.failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else if (token) {
        promise.resolve(token);
      }
    });

    this.failedQueue = [];
  }

  // =============================
  // 🚨 AUTH FAILURE HANDLER
  // =============================
  private handleAuthFailure() {
    TokenService.clearTokens();

    // Redirect to login only on client side
    if (typeof window !== "undefined") {
      if (!window.location.pathname.includes('/auth/login')) {
        window.location.href = "/auth/login";
      }
    }
  }

  // =============================
  // ⚠️ ERROR NORMALIZATION
  // =============================
  private normalizeError(error: unknown) {
    const axiosError = error as AxiosError<any>;

    return {
      message:
        axiosError?.response?.data?.message ||
        axiosError?.message ||
        "Something went wrong",
      status: axiosError?.response?.status || 500,
      data: axiosError?.response?.data || null,
    };
  }

  // =============================
  // 🌐 HTTP METHODS
  // =============================
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.api.get<T>(url, config);
    return res.data;
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const res = await this.api.post<T>(url, data, config);
    return res.data;
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const res = await this.api.put<T>(url, data, config);
    return res.data;
  }

  async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const res = await this.api.patch<T>(url, data, config);
    return res.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.api.delete<T>(url, config);
    return res.data;
  }
}

export const apiClient = ApiClient.getInstance();