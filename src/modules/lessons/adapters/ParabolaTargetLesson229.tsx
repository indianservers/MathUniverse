import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Copy,
  Expand,
  Eye,
  Hand,
  Lightbulb,
  Minus,
  MousePointer2,
  Plus,
  RotateCcw,
  Scale,
  Share2,
  Sigma,
  Wrench,
} from "lucide-react";
import {
  useEffect,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import type { LessonAdapterProps } from "../types";

type Point = { x: number; y: number };
type Drag = "focus" | "directrix" | "point" | null;
type Tool = "select" | "pan";

const initialFocus = { x: 0, y: 2 };
const initialDirectrix = -2;
const initialTraceX = 2.83;

export default function ParabolaTargetLesson229({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [focus, setFocus] = useState<Point>(initialFocus);
  const [directrix, setDirectrix] = useState(initialDirectrix);
  const [traceX, setTraceX] = useState(initialTraceX);
  const [drag, setDrag] = useState<Drag>(null);
  const [tool, setTool] = useState<Tool>("select");
  const [zoom, setZoom] = useState(1);
  const [showAxes, setShowAxes] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showTrace, setShowTrace] = useState(true);
  const [primaryStage, setPrimaryStage] = useState(0);
  const [section, setSection] = useState(0);
  const [shared, setShared] = useState(false);
  const [practiceFocus, setPracticeFocus] = useState<Point>({ x: -1, y: 3 });
  const [practiceDirectrix, setPracticeDirectrix] = useState(-1);
  const [practiceFeedback, setPracticeFeedback] = useState<
    "idle" | "correct" | "incorrect"
  >("idle");

  const model = parabolaModel(focus, directrix);
  const traceY =
    model.vertex.y + (traceX - model.vertex.x) ** 2 / (4 * model.p);
  const point = { x: traceX, y: traceY };
  const foot = { x: traceX, y: directrix };
  const focusDistance = distance(point, focus);
  const directrixDistance = Math.abs(point.y - directrix);

  const reset = () => {
    setFocus(initialFocus);
    setDirectrix(initialDirectrix);
    setTraceX(initialTraceX);
    setDrag(null);
    setTool("select");
    setZoom(1);
    setShowAxes(true);
    setShowGrid(true);
    setShowTrace(true);
    onInteraction();
  };
  useEffect(() => {
    setFocus(initialFocus);
    setDirectrix(initialDirectrix);
    setTraceX(initialTraceX);
    setDrag(null);
    setTool("select");
    setZoom(1);
    setShowAxes(true);
    setShowGrid(true);
    setShowTrace(true);
  }, [resetToken]);
  const updateFocus = (value: Point) => {
    const y = Math.max(directrix + 0.2, clamp(value.y, -6, 8));
    setFocus({ x: clamp(value.x, -6, 6), y });
    onInteraction();
  };
  const updateDirectrix = (value: number) => {
    setDirectrix(Math.min(focus.y - 0.2, clamp(value, -8, 6)));
    onInteraction();
  };
  const updateTraceY = (value: number) => {
    const y = Math.max(model.vertex.y, value);
    const magnitude = Math.sqrt(
      Math.max(0, 4 * model.p * (y - model.vertex.y)),
    );
    setTraceX(
      model.vertex.x + Math.sign(traceX - model.vertex.x || 1) * magnitude,
    );
    onInteraction();
  };
  const share = async () => {
    try {
      await navigator.clipboard?.writeText(
        `Parabola: (x-${format(model.vertex.x)})²=${(4 * model.p).toFixed(2)}(y-${format(model.vertex.y)}); focus (${format(focus.x)},${format(focus.y)}), directrix y=${format(directrix)}`,
      );
    } catch {
      /* Visible confirmation remains available. */
    }
    setShared(true);
    window.setTimeout(() => setShared(false), 1500);
    onInteraction();
  };
  const checkPractice = () => {
    setPracticeFeedback(
      Math.abs(practiceFocus.x + 1) <= 0.02 &&
        Math.abs(practiceFocus.y - 3) <= 0.02 &&
        Math.abs(practiceDirectrix + 1) <= 0.02
        ? "correct"
        : "incorrect",
    );
    onInteraction();
  };
  const resetPractice = () => {
    setPracticeFocus({ x: 0, y: 2 });
    setPracticeDirectrix(-2);
    setPracticeFeedback("idle");
    onInteraction();
  };

  return (
    <section
      className="target-parabola-page text-slate-900"
      data-testid="dynamic-geometry-mockup-0286"
      data-dedicated-lesson="229"
      data-object-model="focus-directrix-equal-distance-parabola"
      aria-label="Parabola dedicated interactive geometry model"
    >
      <span className="sr-only">Live Verification. Check Construction.</span>
      <header className="target-parabola-header">
        <div>
          <div>
            <span>Geometry</span>
            <span>Dynamic Geometry Constructions</span>
          </div>
          <h1>Parabola</h1>
          <p>Explore focus-directrix loci.</p>
          <section>
            <span>Level: Foundational–Advanced</span>
            <span>Tool: Construction Studio</span>
            <span>Focus: 2D Geometry</span>
            <span>Est. time: 6–10 min</span>
          </section>
        </div>
        <div>
          <nav aria-label="Primary lesson stages">
            {[
              [<Eye />, "Observe"],
              [<Hand />, "Manipulate"],
              [<Lightbulb />, "Notice"],
              [<Scale />, "Rule"],
              [<Check />, "Try"],
            ].map(([icon, label], index) => (
              <button
                key={String(label)}
                type="button"
                className={primaryStage === index ? "is-active" : ""}
                onClick={() => {
                  setPrimaryStage(index);
                  onInteraction();
                }}
              >
                {icon as ReactNode}
                <b>
                  {index + 1} {label}
                </b>
              </button>
            ))}
          </nav>
          <section>
            <button type="button">English (English)</button>
            <button type="button" onClick={reset}>
              <RotateCcw /> Reset
            </button>
            <button type="button" onClick={() => void share()}>
              <Share2 />
              {shared ? "Copied" : "Share"}
            </button>
          </section>
        </div>
      </header>
      <section className="target-parabola-shell">
        <nav className="target-parabola-tabs" aria-label="Lesson sections">
          {[
            [<Eye />, "Explore"],
            [<BookOpen />, "Understand"],
            [<Lightbulb />, "Examples"],
            [<Sigma />, "Practice"],
            [<Wrench />, "Summary"],
          ].map(([icon, label], index) => (
            <button
              key={String(label)}
              type="button"
              className={section === index ? "is-active" : ""}
              onClick={() => {
                setSection(index);
                onInteraction();
              }}
            >
              {icon as ReactNode}
              {label}
            </button>
          ))}
        </nav>
        <section className="target-parabola-workspace">
          <article className="target-parabola-plot">
            <header>
              <h2>Explore the construction</h2>
              <div>
                <button
                  type="button"
                  className={showAxes ? "is-active" : ""}
                  onClick={() => {
                    setShowAxes((value) => !value);
                    onInteraction();
                  }}
                >
                  Axes
                </button>
                <button
                  type="button"
                  className={showGrid ? "is-active" : ""}
                  onClick={() => {
                    setShowGrid((value) => !value);
                    onInteraction();
                  }}
                >
                  Grid
                </button>
                <button
                  type="button"
                  className={showTrace ? "is-active" : ""}
                  onClick={() => {
                    setShowTrace((value) => !value);
                    onInteraction();
                  }}
                >
                  Trace
                </button>
                <button
                  type="button"
                  aria-label="Fullscreen parabola"
                  onClick={() =>
                    void document.documentElement.requestFullscreen?.()
                  }
                >
                  <Expand />
                </button>
              </div>
            </header>
            <div className="target-parabola-legend">
              <span>
                <i />
                Focus F ({format(focus.x)}, {format(focus.y)})
              </span>
              <span>
                <i />
                Directrix y = {format(directrix)}
              </span>
              <span>
                <i />
                Trace point P ({format(point.x)}, {format(point.y)})
              </span>
            </div>
            <ParabolaPlot
              focus={focus}
              directrix={directrix}
              point={point}
              foot={foot}
              model={model}
              drag={drag}
              tool={tool}
              zoom={zoom}
              showAxes={showAxes}
              showGrid={showGrid}
              showTrace={showTrace}
              onDrag={setDrag}
              onFocus={updateFocus}
              onDirectrix={updateDirectrix}
              onTrace={(value) => {
                setTraceX(value);
                onInteraction();
              }}
            />
            <footer>
              <span>
                x: {point.x.toFixed(2)} y: {point.y.toFixed(2)}
              </span>
              <div>
                <button
                  type="button"
                  className={tool === "select" ? "is-active" : ""}
                  aria-label="Select parabola point"
                  onClick={() => setTool("select")}
                >
                  <MousePointer2 />
                </button>
                <button
                  type="button"
                  className={tool === "pan" ? "is-active" : ""}
                  aria-label="Pan parabola"
                  onClick={() => setTool("pan")}
                >
                  <Hand />
                </button>
                <button
                  type="button"
                  aria-label="Zoom in parabola"
                  onClick={() => {
                    setZoom((value) => clamp(value + 0.2, 0.7, 1.8));
                    onInteraction();
                  }}
                >
                  <Plus />
                </button>
                <button
                  type="button"
                  aria-label="Zoom out parabola"
                  onClick={() => {
                    setZoom((value) => clamp(value - 0.2, 0.7, 1.8));
                    onInteraction();
                  }}
                >
                  <Minus />
                </button>
                <button
                  type="button"
                  aria-label="Fit parabola"
                  onClick={() => {
                    setZoom(1);
                    onInteraction();
                  }}
                >
                  <Expand />
                </button>
                <button
                  type="button"
                  aria-label="Copy parabola equation"
                  onClick={() => void share()}
                >
                  <Copy />
                </button>
              </div>
            </footer>
          </article>
          <aside className="target-parabola-controls">
            <section>
              <h2>Objects</h2>
              <p>Drag to move. Values update automatically.</p>
            </section>
            <PointEditor
              title="Focus F (h, k)"
              color="#2468e5"
              point={focus}
              prefix="Parabola focus"
              onChange={updateFocus}
            />
            <section className="target-parabola-directrix">
              <h3>
                Directrix <em>y = d</em>
                <i />
              </h3>
              <label>
                d
                <input
                  type="number"
                  aria-label="Parabola directrix"
                  step="0.1"
                  value={directrix.toFixed(2)}
                  onChange={(event) =>
                    updateDirectrix(Number(event.target.value))
                  }
                />
              </label>
            </section>
            <PointEditor
              title="Trace point P (x, y)"
              color="#f97316"
              point={point}
              prefix="Parabola trace"
              onChange={(value) => {
                setTraceX(value.x);
                updateTraceY(value.y);
              }}
            />
            <button type="button" onClick={() => setTraceX(initialTraceX)}>
              Reset P to parabola
            </button>
            <section className="target-parabola-observation">
              <h3>
                <Check /> Observation
              </h3>
              <div>
                FP = d(P, directrix)
                <br />
                <b data-testid="parabola-distance-equality">
                  {focusDistance.toFixed(2)} = {directrixDistance.toFixed(2)}
                </b>
              </div>
              <p>
                Every point P on the curve is equidistant from the focus and the
                directrix.
              </p>
            </section>
          </aside>
        </section>
        <section className="target-parabola-learning">
          <article>
            <h2>Construction steps</h2>
            {[
              "Place a focus F above the directrix.",
              "Draw a directrix (horizontal line).",
              "Locate a point P not on the directrix.",
              "Drop a perpendicular from P to the directrix.",
              "Adjust P so that FP equals the perpendicular distance.",
            ].map((text, index) => (
              <p key={text}>
                <b>{index + 1}</b>
                {text}
              </p>
            ))}
            <strong>The locus traced by P is a parabola.</strong>
          </article>
          <article>
            <h2>Definition & rule</h2>
            <p>
              A parabola is the set of all points in a plane that are
              equidistant from a fixed point (focus) and a fixed line
              (directrix).
            </p>
            <div>
              <b>Distance rule</b>FP = d(P, directrix)
            </div>
            <p>
              For a horizontal directrix y=d, the parabola opens up when focus y
              is above d.
            </p>
          </article>
          <article>
            <h2>Equation (this configuration)</h2>
            <p>Focus F(h, fᵧ) and directrix y=d</p>
            <div>
              (x − h)² = 4p(y − k)<small>where p = (fᵧ−d)/2</small>
            </div>
            <p>
              Here: h={format(model.vertex.x)}, k={format(model.vertex.y)}, d=
              {format(directrix)}, p={model.p.toFixed(2)}
            </p>
            <strong>
              Equation: (x − {format(model.vertex.x)})² ={" "}
              {(4 * model.p).toFixed(2)}(y − {format(model.vertex.y)})
            </strong>
          </article>
        </section>
        <section className="target-parabola-practice">
          <h2>Practice: Build your own parabola</h2>
          <p>
            Set the focus and directrix to match the target equation. Then check
            your construction.
          </p>
          <div>
            <section>
              <b>Target equation</b>
              <strong>(x + 1)² = 8(y − 1)</strong>
            </section>
            <PointEditor
              title="Focus F(h, k)"
              color="#2468e5"
              point={practiceFocus}
              prefix="Practice parabola focus"
              onChange={(value) => {
                setPracticeFocus(value);
                setPracticeFeedback("idle");
              }}
              compact
            />
            <section className="target-parabola-practice-directrix">
              <b>
                Directrix <em>y = d</em>
              </b>
              <label>
                d
                <input
                  type="number"
                  aria-label="Practice parabola directrix"
                  value={practiceDirectrix.toFixed(2)}
                  onChange={(event) => {
                    setPracticeDirectrix(Number(event.target.value));
                    setPracticeFeedback("idle");
                  }}
                />
              </label>
            </section>
            <section className="target-parabola-practice-actions">
              <button type="button" onClick={checkPractice}>
                Check
              </button>
              <button type="button" onClick={resetPractice}>
                Reset
              </button>
              <output role="status" className={`is-${practiceFeedback}`}>
                {practiceFeedback === "correct"
                  ? "Construction correct."
                  : practiceFeedback === "incorrect"
                    ? "Match the focus and directrix."
                    : ""}
              </output>
            </section>
            <section className="target-parabola-checklist">
              <b>Checklist</b>
              <p>
                Focus at (−1, 3){" "}
                <CheckState
                  okay={
                    Math.abs(practiceFocus.x + 1) < 0.02 &&
                    Math.abs(practiceFocus.y - 3) < 0.02
                  }
                />
              </p>
              <p>
                Directrix y = −1{" "}
                <CheckState okay={Math.abs(practiceDirectrix + 1) < 0.02} />
              </p>
              <p>
                Parabola opens upward{" "}
                <CheckState okay={practiceFocus.y > practiceDirectrix} />
              </p>
            </section>
          </div>
        </section>
      </section>
      <nav className="target-parabola-nav" aria-label="Adjacent lessons">
        <a href="/lessons/geometry/228-hyperbola">
          <ArrowLeft />
          <span>
            <b>Previous</b>Hyperbola
          </span>
        </a>
        <a href="/lessons/geometry/230-distance-length">
          <span>
            <b>Next</b>Distance / Length
          </span>
          <ArrowRight />
        </a>
      </nav>
    </section>
  );
}

function ParabolaPlot({
  focus,
  directrix,
  point,
  foot,
  model,
  drag,
  tool,
  zoom,
  showAxes,
  showGrid,
  showTrace,
  onDrag,
  onFocus,
  onDirectrix,
  onTrace,
}: {
  focus: Point;
  directrix: number;
  point: Point;
  foot: Point;
  model: ReturnType<typeof parabolaModel>;
  drag: Drag;
  tool: Tool;
  zoom: number;
  showAxes: boolean;
  showGrid: boolean;
  showTrace: boolean;
  onDrag: (value: Drag) => void;
  onFocus: (value: Point) => void;
  onDirectrix: (value: number) => void;
  onTrace: (value: number) => void;
}) {
  const sx = 35 * zoom,
    sy = 22 * zoom,
    origin = { x: 245, y: 225 };
  const screen = (value: Point) => ({
    x: origin.x + value.x * sx,
    y: origin.y - value.y * sy,
  });
  const f = screen(focus),
    p = screen(point),
    q = screen(foot),
    directrixY = origin.y - directrix * sy;
  const domain = (svg: SVGSVGElement, clientX: number, clientY: number) => {
    const value = svg.createSVGPoint();
    value.x = clientX;
    value.y = clientY;
    const local = value.matrixTransform(svg.getScreenCTM()?.inverse());
    return { x: (local.x - origin.x) / sx, y: (origin.y - local.y) / sy };
  };
  const move = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!drag) return;
    const next = domain(event.currentTarget, event.clientX, event.clientY);
    if (drag === "focus") onFocus(next);
    else if (drag === "directrix") onDirectrix(next.y);
    else onTrace(next.x);
  };
  const curve = Array.from({ length: 161 }, (_, index) => {
    const x = model.vertex.x - 7 + (index * 14) / 160;
    const y = model.vertex.y + (x - model.vertex.x) ** 2 / (4 * model.p);
    return `${origin.x + x * sx},${origin.y - y * sy}`;
  }).join(" ");
  return (
    <svg
      role="img"
      aria-label="Interactive focus-directrix parabola with draggable focus directrix and trace point"
      viewBox="0 0 490 465"
      onPointerMove={move}
      onPointerUp={() => onDrag(null)}
      onPointerCancel={() => onDrag(null)}
    >
      <defs>
        <pattern
          id="parabola-grid"
          width={sx}
          height={sy}
          patternUnits="userSpaceOnUse"
        >
          <path d={`M${sx} 0H0V${sy}`} fill="none" stroke="#e2e8f0" />
        </pattern>
      </defs>
      <rect
        data-testid="parabola-grid"
        width="490"
        height="465"
        fill={showGrid ? "url(#parabola-grid)" : "white"}
      />
      {showAxes && (
        <g data-testid="parabola-axes">
          <line x1="8" x2="482" y1={origin.y} y2={origin.y} stroke="#334155" />
          <line x1={origin.x} x2={origin.x} y1="8" y2="457" stroke="#334155" />
        </g>
      )}
      <polyline
        data-testid="parabola-locus"
        data-p={model.p.toFixed(6)}
        data-vertex-y={model.vertex.y.toFixed(6)}
        points={curve}
        fill="none"
        stroke="#168ddd"
        strokeWidth="2.5"
      />
      <line
        data-testid="parabola-directrix-handle"
        x1="8"
        x2="482"
        y1={directrixY}
        y2={directrixY}
        stroke="rgba(0,0,0,0.001)"
        strokeWidth="16"
        pointerEvents="stroke"
        onPointerDown={() => onDrag("directrix")}
        onPointerMove={(event) => {
          if (event.buttons === 1 && event.currentTarget.ownerSVGElement) {
            onDirectrix(
              domain(
                event.currentTarget.ownerSVGElement,
                event.clientX,
                event.clientY,
              ).y,
            );
          }
        }}
      />
      <line
        data-testid="parabola-directrix-line"
        x1="8"
        x2="482"
        y1={directrixY}
        y2={directrixY}
        stroke="#9b4de4"
        strokeWidth="2"
        pointerEvents="none"
      />
      <text x="20" y={directrixY + 18} fill="#7e22ce" fontSize="11">
        y = {format(directrix)}
      </text>
      {showTrace && (
        <g data-testid="parabola-trace">
          <line
            x1={f.x}
            y1={f.y}
            x2={p.x}
            y2={p.y}
            stroke="#475569"
            strokeDasharray="4 3"
          />
          <line x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="#475569" />
          <path d={`M${q.x - 10} ${q.y}v-10h10`} fill="none" stroke="#475569" />
        </g>
      )}
      <circle
        data-testid="parabola-focus"
        cx={f.x}
        cy={f.y}
        r="7"
        fill="#2468e5"
        onPointerDown={() => onDrag("focus")}
      />
      <circle
        data-testid="parabola-point"
        data-x={point.x.toFixed(6)}
        cx={p.x}
        cy={p.y}
        r="8"
        fill="#f97316"
        stroke="#fff"
        strokeWidth="2"
        onPointerDown={() => {
          if (tool === "select") onDrag("point");
        }}
      />
      <text x={f.x + 10} y={f.y - 10} fill="#2468e5" fontSize="11">
        F ({format(focus.x)}, {format(focus.y)})
      </text>
      <text x={p.x + 10} y={p.y + 5} fill="#f97316" fontSize="11">
        P ({format(point.x)}, {format(point.y)})
      </text>
    </svg>
  );
}

function PointEditor({
  title,
  color,
  point,
  prefix,
  onChange,
  compact = false,
}: {
  title: string;
  color: string;
  point: Point;
  prefix: string;
  onChange: (value: Point) => void;
  compact?: boolean;
}) {
  return (
    <section
      className={`target-parabola-point-editor ${compact ? "is-compact" : ""}`}
    >
      <h3>
        {title}
        <i style={{ background: color }} />
      </h3>
      <div>
        <label>
          x
          <input
            type="number"
            aria-label={`${prefix} x`}
            step="0.1"
            value={point.x.toFixed(2)}
            onChange={(event) =>
              onChange({ ...point, x: Number(event.target.value) })
            }
          />
        </label>
        <label>
          y
          <input
            type="number"
            aria-label={`${prefix} y`}
            step="0.1"
            value={point.y.toFixed(2)}
            onChange={(event) =>
              onChange({ ...point, y: Number(event.target.value) })
            }
          />
        </label>
      </div>
    </section>
  );
}
function CheckState({ okay }: { okay: boolean }) {
  return <i className={okay ? "is-ok" : ""}>{okay && <Check />}</i>;
}
function parabolaModel(focus: Point, directrix: number) {
  const p = Math.max(0.1, (focus.y - directrix) / 2);
  return { p, vertex: { x: focus.x, y: (focus.y + directrix) / 2 } };
}
function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}
function format(value: number) {
  return Math.abs(value) < 0.005 ? "0.00" : value.toFixed(2);
}
