import { GeometryLabShell } from "../geometryLabUx";
import type { StudioMockupPage } from "../../mockup/studioMockupCatalog";
import DiagonalsLab from "./DiagonalsLab";
import InteriorAnglesLab from "./InteriorAnglesLab";
import PolygonAreaLab from "./PolygonAreaLab";
import "./PolygonsLab.css";
import RegularPolygonLab from "./RegularPolygonLab";
import TessellationLab from "./TessellationLab";
import { POLYGON_MODES, usePolygonLabMode, type PolygonModeId } from "./polygonMode";
import { LearningStrip } from "./polygonUi";
import { useState } from "react";

function TabIcon({ id }: { id: PolygonModeId }) {
  if (id === "regular") {
    return (
      <svg className="poly-mini" viewBox="0 0 46 46" aria-hidden="true">
        <polygon points="23,6 38,16 38,32 23,42 8,32 8,16" fill="#147df2" opacity=".9" />
      </svg>
    );
  }
  if (id === "angles") {
    return (
      <svg className="poly-mini" viewBox="0 0 46 46" aria-hidden="true">
        <path d="M8 38 23 8l15 30Z" fill="none" stroke="#8b45f4" strokeWidth="2.2" />
        <path d="M16 28 A8 8 0 0 1 30 28" fill="none" stroke="#08b9dd" strokeWidth="2" />
      </svg>
    );
  }
  if (id === "tessellation") {
    return (
      <svg className="poly-mini" viewBox="0 0 46 46" aria-hidden="true">
        <polygon points="12,10 22,16 22,28 12,34 2,28 2,16" fill="#08b9dd" />
        <polygon points="32,10 42,16 42,28 32,34 22,28 22,16" fill="#147df2" />
        <polygon points="22,22 32,28 32,40 22,46 12,40 12,28" fill="#8b45f4" />
      </svg>
    );
  }
  if (id === "area") {
    return (
      <svg className="poly-mini" viewBox="0 0 46 46" aria-hidden="true">
        <polygon points="8,38 23,8 38,38" fill="#dbeafe" stroke="#147df2" />
        <line x1="23" y1="8" x2="23" y2="38" stroke="#10b981" strokeWidth="2" />
        <line x1="8" y1="38" x2="38" y2="38" stroke="#147df2" />
      </svg>
    );
  }
  return (
    <svg className="poly-mini" viewBox="0 0 46 46" aria-hidden="true">
      <polygon points="10,14 36,14 40,32 23,42 6,32" fill="none" stroke="#f59e0b" strokeWidth="2" />
      <line x1="10" y1="14" x2="40" y2="32" stroke="#8b45f4" />
      <line x1="36" y1="14" x2="6" y2="32" stroke="#147df2" />
    </svg>
  );
}

const STRIPS: Record<PolygonModeId, Array<{ title: string; text: string; action: string }>> = {
  regular: [
    { title: "Observe", text: "Change n and watch the n-gon rebuild.", action: "observe" },
    { title: "Understand", text: "Hover apothem, interior, or diagonals.", action: "understand" },
    { title: "Why", text: "Equal sides force equal interior angles.", action: "why" },
    { title: "Try", text: "Snap to an octagon (exterior 45°).", action: "try" },
    { title: "Challenge", text: "Match a target exterior angle.", action: "challenge" },
  ],
  angles: [
    { title: "Observe", text: "Fan-triangulate from one vertex.", action: "observe" },
    { title: "Understand", text: "n − 2 triangles × 180°.", action: "understand" },
    { title: "Why", text: "Exteriors always close a 360° walk.", action: "why" },
    { title: "Try", text: "Walk around the polygon.", action: "try" },
    { title: "Challenge", text: "Make the interior sum 900°.", action: "challenge" },
  ],
  tessellation: [
    { title: "Observe", text: "Expand a triangular, square, or hex tiling.", action: "observe" },
    { title: "Understand", text: "k × interior must equal 360°.", action: "understand" },
    { title: "Why", text: "Pentagons leave a 36° gap.", action: "why" },
    { title: "Try", text: "Open a semi-regular vertex figure.", action: "try" },
    { title: "Challenge", text: "Find the three regular tiles.", action: "challenge" },
  ],
  area: [
    { title: "Observe", text: "Split the n-gon into wedges from O.", action: "observe" },
    { title: "Understand", text: "Area = ½ × perimeter × apothem.", action: "understand" },
    { title: "Why", text: "Shoelace works on a coordinate grid.", action: "why" },
    { title: "Try", text: "Open an L-shaped floor plan.", action: "try" },
    { title: "Challenge", text: "Reach area ≈ 50.", action: "challenge" },
  ],
  diagonals: [
    { title: "Observe", text: "Draw diagonals from one vertex.", action: "observe" },
    { title: "Understand", text: "Each vertex misses 3 neighbors.", action: "understand" },
    { title: "Why", text: "Halve n(n − 3) because each diagonal has two ends.", action: "why" },
    { title: "Try", text: "Animate all diagonals.", action: "try" },
    { title: "Challenge", text: "Hit exactly 20 diagonals.", action: "challenge" },
  ],
};

export default function PolygonsLab({ page }: { page: StudioMockupPage }) {
  const { mode, setMode } = usePolygonLabMode();
  const [pulse, setPulse] = useState("observe");
  const current = POLYGON_MODES.find((item) => item.id === mode) ?? POLYGON_MODES[0]!;
  const strip = STRIPS[mode];

  return (
    <GeometryLabShell
      lab="polygons"
      modes={POLYGON_MODES}
      mode={mode}
      onChange={(id) => setMode(id as typeof mode)}
      liveSummary={`${current.label}: ${current.subtitle}. Change n, hover a measurement to highlight it on the figure, then try the challenge.`}
    >
      <div className="poly-studio">
        <nav className="poly-tabs" role="tablist" aria-label="Polygons Lab modes">
          {POLYGON_MODES.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              className={`poly-tab${item.id === mode ? " is-on" : ""}`}
              aria-pressed={item.id === mode}
              aria-selected={item.id === mode}
              tabIndex={item.id === mode ? 0 : -1}
              title={`${item.label}: ${item.subtitle}. Shortcut ${index + 1}`}
              onClick={() => setMode(item.id)}
            >
              <TabIcon id={item.id} />
              <span>
                <b>{item.label}</b>
                <small>{item.subtitle}</small>
              </span>
            </button>
          ))}
        </nav>
        {mode === "regular" ? <RegularPolygonLab pulse={pulse} /> : null}
        {mode === "angles" ? <InteriorAnglesLab pulse={pulse} /> : null}
        {mode === "tessellation" ? <TessellationLab pulse={pulse} /> : null}
        {mode === "area" ? <PolygonAreaLab pulse={pulse} /> : null}
        {mode === "diagonals" ? <DiagonalsLab pulse={pulse} /> : null}
        <LearningStrip
          items={strip.map((item) => ({
            title: item.title,
            text: item.text,
            active: pulse === item.action,
            onClick: () => setPulse(item.action),
          }))}
        />
        <p className="msk-note">{page.title} · {current.subtitle}</p>
      </div>
    </GeometryLabShell>
  );
}
