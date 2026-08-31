import { notFound } from "next/navigation";
import { REGISTRY, prefill, type ContentKey } from "@/lib/admin-registry";
import ContentForm from "@/components/admin/ContentForm";

export const dynamic = "force-dynamic";

const DEFAULTS: Record<string, unknown> = {
  published: true,
  featured: false,
  order: 0,
  category: "ROBOT",
  status: "UPCOMING",
  group: "home",
};

export default async function ContentEdit({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = await params;
  if (!(type in REGISTRY)) notFound();
  const entry = REGISTRY[type as ContentKey];
  const isNew = id === "new";

  const row = isNew ? null : await entry.find(id);
  if (!isNew && !row) notFound();

  const values = isNew ? DEFAULTS : prefill(entry.key, row);
  const boundSave = entry.save.bind(null, isNew ? null : id);

  return (
    <>
      <h1>
        {isNew ? `New ${entry.singular}` : `Edit ${entry.singular}`}
      </h1>
      <ContentForm
        action={boundSave}
        fields={entry.fields}
        values={values}
        backHref={`/admin/content/${type}`}
        title={entry.plural}
      />
    </>
  );
}
