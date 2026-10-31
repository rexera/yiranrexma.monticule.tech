import Link from "next/link";

/**
 * Site-branded 404 — wraps every unknown URL (rendered inside the root
 * layout, so it also covers locale routes that fail `notFound()`).
 */
export default function NotFound() {
  return (
    <main className="container-page flex min-h-[70vh] max-w-[46rem] flex-col justify-center py-16">
      <p className="eyebrow">404</p>
      <h1 className="page-title mt-3">This page drifted off the map · 页面走丢了</h1>
      <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-muted">
        The link may be outdated, or the page has moved. · 链接可能已过期，或页面已迁移。
      </p>
      <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <Link href="/" className="link-underline text-ink">
          Back home · 回到首页
        </Link>
        <Link href="/en/blog" className="link-underline text-muted hover:text-ink">
          Read the blog · 逛逛博客
        </Link>
      </div>
    </main>
  );
}
