import { motion, AnimatePresence } from "framer-motion";
import { useUiStore } from "@/lib/stores/ui-store";
import { Button } from "@/components/primitives/Button";
import { Cookie } from "lucide-react";

export function CookieConsent() {
  const cookieConsent = useUiStore((state) => state.cookieConsent);
  const setCookieConsent = useUiStore((state) => state.setCookieConsent);

  return (
    <AnimatePresence>
      {!cookieConsent && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-24 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5 shadow-[var(--shadow-strong)] backdrop-blur-xl md:left-8 md:right-auto"
        >
          <div className="flex items-start gap-3">
            <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--color-accent-teal)]" />
            <div className="space-y-3">
              <p className="text-sm font-medium text-[color:var(--color-text-primary)]">
                We value your privacy
              </p>
              <p className="text-xs leading-6 text-[color:var(--color-text-secondary)]">
                We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  className="px-4 py-2 text-xs"
                  onClick={() => setCookieConsent(true)}
                >
                  Accept All
                </Button>
                <Button
                  variant="ghost"
                  className="px-4 py-2 text-xs"
                  onClick={() => setCookieConsent(true)}
                >
                  Decline
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
