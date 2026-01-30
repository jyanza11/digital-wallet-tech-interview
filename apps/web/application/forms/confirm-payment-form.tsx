"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  ConfirmPaymentFormData,
  confirmPaymentSchema,
} from "@/domain/wallet/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useConfirmPayment } from "../hooks";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ConfirmPaymentForm() {
  const searchParams = useSearchParams();
  const sessionIdFromUrl = searchParams.get("sessionId") ?? "";

  const form = useForm<ConfirmPaymentFormData>({
    resolver: zodResolver(confirmPaymentSchema),
    defaultValues: {
      sessionId: "",
      token: "",
    },
  });

  useEffect(() => {
    if (sessionIdFromUrl) {
      form.setValue("sessionId", sessionIdFromUrl);
    }
  }, [sessionIdFromUrl, form]);

  const { mutate, isLoading, data } = useConfirmPayment();

  const onSubmit = (data: ConfirmPaymentFormData) => {
    mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="sessionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID de sesión</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="UUID de la sesión de pago"
                  disabled={!!sessionIdFromUrl}
                  aria-readonly={!!sessionIdFromUrl}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="token"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Token (6 dígitos)</FormLabel>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS}
                  value={field.value}
                  onChange={field.onChange}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
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
          {isLoading ? <Spinner /> : "Confirmar pago"}
        </Button>
      </form>
      {data && (
        <Card className="mt-6 border-primary bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Pago confirmado</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground">{data.message}</p>
            <p className="text-lg font-semibold text-foreground mt-1">
              Monto: ${data.amount.toLocaleString()}
            </p>
            {data.clientName && (
              <p className="text-sm text-muted-foreground">
                Cliente: {data.clientName}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </Form>
  );
}
