import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Resets window scroll on SPA navigations (React Router does not do this by default).
 * Uses layout effect so the jump happens before paint, avoiding a flash of wrong scroll position.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
}
