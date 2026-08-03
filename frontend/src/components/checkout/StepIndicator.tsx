import { cn } from "@/lib/utils";

const steps = [
  { num: 1, label: "Information" },
  { num: 2, label: "Shipping" },
  { num: 3, label: "Payment" },
  { num: 4, label: "Review" },
];

export function StepIndicator({ current }: { current: number }) {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between">
        {steps.map((step, i) => (
          <div key={step.num} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-all",
                  current === step.num
                    ? "bg-[color:var(--color-brand-primary)] text-white"
                    : current > step.num
                      ? "bg-[color:var(--color-accent-teal)] text-white"
                      : "border border-[color:var(--color-border)] bg-[color:var(--color-panel)] text-[color:var(--color-text-tertiary)]",
                )}
              >
                {current > step.num ? "✓" : step.num}
              </div>
              <span
                className={cn(
                  "mt-1.5 text-[11px] font-medium transition-colors",
                  current >= step.num ? "text-[color:var(--color-text-primary)]" : "text-[color:var(--color-text-tertiary)]",
                )}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "mx-4 h-px w-12 sm:w-20 md:w-32",
                  current > step.num ? "bg-[color:var(--color-accent-teal)]" : "bg-[color:var(--color-border)]",
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
