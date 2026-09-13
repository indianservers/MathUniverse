import { GitBranch, Grid3X3, Hexagon, Spline, Triangle } from "lucide-react";
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

  return (
    <div className="poly-studio">
      <nav className="poly-tabs" aria-label="Polygons Lab modes">
        {POLYGON_MODES.map((item) => {
          const Icon = ICONS[item.id];
          return (
            <button
              key={item.id}
              type="button"
              className={`poly-tab${item.id === mode ? " is-on" : ""}`}
              aria-pressed={item.id === mode}
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
  );
}
