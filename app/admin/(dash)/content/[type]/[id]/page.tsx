import { notFound } from "next/navigation";
import { REGISTRY, prefill, type ContentKey } from "@/lib/admin-registry";
import ContentForm, { type Field } from "@/components/admin/ContentForm";
import { prisma } from "@/lib/db";

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

  const values = isNew
    ? entry.key === "products"
      ? { ...DEFAULTS, status: "AVAILABLE" }
      : DEFAULTS
    : prefill(entry.key, row);
  const boundSave = entry.save.bind(null, isNew ? null : id);

  // Products link to an admin-managed category table; populate the select from
  // the DB (the registry's `fields` array is static). Mirrors `prefill`.
  let fields: Field[] = entry.fields;
  if (entry.key === "products") {
    const cats = await prisma.productCategory.findMany({
      orderBy: [{ order: "asc" }, { name: "asc" }],
    });
    const options = [
      { value: "", label: "— No category —" },
      ...cats.map((c) => ({ value: c.id, label: c.name })),
    ];
    fields = entry.fields.map((f) =>
      f.name === "categoryId" && f.type === "select" ? { ...f, options } : f,
    );
  }

  return (
    <>
      <h1>
        {isNew ? `New ${entry.singular}` : `Edit ${entry.singular}`}
      </h1>
      <ContentForm
        action={boundSave}
        fields={fields}
        values={values}
        backHref={`/admin/content/${type}`}
        title={entry.plural}
      />
    </>
  );
}
