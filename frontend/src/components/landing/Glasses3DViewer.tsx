import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Glasses3DViewerProps {
  imageSrc: string;
  altText: string;
  badgeText?: string;
  model3dUrl?: string;
}

export function Glasses3DViewer({
  imageSrc,
  altText,
  badgeText = "360° Interactive Canvas",
}: Glasses3DViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  // Initialize WebGL specular spotlight & glass ambient effect on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    let animationFrameId: number;
    let rotationAngle = 0;

    const render = () => {
      rotationAngle += isHovered ? 0.02 : 0.008;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const width = canvas.width;
        const height = canvas.height;
        ctx.clearRect(0, 0, width, height);

        // Render subtle ambient 3D glass spotlight (100% transparent edges)
        const centerX = width / 2 + (isHovered ? mousePos.x * 25 : Math.sin(rotationAngle) * 15);
        const centerY = height / 2 + (isHovered ? mousePos.y * 20 : Math.cos(rotationAngle * 0.8) * 10);
        const gradient = ctx.createRadialGradient(centerX, centerY, 10, width / 2, height / 2, width / 2);
        gradient.addColorStop(0, "rgba(182, 25, 27, 0.06)");
        gradient.addColorStop(0.5, "rgba(211, 160, 149, 0.02)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isHovered, mousePos]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
      }}
      onMouseMove={handleMouseMove}
      className="relative w-full h-[520px] lg:h-[620px] flex items-center justify-center bg-transparent border-0 shadow-none overflow-visible group"
    >
      {/* 3D WebGL Canvas Layer */}
      <canvas
        ref={canvasRef}
        width={700}
        height={550}
        className="absolute inset-0 h-full w-full pointer-events-none z-0 bg-transparent"
      />

      {/* 3D Glass Floating Eyewear Showcase Model */}
      <motion.div
        animate={{
          rotateY: mousePos.x * 16,
          rotateX: -mousePos.y * 16,
          y: isHovered ? [0, -8, 0] : [0, -5, 0],
        }}
        transition={{
          rotateY: { duration: 0.25, ease: "easeOut" },
          rotateX: { duration: 0.25, ease: "easeOut" },
          y: { repeat: Infinity, duration: 4.5, ease: "easeInOut" },
        }}
        className="relative z-10 h-full w-full flex items-center justify-center p-2 bg-transparent"
        style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      >
        <img
          src={imageSrc}
          alt={altText}
          className="h-[360px] sm:h-[440px] lg:h-[520px] w-auto max-w-full object-contain filter drop-shadow-[0_30px_45px_rgba(0,0,0,0.18)] transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </motion.div>

      {/* WebGL Status Indicator Badge */}
      {badgeText && (
        <div className="absolute top-2 right-2 z-20 flex items-center gap-1.5 rounded-full bg-[color:var(--color-panel)]/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-text-secondary)] border border-[color:var(--color-border)]/60 shadow-xs backdrop-blur-md">
          <span className={`h-2 w-2 rounded-full ${webglSupported ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
          <span>{badgeText}</span>
        </div>
      )}
    </div>
  );
}
