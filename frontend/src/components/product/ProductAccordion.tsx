import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type AccordionItem = {
  title: string;
  content: React.ReactNode;
};

export function ProductAccordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<number>(0);

  return (
    <div className="divide-y divide-[color:var(--color-border)]">
      {items.map((item, i) => (
        <div key={item.title}>
          <button
            type="button"
            onClick={() => setOpen(open === i ? -1 : i)}
            className="flex w-full items-center justify-between py-4 text-sm font-medium text-[color:var(--color-text-primary)]"
          >
            {item.title}
            <ChevronDown className={cn("h-4 w-4 transition-transform", open === i && "rotate-180")} />
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pb-4 text-sm leading-7 text-[color:var(--color-text-secondary)]">
                  {item.content}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
