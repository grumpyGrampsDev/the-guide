import fs from "node:fs/promises";
import path from "node:path";

const GUIDE_ROOT = path.resolve(process.cwd(), "..");

const OUTPUT_PATH = path.resolve(process.cwd(), "public/search-index.json");

interface SearchIndexEntry {
  title: string;
  slug: string;
  shelf: string;
  searchText: string;
  excerpt: string;
}

async function readMarkdownFile(filePath: string): Promise<string> {
  return await fs.readFile(filePath, "utf-8");
}

function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTitle(markdown: string): string {
  const match = markdown.match(/^#\s+(.+)$/m);

  return match?.[1] ?? "Untitled";
}

function createExcerpt(markdown: string): string {
  return markdown
    .replace(/^#.*$/gm, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 220);
}

async function collectMarkdownFiles(
  directory: string,
  relativePath = "",
): Promise<SearchIndexEntry[]> {
  const entries = await fs.readdir(directory, {
    withFileTypes: true,
  });

  const documents: SearchIndexEntry[] = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (entry.name.startsWith(".")) {
        continue;
      }

      documents.push(
        ...(await collectMarkdownFiles(
          path.join(directory, entry.name),
          path.join(relativePath, entry.name),
        )),
      );

      continue;
    }

    if (!entry.name.endsWith(".md")) {
      continue;
    }

    const filePath = path.join(directory, entry.name);
    const markdown = await readMarkdownFile(filePath);

    const slug = path
      .join(relativePath, entry.name)
      .replace(/\.md$/, "")
      .replace(/\\/g, "/");

    documents.push({
      title: extractTitle(markdown),
      slug,
      shelf: slug.split("/")[0],
      searchText: normalizeSearchText(markdown),
      excerpt: createExcerpt(markdown),
    });
  }

  return documents;
}

async function generateSearchIndex() {
  const catalog = await collectMarkdownFiles(GUIDE_ROOT);

  await fs.writeFile(OUTPUT_PATH, JSON.stringify(catalog, null, 2), "utf-8");

  console.log(`Generated search index with ${catalog.length} documents.`);
}

generateSearchIndex();
