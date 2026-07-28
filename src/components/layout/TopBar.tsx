import { Link, useLocation } from "react-router-dom";
import { Menu, MoonStar, Search, Sparkles, SunMedium } from "lucide-react";
import { navItems } from "@/lib/site-data";
import { useTheme } from "@/hooks/useTheme";
import { useUiStore } from "@/lib/stores/ui-store";
import { Button } from "@/components/primitives/Button";

export function TopBar() {
  const location = useLocation();
  const activeItem = navItems.find((item) => item.path === location.pathname) ?? navItems[0];
  const { isDark, toggleTheme } = useTheme();
  const setMobileNavOpen = useUiStore((state) => state.setMobileNavOpen);

  return (
    <header className="sticky top-0 z-30 border-b border-[color:var(--color-border)] bg-[color:var(--color-app-bg)]/80 px-4 py-4 backdrop-blur md:px-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-panel)] text-[color:var(--color-text-primary)] lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--color-text-secondary)]">
              {activeItem.section}
            </p>
            <h2 className="font-display text-2xl text-[color:var(--color-text-primary)]">{activeItem.label}</h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-4 py-3 text-sm text-[color:var(--color-text-secondary)] shadow-[var(--shadow-input)] md:flex">
            <Search className="h-4 w-4" />
            Search patterns
          </div>
          <Link to="/components/cards" className="hidden md:block">
            <Button variant="cta-sm" iconLeft={<Sparkles className="h-4 w-4" />}>
              Signature card
            </Button>
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-panel)] text-[color:var(--color-text-primary)]"
            aria-label="Toggle theme"
          >
            {isDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
