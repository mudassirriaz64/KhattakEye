import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Crumb = { label: string; path?: string };

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="flex items-center gap-2 text-xs text-[color:var(--color-text-tertiary)]" aria-label="Breadcrumb">
      <Link
        to="/"
        className="group relative transition-colors hover:text-[color:var(--color-text-primary)]"
      >
        Home
        <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[color:var(--color-accent-teal)] transition-all duration-200 group-hover:w-full" />
      </Link>
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-2">
          <motion.span
            className="flex items-center"
            whileHover={{ x: 2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <ChevronRight className="h-3 w-3" />
          </motion.span>
          {item.path ? (
            <Link
              to={item.path}
              className="group relative transition-colors hover:text-[color:var(--color-text-primary)]"
            >
              {item.label}
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[color:var(--color-accent-teal)] transition-all duration-200 group-hover:w-full" />
            </Link>
          ) : (
            <span className="text-[color:var(--color-text-secondary)]">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
