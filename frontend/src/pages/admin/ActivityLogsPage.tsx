import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Search, Filter, AlertTriangle, Info, AlertCircle } from "lucide-react";
import { activityLogs } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

type SeverityFilter = "all" | "info" | "warning" | "critical";

export function AdminActivityLogsPage() {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all");

  const filtered = activityLogs.filter((log) => {
    const matchSearch = !search || log.action.toLowerCase().includes(search.toLowerCase()) || log.user.toLowerCase().includes(search.toLowerCase()) || log.details.toLowerCase().includes(search.toLowerCase());
    const matchSeverity = severityFilter === "all" || log.severity === severityFilter;
    return matchSearch && matchSeverity;
  });

  const severityIcon = (s: string) => {
    if (s === "critical") return <AlertCircle className="h-4 w-4 text-red-500" />;
    if (s === "warning") return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    return <Info className="h-4 w-4 text-[color:var(--color-accent-blue)]" />;
  };

  const severityDot = (s: string) => {
    if (s === "critical") return "bg-red-500";
    if (s === "warning") return "bg-amber-500";
    return "bg-[color:var(--color-accent-blue)]";
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">Activity Logs</h1>
        <p className="mt-0.5 text-sm text-[color:var(--color-text-secondary)]">Track every admin action</p>
      </div>

      <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)]">
        <div className="flex flex-col gap-4 border-b border-[color:var(--color-border)] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search activity..." className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] py-2.5 pl-10 pr-4 text-sm text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-accent-teal)] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-focus-ring)]" />
          </div>
          <div className="flex gap-1.5">
            {(["all", "info", "warning", "critical"] as SeverityFilter[]).map((s) => (
              <button key={s} type="button" onClick={() => setSeverityFilter(s)} className={cn("flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors", severityFilter === s ? "bg-[color:var(--color-brand-primary)] text-white" : "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]")}>
                <Filter className="h-3 w-3" /> {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-[color:var(--color-border)]">
          {filtered.map((log, i) => (
            <motion.div key={log.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }} className="flex items-start gap-4 px-5 py-4 hover:bg-[color:var(--color-surface-muted)]/50">
              <div className="relative mt-0.5">
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", log.severity === "critical" ? "bg-red-500/10" : log.severity === "warning" ? "bg-amber-500/10" : "bg-[color:var(--color-accent-blue)]/10")}>
                  {severityIcon(log.severity)}
                </div>
                {i < filtered.length - 1 && <div className="absolute left-4 top-10 h-full w-px bg-[color:var(--color-border)]" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-[color:var(--color-text-primary)]">{log.user}</span>
                  <span className={cn("h-1.5 w-1.5 rounded-full", severityDot(log.severity))} />
                  <span className="text-[10px] text-[color:var(--color-text-tertiary)]">{log.timestamp}</span>
                </div>
                <p className="mt-0.5 text-xs text-[color:var(--color-text-primary)]">
                  <span className="font-medium">{log.action}</span> on <span className="font-medium">{log.resource}</span>
                </p>
                <p className="text-[10px] text-[color:var(--color-text-tertiary)]">{log.details}</p>
                <p className="mt-1 text-[9px] text-[color:var(--color-text-tertiary)]">IP: {log.ip}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-12 text-center">
            <Activity className="h-10 w-10 text-[color:var(--color-text-tertiary)]" />
            <p className="mt-3 text-sm font-medium text-[color:var(--color-text-primary)]">No activity found</p>
            <p className="text-xs text-[color:var(--color-text-secondary)]">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
