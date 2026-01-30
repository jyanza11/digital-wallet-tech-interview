"use client";

import { useSessionStore } from "@/stores/session-store";

export const Greetings = () => {
  const user = useSessionStore((s) => s.user);
  const hasHydrated = useSessionStore((s) => s.hasHydrated);

  if (!hasHydrated) {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Bienvenido a la billetera digital</h1>
        <p className="text-sm text-muted-foreground">
          Aquí puedes realizar las siguientes operaciones:
        </p>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">
          Hola, {user.name}
        </h1>
        <p className="text-sm text-muted-foreground">
          Elige una operación para continuar:
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Bienvenido a la billetera digital</h1>
      <p className="text-sm text-muted-foreground">
        Aquí puedes realizar las siguientes operaciones:
      </p>
    </div>
  );
};
