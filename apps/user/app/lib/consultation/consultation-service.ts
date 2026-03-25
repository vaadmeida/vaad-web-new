import { apiClient } from "@/app/lib/api/client";

export interface ConsultationRequest {
  email: string;
}

export interface ConsultationResponse {
  _id: string;
  email: string;
  replied: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export class ConsultationService {
  private readonly baseUrl = '/requests';

  // Submit a new consultation request
  async submitConsultation(data: ConsultationRequest): Promise<ConsultationResponse> {
    const response = await apiClient.post<ConsultationResponse>(`${this.baseUrl}/consultations`, data);
    return response;
  }
}

export const consultationService = new ConsultationService();