import {
  BookOpen,
  CheckCircle2,
  FileText,
  Lightbulb,
  Pause,
  Pencil,
  Play,
  RotateCcw,
  Sigma,
  Sparkles,
} from "lucide-react";
import {
  useEffect,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import "./SurfaceAreaRevolutionTargetLesson321.css";

type CurveKey = "sqrt" | "log" | "linear";
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const clean = (value: number) => Number(value.toFixed(8));
const curves = {
  sqrt: {
    label: "y = √x",
    f: (x: number) => Math.sqrt(Math.max(0, x)),
    d: (x: number) => 1 / (2 * Math.sqrt(Math.max(0.01, x))),
  },
  log: {
    label: "y = ln(x+1)",
    f: (x: number) => Math.log(x + 1),
    d: (x: number) => 1 / (x + 1),
  },
  linear: { label: "y = x/2", f: (x: number) => x / 2, d: () => 0.5 },
} as const;
const simpson = (
  fn: (x: number) => number,
  a: number,
  b: number,
  pieces = 800,
) => {
  const n = pieces % 2 ? pieces + 1 : pieces,
    h = (b - a) / n;
  let sum = fn(a) + fn(b);
  for (let i = 1; i < n; i += 1) sum += (i % 2 ? 4 : 2) * fn(a + i * h);
  return (sum * h) / 3;
};
const surfaceArea = (
  curve: CurveKey,
  axis: "x" | "y",
  a: number,
  b: number,
) => {
  const model = curves[curve];
  if (axis === "x")
    return simpson(
      (x) => 2 * Math.PI * model.f(x) * Math.sqrt(1 + model.d(x) ** 2),
      a,
      b,
    );
  return simpson((x) => 2 * Math.PI * x * Math.sqrt(1 + model.d(x) ** 2), a, b);
};
const exactSqrtX = (a: number, b: number) =>
  (Math.PI / 6) * ((4 * b + 1) ** 1.5 - (4 * a + 1) ** 1.5);
const practiceValue = simpson(
  (x) => 2 * Math.PI * x ** 1.5 * Math.sqrt(1 + 2.25 * x),
  0,
  4,
  1600,
);

export default function SurfaceAreaRevolutionTargetLesson321({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [axis, setAxis] = useState<"x" | "y">("x"),
    [curve, setCurve] = useState<CurveKey>("sqrt"),
    [a, setA] = useState(1),
    [b, setB] = useState(6),
    [x, setX] = useState(3.7),
    [playing, setPlaying] = useState(false),
    [speed, setSpeed] = useState(55),
    [tab, setTab] = useState("Interact"),
    [editor, setEditor] = useState(false),
    [answer, setAnswer] = useState(""),
    [result, setResult] = useState<"" | "correct" | "incorrect">(""),
    [hint, setHint] = useState(false),
    [actions, setActions] = useState(0);
  const model = curves[curve],
    radius = axis === "x" ? model.f(x) : x,
    slope = model.d(x),
    dsFactor = Math.sqrt(1 + slope * slope),
    element = 2 * Math.PI * radius * dsFactor,
    area =
      curve === "sqrt" && axis === "x"
        ? exactSqrtX(a, b)
        : surfaceArea(curve, axis, a, b),
    progress = ((x - a) / (b - a)) * 100;
  const referenceModel = curve === "sqrt" && axis === "x" && a === 1 && b === 6;
  const reset = () => {
    setAxis("x");
    setCurve("sqrt");
    setA(1);
    setB(6);
    setX(3.7);
    setPlaying(false);
    setSpeed(55);
    setTab("Interact");
    setEditor(false);
    setAnswer("");
    setResult("");
    setHint(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(
      () =>
        setX((value) =>
          value >= b - 0.02 ? a : Math.min(b, value + 0.02 + speed / 1800),
        ),
      80,
    );
    return () => window.clearInterval(timer);
  }, [playing, speed, a, b]);
  const act = (run: () => void) => {
    run();
    setActions((value) => value + 1);
    onInteraction();
  };
  const changeA = (value: number) =>
    act(() => {
      const next = clamp(value, 0.1, b - 0.2);
      setA(next);
      setX((v) => clamp(v, next, b));
    });
  const changeB = (value: number) =>
    act(() => {
      const next = clamp(value, a + 0.2, 7);
      setB(next);
      setX((v) => clamp(v, a, next));
    });
  return (
    <section
      className="sar321-page"
      data-testid="calculus-mockup-0400"
      data-object-model="generating-curve-revolved-surface-mesh-axis-bounds-draggable-differential-ring-animation-surface-integral-practice"
      data-axis={axis}
      data-curve={curve}
      data-a={clean(a)}
      data-b={clean(b)}
      data-x={clean(x)}
      data-radius={clean(radius)}
      data-slope={clean(slope)}
      data-ds={clean(dsFactor)}
      data-element={clean(element)}
      data-area={clean(area)}
      data-progress={clean(progress)}
      data-playing={playing}
      data-speed={speed}
      data-tab={tab}
      data-editor={editor}
      data-result={result}
      data-hint={hint}
      data-actions={actions}
    >
      <header className="sar321-title">
        <span>
          <b>CALCULUS</b>
          <b>INTEGRAL CALCULUS AND DIFFERENTIAL EQUATIONS</b>
        </span>
        <h1>
          <span className="sr-only">Surface Area of Revolution</span>
          <svg aria-hidden="true" viewBox="0 0 540 38">
            <text x="0" y="31">
              Surface Area of Revolution
            </text>
          </svg>
        </h1>
        <p>Rotate the curve. Measure the surface.</p>
      </header>
      <section className="sar321-lab">
        <nav>
          {[
            [BookOpen, "Interact"],
            [BookOpen, "Learn"],
            [FileText, "Example"],
            [Sigma, "Formula"],
            [Pencil, "Practice"],
          ].map(([Icon, name]) => (
            <button
              key={String(name)}
              className={tab === name ? "active" : ""}
              onClick={() => act(() => setTab(String(name)))}
            >
              <Icon />
              {String(name)}
            </button>
          ))}
        </nav>
        <div className="sar321-stage">
          <div className="sar321-views">
            <article>
              <h2>Generating curve</h2>
              <CurveGraph
                curve={curve}
                a={a}
                b={b}
                x={x}
                onX={(value) => act(() => setX(value))}
              />
            </article>
            <article>
              <h2>3D revolved surface</h2>
              <SurfaceGraph
                curve={curve}
                axis={axis}
                a={a}
                b={b}
                x={x}
                onX={(value) => act(() => setX(value))}
              />
            </article>
          </div>
          <div className="sar321-controls">
            <label>
              Axis of rotation
              <select
                aria-label="Surface axis"
                value={axis}
                onChange={(e) =>
                  act(() => setAxis(e.target.value as "x" | "y"))
                }
              >
                <option value="x">x-axis</option>
                <option value="y">y-axis</option>
              </select>
            </label>
            <div className="curve-control">
              <b>Curve</b>
              <button
                aria-label="Edit generating curve"
                onClick={() => act(() => setEditor((v) => !v))}
              >
                {model.label}
                <Pencil />
              </button>
              {editor && (
                <div>
                  {(Object.keys(curves) as CurveKey[]).map((key) => (
                    <button
                      key={key}
                      onClick={() =>
                        act(() => {
                          setCurve(key);
                          setEditor(false);
                        })
                      }
                    >
                      {curves[key].label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="bounds">
              <b>Interval [a, b]</b>
              <label>
                a ={" "}
                <input
                  aria-label="Surface lower bound"
                  type="number"
                  min=".1"
                  max={b - 0.2}
                  step=".1"
                  value={a}
                  onChange={(e) => changeA(Number(e.target.value))}
                />
              </label>
              <label>
                b ={" "}
                <input
                  aria-label="Surface upper bound"
                  type="number"
                  min={a + 0.2}
                  max="7"
                  step=".1"
                  value={b}
                  onChange={(e) => changeB(Number(e.target.value))}
                />
              </label>
              <input
                aria-label="Surface lower slider"
                type="range"
                min=".1"
                max="7"
                step=".1"
                value={a}
                onChange={(e) => changeA(Number(e.target.value))}
              />
              <input
                aria-label="Surface upper slider"
                type="range"
                min=".1"
                max="7"
                step=".1"
                value={b}
                onChange={(e) => changeB(Number(e.target.value))}
              />
            </div>
            <div className="animation">
              <b>Animation</b>
              <button onClick={() => act(() => setPlaying((v) => !v))}>
                {playing ? <Pause /> : <Play />}
                {playing ? "Pause" : "Play"}
              </button>
              <button
                onClick={() =>
                  act(() => {
                    setPlaying(false);
                    setX(a);
                  })
                }
              >
                <RotateCcw />
                Reset
              </button>
              <label>
                Slow
                <input
                  aria-label="Surface animation speed"
                  type="range"
                  min="1"
                  max="100"
                  value={speed}
                  onChange={(e) => act(() => setSpeed(Number(e.target.value)))}
                />
                Fast
              </label>
            </div>
          </div>
        </div>
      </section>
      <section className="sar321-formulas">
        <article>
          <h3>Surface area formula</h3>
          <strong>S = 2π ∫ₐᵇ r(x) √(1+(dy/dx)²) dx</strong>
        </article>
        <article>
          <h3>Substitute and simplify</h3>
          <p>y=√x, dy/dx=1/(2√x)</p>
          <strong>S = 2π ∫₁⁶ √x √(1+1/(4x)) dx</strong>
        </article>
        <article>
          <h3>Surface area</h3>
          <strong>{referenceModel ? "π(125−5√5)/6" : area.toFixed(4)}</strong>
          <b>≈ {area.toFixed(4)} square units</b>
        </article>
      </section>
      <section className="sar321-learn">
        <article>
          <h3>How it works</h3>
          <p>
            Each infinitesimal arc length ds at radius r creates a circular
            strip when rotated about the {axis}-axis.
          </p>
          <HowGraphic radius={radius} />
          <div>
            <b>Surface area element:</b> dS = 2πr ds
          </div>
          <p>Total surface area: S = ∫ 2πr ds</p>
        </article>
        <article>
          <h3>Worked example (current)</h3>
          <p>
            Find the surface area when {model.label} is revolved about the{" "}
            {axis}-axis from x={a.toFixed(1)} to x={b.toFixed(1)}.
          </p>
          <b>Solution:</b>
          <strong>S = 2π∫ r(x)√(1+[f′(x)]²)dx</strong>
          <strong>= {area.toFixed(4)} square units</strong>
          <CheckCircle2 />
        </article>
      </section>
      <section className="sar321-practice">
        <div>
          <h3>
            <Sparkles />
            Try it yourself
          </h3>
          <p>
            Find the surface area when y=x<sup>3/2</sup> is revolved about the
            x-axis from x=0 to x=4.
          </p>
          <label>
            Your answer (decimal)
            <input
              aria-label="Surface practice answer"
              value={answer}
              placeholder="Enter your answer"
              onChange={(e) => {
                setAnswer(e.target.value);
                setResult("");
              }}
            />
          </label>
          <button
            onClick={() =>
              act(() =>
                setResult(
                  Math.abs(Number(answer) - practiceValue) < 0.001
                    ? "correct"
                    : "incorrect",
                ),
              )
            }
          >
            Check answer
          </button>
        </div>
        <button onClick={() => act(() => setHint((v) => !v))}>
          <Lightbulb />
          {hint ? "Hide" : "Hint"}
        </button>
        <output className={result}>
          {result === "correct"
            ? "Correct."
            : result === "incorrect"
              ? `Use 2π∫₀⁴x^(3/2)√(1+9x/4)dx ≈ ${practiceValue.toFixed(4)}.`
              : hint
                ? "Differentiate x^(3/2), then use 2πy ds."
                : ""}
        </output>
      </section>
    </section>
  );
}

function CurveGraph({
  curve,
  a,
  b,
  x,
  onX,
}: {
  curve: CurveKey;
  a: number;
  b: number;
  x: number;
  onX: (v: number) => void;
}) {
  const w = 390,
    h = 310,
    p = 38,
    model = curves[curve],
    sx = (v: number) => p + (v / 7) * (w - 2 * p),
    sy = (v: number) => h - p - (v / 3.2) * (h - 2 * p);
  const path = Array.from({ length: 121 }, (_, i) => {
    const v = (i * 7) / 120;
    return `${i ? "L" : "M"}${sx(v)},${sy(model.f(v))}`;
  }).join(" ");
  const drag = (e: ReactPointerEvent<SVGCircleElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const box = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!box) return;
    const move = (q: PointerEvent) =>
      onX(clamp(((q.clientX - box.left) / box.width) * 7, a, b));
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  return (
    <svg className="sar321-graph" viewBox={`0 0 ${w} ${h}`}>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((v) => (
        <g className="grid" key={`x${v}`}>
          <line x1={sx(v)} x2={sx(v)} y1={p} y2={h - p} />
          <text x={sx(v)} y={h - p + 17}>
            {v}
          </text>
        </g>
      ))}
      {[0, 1, 2, 3].map((v) => (
        <g className="grid" key={`y${v}`}>
          <line x1={p} x2={w - p} y1={sy(v)} y2={sy(v)} />
          <text x={p - 12} y={sy(v) + 3}>
            {v}
          </text>
        </g>
      ))}
      <line className="axis" x1={p} x2={w - p} y1={sy(0)} y2={sy(0)} />
      <line className="axis" x1={p} x2={p} y1={p} y2={h - p} />
      <path className="curve" d={path} />
      <line
        className="bound"
        x1={sx(a)}
        x2={sx(a)}
        y1={sy(0)}
        y2={sy(model.f(a))}
      />
      <line
        className="bound"
        x1={sx(b)}
        x2={sx(b)}
        y1={sy(0)}
        y2={sy(model.f(b))}
      />
      <line
        className="tangent"
        x1={sx(x - 0.45)}
        y1={sy(model.f(x) - model.d(x) * 0.45)}
        x2={sx(x + 0.45)}
        y2={sy(model.f(x) + model.d(x) * 0.45)}
      />
      <circle
        data-drag="surface-ring"
        className="drag"
        cx={sx(x)}
        cy={sy(model.f(x))}
        r="7"
        onPointerDown={drag}
      />
      <text className="formula" x={sx(2.7)} y={sy(model.f(2.7)) - 18}>
        {model.label}
      </text>
      <text className="ds" x={sx(x) + 14} y={sy(model.f(x)) + 18}>
        ds
      </text>
      <text className="bound-label" x={sx(a)} y={h - 8}>
        a={a.toFixed(1)}
      </text>
      <text className="bound-label" x={sx(b)} y={h - 8}>
        b={b.toFixed(1)}
      </text>
    </svg>
  );
}

function SurfaceGraph({
  curve,
  axis,
  a,
  b,
  x,
  onX,
}: {
  curve: CurveKey;
  axis: "x" | "y";
  a: number;
  b: number;
  x: number;
  onX: (v: number) => void;
}) {
  const w = 390,
    h = 310,
    model = curves[curve],
    sx = (v: number) => 54 + ((v - 0.1) / 6.9) * 285,
    cy = 155,
    ry = (v: number) => model.f(v) * 33;
  const profiles = Array.from({ length: 11 }, (_, i) => a + (i / 10) * (b - a));
  const top = profiles
      .map((v, i) => `${i ? "L" : "M"}${sx(v)},${cy - ry(v)}`)
      .join(" "),
    bottom = profiles
      .map((v, i) => `${i ? "L" : "M"}${sx(v)},${cy + ry(v)}`)
      .join(" ");
  const drag = (e: ReactPointerEvent<SVGEllipseElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const box = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!box) return;
    const move = (q: PointerEvent) =>
      onX(clamp(((q.clientX - box.left) / box.width) * 7, a, b));
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  return (
    <svg className="sar321-surface" viewBox={`0 0 ${w} ${h}`}>
      <path
        className="skin"
        d={`${top} ${profiles
          .slice()
          .reverse()
          .map((v) => `L${sx(v)},${cy + ry(v)}`)
          .join(" ")}Z`}
      />
      {profiles.map((v) => (
        <ellipse
          className="mesh"
          key={v}
          cx={sx(v)}
          cy={cy}
          rx="7"
          ry={ry(v)}
        />
      ))}
      <path className="edge" d={top} />
      <path className="edge" d={bottom} />
      <line className="axis" x1="30" x2="370" y1={cy} y2={cy} />
      <ellipse
        data-drag="surface-ring-3d"
        className="ring"
        cx={sx(x)}
        cy={cy}
        rx="8"
        ry={ry(x)}
        onPointerDown={drag}
      />
      <line className="ds" x1={sx(x)} x2={sx(x) + 42} y1={cy - 5} y2={cy - 5} />
      <text className="circ" x={sx(x) - 4} y={cy - ry(x) - 18}>
        2πr
      </text>
      <text className="ds-label" x={sx(x) + 45} y={cy}>
        ds
      </text>
      <text className="axis-label" x="365" y={cy - 8}>
        {axis}
      </text>
      <text className="bound-label" x={sx(a) - 20} y="290">
        a={a.toFixed(1)}
      </text>
      <text className="bound-label" x={sx(b) - 20} y="290">
        b={b.toFixed(1)}
      </text>
    </svg>
  );
}
function HowGraphic({ radius }: { radius: number }) {
  return (
    <svg className="sar321-how" viewBox="0 0 300 95">
      <path d="M10 72Q48 25 88 20" />
      <circle cx="88" cy="20" r="3" />
      <text x="94" y="24">
        ds
      </text>
      <path className="arrow" d="M118 50C142 22 154 68 124 67" />
      <path className="solid" d="M180 64Q220 12 260 28L260 72Q220 85 180 64Z" />
      <ellipse cx="252" cy="50" rx="9" ry={Math.min(34, 15 + radius * 6)} />
      <text x="234" y="13">
        2πr
      </text>
      <text x="248" y="91">
        ds
      </text>
    </svg>
  );
}
