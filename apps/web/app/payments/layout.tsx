import { SessionGuard } from "@/components/guards";

export default function PaymentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionGuard>{children}</SessionGuard>;
}
