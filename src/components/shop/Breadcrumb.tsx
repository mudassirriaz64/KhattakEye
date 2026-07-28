import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

type Crumb = { label: string; path?: string };

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="flex items-center gap-2 text-xs text-[color:var(--color-text-tertiary)]">
      <Link to="/" className="transition-colors hover:text-[color:var(--color-text-primary)]">Home</Link>
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-2">
          <ChevronRight className="h-3 w-3" />
          {item.path ? (
            <Link to={item.path} className="transition-colors hover:text-[color:var(--color-text-primary)]">{item.label}</Link>
          ) : (
            <span className="text-[color:var(--color-text-secondary)]">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
