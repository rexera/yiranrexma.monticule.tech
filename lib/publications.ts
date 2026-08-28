import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";

import { getPublicationsContent } from "@/lib/content";
import type { Locale } from "@/lib/locale";
import type { PublicationEntry } from "@/lib/content-types";

const PUBLICATIONS_DIR = path.join(process.cwd(), "content", "publications");

export async function getAllPublicationSlugs(): Promise<string[]> {
  try {
    const files = await readdir(PUBLICATIONS_DIR);
    return files
      .filter((file) => file.toLowerCase().endsWith(".mdx"))
      .map((file) => file.slice(0, -4))
      .sort();
  } catch {
    return [];
  }
}

export type PublicationDetail = {
  entry: PublicationEntry;
  content: string | null;
};

export async function getPublicationDetail(locale: Locale, slug: string): Promise<PublicationDetail | null> {
  const localized = getPublicationsContent();
  const entry = localized[locale].entries.find((item) => item.slug === slug);
  if (!entry) {
    return null;
  }

  try {
    const raw = await readFile(path.join(PUBLICATIONS_DIR, `${slug}.mdx`), "utf8");
    const { content } = matter(raw);
    return { entry, content };
  } catch {
    return { entry, content: null };
  }
}
