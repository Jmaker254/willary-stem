import Link from "next/link";
import { prisma } from "@/lib/db";
import Badge from "@/components/admin/Badge";

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ denied?: string }>;
}) {
  const { denied } = await searchParams;

  const [newSubs, pendingRegs, activeSubscribers, recent] = await Promise.all([
    prisma.submission.count({ where: { status: "NEW" } }),
    prisma.eventRegistration.count({ where: { status: "PENDING" } }),
    prisma.subscriber.count({ where: { status: "ACTIVE" } }),
    prisma.submission.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  const capRow = await prisma.setting.findUnique({
    where: { key: "buildFestCapacity" },
  });
  const capacity = Number(capRow?.value ?? 500);
  const headcount =
    (
      await prisma.eventRegistration.aggregate({
        where: { status: { in: ["PENDING", "CONFIRMED"] } },
        _sum: { quantity: true },
      })
    )._sum.quantity ?? 0;

  return (
    <>
      <h1>Dashboard</h1>
      {denied && (
        <div className="panel" style={{ borderColor: "var(--warn)" }}>
          You don&apos;t have permission for that area.
        </div>
      )}

      <div className="admin-cards">
        <Link className="admin-card" href="/admin/submissions?status=NEW">
          <div className="num">{newSubs}</div>
          <div className="lbl">New submissions</div>
        </Link>
        <Link className="admin-card" href="/admin/registrations?status=PENDING">
          <div className="num">{pendingRegs}</div>
          <div className="lbl">Pending registrations</div>
        </Link>
        <Link className="admin-card" href="/admin/subscribers?status=ACTIVE">
          <div className="num">{activeSubscribers}</div>
          <div className="lbl">Active subscribers</div>
        </Link>
        <div className="admin-card">
          <div className="num">
            {headcount}
            <span style={{ fontSize: "1rem", color: "var(--body)" }}>
              {" "}
              / {capacity}
            </span>
          </div>
          <div className="lbl">Build Fest head-count</div>
        </div>
      </div>

      <div className="panel">
        <h2>Latest submissions</h2>
        {recent.length === 0 ? (
          <p>No submissions yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>When</th>
                <th>Type</th>
                <th>Name</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {recent.map((s) => (
                <tr key={s.id}>
                  <td>{s.createdAt.toISOString().slice(0, 16).replace("T", " ")}</td>
                  <td>{s.type}</td>
                  <td>{s.name}</td>
                  <td>
                    <Badge value={s.status} />
                  </td>
                  <td>
                    <Link href={`/admin/submissions/${s.id}`}>Open</Link>
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
