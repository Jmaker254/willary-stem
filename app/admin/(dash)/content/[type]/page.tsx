import Link from "next/link";
import { notFound } from "next/navigation";
import { REGISTRY, type ContentKey } from "@/lib/admin-registry";
import {
  deleteRow,
  togglePublished,
  nudgeOrder,
} from "@/actions/admin/content";
import ConfirmButton from "@/components/admin/ConfirmButton";

export const dynamic = "force-dynamic";

export default async function ContentList({
  params,
  searchParams,
}: {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { type } = await params;
  const { saved } = await searchParams;
  if (!(type in REGISTRY)) notFound();
  const entry = REGISTRY[type as ContentKey];
  const rows = await entry.list();

  return (
    <>
      <div className="admin-topbar">
        <h1>{entry.plural}</h1>
        <Link className="btn btn--primary btn--sm" href={`/admin/content/${type}/new`}>
          + New {entry.singular}
        </Link>
      </div>

      {saved && <div className="panel" style={{ borderColor: "var(--ok)" }}>Saved.</div>}

      <div className="panel">
        {rows.length === 0 ? (
          <p>Nothing here yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                {entry.columns.map((c) => (
                  <th key={c.header}>{c.header}</th>
                ))}
                <th>Order</th>
                {entry.canPublish && <th>Published</th>}
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const id = String(row.id);
                return (
                  <tr key={id}>
                    {entry.columns.map((c) => (
                      <td key={c.header}>
                        <Link href={`/admin/content/${type}/${id}`}>{c.get(row) || "—"}</Link>
                      </td>
                    ))}
                    <td>
                      <span className="inline-actions">
                        {String(row.order ?? 0)}
                        <form action={nudgeOrder.bind(null, entry.model, id, -1)}>
                          <button className="btn-link" type="submit" aria-label="Move up">
                            ▲
                          </button>
                        </form>
                        <form action={nudgeOrder.bind(null, entry.model, id, 1)}>
                          <button className="btn-link" type="submit" aria-label="Move down">
                            ▼
                          </button>
                        </form>
                      </span>
                    </td>
                    {entry.canPublish && (
                      <td>
                        <form
                          action={togglePublished.bind(
                            null,
                            entry.model as Exclude<typeof entry.model, "siteStat">,
                            id,
                            !row.published,
                          )}
                        >
                          <button className="btn-link" type="submit">
                            {row.published ? "Yes" : "No"}
                          </button>
                        </form>
                      </td>
                    )}
                    <td>
                      <form action={deleteRow.bind(null, entry.model, id)}>
                        <ConfirmButton
                          className="btn-link"
                          message={`Delete this ${entry.singular}?`}
                        >
                          Delete
                        </ConfirmButton>
                      </form>
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
