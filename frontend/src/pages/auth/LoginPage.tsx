import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, LoaderCircle, AlertCircle, ChromeIcon } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { AuthLayout } from "@/components/account/AuthLayout";
import { cn } from "@/lib/utils";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Invalid email address";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const success = await login(email, password);
    if (success) navigate("/account");
  };

  return (
    <AuthLayout imageSide="right">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl text-[color:var(--color-text-primary)]">Welcome back</h1>
          <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">Sign in to your account to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-secondary)]">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
                placeholder="you@example.com"
                className={cn(
                  "w-full rounded-xl border bg-[color:var(--color-surface-muted)] py-3 pl-10 pr-4 text-sm text-[color:var(--color-text-primary)] shadow-[var(--shadow-input)] transition-all duration-200 placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-accent-teal)] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-focus-ring)]",
                  errors.email && "border-[color:var(--color-danger)]",
                )}
              />
            </div>
            <AnimatePresence>
              {errors.email && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="mt-1 flex items-center gap-1 text-xs text-[color:var(--color-danger)]">
                  <AlertCircle className="h-3 w-3" /> {errors.email}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-secondary)]">Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
                placeholder="••••••••"
                className={cn(
                  "w-full rounded-xl border bg-[color:var(--color-surface-muted)] py-3 pl-10 pr-11 text-sm text-[color:var(--color-text-primary)] shadow-[var(--shadow-input)] transition-all duration-200 placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-accent-teal)] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-focus-ring)]",
                  errors.password && "border-[color:var(--color-danger)]",
                )}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-primary)]">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <AnimatePresence>
              {errors.password && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="mt-1 flex items-center gap-1 text-xs text-[color:var(--color-danger)]">
                  <AlertCircle className="h-3 w-3" /> {errors.password}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 rounded border-[color:var(--color-border)] text-[color:var(--color-accent-teal)] focus:ring-[color:var(--color-focus-ring)]" />
              <span className="text-xs text-[color:var(--color-text-secondary)]">Remember me</span>
            </label>
            <Link to="/auth/forgot-password" className="text-xs font-medium text-[color:var(--color-accent-teal)] hover:underline">Forgot Password?</Link>
          </div>

          <button type="submit" disabled={isLoading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[color:var(--color-brand-primary)] py-3 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-black disabled:cursor-not-allowed disabled:opacity-50">
            {isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[color:var(--color-border)]" /></div>
          <div className="relative flex justify-center"><span className="bg-[color:var(--color-app-bg)] px-4 text-xs text-[color:var(--color-text-tertiary)]">or continue with</span></div>
        </div>

        <button type="button" className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] py-3 text-sm font-medium text-[color:var(--color-text-primary)] transition-all hover:-translate-y-0.5 hover:bg-[color:var(--color-surface-muted)]">
          <ChromeIcon className="h-4 w-4" /> Google
        </button>

        <p className="text-center text-sm text-[color:var(--color-text-secondary)]">
          Don&apos;t have an account?{" "}
          <Link to="/auth/register" className="font-medium text-[color:var(--color-accent-teal)] hover:underline">Create one</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
