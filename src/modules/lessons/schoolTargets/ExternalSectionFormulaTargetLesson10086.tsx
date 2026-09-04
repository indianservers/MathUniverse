import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";
import {
  type PointerEvent,
  type RefObject,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./ExternalSectionFormulaTargetLesson10086.css";

type Point = { x: number; y: number };
type Side = "left" | "right";
const A = { x: 0, y: 0 },
  B = { x: 4, y: 2 };
const PRESETS = [
  [1, 1],
  [2, 1],
  [3, 2],
  [3, 1],
  [5, 3],
  [5, 4],
  [4, 3],
] as const;
const round = (n: number, p = 2) => Math.round(n * 10 ** p) / 10 ** p;
const dist = (a: Point, b: Point) => round(Math.hypot(a.x - b.x, a.y - b.y), 3);
const derive = (m: number, n: number, side: Side) => {
  if (m === n) return null;
  const hi = Math.max(m, n),
    lo = Math.min(m, n),
    d = hi - lo;
  return side === "right"
    ? {
        x: round((hi * B.x - lo * A.x) / d),
        y: round((hi * B.y - lo * A.y) / d),
      }
    : {
        x: round((hi * A.x - lo * B.x) / d),
        y: round((hi * A.y - lo * B.y) / d),
      };
};

export default function ExternalSectionFormulaTargetLesson10086({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [m, setM] = useState(2),
    [n, setN] = useState(1),
    [side, setSide] = useState<Side>("right"),
    [grid, setGrid] = useState(false),
    [tab, setTab] = useState(0),
    [actions, setActions] = useState(0),
    [dragging, setDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const p = useMemo(() => derive(m, n, side), [m, n, side]);
  const ap = p ? dist(A, p) : null,
    pb = p ? dist(p, B) : null,
    match = !!p && !!pb && Math.abs((ap ?? 0) / (pb ?? 1) - m / n) < 0.02;
  const act = (fn: () => void) => {
    fn();
    setActions((v) => v + 1);
  };
  const preset = (a: number, b: number) =>
    act(() => {
      setM(a);
      setN(b);
      setSide(a > b ? "right" : "left");
    });
  const reset = () =>
    act(() => {
      setM(2);
      setN(1);
      setSide("right");
      setGrid(false);
      setTab(0);
    });
  const chooseSide = (next: Side) =>
    act(() => {
      setSide(next);
      if (next === "left" && m > n) {
        setM(n);
        setN(m);
      }
      if (next === "right" && m < n) {
        setM(n);
        setN(m);
      }
    });
  const infer = (q: Point) => {
    const da = dist(A, q),
      db = dist(q, B);
    if (!db || (q.x > 0 && q.x < 4)) return;
    const r = Math.max(0.1, Math.min(9, da / db)),
      den = 10,
      num = Math.max(1, Math.round(r * den));
    setM(num);
    setN(den);
    setSide(q.x < 0 ? "left" : "right");
  };
  const local = (
    e: PointerEvent<SVGSVGElement>,
    ref: RefObject<SVGSVGElement>,
  ) => {
    const r = ref.current?.getBoundingClientRect();
    return r
      ? {
          x: round(((e.clientX - r.left) / r.width) * 28 - 12),
          y: round(7 - ((e.clientY - r.top) / r.height) * 12),
        }
      : null;
  };
  const sx = (v: number) => (v + 12) * 22,
    sy = (v: number) => (7 - v) * 22;
  return (
    <section
      className="esf10086-page"
      data-testid="school-mockup-0760"
      data-object-model="dedicated-directed-external-section-singularity-engine"
      data-point={p ? `${p.x},${p.y}` : "undefined"}
      data-ratio={`${m}:${n}`}
      data-side={side}
      data-distances={p ? `${ap},${pb}` : "undefined"}
      data-match={String(match)}
      data-singular={String(!p)}
      data-actions={actions}
    >
      <header className="esf10086-hero">
        <small>CLASS 10 · COORDINATE GEOMETRY</small>
        <h1>External Section Formula</h1>
        <p>
          Locate a point that divides a segment externally in a given ratio.
        </p>
        <div>
          <span>18 min</span>
          <span>INTERMEDIATE</span>
          <span>COORDINATE GEOMETRY</span>
          <span>external-section</span>
        </div>
      </header>
      <nav className="esf10086-tabs">
        {["Interact", "Learn", "Example", "Formula", "Practice"].map((x, i) => (
          <button
            className={tab === i ? "active" : ""}
            onClick={() => act(() => setTab(i))}
            key={x}
          >
            {x}
          </button>
        ))}
        <button onClick={reset}>
          <RotateCcw /> Reset
        </button>
      </nav>
      <main>
        <section className="esf10086-lab">
          <h2>① INTERACTIVE: LOCATE EXTERNAL POINT</h2>
          <p>
            Move P on the extended line to locate a point that divides AB
            externally in the ratio m:n.
          </p>
          <div className="workspace">
            <aside>
              <section>
                <h3>Ratio (m:n)</h3>
                <div className="ratio">
                  <label>
                    m ={" "}
                    <input
                      aria-label="External ratio m"
                      type="number"
                      min="1"
                      value={m}
                      onChange={(e) =>
                        act(() => {
                          const value = Math.max(1, +e.target.value);
                          setM(value);
                          if (value !== n)
                            setSide(value > n ? "right" : "left");
                        })
                      }
                    />
                  </label>
                  <label>
                    n ={" "}
                    <input
                      aria-label="External ratio n"
                      type="number"
                      min="1"
                      value={n}
                      onChange={(e) =>
                        act(() => {
                          const value = Math.max(1, +e.target.value);
                          setN(value);
                          if (m !== value)
                            setSide(m > value ? "right" : "left");
                        })
                      }
                    />
                  </label>
                </div>
                <div className="presets">
                  {PRESETS.slice(0, 5).map(([x, y]) => (
                    <button
                      className={m === x && n === y ? "active" : ""}
                      onClick={() => preset(x, y)}
                      key={`${x}:${y}`}
                    >
                      {x}:{y}
                    </button>
                  ))}
                </div>
              </section>
              <section>
                <h3>Signed ratio</h3>
                <strong>
                  {m} / {n} = {(m / n).toFixed(3)}
                </strong>
              </section>
              <section>
                <h3>P position</h3>
                <label>
                  <input
                    aria-label="Outside near A"
                    type="radio"
                    checked={side === "left"}
                    onChange={() => chooseSide("left")}
                  />{" "}
                  Outside near A
                </label>
                <label>
                  <input
                    aria-label="Outside near B"
                    type="radio"
                    checked={side === "right"}
                    onChange={() => chooseSide("right")}
                  />{" "}
                  Outside near B
                </label>
              </section>
              <label>
                <input
                  aria-label="Show coordinate grid"
                  type="checkbox"
                  checked={grid}
                  onChange={(e) => act(() => setGrid(e.target.checked))}
                />{" "}
                Show coordinate grid
              </label>
            </aside>
            <article>
              <div className="region">
                <b>← Outside near A</b>
                <span>
                  Drag P on the extended line.
                  <small>P must stay outside the segment.</small>
                </span>
                <b>Outside near B →</b>
              </div>
              <svg
                ref={svgRef}
                viewBox="0 0 616 264"
                aria-label="External section directed coordinate line"
                onPointerMove={(e) => {
                  if (!dragging) return;
                  const q = local(e, svgRef);
                  if (q) infer(q);
                }}
                onPointerUp={() => dragging && act(() => setDragging(false))}
                onPointerLeave={() => dragging && act(() => setDragging(false))}
              >
                {grid &&
                  Array.from({ length: 29 }, (_, i) => (
                    <g key={i}>
                      <line
                        className="grid"
                        x1={i * 22}
                        y1="0"
                        x2={i * 22}
                        y2="264"
                      />
                      <line
                        className="grid"
                        x1="0"
                        y1={i * 22}
                        x2="616"
                        y2={i * 22}
                      />
                    </g>
                  ))}
                <line className="axis" x1="4" y1={sy(0)} x2="610" y2={sy(0)} />
                <line
                  className="inside"
                  x1={sx(A.x)}
                  y1={sy(A.y)}
                  x2={sx(B.x)}
                  y2={sy(B.y)}
                />
                {p && (
                  <line
                    className="extend"
                    x1={sx(side === "right" ? B.x : A.x)}
                    y1={sy(side === "right" ? B.y : A.y)}
                    x2={sx(p.x)}
                    y2={sy(p.y)}
                  />
                )}
                <circle className="a" cx={sx(A.x)} cy={sy(A.y)} r="6" />
                <circle className="b" cx={sx(B.x)} cy={sy(B.y)} r="6" />
                {p && (
                  <circle
                    className="p"
                    tabIndex={0}
                    aria-label="Draggable external point P"
                    cx={sx(p.x)}
                    cy={sy(p.y)}
                    r="8"
                    onPointerDown={(e) => {
                      e.currentTarget.setPointerCapture(e.pointerId);
                      setDragging(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowRight") preset(m + 1, n);
                      if (e.key === "ArrowLeft" && m > 1) preset(m - 1, n);
                    }}
                  />
                )}
                <text x={sx(A.x) - 15} y={sy(A.y) - 18}>
                  A (0, 0)
                </text>
                <text x={sx(B.x) - 15} y={sy(B.y) - 18}>
                  B (4, 2)
                </text>
                {p && (
                  <text className="plabel" x={sx(p.x) - 16} y={sy(p.y) - 20}>
                    P ({p.x}, {p.y})
                  </text>
                )}
              </svg>
              <div className="regions">
                <span>Outside region</span>
                <b>Inside region (between A and B)</b>
                <span>Outside region</span>
              </div>
            </article>
          </div>
          <div className="results">
            <article>
              <h3>Live results</h3>
              {p ? (
                <>
                  <p>
                    P coordinates{" "}
                    <strong>
                      P = ({p.x}, {p.y})
                    </strong>
                  </p>
                  <p>
                    Vector AP = ({p.x}, {p.y})
                  </p>
                  <p>Vector AB = (4, 2)</p>
                </>
              ) : (
                <strong>Undefined: point moves infinitely far away.</strong>
              )}
            </article>
            <article>
              <h3>Rule (external section)</h3>
              <p>For external ratio m:n (m ≠ n),</p>
              <strong>P ((mx₂−nx₁)/(m−n), (my₂−ny₁)/(m−n))</strong>
              {p && (
                <em>
                  <CheckCircle2 /> AP : PB = {ap} : {pb} matches {m}:{n}
                </em>
              )}
            </article>
          </div>
        </section>
        <section className="esf10086-why">
          <article>
            <h2>② WHY IT WORKS</h2>
            <p>
              For external division, directed AP and PB point in the same
              direction. Eliminating the direction vector gives:
            </p>
            <strong>P ((mx₂−nx₁)/(m−n), (my₂−ny₁)/(m−n)), m ≠ n.</strong>
          </article>
          <article className="note">
            <h2>IMPORTANT NOTE</h2>
            <p>If m=n, the denominator m−n=0.</p>
            <strong>The point moves infinitely far away.</strong>
            <div className="infinity">P → ∞ ─── A ─── B ─── P → ∞</div>
          </article>
        </section>
        <section className="esf10086-example">
          <article>
            <h2>③ WORKED EXAMPLE</h2>
            <p>
              Find P that divides AB externally in the ratio 2:1, where A(0,0),
              B(4,2).
            </p>
            <strong>P ((2(4)−1(0))/(2−1), (2(2)−1(0))/(2−1)) = (8,4)</strong>
            <p>Check: AP:PB = √80:√20 = 2:1 ✓</p>
          </article>
          <svg viewBox="0 0 420 230" aria-label="Worked external section graph">
            <line x1="30" y1="190" x2="400" y2="190" />
            <line x1="60" y1="215" x2="60" y2="15" />
            <line className="inside" x1="60" y1="190" x2="200" y2="120" />
            <line className="extend" x1="200" y1="120" x2="340" y2="50" />
            <circle className="a" cx="60" cy="190" r="6" />
            <circle className="b" cx="200" cy="120" r="6" />
            <circle className="p" cx="340" cy="50" r="7" />
            <text x="65" y="210">
              A(0,0)
            </text>
            <text x="180" y="110">
              B(4,2)
            </text>
            <text className="plabel" x="315" y="35">
              P(8,4)
            </text>
          </svg>
          <article className="mistake">
            <h2>COMMON MISTAKE</h2>
            <p>Using the internal formula puts P between A and B.</p>
            <strong>Wrong: P=((mx₂+nx₁)/(m+n), ...)</strong>
            <em>✕ Lies between A and B</em>
          </article>
        </section>
        <section className="esf10086-challenge">
          <h2>⑤ CHALLENGE: EXPLORE RATIOS</h2>
          <p>Move P for each ratio and observe how the position changes.</p>
          <aside>
            {PRESETS.map(([x, y]) => (
              <button
                className={m === x && n === y ? "active" : ""}
                onClick={() => preset(x, y)}
                key={`${x}:${y}`}
              >
                {x === y ? "m = n (try)" : `${x}:${y}`}
              </button>
            ))}
          </aside>
          <table>
            <thead>
              <tr>
                <th>Ratio</th>
                <th>P coordinates</th>
                <th>AP : PB</th>
                <th>Observation</th>
              </tr>
            </thead>
            <tbody>
              {PRESETS.map(([x, y]) => {
                const q = derive(x, y, x > y ? "right" : "left");
                return (
                  <tr key={`${x}:${y}`}>
                    <td>
                      {x}:{y}
                    </td>
                    <td>{q ? `(${q.x}, ${q.y})` : "Undefined"}</td>
                    <td>{q ? `${dist(A, q)} : ${dist(q, B)}` : "—"}</td>
                    <td>
                      {q
                        ? Math.abs(x - y) === 1
                          ? "Farther from B"
                          : "Closer to endpoint"
                        : "Point goes to infinity"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <article>
            <h3>Try it yourself</h3>
            <p>
              Set m=10 and n=9, then increase both while keeping m−n small. What
              happens to P?
            </p>
            <strong>Why does it move very far away?</strong>
          </article>
        </section>
      </main>
      <nav className="esf10086-nav">
        <Link to="/lessons/school/class-10/class-10-coordinate-geometry-internal-section-formula">
          <ArrowLeft /> Internal Section Formula
        </Link>
        <Link to="/lessons/school/class-10/class-10-coordinate-geometry-area-of-triangle-using-coordinates">
          Area of Triangle Using Coordinates <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}
