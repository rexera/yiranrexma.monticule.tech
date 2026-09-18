import next from "eslint-config-next";

const config = [
  {
    // Claude Code keeps session worktrees under .claude/. They are full copies
    // of the repo, including their own .next/ build output, which ESLint would
    // otherwise crawl — a nested .next/ is not covered by the root-anchored
    // ignores that eslint-config-next brings.
    ignores: [".claude/**"]
  },
  ...next,
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "@next/next/no-html-link-for-pages": "off"
    }
  }
];

export default config;
