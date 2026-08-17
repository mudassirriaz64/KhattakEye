import { useState, useRef, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Camera, Upload, RotateCw, ArrowLeft, ScanFace, HelpCircle,
  ZoomIn, Move, RefreshCw, LoaderCircle, AlertTriangle,
  SlidersHorizontal, ImageIcon, Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/primitives/Button";
import { cn } from "@/lib/utils";
import {
  computeGlassesPose,
  processGlassesImage,
} from "@/lib/glasses-utils";
import { useFaceDetection } from "@/hooks/useFaceDetection";

import { getProducts, getProductBySlug } from "@/lib/api/products";

type Step =
  | "onboarding"
  | "loading"
  | "live"
  | "adjust"
  | "compare"
  | "error";

const defaultFrames: Array<{ name: string; image: string; slug: string; tryOnImage?: string }> = [];

const FALLBACK_GLASSES_PLACEHOLDER = "data:image/svg+xml;utf8," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 140"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#111827"/><stop offset="100%" stop-color="#374151"/></linearGradient></defs><g fill="none" stroke="url(#g)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="105" cy="70" rx="78" ry="52" fill="rgba(147,197,253,0.25)"/><ellipse cx="295" cy="70" rx="78" ry="52" fill="rgba(147,197,253,0.25)"/><path d="M183 70 L217 70"/><path d="M27 70 C15 70 8 60 8 45 L8 30"/><path d="M373 70 C385 70 392 60 392 45 L392 30"/></g></svg>'
);

export function VirtualTryOn() {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<Step>("onboarding");
  const [image, setImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [selectedFrame, setSelectedFrame] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [glassesDataUrl, setGlassesDataUrl] = useState<string>("");

  const [frames, setFrames] = useState<Array<{ name: string; image: string; slug: string; tryOnImage?: string }>>(defaultFrames);

  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  const dragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const posStart = useRef({ x: 0, y: 0 });

  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const poseRef = useRef<{
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
  } | null>(null);
  const glassesCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number>(0);

  const {
    detected,
    keypoints,
    loading: faceDetectionLoading,
    error: faceDetectionError,
    startDetection,
    stopDetection,
  } = useFaceDetection();

  useEffect(() => {
    async function loadFrames() {
      try {
        const res = await getProducts({ limit: 12 });
        let list: Array<{ name: string; image: string; slug: string; tryOnImage?: string }> = [];
        if (res && res.items && res.items.length > 0) {
          list = res.items.map((p) => {
            const firstImg = typeof p.images?.[0] === "string" ? p.images[0] : "";
            const tryOn = (p as any).tryOnImage || "";
            return {
              name: p.name,
              image: firstImg || tryOn || FALLBACK_GLASSES_PLACEHOLDER,
              tryOnImage: tryOn || firstImg || FALLBACK_GLASSES_PLACEHOLDER,
              slug: p.slug || p.id || ""
            };
          });
        }

        const rawProductParam = searchParams.get("product");
        if (rawProductParam) {
          const productParam = decodeURIComponent(rawProductParam).toLowerCase().trim();
          
          let matchIdx = list.findIndex(f => 
            f.slug.toLowerCase() === productParam || 
            f.name.toLowerCase() === productParam ||
            f.name.toLowerCase().includes(productParam) ||
            productParam.includes(f.slug.toLowerCase())
          );

          if (matchIdx === -1) {
            try {
              const p = await getProductBySlug(productParam);
              if (p) {
                const firstImg = typeof p.images?.[0] === "string" ? p.images[0] : "";
                const tryOn = (p as any).tryOnImage || "";
                const single = {
                  name: p.name,
                  image: firstImg || tryOn || FALLBACK_GLASSES_PLACEHOLDER,
                  tryOnImage: tryOn || firstImg || FALLBACK_GLASSES_PLACEHOLDER,
                  slug: p.slug || p.id || productParam
                };
                list.unshift(single);
                matchIdx = 0;
              }
            } catch {
              const customSingle = {
                name: rawProductParam.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
                image: FALLBACK_GLASSES_PLACEHOLDER,
                tryOnImage: FALLBACK_GLASSES_PLACEHOLDER,
                slug: productParam
              };
              list.unshift(customSingle);
              matchIdx = 0;
            }
          }

          if (list.length > 0) {
            setFrames(list);
            if (matchIdx !== -1) setSelectedFrame(matchIdx);
          }
        } else if (list.length > 0) {
          setFrames(list);
        }
      } catch {
        // use defaultFrames fallback
      }
    }

    loadFrames();
  }, [searchParams]);

  useEffect(() => {
    if (videoReady && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
      setTimeout(() => {
        if (videoRef.current) startDetection(videoRef.current);
      }, 300);
    }
  }, [videoReady, startDetection]);

  useEffect(() => {
    if (!frames[selectedFrame]) return;
    const src = frames[selectedFrame].tryOnImage || frames[selectedFrame].image;
    processGlassesImage(src).then((canvas) => {
      glassesCanvasRef.current = canvas;
      setGlassesDataUrl(canvas.toDataURL("image/png"));
    }).catch(() => {
      processGlassesImage(frames[selectedFrame].image || FALLBACK_GLASSES_PLACEHOLDER).then((canvas) => {
        glassesCanvasRef.current = canvas;
        setGlassesDataUrl(canvas.toDataURL("image/png"));
      });
    });
  }, [selectedFrame, frames]);

  useEffect(() => {
    const pose = computeGlassesPose(keypoints);
    if (pose) poseRef.current = pose;
  }, [keypoints]);

  const GLASSES_WIDTH_SCALE = 1.85;

  const computeGlassesDrawSize = (poseOrWidth: { width: number } | number, gCanvas: HTMLCanvasElement | null) => {
    const widthNum = typeof poseOrWidth === "number" ? poseOrWidth : poseOrWidth.width;
    const aspect = gCanvas ? (gCanvas.width / (gCanvas.height || 1)) : 2.857;
    const drawW = widthNum * GLASSES_WIDTH_SCALE;
    return { width: drawW, height: drawW / aspect };
  };

  const renderLoop = useCallback(() => {
    if (step !== "live") return;

    const canvas = overlayCanvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) {
      animRef.current = requestAnimationFrame(renderLoop);
      return;
    }

    const vw = video.videoWidth || 640;
    const vh = video.videoHeight || 480;
    if (canvas.width !== vw || canvas.height !== vh) {
      canvas.width = vw;
      canvas.height = vh;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      animRef.current = requestAnimationFrame(renderLoop);
      return;
    }
    ctx.clearRect(0, 0, vw, vh);

    const pose = poseRef.current;
    const gCanvas = glassesCanvasRef.current;
    if (pose && gCanvas) {
      const { width: drawWidth, height: drawHeight } = computeGlassesDrawSize(pose, gCanvas);

      ctx.save();
      ctx.translate(pose.x, pose.y);
      ctx.rotate(pose.rotation);
      ctx.drawImage(
        gCanvas,
        -drawWidth / 2,
        -drawHeight / 2,
        drawWidth,
        drawHeight,
      );
      ctx.restore();
    }

    animRef.current = requestAnimationFrame(renderLoop);
  }, [step]);

  useEffect(() => {
    if (step === "live") {
      animRef.current = requestAnimationFrame(renderLoop);
    }
    return () => cancelAnimationFrame(animRef.current);
  }, [step, renderLoop]);

  const startCamera = useCallback(async () => {
    setStep("loading");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });
      streamRef.current = stream;
      setStep("live");
    } catch {
      setErrorMsg(
        "Camera access denied. Please allow camera permissions or upload a photo instead.",
      );
      setStep("error");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
      stopDetection();
      cancelAnimationFrame(animRef.current);
    };
  }, [stopCamera, stopDetection]);

  const captureImage = () => {
    const video = videoRef.current;
    if (!video) return;

    const vw = video.videoWidth || 640;
    const vh = video.videoHeight || 480;

    const rawCanvas = document.createElement("canvas");
    rawCanvas.width = vw;
    rawCanvas.height = vh;
    rawCanvas.getContext("2d")!.drawImage(video, 0, 0);
    const rawUrl = rawCanvas.toDataURL("image/jpeg");

    setOriginalImage(rawUrl);
    setImage(rawUrl);
    setPos({ x: 0, y: 0 });
    setScale(1);
    setRotation(0);
    stopCamera();
    stopDetection();
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

  const reset = () => {
    stopCamera();
    stopDetection();
    setImage(null);
    setOriginalImage(null);
    setPos({ x: 0, y: 0 });
    setScale(1);
    setRotation(0);
    setSelectedFrame(0);
    setErrorMsg("");
    setStep("onboarding");
  };

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

  const handlePointerUp = () => {
    dragging.current = false;
  };

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

      const gImg = new Image();
      gImg.onload = () => {
        const cx = cw / 2 + pos.x;
        const cy = ch / 2 + pos.y;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(scale, scale);
        const gAspect = (glassesCanvasRef.current?.width || gImg.naturalWidth || 400) /
          (glassesCanvasRef.current?.height || gImg.naturalHeight || 140);
        const gw = cw * 0.42;
        const gh = gw / gAspect;
        ctx.drawImage(gImg, -gw / 2, -gh / 2, gw, gh);
        ctx.restore();

        const link = document.createElement("a");
        link.download = "khattak-tryon.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      };
      gImg.crossOrigin = "anonymous";
      gImg.src = glassesDataUrl || frames[selectedFrame].tryOnImage || frames[selectedFrame].image;
    };
    img.src = image;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-10">
      <AnimatePresence mode="wait">
        {step === "onboarding" && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[color:var(--color-surface-muted)]">
                <ScanFace className="h-10 w-10 text-[color:var(--color-accent-teal)]" />
              </div>
              <h1 className="mt-4 font-display text-3xl text-[color:var(--color-text-primary)] md:text-5xl">
                Virtual Try-On
              </h1>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[color:var(--color-text-secondary)]">
                Try frames on your face in real-time. Choose your method below.
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
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mx-auto mt-4 max-w-lg overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-4 text-left"
                  >
                    <ol className="space-y-2 text-xs text-[color:var(--color-text-secondary)]">
                      <li className="flex items-start gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-accent-teal)] text-[9px] text-white">1</span>
                        Take a photo or upload a clear front-facing picture
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-accent-teal)] text-[9px] text-white">2</span>
                        Glasses appear automatically on your face
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-accent-teal)] text-[9px] text-white">3</span>
                        Drag, resize, and rotate to fine-tune the fit
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-accent-teal)] text-[9px] text-white">4</span>
                        Compare before/after and save your look
                      </li>
                    </ol>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {[
                { icon: Camera, title: "Use Camera", desc: "Real-time preview with auto face detection.", action: startCamera },
                { icon: Upload, title: "Upload Photo", desc: "Upload a clear front-facing photo.", action: () => document.getElementById("tryon-upload")?.click() },
              ].map((opt) => (
                <button
                  key={opt.title}
                  type="button"
                  onClick={opt.action}
                  className="group rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 text-left transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[color:var(--color-surface-muted)] text-[color:var(--color-accent-teal)] transition-colors group-hover:bg-[color:var(--color-accent-teal)] group-hover:text-white">
                    <opt.icon className="h-8 w-8" />
                  </div>
                  <h3 className="mt-4 font-display text-2xl text-[color:var(--color-text-primary)]">
                    {opt.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--color-text-secondary)]">
                    {opt.desc}
                  </p>
                </button>
              ))}
            </div>
            <input
              id="tryon-upload"
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
          </motion.div>
        )}

        {step === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <LoaderCircle className="h-10 w-10 animate-spin text-[color:var(--color-accent-teal)]" />
            <p className="mt-4 text-sm text-[color:var(--color-text-secondary)]">
              Initializing...
            </p>
          </motion.div>
        )}

        {step === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
              <AlertTriangle className="h-8 w-8 text-[color:var(--color-danger)]" />
            </div>
            <p className="mt-4 text-sm font-medium text-[color:var(--color-text-primary)]">
              Something went wrong
            </p>
            <p className="mt-1 text-xs text-[color:var(--color-text-secondary)]">
              {errorMsg}
            </p>
            <div className="mt-6 flex gap-3">
              <Button variant="outline" onClick={reset}>
                Try Again
              </Button>
              <Button
                variant="primary"
                onClick={() => document.getElementById("tryon-upload")?.click()}
              >
                Upload Photo Instead
              </Button>
            </div>
          </motion.div>
        )}

        {step === "live" && (
          <motion.div
            key="live"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
              <div className="relative overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-black aspect-[4/3]">
                <video
                  ref={(el) => {
                    videoRef.current = el;
                    if (el && !videoReady) setVideoReady(true);
                  }}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <canvas
                  ref={overlayCanvasRef}
                  className="pointer-events-none absolute inset-0 h-full w-full"
                />
                {faceDetectionLoading && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <p className="rounded-full bg-black/50 px-4 py-1.5 text-xs text-white/70 backdrop-blur">
                      Loading face detection...
                    </p>
                  </div>
                )}
                {!detected && !faceDetectionLoading && faceDetectionError && (
                  <div className="pointer-events-none absolute left-3 top-3">
                    <p className="rounded-full bg-amber-500/80 px-3 py-1 text-xs text-white backdrop-blur">
                      Face detection unavailable — position manually
                    </p>
                  </div>
                )}
                {!detected && !faceDetectionLoading && !faceDetectionError && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <p className="rounded-full bg-black/50 px-4 py-1.5 text-xs text-white/70 backdrop-blur">
                      Position your face in the frame
                    </p>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                  <div className="flex items-center justify-center gap-3">
                    <Button
                      variant="primary"
                      onClick={captureImage}
                      iconLeft={<Camera className="h-4 w-4" />}
                    >
                      Capture
                    </Button>
                    <Button
                      variant="outline"
                      onClick={reset}
                      iconLeft={<ArrowLeft className="h-4 w-4" />}
                    >
                      Back
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-tertiary)]">
                    Select Frame
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {frames.map((frame, i) => (
                      <button
                        key={frame.name + i}
                        type="button"
                        onClick={() => setSelectedFrame(i)}
                        className={cn(
                          "rounded-2xl border-2 p-3 text-left transition-all",
                          selectedFrame === i
                            ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-surface-muted)]"
                            : "border-[color:var(--color-border)] hover:border-[color:var(--color-border-strong)]",
                        )}
                      >
                        <img
                          src={frame.image}
                          alt={frame.name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = FALLBACK_GLASSES_PLACEHOLDER;
                          }}
                          className="h-12 w-full rounded-lg object-contain bg-neutral-100"
                        />
                        <p className="mt-1.5 truncate text-[10px] font-medium text-[color:var(--color-text-primary)]">
                          {frame.name}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[color:var(--color-text-tertiary)]">
                    Tips
                  </p>
                  <div className="mt-2 space-y-1 text-xs text-[color:var(--color-text-secondary)]">
                    <p className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Good lighting
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Face the camera directly
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Keep your face centered
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === "adjust" && image && (
          <motion.div
            key="adjust"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
              <div
                ref={containerRef}
                className="relative overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] min-h-[300px]"
              >
                <img
                  src={image}
                  alt="Your photo"
                  className="h-full w-full object-contain max-h-[60vh]"
                />

                <div
                  className="absolute inset-0 cursor-grab active:cursor-grabbing"
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                >
                  <div
                    className="absolute left-1/2 top-1/2"
                    style={{
                      transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px)) rotate(${rotation}deg) scale(${scale})`,
                    }}
                  >
                    {glassesDataUrl && (
                      <img
                        src={glassesDataUrl}
                        alt="Glasses"
                        className="pointer-events-none max-w-none"
                        style={{
                          width: "min(42vw, 360px)",
                          height: "calc(min(42vw, 360px) / " +
                            ((glassesCanvasRef.current?.width || 400) / (glassesCanvasRef.current?.height || 140)) +
                            ")",
                        }}
                        draggable={false}
                      />
                    )}
                  </div>
                </div>

                <div className="absolute left-3 top-3 flex gap-1.5">
                  {[
                    { icon: ZoomIn, label: "Resize", action: () => setScale((s) => Math.min(2.5, s + 0.1)) },
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

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-tertiary)]">
                    Select Frame
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {frames.map((frame, i) => (
                      <button
                        key={frame.name + i + "-adj"}
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
                        <img
                          src={frame.image}
                          alt={frame.name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = FALLBACK_GLASSES_PLACEHOLDER;
                          }}
                          className="h-12 w-full rounded-lg object-contain bg-neutral-100"
                        />
                        <p className="mt-1.5 truncate text-[10px] font-medium text-[color:var(--color-text-primary)]">
                          {frame.name}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[color:var(--color-text-tertiary)]">
                    Controls
                  </p>
                  <div className="mt-2 space-y-1.5 text-xs text-[color:var(--color-text-secondary)]">
                    <p className="flex items-center gap-2">
                      <Move className="h-3 w-3" /> Drag to move frame
                    </p>
                    <p className="flex items-center gap-2">
                      <ZoomIn className="h-3 w-3" /> +/- to resize
                    </p>
                    <p className="flex items-center gap-2">
                      <RotateCw className="h-3 w-3" /> Click to rotate
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    variant="primary"
                    onClick={() => setStep("compare")}
                    iconLeft={<SlidersHorizontal className="h-4 w-4" />}
                    className="w-full"
                  >
                    Compare Before / After
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={savePreview}
                      iconLeft={<ImageIcon className="h-4 w-4" />}
                      className="flex-1"
                    >
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={reset}
                      iconLeft={<Trash2 className="h-4 w-4" />}
                    >
                      Retake
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </motion.div>
        )}

        {step === "compare" && originalImage && image && (
          <motion.div
            key="compare"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <h2 className="font-display text-2xl text-[color:var(--color-text-primary)]">
              Before / After
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="overflow-hidden rounded-3xl border border-[color:var(--color-border)]">
                <p className="bg-[color:var(--color-surface-muted)] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[color:var(--color-text-tertiary)]">
                  Original
                </p>
                <img
                  src={originalImage}
                  alt="Before"
                  className="h-full w-full object-contain max-h-[50vh]"
                />
              </div>
              <div className="overflow-hidden rounded-3xl border border-[color:var(--color-border)]">
                <p className="bg-[color:var(--color-surface-muted)] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[color:var(--color-accent-teal)]">
                  With Frame
                </p>
                <div className="relative">
                  <img
                    src={image}
                    alt="After"
                    className="h-full w-full object-contain max-h-[50vh]"
                  />
                  <div
                    className="pointer-events-none absolute left-1/2 top-1/2"
                    style={{
                      transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px)) rotate(${rotation}deg) scale(${scale})`,
                    }}
                  >
                    {glassesDataUrl && (
                      <img
                        src={glassesDataUrl}
                        alt=""
                        className="pointer-events-none max-w-none"
                        style={{
                          width: "min(42vw, 360px)",
                          height: "calc(min(42vw, 360px) / " +
                            ((glassesCanvasRef.current?.width || 400) / (glassesCanvasRef.current?.height || 140)) +
                            ")",
                        }}
                        draggable={false}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-3">
              <Button
                variant="primary"
                onClick={savePreview}
                iconLeft={<ImageIcon className="h-4 w-4" />}
              >
                Save Preview
              </Button>
              <Button
                variant="outline"
                onClick={() => setStep("adjust")}
                iconLeft={<ArrowLeft className="h-4 w-4" />}
              >
                Back to Adjust
              </Button>
              <Button
                variant="ghost"
                onClick={reset}
                iconLeft={<RefreshCw className="h-4 w-4" />}
              >
                Start Over
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
