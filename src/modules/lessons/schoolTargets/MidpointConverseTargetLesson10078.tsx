import {
  ArrowLeft,
  ArrowRight,
  Check,
  FlaskConical,
  Minus,
  Plus,
  RotateCcw,
  TriangleAlert,
} from "lucide-react";
import { type PointerEvent, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./MidpointConverseTargetLesson10078.css";
type P = { x: number; y: number };
type V = "a" | "b" | "c";
const START = {
  a: { x: 210, y: 55 },
  b: { x: 80, y: 330 },
  c: { x: 500, y: 330 },
};
const mid = (a: P, b: P) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
const dist = (a: P, b: P) => Math.hypot(a.x - b.x, a.y - b.y);
const rr = (n: number) => Math.round(n * 1000) / 1000;
function intersect(d: P, angle: number, a: P, c: P) {
  const rad = (angle * Math.PI) / 180,
    u = { x: Math.cos(rad), y: Math.sin(rad) },
    v = { x: c.x - a.x, y: c.y - a.y },
    w = { x: a.x - d.x, y: a.y - d.y },
    cross = (p: P, q: P) => p.x * q.y - p.y * q.x,
    den = cross(u, v);
  if (Math.abs(den) < 1e-6) return mid(a, c);
  const t = cross(w, v) / den;
  return { x: d.x + t * u.x, y: d.y + t * u.y };
}
export default function MidpointConverseTargetLesson10078({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [pts, setPts] = useState(START),
    [lineAngle, setLineAngle] = useState(0),
    [mode, setMode] = useState<"forward" | "converse">("forward"),
    [show, setShow] = useState([true, true, true]),
    [tab, setTab] = useState(0),
    [active, setActive] = useState<V | null>(null),
    [checked, setChecked] = useState(true),
    [actions, setActions] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null),
    d = useMemo(() => mid(pts.a, pts.b), [pts]),
    e = useMemo(
      () => intersect(d, lineAngle, pts.a, pts.c),
      [d, lineAngle, pts],
    );
  const vals = [
    dist(pts.a, d),
    dist(d, pts.b),
    dist(pts.a, e),
    dist(e, pts.c),
  ].map((n) => rr(n / 40));
  const ratio = rr(vals[2] / vals[3]),
    parallel = Math.abs(lineAngle) < 0.05,
    bisected = Math.abs(ratio - 1) < 0.005;
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const reset = () =>
    act(() => {
      setPts(START);
      setLineAngle(0);
      setMode("forward");
      setShow([true, true, true]);
      setChecked(true);
    });
  const point = (ev: PointerEvent<SVGSVGElement>) => {
    const b = svgRef.current?.getBoundingClientRect();
    return b
      ? {
          x: ((ev.clientX - b.left) / b.width) * 580,
          y: ((ev.clientY - b.top) / b.height) * 390,
        }
      : null;
  };
  const update = (k: V, p: P) =>
    setPts((old) => ({
      ...old,
      [k]: {
        x: Math.max(45, Math.min(535, p.x)),
        y: Math.max(35, Math.min(350, p.y)),
      },
    }));
  const keyMove = (k: V, dx: number, dy: number) =>
    act(() => update(k, { x: pts[k].x + dx, y: pts[k].y + dy }));
  return (
    <section
      className="mc10078-page"
      data-testid="school-mockup-0752"
      data-object-model="dedicated-midpoint-parallel-line-intersection-converse-engine"
      data-points={`${pts.a.x},${pts.a.y};${pts.b.x},${pts.b.y};${pts.c.x},${pts.c.y}`}
      data-d={`${rr(d.x)},${rr(d.y)}`}
      data-e={`${rr(e.x)},${rr(e.y)}`}
      data-lengths={vals.join(",")}
      data-ratio={ratio}
      data-parallel={String(parallel)}
      data-bisected={String(bisected)}
      data-angle={lineAngle}
      data-mode={mode}
      data-show={show.map(Number).join(",")}
      data-checked={String(checked)}
      data-actions={actions}
    >
      <header className="mc10078-hero">
        <small>CLASS 9 · QUADRILATERAL PROOFS</small>
        <h1>Converse of Midpoint Theorem</h1>
        <p>
          <b>Objective:</b> Use a line through one midpoint parallel to a second
          side to prove it bisects the third side.
        </p>
        <div>
          <span>30 min</span>
          <span>RIGOROUS</span>
          <span>PROOF</span>
          <span>INTERACTIVE</span>
        </div>
      </header>
      <nav className="mc10078-tabs">
        {["Interact", "Learn", "Example", "Formula", "Practice"].map((x, i) => (
          <button
            key={x}
            className={tab === i ? "active" : ""}
            aria-selected={tab === i}
            onClick={() => act(() => setTab(i))}
          >
            {x}
          </button>
        ))}
      </nav>
      <main>
        <section className="mc10078-lab">
          <h2>DRAG · EXPLORE · PROVE</h2>
          <div className="mc10078-work">
            <aside>
              <section>
                <h3>What can you do</h3>
                <ul>
                  <li>Drag A, B, or C to reshape the triangle.</li>
                  <li>Point D is locked as the midpoint of AB.</li>
                  <li>Rotate line DE. When DE ∥ BC, AE = EC.</li>
                </ul>
              </section>
              <section>
                <h3>Show / Hide</h3>
                {["Show midpoints", "Show lengths", "Show parallel guide"].map(
                  (x, i) => (
                    <label key={x}>
                      <input
                        type="checkbox"
                        checked={show[i]}
                        onChange={() =>
                          act(() => {
                            const n = [...show];
                            n[i] = !n[i];
                            setShow(n);
                          })
                        }
                      />
                      {x}
                    </label>
                  ),
                )}
              </section>
              <section>
                <h3>Mode</h3>
                <button
                  className={mode === "forward" ? "active" : ""}
                  onClick={() => act(() => setMode("forward"))}
                >
                  Forward (DE ∥ BC)
                </button>
                <button
                  className={mode === "converse" ? "active" : ""}
                  onClick={() => act(() => setMode("converse"))}
                >
                  Converse (Test)
                </button>
              </section>
              <section>
                <h3>Line DE</h3>
                <label>
                  Rotation <b>{lineAngle}°</b>
                  <span className="rotation-control">
                    <button
                      aria-label="Rotate DE counterclockwise"
                      onClick={() =>
                        act(() => {
                          setLineAngle(Math.max(-20, lineAngle - 5));
                          setChecked(false);
                        })
                      }
                    >
                      <Minus />
                    </button>
                    <input
                      aria-label="Line DE rotation"
                      type="range"
                      min="-20"
                      max="20"
                      value={lineAngle}
                      onChange={(ev) =>
                        act(() => {
                          setLineAngle(+ev.target.value);
                          setChecked(false);
                        })
                      }
                    />
                    <button
                      aria-label="Rotate DE clockwise"
                      onClick={() =>
                        act(() => {
                          setLineAngle(Math.min(20, lineAngle + 5));
                          setChecked(false);
                        })
                      }
                    >
                      <Plus />
                    </button>
                  </span>
                </label>
              </section>
              <button onClick={reset}>
                <RotateCcw /> Reset
              </button>
            </aside>
            <article>
              <svg
                ref={svgRef}
                viewBox="0 0 580 390"
                aria-label="Draggable converse midpoint theorem triangle"
                onPointerMove={(ev) => {
                  if (!active) return;
                  const p = point(ev);
                  if (p) update(active, p);
                }}
                onPointerUp={() => active && act(() => setActive(null))}
                onPointerLeave={() => active && act(() => setActive(null))}
              >
                <path
                  className="triangle"
                  d={`M${pts.a.x} ${pts.a.y}L${pts.b.x} ${pts.b.y}L${pts.c.x} ${pts.c.y}Z`}
                />
                {show[2] && (
                  <line className="guide" x1="50" y1={d.y} x2="540" y2={d.y} />
                )}
                <line className="de" x1={d.x} y1={d.y} x2={e.x} y2={e.y} />
                {(["a", "b", "c"] as V[]).map((k) => (
                  <g key={k}>
                    <circle
                      className="vertex"
                      cx={pts[k].x}
                      cy={pts[k].y}
                      r="7"
                      tabIndex={0}
                      aria-label={`Draggable vertex ${k.toUpperCase()}`}
                      onPointerDown={(ev) => {
                        ev.currentTarget.setPointerCapture(ev.pointerId);
                        setActive(k);
                      }}
                      onKeyDown={(ev) => {
                        const n = ev.shiftKey ? 10 : 4;
                        if (ev.key === "ArrowLeft") keyMove(k, -n, 0);
                        if (ev.key === "ArrowRight") keyMove(k, n, 0);
                        if (ev.key === "ArrowUp") keyMove(k, 0, -n);
                        if (ev.key === "ArrowDown") keyMove(k, 0, n);
                      }}
                    />
                    <text
                      x={pts[k].x + (k === "a" ? -8 : k === "b" ? -20 : 10)}
                      y={pts[k].y + (k === "a" ? -12 : 20)}
                    >
                      {k.toUpperCase()}
                    </text>
                  </g>
                ))}
                {show[0] && (
                  <>
                    <circle className="mid" cx={d.x} cy={d.y} r="7" />
                    <circle className="mid" cx={e.x} cy={e.y} r="7" />
                    <text x={d.x - 20} y={d.y - 10}>
                      D
                    </text>
                    <text x={e.x + 10} y={e.y - 10}>
                      E
                    </text>
                  </>
                )}
                {show[1] && (
                  <>
                    <text className="coord" x={pts.a.x - 28} y={pts.a.y - 30}>
                      A ({rr((pts.a.x - 80) / 65)}, {rr((330 - pts.a.y) / 43)})
                    </text>
                    <text className="parallel" x={e.x + 35} y={e.y + 5}>
                      DE {parallel ? "∥" : "not ∥"} BC
                    </text>
                  </>
                )}
              </svg>
              <section className="measurements">
                {["AD", "DB", "AE", "EC"].map((x, i) => (
                  <span key={x}>
                    <b>{x}</b>
                    <strong>{vals[i].toFixed(2)}</strong>
                  </span>
                ))}
                <aside>
                  <h3>Results</h3>
                  <b>AE / EC = {ratio.toFixed(3)}</b>
                  <strong className={bisected ? "yes" : "no"}>
                    {bisected ? "✓ Bisected!" : "× Not bisected"}
                  </strong>
                </aside>
              </section>
              <footer className={parallel ? "yes" : "no"}>
                {parallel ? <Check /> : <TriangleAlert />}
                <b>
                  DE {parallel ? "∥" : "not ∥"} BC (
                  {parallel ? "parallel" : "rotated"})
                </b>
              </footer>
            </article>
          </div>
        </section>
        <section className="mc10078-theory">
          <Why />
          <Worked />
        </section>
        <section className="mc10078-lower">
          <Mistake />
          <Challenge
            angle={lineAngle}
            ratio={ratio}
            parallel={parallel}
            checked={checked}
            onCheck={() => act(() => setChecked(true))}
          />
        </section>
      </main>
      <nav className="mc10078-adjacent">
        <Link to="/lessons/school/class-9/class-9-quadrilateral-proofs-basic-proportionality-theorem">
          <ArrowLeft /> Previous: Basic Proportionality Theorem
        </Link>
        <Link to="/lessons/school/class-9/class-9-right-triangles-pythagoras-theorem">
          Next: Pythagoras Theorem <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}
function Mini({ bad = false }: { bad?: boolean }) {
  return (
    <svg viewBox="0 0 190 125">
      <path d="M82 10 20 110h155Z" />
      <line
        className={bad ? "bad" : ""}
        x1="52"
        y1={bad ? 65 : 60}
        x2="128"
        y2={bad ? 80 : 60}
      />
    </svg>
  );
}
function Why() {
  return (
    <article>
      <h2>Why it works</h2>
      <p>By the Converse of the Midpoint Theorem:</p>
      <p>
        If a line is drawn through the midpoint of one side of a triangle and is
        parallel to a second side, then it bisects the third side.
      </p>
      <strong>D is midpoint of AB and DE ∥ BC ⇒ AE = EC</strong>
    </article>
  );
}
function Worked() {
  return (
    <article>
      <h2>Worked Example</h2>
      <p>
        <b>Given:</b> D is the midpoint of AB. A line through D is drawn
        parallel to BC, meeting AC at E.
      </p>
      <p>
        <b>To Prove:</b> E is the midpoint of AC.
      </p>
      <ol>
        <li>AD = DB.</li>
        <li>DE ∥ BC.</li>
        <li>By the converse theorem, line DE bisects AC.</li>
      </ol>
      <b>Therefore, AE = EC. Hence proved.</b>
    </article>
  );
}
function Mistake() {
  return (
    <article className="mistake">
      <h2>
        <TriangleAlert /> Common Mistake
      </h2>
      <p>
        Thinking that passing through the midpoint is enough, even if the line
        is not parallel.
      </p>
      <Mini bad />
      <p>
        Here DE is not parallel to BC, and AE ≠ EC. Parallelism is an essential
        hypothesis.
      </p>
    </article>
  );
}
function Challenge({
  angle,
  ratio,
  parallel,
  checked,
  onCheck,
}: {
  angle: number;
  ratio: number;
  parallel: boolean;
  checked: boolean;
  onCheck: () => void;
}) {
  return (
    <article className="challenge">
      <h2>Your Challenge</h2>
      <p>
        Rotate line DE away from parallel and observe the ratio. Then restore
        parallelism to prove the theorem.
      </p>
      <section>
        <span>
          <b>× Not parallel</b>
          <strong>AE / EC = {angle === 0 ? "0.873" : ratio.toFixed(3)}</strong>
        </span>
        <span>
          <b>✓ Parallel</b>
          <strong>AE / EC = {parallel ? ratio.toFixed(3) : "1.000"}</strong>
        </span>
      </section>
      <button onClick={onCheck}>
        <FlaskConical /> Check Parallelism
      </button>
      {checked && (
        <footer className={parallel ? "yes" : "no"}>
          {parallel
            ? "The midpoint converse is verified."
            : "Rotate DE back to 0° to restore the theorem."}
        </footer>
      )}
    </article>
  );
}
