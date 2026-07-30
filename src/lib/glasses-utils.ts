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
    img.onerror = () => resolve(img);
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
  tolerance = 40,
): HTMLCanvasElement {
  const canvas = imageToCanvas(img);
  const ctx = canvas.getContext("2d")!;

  try {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const w = canvas.width;
    const h = canvas.height;
    const s = (idx: number) => data[idx];
    const bgR =
      (s(0) + s((w - 1) * 4) + s((h - 1) * w * 4) + s((h - 1) * w * 4 + (w - 1) * 4)) / 4;
    const bgG =
      (s(1) + s((w - 1) * 4 + 1) + s((h - 1) * w * 4 + 1) + s((h - 1) * w * 4 + (w - 1) * 4 + 1)) / 4;
    const bgB =
      (s(2) + s((w - 1) * 4 + 2) + s((h - 1) * w * 4 + 2) + s((h - 1) * w * 4 + (w - 1) * 4 + 2)) / 4;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const dist = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);
      if (dist < tolerance) {
        data[i + 3] = 0;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  } catch {
    // CORS tainted canvas — return raw image canvas
  }

  return canvas;
}

export async function processGlassesImage(src: string): Promise<HTMLCanvasElement> {
  const img = await loadImage(src);
  return removeBackground(img);
}
