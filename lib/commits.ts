export type CommitItem = {
  sha: string;
  message: string;
  date: string;
  author: string;
  href: string;
};

const FALLBACK_REPO = "rexera/yiranrexma.monticule.tech";
const COMMIT_LIMIT = 15;

/** Bots would flood the strip with chore commits. */
function isBot(commit: GhCommit): boolean {
  return (
    commit.author?.login === "github-actions[bot]" ||
    (commit.commit.author?.name ?? "").includes("github-actions")
  );
}

function repoSlug(): string {
  const url = process.env.NEXT_PUBLIC_REPOSITORY_URL ?? "";
  const match = url.replace(/\.git$/, "").match(/github\.com\/([^/]+\/[^/]+)/);
  return match ? match[1] : FALLBACK_REPO;
}

type GhCommit = {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: { name: string; date: string } | null;
  };
  author: { login: string } | null;
};

/**
 * Recent commits for the Home page carousel, fetched from the GitHub API at
 * build time — the site redeploys on every push, so the baked list is always
 * current. Returns null on any failure (rate limit, offline) so the Home
 * page can silently omit the strip. Set GITHUB_TOKEN to lift rate limits.
 */
export async function getRecentCommits(limit = COMMIT_LIMIT): Promise<CommitItem[] | null> {
  const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${repoSlug()}/commits?per_page=${limit * 2}`, {
      headers,
      next: { revalidate: 600 }
    });
    if (!res.ok) {
      return null;
    }
    const data = (await res.json()) as GhCommit[];
    return data
      .filter((commit) => !isBot(commit))
      .slice(0, limit)
      .map((commit) => ({
        sha: commit.sha,
        message: commit.commit.message.split("\n")[0],
        date: (commit.commit.author?.date ?? "").slice(0, 10),
        author: commit.author?.login ?? commit.commit.author?.name ?? "",
        href: commit.html_url
      }));
  } catch {
    return null;
  }
}
