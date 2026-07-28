import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, Menu, Sun, Moon, LogOut, User, Settings } from "lucide-react";
import { useAdminStore } from "@/lib/stores/admin-store";
import { useUiStore } from "@/lib/stores/ui-store";
import { cn } from "@/lib/utils";

type Props = { onMenuClick: () => void };

export function AdminTopBar({ onMenuClick }: Props) {
  const { user, toggleSidebar } = useAdminStore();
  const theme = useUiStore((s) => s.theme);
  const toggleTheme = useUiStore((s) => s.toggleTheme);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[color:var(--color-border)] bg-[color:var(--color-panel)]/80 px-4 backdrop-blur-2xl lg:px-6">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onMenuClick} className="flex h-9 w-9 items-center justify-center rounded-xl text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-muted)] lg:hidden">
          <Menu className="h-5 w-5" />
        </button>
        <button type="button" onClick={toggleSidebar} className="hidden h-9 w-9 items-center justify-center rounded-xl text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-muted)] lg:flex">
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative ml-2 hidden sm:block">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search anything..."
            className="w-64 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] py-2 pl-10 pr-4 text-sm text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-accent-teal)] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-focus-ring)]"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button type="button" className="relative flex h-9 w-9 items-center justify-center rounded-xl text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-muted)] sm:hidden" onClick={() => setSearchOpen(!searchOpen)}>
          <Search className="h-4.5 w-4.5" />
        </button>

        <button type="button" onClick={toggleTheme} className="flex h-9 w-9 items-center justify-center rounded-xl text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-muted)]">
          {theme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
        </button>

        <div className="relative">
          <button type="button" onClick={() => setShowNotifications(!showNotifications)} className="relative flex h-9 w-9 items-center justify-center rounded-xl text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-muted)]">
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[color:var(--color-danger)]" />
          </button>
          <AnimatePresence>
            {showNotifications && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute right-0 top-12 w-80 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4 shadow-[var(--shadow-strong)]">
                <p className="text-xs font-semibold text-[color:var(--color-text-primary)]">Notifications</p>
                <div className="mt-3 space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-3 rounded-xl bg-[color:var(--color-surface-muted)] p-3">
                      <div className="h-2 w-2 mt-1 rounded-full bg-[color:var(--color-accent-teal)]" />
                      <div>
                        <p className="text-xs font-medium text-[color:var(--color-text-primary)]">New order received</p>
                        <p className="text-[10px] text-[color:var(--color-text-tertiary)]">Order KT-{i}A3F9C placed</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <button type="button" onClick={() => setShowProfile(!showProfile)} className="flex items-center gap-2 rounded-xl p-1.5 transition-colors hover:bg-[color:var(--color-surface-muted)]">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--color-brand-primary)] text-[10px] font-bold text-white">
              {user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "AK"}
            </div>
          </button>
          <AnimatePresence>
            {showProfile && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute right-0 top-12 w-56 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-3 shadow-[var(--shadow-strong)]">
                <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[color:var(--color-brand-primary)] text-xs font-bold text-white">AK</div>
                  <div>
                    <p className="text-sm font-semibold text-[color:var(--color-text-primary)]">{user?.name}</p>
                    <p className="text-[10px] text-[color:var(--color-text-tertiary)]">{user?.email}</p>
                  </div>
                </div>
                <div className="mt-2 space-y-1 border-t border-[color:var(--color-border)] pt-2">
                  <Link to="/admin/settings" className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-text-primary)]">
                    <Settings className="h-4 w-4" /> Settings
                  </Link>
                  <button type="button" className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-danger)]">
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
