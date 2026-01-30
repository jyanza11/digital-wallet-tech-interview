"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import * as api from "@/lib/api";
import type { RechargeWalletFormData } from "@/domain/wallet";

export function useRechargeWallet() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<api.RechargeWalletData | null>(null);

  const mutate = useCallback(async (payload: RechargeWalletFormData) => {
    setIsLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await api.rechargeWallet(payload);
      if (res.success && res.data) {
        setData(res.data);
        toast.info(
          `Billetera recargada. Nuevo saldo: $${res.data.newBalance.toLocaleString()}.`,
        );
        toast.success(res.message);
        return res;
      }
      setError(res.message);
      toast.error(res.message || "No se pudo recargar la billetera.");
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
