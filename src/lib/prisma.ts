import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Explicitly resolve the database URL for Prisma 7 compatibility during build/runtime
// In Prisma 7, the URL is no longer in the schema.prisma, so we pass it here
// to ensure the client is correctly initialized even if the config file isn't found.
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: databaseUrl,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
