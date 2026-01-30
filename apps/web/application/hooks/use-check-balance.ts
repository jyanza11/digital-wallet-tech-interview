"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import * as api from "@/lib/api";
import type { CheckBalanceFormData } from "@/domain/wallet";

export function useCheckBalance() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<api.CheckBalanceData | null>(null);

  const mutate = useCallback(async (payload: CheckBalanceFormData) => {
    setIsLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await api.checkBalance(payload);
      if (res.success && res.data) {
        setData(res.data);
        toast.success(
          res.message || `Saldo actual: $${res.data.balance.toLocaleString()}.`,
        );
        return res;
      }
      setError(res.message);
      toast.error(res.message || "No se pudo consultar el saldo.");
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
