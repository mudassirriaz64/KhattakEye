import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type FilterGroupProps = {
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

export function FilterGroup({ label, children, defaultOpen = true }: FilterGroupProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[color:var(--color-border)] py-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-sm font-medium text-[color:var(--color-text-primary)]"
      >
        {label}
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

export function FilterCheckbox({
  label, count, checked, onChange,
}: {
  label: string; count?: number; checked: boolean; onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 py-1 text-sm text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-[color:var(--color-border-strong)] text-[color:var(--color-brand-primary)] focus:ring-[color:var(--color-accent-teal)]"
      />
      <span className="flex-1">{label}</span>
      {count !== undefined && (
        <span className="text-xs text-[color:var(--color-text-tertiary)]">({count})</span>
      )}
    </label>
  );
}
