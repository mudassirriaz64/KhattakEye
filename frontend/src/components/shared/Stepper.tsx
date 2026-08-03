import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = {
  id: string;
  label: string;
};

type StepperProps = {
  steps: Step[];
  current: string;
  className?: string;
};

export function Stepper({ steps, current, className }: StepperProps) {
  const currentIndex = steps.findIndex((s) => s.id === current);

  return (
    <div className={cn("flex items-center", className)}>
      {steps.map((step, i) => {
        const isCompleted = i < currentIndex;
        const isCurrent = i === currentIndex;

        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <motion.div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors",
                  isCompleted && "border-[color:var(--color-accent-teal)] bg-[color:var(--color-accent-teal)] text-white",
                  isCurrent && "border-[color:var(--color-brand-primary)] bg-[color:var(--color-brand-primary)] text-white",
                  !isCompleted && !isCurrent && "border-[color:var(--color-border)] text-[color:var(--color-text-tertiary)]",
                )}
                animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.4, repeat: isCurrent ? Infinity : 0, repeatDelay: 2 }}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : i + 1}
              </motion.div>
              <span
                className={cn(
                  "mt-1.5 text-[10px] font-medium whitespace-nowrap",
                  isCompleted && "text-[color:var(--color-accent-teal)]",
                  isCurrent && "text-[color:var(--color-text-primary)]",
                  !isCompleted && !isCurrent && "text-[color:var(--color-text-tertiary)]",
                )}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <motion.div
                className={cn("mx-2 h-px flex-1", i < currentIndex ? "bg-[color:var(--color-accent-teal)]" : "bg-[color:var(--color-border)]")}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: i < currentIndex ? 1 : 0 }}
                transition={{ duration: 0.4 }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
