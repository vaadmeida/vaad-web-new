import { apiClient } from "@/app/lib/api/client";

export interface MediaRequest {
  name: string;
  email: string;
  phoneNumber: string;
  companyName?: string;
  location?: string;
  budget?: number;
  preferredTimeToCall?: string;
  interest?: string;
}

export interface MediaRequestResponse {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  companyName?: string;
  location?: string;
  budget?: number;
  preferredTimeToCall?: string;
  interest?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export class MediaRequestService {
  private readonly baseUrl = '/requests';

  // Submit a new media plan request
  async submitMediaRequest(data: MediaRequest): Promise<MediaRequestResponse> {
    const response = await apiClient.post<MediaRequestResponse>(`${this.baseUrl}/media-plans`, data);
    return response;
  }
}

export const mediaRequestService = new MediaRequestService();