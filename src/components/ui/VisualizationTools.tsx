import { useEffect, useMemo, useRef, useState } from "react";
import { Download, Eraser, Expand, FileText, Grid2X2, Link2, Pencil, SkipForward, Trash2, Type } from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { clsx } from "clsx";

type Point = { x: number; y: number };
type StrokeAnnotation = { id: string; kind: "stroke"; points: Point[]; color: string; size: number };
type TextAnnotation = { id: string; kind: "text"; x: number; y: number; text: string; color: string };
type Annotation = StrokeAnnotation | TextAnnotation;
type AnnotationMode = "draw" | "text" | "erase";

type VisualizationToolsProps = {
  title: string;
  targetRef: React.RefObject<HTMLElement>;
  children: React.ReactNode;
};

export default function VisualizationTools({ title, targetRef, children }: VisualizationToolsProps) {
  const storageKey = useMemo(() => annotationStorageKey(title), [title]);
  const [mode, setMode] = useState<AnnotationMode>("draw");
  const [annotations, setAnnotations] = useState<Annotation[]>(() => loadAnnotations(storageKey));
  const [copied, setCopied] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [trace, setTrace] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [step, setStep] = useState(0);
  const [xZoom, setXZoom] = useState(1);
  const [yZoom, setYZoom] = useState(1);

  useEffect(() => {
    setAnnotations(loadAnnotations(storageKey));
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(annotations));
  }, [annotations, storageKey]);

  async function copyShareLink() {
    const href = window.location.href;
    try {
      await navigator.clipboard.writeText(href);
    } catch {
      window.prompt("Copy this visualization link", href);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  async function exportSheet(format: "png" | "pdf") {
    if (!targetRef.current) return;

    const sheet = buildPrintableSheet(targetRef.current, title);
    document.body.appendChild(sheet);

    try {
      const canvas = await html2canvas(sheet, {
        backgroundColor: "#ffffff",
        scale: Math.min(window.devicePixelRatio || 1, 2),
        useCORS: true,
      });

      if (format === "png") {
        const link = document.createElement("a");
        link.download = `${fileName(title)}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        return;
      }

      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 36;
      const imageWidth = pageWidth - margin * 2;
      const imageHeight = (canvas.height * imageWidth) / canvas.width;
      const y = margin;

      if (imageHeight <= pageHeight - margin * 2) {
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", margin, y, imageWidth, imageHeight);
      } else {
        const pageCanvas = document.createElement("canvas");
        const ctx = pageCanvas.getContext("2d");
        if (!ctx) return;

        const sourcePageHeight = Math.floor((pageHeight - margin * 2) * (canvas.width / imageWidth));
        pageCanvas.width = canvas.width;
        pageCanvas.height = sourcePageHeight;

        for (let sourceY = 0; sourceY < canvas.height; sourceY += sourcePageHeight) {
          if (sourceY > 0) pdf.addPage();
          ctx.clearRect(0, 0, pageCanvas.width, pageCanvas.height);
          ctx.drawImage(canvas, 0, sourceY, canvas.width, sourcePageHeight, 0, 0, canvas.width, sourcePageHeight);
          pdf.addImage(pageCanvas.toDataURL("image/png"), "PNG", margin, y, imageWidth, pageHeight - margin * 2);
        }
      }

      pdf.save(`${fileName(title)}.pdf`);
    } finally {
      sheet.remove();
    }
  }

  async function openFullscreen() {
    if (!targetRef.current) return;
    if (document.fullscreenElement) await document.exitFullscreen();
    else await targetRef.current.requestFullscreen?.();
  }

  return (
    <div className="space-y-3">
      <div className="visualization-tools flex flex-wrap items-center gap-2">
        <button className="tool-button" type="button" onClick={copyShareLink} title="Copy shareable link">
          <Link2 className="h-4 w-4" />
          <span>{copied ? "Copied" : "Share"}</span>
        </button>
        <button className="tool-button" type="button" onClick={() => void exportSheet("png")} title="Export PNG sheet">
          <Download className="h-4 w-4" />
          <span>PNG</span>
        </button>
        <button className="tool-button" type="button" onClick={() => void exportSheet("pdf")} title="Export PDF sheet">
          <FileText className="h-4 w-4" />
          <span>PDF</span>
        </button>
        <button className="tool-button" type="button" onClick={() => void openFullscreen()} title="Use browser full-screen mode">
          <Expand className="h-4 w-4" />
          <span>Full</span>
        </button>
        <button className={showGrid ? "tool-button bg-cyan-50 text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-100" : "tool-button"} type="button" onClick={() => setShowGrid((value) => !value)} title="Show or hide coordinate grid">
          <Grid2X2 className="h-4 w-4" />
          <span>Grid</span>
        </button>
        <button className={trace ? "tool-button bg-cyan-50 text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-100" : "tool-button"} type="button" onClick={() => setTrace((value) => !value)} title="Keep a faint ghost trail while parameters change">
          <span>Trace</span>
        </button>
        <label className="flex min-h-10 items-center gap-2 rounded-full border border-slate-200 bg-white/85 px-3 py-2 text-xs font-black dark:border-white/10 dark:bg-white/10">
          {speed.toFixed(2)}x
          <input className="w-24 accent-cyan-500" type="range" min={0.25} max={2} step={0.25} value={speed} onChange={(event) => setSpeed(Number(event.target.value))} />
        </label>
        <label className="flex min-h-10 items-center gap-2 rounded-full border border-slate-200 bg-white/85 px-3 py-2 text-xs font-black dark:border-white/10 dark:bg-white/10">
          X {xZoom.toFixed(1)}
          <input className="w-20 accent-cyan-500" type="range" min={0.5} max={3} step={0.1} value={xZoom} onChange={(event) => setXZoom(Number(event.target.value))} />
        </label>
        <label className="flex min-h-10 items-center gap-2 rounded-full border border-slate-200 bg-white/85 px-3 py-2 text-xs font-black dark:border-white/10 dark:bg-white/10">
          Y {yZoom.toFixed(1)}
          <input className="w-20 accent-cyan-500" type="range" min={0.5} max={3} step={0.1} value={yZoom} onChange={(event) => setYZoom(Number(event.target.value))} />
        </label>
        <button className="tool-button" type="button" onClick={() => setStep((value) => value + 1)} title="Advance one explanatory step">
          <SkipForward className="h-4 w-4" />
          Step {step}
        </button>
        <div className="ml-0 flex items-center gap-1 rounded-full border border-slate-200 bg-white/80 p-1 dark:border-white/10 dark:bg-white/10 sm:ml-2">
          <ModeButton active={mode === "draw"} title="Draw notes" onClick={() => setMode("draw")}>
            <Pencil className="h-4 w-4" />
          </ModeButton>
          <ModeButton active={mode === "text"} title="Add text label" onClick={() => setMode("text")}>
            <Type className="h-4 w-4" />
          </ModeButton>
          <ModeButton active={mode === "erase"} title="Erase annotation" onClick={() => setMode("erase")}>
            <Eraser className="h-4 w-4" />
          </ModeButton>
        </div>
        <button className="tool-button" type="button" onClick={() => setAnnotations([])} title="Clear saved annotations">
          <Trash2 className="h-4 w-4" />
          <span>Clear</span>
        </button>
      </div>
      <div className="relative" data-visualizer-speed={speed} data-step={step} data-x-zoom={xZoom} data-y-zoom={yZoom}>
        <div style={{ transform: `scale(${xZoom}, ${yZoom})`, transformOrigin: "center" }}>
          {children}
        </div>
        {showGrid && <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-40 [background-image:linear-gradient(rgba(14,165,233,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,.18)_1px,transparent_1px)] [background-size:32px_32px]" />}
        {trace && <div className="pointer-events-none absolute inset-0 rounded-2xl bg-cyan-400/5 ring-4 ring-inset ring-cyan-400/10" />}
        <CrosshairHud />
        <AnnotationLayer mode={mode} annotations={annotations} onChange={setAnnotations} />
      </div>
    </div>
  );
}

function CrosshairHud() {
  const [point, setPoint] = useState<Point | null>(null);
  return (
    <div
      className="absolute inset-0 z-[9] cursor-crosshair rounded-2xl"
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setPoint({ x: (event.clientX - rect.left) / rect.width, y: (event.clientY - rect.top) / rect.height });
      }}
      onPointerLeave={() => setPoint(null)}
    >
      {point && (
        <>
          <div className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white dark:bg-white dark:text-slate-950">x {point.x.toFixed(3)} · y {(1 - point.y).toFixed(3)}</div>
          <div className="pointer-events-none absolute top-0 h-full w-px bg-cyan-400/70" style={{ left: `${point.x * 100}%` }} />
          <div className="pointer-events-none absolute left-0 h-px w-full bg-cyan-400/70" style={{ top: `${point.y * 100}%` }} />
        </>
      )}
    </div>
  );
}

function ModeButton({ active, title, onClick, children }: { active: boolean; title: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      className={clsx(
        "tooltip-icon inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition hover:bg-cyan-100 hover:text-cyan-700 dark:text-slate-200 dark:hover:bg-cyan-400/15 dark:hover:text-cyan-100",
        active && "bg-cyan-600 text-white hover:bg-cyan-600 hover:text-white dark:bg-cyan-400 dark:text-slate-950",
      )}
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      data-tooltip={title}
    >
      {children}
    </button>
  );
}

function AnnotationLayer({ mode, annotations, onChange }: { mode: AnnotationMode; annotations: Annotation[]; onChange: (annotations: Annotation[]) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeStroke, setActiveStroke] = useState<StrokeAnnotation | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(rect.width * ratio));
      canvas.height = Math.max(1, Math.floor(rect.height * ratio));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      renderAnnotations(canvas, annotations, activeStroke);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(parent);
    return () => observer.disconnect();
  }, [activeStroke, annotations]);

  useEffect(() => {
    if (canvasRef.current) renderAnnotations(canvasRef.current, annotations, activeStroke);
  }, [activeStroke, annotations]);

  function pointerPoint(event: React.PointerEvent<HTMLCanvasElement>): Point {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
    };
  }

  function begin(event: React.PointerEvent<HTMLCanvasElement>) {
    const point = pointerPoint(event);

    if (mode === "text") {
      const text = window.prompt("Text label");
      if (text?.trim()) {
        onChange([...annotations, { id: randomId(), kind: "text", x: point.x, y: point.y, text: text.trim(), color: "#0e7490" }]);
      }
      return;
    }

    if (mode === "erase") {
      onChange(annotations.filter((annotation) => !isNear(annotation, point)));
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    setActiveStroke({ id: randomId(), kind: "stroke", points: [point], color: "#0891b2", size: 3 });
  }

  function move(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!activeStroke || mode !== "draw") return;
    setActiveStroke({ ...activeStroke, points: [...activeStroke.points, pointerPoint(event)] });
  }

  function end() {
    if (!activeStroke) return;
    if (activeStroke.points.length > 1) onChange([...annotations, activeStroke]);
    setActiveStroke(null);
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-10 cursor-crosshair touch-none rounded-2xl"
      onPointerDown={begin}
      onPointerMove={move}
      onPointerUp={end}
      onPointerCancel={end}
      aria-label="Annotation layer"
    />
  );
}

function renderAnnotations(canvas: HTMLCanvasElement, annotations: Annotation[], activeStroke: StrokeAnnotation | null) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  [...annotations, ...(activeStroke ? [activeStroke] : [])].forEach((annotation) => {
    if (annotation.kind === "text") {
      ctx.fillStyle = annotation.color;
      ctx.font = `${Math.max(14, canvas.width * 0.018)}px Inter, Segoe UI, sans-serif`;
      ctx.fillText(annotation.text, annotation.x * canvas.width, annotation.y * canvas.height);
      return;
    }

    if (annotation.points.length < 2) return;
    ctx.strokeStyle = annotation.color;
    ctx.lineWidth = annotation.size * (window.devicePixelRatio || 1);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    annotation.points.forEach((point, index) => {
      const x = point.x * canvas.width;
      const y = point.y * canvas.height;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  });
}

function isNear(annotation: Annotation, point: Point) {
  if (annotation.kind === "text") {
    return Math.hypot(annotation.x - point.x, annotation.y - point.y) < 0.05;
  }

  return annotation.points.some((strokePoint) => Math.hypot(strokePoint.x - point.x, strokePoint.y - point.y) < 0.035);
}

function loadAnnotations(storageKey: string): Annotation[] {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as Annotation[]) : [];
  } catch {
    return [];
  }
}

function annotationStorageKey(title: string) {
  const path = typeof window === "undefined" ? "visualization" : window.location.pathname;
  return `math-universe-annotations:${path}:${title}`;
}

function buildPrintableSheet(target: HTMLElement, title: string) {
  const sheet = document.createElement("div");
  sheet.style.position = "fixed";
  sheet.style.left = "-10000px";
  sheet.style.top = "0";
  sheet.style.width = "900px";
  sheet.style.background = "#ffffff";
  sheet.style.color = "#0f172a";
  sheet.style.padding = "32px";
  sheet.style.fontFamily = "Inter, Segoe UI, Arial, sans-serif";

  const heading = document.createElement("h1");
  heading.textContent = title;
  heading.style.fontSize = "28px";
  heading.style.margin = "0 0 20px";
  sheet.appendChild(heading);

  const clone = target.cloneNode(true) as HTMLElement;
  copyCanvasBitmaps(target, clone);
  clone.querySelectorAll(".visualization-tools").forEach((element) => element.remove());
  sheet.appendChild(clone);

  const formulas = Array.from(document.querySelectorAll<HTMLElement>("[data-formula-block]"));
  if (formulas.length) {
    const formulaHeading = document.createElement("h2");
    formulaHeading.textContent = "Formula Panel";
    formulaHeading.style.fontSize = "20px";
    formulaHeading.style.margin = "28px 0 12px";
    sheet.appendChild(formulaHeading);
    formulas.slice(0, 4).forEach((formula) => {
      const formulaClone = formula.cloneNode(true) as HTMLElement;
      formulaClone.style.margin = "0 0 12px";
      sheet.appendChild(formulaClone);
    });
  }

  return sheet;
}

function fileName(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "visualization";
}

function copyCanvasBitmaps(source: HTMLElement, clone: HTMLElement) {
  const sourceCanvases = Array.from(source.querySelectorAll("canvas"));
  const clonedCanvases = Array.from(clone.querySelectorAll("canvas"));

  sourceCanvases.forEach((sourceCanvas, index) => {
    const clonedCanvas = clonedCanvases[index];
    const ctx = clonedCanvas?.getContext("2d");
    if (!clonedCanvas || !ctx) return;

    clonedCanvas.width = sourceCanvas.width;
    clonedCanvas.height = sourceCanvas.height;
    ctx.drawImage(sourceCanvas, 0, 0);
  });
}

function randomId() {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
