import { GitBranch, Grid3X3, Hexagon, Spline, Triangle } from "lucide-react";
import { GeometryLabShell } from "../geometryLabUx";
import { MockupLearningStrip } from "../../mockup/MockupStudioChrome";
import type { StudioMockupPage } from "../../mockup/studioMockupCatalog";
import DiagonalsLab from "./DiagonalsLab";
import InteriorAnglesLab from "./InteriorAnglesLab";
import PolygonAreaLab from "./PolygonAreaLab";
import "./PolygonsLab.css";
import RegularPolygonLab from "./RegularPolygonLab";
import TessellationLab from "./TessellationLab";
import { POLYGON_MODES, usePolygonLabMode } from "./polygonMode";

const ICONS = {
  regular: Hexagon,
  angles: Triangle,
  tessellation: Grid3X3,
  area: Spline,
  diagonals: GitBranch,
} as const;

export default function PolygonsLab({ page }: { page: StudioMockupPage }) {
  const { mode, setMode } = usePolygonLabMode();
  const current = POLYGON_MODES.find((item) => item.id === mode) ?? POLYGON_MODES[0]!;

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
        {POLYGON_MODES.map((item, index) => {
          const Icon = ICONS[item.id];
          return (
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
              <Icon />
              <span>
                <b>{item.label}</b>
                <small>{item.subtitle}</small>
              </span>
            </button>
          );
        })}
      </nav>
      {mode === "regular" ? <RegularPolygonLab /> : null}
      {mode === "angles" ? <InteriorAnglesLab /> : null}
      {mode === "tessellation" ? <TessellationLab /> : null}
      {mode === "area" ? <PolygonAreaLab /> : null}
      {mode === "diagonals" ? <DiagonalsLab /> : null}
      <MockupLearningStrip page={page} />
    </div>
    </GeometryLabShell>
  );
}
