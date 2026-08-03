import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export type Column<T> = {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
  className?: string;
  sortable?: boolean;
};

type Props<T> = {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
};

export function DataTable<T>({ columns, data, keyExtractor, onRowClick, emptyMessage }: Props<T>) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--color-surface-muted)]">
          <ChevronDown className="h-6 w-6 text-[color:var(--color-text-tertiary)]" />
        </div>
        <p className="mt-4 text-sm text-[color:var(--color-text-secondary)]">{emptyMessage || "No data found"}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[color:var(--color-border)]">
            {columns.map((col) => (
              <th key={col.key} className={`px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)] ${col.className || ""}`}>
                <div className="flex items-center gap-1.5">
                  {col.header}
                  {col.sortable && <ChevronDown className="h-3 w-3" />}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <motion.tr
              key={keyExtractor(item)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.02 }}
              onClick={() => onRowClick?.(item)}
              className="border-b border-[color:var(--color-border)] transition-colors last:border-0 hover:bg-[color:var(--color-surface-muted)]"
            >
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-3 text-sm text-[color:var(--color-text-primary)] ${col.className || ""}`}>
                  {col.render(item)}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
