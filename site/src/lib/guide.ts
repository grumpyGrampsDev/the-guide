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

async function walkGuideDirectory(
  section: GuideSection,
): Promise<GuideDocument[]> {
  const entries = await fs.readdir(section.path);

  console.log(entries);

  return [];
}

export async function getAllDocuments(): Promise<GuideDocument[]> {
  const sections = await discoverSections();

  for (const section of sections) {
    await walkGuideDirectory(section);
  }

  return [];
}

export function getDocument(slug: string) {
  // implement this next.
}

export function getSection(section: string) {
  // implement this next.
}
