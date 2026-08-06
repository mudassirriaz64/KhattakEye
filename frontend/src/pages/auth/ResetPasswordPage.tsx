import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Lock, LoaderCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { AuthLayout } from "@/components/account/AuthLayout";
import { cn } from "@/lib/utils";

export function ResetPasswordPage() {
  const { resetPassword, isLoading } = useAuthStore();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const e2: Record<string, string> = {};
    if (!newPassword || newPassword.length < 8) e2.newPassword = "Minimum 8 characters";
    if (newPassword !== confirmPassword) e2.confirmPassword = "Passwords do not match";
    setErrors(e2);
    if (Object.keys(e2).length > 0) return;
    const ok = await resetPassword("dummy-token", newPassword);
    if (ok) setSuccess(true);
  };

  if (success) {
    return (
      <AuthLayout imageSide="left">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 15 }}>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[color:var(--color-accent-teal)]/10">
              <CheckCircle2 className="h-10 w-10 text-[color:var(--color-accent-teal)]" />
            </div>
          </motion.div>
          <div>
            <h2 className="font-display text-2xl text-[color:var(--color-text-primary)]">Password reset successful</h2>
            <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">Your password has been updated. You can now sign in with your new password.</p>
          </div>
          <Link to="/auth/login" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[color:var(--color-brand-primary)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:bg-black">
            Sign In Now
          </Link>
        </motion.div>
      </AuthLayout>
    );
  }

  const strength = getStrength(newPassword);
  const inputClass = (f: string) => cn("w-full rounded-xl border bg-[color:var(--color-surface-muted)] py-3 pl-10 pr-11 text-sm text-[color:var(--color-text-primary)] shadow-[var(--shadow-input)] transition-all placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-accent-teal)] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-focus-ring)]", errors[f] && "border-[color:var(--color-danger)]");

  return (
    <AuthLayout imageSide="left">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl text-[color:var(--color-text-primary)]">Set new password</h1>
          <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">Must be at least 8 characters.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-secondary)]">New Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
              <input type={showPassword ? "text" : "password"} value={newPassword} onChange={(e) => { setNewPassword(e.target.value); setErrors({}); }} placeholder="••••••••" className={inputClass("newPassword")} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-primary)]">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <AnimatePresence>{errors.newPassword && <ErrorMsg msg={errors.newPassword} />}</AnimatePresence>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-[color:var(--color-surface-muted)]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${strength}%` }}
              className={`h-full rounded-full transition-colors ${strength <= 30 ? "bg-[color:var(--color-danger)]" : strength <= 60 ? "bg-amber-500" : strength < 100 ? "bg-[color:var(--color-accent-teal)]" : "bg-[color:var(--color-accent-teal)]"}`}
            />
          </div>
          <p className="-mt-2 text-[10px] text-[color:var(--color-text-tertiary)]">
            {strength <= 30 ? "Weak" : strength <= 60 ? "Medium" : strength < 100 ? "Strong" : "Very Strong"}
          </p>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-secondary)]">Confirm Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
              <input type="password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setErrors({}); }} placeholder="••••••••" className={inputClass("confirmPassword")} />
            </div>
            <AnimatePresence>{errors.confirmPassword && <ErrorMsg msg={errors.confirmPassword} />}</AnimatePresence>
          </div>

          <button type="submit" disabled={isLoading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[color:var(--color-brand-primary)] py-3 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:bg-black disabled:cursor-not-allowed disabled:opacity-50">
            {isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}

function getStrength(pwd: string): number {
  let score = 0;
  if (pwd.length >= 8) score += 25;
  if (/[a-z]/.test(pwd)) score += 25;
  if (/[A-Z]/.test(pwd)) score += 25;
  if (/\d/.test(pwd)) score += 15;
  if (/[^a-zA-Z0-9]/.test(pwd)) score += 10;
  return Math.min(score, 100);
}

function ErrorMsg({ msg }: { msg: string }) {
  return (
    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="mt-1 flex items-center gap-1 text-xs text-[color:var(--color-danger)]">
      <AlertCircle className="h-3 w-3" /> {msg}
    </motion.p>
  );
}
