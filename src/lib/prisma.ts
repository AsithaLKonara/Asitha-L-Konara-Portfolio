import { PrismaClient } from "@/generated/prisma/client";

function ensureDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    return;
  }

  const fallback =
    process.env.LOCAL_DATABASE_URL ??
    "postgresql://postgres:postgres@localhost:5432/portfolio_dev";

  process.env.DATABASE_URL = fallback;

  if (process.env.NODE_ENV !== "production") {
    console.warn(
      `[prisma] DATABASE_URL not set, using fallback ${fallback}`,
    );
  }
}

ensureDatabaseUrl();

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
