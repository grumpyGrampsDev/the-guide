import fs from "node:fs/promises";
import path from "node:path";

const GUIDE_ROOT = path.resolve(process.cwd(), "..");

export interface GuideDocument {
  title: string;
  slug: string;
  section: string;
  content: string;
}

async function readMarkdownFile(filePath: string): Promise<string> {
  return await fs.readFile(filePath, "utf-8");
}

function createGuideDocument(
  section: string,
  filename: string,
  markdown: string,
): GuideDocument {
  const titleMatch = markdown.match(/^#\s+(.+)$/m);

  return {
    title: titleMatch?.[1] ?? "Untitled",
    slug: filename.replace(/\.md$/, ""),
    section,
    content: markdown,
  };
}

export async function getAllDocuments(): Promise<GuideDocument[]> {
  const introductionPath = path.join(GUIDE_ROOT, "introduction");

  const entries = await fs.readdir(introductionPath);

  const firstFile = entries[0];

  const fullPath = path.join(introductionPath, firstFile);

  const content = await readMarkdownFile(fullPath);
  const guideDocument = createGuideDocument("introduction", firstFile, content);

  console.log(guideDocument);

  return [];
}

export function getDocument(slug: string) {
  // implement this next.
}

export function getSection(section: string) {
  // implement this next.
}
