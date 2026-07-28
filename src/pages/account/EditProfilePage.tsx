import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { User, Camera, LoaderCircle } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { AccountLayout } from "@/components/account/AccountLayout";
import { Button } from "@/components/primitives/Button";

export function EditProfilePage() {
  const { user, updateProfile, isLoading } = useAuthStore();
  const [avatar, setAvatar] = useState<string | null>(user?.avatar || null);
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    email: user?.email || "",
    gender: user?.gender || "",
    dateOfBirth: user?.dateOfBirth || "",
  });
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ ...form, avatar });
  };

  return (
    <AccountLayout title="Edit Profile" subtitle="Manage your personal information">
      <div className="max-w-2xl">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-[color:var(--color-surface-muted)]">
              {avatar ? (
                <img src={avatar} alt="" className="h-full w-full object-cover" />
              ) : (
                <User className="h-10 w-10 text-[color:var(--color-text-tertiary)]" />
              )}
            </div>
            <button type="button" onClick={() => fileRef.current?.click()} className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--color-brand-primary)] text-white shadow-[var(--shadow-soft)] transition-transform hover:scale-105">
              <Camera className="h-4 w-4" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[color:var(--color-text-primary)]">{form.fullName || "Your Name"}</p>
            <p className="text-xs text-[color:var(--color-text-tertiary)]">JPEG, PNG or WebP. Max 2MB.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-secondary)]">Full Name</label>
              <input type="text" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-3 text-sm text-[color:var(--color-text-primary)] shadow-[var(--shadow-input)] transition-all focus:border-[color:var(--color-accent-teal)] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-focus-ring)]" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-secondary)]">Phone</label>
              <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-3 text-sm text-[color:var(--color-text-primary)] shadow-[var(--shadow-input)] transition-all focus:border-[color:var(--color-accent-teal)] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-focus-ring)]" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-secondary)]">Email</label>
              <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-3 text-sm text-[color:var(--color-text-primary)] shadow-[var(--shadow-input)] transition-all focus:border-[color:var(--color-accent-teal)] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-focus-ring)]" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-secondary)]">Gender (optional)</label>
              <select value={form.gender} onChange={(e) => set("gender", e.target.value)} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-3 text-sm text-[color:var(--color-text-primary)] shadow-[var(--shadow-input)] transition-all focus:border-[color:var(--color-accent-teal)] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-focus-ring)]">
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-secondary)]">Date of Birth (optional)</label>
              <input type="date" value={form.dateOfBirth} onChange={(e) => set("dateOfBirth", e.target.value)} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-3 text-sm text-[color:var(--color-text-primary)] shadow-[var(--shadow-input)] transition-all focus:border-[color:var(--color-accent-teal)] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-focus-ring)]" />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" loading={isLoading}>Save Changes</Button>
            <Button type="button" variant="ghost">Cancel</Button>
          </div>
        </form>
      </div>
    </AccountLayout>
  );
}
