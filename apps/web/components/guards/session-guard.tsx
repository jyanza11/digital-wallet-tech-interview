"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/stores/session-store";
import { Spinner } from "@/components/spinner";

export function SessionGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useSessionStore((s) => s.user);
  const hasHydrated = useSessionStore((s) => s.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!user) {
      router.replace("/login");
    }
  }, [hasHydrated, user, router]);

  if (!hasHydrated) {
    return (
      <div className="flex flex-1 items-center justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
