/**
 * Normalise a general contact phone number for storage / WhatsApp links.
 * Kenyan local formats are converted to the canonical 254XXXXXXXXX. Anything
 * else is accepted as-is (digits only, country code expected) as long as the
 * length is plausible — this is for contact purposes (WhatsApp, admin
 * follow-up), not M-Pesa.
 *
 * Unlike lib/mpesa.ts `normalizePhone`, this does NOT require a Safaricom
 * number — only flows that actually push an M-Pesa STK prompt need that.
 * Pure/no I/O — safe to import anywhere.
 */
export function normalizeContactPhone(input: string): string | null {
  const digits = (input || "").replace(/\D/g, "");
  if (!digits) return null;

  if (/^0[17]\d{8}$/.test(digits)) return "254" + digits.slice(1);
  if (/^[17]\d{8}$/.test(digits)) return "254" + digits;
  if (/^254[17]\d{8}$/.test(digits)) return digits;

  // General international number (country code + subscriber number).
  if (digits.length >= 8 && digits.length <= 15) return digits;

  return null;
}
