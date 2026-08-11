import { useState, useEffect, type ReactNode } from "react";
import { Expand, ChevronLeft, ChevronRight, Maximize2, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { resolveCloudinaryVideoUrl } from "@/lib/api/products";

type GalleryItem = {
  type: "image" | "video";
  url: string;
};

type ProductGalleryProps = {
  images: string[];
  videos?: string[];
  name: string;
  /** Optional element rendered between the main image/video and the thumbnail strip (e.g. Try On button). */
  action?: ReactNode;
};

export function ProductGallery({ images, videos = [], name, action }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Reset active image index whenever the active images/videos array changes (e.g. variant switch)
  useEffect(() => {
    setSelected(0);
  }, [images, videos]);

  const galleryItems: GalleryItem[] = [
    ...images.map((img) => ({ type: "image" as const, url: img })),
    ...videos.map((vid) => ({ type: "video" as const, url: resolveCloudinaryVideoUrl(vid) })),
  ];

  const currentItem = galleryItems[selected] || galleryItems[0] || { type: "image", url: "" };

  const prev = () => setSelected((s) => (s - 1 + galleryItems.length) % galleryItems.length);
  const next = () => setSelected((s) => (s + 1) % galleryItems.length);

  return (
    <>
      <div className="relative">
        <div
          className="relative aspect-[4/3] w-full cursor-crosshair overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]"
          onMouseMove={(e) => {
            if (currentItem.type === "image") {
              const rect = e.currentTarget.getBoundingClientRect();
              setMousePos({
                x: ((e.clientX - rect.left) / rect.width) * 100,
                y: ((e.clientY - rect.top) / rect.height) * 100,
              });
            }
          }}
          onMouseEnter={() => currentItem.type === "image" && setZoom(true)}
          onMouseLeave={() => setZoom(false)}
        >
          <AnimatePresence mode="wait">
            {currentItem.type === "video" ? (
              <motion.video
                key={selected}
                src={currentItem.url}
                controls
                autoPlay
                muted
                loop
                playsInline
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="h-full w-full object-contain bg-black"
              />
            ) : (
              <motion.img
                key={selected}
                src={currentItem.url}
                alt={`${name} ${selected + 1}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="h-full w-full object-contain"
              />
            )}
          </AnimatePresence>
          {zoom && currentItem.type === "image" && (
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage: `url(${currentItem.url})`,
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

          {galleryItems.length > 1 && (
            <>
              <button type="button" onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[color:var(--color-text-primary)] shadow-sm backdrop-blur-sm transition-all hover:bg-white">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button type="button" onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[color:var(--color-text-primary)] shadow-sm backdrop-blur-sm transition-all hover:bg-white">
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 pointer-events-none">
            {galleryItems.map((_, i) => (
              <span
                key={i}
                className={cn("h-1.5 rounded-full transition-all", selected === i ? "w-6 bg-white" : "w-1.5 bg-white/50")}
              />
            ))}
          </div>
        </div>

        {action && <div className="mt-3">{action}</div>}

        <div className="relative mt-3 group/strip">
          <div id="thumb-strip-scroll" className="flex gap-2 overflow-x-auto pb-1 scroll-smooth no-scrollbar">
            {galleryItems.map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelected(i)}
                className={cn(
                  "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all bg-black/5",
                  selected === i
                    ? "border-[color:var(--color-brand-primary)]"
                    : "border-transparent hover:border-[color:var(--color-border)]",
                )}
              >
                {item.type === "video" ? (
                  <div className="relative h-full w-full bg-black flex items-center justify-center">
                    <video src={item.url} className="h-full w-full object-cover opacity-70" />
                    <div className="absolute flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-black shadow">
                      <Play className="h-3.5 w-3.5 fill-black ml-0.5" />
                    </div>
                  </div>
                ) : (
                  <img src={item.url} alt={`${name} thumbnail ${i + 1}`} className="h-full w-full object-cover" />
                )}
              </button>
            ))}
          </div>

          {galleryItems.length > 4 && (
            <>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("thumb-strip-scroll");
                  if (el) el.scrollBy({ left: -160, behavior: "smooth" });
                }}
                className="absolute left-1 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white shadow-md transition-opacity hover:bg-black"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("thumb-strip-scroll");
                  if (el) el.scrollBy({ left: 160, behavior: "smooth" });
                }}
                className="absolute right-1 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white shadow-md transition-opacity hover:bg-black"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
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
            {currentItem.type === "video" ? (
              <video src={currentItem.url} controls autoPlay className="max-h-[90vh] max-w-[90vw] object-contain" onClick={(e) => e.stopPropagation()} />
            ) : (
              <img src={currentItem.url} alt={name} className="max-h-[90vh] max-w-[90vw] object-contain" />
            )}
            {galleryItems.length > 1 && (
              <>
                <button type="button" onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-6 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button type="button" onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-6 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
