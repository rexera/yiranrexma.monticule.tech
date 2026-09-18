"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

import { buildLocalePath, normalizeLocale } from "@/lib/locale";

/**
 * The Story page used to live at /[locale]/experience. A static export cannot
 * redirect at request time and proxy.ts does not run there, so the old path
 * keeps a page of its own that forwards to the new one — locale and section
 * anchor preserved, so a link into the middle of the page still lands there.
 */
export default function ExperiencePageMoved() {
  const params = useParams<{ locale: string }>();
  const locale = normalizeLocale(params?.locale ?? null) ?? "en";
  const target = buildLocalePath(locale, "/story");

  useEffect(() => {
    window.location.replace(`${target}${window.location.hash}`);
  }, [target]);

  return (
    <main className="mx-auto w-full max-w-[46rem] px-6 py-16 text-slate-700 dark:text-slate-200">
      <h1 className="text-lg font-semibold">Redirecting…</h1>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
        The Story page moved.{" "}
        <a className="underline underline-offset-4" href={target}>
          Continue
        </a>
        .
      </p>
    </main>
  );
}
