import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/primitives/Button";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: "danger" | "primary";
};

export function ConfirmModal({ open, onClose, onConfirm, title, message, confirmLabel = "Confirm", variant = "danger" }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-sm rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 shadow-[var(--shadow-strong)]">
              <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${variant === "danger" ? "bg-red-500/10" : "bg-[color:var(--color-accent-teal)]/10"}`}>
                  <AlertTriangle className={`h-5 w-5 ${variant === "danger" ? "text-red-500" : "text-[color:var(--color-accent-teal)]"}`} />
                </div>
                <button type="button" onClick={onClose}><X className="h-4 w-4 text-[color:var(--color-text-tertiary)]" /></button>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[color:var(--color-text-primary)]">{title}</h3>
              <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">{message}</p>
              <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={onClose} className="flex-1 text-xs">Cancel</Button>
                <Button variant={variant === "danger" ? "danger" : "primary"} onClick={onConfirm} className="flex-1 text-xs">{confirmLabel}</Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
