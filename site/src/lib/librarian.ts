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

export interface GuideDocument {
  title: string;
  slug: string;

  shelf: string;

  type: "document" | "index";

  recommendedNext?: GuideLink;
  relatedReading: GuideLink[];

  content: string;
}

export interface GuideShelf {
  name: string;
  slug: string;
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
  const shelf = slug.split("/")[0];
  const documentType = relativePath.endsWith("README.md")
    ? "index"
    : "document";

  return {
    title: titleMatch?.[1] ?? "Untitled",
    slug,
    shelf,
    type: documentType,
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

  return shelfLocations.map((shelf) => ({
    name: formatGuideTitle(shelf.name),
    slug: shelf.name,
    documents: documents.filter((document) => document.shelf === shelf.name),
  }));
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
