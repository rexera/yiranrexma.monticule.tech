import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { compileMDX } from "next-mdx-remote/rsc";
import type { Root as HastRoot, Element, RootContent } from "hast";
import type { Parent, Root } from "mdast";
import type { ReactElement } from "react";
import type { Plugin } from "unified";

import { Callout } from "@/components/callout";
import { CodeBlock } from "@/components/code-block";
import { Figure } from "@/components/figure";
import { Table } from "@/components/table";
import { DEFAULT_LOCALE, type Locale } from "@/lib/locale";
import { remarkSmartQuotes, smartQuotes } from "@/lib/smart-quotes";

export type TocEntry = {
  depth: 2 | 3;
  text: string;
  /** Section anchor — `s2` for the second h2, `s2-1` for the first h3 under
   *  it. Numbered from the document's own structure, so it needs no parsing
   *  of the heading text and comes out the same in both locales. */
  id: string;
};

/** Where the numbering has got to while walking a document's headings. */
type SectionNumbering = { major: number; minor: number };

/** The anchor for one heading: the h2 count up to here, plus the h3's own
 *  position inside its parent. */
function sectionAnchor(depth: 2 | 3, numbering: SectionNumbering) {
  if (depth === 2) {
    numbering.major += 1;
    numbering.minor = 0;
    return `s${numbering.major}`;
  }
  numbering.minor += 1;
  return `s${numbering.major || 1}-${numbering.minor}`;
}


/** Strip inline markdown (bold, italic, code, links, images, strikethrough)
 *  from a heading so the TOC shows the same plain text the rendered heading
 *  does — no literal ** or ` characters. Quotes get the same treatment the
 *  body does, so the TOC and the heading read identically. */
function plainText(markdown: string): string {
  return smartQuotes(
    markdown
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/(\*\*|__)(.*?)\1/g, "$2")
      .replace(/(\*|_)(.*?)\1/g, "$2")
      .replace(/~~(.*?)~~/g, "$1")
      .replace(/`([^`]*)`/g, "$1")
      .trim()
  );
}

/** Extract h2/h3 headings from raw markdown, skipping fenced code blocks.
 *  Each entry is addressed by the section number its heading carries, which
 *  is what `rehypeSectionAnchors` puts on the rendered heading too, so TOC
 *  links, heading permalinks and the language switcher all agree. */
export function extractToc(markdown: string): TocEntry[] {
  const entries: TocEntry[] = [];
  const numbering: SectionNumbering = { major: 0, minor: 0 };
  let inFence = false;
  for (const line of markdown.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const match = /^(#{2,3})\s+(.+?)\s*#*$/.exec(line);
    if (match) {
      const depth = match[1].length as 2 | 3;
      entries.push({
        depth,
        text: plainText(match[2]),
        id: sectionAnchor(depth, numbering)
      });
    }
  }
  return entries;
}

const MDX_COMPONENTS = {
  pre: CodeBlock,
  img: Figure,
  Callout,
  Table
};
/** A standalone markdown image (`![alt](src)`) parses to a paragraph whose
 *  only child is the image. The caption path renders a <figure>, and <p>
 *  cannot contain <figure>: browsers auto-close the paragraph, so React sees
 *  server and client markup disagree and reports a hydration mismatch on
 *  every page load. Lift the image out of its paragraph so it sits at the
 *  top level of the article; images that share a paragraph with other
 *  content stay where they are. */
const remarkUnwrapImages: Plugin<[], Root> = () => (tree) => {
  const unwrap = (parent: Parent) => {
    parent.children = parent.children.map((child) => {
      if (
        child.type === "paragraph" &&
        child.children.length === 1 &&
        child.children[0].type === "image"
      ) {
        return child.children[0];
      }
      if ("children" in child) unwrap(child);
      return child;
    });
  };
  unwrap(tree);
};

/** rehype-pretty-code hangs a fence's language on the inner <code>, but the
 *  <pre> override is a client component: React hands a client component its
 *  server-rendered children as unresolved lazy nodes, so a language read out
 *  of them is missing during SSR and only turns up once the client renders.
 *  The header label then hydrates from "text" to the real language, which
 *  React reports as a mismatch. Copy the language onto the <pre> itself,
 *  where it reaches the component as an ordinary prop on both sides. */
const rehypePreLanguage: Plugin<[], HastRoot> = () => (tree) => {
  const visit = (node: HastRoot | RootContent) => {
    if (node.type === "element" && node.tagName === "pre") {
      const code = node.children.find(
        (child): child is Element => child.type === "element" && child.tagName === "code"
      );
      const language = code?.properties.dataLanguage;
      if (typeof language === "string") node.properties.dataLanguage = language;
    }
    if ("children" in node) node.children.forEach(visit);
  };
  visit(tree);
};

/** Locale-independent anchors. Heading ids come from the heading text, so
 *  `#四事物发展规律` and `#4-the-laws-of-development` are different targets
 *  for the same section, and the Chinese one is unreadable in a URL bar. So
 *  the heading's id becomes its section number (`s4`, `s4-2`), which is the
 *  same in both locales — the numbering is visible in the headings
 *  themselves. The slug rehype-slug made is moved to a span inside the
 *  heading, where links shared before this scheme still land on it. */
const rehypeSectionAnchors: Plugin<[], HastRoot> = () => (tree) => {
  const numbering: SectionNumbering = { major: 0, minor: 0 };
  const visit = (node: HastRoot | RootContent) => {
    if (node.type === "element" && (node.tagName === "h2" || node.tagName === "h3")) {
      const anchor = sectionAnchor(node.tagName === "h2" ? 2 : 3, numbering);
      const slug = typeof node.properties.id === "string" ? node.properties.id : undefined;
      node.properties.id = anchor;
      node.properties["data-s"] = anchor;
      node.children.unshift({
        type: "element",
        tagName: "span",
        properties: { id: slug, className: ["section-anchor"], ariaHidden: "true" },
        children: []
      });
    }
    if ("children" in node) node.children.forEach(visit);
  };
  visit(tree);
};

/** Name of the per-heading permalink, for the accessible label and tooltip.
 *  Chinese takes a full-width colon. */
const SECTION_LINK: Record<Locale, { title: string; label: (heading: string) => string }> = {
  en: {
    title: "Link to this section",
    label: (heading) => `Link to this section: ${heading}`
  },
  zh: {
    title: "链接到本节",
    label: (heading) => `链接到本节：${heading}`
  }
};

/** Plain text of a heading — inline code and emphasis included, anchor spans
 *  not, since those are empty. */
function headingText(node: Element): string {
  let text = "";
  const collect = (child: Element | RootContent) => {
    if (child.type === "text") text += child.value;
    if ("children" in child) child.children.forEach(collect);
  };
  node.children.forEach(collect);
  return text.trim();
}

/** Shared MDX pipeline: GFM, math, heading anchors, typographic quotes,
 *  Shiki syntax highlighting (build-time, dual light/dark themes resolved
 *  via CSS vars), rich code fences. */
export async function renderMdx(source: string, locale: Locale = DEFAULT_LOCALE): Promise<ReactElement> {
  const { content } = await compileMDX({
    source,
    components: MDX_COMPONENTS,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkMath, remarkSmartQuotes, remarkUnwrapImages],
        rehypePlugins: [
          rehypeKatex,
          rehypeSlug,
          [
            rehypePrettyCode,
            {
              theme: { light: "github-light", dark: "github-dark" },
              keepBackground: false
            }
          ],
          rehypePreLanguage,
          rehypeSectionAnchors,
          [
            rehypeAutolinkHeadings,
            {
              // The `#` a reader can click to get a link to that section: it
              // trails the heading text (the GitBook arrangement), hidden
              // until the heading is hovered or the link focused. The href
              // comes out as the heading's own id, i.e. `#s4` or `#s4-2`.
              behavior: "append",
              content: { type: "text", value: "#" },
              properties: (heading: Element) => ({
                className: ["heading-anchor"],
                ariaLabel: SECTION_LINK[locale].label(headingText(heading)),
                title: SECTION_LINK[locale].title
              })
            }
          ]
        ]
      }
    }
  });
  return content as ReactElement;
}
