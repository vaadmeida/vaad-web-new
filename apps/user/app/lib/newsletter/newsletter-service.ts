import { apiClient } from "@/app/lib/api/client";

export interface NewsletterJoinRequest {
  email: string;
}

export interface NewsletterLeaveRequest {
  email: string;
}

export interface NewsletterResponse {
  _id?: string;
  email: string;
  subscribed: boolean;
  message?: string;
  createdAt?: string;
  updatedAt?: string;
}

export class NewsletterService {
  private readonly baseUrl = '/newsletters';

  // Join newsletter
  async joinNewsletter(email: string): Promise<NewsletterResponse> {
    const response = await apiClient.post<NewsletterResponse>(`${this.baseUrl}/join`, { email });
    return response;
  }

  // Leave/unsubscribe from newsletter
  async leaveNewsletter(email: string): Promise<NewsletterResponse> {
    const response = await apiClient.post<NewsletterResponse>(`${this.baseUrl}/leave`, { email });
    return response;
  }
}

export const newsletterService = new NewsletterService();