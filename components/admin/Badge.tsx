const MAP: Record<string, string> = {
  NEW: "is-new",
  READ: "is-read",
  ARCHIVED: "is-archived",
  SPAM: "is-spam",
  PENDING: "is-pending",
  CONFIRMED: "is-ok",
  ACTIVE: "is-ok",
  WAITLIST: "is-pending",
  CANCELLED: "is-cancelled",
  UNSUBSCRIBED: "is-archived",
};

export default function Badge({ value }: { value: string }) {
  return <span className={`badge ${MAP[value] ?? "is-read"}`}>{value.toLowerCase()}</span>;
}
