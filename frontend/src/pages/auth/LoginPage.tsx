import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, LoaderCircle, AlertCircle } from "lucide-react";
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
  const [authError, setAuthError] = useState<string | null>(null);
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
    setAuthError(null);
    if (!validate()) return;
    try {
      const success = await login(email, password, rememberMe);
      if (success) {
        navigate("/account");
      } else {
        setAuthError("Invalid email or password. Please check your credentials.");
      }
    } catch {
      setAuthError("Unable to sign in. Please try again.");
    }
  };

  return (
    <AuthLayout imageSide="right">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-semibold text-[color:var(--color-text-primary)]">Welcome back</h1>
          <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">Sign in to access your luxury eyewear account.</p>
        </div>

        {authError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-xs font-medium text-red-600 dark:text-red-400"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            <span>{authError}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.16em] text-[color:var(--color-text-secondary)]">
              Email Address
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); setAuthError(null); }}
                placeholder="name@example.com"
                className={cn(
                  "w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] py-3 pl-10 pr-4 text-sm text-[color:var(--color-text-primary)] shadow-xs transition-all duration-200 placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-brand-primary)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[color:var(--color-brand-primary)]/20",
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
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-[color:var(--color-text-secondary)]">
                Password
              </label>
              <Link to="/auth/forgot-password" className="text-xs font-semibold text-[color:var(--color-brand-primary)] hover:underline">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); setAuthError(null); }}
                placeholder="••••••••"
                className={cn(
                  "w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] py-3 pl-10 pr-11 text-sm text-[color:var(--color-text-primary)] shadow-xs transition-all duration-200 placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-brand-primary)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[color:var(--color-brand-primary)]/20",
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

          <div className="flex items-center">
            <label className="flex cursor-pointer items-center gap-2">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 rounded border-[color:var(--color-border)] text-[color:var(--color-brand-primary)] focus:ring-[color:var(--color-brand-primary)]" />
              <span className="text-xs text-[color:var(--color-text-secondary)] font-medium">Keep me logged in</span>
            </label>
          </div>

          <button type="submit" disabled={isLoading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[color:var(--color-brand-primary)] py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-black disabled:cursor-not-allowed disabled:opacity-50">
            {isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[color:var(--color-border)]" /></div>
          <div className="relative flex justify-center"><span className="bg-[color:var(--color-app-bg)] px-3 text-xs font-medium text-[color:var(--color-text-tertiary)]">or continue with</span></div>
        </div>

        <button type="button" onClick={() => alert("Google OAuth login initialized.")} className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] py-3 text-sm font-medium text-[color:var(--color-text-primary)] shadow-xs transition-all hover:bg-[color:var(--color-surface-muted)]">
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Google Account
        </button>

        <p className="text-center text-xs text-[color:var(--color-text-secondary)]">
          Don&apos;t have an account?{" "}
          <Link to="/auth/register" className="font-semibold text-[color:var(--color-brand-primary)] hover:underline">Create one here</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
