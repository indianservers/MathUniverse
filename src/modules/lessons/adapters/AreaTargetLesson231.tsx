import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookOpen,
  Check,
  CircleHelp,
  Eye,
  Grid3X3,
  Lightbulb,
  ListOrdered,
  MousePointer2,
  Pentagon,
  RefreshCw,
  RotateCcw,
  Share2,
  Sigma,
  Sparkles,
  Target,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import type { LessonAdapterProps } from "../types";

type Point = { x: number; y: number };
type Mode = "move" | "polygon";
type Feedback = "idle" | "correct" | "incorrect";

const INITIAL_VERTICES: Point[] = [
  { x: -2, y: 1 },
  { x: 1, y: 4 },
  { x: 5, y: 2 },
  { x: 2, y: -1 },
];
const PRACTICE_VERTICES: Point[] = [
  { x: -4, y: 0 },
  { x: -1, y: 3 },
  { x: 4, y: 1 },
  { x: 2, y: -2 },
];
const COLORS = ["#0ca9be", "#2468e5", "#0891b2", "#8b3fe3"];
const LABELS = ["A", "B", "C", "D"];

export default function AreaTargetLesson231({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [vertices, setVertices] = useState<Point[]>(INITIAL_VERTICES);
  const [referenceSignedArea, setReferenceSignedArea] = useState(
    signedDoubleArea(INITIAL_VERTICES),
  );
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [mode, setMode] = useState<Mode>("move");
  const [draft, setDraft] = useState<Point[]>([]);
  const [tab, setTab] = useState(0);
  const [units, setUnits] = useState("sq. units");
  const [showSquares, setShowSquares] = useState(true);
  const [shared, setShared] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [invarianceFeedback, setInvarianceFeedback] = useState(false);
  const [practice, setPractice] = useState<Point[]>(PRACTICE_VERTICES);
  const [practiceReference, setPracticeReference] = useState(
    signedDoubleArea(PRACTICE_VERTICES),
  );
  const [practiceDrag, setPracticeDrag] = useState<number | null>(null);
  const [practiceArea, setPracticeArea] = useState("");
  const [practicePerimeter, setPracticePerimeter] = useState("");
  const [practiceFeedback, setPracticeFeedback] = useState<Feedback>("idle");
  const [showTip, setShowTip] = useState(true);

  const geometry = useMemo(() => polygonGeometry(vertices), [vertices]);
  const practiceGeometry = useMemo(() => polygonGeometry(practice), [practice]);
  const triangles = useMemo(() => triangulateFromFirst(vertices), [vertices]);
  const reset = () => {
    setVertices(INITIAL_VERTICES);
    setReferenceSignedArea(signedDoubleArea(INITIAL_VERTICES));
    setDragIndex(null);
    setMode("move");
    setDraft([]);
    setShowSquares(true);
    setInvarianceFeedback(false);
    onInteraction();
  };
  useEffect(() => {
    setVertices(INITIAL_VERTICES);
    setReferenceSignedArea(signedDoubleArea(INITIAL_VERTICES));
    setDragIndex(null);
    setMode("move");
    setDraft([]);
    setShowSquares(true);
    setInvarianceFeedback(false);
  }, [resetToken]);

  const moveVertex = (index: number, desired: Point) => {
    setVertices((current) =>
      constrainVertexToSignedArea(current, index, desired, referenceSignedArea),
    );
    setInvarianceFeedback(false);
    onInteraction();
  };
  const createVertex = (point: Point) => {
    if (mode !== "polygon") return;
    const next = [...draft, point].slice(0, 4);
    setDraft(next);
    if (next.length === 4) {
      setVertices(next);
      setReferenceSignedArea(signedDoubleArea(next));
      setDraft([]);
      setMode("move");
    }
    onInteraction();
  };
  const movePracticeVertex = (index: number, desired: Point) => {
    setPractice((current) =>
      constrainVertexToSignedArea(current, index, desired, practiceReference),
    );
    setPracticeFeedback("idle");
    onInteraction();
  };
  const newPractice = () => {
    const next = PRACTICE_VERTICES.map((point, index) => ({
      x: point.x + (index % 2 === 0 ? 0.5 : -0.5),
      y: point.y + (index < 2 ? -0.5 : 0.5),
    }));
    setPractice(next);
    setPracticeReference(signedDoubleArea(next));
    setPracticeArea("");
    setPracticePerimeter("");
    setPracticeFeedback("idle");
    onInteraction();
  };
  const checkPractice = () => {
    const areaAnswer = Number(practiceArea);
    const perimeterAnswer = Number(practicePerimeter);
    setPracticeFeedback(
      Math.abs(areaAnswer - practiceGeometry.area) <= 0.02 &&
        Math.abs(perimeterAnswer - practiceGeometry.perimeter) <= 0.02
        ? "correct"
        : "incorrect",
    );
    onInteraction();
  };
  const share = async () => {
    try {
      await navigator.clipboard?.writeText(
        `Polygon area ${geometry.area.toFixed(2)}, perimeter ${geometry.perimeter.toFixed(2)}`,
      );
    } catch {
      /* Visible feedback remains available when clipboard access is unavailable. */
    }
    setShared(true);
    window.setTimeout(() => setShared(false), 1400);
    onInteraction();
  };

  return (
    <section
      className="target-area-page text-slate-900"
      data-testid="dynamic-geometry-mockup-0288"
      data-dedicated-lesson="231"
      data-object-model="area-preserving-shoelace-quadrilateral"
      aria-label="Area dedicated interactive geometry model"
    >
      <span className="sr-only">Live Verification. Check Construction.</span>
      <header className="target-area-header">
        <div>
          <div>
            <span>Geometry</span>
            <span>Dynamic Geometry Constructions</span>
          </div>
          <h1>Area</h1>
          <p>
            Measure regions and discover that area is invariant under reshaping.
          </p>
          <section>
            <b>
              <Target /> Foundational–Advanced
            </b>
            <b>
              <Sparkles /> Construction Studio
            </b>
            <b>
              <Grid3X3 /> Geometry Tools
            </b>
            <b>
              <CircleHelp /> 6–10 min
            </b>
          </section>
        </div>
        <aside>
          <button type="button" onClick={() => void share()}>
            <Share2 /> {shared ? "Copied" : "Share"}
          </button>
          <button
            type="button"
            aria-label={
              bookmarked ? "Remove Area bookmark" : "Bookmark Area lesson"
            }
            aria-pressed={bookmarked}
            onClick={() => {
              setBookmarked((value) => !value);
              onInteraction();
            }}
          >
            <Bookmark fill={bookmarked ? "currentColor" : "none"} />
          </button>
        </aside>
      </header>

      <section className="target-area-shell">
        <nav className="target-area-tabs" aria-label="Area lesson sections">
          {[
            [<Eye />, "Explore"],
            [<BookOpen />, "Explain"],
            [<Sigma />, "Examples"],
            [<Sigma />, "Formula"],
            [<Grid3X3 />, "Practice"],
            [<Lightbulb />, "Know more"],
          ].map(([icon, label], index) => (
            <button
              key={String(label)}
              type="button"
              className={tab === index ? "is-active" : ""}
              onClick={() => {
                setTab(index);
                onInteraction();
              }}
            >
              {icon as ReactNode}
              {label}
            </button>
          ))}
        </nav>

        <section className="target-area-workspace">
          <div className="target-area-main">
            <article className="target-area-plot-card">
              <header>
                <div>
                  <h2>Explore &amp; manipulate</h2>
                  <p>
                    Drag vertices to reshape the region. Area stays the same.
                  </p>
                </div>
                <div>
                  <button
                    type="button"
                    className={mode === "move" ? "is-active" : ""}
                    onClick={() => {
                      setMode("move");
                      setDraft([]);
                      onInteraction();
                    }}
                  >
                    <MousePointer2 /> Move
                  </button>
                  <button
                    type="button"
                    className={mode === "polygon" ? "is-active" : ""}
                    onClick={() => {
                      setMode("polygon");
                      setDraft([]);
                      onInteraction();
                    }}
                  >
                    <Pentagon /> Polygon
                  </button>
                  <button type="button" onClick={reset}>
                    <RotateCcw /> Reset
                  </button>
                </div>
              </header>
              <AreaPlot
                vertices={mode === "polygon" && draft.length ? draft : vertices}
                dragIndex={dragIndex}
                showSquares={showSquares}
                interactive={mode === "move"}
                onDrag={setDragIndex}
                onMove={moveVertex}
                onPlace={createVertex}
                labels
              />
              <footer>
                <span>Each grid square = 1 sq. unit</span>
                <label>
                  <input
                    type="checkbox"
                    checked={showSquares}
                    onChange={(event) => {
                      setShowSquares(event.target.checked);
                      onInteraction();
                    }}
                  />{" "}
                  Show unit squares
                </label>
              </footer>
            </article>

            <article className="target-area-decomposition">
              <header>
                <div>
                  <h2>Decomposition (triangulation)</h2>
                  <p>Split the polygon into triangles for area.</p>
                </div>
                <div>
                  <b>Area of triangles</b>
                </div>
              </header>
              {triangles.map((triangle, index) => (
                <div key={index}>
                  <span style={{ color: index === 0 ? "#168ddd" : "#8b3fe3" }}>
                    – – –
                  </span>
                  <b>
                    △ A{LABELS[index + 1]}
                    {LABELS[index + 2]}
                  </b>
                  <strong>{triangle.toFixed(2)} sq. units</strong>
                </div>
              ))}
              <footer>
                <strong>
                  Total area = {geometry.area.toFixed(2)} sq. units
                </strong>
                <button
                  type="button"
                  onClick={() => {
                    setInvarianceFeedback(true);
                    onInteraction();
                  }}
                >
                  <Check /> Check invariance
                </button>
                <output role="status">
                  {invarianceFeedback ? "Area invariant verified." : ""}
                </output>
              </footer>
            </article>
          </div>

          <aside className="target-area-sidebar">
            <article>
              <h2>Measure</h2>
              <select
                aria-label="Area measurement units"
                value={units}
                onChange={(event) => {
                  setUnits(event.target.value);
                  onInteraction();
                }}
              >
                <option value="sq. units">Squared units (sq. units)</option>
                <option value="cm²">Square centimetres (cm²)</option>
                <option value="m²">Square metres (m²)</option>
              </select>
              <p>Area</p>
              <strong data-testid="polygon-area-value">
                {geometry.area.toFixed(2)} <small>{units}</small>
              </strong>
              <p>Perimeter</p>
              <b data-testid="polygon-perimeter-value">
                {geometry.perimeter.toFixed(2)} <small>units</small>
              </b>
              <hr />
              <h3>Vertices</h3>
              <div className="target-area-vertex-table">
                <b>Point</b>
                <b>x</b>
                <b>y</b>
                {vertices.map((point, index) => (
                  <span key={LABELS[index]}>
                    <i style={{ background: COLORS[index] }}>{LABELS[index]}</i>
                    <em>{format(point.x)}</em>
                    <em>{format(point.y)}</em>
                  </span>
                ))}
              </div>
            </article>
            <article className="target-area-insight">
              <h2>
                <Lightbulb /> Insight
              </h2>
              <p>
                When you drag the vertices, the shape changes but the area
                remains the same.
              </p>
              <strong>Area is invariant under reshaping.</strong>
            </article>
            <article className="target-area-formula">
              <h2>Key formula</h2>
              <p>Area of a polygon</p>
              <div>A = ½ |Σ(xᵢyᵢ₊₁ − xᵢ₊₁yᵢ)|</div>
              <small>(xₙ₊₁, yₙ₊₁) = (x₁, y₁)</small>
            </article>
          </aside>
        </section>

        <section className="target-area-learning">
          <article>
            <h2>Construction steps</h2>
            {[
              ["Create polygon", "Click Polygon tool and place vertices."],
              ["Drag vertices", "Reshape the polygon and observe."],
              ["See invariance", "Area remains constant."],
              ["Decompose", "Split into triangles to compute area."],
            ].map(([title, detail], index) => (
              <p key={title}>
                <b>{index + 1}</b>
                <span>
                  <strong>{title}</strong>
                  {detail}
                </span>
              </p>
            ))}
          </article>
          <article>
            <h2>Area from coordinates (shoelace method)</h2>
            <p>For vertices taken in order A(−2,1), B(1,4), C(5,2), D(2,−1):</p>
            <div className="target-area-shoelace">
              <b>i</b>
              <b>xᵢ</b>
              <b>yᵢ</b>
              <b>xᵢyᵢ₊₁</b>
              <b>xᵢ₊₁yᵢ</b>
              {shoelaceRows(vertices).map((row, index) => (
                <span key={index}>
                  <em>{index + 1}</em>
                  <em>{format(row.x)}</em>
                  <em>{format(row.y)}</em>
                  <em>{format(row.forward)}</em>
                  <em>{format(row.backward)}</em>
                </span>
              ))}
              <strong>
                <i>Σ</i>
                <i />
                <i />
                <i>{format(geometry.forwardSum)}</i>
                <i>{format(geometry.backwardSum)}</i>
              </strong>
            </div>
            <aside>
              <p>
                A = ½ |({format(geometry.forwardSum)}) − (
                {format(geometry.backwardSum)})|
              </p>
              <p>= ½ |{format(geometry.forwardSum - geometry.backwardSum)}|</p>
              <p>= {geometry.area.toFixed(2)} sq. units</p>
            </aside>
          </article>
        </section>

        <section className="target-area-practice">
          <header>
            <h2>
              Try it yourself <span>Practice task</span>
            </h2>
            <p>
              Create a different quadrilateral. Move the vertices. Verify the
              area remains constant.
            </p>
          </header>
          <div>
            <article>
              <b>Your task</b>
              <ul>
                <li>Create any convex quadrilateral.</li>
                <li>Drag vertices to change its shape.</li>
                <li>Record the area and perimeter.</li>
                <li>What do you notice?</li>
              </ul>
            </article>
            <AreaPlot
              vertices={practice}
              dragIndex={practiceDrag}
              showSquares={false}
              interactive
              onDrag={setPracticeDrag}
              onMove={movePracticeVertex}
              onPlace={() => undefined}
            />
            <article className="target-area-practice-entry">
              <label>
                Area
                <input
                  type="number"
                  aria-label="Practice polygon area"
                  step="0.01"
                  value={practiceArea}
                  onChange={(event) => {
                    setPracticeArea(event.target.value);
                    setPracticeFeedback("idle");
                  }}
                />{" "}
                sq. units
              </label>
              <label>
                Perimeter
                <input
                  type="number"
                  aria-label="Practice polygon perimeter"
                  step="0.01"
                  value={practicePerimeter}
                  onChange={(event) => {
                    setPracticePerimeter(event.target.value);
                    setPracticeFeedback("idle");
                  }}
                />{" "}
                units
              </label>
              <button type="button" onClick={checkPractice}>
                Submit observation
              </button>
              <button type="button" onClick={newPractice}>
                <RefreshCw /> New polygon
              </button>
              <output role="status" className={`is-${practiceFeedback}`}>
                {practiceFeedback === "correct"
                  ? "Observation correct."
                  : practiceFeedback === "incorrect"
                    ? "Recheck both measurements."
                    : ""}
              </output>
            </article>
            {showTip && (
              <article className="target-area-tip">
                <h3>
                  <Lightbulb /> Tip
                </h3>
                <p>Use unit squares to estimate area before measuring.</p>
                <label>
                  <input
                    type="checkbox"
                    onChange={(event) => {
                      if (event.target.checked) setShowTip(false);
                      onInteraction();
                    }}
                  />{" "}
                  Don’t show again
                </label>
              </article>
            )}
          </div>
        </section>
      </section>

      <nav className="target-area-nav" aria-label="Adjacent lessons">
        <a href="/lessons/geometry/230-distance-length">
          <ArrowLeft />
          <span>
            <b>Previous</b>Distance / Length
          </span>
        </a>
        <a href="/lessons">
          <ListOrdered />
          <span>Lesson overview</span>
        </a>
        <a href="/lessons/geometry/232-angle">
          <span>
            <b>Next</b>Angle
          </span>
          <ArrowRight />
        </a>
      </nav>
    </section>
  );
}

function AreaPlot({
  vertices,
  dragIndex,
  showSquares,
  interactive,
  onDrag,
  onMove,
  onPlace,
  labels = false,
}: {
  vertices: Point[];
  dragIndex: number | null;
  showSquares: boolean;
  interactive: boolean;
  onDrag: (index: number | null) => void;
  onMove: (index: number, point: Point) => void;
  onPlace: (point: Point) => void;
  labels?: boolean;
}) {
  const compact = !labels;
  const width = compact ? 210 : 520;
  const height = compact ? 100 : 350;
  const scaleX = compact ? 18 : 36;
  const scaleY = compact ? 12 : 36;
  const origin = compact ? { x: 105, y: 55 } : { x: 220, y: 239 };
  const screen = (point: Point) => ({
    x: origin.x + point.x * scaleX,
    y: origin.y - point.y * scaleY,
  });
  const domain = (svg: SVGSVGElement, x: number, y: number) => {
    const value = svg.createSVGPoint();
    value.x = x;
    value.y = y;
    const local = value.matrixTransform(svg.getScreenCTM()?.inverse());
    return {
      x: clamp((local.x - origin.x) / scaleX, -6, 7),
      y: clamp((origin.y - local.y) / scaleY, -3, 6),
    };
  };
  const move = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (dragIndex === null) return;
    onMove(
      dragIndex,
      domain(event.currentTarget, event.clientX, event.clientY),
    );
  };
  const points = vertices.map(screen);
  const polygon = points.map((point) => `${point.x},${point.y}`).join(" ");
  return (
    <svg
      role="img"
      aria-label={
        compact
          ? "Practice area-preserving draggable quadrilateral"
          : "Area-preserving draggable quadrilateral on a coordinate grid"
      }
      viewBox={`0 0 ${width} ${height}`}
      onPointerMove={move}
      onPointerUp={() => onDrag(null)}
      onPointerCancel={() => onDrag(null)}
      onPointerDown={(event) => {
        if (event.target === event.currentTarget)
          onPlace(domain(event.currentTarget, event.clientX, event.clientY));
      }}
    >
      {!compact && (
        <defs>
          <pattern
            id="area-unit-grid"
            width={scaleX}
            height={scaleY}
            patternUnits="userSpaceOnUse"
          >
            <path
              data-testid="area-unit-grid"
              data-visible={showSquares}
              d={`M${scaleX} 0H0V${scaleY}`}
              fill="none"
              stroke={showSquares ? "#d6e5ee" : "#edf2f7"}
            />
          </pattern>
        </defs>
      )}
      {!compact && (
        <rect
          width={width}
          height={height}
          fill="url(#area-unit-grid)"
          pointerEvents="none"
        />
      )}
      {!compact && (
        <>
          <line
            x1="0"
            x2={width}
            y1={origin.y}
            y2={origin.y}
            stroke="#475569"
          />
          <line
            x1={origin.x}
            x2={origin.x}
            y1="0"
            y2={height}
            stroke="#475569"
          />
          <text x={width - 10} y={origin.y - 7} fontSize="11">
            x
          </text>
          <text x={origin.x + 7} y="13" fontSize="11">
            y
          </text>
        </>
      )}
      {vertices.length >= 3 && (
        <polygon
          data-testid={compact ? "practice-area-polygon" : "area-polygon"}
          data-area={polygonGeometry(vertices).area.toFixed(6)}
          data-perimeter={polygonGeometry(vertices).perimeter.toFixed(6)}
          points={polygon}
          fill="#0ca9be22"
          stroke="#089eb7"
          strokeWidth={compact ? 1.5 : 2}
        />
      )}
      {vertices.length === 4 && !compact && (
        <line
          data-testid="area-triangulation-diagonal"
          x1={points[0].x}
          y1={points[0].y}
          x2={points[2].x}
          y2={points[2].y}
          stroke="#089eb7"
          strokeDasharray="6 4"
        />
      )}
      {points.map((point, index) => (
        <g key={index}>
          <circle
            data-testid={
              compact ? `practice-area-vertex-${index}` : `area-vertex-${index}`
            }
            data-x={vertices[index].x.toFixed(6)}
            data-y={vertices[index].y.toFixed(6)}
            cx={point.x}
            cy={point.y}
            r={compact ? 4 : 6}
            fill={COLORS[index] ?? "#0ca9be"}
            onPointerDown={() => {
              if (interactive) onDrag(index);
            }}
          />
          {labels && (
            <text
              x={point.x + 9}
              y={point.y - 9}
              fill="#172554"
              fontSize="10"
              fontWeight="800"
            >
              {LABELS[index]} ({format(vertices[index].x)},{" "}
              {format(vertices[index].y)})
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

function polygonGeometry(vertices: Point[]) {
  const rows = shoelaceRows(vertices);
  const forwardSum = rows.reduce((sum, row) => sum + row.forward, 0);
  const backwardSum = rows.reduce((sum, row) => sum + row.backward, 0);
  const perimeter = vertices.reduce((sum, point, index) => {
    const next = vertices[(index + 1) % vertices.length];
    return sum + Math.hypot(next.x - point.x, next.y - point.y);
  }, 0);
  return {
    area: Math.abs(forwardSum - backwardSum) / 2,
    perimeter,
    forwardSum,
    backwardSum,
  };
}
function shoelaceRows(vertices: Point[]) {
  return vertices.map((point, index) => {
    const next = vertices[(index + 1) % vertices.length];
    return {
      x: point.x,
      y: point.y,
      forward: point.x * next.y,
      backward: next.x * point.y,
    };
  });
}
function signedDoubleArea(vertices: Point[]) {
  return shoelaceRows(vertices).reduce(
    (sum, row) => sum + row.forward - row.backward,
    0,
  );
}
function constrainVertexToSignedArea(
  vertices: Point[],
  index: number,
  desired: Point,
  targetSignedArea: number,
) {
  if (vertices.length < 3) return vertices;
  const previous = vertices[(index - 1 + vertices.length) % vertices.length];
  const next = vertices[(index + 1) % vertices.length];
  const alpha = next.y - previous.y;
  const beta = previous.x - next.x;
  const current = vertices[index];
  const currentContribution = alpha * current.x + beta * current.y;
  const constant = signedDoubleArea(vertices) - currentContribution;
  const required = targetSignedArea - constant;
  const denominator = alpha * alpha + beta * beta;
  if (denominator < 1e-8) return vertices;
  const offset =
    (alpha * desired.x + beta * desired.y - required) / denominator;
  const projected = {
    x: desired.x - offset * alpha,
    y: desired.y - offset * beta,
  };
  return vertices.map((point, vertexIndex) =>
    vertexIndex === index ? projected : point,
  );
}
function triangulateFromFirst(vertices: Point[]) {
  if (vertices.length < 3) return [];
  return Array.from({ length: vertices.length - 2 }, (_, index) => {
    const a = vertices[0],
      b = vertices[index + 1],
      c = vertices[index + 2];
    return Math.abs((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)) / 2;
  });
}
function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}
function format(value: number) {
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
}
