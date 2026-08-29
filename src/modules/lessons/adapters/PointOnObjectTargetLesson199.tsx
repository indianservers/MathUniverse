import { ArrowLeft, ArrowRight, Circle, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./PointOnObjectTargetLesson199.css";

type ObjectType = "line" | "circle";
type Point = { x: number; y: number };
const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));
const round = (n: number) => Math.round(n * 100) / 100;

function ConstraintGraph({
  object,
  slope,
  intercept,
  point,
  free,
  onPoint,
}: {
  object: ObjectType;
  slope: number;
  intercept: number;
  point: Point;
  free: boolean;
  onPoint: (p: Point) => void;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const drag = useRef(false);
  const ox = 300,
    oy = 190,
    scale = 39;
  const project = (raw: Point): Point => {
    if (free)
      return { x: clamp(round(raw.x), -6, 6), y: clamp(round(raw.y), -5, 5) };
    if (object === "line") {
      const x = clamp(Math.round(raw.x * 4) / 4, -5.8, 5.8);
      return { x, y: round(slope * x + intercept) };
    }
    const angle = Math.atan2(raw.y, raw.x);
    return { x: round(4 * Math.cos(angle)), y: round(4 * Math.sin(angle)) };
  };
  const fromEvent = (event: PointerEvent<SVGSVGElement>) => {
    const box = ref.current!.getBoundingClientRect();
    return project({
      x: (((event.clientX - box.left) / box.width) * 600 - ox) / scale,
      y: (oy - ((event.clientY - box.top) / box.height) * 380) / scale,
    });
  };
  const lineY = (x: number) => slope * x + intercept;
  const px = ox + point.x * scale,
    py = oy - point.y * scale;
  return (
    <svg
      ref={ref}
      className="po199-graph"
      viewBox="0 0 600 380"
      role="img"
      aria-label={`Point P constrained to ${object}${object === "line" ? " l" : ""} coordinate plane`}
      tabIndex={0}
      onPointerDown={(e) => {
        drag.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        onPoint(fromEvent(e));
      }}
      onPointerMove={(e) => drag.current && onPoint(fromEvent(e))}
      onPointerUp={() => {
        drag.current = false;
      }}
      onPointerCancel={() => {
        drag.current = false;
      }}
      onKeyDown={(e) => {
        if (
          !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)
        )
          return;
        e.preventDefault();
        const dx =
            e.key === "ArrowLeft" ? -0.25 : e.key === "ArrowRight" ? 0.25 : 0,
          dy = e.key === "ArrowDown" ? -0.25 : e.key === "ArrowUp" ? 0.25 : 0;
        onPoint(project({ x: point.x + dx, y: point.y + dy }));
      }}
    >
      <defs>
        <pattern
          id="po199-grid"
          width={scale}
          height={scale}
          patternUnits="userSpaceOnUse"
          x={ox}
          y={oy}
        >
          <path d={`M${scale} 0H0V${scale}`} fill="none" stroke="#e1e8f0" />
        </pattern>
        <marker
          id="po199-arrow"
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3.5"
          orient="auto"
        >
          <path d="M0 0L7 3.5L0 7Z" />
        </marker>
      </defs>
      <rect width="600" height="380" fill="#fff" />
      <rect width="600" height="380" fill="url(#po199-grid)" />
      <line
        x1="10"
        y1={oy}
        x2="590"
        y2={oy}
        className="axis"
        markerEnd="url(#po199-arrow)"
      />
      <line
        x1={ox}
        y1="370"
        x2={ox}
        y2="10"
        className="axis"
        markerEnd="url(#po199-arrow)"
      />
      {[-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].map((t) => (
        <g key={`x${t}`}>
          <line
            x1={ox + t * scale}
            y1={oy - 3}
            x2={ox + t * scale}
            y2={oy + 3}
            className="tick"
          />
          {t % 1 === 0 && (
            <text x={ox + t * scale} y={oy + 18}>
              {t}
            </text>
          )}
        </g>
      ))}
      {[-4, -3, -2, -1, 1, 2, 3, 4].map((t) => (
        <text key={`y${t}`} x={ox - 10} y={oy - t * scale + 4} textAnchor="end">
          {t}
        </text>
      ))}
      <text x="584" y={oy - 9} className="axis-name">
        x
      </text>
      <text x={ox + 8} y="15" className="axis-name">
        y
      </text>
      {object === "line" ? (
        <line
          x1={ox - 5.8 * scale}
          y1={oy - lineY(-5.8) * scale}
          x2={ox + 5.8 * scale}
          y2={oy - lineY(5.8) * scale}
          className="object-line"
        />
      ) : (
        <circle cx={ox} cy={oy} r={4 * scale} className="object-circle" />
      )}
      {!free && (
        <path
          d={
            object === "line"
              ? `M${ox - 5.5 * scale} ${oy - lineY(-5.5) * scale}L${px} ${py}`
              : `M${ox + 4 * scale} ${oy}A${4 * scale} ${4 * scale} 0 0 1 ${px} ${py}`
          }
          className="drag-path"
        />
      )}
      <g
        data-testid="point-on-object-handle"
        transform={`translate(${px} ${py})`}
      >
        <circle r="8" />
        <text x="-6" y="-14">
          P
        </text>
      </g>
      <text
        x={object === "line" ? ox + 5.55 * scale : ox + 4 * scale + 8}
        y={object === "line" ? oy - lineY(5.55) * scale - 8 : oy - 7}
        className="object-name"
      >
        ℓ
      </text>
    </svg>
  );
}

export default function PointOnObjectTargetLesson199({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [object, setObject] = useState<ObjectType>("line");
  const [slope, setSlope] = useState(0.5);
  const [intercept, setIntercept] = useState(0);
  const [point, setPoint] = useState<Point>({ x: 2, y: 1 });
  const [free, setFree] = useState(false);
  const [tab, setTab] = useState("Explore");
  const [shared, setShared] = useState(false);
  const [practicePoint, setPracticePoint] = useState<Point>({ x: 2, y: 0.5 });
  const [answer, setAnswer] = useState({ x: "", y: "" });
  const [result, setResult] = useState<"idle" | "correct" | "incorrect">(
    "idle",
  );
  const interact = () => onInteraction();
  const reset = () => {
    setObject("line");
    setSlope(0.5);
    setIntercept(0);
    setPoint({ x: 2, y: 1 });
    setFree(false);
    setTab("Explore");
    setShared(false);
    setPracticePoint({ x: 2, y: 0.5 });
    setAnswer({ x: "", y: "" });
    setResult("idle");
  };
  useEffect(reset, [resetToken]);
  const changeLine = (m: number, b: number) => {
    setSlope(m);
    setIntercept(b);
    if (!free && object === "line")
      setPoint((p) => ({ x: p.x, y: round(m * p.x + b) }));
    interact();
  };
  const relation =
    object === "line"
      ? point.y - slope * point.x - intercept
      : point.x ** 2 + point.y ** 2 - 16;
  const movePractice = (x: number) => {
    const nx = clamp(Math.round(x * 4) / 4, -5.5, 5.5);
    setPracticePoint({ x: nx, y: round(-0.75 * nx + 2) });
    setAnswer({ x: nx.toFixed(2), y: round(-0.75 * nx + 2).toFixed(2) });
    setResult("idle");
    interact();
  };
  return (
    <main
      className="po199-page"
      data-testid="dynamic-geometry-mockup-0256"
      data-dedicated-lesson="199"
      data-object-model="parent-object-projected-constrained-point-line-circle"
      data-object={object}
      data-point={`${point.x}:${point.y}`}
      data-free={free}
      data-tab={tab}
      data-shared={shared}
      data-practice={result}
    >
      <header className="po199-header">
        <section>
          <div>
            <span>GEOMETRY</span>
            <span>DYNAMIC GEOMETRY CONSTRUCTION</span>
          </div>
          <h1>
            Point on Object <i>☆</i>
          </h1>
          <p>Create constrained points. A point stays on its object.</p>
          <aside>
            <b>♙ Foundational-Advanced</b>
            <b>ϟ Construction Studio</b>
            <b>▣ Geometry Tools</b>
            <b>◷ 6-10 min</b>
          </aside>
        </section>
        <button
          onClick={() => {
            setShared(true);
            interact();
          }}
        >
          <Share2 />
          Share
        </button>
        <nav>
          {[
            ["◯", "Observe", "See a point constrained on a line or circle."],
            ["☝", "Manipulate", "Drag the point. It stays on the object."],
            ["◉", "Notice", "Distance/relationship updates in real time."],
            [
              "☼",
              "Understand",
              "The constraint keeps the point on the object.",
            ],
            ["◎", "Try", "Solve a task on your own."],
          ].map(([icon, title, body], i) => (
            <article key={title}>
              <i className={`c${i}`}>{icon}</i>
              <div>
                <b>{title}</b>
                <span>{body}</span>
              </div>
              {i < 4 && <em>→</em>}
            </article>
          ))}
        </nav>
      </header>
      <nav className="po199-tabs">
        {["Explore", "Construct", "Formula", "Example", "Practice"].map(
          (name, i) => (
            <button
              key={name}
              className={tab === name ? "active" : ""}
              onClick={() => {
                setTab(name);
                interact();
              }}
            >
              {["▷", "♧", "∑", "▤", "☑"][i]} {name}
            </button>
          ),
        )}
      </nav>
      <section className="po199-explore">
        <header>
          <h2>
            1. Explore: Point on a {object === "line" ? "Line" : "Circle"}
          </h2>
          <div>
            <b>Object</b>
            <button
              aria-label="Line object"
              className={object === "line" ? "active" : ""}
              onClick={() => {
                setObject("line");
                setPoint({ x: 2, y: round(slope * 2 + intercept) });
                interact();
              }}
            >
              ╱
            </button>
            <button
              aria-label="Circle object"
              className={object === "circle" ? "active" : ""}
              onClick={() => {
                setObject("circle");
                setPoint({ x: 2.83, y: 2.83 });
                interact();
              }}
            >
              <Circle />
            </button>
            <label>
              <input
                aria-label="Free point mode"
                type="checkbox"
                checked={free}
                onChange={(e) => {
                  setFree(e.target.checked);
                  interact();
                }}
              />
              <i />
              <span>
                Free point mode<small>Move P freely (not constrained)</small>
              </span>
            </label>
          </div>
        </header>
        <div className="po199-lab">
          <article>
            <ConstraintGraph
              object={object}
              slope={slope}
              intercept={intercept}
              point={point}
              free={free}
              onPoint={(p) => {
                setPoint(p);
                interact();
              }}
            />
            <footer>
              <span>
                <i />
                Constrained object ({object} ℓ)
              </span>
              <span>
                <i />
                Point P
              </span>
              <span>
                <i />
                Drag path of P
              </span>
            </footer>
            <p>
              ⓘ &nbsp; Drag point P along the {object}. The coordinates update,
              and P stays on ℓ.
            </p>
          </article>
          <aside>
            <h3>
              Point P <small>(on {object} ℓ)</small>
            </h3>
            <strong>
              ({point.x.toFixed(2)}, {point.y.toFixed(2)})
            </strong>
            <hr />
            <h3>
              {object === "line" ? (
                <>
                  Line ℓ:{" "}
                  <em>
                    y = {slope.toFixed(2)}x {intercept < 0 ? "−" : "+"}{" "}
                    {Math.abs(intercept).toFixed(2)}
                  </em>
                </>
              ) : (
                <>
                  Circle: <em>x² + y² = 16</em>
                </>
              )}
            </h3>
            {object === "line" ? (
              <>
                <label>
                  Slope (m)
                  <span>
                    <i>-5</i>
                    <i>5</i>
                  </span>
                  <input
                    aria-label="Slope m"
                    type="range"
                    min="-5"
                    max="5"
                    step=".25"
                    value={slope}
                    onChange={(e) =>
                      changeLine(Number(e.target.value), intercept)
                    }
                  />
                  <output>{slope.toFixed(2)}</output>
                </label>
                <label>
                  y-intercept (b)
                  <span>
                    <i>-5</i>
                    <i>5</i>
                  </span>
                  <input
                    aria-label="y-intercept b"
                    type="range"
                    min="-5"
                    max="5"
                    step=".25"
                    value={intercept}
                    onChange={(e) => changeLine(slope, Number(e.target.value))}
                  />
                  <output>{intercept.toFixed(2)}</output>
                </label>
              </>
            ) : (
              <section>
                <b>Centre O</b>
                <span>(0.00, 0.00)</span>
                <b>Radius</b>
                <span>4.00</span>
              </section>
            )}
          </aside>
        </div>
      </section>
      <section className="po199-insights">
        <article className="observe">
          <h2>◉ &nbsp; Observation</h2>
          <p>P is always on ℓ.</p>
          <span>Check the relationship:</span>
          <strong>
            {object === "line"
              ? `y − (${slope.toFixed(2)})x − (${intercept.toFixed(2)})`
              : "x² + y² − 16"}{" "}
            = {relation.toFixed(2)} <i>≈ 0</i>
          </strong>
        </article>
        <article className="idea">
          <h2>☼ &nbsp; Key Idea</h2>
          <p>A constrained point satisfies the equation of its object.</p>
          <strong>{object === "line" ? "y = mx + b" : "x² + y² = r²"}</strong>
          <span>
            P always has coordinates (x, y) that make the equation true.
          </span>
        </article>
        <article className="definition">
          <h2>▤ &nbsp; Definition</h2>
          <h3>Point on Object</h3>
          <p>
            A point is constrained to an object (line, circle, segment, etc.) if
            it remains on that object when dragged or constructed.
          </p>
        </article>
      </section>
      <section className="po199-examples">
        <article>
          <h2>2. Example: Point on a Circle</h2>
          <div>
            <svg viewBox="0 0 190 150">
              <path d="M5 75H185M95 5V145" />
              <circle cx="95" cy="75" r="52" />
              <circle cx="132" cy="38" r="6" />
              <text x="138" y="32">
                P
              </text>
              <text x="83" y="91">
                O
              </text>
            </svg>
            <section>
              <b>Circle: &nbsp; x² + y² = 16</b>
              <span>(Center O(0, 0), r = 4)</span>
              <strong>P (2.83, 2.83)</strong>
              <span>Check: &nbsp; 2² + 2² = 16.00</span>
              <i>≈ 16</i>
            </section>
          </div>
        </article>
        <article>
          <h2>3. Construction Steps (Line)</h2>
          <div>
            <ol>
              {[
                "Draw line ℓ.",
                "Select the Point Tool.",
                "Click on ℓ. Point P is created on ℓ.",
                "Drag P. It stays on ℓ.",
              ].map((s, i) => (
                <li key={s}>
                  <b>{i + 1}</b>
                  {s}
                </li>
              ))}
            </ol>
            <svg viewBox="0 0 210 105">
              <line x1="10" y1="100" x2="200" y2="15" />
              <circle cx="115" cy="53" r="6" />
              <text x="110" y="39">
                P
              </text>
              <text x="196" y="14">
                ℓ
              </text>
            </svg>
          </div>
        </article>
      </section>
      <section className="po199-practice">
        <header>
          <h2>4. Try It: Your Turn</h2>
          <button
            onClick={() => {
              setPracticePoint({ x: 2, y: 0.5 });
              setAnswer({ x: "", y: "" });
              setResult("idle");
              interact();
            }}
          >
            <RotateCcw />
            Reset
          </button>
        </header>
        <div>
          <section>
            <p>A line ℓ has equation y = −0.75x + 2. A point P is on ℓ.</p>
            <b>
              Drag P to x = 4 and read the coordinates. Then check the equation.
            </b>
            <label>
              Practice point x
              <input
                aria-label="Practice constrained point"
                type="range"
                min="-5"
                max="5"
                step=".25"
                value={practicePoint.x}
                onChange={(e) => movePractice(Number(e.target.value))}
              />
            </label>
          </section>
          <article>
            <span>Target</span>
            <b>x = 4.00</b>
          </article>
          <aside>
            <span>Your answer</span>
            <div>
              P ({" "}
              <input
                aria-label="Practice x coordinate"
                value={answer.x}
                onChange={(e) => setAnswer({ ...answer, x: e.target.value })}
              />
              ,{" "}
              <input
                aria-label="Practice y coordinate"
                value={answer.y}
                onChange={(e) => setAnswer({ ...answer, y: e.target.value })}
              />{" "}
              )
              <button
                onClick={() => {
                  setResult(
                    Number(answer.x) === 4 && Number(answer.y) === -1
                      ? "correct"
                      : "incorrect",
                  );
                  interact();
                }}
              >
                Check
              </button>
            </div>
            <output className={result}>
              {result === "correct"
                ? "Correct. P = (4, -1) lies on ℓ."
                : result === "incorrect"
                  ? "Use y = -0.75(4) + 2."
                  : ""}
            </output>
          </aside>
        </div>
      </section>
      <nav className="po199-nav">
        <a href="/lessons/geometry/198-free-point">
          <ArrowLeft />
          <span>
            Previous<b>Free Point</b>
          </span>
        </a>
        <a href="/lessons/geometry/200-intersection-point">
          <span>
            Next<b>Intersection Point</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="po199-footer">
        <b>⚙ &nbsp; Math Universe</b>
        <span>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </span>
        <nav>
          <a href="/sitemap">Sitemap</a>
          <a href="/docs">Docs</a>
          <a href="/about">About</a>
        </nav>
        <small>© 2026 INDIAN SERVERS PRIVATE LIMITED.</small>
      </footer>
    </main>
  );
}
