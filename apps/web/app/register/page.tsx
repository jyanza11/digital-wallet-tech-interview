import { RegisterClientForm } from "@/application/forms/register-client-form";
import { RedirectIfAuthenticated } from "@/components/guards";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <RedirectIfAuthenticated redirectTo="/wallet/balance">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Registro de clientes</CardTitle>
          <CardDescription>
            Completa tus datos para crear tu cuenta y obtener una billetera
            digital. Todos los campos son obligatorios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterClientForm />
        </CardContent>
      </Card>
    </RedirectIfAuthenticated>
  );
}
