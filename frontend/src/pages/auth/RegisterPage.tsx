import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Phone, AlertCircle, LoaderCircle, ChromeIcon } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { AuthLayout } from "@/components/account/AuthLayout";
import { cn } from "@/lib/utils";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: string, value: string) => { setForm((p) => ({ ...p, [key]: value })); setErrors((p) => ({ ...p, [key]: "" })); };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName) e.fullName = "Full name is required";
    if (!form.email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.phone) e.phone = "Phone is required";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "Minimum 8 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    if (!agreeTerms) e.terms = "You must agree to the terms";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const success = await register(form);
    if (success) navigate("/auth/email-verification");
  };

  const inputClass = (field: string) =>
    cn(
      "w-full rounded-xl border bg-[color:var(--color-surface-muted)] py-3 pl-10 pr-4 text-sm text-[color:var(--color-text-primary)] shadow-[var(--shadow-input)] transition-all placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-accent-teal)] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-focus-ring)]",
      errors[field] && "border-[color:var(--color-danger)]",
    );

  return (
    <AuthLayout imageSide="left">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl text-[color:var(--color-text-primary)]">Create account</h1>
          <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">Join Khattak Eyewear today.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-secondary)]">Full Name</label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
              <input type="text" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="Ayesha Khan" className={inputClass("fullName")} />
            </div>
            <AnimatePresence>{errors.fullName && <ErrorMsg msg={errors.fullName} />}</AnimatePresence>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-secondary)]">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
              <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" className={inputClass("email")} />
            </div>
            <AnimatePresence>{errors.email && <ErrorMsg msg={errors.email} />}</AnimatePresence>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-secondary)]">Phone</label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
              <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+92 300 1234567" className={inputClass("phone")} />
            </div>
            <AnimatePresence>{errors.phone && <ErrorMsg msg={errors.phone} />}</AnimatePresence>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-secondary)]">Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
              <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="••••••••" className={inputClass("password")} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-primary)]">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <AnimatePresence>{errors.password && <ErrorMsg msg={errors.password} />}</AnimatePresence>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-[color:var(--color-surface-muted)]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${getStrength(form.password)}%` }}
              className={`h-full rounded-full transition-colors ${getStrength(form.password) <= 30 ? "bg-[color:var(--color-danger)]" : getStrength(form.password) <= 60 ? "bg-amber-500" : "bg-[color:var(--color-accent-teal)]"}`}
            />
          </div>
          <p className="-mt-2 text-[10px] text-[color:var(--color-text-tertiary)]">
            {getStrength(form.password) <= 30 ? "Weak" : getStrength(form.password) <= 60 ? "Medium" : getStrength(form.password) < 100 ? "Strong" : "Very Strong"}
          </p>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-secondary)]">Confirm Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
              <input type="password" value={form.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)} placeholder="••••••••" className={inputClass("confirmPassword")} />
            </div>
            <AnimatePresence>{errors.confirmPassword && <ErrorMsg msg={errors.confirmPassword} />}</AnimatePresence>
          </div>

          <div>
            <label className="flex cursor-pointer items-start gap-2.5">
              <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-[color:var(--color-border)] text-[color:var(--color-accent-teal)] focus:ring-[color:var(--color-focus-ring)]" />
              <span className="text-xs leading-relaxed text-[color:var(--color-text-secondary)]">I agree to the <Link to="#" className="text-[color:var(--color-accent-teal)] hover:underline">Terms of Service</Link> and <Link to="#" className="text-[color:var(--color-accent-teal)] hover:underline">Privacy Policy</Link></span>
            </label>
            <AnimatePresence>{errors.terms && <ErrorMsg msg={errors.terms} />}</AnimatePresence>
          </div>

          <button type="submit" disabled={isLoading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[color:var(--color-brand-primary)] py-3 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:bg-black disabled:cursor-not-allowed disabled:opacity-50">
            {isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            {isLoading ? "Creating account..." : "Create Account"}
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
          Already have an account?{" "}
          <Link to="/auth/login" className="font-medium text-[color:var(--color-accent-teal)] hover:underline">Sign in</Link>
        </p>

        <p className="text-center text-[10px] text-[color:var(--color-text-tertiary)]">We&apos;ll send a verification email to confirm your account.</p>
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
