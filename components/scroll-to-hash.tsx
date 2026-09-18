"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Land on the anchor in the URL after a client-side route change.
 *
 * A full page load honours `#fragment` by itself, but a soft navigation does
 * not: Next scrolls the new route to the top and the reader loses their
 * place. This is most visible when switching language mid-article, where the
 * header sends them to the same section in the other locale (`#s4-2`).
 *
 * It lives in the article rather than in the header because it needs the
 * page's own commit: the header is part of the layout, so its effect runs as
 * soon as the pathname changes — while the outgoing page is still mounted
 * and its anchors are the only ones in the document, which makes the jump a
 * no-op. Inside the page, the effect runs once the new content is actually
 * in place. The jump is instant: the reader is changing language, not
 * scrolling.
 */
export function ScrollToHash() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (!hash) return;
    const target = document.getElementById(hash);
    target?.scrollIntoView({ block: "start", behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return null;
}
