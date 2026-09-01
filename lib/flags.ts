/**
 * Runtime feature flags. Server-only reads of process.env.
 */

/**
 * Whether Build Fest 2026 ticket sales are open. While false (default), all
 * ticket / register CTAs show a "coming soon" message instead of the payment
 * flow. Set `TICKETS_LIVE=true` once Safaricom Daraja credentials are wired up.
 */
export function ticketsLive(): boolean {
  return process.env.TICKETS_LIVE === "true";
}

export const TICKETS_COMING_SOON_MESSAGE =
  "Ticket sales open soon — check back shortly!";
