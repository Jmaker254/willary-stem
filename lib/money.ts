/** Format a whole-shilling integer as `KES 1,234`. */
export function formatKes(n: number): string {
  return `KES ${Math.round(n).toLocaleString("en-KE")}`;
}
