import {
  Download,
  Expand,
  Grid3X3,
  Maximize2,
  Printer,
  RotateCcw,
  Type,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const MIN = 0.6;
const MAX = 2.4;
const STEP = 0.15;

function clampZoom(n: number) {
  return Math.min(MAX, Math.max(MIN, Math.round(n * 100) / 100));
}

function applyCanvasView(zoom: number, grid: boolean, labels: boolean, large = false) {
  const root = document.documentElement;
  root.style.setProperty("--msk-canvas-zoom", String(zoom));
  root.dataset.canvasGrid = grid ? "on" : "off";
  root.dataset.canvasLabels = labels ? (large ? "large" : "on") : "off";
}

function canvasRoot(): HTMLElement | null {
  return document.querySelector<HTMLElement>(
    ".msk-canvas, .msk-rt-stage, .msk-uc-stage, .tri-canvas, .clab-viz, .coord-stage, .mlab-stage, .tlab-viz, .cs-visual-card, .alg-wide, .ns-lab-main, .as-lab, .gt-canvas, .studio-math-3d, .la-viz",
  );
}

function downloadCanvas() {
  const svg = canvasRoot()?.querySelector("svg");
  if (!svg) return;
  const blob = new Blob([svg.outerHTML], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "studio-canvas.svg";
  a.click();
  URL.revokeObjectURL(url);
}

async function toggleFullscreen() {
  const node = canvasRoot();
  if (!node) return;
  if (document.fullscreenElement) {
    await document.exitFullscreen();
    return;
  }
  await node.requestFullscreen();
}

export function StudioCanvasToolbar() {
  const [zoom, setZoom] = useState(1);
  const [grid, setGrid] = useState(true);
  const [labels, setLabels] = useState(true);
  const [large, setLarge] = useState(false);

  useEffect(() => {
    applyCanvasView(zoom, grid, labels, large);
    window.dispatchEvent(new CustomEvent("studio-canvas-view", {
      detail: { zoom, grid, labels, large },
    }));
    return () => {
      document.documentElement.style.removeProperty("--msk-canvas-zoom");
      delete document.documentElement.dataset.canvasGrid;
      delete document.documentElement.dataset.canvasLabels;
      delete document.documentElement.dataset.printLabels;
    };
  }, [grid, labels, large, zoom]);

  useEffect(() => {
    const onCommand = (event: Event) => {
      const type = (event as CustomEvent<string>).detail;
      if (type === "in") setZoom((value) => clampZoom(value + STEP));
      if (type === "out") setZoom((value) => clampZoom(value - STEP));
      if (type === "fit") setZoom(1);
      if (type === "reset") {
        setZoom(1);
        setGrid(true);
        setLabels(true);
      }
    };
    window.addEventListener("studio-canvas-cmd", onCommand);
    return () => window.removeEventListener("studio-canvas-cmd", onCommand);
  }, []);

  const zoomBy = useCallback((delta: number) => {
    setZoom((value) => clampZoom(value + delta));
  }, []);

  const reset = useCallback(() => {
    setZoom(1);
    setGrid(true);
    setLabels(true);
    setLarge(false);
  }, []);

  return (
    <div className="studio-canvas-tools" role="toolbar" aria-label="Canvas options">
      <button type="button" title="Zoom in" aria-label="Zoom in" onClick={() => zoomBy(STEP)}>
        <ZoomIn />
      </button>
      <button type="button" title="Zoom out" aria-label="Zoom out" onClick={() => zoomBy(-STEP)}>
        <ZoomOut />
      </button>
      <button type="button" title="Fit canvas" aria-label="Fit canvas" onClick={() => setZoom(1)}>
        <Maximize2 />
      </button>
      <button type="button" title="Toggle grid" aria-label="Toggle grid" aria-pressed={grid} className={grid ? "is-on" : ""} onClick={() => setGrid((value) => !value)}>
        <Grid3X3 />
      </button>
      <button type="button" title="Toggle labels" aria-label="Toggle labels" aria-pressed={labels} className={labels ? "is-on" : ""} onClick={() => { setLabels((value) => !value); setLarge(false); }}>
        <Type />
      </button>
      <button type="button" title="Print large-label figure" aria-label="Print figure" onClick={() => {
        setLabels(true);
        setLarge(true);
        document.documentElement.dataset.printLabels = "on";
        window.print();
      }}>
        <Printer />
      </button>
      <button type="button" title="Download SVG" aria-label="Download SVG" onClick={downloadCanvas}>
        <Download />
      </button>
      <button type="button" title="Fullscreen canvas" aria-label="Fullscreen canvas" onClick={() => void toggleFullscreen()}>
        <Expand />
      </button>
      <button type="button" title="Reset canvas view" aria-label="Reset canvas view" onClick={reset}>
        <RotateCcw />
      </button>
    </div>
  );
}
