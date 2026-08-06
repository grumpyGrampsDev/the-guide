import fs from "node:fs/promises";
import path from "node:path";

const GUIDE_ROOT = path.resolve(process.cwd(), "..");

export interface GuideSection {
  name: string;
  path: string;
}
export interface MarkdownLink {
  title: string;
  path: string;
}
export interface GuideLink {
  title: string;
  slug: string;
}
export interface GuideDocument {
  title: string;
  slug: string;

  recommendedNext?: GuideLink;

  relatedReading: GuideLink[];

  content: string;
}

// -----------------------------------------------------------------------------
// Internal helpers
// -----------------------------------------------------------------------------

async function readMarkdownFile(filePath: string): Promise<string> {
  return await fs.readFile(filePath, "utf-8");
}

function extractMarkdownLink(section: string): MarkdownLink | undefined {
  const linkMatch = section.match(/\[([^\]]+)\]\(([^)]+)\)/);

  if (!linkMatch) {
    return undefined;
  }
  return {
    title: linkMatch[1],
    path: linkMatch[2],
  };
}

function resolveGuideLink(
  markdownLink: MarkdownLink,
  documentSlug: string,
): GuideLink {
  const documentDirectory = path.dirname(documentSlug);

  const slug = path
    .normalize(path.join(documentDirectory, markdownLink.path))
    .replace(/\\/g, "/")
    .replace(/\.md$/, "");

  return {
    title: markdownLink.title,
    slug,
  };
}

function extractRecommendedNext(
  markdown: string,
  documentPath: string,
): GuideLink | undefined {
  const start = markdown.indexOf("## Recommended Next Step");
  const end = markdown.indexOf("## Related Reading");

  if (start === -1) {
    return undefined;
  }

  const section = markdown.slice(start, end === -1 ? undefined : end);
  const markdownLink = extractMarkdownLink(section);

  if (!markdownLink) {
    return undefined;
  }
  return resolveGuideLink(markdownLink, documentPath);
}

function createGuideDocument(
  relativePath: string,
  markdown: string,
): GuideDocument {
  const titleMatch = markdown.match(/^#\s+(.+)$/m);
  const slug = relativePath.replace(/\.md$/, "");

  return {
    title: titleMatch?.[1] ?? "Untitled",
    slug,
    recommendedNext: extractRecommendedNext(markdown, slug),
    relatedReading: [],
    content: markdown,
  };
}

/**
 * Walks a Guide directory recursively and returns every Markdown document.
 */

async function walkGuideDirectory(
  directoryPath: string,
  relativePath: string,
): Promise<GuideDocument[]> {
  const entries = await fs.readdir(directoryPath, {
    withFileTypes: true,
  });

  const documents: GuideDocument[] = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const nestedDocuments = await walkGuideDirectory(
        path.join(directoryPath, entry.name),
        path.join(relativePath, entry.name),
      );
      documents.push(...nestedDocuments);
      continue;
    }
    if (!entry.name.endsWith(".md")) {
      continue;
    }
    const markdown = await readMarkdownFile(
      path.join(directoryPath, entry.name),
    );
    documents.push(
      createGuideDocument(path.join(relativePath, entry.name), markdown),
    );
  }

  return documents;
}

async function discoverSections(): Promise<GuideSection[]> {
  const entries = await fs.readdir(GUIDE_ROOT, {
    withFileTypes: true,
  });
  const sections = entries
    .filter(
      (entry) =>
        entry.isDirectory() && entry.name !== ".git" && entry.name !== "site",
    )
    .map((entry) => ({
      name: entry.name,
      path: path.join(GUIDE_ROOT, entry.name),
    }));
  return sections;
}

// -----------------------------------------------------------------------------
// Public API
// -----------------------------------------------------------------------------

export async function getAllDocuments(): Promise<GuideDocument[]> {
  const sections = await discoverSections();
  const documents: GuideDocument[] = [];

  for (const section of sections) {
    documents.push(...(await walkGuideDirectory(section.path, section.name)));
  }
  return documents;
}

export async function getDocument(slug: string) {
  const documents = await getAllDocuments();

  return documents.find((doc) => doc.slug === slug);
}

export async function getSection(section: string) {
  const documents = await getAllDocuments();

  return documents.filter((doc) => doc.slug.startsWith(`${section}/`));
}
