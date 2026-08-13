import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Send, Trash2, Search, Users } from "lucide-react";
import { cmsSubscribers } from "@/lib/admin-data";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { Button } from "@/components/primitives/Button";
import { cn } from "@/lib/utils";
import axios from "@/lib/api/axios";

export function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<typeof cmsSubscribers>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "unsubscribed">("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showSend, setShowSend] = useState(false);
  const [emailForm, setEmailForm] = useState({ subject: "", message: "" });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    axios.get("/admin/users")
      .then((res) => {
        if (res.data?.items && Array.isArray(res.data.items) && res.data.items.length > 0) {
          setSubscribers(res.data.items.map((u: { _id: string; fullName?: string; email: string; createdAt?: string }) => ({
            id: u._id,
            email: u.email,
            name: u.fullName || "Subscriber",
            subscribedAt: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Recent",
            status: "active" as const
          })));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = subscribers.filter((s) => {
    const matchStatus = activeFilter === "all" || s.status === activeFilter;
    const matchSearch = !search || s.email.toLowerCase().includes(search.toLowerCase()) || s.name.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const removeSubscriber = () => {
    if (deleteId) { setSubscribers((prev) => prev.filter((s) => s.id !== deleteId)); setDeleteId(null); }
  };

  const handleSend = async () => {
    setSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    setShowSend(false);
    setEmailForm({ subject: "", message: "" });
  };

  const filters = [
    { key: "all" as const, label: "All", count: subscribers.length },
    { key: "active" as const, label: "Active", count: subscribers.filter((s) => s.status === "active").length },
    { key: "unsubscribed" as const, label: "Unsubscribed", count: subscribers.filter((s) => s.status === "unsubscribed").length },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">Newsletter</h1>
          <p className="mt-0.5 text-sm text-[color:var(--color-text-secondary)]">{subscribers.length} subscribers</p>
        </div>
        <Button variant="primary" iconLeft={<Send className="h-4 w-4" />} onClick={() => setShowSend(true)} className="text-xs">Send Newsletter</Button>
      </div>

      {showSend && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-6 overflow-hidden">
          <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
            <h3 className="text-sm font-semibold">Send Newsletter</h3>
            <div className="mt-4 space-y-4">
              <div><label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Subject</label><input type="text" value={emailForm.subject} onChange={(e) => setEmailForm((p) => ({ ...p, subject: e.target.value }))} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm" /></div>
              <div><label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Message</label><textarea rows={5} value={emailForm.message} onChange={(e) => setEmailForm((p) => ({ ...p, message: e.target.value }))} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm" placeholder="Write your newsletter content here..." /></div>
              <div className="flex items-center gap-3">
                <Button variant="primary" iconLeft={<Send className="h-4 w-4" />} loading={sending} onClick={handleSend} className="text-xs">Send to {subscribers.filter((s) => s.status === "active").length} subscribers</Button>
                <Button variant="ghost" onClick={() => setShowSend(false)} className="text-xs">Cancel</Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)]">
        <div className="flex flex-col gap-4 border-b border-[color:var(--color-border)] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search subscribers..." className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] py-2.5 pl-10 pr-4 text-sm text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-accent-teal)] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-focus-ring)]" />
            </div>
            <div className="flex gap-1.5">
              {filters.map((f) => (
                <button key={f.key} type="button" onClick={() => setActiveFilter(f.key)} className={cn("rounded-lg px-3 py-1.5 text-xs font-medium transition-colors", activeFilter === f.key ? "bg-[color:var(--color-brand-primary)] text-white" : "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]")}>{f.label} ({f.count})</button>
              ))}
            </div>
          </div>
        </div>

        <div className="divide-y divide-[color:var(--color-border)]">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
                <div className="h-9 w-9 rounded-lg bg-[color:var(--color-surface-muted)]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 rounded bg-[color:var(--color-surface-muted)]" />
                  <div className="h-3 w-1/2 rounded bg-[color:var(--color-surface-muted)]" />
                </div>
              </div>
            ))
          ) : (
            <AnimatePresence>
              {filtered.map((sub, i) => (
                <motion.div key={sub.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} transition={{ delay: i * 0.03 }} className="flex items-center gap-4 px-5 py-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[color:var(--color-surface-muted)]"><Mail className="h-4 w-4 text-[color:var(--color-text-tertiary)]" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[color:var(--color-text-primary)]">{sub.name}</p>
                    <p className="text-xs text-[color:var(--color-text-secondary)]">{sub.email}</p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={sub.status} />
                    <p className="mt-0.5 text-[10px] text-[color:var(--color-text-tertiary)]">{sub.subscribedAt}</p>
                  </div>
                  {sub.status === "unsubscribed" && (
                    <button type="button" onClick={() => setDeleteId(sub.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:bg-red-500/10 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-12 text-center">
            <Users className="h-10 w-10 text-[color:var(--color-text-tertiary)]" />
            <p className="mt-3 text-sm font-medium text-[color:var(--color-text-primary)]">No subscribers found</p>
            <p className="text-xs text-[color:var(--color-text-secondary)]">Try adjusting your search or filter.</p>
          </div>
        )}
      </div>

      <ConfirmModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={removeSubscriber} title="Remove Subscriber" message="Are you sure you want to remove this subscriber?" />
    </div>
  );
}
