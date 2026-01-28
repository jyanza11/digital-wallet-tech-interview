// Re-export Prisma client
export { prisma, PrismaClient } from "./client";

// Re-export all Prisma types
export {
  Client,
  Wallet,
  Transaction,
  PaymentSession,
  TransactionType,
  SessionStatus,
  Prisma,
} from "@prisma/client";

// Type helpers for the application
export type { 
  Client as ClientModel,
  Wallet as WalletModel,
  Transaction as TransactionModel,
  PaymentSession as PaymentSessionModel,
} from "@prisma/client";
