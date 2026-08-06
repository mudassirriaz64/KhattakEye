import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Monitor, Globe, LogIn, Lock, Check, X } from "lucide-react";
import { adminSessions, loginHistory, passwordPolicies } from "@/lib/admin-data";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/primitives/Button";
import { cn } from "@/lib/utils";

type Tab = "sessions" | "history" | "policies" | "2fa";

export function AdminSecurityPage() {
  const [activeTab, setActiveTab] = useState<Tab>("sessions");
  const [sessions, setSessions] = useState(adminSessions);
  const [policies, setPolicies] = useState(passwordPolicies);

  const terminateSession = (id: string) => {
    if (id !== "sess-001") setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const togglePolicy = (key: string) => {
    setPolicies((prev) => prev.map((p) => p.key === key ? { ...p, enabled: !p.enabled } : p));
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "sessions", label: "Sessions" },
    { key: "history", label: "Login History" },
    { key: "policies", label: "Password Policies" },
    { key: "2fa", label: "2FA" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">Security</h1>
        <p className="mt-0.5 text-sm text-[color:var(--color-text-secondary)]">Manage security settings and sessions</p>
      </div>

      <div className="mb-6 flex gap-1.5 rounded-xl bg-[color:var(--color-surface-muted)] p-1.5">
        {tabs.map((t) => (
          <button key={t.key} type="button" onClick={() => setActiveTab(t.key)} className={cn("flex-1 rounded-lg px-4 py-2 text-xs font-medium transition-colors", activeTab === t.key ? "bg-[color:var(--color-panel)] text-[color:var(--color-text-primary)] shadow-[var(--shadow-soft)]" : "text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-primary)]")}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "sessions" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          {sessions.map((sess) => (
            <div key={sess.id} className={cn("rounded-2xl border p-5", sess.current ? "border-[color:var(--color-accent-teal)]/30 bg-[color:var(--color-accent-teal)]/5" : "border-[color:var(--color-border)] bg-[color:var(--color-panel)]")}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", sess.current ? "bg-[color:var(--color-accent-teal)]/10" : "bg-[color:var(--color-surface-muted)]")}>
                    {sess.device.includes("iPhone") || sess.device.includes("Mac") ? <Monitor className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[color:var(--color-text-primary)]">{sess.device}</span>
                      {sess.current && <StatusBadge status="active" />}
                    </div>
                    <p className="mt-0.5 text-xs text-[color:var(--color-text-secondary)]">{sess.browser}</p>
                    <div className="mt-2 flex items-center gap-3 text-[10px] text-[color:var(--color-text-tertiary)]">
                      <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> {sess.location}</span>
                      <span>IP: {sess.ip}</span>
                      <span>Last active: {sess.lastActive}</span>
                    </div>
                  </div>
                </div>
                {!sess.current && (
                  <Button variant="outline" onClick={() => terminateSession(sess.id)} className="text-[10px]">Terminate</Button>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {activeTab === "history" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)]">
          <div className="divide-y divide-[color:var(--color-border)]">
            {loginHistory.map((entry) => (
              <div key={entry.id} className="flex items-center gap-4 px-5 py-4">
                <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", entry.success ? "bg-emerald-500/10" : "bg-red-500/10")}>
                  {entry.success ? <LogIn className="h-4 w-4 text-emerald-500" /> : <X className="h-4 w-4 text-red-500" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-[color:var(--color-text-primary)]">{entry.user}</span>
                    <StatusBadge status={entry.success ? "active" : "cancelled"} />
                  </div>
                  <p className="mt-0.5 text-[10px] text-[color:var(--color-text-tertiary)]">{entry.device} · {entry.location}</p>
                  {!entry.success && entry.reason && <p className="text-[10px] text-red-500">{entry.reason}</p>}
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-[color:var(--color-text-tertiary)]">{entry.timestamp}</p>
                  <p className="text-[9px] text-[color:var(--color-text-tertiary)]">IP: {entry.ip}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === "policies" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid gap-3 sm:grid-cols-2">
          {policies.map((policy, i) => (
            <motion.div key={policy.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
              <div className="flex items-start justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[color:var(--color-surface-muted)]">
                  <Lock className="h-4 w-4 text-[color:var(--color-text-tertiary)]" />
                </div>
                <button type="button" onClick={() => togglePolicy(policy.key)} className={cn("flex h-7 w-12 items-center rounded-full transition-colors", policy.enabled ? "bg-[color:var(--color-accent-teal)]" : "bg-[color:var(--color-surface-muted)]")}>
                  <div className={cn("h-5 w-5 rounded-full bg-white shadow transition-transform", policy.enabled ? "translate-x-6" : "translate-x-1")} />
                </button>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-[color:var(--color-text-primary)]">{policy.label}</h3>
              <p className="mt-1 text-xs text-[color:var(--color-text-secondary)]">{policy.value}</p>
              <div className="mt-2 flex items-center gap-1">
                {policy.enabled ? <Check className="h-3 w-3 text-emerald-500" /> : <X className="h-3 w-3 text-[color:var(--color-text-tertiary)]" />}
                <span className={cn("text-[10px] font-medium", policy.enabled ? "text-emerald-500" : "text-[color:var(--color-text-tertiary)]")}>{policy.enabled ? "Enabled" : "Disabled"}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {activeTab === "2fa" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[color:var(--color-accent-teal)]/10">
            <Shield className="h-8 w-8 text-[color:var(--color-accent-teal)]" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-[color:var(--color-text-primary)]">Two-Factor Authentication</h3>
          <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">Add an extra layer of security to your admin account by enabling two-factor authentication.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Button variant="primary" className="text-xs">Enable 2FA</Button>
            <Button variant="outline" className="text-xs">Learn More</Button>
          </div>
          <div className="mt-6 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-4 text-left">
            <p className="text-xs font-medium text-[color:var(--color-text-primary)]">Coming Soon</p>
            <p className="mt-1 text-[10px] text-[color:var(--color-text-tertiary)]">2FA via authenticator apps (Google Authenticator, Authy) and SMS codes will be available in the next update.</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
