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

export interface CartResponse {
  carts: CartItem[];
}

export class CartService {
  private readonly baseUrl = '/carts';

  // Get all cart items
  async getCart(): Promise<CartItem[]> {
    const response = await apiClient.get<CartResponse>(this.baseUrl);
    return response.carts || [];
  }

  // Add item to cart
  async addToCart(data: AddToCartRequest): Promise<CartItem> {
    const payload = {
      billboardId: data.billboardId,
      durationInMonths: data.durationInMonths,
      startDate: data.startDate instanceof Date ? data.startDate.toISOString() : data.startDate,
    };
    const response = await apiClient.post<CartItem>(this.baseUrl, payload);
    return response;
  }

  // Update cart item
  async updateCartItem(id: string, data: UpdateCartItemRequest): Promise<CartItem> {
    const response = await apiClient.patch<CartItem>(`${this.baseUrl}/${id}`, data);
    return response;
  }

  // Remove item from cart
  async removeFromCart(id: string): Promise<{ success: boolean; message: string }> {
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