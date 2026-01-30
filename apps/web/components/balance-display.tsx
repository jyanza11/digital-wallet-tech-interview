"use client";

import { WalletIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BalanceDisplayProps {
  name: string;
  balance: number;
  label?: string;
  className?: string;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function BalanceDisplay({
  name,
  balance,
  label = "Saldo disponible",
  className,
}: BalanceDisplayProps) {
  const formatted = formatCurrency(balance);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-primary/20 bg-linear-to-br from-primary/10 via-primary/5 to-transparent p-6 shadow-sm dark:from-primary/15 dark:via-primary/10",
        className
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-muted-foreground">
            {label}
          </span>
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/15 text-primary">
            <WalletIcon className="size-5" aria-hidden />
          </div>
        </div>

        <div className="space-y-1">
          <p
            className="text-3xl font-bold tabular-nums tracking-tight text-foreground sm:text-4xl"
            aria-label={`Saldo: $${formatted}`}
          >
            <span className="text-primary">$</span>{" "}
            {formatted}
          </p>
          <p className="text-sm text-muted-foreground">
            Titular: <span className="font-medium text-foreground">{name}</span>
          </p>
        </div>
      </div>

      
    </div>
  );
}
