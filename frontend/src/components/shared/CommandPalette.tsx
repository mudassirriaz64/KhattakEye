import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight, Clock, TrendingUp, X } from "lucide-react";
import { useUiStore } from "@/lib/stores/ui-store";
import { cn } from "@/lib/utils";

const quickActions = [
  { label: "Shop All", path: "/shop", icon: TrendingUp },
  { label: "New Arrivals", path: "/shop/new", icon: TrendingUp },
  { label: "Best Sellers", path: "/shop/best", icon: TrendingUp },
  { label: "Track Order", path: "/track-order", icon: TrendingUp },
  { label: "Wishlist", path: "/wishlist", icon: TrendingUp },
];

export function CommandPalette() {
  const open = useUiStore((s) => s.commandPaletteOpen);
  const setOpen = useUiStore((s) => s.setCommandPaletteOpen);
  const recentSearches = useUiStore((s) => s.recentSearches);
  const addRecentSearch = useUiStore((s) => s.addRecentSearch);
  const clearRecentSearches = useUiStore((s) => s.clearRecentSearches);
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);

  const filteredActions = quickActions.filter(
    (a) => !query || a.label.toLowerCase().includes(query.toLowerCase()),
  );

  const filteredRecent = recentSearches.filter(
    (s) => !query || s.toLowerCase().includes(query.toLowerCase()),
  );

  const allItems = useMemo(() => [
    ...filteredActions.map((a) => ({ type: "action" as const, ...a })),
    ...filteredRecent.map((s) => ({ type: "search" as const, label: s, path: `/search?q=${encodeURIComponent(s)}`, icon: Clock })),
  ], [filteredActions, filteredRecent]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, allItems.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && allItems[activeIdx]) {
        const item = allItems[activeIdx];
        if (item.type === "search") addRecentSearch(item.label);
        navigate(item.path);
        setOpen(false);
      }
    },
    [allItems, activeIdx, navigate, setOpen, addRecentSearch],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(!open);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, setOpen]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIdx(0);
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] flex items-start justify-center bg-black/50 pt-[15vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full max-w-xl rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] shadow-[var(--shadow-strong)] backdrop-blur-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-[color:var(--color-border)] px-4 py-3">
              <Search className="h-5 w-5 text-[color:var(--color-text-tertiary)]" />
              <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setActiveIdx(0); }}
                onKeyDown={handleKeyDown}
                placeholder="Search pages, products..."
                className="flex-1 bg-transparent text-sm text-[color:var(--color-text-primary)] outline-none placeholder:text-[color:var(--color-text-tertiary)]"
                autoFocus
                aria-label="Command palette search"
              />
              <kbd className="hidden rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-1.5 py-0.5 text-[10px] text-[color:var(--color-text-tertiary)] sm:inline-block">
                ESC
              </kbd>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {allItems.length === 0 && (
                <p className="py-8 text-center text-sm text-[color:var(--color-text-tertiary)]">No results found</p>
              )}

              {filteredActions.length > 0 && (
                <div className="mb-2 px-2 py-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">Quick Actions</p>
                </div>
              )}

              {filteredActions.map((item, i) => (
                <button
                  key={item.label}
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                    activeIdx === i
                      ? "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-primary)]"
                      : "text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-muted)]",
                  )}
                  onClick={() => {
                    navigate(item.path);
                    setOpen(false);
                  }}
                  onMouseEnter={() => setActiveIdx(i)}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  <ArrowRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              ))}

              {filteredRecent.length > 0 && (
                <div className="mb-2 mt-4 flex items-center justify-between px-2 py-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">Recent Searches</p>
                  <button
                    type="button"
                    onClick={clearRecentSearches}
                    className="text-[10px] text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-primary)]"
                  >
                    Clear all
                  </button>
                </div>
              )}

              {filteredRecent.map((item, i) => {
                const idx = filteredActions.length + i;
                return (
                  <button
                    key={item}
                    type="button"
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                      activeIdx === idx
                        ? "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-primary)]"
                        : "text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-muted)]",
                    )}
                    onClick={() => {
                      addRecentSearch(item);
                      navigate(`/search?q=${encodeURIComponent(item)}`);
                      setOpen(false);
                    }}
                    onMouseEnter={() => setActiveIdx(idx)}
                  >
                    <Clock className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{item}</span>
                    <X
                      className="h-3 w-3 text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-primary)]"
                      onClick={(e) => {
                        e.stopPropagation();
                        // remove single recent search
                      }}
                    />
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-4 border-t border-[color:var(--color-border)] px-4 py-2">
              <div className="flex items-center gap-1 text-[10px] text-[color:var(--color-text-tertiary)]">
                <kbd className="rounded border border-[color:var(--color-border)] px-1 py-0.5 text-[10px]">↑↓</kbd>
                <span>Navigate</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-[color:var(--color-text-tertiary)]">
                <kbd className="rounded border border-[color:var(--color-border)] px-1 py-0.5 text-[10px]">↵</kbd>
                <span>Open</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-[color:var(--color-text-tertiary)]">
                <kbd className="rounded border border-[color:var(--color-border)] px-1 py-0.5 text-[10px]">ESC</kbd>
                <span>Close</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
