import { ArrowLeft, ArrowRight, Check, RotateCcw, Undo2 } from "lucide-react";
import { type PointerEvent, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./CoordinateHeronTargetLesson10081.css";

type Point = { x: number; y: number };
const A: Point = { x: 0, y: 0 };
const B: Point = { x: 4, y: 0 };
const START: Point = { x: 0, y: 3 };
const rr = (n: number, p = 4) => Math.round(n * 10 ** p) / 10 ** p;
const distance = (p: Point, q: Point) => Math.hypot(p.x - q.x, p.y - q.y);

export default function CoordinateHeronTargetLesson10081({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [c, setC] = useState(START),
    [snap, setSnap] = useState(true),
    [history, setHistory] = useState<Point[]>([]),
    [tab, setTab] = useState(0),
    [target, setTarget] = useState(6),
    [checked, setChecked] = useState(true),
    [actions, setActions] = useState(0),
    [dragging, setDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const m = useMemo(() => {
    const ab = distance(A, B),
      bc = distance(B, c),
      ca = distance(c, A),
      s = (ab + bc + ca) / 2,
      coordinate =
        Math.abs(A.x * (B.y - c.y) + B.x * (c.y - A.y) + c.x * (A.y - B.y)) / 2,
      heron = Math.sqrt(Math.max(0, s * (s - ab) * (s - bc) * (s - ca)));
    return {
      ab: rr(ab),
      bc: rr(bc),
      ca: rr(ca),
      s: rr(s),
      coordinate: rr(coordinate),
      heron: rr(heron),
      match: Math.abs(coordinate - heron) < 0.0001,
    };
  }, [c]);
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const setPoint = (next: Point, remember = true) => {
    const p = {
      x: Math.max(-2, Math.min(6, snap ? Math.round(next.x) : rr(next.x, 1))),
      y: Math.max(-2, Math.min(5, snap ? Math.round(next.y) : rr(next.y, 1))),
    };
    if (remember) setHistory((h) => [...h, c].slice(-20));
    setC(p);
    setChecked(false);
  };
  const local = (e: PointerEvent<SVGSVGElement>) => {
    const r = svgRef.current?.getBoundingClientRect();
    if (!r) return null;
    return {
      x: ((e.clientX - r.left) / r.width) * 9 - 2,
      y: 5 - ((e.clientY - r.top) / r.height) * 8,
    };
  };
  const undo = () =>
    act(() => {
      const previous = history.at(-1);
      if (previous) {
        setC(previous);
        setHistory((h) => h.slice(0, -1));
        setChecked(false);
      }
    });
  const reset = () =>
    act(() => {
      setC(START);
      setHistory([]);
      setSnap(true);
      setTarget(6);
      setChecked(true);
    });
  const sx = (x: number) => (x + 2) * 50,
    sy = (y: number) => (5 - y) * 50;
  return (
    <section
      className="ch10081-page"
      data-testid="school-mockup-0755"
      data-object-model="dedicated-coordinate-shoelace-heron-reconciliation-engine"
      data-c={`${c.x},${c.y}`}
      data-sides={`${m.ab},${m.bc},${m.ca}`}
      data-semiperimeter={m.s}
      data-coordinate-area={m.coordinate}
      data-heron-area={m.heron}
      data-match={String(m.match)}
      data-snap={String(snap)}
      data-history={history.length}
      data-checked={String(checked)}
      data-actions={actions}
    >
      <header className="ch10081-hero">
        <small>CLASS 9 · MENSURATION</small>
        <h1>Coordinate Area versus Heron&apos;s Formula</h1>
        <p>
          Compute the same triangle area using coordinates and side lengths,
          then reconcile the results.
        </p>
        <div>
          <span>18 min</span>
          <span>INTERMEDIATE</span>
          <span>CONCEPT</span>
          <span>geometry2d</span>
        </div>
      </header>
      <nav className="ch10081-tabs">
        {["INTERACT", "LEARN", "EXAMPLE", "FORMULA", "PRACTICE"].map((x, i) => (
          <button
            key={x}
            className={tab === i ? "active" : ""}
            onClick={() => act(() => setTab(i))}
          >
            {x}
          </button>
        ))}
      </nav>
      <main>
        <section className="ch10081-lab">
          <header>
            <h2>1. Drag a vertex to explore</h2>
            <p>
              Move point C (blue) to change the triangle. A and B are fixed.
            </p>
            <div>
              <button
                aria-label="Undo point movement"
                disabled={!history.length}
                onClick={undo}
              >
                <Undo2 />
              </button>
              <button onClick={reset}>
                <RotateCcw /> Reset
              </button>
              <label>
                <input
                  type="checkbox"
                  checked={snap}
                  onChange={() => act(() => setSnap((v) => !v))}
                />{" "}
                Snap to grid
              </label>
            </div>
          </header>
          <div className="ch10081-graph">
            <svg
              ref={svgRef}
              viewBox="0 0 450 400"
              aria-label="Draggable coordinate triangle"
              onPointerMove={(e) => {
                if (!dragging) return;
                const p = local(e);
                if (p) setPoint(p, false);
              }}
              onPointerUp={() => dragging && act(() => setDragging(false))}
              onPointerLeave={() => dragging && act(() => setDragging(false))}
            >
              {Array.from({ length: 10 }, (_, i) => (
                <line
                  key={`v${i}`}
                  className="grid"
                  x1={i * 50}
                  y1="0"
                  x2={i * 50}
                  y2="400"
                />
              ))}
              {Array.from({ length: 9 }, (_, i) => (
                <line
                  key={`h${i}`}
                  className="grid"
                  x1="0"
                  y1={i * 50}
                  x2="450"
                  y2={i * 50}
                />
              ))}
              <line className="axis" x1="0" y1={sy(0)} x2="450" y2={sy(0)} />
              <line className="axis" x1={sx(0)} y1="0" x2={sx(0)} y2="400" />
              <path
                className="triangle"
                d={`M${sx(A.x)} ${sy(A.y)}L${sx(B.x)} ${sy(B.y)}L${sx(c.x)} ${sy(c.y)}Z`}
              />
              <circle className="fixed" cx={sx(A.x)} cy={sy(A.y)} r="7" />
              <circle className="fixed" cx={sx(B.x)} cy={sy(B.y)} r="7" />
              <circle
                className="moving"
                tabIndex={0}
                aria-label="Draggable vertex C"
                cx={sx(c.x)}
                cy={sy(c.y)}
                r="8"
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  setHistory((h) => [...h, c].slice(-20));
                  setDragging(true);
                }}
                onKeyDown={(e) => {
                  const d = snap || e.shiftKey ? 1 : 0.2;
                  if (e.key === "ArrowLeft")
                    act(() => setPoint({ x: c.x - d, y: c.y }));
                  if (e.key === "ArrowRight")
                    act(() => setPoint({ x: c.x + d, y: c.y }));
                  if (e.key === "ArrowUp")
                    act(() => setPoint({ x: c.x, y: c.y + d }));
                  if (e.key === "ArrowDown")
                    act(() => setPoint({ x: c.x, y: c.y - d }));
                }}
              />
              <text x={sx(A.x) - 24} y={sy(A.y) + 30}>
                A (0, 0)
              </text>
              <text x={sx(B.x) - 12} y={sy(B.y) + 30}>
                B (4, 0)
              </text>
              <text x={sx(c.x) - 62} y={sy(c.y) - 10}>
                C ({c.x}, {c.y})
              </text>
            </svg>
            <aside>
              <h3>Vertex coordinates</h3>
              <p>● A (0, 0)</p>
              <p>● B (4, 0)</p>
              <p>
                ● C ({c.x}, {c.y})
              </p>
              <small>
                Drag C to explore.
                <br />A and B are fixed.
              </small>
            </aside>
          </div>
          <article className="ch10081-lengths">
            <h2>2. Side lengths from coordinates</h2>
            <p>Distances are computed from the coordinates.</p>
            <span>
              ● AB (base)<b>{m.ab.toFixed(4)}</b>
            </span>
            <span>
              ● BC<b>{m.bc.toFixed(4)}</b>
            </span>
            <span>
              ● CA (height)<b>{m.ca.toFixed(4)}</b>
            </span>
            <strong>
              Semiperimeter <i>s</i>
              <br />s = (a+b+c)/2 = {m.s.toFixed(4)}
            </strong>
          </article>
        </section>
        <section className="ch10081-methods">
          <article>
            <h2>3. Coordinate Area (Determinant / Shoelace)</h2>
            <p>Use the determinant (shoelace) formula.</p>
            <strong>K = ½ |x₁(y₂−y₃) + x₂(y₃−y₁) + x₃(y₁−y₂)|</strong>
            <p>Substituting (in order A, B, C):</p>
            <p>
              K = ½ |0(0−{c.y}) + 4({c.y}−0) + {c.x}(0−0)|
            </p>
            <b>
              Coordinate Area &nbsp; K = {m.coordinate.toFixed(4)} square units
            </b>
          </article>
          <article>
            <h2>4. Heron&apos;s Formula</h2>
            <p>Use the side lengths and semiperimeter.</p>
            <strong>K = √[s(s−a)(s−b)(s−c)]</strong>
            <p>
              = √[{m.s}({m.s}−{m.ab})({m.s}−{m.bc})({m.s}−{m.ca})]
            </p>
            <p>= {m.heron.toFixed(4)}</p>
            <b>
              Heron&apos;s Area &nbsp; K = {m.heron.toFixed(4)} square units
            </b>
          </article>
        </section>
        <section className="ch10081-compare">
          <h2>5. Compare the two results</h2>
          <div>
            <span>
              Coordinate Area<strong>{m.coordinate.toFixed(4)}</strong>
            </span>
            <b>=</b>
            <span>
              Heron&apos;s Area<strong>{m.heron.toFixed(4)}</strong>
            </span>
            <em>
              <Check /> {m.match ? "Match!" : "Check rounding"}
            </em>
          </div>
        </section>
        <section className="ch10081-cards">
          <article>
            <h2>Why it works</h2>
            <p>
              Both methods compute the same geometric quantity: the area of
              triangle ABC.
            </p>
            <p>• Shoelace is derived from signed parallelogram areas.</p>
            <p>• Heron is derived from side lengths and semiperimeter.</p>
          </article>
          <article>
            <h2>Worked Example (Right triangle)</h2>
            <p>A (0,0), B (4,0), C (0,3)</p>
            <p>Sides: AB=4, BC=5, CA=3</p>
            <p>Both formulas give area = 6 square units.</p>
          </article>
          <article className="warning">
            <h2>Common Mistake</h2>
            <p>
              Rounding side lengths too early can make the two results appear
              different.
            </p>
            <p>Keep more decimal places and compare only at the end.</p>
          </article>
        </section>
        <section className="ch10081-challenge">
          <div>
            <h2>Try this Challenge</h2>
            <p>
              Drag point C while keeping the area equal to {target.toFixed(4)}{" "}
              square units.
            </p>
          </div>
          <label>
            Target area
            <input
              aria-label="Target area"
              type="number"
              min="0.5"
              step="0.5"
              value={target}
              onChange={(e) =>
                act(() => {
                  setTarget(+e.target.value);
                  setChecked(false);
                })
              }
            />
          </label>
          <button onClick={() => act(() => setChecked(true))}>
            Check area <RotateCcw />
          </button>
          <strong
            className={
              checked && Math.abs(m.coordinate - target) < 0.001 ? "yes" : ""
            }
          >
            {checked
              ? Math.abs(m.coordinate - target) < 0.001
                ? "Target matched"
                : "Keep adjusting C"
              : "Ready to check"}
          </strong>
        </section>
      </main>
      <nav className="ch10081-nav">
        <Link to="/lessons/school/class-9/class-9-mensuration-semi-perimeter-lab">
          <ArrowLeft /> Previous
          <br />
          Semi-Perimeter Lab
        </Link>
        <span>● ● ● ● ●</span>
        <Link to="/lessons/school/class-9/class-9-mensuration-combined-solids">
          <span>
            Next
            <br />
            Combined Solids
          </span>
          <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}
