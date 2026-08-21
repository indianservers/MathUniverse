import { downloadBlob } from "./portableWorkspace";

export type ImageExportScope = "viewport" | "entire";
export type ImageExportBackground = "transparent" | "white" | "dark";
export type ImageExportScale = 1 | 2 | 4;
export type ImageExportFormat = "png" | "jpeg";

export type WorkspaceImageOptions = {
  target: HTMLElement | SVGElement;
  filename: string;
  scope: ImageExportScope;
  background: ImageExportBackground;
  scale: ImageExportScale;
  format: ImageExportFormat;
};

export type PreparedWorkspaceImage = {
  blob: Blob;
  filename: string;
  width: number;
  height: number;
  format: ImageExportFormat;
  scale: ImageExportScale;
  background: ImageExportBackground;
  previewUrl: string;
};

export async function prepareWorkspaceImage(options: WorkspaceImageOptions): Promise<PreparedWorkspaceImage> {
  const { default: html2canvas } = await import("html2canvas");
  await yieldToBrowser();
  const target = options.target;
  const backgroundColor = options.background === "transparent" ? null : options.background === "white" ? "#ffffff" : "#07111f";
  const width = options.scope === "entire" ? Math.max(target.scrollWidth, target.getBoundingClientRect().width) : target.getBoundingClientRect().width;
  const height = options.scope === "entire" ? Math.max(target.scrollHeight, target.getBoundingClientRect().height) : target.getBoundingClientRect().height;
  if (!width || !height) throw new Error("The workspace viewport is not visible yet.");
  if (width * height * options.scale * options.scale > 120_000_000) throw new Error("The requested image is too large. Choose a smaller scale or current viewport.");
  const canvas = await html2canvas(target as HTMLElement, {
    backgroundColor,
    scale: options.scale,
    useCORS: true,
    allowTaint: false,
    logging: false,
    width: Math.ceil(width),
    height: Math.ceil(height),
    windowWidth: Math.ceil(width),
    windowHeight: Math.ceil(height),
    ignoreElements: element => element.hasAttribute("data-portable-export-exclude"),
  });
  const mime = options.format === "jpeg" ? "image/jpeg" : "image/png";
  const blob = await canvasToBlob(canvas, mime, options.format === "jpeg" ? .94 : undefined);
  canvas.width = 1;
  canvas.height = 1;
  const filename = ensureImageExtension(options.filename, options.format);
  return { blob, filename, width: Math.ceil(width * options.scale), height: Math.ceil(height * options.scale), format: options.format, scale: options.scale, background: options.background, previewUrl: URL.createObjectURL(blob) };
}

export function releasePreparedImage(image: PreparedWorkspaceImage | null) { if (image) URL.revokeObjectURL(image.previewUrl); }
export function downloadPreparedImage(image: PreparedWorkspaceImage) { downloadBlob(image.filename, image.blob); }

export async function copyPreparedImage(image: PreparedWorkspaceImage) {
  if (typeof navigator === "undefined" || !navigator.clipboard?.write || typeof ClipboardItem === "undefined") throw new Error("Copy Image is not supported by this browser. The image is ready to download.");
  const pngBlob = image.blob.type === "image/png" ? image.blob : await convertToPng(image);
  await navigator.clipboard.write([new ClipboardItem({ "image/png": pngBlob })]);
}

export async function nativeSharePreparedImage(image: PreparedWorkspaceImage, title: string) {
  if (typeof navigator === "undefined" || !navigator.share) throw new Error("Image sharing is not supported by this browser. The image has been prepared for download.");
  const file = new File([image.blob], image.filename, { type: image.blob.type });
  if (navigator.canShare && !navigator.canShare({ files: [file] })) throw new Error("File sharing is not supported by this browser. The image has been prepared for download.");
  try { await navigator.share({ title, text: `${title} from Math Universe`, files: [file] }); }
  catch (error) { if ((error as DOMException)?.name !== "AbortError") throw error; }
}

export function imageFilename(prefix: string, format: ImageExportFormat) {
  const date = new Date();
  const stamp = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}-${String(date.getHours()).padStart(2, "0")}${String(date.getMinutes()).padStart(2, "0")}`;
  return `${prefix}-${stamp}.${format === "jpeg" ? "jpg" : "png"}`;
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number) { return new Promise<Blob>((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("The browser could not encode the image.")), type, quality)); }
function ensureImageExtension(filename: string, format: ImageExportFormat) { return `${filename.replace(/\.(png|jpe?g)$/i, "")}.${format === "jpeg" ? "jpg" : "png"}`; }
function yieldToBrowser() { return new Promise<void>(resolve => requestAnimationFrame(() => window.setTimeout(resolve, 0))); }
async function convertToPng(image: PreparedWorkspaceImage) {
  const bitmap = await createImageBitmap(image.blob);
  const canvas = document.createElement("canvas"); canvas.width = bitmap.width; canvas.height = bitmap.height;
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0); bitmap.close();
  const blob = await canvasToBlob(canvas, "image/png"); canvas.width = 1; canvas.height = 1; return blob;
}
