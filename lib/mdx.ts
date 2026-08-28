import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import GithubSlugger from "github-slugger";
import { compileMDX } from "next-mdx-remote/rsc";
import type { ReactElement } from "react";

import { Callout } from "@/components/callout";
import { CodeBlock } from "@/components/code-block";
import { Table } from "@/components/table";

export type TocEntry = {
  depth: 2 | 3;
  text: string;
  id: string;
};


/** Strip inline markdown (bold, italic, code, links, images, strikethrough)
 *  from a heading so the TOC shows the same plain text the rendered heading
 *  does — no literal ** or ` characters. */
function plainText(markdown: string): string {
  return markdown
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/~~(.*?)~~/g, "$1")
    .replace(/`([^`]*)`/g, "$1")
    .trim();
}

/** Extract h2/h3 headings from raw markdown, skipping fenced code blocks.
 *  Ids come from github-slugger itself — the same library rehype-slug uses
 *  on the rendered headings (CJK punctuation stripped, duplicates get -1,
 *  -2, …) — so TOC anchors always match. */
export function extractToc(markdown: string): TocEntry[] {
  const slugger = new GithubSlugger();
  const entries: TocEntry[] = [];
  let inFence = false;
  for (const line of markdown.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const match = /^(#{2,3})\s+(.+?)\s*#*$/.exec(line);
    if (match) {
      const text = plainText(match[2]);
      entries.push({ depth: match[1].length as 2 | 3, text, id: slugger.slug(text) });
    }
  }
  return entries;
}

const MDX_COMPONENTS = {
  pre: CodeBlock,
  Callout,
  Table
};

/** Shared MDX pipeline: GFM, math, heading anchors, Shiki syntax
 *  highlighting (build-time, dual light/dark themes resolved via CSS vars),
 *  rich code fences. */
export async function renderMdx(source: string): Promise<ReactElement> {
  const { content } = await compileMDX({
    source,
    components: MDX_COMPONENTS,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkMath],
        rehypePlugins: [
          rehypeKatex,
          rehypeSlug,
          [
            rehypePrettyCode,
            {
              theme: { light: "github-light", dark: "github-dark" },
              keepBackground: false
            }
          ]
        ]
      }
    }
  });
  return content as ReactElement;
}
