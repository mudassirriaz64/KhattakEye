import { MapPin, Building2, Home, Globe, Hash } from "lucide-react";
import { useCheckoutStore } from "@/lib/stores/checkout-store";

const provinces = ["Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan", "Gilgit-Baltistan", "Azad Jammu & Kashmir"];
const cities = ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala"];

export function ShippingAddressForm() {
  const address = useCheckoutStore((s) => s.address);
  const setAddress = useCheckoutStore((s) => s.setAddress);
  const setStep = useCheckoutStore((s) => s.setStep);

  const isComplete = address.province && address.city && address.area && address.street;

  return (
    <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-[color:var(--color-text-primary)]">Shipping Address</h2>
          <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">Where should we deliver your order?</p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]">Province</span>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
              <select
                value={address.province}
                onChange={(e) => setAddress({ ...address, province: e.target.value })}
                className="w-full appearance-none rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] py-3.5 pl-11 pr-4 text-sm text-[color:var(--color-text-primary)] outline-none transition-all focus:border-[color:var(--color-accent-blue)] focus:ring-4 focus:ring-[color:var(--color-focus-ring)]"
              >
                <option value="">Select province</option>
                {provinces.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </label>

          <label className="block space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]">City</span>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
              <select
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="w-full appearance-none rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] py-3.5 pl-11 pr-4 text-sm text-[color:var(--color-text-primary)] outline-none transition-all focus:border-[color:var(--color-accent-blue)] focus:ring-4 focus:ring-[color:var(--color-focus-ring)]"
              >
                <option value="">Select city</option>
                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </label>
        </div>

        <label className="block space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]">Area / Locality</span>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
            <input
              value={address.area}
              onChange={(e) => setAddress({ ...address, area: e.target.value })}
              placeholder="Gulberg III"
              className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] py-3.5 pl-11 pr-4 text-sm text-[color:var(--color-text-primary)] outline-none transition-all placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-accent-blue)] focus:ring-4 focus:ring-[color:var(--color-focus-ring)]"
            />
          </div>
        </label>

        <label className="block space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]">Street Address</span>
          <div className="relative">
            <Home className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
            <input
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
              placeholder="57-E, Main Boulevard"
              className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] py-3.5 pl-11 pr-4 text-sm text-[color:var(--color-text-primary)] outline-none transition-all placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-accent-blue)] focus:ring-4 focus:ring-[color:var(--color-focus-ring)]"
            />
          </div>
        </label>

        <label className="block space-y-2 sm:max-w-xs">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]">Postal Code</span>
          <div className="relative">
            <Hash className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
            <input
              value={address.postalCode}
              onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
              placeholder="54000"
              className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] py-3.5 pl-11 pr-4 text-sm text-[color:var(--color-text-primary)] outline-none transition-all placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-accent-blue)] focus:ring-4 focus:ring-[color:var(--color-focus-ring)]"
            />
          </div>
        </label>
      </div>

      <div className="mt-8 flex gap-3">
        <button type="button" onClick={() => setStep(1)} className="rounded-xl border border-[color:var(--color-border)] px-6 py-3.5 text-sm font-medium text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-text-primary)]">
          Back
        </button>
        <button
          type="button"
          disabled={!isComplete}
          onClick={() => isComplete && setStep(3)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[color:var(--color-brand-primary)] px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-black disabled:bg-[color:var(--color-disabled-bg)] disabled:text-[color:var(--color-disabled-text)]"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
}
