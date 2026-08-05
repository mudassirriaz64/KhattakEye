import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Phone, Mail, X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const supportOptions = [
  { icon: MessageCircle, label: "WhatsApp", href: "https://wa.me/923001234567", color: "text-[#25D366]" },
  { icon: Phone, label: "Call Us", href: "tel:+923001234567", color: "text-[color:var(--color-accent-blue)]" },
  { icon: Mail, label: "Email", href: "mailto:hello@khattakeyewear.com", color: "text-[color:var(--color-accent-teal)]" },
];

export function SupportButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-24 right-6 z-40 md:bottom-6">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute bottom-16 right-0 w-56 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-2 shadow-[var(--shadow-strong)] backdrop-blur-2xl"
          >
            <p className="px-3 py-2 text-xs font-semibold text-[color:var(--color-text-primary)]">Get Support</p>
            {supportOptions.map((option) => (
              <a
                key={option.label}
                href={option.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-text-primary)]"
              >
                <option.icon className={cn("h-4 w-4", option.color)} />
                <span className="flex-1">{option.label}</span>
                <ChevronRight className="h-3 w-3 text-[color:var(--color-text-tertiary)]" />
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#8F1215] text-white shadow-lg transition-all hover:bg-[#6D1F22]"
        aria-label="Customer support"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </motion.button>
    </div>
  );
}
