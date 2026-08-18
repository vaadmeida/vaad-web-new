/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
} from "axios";
import { env } from "@/app/config/env";
import { cookieService } from "../cookies/cookie-service";

type FailedRequest = {
  resolve: () => void;
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
      withCredentials: true,
    });

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
    // Request interceptor – attach Bearer token + fix FormData
    this.api.interceptors.request.use(
      (config) => {
        const accessToken =
          cookieService.getCookie("accessToken") ||
          cookieService.getCookie("access_token") ||
          cookieService.getCookie("token");

        if (accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }

        if (config.data instanceof FormData) {
          delete config.headers["Content-Type"];
        }

        return config;
      },
      (error) => Promise.reject(this.normalizeError(error))
    );

    // Response interceptor – handle 401 with refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean;
        };

        const status = error.response?.status;

        if (status === 401 && !originalRequest?._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({
                resolve: () => resolve(this.api(originalRequest)),
                reject,
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            await this.refreshTokens();
            this.processQueue(null);
            return this.api(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError);
            this.handleAuthFailure();
            return Promise.reject(this.normalizeError(refreshError));
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(this.normalizeError(error));
      }
    );
  }

  // =============================
  // 🔁 TOKEN REFRESH
  // =============================
  private async refreshTokens(): Promise<void> {
    const refreshToken =
      cookieService.getCookie("refreshToken") ||
      cookieService.getCookie("refresh_token");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    await this.refreshClient.post("/auth/admins/refresh-tokens", {
      refreshToken,
    });
  }

  private processQueue(error: unknown) {
    this.failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve();
      }
    });
    this.failedQueue = [];
  }

  private handleAuthFailure() {
    cookieService.clearAuthCookies();

    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      if (!path.includes("/login") && !path.includes("/signup")) {
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
    config?: AxiosRequestConfig
  ): Promise<T> {
    const res = await this.api.post<T>(url, data, config);
    return res.data;
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const res = await this.api.put<T>(url, data, config);
    return res.data;
  }

  async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
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