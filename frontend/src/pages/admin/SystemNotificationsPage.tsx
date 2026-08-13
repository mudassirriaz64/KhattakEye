import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Mail, ShoppingCart, AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { cn } from "@/lib/utils";
import axios from "@/lib/api/axios";

type Tab = "all" | "email" | "order" | "alert";

type ApiNotification = {
  _id: string;
  type: "email" | "order" | "alert";
  title: string;
  message: string;
  recipient?: string;
  status: "sent" | "pending" | "failed";
  read: boolean;
  createdAt: string;
};

const tabs: { key: Tab; label: string; icon: typeof Bell }[] = [
  { key: "all", label: "All", icon: Bell },
  { key: "email", label: "Email Logs", icon: Mail },
  { key: "order", label: "Order Notifications", icon: ShoppingCart },
  { key: "alert", label: "System Alerts", icon: AlertTriangle },
];

export function AdminSystemNotificationsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async (type: Tab) => {
    setLoading(true);
    try {
      const res = await axios.get("/admin/notifications", { params: { type } });
      if (res.data && Array.isArray(res.data.notifications)) {
        setNotifications(res.data.notifications);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(activeTab);
  }, [activeTab]);

  const toggleRead = async (id: string) => {
    try {
      await axios.put(`/admin/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    } catch (err) {
      console.error("Failed to mark notification read:", err);
    }
  };

  const markAllRead = async () => {
    try {
      await axios.put("/admin/notifications/mark-read");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark all notifications read:", err);
    }
  };

  const statusIcon = (status: string) => {
    if (status === "sent") return <CheckCircle className="h-4 w-4 text-emerald-500" />;
    if (status === "failed") return <XCircle className="h-4 w-4 text-red-500" />;
    return <Clock className="h-4 w-4 text-amber-500" />;
  };

  const formatTimeAgo = (dateStr: string) => {
    const d = new Date(dateStr);
    const diff = Math.floor((Date.now() - d.getTime()) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return d.toLocaleDateString();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">System Notifications</h1>
          <p className="mt-0.5 text-sm text-[color:var(--color-text-secondary)]">
            {notifications.filter((n) => !n.read).length} unread notifications
          </p>
        </div>
        {notifications.some((n) => !n.read) && (
          <button
            type="button"
            onClick={markAllRead}
            className="flex items-center gap-1.5 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-3.5 py-2 text-xs font-semibold text-[color:var(--color-brand-primary)] hover:bg-[color:var(--color-surface-muted)] transition-colors shadow-xs"
          >
            <CheckCircle className="h-3.5 w-3.5" /> Mark All as Read
          </button>
        )}
      </div>

      <div className="mb-6 flex gap-1.5 rounded-xl bg-[color:var(--color-surface-muted)] p-1.5">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActiveTab(t.key)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-medium transition-colors",
              activeTab === t.key
                ? "bg-[color:var(--color-panel)] text-[color:var(--color-text-primary)] shadow-[var(--shadow-soft)]"
                : "text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-primary)]"
            )}
          >
            <t.icon className="h-3.5 w-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <div className="h-8 w-8 animate-spin mx-auto rounded-full border-4 border-[color:var(--color-brand-primary)] border-t-transparent"></div>
          <p className="mt-2 text-xs text-[color:var(--color-text-tertiary)]">Loading system notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)]">
          <Bell className="mx-auto h-8 w-8 text-[color:var(--color-text-tertiary)]" />
          <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">No notifications found in this category.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n, i) => (
            <motion.div
              key={n._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => toggleRead(n._id)}
              className={cn(
                "flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition-colors",
                n.read
                  ? "border-[color:var(--color-border)] bg-[color:var(--color-panel)]"
                  : "border-[color:var(--color-accent-teal)]/30 bg-[color:var(--color-accent-teal)]/5"
              )}
            >
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl shrink-0",
                  n.type === "email"
                    ? "bg-[color:var(--color-accent-blue)]/10"
                    : n.type === "order"
                    ? "bg-emerald-500/10"
                    : "bg-amber-500/10"
                )}
              >
                {n.type === "email" ? (
                  <Mail className="h-4 w-4 text-[color:var(--color-accent-blue)]" />
                ) : n.type === "order" ? (
                  <ShoppingCart className="h-4 w-4 text-emerald-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={cn("text-sm font-medium", n.read ? "text-[color:var(--color-text-primary)]" : "font-bold text-[color:var(--color-text-primary)]")}>
                    {n.title}
                  </span>
                  {!n.read && <span className="h-2 w-2 rounded-full bg-[color:var(--color-accent-teal)]" />}
                </div>
                <p className="mt-0.5 text-xs text-[color:var(--color-text-secondary)]">{n.message}</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-[10px] text-[color:var(--color-text-tertiary)]">{formatTimeAgo(n.createdAt)}</span>
                  {n.recipient && <span className="text-[10px] text-[color:var(--color-text-tertiary)]">To: {n.recipient}</span>}
                  <StatusBadge status={n.status} />
                </div>
              </div>
              {statusIcon(n.status)}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
