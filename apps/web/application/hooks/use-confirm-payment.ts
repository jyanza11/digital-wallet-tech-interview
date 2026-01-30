"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import * as api from "@/lib/api";
import type { ConfirmPaymentFormData } from "@/domain/wallet";

export function useConfirmPayment() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<api.ConfirmPaymentData | null>(null);

  const mutate = useCallback(async (payload: ConfirmPaymentFormData) => {
    setIsLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await api.confirmPayment(payload);
      if (res.success && res.data) {
        setData(res.data);
        toast.success(
          res.data.message || res.message
            ? `${res.data.message || res.message} Monto: $${res.data.amount.toLocaleString()}.`
            : `Pago confirmado. Monto: $${res.data.amount.toLocaleString()}.`,
        );
        return res;
      }
      setError(res.message);
      toast.error(res.message || "No se pudo confirmar el pago.");
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
