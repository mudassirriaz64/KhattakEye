import type { PropsWithChildren } from "react";
import { Link, NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { navItems } from "@/lib/site-data";
import { cn } from "@/lib/utils";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { TopBar } from "@/components/layout/TopBar";
import { useUiStore } from "@/lib/stores/ui-store";

export function AppShell({ children }: PropsWithChildren) {
  const mobileNavOpen = useUiStore((state) => state.mobileNavOpen);
  const setMobileNavOpen = useUiStore((state) => state.setMobileNavOpen);

  return (
    <div className="min-h-screen bg-[color:var(--color-app-bg)] text-[color:var(--color-text-primary)]">
      <div className="flex min-h-screen">
        <SidebarNav />
        <div className="relative flex min-w-0 flex-1 flex-col">
          <TopBar />
          <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-6 px-4 py-6 md:px-6 lg:gap-8 lg:px-8 lg:py-8">
            {children}
          </main>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity lg:hidden",
          mobileNavOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div
          className={cn(
            "flex h-full w-[85%] max-w-sm flex-col bg-[color:var(--color-panel)] p-5 shadow-[var(--shadow-strong)] transition-transform",
            mobileNavOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="mb-8 flex items-center justify-between">
            <Link to="/" className="font-display text-2xl text-[color:var(--color-text-primary)]" onClick={() => setMobileNavOpen(false)}>
              Khattak Eyewear
            </Link>
            <button
              type="button"
              onClick={() => setMobileNavOpen(false)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--color-border)]"
              aria-label="Close navigation"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileNavOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "block rounded-2xl px-4 py-3 text-sm text-[color:var(--color-text-secondary)]",
                    isActive
                      ? "bg-[color:var(--color-brand-primary)] text-white"
                      : "hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-text-primary)]",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
