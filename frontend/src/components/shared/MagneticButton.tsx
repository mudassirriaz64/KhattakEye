import { useRef, useState } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type MagneticButtonProps = HTMLMotionProps<"button">;

export function MagneticButton({ children, className, ...props }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x: x * 0.15, y: y * 0.15 });
  };

  const handleLeave = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.button
      ref={ref}
      className={cn("relative", className)}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
