/**
 * Typographic quotes, applied when content renders.
 *
 * Source files stay plain ASCII ("dull" quotes and apostrophes); this turns
 * them into curly ones on the way out, so a post reads the same however it
 * was typed. It runs over every content layer that ends up on the page:
 * MDX bodies (`renderMdx`), blog frontmatter (`lib/blog.ts`), and the JSON
 * copy (`lib/content.ts`).
 *
 * Off-the-shelf typographers (smartypants and friends) decide open vs. close
 * from Latin word boundaries, which misfires on Chinese: in `但"你的长尾"`
 * both marks follow a letter-like character, so both come out as closing
 * quotes. Here, when neither side is a boundary the marks simply alternate,
 * which is right for CJK and harmless for Latin.
 */

/** Characters a quotation mark opens after. The CJK stops are here as well
 *  as in CLOSERS: a comma sits before an opening quote and after a closing
 *  one, and each set is only consulted on its own side. */
const OPENERS = "([{<“‘「『（【《—–，。、；：！？…";

/** …and closes before. CJK punctuation included: it hugs the quote. */
const CLOSERS = ")]}>”’」』）】》，。、；：！？…—–";

/** Anything that behaves like a letter or digit, CJK included. */
const WORD = /[\p{L}\p{N}]/u;

const DOUBLE_OPEN = "“";
const DOUBLE_CLOSE = "”";
const SINGLE_OPEN = "‘";
const SINGLE_CLOSE = "’";

function isWord(ch: string | undefined): boolean {
  return ch !== undefined && WORD.test(ch);
}

function isBoundary(ch: string | undefined): boolean {
  return ch === undefined || /\s/.test(ch);
}

/**
 * Convert the straight quotes and apostrophes in one string. `prev` is the
 * character that came before it in the surrounding block (undefined at the
 * start), and `state` carries the open/closed parity between the text nodes
 * of that block — `"quoted **like this**"` spans three of them.
 */
function convert(input: string, prev: string | undefined, state: QuoteState) {
  let out = "";
  let before = prev;

  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i];
    const next = input[i + 1];
    let replacement: string;

    if (ch === '"') {
      let opens: boolean;
      if (isBoundary(before) || OPENERS.includes(before ?? "")) {
        opens = true;
      } else if (isBoundary(next) || CLOSERS.includes(next ?? "")) {
        opens = false;
      } else {
        // No boundary on either side (CJK, or a quote butted against a
        // word): alternate.
        opens = !state.double;
      }
      state.double = opens;
      replacement = opens ? DOUBLE_OPEN : DOUBLE_CLOSE;
    } else if (ch === "'") {
      if (isWord(before)) {
        // don't · LoRA's · writers' · writers'. Also closes 'quoted'.
        replacement = SINGLE_CLOSE;
        state.single = false;
      } else if (isWord(next)) {
        // 'quoted' opens; '90s is an elision, not an opening quote.
        const elision = /\d/.test(next as string);
        replacement = elision ? SINGLE_CLOSE : SINGLE_OPEN;
        state.single = !elision;
      } else {
        replacement = state.single ? SINGLE_CLOSE : SINGLE_OPEN;
        state.single = !state.single;
      }
    } else {
      out += ch;
      before = ch;
      continue;
    }

    out += replacement;
    before = replacement;
  }

  return { text: out, last: before };
}

type QuoteState = { double: boolean; single: boolean };

const BLOCK_TYPES = new Set([
  "paragraph",
  "heading",
  "tableCell",
  "listItem",
  "blockquote",
  "mdxJsxFlowElement"
]);

/** Node types whose text is code, math, or raw markup — never touched. */
const SKIP_TYPES = new Set(["code", "inlineCode", "math", "inlineMath", "html", "yaml"]);

type MdastNode = {
  type?: string;
  value?: string;
  children?: MdastNode[];
};

function walk(node: MdastNode, state: QuoteState, carried: { prev?: string }) {
  if (node.type && SKIP_TYPES.has(node.type)) return;

  if (node.type && BLOCK_TYPES.has(node.type)) {
    state.double = false;
    state.single = false;
    carried.prev = undefined;
  }

  if (node.type === "text" && typeof node.value === "string") {
    const { text, last } = convert(node.value, carried.prev, state);
    node.value = text;
    carried.prev = last;
  }

  node.children?.forEach((child) => walk(child, state, carried));
}

/**
 * Remark plugin: rewrite quotes in every prose text node of the tree. It
 * touches text only: code, math and raw markup are left alone, and heading
 * ids come from `rehypeSectionAnchors` (section numbers), so rewriting a
 * heading's punctuation cannot move any anchor.
 */
export function remarkSmartQuotes() {
  return (tree: MdastNode) => {
    walk(tree, { double: false, single: false }, { prev: undefined });
  };
}

/** The same conversion for a plain string, with no block context. */
export function smartQuotes(input: string): string {
  return convert(input, undefined, { double: false, single: false }).text;
}
