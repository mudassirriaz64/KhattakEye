import { useState, useRef, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, LoaderCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { AuthLayout } from "@/components/account/AuthLayout";

export function EmailVerificationPage() {
  const navigate = useNavigate();
  const { verifyEmail, sendVerificationEmail, isLoading } = useAuthStore();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [verified, setVerified] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: KeyboardEvent) => {
    if (e.key === "Backward" && !code[index] && index > 0) inputsRef.current[index - 1]?.focus();
  };

  const handleVerify = async () => {
    const fullCode = code.join("");
    if (fullCode.length !== 6) return;
    const ok = await verifyEmail(fullCode);
    if (ok) setVerified(true);
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    await sendVerificationEmail();
    setCountdown(30);
    const timer = setInterval(() => setCountdown((p) => { if (p <= 1) clearInterval(timer); return p - 1; }), 1000);
  };

  if (verified) {
    return (
      <AuthLayout imageSide="right">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 15 }}>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[color:var(--color-accent-teal)]/10">
              <CheckCircle2 className="h-10 w-10 text-[color:var(--color-accent-teal)]" />
            </div>
          </motion.div>
          <h2 className="font-display text-2xl text-[color:var(--color-text-primary)]">Email verified!</h2>
          <p className="text-sm text-[color:var(--color-text-secondary)]">Your email has been verified. You can now access your account.</p>
          <button type="button" onClick={() => navigate("/account")} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[color:var(--color-brand-primary)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:bg-black">
            Go to Dashboard
          </button>
        </motion.div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout imageSide="right">
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[color:var(--color-accent-teal)]/10">
            <Mail className="h-8 w-8 text-[color:var(--color-accent-teal)]" />
          </div>
          <h1 className="mt-4 font-display text-3xl text-[color:var(--color-text-primary)]">Verify your email</h1>
          <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">We sent a 6-digit code to your email. Enter it below.</p>
        </div>

        <div className="flex justify-center gap-2.5">
          {code.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputsRef.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="h-14 w-12 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] text-center text-lg font-semibold text-[color:var(--color-text-primary)] shadow-[var(--shadow-input)] transition-all focus:border-[color:var(--color-accent-teal)] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-focus-ring)]"
            />
          ))}
        </div>

        <button type="button" onClick={handleVerify} disabled={isLoading || code.join("").length !== 6} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[color:var(--color-brand-primary)] py-3 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:bg-black disabled:cursor-not-allowed disabled:opacity-50">
          {isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
          {isLoading ? "Verifying..." : "Verify Email"}
        </button>

        <div className="text-center">
          <button type="button" onClick={handleResend} disabled={countdown > 0} className="inline-flex items-center gap-1.5 text-sm text-[color:var(--color-text-tertiary)] transition-colors hover:text-[color:var(--color-accent-teal)] disabled:cursor-not-allowed">
            <RefreshCw className={`h-3.5 w-3.5 ${countdown > 0 ? "" : "animate-spin"}`} />
            {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}
