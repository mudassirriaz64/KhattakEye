import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  LoaderCircle,
  AlertCircle,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  Activity,
  CheckCircle2,
  KeyRound,
  X,
  HelpCircle,
} from "lucide-react";
import { useAdminStore } from "@/lib/stores/admin-store";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated } = useAdminStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [showForgotInfo, setShowForgotInfo] = useState(false);

  // Auto redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Please enter both email address and password.");
      return;
    }
    setError("");
    const result = await login(email.trim(), password);
    if (result.success) {
      navigate("/admin");
    } else {
      setError(result.error || "Authentication failed. Please check your admin credentials.");
    }
  };

  const handleQuickFillDemo = () => {
    setEmail("admin@khattak.com");
    setPassword("admin123");
    setError("");
  };

  return (
    <div className="flex min-h-screen w-full bg-[color:var(--color-app-bg)] selection:bg-[color:var(--color-brand-primary)] selection:text-white">
      {/* ─── Left Section: Form Container ─────────────────────────────────── */}
      <div className="relative flex w-full flex-col justify-between px-6 py-8 lg:w-1/2 lg:px-16 lg:py-12">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-4 py-2 text-xs font-semibold text-[color:var(--color-text-secondary)] shadow-sm transition-all duration-300 hover:border-[color:var(--color-brand-primary)] hover:text-[color:var(--color-brand-primary)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Store Front</span>
          </Link>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Admin System Active
          </div>
        </div>

        {/* Form Main Area */}
        <div className="mx-auto my-auto w-full max-w-md py-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Original Khattak Logo & Header */}
            <div className="mb-8 text-center sm:text-left">
              <div className="inline-flex items-center gap-3.5">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-2.5 shadow-[var(--shadow-soft)]">
                  <img
                    src="/khattak.png"
                    alt="Khattak Eyewear Original Logo"
                    className="h-full w-full object-contain transition-transform duration-300 hover:scale-105"
                  />
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[color:var(--color-brand-primary)] text-[9px] font-bold text-white shadow-sm">
                    ✓
                  </span>
                </div>
                <div className="flex flex-col text-left leading-none">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-2xl font-bold tracking-tight text-[color:var(--color-text-primary)]">
                      Khattak
                    </span>
                    <span className="rounded-md bg-[color:var(--color-brand-primary)]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-brand-primary)]">
                      Portal
                    </span>
                  </div>
                  <span className="mt-1 text-xs font-semibold uppercase tracking-[0.32em] text-[color:var(--color-text-secondary)]">
                    Eyewear Management
                  </span>
                </div>
              </div>

              <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)]">
                Admin Sign In
              </h1>
              <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">
                Welcome back. Authenticate to access store control center.
              </p>
            </div>

            {/* Quick Demo Helper Pill */}
            <div className="mb-6 flex items-center justify-between rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)]/80 p-3 shadow-sm backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs text-[color:var(--color-text-secondary)]">
                <KeyRound className="h-4 w-4 text-[color:var(--color-brand-primary)]" />
                <span>Demo Creds: <strong>admin@khattak.com</strong></span>
              </div>
              <button
                type="button"
                onClick={handleQuickFillDemo}
                className="rounded-lg bg-[color:var(--color-brand-primary)]/10 px-2.5 py-1 text-xs font-semibold text-[color:var(--color-brand-primary)] transition-all hover:bg-[color:var(--color-brand-primary)] hover:text-white"
              >
                Autofill
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--color-text-secondary)]">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="admin@khattak.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] py-3.5 pl-11 pr-4 text-sm font-medium text-[color:var(--color-text-primary)] shadow-[var(--shadow-input)] transition-all duration-200 placeholder:text-[color:var(--color-text-tertiary)] hover:border-[color:var(--color-border-strong)] focus:border-[color:var(--color-brand-primary)] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[color:var(--color-focus-ring)]"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--color-text-secondary)]">
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] py-3.5 pl-11 pr-11 text-sm font-medium text-[color:var(--color-text-primary)] shadow-[var(--shadow-input)] transition-all duration-200 placeholder:text-[color:var(--color-text-tertiary)] hover:border-[color:var(--color-border-strong)] focus:border-[color:var(--color-brand-primary)] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[color:var(--color-focus-ring)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-[color:var(--color-text-tertiary)] transition-colors hover:text-[color:var(--color-text-primary)]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex cursor-pointer items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded border-[color:var(--color-border)] text-[color:var(--color-brand-primary)] focus:ring-[color:var(--color-brand-primary)]/20"
                  />
                  <span className="text-xs font-medium text-[color:var(--color-text-secondary)] select-none">
                    Keep me signed in
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowForgotInfo(true)}
                  className="text-xs font-semibold text-[color:var(--color-brand-primary)] transition-all hover:underline hover:opacity-80"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Animated Error Alert */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -8 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 shadow-sm dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
                      <div className="flex-1 font-medium leading-relaxed">{error}</div>
                      <button
                        type="button"
                        onClick={() => setError("")}
                        className="rounded p-0.5 hover:bg-red-100 dark:hover:bg-red-900/50"
                      >
                        <X className="h-3.5 w-3.5 text-red-500" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-[color:var(--color-brand-primary)] py-3.5 text-sm font-bold text-white shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[color:var(--color-brand-hover)] hover:shadow-[var(--glow-brand)] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-focus-ring)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <LoaderCircle className="h-4.5 w-4.5 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4.5 w-4.5 transition-transform duration-300 group-hover:scale-110" />
                    <span>Sign In to Admin Panel</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Footer Security Notice */}
        <div className="text-center sm:text-left">
          <p className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-[color:var(--color-text-tertiary)] sm:justify-start">
            <Lock className="h-3 w-3 text-emerald-600" />
            <span>256-bit SSL Encrypted Access • Authorized Khattak Personnel Only</span>
          </p>
        </div>
      </div>

      {/* ─── Right Section: Premium Luxury Showcase ──────────────────────── */}
      <div className="hidden w-1/2 lg:block">
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#120B0A]">
          {/* Ambient Lighting Gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#2D0A0C] via-[#160908] to-[#0A0505]" />
          <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-[color:var(--color-brand-primary)]/20 blur-[120px]" />
          <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-amber-600/15 blur-[120px]" />

          {/* Decorative Subtle Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />

          {/* Floating Glassmorphic Content Card */}
          <div className="relative z-10 w-full max-w-lg p-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-2xl"
            >
              {/* Top Card Badge */}
              <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 p-2 shadow-inner border border-white/15">
                    <img
                      src="/khattak.png"
                      alt="Original Logo"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white tracking-wide">
                      KHATTAK
                    </h3>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50">
                      EYEWEAR ARCHITECTURE
                    </p>
                  </div>
                </div>

                <span className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-300">
                  <Sparkles className="h-3 w-3" /> Suite v2.4
                </span>
              </div>

              {/* Middle Title & Description */}
              <div className="my-8 space-y-3 text-left">
                <h2 className="font-display text-3xl font-bold leading-tight text-white md:text-4xl">
                  Enterprise Control <br />
                  <span className="bg-gradient-to-r from-amber-200 via-rose-200 to-white bg-clip-text text-transparent">
                    & Store Operations
                  </span>
                </h2>
                <p className="text-sm leading-relaxed text-white/60">
                  Complete central management for Khattak Eyewear products, catalog inventory, orders, customer details, and live analytical insights.
                </p>
              </div>

              {/* Feature Highlights Grid */}
              <div className="space-y-3 border-t border-white/10 pt-6">
                <div className="flex items-center gap-3 text-xs text-white/80">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <span>Real-time Order Processing & Inventory Tracking</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/80">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <span>Prescription & Lens Category Customizations</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/80">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <span>Role-Based Access Control & Audit Trails</span>
                </div>
              </div>

              {/* Floating Stat Pills */}
              <div className="mt-8 flex items-center justify-between rounded-2xl bg-white/[0.03] p-4 border border-white/5">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-medium text-white/70">System Health</span>
                </div>
                <span className="font-mono text-xs font-semibold text-emerald-400">
                  99.9% Operational
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ─── Forgot Password Modal ────────────────────────────────────────── */}
      <AnimatePresence>
        {showForgotInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForgotInfo(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--color-brand-primary)]/10 text-[color:var(--color-brand-primary)]">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-[color:var(--color-text-primary)]">
                    Password Reset Help
                  </h3>
                  <p className="text-xs text-[color:var(--color-text-secondary)]">
                    Administrator access protection
                  </p>
                </div>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-[color:var(--color-text-secondary)]">
                For administrative security, admin credentials cannot be self-reset via email. Please contact the system Super Administrator or check your initial deployment environment configuration.
              </p>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowForgotInfo(false)}
                  className="rounded-xl bg-[color:var(--color-brand-primary)] px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-[color:var(--color-brand-hover)]"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

