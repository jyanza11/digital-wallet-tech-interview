import { Operation } from "@/types/operations";
import {
  LogIn,
  UserIcon,
  WalletIcon,
  CreditCardIcon,
  SendIcon,
  CheckIcon,
} from "lucide-react";

export const operations: Operation[] = [
  {
    name: "Iniciar sesión",
    description:
      "Accede a tu billetera con tu correo, documento y celular. Te enviaremos un código de verificación por email para asegurar que eres tú.",
    icon: LogIn,
    href: "/login",
  },
  {
    name: "Registro de clientes",
    description:
      "Crea tu cuenta y obtén una billetera digital. Solo necesitas tu documento de identidad, nombres completos, correo electrónico y número celular.",
    icon: UserIcon,
    href: "/register",
  },
  {
    name: "Recarga de billetera",
    description:
      "Añade dinero a tu billetera de forma segura. Indica documento, celular y el monto a recargar; el saldo se actualizará al instante.",
    icon: WalletIcon,
    href: "/wallet/recharge",
  },
  {
    name: "Consulta de saldo",
    description:
      "Revisa cuánto tienes disponible en tu billetera. Ingresa documento y celular asociados a la cuenta para ver el saldo actual.",
    icon: CreditCardIcon,
    href: "/wallet/balance",
  },
  {
    name: "Solicitar pago",
    description:
      "Inicia un pago desde tu billetera. Se generará un código de confirmación que se enviará al correo del pagador para validar la operación.",
    icon: SendIcon,
    href: "/payments/request",
  },
  {
    name: "Confirmar pago",
    description:
      "Finaliza el pago ingresando el ID de sesión que recibiste y el código de 6 dígitos enviado a tu correo. Así se completa la transacción.",
    icon: CheckIcon,
    href: "/payments/confirm",
  },
];
