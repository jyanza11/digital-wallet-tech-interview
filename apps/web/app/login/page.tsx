import { LoginForm } from "@/application/forms/login-form";
import { RedirectIfAuthenticated } from "@/components/guards";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  return (
    <RedirectIfAuthenticated redirectTo="/wallet/balance">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Iniciar sesión</CardTitle>
          <CardDescription>
            Ingresa tu correo, documento y celular. Te enviaremos un código al
            correo para validar que eres tú.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </RedirectIfAuthenticated>
  );
}
