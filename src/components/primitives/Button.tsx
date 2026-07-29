import type { ButtonHTMLAttributes, ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "success"
  | "icon"
  | "floating"
  | "cta-lg"
  | "cta-sm";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  loading?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "glow-primary bg-[color:var(--color-brand-primary)] text-white shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:bg-black",
  secondary:
    "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-primary)] hover:-translate-y-0.5 hover:bg-white",
  outline:
    "border border-[color:var(--color-border-strong)] bg-transparent text-[color:var(--color-text-primary)] hover:-translate-y-0.5 hover:bg-[color:var(--color-surface-muted)]",
  ghost: "bg-transparent text-[color:var(--color-text-primary)] hover:bg-[color:var(--color-surface-muted)]",
  danger: "bg-[color:var(--color-danger)] text-white hover:-translate-y-0.5 hover:brightness-95",
  success: "bg-[color:var(--color-accent-teal)] text-white hover:-translate-y-0.5 hover:bg-[#115E59]",
  icon: "h-11 w-11 rounded-full bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-primary)] hover:-translate-y-0.5 hover:bg-white",
  floating:
    "rounded-full bg-[color:var(--color-brand-primary)] px-5 py-3 text-white shadow-[var(--shadow-strong)] hover:-translate-y-1 hover:bg-black",
  "cta-lg":
    "bg-[linear-gradient(135deg,var(--color-brand-primary),#2A2A2A)] px-6 py-4 text-base text-white shadow-[var(--shadow-strong)] hover:-translate-y-1",
  "cta-sm":
    "bg-[color:var(--color-accent-teal)] px-4 py-2 text-sm text-white shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:bg-[#115E59]",
};

export function Button({
  className,
  children,
  variant = "primary",
  iconLeft,
  iconRight,
  loading = false,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[16px] px-4 py-3 text-sm font-semibold tracking-[0.01em] transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--color-focus-ring)] disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-[color:var(--color-disabled-bg)] disabled:text-[color:var(--color-disabled-text)] disabled:shadow-none",
        variantClasses[variant],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : iconLeft}
      <span>{children}</span>
      {!loading ? iconRight : null}
    </button>
  );
}
