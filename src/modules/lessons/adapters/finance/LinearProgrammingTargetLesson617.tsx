import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Pencil,
  Play,
  RotateCcw,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./LinearProgrammingTargetLesson617.css";

type Point = { x: number; y: number; label: string };
const clean = (n: number) => Math.round(n * 100) / 100;
const shown = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(2));

function corners(x1: number, y1: number, x2: number, y2: number): Point[] {
  const points: Point[] = [
    { x: 0, y: 0, label: "A" },
    { x: x2, y: 0, label: "B" },
    { x: x1, y: 0, label: "C" },
  ];
  const determinant = y1 * x2 - y2 * x1;
  if (Math.abs(determinant) > 0.001) {
    const x = (x1 * x2 * (y1 - y2)) / determinant;
    const y = (y1 * y2 * (x2 - x1)) / determinant;
    if (x > 0 && y > 0 && x / x1 + y / y1 <= 1.001 && x / x2 + y / y2 <= 1.001)
      points.push({ x: clean(x), y: clean(y), label: "D" });
  }
  points.push({ x: 0, y: y1, label: "E" });
  return points
    .filter(
      (p, i, all) =>
        all.findIndex(
          (q) => Math.abs(q.x - p.x) < 0.01 && Math.abs(q.y - p.y) < 0.01,
        ) === i,
    )
    .map((p, i) => ({ ...p, label: String.fromCharCode(65 + i) }));
}

export default function LinearProgrammingTargetLesson617({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [x1, setX1] = useState(8),
    [y1, setY1] = useState(4),
    [x2, setX2] = useState(4),
    [y2, setY2] = useState(8),
    [xMax, setXMax] = useState(10),
    [yMax, setYMax] = useState(10),
    [cx, setCx] = useState(3),
    [cy, setCy] = useState(2),
    [sweep, setSweep] = useState(24),
    [playing, setPlaying] = useState(false),
    [tab, setTab] = useState("Interact"),
    [answerValue, setAnswerValue] = useState(""),
    [answerPoint, setAnswerPoint] = useState(""),
    [graded, setGraded] = useState<boolean | null>(null),
    [help, setHelp] = useState(false),
    [actions, setActions] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const reset = () => {
    setX1(8);
    setY1(4);
    setX2(4);
    setY2(8);
    setXMax(10);
    setYMax(10);
    setCx(3);
    setCy(2);
    setSweep(24);
    setPlaying(false);
    setTab("Interact");
    setAnswerValue("");
    setAnswerPoint("");
    setGraded(null);
    setHelp(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (fn: () => void) => {
    fn();
    setActions((v) => v + 1);
    onInteraction();
  };
  const points = useMemo(() => corners(x1, y1, x2, y2), [x1, y1, x2, y2]);
  const evaluated = points.map((p) => ({
    ...p,
    z: clean(cx * p.x + cy * p.y),
  }));
  const optimum = evaluated.reduce(
    (best, p) => (p.z > best.z ? p : best),
    evaluated[0],
  );
  const scaleX = (x: number) => 42 + (x / xMax) * 438;
  const scaleY = (y: number) => 342 - (y / yMax) * 300;
  const polygon = [points[0], points[2] ?? points[1], points[3], points.at(-1)]
    .filter(Boolean)
    .map((p) => `${scaleX(p!.x)},${scaleY(p!.y)}`)
    .join(" ");
  const objectiveEndX = Math.min(xMax, sweep / Math.max(cx, 0.01));
  const objectiveEndY = Math.min(yMax, sweep / Math.max(cy, 0.01));
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(
      () => setSweep((v) => (v >= Math.max(30, optimum.z + 6) ? 0 : v + 0.5)),
      90,
    );
    return () => window.clearInterval(timer);
  }, [playing, optimum.z]);
  const dragLine = (
    which: 1 | 2,
    event: React.PointerEvent<SVGLineElement>,
  ) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    const move = (e: PointerEvent) => {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;
      const y = clean(
        Math.max(
          1,
          Math.min(yMax, ((rect.bottom - e.clientY) / rect.height) * yMax),
        ),
      );
      act(() => (which === 1 ? setY1(y) : setY2(y)));
    };
    const stop = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
  };
  const check = () =>
    act(() =>
      setGraded(
        Math.abs(Number(answerValue) - 30) < 0.01 &&
          /0\s*,\s*6/.test(answerPoint),
      ),
    );
  const inputs = [
    ["Constraint 1 y-intercept", y1, setY1],
    ["Constraint 1 x-intercept", x1, setX1],
    ["Constraint 2 y-intercept", y2, setY2],
    ["Constraint 2 x-intercept", x2, setX2],
  ] as const;
  return (
    <section
      className="lp617-page"
      data-testid="finance-mockup-0674"
      data-object-model="dedicated-draggable-two-constraint-corner-point-optimization-model"
      data-optimal-point={`${shown(optimum.x)},${shown(optimum.y)}`}
      data-optimal-value={shown(optimum.z)}
      data-corner-count={points.length}
      data-constraint-one={`${x1},${y1}`}
      data-constraint-two={`${x2},${y2}`}
      data-objective={`${cx},${cy}`}
      data-graded={graded === null ? "" : graded}
      data-actions={actions}
    >
      <header className="lp617-hero">
        <small>DISCRETE AND APPLIED MATHEMATICS</small>
        <h1>Linear Programming</h1>
        <p>Optimise under constraints.</p>
        <dl>
          <span>Level: Intermediate–Advanced</span>
          <span>Module: Applied Modelling Lab</span>
          <span>Duration: 10–15 min</span>
          <span>Skills: Graphing, Optimisation, Modelling</span>
        </dl>
        <aside>
          <b>OBJECTIVE</b>
          <p>
            Maximise{" "}
            <i>
              Z = {cx}x + {cy}y
            </i>{" "}
            subject to x/{x1} + y/{y1} ≤ 1, x/{x2} + y/{y2} ≤ 1, x ≥ 0, y ≥ 0.
          </p>
        </aside>
      </header>
      <nav className="lp617-tabs">
        {["Interact", "Learn", "Worked Example", "Formula", "Practice"].map(
          (name) => (
            <button
              className={tab === name ? "active" : ""}
              key={name}
              onClick={() => act(() => setTab(name))}
            >
              {name}
            </button>
          ),
        )}
      </nav>
      {tab !== "Interact" && (
        <p className="lp617-tabnote">
          <b>{tab}:</b> An optimum of a bounded linear model occurs at a
          feasible corner point.
        </p>
      )}
      <section className="lp617-lab">
        <article className="lp617-graph">
          <header>
            <b>MANIPULATE</b>
            <p>Drag the lines to explore the feasible region.</p>
            <button onClick={() => act(reset)}>
              <RotateCcw /> Reset
            </button>
          </header>
          <svg
            ref={svgRef}
            viewBox="0 0 520 375"
            aria-label="Interactive feasible region graph"
          >
            {Array.from({ length: 6 }, (_, i) => (
              <g key={i}>
                <line
                  className="grid"
                  x1={42}
                  y1={scaleY(i * 2)}
                  x2={480}
                  y2={scaleY(i * 2)}
                />
                <line
                  className="grid"
                  x1={scaleX(i * 2)}
                  y1={42}
                  x2={scaleX(i * 2)}
                  y2={342}
                />
                <text x={27} y={scaleY(i * 2) + 4}>
                  {i * 2}
                </text>
                <text x={scaleX(i * 2) - 3} y={360}>
                  {i * 2}
                </text>
              </g>
            ))}
            <line className="axis" x1="42" y1="342" x2="490" y2="342" />
            <line className="axis" x1="42" y1="352" x2="42" y2="31" />
            <text x="497" y="347">
              x
            </text>
            <text x="30" y="24">
              y
            </text>
            <polygon className="feasible" points={polygon} />
            <line
              className="constraint one"
              x1={scaleX(0)}
              y1={scaleY(y1)}
              x2={scaleX(x1)}
              y2={scaleY(0)}
              onPointerDown={(e) => dragLine(1, e)}
            />
            <line
              className="constraint two"
              x1={scaleX(0)}
              y1={scaleY(y2)}
              x2={scaleX(x2)}
              y2={scaleY(0)}
              onPointerDown={(e) => dragLine(2, e)}
            />
            <line
              className="objective"
              x1={scaleX(0)}
              y1={scaleY(objectiveEndY)}
              x2={scaleX(objectiveEndX)}
              y2={scaleY(0)}
            />
            {points.map((p) => (
              <g key={p.label}>
                <circle cx={scaleX(p.x)} cy={scaleY(p.y)} r="5" />
                <text
                  className="point-label"
                  x={scaleX(p.x) + 8}
                  y={scaleY(p.y) - 8}
                >
                  ({shown(p.x)}, {shown(p.y)})
                </text>
              </g>
            ))}
          </svg>
          <footer>
            <span>
              Objective function{" "}
              <b>
                Z ={" "}
                <input
                  aria-label="Objective x coefficient"
                  type="number"
                  value={cx}
                  onChange={(e) => act(() => setCx(Number(e.target.value)))}
                />
                x +{" "}
                <input
                  aria-label="Objective y coefficient"
                  type="number"
                  value={cy}
                  onChange={(e) => act(() => setCy(Number(e.target.value)))}
                />
                y
              </b>{" "}
              <Pencil />
            </span>
            <label>
              Sweep lines (iso-profit){" "}
              <input
                aria-label="Objective sweep"
                type="range"
                min="0"
                max={Math.max(30, optimum.z + 6)}
                step="0.5"
                value={sweep}
                onChange={(e) => act(() => setSweep(Number(e.target.value)))}
              />
              <output>Z = {shown(sweep)}</output>
            </label>
            <span>
              <label>
                <input
                  aria-label="Animate sweep"
                  type="checkbox"
                  checked={playing}
                  onChange={(e) => act(() => setPlaying(e.target.checked))}
                />{" "}
                Animate sweep
              </label>
              <button
                aria-label="Play sweep"
                onClick={() => act(() => setPlaying((v) => !v))}
              >
                <Play />
              </button>
            </span>
          </footer>
        </article>
        <aside className="lp617-controls">
          <h2>CONTROLS</h2>
          {inputs.map(([label, value, setter], i) => (
            <label key={label}>
              <b>
                {i < 2 ? "Constraint 1" : "Constraint 2"}:{" "}
                {i % 2 === 0 ? `y/${shown(value)}` : `x/${shown(value)}`}
              </b>
              <span>
                {i % 2 === 0 ? "y-intercept" : "x-intercept"}
                <input
                  aria-label={label}
                  type="number"
                  min="1"
                  max="10"
                  step="0.25"
                  value={value}
                  onChange={(e) => act(() => setter(Number(e.target.value)))}
                />
              </span>
              <input
                aria-label={`${label} slider`}
                type="range"
                min="1"
                max="10"
                step="0.25"
                value={value}
                onChange={(e) => act(() => setter(Number(e.target.value)))}
              />
            </label>
          ))}
          <section>
            <b>Axes bounds</b>
            <label>
              x max{" "}
              <input
                aria-label="x maximum"
                type="number"
                min="5"
                max="20"
                value={xMax}
                onChange={(e) => act(() => setXMax(Number(e.target.value)))}
              />
            </label>
            <label>
              y max{" "}
              <input
                aria-label="y maximum"
                type="number"
                min="5"
                max="20"
                value={yMax}
                onChange={(e) => act(() => setYMax(Number(e.target.value)))}
              />
            </label>
          </section>
          <button onClick={() => act(() => setHelp((v) => !v))}>
            <CircleHelp /> How it works
          </button>
          {help && (
            <p>
              Each line defines a half-plane. Their common overlap is the
              feasible region.
            </p>
          )}
        </aside>
      </section>
      <section className="lp617-analysis">
        <article>
          <h2>CORNER POINTS &amp; Z-VALUE</h2>
          <table>
            <thead>
              <tr>
                <th>Point</th>
                <th>(x, y)</th>
                <th>
                  Z = {cx}x + {cy}y
                </th>
              </tr>
            </thead>
            <tbody>
              {evaluated.map((p) => (
                <tr
                  className={p.label === optimum.label ? "best" : ""}
                  key={p.label}
                >
                  <th>{p.label}</th>
                  <td>
                    ({shown(p.x)}, {shown(p.y)})
                  </td>
                  <td>{shown(p.z)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th>Maximum</th>
                <td>
                  ({shown(optimum.x)}, {shown(optimum.y)})
                </td>
                <td>{shown(optimum.z)}</td>
              </tr>
            </tfoot>
          </table>
        </article>
        <article>
          <h2>OPTIMAL SOLUTION</h2>
          <section className="success">
            <b>Maximum value</b>
            <strong>Z = {shown(optimum.z)}</strong>
            <b>
              attained at (x, y) = ({shown(optimum.x)}, {shown(optimum.y)})
            </b>
            <p>
              The objective line last touches the feasible region at this
              corner.
            </p>
          </section>
          <section className="alert">
            <b>MISCONCEPTION ALERT</b>
            <p>
              Moving both intercepts outward does not always improve the
              maximum. Only points in the new feasible region matter.
            </p>
          </section>
        </article>
        <article>
          <h2>SEE THE PATTERN</h2>
          {[
            "The maximum of a linear function over a convex feasible region occurs at a vertex.",
            "Evaluate Z at each corner point.",
            "Choose the vertex with the best value.",
          ].map((t) => (
            <p key={t}>
              <CheckCircle2 />
              {t}
            </p>
          ))}
          <section>
            <b>General steps (2 variables)</b>
            <ol>
              <li>Graph all constraints and shade the feasible region.</li>
              <li>Find every corner point.</li>
              <li>Evaluate Z at each vertex.</li>
              <li>Select the best value.</li>
            </ol>
          </section>
        </article>
      </section>
      <section className="lp617-bottom">
        <article>
          <h2>WORKED EXAMPLE</h2>
          <p>Maximise Z = 3x + 2y under the displayed constraints.</p>
          <ol>
            <li>Graph the two boundary lines.</li>
            <li>List all feasible corners.</li>
            <li>Evaluate Z in the table.</li>
            <li>
              The maximum is {shown(optimum.z)} at ({shown(optimum.x)},{" "}
              {shown(optimum.y)}).
            </li>
          </ol>
          <strong>
            Answer: Max Z = {shown(optimum.z)} at ({shown(optimum.x)},{" "}
            {shown(optimum.y)}).
          </strong>
        </article>
        <article>
          <h2>TRY IT</h2>
          <p>Maximise Z = 2x + 5y subject to x + y ≤ 6, 2x + y ≤ 8, x,y ≥ 0.</p>
          <b>
            Your turn: Find the maximum value and the point where it occurs.
          </b>
          <span>
            <input
              aria-label="Challenge maximum value"
              placeholder="Maximum"
              value={answerValue}
              onChange={(e) => setAnswerValue(e.target.value)}
            />
            <input
              aria-label="Challenge optimal point"
              placeholder="x, y"
              value={answerPoint}
              onChange={(e) => setAnswerPoint(e.target.value)}
            />
            <button onClick={check}>Check your answer</button>
          </span>
          {graded !== null && (
            <output className={graded ? "correct" : "wrong"}>
              {graded
                ? "Correct: Z = 30 at (0, 6)."
                : "Check every feasible corner and try again."}
            </output>
          )}
        </article>
      </section>
      <nav className="lp617-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/616-scenario-comparison">
          <ChevronLeft />
          <span>
            Previous Lesson<b>616 Scenario Comparison</b>
          </span>
        </a>
        <span>
          Lesson Progress <b>3 / 7</b>
        </span>
        <a href="/lessons/discrete-and-applied-mathematics/618-integer-linear-programming">
          <span>
            Next Lesson<b>618 Integer Linear Programming</b>
          </span>
          <ChevronRight />
        </a>
      </nav>
    </section>
  );
}
