import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import Badge from "@/components/admin/Badge";
import { setSubmissionStatus } from "@/actions/admin/leads";
import { SubmissionStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function SubmissionDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await prisma.submission.findUnique({ where: { id } });
  if (!row) notFound();

  return (
    <>
      <p className="breadcrumb" style={{ color: "var(--body)" }}>
        <Link href="/admin/submissions">← All submissions</Link>
      </p>
      <div className="admin-topbar">
        <h1>
          {row.type} · {row.name}
        </h1>
        <Badge value={row.status} />
      </div>

      <div className="panel">
        <table className="admin-table">
          <tbody>
            <tr>
              <th style={{ width: 160 }}>Received</th>
              <td>{row.createdAt.toISOString().replace("T", " ").slice(0, 19)}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>
                <a href={`mailto:${row.email}`}>{row.email}</a>
              </td>
            </tr>
            {row.organisation && (
              <tr>
                <th>Organisation</th>
                <td>{row.organisation}</td>
              </tr>
            )}
            {row.phone && (
              <tr>
                <th>Phone</th>
                <td>{row.phone}</td>
              </tr>
            )}
            {row.topic && (
              <tr>
                <th>Topic</th>
                <td>{row.topic}</td>
              </tr>
            )}
            <tr>
              <th>IP</th>
              <td style={{ color: "var(--body)" }}>{row.ip ?? "—"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="panel">
        <h2>Message</h2>
        <p style={{ whiteSpace: "pre-wrap" }}>{row.message}</p>
      </div>

      <div className="panel">
        <h2>Set status</h2>
        <div className="inline-actions">
          {Object.values(SubmissionStatus).map((st) => (
            <form key={st} action={setSubmissionStatus.bind(null, row.id, st)}>
              <button
                className="btn btn--ghost btn--sm"
                type="submit"
                disabled={st === row.status}
              >
                {st.toLowerCase()}
              </button>
            </form>
          ))}
        </div>
      </div>
    </>
  );
}
