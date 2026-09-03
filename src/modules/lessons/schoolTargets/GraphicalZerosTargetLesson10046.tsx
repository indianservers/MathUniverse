import {
  ArrowLeft,
  ArrowRight,
  Check,
  Lightbulb,
  RotateCcw,
  TriangleAlert,
  Volume2,
} from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./GraphicalZerosTargetLesson10046.css";

const tabs = ["INTERACT", "LEARN", "EXAMPLE", "FORMULA", "PRACTICE"];
const clean = (value: number) =>
  Math.abs(value) < 1e-9 ? 0 : Math.round(value * 100) / 100;

export default function GraphicalZerosTargetLesson10046({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [a, setA] = useState(1),
    [b, setB] = useState(-5),
    [c, setC] = useState(6),
    [form, setForm] = useState<"standard" | "factored">("standard"),
    [zoom, setZoom] = useState(100),
    [tab, setTab] = useState("INTERACT"),
    [challengeRoot, setChallengeRoot] = useState(-1),
    [challengeA, setChallengeA] = useState(1),
    [actions, setActions] = useState(0);
  const discriminant = b * b - 4 * a * c;
  const roots =
    discriminant >= 0 && a !== 0
      ? [
          (-b - Math.sqrt(discriminant)) / (2 * a),
          (-b + Math.sqrt(discriminant)) / (2 * a),
        ]
          .sort((x, y) => x - y)
          .map(clean)
      : [];
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const setCoefficient = (which: "a" | "b" | "c", value: number) =>
    act(() => {
      if (which === "a") setA(value || 0.5);
      if (which === "b") setB(value);
      if (which === "c") setC(value);
    });
  const setRoot = (index: number, value: number) =>
    act(() => {
      const next = roots.length === 2 ? [...roots] : [2, 3];
      next[index] = clean(value);
      setA(1);
      setB(clean(-(next[0] + next[1])));
      setC(clean(next[0] * next[1]));
      setForm("factored");
    });
  const reset = () =>
    act(() => {
      setA(1);
      setB(-5);
      setC(6);
      setForm("standard");
      setZoom(100);
    });
  const polynomial = `${a === 1 ? "" : `${a}`}x² ${b < 0 ? "−" : "+"} ${Math.abs(b)}x ${c < 0 ? "−" : "+"} ${Math.abs(c)}`;
  return (
    <section
      className="zeros10046-page"
      data-testid="school-mockup-0720"
      data-object-model="dedicated-quadratic-coefficients-draggable-roots-engine"
      data-a={a}
      data-b={b}
      data-c={c}
      data-roots={roots.join(",")}
      data-discriminant={discriminant}
      data-zoom={zoom}
      data-challenge-root={challengeRoot}
      data-challenge-a={challengeA}
      data-actions={actions}
    >
      <header className="zeros10046-hero">
        <small>CLASS 9 · POLYNOMIALS</small>
        <h1>
          Graphical Zeros of Polynomials <Volume2 />
        </h1>
        <p>
          Identify polynomial zeros as x-coordinates where the graph meets the
          x-axis.
        </p>
        <div>
          <span>18 min</span>
          <span>INTERMEDIATE</span>
          <span>CONCEPT</span>
          <span>graph</span>
          <span>polynomial</span>
          <span>zeros</span>
        </div>
        <Link to="/lessons/school">
          <ArrowLeft /> School lessons
        </Link>
      </header>
      <nav className="zeros10046-tabs">
        {tabs.map((item) => (
          <button
            key={item}
            className={tab === item ? "active" : ""}
            onClick={() => act(() => setTab(item))}
          >
            {item}
          </button>
        ))}
      </nav>
      <main className="zeros10046-main">
        <section className="zeros-lab">
          <header>
            <div>
              <h2>Explore and discover zeros graphically</h2>
              <p>
                Adjust coefficients or drag the roots to see where the graph
                meets or touches the x-axis.
              </p>
            </div>
            <button onClick={reset}>
              <RotateCcw /> Reset
            </button>
          </header>
          <div className="zeros-work">
            <aside>
              <section>
                <h3>POLYNOMIAL CONTROLS ⓘ</h3>
                <b>Form</b>
                <div className="zeros-segment">
                  <button
                    className={form === "standard" ? "active" : ""}
                    onClick={() => act(() => setForm("standard"))}
                  >
                    Standard
                  </button>
                  <button
                    className={form === "factored" ? "active" : ""}
                    onClick={() => act(() => setForm("factored"))}
                  >
                    Factored
                  </button>
                </div>
                <h4>Coefficients (live)</h4>
                <Coefficient
                  label="a"
                  value={a}
                  min={-5}
                  max={5}
                  step={0.5}
                  onChange={(v) => setCoefficient("a", v)}
                />
                <Coefficient
                  label="b"
                  value={b}
                  min={-10}
                  max={10}
                  step={1}
                  onChange={(v) => setCoefficient("b", v)}
                />
                <Coefficient
                  label="c"
                  value={c}
                  min={-10}
                  max={10}
                  step={1}
                  onChange={(v) => setCoefficient("c", v)}
                />
                <div className="zeros-polynomial">
                  <b>Polynomial</b>
                  <Formula>y = {polynomial}</Formula>
                </div>
              </section>
              <section>
                <h3>Roots (zeros)</h3>
                <p>Drag the points on the x-axis</p>
                {[0, 1].map((i) => (
                  <label key={i}>
                    x<sub>{i + 1}</sub>
                    <input
                      type="number"
                      value={roots[i] ?? ""}
                      onChange={(e) => setRoot(i, Number(e.target.value))}
                    />
                    <span>{i ? "●" : "●"}</span>
                  </label>
                ))}
              </section>
              <section>
                <h3>Linked forms</h3>
                <p>Factored form</p>
                <Formula>
                  y = {a === 1 ? "" : a}(x − {roots[0] ?? "?"})(x −{" "}
                  {roots[1] ?? "?"})
                </Formula>
                <p>Expanded form</p>
                <Formula>y = {polynomial}</Formula>
              </section>
              <section className="zeros-summary">
                <h3>Zeros</h3>
                <Formula>
                  x = {roots.length ? roots.join(", ") : "no real zeros"}
                </Formula>
                <p>
                  {roots.map((r) => `p(${r}) = 0`).join(", ")}{" "}
                  {roots.length > 0 && <Check />}
                </p>
              </section>
            </aside>
            <div className="zeros-graph">
              <header>
                <b>Live graph: y = {polynomial}</b>
                <div>
                  <span>● Graph y = p(x)</span>
                  <span>● x-intercept (zero)</span>
                  <span>● Dragging root</span>
                </div>
                <label>
                  Zoom{" "}
                  <button
                    onClick={() =>
                      act(() => setZoom((z) => Math.max(60, z - 20)))
                    }
                  >
                    −
                  </button>
                  <b>{zoom}%</b>
                  <button
                    onClick={() =>
                      act(() => setZoom((z) => Math.min(160, z + 20)))
                    }
                  >
                    +
                  </button>
                </label>
              </header>
              <QuadraticGraph
                a={a}
                b={b}
                c={c}
                roots={roots}
                zoom={zoom}
                onRoot={setRoot}
              />
              <p>
                Drag the purple points to move the zeros. Change coefficients to
                see the graph update.
              </p>
              <article>
                <Lightbulb />
                <div>
                  <h2>The rule</h2>
                  <p>
                    A number a is a zero of a polynomial p(x) exactly when the
                    graph y = p(x) intersects or touches the x-axis at x = a.
                  </p>
                  <Formula>p(a) = 0</Formula>
                </div>
                <aside>
                  <b>Note</b>
                  <p>
                    A turning point is not automatically a zero unless y = 0
                    there.
                  </p>
                </aside>
              </article>
            </div>
          </div>
        </section>
        <section className="zeros-theory">
          <article>
            <h2>ⓘ Why it works</h2>
            <p>
              Zeros occur where y = p(x) = 0, exactly the condition for points
              on the x-axis.
            </p>
            <p>• If p(a) = 0, the point (a, 0) lies on the graph.</p>
            <p>
              • A crossing changes sign; a repeated zero touches without
              changing sign.
            </p>
            <div className="zero-sketches">
              <span>
                ⌁<b>Crosses</b>
              </span>
              <span>
                ∪<b>Touches</b>
              </span>
              <span>
                ⌣<b>Does not meet</b>
              </span>
            </div>
          </article>
          <article>
            <h2>Worked example</h2>
            <p>Find the zeros of y = x² − 5x + 6.</p>
            <p>
              <b>1.</b> Factor: x² − 5x + 6 = (x − 2)(x − 3)
            </p>
            <p>
              <b>2.</b> Set each factor to zero: x = 2 or x = 3.
            </p>
            <p>
              <b>3.</b> Graph verification: (2,0) and (3,0).
            </p>
            <strong>Answer: Zeros are x = 2 and x = 3.</strong>
          </article>
          <article>
            <h2>
              <TriangleAlert /> Common misconception
            </h2>
            <b>A turning point is not automatically a zero.</b>
            <p>y = x² + 1 has a turning point at (0,1), but p(0)=1 ≠ 0.</p>
            <p>The graph does not meet or touch the x-axis.</p>
            <div className="not-zero">
              ∪<small>y = x² + 1</small>
            </div>
          </article>
        </section>
        <section className="zeros-challenge">
          <header>
            <h2>Mini challenge</h2>
            <p>
              Adjust a quadratic to have a repeated zero at x = −1 and explain
              the touch.
            </p>
          </header>
          <div>
            <label>
              Set the repeated zero
              <input
                type="number"
                value={challengeRoot}
                onChange={(e) =>
                  act(() => setChallengeRoot(Number(e.target.value)))
                }
              />
            </label>
            <label>
              Form
              <div className="zeros-segment">
                <button>Standard</button>
                <button className="active">Factored</button>
              </div>
            </label>
            <label>
              Choose a
              <input
                type="range"
                min="-5"
                max="5"
                step="1"
                value={challengeA}
                onChange={(e) =>
                  act(() => setChallengeA(Number(e.target.value) || 1))
                }
              />
              <b>{challengeA}</b>
            </label>
            <article>
              <b>Your polynomial</b>
              <Formula>
                y = {challengeA === 1 ? "" : challengeA}(x{" "}
                {challengeRoot < 0 ? "+" : "−"} {Math.abs(challengeRoot)})² ={" "}
                {challengeA}x² {challengeRoot < 0 ? "+" : "−"}{" "}
                {Math.abs(2 * challengeA * challengeRoot)}x +{" "}
                {clean(challengeA * challengeRoot ** 2)}
              </Formula>
            </article>
            <MiniGraph root={challengeRoot} a={challengeA} />
          </div>
          <footer>
            Great! The graph touches the x-axis at x = {challengeRoot} and does
            not cross it. Therefore, {challengeRoot} is a zero of multiplicity 2
            (repeated zero).
          </footer>
        </section>
      </main>
      <nav className="zeros10046-adjacent">
        <Link to="/lessons/school">
          <ArrowLeft />
          <span>
            <small>Previous lesson</small>Polynomial Division
          </span>
        </Link>
        <Link to="/lessons/school">
          <span>
            <small>Next lesson</small>Remainder Theorem
          </span>
          <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}

function Coefficient({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="zeros-coeff">
      <b>{label}</b>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <strong>{value}</strong>
    </label>
  );
}
function Formula({ children }: { children: React.ReactNode }) {
  return <span className="zeros-formula">{children}</span>;
}
function QuadraticGraph({
  a,
  b,
  c,
  roots,
  zoom,
  onRoot,
}: {
  a: number;
  b: number;
  c: number;
  roots: number[];
  zoom: number;
  onRoot: (index: number, value: number) => void;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const xMin = (-3.6 * 100) / zoom,
    xMax = (6.6 * 100) / zoom,
    yMin = (-5.5 * 100) / zoom,
    yMax = (7 * 100) / zoom;
  const sx = (x: number) => 20 + ((x - xMin) / (xMax - xMin)) * 480,
    sy = (y: number) => 330 - ((y - yMin) / (yMax - yMin)) * 300;
  const path = Array.from({ length: 161 }, (_, i) => {
    const x = xMin + ((xMax - xMin) * i) / 160;
    return `${i ? "L" : "M"}${sx(x)},${sy(a * x * x + b * x + c)}`;
  }).join(" ");
  const drag = (i: number, e: React.PointerEvent<SVGCircleElement>) => {
    const svg = ref.current;
    if (!svg) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const move = (event: PointerEvent) => {
      const rect = svg.getBoundingClientRect();
      const x =
        xMin + ((event.clientX - rect.left) / rect.width) * (xMax - xMin);
      onRoot(i, Math.max(-3, Math.min(6, Math.round(x * 10) / 10)));
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  return (
    <svg
      ref={ref}
      className="zeros-svg"
      viewBox="0 0 520 350"
      aria-label="Interactive quadratic graph"
    >
      <g className="grid">
        {Array.from({ length: 11 }, (_, i) => (
          <line
            key={`v${i}`}
            x1={20 + i * 48}
            x2={20 + i * 48}
            y1="15"
            y2="330"
          />
        ))}
        {Array.from({ length: 8 }, (_, i) => (
          <line
            key={`h${i}`}
            x1="20"
            x2="500"
            y1={15 + i * 45}
            y2={15 + i * 45}
          />
        ))}
      </g>
      <line className="axis" x1="20" x2="500" y1={sy(0)} y2={sy(0)} />
      <line className="axis" x1={sx(0)} x2={sx(0)} y1="15" y2="330" />
      <path d={path} />
      {roots.map((root, i) => (
        <g key={i}>
          <circle
            cx={sx(root)}
            cy={sy(0)}
            r="7"
            onPointerDown={(e) => drag(i, e)}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") onRoot(i, root - 0.1);
              if (e.key === "ArrowRight") onRoot(i, root + 0.1);
            }}
          />
          <text x={sx(root)} y={sy(0) - 20}>
            ({root}, 0)
          </text>
        </g>
      ))}
    </svg>
  );
}
function MiniGraph({ root, a }: { root: number; a: number }) {
  const path = Array.from({ length: 61 }, (_, i) => {
    const x = -4 + i / 10,
      y = a * (x - root) ** 2;
    return `${i ? "L" : "M"}${10 + (x + 4) * 26},${90 - y * 10}`;
  }).join(" ");
  return (
    <svg className="zeros-mini" viewBox="0 0 180 105">
      <line x1="5" x2="175" y1="90" y2="90" />
      <path d={path} />
      <circle cx={10 + (root + 4) * 26} cy="90" r="4" />
    </svg>
  );
}
