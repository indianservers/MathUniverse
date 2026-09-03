import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  Hand,
  Lightbulb,
  Maximize2,
  MousePointer2,
  RefreshCcw,
  RotateCcw,
  Trophy,
  TriangleAlert,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { type PointerEvent, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./ParallelogramSidesTargetLesson10073.css";

type Point = { x: number; y: number };
type Vertex = "a" | "b" | "d";
type Diagonal = "AC" | "BD";
type Tool = "select" | "pan" | "fit";

const START = {
  a: { x: 118, y: 82 },
  b: { x: 488, y: 82 },
  d: { x: 70, y: 330 },
};
const correctReasons = [
  "Definition of parallelogram",
  "Alternate interior angles",
  "Alternate interior angles",
  "Reflexive property",
  "ASA congruence",
  "CPCTC",
  "CPCTC",
];
const proofSteps = [
  "AB ∥ CD and AD ∥ BC",
  "∠BAC = ∠DCA",
  "∠BCA = ∠CAD",
  "AC = AC",
  "△ABC ≅ △CDA",
  "AB = CD",
  "BC = AD",
];

const length = (p: Point, q: Point) => Math.hypot(q.x - p.x, q.y - p.y);
const rounded = (n: number) => Math.round(n * 10) / 10;

export default function ParallelogramSidesTargetLesson10073({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [points, setPoints] = useState(START);
  const [diagonal, setDiagonal] = useState<Diagonal>("AC");
  const [split, setSplit] = useState(true);
  const [angles, setAngles] = useState(true);
  const [ticks, setTicks] = useState(true);
  const [labels, setLabels] = useState(true);
  const [tool, setTool] = useState<Tool>("select");
  const [zoom, setZoom] = useState(100);
  const [tab, setTab] = useState(0);
  const [active, setActive] = useState<Vertex | null>(null);
  const [reasons, setReasons] = useState(correctReasons);
  const [revealed, setRevealed] = useState(true);
  const [actions, setActions] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const c = useMemo(
    () => ({
      x: points.b.x + points.d.x - points.a.x,
      y: points.b.y + points.d.y - points.a.y,
    }),
    [points],
  );
  const sides = [
    rounded(length(points.a, points.b)),
    rounded(length(points.b, c)),
    rounded(length(c, points.d)),
    rounded(length(points.d, points.a)),
  ];
  const score = reasons.filter(
    (reason, i) => reason === correctReasons[i],
  ).length;
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const reset = () =>
    act(() => {
      setPoints(START);
      setDiagonal("AC");
      setSplit(true);
      setAngles(true);
      setTicks(true);
      setLabels(true);
      setTool("select");
      setZoom(100);
    });
  const randomize = () =>
    act(() => {
      const n = actions + 1;
      setPoints({
        a: { x: 105 + ((n * 17) % 38), y: 75 + ((n * 13) % 32) },
        b: { x: 465 + ((n * 19) % 42), y: 76 + ((n * 7) % 25) },
        d: { x: 58 + ((n * 11) % 45), y: 305 + ((n * 23) % 38) },
      });
    });
  const updatePoint = (key: Vertex, next: Point) =>
    setPoints((current) => ({
      ...current,
      [key]: {
        x: Math.max(45, Math.min(515, next.x)),
        y: Math.max(45, Math.min(360, next.y)),
      },
    }));
  const pointerPoint = (event: PointerEvent<SVGSVGElement>) => {
    const box = svgRef.current?.getBoundingClientRect();
    if (!box) return null;
    return {
      x: ((event.clientX - box.left) / box.width) * 560,
      y: ((event.clientY - box.top) / box.height) * 410,
    };
  };
  const moveKeyboard = (key: Vertex, dx: number, dy: number) => {
    act(() =>
      updatePoint(key, { x: points[key].x + dx, y: points[key].y + dy }),
    );
  };

  return (
    <section
      className="ps10073-page"
      data-testid="school-mockup-0747"
      data-object-model="dedicated-constrained-parallelogram-congruence-proof-engine"
      data-points={`${rounded(points.a.x)},${rounded(points.a.y)};${rounded(points.b.x)},${rounded(points.b.y)};${rounded(c.x)},${rounded(c.y)};${rounded(points.d.x)},${rounded(points.d.y)}`}
      data-sides={sides.join(",")}
      data-opposite-equal={String(
        sides[0] === sides[2] && sides[1] === sides[3],
      )}
      data-diagonal={diagonal}
      data-overlays={`${Number(split)},${Number(angles)},${Number(ticks)}`}
      data-tool={tool}
      data-zoom={zoom}
      data-score={`${score}/7`}
      data-revealed={String(revealed)}
      data-actions={actions}
    >
      <header className="ps10073-hero">
        <small>CLASS 9 · QUADRILATERAL PROOFS</small>
        <h1>Parallelogram Opposite Sides</h1>
        <p>
          Prove that opposite sides of a parallelogram are equal using diagonal
          properties and triangle congruence.
        </p>
        <div>
          <span>30 min</span>
          <span>RIGOROUS</span>
          <span>PROOF</span>
          <span>learning</span>
        </div>
      </header>
      <nav className="ps10073-tabs">
        {["Interact", "Learn", "Example", "Formula", "Practice"].map(
          (name, i) => (
            <button
              key={name}
              className={tab === i ? "active" : ""}
              aria-selected={tab === i}
              onClick={() => act(() => setTab(i))}
            >
              {name}
            </button>
          ),
        )}
      </nav>
      <main>
        <section className="ps10073-lab">
          <aside className="ps10073-controls">
            <section>
              <h2>1. Build the parallelogram</h2>
              <p>Drag any vertex to reshape.</p>
              <p>The shape remains a parallelogram.</p>
              <button onClick={reset}>
                <RotateCcw /> Reset shape
              </button>
              <button onClick={randomize}>
                <RefreshCcw /> Randomize
              </button>
            </section>
            <section>
              <h2>2. Add a diagonal</h2>
              <p>Select the diagonal to draw.</p>
              <div>
                <button
                  className={diagonal === "AC" ? "active" : ""}
                  onClick={() => act(() => setDiagonal("AC"))}
                >
                  ╱ AC
                </button>
                <button
                  className={diagonal === "BD" ? "active" : ""}
                  onClick={() => act(() => setDiagonal("BD"))}
                >
                  ╱ BD
                </button>
              </div>
            </section>
            <section>
              <h2>3. Show overlays</h2>
              <Toggle
                label="Split into triangles"
                value={split}
                onChange={() => act(() => setSplit(!split))}
              />
              <Toggle
                label="Corresponding angles"
                value={angles}
                onChange={() => act(() => setAngles(!angles))}
              />
              <Toggle
                label="Side tick marks"
                value={ticks}
                onChange={() => act(() => setTicks(!ticks))}
              />
            </section>
            <section className="feedback">
              <h2>
                <Check /> Live feedback
              </h2>
              <p>Great! Triangles ABC and CDA are congruent.</p>
              <strong>Therefore AB = CD and BC = AD.</strong>
            </section>
          </aside>
          <article className="ps10073-canvas">
            <header>
              <div>
                <h2>Parallelogram ABCD</h2>
                <p>Drag points to explore. Properties update automatically.</p>
              </div>
              <button onClick={() => act(() => setLabels(!labels))}>
                <Eye /> {labels ? "Hide labels" : "Show labels"}
              </button>
            </header>
            <svg
              ref={svgRef}
              viewBox="0 0 560 410"
              style={{ transform: `scale(${zoom / 100})` }}
              aria-label="Draggable parallelogram ABCD"
              onPointerMove={(event) => {
                if (!active || tool !== "select") return;
                const next = pointerPoint(event);
                if (next) updatePoint(active, next);
              }}
              onPointerUp={() => active && act(() => setActive(null))}
              onPointerLeave={() => active && act(() => setActive(null))}
            >
              {split && diagonal === "AC" && (
                <>
                  <path
                    className="fill-one"
                    d={`M${points.a.x} ${points.a.y}L${points.b.x} ${points.b.y}L${c.x} ${c.y}Z`}
                  />
                  <path
                    className="fill-two"
                    d={`M${points.a.x} ${points.a.y}L${c.x} ${c.y}L${points.d.x} ${points.d.y}Z`}
                  />
                </>
              )}
              {split && diagonal === "BD" && (
                <>
                  <path
                    className="fill-one"
                    d={`M${points.a.x} ${points.a.y}L${points.b.x} ${points.b.y}L${points.d.x} ${points.d.y}Z`}
                  />
                  <path
                    className="fill-two"
                    d={`M${points.b.x} ${points.b.y}L${c.x} ${c.y}L${points.d.x} ${points.d.y}Z`}
                  />
                </>
              )}
              <path
                className="outline"
                d={`M${points.a.x} ${points.a.y}L${points.b.x} ${points.b.y}L${c.x} ${c.y}L${points.d.x} ${points.d.y}Z`}
              />
              <line
                className="diagonal"
                x1={diagonal === "AC" ? points.a.x : points.b.x}
                y1={diagonal === "AC" ? points.a.y : points.b.y}
                x2={diagonal === "AC" ? c.x : points.d.x}
                y2={diagonal === "AC" ? c.y : points.d.y}
              />
              {ticks && (
                <TickMarks a={points.a} b={points.b} c={c} d={points.d} />
              )}
              {angles && <AngleMarks a={points.a} c={c} />}
              {labels && (
                <>
                  <text x={points.a.x - 24} y={points.a.y - 12}>
                    A
                  </text>
                  <text x={points.b.x + 8} y={points.b.y - 12}>
                    B
                  </text>
                  <text x={c.x + 8} y={c.y + 24}>
                    C
                  </text>
                  <text x={points.d.x - 24} y={points.d.y + 24}>
                    D
                  </text>
                  <text
                    x={(points.a.x + points.b.x + c.x) / 3}
                    y={(points.a.y + points.b.y + c.y) / 3}
                  >
                    △ABC
                  </text>
                  <text
                    x={(points.a.x + c.x + points.d.x) / 3}
                    y={(points.a.y + c.y + points.d.y) / 3}
                  >
                    △CDA
                  </text>
                </>
              )}
              {(["a", "b", "d"] as Vertex[]).map((key) => (
                <circle
                  key={key}
                  className="handle"
                  cx={points[key].x}
                  cy={points[key].y}
                  r="8"
                  tabIndex={0}
                  aria-label={`Draggable vertex ${key.toUpperCase()}`}
                  onPointerDown={(event) => {
                    event.currentTarget.setPointerCapture(event.pointerId);
                    setActive(key);
                  }}
                  onKeyDown={(event) => {
                    const delta = event.shiftKey ? 10 : 4;
                    if (event.key === "ArrowLeft") moveKeyboard(key, -delta, 0);
                    if (event.key === "ArrowRight") moveKeyboard(key, delta, 0);
                    if (event.key === "ArrowUp") moveKeyboard(key, 0, -delta);
                    if (event.key === "ArrowDown") moveKeyboard(key, 0, delta);
                  }}
                />
              ))}
              <circle className="derived" cx={c.x} cy={c.y} r="8" />
              <text className="caption" x="280" y="396">
                Diagonal {diagonal} divides parallelogram ABCD into two
                triangles.
              </text>
            </svg>
            <footer>
              <div>
                <button
                  className={tool === "select" ? "active" : ""}
                  aria-label="Select tool"
                  onClick={() => act(() => setTool("select"))}
                >
                  <MousePointer2 />
                </button>
                <button
                  className={tool === "pan" ? "active" : ""}
                  aria-label="Pan tool"
                  onClick={() => act(() => setTool("pan"))}
                >
                  <Hand />
                </button>
                <button
                  aria-label="Fit view"
                  onClick={() =>
                    act(() => {
                      setTool("fit");
                      setZoom(100);
                    })
                  }
                >
                  <Maximize2 />
                </button>
              </div>
              <div>
                <button
                  aria-label="Zoom out"
                  onClick={() => act(() => setZoom(Math.max(80, zoom - 10)))}
                >
                  <ZoomOut />
                </button>
                <b>{zoom}%</b>
                <button
                  aria-label="Zoom in"
                  onClick={() => act(() => setZoom(Math.min(120, zoom + 10)))}
                >
                  <ZoomIn />
                </button>
              </div>
            </footer>
          </article>
        </section>
        <WhyItWorks />
        <section className="ps10073-lower">
          <WorkedExample />
          <Misconception />
          <article className="ps10073-challenge">
            <h2>
              <Trophy /> CHALLENGE
            </h2>
            <p>Complete the proof and reveal the conclusions.</p>
            <p>
              <b>Given:</b> ABCD is a parallelogram.
              <br />
              <b>Prove:</b> AB = CD and BC = AD.
            </p>
            <table>
              <thead>
                <tr>
                  <th>Step</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {proofSteps.map((step, i) => (
                  <tr key={step}>
                    <td>
                      <b>{i + 1}</b> {step}
                    </td>
                    <td>
                      <select
                        aria-label={`Proof reason ${i + 1}`}
                        value={reasons[i]}
                        onChange={(event) =>
                          act(() => {
                            const next = [...reasons];
                            next[i] = event.target.value;
                            setReasons(next);
                            setRevealed(false);
                          })
                        }
                      >
                        <option>Choose reason</option>
                        {[...new Set(correctReasons)].map((reason) => (
                          <option key={reason}>{reason}</option>
                        ))}
                      </select>
                      {reasons[i] === correctReasons[i] ? (
                        <Check />
                      ) : (
                        <TriangleAlert />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={() => act(() => setRevealed(true))}>
              Reveal conclusions
            </button>
            {revealed && (
              <footer className={score === 7 ? "correct" : "incorrect"}>
                <Check />
                <b>
                  {score === 7
                    ? "Well done! Opposite sides of a parallelogram are equal."
                    : `${score} of 7 reasons are correct. Keep checking the proof.`}
                </b>
              </footer>
            )}
          </article>
        </section>
      </main>
      <nav className="ps10073-adjacent">
        <Link to="/lessons/school/class-9/class-9-triangle-proofs-triangle-inequality">
          <ArrowLeft /> Previous lesson
        </Link>
        <Link to="/lessons/school/class-9/class-9-quadrilateral-proofs-parallelogram-opposite-angles">
          Next lesson: Parallelogram Opposite Angles <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: () => void;
}) {
  return (
    <label>
      {label}
      <button
        role="switch"
        aria-checked={value}
        className={value ? "on" : ""}
        onClick={onChange}
      >
        <i />
      </button>
    </label>
  );
}

function TickMarks({ a, b, c, d }: { a: Point; b: Point; c: Point; d: Point }) {
  const mid = (p: Point, q: Point) => ({
    x: (p.x + q.x) / 2,
    y: (p.y + q.y) / 2,
  });
  const ab = mid(a, b),
    bc = mid(b, c),
    cd = mid(c, d),
    da = mid(d, a);
  return (
    <g className="ticks">
      <path
        d={`M${ab.x - 4} ${ab.y - 10}v20M${ab.x + 4} ${ab.y - 10}v20M${cd.x - 4} ${cd.y - 10}v20M${cd.x + 4} ${cd.y - 10}v20`}
      />
      <path d={`M${bc.x - 9} ${bc.y - 4}l18 8M${da.x - 9} ${da.y - 4}l18 8`} />
    </g>
  );
}

function AngleMarks({ a, c }: { a: Point; c: Point }) {
  return (
    <g className="angles">
      <path d={`M${a.x + 34} ${a.y}A34 34 0 0 1 ${a.x + 6} ${a.y + 33}`} />
      <path d={`M${a.x + 43} ${a.y}A43 43 0 0 1 ${a.x + 7} ${a.y + 42}`} />
      <path d={`M${c.x - 34} ${c.y}A34 34 0 0 1 ${c.x - 6} ${c.y - 33}`} />
      <path d={`M${c.x - 43} ${c.y}A43 43 0 0 1 ${c.x - 7} ${c.y - 42}`} />
    </g>
  );
}

function MiniParallelogram({ stage }: { stage: number }) {
  return (
    <svg viewBox="0 0 140 82" aria-hidden="true">
      <path d="M28 13H121L109 69H16Z" />
      <line x1="28" y1="13" x2="109" y2="69" />
      {stage > 1 && (
        <>
          <path
            className="angle"
            d="M40 13a15 15 0 0 1-9 14M97 69a15 15 0 0 1 9-14"
          />
          <path
            className="angle"
            d="M109 25a15 15 0 0 1 10-11M28 57a15 15 0 0 1-10 11"
          />
        </>
      )}
      {stage > 2 && <path className="shade" d="M28 13H121L109 69Z" />}
      {stage > 3 && (
        <path
          className="ticks"
          d="M72 7v12m6-12v12M61 63v12m6-12v12M18 38l14 4m76 0 14 4"
        />
      )}
    </svg>
  );
}

function WhyItWorks() {
  const labels = [
    "Draw diagonal AC.",
    "Identify equal angles",
    "ASA → △ABC ≅ △CDA",
    "Opposite sides are equal",
  ];
  return (
    <section className="ps10073-why">
      <h2>
        <Lightbulb /> WHY IT WORKS
      </h2>
      <p>
        A diagonal creates two triangles that share one side and have equal
        corresponding angles due to parallel sides. By ASA congruence,
        corresponding sides are equal.
      </p>
      <div>
        {labels.map((label, i) => (
          <span key={label}>
            <MiniParallelogram stage={i + 1} />
            <b>{label}</b>
            {i < 3 && <ArrowRight />}
          </span>
        ))}
      </div>
    </section>
  );
}

function WorkedExample() {
  return (
    <article className="worked">
      <h2>▧ WORKED EXAMPLE</h2>
      <p>
        <b>Given:</b> ABCD is a parallelogram.
        <br />
        <b>Prove:</b> AB = CD and BC = AD.
      </p>
      <MiniParallelogram stage={4} />
      <ol>
        <li>AB ∥ CD and AD ∥ BC (definition).</li>
        <li>∠BAC = ∠DCA and ∠BCA = ∠CAD.</li>
        <li>AC = AC (common side).</li>
        <li>Therefore, △ABC ≅ △CDA (ASA).</li>
        <li>Hence, by CPCTC:</li>
      </ol>
      <footer>
        <b>AB = CD</b>
        <b>BC = AD</b>
      </footer>
    </article>
  );
}

function Misconception() {
  return (
    <article className="mistake">
      <h2>
        <TriangleAlert /> COMMON MISCONCEPTION
      </h2>
      <p>
        Opposite sides are matched across the parallelogram, not next to each
        other.
      </p>
      <section>
        <b>Correct (Opposite sides)</b>
        <MiniParallelogram stage={4} />
        <strong>
          AB = CD ✓
          <br />
          BC = AD ✓
        </strong>
      </section>
      <section className="wrong">
        <b>Incorrect (Adjacent sides)</b>
        <MiniParallelogram stage={1} />
        <strong>
          AB = BC ×
          <br />
          BC = CD ×
        </strong>
      </section>
      <p>
        <b>Match across the shape, not around the edge.</b>
      </p>
    </article>
  );
}
