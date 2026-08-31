import { PrismaClient } from "@prisma/client";
import { ensureLocalDb } from "./ensure-db";

const isDev = process.env.NODE_ENV !== "production";

function makeClient() {
  const base = new PrismaClient({
    log: isDev ? ["error", "warn"] : ["error"],
  });
  if (!isDev) return base;

  // Self-heal a dropped connection to the local `prisma dev` Postgres — it
  // stops when Node processes are killed, the machine sleeps, etc. On a
  // connection error we (re)start it and retry the query once.
  return base.$extends({
    query: {
      async $allOperations({ args, query }) {
        try {
          return await query(args);
        } catch (err) {
          const code = (err as { code?: string })?.code;
          if (code === "P1001" || code === "P1017") {
            await ensureLocalDb();
            try {
              await base.$disconnect();
            } catch {
              /* ignore */
            }
            return await query(args);
          }
          throw err;
        }
      },
    },
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof makeClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? makeClient();

if (isDev) globalForPrisma.prisma = prisma;
