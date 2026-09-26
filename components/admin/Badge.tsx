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
  REQUESTED: "is-new",
  PAID: "is-ok",
  FULFILLED: "is-ok",
  AWAITING_PAYMENT: "is-pending",
  PENDING_CONFIRMATION: "is-pending",
  REJECTED: "is-cancelled",
};

export default function Badge({ value }: { value: string }) {
  return <span className={`badge ${MAP[value] ?? "is-read"}`}>{value.toLowerCase()}</span>;
}
