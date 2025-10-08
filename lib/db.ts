// lib/db.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // Prevent multiple instances of Prisma Client in development
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"], // remove "query" in prod if too noisy
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
