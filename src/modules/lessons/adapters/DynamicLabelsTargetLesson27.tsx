import { Lightbulb, RotateCcw, Share2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../types";
import { LessonCartesianGraph } from "../graphs/LessonCartesianGraph";
import { LessonPointPreview } from "../graphs/LessonPointPreview";
import "./DynamicLabelsTargetLesson27.css";
import { LessonTopicStudyBoard } from "../components/LessonTopicStudyBoard";


type Point = { x: number; y: number };
const GRAPH_VIEW = {
  xMin: -192 / 32,
  xMax: (445 - 192) / 32,
  yMin: (232 - 463) / 32,
  yMax: 232 / 32,
};
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
  const [graphView, setGraphView] = useState(GRAPH_VIEW);
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
    setGraphView(GRAPH_VIEW);
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
    setGraphView(GRAPH_VIEW);
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
      aria-label="Draggable point P with dynamic label"
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
              <LessonCartesianGraph
                title="Point P with dynamic label"
                view={graphView}
                onViewChange={setGraphView}
                onResetView={() => setGraphView(GRAPH_VIEW)}
                aspectRatio={445 / 463}
                series={
                  projections
                    ? [
                        {
                          id: "x-projection",
                          label: "x projection",
                          color: "#1788ef",
                          dashed: true,
                          dashPattern: "5 3",
                          points: [{ x: point.x, y: 0 }, point],
                        },
                        {
                          id: "y-projection",
                          label: "y projection",
                          color: "#1788ef",
                          dashed: true,
                          dashPattern: "5 3",
                          points: [{ x: 0, y: point.y }, point],
                        },
                        {
                          id: "distance",
                          label: "Distance from origin",
                          color: "#1788ef",
                          points: [{ x: 0, y: 0 }, point],
                        },
                      ]
                    : []
                }
                annotations={[
                  {
                    id: "p",
                    ...point,
                    label: labelFor(point),
                    color: "#078aa5",
                    testId: "dynamic-label-point-handle",
                    onChange: update,
                    keyboardStep: 1,
                  },
                ]}
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
                <LessonPointPreview
                  label={labelFor(preview)}
                  point={{ left: 59, top: 48 }}
                  axes={{ left: 40, top: 55 }}
                  color="#079bb7"
                />
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
      <LessonTopicStudyBoard lessonId={27} alwaysVisible onInteraction={onInteraction} />
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
        aria-label={label}
        aria-checked={value}
        className={value ? "active" : ""}
        onClick={onToggle}
      >
        <i />
      </button>
    </label>
  );
}
