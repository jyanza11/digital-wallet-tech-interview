"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import * as api from "@/lib/api";
import type { RequestLoginOtpFormData } from "@/domain/wallet";

export function useRequestLoginOtp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<api.RequestLoginOtpData | null>(null);

  const mutate = useCallback(async (payload: RequestLoginOtpFormData) => {
    setIsLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await api.requestLoginOtp(payload);
      if (res.success && res.data) {
        setData(res.data);
        toast.success(
          res.data.message ||
            "Código de verificación enviado. Revisa tu correo.",
        );
        return res;
      }
      setError(res.message);
      toast.error(
        res.message || "No se pudo enviar el código de verificación.",
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
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setData(null);
  }, []);

  return { mutate, isLoading, error, data, reset };
}
