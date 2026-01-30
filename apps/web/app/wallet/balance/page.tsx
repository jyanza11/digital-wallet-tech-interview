"use client";

import { CheckBalanceForm } from "@/application/forms/check-balance-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function BalancePage() {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Consulta de saldo</CardTitle>
        <CardDescription>
          Documento y número de celular. Se valida que los datos coincidan con
          un cliente registrado y se retorna el saldo actual.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CheckBalanceForm />
      </CardContent>
    </Card>
  );
}
