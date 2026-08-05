import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Instant scroll to top on route or query change
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    
    // Backup check after page transition animation mounts
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);

    return () => clearTimeout(timer);
  }, [pathname, search]);

  return null;
}
