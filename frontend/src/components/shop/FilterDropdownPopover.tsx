import { useState, useRef, useEffect } from "react";
import { ChevronDown, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PriceSlider } from "./PriceSlider";
import { cn } from "@/lib/utils";

type Option = {
  label: string;
  value: string;
  count: number;
};

type FilterDropdownPopoverProps = {
  id: string;
  label: string;
  type: "checkbox" | "price";
  options: Option[];
  selectedValues: string[];
  priceRange: [number, number];
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onChange: (groupId: string, values: string[]) => void;
  onPriceChange: (range: [number, number]) => void;
};

export function FilterDropdownPopover({
  id,
  label,
  type,
  options,
  selectedValues,
  priceRange,
  isOpen,
  onToggle,
  onClose,
  onChange,
  onPriceChange,
}: FilterDropdownPopoverProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const selectedCount = type === "price" 
    ? (priceRange[0] > 0 || priceRange[1] < 100000 ? 1 : 0)
    : selectedValues.length;

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-200 shadow-sm",
          selectedCount > 0
            ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-brand-soft)]/20 text-[color:var(--color-brand-primary)] ring-2 ring-[color:var(--color-brand-primary)]/10"
            : isOpen
            ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-primary)]"
            : "border-[color:var(--color-border)] bg-[color:var(--color-panel)] text-[color:var(--color-text-secondary)] hover:border-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-primary)]"
        )}
      >
        <span>{label}</span>
        {selectedCount > 0 && (
          <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[color:var(--color-brand-primary)] px-1 text-[10px] font-bold text-white">
            {type === "price" ? "✓" : selectedCount}
          </span>
        )}
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {/* Popover Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 z-50 mt-2 w-72 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4 shadow-xl backdrop-blur-xl"
          >
            <div className="mb-3 flex items-center justify-between border-b border-[color:var(--color-border)] pb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[color:var(--color-text-primary)]">{label}</span>
              {selectedCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (type === "price") {
                      onPriceChange([0, 100000]);
                    } else {
                      onChange(id, []);
                    }
                  }}
                  className="text-[11px] font-semibold text-[color:var(--color-brand-primary)] hover:underline"
                >
                  Clear
                </button>
              )}
            </div>

            {type === "price" ? (
              <div className="py-2">
                <PriceSlider min={0} max={100000} value={priceRange} onChange={onPriceChange} />
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
                {options.map((opt) => {
                  const isChecked = selectedValues.includes(opt.value);
                  return (
                    <label
                      key={opt.value}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium cursor-pointer transition-colors",
                        isChecked
                          ? "bg-[color:var(--color-brand-soft)]/20 text-[color:var(--color-brand-primary)]"
                          : "text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-text-primary)]"
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={cn(
                            "flex h-4 w-4 shrink-0 items-center justify-center rounded-md border transition-colors",
                            isChecked
                              ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-brand-primary)] text-white"
                              : "border-[color:var(--color-border)] bg-transparent"
                          )}
                        >
                          {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <span className="truncate">{opt.label}</span>
                      </div>
                      <span className="ml-2 text-[10px] font-semibold text-[color:var(--color-text-tertiary)]">
                        ({opt.count})
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
