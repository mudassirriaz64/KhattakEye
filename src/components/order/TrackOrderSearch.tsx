import { useState } from "react";
import { Search, Package, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/primitives/Button";

type TrackOrderSearchProps = {
  onSearch: (orderId: string, phone: string) => void;
};

export function TrackOrderSearch({ onSearch }: TrackOrderSearchProps) {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim() && phone.trim()) onSearch(orderId.trim(), phone.trim());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-lg"
    >
      <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 md:p-8">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[color:var(--color-surface-muted)]">
            <Package className="h-8 w-8 text-[color:var(--color-accent-teal)]" />
          </div>
          <h1 className="mt-4 font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">Track Your Order</h1>
          <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">
            Enter your order number and phone number to track your shipment.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]">Order Number</span>
            <div className="relative">
              <Package className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
              <input
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. KT-2A3F9C-BX7K"
                className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] py-3.5 pl-11 pr-4 text-sm text-[color:var(--color-text-primary)] outline-none transition-all placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-accent-blue)] focus:ring-4 focus:ring-[color:var(--color-focus-ring)]"
              />
            </div>
          </label>

          <label className="block space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]">Phone Number</span>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+92 300 1234567"
                className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] py-3.5 pl-11 pr-4 text-sm text-[color:var(--color-text-primary)] outline-none transition-all placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-accent-blue)] focus:ring-4 focus:ring-[color:var(--color-focus-ring)]"
              />
            </div>
          </label>

          <Button type="submit" variant="cta-lg" iconLeft={<Search className="h-4 w-4" />} className="w-full" disabled={!orderId.trim() || !phone.trim()}>
            Track Order
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
