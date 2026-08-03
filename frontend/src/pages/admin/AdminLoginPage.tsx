import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, LoaderCircle, AlertCircle, Shield } from "lucide-react";
import { useAdminStore } from "@/lib/stores/admin-store";
import { cn } from "@/lib/utils";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAdminStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("All fields are required"); return; }
    setError("");
    const success = await login(email, password);
    if (success) navigate("/admin");
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--color-brand-primary)]">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <h1 className="mt-4 font-display text-2xl text-[color:var(--color-text-primary)]">Admin Login</h1>
            <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">Sign in to manage your store</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-secondary)]">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
                <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} placeholder="admin@khattak.com" className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] py-3 pl-10 pr-4 text-sm text-[color:var(--color-text-primary)] shadow-[var(--shadow-input)] transition-all placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-accent-teal)] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-focus-ring)]" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-secondary)]">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} placeholder="••••••••" className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] py-3 pl-10 pr-11 text-sm text-[color:var(--color-text-primary)] shadow-[var(--shadow-input)] transition-all placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-accent-teal)] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-focus-ring)]" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-primary)]">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 rounded border-[color:var(--color-border)] text-[color:var(--color-accent-teal)]" /><span className="text-xs text-[color:var(--color-text-secondary)]">Remember me</span></label>
              <button type="button" className="text-xs font-medium text-[color:var(--color-accent-teal)] hover:underline">Forgot Password?</button>
            </div>

            <AnimatePresence>
              {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5 text-xs text-[color:var(--color-danger)]"><AlertCircle className="h-3 w-3" />{error}</motion.p>}
            </AnimatePresence>

            <button type="submit" disabled={isLoading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[color:var(--color-brand-primary)] py-3 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:bg-black disabled:cursor-not-allowed disabled:opacity-50">
              {isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-[10px] text-[color:var(--color-text-tertiary)]">Secure admin access. Authorized personnel only.</p>
        </motion.div>
      </div>

      <div className="hidden w-1/2 lg:block">
        <div className="relative h-full w-full overflow-hidden bg-[color:var(--color-brand-primary)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--color-brand-primary)] via-[#19130D] to-[color:var(--color-brand-hover)] opacity-90" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(15,118,110,0.3),transparent_60%),radial-gradient(ellipse_at_bottom_left,rgba(37,99,235,0.2),transparent_50%)]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-16 text-center">
            <div className="h-72 w-72 rounded-full border border-white/10 bg-white/5 backdrop-blur-3xl" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-16 text-center">
              <Shield className="mx-auto h-16 w-16 text-white/30" />
              <h2 className="mt-6 font-display text-3xl leading-tight text-white">Enterprise<br /><span className="text-[color:var(--color-accent-teal)]">Management Suite</span></h2>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/50">Comprehensive tools to manage your premium eyewear business.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
