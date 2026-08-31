import Link from "next/link";
import { prisma } from "@/lib/db";
import Badge from "@/components/admin/Badge";
import { SubmissionStatus, SubmissionType, Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

const STATUSES = ["ALL", ...Object.values(SubmissionStatus)];
const TYPES = ["ALL", ...Object.values(SubmissionType)];

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; type?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const status = STATUSES.includes(sp.status ?? "") ? sp.status! : "ALL";
  const type = TYPES.includes(sp.type ?? "") ? sp.type! : "ALL";
  const page = Math.max(1, Number(sp.page ?? 1));
  const perPage = 25;

  const where: Prisma.SubmissionWhereInput = {
    ...(status !== "ALL" ? { status: status as SubmissionStatus } : {}),
    ...(type !== "ALL" ? { type: type as SubmissionType } : {}),
  };

  const [rows, total] = await Promise.all([
    prisma.submission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.submission.count({ where }),
  ]);
  const pages = Math.max(1, Math.ceil(total / perPage));

  const qs = (o: Record<string, string | number>) =>
    "?" +
    new URLSearchParams({
      status,
      type,
      page: String(page),
      ...Object.fromEntries(Object.entries(o).map(([k, v]) => [k, String(v)])),
    }).toString();

  return (
    <>
      <div className="admin-topbar">
        <h1>Submissions</h1>
        <a className="btn btn--ghost btn--sm" href={`/admin/submissions/export${qs({})}`}>
          Export CSV
        </a>
      </div>

      <div className="admin-filters">
        {TYPES.map((t) => (
          <Link key={t} href={qs({ type: t, page: 1 })} aria-current={type === t}>
            {t.toLowerCase()}
          </Link>
        ))}
      </div>
      <div className="admin-filters">
        {STATUSES.map((s) => (
          <Link key={s} href={qs({ status: s, page: 1 })} aria-current={status === s}>
            {s.toLowerCase()}
          </Link>
        ))}
      </div>

      <div className="panel">
        {rows.length === 0 ? (
          <p>No submissions match.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>When</th>
                <th>Type</th>
                <th>Name</th>
                <th>Email</th>
                <th>Topic</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.createdAt.toISOString().slice(0, 16).replace("T", " ")}</td>
                  <td>{r.type}</td>
                  <td>
                    <Link href={`/admin/submissions/${r.id}`}>{r.name}</Link>
                  </td>
                  <td>{r.email}</td>
                  <td>{r.topic ?? "—"}</td>
                  <td>
                    <Badge value={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pages > 1 && (
        <div className="admin-filters">
          {page > 1 && <Link href={qs({ page: page - 1 })}>← Prev</Link>}
          <span style={{ fontSize: "0.82rem", padding: "6px 12px" }}>
            Page {page} of {pages} · {total} total
          </span>
          {page < pages && <Link href={qs({ page: page + 1 })}>Next →</Link>}
        </div>
      )}
    </>
  );
}
