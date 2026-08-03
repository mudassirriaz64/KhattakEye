import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type FieldProps = {
  label: string;
  helper?: string;
  error?: string;
};

const fieldBaseClass =
  "w-full rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-4 py-3 text-sm text-[color:var(--color-text-primary)] shadow-[var(--shadow-input)] outline-none transition-all placeholder:text-[color:var(--color-text-tertiary)] hover:border-[color:var(--color-border-strong)] focus:border-[color:var(--color-brand-primary)] focus:ring-4 focus:ring-[color:var(--color-focus-ring)]";

export function TextField({
  label,
  helper,
  error,
  className,
  ...props
}: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="space-y-2">
      <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-text-secondary)]">
        {label}
      </span>
      <input className={cn(fieldBaseClass, error && "border-[color:var(--color-danger)]", className)} {...props} />
      <FieldMeta helper={helper} error={error} />
    </label>
  );
}

export function SearchField({
  label,
  helper,
  error,
  className,
  ...props
}: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="space-y-2">
      <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-text-secondary)]">
        {label}
      </span>
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-secondary)]" />
        <input
          className={cn(fieldBaseClass, "pl-11", error && "border-[color:var(--color-danger)]", className)}
          {...props}
        />
      </div>
      <FieldMeta helper={helper} error={error} />
    </label>
  );
}

export function SelectField({
  label,
  helper,
  error,
  className,
  children,
  ...props
}: FieldProps & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="space-y-2">
      <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-text-secondary)]">
        {label}
      </span>
      <select className={cn(fieldBaseClass, error && "border-[color:var(--color-danger)]", className)} {...props}>
        {children}
      </select>
      <FieldMeta helper={helper} error={error} />
    </label>
  );
}

export function TextAreaField({
  label,
  helper,
  error,
  className,
  ...props
}: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="space-y-2">
      <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-text-secondary)]">
        {label}
      </span>
      <textarea
        className={cn(fieldBaseClass, "min-h-32 resize-none", error && "border-[color:var(--color-danger)]", className)}
        {...props}
      />
      <FieldMeta helper={helper} error={error} />
    </label>
  );
}

export function CheckboxField({ label, helper, error }: FieldProps) {
  return (
    <label className="flex items-start gap-3 rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-4">
      <input
        type="checkbox"
        className="mt-1 h-4 w-4 rounded border-[color:var(--color-border-strong)] accent-[color:var(--color-brand-primary)]"
        defaultChecked
      />
      <span className="space-y-1">
        <span className="block text-sm font-medium text-[color:var(--color-text-primary)]">{label}</span>
        <FieldMeta helper={helper} error={error} />
      </span>
    </label>
  );
}

export function ToggleField({ label, helper }: Pick<FieldProps, "label" | "helper">) {
  return (
    <div className="flex items-center justify-between rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-4">
      <div className="space-y-1">
        <p className="text-sm font-medium text-[color:var(--color-text-primary)]">{label}</p>
        {helper ? <p className="text-xs text-[color:var(--color-text-secondary)]">{helper}</p> : null}
      </div>
      <button
        type="button"
        className="flex h-8 w-14 items-center rounded-full brand-gradient px-1"
        aria-pressed="true"
      >
        <span className="ml-auto block h-6 w-6 rounded-full bg-white shadow-sm" />
      </button>
    </div>
  );
}

function FieldMeta({ helper, error }: Pick<FieldProps, "helper" | "error">) {
  if (!helper && !error) {
    return null;
  }

  return (
    <p className={cn("text-xs leading-5", error ? "text-[color:var(--color-danger)]" : "text-[color:var(--color-text-secondary)]")}>
      {error ?? helper}
    </p>
  );
}
