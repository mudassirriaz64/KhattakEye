"use client";
import { useRef, useState, useCallback } from "react";
import { Camera, Upload, RotateCw, Check, ArrowLeft, ScanFace } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/primitives/Button";
import { cn } from "@/lib/utils";

type Step = "onboarding" | "camera" | "preview";

export function VirtualTryOn() {
  const [step, setStep] = useState<Step>("onboarding");
  const [image, setImage] = useState<string | null>(null);
  const [selectedFrame, setSelectedFrame] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const frames = [
    { name: "Noir Line Titanium", color: "#111111" },
    { name: "Rose Gold Aviator", color: "#B76E79" },
    { name: "Verde Artisan", color: "#2E8B57" },
    { name: "Classic Round", color: "#8B4513" },
  ];

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setStep("camera");
    } catch {
      setStep("preview");
      setImage("https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&h=800&fit=crop");
    }
  }, []);

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(videoRef.current, 0, 0);
      setImage(canvas.toDataURL("image/jpeg"));
      stopCamera();
      setStep("preview");
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target?.result as string);
        setStep("preview");
      };
      reader.readAsDataURL(file);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const retry = () => {
    setImage(null);
    setStep("onboarding");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <AnimatePresence mode="wait">
        {step === "onboarding" && (
          <motion.div key="onboarding" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[color:var(--color-surface-muted)]">
                <ScanFace className="h-10 w-10 text-[color:var(--color-accent-teal)]" />
              </div>
              <h1 className="mt-6 font-display text-3xl text-[color:var(--color-text-primary)] md:text-5xl">Virtual Try-On</h1>
              <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[color:var(--color-text-secondary)]">
                See how any frame looks on your face instantly. Choose your preferred method below.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  icon: Camera,
                  title: "Use Camera",
                  description: "Real-time face tracking with instant frame preview.",
                  action: startCamera,
                },
                {
                  icon: Upload,
                  title: "Upload Photo",
                  description: "Upload a clear front-facing photo to try frames.",
                  action: () => document.getElementById("photo-upload")?.click(),
                },
              ].map((option) => (
                <button
                  key={option.title}
                  type="button"
                  onClick={option.action}
                  className="group rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 text-left transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[color:var(--color-surface-muted)] text-[color:var(--color-accent-teal)] transition-colors group-hover:bg-[color:var(--color-accent-teal)] group-hover:text-white">
                    <option.icon className="h-8 w-8" />
                  </div>
                  <h3 className="mt-4 font-display text-2xl text-[color:var(--color-text-primary)]">{option.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--color-text-secondary)]">{option.description}</p>
                </button>
              ))}
            </div>
            <input id="photo-upload" type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          </motion.div>
        )}

        {step === "camera" && (
          <motion.div key="camera" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="relative mx-auto max-w-lg overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-black">
              <video ref={videoRef} autoPlay playsInline muted className="h-full w-full" />
            </div>
            <div className="flex justify-center gap-4">
              <Button variant="primary" onClick={captureImage} iconLeft={<Camera className="h-4 w-4" />}>Capture</Button>
              <Button variant="outline" onClick={retry} iconLeft={<ArrowLeft className="h-4 w-4" />}>Back</Button>
            </div>
          </motion.div>
        )}

        {step === "preview" && image && (
          <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="relative overflow-hidden rounded-3xl border border-[color:var(--color-border)]">
                <img src={image} alt="Your photo" className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="h-32 w-48 rounded-full border-2 border-dashed border-white/40"
                    style={{ borderColor: frames[selectedFrame].color, transform: "translateY(-10%)" }}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--color-text-tertiary)]">Select Frame</p>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {frames.map((frame, i) => (
                      <button
                        key={frame.name}
                        type="button"
                        onClick={() => setSelectedFrame(i)}
                        className={cn(
                          "rounded-2xl border-2 p-4 text-left transition-all",
                          selectedFrame === i
                            ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-surface-muted)]"
                            : "border-[color:var(--color-border)] hover:border-[color:var(--color-border-strong)]",
                        )}
                      >
                        <span className="block h-4 w-8 rounded" style={{ backgroundColor: frame.color }} />
                        <p className="mt-2 text-xs font-medium text-[color:var(--color-text-primary)]">{frame.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="primary" iconLeft={<Check className="h-4 w-4" />} className="flex-1">Looks Great!</Button>
                  <Button variant="outline" iconLeft={<RotateCw className="h-4 w-4" />} onClick={retry}>Retry</Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
