import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaMssql } from '@prisma/adapter-mssql';
import mssql from 'mssql';

const connectionString = process.env.DATABASE_URL || "";

const pool = new mssql.ConnectionPool(connectionString);
const adapter = new PrismaMssql(pool);

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
