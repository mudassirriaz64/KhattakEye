import { useRef, useState, useCallback, useEffect } from "react";
import type { Keypoint, FaceLandmarksDetector } from "@tensorflow-models/face-landmarks-detection";

export function useFaceDetection() {
  const [detected, setDetected] = useState(false);
  const [keypoints, setKeypoints] = useState<Keypoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const detectorRef = useRef<FaceLandmarksDetector | null>(null);
  const animFrameRef = useRef<number>(0);
  const lastDetectTime = useRef(0);

  useEffect(() => {
    let disposed = false;

    async function init() {
      try {
        const tf = await import("@tensorflow/tfjs-core");
        await import("@tensorflow/tfjs-backend-webgl");
        const faceLandmarksDetection = await import(
          "@tensorflow-models/face-landmarks-detection"
        );

        await tf.ready();
        const detector = await faceLandmarksDetection.createDetector(
          faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
          {
            runtime: "tfjs" as const,
            refineLandmarks: false,
            maxFaces: 1,
          },
        );
        if (!disposed) {
          detectorRef.current = detector;
          setLoading(false);
        }
      } catch (e) {
        if (!disposed) {
          setError(`Face detection model failed to load: ${e instanceof Error ? e.message : "unknown"}`);
          setLoading(false);
        }
      }
    }

    init();

    return () => {
      disposed = true;
      cancelAnimationFrame(animFrameRef.current);
      detectorRef.current?.dispose();
    };
  }, []);

  const detectLoop = useCallback(async (video: HTMLVideoElement) => {
    const detector = detectorRef.current;
    if (!detector || video.readyState < 2) {
      animFrameRef.current = requestAnimationFrame(() => detectLoop(video));
      return;
    }

    const now = performance.now();
    if (now - lastDetectTime.current < 50) {
      animFrameRef.current = requestAnimationFrame(() => detectLoop(video));
      return;
    }
    lastDetectTime.current = now;

    try {
      const faces = await detector.estimateFaces(video, {
        flipHorizontal: false,
        staticImageMode: false,
      });
      if (faces.length > 0) {
        setDetected(true);
        setKeypoints(faces[0].keypoints);
      } else {
        setDetected(false);
        setKeypoints([]);
      }
    } catch {
      // silent
    }

    animFrameRef.current = requestAnimationFrame(() => detectLoop(video));
  }, []);

  const startDetection = useCallback(
    (video: HTMLVideoElement) => {
      animFrameRef.current = requestAnimationFrame(() => detectLoop(video));
    },
    [detectLoop],
  );

  const stopDetection = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
  }, []);

  return { detected, keypoints, loading, error, startDetection, stopDetection };
}
