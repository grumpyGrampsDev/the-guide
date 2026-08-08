import fs from "node:fs/promises";
import path from "node:path";

const GUIDE_ROOT = path.resolve(process.cwd(), "..");

// -----------------------------------------------------------------------------
// Interfaces
// -----------------------------------------------------------------------------

interface GuideShelfLocation {
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

export interface RecommendedNext {
  link: GuideLink;
  description: string;
}

export interface PutIntoPractice {
  content: string;
}

export interface GuideDocument {
  title: string;
  slug: string;

  shelf: string;

  type: "document" | "index";

  putIntoPractice?: PutIntoPractice;

  recommendedNext?: RecommendedNext;
  relatedReading: GuideLink[];

  content: string;
}

export interface GuideShelf {
  name: string;
  slug: string;

  description?: string;

  documents: GuideDocument[];
}

// -----------------------------------------------------------------------------
// Internal helpers
// -----------------------------------------------------------------------------

async function readMarkdownFile(filePath: string): Promise<string> {
  return await fs.readFile(filePath, "utf-8");
}

async function readShelfReadme(shelfPath: string): Promise<string | undefined> {
  try {
    return await readMarkdownFile(path.join(shelfPath, "README.md"));
  } catch {
    return undefined;
  }
}

function extractShelfDescription(markdown: string): string | undefined {
  const paragraphs = markdown
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  for (const paragraph of paragraphs) {
    if (!paragraph.startsWith("#")) {
      return paragraph;
    }
  }

  return undefined;
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
): RecommendedNext | undefined {
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

  const description = section
    .replace("## Recommended Next Step", "")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/, "$1")
    .trim();

  return {
    link: resolveGuideLink(markdownLink, documentSlug),
    description,
  };
}

function extractRelatedReading(
  markdown: string,
  documentSlug: string,
): GuideLink[] {
  const start = markdown.indexOf("## Related Reading");

  if (start === -1) {
    return [];
  }

  const section = markdown.slice(start);
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

function extractPutIntoPractice(markdown: string): PutIntoPractice | undefined {
  const start = markdown.indexOf("## Put It Into Practice");

  if (start === -1) {
    return undefined;
  }

  const end = markdown.indexOf("## Recommended Next Step", start);

  const section = markdown
    .slice(start, end === -1 ? undefined : end)
    .replace("## Put It Into Practice", "")
    .trim();

  return {
    content: section,
  };
}

function createGuideDocument(
  relativePath: string,
  markdown: string,
): GuideDocument {
  const titleMatch = markdown.match(/^#\s+(.+)$/m);
  const slug = relativePath.replace(/\.md$/, "");
  const shelf = slug.split("/")[0];
  const documentType = relativePath.endsWith("README.md")
    ? "index"
    : "document";

  return {
    title: titleMatch?.[1] ?? "Untitled",
    slug,
    shelf,
    type: documentType,
    putIntoPractice: extractPutIntoPractice(markdown),
    recommendedNext: extractRecommendedNext(markdown, slug),
    relatedReading: extractRelatedReading(markdown, slug),
    content: markdown,
  };
}

function formatGuideTitle(value: string): string {
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .replace(/\bOf\b/g, "of")
    .replace(/\bThe\b/g, "the");
}

/**
 * Walks a Guide directory recursively and returns every Markdown document.
 */

async function collectShelfDocuments(
  directoryPath: string,
  relativePath: string,
): Promise<GuideDocument[]> {
  const entries = await fs.readdir(directoryPath, {
    withFileTypes: true,
  });

  const documents: GuideDocument[] = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const nestedDocuments = await collectShelfDocuments(
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

async function discoverShelfLocations(): Promise<GuideShelfLocation[]> {
  const entries = await fs.readdir(GUIDE_ROOT, {
    withFileTypes: true,
  });
  const shelves = entries
    .filter(
      (entry) =>
        entry.isDirectory() && entry.name !== ".git" && entry.name !== "site",
    )
    .map((entry) => ({
      name: entry.name,
      path: path.join(GUIDE_ROOT, entry.name),
    }));
  return shelves;
}

// -----------------------------------------------------------------------------
// Public API
// -----------------------------------------------------------------------------

export async function getLibraryDocuments(
  shelves?: GuideShelfLocation[],
): Promise<GuideDocument[]> {
  const shelfLocations = shelves ?? (await discoverShelfLocations());
  const documents: GuideDocument[] = [];

  for (const shelf of shelfLocations) {
    documents.push(...(await collectShelfDocuments(shelf.path, shelf.name)));
  }
  return documents;
}

export async function getGuideShelves(): Promise<GuideShelf[]> {
  const shelfLocations = await discoverShelfLocations();
  const documents = await getLibraryDocuments(shelfLocations);
  const shelves: GuideShelf[] = [];

  for (const shelf of shelfLocations) {
    const readme = await readShelfReadme(shelf.path);

    shelves.push({
      name: formatGuideTitle(shelf.name),
      slug: shelf.name,
      description: readme ? extractShelfDescription(readme) : undefined,
      documents: documents.filter((document) => document.shelf === shelf.name),
    });
  }

  return shelves;
}

export async function getDocumentsOnShelf(
  shelfSlug: string,
): Promise<GuideDocument[]> {
  const documents = await getLibraryDocuments();

  return documents.filter((document) => document.shelf === shelfSlug);
}

export async function getShelf(
  shelfSlug: string,
): Promise<GuideShelf | undefined> {
  const shelves = await getGuideShelves();

  return shelves.find((shelf) => shelf.slug === shelfSlug);
}

export async function getDocument(
  slug: string,
): Promise<GuideDocument | undefined> {
  const documents = await getLibraryDocuments();

  return documents.find((doc) => doc.slug === slug);
}
