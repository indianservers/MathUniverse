import { ArrowLeft, ArrowRight, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./PositionVectorsTargetLesson185.css";

type Point = { x: number; y: number };
type Key = "a" | "b" | "c";
const INITIAL: Record<Key, Point> = {
    a: { x: 3, y: 2 },
    b: { x: 4, y: -1 },
    c: { x: -2, y: 4 },
  },
  COLORS: Record<Key, string> = { a: "#1685f8", b: "#7c3aed", c: "#0aa9a5" },
  LABELS: Record<Key, string> = { a: "A", b: "B", c: "C" };
const clamp = (value: number, step = 1) =>
  Math.max(-5, Math.min(5, Math.round(value / step) * step));
const f = (value: number) => Number(value.toFixed(1)).toString();

function PositionGraph({
  points,
  grid,
  snap,
  active,
  onPoint,
  onActive,
}: {
  points: Record<Key, Point>;
  grid: boolean;
  snap: boolean;
  active: Key;
  onPoint: (key: Key, point: Point) => void;
  onActive: (key: Key) => void;
}) {
  const ref = useRef<SVGSVGElement>(null),
    drag = useRef<Key | null>(null),
    sx = (x: number) => 315 + x * 44,
    sy = (y: number) => 300 - y * 44;
  const world = (event: PointerEvent<SVGSVGElement>) => {
    const rect = ref.current!.getBoundingClientRect(),
      step = snap ? 1 : 0.5;
    return {
      x: clamp(
        (((event.clientX - rect.left) / rect.width) * 630 - 315) / 44,
        step,
      ),
      y: clamp(
        (300 - ((event.clientY - rect.top) / rect.height) * 600) / 44,
        step,
      ),
    };
  };
  const keyboard = (key: Key) => (event: KeyboardEvent<SVGCircleElement>) => {
    const d: Record<string, Point> = {
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        ArrowUp: { x: 0, y: 1 },
        ArrowDown: { x: 0, y: -1 },
      },
      move = d[event.key];
    if (!move) return;
    event.preventDefault();
    onPoint(key, {
      x: clamp(points[key].x + move.x),
      y: clamp(points[key].y + move.y),
    });
  };
  return (
    <svg
      ref={ref}
      className={`pv185-graph${grid ? " grid" : ""}`}
      viewBox="0 0 630 600"
      aria-label="Three draggable position vectors"
      onPointerMove={(event) => {
        if (drag.current) onPoint(drag.current, world(event));
      }}
      onPointerUp={() => {
        drag.current = null;
      }}
      onPointerLeave={() => {
        drag.current = null;
      }}
    >
      <defs>
        <pattern
          id="pv185Grid"
          width="44"
          height="44"
          patternUnits="userSpaceOnUse"
        >
          <path d="M44 0H0V44" fill="none" stroke="#dde6ed" />
        </pattern>
        {(["a", "b", "c"] as Key[]).map((key) => (
          <marker
            key={key}
            id={`pv185Arrow-${key}`}
            markerWidth="9"
            markerHeight="9"
            refX="8"
            refY="4.5"
            orient="auto"
          >
            <path d="M0 0L9 4.5L0 9Z" fill={COLORS[key]} />
          </marker>
        ))}
      </defs>
      <rect width="630" height="600" className="grid-fill" />
      <line x1="0" x2="630" y1={sy(0)} y2={sy(0)} className="axis" />
      <line x1={sx(0)} x2={sx(0)} y1="0" y2="600" className="axis" />
      {Array.from({ length: 11 }, (_, i) => i - 5).map((v) => (
        <g key={v}>
          {v !== 0 && (
            <>
              <text x={sx(v) - 5} y={sy(0) + 20}>
                {v}
              </text>
              <text x={sx(0) - 20} y={sy(v) + 4}>
                {v}
              </text>
            </>
          )}
        </g>
      ))}
      {(["a", "b", "c"] as Key[]).map((key) => {
        const p = points[key];
        return (
          <g key={key}>
            <line
              x1={sx(0)}
              y1={sy(0)}
              x2={sx(p.x)}
              y2={sy(p.y)}
              stroke={COLORS[key]}
              strokeWidth={active === key ? 4 : 3}
              markerEnd={`url(#pv185Arrow-${key})`}
            />
            <circle
              data-testid={`position-vector-${key}`}
              role="slider"
              aria-label={`Position point ${LABELS[key]}`}
              tabIndex={0}
              cx={sx(p.x)}
              cy={sy(p.y)}
              r={active === key ? 10 : 8}
              fill={COLORS[key]}
              onPointerDown={(event) => {
                drag.current = key;
                onActive(key);
                event.currentTarget.setPointerCapture(event.pointerId);
              }}
              onKeyDown={keyboard(key)}
            />
            <text
              x={sx(p.x) + (p.x < 0 ? -36 : 10)}
              y={sy(p.y) - 12}
              fill={COLORS[key]}
              className="point-label"
            >
              {LABELS[key]} ({f(p.x)}, {f(p.y)})
            </text>
          </g>
        );
      })}
      <circle cx={sx(0)} cy={sy(0)} r="5" />
      <text x={sx(0) - 46} y={sy(0) + 22}>
        O (0,0)
      </text>
    </svg>
  );
}

function VectorCard({
  name,
  point,
  onPoint,
}: {
  name: Key;
  point: Point;
  onPoint: (point: Point) => void;
}) {
  const magnitude = Math.hypot(point.x, point.y),
    angle = (Math.atan2(point.y, point.x) * 180) / Math.PI;
  return (
    <article className={`pv185-card ${name}`}>
      <header>
        <h3>
          Vector <i>O{LABELS[name]}</i>
        </h3>
        <span>
          ● To {LABELS[name]} ({f(point.x)}, {f(point.y)})
        </span>
      </header>
      <div>
        <label>
          a ={" "}
          <input
            aria-label={`${LABELS[name]} x coordinate`}
            type="number"
            min="-5"
            max="5"
            step=".5"
            value={point.x}
            onChange={(event) =>
              onPoint({ ...point, x: clamp(+event.target.value, 0.5) })
            }
          />
        </label>
        <label>
          b ={" "}
          <input
            aria-label={`${LABELS[name]} y coordinate`}
            type="number"
            min="-5"
            max="5"
            step=".5"
            value={point.y}
            onChange={(event) =>
              onPoint({ ...point, y: clamp(+event.target.value, 0.5) })
            }
          />
        </label>
      </div>
      <output>
        <i>O{LABELS[name]}</i> = ({f(point.x)}
        <br />
        {f(point.y)})
      </output>
      <footer>
        |O{LABELS[name]}| = {magnitude.toFixed(2)}{" "}
        <span>θ = {angle.toFixed(1)}°</span>
      </footer>
    </article>
  );
}

function PracticeGraph({
  point,
  onPoint,
}: {
  point: Point;
  onPoint: (point: Point) => void;
}) {
  const ref = useRef<SVGSVGElement>(null),
    drag = useRef(false),
    sx = (x: number) => 120 + x * 27,
    sy = (y: number) => 95 - y * 27,
    move = (event: PointerEvent<SVGSVGElement>) => {
      const rect = ref.current!.getBoundingClientRect();
      onPoint({
        x: clamp((((event.clientX - rect.left) / rect.width) * 240 - 120) / 27),
        y: clamp((95 - ((event.clientY - rect.top) / rect.height) * 190) / 27),
      });
    };
  return (
    <svg
      ref={ref}
      className="pv185-practice-graph"
      viewBox="0 0 240 190"
      aria-label="Practice position vector graph"
      onPointerMove={(event) => drag.current && move(event)}
      onPointerUp={() => {
        drag.current = false;
      }}
    >
      <defs>
        <pattern
          id="pv185SmallGrid"
          width="27"
          height="27"
          patternUnits="userSpaceOnUse"
        >
          <path d="M27 0H0V27" fill="none" stroke="#dde6ed" />
        </pattern>
      </defs>
      <rect width="240" height="190" fill="url(#pv185SmallGrid)" />
      <line x1="0" x2="240" y1={sy(0)} y2={sy(0)} />
      <line x1={sx(0)} x2={sx(0)} y1="0" y2="190" />
      <circle
        data-testid="position-practice-point"
        role="slider"
        aria-label="Practice position point"
        tabIndex={0}
        cx={sx(point.x)}
        cy={sy(point.y)}
        r="8"
        onPointerDown={(event) => {
          drag.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onKeyDown={(event) => {
          const d: Record<string, Point> = {
              ArrowLeft: { x: -1, y: 0 },
              ArrowRight: { x: 1, y: 0 },
              ArrowUp: { x: 0, y: 1 },
              ArrowDown: { x: 0, y: -1 },
            },
            m = d[event.key];
          if (m) {
            event.preventDefault();
            onPoint({ x: clamp(point.x + m.x), y: clamp(point.y + m.y) });
          }
        }}
      />
      <text x={sx(point.x) - 3} y={sy(point.y) + 25}>
        P
      </text>
    </svg>
  );
}

export default function PositionVectorsTargetLesson185({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [points, setPoints] = useState(INITIAL),
    [active, setActive] = useState<Key>("a"),
    [grid, setGrid] = useState(true),
    [snap, setSnap] = useState(true),
    [stage, setStage] = useState(0),
    [shared, setShared] = useState(false),
    [practice, setPractice] = useState({ x: 2, y: -3 }),
    [feedback, setFeedback] = useState("");
  const correct = practice.x === 2 && practice.y === -3,
    update = (key: Key, point: Point) => {
      setPoints((current) => ({ ...current, [key]: point }));
      setActive(key);
      onInteraction();
    },
    updatePractice = (point: Point) => {
      setPractice(point);
      setFeedback("");
      onInteraction();
    },
    reset = () => {
      setPoints(INITIAL);
      setActive("a");
      setGrid(true);
      setSnap(true);
      setStage(0);
      setShared(false);
      setPractice({ x: 2, y: -3 });
      setFeedback("");
      onInteraction();
    };
  useEffect(() => {
    setPoints(INITIAL);
    setActive("a");
    setGrid(true);
    setSnap(true);
    setStage(0);
    setShared(false);
    setPractice({ x: 2, y: -3 });
    setFeedback("");
  }, [resetToken]);
  return (
    <main
      className="pv185-page"
      data-testid="vector-mockup-0242"
      data-dedicated-lesson="185"
      data-object-model="origin-anchored-multiple-position-vectors-coordinate-magnitude-direction-practice"
      data-a={`${points.a.x}:${points.a.y}`}
      data-b={`${points.b.x}:${points.b.y}`}
      data-c={`${points.c.x}:${points.c.y}`}
      data-active={active}
      data-grid={grid}
      data-snap={snap}
      data-stage={stage}
      data-practice={`${practice.x}:${practice.y}`}
      data-correct={correct}
      data-feedback={feedback}
      data-shared={shared}
    >
      <header className="pv185-header">
        <div>
          <span>VECTORS</span>
          <h1>Position Vectors</h1>
          <p>Connect points to the origin to form position vectors.</p>
          <section>
            <b>Level: Intermediate-Advanced</b>
            <b>Estimated time: 6-10 min</b>
            <b>Topic: Position Vector</b>
            <b>Standards: NCERT | CBSE | IB</b>
          </section>
        </div>
        <aside>
          <a href="/workspace/geometry">↗ Workspace</a>
          <button onClick={reset}>
            <RotateCcw />
            Reset
          </button>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(
                `OA=(${points.a.x},${points.a.y})`,
              );
              setShared(true);
              onInteraction();
            }}
          >
            <Share2 />
            Share
          </button>
          <output>{shared ? "Copied" : ""}</output>
        </aside>
      </header>
      <nav className="pv185-stages">
        {["Observe", "Manipulate", "Pattern", "Rule", "Practice"].map(
          (name, index) => (
            <button
              key={name}
              className={stage === index ? "active" : ""}
              onClick={() => {
                setStage(index);
                onInteraction();
              }}
            >
              ▣ {name}
            </button>
          ),
        )}
      </nav>
      <section className="pv185-work">
        <header>
          <div>
            <h2>Explore Position Vectors</h2>
            <p>
              Drag points from the origin. Each arrow from the origin is a
              position vector.
            </p>
          </div>
          <button
            onClick={() => {
              setGrid((value) => !value);
              onInteraction();
            }}
          >
            ▦ {grid ? "Hide" : "Show"} grid
          </button>
          <label>
            Snap to grid{" "}
            <input
              aria-label="Snap to grid"
              type="checkbox"
              checked={snap}
              onChange={() => {
                setSnap((value) => !value);
                onInteraction();
              }}
            />
          </label>
        </header>
        <div>
          <article>
            <nav>
              <button className={active ? "active" : ""}>⌁ Drag point</button>
              <button
                onClick={() => {
                  setActive(active === "a" ? "b" : active === "b" ? "c" : "a");
                  onInteraction();
                }}
              >
                ✣ Select next
              </button>
            </nav>
            <PositionGraph
              points={points}
              grid={grid}
              snap={snap}
              active={active}
              onPoint={update}
              onActive={setActive}
            />
            <footer>
              <b>💡 Observe</b>
              <p>
                Each point (a,b) determines a unique position vector OP = ⟨a,b⟩.
              </p>
            </footer>
          </article>
          <aside>
            <h2>Position Vectors</h2>
            <p>
              A position vector starts at the origin and ends at a point (a,b).
            </p>
            {(["a", "b", "c"] as Key[]).map((key) => (
              <VectorCard
                key={key}
                name={key}
                point={points[key]}
                onPoint={(point) => update(key, point)}
              />
            ))}
            <section>
              <b>ⓘ Tips</b>
              <p>• Drag a point to update its vector.</p>
              <p>• Angles are measured from the +x axis.</p>
            </section>
          </aside>
        </div>
      </section>
      <section className="pv185-learn">
        <article>
          <h2>Example</h2>
          <p>Find the position vector of P(-3,2).</p>
          <div>
            <svg viewBox="0 0 230 180">
              <line x1="120" y1="105" x2="45" y2="55" />
              <circle cx="45" cy="55" r="6" />
              <text x="18" y="43">
                P (-3,2)
              </text>
            </svg>
            <section>
              <b>Solution</b>
              <p>From origin to P(-3,2):</p>
              <output>OP = ⟨-3, 2⟩</output>
              <p>As a column vector: (-3,2)</p>
              <p>|OP| = √13</p>
            </section>
          </div>
        </article>
        <article>
          <h2>◇ Key Insight</h2>
          <p>Any point P(a,b) has position vector</p>
          <output>
            OP = ⟨a,b⟩ = (a
            <br />
            b)
          </output>
          <h3>Magnitude</h3>
          <p>|OP| = √(a²+b²)</p>
          <h3>Direction (from +x axis)</h3>
          <p>θ = tan⁻¹(b/a), a≠0</p>
        </article>
      </section>
      <section className="pv185-practice">
        <header>
          <h2>◌ Try It</h2>
          <p>
            Drag point P to the given location or enter coordinates. Then read
            the position vector.
          </p>
          <button
            onClick={() => {
              setFeedback(correct ? "Correct!" : "Not yet. Place P at (2,-3).");
              onInteraction();
            }}
          >
            Check
          </button>
          <button
            aria-label="Reset practice"
            onClick={() => {
              setPractice({ x: 0, y: 0 });
              setFeedback("");
              onInteraction();
            }}
          >
            <RotateCcw />
          </button>
        </header>
        <div>
          <article>
            <b>Target point</b>
            <h3>P (2, -3)</h3>
            <p>Drag P or enter coordinates on the right.</p>
          </article>
          <PracticeGraph point={practice} onPoint={updatePractice} />
          <article>
            <b>Enter coordinates</b>
            <label>
              x ={" "}
              <input
                aria-label="Practice x coordinate"
                type="number"
                value={practice.x}
                onChange={(event) =>
                  updatePractice({ ...practice, x: clamp(+event.target.value) })
                }
              />
            </label>
            <label>
              y ={" "}
              <input
                aria-label="Practice y coordinate"
                type="number"
                value={practice.y}
                onChange={(event) =>
                  updatePractice({ ...practice, y: clamp(+event.target.value) })
                }
              />
            </label>
          </article>
          <article>
            <b>Your position vector</b>
            <output>
              OP = ({practice.x}
              <br />
              {practice.y})
            </output>
            <p>
              |OP| = {Math.hypot(practice.x, practice.y).toFixed(2)} θ ={" "}
              {((Math.atan2(practice.y, practice.x) * 180) / Math.PI).toFixed(
                1,
              )}
              °
            </p>
            <strong className={correct ? "correct" : ""}>
              {feedback || (correct && "✓ Correct!")}
            </strong>
          </article>
        </div>
      </section>
      <nav className="pv185-nav">
        <a href="/lessons/geometry/184-component-form">
          <ArrowLeft />
          <span>
            <small>Previous</small>
            <b>Component Form</b>
          </span>
        </a>
        <a href="/lessons/geometry/186-vector-addition">
          <span>
            <small>Next</small>
            <b>Vector Addition</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
    </main>
  );
}
