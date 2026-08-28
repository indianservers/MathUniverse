import {
  AlertTriangle,
  CircleHelp,
  Lightbulb,
  RotateCcw,
  Trophy,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import type { LessonAdapterProps } from "../types";
import "./CombinedTransformationsTargetLesson162.css";

type TransformKey = "h" | "a" | "k";
type Tab = "Explore" | "Explain" | "Examples" | "Practice" | "Summary";
const TRANSFORM_LABELS: Record<TransformKey, { title: string; rule: string }> =
  {
    h: { title: "Shift right by h", rule: "x → x + h" },
    a: { title: "Vertical stretch by a", rule: "y → a · y" },
    k: { title: "Shift up/down by k", rule: "y → y + k" },
  };
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const snap = (value: number, step = 1) => Math.round(value / step) * step;
const tidy = (value: number, places = 2) => {
  const rounded = Math.round(value * 10 ** places) / 10 ** places;
  return Object.is(rounded, -0) ? "0" : String(rounded);
};
const signed = (value: number) =>
  value === 0
    ? ""
    : value > 0
      ? ` + ${tidy(value)}`
      : ` - ${tidy(Math.abs(value))}`;

function effectiveShift(order: TransformKey[], a: number, k: number) {
  let yScale = 1;
  let yShift = 0;
  order.forEach((key) => {
    if (key === "a") {
      yScale *= a;
      yShift *= a;
    }
    if (key === "k") yShift += k;
  });
  return { yScale, yShift };
}

function transformPoint(
  x: number,
  h: number,
  a: number,
  k: number,
  order: TransformKey[],
) {
  const stages = [{ x, y: x * x, label: "Parent" }];
  order.forEach((key) => {
    const previous = stages.at(-1)!;
    stages.push({
      x: key === "h" ? previous.x + h : previous.x,
      y:
        key === "a"
          ? previous.y * a
          : key === "k"
            ? previous.y + k
            : previous.y,
      label:
        key === "h" ? "After x-shift" : key === "a" ? "After stretch" : "Final",
    });
  });
  stages[stages.length - 1].label = "Final";
  return stages;
}

function CombinedGraph({
  h,
  a,
  effectiveK,
  showPoints,
  showGrid,
  zoom,
  onH,
  onK,
  onInteraction,
}: {
  h: number;
  a: number;
  effectiveK: number;
  showPoints: boolean;
  showGrid: boolean;
  zoom: number;
  onH: (value: number) => void;
  onK: (value: number) => void;
  onInteraction: () => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const width = 440;
  const height = 390;
  const centerX = 205;
  const centerY = 215;
  const unit = 32 * zoom;
  const px = (x: number) => centerX + x * unit;
  const py = (y: number) => centerY - y * unit;
  const curve = (fn: (x: number) => number) => {
    const points: string[] = [];
    for (let index = 0; index <= 360; index += 1) {
      const x = -7 + index / 24;
      const y = fn(x);
      if (y < -6.2 / zoom || y > 6.2 / zoom) continue;
      points.push(
        `${points.length ? "L" : "M"}${px(x).toFixed(2)},${py(y).toFixed(2)}`,
      );
    }
    return points.join(" ");
  };
  const parentPath = useMemo(() => curve((x) => x * x), [zoom]); // eslint-disable-line react-hooks/exhaustive-deps
  const shiftedPath = useMemo(
    () => curve((x) => (x - h) ** 2),
    [h, zoom], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const finalPath = useMemo(
    () => curve((x) => a * (x - h) ** 2 + effectiveK),
    [a, effectiveK, h, zoom], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const updateVertex = (event: PointerEvent<SVGCircleElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const box = svg.getBoundingClientRect();
    const svgX = ((event.clientX - box.left) / box.width) * width;
    const svgY = ((event.clientY - box.top) / box.height) * height;
    onH(snap(clamp((svgX - centerX) / unit, -6, 6)));
    onK(snap(clamp((centerY - svgY) / unit, -6, 6)));
  };
  const vertexKey = (event: KeyboardEvent<SVGCircleElement>) => {
    if (
      !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)
    )
      return;
    event.preventDefault();
    if (event.key === "ArrowLeft") onH(clamp(h - 1, -6, 6));
    if (event.key === "ArrowRight") onH(clamp(h + 1, -6, 6));
    if (event.key === "ArrowUp") onK(clamp(effectiveK + 1, -6, 6));
    if (event.key === "ArrowDown") onK(clamp(effectiveK - 1, -6, 6));
  };
  return (
    <svg
      ref={svgRef}
      className={`ct162-graph ${showGrid ? "" : "no-grid"}`}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Parent, shifted, and combined transformed parabolas"
      onPointerDown={onInteraction}
    >
      <defs>
        <pattern
          id="ct162-grid"
          width={unit}
          height={unit}
          patternUnits="userSpaceOnUse"
        >
          <path d={`M${unit} 0H0V${unit}`} fill="none" stroke="#e5ebf1" />
        </pattern>
        <marker
          id="ct162-axis-arrow"
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0 0 6 3 0 6Z" fill="#273650" />
        </marker>
      </defs>
      <rect
        width={width}
        height={height}
        className="grid"
        fill="url(#ct162-grid)"
      />
      <line
        x1="5"
        x2="435"
        y1={centerY}
        y2={centerY}
        className="axis"
        markerEnd="url(#ct162-axis-arrow)"
      />
      <line
        x1={centerX}
        x2={centerX}
        y1="386"
        y2="5"
        className="axis"
        markerEnd="url(#ct162-axis-arrow)"
      />
      <text x="425" y={centerY - 9} className="axis-label">
        x
      </text>
      <text x={centerX + 9} y="16" className="axis-label">
        y
      </text>
      {[-6, -4, -2, 0, 2, 4, 6].map((tick) => (
        <text
          key={`x-${tick}`}
          x={px(tick)}
          y={centerY + 21}
          textAnchor="middle"
          className="tick"
        >
          {tick}
        </text>
      ))}
      {[-6, -4, -2, 2, 4, 6].map((tick) => (
        <text
          key={`y-${tick}`}
          x={centerX - 12}
          y={py(tick) + 4}
          textAnchor="end"
          className="tick"
        >
          {tick}
        </text>
      ))}
      <path d={parentPath} className="parent" />
      <path d={shiftedPath} className="shifted" />
      <path d={finalPath} className="final" />
      {showPoints && (
        <>
          <circle cx={px(0)} cy={py(0)} r="4" className="parent-point" />
          <circle cx={px(h)} cy={py(0)} r="4" className="shift-point" />
          <circle
            cx={px(h)}
            cy={py(effectiveK)}
            r="6"
            className="final-point"
          />
          <g className="vertex-label">
            <rect
              x={px(h) - 130}
              y={py(effectiveK) - 13}
              width="57"
              height="43"
              rx="7"
            />
            <text x={px(h) - 101} y={py(effectiveK) + 4} textAnchor="middle">
              Vertex
            </text>
            <text x={px(h) - 101} y={py(effectiveK) + 20} textAnchor="middle">
              ({h}, {tidy(effectiveK)})
            </text>
          </g>
        </>
      )}
      <circle
        cx={px(h)}
        cy={py(effectiveK)}
        r="15"
        className="drag-vertex"
        role="slider"
        tabIndex={0}
        aria-label="Drag final vertex"
        aria-valuemin={-6}
        aria-valuemax={6}
        aria-valuenow={h}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          updateVertex(event);
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId))
            updateVertex(event);
        }}
        onKeyDown={vertexKey}
      />
    </svg>
  );
}

export default function CombinedTransformationsTargetLesson162({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [h, setH] = useState(1),
    [a, setA] = useState(2),
    [k, setK] = useState(-2),
    [order, setOrder] = useState<TransformKey[]>(["h", "a", "k"]),
    [dragged, setDragged] = useState<TransformKey | null>(null),
    [pointX, setPointX] = useState(-1),
    [showPoints, setShowPoints] = useState(true),
    [showGrid, setShowGrid] = useState(true),
    [zoom, setZoom] = useState(1),
    [tab, setTab] = useState<Tab>("Explore"),
    [answer, setAnswer] = useState(""),
    [feedback, setFeedback] = useState(""),
    [hint, setHint] = useState(false);
  const act = () => onInteraction();
  const updateH = (value: number) => {
    setH(snap(clamp(value, -6, 6)));
    act();
  };
  const updateA = (value: number) => {
    const next = snap(clamp(value, -3, 3), 0.5);
    setA(Math.abs(next) < 0.5 ? 0.5 : next);
    act();
  };
  const updateK = (value: number) => {
    setK(snap(clamp(value, -6, 6)));
    act();
  };
  const reset = (notify = true) => {
    setH(1);
    setA(2);
    setK(-2);
    setOrder(["h", "a", "k"]);
    setPointX(-1);
    setShowPoints(true);
    setShowGrid(true);
    setZoom(1);
    setTab("Explore");
    setAnswer("");
    setFeedback("");
    setHint(false);
    if (notify) act();
  };
  useEffect(() => reset(false), [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps
  const effective = effectiveShift(order, a, k),
    stages = transformPoint(pointX, h, a, k, order);
  const moveOrder = (from: TransformKey, to: TransformKey) => {
    if (from === to) return;
    setOrder((current) => {
      const next = current.filter((key) => key !== from);
      next.splice(next.indexOf(to), 0, from);
      return next;
    });
    act();
  };
  const orderKey = (
    event: KeyboardEvent<HTMLButtonElement>,
    key: TransformKey,
  ) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    setOrder((current) => {
      const index = current.indexOf(key),
        nextIndex = clamp(
          index + (event.key === "ArrowRight" ? 1 : -1),
          0,
          current.length - 1,
        );
      if (index === nextIndex) return current;
      const next = [...current];
      next.splice(index, 1);
      next.splice(nextIndex, 0, key);
      return next;
    });
    act();
  };
  const check = () => {
    const normalized = answer.replace(/\s+/g, "").replace(/²/g, "^2");
    const match = normalized.match(
      /^y=([+-]?\d*\.?\d*)\(x-([+-]?\d*\.?\d+)\)\^2([+-]\d*\.?\d+)$/i,
    );
    if (!match) {
      setFeedback("Enter vertex form y = a(x - h)^2 + k");
      act();
      return;
    }
    const parsedA =
        match[1] === "" ? 1 : match[1] === "-" ? -1 : Number(match[1]),
      parsedH = Number(match[2]),
      parsedK = Number(match[3]);
    setFeedback(
      parsedH === 2 && parsedK === -1 && parsedA !== 0
        ? "Correct: vertex (2, -1)."
        : "Not yet: set h = 2, k = -1, and a ≠ 0.",
    );
    act();
  };
  return (
    <div
      className="ct162-page"
      data-testid="graph-mockup-0219"
      data-dedicated-lesson="162"
      data-object-model="editable-combined-horizontal-shift-vertical-scale-and-shift-reorderable-transformation-pipeline-pointer-keyboard-draggable-vertex-generated-parent-step-final-parabolas-point-trace-tabs-practice-and-navigation"
      data-h={h}
      data-a={a}
      data-k={k}
      data-effective-k={effective.yShift}
      data-order={order.join(",")}
      data-point-x={pointX}
      data-final-point-x={stages.at(-1)!.x}
      data-final-point-y={stages.at(-1)!.y}
      data-tab={tab}
      data-zoom={zoom}
    >
      <section className="ct162-primary">
        <header className="ct162-header">
          <div>
            <b>GRAPHS &amp; FUNCTIONS</b>
            <b>FUNCTION TRANSFORMATIONS</b>
          </div>
          <section>
            <h1>Combined Transformations</h1>
            <p>
              Learn how changes <u>inside</u> the function
              <br />
              act on x first, then outside changes act on y.
            </p>
          </section>
          <aside>
            <strong>
              y = {tidy(effective.yScale)}(x - {h})²{signed(effective.yShift)}
            </strong>
            <b>Transform x first, then y.</b>
          </aside>
          <ul>
            <li>
              Inside (x): shift left/right by <i>h</i>
            </li>
            <li>
              Outside (y): stretch by <i>a</i>, then
              <br />
              shift up/down by <i>k</i>.
            </li>
          </ul>
        </header>
        <nav className="ct162-tabs">
          {(
            ["Explore", "Explain", "Examples", "Practice", "Summary"] as Tab[]
          ).map((name, index) => (
            <button
              type="button"
              key={name}
              className={tab === name ? "active" : ""}
              onClick={() => {
                setTab(name);
                act();
              }}
            >
              <b>{name}</b>
              <small>
                {
                  [
                    "Interactive graph",
                    "Step-by-step",
                    "See it in action",
                    "Try it yourself",
                    "Key takeaways",
                  ][index]
                }
              </small>
            </button>
          ))}
        </nav>
        <section className="ct162-workspace">
          <article className="ct162-explorer">
            <h2>Graph Explorer</h2>
            <div className="ct162-legend">
              <span>
                <i />
                Parent: y = x²
              </span>
              <span>
                <i />
                Step (after x-shift)
              </span>
              <span>
                <i />
                Final: y = a(x-h)²+k
              </span>
            </div>
            <CombinedGraph
              h={h}
              a={effective.yScale}
              effectiveK={effective.yShift}
              showPoints={showPoints}
              showGrid={showGrid}
              zoom={zoom}
              onH={updateH}
              onK={(value) => {
                if (order.indexOf("k") < order.indexOf("a")) updateK(value / a);
                else updateK(value);
              }}
              onInteraction={act}
            />
            <footer>
              <label>
                <input
                  type="checkbox"
                  checked={showPoints}
                  onChange={(event) => {
                    setShowPoints(event.target.checked);
                    act();
                  }}
                />
                Show points
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={showGrid}
                  onChange={(event) => {
                    setShowGrid(event.target.checked);
                    act();
                  }}
                />
                Show grid
              </label>
              <nav>
                <button
                  type="button"
                  aria-label="Zoom out"
                  onClick={() => {
                    setZoom((value) => clamp(value - 0.1, 0.7, 1.3));
                    act();
                  }}
                >
                  <ZoomOut />
                </button>
                <button
                  type="button"
                  aria-label="Zoom in"
                  onClick={() => {
                    setZoom((value) => clamp(value + 0.1, 0.7, 1.3));
                    act();
                  }}
                >
                  <ZoomIn />
                </button>
                <button
                  type="button"
                  aria-label="Reset graph view"
                  onClick={() => {
                    setZoom(1);
                    act();
                  }}
                >
                  <RotateCcw />
                </button>
              </nav>
            </footer>
          </article>
          <aside className="ct162-builder">
            <h2>
              Build the transformation <CircleHelp />
            </h2>
            <section>
              <header>
                <i>1</i>
                <p>
                  <b>Inside:</b> change x (horizontal shift)
                  <strong>y = (x - h)²</strong>
                </p>
              </header>
              <label>
                <span>Horizontal shift, h</span>
                <input
                  type="range"
                  min="-6"
                  max="6"
                  step="1"
                  value={h}
                  aria-label="Horizontal shift h"
                  onChange={(event) => updateH(Number(event.target.value))}
                />
                <output>{h}</output>
                <small>
                  <i>
                    -6
                    <br />
                    Left
                  </i>
                  <i>
                    6<br />
                    Right
                  </i>
                </small>
              </label>
              <footer>
                <b>Step result:</b>
                <span>y = (x - {h})²</span>
                <small>Vertex at ({h}, 0)</small>
              </footer>
            </section>
            <section>
              <header>
                <i>2</i>
                <p>
                  <b>Outside:</b> change y (stretch &amp; vertical shift)
                  <strong>y = a(x - h)² + k</strong>
                </p>
              </header>
              <label>
                <span>Vertical stretch/compression, a</span>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step=".5"
                  value={a}
                  aria-label="Vertical scale a"
                  onChange={(event) => updateA(Number(event.target.value))}
                />
                <output>{a}</output>
                <small>
                  <i>-3</i>
                  <i>3</i>
                </small>
              </label>
              <label>
                <span>Vertical shift, k</span>
                <input
                  type="range"
                  min="-6"
                  max="6"
                  step="1"
                  value={k}
                  aria-label="Vertical shift k"
                  onChange={(event) => updateK(Number(event.target.value))}
                />
                <output>{k}</output>
                <small>
                  <i>-6</i>
                  <i>6</i>
                </small>
              </label>
              <footer>
                <b>Final equation</b>
                <strong>
                  y = {tidy(effective.yScale)}(x - {h})²
                  {signed(effective.yShift)}
                </strong>
                <small>
                  Vertex at ({h}, {tidy(effective.yShift)})
                </small>
              </footer>
            </section>
          </aside>
        </section>
        <section className="ct162-lower">
          <article className="ct162-order">
            <h2>
              Transformation order (drag to rearrange) <CircleHelp />
            </h2>
            <p>
              Inside transformations act on x first, then outside
              transformations act on y.
            </p>
            <div>
              {order.map((key, index) => (
                <span key={key}>
                  <button
                    type="button"
                    draggable
                    onDragStart={(event: DragEvent<HTMLButtonElement>) => {
                      setDragged(key);
                      event.dataTransfer.effectAllowed = "move";
                    }}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => {
                      if (dragged) moveOrder(dragged, key);
                      setDragged(null);
                    }}
                    onKeyDown={(event) => orderKey(event, key)}
                    aria-label={`${TRANSFORM_LABELS[key].title}, position ${index + 1}`}
                  >
                    <i>{index + 1}</i>
                    <b>{TRANSFORM_LABELS[key].title}</b>
                    <small>{TRANSFORM_LABELS[key].rule}</small>
                  </button>
                  {index < 2 && <em>→</em>}
                </span>
              ))}
            </div>
            <footer>
              <AlertTriangle />
              <b>Changing the order can change the result.</b>
              <button
                type="button"
                onClick={() => {
                  setOrder(["k", "a", "h"]);
                  act();
                }}
              >
                See why →
              </button>
            </footer>
          </article>
          <article className="ct162-point">
            <h2>
              See how a point moves <CircleHelp />
            </h2>
            <label>
              Track point on parent:
              <select
                aria-label="Tracked parent point"
                value={pointX}
                onChange={(event) => {
                  setPointX(Number(event.target.value));
                  act();
                }}
              >
                <option value="-1">(-1, 1)</option>
                <option value="0">(0, 0)</option>
                <option value="1">(1, 1)</option>
              </select>
            </label>
            <div>
              {stages.map((stage, index) => (
                <span key={`${stage.label}-${index}`}>
                  <b>{stage.label}</b>
                  <strong>
                    ({tidy(stage.x)}, {tidy(stage.y)})
                  </strong>
                </span>
              ))}
            </div>
            <footer>Points move with every step.</footer>
          </article>
        </section>
      </section>
      <section className="ct162-practice">
        <article>
          <div>
            <h2>Worked example</h2>
            <p>
              Write an equation with vertex at (2, -1) that is
              <br />
              vertical stretch by 3.
            </p>
            <ol>
              <li>
                Shift right by 2: <b>y = (x - 2)²</b>
              </li>
              <li>
                Vertical stretch by 3: <b>y = 3(x - 2)²</b>
              </li>
              <li>
                Shift down by 1: <b>y = 3(x - 2)² - 1</b>
              </li>
            </ol>
            <footer>
              <b>Final equation: y = 3(x - 2)² - 1</b>
              <span>Vertex: (2, -1)</span>
            </footer>
          </div>
          <svg
            viewBox="0 0 150 180"
            role="img"
            aria-label="Worked example parabola"
          >
            <path d="M12 104H142M65 10V171" />
            <path d="M38 14Q65 166 103 14" />
            <circle cx="78" cy="135" r="4" />
            <text x="82" y="150">
              (2, -1)
            </text>
          </svg>
        </article>
        <article>
          <div>
            <h2>Try it</h2>
            <p>
              <b>Move the vertex to (2, -1)</b>
            </p>
            <small>Your goal: vertex (2, -1)</small>
            <ul>
              <li>Set h = 2</li>
              <li>Set k = -1</li>
              <li>Choose any a ≠ 0</li>
              <li>Click “Check” to verify</li>
            </ul>
          </div>
          <aside>
            <Trophy />
            <span>(2, -1)</span>
          </aside>
          <label>
            Your equation
            <input
              aria-label="Try-it vertex equation"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder="y = a(x - h)² + k"
            />
            <button type="button" onClick={check}>
              Check
            </button>
          </label>
          {feedback && (
            <output className={feedback.startsWith("Correct") ? "correct" : ""}>
              {feedback}
            </output>
          )}
          <button
            type="button"
            className="hint"
            onClick={() => {
              setHint((value) => !value);
              act();
            }}
          >
            <Lightbulb />
            Hint
          </button>
          {hint && (
            <p className="hint-text">
              Use h = 2 and k = -1; any nonzero a keeps that vertex.
            </p>
          )}
        </article>
      </section>
      <nav className="ct162-nav">
        <a href="/lessons/graphs-and-functions/161-reflection-in-y-axis">
          <span>←</span>
          <p>
            <small>Previous</small>
            <b>Reflection in y-Axis</b>
          </p>
        </a>
        <a href="/lessons/graphs-and-functions/163-transformation-order">
          <p>
            <small>Next</small>
            <b>Transformation Order</b>
          </p>
          <span>→</span>
        </a>
      </nav>
      <footer className="ct162-footer">
        <b>Math Universe</b>
        <span>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </span>
        <small>
          © 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.
        </small>
      </footer>
    </div>
  );
}
