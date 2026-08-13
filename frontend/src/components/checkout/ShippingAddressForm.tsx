import { useEffect } from "react";
import { MapPin, Building2, Home, Globe, Hash, Truck, Zap, Check } from "lucide-react";
import { useCheckoutStore } from "@/lib/stores/checkout-store";
import { useCartStore } from "@/lib/stores/cart-store";
import { cn } from "@/lib/utils";
import { PAKISTAN_PROVINCES, getCitiesForProvince, getProvinceForCity } from "@/lib/pakistan-locations";

export function ShippingAddressForm() {
  const address = useCheckoutStore((s) => s.address);
  const setAddress = useCheckoutStore((s) => s.setAddress);
  const setStep = useCheckoutStore((s) => s.setStep);
  const shippingMethod = useCheckoutStore((s) => s.shippingMethod);
  const setShippingMethod = useCheckoutStore((s) => s.setShippingMethod);
  const shippingConfig = useCheckoutStore((s) => s.shippingConfig);
  const fetchShippingConfig = useCheckoutStore((s) => s.fetchShippingConfig);

  const subtotal = useCartStore((s) => s.getSubtotal());

  useEffect(() => {
    fetchShippingConfig();
  }, [fetchShippingConfig]);

  const availableCities = getCitiesForProvince(address.province);

  const handleProvinceChange = (newProvince: string) => {
    const validCities = getCitiesForProvince(newProvince);
    const keepsCity = validCities.includes(address.city);
    setAddress({
      ...address,
      province: newProvince,
      city: keepsCity ? address.city : ""
    });
  };

  const handleCityChange = (newCity: string) => {
    const detectedProvince = getProvinceForCity(newCity);
    setAddress({
      ...address,
      city: newCity,
      province: address.province || detectedProvince || ""
    });
  };

  const isComplete = address.province && address.city && address.area && address.street;

  const isStandardFree = subtotal >= shippingConfig.freeThreshold;
  const standardFee = isStandardFree ? 0 : shippingConfig.standardRate;

  return (
    <div className="space-y-6">
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
                  onChange={(e) => handleProvinceChange(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] py-3.5 pl-11 pr-4 text-sm text-[color:var(--color-text-primary)] outline-none transition-all focus:border-[color:var(--color-accent-blue)] focus:ring-4 focus:ring-[color:var(--color-focus-ring)]"
                >
                  <option value="">Select province</option>
                  {PAKISTAN_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </label>

            <label className="block space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]">City</span>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
                <select
                  value={address.city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] py-3.5 pl-11 pr-4 text-sm text-[color:var(--color-text-primary)] outline-none transition-all focus:border-[color:var(--color-accent-blue)] focus:ring-4 focus:ring-[color:var(--color-focus-ring)]"
                >
                  <option value="">Select city</option>
                  {availableCities.map((c) => <option key={c} value={c}>{c}</option>)}
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
      </div>

      {/* Shipping Method Options */}
      <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 md:p-8">
        <h3 className="font-display text-xl text-[color:var(--color-text-primary)]">Select Delivery Option</h3>
        <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">Choose how quickly you'd like to receive your order.</p>

        {!isStandardFree && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
            💡 Add <strong>Rs. {(shippingConfig.freeThreshold - subtotal).toLocaleString()}</strong> more to your cart to unlock <strong>FREE Standard Delivery</strong>!
          </div>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {/* Standard Delivery */}
          <button
            type="button"
            onClick={() => setShippingMethod("standard")}
            className={cn(
              "relative flex flex-col justify-between rounded-xl border-2 p-5 text-left transition-all",
              shippingMethod === "standard"
                ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-surface-muted)]"
                : "border-[color:var(--color-border)] hover:border-[color:var(--color-border-strong)]"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl",
                  shippingMethod === "standard" ? "bg-[color:var(--color-brand-primary)] text-white" : "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-tertiary)]"
                )}>
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[color:var(--color-text-primary)]">Standard Delivery</p>
                  <p className="text-xs text-[color:var(--color-text-tertiary)]">{shippingConfig.estimatedDays}</p>
                </div>
              </div>
              <div className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full border-2",
                shippingMethod === "standard" ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-brand-primary)] text-white" : "border-[color:var(--color-border)]"
              )}>
                {shippingMethod === "standard" && <Check className="h-3 w-3 text-white" />}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-[color:var(--color-border)] pt-3 text-xs">
              <span className="text-[color:var(--color-text-tertiary)]">Shipping Fee:</span>
              <span className="font-semibold text-[color:var(--color-text-primary)]">
                {isStandardFree ? <span className="text-emerald-600 font-bold uppercase tracking-wider">FREE</span> : `Rs. ${standardFee.toLocaleString()}`}
              </span>
            </div>
          </button>

          {/* Express Delivery */}
          <button
            type="button"
            onClick={() => setShippingMethod("express")}
            className={cn(
              "relative flex flex-col justify-between rounded-xl border-2 p-5 text-left transition-all",
              shippingMethod === "express"
                ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-surface-muted)]"
                : "border-[color:var(--color-border)] hover:border-[color:var(--color-border-strong)]"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl",
                  shippingMethod === "express" ? "bg-[color:var(--color-brand-primary)] text-white" : "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-tertiary)]"
                )}>
                  <Zap className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[color:var(--color-text-primary)]">Express Delivery</p>
                  <p className="text-xs text-[color:var(--color-text-tertiary)]">1-2 business days</p>
                </div>
              </div>
              <div className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full border-2",
                shippingMethod === "express" ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-brand-primary)] text-white" : "border-[color:var(--color-border)]"
              )}>
                {shippingMethod === "express" && <Check className="h-3 w-3 text-white" />}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-[color:var(--color-border)] pt-3 text-xs">
              <span className="text-[color:var(--color-text-tertiary)]">Shipping Fee:</span>
              <span className="font-semibold text-[color:var(--color-text-primary)]">
                Rs. {shippingConfig.expressRate.toLocaleString()}
              </span>
            </div>
          </button>
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
    </div>
  );
}
