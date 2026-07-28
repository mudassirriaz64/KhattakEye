import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SurfaceCardProps = {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function SurfaceCard({ title, description, children, className }: SurfaceCardProps) {
  return (
    <section
      className={cn(
        "rounded-[28px] border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 shadow-[var(--shadow-soft)] lg:p-7",
        className,
      )}
    >
      {(title || description) && (
        <div className="mb-6 space-y-2">
          {title ? (
            <h2 className="font-display text-2xl leading-tight text-[color:var(--color-text-primary)]">{title}</h2>
          ) : null}
          {description ? (
            <p className="max-w-3xl text-sm leading-7 text-[color:var(--color-text-secondary)]">{description}</p>
          ) : null}
        </div>
      )}
      {children}
    </section>
  );
}
