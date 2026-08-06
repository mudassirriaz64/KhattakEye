import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Package, Tag, Megaphone, Info, CheckCheck, Trash2 } from "lucide-react";
import { AccountLayout } from "@/components/account/AccountLayout";
import { mockNotifications } from "@/lib/account-data";
import { Button } from "@/components/primitives/Button";
import { cn } from "@/lib/utils";

const typeConfig: Record<string, { icon: typeof Bell; bg: string; color: string }> = {
  order: { icon: Package, bg: "bg-[color:var(--color-accent-blue)]/10", color: "text-[color:var(--color-accent-blue)]" },
  promotion: { icon: Megaphone, bg: "bg-[color:var(--color-brand-primary)]/10", color: "text-[color:var(--color-brand-primary)]" },
  offer: { icon: Tag, bg: "bg-rose-500/10", color: "text-rose-500" },
  system: { icon: Info, bg: "bg-[color:var(--color-accent-teal)]/10", color: "text-[color:var(--color-accent-teal)]" },
};

export function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const remove = (id: string) => setNotifications((prev) => prev.filter((n) => n.id !== id));

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <AccountLayout title="Notifications" subtitle={`${unread} unread notification${unread !== 1 ? "s" : ""}`}>
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          {(["all", "unread"] as const).map((f) => (
            <button key={f} type="button" className={cn("rounded-lg px-3.5 py-1.5 text-xs font-medium capitalize transition-colors", "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]")}>
              {f}
            </button>
          ))}
        </div>
        {unread > 0 && (
          <Button variant="ghost" iconLeft={<CheckCheck className="h-3.5 w-3.5" />} onClick={markAllRead} className="text-xs">Mark All Read</Button>
        )}
      </div>

      <div className="mt-6 space-y-3">
        <AnimatePresence>
          {notifications.length === 0 ? (
            <div className="py-12 text-center">
              <Bell className="mx-auto h-10 w-10 text-[color:var(--color-text-tertiary)]" />
              <p className="mt-3 text-sm text-[color:var(--color-text-secondary)]">No notifications yet.</p>
            </div>
          ) : (
            notifications.map((notif, i) => {
              const config = typeConfig[notif.type] || typeConfig.system;
              const Icon = config.icon;
              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: i * 0.03 }}
                  className={cn(
                    "flex items-start gap-4 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4 transition-colors",
                    !notif.read && "border-[color:var(--color-accent-teal)]/20 bg-[color:var(--color-accent-teal)]/5",
                  )}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.bg}`}>
                    <Icon className={`h-5 w-5 ${config.color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className={cn("text-sm", notif.read ? "text-[color:var(--color-text-primary)]" : "font-semibold text-[color:var(--color-text-primary)]")}>{notif.title}</p>
                      <div className="flex items-center gap-2">
                        {!notif.read && <span className="h-2 w-2 rounded-full bg-[color:var(--color-accent-teal)]" />}
                        <button type="button" onClick={() => remove(notif.id)} className="text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-danger)]">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="mt-0.5 text-xs leading-relaxed text-[color:var(--color-text-secondary)]">{notif.message}</p>
                    <p className="mt-1.5 text-[10px] text-[color:var(--color-text-tertiary)]">{notif.date}</p>
                  </div>
                  {!notif.read && (
                    <button type="button" onClick={() => markRead(notif.id)} className="shrink-0 rounded-lg border border-[color:var(--color-border)] px-2.5 py-1 text-[10px] font-medium text-[color:var(--color-text-tertiary)] transition-colors hover:bg-[color:var(--color-surface-muted)]">
                      Mark Read
                    </button>
                  )}
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </AccountLayout>
  );
}
