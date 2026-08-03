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
import {
  computeGlassesPose,
  processGlassesImage,
} from "@/lib/glasses-utils";
import { useFaceDetection } from "@/hooks/useFaceDetection";

type Step =
  | "onboarding"
  | "loading"
  | "live"
  | "adjust"
  | "compare"
  | "error";

export function VirtualTryOn() {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<Step>("onboarding");
  const [image, setImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [selectedFrame, setSelectedFrame] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [glassesDataUrl, setGlassesDataUrl] = useState<string>("");

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

  const shopFrames = shopAllProducts.slice(0, 6).map((p) => ({
    name: p.name,
    image: p.images[0],
    slug: p.slug,
  }));
  const frames = shopFrames.length > 0 ? shopFrames : [
    { name: "Noir Line Titanium", image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=200", slug: "" },
    { name: "Rose Gold Aviator", image: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=200", slug: "" },
  ];

  useEffect(() => {
    return () => {
      stopCamera();
      stopDetection();
      cancelAnimationFrame(animRef.current);
    };
  }, [stopDetection]);

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
    processGlassesImage(frames[selectedFrame].image).then((canvas) => {
      glassesCanvasRef.current = canvas;
      setGlassesDataUrl(canvas.toDataURL("image/png"));
    });
  }, [selectedFrame, frames]);

  useEffect(() => {
    const pose = computeGlassesPose(keypoints);
    if (pose) poseRef.current = pose;
  }, [keypoints]);

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
      ctx.save();
      ctx.translate(pose.x, pose.y);
      ctx.rotate(pose.rotation);
      ctx.drawImage(
        gCanvas,
        -pose.width / 2,
        -pose.height / 2,
        pose.width,
        pose.height,
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

  const captureImage = () => {
    const video = videoRef.current;
    if (!video) return;

    const vw = video.videoWidth || 640;
    const vh = video.videoHeight || 480;

    const compCanvas = document.createElement("canvas");
    compCanvas.width = vw;
    compCanvas.height = vh;
    const compCtx = compCanvas.getContext("2d")!;
    compCtx.drawImage(video, 0, 0);

    const pose = poseRef.current;
    const gCanvas = glassesCanvasRef.current;
    if (pose && gCanvas) {
      compCtx.save();
      compCtx.translate(pose.x, pose.y);
      compCtx.rotate(pose.rotation);
      compCtx.drawImage(
        gCanvas,
        -pose.width / 2,
        -pose.height / 2,
        pose.width,
        pose.height,
      );
      compCtx.restore();
    }

    const compUrl = compCanvas.toDataURL("image/png");

    const rawCanvas = document.createElement("canvas");
    rawCanvas.width = vw;
    rawCanvas.height = vh;
    rawCanvas.getContext("2d")!.drawImage(video, 0, 0);
    const rawUrl = rawCanvas.toDataURL("image/jpeg");

    setOriginalImage(rawUrl);
    setImage(compUrl);
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
        const gw = cw * 0.4;
        const gh = gw * 0.45;
        ctx.drawImage(gImg, -gw / 2, -gh / 2, gw, gh);
        ctx.restore();

        const link = document.createElement("a");
        link.download = "khattak-tryon.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      };
      gImg.src = glassesDataUrl || frames[selectedFrame].image;
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
                        key={frame.name}
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
                          className="h-12 w-full rounded-lg object-cover"
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
                        className="pointer-events-none"
                        style={{ width: "240px", height: "auto" }}
                        draggable={false}
                      />
                    )}
                  </div>
                </div>

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

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-tertiary)]">
                    Select Frame
                  </p>
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
                        <img
                          src={frame.image}
                          alt={frame.name}
                          className="h-12 w-full rounded-lg object-cover"
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
                        className="pointer-events-none"
                        style={{ width: "240px", height: "auto" }}
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
