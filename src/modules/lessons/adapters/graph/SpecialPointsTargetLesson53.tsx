import { Expand, Grid3X3, RotateCcw, Scan, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import type { LessonAdapterProps } from "../../types";
import {
  FIT_BOUNDS_53,
  FULL_BOUNDS_53,
  LINES_53,
  QUADRATICS_53,
  curvePath53,
  formatPoint53,
  graphPoint53,
  intersections53,
  lineValue53,
  quadraticValue53,
  roots53,
  vertex53,
  type Point53,
} from "./specialPointsLesson53Model";
import "./SpecialPointsTargetLesson53.css";

type Layer53 = "roots" | "yIntercept" | "vertex" | "intersections" | "turning";
type LayerState53 = Record<Layer53, boolean>;

const initialLayers: LayerState53 = {
  roots: true,
  yIntercept: true,
  vertex: true,
  intersections: true,
  turning: true,
};

const layerMeta: Array<{ id: Layer53; title: string; color: string }> = [
  { id: "roots", title: "Roots", color: "#f59e0b" },
  { id: "yIntercept", title: "y-intercept", color: "#7c4ce4" },
  { id: "vertex", title: "Vertex", color: "#1685ec" },
  { id: "intersections", title: "Intersections", color: "#35a855" },
  { id: "turning", title: "Turning Points", color: "#1685ec" },
];

function FeaturePoint53({
  point,
  label,
  color,
  width,
  height,
  bounds,
}: {
  point: Point53;
  label: string;
  color: string;
  width: number;
  height: number;
  bounds: typeof FULL_BOUNDS_53;
}) {
  const mapped = graphPoint53(point, bounds, width, height);
  const labelX = Math.max(
    6,
    Math.min(width - 118, mapped.x + (mapped.x > width * 0.72 ? -116 : 10)),
  );
  const labelY = Math.max(8, Math.min(height - 48, mapped.y - 45));
  return (
    <g className="sp53-feature" style={{ color }}>
      <circle cx={mapped.x} cy={mapped.y} r="7" />
      <g transform={`translate(${labelX} ${labelY})`}>
        <rect width="108" height="40" rx="6" />
        <text x="54" y="15" textAnchor="middle">
          {label}
        </text>
        <text x="54" y="31" textAnchor="middle">
          {formatPoint53(point)}
        </text>
      </g>
    </g>
  );
}

export default function SpecialPointsTargetLesson53({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [quadraticId, setQuadraticId] = useState("q1");
  const [lineId, setLineId] = useState("l1");
  const [layers, setLayers] = useState(initialLayers);
  const [fit, setFit] = useState(false);
  const [grid, setGrid] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [actions, setActions] = useState(0);
  const quadratic =
    QUADRATICS_53.find((item) => item.id === quadraticId) ?? QUADRATICS_53[0];
  const line = LINES_53.find((item) => item.id === lineId) ?? LINES_53[0];
  const roots = roots53(quadratic);
  const vertex = vertex53(quadratic);
  const intersections = intersections53(quadratic, line);
  const yIntercept = { x: 0, y: quadraticValue53(quadratic, 0) };
  const bounds = fit ? FIT_BOUNDS_53 : FULL_BOUNDS_53;
  const width = 700;
  const height = 570;
  const origin = graphPoint53({ x: 0, y: 0 }, bounds, width, height);

  const reset = () => {
    setQuadraticId("q1");
    setLineId("l1");
    setLayers(initialLayers);
    setFit(false);
    setGrid(true);
    setExpanded(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);

  const act = (run: () => void) => {
    run();
    setActions((value) => value + 1);
    onInteraction();
  };
  const pointsFor = (id: Layer53) => {
    if (id === "roots") return roots;
    if (id === "yIntercept") return [yIntercept];
    if (id === "vertex" || id === "turning") return [vertex];
    return intersections;
  };

  return (
    <section
      className={`sp53-page${expanded ? " expanded" : ""}`}
      data-testid="2d-graphing-mockup-0145"
      data-dedicated-lesson="53"
      data-object-model="selectable-quadratic-and-line-generated-curves-real-roots-y-intercept-vertex-turning-point-and-equation-intersections-independent-feature-layers-fit-grid-fullscreen-reset-share-and-navigation"
      data-roots={roots.map(formatPoint53).join(";")}
      data-intersections={intersections.map(formatPoint53).join(";")}
      data-actions={actions}
    >
      <nav className="sp53-breadcrumb">
        ← &nbsp; Home &gt; Lessons &gt; Graphs And Functions &gt;{" "}
        <b>53 Special Points</b>
      </nav>
      <header className="sp53-hero">
        <small>
          <b>GRAPHS AND FUNCTIONS</b>
          <b>2D GRAPHING CALCULATOR</b>
        </small>
        <h1>Special Points</h1>
        <p>Find important graph features.</p>
        <nav>
          <b>Foundational-Advanced</b>
          <b>⚡ Graph Explorer</b>
          <b>▣ Graphing Calculator</b>
          <b>◷ 6-10 min</b>
        </nav>
        <section className="sp53-toolbar">
          <label className="quadratic">
            <i />
            <select
              aria-label="Quadratic function"
              value={quadraticId}
              onChange={(event) =>
                act(() => setQuadraticId(event.target.value))
              }
            >
              {QUADRATICS_53.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className="line">
            <i />
            <select
              aria-label="Line function"
              value={lineId}
              onChange={(event) => act(() => setLineId(event.target.value))}
            >
              {LINES_53.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <button onClick={() => act(reset)}>
            <RotateCcw />
            Reset
          </button>
          <button
            className={fit ? "active" : ""}
            onClick={() => act(() => setFit((value) => !value))}
          >
            <Scan />
            Zoom Fit
          </button>
          <button
            className={grid ? "active" : ""}
            onClick={() => act(() => setGrid((value) => !value))}
          >
            <Grid3X3 />
            Show Grid
          </button>
          <button
            aria-label="Share special points"
            onClick={() =>
              act(() =>
                navigator.clipboard?.writeText(
                  `${quadratic.label}; ${line.label}`,
                ),
              )
            }
          >
            <Share2 />
          </button>
        </section>
      </header>

      <section className="sp53-workspace">
        <article className="sp53-graph-card">
          <header>
            <b>Graph Explorer</b>
            <button
              aria-label="Toggle expanded graph"
              onClick={() => act(() => setExpanded((value) => !value))}
            >
              <Expand />
            </button>
          </header>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label="Quadratic and line graph with calculated special points"
          >
            <defs>
              <pattern
                id="sp53-grid"
                width="28"
                height="28"
                patternUnits="userSpaceOnUse"
              >
                <path d="M28 0H0V28" fill="none" stroke="#dfe8f2" />
              </pattern>
            </defs>
            <rect
              width={width}
              height={height}
              fill={grid ? "url(#sp53-grid)" : "#fff"}
            />
            <line
              className="axis"
              x1="0"
              x2={width}
              y1={origin.y}
              y2={origin.y}
            />
            <line
              className="axis"
              x1={origin.x}
              x2={origin.x}
              y1="0"
              y2={height}
            />
            <polyline
              className="quadratic-curve"
              points={curvePath53(
                (x) => quadraticValue53(quadratic, x),
                bounds,
                width,
                height,
              )}
            />
            <polyline
              className="line-curve"
              points={curvePath53(
                (x) => lineValue53(line, x),
                bounds,
                width,
                height,
              )}
            />
            {layers.roots &&
              roots.map((point, index) => (
                <FeaturePoint53
                  key={`root-${index}`}
                  point={point}
                  label="x-intercept"
                  color="#f59e0b"
                  width={width}
                  height={height}
                  bounds={bounds}
                />
              ))}
            {layers.yIntercept && (
              <FeaturePoint53
                point={yIntercept}
                label="y-intercept"
                color="#7c4ce4"
                width={width}
                height={height}
                bounds={bounds}
              />
            )}
            {layers.vertex && (
              <FeaturePoint53
                point={vertex}
                label="vertex"
                color="#1685ec"
                width={width}
                height={height}
                bounds={bounds}
              />
            )}
            {layers.intersections &&
              intersections.map((point, index) => (
                <FeaturePoint53
                  key={`intersection-${index}`}
                  point={point}
                  label="intersection"
                  color="#35a855"
                  width={width}
                  height={height}
                  bounds={bounds}
                />
              ))}
          </svg>
          <div className="sp53-legend">
            <span className="quadratic">{quadratic.label}</span>
            <span className="line">{line.label}</span>
          </div>
        </article>

        <aside className="sp53-points">
          <h2>Special Points</h2>
          {layerMeta.map((meta) => (
            <section
              key={meta.id}
              style={{ "--point-color": meta.color } as CSSProperties}
            >
              <header>
                <b>{meta.title}</b>
                <input
                  aria-label={`Show ${meta.title}`}
                  type="checkbox"
                  checked={layers[meta.id]}
                  onChange={(event) =>
                    act(() =>
                      setLayers((current) => ({
                        ...current,
                        [meta.id]: event.target.checked,
                      })),
                    )
                  }
                />
              </header>
              {pointsFor(meta.id).map((point, index) => (
                <p key={index}>
                  <i />
                  {formatPoint53(point)}
                </p>
              ))}
            </section>
          ))}
        </aside>
      </section>

      <section className="sp53-explainer">
        <h2>⚛ Why these points are special</h2>
        <div>
          <article>
            <b>Roots</b>
            <p>Where the graph crosses the x-axis and f(x) = 0.</p>
          </article>
          <article>
            <b>Vertex</b>
            <p>The quadratic's turning point and minimum or maximum.</p>
          </article>
          <article>
            <b>Intersections</b>
            <p>Solutions where both equations have the same output.</p>
          </article>
        </div>
      </section>
      <nav className="sp53-adjacent">
        <a href="/lessons/graphs-and-functions/52-multiple-graphics-views">
          ←{" "}
          <span>
            PREVIOUS<b>Multiple Graphics Views</b>
          </span>
        </a>
        <a href="/lessons/graphs-and-functions/54-graph-inspector">
          <span>
            NEXT<b>Graph Inspector</b>
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}
