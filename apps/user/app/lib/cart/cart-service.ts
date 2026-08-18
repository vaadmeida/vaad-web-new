// app/lib/services/cart-service.ts
import { apiClient } from "@/app/lib/api/client";

export interface CartItem {
  _id: string;
  userId: string;
  billboardId: string;
  billboard?: {
    _id: string;
    mediaType: string;
    locationAddress: string;
    city?: string;
    state?: string;
    rate: number;
    photos?: string[];
    images?: string[];
    height?: number;
    width?: number;
    description?: string;
  };
  durationInMonths: number;
  startDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddToCartRequest {
  billboardId: string;
  durationInMonths: number;
  startDate: string | Date;
}

export interface UpdateCartItemRequest {
  durationInMonths?: number;
  startDate?: string;
}

export interface UpdateCartItemPayload {
  durationInMonths: number;
  billboardId: string;
  startDate: string;
}

export interface CartResponse {
  carts: CartItem[];
}

export class CartService {
  private readonly baseUrl = '/carts';

  private normalizeStartDate(value: string | Date | undefined | null): string {
    if (!value) {
      const today = new Date();
      return this.formatDateAsYYYYMMDD(today);
    }

    if (value instanceof Date) {
      return this.formatDateAsYYYYMMDD(value);
    }

    const trimmed = String(value).trim();
    if (!trimmed) {
      const today = new Date();
      return this.formatDateAsYYYYMMDD(today);
    }

    // If it's already in YYYY-MM-DD format, return as-is
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (dateRegex.test(trimmed)) {
      return trimmed;
    }

    // Try to parse as a date
    const parsed = new Date(trimmed);
    if (!Number.isNaN(parsed.getTime())) {
      return this.formatDateAsYYYYMMDD(parsed);
    }

    // Fallback to today if invalid
    const today = new Date();
    return this.formatDateAsYYYYMMDD(today);
  }

  private formatDateAsYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private normalizeCartItem(item: CartItem): CartItem {
    const rawBillboardId = item.billboardId as unknown;
    const normalizedBillboardId =
      (typeof rawBillboardId === "string" && rawBillboardId) ||
      (typeof rawBillboardId === "object" &&
      rawBillboardId !== null &&
      "_id" in rawBillboardId &&
      typeof rawBillboardId._id === "string"
        ? rawBillboardId._id
        : "") ||
      item.billboard?._id ||
      "";

    return {
      ...item,
      billboardId: normalizedBillboardId,
      startDate: this.normalizeStartDate(item.startDate),
    };
  }

  // Get all cart items
  async getCart(): Promise<CartItem[]> {
    const response = await apiClient.get<CartResponse>(this.baseUrl);
    return (response.carts || []).map((item) => this.normalizeCartItem(item));
  }

  // Add item to cart
  async addToCart(data: AddToCartRequest): Promise<CartItem> {
    if (!data.billboardId || !data.billboardId.trim()) {
      throw new Error("Billboard ID is required");
    }

    if (!Number.isFinite(data.durationInMonths) || data.durationInMonths < 1) {
      throw new Error("Duration in months must be at least 1");
    }

    const normalizedDate = this.normalizeStartDate(data.startDate);
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(normalizedDate)) {
      throw new Error(`Invalid date format: ${normalizedDate}. Expected YYYY-MM-DD`);
    }

    const payload = {
      billboardId: data.billboardId.trim(),
      durationInMonths: Number(data.durationInMonths),
      startDate: normalizedDate,
    };

    console.debug("Add to cart payload:", payload);
    const response = await apiClient.post<CartItem>(this.baseUrl, payload);
    return this.normalizeCartItem(response);
  }

  // Update cart item
  async updateCartItem(
    id: string,
    data: UpdateCartItemPayload,
  ): Promise<CartItem> {
    const response = await apiClient.patch<CartItem>(`${this.baseUrl}/${id}`, {
      durationInMonths: Number(data.durationInMonths),
      billboardId: data.billboardId,
      startDate: this.normalizeStartDate(data.startDate),
    });
    return this.normalizeCartItem(response);
  }

  // Remove item from cart
  async removeFromCart(
    id: string,
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`${this.baseUrl}/${id}`);
    return response;
  }

  // Clear entire cart
  async clearCart(): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{ success: boolean; message: string }>(this.baseUrl);
    return response;
  }

  // Calculate item total
  calculateItemTotal(rate: number, durationInMonths: number): number {
    return rate * durationInMonths;
  }

  // Format date for display
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}

export const cartService = new CartService();
