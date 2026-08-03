import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { ShowcaseCard } from "@/lib/site-data";

type ShowcaseLinkCardProps = {
  card: ShowcaseCard;
};

export function ShowcaseLinkCard({ card }: ShowcaseLinkCardProps) {
  return (
    <Link
      to={card.path}
      className="group overflow-hidden rounded-[28px] border border-[color:var(--color-border)] bg-[color:var(--color-panel)] shadow-[var(--shadow-soft)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-strong)]"
    >
      <div className={`h-32 bg-gradient-to-br ${card.accent}`} />
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl text-[color:var(--color-text-primary)]">{card.title}</h3>
          <ArrowUpRight className="h-5 w-5 text-[color:var(--color-text-secondary)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
        <p className="text-sm leading-7 text-[color:var(--color-text-secondary)]">{card.description}</p>
      </div>
    </Link>
  );
}
