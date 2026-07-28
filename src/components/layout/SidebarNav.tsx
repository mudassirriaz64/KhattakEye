import { Link, NavLink } from "react-router-dom";
import { Glasses, LayoutGrid, MoonStar, SunMedium } from "lucide-react";
import { navItems } from "@/lib/site-data";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";

export function SidebarNav() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <aside className="hidden w-[290px] shrink-0 flex-col border-r border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-5 py-6 lg:flex">
      <Link to="/" className="flex items-center gap-3 rounded-[24px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-4 shadow-[var(--shadow-soft)]">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#111111,#2A2A2A)] text-white">
          <Glasses className="h-5 w-5" />
        </div>
        <div>
          <p className="font-display text-xl text-[color:var(--color-text-primary)]">Khattak Eyewear</p>
          <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--color-text-secondary)]">
            Design Foundation
          </p>
        </div>
      </Link>

      <div className="mt-8 space-y-7">
        {["Foundations", "Components", "Systems"].map((section) => (
          <div key={section} className="space-y-3">
            <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--color-text-secondary)]">
              {section}
            </p>
            <div className="space-y-1">
              {navItems
                .filter((item) => item.section === section)
                .map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center justify-between rounded-2xl px-4 py-3 text-sm text-[color:var(--color-text-secondary)] transition-all",
                        isActive
                          ? "bg-[color:var(--color-brand-primary)] text-white shadow-[var(--shadow-soft)]"
                          : "hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-text-primary)]",
                      )
                    }
                  >
                    <span>{item.label}</span>
                    <LayoutGrid className="h-4 w-4 opacity-70" />
                  </NavLink>
                ))}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={toggleTheme}
        className="mt-auto flex items-center justify-between rounded-[22px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-4 text-sm font-medium text-[color:var(--color-text-primary)]"
      >
        <span>{isDark ? "Switch to light" : "Switch to dark"}</span>
        {isDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
      </button>
    </aside>
  );
}
