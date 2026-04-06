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
      withCredentials: true, // ✅ CRITICAL: Sends cookies automatically
    });

    // Separate client for refresh (NO interceptors to avoid loops)
    this.refreshClient = axios.create({
      baseURL: env.apiUrl,
      timeout: 30000,
      withCredentials: true, // ✅ Also send cookies for refresh
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
    // ✅ NO request interceptor needed for cookies - browser handles automatically
    this.api.interceptors.request.use(
      (config) => {
        // Important: Don't set Content-Type for FormData (let axios set it with boundary)
        if (config.data instanceof FormData) {
          delete config.headers['Content-Type'];
        }
        return config;
      },
      (error) => Promise.reject(this.normalizeError(error)),
    );

    // Response interceptor - Handle 401 with refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean;
        };

        const status = error.response?.status;

        // Only handle 401 and not a retry
        if (status === 401 && !originalRequest?._retry) {
          // If already refreshing, queue this request
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({
                resolve: () => {
                  // Just retry - cookies will be sent automatically
                  resolve(this.api(originalRequest));
                },
                reject,
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            // Call refresh endpoint - cookies are sent automatically
            await this.refreshTokens();

            // Process queued requests
            this.processQueue(null);

            // Retry original request - cookies now have new tokens
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
      },
    );
  }

  // =============================
  // 🔁 TOKEN REFRESH
  // =============================
  private async refreshTokens(): Promise<void> {
    try {
      // Cookies are sent automatically with withCredentials: true
      // Backend reads the refresh token from cookie and returns new access token as cookie
      await this.refreshClient.post("/auth/users/refresh-tokens");
      
      console.log("Tokens refreshed successfully");
    } catch (error) {
      console.error("Token refresh failed:", error);
      throw error;
    }
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
    // Clear all auth cookies
    cookieService.clearAuthCookies();
    
    if (typeof window !== "undefined") {
      if (!window.location.pathname.includes("/login") && 
          !window.location.pathname.includes("/signup")) {
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

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import axios, {
//   AxiosError,
//   AxiosInstance,
//   AxiosRequestConfig,
//   InternalAxiosRequestConfig,
// } from "axios";
// import { env } from "@/app/config/env";
// import { TokenService } from "../auth/token-service";

// type FailedRequest = {
//   resolve: (token: string) => void;
//   reject: (error: unknown) => void;
// };

// export class ApiClient {
//   private static instance: ApiClient;

//   private api: AxiosInstance;
//   private refreshClient: AxiosInstance;

//   private isRefreshing = false;
//   private failedQueue: FailedRequest[] = [];

//   private constructor() {
//     this.api = axios.create({
//       baseURL: env.apiUrl,
//       timeout: 30000,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     // Separate client for refresh (NO interceptors)
//     this.refreshClient = axios.create({
//       baseURL: env.apiUrl,
//       timeout: 30000,
//     });

//     this.setupInterceptors();
//   }

//   static getInstance(): ApiClient {
//     if (!ApiClient.instance) {
//       ApiClient.instance = new ApiClient();
//     }
//     return ApiClient.instance;
//   }

//   // =============================
//   // 🔐 INTERCEPTORS
//   // =============================
//   private setupInterceptors() {
//     // Request interceptor
//     this.api.interceptors.request.use(
//       (config: InternalAxiosRequestConfig) => {
//         const token = TokenService.getAccessToken();

//         if (token && config.headers) {
//           config.headers.Authorization = `Bearer ${token}`;
//         }

//         // Important: Don't set Content-Type for FormData (let axios set it with boundary)
//         if (config.data instanceof FormData) {
//           delete config.headers['Content-Type'];
//         }

//         return config;
//       },
//       (error) => Promise.reject(this.normalizeError(error)),
//     );

//     // Response interceptor
//     this.api.interceptors.response.use(
//       (response) => response,
//       async (error: AxiosError) => {
//         const originalRequest = error.config as AxiosRequestConfig & {
//           _retry?: boolean;
//         };

//         const status = error.response?.status;

//         // Only handle 401
//         if (status === 401 && !originalRequest?._retry) {
//           const refreshToken = TokenService.getRefreshToken();

//           if (!refreshToken) {
//             return Promise.reject(this.normalizeError(error));
//           }

//           // If already refreshing → queue request
//           if (this.isRefreshing) {
//             return new Promise((resolve, reject) => {
//               this.failedQueue.push({
//                 resolve: (token: string) => {
//                   if (originalRequest.headers) {
//                     originalRequest.headers.Authorization = `Bearer ${token}`;
//                   }
//                   resolve(this.api(originalRequest));
//                 },
//                 reject,
//               });
//             });
//           }

//           originalRequest._retry = true;
//           this.isRefreshing = true;

//           try {
//             const newTokens = await this.refreshTokens();

//             TokenService.setTokens(newTokens);

//             // Process queued requests
//             this.processQueue(null, newTokens.access);

//             // Retry original request
//             if (originalRequest.headers) {
//               originalRequest.headers.Authorization = `Bearer ${newTokens.access}`;
//             }

//             return this.api(originalRequest);
//           } catch (refreshError) {
//             this.processQueue(refreshError, null);
//             return Promise.reject(this.normalizeError(refreshError));
//           } finally {
//             this.isRefreshing = false;
//           }
//         }

//         return Promise.reject(this.normalizeError(error));
//       },
//     );
//   }

//   // =============================
//   // 🔁 TOKEN REFRESH
//   // =============================
//   private async refreshTokens(): Promise<{
//     access: string;
//     refresh: string;
//   }> {
//     const refreshToken = TokenService.getRefreshToken();

//     if (!refreshToken) {
//       throw new Error("No refresh token available");
//     }

//     const userEmail = TokenService.getUserEmail();

//     const { data } = await this.refreshClient.post(
//       "/auth/admins/generate-tokens",
//       { 
//         email: userEmail,
//         token: refreshToken 
//       },
//     );

//     return {
//       access: data.accessToken || data.access,
//       refresh: data.refreshToken || data.refresh,
//     };
//   }

//   private processQueue(error: unknown, token: string | null) {
//     this.failedQueue.forEach((promise) => {
//       if (error) {
//         promise.reject(error);
//       } else if (token) {
//         promise.resolve(token);
//       }
//     });

//     this.failedQueue = [];
//   }

//   // =============================
//   // ⚠️ ERROR NORMALIZATION
//   // =============================
//   private normalizeError(error: unknown) {
//     const axiosError = error as AxiosError<any>;

//     return {
//       message:
//         axiosError?.response?.data?.message ||
//         axiosError?.message ||
//         "Something went wrong",
//       status: axiosError?.response?.status || 500,
//       data: axiosError?.response?.data || null,
//     };
//   }

//   // =============================
//   // 🌐 HTTP METHODS
//   // =============================
//   async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
//     const res = await this.api.get<T>(url, config);
//     return res.data;
//   }

//   async post<T>(
//     url: string,
//     data?: unknown,
//     config?: AxiosRequestConfig,
//   ): Promise<T> {
//     const res = await this.api.post<T>(url, data, config);
//     return res.data;
//   }

//   async put<T>(
//     url: string,
//     data?: unknown,
//     config?: AxiosRequestConfig,
//   ): Promise<T> {
//     const res = await this.api.put<T>(url, data, config);
//     return res.data;
//   }

//   async patch<T>(
//     url: string,
//     data?: unknown,
//     config?: AxiosRequestConfig,
//   ): Promise<T> {
//     const res = await this.api.patch<T>(url, data, config);
//     return res.data;
//   }

//   async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
//     const res = await this.api.delete<T>(url, config);
//     return res.data;
//   }
// }

// export const apiClient = ApiClient.getInstance();