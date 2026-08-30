import Link from "next/link";

/**
 * Site-branded 404 — wraps every unknown URL (rendered inside the root
 * layout, so it also covers locale routes that fail `notFound()`).
 */
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 py-16 text-center">
      <p className="font-mono text-sm font-semibold tracking-[0.2em] text-brand">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
        This page drifted off the map · 页面走丢了
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        The link may be outdated, or the page has moved. ·
        链接可能已过期，或页面已迁移。
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm font-medium">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
        >
          Back home · 回到首页
        </Link>
        <Link
          href="/en/blog"
          className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-2 text-slate-700 transition hover:border-slate-400 hover:text-brand dark:border-slate-600 dark:text-slate-200"
        >
          Read the blog · 逛逛博客
        </Link>
      </div>
    </main>
  );
}
