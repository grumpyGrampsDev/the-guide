import fs from "node:fs/promises";
import path from "node:path";

const GUIDE_ROOT = path.resolve(process.cwd(), "..");

export interface GuideDocument {
  title: string;
  slug: string;
  section: string;
  content: string;
}

export async function getAllDocuments(): Promise<GuideDocument[]> {
  const introductionPath = path.join(GUIDE_ROOT, "introduction");

  const entries = await fs.readdir(introductionPath);

  console.log(entries);

  return [];
}

export function getDocument(slug: string) {
  // implement this next.
}

export function getSection(section: string) {
  // implement this next.
}
