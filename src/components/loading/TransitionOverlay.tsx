import { motion, type HTMLMotionProps } from "framer-motion";

type TransitionOverlayProps = HTMLMotionProps<"div"> & {
  children: React.ReactNode;
};

export function TransitionOverlay({ children, ...props }: TransitionOverlayProps) {
  return (
    <motion.div
      exit={{ opacity: 0, filter: "blur(4px)", scale: 0.97 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[color:var(--color-app-bg)]"
      {...props}
    >
      {children}
    </motion.div>
  );
}
