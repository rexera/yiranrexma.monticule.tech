"use client";

import { useEffect, useState } from "react";
import Giscus from "@giscus/react";

type GiscusCommentsProps = {
  locale: "en" | "zh";
};

/**
 * GitHub Discussions comments via giscus, backed by this site's own
 * repository (Discussions enabled, "General" category). The giscus GitHub
 * App must be installed on the repo for posting: https://github.com/apps/giscus
 * Theme follows the site toggle.
 */
export function GiscusComments({ locale }: GiscusCommentsProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setTheme(root.classList.contains("dark") ? "dark" : "light");
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <section className="mt-12 border-t border-slate-200 pt-8 dark:border-slate-800">
      <Giscus
        repo="rexera/yiranrexma.monticule.tech"
        repoId="R_kgDOUEgnBg"
        category="General"
        categoryId="DIC_kwDOUEgnBs4DEWwt"
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={theme}
        lang={locale === "zh" ? "zh-CN" : "en"}
      />
    </section>
  );
}
