import { apiClient } from "@/app/lib/api/client";

export interface OrderItemPayload {
  billboardId: string;
  durationInMonths: number;
  startDate: string;
}

export interface PaymentInitializeRequest {
  orderItems: OrderItemPayload[];
}

export interface PaymentInitializationResult {
  provider: string;
  gateway: string;
  reference?: string;
  accessCode?: string;
  redirectUrl?: string;
  amount?: number;
  currency?: string;
  email?: string;
  key?: string;
  message?: string;
  raw?: Record<string, unknown>;
  data?: Record<string, unknown>;
}

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: {
        key: string;
        email: string;
        amount: number;
        currency?: string;
        ref?: string;
        channels?: string[];
        callback?: () => void;
        onClose?: () => void;
      }) => {
        openIframe: () => void;
      };
    };
  }
}

export class PaymentService {
  private readonly baseUrl = "/orders";

  private coerceString(value: unknown): string | undefined {
    if (typeof value === "string") {
      return value.trim() || undefined;
    }

    if (typeof value === "number") {
      return String(value);
    }

    return undefined;
  }

  private coerceNumber(value: unknown): number | undefined {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string") {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : undefined;
    }

    return undefined;
  }

  private findNestedValue(source: Record<string, unknown> | undefined, keys: string[]): unknown {
    if (!source) return undefined;

    for (const key of keys) {
      const directValue = source[key];
      if (directValue !== undefined && directValue !== null) {
        return directValue;
      }

      const nested = this.findDeep(source, key);
      if (nested !== undefined) {
        return nested;
      }
    }

    return undefined;
  }

  private findDeep(node: unknown, targetKey: string): unknown {
    if (!node || typeof node !== "object") return undefined;

    const record = node as Record<string, unknown>;

    for (const [key, value] of Object.entries(record)) {
      if (key === targetKey && value !== undefined && value !== null) {
        return value;
      }

      if (value && typeof value === "object") {
        const nestedValue = this.findDeep(value, targetKey);
        if (nestedValue !== undefined) {
          return nestedValue;
        }
      }
    }

    return undefined;
  }

  private normalizeResponse(response: any): PaymentInitializationResult {
    const payload = response?.data ?? response ?? {};
    const nestedPayload = payload?.data && typeof payload.data === "object" ? payload.data : payload;

    const provider = this.coerceString(
      this.findNestedValue(nestedPayload, [
        "gateway",
        "provider",
        "paymentGateway",
        "paymentMethod",
        "paymentType",
        "type",
      ])
    )?.toLowerCase() ?? "unknown";

    const redirectUrl =
      this.coerceString(
        this.findNestedValue(nestedPayload, [
          "authorization_url",
          "authorizationUrl",
          "authorizationURL",
          "redirectUrl",
          "checkoutUrl",
          "paymentUrl",
          "url",
          "link",
        ])
      ) ??
      this.coerceString(
        this.findNestedValue((nestedPayload as Record<string, unknown>) ?? {}, [
          "data.authorization_url",
          "data.authorizationUrl",
          "data.redirectUrl",
          "data.checkoutUrl",
          "data.paymentUrl",
        ])
      );

    const reference =
      this.coerceString(
        this.findNestedValue(nestedPayload, [
          "reference",
          "trxref",
          "transactionReference",
          "paymentReference",
          "transactionRef",
        ])
      ) ??
      this.coerceString(this.findNestedValue(nestedPayload, ["data.reference", "data.trxref"]));

    const accessCode =
      this.coerceString(
        this.findNestedValue(nestedPayload, [
          "access_code",
          "accessCode",
          "code",
          "paymentCode",
        ])
      ) ??
      this.coerceString(this.findNestedValue(nestedPayload, ["data.access_code", "data.accessCode"]));

    const amount =
      this.coerceNumber(
        this.findNestedValue(nestedPayload, ["amount", "totalAmount", "amountDue", "total"])
      ) ??
      this.coerceNumber(this.findNestedValue(nestedPayload, ["data.amount", "data.total"]));

    const currency =
      this.coerceString(
        this.findNestedValue(nestedPayload, ["currency", "currencyCode"])
      ) ??
      this.coerceString(this.findNestedValue(nestedPayload, ["data.currency"]));

    const email =
      this.coerceString(
        this.findNestedValue(nestedPayload, ["email", "customerEmail"])
      ) ??
      this.coerceString(this.findNestedValue(nestedPayload, ["data.email"]));

    const key =
      this.coerceString(
        this.findNestedValue(nestedPayload, [
          "publicKey",
          "public_key",
          "paystackKey",
          "key",
          "apiKey",
          "paymentKey",
        ])
      ) ??
      this.coerceString(this.findNestedValue(nestedPayload, ["data.publicKey", "data.key", "data.paystackKey", "data.apiKey"]));

    const message =
      this.coerceString(
        this.findNestedValue(nestedPayload, ["message", "statusMessage", "error"])
      ) ??
      "Unable to initialize payment";

    return {
      provider,
      gateway: provider,
      reference,
      accessCode,
      redirectUrl,
      amount,
      currency,
      email,
      key,
      message,
      raw: nestedPayload as Record<string, unknown>,
      data: nestedPayload as Record<string, unknown>,
    };
  }

  async initializePayment(data: PaymentInitializeRequest): Promise<PaymentInitializationResult> {
    const payload = {
      orderItems: data.orderItems.map((item) => ({
        billboardId: item.billboardId,
        durationInMonths: Number(item.durationInMonths),
        startDate: item.startDate,
      })),
    };

    const response = await apiClient.post<any>(`${this.baseUrl}/initialize-payments`, payload);
    const payment = this.normalizeResponse(response);

    if (!payment.redirectUrl && !payment.reference && !payment.accessCode && !payment.provider) {
      throw new Error(payment.message || "Payment initialization failed");
    }

    return payment;
  }

  async loadPaystackScript(): Promise<void> {
    if (typeof window === "undefined") {
      return;
    }

    if (window.PaystackPop) {
      return;
    }

    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load payment gateway script."));
      document.body.appendChild(script);
    });
  }

  async openPaystackCheckout(options: {
    key: string;
    email?: string;
    amount?: number;
    reference?: string;
    currency?: string;
    callback?: () => void;
    onClose?: () => void;
  }): Promise<void> {
    if (typeof window === "undefined") {
      throw new Error("Payment checkout is only supported in the browser.");
    }

    await this.loadPaystackScript();

    if (!window.PaystackPop) {
      throw new Error("Paystack checkout could not be initialized.");
    }

    const amount = Number(options.amount ?? 0);
    if (!amount || amount <= 0) {
      throw new Error("Invalid amount received for payment initiation.");
    }

    const paystack = window.PaystackPop.setup({
      key: options.key,
      email: options.email ?? "customer@vaad.com.ng",
      amount: amount * 100,
      currency: options.currency ?? "NGN",
      ref: options.reference ?? `vaad-${Date.now()}`,
      channels: ["card", "bank", "ussd", "qr", "mobile_money"],
      callback: options.callback ?? (() => undefined),
      onClose: options.onClose ?? (() => undefined),
    });

    paystack.openIframe();
  }
}

export const paymentService = new PaymentService();
