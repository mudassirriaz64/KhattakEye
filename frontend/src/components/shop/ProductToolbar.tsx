import { ChevronDown, SlidersHorizontal, Grid3X3, List } from "lucide-react";
import { sortOptions } from "@/lib/shop-data";
import { useShopStore } from "@/lib/stores/shop-store";
import { cn } from "@/lib/utils";

type ProductToolbarProps = {
  totalProducts: number;
  onFilterToggle: () => void;
};

export function ProductToolbar({ totalProducts, onFilterToggle }: ProductToolbarProps) {
  const sortBy = useShopStore((s) => s.sortBy);
  const viewMode = useShopStore((s) => s.viewMode);
  const setSortBy = useShopStore((s) => s.setSortBy);
  const setViewMode = useShopStore((s) => s.setViewMode);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-5 py-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onFilterToggle}
          className="flex items-center gap-2 rounded-full border border-[color:var(--color-border)] px-4 py-2 text-sm text-[color:var(--color-text-secondary)] transition-colors hover:text-[color:var(--color-text-primary)] lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>
        <p className="text-sm text-[color:var(--color-text-secondary)]">
          <span className="font-medium text-[color:var(--color-text-primary)]">{totalProducts}</span> Products
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-1 rounded-full border border-[color:var(--color-border)] p-1 sm:flex">
          {[
            { mode: "grid" as const, icon: Grid3X3 },
            { mode: "list" as const, icon: List },
          ].map(({ mode, icon: Icon }) => (
            <button
              key={mode}
              type="button"
              onClick={() => setViewMode(mode)}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                viewMode === mode
                  ? "bg-[color:var(--color-brand-primary)] text-white"
                  : "text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-primary)]",
              )}
              aria-label={`${mode} view`}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>

        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none rounded-full border border-[color:var(--color-border)] bg-transparent px-4 py-2 pr-8 text-sm text-[color:var(--color-text-secondary)] outline-none focus:border-[color:var(--color-accent-teal)]"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
        </div>
      </div>
    </div>
  );
}
