"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  CheckBalanceFormData,
  checkBalanceSchema,
} from "@/domain/wallet/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useCheckBalance } from "../hooks";
import { useSessionStore } from "@/stores/session-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import { cn } from "@/lib/utils";
import { BalanceDisplay } from "@/components/balance-display";

export function CheckBalanceForm() {
  const user = useSessionStore((s) => s.user);
  const updateWalletBalance = useSessionStore((s) => s.updateWalletBalance);

  const form = useForm<CheckBalanceFormData>({
    resolver: zodResolver(checkBalanceSchema),
    defaultValues: {
      document: "",
      phone: "",
    },
  });

  const { mutate, isLoading, data } = useCheckBalance();
  const hasAutoQueriedRef = useRef<string | null>(null);

  useEffect(() => {
    if (user) {
      form.reset({
        document: user.document,
        phone: user.phone,
      });
      if (hasAutoQueriedRef.current !== user.id) {
        hasAutoQueriedRef.current = null;
      }
    }
  }, [user, form]);

  useEffect(() => {
    if (!user?.document || !user?.phone || !user?.id) return;
    if (hasAutoQueriedRef.current === user.id) return;
    
    hasAutoQueriedRef.current = user.id;
    mutate({ document: user.document, phone: user.phone }).then((res) => {
      if (res?.success && res?.data) {
        updateWalletBalance(res.data.balance);
      }
    });
  }, [user?.id, user?.document, user?.phone, mutate, updateWalletBalance]);

  const onSubmit = (data: CheckBalanceFormData) => {
    mutate(data).then((res) => {
      if (res?.success && res?.data) {
        updateWalletBalance(res.data.balance);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="document"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Documento</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Ej: 9999999999"
                  disabled={!!user}
                  aria-readonly={!!user}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de celular</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Ej: 0987654321"
                  disabled={!!user}
                  aria-readonly={!!user}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isLoading}
          className={cn(
            isLoading && "opacity-50 cursor-not-allowed",
            "cursor-pointer"
          )}
        >
          {isLoading ? <Spinner /> : "Consultar saldo"}
        </Button>
      </form>
      {data && (
        <BalanceDisplay
          name={data.name}
          balance={data.balance}
          label="Saldo disponible"
          className="mt-6"
        />
      )}
    </Form>
  );
}
