import { marked } from "marked";
import path from "node:path";
import { guideUrl } from "./urls";

function resolveGuideLink(href: string, documentSlug: string): string {
  if (!href || href.startsWith("http")) {
    return href;
  }

  const documentDirectory = path.dirname(documentSlug);
  const slug = path
    .normalize(path.join(documentDirectory, href))
    .replace(/\\/g, "/")
    .replace(/\.md$/, "");

  return guideUrl(`library/${slug}`);
}

function findBodyEnd(markdown: string): number {
  const headings = [
    "## Put It Into Practice",
    "## Recommended Next Step",
    "## Related Reading",
  ];

  const positions = headings
    .map((heading) => markdown.indexOf(heading))
    .filter((index) => index !== -1);

  return positions.length > 0 ? Math.min(...positions) : markdown.length;
}

export function renderMarkdown(markdown: string, documentSlug: string): string {
  const renderer = new marked.Renderer();

  renderer.link = ({ href, title, text }) => {
    const resolvedHref = resolveGuideLink(href, documentSlug);
    const titleAttribute = title ? ` title="${title}"` : "";

    return `<a href="${resolvedHref}"${titleAttribute}>${text}</a>`;
  };

  const body = markdown.slice(0, findBodyEnd(markdown)).trim();

  return marked.parse(body, {
    renderer,
  }) as string;
}
