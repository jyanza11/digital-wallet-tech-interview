"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Controller } from "react-hook-form";
import {
  requestLoginOtpSchema,
  confirmLoginOtpSchema,
} from "@/domain/wallet/schemas";
import type {
  RequestLoginOtpFormData,
  ConfirmLoginOtpFormData,
} from "@/domain/wallet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRequestLoginOtp, useLogin } from "../hooks";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [emailSentTo, setEmailSentTo] = useState("");

  const credentialsForm = useForm<RequestLoginOtpFormData>({
    resolver: zodResolver(requestLoginOtpSchema),
    defaultValues: {
      email: "",
      document: "",
      phone: "",
    },
  });

  const otpForm = useForm<ConfirmLoginOtpFormData>({
    resolver: zodResolver(confirmLoginOtpSchema),
    defaultValues: {
      email: "",
      otp: "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const { mutate: requestOtp, isLoading: requestingOtp } = useRequestLoginOtp();
  const { mutate: confirmLogin, isLoading: confirmingLogin } = useLogin();

  const onRequestOtp = (data: RequestLoginOtpFormData) => {
    requestOtp(data).then((res) => {
      if (res?.success) {
        setEmailSentTo(data.email);
        otpForm.setValue("email", data.email);
        otpForm.setValue("otp", "");
        setStep("otp");
      }
    });
  };

  const onConfirmOtp = (data: ConfirmLoginOtpFormData) => {
    confirmLogin(data).then((res) => {
      if (res?.success) {
        router.replace("/wallet/balance");
      }
    });
  };

  const backToCredentials = () => {
    setStep("credentials");
    otpForm.reset({ email: emailSentTo, otp: "" });
  };

  if (step === "otp") {
    return (
      <Form {...otpForm}>
        <form onSubmit={otpForm.handleSubmit(onConfirmOtp)} className="space-y-6">
          <FormField
            control={otpForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    disabled
                    aria-readonly
                    className="bg-muted"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Controller
            control={otpForm.control}
            name="otp"
            render={({ field, fieldState }) => {
              const otpValue = typeof field.value === "string" ? field.value : "";
              
              return (
                <div className="grid gap-2">
                  <label
                    htmlFor="otp-input"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Código de 6 dígitos (revisa tu correo)
                  </label>
                  <InputOTP
                    key={`otp-${step}`}
                    id="otp-input"
                    maxLength={6}
                    value={otpValue}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                    pattern={REGEXP_ONLY_DIGITS}
                    pasteTransformer={(pasted) =>
                      pasted.replace(/\D/g, "").slice(0, 6)
                    }
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
                  {fieldState.error && (
                    <p className="text-destructive text-sm">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              );
            }}
          />
          
          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              disabled={confirmingLogin}
              className={cn(
                confirmingLogin && "opacity-50 cursor-not-allowed",
                "cursor-pointer"
              )}
            >
              {confirmingLogin ? <Spinner /> : "Verificar y entrar"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={backToCredentials}
              disabled={confirmingLogin}
            >
              Usar otro correo o datos
            </Button>
          </div>
        </form>
      </Form>
    );
  }

  return (
    <Form {...credentialsForm}>
      <form
        onSubmit={credentialsForm.handleSubmit(onRequestOtp)}
        className="space-y-6"
      >
        <FormField
          control={credentialsForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="tu@ejemplo.com"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={credentialsForm.control}
          name="document"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Documento</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ej: 9999999999" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={credentialsForm.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Celular</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ej: 0987654321" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-3">
          <Button
            type="submit"
            disabled={requestingOtp}
            className={cn(
              requestingOtp && "opacity-50 cursor-not-allowed",
              "cursor-pointer"
            )}
          >
            {requestingOtp ? <Spinner /> : "Enviar código al correo"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <Link
              href="/register"
              className="font-medium text-primary underline underline-offset-4 hover:no-underline"
            >
              Regístrate
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
}
