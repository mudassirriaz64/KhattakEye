import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, LoaderCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { AuthLayout } from "@/components/account/AuthLayout";
import { cn } from "@/lib/utils";

export function ForgotPasswordPage() {
  const { forgotPassword, isLoading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError("Email is required"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Invalid email address"); return; }
    setError("");
    const success = await forgotPassword(email);
    if (success) setSent(true);
  };

  return (
    <AuthLayout imageSide="right">
      <AnimatePresence mode="wait">
        {!sent ? (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div>
              <Link to="/auth/login" className="inline-flex items-center gap-1.5 text-xs text-[color:var(--color-text-tertiary)] transition-colors hover:text-[color:var(--color-text-primary)]">
                <ArrowLeft className="h-3 w-3" /> Back to Login
              </Link>
              <h1 className="mt-4 font-display text-3xl text-[color:var(--color-text-primary)]">Forgot password?</h1>
              <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">No worries. Enter your email and we&apos;ll send you a reset link.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-secondary)]">Email</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
                  <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} placeholder="you@example.com" className={cn("w-full rounded-xl border bg-[color:var(--color-surface-muted)] py-3 pl-10 pr-4 text-sm text-[color:var(--color-text-primary)] shadow-[var(--shadow-input)] transition-all placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-accent-teal)] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-focus-ring)]", error && "border-[color:var(--color-danger)]")} />
                </div>
                <AnimatePresence>{error && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="mt-1 flex items-center gap-1 text-xs text-[color:var(--color-danger)]"><AlertCircle className="h-3 w-3" /> {error}</motion.p>}</AnimatePresence>
              </div>

              <button type="submit" disabled={isLoading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[color:var(--color-brand-primary)] py-3 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:bg-black disabled:cursor-not-allowed disabled:opacity-50">
                {isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 15 }}>
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[color:var(--color-accent-teal)]/10">
                <CheckCircle2 className="h-10 w-10 text-[color:var(--color-accent-teal)]" />
              </div>
            </motion.div>
            <div>
              <h2 className="font-display text-2xl text-[color:var(--color-text-primary)]">Check your email</h2>
              <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">We sent a password reset link to <span className="font-medium text-[color:var(--color-text-primary)]">{email}</span></p>
            </div>
            <div className="rounded-xl bg-[color:var(--color-surface-muted)] p-4 text-xs text-[color:var(--color-text-tertiary)]">
              Didn&apos;t receive the email? Check your spam folder or{" "}
              <button type="button" onClick={() => setSent(false)} className="font-medium text-[color:var(--color-accent-teal)] hover:underline">try another email</button>
            </div>
            <Link to="/auth/login" className="inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--color-accent-teal)] hover:underline">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Login
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}
