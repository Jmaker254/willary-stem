import Link from "next/link";
import { prisma } from "@/lib/db";
import Badge from "@/components/admin/Badge";
import { setRegistrationStatus } from "@/actions/admin/leads";
import { RegistrationStatus, Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

const STATUSES = ["ALL", ...Object.values(RegistrationStatus)];

const PAY_BADGE: Record<string, string> = {
  PAID: "is-ok",
  PROCESSING: "is-pending",
  PENDING: "is-new",
  FAILED: "is-spam",
  CANCELLED: "is-cancelled",
};

export default async function RegistrationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const status = STATUSES.includes(sp.status ?? "") ? sp.status! : "ALL";
  const where: Prisma.EventRegistrationWhereInput =
    status !== "ALL" ? { status: status as RegistrationStatus } : {};

  const [rows, headAgg, capRow, paidAgg] = await Promise.all([
    prisma.eventRegistration.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { payments: { orderBy: { createdAt: "desc" }, take: 1 } },
    }),
    prisma.eventRegistration.aggregate({
      where: { status: { in: ["PENDING", "CONFIRMED"] } },
      _sum: { quantity: true },
    }),
    prisma.setting.findUnique({ where: { key: "buildFestCapacity" } }),
    prisma.payment.aggregate({ where: { status: "PAID" }, _sum: { amount: true } }),
  ]);
  const headcount = headAgg._sum.quantity ?? 0;
  const capacity = Number(capRow?.value ?? 300);
  const collected = paidAgg._sum.amount ?? 0;

  return (
    <>
      <div className="admin-topbar">
        <h1>BuildFest registrations</h1>
        <a
          className="btn btn--ghost btn--sm"
          href={`/admin/registrations/export?status=${status}`}
        >
          Export CSV
        </a>
      </div>

      <div className="admin-cards">
        <div className="admin-card">
          <div className="num">
            {headcount}{" "}
            <span style={{ fontSize: "1rem", color: "var(--body)" }}>/ {capacity}</span>
          </div>
          <div className="lbl">Confirmed + pending head-count</div>
        </div>
        <div className="admin-card">
          <div className="num">KES {collected.toLocaleString()}</div>
          <div className="lbl">Collected via M-Pesa</div>
        </div>
        <div className="admin-card">
          <div className="num">{rows.length}</div>
          <div className="lbl">Rows shown</div>
        </div>
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
          <p>No registrations match.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>When</th>
                <th>Name</th>
                <th>Email</th>
                <th>Type</th>
                <th>Qty</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Move to</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const pay = r.payments[0];
                return (
                  <tr key={r.id}>
                    <td>{r.createdAt.toISOString().slice(0, 16).replace("T", " ")}</td>
                    <td>
                      {r.name}
                      {r.teamName ? ` (${r.teamName})` : ""}
                      {r.members.length > 1 && (
                        <div style={{ fontSize: "0.72rem", color: "var(--body)" }}>
                          {r.members.join(", ")}
                        </div>
                      )}
                    </td>
                    <td>{r.email}</td>
                    <td>{r.ticketType}</td>
                    <td>{r.quantity}</td>
                    <td>KES {r.amount.toLocaleString()}</td>
                    <td>
                      {pay ? (
                        <>
                          <span className={`badge ${PAY_BADGE[pay.status] ?? "is-read"}`}>
                            {pay.status.toLowerCase()}
                          </span>
                          {pay.mpesaReceipt && pay.mpesaReceipt !== "DEV-BYPASS" && (
                            <div style={{ fontSize: "0.72rem", color: "var(--body)" }}>
                              {pay.mpesaReceipt}
                            </div>
                          )}
                        </>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      <Badge value={r.status} />
                    </td>
                    <td>
                      <span className="inline-actions">
                        {Object.values(RegistrationStatus)
                          .filter((s) => s !== r.status)
                          .map((s) => (
                            <form
                              key={s}
                              action={setRegistrationStatus.bind(null, r.id, s)}
                            >
                              <button className="btn-link" type="submit">
                                {s.toLowerCase()}
                              </button>
                            </form>
                          ))}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
