import { marked } from "marked";
import path from "node:path";

function resolveGuideLink(href: string, documentSlug: string): string {
  if (!href || href.startsWith("http")) {
    return href;
  }

  const documentDirectory = path.dirname(documentSlug);

  const slug = path
    .normalize(path.join(documentDirectory, href))
    .replace(/\\/g, "/")
    .replace(/\.md$/, "");

  return `/library/${slug}`;
}

export function renderMarkdown(markdown: string, documentSlug: string): string {
  const renderer = new marked.Renderer();

  renderer.link = ({ href, title, text }) => {
    const resolvedHref = resolveGuideLink(href, documentSlug);

    const titleAttribute = title ? ` title="${title}"` : "";

    return `<a href="${resolvedHref}"${titleAttribute}>${text}</a>`;
  };

  return marked.parse(markdown, {
    renderer,
  }) as string;
}
