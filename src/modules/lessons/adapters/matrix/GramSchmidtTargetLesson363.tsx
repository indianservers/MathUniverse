import { Info, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./GramSchmidtTargetLesson363.css";
type Vector = [number, number];
const initial = { v1: [1, 1] as Vector, v2: [1, 0] as Vector },
  clean = (n: number) => Number(n.toFixed(4)),
  dot = (a: Vector, b: Vector) => clean(a[0] * b[0] + a[1] * b[1]),
  norm = (v: Vector) => Math.hypot(...v),
  scale = (v: Vector, k: number): Vector => [clean(v[0] * k), clean(v[1] * k)],
  subtract = (a: Vector, b: Vector): Vector => [
    clean(a[0] - b[0]),
    clean(a[1] - b[1]),
  ];
function gram(v1: Vector, v2: Vector, useProjection = true) {
  const length1 = norm(v1),
    e1 = length1 ? scale(v1, 1 / length1) : ([0, 0] as Vector),
    projection = useProjection
      ? scale(v1, dot(v2, v1) / (dot(v1, v1) || 1))
      : ([0, 0] as Vector),
    u2 = subtract(v2, projection),
    length2 = norm(u2),
    e2 = length2 ? scale(u2, 1 / length2) : ([0, 0] as Vector);
  return {
    e1,
    projection,
    u2,
    e2,
    dot: dot(e1, e2),
    independent: length1 > 1e-8 && length2 > 1e-8,
  };
}
export default function GramSchmidtTargetLesson363({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [v1, setV1] = useState<Vector>(initial.v1),
    [v2, setV2] = useState<Vector>(initial.v2),
    [step, setStep] = useState(1),
    [autoplay, setAutoplay] = useState(false),
    [speed, setSpeed] = useState(1),
    [tab, setTab] = useState("Interactive"),
    [drag, setDrag] = useState<"v1" | "v2" | null>(null),
    [useProjection, setUseProjection] = useState(true),
    [showSteps, setShowSteps] = useState(false),
    [actions, setActions] = useState(0),
    calculation = useMemo(
      () => gram(v1, v2, useProjection),
      [v1, v2, useProjection],
    );
  const act = (fn: () => void) => {
      fn();
      setActions((v) => v + 1);
      onInteraction();
    },
    reset = () => {
      setV1(initial.v1);
      setV2(initial.v2);
      setStep(1);
      setAutoplay(false);
      setSpeed(1);
      setTab("Interactive");
      setDrag(null);
      setUseProjection(true);
      setShowSteps(false);
      setActions(0);
    },
    update = (which: "v1" | "v2", i: number, value: string) =>
      act(() => {
        (which === "v1" ? setV1 : setV2)(
          (v) => v.map((n, j) => (j === i ? Number(value) : n)) as Vector,
        );
      });
  useEffect(reset, [resetToken]);
  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(
      () => setStep((s) => (s >= 2 ? 0 : s + 1)),
      1200 / speed,
    );
    return () => clearInterval(id);
  }, [autoplay, speed]);
  const point = ([x, y]: Vector) => `${235 + x * 96},${333 - y * 96}`,
    pointer = (e: React.PointerEvent<SVGSVGElement>) => {
      if (!drag) return;
      const b = e.currentTarget.getBoundingClientRect(),
        value: Vector = [
          clean((((e.clientX - b.left) / b.width) * 600 - 235) / 96),
          clean((333 - ((e.clientY - b.top) / b.height) * 500) / 96),
        ];
      act(() => {
        (drag === "v1" ? setV1 : setV2)(value);
      });
    },
    steps = ["Project", "Subtract", "Normalize"],
    shown =
      step === 0
        ? calculation.projection
        : step === 1
          ? calculation.u2
          : calculation.e2;
  return (
    <section
      className="gs363-page"
      data-testid="matrix-mockup-0548"
      data-object-model="editable-draggable-two-vector-real-gram-schmidt-projection-subtraction-normalization-step-autoplay-orthogonality-challenge"
      data-v1={JSON.stringify(v1)}
      data-v2={JSON.stringify(v2)}
      data-projection={JSON.stringify(calculation.projection)}
      data-u2={JSON.stringify(calculation.u2)}
      data-e1={JSON.stringify(calculation.e1)}
      data-e2={JSON.stringify(calculation.e2)}
      data-dot={calculation.dot}
      data-independent={calculation.independent}
      data-step={step}
      data-use-projection={useProjection}
      data-tab={tab}
      data-actions={actions}
    >
      <header className="gs363-hero">
        <div>
        <b>ADVANCED MATHEMATICS</b>
        <h1>Gram-Schmidt Orthogonalization</h1>
        <span className="sr-only">Gram–Schmidt</span>
          <p>Turn an independent basis into an orthonormal one</p>
          <span>
            Linear Algebra Lab &nbsp; Matrix Commands / CAS &nbsp; 10-15 min
          </span>
        </div>
        <aside>
          <button onClick={() => act(reset)}>
            <RotateCcw />
            Reset
          </button>
          <button onClick={() => act(() => {})}>
            <Share2 />
            Share
          </button>
        </aside>
      </header>
      <nav className="gs363-tabs">
        {["Interactive", "Formula Sequence", "Worked Example", "Challenge"].map(
          (t) => (
            <button
              className={tab === t ? "active" : ""}
              key={t}
              onClick={() => act(() => setTab(t))}
            >
              {t}
            </button>
          ),
        )}
      </nav>
      <p className="gs363-intro">
        <Info />
        Drag the vectors v₁ and v₂. Follow the steps to construct an orthonormal
        basis.
      </p>
      <section className="gs363-lab">
        <header>
          <div>
            <small>STEP {step + 1} OF 3</small>
            <h2>{steps[step]}</h2>
            <p>
              {step === 0
                ? "Compute the projection of v₂ onto v₁."
                : step === 1
                  ? "Compute u₂ = v₂ - projᵤ₁(v₂)."
                  : "Normalize u₁ and u₂ to obtain e₁ and e₂."}
            </p>
          </div>
          <nav>
            {steps.map((s, i) => (
              <button
                className={step === i ? "active" : ""}
                key={s}
                onClick={() => act(() => setStep(i))}
              >
                {i + 1} {s}
              </button>
            ))}
          </nav>
          <label>
            Autoplay{" "}
            <input
              type="checkbox"
              checked={autoplay}
              onChange={() => act(() => setAutoplay((v) => !v))}
            />
          </label>
          <select
            aria-label="Playback speed"
            value={speed}
            onChange={(e) => act(() => setSpeed(Number(e.target.value)))}
          >
            <option value="1">1x</option>
            <option value="2">2x</option>
          </select>
        </header>
        <div className="gs363-graph">
          <svg
            viewBox="0 0 600 500"
            preserveAspectRatio="none"
            onPointerMove={pointer}
            onPointerUp={() => setDrag(null)}
            onPointerLeave={() => setDrag(null)}
          >
            <defs>
              <pattern
                id="gsgrid"
                width="48"
                height="48"
                patternUnits="userSpaceOnUse"
              >
                <path d="M48 0H0V48" fill="none" stroke="#e5eaf0" />
              </pattern>
            </defs>
            <rect width="600" height="500" fill="url(#gsgrid)" />
            <path d="M0 333H600M235 0V500" stroke="#273952" />
            {[
              [v1, "v₁", "#f4800a"],
              [v2, "v₂", "#07aad0"],
              [calculation.projection, "proj", "#7a33e7"],
              [shown, steps[step], "#7a33e7"],
            ].map(([vector, name, color], i) => (
              <g key={i} opacity={i === 2 && !useProjection ? 0 : 1}>
                <line
                  x1="235"
                  y1="333"
                  x2={point(vector as Vector).split(",")[0]}
                  y2={point(vector as Vector).split(",")[1]}
                  stroke={String(color)}
                  strokeWidth={i < 2 ? 3 : 4}
                  strokeDasharray={i === 2 ? "7 5" : "0"}
                />
                <circle
                  cx={point(vector as Vector).split(",")[0]}
                  cy={point(vector as Vector).split(",")[1]}
                  r={i < 2 ? 7 : 4}
                  fill={String(color)}
                  onPointerDown={() => i < 2 && setDrag(i === 0 ? "v1" : "v2")}
                />
                <text
                  x={Number(point(vector as Vector).split(",")[0]) + 8}
                  y={Number(point(vector as Vector).split(",")[1]) - 7}
                >
                  {String(name)}
                </text>
              </g>
            ))}
          </svg>
          <aside>
            <p>Live orthogonality</p>
            <strong>e₁ · e₂ = {calculation.dot}</strong>
            <small>
              {Math.abs(calculation.dot) < 0.02
                ? "approaching 0"
                : "not orthogonal"}
            </small>
          </aside>
        </div>
        <section className="gs363-inputs">
          {[
            ["v1", v1, "#ef7e08"],
            ["v2", v2, "#08a9cb"],
          ].map(([name, vector, color]) => (
            <label key={String(name)}>
              <b style={{ color: String(color) }}>{String(name)}</b>
              {(vector as Vector).map((n, i) => (
                <input
                  aria-label={`${name} coordinate ${i + 1}`}
                  key={i}
                  type="number"
                  step="0.1"
                  value={n}
                  onChange={(e) =>
                    update(name as "v1" | "v2", i, e.target.value)
                  }
                />
              ))}
            </label>
          ))}
          <p className={calculation.independent ? "correct" : "incorrect"}>
            Basis status:{" "}
            {calculation.independent ? "linearly independent" : "dependent"}
          </p>
        </section>
        <section className="gs363-before">
          <article>
            Before (input basis)
            <code>
              v₁={JSON.stringify(v1)}, v₂={JSON.stringify(v2)}
            </code>
          </article>
          <b>→</b>
          <article>
            After (orthonormal basis)
            <code>
              e₁={JSON.stringify(calculation.e1)}, e₂=
              {JSON.stringify(calculation.e2)}
            </code>
          </article>
        </section>
        <footer>
          <button
            disabled={step === 0}
            onClick={() => act(() => setStep((s) => Math.max(0, s - 1)))}
          >
            Previous step
          </button>
          <button
            disabled={step === 2}
            onClick={() => act(() => setStep((s) => Math.min(2, s + 1)))}
          >
            Next step
          </button>
        </footer>
      </section>
      <section className="gs363-panels">
        <article>
          <h3>Formula sequence</h3>
          <p>1 Project: proj = (v₂·u₁)/(u₁·u₁)u₁</p>
          <p>2 Subtract: u₂ = v₂ - proj</p>
          <p>3 Normalize: eᵢ = uᵢ / ||uᵢ||</p>
        </article>
        <article>
          <h3>Current values</h3>
          <code>
            proj={JSON.stringify(calculation.projection)}
            <br />
            u₂={JSON.stringify(calculation.u2)}
            <br />
            e₁={JSON.stringify(calculation.e1)}
            <br />
            e₂={JSON.stringify(calculation.e2)}
          </code>
        </article>
        <article>
          <h3>Dot products</h3>
          <code>
            v₁·v₂={dot(v1, v2)}
            <br />
            u₁·u₂={dot(v1, calculation.u2)}
            <br />
            e₁·e₂={calculation.dot}
          </code>
          <strong
            className={
              Math.abs(calculation.dot) < 0.02 ? "correct" : "incorrect"
            }
          >
            {Math.abs(calculation.dot) < 0.02
              ? "Good! Orthogonal."
              : "Projection is required."}
          </strong>
        </article>
      </section>
      <section className="gs363-example">
        <h3>Worked example</h3>
        <p>
          Given v₁=(1,1), v₂=(1,0), the orthonormal basis is e₁=(1/√2,1/√2),
          e₂=(1/√2,-1/√2).
        </p>
        <button onClick={() => act(() => setShowSteps((v) => !v))}>
          {showSteps ? "Hide steps" : "Show steps"}
        </button>
        {showSteps && <code>proj=(1/2,1/2), u₂=(1/2,-1/2)</code>}
      </section>
      <section className="gs363-challenge">
        <h3>Challenge</h3>
        <div>
          <strong>Remove the projection</strong>
          <p>Turn off the projection and observe u₂ and the dot product.</p>
        </div>
        <label>
          Show projection{" "}
          <input
            type="checkbox"
            checked={useProjection}
            onChange={() => act(() => setUseProjection((v) => !v))}
          />
        </label>
        <button onClick={() => act(() => setUseProjection(false))}>
          Remove the projection
        </button>
      </section>
    </section>
  );
}
