import type { Keypoint } from "@tensorflow-models/face-landmarks-detection";

export interface GlassesPose {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

const LANDMARKS = {
  LEFT_EYE_OUTER: 33,
  LEFT_EYE_INNER: 133,
  RIGHT_EYE_INNER: 362,
  RIGHT_EYE_OUTER: 263,
  NOSE_BRIDGE_TOP: 168,
};

export function computeGlassesPose(
  keypoints: Keypoint[] | null,
): GlassesPose | null {
  if (!keypoints || keypoints.length < 468) return null;

  const get = (idx: number) => keypoints[idx];

  const leo = get(LANDMARKS.LEFT_EYE_OUTER);
  const lei = get(LANDMARKS.LEFT_EYE_INNER);
  const rei = get(LANDMARKS.RIGHT_EYE_INNER);
  const reo = get(LANDMARKS.RIGHT_EYE_OUTER);
  const nb = get(LANDMARKS.NOSE_BRIDGE_TOP);

  if (!leo || !lei || !rei || !reo || !nb) return null;

  const cx = (leo.x + lei.x + rei.x + reo.x) / 4;
  const eyeY = (leo.y + lei.y + rei.y + reo.y) / 4;
  const cy = (eyeY + nb.y) / 2;

  const eyeDistance = Math.sqrt(
    (reo.x - leo.x) ** 2 + (reo.y - leo.y) ** 2,
  );
  const width = eyeDistance * 1.3;
  const height = width * 0.45;
  const rotation = Math.atan2(reo.y - leo.y, reo.x - leo.x);

  return { x: cx, y: cy, width, height, rotation };
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => {
      // Retry without crossOrigin if CORS fails
      const fallbackImg = new Image();
      fallbackImg.onload = () => resolve(fallbackImg);
      fallbackImg.onerror = () => resolve(img);
      fallbackImg.src = src;
    };
    img.crossOrigin = "anonymous";
    img.src = src;
  });
}

export function imageToCanvas(img: HTMLImageElement): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth || 300;
  canvas.height = img.naturalHeight || 120;
  canvas.getContext("2d")!.drawImage(img, 0, 0);
  return canvas;
}

export function removeBackground(
  img: HTMLImageElement,
  tolerance = 80,
): HTMLCanvasElement {
  const canvas = imageToCanvas(img);
  const ctx = canvas.getContext("2d")!;

  try {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const w = canvas.width;
    const h = canvas.height;

    const corners = [
      [0, 0],
      [w - 1, 0],
      [0, h - 1],
      [w - 1, h - 1],
    ];

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Remove all white, off-white, light grey, and cream studio backgrounds
      if (r > 210 && g > 205 && b > 200) {
        data[i + 3] = 0;
        continue;
      }

      // Check distance from corner background samples
      for (const [cx, cy] of corners) {
        const cIdx = (cy * w + cx) * 4;
        const bgR = data[cIdx];
        const bgG = data[cIdx + 1];
        const bgB = data[cIdx + 2];
        const dist = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);
        if (dist < tolerance) {
          data[i + 3] = 0;
          break;
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);

    // Tight bounding box crop around frame pixels only
    let minX = w, minY = h, maxX = 0, maxY = 0;
    let hasPixels = false;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const alpha = data[(y * w + x) * 4 + 3];
        if (alpha > 30) {
          hasPixels = true;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    if (hasPixels && maxX > minX && maxY > minY) {
      const cropW = maxX - minX + 1;
      const cropH = maxY - minY + 1;
      const croppedCanvas = document.createElement("canvas");
      croppedCanvas.width = cropW;
      croppedCanvas.height = cropH;
      const croppedCtx = croppedCanvas.getContext("2d")!;
      croppedCtx.drawImage(canvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);
      return croppedCanvas;
    }
  } catch {
    // CORS tainted canvas fallback
  }

  return canvas;
}

export async function processGlassesImage(src: string): Promise<HTMLCanvasElement> {
  const img = await loadImage(src);
  return removeBackground(img);
}
