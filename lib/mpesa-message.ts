/**
 * Best-effort parser for a pasted Safaricom M-Pesa confirmation SMS, e.g.:
 *   "TIA7X2K9LM Confirmed. Ksh2,000.00 paid to WILLARY STEM. on 13/10/26 at
 *   2:45 PM. New M-PESA balance is Ksh500.00. ..."
 * Pure/no I/O — safe to import anywhere.
 */
export interface ParsedMpesaMessage {
  code: string;
  amountKes: number;
  paidAt: Date;
}

export function parseMpesaMessage(raw: string): ParsedMpesaMessage | null {
  const text = raw.replace(/\s+/g, " ").trim();

  const codeMatch = text.match(/\b([A-Z0-9]{8,12})\b\s+Confirmed/i);
  const amountMatch = text.match(/Ksh\s?([\d,]+(?:\.\d{1,2})?)/i);
  const timeMatch = text.match(
    /on\s+(\d{1,2}\/\d{1,2}\/\d{2,4})\s+at\s+(\d{1,2}:\d{2}\s?[AP]M)/i,
  );
  if (!codeMatch || !amountMatch || !timeMatch) return null;

  const code = codeMatch[1].toUpperCase();

  const amountKes = Math.round(parseFloat(amountMatch[1].replace(/,/g, "")));
  if (!Number.isFinite(amountKes) || amountKes <= 0) return null;

  const [, dateStr, timeStr] = timeMatch;
  const [dayStr, monthStr, yearStr] = dateStr.split("/");
  const day = parseInt(dayStr, 10);
  const month = parseInt(monthStr, 10);
  const yearNum = parseInt(yearStr, 10);
  const year = yearStr.length === 2 ? 2000 + yearNum : yearNum;

  const timeParts = timeStr.toUpperCase().match(/(\d{1,2}):(\d{2})\s?(AM|PM)/);
  if (!timeParts) return null;
  let hour = parseInt(timeParts[1], 10);
  const minute = parseInt(timeParts[2], 10);
  const ampm = timeParts[3];
  if (ampm === "PM" && hour < 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;

  // The message gives Africa/Nairobi local time (UTC+3, no DST) regardless of
  // what timezone the server process itself runs in (Vercel runs in UTC) —
  // compute the real UTC instant explicitly rather than relying on the host's
  // local timezone interpretation.
  const EAT_OFFSET_MS = 3 * 60 * 60_000;
  const utcMs = Date.UTC(year, month - 1, day, hour, minute) - EAT_OFFSET_MS;
  const paidAt = new Date(utcMs);
  if (Number.isNaN(paidAt.getTime())) return null;

  return { code, amountKes, paidAt };
}
