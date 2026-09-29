/**
 * Minimal server-safe HTML sanitizer for CMS/member rich text.
 *
 * The landing page has no DOMPurify dependency; this allowlist-based scrubber
 * runs in Server Components (no DOM APIs) and covers the current
 * `dangerouslySetInnerHTML` call sites (project card teaser, project body,
 * member "about me").
 *
 * TODO: adopt `isomorphic-dompurify` when rich-text needs grow (tables,
 * embeds, pasted Word/Google-Docs markup) and re-audit these call sites.
 */

const ALLOWED_TAGS = new Set([
  "b",
  "i",
  "em",
  "strong",
  "u",
  "s",
  "br",
  "p",
  "span",
  "div",
  "ul",
  "ol",
  "li",
  "a",
  "blockquote",
  "code",
  "pre",
]);

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const isSafeHref = (href: string): boolean => {
  const trimmed = href.trim().toLowerCase();
  return (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("mailto:")
  );
};

/**
 * Strip dangerous markup (scripts, event handlers, javascript: URLs) while
 * keeping a small allowlist of inline formatting tags. Unknown tags are
 * escaped, never passed through.
 */
export function sanitizeHtml(input: unknown): string {
  if (typeof input !== "string" || !input) return "";

  // Remove entire dangerous elements including their content.
  let output = input.replace(
    /<(script|style|iframe|object|embed|form|input|button|link|meta)[^>]*>[\s\S]*?<\/\1\s*>/gi,
    ""
  );
  output = output.replace(/<(script|style|iframe|object|embed|link|meta)[^>]*\/?>/gi, "");

  // Neutralize inline event handlers (`onload=`, `onclick=`, ...) and
  // javascript:/data: URLs before tag filtering.
  output = output.replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  output = output.replace(/(href|src)\s*=\s*"(javascript|data|vbscript):[^"]*"/gi, '$1="#"');
  output = output.replace(/(href|src)\s*=\s*'(javascript|data|vbscript):[^']*'/gi, "$1='#'");
  output = output.replace(/(href|src)\s*=\s*(javascript|data|vbscript):[^\s>]+/gi, '$1="#"');

  // Keep allowlisted tags (with safe attributes only); escape everything else.
  output = output.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g, (match, rawTag: string, rawAttrs: string) => {
    const tag = rawTag.toLowerCase();
    const isClosing = match.startsWith("</");
    if (!ALLOWED_TAGS.has(tag)) return escapeHtml(match);
    if (isClosing) return `</${tag}>`;
    if (tag === "a") {
      const hrefMatch = rawAttrs.match(/href\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/i);
      const href = hrefMatch ? hrefMatch[1].replace(/^['"]|['"]$/g, "") : "";
      return href && isSafeHref(href) ? `<a href="${escapeHtml(href)}">` : "<a>";
    }
    // No attributes are preserved for other tags (class/style dropped).
    return tag === "br" ? "<br>" : `<${tag}>`;
  });

  return output;
}
