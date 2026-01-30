"use client";

import Link from "next/link";
import { useSessionStore } from "@/stores/session-store";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";

export const Navbar = () => {
  const user = useSessionStore((s) => s.user);
  const clearUser = useSessionStore((s) => s.clearUser);

  return (
    <nav className="flex w-full items-center justify-between gap-4 border-b border-border pb-4">
      <Link
        href="/"
        className="text-lg font-semibold text-foreground no-underline transition-colors hover:text-primary shrink-0"
      >
        Billetera Digital
      </Link>
      <div className="flex items-center gap-3 min-w-0">
        {user ? (
          <>
            <span className="text-sm text-muted-foreground truncate" title={user.email}>
              {user.name}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => clearUser()}
            >
              Cerrar sesión
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Iniciar sesión</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/register">Registrarse</Link>
            </Button>
          </>
        )}
        <ThemeToggle />
      </div>
    </nav>
  );
};
