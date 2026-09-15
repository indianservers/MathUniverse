import {
  Copy,
  Contrast,
  Download,
  HelpCircle,
  Keyboard,
  Link2,
  Maximize2,
  PanelRight,
  Printer,
  Type,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useId, useMemo, useState, type KeyboardEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { readGeoSession, writeGeoSession, onGeoSession } from "./geometryStudioSession";
import "./geometryLabUx.css";

export type GeometryLabModeChip = {
  id: string;
  label: string;
  subtitle: string;
};

export type GeometryLabKind = "triangles" | "polygons";

export type GeoLabUi = {
  zoom: number;
  panX: number;
  panY: number;
  setPan: (x: number, y: number) => void;
  highlight: string | null;
  setHighlight: (id: string | null) => void;
  announce: (text: string) => void;
  challengeFlash: boolean;
  setChallengeFlash: (on: boolean) => void;
};

export const GeoLabUiContext = createContext<GeoLabUi | null>(null);

export function useGeoLabUi() {
  return useContext(GeoLabUiContext);
}

const RELATED: Record<GeometryLabKind, Array<{ label: string; to: string; why: string }>> = {
  triangles: [
    { label: "Next lab: Circles", to: "/geometry/circles", why: "Inscribed angles grow from triangle facts." },
    { label: "Polygons Lab", to: "/geometry/polygons", why: "Generalize sides and angle sums beyond three." },
    { label: "Shapes Explorer", to: "/shapes?shape=triangle", why: "Compare triangle families with formulas." },
  ],
  polygons: [
    { label: "Triangles Lab", to: "/geometry/triangles", why: "Every n-gon decomposes into triangles." },
    { label: "Shapes Explorer", to: "/shapes?shape=hexagon", why: "Measure regular polygons and 3D solids." },
    { label: "Construction", to: "/geometry/construction", why: "Build polygons with compass and straightedge." },
  ],
};

const SHORTCUTS: Record<GeometryLabKind, Array<{ keys: string; action: string }>> = {
  triangles: [
    { keys: "1–5", action: "Switch explorer, congruence, similarity, centers, inequalities" },
    { keys: "← / →", action: "Nudge the selected vertex" },
    { keys: "+ / −", action: "Zoom the figure" },
    { keys: "0", action: "Fit figure to view" },
    { keys: "Z / Y", action: "Undo or redo a vertex move" },
    { keys: "C", action: "Copy live measurements" },
    { keys: "S", action: "Copy a shareable lab URL" },
    { keys: "L", action: "Toggle large labels" },
    { keys: "H", action: "Toggle high contrast" },
    { keys: "I", action: "Show or hide the inspector on small screens" },
    { keys: "?", action: "Open this shortcut guide" },
  ],
  polygons: [
    { keys: "1–5", action: "Switch regular, angles, tessellation, area, diagonals" },
    { keys: "← / →", action: "Previous or next mode" },
    { keys: "+ / −", action: "Zoom the polygon stage" },
    { keys: "0", action: "Fit the stage" },
    { keys: "C", action: "Copy live measurements" },
    { keys: "S", action: "Copy a shareable lab URL" },
    { keys: "D", action: "Cycle degrees / radians display hint" },
    { keys: "L", action: "Toggle large labels" },
    { keys: "I", action: "Show or hide measurements on small screens" },
    { keys: "?", action: "Open this shortcut guide" },
  ],
};

export function GeometryLabShell({
  lab,
  modes,
  mode,
  onChange,
  liveSummary,
  children,
}: {
  lab: GeometryLabKind;
  modes: GeometryLabModeChip[];
  mode: string;
  onChange: (id: string) => void;
  liveSummary: string;
  children: ReactNode;
}) {
  const reducedMotion = useReducedMotion();
  const helpId = useId();
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [contrast, setContrast] = useState(false);
  const [largeLabels, setLargeLabels] = useState(() => readGeoSession().largeLabels);
  useEffect(() => onGeoSession(() => setLargeLabels(readGeoSession().largeLabels)), []);
  const [compact, setCompact] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [unitHint, setUnitHint] = useState<"deg" | "rad">("deg");
  const [highlight, setHighlight] = useState<string | null>(null);
  const [challengeFlash, setChallengeFlash] = useState(false);

  const announce = useCallback((text: string) => {
    setStatus(text);
  }, []);

  const toggleLargeLabels = useCallback(() => {
    setLargeLabels((value) => {
      const next = !value;
      writeGeoSession({ largeLabels: next });
      return next;
    });
  }, []);

  const index = Math.max(0, modes.findIndex((item) => item.id === mode));
  const go = useCallback((nextIndex: number) => {
    const wrapped = (nextIndex + modes.length) % modes.length;
    const next = modes[wrapped];
    if (next) onChange(next.id);
  }, [modes, onChange]);

  const copyText = async (text: string, ok: string) => {
    try {
      await navigator.clipboard.writeText(text);
      announce(ok);
    } catch {
      announce("Clipboard is blocked in this browser. Copy the URL from the address bar.");
    }
  };

  const copyMeasurements = useCallback(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(lab === "triangles" ? ".tri-metric" : ".poly-measure"));
    const lines = nodes.map((row) => row.innerText.replace(/\s+/g, " ").trim()).filter(Boolean);
    void copyText(lines.join("\n") || liveSummary, "Live measurements copied.");
  }, [announce, lab, liveSummary]);

  const shareSetup = useCallback(() => {
    const href = typeof window === "undefined" ? "" : window.location.href;
    void copyText(href, "Shareable lab URL copied.");
  }, [announce]);

  const exportSvg = () => {
    const svg = document.querySelector<SVGSVGElement>(lab === "triangles" ? ".tri-canvas svg" : ".poly-svg");
    if (!svg) {
      announce("No figure is ready to export yet.");
      return;
    }
    const blob = new Blob([svg.outerHTML], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${lab}-${mode}.svg`;
    a.click();
    URL.revokeObjectURL(url);
    announce("Figure downloaded as SVG.");
  };

  const printLab = () => {
    document.documentElement.classList.add("geo-print-worksheet");
    window.print();
    window.setTimeout(() => document.documentElement.classList.remove("geo-print-worksheet"), 500);
    announce("Print a figure worksheet with a blank angle to find.");
  };

  const fit = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  };

  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && /input|textarea|select/i.test(target.tagName)) return;
      if (event.key === "?" || (event.shiftKey && event.key === "/")) {
        event.preventDefault();
        setHelpOpen((open) => !open);
        return;
      }
      if (event.key === "Escape") {
        setHelpOpen(false);
        return;
      }
      if (event.key >= "1" && event.key <= "5") {
        const next = modes[Number(event.key) - 1];
        if (next) onChange(next.id);
        return;
      }
      if (lab === "polygons" && event.key === "ArrowRight") { event.preventDefault(); go(index + 1); }
      if (lab === "polygons" && event.key === "ArrowLeft") { event.preventDefault(); go(index - 1); }
      if (event.key === "=" || event.key === "+") setZoom((value) => Math.min(2.2, Math.round((value + 0.1) * 10) / 10));
      if (event.key === "-" || event.key === "_") setZoom((value) => Math.max(0.7, Math.round((value - 0.1) * 10) / 10));
      if (event.key === "0") fit();
      if (event.key.toLowerCase() === "c" && !event.metaKey && !event.ctrlKey) copyMeasurements();
      if (event.key.toLowerCase() === "s" && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        shareSetup();
      }
      if (event.key.toLowerCase() === "l") toggleLargeLabels();
      if (event.key.toLowerCase() === "h") setContrast((value) => !value);
      if (event.key.toLowerCase() === "i") setInspectorOpen((value) => !value);
      if (lab === "polygons" && event.key.toLowerCase() === "d") setUnitHint((value) => (value === "deg" ? "rad" : "deg"));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [copyMeasurements, go, index, lab, modes, onChange, shareSetup, toggleLargeLabels]);

  const onTabKey = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft" && event.key !== "Home" && event.key !== "End") return;
    const target = event.target as HTMLElement;
    if (!target.closest("[role='tablist']")) return;
    event.preventDefault();
    if (event.key === "ArrowRight") go(index + 1);
    if (event.key === "ArrowLeft") go(index - 1);
    if (event.key === "Home") go(0);
    if (event.key === "End") go(modes.length - 1);
  };

  const classes = [
    "geo-lab-ux",
    `geo-lab-ux--${lab}`,
    contrast ? "is-contrast" : "",
    largeLabels ? "has-large-labels" : "",
    compact ? "is-compact" : "",
    inspectorOpen ? "is-inspector-open" : "",
    reducedMotion ? "is-reduced-motion" : "",
  ].filter(Boolean).join(" ");

  const setPan = useCallback((x: number, y: number) => {
    setPanX(x);
    setPanY(y);
  }, []);

  const ui = useMemo<GeoLabUi>(() => ({
    zoom, panX, panY, setPan, highlight, setHighlight, announce, challengeFlash, setChallengeFlash,
  }), [announce, challengeFlash, highlight, panX, panY, setPan, zoom]);

  return (
    <GeoLabUiContext.Provider value={ui}>
      <div className={classes} data-lab={lab} data-lab-mode={mode} data-zoom={zoom} data-pan-x={panX} data-pan-y={panY} style={{ ["--geo-zoom" as string]: String(zoom) }}>
        <a className="geo-skip" href="#lab-canvas">Skip to figure</a>
        <div className="geo-lab-toolbar geo-lab-toolbar--figure" role="toolbar" aria-label={`${lab} studio tools`}>
          <div className="geo-lab-tools">
            <button type="button" onClick={() => setZoom((value) => Math.min(2.2, Math.round((value + 0.1) * 10) / 10))} aria-label="Zoom in"><ZoomIn /></button>
            <button type="button" onClick={() => setZoom((value) => Math.max(0.7, Math.round((value - 0.1) * 10) / 10))} aria-label="Zoom out"><ZoomOut /></button>
            <button type="button" onClick={fit} aria-label="Fit figure"><Maximize2 /></button>
            <button type="button" aria-pressed={contrast} onClick={() => setContrast((value) => !value)} aria-label="High contrast"><Contrast /></button>
            <button type="button" aria-pressed={largeLabels} onClick={toggleLargeLabels} aria-label="Large labels"><Type /></button>
            <button type="button" aria-pressed={compact} onClick={() => setCompact((value) => !value)}>{compact ? "Comfortable" : "Compact"}</button>
            <button type="button" className="geo-inspector-toggle" aria-pressed={inspectorOpen} onClick={() => setInspectorOpen((value) => !value)} aria-label="Toggle measurements panel"><PanelRight /></button>
            <button type="button" onClick={copyMeasurements} aria-label="Copy measurements"><Copy /></button>
            <button type="button" onClick={shareSetup} aria-label="Copy shareable URL"><Link2 /></button>
            <button type="button" onClick={exportSvg} aria-label="Download SVG"><Download /></button>
            <button type="button" onClick={printLab} aria-label="Print worksheet"><Printer /></button>
            <button type="button" aria-expanded={helpOpen} aria-controls={helpId} onClick={() => setHelpOpen((open) => !open)} aria-label="Keyboard shortcuts"><Keyboard /><HelpCircle /></button>
          </div>
          {lab === "polygons" ? (
            <p className="geo-unit-hint" data-unit={unitHint}>Angles shown as {unitHint === "deg" ? "degrees" : "radians (π rad = 180°)"}. Press D to switch the reminder.</p>
          ) : (
            <p className="geo-unit-hint">Drag a vertex. Arrow keys nudge the selection. Press ? for shortcuts.</p>
          )}
        </div>
        <p className="geo-live-summary vis-hidden" aria-live="polite">{liveSummary}</p>
        <div className="geo-lab-body" onKeyDown={onTabKey}>
          {children}
        </div>
        <aside className="geo-related geo-next-rail" aria-label="Related labs">
          {RELATED[lab].map((item) => (
            <Link key={item.to} to={item.to}>
              <b>{item.label}</b>
              <small>{item.why}</small>
            </Link>
          ))}
        </aside>
        <p className="geo-legend" id="geo-legend">
          {lab === "triangles"
            ? "Hover a measurement to highlight the matching side or angle. Cyan sides · violet ∠B · amber ∠C · teal height."
            : "Legend: blue sides · violet interiors · amber exteriors · teal apothem"}
        </p>
        {helpOpen ? (
          <div className="geo-help" id={helpId} role="dialog" aria-modal="true" aria-label="Keyboard shortcuts">
            <h2>Shortcuts</h2>
            <ul>
              {SHORTCUTS[lab].map((item) => (
                <li key={item.keys}><kbd>{item.keys}</kbd> {item.action}</li>
              ))}
            </ul>
            <button type="button" onClick={() => setHelpOpen(false)}>Close</button>
          </div>
        ) : null}
        <p className="geo-status" role="status">{status}</p>
        <p className="geo-print-prompt" hidden>Find ∠C. Show your working.</p>
      </div>
    </GeoLabUiContext.Provider>
  );
}

export function shapesExplorerPathFromSolidMode(mode: string | null | undefined): string {
  const token = (mode ?? "").trim().toLowerCase().replace(/[_+]+/g, " ").replace(/\s+/g, " ");
  const map: Record<string, string> = {
    prisms: "triangular-prism",
    prism: "triangular-prism",
    pyramids: "square-pyramid",
    pyramid: "square-pyramid",
    cylinders: "cylinder",
    cone: "cone",
    cones: "cone",
    sphere: "sphere",
    spheres: "sphere",
    nets: "cube",
    "cross-sections": "cube",
    "cross sections": "cube",
    cube: "cube",
    cuboid: "cuboid",
    tetrahedron: "tetrahedron",
  };
  const shape = map[token];
  return shape ? `/shapes?shape=${shape}` : "/shapes";
}
