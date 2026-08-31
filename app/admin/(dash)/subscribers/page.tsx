import Link from "next/link";
import { prisma } from "@/lib/db";
import Badge from "@/components/admin/Badge";
import {
  setSubscriberStatus,
  deleteSubscriber,
} from "@/actions/admin/leads";
import AddSubscriberForm from "@/components/admin/AddSubscriberForm";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { SubscriberStatus, Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

const STATUSES = ["ALL", ...Object.values(SubscriberStatus)];

export default async function SubscribersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const status = STATUSES.includes(sp.status ?? "") ? sp.status! : "ALL";
  const where: Prisma.SubscriberWhereInput =
    status !== "ALL" ? { status: status as SubscriberStatus } : {};

  const rows = await prisma.subscriber.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <div className="admin-topbar">
        <h1>Subscribers</h1>
        <a
          className="btn btn--ghost btn--sm"
          href={`/admin/subscribers/export?status=${status}`}
        >
          Export CSV
        </a>
      </div>

      <div className="panel">
        <h2>Add a subscriber</h2>
        <AddSubscriberForm />
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
          <p>No subscribers match.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>When</th>
                <th>Email</th>
                <th>Name</th>
                <th>Source</th>
                <th>Tags</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.createdAt.toISOString().slice(0, 10)}</td>
                  <td>{r.email}</td>
                  <td>{r.name ?? "—"}</td>
                  <td>{r.source ?? "—"}</td>
                  <td>{r.tags.join(", ") || "—"}</td>
                  <td>
                    <Badge value={r.status} />
                  </td>
                  <td>
                    <span className="inline-actions">
                      {r.status !== "ACTIVE" && (
                        <form action={setSubscriberStatus.bind(null, r.id, "ACTIVE")}>
                          <button className="btn-link" type="submit">
                            activate
                          </button>
                        </form>
                      )}
                      {r.status !== "UNSUBSCRIBED" && (
                        <form
                          action={setSubscriberStatus.bind(null, r.id, "UNSUBSCRIBED")}
                        >
                          <button className="btn-link" type="submit">
                            unsubscribe
                          </button>
                        </form>
                      )}
                      <form action={deleteSubscriber.bind(null, r.id)}>
                        <ConfirmButton className="btn-link" message="Delete this subscriber?">
                          delete
                        </ConfirmButton>
                      </form>
                    </span>
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
