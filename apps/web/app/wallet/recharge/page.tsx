"use client";

import { RechargeWalletForm } from "@/application/forms/recharge-wallet-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RechargePage() {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Recarga de billetera</CardTitle>
        <CardDescription>
          Documento, número de celular y valor a recargar. Se valida que el
          cliente exista y que los datos coincidan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RechargeWalletForm />
      </CardContent>
    </Card>
  );
}
