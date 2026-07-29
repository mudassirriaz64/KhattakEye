import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, MoonStar, Search, Sparkles, SunMedium, Monitor } from "lucide-react";
import { navItems } from "@/lib/site-data";
import { useTheme } from "@/hooks/useTheme";
import { useUiStore } from "@/lib/stores/ui-store";
import { Button } from "@/components/primitives/Button";

function ThemeToggle() {
  const { mode, isDark, isSystem, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="group relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-panel)] text-[color:var(--color-text-primary)] transition-shadow hover:shadow-[var(--shadow-soft)]"
      aria-label={`Current theme: ${mode}. Click to switch.`}
    >
      <AnimatePresence mode="wait">
        {isSystem ? (
          <motion.span key="system" initial={{ opacity: 0, rotate: -90, scale: 0.5 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: 90, scale: 0.5 }} transition={{ duration: 0.3 }}>
            <Monitor className="h-4 w-4" />
          </motion.span>
        ) : isDark ? (
          <motion.span key="dark" initial={{ opacity: 0, rotate: -90, scale: 0.5 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: 90, scale: 0.5 }} transition={{ duration: 0.3 }}>
            <SunMedium className="h-4 w-4" />
          </motion.span>
        ) : (
          <motion.span key="light" initial={{ opacity: 0, rotate: -90, scale: 0.5 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: 90, scale: 0.5 }} transition={{ duration: 0.3 }}>
            <MoonStar className="h-4 w-4" />
          </motion.span>
        )}
      </AnimatePresence>
      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[color:var(--color-brand-primary)] px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
        {mode === "light" ? "Light" : mode === "dark" ? "Dark" : "Auto"}
      </span>
    </button>
  );
}

export function TopBar() {
  const location = useLocation();
  const activeItem = navItems.find((item) => item.path === location.pathname) ?? navItems[0];
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
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
