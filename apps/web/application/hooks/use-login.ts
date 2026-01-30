"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import * as api from "@/lib/api";
import { useSessionStore } from "@/stores/session-store";
import type { ConfirmLoginOtpFormData } from "@/domain/wallet";

/** Confirmar login con OTP: valida código y establece sesión */
export function useLogin() {
  const setUser = useSessionStore((s) => s.setUser);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<api.LoginData | null>(null);

  const mutate = useCallback(
    async (payload: ConfirmLoginOtpFormData) => {
      setIsLoading(true);
      setError(null);
      setData(null);
      try {
        const res = await api.confirmLoginOtp(payload);
        if (res.success && res.data) {
          setData(res.data);
          setUser({
            id: res.data.id,
            document: res.data.document,
            name: res.data.name,
            email: res.data.email,
            phone: res.data.phone,
            walletBalance: res.data.wallet.balance,
          });
          toast.success(res.message || "Has iniciado sesión correctamente.");
          return res;
        }
        setError(res.message);
        toast.error(
          res.message || "Código incorrecto o expirado. Intenta de nuevo.",
        );
        return res;
      } catch (e) {
        const msg =
          e instanceof Error
            ? e.message
            : "No se pudo conectar. Revisa tu conexión.";
        setError(msg);
        toast.error(msg);
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [setUser],
  );

  const reset = useCallback(() => {
    setError(null);
    setData(null);
  }, []);

  return { mutate, isLoading, error, data, reset };
}
