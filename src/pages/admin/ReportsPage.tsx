import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Download, FileText, TrendingUp, ShoppingCart, Package, Users, AlertTriangle } from "lucide-react";
import { reportMetrics, reportDataDaily, reportDataWeekly, reportDataMonthly, reportDataYearly, type ReportPeriod, type ReportDataPoint } from "@/lib/admin-data";
import { BarChart } from "@/components/admin/AdminCharts";
import { Button } from "@/components/primitives/Button";
import { cn } from "@/lib/utils";

const periods: { key: ReportPeriod; label: string }[] = [
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "yearly", label: "Yearly" },
];

const chartDataMap: Record<ReportPeriod, ReportDataPoint[]> = {
  daily: reportDataDaily,
  weekly: reportDataWeekly,
  monthly: reportDataMonthly,
  yearly: reportDataYearly,
};

const metricIcons: Record<string, typeof TrendingUp> = {
  Revenue: TrendingUp,
  Orders: ShoppingCart,
  "Products Sold": Package,
  "New Customers": Users,
  "Inventory Issues": AlertTriangle,
};

export function AdminReportsPage() {
  const [period, setPeriod] = useState<ReportPeriod>("monthly");
  const [chartMetric, setChartMetric] = useState<"revenue" | "orders" | "products" | "customers">("revenue");
  const metrics = reportMetrics[period];
  const chartData = chartDataMap[period];

  const exportAction = (format: string) => {
    const action = `Exported ${period} report as ${format}`;
    alert(`${action} (mock)`);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">Reports</h1>
          <p className="mt-0.5 text-sm text-[color:var(--color-text-secondary)]">Analytics and performance data</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" iconLeft={<FileText className="h-4 w-4" />} onClick={() => exportAction("PDF")} className="text-xs">Export PDF</Button>
          <Button variant="outline" iconLeft={<Download className="h-4 w-4" />} onClick={() => exportAction("Excel")} className="text-xs">Export Excel</Button>
        </div>
      </div>

      <div className="mb-6 flex gap-1.5 rounded-xl bg-[color:var(--color-surface-muted)] p-1.5">
        {periods.map((p) => (
          <button key={p.key} type="button" onClick={() => setPeriod(p.key)} className={cn("flex-1 rounded-lg px-4 py-2 text-xs font-medium transition-colors", period === p.key ? "bg-[color:var(--color-panel)] text-[color:var(--color-text-primary)] shadow-[var(--shadow-soft)]" : "text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-primary)]")}>
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {metrics.map((m, i) => {
          const Icon = metricIcons[m.label] || BarChart3;
          return (
            <motion.div key={m.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">{m.label}</span>
                <Icon className="h-4 w-4 text-[color:var(--color-text-tertiary)]" />
              </div>
              <p className="mt-2 text-xl font-bold text-[color:var(--color-text-primary)]">{m.label === "Revenue" ? `Rs. ${m.value.toLocaleString()}` : m.value}</p>
              <div className="mt-1 flex items-center gap-1">
                <TrendingUp className={cn("h-3 w-3", m.positive ? "text-emerald-500" : "text-red-500")} />
                <span className={cn("text-[10px] font-semibold", m.positive ? "text-emerald-500" : "text-red-500")}>{m.positive ? "+" : ""}{m.change}%</span>
                <span className="text-[10px] text-[color:var(--color-text-tertiary)]">vs last {period === "daily" ? "week" : period === "weekly" ? "month" : period === "monthly" ? "year" : "year"}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base text-[color:var(--color-text-primary)]">{period.charAt(0).toUpperCase() + period.slice(1)} Overview</h3>
            <div className="flex gap-1.5">
              {(["revenue", "orders", "products", "customers"] as const).map((m) => (
                <button key={m} type="button" onClick={() => setChartMetric(m)} className={cn("rounded-lg px-2.5 py-1 text-[10px] font-medium capitalize transition-colors", chartMetric === m ? "bg-[color:var(--color-brand-primary)] text-white" : "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-primary)]")}>{m}</button>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <BarChart data={chartData.map((d) => ({ label: d.label, value: d[chartMetric] }))} height={220} />
          </div>
        </div>

        <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
          <h3 className="font-display text-base text-[color:var(--color-text-primary)]">Summary</h3>
          <div className="mt-4 space-y-3">
            {chartData.map((d) => (
              <div key={d.label} className="flex items-center justify-between border-b border-[color:var(--color-border)] pb-2 last:border-0">
                <span className="text-xs text-[color:var(--color-text-secondary)]">{d.label}</span>
                <span className="text-xs font-semibold text-[color:var(--color-text-primary)]">Rs. {d.revenue.toLocaleString()}</span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold text-[color:var(--color-text-primary)]">Total</span>
              <span className="text-xs font-bold text-[color:var(--color-text-primary)]">Rs. {chartData.reduce((s, d) => s + d.revenue, 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
        <h3 className="font-display text-base text-[color:var(--color-text-primary)]">Detailed Data</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[color:var(--color-border)]">
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">Period</th>
                <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">Revenue</th>
                <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">Orders</th>
                <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">Products</th>
                <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">Customers</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((d, i) => (
                <motion.tr key={d.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="border-b border-[color:var(--color-border)] last:border-0 hover:bg-[color:var(--color-surface-muted)]">
                  <td className="px-4 py-3 text-xs font-medium text-[color:var(--color-text-primary)]">{d.label}</td>
                  <td className="px-4 py-3 text-right text-xs text-[color:var(--color-text-primary)]">Rs. {d.revenue.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-xs text-[color:var(--color-text-primary)]">{d.orders}</td>
                  <td className="px-4 py-3 text-right text-xs text-[color:var(--color-text-primary)]">{d.products}</td>
                  <td className="px-4 py-3 text-right text-xs text-[color:var(--color-text-primary)]">{d.customers}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
