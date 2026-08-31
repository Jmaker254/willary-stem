import "server-only";
import { prisma } from "./db";

export async function audit(
  userId: string | null,
  action: string,
  entity: string,
  entityId?: string | null,
): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: { userId: userId ?? undefined, action, entity, entityId: entityId ?? undefined },
    });
  } catch (err) {
    console.error("[audit:error]", err);
  }
}
