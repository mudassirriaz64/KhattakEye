# Fix Virtual Try-On Camera & Face Detection

## Problem
Camera stops working because `useFaceDetection.ts` uses static imports for TFJS (`@tensorflow/tfjs-core`, `@tensorflow/tfjs-backend-webgl`). When TFJS fails to load (big bundle, WebGL issue), the **entire component fails to mount** — camera never starts.

## Required Changes

### 1. `src/hooks/useFaceDetection.ts` — Dynamic imports

Replace static imports with `import()` inside `init()`:

**Remove these (lines 2-4):**
```ts
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
```

**Keep only:**
```ts
import type { Keypoint, FaceLandmarksDetector } from "@tensorflow-models/face-landmarks-detection";
```

**Inside `init()` function, replace:**
```ts
await tf.ready();
const detector = await faceLandmarksDetection.createDetector(
```
**with:**
```ts
const tf = await import("@tensorflow/tfjs-core");
await import("@tensorflow/tfjs-backend-webgl");
const faceLandmarksDetection = await import("@tensorflow-models/face-landmarks-detection");
await tf.ready();
const detector = await faceLandmarksDetection.createDetector(
```

### 2. `src/components/tryon/VirtualTryOn.tsx` — Fix capture bug + fallback

**Fix 2a: Capture canvas overwrite (lines ~159-178)**

Current code overwrites the composited canvas with raw video:
```ts
const compUrl = rawCanvas.toDataURL("image/png");
rawCanvas.getContext("2d")!.drawImage(video, 0, 0);  // BUG: overwrites!
const rawUrl = rawCanvas.toDataURL("image/jpeg");
```

**Fix:** Use separate canvases for raw and composited:
```ts
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
  compCtx.drawImage(gCanvas, -pose.width / 2, -pose.height / 2, pose.width, pose.height);
  compCtx.restore();
}

const compUrl = compCanvas.toDataURL("image/png");

const rawCanvas = document.createElement("canvas");
rawCanvas.width = vw;
rawCanvas.height = vh;
rawCanvas.getContext("2d")!.drawImage(video, 0, 0);
const rawUrl = rawCanvas.toDataURL("image/jpeg");
```

**Fix 2b: Show face detection error state**

In the live step, show an error message if face detection failed but camera is running:
```tsx
{faceDetectionError && (
  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
    <p className="rounded-full bg-amber-500/70 px-4 py-1.5 text-xs text-white backdrop-blur">
      Face detection unavailable — position glasses manually
    </p>
  </div>
)}
```

**Fix 2c: Import `error as faceDetectionError` from useFaceDetection**
```tsx
const {
  detected,
  keypoints,
  error: faceDetectionError,
  startDetection,
  stopDetection,
} = useFaceDetection();
```

### 3. Test procedure

1. `npm run dev` — start dev server
2. Open `/virtual-try-on` in browser
3. Click "Use Camera" — camera should start immediately (even before face detection loads)
4. If face detection works, glasses appear on face in real-time
5. Click "Capture" — composited image with glasses saved
6. Click "Upload Photo" — upload flow still works
