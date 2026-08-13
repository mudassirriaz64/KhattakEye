import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, Menu, LogOut, Settings, Trash2 } from "lucide-react";
import { useAdminStore } from "@/lib/stores/admin-store";
import { cn } from "@/lib/utils";
import axios from "@/lib/api/axios";

type Props = { onMenuClick: () => void };

type TopBarNotification = {
  _id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export function AdminTopBar({ onMenuClick }: Props) {
  const { user, toggleSidebar } = useAdminStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState<TopBarNotification[]>([]);

  const fetchTopNotifications = async () => {
    try {
      const res = await axios.get("/admin/notifications", { params: { limit: 5 } });
      if (res.data && Array.isArray(res.data.notifications)) {
        setNotifications(res.data.notifications);
      }
    } catch (err) {
      console.error("Failed to fetch top notifications:", err);
    }
  };

  useEffect(() => {
    fetchTopNotifications();
  }, []);

  const markAllRead = async () => {
    try {
      await axios.put("/admin/notifications/mark-read");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark all read:", err);
    }
  };

  const markSingleRead = async (id: string) => {
    try {
      await axios.put(`/admin/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    } catch (err) {
      console.error("Failed to mark single read:", err);
    }
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
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[color:var(--color-border)] bg-[color:var(--color-panel)]/80 px-4 backdrop-blur-2xl lg:px-6">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onMenuClick} className="flex h-9 w-9 items-center justify-center rounded-xl text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-muted)] lg:hidden">
          <Menu className="h-5 w-5" />
        </button>
        <button type="button" onClick={toggleSidebar} className="hidden h-9 w-9 items-center justify-center rounded-xl text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-muted)] lg:flex">
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative ml-2 hidden sm:block">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search anything..."
            className="w-64 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] py-2 pl-10 pr-4 text-sm text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-accent-teal)] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-focus-ring)]"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button type="button" className="relative flex h-9 w-9 items-center justify-center rounded-xl text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-muted)] sm:hidden" onClick={() => setSearchOpen(!searchOpen)}>
          <Search className="h-4.5 w-4.5" />
        </button>

        {/* Product Trash quick-access button */}
        <Link
          to="/admin/products?status=Trash"
          title="Product Trash"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-danger)]"
        >
          <Trash2 className="h-4.5 w-4.5" />
        </Link>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-muted)]"
            aria-label="Notifications"
          >
            <Bell className="h-4.5 w-4.5" />
            {notifications.some((n) => !n.read) && (
              <span className="absolute right-2 top-2 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
            )}
          </button>
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute right-0 top-12 w-80 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4 shadow-[var(--shadow-strong)] backdrop-blur-xl"
              >
                <div className="mb-3 flex items-center justify-between border-b border-[color:var(--color-border)] pb-2">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-[color:var(--color-text-primary)]">Notifications</p>
                    {notifications.filter((n) => !n.read).length > 0 && (
                      <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-500">
                        {notifications.filter((n) => !n.read).length} new
                      </span>
                    )}
                  </div>
                  {notifications.some((n) => !n.read) && (
                    <button
                      type="button"
                      onClick={markAllRead}
                      className="text-[10px] font-semibold text-[color:var(--color-brand-primary)] hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                  {notifications.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => markSingleRead(item._id)}
                      className={cn(
                        "group flex cursor-pointer items-start justify-between gap-3 rounded-xl p-2.5 transition-all border",
                        item.read
                          ? "border-transparent bg-transparent opacity-70 hover:bg-[color:var(--color-surface-muted)]"
                          : "border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] shadow-xs"
                      )}
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <span
                          className={cn(
                            "mt-1.5 h-2 w-2 rounded-full shrink-0 transition-colors",
                            item.read ? "bg-transparent" : "bg-[color:var(--color-brand-primary)]"
                          )}
                        />
                        <div className="min-w-0">
                          <p className={cn("text-xs font-semibold truncate", item.read ? "text-[color:var(--color-text-secondary)] font-normal" : "text-[color:var(--color-text-primary)]")}>
                            {item.title}
                          </p>
                          <p className="text-[10px] text-[color:var(--color-text-tertiary)] truncate">{item.message}</p>
                          <p className="mt-0.5 text-[9px] text-[color:var(--color-text-tertiary)]">{formatTimeAgo(item.createdAt)}</p>
                        </div>
                      </div>
                      {!item.read && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            markSingleRead(item._id);
                          }}
                          className="shrink-0 text-[10px] font-bold text-[color:var(--color-brand-primary)] hover:underline"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-3 border-t border-[color:var(--color-border)] pt-2 text-center">
                  <Link
                    to="/admin/notifications"
                    onClick={() => setShowNotifications(false)}
                    className="text-[11px] font-bold text-[color:var(--color-brand-primary)] hover:underline"
                  >
                    View All System Notifications →
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <button type="button" onClick={() => setShowProfile(!showProfile)} className="flex items-center gap-2 rounded-xl p-1.5 transition-colors hover:bg-[color:var(--color-surface-muted)]">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--color-brand-primary)] text-[10px] font-bold text-white">
              {user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "AK"}
            </div>
          </button>
          <AnimatePresence>
            {showProfile && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute right-0 top-12 w-56 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-3 shadow-[var(--shadow-strong)]">
                <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[color:var(--color-brand-primary)] text-xs font-bold text-white">AK</div>
                  <div>
                    <p className="text-sm font-semibold text-[color:var(--color-text-primary)]">{user?.name}</p>
                    <p className="text-[10px] text-[color:var(--color-text-tertiary)]">{user?.email}</p>
                  </div>
                </div>
                <div className="mt-2 space-y-1 border-t border-[color:var(--color-border)] pt-2">
                  <Link to="/admin/settings" className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-text-primary)]">
                    <Settings className="h-4 w-4" /> Settings
                  </Link>
                  <button type="button" className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-danger)]">
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
