// app/lib/media/contact-service.ts
import { apiClient } from "@/app/lib/api/client";

export interface ContactRequest {
  name: string;
  email: string;
  message: string;
  phoneNumber?: string;
  companyName?: string;
  location?: string;
  budget?: number;
  preferredTimeToCall?: string;
  interest?: string;
}

export interface ContactResponse {
  _id: string;
  name: string;
  email: string;
  message: string;
  phoneNumber?: string;
  companyName?: string;
  location?: string;
  budget?: number;
  preferredTimeToCall?: string;
  interest?: string;
  status: 'pending' | 'replied' | 'resolved';
  createdAt: string;
  updatedAt: string;
}

export class ContactService {
  private readonly baseUrl = '/contact-us';

  // Submit a new contact message
  async submitContact(data: ContactRequest): Promise<ContactResponse> {
    const response = await apiClient.post<ContactResponse>(`${this.baseUrl}`, data);
    return response;
  }
}

export const contactService = new ContactService();