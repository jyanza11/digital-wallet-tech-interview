"use client";
import {
  Form,
  FormMessage,
  FormControl,
  FormItem,
  FormLabel,
  FormField,
} from "@/components/ui/form";
import {
  RegisterClientFormData,
  registerClientSchema,
} from "@/domain/wallet/schemas";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegisterClient } from "../hooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const RegisterClientForm = () => {
  const form = useForm<RegisterClientFormData>({
    resolver: zodResolver(registerClientSchema),
    defaultValues: {
      document: "",
      name: "",
      email: "",
      phone: "",
    },
  });

  const { mutate, isLoading } = useRegisterClient();

  const onSubmit = (data: RegisterClientFormData) => {
    mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
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
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombres completos</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ej: Juan Pérez" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo electrónico</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="tu@ejemplo.com" />
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
              <FormLabel>Celular</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ej: 3001234567" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-3">
          <Button
            type="submit"
            disabled={isLoading}
            className={cn(
              isLoading && "opacity-50 cursor-not-allowed",
              "cursor-pointer"
            )}
          >
            {isLoading ? <Spinner /> : "Crear cuenta y billetera"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="font-medium text-primary underline underline-offset-4 hover:no-underline"
            >
              Iniciar sesión
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
};
