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

function sampleBorderColor(
  data: Uint8ClampedArray,
  w: number,
  h: number,
): { r: number; g: number; b: number; variance: number; isTransparentBorder: boolean } {
  const samples: number[][] = [];
  const border = Math.max(1, Math.min(3, Math.floor(Math.min(w, h) * 0.02)));
  let alphaCount = 0;
  let alphaTotal = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const onBorder = x < border || x >= w - border || y < border || y >= h - border;
      if (!onBorder) continue;
      const idx = (y * w + x) * 4;
      const a = data[idx + 3];
      alphaTotal += a;
      if (a < 125) alphaCount++;
      if (a > 250) {
        samples.push([data[idx], data[idx + 1], data[idx + 2]]);
      }
    }
  }
  const totalPixels = Math.max(1, 2 * border * (w + h) - 4 * border * border);
  const isTransparentBorder = alphaCount / totalPixels > 0.3;
  if (samples.length === 0) {
    return { r: 255, g: 255, b: 255, variance: 0, isTransparentBorder };
  }
  let rSum = 0, gSum = 0, bSum = 0;
  for (const s of samples) {
    rSum += s[0]; gSum += s[1]; bSum += s[2];
  }
  const n = samples.length;
  const rMean = rSum / n, gMean = gSum / n, bMean = bSum / n;
  let v = 0;
  for (const s of samples) {
    v += (s[0] - rMean) ** 2 + (s[1] - gMean) ** 2 + (s[2] - bMean) ** 2;
  }
  return { r: rMean, g: gMean, b: bMean, variance: v / n, isTransparentBorder };
}

function applySoftFeather(
  data: Uint8ClampedArray,
  w: number,
  h: number,
  radius = 1,
) {
  const copy = new Uint8ClampedArray(data);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const currentAlpha = data[idx + 3];
      if (currentAlpha === 0 || currentAlpha === 255) continue;
      let sum = 0, count = 0;
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
          sum += copy[(ny * w + nx) * 4 + 3];
          count++;
        }
      }
      data[idx + 3] = count > 0 ? Math.round(sum / count) : currentAlpha;
    }
  }
}

export function removeBackground(
  img: HTMLImageElement,
  tolerance = 90,
): HTMLCanvasElement {
  const canvas = imageToCanvas(img);
  const ctx = canvas.getContext("2d")!;

  try {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const w = canvas.width;
    const h = canvas.height;

    const bgSample = sampleBorderColor(data, w, h);

    if (!bgSample.isTransparentBorder) {
      const bgR = bgSample.r, bgG = bgSample.g, bgB = bgSample.b;
      const bgBrightness = (bgR + bgG + bgB) / 3;
      const variance = bgSample.variance;
      const adaptiveTol = variance < 200
        ? Math.max(55, tolerance - 15)
        : variance > 1500
          ? Math.min(140, tolerance + 30)
          : tolerance;

      const bgIsLight = bgBrightness > 210;
      const bgIsWhite = bgR > 220 && bgG > 215 && bgB > 208;
      const bgSaturation = Math.max(bgR, bgG, bgB) - Math.min(bgR, bgG, bgB);

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const alpha = data[i + 3];
        if (alpha === 0) continue;

        const dist = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);

        if (bgIsWhite && r > 215 && g > 210 && b > 202) {
          const closeness = Math.min(1, (r - 210) / 40) * Math.min(1, (g - 208) / 40) * Math.min(1, (b - 200) / 40);
          if (closeness > 0.2) {
            data[i + 3] = Math.max(0, Math.round(alpha * (1 - closeness)));
            continue;
          }
        }

        if (bgIsLight && bgSaturation < 30) {
          const pxLum = (r + g + b) / 3;
          if (pxLum > bgBrightness - 25 && Math.abs(r - g) < 22 && Math.abs(g - b) < 22 && Math.abs(r - b) < 22) {
            const near = Math.max(0, (pxLum - (bgBrightness - 25)) / 55);
            data[i + 3] = Math.max(0, Math.round(alpha * (1 - near * 0.9)));
            continue;
          }
        }

        if (dist < adaptiveTol * 0.65) {
          data[i + 3] = 0;
        } else if (dist < adaptiveTol) {
          const t = (dist - adaptiveTol * 0.65) / (adaptiveTol * 0.35);
          data[i + 3] = Math.max(0, Math.round(alpha * t));
        }
      }

      applySoftFeather(data, w, h, 1);
    }

    ctx.putImageData(imageData, 0, 0);

    let minX = w, minY = h, maxX = 0, maxY = 0;
    let hasPixels = false;
    const alphaThreshold = 35;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const alpha = data[(y * w + x) * 4 + 3];
        if (alpha > alphaThreshold) {
          hasPixels = true;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    if (hasPixels && maxX > minX && maxY > minY) {
      const padX = Math.max(2, Math.round((maxX - minX) * 0.03));
      const padY = Math.max(2, Math.round((maxY - minY) * 0.05));
      minX = Math.max(0, minX - padX);
      maxX = Math.min(w - 1, maxX + padX);
      minY = Math.max(0, minY - padY);
      maxY = Math.min(h - 1, maxY + padY);

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
