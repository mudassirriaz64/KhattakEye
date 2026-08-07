import React from "react";
import { Check, Info, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export interface LensTypeOption {
  id: string;
  name: string;
  price: number;
  description: string;
  info: string;
  strengths?: string[];
  colors?: { name: string; hex: string }[];
}

interface LensTypeStepProps {
  options: LensTypeOption[];
  selectedLensId: string;
  selectedStrength: string;
  selectedColorName: string;
  onSelectLens: (id: string, price: number) => void;
  onSelectStrength: (strength: string) => void;
  onSelectColor: (colorName: string) => void;
}

export function LensTypeStep({
  options,
  selectedLensId,
  selectedStrength,
  selectedColorName,
  onSelectLens,
  onSelectStrength,
  onSelectColor
}: LensTypeStepProps) {
  const [activeTooltip, setActiveTooltip] = React.useState<string | null>(null);

  const handleSelectOption = (opt: LensTypeOption) => {
    onSelectLens(opt.id, opt.price);
    if (opt.strengths && opt.strengths.length > 0) {
      onSelectStrength(opt.strengths[0]);
    }
    if (opt.colors && opt.colors.length > 0) {
      onSelectColor(opt.colors[0].name);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {options.map((opt) => {
        const isSelected = selectedLensId === opt.id;

        return (
          <div
            key={opt.id}
            className={cn(
              "rounded-2xl border p-5 transition-all cursor-pointer relative",
              isSelected
                ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-surface)] shadow-sm"
                : "border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] hover:border-[color:var(--color-text-secondary)]"
            )}
            onClick={() => handleSelectOption(opt)}
          >
            {/* Header info */}
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-[color:var(--color-text-primary)]">
                    {opt.name}
                  </h4>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTooltip(activeTooltip === opt.id ? null : opt.id);
                    }}
                    className="text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-primary)]"
                  >
                    <Info className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="text-xs text-[color:var(--color-text-secondary)] mt-1">
                  {opt.description}
                </p>
              </div>

              <div className="text-right">
                <span className="text-sm font-bold text-[color:var(--color-brand-primary)]">
                  +Rs. {opt.price.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Inline Expanded Info Tooltip */}
            <AnimatePresence>
              {activeTooltip === opt.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mt-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-2.5 text-[11px] leading-relaxed text-amber-900 font-medium">
                    {opt.info}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Expanded custom options inline inside the selected card */}
            <AnimatePresence>
              {isSelected && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mt-4 border-t border-[color:var(--color-border)] pt-4 space-y-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Strength Toggles */}
                  {opt.strengths && opt.strengths.length > 0 && (
                    <div>
                      <span className="block text-[10px] font-semibold text-[color:var(--color-text-tertiary)] uppercase tracking-wider mb-2">
                        Tint Density / Strength
                      </span>
                      <div className="flex gap-2">
                        {opt.strengths.map((str) => (
                          <button
                            key={str}
                            type="button"
                            onClick={() => onSelectStrength(str)}
                            className={cn(
                              "rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all",
                              selectedStrength === str
                                ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-brand-primary)]/5 text-[color:var(--color-brand-primary)]"
                                : "border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-text-secondary)] hover:border-[color:var(--color-text-secondary)]"
                            )}
                          >
                            {str}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Colors Toggles */}
                  {opt.colors && opt.colors.length > 0 && (
                    <div>
                      <span className="block text-[10px] font-semibold text-[color:var(--color-text-tertiary)] uppercase tracking-wider mb-2">
                        Lens Tint Color
                      </span>
                      <div className="flex flex-wrap gap-2.5">
                        {opt.colors.map((c) => {
                          const isColorSelected = selectedColorName === c.name;
                          return (
                            <button
                              key={c.name}
                              type="button"
                              onClick={() => onSelectColor(c.name)}
                              className={cn(
                                "flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all",
                                isColorSelected
                                  ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-brand-primary)]/5 text-[color:var(--color-brand-primary)]"
                                  : "border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-text-secondary)] hover:border-[color:var(--color-text-secondary)]"
                              )}
                            >
                              <span
                                className="h-3.5 w-3.5 rounded-full border border-black/10"
                                style={{ background: c.hex }}
                              />
                              {c.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
