import React from "react";
import { sanitizeHtml } from "@/src/lib/sanitize";

function Content({ content }: any) {
  return (
    <div
      className="prose"
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(content ? `<div>${content}</div>` : "") }}
    />
  );
}

export default Content;
