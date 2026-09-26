"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { guard, audit } from "./helpers";
import { OrderStatus } from "@prisma/client";

export async function setOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<void> {
  const u = await guard("EDITOR");
  await prisma.order.update({ where: { id }, data: { status } });
  await audit(u.id, `status:${status}`, "Order", id);
  revalidatePath("/admin/shop-orders");
  revalidatePath(`/admin/shop-orders/${id}`);
  revalidatePath("/admin");
}

export async function deleteOrder(id: string): Promise<void> {
  const u = await guard("EDITOR");
  await prisma.order.delete({ where: { id } });
  await audit(u.id, "delete", "Order", id);
  revalidatePath("/admin/shop-orders");
  redirect("/admin/shop-orders");
}
