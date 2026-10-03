import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { jumpToTop } from "../lib/jumpToTop";

/** Scroll to `#hash` targets after client-side navigations (RR does not do this). */
export function HashScroll() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  useLayoutEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.replace(/^#/, ""));
      if (!id) return;

      // In-page section jumps (homepage categories) may animate.
      // Project / about routes must never inherit homepage scroll.
      if (pathname.startsWith("/work/") || pathname === "/about") {
        jumpToTop();
        return;
      }

      let cancelled = false;
      const scrollToTarget = () => {
        if (cancelled) return;
        const el = document.getElementById(id);
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      };

      const timers = [0, 50, 150, 350, 700].map((ms) =>
        window.setTimeout(scrollToTarget, ms)
      );

      return () => {
        cancelled = true;
        timers.forEach((t) => window.clearTimeout(t));
      };
    }

    if (pathname.startsWith("/work/") || pathname === "/about") {
      jumpToTop();
    }
  }, [pathname, hash]);

  return null;
}
