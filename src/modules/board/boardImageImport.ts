import type { BoardImageElement, BoardRecognitionRegion, BoundingBox } from "./types";

export const BOARD_IMAGE_MAX_BYTES = 8 * 1024 * 1024;
export const BOARD_IMAGE_MAX_DIMENSION = 1_600;
export const BOARD_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

export type PreparedBoardImage = {
  dataUrl: string;
  width: number;
  height: number;
  regions: Array<Omit<BoardRecognitionRegion, "id" | "imageElementId">>;
  fingerprint: string;
};

export function validateBoardImage(file: Pick<File, "type" | "size">) {
  if (!BOARD_IMAGE_TYPES.has(file.type)) throw new Error("UNSUPPORTED_IMAGE");
  if (file.size <= 0 || file.size > BOARD_IMAGE_MAX_BYTES) throw new Error("IMAGE_TOO_LARGE");
  return true;
}

export async function prepareBoardImage(file: File, signal?: AbortSignal): Promise<PreparedBoardImage> {
  validateBoardImage(file);
  if (signal?.aborted) throw new DOMException("Image preparation cancelled", "AbortError");
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, BOARD_IMAGE_MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) throw new Error("VISION_UNAVAILABLE");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(bitmap, 0, 0, width, height);
    const pixels = context.getImageData(0, 0, width, height);
    const regions = detectMathRegions(pixels);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.86);
    return {
      dataUrl,
      width,
      height,
      regions,
      fingerprint: await fingerprintBytes(new Uint8Array(await file.arrayBuffer())),
    };
  } finally {
    bitmap.close();
  }
}

export function detectMathRegions(image: ImageData): Array<Omit<BoardRecognitionRegion, "id" | "imageElementId">> {
  const { width, height, data } = image;
  const rowInk = new Array<number>(height).fill(0);
  const stride = Math.max(1, Math.floor(width / 600));
  for (let y = 0; y < height; y += 1) {
    let dark = 0;
    for (let x = 0; x < width; x += stride) {
      const offset = (y * width + x) * 4;
      const luminance = data[offset] * 0.2126 + data[offset + 1] * 0.7152 + data[offset + 2] * 0.0722;
      if (data[offset + 3] > 20 && luminance < 205) dark += 1;
    }
    rowInk[y] = dark;
  }
  const threshold = Math.max(2, Math.round(width / stride * 0.006));
  const minimumGap = Math.max(5, Math.round(height * 0.012));
  const bands: Array<{ start: number; end: number }> = [];
  let start = -1;
  let emptyRun = 0;
  for (let y = 0; y < height; y += 1) {
    if (rowInk[y] >= threshold) {
      if (start < 0) start = y;
      emptyRun = 0;
    } else if (start >= 0) {
      emptyRun += 1;
      if (emptyRun >= minimumGap) {
        bands.push({ start, end: y - emptyRun });
        start = -1;
        emptyRun = 0;
      }
    }
  }
  if (start >= 0) bands.push({ start, end: height - 1 });
  const meaningful = bands
    .filter((band) => band.end - band.start >= 2)
    .slice(0, 20);
  const source = meaningful.length ? meaningful : [{ start: 0, end: height - 1 }];
  return source.map((band, readingOrder) => {
    const padding = Math.max(4, Math.round(height * 0.008));
    return {
      bounds: {
        x: 0,
        y: Math.max(0, band.start - padding),
        width,
        height: Math.min(height, band.end + padding) - Math.max(0, band.start - padding),
      },
      regionType: meaningful.length > 1 ? "single-expression" : "unknown",
      readingOrder,
      selected: true,
      recognitionStatus: "idle",
    };
  });
}

export function createBoardImageElement(prepared: PreparedBoardImage, source: BoardImageElement["source"], bounds: BoundingBox, rotation = 0): BoardImageElement {
  const id = `image-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  return {
    id,
    type: "image",
    source,
    localAssetId: prepared.fingerprint,
    dataUrl: prepared.dataUrl,
    width: prepared.width,
    height: prepared.height,
    rotation,
    opacity: 1,
    locked: true,
    recognitionRegions: prepared.regions.map((region, index) => ({
      ...region,
      id: `region-${Date.now()}-${index}`,
      imageElementId: id,
    })),
    bounds,
    createdAt: new Date().toISOString(),
  };
}

export function normalizeReadingOrder(regions: BoardRecognitionRegion[]) {
  return [...regions]
    .sort((left, right) => left.bounds.y - right.bounds.y || left.bounds.x - right.bounds.x)
    .map((region, readingOrder) => ({ ...region, readingOrder }));
}

export async function fingerprintStrokes(points: Array<{ x: number; y: number; time?: number }>) {
  const normalized = points.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(";");
  return fingerprintBytes(new TextEncoder().encode(normalized));
}

async function fingerprintBytes(bytes: Uint8Array) {
  if (globalThis.crypto?.subtle) {
    const buffer = new Uint8Array(bytes).buffer;
    const digest = await globalThis.crypto.subtle.digest("SHA-256", buffer);
    return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  let hash = 2166136261;
  bytes.forEach((byte) => {
    hash ^= byte;
    hash = Math.imul(hash, 16777619);
  });
  return (hash >>> 0).toString(16);
}
