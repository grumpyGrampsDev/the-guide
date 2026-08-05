import fs from "node:fs/promises";
import path from "node:path";

const GUIDE_ROOT = path.resolve(process.cwd(), "..");

export interface GuideSection {
  name: string;
  path: string;
}

export interface GuideDocument {
  title: string;
  slug: string;
  content: string;
}

async function readMarkdownFile(filePath: string): Promise<string> {
  return await fs.readFile(filePath, "utf-8");
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

export async function getAllDocuments(): Promise<GuideDocument[]> {
  const sections = await discoverSections();

  const documents: GuideDocument[] = [];

  for (const section of sections) {
    documents.push(...(await walkGuideDirectory(section.path, section.name)));
  }
  return documents;
}

export async function getDocument(slug: string) {
  // implement this next.
}

export async function getSection(section: string) {
  // implement this next.
}
