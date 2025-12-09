import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";

// For Cloudflare D1, the database binding is accessed via the platform environment
// In Cloudflare Workers/Pages, this is typically process.env.DB or getRequestContext().env.DB
// The binding name "DB" should match what's configured in wrangler.toml

// Note: This requires the D1 database to be bound in your wrangler.toml:
// [[d1_databases]]
// binding = "DB"
// database_name = "your-database-name"
// database_id = "your-database-id"

const adapter = new PrismaD1(process.env.DB as any);

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
