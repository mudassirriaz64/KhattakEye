import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectableOptionCardProps {
  title: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
}

export function SelectableOptionCard({
  title,
  description,
  selected,
  onClick
}: SelectableOptionCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "rounded-2xl border p-5 transition-all cursor-pointer flex items-center justify-between",
        selected
          ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-brand-primary)]/5"
          : "border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] hover:border-[color:var(--color-text-secondary)]"
      )}
    >
      <div>
        <p className="text-sm font-bold text-[color:var(--color-text-primary)]">{title}</p>
        {description && (
          <p className="text-[11px] text-[color:var(--color-text-secondary)] mt-0.5">{description}</p>
        )}
      </div>
      <div
        className={cn(
          "h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ml-3",
          selected
            ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-brand-primary)]"
            : "border-[color:var(--color-border)]"
        )}
      >
        {selected && <Check className="h-2.5 w-2.5 text-white" />}
      </div>
    </div>
  );
}
