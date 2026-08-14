import fs from "node:fs/promises";
import path from "node:path";
import { renderMarkdown } from "./markdown";
import { LIBRARIAN_CONCEPTS } from "./librarian-concepts";

const GUIDE_ROOT = path.resolve(process.cwd(), "..");

const SHELF_METADATA = {
  introduction: {
    order: 10,
  },

  "reading-path": {
    order: 20,
  },

  "reading-scripture": {
    order: 30,
  },

  journaling: {
    order: 40,
  },

  prayer: {
    order: 50,
  },

  formation: {
    order: 60,
  },

  "field-notes": {
    order: 70,
  },

  "stones-of-remembrance": {
    order: 80,
  },

  walking: {
    order: 90,
  },
} as const;

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
  html: string;
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

export interface GuideLibrary {
  introduction: GuideDocument;
  shelves: GuideShelf[];
}

export interface guideRecommendation {
  document: GuideDocument;
  score: number;
  excerpt: string;
}

export interface LibrarianSuggestion {
  suggestion: string;
  description: string;
  documents: string[];
}

export interface LibrarianSearchResult {
  suggestion?: LibrarianSuggestion;
  recommended: guideRecommendation[];
  results: guideRecommendation[];
}

export interface GuideShelf {
  name: string;
  slug: string;
  order: number;
  description?: string;
  readme?: GuideDocument;
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

async function readLibraryIntroduction(): Promise<string> {
  return await readMarkdownFile(path.join(GUIDE_ROOT, "LIBRARY.md"));
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

function extractPutIntoPractice(
  markdown: string,
  documentSlug: string,
): PutIntoPractice | undefined {
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
    html: renderMarkdown(section, documentSlug),
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
    putIntoPractice: extractPutIntoPractice(markdown, slug),
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

function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function createSearchExcerpt(content: string, terms: string[]): string {
  const normalizedContent = content.replace(/\s+/g, " ").trim();

  const lowerContent = normalizedContent.toLowerCase();

  const firstMatch = terms
    .map((term) => lowerContent.indexOf(term))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0];

  if (firstMatch === undefined) {
    return normalizedContent.slice(0, 160);
  }

  const start = Math.max(firstMatch - 60, 0);
  const excerpt = normalizedContent.slice(start, start + 220);

  return `${start > 0 ? "..." : ""}${excerpt}${
    start + 220 < normalizedContent.length ? "..." : ""
  }`;
}

function isSearchableTerm(term: string): boolean {
  return term.length >= 4;
}

function findLibrarianConcept(query: string): LibrarianSuggestion | undefined {
  const normalizedQuery = normalizeSearchText(query);

  const concept = LIBRARIAN_CONCEPTS.find((concept) =>
    concept.terms.some((term) =>
      normalizedQuery.includes(normalizeSearchText(term)),
    ),
  );

  if (!concept) {
    return undefined;
  }

  return {
    suggestion: concept.suggestion,
    description: concept.description,
    documents: concept.documents,
  };
}

function getConceptDocuments(
  conceptDocuments: string[],
  documents: GuideDocument[],
): guideRecommendation[] {
  return documents
    .filter((document) => conceptDocuments.includes(document.slug))
    .map((document) => ({
      document,
      score: 100,
      excerpt: createSearchExcerpt(document.content, []),
    }));
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

  return entries
    .filter(
      (entry) =>
        entry.isDirectory() &&
        !entry.name.startsWith(".") &&
        entry.name !== "site",
    )
    .map((entry) => ({
      name: entry.name,
      path: path.join(GUIDE_ROOT, entry.name),
    }));
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

export async function searchLibrary(
  query: string,
): Promise<LibrarianSearchResult> {
  const documents = await getLibraryDocuments();
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return {
      recommended: [],
      results: [],
    };
  }

  const suggestion = findLibrarianConcept(query);
  const recommended = suggestion
    ? getConceptDocuments(suggestion.documents, documents)
    : [];

  const terms = normalizedQuery.split(" ");
  const results = documents
    .map((document) => {
      const title = normalizeSearchText(document.title);
      const content = normalizeSearchText(document.content);

      let score = 0;

      if (title.includes(normalizedQuery)) {
        score += 100;
      }
      if (content.includes(normalizedQuery)) {
        score += 20;
      }

      for (const term of terms.filter(isSearchableTerm)) {
        if (title.includes(term)) {
          score += 20;
        }

        if (content.includes(term)) {
          const matchingTerms = terms.filter((term) => content.includes(term));

          score += matchingTerms.length * 2;
        }
      }
      if (document.type === "document") {
        score += 2;
      }
      if (document.type === "index") {
        score -= 2;
      }

      return {
        document,
        score,
        excerpt: createSearchExcerpt(document.content, terms),
      };
    })
    .filter((result) => result.score > 10)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  return {
    suggestion,
    recommended,
    results,
  };
}

export async function getGuideShelves(): Promise<GuideShelf[]> {
  const shelfLocations = await discoverShelfLocations();
  const documents = await getLibraryDocuments(shelfLocations);
  const shelves: GuideShelf[] = [];

  for (const shelf of shelfLocations) {
    const readme = await readShelfReadme(shelf.path);
    const metadata = SHELF_METADATA[shelf.name as keyof typeof SHELF_METADATA];

    if (!metadata) {
      throw new Error(`No metadata defined for shelf "${shelf.name}".`);
    }

    const shelfDocuments = documents.filter(
      (document) => document.shelf === shelf.name,
    );
    const shelfReadme = shelfDocuments.find(
      (document) => document.type === "index",
    );
    const shelfBooks = shelfDocuments.filter(
      (document) => document.type === "document",
    );

    shelves.push({
      name: formatGuideTitle(shelf.name),
      slug: shelf.name,
      order: metadata.order,
      description: readme ? extractShelfDescription(readme) : undefined,
      documents: shelfBooks,
      readme: shelfReadme,
    });
  }

  shelves.sort((a, b) => a.order - b.order);

  return shelves;
}

export async function getLibrary(): Promise<GuideLibrary> {
  const shelves = await getGuideShelves();

  const introduction = createGuideDocument(
    "LIBRARY.md",
    await readLibraryIntroduction(),
  );

  return {
    introduction,
    shelves,
  };
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
