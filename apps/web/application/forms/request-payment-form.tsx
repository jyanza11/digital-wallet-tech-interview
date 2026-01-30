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
  RequestPaymentFormData,
  requestPaymentSchema,
} from "@/domain/wallet/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useRequestPayment } from "../hooks";
import { useSessionStore } from "@/stores/session-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type RequestFormValues = Omit<RequestPaymentFormData, "amount"> & {
  amount: number | "";
};

export function RequestPaymentForm() {
  const user = useSessionStore((s) => s.user);

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestPaymentSchema) as never,
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

  const { mutate, isLoading, data } = useRequestPayment();

  const onSubmit = (data: RequestFormValues) => {
    const payload: RequestPaymentFormData = {
      ...data,
      amount: Number(data.amount),
    };
    mutate(payload);
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
              <FormLabel>Valor de la compra</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  step={1}
                  placeholder="Ej: 50"
                  {...field}
                  value={field.value === "" ? "" : Number(field.value)}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
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
          {isLoading ? <Spinner /> : "Solicitar pago"}
        </Button>
      </form>
      {data && (
        <Card className="mt-6 border-primary bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Token enviado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            <p className="text-sm text-muted-foreground">{data.message}</p>
            <p className="text-sm">
              <span className="font-medium">ID de sesión:</span>{" "}
              <code className="break-all rounded bg-muted px-1.5 py-0.5 text-xs">
                {data.sessionId}
              </code>
            </p>
            {data.expiresAt && (
              <p className="text-xs text-muted-foreground">
                Válido hasta: {new Date(data.expiresAt).toLocaleString()}
              </p>
            )}
            <Button asChild variant="outline" size="sm" className="mt-2">
              <Link href={`/payments/confirm?sessionId=${encodeURIComponent(data.sessionId)}`}>
                Ir a confirmar pago con el token (6 dígitos)
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </Form>
  );
}
