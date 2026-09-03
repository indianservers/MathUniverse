import {
  ArrowLeft,
  ArrowRight,
  Check,
  Expand,
  Lightbulb,
  RotateCcw,
  Star,
  TriangleAlert,
} from "lucide-react";
import { type PointerEvent, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./MidpointTheoremTargetLesson10077.css";
type P = { x: number; y: number };
type V = "a" | "b" | "c";
const START = {
  a: { x: 324.32, y: 91.79 },
  b: { x: 100, y: 320 },
  c: { x: 500, y: 320 },
};
const mid = (a: P, b: P) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
const dist = (a: P, b: P) => Math.hypot(a.x - b.x, a.y - b.y);
const rr = (n: number) => Math.round(n * 100) / 100;
export default function MidpointTheoremTargetLesson10077({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [pts, setPts] = useState(START),
    [showMid, setShowMid] = useState(true),
    [tool, setTool] = useState<"move" | "inspect">("move"),
    [fullscreen, setFullscreen] = useState(false),
    [tab, setTab] = useState(0),
    [active, setActive] = useState<V | null>(null),
    [checks, setChecks] = useState([true, true]),
    [actions, setActions] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const d = useMemo(() => mid(pts.a, pts.b), [pts]),
    e = useMemo(() => mid(pts.a, pts.c), [pts]);
  const lengths = [
    dist(pts.a, pts.b),
    dist(pts.a, pts.c),
    dist(pts.b, pts.c),
    dist(d, e),
  ].map((n) => rr(n / 40));
  const ratio = rr(lengths[3] / lengths[2]);
  const parallel =
    Math.abs(
      (e.y - d.y) * (pts.c.x - pts.b.x) - (e.x - d.x) * (pts.c.y - pts.b.y),
    ) < 0.02;
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const reset = () =>
    act(() => {
      setPts(START);
      setShowMid(true);
      setTool("move");
      setFullscreen(false);
      setChecks([true, true]);
    });
  const point = (ev: PointerEvent<SVGSVGElement>) => {
    const b = svgRef.current?.getBoundingClientRect();
    return b
      ? {
          x: ((ev.clientX - b.left) / b.width) * 600,
          y: ((ev.clientY - b.top) / b.height) * 400,
        }
      : null;
  };
  const update = (k: V, p: P) =>
    setPts((old) => ({
      ...old,
      [k]: {
        x: Math.max(55, Math.min(545, p.x)),
        y: Math.max(45, Math.min(355, p.y)),
      },
    }));
  const keyMove = (k: V, dx: number, dy: number) =>
    act(() => update(k, { x: pts[k].x + dx, y: pts[k].y + dy }));
  return (
    <section
      className={`mt10077-page ${fullscreen ? "fullscreen" : ""}`}
      data-testid="school-mockup-0751"
      data-object-model="dedicated-moving-triangle-midpoint-segment-engine"
      data-points={`${rr(pts.a.x)},${rr(pts.a.y)};${rr(pts.b.x)},${rr(pts.b.y)};${rr(pts.c.x)},${rr(pts.c.y)}`}
      data-midpoints={`${rr(d.x)},${rr(d.y)};${rr(e.x)},${rr(e.y)}`}
      data-lengths={lengths.join(",")}
      data-ratio={ratio}
      data-parallel={String(parallel)}
      data-show-midpoints={String(showMid)}
      data-tool={tool}
      data-fullscreen={String(fullscreen)}
      data-checks={checks.map(Number).join(",")}
      data-actions={actions}
    >
      <header className="mt10077-hero">
        <small>CLASS 9 · QUADRILATERAL PROOFS</small>
        <h1>Midpoint Theorem</h1>
        <p>
          If D and E are midpoints of two sides of a triangle ABC, then DE ∥ BC
          and DE = ½ BC.
        </p>
        <div>
          <span>Class 9</span>
          <span>Geometry</span>
          <span>Proof</span>
          <span>10-12 min</span>
        </div>
      </header>
      <nav className="mt10077-tabs">
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
        <section className="mt10077-lab">
          <header>
            <div>
              <h2>Explore the Midpoint Theorem</h2>
              <p>
                Drag vertices A, B, and C to change the triangle. Points D and E
                stay at the midpoints.
              </p>
            </div>
            <button
              aria-label="Toggle fullscreen"
              onClick={() => act(() => setFullscreen(!fullscreen))}
            >
              <Expand />
            </button>
          </header>
          <div className="mt10077-work">
            <aside>
              <button
                className={tool === "move" ? "active" : ""}
                onClick={() =>
                  act(() => setTool(tool === "move" ? "inspect" : "move"))
                }
              >
                ⌁ {tool === "move" ? "Move A, B, C" : "Inspect points"}
              </button>
              <button onClick={reset}>
                <RotateCcw /> Reset
              </button>
              <label>
                <input
                  type="checkbox"
                  checked={showMid}
                  onChange={() => act(() => setShowMid(!showMid))}
                />{" "}
                Show midpoints
              </label>
              <section>
                <h3>Measurements</h3>
                <p>AB = {lengths[0].toFixed(2)} cm</p>
                <p>AC = {lengths[1].toFixed(2)} cm</p>
                <p>BC = {lengths[2].toFixed(2)} cm</p>
                <hr />
                <p>DE = {lengths[3].toFixed(2)} cm</p>
              </section>
              <section>
                <h3>Live Ratios</h3>
                <strong>
                  DE / BC = {lengths[3].toFixed(2)} / {lengths[2].toFixed(2)} ={" "}
                  {ratio.toFixed(3)}
                </strong>
                <strong>
                  DE / BC = 1/2 = 0.500 <Check />
                </strong>
              </section>
              <footer>
                <Check />
                <b>Verified</b>
                <p>DE ∥ BC and DE = ½ BC</p>
              </footer>
            </aside>
            <article>
              <div className="legend">
                <h3>Legend</h3>
                <p>
                  <i /> Vertices (move)
                </p>
                <p>
                  <i /> Midpoints (fixed)
                </p>
                <p>
                  <i /> DE (midpoint segment)
                </p>
                <p>
                  <i /> BC (opposite side)
                </p>
              </div>
              <svg
                ref={svgRef}
                viewBox="0 0 600 400"
                aria-label="Draggable midpoint theorem triangle"
                onPointerMove={(ev) => {
                  if (!active || tool !== "move") return;
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
                <line className="segment" x1={d.x} y1={d.y} x2={e.x} y2={e.y} />
                <line
                  className="measure"
                  x1={pts.b.x}
                  y1={pts.b.y + 32}
                  x2={pts.c.x}
                  y2={pts.c.y + 32}
                />
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
                        if (tool !== "move") return;
                        const n = ev.shiftKey ? 10 : 4;
                        if (ev.key === "ArrowLeft") keyMove(k, -n, 0);
                        if (ev.key === "ArrowRight") keyMove(k, n, 0);
                        if (ev.key === "ArrowUp") keyMove(k, 0, -n);
                        if (ev.key === "ArrowDown") keyMove(k, 0, n);
                      }}
                    />
                    <text
                      x={pts[k].x + (k === "a" ? -5 : k === "b" ? -16 : 10)}
                      y={pts[k].y + (k === "a" ? -12 : 20)}
                    >
                      {k.toUpperCase()}
                    </text>
                  </g>
                ))}
                {showMid && (
                  <>
                    {[
                      [d, "D"],
                      [e, "E"],
                    ].map(([p, n]) => (
                      <g key={String(n)}>
                        <circle
                          className="mid"
                          cx={(p as P).x}
                          cy={(p as P).y}
                          r="7"
                        />
                        <text
                          x={(p as P).x + (n === "D" ? -18 : 10)}
                          y={(p as P).y - 5}
                        >
                          {n as string}
                        </text>
                      </g>
                    ))}
                  </>
                )}
                <text
                  className="de"
                  x={(d.x + e.x) / 2 - 25}
                  y={(d.y + e.y) / 2 - 14}
                >
                  {lengths[3].toFixed(2)} cm
                </text>
                <text
                  className="bc"
                  x={(pts.b.x + pts.c.x) / 2 - 25}
                  y={pts.b.y + 27}
                >
                  {lengths[2].toFixed(2)} cm
                </text>
              </svg>
              <aside>
                <Lightbulb />
                <b>Tip</b>
                <p>
                  Keep D and E at the midpoints while moving A, B, or C. The
                  relationships always hold.
                </p>
              </aside>
            </article>
          </div>
        </section>
        <Proof />
        <section className="mt10077-theory">
          <Worked />
          <Warning />
        </section>
        <section className="mt10077-challenge">
          <div>
            <h2>
              <Star /> Your Challenge
            </h2>
            <p>Move A, B, or C while keeping D and E at the midpoints.</p>
            <section>
              {["Check Parallelism", "Check Length Relationship"].map(
                (x, i) => (
                  <button
                    key={x}
                    className={checks[i] ? "done" : ""}
                    onClick={() =>
                      act(() => {
                        const n = [...checks];
                        n[i] = !n[i];
                        setChecks(n);
                      })
                    }
                  >
                    <b>
                      Task {i + 1}: {x}
                    </b>
                    <small>
                      {i === 0
                        ? "Verify that DE remains parallel to BC."
                        : "Verify that DE is always half of BC."}
                    </small>
                    <strong>{i === 0 ? "DE ∥ BC" : "DE = ½ BC"}</strong>
                    {checks[i] && <Check />}
                  </button>
                ),
              )}
            </section>
          </div>
          <aside>
            <b>Keep exploring!</b>
            <p>Drag the triangle to test many shapes.</p>
            <i>{checks.filter(Boolean).length * 50}%</i>
            <strong>
              {checks.every(Boolean)
                ? "Both properties hold!"
                : "Complete both checks"}
            </strong>
          </aside>
        </section>
      </main>
      <nav className="mt10077-adjacent">
        <Link to="/lessons/school/class-9/class-9-quadrilateral-proofs-properties-of-parallelogram">
          <ArrowLeft /> Previous: Properties of Parallelogram
        </Link>
        <Link to="/lessons/school/class-9/class-9-quadrilateral-proofs-converse-of-midpoint-theorem">
          Next: Converse of Midpoint Theorem <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}
function Mini({ bad = false }: { bad?: boolean }) {
  return (
    <svg viewBox="0 0 190 125">
      <path d="M95 10 20 110h150Z" />
      <line
        className={bad ? "bad" : ""}
        x1={bad ? 52 : 57}
        y1={bad ? 72 : 60}
        x2={bad ? 143 : 133}
        y2={bad ? 72 : 60}
      />
    </svg>
  );
}
function Proof() {
  return (
    <section className="mt10077-proof">
      <article>
        <h2>Why does it work?</h2>
        <p>Consider △ABC with D and E as midpoints of AB and AC.</p>
        <ol>
          <li>AD = DB and AE = EC.</li>
          <li>Draw through D a line DF ∥ BC meeting AC produced at F.</li>
          <li>By BPT, the constructed triangles are congruent.</li>
          <li>The midpoint relationships force F = B.</li>
        </ol>
        <strong>Therefore, DE ∥ BC and DE = ½ BC.</strong>
      </article>
      <Mini />
    </section>
  );
}
function Worked() {
  return (
    <article>
      <h2>WORKED EXAMPLE</h2>
      <p>If BC = 10 cm, what is DE?</p>
      <strong>DE = ½ BC = ½ × 10 = 5 cm</strong>
      <footer>Answer: DE = 5 cm</footer>
    </article>
  );
}
function Warning() {
  return (
    <article className="warning">
      <h2>
        <TriangleAlert /> Warning: Common Misconception
      </h2>
      <p>
        Choosing points that only look centered does not guarantee midpoints.
        Only true midpoints ensure both theorem conclusions.
      </p>
      <div>
        <span>
          <Mini />
          <b>✓ Correct midpoints</b>
        </span>
        <span>
          <Mini bad />
          <b>× Not midpoints</b>
        </span>
      </div>
    </article>
  );
}
