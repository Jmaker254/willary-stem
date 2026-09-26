import Link from "next/link";
import { prisma } from "@/lib/db";
import Badge from "@/components/admin/Badge";
import { formatKes } from "@/lib/money";
import { OrderStatus, Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

const STATUSES = ["ALL", ...Object.values(OrderStatus)];

export default async function ShopOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const status = STATUSES.includes(sp.status ?? "") ? sp.status! : "ALL";
  const where: Prisma.OrderWhereInput =
    status !== "ALL" ? { status: status as OrderStatus } : {};

  const rows = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <>
      <div className="admin-topbar">
        <h1>Shop orders</h1>
      </div>

      <div className="admin-filters">
        {STATUSES.map((s) => (
          <Link key={s} href={`?status=${s}`} aria-current={status === s}>
            {s.toLowerCase()}
          </Link>
        ))}
      </div>

      <div className="panel">
        {rows.length === 0 ? (
          <p>No orders match.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>When</th>
                <th>Ref</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Subtotal</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>
                    {r.createdAt.toISOString().slice(0, 16).replace("T", " ")}
                  </td>
                  <td>
                    <Link href={`/admin/shop-orders/${r.id}`}>{r.ref}</Link>
                  </td>
                  <td>
                    {r.name}
                    <div style={{ fontSize: "0.72rem", color: "var(--body)" }}>
                      {r.email} · {r.phone}
                    </div>
                  </td>
                  <td>{r.items.reduce((n, i) => n + i.quantity, 0)}</td>
                  <td>{formatKes(r.subtotalKes)}</td>
                  <td>
                    <Badge value={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
