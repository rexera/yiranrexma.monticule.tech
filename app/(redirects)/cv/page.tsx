"use client";

import { useEffect } from "react";

/**
 * /cv now points at the standalone HTML CV merged into public/cv.html —
 * a client redirect covers both the Vercel and static-export paths (the
 * HTML carries its own language toggle, so no locale routing is needed).
 */
export default function LegacyCvRedirectPage() {
  useEffect(() => {
    window.location.replace("/cv.html");
  }, []);

  return (
    <main className="mx-auto max-w-xl px-6 py-16 text-slate-700 dark:text-slate-200">
      <h1 className="text-lg font-semibold">Redirecting to CV…</h1>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
        If you are not redirected automatically,{" "}
        <a className="underline underline-offset-4" href="/cv.html">
          open the CV
        </a>
        .
      </p>
    </main>
  );
}
