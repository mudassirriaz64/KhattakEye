import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Plus, Edit3, Trash2, CheckCircle2 } from "lucide-react";
import { AccountLayout } from "@/components/account/AccountLayout";
import { mockAddresses } from "@/lib/account-data";
import { Button } from "@/components/primitives/Button";

export function SavedAddressesPage() {
  const [addresses, setAddresses] = useState(mockAddresses);

  const setDefault = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  const remove = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <AccountLayout title="Saved Addresses" subtitle={`${addresses.length} addresses on file`}>
      <button type="button" className="flex w-full items-center gap-3 rounded-2xl border-2 border-dashed border-[color:var(--color-border)] p-4 text-left transition-colors hover:border-[color:var(--color-accent-teal)] hover:bg-[color:var(--color-surface-muted)]">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--color-surface-muted)]">
          <Plus className="h-5 w-5 text-[color:var(--color-accent-teal)]" />
        </div>
        <span className="text-sm font-medium text-[color:var(--color-text-secondary)]">Add New Address</span>
      </button>

      <div className="mt-6 space-y-4">
        <AnimatePresence>
          {addresses.map((addr, i) => (
            <motion.div
              key={addr.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ delay: i * 0.05 }}
              className="relative rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5"
            >
              {addr.isDefault && (
                <span className="absolute right-4 top-4 flex items-center gap-1 rounded-lg bg-[color:var(--color-accent-teal)]/10 px-2.5 py-1 text-[10px] font-semibold text-[color:var(--color-accent-teal)]">
                  <CheckCircle2 className="h-3 w-3" /> Default
                </span>
              )}
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--color-surface-muted)]">
                <MapPin className="h-5 w-5 text-[color:var(--color-accent-teal)]" />
              </div>
              <h4 className="mt-3 text-sm font-semibold text-[color:var(--color-text-primary)]">{addr.label}</h4>
              <p className="mt-1 text-xs leading-relaxed text-[color:var(--color-text-secondary)]">
                {addr.fullName}<br />{addr.street}, {addr.area}<br />{addr.city}, {addr.province} {addr.postalCode}<br />Phone: {addr.phone}
              </p>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" iconLeft={<Edit3 className="h-3.5 w-3.5" />} className="text-xs">Edit</Button>
                {!addr.isDefault && (
                  <>
                    <button type="button" onClick={() => setDefault(addr.id)} className="rounded-xl border border-[color:var(--color-border)] px-3.5 py-2 text-xs font-medium text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-muted)]">
                      Set as Default
                    </button>
                    <button type="button" onClick={() => remove(addr.id)} className="ml-auto flex items-center gap-1 rounded-xl border border-[color:var(--color-border)] px-3.5 py-2 text-xs font-medium text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-danger)] hover:text-[color:var(--color-danger)]">
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </AccountLayout>
  );
}
