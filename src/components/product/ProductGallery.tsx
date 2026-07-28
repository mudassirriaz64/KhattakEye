import { useState } from "react";
import { Expand, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  images: string[];
  name: string;
};

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const prev = () => setSelected((s) => (s - 1 + images.length) % images.length);
  const next = () => setSelected((s) => (s + 1) % images.length);

  return (
    <>
      <div className="relative">
        <div className="flex gap-4">
          <div className="hidden flex-col gap-2 md:flex">
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelected(i)}
                className={cn(
                  "h-20 w-20 overflow-hidden rounded-xl border-2 transition-all",
                  selected === i
                    ? "border-[color:var(--color-brand-primary)]"
                    : "border-transparent hover:border-[color:var(--color-border)]",
                )}
              >
                <img src={img} alt={`${name} thumbnail ${i + 1}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>

          <div
            className="relative flex-1 cursor-crosshair overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setMousePos({
                x: ((e.clientX - rect.left) / rect.width) * 100,
                y: ((e.clientY - rect.top) / rect.height) * 100,
              });
            }}
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={selected}
                src={images[selected]}
                alt={`${name} ${selected + 1}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="h-full w-full object-cover"
              />
            </AnimatePresence>
            {zoom && (
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage: `url(${images[selected]})`,
                  backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
                  backgroundSize: "200%",
                }}
              />
            )}

            <button
              type="button"
              onClick={() => setFullscreen(true)}
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-[color:var(--color-text-primary)] shadow-sm backdrop-blur-sm transition-all hover:bg-white"
              aria-label="Fullscreen"
            >
              <Maximize2 className="h-4 w-4" />
            </button>

            <button type="button" onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[color:var(--color-text-primary)] shadow-sm backdrop-blur-sm transition-all hover:bg-white opacity-0 group-hover:opacity-100">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[color:var(--color-text-primary)] shadow-sm backdrop-blur-sm transition-all hover:bg-white opacity-0 group-hover:opacity-100">
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelected(i)}
                  className={cn("h-1.5 rounded-full transition-all", selected === i ? "w-6 bg-white" : "w-1.5 bg-white/50")}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {fullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/95 backdrop-blur-2xl"
            onClick={() => setFullscreen(false)}
          >
            <button type="button" onClick={() => setFullscreen(false)} className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20">
              <Expand className="h-5 w-5" />
            </button>
            <img src={images[selected]} alt={name} className="max-h-[90vh] max-w-[90vw] object-contain" />
            <button type="button" onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-6 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button type="button" onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-6 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">
              <ChevronRight className="h-6 w-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
