import { Camera, ImagePlus, RotateCw, Square, X } from "lucide-react";
import { useEffect, useRef, useState, type MutableRefObject } from "react";
import { createBoardImageElement, prepareBoardImage, type PreparedBoardImage } from "./boardImageImport";
import type { BoardImageElement } from "./types";

export default function BoardImageImportDialog({ open, onClose, onInsert }: { open: boolean; onClose: () => void; onInsert: (image: BoardImageElement) => void }) {
  const [prepared, setPrepared] = useState<PreparedBoardImage | null>(null);
  const [source, setSource] = useState<BoardImageElement["source"]>("upload");
  const [rotation, setRotation] = useState(0);
  const [message, setMessage] = useState("Images stay local until you explicitly insert them.");
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => {
    abortRef.current?.abort();
    stopCamera(streamRef);
  }, []);
  if (!open) return null;

  async function loadFile(file?: File, nextSource: BoardImageElement["source"] = "upload") {
    if (!file) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setMessage("Preparing image locally…");
    try {
      setPrepared(await prepareBoardImage(file, controller.signal));
      setSource(nextSource);
      setMessage("Review the preview and detected reading regions before inserting.");
    } catch (error) {
      setMessage(imageErrorMessage(error));
    }
  }

  async function startCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setMessage("Camera unavailable in this browser. Upload an image instead.");
      return;
    }
    setMessage("Requesting camera permission only for this preview.");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      streamRef.current = stream;
      setCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setMessage("Camera preview is local. Capture only when ready.");
    } catch {
      setMessage("Camera permission was denied or no camera is available.");
    }
  }

  async function capture() {
    const video = videoRef.current;
    if (!video?.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
    if (blob) await loadFile(new File([blob], "camera-capture.jpg", { type: "image/jpeg" }), "camera");
    stopCamera(streamRef);
    setCameraActive(false);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true" aria-label="Import image or use camera">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-4 shadow-2xl dark:bg-slate-900">
        <div className="flex items-start justify-between gap-3">
          <div><h2 className="font-bold">Image and camera import</h2><p className="text-sm text-slate-500">Nothing is uploaded. Imported text is treated as untrusted content.</p></div>
          <button type="button" className="tool-button" onClick={() => { stopCamera(streamRef); onClose(); }} aria-label="Close image import"><X className="h-4 w-4" /></button>
        </div>
        <div
          className="mt-4 rounded-xl border-2 border-dashed border-slate-300 p-4 text-center dark:border-white/20"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            void loadFile(event.dataTransfer.files[0]);
          }}
        >
          <div className="flex flex-wrap justify-center gap-2">
            <label className="tool-button cursor-pointer"><ImagePlus className="h-4 w-4" />Upload or screenshot<input className="hidden" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => void loadFile(event.target.files?.[0])} /></label>
            {!cameraActive
              ? <button type="button" className="tool-button" onClick={() => void startCamera()}><Camera className="h-4 w-4" />Use camera</button>
              : <button type="button" className="action-primary" onClick={() => void capture()}><Camera className="h-4 w-4" />Capture</button>}
            {cameraActive && <button type="button" className="tool-button" onClick={() => { stopCamera(streamRef); setCameraActive(false); }}><Square className="h-4 w-4" />Stop camera</button>}
          </div>
          <p className="mt-2 text-xs text-slate-500">PNG, JPEG or WebP · maximum 8 MB · drag and drop supported</p>
        </div>
        {cameraActive && <video ref={videoRef} className="mt-3 max-h-80 w-full rounded-xl bg-slate-950 object-contain" playsInline muted aria-label="Local camera preview" />}
        {prepared && (
          <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_240px]">
            <div className="relative overflow-hidden rounded-xl bg-slate-100 p-2 dark:bg-white/5">
              <img src={prepared.dataUrl} alt={`Imported worksheet preview with ${prepared.regions.length} detected regions`} className="max-h-96 w-full object-contain" style={{ transform: `rotate(${rotation}deg)` }} />
            </div>
            <div className="space-y-3">
              <p className="text-sm"><strong>{prepared.regions.length}</strong> reading region{prepared.regions.length === 1 ? "" : "s"} detected from horizontal ink bands.</p>
              <button type="button" className="tool-button" onClick={() => setRotation((value) => (value + 90) % 360)}><RotateCw className="h-4 w-4" />Rotate 90°</button>
              <p className="text-xs text-slate-500">A production vision provider is not configured. Regions are preserved for review; enter or correct their LaTeX after insertion.</p>
              <button type="button" className="action-primary" onClick={() => {
                onInsert(createBoardImageElement(prepared, source, { x: 80, y: 80, width: 420, height: Math.max(180, 420 * prepared.height / prepared.width) }, rotation));
                onClose();
              }}>Insert image and regions</button>
            </div>
          </div>
        )}
        <p className="mt-3 text-sm" aria-live="polite">{message}</p>
      </div>
    </div>
  );
}

function stopCamera(ref: MutableRefObject<MediaStream | null>) {
  ref.current?.getTracks().forEach((track) => track.stop());
  ref.current = null;
}

function imageErrorMessage(error: unknown) {
  const code = error instanceof Error ? error.message : String(error);
  if (code === "UNSUPPORTED_IMAGE") return "Use a PNG, JPEG, or WebP image.";
  if (code === "IMAGE_TOO_LARGE") return "The image is empty or exceeds 8 MB.";
  if ((error as Error)?.name === "AbortError") return "Image preparation cancelled.";
  return "The image could not be prepared locally.";
}
