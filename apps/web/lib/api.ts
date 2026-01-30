const API_BASE =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const json = (await res.json().catch(() => ({}))) as ApiResponse<T>;
  if (!res.ok) {
    return {
      success: false,
      message: json.message || "Error en la solicitud",
      error: json.error,
    };
  }
  return json;
}

export interface RegisterClientPayload {
  document: string;
  name: string;
  email: string;
  phone: string;
}

export interface RegisterClientData {
  id: string;
  document: string;
  name: string;
  email: string;
  phone: string;
  wallet: { id: string; balance: number };
}

export async function registerClient(
  payload: RegisterClientPayload,
): Promise<ApiResponse<RegisterClientData>> {
  return request<RegisterClientData>("/clients/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export interface RequestLoginOtpPayload {
  email: string;
  document: string;
  phone: string;
}

export interface RequestLoginOtpData {
  message: string;
}

export async function requestLoginOtp(
  payload: RequestLoginOtpPayload,
): Promise<ApiResponse<RequestLoginOtpData>> {
  return request<RequestLoginOtpData>("/clients/login/request", {
    method: "POST",
    body: JSON.stringify({
      email: payload.email.trim().toLowerCase(),
      document: payload.document.trim(),
      phone: payload.phone.trim(),
    }),
  });
}

export interface ConfirmLoginOtpPayload {
  email: string;
  otp: string;
}

export type LoginData = RegisterClientData;

export async function confirmLoginOtp(
  payload: ConfirmLoginOtpPayload,
): Promise<ApiResponse<LoginData>> {
  return request<LoginData>("/clients/login/confirm", {
    method: "POST",
    body: JSON.stringify({
      email: payload.email.trim().toLowerCase(),
      otp: payload.otp.trim(),
    }),
  });
}

export interface RechargeWalletPayload {
  document: string;
  phone: string;
  amount: number;
}

export interface RechargeWalletData {
  clientId: string;
  name: string;
  newBalance: number;
  rechargedAmount: number;
}

export async function rechargeWallet(
  payload: RechargeWalletPayload,
): Promise<ApiResponse<RechargeWalletData>> {
  return request<RechargeWalletData>("/wallet/recharge", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export interface CheckBalancePayload {
  document: string;
  phone: string;
}

export interface CheckBalanceData {
  clientId: string;
  name: string;
  document: string;
  balance: number;
}

export async function checkBalance(
  payload: CheckBalancePayload,
): Promise<ApiResponse<CheckBalanceData>> {
  return request<CheckBalanceData>("/wallet/balance", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export interface RequestPaymentPayload {
  document: string;
  phone: string;
  amount: number;
}

export interface RequestPaymentData {
  message: string;
  sessionId: string;
  expiresAt: string;
}

export async function requestPayment(
  payload: RequestPaymentPayload,
): Promise<ApiResponse<RequestPaymentData>> {
  return request<RequestPaymentData>("/payments/request", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export interface ConfirmPaymentPayload {
  sessionId: string;
  token: string;
}

export interface ConfirmPaymentData {
  sessionId: string;
  amount: number;
  clientName: string;
  message: string;
}

export async function confirmPayment(
  payload: ConfirmPaymentPayload,
): Promise<ApiResponse<ConfirmPaymentData>> {
  return request<ConfirmPaymentData>("/payments/confirm", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export interface PaymentSessionData {
  id: string;
  status: string;
  amount: number;
  expiresAt: string;
}

export async function getPaymentSession(
  sessionId: string,
): Promise<ApiResponse<PaymentSessionData>> {
  return request<PaymentSessionData>(`/payments/session/${sessionId}`, {
    method: "GET",
  });
}
