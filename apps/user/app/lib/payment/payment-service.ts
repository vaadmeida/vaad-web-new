import { apiClient } from "@/app/lib/api/client";

export interface PaymentOrderItemInput {
  durationInMonths: number;
  billboardId: string;
  startDate: string; // YYYY-MM-DD
}

export interface InitializePaymentRequest {
  orderItems: PaymentOrderItemInput[];
}

export interface OrderItem {
  billboard: string;
  startDate: string;
  durationInMonths: number;
  _id: string;
}

export interface InitializePaymentResponse {
  userId: string;
  orderItems: OrderItem[];
  status: string;
  _id: string;
  reference: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
  authorizationUrl?: string;
  paymentUrl?: string;
}

export class PaymentService {
  private readonly basePath = "/orders";

  async initializePayment(
    data: InitializePaymentRequest
  ): Promise<InitializePaymentResponse> {
    return apiClient.post<InitializePaymentResponse>(
      `${this.basePath}/initiate-payments`,
      data
    );
  }

  async getOrderByReference(
    reference: string
  ): Promise<InitializePaymentResponse> {
    return apiClient.get<InitializePaymentResponse>(
      `${this.basePath}/reference/${reference}`
    );
  }
}

export const paymentService = new PaymentService();