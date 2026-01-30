"use client";

import { ConfirmPaymentForm } from "@/application/forms/confirm-payment-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ConfirmPaymentPage() {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Confirmar pago</CardTitle>
        <CardDescription>
          ID de sesión (recibido al solicitar el pago) y token de 6 dígitos
          enviado al email del cliente. Se valida token y sesión y se descuenta
          el monto del saldo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ConfirmPaymentForm />
      </CardContent>
    </Card>
  );
}
