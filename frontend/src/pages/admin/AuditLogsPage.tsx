import { useState } from "react";
import { motion } from "framer-motion";
import { ClipboardList, Search, Filter, ArrowUpDown } from "lucide-react";
import { auditLogs, type AuditLog } from "@/lib/admin-data";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { cn } from "@/lib/utils";

type SeverityFilter = "all" | "low" | "medium" | "high" | "critical";
type SortField = "timestamp" | "user" | "severity";
type SortDir = "asc" | "desc";

export function AdminAuditLogsPage() {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all");
  const [sortField, setSortField] = useState<SortField>("timestamp");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const filtered = auditLogs.filter((log) => {
    const matchSearch = !search || log.user.toLowerCase().includes(search.toLowerCase()) || log.action.toLowerCase().includes(search.toLowerCase()) || log.resource.toLowerCase().includes(search.toLowerCase()) || log.details.toLowerCase().includes(search.toLowerCase());
    const matchSeverity = severityFilter === "all" || log.severity === severityFilter;
    return matchSearch && matchSeverity;
  });

  const sorted = [...filtered].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    if (sortField === "timestamp") return dir * (a.timestamp.localeCompare(b.timestamp));
    if (sortField === "user") return dir * a.user.localeCompare(b.user);
    const sevOrder = { low: 0, medium: 1, high: 2, critical: 3 };
    return dir * ((sevOrder[a.severity] || 0) - (sevOrder[b.severity] || 0));
  });

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("desc"); }
  };

  const severityColors: Record<string, string> = {
    low: "bg-[color:var(--color-accent-blue)]/10 text-[color:var(--color-accent-blue)]",
    medium: "bg-amber-500/10 text-amber-600",
    high: "bg-orange-500/10 text-orange-600",
    critical: "bg-red-500/10 text-red-600",
  };

  const sortableHeader = (label: string, field: SortField) => (
    <th className="px-4 py-3 text-left cursor-pointer select-none" onClick={() => toggleSort(field)}>
      <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">
        {label}
        {sortField === field && <ArrowUpDown className={cn("h-3 w-3", sortDir === "asc" && "rotate-180")} />}
      </div>
    </th>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">Audit Logs</h1>
        <p className="mt-0.5 text-sm text-[color:var(--color-text-secondary)]">Comprehensive audit trail of all system changes</p>
      </div>

      <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)]">
        <div className="flex flex-col gap-4 border-b border-[color:var(--color-border)] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search audit logs..." className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] py-2.5 pl-10 pr-4 text-sm text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-accent-teal)] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-focus-ring)]" />
          </div>
          <div className="flex gap-1.5">
            {(["all", "low", "medium", "high", "critical"] as SeverityFilter[]).map((s) => (
              <button key={s} type="button" onClick={() => setSeverityFilter(s)} className={cn("rounded-lg px-3 py-1.5 text-[10px] font-medium transition-colors", severityFilter === s ? "bg-[color:var(--color-brand-primary)] text-white" : "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]")}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[color:var(--color-border)]">
                {sortableHeader("User", "user")}
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">Role</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">Action</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">Resource</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">Details</th>
                {sortableHeader("Severity", "severity")}
                {sortableHeader("Timestamp", "timestamp")}
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">IP</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((log, i) => (
                <motion.tr key={log.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.015 }} className="border-b border-[color:var(--color-border)] last:border-0 hover:bg-[color:var(--color-surface-muted)]">
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium text-[color:var(--color-text-primary)]">{log.user}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] text-[color:var(--color-text-tertiary)]">{log.role}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-lg bg-[color:var(--color-surface-muted)] px-2 py-0.5 text-[10px] font-medium text-[color:var(--color-text-primary)]">{log.action}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-[color:var(--color-text-primary)]">{log.resource}</span>
                    <span className="ml-1 text-[10px] text-[color:var(--color-text-tertiary)]">#{log.resourceId}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="max-w-[200px] truncate text-[10px] text-[color:var(--color-text-secondary)]" title={log.details}>{log.details}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded-lg px-2 py-0.5 text-[10px] font-semibold capitalize", severityColors[log.severity])}>{log.severity}</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-[10px] text-[color:var(--color-text-tertiary)]">{log.timestamp}</td>
                  <td className="px-4 py-3 text-[10px] text-[color:var(--color-text-tertiary)]">{log.ip}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {sorted.length === 0 && (
          <div className="flex flex-col items-center py-12 text-center">
            <ClipboardList className="h-10 w-10 text-[color:var(--color-text-tertiary)]" />
            <p className="mt-3 text-sm font-medium text-[color:var(--color-text-primary)]">No audit logs found</p>
            <p className="text-xs text-[color:var(--color-text-secondary)]">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
