import { X } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type ActiveFilterChipsProps = {
  selectedFilters: Record<string, string[]>;
  priceRange: [number, number];
  onRemoveFilter: (groupId: string, value: string) => void;
  onResetPrice: () => void;
  onClearAll: () => void;
};

export function ActiveFilterChips({
  selectedFilters,
  priceRange,
  onRemoveFilter,
  onResetPrice,
  onClearAll,
}: ActiveFilterChipsProps) {
  const isPriceActive = priceRange[0] > 0 || priceRange[1] < 100000;
  const activeEntries = Object.entries(selectedFilters).filter(([_, values]) => values.length > 0);

  if (!isPriceActive && activeEntries.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[color:var(--color-border)]">
      <span className="text-xs font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)] mr-1">
        Active Filters:
      </span>

      {isPriceActive && (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--color-brand-primary)]/30 bg-[color:var(--color-brand-soft)]/20 px-3 py-1 text-xs font-medium text-[color:var(--color-brand-primary)] shadow-sm">
          <span>Price: {formatCurrency(priceRange[0])} – {formatCurrency(priceRange[1])}</span>
          <button
            type="button"
            onClick={onResetPrice}
            className="rounded-full p-0.5 hover:bg-[color:var(--color-brand-primary)]/20 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      {activeEntries.map(([groupId, values]) =>
        values.map((val) => {
          const displayLabel = val.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
          return (
            <span
              key={`${groupId}-${val}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-3 py-1 text-xs font-medium text-[color:var(--color-text-primary)] shadow-sm"
            >
              <span className="text-[color:var(--color-text-tertiary)] text-[10px] uppercase font-bold mr-0.5">{groupId}:</span>
              <span>{displayLabel}</span>
              <button
                type="button"
                onClick={() => onRemoveFilter(groupId, val)}
                className="rounded-full p-0.5 hover:bg-[color:var(--color-surface-muted)] transition-colors text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-primary)]"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          );
        })
      )}

      <button
        type="button"
        onClick={onClearAll}
        className="ml-auto text-xs font-bold uppercase tracking-wider text-[color:var(--color-brand-primary)] hover:underline px-2 py-1"
      >
        Clear All
      </button>
    </div>
  );
}
