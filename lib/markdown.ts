import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: true });

/**
 * Minimal, dependency-free HTML sanitiser: strips <script>/<style>, event
 * handler attributes, and javascript: URLs. The markdown authors are trusted
 * staff, so this is defence-in-depth rather than the primary control.
 */
function sanitize(html: string): string {
  return html
    .replace(/<\/?(script|style|iframe|object|embed)\b[^>]*>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/(href|src)\s*=\s*("|')\s*javascript:[^"']*\2/gi, '$1="#"');
}

export function renderMarkdown(md: string | null | undefined): string {
  if (!md) return "";
  return sanitize(marked.parse(md, { async: false }) as string);
}
