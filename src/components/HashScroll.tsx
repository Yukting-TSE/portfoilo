import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/** Scroll to `#hash` targets after client-side navigations (RR does not do this). */
export function HashScroll() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    if (!hash) return;
    const id = decodeURIComponent(hash.replace(/^#/, ""));
    if (!id) return;

    let cancelled = false;
    const scrollToTarget = () => {
      if (cancelled) return false;
      const el = document.getElementById(id);
      if (!el) return false;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      return true;
    };

    // Wait a frame (and briefly retry) so the destination route can mount.
    const timers = [0, 50, 150, 350, 700].map((ms) =>
      window.setTimeout(() => {
        scrollToTarget();
      }, ms)
    );

    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [pathname, hash]);

  // Case studies and about: always open at the top with no animated jump.
  useLayoutEffect(() => {
    if (hash) return;
    if (pathname === "/" ) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }
    if (pathname.startsWith("/work/") || pathname === "/about") {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [pathname, hash]);

  return null;
}
