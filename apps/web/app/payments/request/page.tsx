"use client";

import { RequestPaymentForm } from "@/application/forms/request-payment-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RequestPaymentPage() {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Solicitar pago</CardTitle>
        <CardDescription>
          Documento, celular y valor de la compra. Se verifica saldo suficiente,
          se genera un token de 6 dígitos (OTP) y se envía al email del cliente.
          Se genera un ID de sesión para confirmar el pago.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RequestPaymentForm />
      </CardContent>
    </Card>
  );
}
