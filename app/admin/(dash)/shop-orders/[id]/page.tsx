import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import Badge from "@/components/admin/Badge";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { formatKes } from "@/lib/money";
import { setOrderStatus, deleteOrder } from "@/actions/admin/shop";
import { OrderStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function ShopOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) notFound();

  return (
    <>
      <div className="admin-topbar">
        <h1>Order {order.ref}</h1>
        <Link className="btn btn--ghost btn--sm" href="/admin/shop-orders">
          ← All orders
        </Link>
      </div>

      <div className="panel">
        <p>
          <strong>Status:</strong> <Badge value={order.status} />
        </p>
        <p className="inline-actions" style={{ marginTop: 8 }}>
          <span style={{ fontSize: "0.8rem", color: "var(--body)" }}>Move to:</span>
          {Object.values(OrderStatus)
            .filter((s) => s !== order.status)
            .map((s) => (
              <form key={s} action={setOrderStatus.bind(null, order.id, s)}>
                <button className="btn-link" type="submit">
                  {s.toLowerCase()}
                </button>
              </form>
            ))}
        </p>
      </div>

      <div className="panel">
        <h2>Customer</h2>
        <p>{order.name}</p>
        <p>
          <a href={`mailto:${order.email}`}>{order.email}</a> ·{" "}
          <a href={`tel:${order.phone.replace(/\s+/g, "")}`}>{order.phone}</a>
        </p>
        {order.address && (
          <p style={{ whiteSpace: "pre-wrap" }}>
            <strong>Deliver to:</strong> {order.address}
          </p>
        )}
        {order.notes && (
          <p style={{ whiteSpace: "pre-wrap" }}>
            <strong>Note:</strong> {order.notes}
          </p>
        )}
        <p style={{ fontSize: "0.8rem", color: "var(--body)" }}>
          Placed {order.createdAt.toISOString().slice(0, 16).replace("T", " ")}
        </p>
      </div>

      <div className="panel">
        <h2>Items</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Unit</th>
              <th>Qty</th>
              <th>Line total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((i) => (
              <tr key={i.id}>
                <td>{i.name}</td>
                <td>{formatKes(i.priceKes)}</td>
                <td>{i.quantity}</td>
                <td>{formatKes(i.priceKes * i.quantity)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} style={{ textAlign: "right", fontWeight: 700 }}>
                Subtotal
              </td>
              <td style={{ fontWeight: 700 }}>{formatKes(order.subtotalKes)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="panel">
        <form action={deleteOrder.bind(null, order.id)}>
          <ConfirmButton className="btn-link" message="Delete this order?">
            Delete order
          </ConfirmButton>
        </form>
      </div>
    </>
  );
}
