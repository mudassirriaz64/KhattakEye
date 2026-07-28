import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Eye, EyeOff, AlertCircle, LoaderCircle, CheckCircle2 } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { AccountLayout } from "@/components/account/AccountLayout";
import { Button } from "@/components/primitives/Button";
import { cn } from "@/lib/utils";

export function ChangePasswordPage() {
  const { changePassword, isLoading } = useAuthStore();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const set = (key: string, value: string) => { setForm((p) => ({ ...p, [key]: value })); setErrors((p) => ({ ...p, [key]: "" })); setSuccess(false); };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.currentPassword) e.currentPassword = "Current password is required";
    if (!form.newPassword) e.newPassword = "New password is required";
    else if (form.newPassword.length < 8) e.newPassword = "Minimum 8 characters";
    if (form.newPassword !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const ok = await changePassword(form.currentPassword, form.newPassword);
    if (ok) {
      setSuccess(true);
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }
  };

  const strength = getStrength(form.newPassword);

  const inputClass = (f: string) => cn("w-full rounded-xl border bg-[color:var(--color-surface-muted)] py-3 pl-10 pr-11 text-sm text-[color:var(--color-text-primary)] shadow-[var(--shadow-input)] transition-all placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-accent-teal)] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-focus-ring)]", errors[f] && "border-[color:var(--color-danger)]");

  return (
    <AccountLayout title="Change Password" subtitle="Update your account password">
      <div className="max-w-md">
        {success && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center gap-3 rounded-xl border border-[color:var(--color-accent-teal)]/20 bg-[color:var(--color-accent-teal)]/5 p-4 text-sm text-[color:var(--color-accent-teal)]">
            <CheckCircle2 className="h-5 w-5 shrink-0" /> Password changed successfully.
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-secondary)]">Current Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
              <input type={show.current ? "text" : "password"} value={form.currentPassword} onChange={(e) => set("currentPassword", e.target.value)} placeholder="••••••••" className={inputClass("currentPassword")} />
              <button type="button" onClick={() => setShow((p) => ({ ...p, current: !p.current }))} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-primary)]">
                {show.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <AnimatePresence>{errors.currentPassword && <ErrorMsg msg={errors.currentPassword} />}</AnimatePresence>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-secondary)]">New Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
              <input type={show.new ? "text" : "password"} value={form.newPassword} onChange={(e) => set("newPassword", e.target.value)} placeholder="••••••••" className={inputClass("newPassword")} />
              <button type="button" onClick={() => setShow((p) => ({ ...p, new: !p.new }))} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-primary)]">
                {show.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <AnimatePresence>{errors.newPassword && <ErrorMsg msg={errors.newPassword} />}</AnimatePresence>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-[color:var(--color-surface-muted)]">
            <motion.div initial={{ width: 0 }} animate={{ width: `${strength}%` }} className={`h-full rounded-full transition-colors ${strength <= 30 ? "bg-[color:var(--color-danger)]" : strength <= 60 ? "bg-amber-500" : "bg-[color:var(--color-accent-teal)]"}`} />
          </div>
          <p className="-mt-3 text-[10px] text-[color:var(--color-text-tertiary)]">{strength <= 30 ? "Weak" : strength <= 60 ? "Medium" : strength < 100 ? "Strong" : "Very Strong"}</p>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-secondary)]">Confirm New Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
              <input type={show.confirm ? "text" : "password"} value={form.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)} placeholder="••••••••" className={inputClass("confirmPassword")} />
              <button type="button" onClick={() => setShow((p) => ({ ...p, confirm: !p.confirm }))} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-primary)]">
                {show.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <AnimatePresence>{errors.confirmPassword && <ErrorMsg msg={errors.confirmPassword} />}</AnimatePresence>
          </div>

          <Button type="submit" loading={isLoading}>Update Password</Button>
        </form>
      </div>
    </AccountLayout>
  );
}

function getStrength(pwd: string): number {
  let s = 0;
  if (pwd.length >= 8) s += 25;
  if (/[a-z]/.test(pwd)) s += 25;
  if (/[A-Z]/.test(pwd)) s += 25;
  if (/\d/.test(pwd)) s += 15;
  if (/[^a-zA-Z0-9]/.test(pwd)) s += 10;
  return Math.min(s, 100);
}

function ErrorMsg({ msg }: { msg: string }) {
  return (
    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="mt-1 flex items-center gap-1 text-xs text-[color:var(--color-danger)]">
      <AlertCircle className="h-3 w-3" /> {msg}
    </motion.p>
  );
}
