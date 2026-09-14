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
import { useCallback, useEffect, useId, useState, type KeyboardEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import "./geometryLabUx.css";

export type GeometryLabModeChip = {
  id: string;
  label: string;
  subtitle: string;
};

export type GeometryLabKind = "triangles" | "polygons";

const RELATED: Record<GeometryLabKind, Array<{ label: string; to: string; why: string }>> = {
  triangles: [
    { label: "Polygons Lab", to: "/geometry/polygons", why: "Generalize sides and angle sums beyond three." },
    { label: "Right Triangle Studio", to: "/trigonometry/right-triangle", why: "Solve with SOH-CAH-TOA and Pythagoras." },
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
    { keys: "← / →", action: "Previous or next mode" },
    { keys: "+ / −", action: "Zoom the figure" },
    { keys: "0", action: "Fit figure to view" },
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
  const [contrast, setContrast] = useState(false);
  const [largeLabels, setLargeLabels] = useState(false);
  const [compact, setCompact] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [unitHint, setUnitHint] = useState<"deg" | "rad">("deg");
  const [visited, setVisited] = useState<string[]>(() => [mode]);

  useEffect(() => {
    setVisited((current) => (current.includes(mode) ? current : [...current, mode]));
  }, [mode]);

  const announce = useCallback((text: string) => {
    setStatus(text);
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

  const copyMeasurements = () => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(lab === "triangles" ? ".tri-metric" : ".poly-measure"));
    const lines = nodes.map((row) => row.innerText.replace(/\s+/g, " ").trim()).filter(Boolean);
    void copyText(lines.join("\n") || liveSummary, "Live measurements copied.");
  };

  const shareSetup = () => {
    const href = typeof window === "undefined" ? "" : window.location.href;
    void copyText(href, "Shareable lab URL copied.");
  };

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
    window.print();
    announce("Print dialog opened for a clean figure handout.");
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
      if (event.key === "ArrowRight") { event.preventDefault(); go(index + 1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); go(index - 1); }
      if (event.key === "=" || event.key === "+") setZoom((value) => Math.min(1.8, Math.round((value + 0.1) * 10) / 10));
      if (event.key === "-" || event.key === "_") setZoom((value) => Math.max(0.7, Math.round((value - 0.1) * 10) / 10));
      if (event.key === "0") setZoom(1);
      if (event.key.toLowerCase() === "c" && !event.metaKey && !event.ctrlKey) copyMeasurements();
      if (event.key.toLowerCase() === "s" && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        shareSetup();
      }
      if (event.key.toLowerCase() === "l") setLargeLabels((value) => !value);
      if (event.key.toLowerCase() === "h") setContrast((value) => !value);
      if (event.key.toLowerCase() === "i") setInspectorOpen((value) => !value);
      if (lab === "polygons" && event.key.toLowerCase() === "d") setUnitHint((value) => (value === "deg" ? "rad" : "deg"));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [copyMeasurements, go, index, lab, modes, onChange]);

  const onTabKey = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowRight") { event.preventDefault(); go(index + 1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); go(index - 1); }
    if (event.key === "Home") { event.preventDefault(); go(0); }
    if (event.key === "End") { event.preventDefault(); go(modes.length - 1); }
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

  return (
    <div className={classes} data-lab={lab} style={{ ["--geo-zoom" as string]: String(zoom) }}>
      <a className="geo-skip" href="#lab-canvas">Skip to figure</a>
      <div className="geo-lab-toolbar" role="toolbar" aria-label={`${lab} studio tools`}>
        <div className="geo-lab-progress" aria-label="Modes visited">
          <span className="geo-progress-label">Visited</span>
          {modes.map((item, modeIndex) => (
            <span key={item.id} className={visited.includes(item.id) ? "is-done" : ""} title={item.label} aria-label={`${item.label}${visited.includes(item.id) ? " visited" : " not yet visited"}`}>
              {modeIndex + 1}
            </span>
          ))}
        </div>
        <div className="geo-lab-tools">
          <button type="button" onClick={() => go(index - 1)} aria-label="Previous mode">Prev</button>
          <button type="button" onClick={() => go(index + 1)} aria-label="Next mode">Next</button>
          <button type="button" onClick={() => setZoom((value) => Math.min(1.8, Math.round((value + 0.1) * 10) / 10))} aria-label="Zoom in"><ZoomIn /></button>
          <button type="button" onClick={() => setZoom((value) => Math.max(0.7, Math.round((value - 0.1) * 10) / 10))} aria-label="Zoom out"><ZoomOut /></button>
          <button type="button" onClick={() => setZoom(1)} aria-label="Fit figure"><Maximize2 /></button>
          <button type="button" aria-pressed={contrast} onClick={() => setContrast((value) => !value)} aria-label="High contrast"><Contrast /></button>
          <button type="button" aria-pressed={largeLabels} onClick={() => setLargeLabels((value) => !value)} aria-label="Large labels"><Type /></button>
          <button type="button" aria-pressed={compact} onClick={() => setCompact((value) => !value)}>{compact ? "Comfortable" : "Compact"}</button>
          <button type="button" className="geo-inspector-toggle" aria-pressed={inspectorOpen} onClick={() => setInspectorOpen((value) => !value)} aria-label="Toggle measurements panel"><PanelRight /></button>
          <button type="button" onClick={copyMeasurements} aria-label="Copy measurements"><Copy /></button>
          <button type="button" onClick={shareSetup} aria-label="Copy shareable URL"><Link2 /></button>
          <button type="button" onClick={exportSvg} aria-label="Download SVG"><Download /></button>
          <button type="button" onClick={printLab} aria-label="Print lab"><Printer /></button>
          <button type="button" aria-expanded={helpOpen} aria-controls={helpId} onClick={() => setHelpOpen((open) => !open)} aria-label="Keyboard shortcuts"><Keyboard /><HelpCircle /></button>
        </div>
        {lab === "polygons" ? (
          <p className="geo-unit-hint" data-unit={unitHint}>Angles shown as {unitHint === "deg" ? "degrees" : "radians (π rad = 180°)"}. Press D to switch the reminder.</p>
        ) : (
          <p className="geo-unit-hint">Drag vertices. Press ? for shortcuts. Color-blind safe metric dots stay distinct by position, not only hue.</p>
        )}
      </div>
      <p className="geo-live-summary" aria-live="polite">{liveSummary}</p>
      <div className="geo-lab-body" onKeyDown={onTabKey}>
        {children}
      </div>
      <aside className="geo-related" aria-label="Related labs">
        {RELATED[lab].map((item) => (
          <Link key={item.to} to={item.to}>
            <b>{item.label}</b>
            <small>{item.why}</small>
          </Link>
        ))}
      </aside>
      <p className="geo-legend" aria-hidden="true">
        {lab === "triangles"
          ? "Legend: cyan sides · violet angles · teal heights · amber warnings"
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
    </div>
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
    cylinder: "cylinder",
    cones: "cone",
    cone: "cone",
    spheres: "sphere",
    sphere: "sphere",
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
