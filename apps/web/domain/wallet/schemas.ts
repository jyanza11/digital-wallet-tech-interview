import { z } from "zod";

const documentSchema = z
  .string({ required_error: "Este campo es obligatorio" })
  .min(1, "Este campo es obligatorio")
  .regex(/^\d+$/, "El documento debe contener solo números")
  .min(5, "Mínimo 5 dígitos")
  .max(15, "Máximo 15 dígitos")
  .trim();

const phoneSchema = z
  .string({ required_error: "Este campo es obligatorio" })
  .min(1, "Este campo es obligatorio")
  .regex(/^\d+$/, "El celular debe contener solo números")
  .min(10, "Mínimo 10 dígitos")
  .max(11, "Máximo 11 dígitos")
  .trim();

const emailSchema = z
  .string({ required_error: "Este campo es obligatorio" })
  .min(1, "Este campo es obligatorio")
  .email("Email no válido")
  .max(255, "Email demasiado largo")
  .trim()
  .toLowerCase();

const nameSchema = z
  .string({ required_error: "Este campo es obligatorio" })
  .min(1, "Este campo es obligatorio")
  .min(2, "Mínimo 2 caracteres")
  .max(200, "Máximo 200 caracteres")
  .trim();

const amountSchema = z
  .union([z.string().min(1, "El valor es obligatorio"), z.number()])
  .transform((v) => (typeof v === "string" ? Number(v.replace(/,/g, "")) : v))
  .pipe(
    z
      .number({ invalid_type_error: "El valor debe ser un número" })
      .positive("El valor debe ser mayor a 0")
      .finite(),
  );

const otpTokenSchema = z
  .string({ required_error: "Este campo es obligatorio" })
  .min(1, "Este campo es obligatorio")
  .length(6, "El token debe tener 6 dígitos")
  .regex(/^\d{6}$/, "El token debe ser solo números de 6 dígitos")
  .trim();

const sessionIdSchema = z
  .string({ required_error: "Este campo es obligatorio" })
  .min(1, "Este campo es obligatorio")
  .uuid("ID de sesión no válido")
  .trim();

export const registerClientSchema = z.object({
  document: documentSchema,
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
});

export const requestLoginOtpSchema = z.object({
  email: emailSchema,
  document: documentSchema,
  phone: phoneSchema,
});

export const confirmLoginOtpSchema = z.object({
  email: emailSchema,
  otp: otpTokenSchema,
});

export const rechargeWalletSchema = z.object({
  document: documentSchema,
  phone: phoneSchema,
  amount: amountSchema,
});

export const checkBalanceSchema = z.object({
  document: documentSchema,
  phone: phoneSchema,
});

export const requestPaymentSchema = z.object({
  document: documentSchema,
  phone: phoneSchema,
  amount: amountSchema,
});

export const confirmPaymentSchema = z.object({
  sessionId: sessionIdSchema,
  token: otpTokenSchema,
});

export type RegisterClientFormData = z.infer<typeof registerClientSchema>;
export type RequestLoginOtpFormData = z.infer<typeof requestLoginOtpSchema>;
export type ConfirmLoginOtpFormData = z.infer<typeof confirmLoginOtpSchema>;
export type RechargeWalletFormData = z.infer<typeof rechargeWalletSchema>;
export type CheckBalanceFormData = z.infer<typeof checkBalanceSchema>;
export type RequestPaymentFormData = z.infer<typeof requestPaymentSchema>;
export type ConfirmPaymentFormData = z.infer<typeof confirmPaymentSchema>;
