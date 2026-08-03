import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Mail, ShoppingCart, AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react";
import { systemNotifications, type SystemNotification } from "@/lib/admin-data";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { cn } from "@/lib/utils";

type Tab = "all" | "email" | "order" | "alert";

const tabs: { key: Tab; label: string; icon: typeof Bell }[] = [
  { key: "all", label: "All", icon: Bell },
  { key: "email", label: "Email Logs", icon: Mail },
  { key: "order", label: "Order Notifications", icon: ShoppingCart },
  { key: "alert", label: "System Alerts", icon: AlertTriangle },
];

export function AdminSystemNotificationsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [notifications, setNotifications] = useState(systemNotifications);

  const filtered = activeTab === "all" ? notifications : notifications.filter((n) => n.type === activeTab);

  const toggleRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: !n.read } : n));
  };

  const statusIcon = (status: string) => {
    if (status === "sent") return <CheckCircle className="h-4 w-4 text-emerald-500" />;
    if (status === "failed") return <XCircle className="h-4 w-4 text-red-500" />;
    return <Clock className="h-4 w-4 text-amber-500" />;
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">System Notifications</h1>
        <p className="mt-0.5 text-sm text-[color:var(--color-text-secondary)]">{notifications.filter((n) => !n.read).length} unread notifications</p>
      </div>

      <div className="mb-6 flex gap-1.5 rounded-xl bg-[color:var(--color-surface-muted)] p-1.5">
        {tabs.map((t) => (
          <button key={t.key} type="button" onClick={() => setActiveTab(t.key)} className={cn("flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-medium transition-colors", activeTab === t.key ? "bg-[color:var(--color-panel)] text-[color:var(--color-text-primary)] shadow-[var(--shadow-soft)]" : "text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-primary)]")}>
            <t.icon className="h-3.5 w-3.5" /> {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((n, i) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => toggleRead(n.id)}
            className={cn("flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition-colors", n.read ? "border-[color:var(--color-border)] bg-[color:var(--color-panel)]" : "border-[color:var(--color-accent-teal)]/30 bg-[color:var(--color-accent-teal)]/5")}
          >
            <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", n.type === "email" ? "bg-[color:var(--color-accent-blue)]/10" : n.type === "order" ? "bg-emerald-500/10" : "bg-amber-500/10")}>
              {n.type === "email" ? <Mail className="h-4 w-4 text-[color:var(--color-accent-blue)]" /> : n.type === "order" ? <ShoppingCart className="h-4 w-4 text-emerald-500" /> : <AlertTriangle className="h-4 w-4 text-amber-500" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className={cn("text-sm font-medium", n.read ? "text-[color:var(--color-text-primary)]" : "text-[color:var(--color-text-primary)]")}>{n.title}</span>
                {!n.read && <span className="h-2 w-2 rounded-full bg-[color:var(--color-accent-teal)]" />}
              </div>
              <p className="mt-0.5 text-xs text-[color:var(--color-text-secondary)]">{n.message}</p>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-[10px] text-[color:var(--color-text-tertiary)]">{n.timestamp}</span>
                {n.recipient && <span className="text-[10px] text-[color:var(--color-text-tertiary)]">To: {n.recipient}</span>}
                <StatusBadge status={n.status} />
              </div>
            </div>
            {statusIcon(n.status)}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
