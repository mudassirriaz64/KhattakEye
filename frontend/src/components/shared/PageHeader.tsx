import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  aside?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, aside }: PageHeaderProps) {
  return (
    <div className="grid gap-6 rounded-[32px] border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-6 py-7 shadow-[var(--shadow-soft)] lg:grid-cols-[1fr_auto] lg:px-8 lg:py-9">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-4"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border-strong)] bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--color-text-secondary)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-accent-teal)]" />
          {eyebrow}
        </div>
        <div className="space-y-3">
          <h1 className="font-display text-4xl leading-tight text-[color:var(--color-text-primary)] md:text-5xl">
            {title}
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-[color:var(--color-text-secondary)] md:text-base">
            {description}
          </p>
        </div>
      </motion.div>
      {aside ? (
        <div className="flex flex-col justify-between rounded-[28px] border border-white/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(248,249,250,0.94))] p-5 shadow-[var(--shadow-soft)] lg:w-[320px]">
          {aside}
        </div>
      ) : (
        <div className="hidden lg:flex lg:w-[320px] lg:flex-col lg:justify-between lg:rounded-[28px] lg:border lg:border-[color:var(--color-border)] lg:bg-[linear-gradient(145deg,rgba(17,17,17,0.03),rgba(37,99,235,0.02))] lg:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--color-text-secondary)]">
            Luxury System
          </p>
          <div className="space-y-3">
            <p className="text-sm leading-6 text-[color:var(--color-text-secondary)]">
              Built as an internal design handbook so every future screen inherits the same visual discipline.
            </p>
            <div className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--color-text-primary)]">
              Documentation workspace
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
