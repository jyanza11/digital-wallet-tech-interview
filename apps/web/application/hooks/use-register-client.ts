"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import * as api from "@/lib/api";
import { useSessionStore } from "@/stores/session-store";
import type { RegisterClientFormData } from "@/domain/wallet";

export function useRegisterClient() {
  const setUser = useSessionStore((s) => s.setUser);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<api.RegisterClientData | null>(null);

  const mutate = useCallback(
    async (payload: RegisterClientFormData) => {
      setIsLoading(true);
      setError(null);
      setData(null);
      try {
        const res = await api.registerClient(payload);
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
          toast.success(
            res.message
              ? `${res.message} Billetera creada con saldo $${res.data.wallet.balance.toLocaleString()}.`
              : `Cliente registrado. Billetera creada con saldo $${res.data.wallet.balance.toLocaleString()}.`,
          );
          return res;
        }
        setError(res.message);
        toast.error(res.message || "No se pudo registrar el cliente.");
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
