import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Ensure DATABASE_URL is defined early
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be defined");
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

// Factory function to create a new Prisma client
function createPrismaClient() {
  return new PrismaClient({
    adapter,
  });
}

// Extend global type (ideally move this to a global.d.ts file)
declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: ReturnType<typeof createPrismaClient> | undefined;
}

// Reuse existing client in development, or create a new one
const prisma = globalThis.prismaGlobal ?? createPrismaClient();

// Cache the client on globalThis only in non-production environments
if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

export default prisma;
