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
  RechargeWalletFormData,
  rechargeWalletSchema,
} from "@/domain/wallet/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useRechargeWallet } from "../hooks";
import { useSessionStore } from "@/stores/session-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import { cn } from "@/lib/utils";

type RechargeFormValues = Omit<RechargeWalletFormData, "amount"> & {
  amount: number | string;
};

export function RechargeWalletForm() {
  const user = useSessionStore((s) => s.user);
  const updateWalletBalance = useSessionStore((s) => s.updateWalletBalance);

  const form = useForm<RechargeFormValues>({
    resolver: zodResolver(rechargeWalletSchema) as never,
    defaultValues: {
      document: "",
      phone: "",
      amount: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        document: user.document,
        phone: user.phone,
        amount: "",
      });
    }
  }, [user, form]);

  const { mutate, isLoading } = useRechargeWallet();

  const onSubmit = (data: RechargeFormValues) => {
    const amount =
      typeof data.amount === "number" ? data.amount : Number(String(data.amount).replace(",", "."));
    const payload: RechargeWalletFormData = {
      ...data,
      amount: Number.isNaN(amount) ? 0 : Math.round(amount * 100) / 100,
    };
    mutate(payload).then((res) => {
      if (res?.success && res?.data) {
        updateWalletBalance(res.data.newBalance);
        form.setValue("amount", "");
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
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor a recargar</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  inputMode="decimal"
                  min={0.01}
                  step={0.01}
                  placeholder="Ej: 1500 o 99.50"
                  {...field}
                  value={field.value === "" ? "" : field.value}
                  onChange={(e) => {
                    const raw = e.target.value;
                    field.onChange(raw === "" ? "" : raw);
                  }}
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
          {isLoading ? <Spinner /> : "Recargar billetera"}
        </Button>
      </form>
    </Form>
  );
}
