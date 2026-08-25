import { Lightbulb, RotateCcw, Share2, Sparkles } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../types";
import "./DynamicLabelsTargetLesson27.css";

type Point = { x: number; y: number };
const TEMPLATES = [
  "P = ({x}, {y}), distance = {d}",
  "P = ({x}, {y}) | d = {d}",
  "({x}, {y}) -> distance = {d}",
];
const VIEWS = ["Interaction", "Explain", "Examples", "Formulas", "Know more"];
const clamp = (value: number) => Math.max(-10, Math.min(10, Math.round(value)));
const distance = (point: Point) => Math.hypot(point.x, point.y);
const formatDistance = (point: Point) => distance(point).toFixed(2);

export default function DynamicLabelsTargetLesson27({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [point, setPoint] = useState<Point>({ x: 3, y: 2 }),
    [template, setTemplate] = useState(0),
    [coordinates, setCoordinates] = useState(true),
    [showDistance, setShowDistance] = useState(true),
    [projections, setProjections] = useState(true),
    [view, setView] = useState(0),
    [shareState, setShareState] = useState("Share"),
    [actions, setActions] = useState(0);
  const touch = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const update = (next: Point) => {
    setPoint({ x: clamp(next.x), y: clamp(next.y) });
    touch();
  };
  const labelFor = (value: Point) => {
    let text = TEMPLATES[template]
      .replaceAll("{x}", String(value.x))
      .replaceAll("{y}", String(value.y))
      .replaceAll("{d}", formatDistance(value));
    if (!coordinates)
      text = text
        .replace(/P = \([^)]*\)[, |]*/, "P ")
        .replace(/\([^)]*\)\s*(?:->|\|)?\s*/, "");
    if (!showDistance)
      text = text
        .replace(/[, |]*d(?:istance)?\s*=\s*[\d.]+/, "")
        .replace(/\s*->\s*$/, "")
        .trim();
    return text || "P";
  };
  const reset = () => {
    setPoint({ x: 3, y: 2 });
    setTemplate(0);
    setCoordinates(true);
    setShowDistance(true);
    setProjections(true);
    setView(0);
    setShareState("Share");
    setActions(0);
    onInteraction();
  };
  useEffect(() => {
    setPoint({ x: 3, y: 2 });
    setTemplate(0);
    setCoordinates(true);
    setShowDistance(true);
    setProjections(true);
    setView(0);
    setShareState("Share");
    setActions(0);
  }, [resetToken]);
  const share = async () => {
    try {
      await navigator.clipboard?.writeText(labelFor(point));
      setShareState("Copied");
    } catch {
      setShareState("Ready");
    }
    touch();
  };
  const preview = { x: 4, y: 1 };
  return (
    <div
      className="labels-page"
      data-testid="algebra-mockup-0027"
      data-dedicated-lesson="27"
      data-object-model="draggable-point-token-template-coordinate-distance-projection-live-label-model"
      data-x={point.x}
      data-y={point.y}
      data-distance={formatDistance(point)}
      data-template={template}
      data-coordinates={coordinates}
      data-show-distance={showDistance}
      data-projections={projections}
      data-view={view}
      data-actions={actions}
    >
      <nav className="labels-breadcrumb">
        <a href="/">←</a>
        <a href="/">Home</a>
        <span>›</span>
        <a href="/lessons">Lessons</a>
        <span>›</span>
        <a href="/lessons/core-workspaces">Core Workspaces</a>
        <span>›</span>
        <b>27 Dynamic Labels</b>
      </nav>
      <section className="labels-surface">
        <header className="labels-header">
          <div>
            <h1>Dynamic Labels</h1>
            <p>Track changing mathematical information.</p>
          </div>
          <nav>
            <b>ϟ Exploration Lab</b>
            <b>◴ 6-10 min</b>
          </nav>
        </header>
        <nav className="labels-tabs" aria-label="Lesson views">
          {VIEWS.map((label, index) => (
            <button
              type="button"
              className={view === index ? "active" : ""}
              key={label}
              onClick={() => {
                setView(index);
                touch();
              }}
            >
              {index === 0
                ? "◉"
                : index === 1
                  ? "▣"
                  : index === 2
                    ? "♧"
                    : index === 3
                      ? "∑"
                      : "✣"}
              <span>{label}</span>
            </button>
          ))}
          <button type="button" onClick={() => void share()}>
            <Share2 />
            {shareState}
          </button>
          <button type="button" onClick={reset}>
            <RotateCcw />
            Reset
          </button>
        </nav>
        <main className="labels-main">
          <section className="labels-content">
            <div className="labels-graph-row">
              <PointGraph
                point={point}
                projections={projections}
                label={labelFor(point)}
                onPoint={update}
              />
              <section className="labels-calculation">
                <h2>Calculation</h2>
                <p>
                  d = √
                  <span>
                    {point.x}
                    <sup>2</sup> + {point.y}
                    <sup>2</sup>
                  </span>
                </p>
                <p>= √{point.x * point.x + point.y * point.y}</p>
                <b>= {formatDistance(point)}</b>
              </section>
            </div>
            <section className="labels-callout">
              <Lightbulb />
              <span>
                <b>Labels should read linked values, not fixed text.</b>
                <small>
                  Move point P or change x and y to see the label update
                  automatically.
                </small>
              </span>
            </section>
            <div className="labels-bottom">
              <section className="template-output">
                <h2>Template to output</h2>
                <label>
                  Template&nbsp; ⓘ<output>{TEMPLATES[template]}</output>
                </label>
                <em>↓</em>
                <label>
                  Live label&nbsp; ⓘ<output>{labelFor(point)}</output>
                </label>
                <p>
                  Values &#123;x&#125;, &#123;y&#125; and &#123;d&#125; are
                  linked to the point P.
                </p>
              </section>
              <section className="preview-card">
                <h2>Another position preview</h2>
                <p>Move P to (4, 1)</p>
                <PreviewGraph label={labelFor(preview)} />
                <b>Live label updates:&nbsp; {labelFor(preview)}</b>
              </section>
            </div>
          </section>
          <aside className="labels-controls">
            <h2>Point P controls</h2>
            <CoordinateControl
              axis="x"
              value={point.x}
              point={point}
              onPoint={update}
            />
            <CoordinateControl
              axis="y"
              value={point.y}
              point={point}
              onPoint={update}
            />
            <hr />
            <h3>Label format (template)&nbsp; ⓘ</h3>
            <div className="template-options">
              {TEMPLATES.map((value, index) => (
                <button
                  type="button"
                  className={template === index ? "active" : ""}
                  key={value}
                  onClick={() => {
                    setTemplate(index);
                    touch();
                  }}
                >
                  {value}
                </button>
              ))}
            </div>
            <hr />
            <h3>Display options</h3>
            <Toggle
              label="Show coordinates"
              value={coordinates}
              onToggle={() => {
                setCoordinates((value) => !value);
                touch();
              }}
            />
            <Toggle
              label="Show distance from origin"
              value={showDistance}
              onToggle={() => {
                setShowDistance((value) => !value);
                touch();
              }}
            />
            <Toggle
              label="Show dashed projections"
              value={projections}
              onToggle={() => {
                setProjections((value) => !value);
                touch();
              }}
            />
          </aside>
        </main>
        <nav className="labels-neighbors">
          <a href="/lessons/core-workspaces/26-conditional-visibility">
            ←
            <span>
              <small>Previous</small>
              <b>Conditional Visibility</b>
            </span>
          </a>
          <a href="/lessons/core-workspaces/28-algebraic-input">
            {" "}
            <span>
              <small>Next</small>
              <b>Algebraic Input</b>
            </span>
            →
          </a>
        </nav>
      </section>
      <footer className="labels-footer">
        <b>
          <Sparkles />
          Math Universe
        </b>
        <p>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </p>
        <nav>
          <button type="button" onClick={touch}>
            Sitemap
          </button>
          <button type="button" onClick={touch}>
            Docs
          </button>
          <button type="button" onClick={touch}>
            About
          </button>
        </nav>
      </footer>
    </div>
  );
}

function CoordinateControl({
  axis,
  value,
  point,
  onPoint,
}: {
  axis: "x" | "y";
  value: number;
  point: Point;
  onPoint: (point: Point) => void;
}) {
  const set = (next: number) => onPoint({ ...point, [axis]: next });
  return (
    <section className="coordinate-control">
      <label>{axis}-coordinate</label>
      <div>
        <input
          aria-label={`${axis}-coordinate value`}
          type="number"
          value={value}
          min="-10"
          max="10"
          onChange={(event) => set(Number(event.target.value))}
        />
        <button
          type="button"
          aria-label={`Decrease ${axis}`}
          onClick={() => set(value - 1)}
        >
          −
        </button>
        <button
          type="button"
          aria-label={`Increase ${axis}`}
          onClick={() => set(value + 1)}
        >
          +
        </button>
      </div>
      <footer>
        <span>-10</span>
        <input
          aria-label={`${axis}-coordinate drag control`}
          type="range"
          min="-10"
          max="10"
          step="1"
          value={value}
          onChange={(event) => set(Number(event.target.value))}
        />
        <span>10</span>
      </footer>
    </section>
  );
}
function Toggle({
  label,
  value,
  onToggle,
}: {
  label: string;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <label className="labels-toggle">
      {label}
      <button
        type="button"
        role="switch"
        aria-checked={value}
        className={value ? "active" : ""}
        onClick={onToggle}
      >
        <i />
      </button>
    </label>
  );
}
function PointGraph({
  point,
  projections,
  label,
  onPoint,
}: {
  point: Point;
  projections: boolean;
  label: string;
  onPoint: (point: Point) => void;
}) {
  const svg = useRef<SVGSVGElement>(null),
    dragging = useRef(false),
    map = (p: Point) => ({ x: 192 + p.x * 32, y: 232 - p.y * 32 }),
    mapped = map(point);
  const update = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!dragging.current || !svg.current) return;
    const matrix = svg.current.getScreenCTM();
    if (!matrix) return;
    const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(
      matrix.inverse(),
    );
    onPoint({ x: (p.x - 192) / 32, y: (232 - p.y) / 32 });
  };
  return (
    <svg
      ref={svg}
      className="labels-graph"
      viewBox="0 0 445 463"
      role="img"
      aria-label="Draggable point P with dynamic label"
      onPointerMove={update}
      onPointerUp={() => {
        dragging.current = false;
      }}
    >
      <defs>
        <pattern
          id="labels-grid"
          width="16"
          height="16"
          patternUnits="userSpaceOnUse"
        >
          <path d="M16 0H0V16" fill="none" stroke="#e8edf1" />
        </pattern>
      </defs>
      <rect width="445" height="463" fill="url(#labels-grid)" />
      <line className="axis" x1="0" y1="232" x2="445" y2="232" />
      <line className="axis" x1="192" y1="0" x2="192" y2="463" />
      {projections ? (
        <>
          <line
            className="projection"
            x1={mapped.x}
            y1={mapped.y}
            x2={mapped.x}
            y2="232"
          />
          <line
            className="projection"
            x1="192"
            y1={mapped.y}
            x2={mapped.x}
            y2={mapped.y}
          />
          <line
            className="label-radius-line"
            x1="192"
            y1="232"
            x2={mapped.x}
            y2={mapped.y}
          />
        </>
      ) : null}
      <circle
        data-testid="dynamic-label-point-handle"
        cx={mapped.x}
        cy={mapped.y}
        r="7"
        onPointerDown={(event) => {
          dragging.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
      />
      <text className="p-label" x={mapped.x + 8} y={mapped.y - 8}>
        P
      </text>
      <g
        className="dynamic-callout"
        transform={`translate(${Math.min(mapped.x + 26, 268)} ${Math.max(mapped.y - 103, 18)})`}
      >
        <rect width="170" height="63" rx="8" />
        <text x="14" y="25">
          {label.split(/, distance| \| d| -> distance/)[0]}
        </text>
        <text x="14" y="48">
          {label.includes("distance")
            ? `distance from origin = ${formatDistance(point)}`
            : label.includes("d =")
              ? `d = ${formatDistance(point)}`
              : ""}
        </text>
      </g>
      {Array.from({ length: 13 }, (_, index) => index - 6).map((value) => (
        <text className="tick" key={value} x={188 + value * 32} y="250">
          {value}
        </text>
      ))}
      {Array.from({ length: 13 }, (_, index) => index - 6)
        .filter(Boolean)
        .map((value) => (
          <text className="tick" key={`y-${value}`} x="176" y={236 - value * 32}>
            {value}
          </text>
        ))}
    </svg>
  );
}
function PreviewGraph({ label }: { label: string }) {
  return (
    <div className="preview-graph">
      <span className="axis x" />
      <span className="axis y" />
      <i>●</i>
      <b>P</b>
      <output>{label}</output>
    </div>
  );
}
