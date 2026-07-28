import { ChevronDown, Heart, Search, ShoppingBag, UserRound } from "lucide-react";
import { Button } from "@/components/primitives/Button";

export function AnnouncementBar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] bg-[linear-gradient(135deg,#111111,#222222)] px-5 py-4 text-sm text-white">
      <p className="font-medium">Complimentary premium case, cleaning kit, and nationwide insured delivery.</p>
      <Button variant="ghost" className="text-white hover:bg-white/10">
        Explore Care Program
      </Button>
    </div>
  );
}

export function NavbarPreview() {
  return (
    <div className="rounded-[28px] border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-5 py-5 shadow-[var(--shadow-soft)]">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div>
          <p className="font-display text-3xl text-[color:var(--color-text-primary)]">Khattak Eyewear</p>
          <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--color-text-secondary)]">Luxury optical studio</p>
        </div>
        <nav className="hidden items-center gap-6 text-sm font-medium text-[color:var(--color-text-secondary)] md:flex">
          <button type="button" className="inline-flex items-center gap-1 hover:text-[color:var(--color-text-primary)]">
            Collections <ChevronDown className="h-4 w-4" />
          </button>
          <button type="button" className="hover:text-[color:var(--color-text-primary)]">
            Sunglasses
          </button>
          <button type="button" className="hover:text-[color:var(--color-text-primary)]">
            Optical
          </button>
          <button type="button" className="hover:text-[color:var(--color-text-primary)]">
            Editorial
          </button>
        </nav>
        <div className="flex items-center gap-2">
          {[Search, Heart, ShoppingBag, UserRound].map((Icon) => (
            <button
              type="button"
              key={Icon.displayName ?? Icon.name}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-primary)]"
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TabsPreview() {
  return (
    <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-2 shadow-[var(--shadow-input)]">
      {["Best Sellers", "New Season", "Titanium", "Editorial"].map((tab, index) => (
        <button
          type="button"
          key={tab}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
            index === 0
              ? "bg-[color:var(--color-brand-primary)] text-white"
              : "text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-muted)]"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
