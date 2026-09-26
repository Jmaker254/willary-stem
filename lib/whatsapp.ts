/** Build a wa.me click-to-send link. No API involved — opens WhatsApp with the
 * message pre-filled; a person still has to tap send. Safe to import client-side. */
export function waHref(phone: string, text: string): string {
  let digits = (phone || "").replace(/\D/g, "");
  if (digits.startsWith("0")) digits = "254" + digits.slice(1);
  else if (digits.length === 9 && (digits.startsWith("7") || digits.startsWith("1")))
    digits = "254" + digits;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
