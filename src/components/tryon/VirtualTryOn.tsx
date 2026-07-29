import { useState, useRef, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Camera, Upload, RotateCw, ArrowLeft, ScanFace, HelpCircle,
  ZoomIn, Move, RefreshCw, LoaderCircle, AlertTriangle,
  SlidersHorizontal, ImageIcon, Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/primitives/Button";
import { allProducts as shopAllProducts } from "@/lib/shop-data";
import { cn } from "@/lib/utils";

type Step =
  | "onboarding"
  | "camera"
  | "preview"
  | "adjust"
  | "compare"
  | "loading"
  | "error"
  | "no-face";

export function VirtualTryOn() {
  const [searchParams] = useSearchParams();
  const productSlug = searchParams.get("product");

  const [step, setStep] = useState<Step>("onboarding");
  const [image, setImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [selectedFrame, setSelectedFrame] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Transform state for frame overlay
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const dragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const posStart = useRef({ x: 0, y: 0 });

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Suggest frames from shop products
  const shopFrames = shopAllProducts.slice(0, 6).map((p) => ({
    name: p.name,
    image: p.images[0],
    slug: p.slug,
  }));

  useEffect(() => {
    return () => { stopCamera(); };
  }, []);

  const startCamera = useCallback(async () => {
    setStep("loading");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStep("camera");
    } catch {
      setErrorMsg("Camera access denied. Please allow camera permissions or upload a photo instead.");
      setStep("error");
    }
  }, []);

  const captureImage = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg");
    setOriginalImage(dataUrl);
    setImage(dataUrl);
    stopCamera();
    setStep("adjust");
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStep("loading");
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setOriginalImage(url);
      setImage(url);
      setTimeout(() => setStep("adjust"), 400);
    };
    reader.onerror = () => {
      setErrorMsg("Failed to load image. Please try another file.");
      setStep("error");
    };
    reader.readAsDataURL(file);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const reset = () => {
    stopCamera();
    setImage(null);
    setOriginalImage(null);
    setPos({ x: 0, y: 0 });
    setScale(1);
    setRotation(0);
    setSelectedFrame(0);
    setErrorMsg("");
    setStep("onboarding");
  };

  // Mouse/touch drag handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    posStart.current = { x: pos.x, y: pos.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    setPos({
      x: posStart.current.x + (e.clientX - dragStart.current.x),
      y: posStart.current.y + (e.clientY - dragStart.current.y),
    });
  };

  const handlePointerUp = () => { dragging.current = false; };

  const savePreview = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !image) return;
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      const cw = canvas.width;
      const ch = canvas.height;
      ctx.drawImage(img, 0, 0, cw, ch);
      // Draw frame overlay
      const cx = cw / 2 + pos.x;
      const cy = ch / 2 + pos.y;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.strokeStyle = "#111";
      ctx.lineWidth = 6;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.ellipse(0, -ch * 0.05, 90, 40, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      const link = document.createElement("a");
      link.download = "khattak-tryon.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = image;
  };

  const frames = shopFrames.length > 0 ? shopFrames : [
    { name: "Noir Line Titanium", image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=200", slug: "" },
    { name: "Rose Gold Aviator", image: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=200", slug: "" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-10">
      <AnimatePresence mode="wait">
        {/* ── ONBOARDING ── */}
        {step === "onboarding" && (
          <motion.div key="onboarding" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[color:var(--color-surface-muted)]">
                <ScanFace className="h-10 w-10 text-[color:var(--color-accent-teal)]" />
              </div>
              <h1 className="mt-4 font-display text-3xl text-[color:var(--color-text-primary)] md:text-5xl">Virtual Try-On</h1>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[color:var(--color-text-secondary)]">
                See how any frame looks on your face in seconds. Choose your preferred method below.
              </p>
              <button
                type="button"
                onClick={() => setShowHelp(!showHelp)}
                className="mt-3 inline-flex items-center gap-1 text-xs text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-primary)]"
              >
                <HelpCircle className="h-3 w-3" /> How it works
              </button>

              <AnimatePresence>
                {showHelp && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mx-auto mt-4 max-w-lg overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-4 text-left">
                    <ol className="space-y-2 text-xs text-[color:var(--color-text-secondary)]">
                      <li className="flex items-start gap-2"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-accent-teal)] text-[9px] text-white">1</span> Take a photo or upload a clear front-facing picture</li>
                      <li className="flex items-start gap-2"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-accent-teal)] text-[9px] text-white">2</span> Choose a frame style you like</li>
                      <li className="flex items-start gap-2"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-accent-teal)] text-[9px] text-white">3</span> Drag, resize, and rotate to adjust the fit</li>
                      <li className="flex items-start gap-2"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-accent-teal)] text-[9px] text-white">4</span> Compare before/after and save your look</li>
                    </ol>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {[
                { icon: Camera, title: "Use Camera", desc: "Real-time preview with instant frame overlay.", action: startCamera },
                { icon: Upload, title: "Upload Photo", desc: "Upload a clear front-facing photo.", action: () => document.getElementById("tryon-upload")?.click() },
              ].map((opt) => (
                <button key={opt.title} type="button" onClick={opt.action} className="group rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 text-left transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[color:var(--color-surface-muted)] text-[color:var(--color-accent-teal)] transition-colors group-hover:bg-[color:var(--color-accent-teal)] group-hover:text-white">
                    <opt.icon className="h-8 w-8" />
                  </div>
                  <h3 className="mt-4 font-display text-2xl text-[color:var(--color-text-primary)]">{opt.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--color-text-secondary)]">{opt.desc}</p>
                </button>
              ))}
            </div>
            <input id="tryon-upload" type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          </motion.div>
        )}

        {/* ── LOADING ── */}
        {step === "loading" && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-20">
            <LoaderCircle className="h-10 w-10 animate-spin text-[color:var(--color-accent-teal)]" />
            <p className="mt-4 text-sm text-[color:var(--color-text-secondary)]">Initializing camera...</p>
          </motion.div>
        )}

        {/* ── ERROR ── */}
        {step === "error" && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-20">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/20">
              <AlertTriangle className="h-8 w-8 text-[color:var(--color-danger)]" />
            </div>
            <p className="mt-4 text-sm font-medium text-[color:var(--color-text-primary)]">Something went wrong</p>
            <p className="mt-1 text-xs text-[color:var(--color-text-secondary)]">{errorMsg}</p>
            <div className="mt-6 flex gap-3">
              <Button variant="outline" onClick={reset}>Try Again</Button>
              <Button variant="primary" onClick={() => document.getElementById("tryon-upload")?.click()}>Upload Photo Instead</Button>
            </div>
          </motion.div>
        )}

        {/* ── CAMERA ── */}
        {step === "camera" && (
          <motion.div key="camera" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="relative mx-auto max-w-lg overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-black">
              <video ref={videoRef} autoPlay playsInline muted className="h-full w-full" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                <p className="text-center text-xs text-white/80">Position your face centered in the frame</p>
              </div>
            </div>
            <div className="flex justify-center gap-4">
              <Button variant="primary" onClick={captureImage} iconLeft={<Camera className="h-4 w-4" />}>Capture</Button>
              <Button variant="outline" onClick={reset} iconLeft={<ArrowLeft className="h-4 w-4" />}>Back</Button>
            </div>
          </motion.div>
        )}

        {/* ── ADJUST (Main try-on workspace) ── */}
        {step === "adjust" && image && (
          <motion.div key="adjust" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
              {/* Image + overlay */}
              <div ref={containerRef} className="relative overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]">
                <img src={image} alt="Your photo" className="h-full w-full object-contain max-h-[60vh]" />

                {/* Frame overlay — interactive */}
                <div
                  className="absolute inset-0 cursor-grab active:cursor-grabbing"
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                >
                  <div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none"
                    style={{
                      transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px)) rotate(${rotation}deg) scale(${scale})`,
                    }}
                  >
                    {/* Frame visual — ellipse representing glasses */}
                    <svg width="240" height="120" viewBox="0 0 240 120" className="overflow-visible">
                      <ellipse cx="60" cy="60" rx="55" ry="30" fill="none" stroke={frames[selectedFrame]?.image ? "#111" : "#666"} strokeWidth="6" opacity="0.7" />
                      <ellipse cx="180" cy="60" rx="55" ry="30" fill="none" stroke={frames[selectedFrame]?.image ? "#111" : "#666"} strokeWidth="6" opacity="0.7" />
                      <line x1="115" y1="60" x2="125" y2="60" stroke="#666" strokeWidth="4" strokeLinecap="round" />
                      <path d="M5 60 Q-15 30 5 20" fill="none" stroke="#666" strokeWidth="3" strokeLinecap="round" />
                      <path d="M235 60 Q255 30 235 20" fill="none" stroke="#666" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>

                {/* Controls overlay */}
                <div className="absolute left-3 top-3 flex gap-1.5">
                  {[
                    { icon: ZoomIn, label: "Resize", action: () => setScale((s) => Math.min(2, s + 0.1)) },
                    { icon: RotateCw, label: "Rotate", action: () => setRotation((r) => (r + 15) % 360) },
                    { icon: RefreshCw, label: "Reset", action: () => { setPos({ x: 0, y: 0 }); setScale(1); setRotation(0); } },
                  ].map((ctrl) => (
                    <button
                      key={ctrl.label}
                      type="button"
                      onClick={ctrl.action}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white/80 backdrop-blur transition-colors hover:bg-black/60 hover:text-white"
                      aria-label={ctrl.label}
                    >
                      <ctrl.icon className="h-3.5 w-3.5" />
                    </button>
                  ))}
                </div>

                <div className="absolute bottom-3 right-3 flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}
                    className="flex h-7 items-center gap-1 rounded-full bg-black/40 px-2.5 text-[10px] text-white/80 backdrop-blur"
                  >
                    <ZoomIn className="h-3 w-3" /> {Math.round(scale * 100)}%
                  </button>
                </div>
              </div>

              {/* Side panel */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-tertiary)]">Select Frame</p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {frames.map((frame, i) => (
                      <button
                        key={frame.name}
                        type="button"
                        onClick={() => {
                          setSelectedFrame(i);
                          setPos({ x: 0, y: 0 });
                          setScale(1);
                          setRotation(0);
                        }}
                        className={cn(
                          "rounded-2xl border-2 p-3 text-left transition-all",
                          selectedFrame === i
                            ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-surface-muted)]"
                            : "border-[color:var(--color-border)] hover:border-[color:var(--color-border-strong)]",
                        )}
                      >
                        <img src={frame.image} alt={frame.name} className="h-12 w-full rounded-lg object-cover" />
                        <p className="mt-1.5 text-[10px] font-medium text-[color:var(--color-text-primary)] truncate">{frame.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[color:var(--color-text-tertiary)]">Controls</p>
                  <div className="mt-2 space-y-1.5 text-xs text-[color:var(--color-text-secondary)]">
                    <p className="flex items-center gap-2"><Move className="h-3 w-3" /> Drag to move frame</p>
                    <p className="flex items-center gap-2"><ZoomIn className="h-3 w-3" /> +/- to resize</p>
                    <p className="flex items-center gap-2"><RotateCw className="h-3 w-3" /> Click to rotate</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button variant="primary" onClick={() => setStep("compare")} iconLeft={<SlidersHorizontal className="h-4 w-4" />} className="w-full">
                    Compare Before / After
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={savePreview} iconLeft={<ImageIcon className="h-4 w-4" />} className="flex-1">
                      Save
                    </Button>
                    <Button variant="ghost" onClick={reset} iconLeft={<Trash2 className="h-4 w-4" />}>
                      Retake
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </motion.div>
        )}

        {/* ── COMPARE ── */}
        {step === "compare" && originalImage && image && (
          <motion.div key="compare" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <h2 className="font-display text-2xl text-[color:var(--color-text-primary)]">Before / After</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="overflow-hidden rounded-3xl border border-[color:var(--color-border)]">
                <p className="bg-[color:var(--color-surface-muted)] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[color:var(--color-text-tertiary)]">Original</p>
                <img src={originalImage} alt="Before" className="h-full w-full object-contain max-h-[50vh]" />
              </div>
              <div className="overflow-hidden rounded-3xl border border-[color:var(--color-border)]">
                <p className="bg-[color:var(--color-surface-muted)] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[color:var(--color-accent-teal)]">With Frame</p>
                <div className="relative">
                  <img src={image} alt="After" className="h-full w-full object-contain max-h-[50vh]" />
                  <div
                    className="pointer-events-none absolute inset-0 flex items-center justify-center"
                    style={{
                      transform: `translate(${pos.x}px, ${pos.y}px) rotate(${rotation}deg) scale(${scale})`,
                    }}
                  >
                    <svg width="240" height="120" viewBox="0 0 240 120" className="overflow-visible">
                      <ellipse cx="60" cy="60" rx="55" ry="30" fill="none" stroke={frames[selectedFrame]?.image ? "#111" : "#666"} strokeWidth="6" opacity="0.7" />
                      <ellipse cx="180" cy="60" rx="55" ry="30" fill="none" stroke={frames[selectedFrame]?.image ? "#111" : "#666"} strokeWidth="6" opacity="0.7" />
                      <line x1="115" y1="60" x2="125" y2="60" stroke="#666" strokeWidth="4" strokeLinecap="round" />
                      <path d="M5 60 Q-15 30 5 20" fill="none" stroke="#666" strokeWidth="3" strokeLinecap="round" />
                      <path d="M235 60 Q255 30 235 20" fill="none" stroke="#666" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-3">
              <Button variant="primary" onClick={savePreview} iconLeft={<ImageIcon className="h-4 w-4" />}>Save Preview</Button>
              <Button variant="outline" onClick={() => setStep("adjust")} iconLeft={<ArrowLeft className="h-4 w-4" />}>Back to Adjust</Button>
              <Button variant="ghost" onClick={reset} iconLeft={<RefreshCw className="h-4 w-4" />}>Start Over</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
