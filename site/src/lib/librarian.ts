import fs from "node:fs/promises";
import path from "node:path";

const GUIDE_ROOT = path.resolve(process.cwd(), "..");

// -----------------------------------------------------------------------------
// Interfaces
// -----------------------------------------------------------------------------

export interface GuideDirectory {
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

  type: "document" | "index";

  recommendedNext?: GuideLink;
  relatedReading: GuideLink[];

  content: string;
}

export interface GuideShelf {
  name: string;
  documents: GuideDocument[];
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
  documentSlug: string,
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
  return resolveGuideLink(markdownLink, documentSlug);
}

function extractRelatedReading(
  markdown: string,
  documentSlug: string,
): GuideLink[] {
  const start = markdown.indexOf("## Related Reading");
  const end = markdown.indexOf("## Put It Into Practice");

  if (start === -1) {
    return [];
  }

  const section = markdown.slice(start, end === -1 ? undefined : end);
  const markdownLinks = [...section.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)];

  return markdownLinks.map((match) =>
    resolveGuideLink(
      {
        title: match[1],
        path: match[2],
      },
      documentSlug,
    ),
  );
}

function createGuideDocument(
  relativePath: string,
  markdown: string,
): GuideDocument {
  const titleMatch = markdown.match(/^#\s+(.+)$/m);
  const slug = relativePath.replace(/\.md$/, "");
  const documentType = relativePath.endsWith("README.md")
    ? "index"
    : "document";
  return {
    title: titleMatch?.[1] ?? "Untitled",
    slug,
    type: documentType,
    recommendedNext: extractRecommendedNext(markdown, slug),
    relatedReading: extractRelatedReading(markdown, slug),
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

async function discoverGuideDirectories(): Promise<GuideDirectory[]> {
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

export async function getAllDocuments(
  directories?: GuideDirectory[],
): Promise<GuideDocument[]> {
  const sections = directories ?? (await discoverGuideDirectories());
  const documents: GuideDocument[] = [];

  for (const section of sections) {
    documents.push(...(await walkGuideDirectory(section.path, section.name)));
  }
  return documents;
}

export async function getGuideShelves(): Promise<GuideShelf[]> {
  const directories = await discoverGuideDirectories();
  const documents = await getAllDocuments(directories);

  return directories.map((directory) => ({
    name: directory.name,
    documents: documents.filter((document) =>
      document.slug.startsWith(`${directory.name}/`),
    ),
  }));
}

export async function getDocumentsOnShelf(
  shelf: string,
): Promise<GuideDocument[]> {
  const documents = await getAllDocuments();

  return documents.filter((doc) => doc.slug.startsWith(`${shelf}/`));
}

export async function getDocument(
  slug: string,
): Promise<GuideDocument | undefined> {
  const documents = await getAllDocuments();

  return documents.find((doc) => doc.slug === slug);
}
