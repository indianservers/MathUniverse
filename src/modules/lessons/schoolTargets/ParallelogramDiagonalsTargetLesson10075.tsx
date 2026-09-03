import {
  ArrowLeft,
  ArrowRight,
  Check,
  Maximize2,
  Move,
  RotateCcw,
  Shuffle,
  TriangleAlert,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { type PointerEvent, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./ParallelogramDiagonalsTargetLesson10075.css";

type Point = { x: number; y: number };
type Handle = "a" | "b" | "c" | "d" | "o";
const START = {
  center: { x: 280, y: 190 },
  p: { x: 192, y: 144 },
  q: { x: -160, y: 120 },
};
const add = (a: Point, b: Point) => ({ x: a.x + b.x, y: a.y + b.y }),
  sub = (a: Point, b: Point) => ({ x: a.x - b.x, y: a.y - b.y }),
  neg = (p: Point) => ({ x: -p.x, y: -p.y });
const dist = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
const r = (n: number) => Math.round(n * 100) / 100;
const answers = ["always", "always", "never", "never"];

export default function ParallelogramDiagonalsTargetLesson10075({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [model, setModel] = useState(START),
    [candidate, setCandidate] = useState(START.center),
    [locked, setLocked] = useState(true),
    [proof, setProof] = useState(true),
    [tool, setTool] = useState<"drag" | "move">("drag"),
    [zoom, setZoom] = useState(100),
    [tab, setTab] = useState(0),
    [active, setActive] = useState<Handle | null>(null),
    [choices, setChoices] = useState(answers),
    [actions, setActions] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const pts = useMemo(
    () => ({
      a: add(model.center, neg(model.p)),
      c: add(model.center, model.p),
      b: add(model.center, neg(model.q)),
      d: add(model.center, model.q),
    }),
    [model],
  );
  const o = locked ? model.center : candidate;
  const measures = [
    dist(pts.a, o),
    dist(pts.c, o),
    dist(pts.b, o),
    dist(pts.d, o),
  ].map((n) => r(n / 40));
  const totals = [r(dist(pts.a, pts.c) / 40), r(dist(pts.b, pts.d) / 40)];
  const equal =
    Math.abs(measures[0] - measures[1]) < 0.02 &&
    Math.abs(measures[2] - measures[3]) < 0.02;
  const score = choices.filter((x, i) => x === answers[i]).length;
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const reset = () =>
    act(() => {
      setModel(START);
      setCandidate(START.center);
      setLocked(true);
      setProof(true);
      setTool("drag");
      setZoom(100);
    });
  const randomize = () =>
    act(() => {
      const n = actions + 1;
      const next = {
        center: START.center,
        p: { x: 175 + ((n * 17) % 35), y: 120 + ((n * 13) % 32) },
        q: { x: -150 - ((n * 11) % 36), y: 90 + ((n * 19) % 35) },
      };
      setModel(next);
      setCandidate(next.center);
    });
  const point = (e: PointerEvent<SVGSVGElement>) => {
    const b = svgRef.current?.getBoundingClientRect();
    return b
      ? {
          x: ((e.clientX - b.left) / b.width) * 560,
          y: ((e.clientY - b.top) / b.height) * 380,
        }
      : null;
  };
  const update = (key: Handle, p: Point) => {
    if (key === "o") {
      if (!locked) setCandidate(p);
      return;
    }
    setModel((old) => {
      const vector = sub(p, old.center);
      if (key === "a") return { ...old, p: neg(vector) };
      if (key === "c") return { ...old, p: vector };
      if (key === "b") return { ...old, q: neg(vector) };
      return { ...old, q: vector };
    });
  };
  const keyMove = (key: Handle, dx: number, dy: number) => {
    const p = key === "o" ? o : pts[key];
    act(() => update(key, { x: p.x + dx, y: p.y + dy }));
  };
  return (
    <section
      className="pd10075-page"
      data-testid="school-mockup-0749"
      data-object-model="dedicated-half-diagonal-midpoint-bisection-engine"
      data-points={`${r(pts.a.x)},${r(pts.a.y)};${r(pts.b.x)},${r(pts.b.y)};${r(pts.c.x)},${r(pts.c.y)};${r(pts.d.x)},${r(pts.d.y)};${r(o.x)},${r(o.y)}`}
      data-measures={measures.join(",")}
      data-totals={totals.join(",")}
      data-midpoint={String(equal)}
      data-locked={String(locked)}
      data-proof={String(proof)}
      data-tool={tool}
      data-zoom={zoom}
      data-score={`${score}/4`}
      data-actions={actions}
    >
      <header className="pd10075-hero">
        <small>CLASS 9 · QUADRILATERAL PROOFS</small>
        <h1>Parallelogram Diagonals</h1>
        <p>
          <b>Objective:</b> Discover and prove that parallelogram diagonals
          bisect each other.
        </p>
        <div>
          <span>30 min</span>
          <span>RIGOROUS</span>
          <span>PROOF</span>
          <span>INTERACTIVE</span>
        </div>
      </header>
      <nav className="pd10075-tabs">
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
        <section className="pd10075-lab">
          <header>
            <div>
              <h2>DRAG &amp; DISCOVER</h2>
              <p>
                Drag any vertex to change the parallelogram. Point O is the
                intersection of the diagonals.
              </p>
            </div>
            <label>
              Midpoint locks{" "}
              <button
                role="switch"
                aria-checked={locked}
                className={locked ? "on" : ""}
                onClick={() =>
                  act(() => {
                    setLocked(!locked);
                    setTool(locked ? "move" : "drag");
                    setCandidate(model.center);
                  })
                }
              >
                <i />
              </button>
            </label>
            <button onClick={reset}>
              <RotateCcw /> Reset
            </button>
          </header>
          <div className="pd10075-work">
            <aside>
              <section>
                <h3>MEASUREMENTS (live)</h3>
                {["AO", "OC", "BO", "OD"].map((x, i) => (
                  <p key={x}>
                    <i className={i < 2 ? "purple" : "green"} />
                    <span>{x} =</span>
                    <b>{measures[i].toFixed(2)}</b>
                  </p>
                ))}
              </section>
              <section>
                <h3>DIAGONALS</h3>
                <p>
                  <i className="purple" />
                  <span>AC =</span>
                  <b>{totals[0].toFixed(2)}</b>
                </p>
                <p>
                  <i className="green" />
                  <span>BD =</span>
                  <b>{totals[1].toFixed(2)}</b>
                </p>
              </section>
            </aside>
            <article>
              <svg
                ref={svgRef}
                viewBox="0 0 560 380"
                style={{ transform: `scale(${zoom / 100})` }}
                aria-label="Draggable parallelogram diagonal model"
                onPointerMove={(e) => {
                  if (!active) return;
                  const p = point(e);
                  if (p) update(active, p);
                }}
                onPointerUp={() => active && act(() => setActive(null))}
                onPointerLeave={() => active && act(() => setActive(null))}
              >
                <defs>
                  <pattern
                    id="pdGrid"
                    width="22"
                    height="22"
                    patternUnits="userSpaceOnUse"
                  >
                    <path d="M22 0H0V22" />
                  </pattern>
                </defs>
                <rect width="560" height="380" fill="url(#pdGrid)" />
                <path
                  className="shape"
                  d={`M${pts.a.x} ${pts.a.y}L${pts.b.x} ${pts.b.y}L${pts.c.x} ${pts.c.y}L${pts.d.x} ${pts.d.y}Z`}
                />
                <line
                  className="diag"
                  x1={pts.a.x}
                  y1={pts.a.y}
                  x2={pts.c.x}
                  y2={pts.c.y}
                />
                <line
                  className="diag"
                  x1={pts.b.x}
                  y1={pts.b.y}
                  x2={pts.d.x}
                  y2={pts.d.y}
                />
                {(["a", "b", "c", "d"] as Handle[]).map((k) => {
                  const p = pts[k as keyof typeof pts];
                  return (
                    <g key={k}>
                      <circle
                        className="vertex"
                        cx={p.x}
                        cy={p.y}
                        r="7"
                        tabIndex={0}
                        aria-label={`Draggable vertex ${k.toUpperCase()}`}
                        onPointerDown={(e) => {
                          if (tool !== "drag") return;
                          e.currentTarget.setPointerCapture(e.pointerId);
                          setActive(k);
                        }}
                        onKeyDown={(e) => {
                          const n = e.shiftKey ? 10 : 4;
                          if (e.key === "ArrowLeft") keyMove(k, -n, 0);
                          if (e.key === "ArrowRight") keyMove(k, n, 0);
                          if (e.key === "ArrowUp") keyMove(k, 0, -n);
                          if (e.key === "ArrowDown") keyMove(k, 0, n);
                        }}
                      />
                      <text
                        x={p.x + (k === "a" || k === "d" ? -20 : 9)}
                        y={p.y + (k === "a" || k === "b" ? -10 : 20)}
                      >
                        {k.toUpperCase()}
                      </text>
                    </g>
                  );
                })}
                <circle
                  className={`origin ${equal ? "equal" : "unequal"}`}
                  cx={o.x}
                  cy={o.y}
                  r="9"
                  tabIndex={locked ? -1 : 0}
                  aria-label="Draggable midpoint O"
                  onPointerDown={(e) => {
                    if (!locked && tool === "move") {
                      e.currentTarget.setPointerCapture(e.pointerId);
                      setActive("o");
                    }
                  }}
                  onKeyDown={(e) => {
                    if (locked) return;
                    const n = e.shiftKey ? 10 : 4;
                    if (e.key === "ArrowLeft") keyMove("o", -n, 0);
                    if (e.key === "ArrowRight") keyMove("o", n, 0);
                    if (e.key === "ArrowUp") keyMove("o", 0, -n);
                    if (e.key === "ArrowDown") keyMove("o", 0, n);
                  }}
                />
                <text x={o.x + 10} y={o.y - 10}>
                  O
                </text>
              </svg>
              <footer>
                <div>
                  <button
                    className={tool === "drag" ? "active" : ""}
                    onClick={() => act(() => setTool("drag"))}
                  >
                    ⌁ Drag
                  </button>
                  <button
                    className={tool === "move" ? "active" : ""}
                    onClick={() =>
                      act(() => {
                        setTool("move");
                        setLocked(false);
                        setCandidate(model.center);
                      })
                    }
                  >
                    <Move /> Move O
                  </button>
                  <button onClick={reset}>
                    <RotateCcw /> Reset shape
                  </button>
                  <button onClick={randomize}>
                    <Shuffle /> Randomize
                  </button>
                </div>
                <div>
                  <button
                    aria-label="Zoom out"
                    onClick={() => act(() => setZoom(Math.max(80, zoom - 10)))}
                  >
                    <ZoomOut />
                  </button>
                  <button
                    aria-label="Zoom in"
                    onClick={() => act(() => setZoom(Math.min(120, zoom + 10)))}
                  >
                    <ZoomIn />
                  </button>
                  <button
                    aria-label="Fit view"
                    onClick={() => act(() => setZoom(100))}
                  >
                    <Maximize2 />
                  </button>
                </div>
              </footer>
            </article>
          </div>
        </section>
        <section className={`pd10075-result ${equal ? "correct" : "wrong"}`}>
          <Check />
          <div>
            <b>
              {equal
                ? "Great! O is the midpoint of both diagonals."
                : "Move O to the true midpoint."}
            </b>
            <p>
              {equal
                ? "AO = OC and BO = OD"
                : "The four half-diagonal lengths do not match yet."}
            </p>
          </div>
          <button onClick={() => act(() => setProof(!proof))}>
            {proof ? "Hide proof" : "Show proof"}
          </button>
        </section>
        {proof && <Proof />}
        <section className="pd10075-theory">
          <Why />
          <Worked />
        </section>
        <section className="pd10075-lower">
          <Mistake />
          <Challenge
            choices={choices}
            setChoices={(x) => act(() => setChoices(x))}
          />
        </section>
      </main>
      <nav className="pd10075-adjacent">
        <Link to="/lessons/school/class-9/class-9-quadrilateral-proofs-parallelogram-opposite-angles">
          <ArrowLeft /> Parallelogram Opposite Angles
        </Link>
        <Link to="/lessons/school/class-9/class-9-quadrilateral-proofs-conditions-for-parallelogram">
          Conditions for a Quadrilateral To Be a Parallelogram <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}
function Proof() {
  return (
    <section className="pd10075-proof">
      <h2>PROOF OVERLAY: △AOB ≅ △COD</h2>
      <div>
        <article>
          <h3>Given</h3>
          <p>ABCD is a parallelogram.</p>
          <p>Diagonals AC and BD intersect at O.</p>
        </article>
        <article>
          <h3>To Prove</h3>
          <p>AO = OC</p>
          <p>BO = OD</p>
        </article>
        <article>
          <h3>Proof</h3>
          <ol>
            <li>AB ∥ CD and AD ∥ BC.</li>
            <li>∠ABO = ∠CDO.</li>
            <li>∠BAO = ∠DCO.</li>
            <li>∠AOB = ∠COD (vertical).</li>
            <li>△AOB ≅ △COD (ASA).</li>
            <li>AO = OC and BO = OD (CPCTC).</li>
          </ol>
        </article>
      </div>
    </section>
  );
}
function Mini({ cross = false }: { cross?: boolean }) {
  return (
    <svg viewBox="0 0 180 105">
      <path d="M38 15H160L142 91H20Z" />
      <line x1="38" y1="15" x2="142" y2="91" />
      <line x1="160" y1="15" x2="20" y2="91" />
      {cross && <path className="extra" d="M26 22l128 62M89 38l18 29" />}
    </svg>
  );
}
function Why() {
  return (
    <article>
      <h2>WHY IT WORKS</h2>
      <p>
        Opposite sides are parallel. When diagonals intersect, alternate
        interior angles and vertical angles create ASA congruence for triangles
        AOB and CDO.
      </p>
      <Mini />
      <p>
        Corresponding parts of congruent triangles are equal, including the
        segments on the diagonals.
      </p>
    </article>
  );
}
function Worked() {
  return (
    <article>
      <h2>WORKED EXAMPLE</h2>
      <p>If AC = 12 and BD = 10, what are the lengths of the four segments?</p>
      <strong>AO = OC = ½ AC = ½(12) = 6</strong>
      <strong>BO = OD = ½ BD = ½(10) = 5</strong>
      <footer>Answer: AO = OC = 6 and BO = OD = 5.</footer>
    </article>
  );
}
function Mistake() {
  return (
    <article className="pd10075-mistake">
      <h2>
        <TriangleAlert /> COMMON MISCONCEPTION
      </h2>
      <p>
        The diagonals do not generally have equal total lengths and do not meet
        at right angles.
      </p>
      <div>
        <section>
          <b>Not necessarily equal</b>
          <Mini />
          <span>AC ≠ BD ×</span>
        </section>
        <section>
          <b>Not necessarily perpendicular</b>
          <Mini cross />
          <span>×</span>
        </section>
      </div>
      <p>Only special cases have equal or perpendicular diagonals.</p>
    </article>
  );
}
function Challenge({
  choices,
  setChoices,
}: {
  choices: string[];
  setChoices: (x: string[]) => void;
}) {
  const rows = ["AO = OC", "BO = OD", "AC = BD", "Diagonals are perpendicular"];
  return (
    <article className="pd10075-challenge">
      <h2>🏆 PRACTICE CHALLENGE</h2>
      <p>Drag vertex B to change the shape. Which properties remain true?</p>
      <table>
        <thead>
          <tr>
            <th>Property</th>
            <th>Always True</th>
            <th>Sometimes True</th>
            <th>Never True</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((x, i) => (
            <tr key={x}>
              <td>{x}</td>
              {["always", "sometimes", "never"].map((v) => (
                <td key={v}>
                  <input
                    type="radio"
                    name={`pd-row-${i}`}
                    aria-label={`${x}: ${v}`}
                    checked={choices[i] === v}
                    onChange={() => {
                      const n = [...choices];
                      n[i] = v;
                      setChoices(n);
                    }}
                  />
                  {choices[i] === answers[i] && choices[i] === v && <Check />}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <footer>
        Try it: Drag the vertices and observe the measurements. What remains
        invariant?
      </footer>
    </article>
  );
}
