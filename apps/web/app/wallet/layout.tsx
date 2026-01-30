import { SessionGuard } from "@/components/guards";

export default function WalletLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionGuard>{children}</SessionGuard>;
}
