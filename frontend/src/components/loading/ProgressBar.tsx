import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

type ProgressBarProps = {
  progress: number;
  show: boolean;
};

export function ProgressBar({ progress, show }: ProgressBarProps) {
  const spring = useSpring(progress, { stiffness: 80, damping: 20, restDelta: 0.5 });
  const width = useTransform(spring, [0, 100], ["0%", "100%"]);

  useEffect(() => {
    spring.set(progress);
  }, [progress, spring]);

  if (!show) return null;

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[9999] h-0.5 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="h-full brand-gradient"
        style={{ width }}
      />
    </motion.div>
  );
}
