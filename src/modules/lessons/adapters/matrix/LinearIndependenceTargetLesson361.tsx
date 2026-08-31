import { CheckCircle2, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./LinearIndependenceTargetLesson361.css";
type Vector = [number, number];
const initial = { v1: [2, 1] as Vector, v2: [1, 3] as Vector },
  clean = (n: number) => Number(n.toFixed(3)),
  determinant = (u: Vector, v: Vector) => clean(u[0] * v[1] - u[1] * v[0]);
function relation(v1: Vector, v2: Vector): Vector | null {
  if (Math.abs(determinant(v1, v2)) > 0.001) return null;
  if (Math.abs(v1[0]) + Math.abs(v2[0]) > 0.001) return [v2[0], -v1[0]];
  return [v2[1], -v1[1]];
}
export default function LinearIndependenceTargetLesson361({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [v1, setV1] = useState<Vector>(initial.v1),
    [v2, setV2] = useState<Vector>(initial.v2),
    [coefficients, setCoefficients] = useState<Vector>([1, -2]),
    [drag, setDrag] = useState<"v1" | "v2" | null>(null),
    [snap, setSnap] = useState(false),
    [tab, setTab] = useState("Explore"),
    [showSteps, setShowSteps] = useState(false),
    [challenge, setChallenge] = useState<"" | "correct" | "incorrect">(""),
    [actions, setActions] = useState(0),
    det = determinant(v1, v2),
    independent = Math.abs(det) > 0.001,
    rank = independent ? 2 : v1.some(Boolean) || v2.some(Boolean) ? 1 : 0,
    area = Math.abs(det),
    nontrivial = relation(v1, v2),
    combination: [number, number] = [
      clean(coefficients[0] * v1[0] + coefficients[1] * v2[0]),
      clean(coefficients[0] * v1[1] + coefficients[1] * v2[1]),
    ];
  const act = (fn: () => void) => {
      fn();
      setActions((v) => v + 1);
      onInteraction();
    },
    reset = () => {
      setV1(initial.v1);
      setV2(initial.v2);
      setCoefficients([1, -2]);
      setDrag(null);
      setSnap(false);
      setTab("Explore");
      setShowSteps(false);
      setChallenge("");
      setActions(0);
    },
    setComponent = (which: 0 | 1, index: number, value: string) =>
      act(() => {
        const setter = which === 0 ? setV1 : setV2;
        setter(
          (v) => v.map((n, i) => (i === index ? Number(value) : n)) as Vector,
        );
        setChallenge("");
      });
  useEffect(reset, [resetToken]);
  const point = ([x, y]: Vector) => `${290 + x * 54},${260 - y * 54}`,
    pointer = (e: React.PointerEvent<SVGSVGElement>) => {
      if (!drag) return;
      const b = e.currentTarget.getBoundingClientRect(),
        round = (n: number) => (snap ? Math.round(n) : clean(n)),
        value: Vector = [
          round((((e.clientX - b.left) / b.width) * 600 - 290) / 54),
          round((260 - ((e.clientY - b.top) / b.height) * 520) / 54),
        ];
      act(() => {
        (drag === "v1" ? setV1 : setV2)(value);
        setChallenge("");
      });
    };
  return (
    <section
      className="ind361-page"
      data-testid="matrix-mockup-0546"
      data-object-model="draggable-editable-vector-pair-determinant-area-rank-independence-homogeneous-relation-coefficient-residual-break-dependence-check"
      data-v1={JSON.stringify(v1)}
      data-v2={JSON.stringify(v2)}
      data-det={det}
      data-area={area}
      data-rank={rank}
      data-independent={independent}
      data-relation={JSON.stringify(nontrivial)}
      data-combination={JSON.stringify(combination)}
      data-tab={tab}
      data-challenge={challenge}
      data-actions={actions}
    >
      <header className="ind361-hero">
        <div>
          <span>
            <b>ADVANCED MATHEMATICS</b>
            <b>MATRICES AND LINEAR ALGEBRA</b>
          </span>
          <h1>Linear Independence</h1>
          <h2>Does any vector add a new direction?</h2>
          <p>
            Drag the vectors or use the sliders. Watch the area, determinant,
            rank, and relation update in real time.
          </p>
        </div>
        <aside>
          <h3>Definition</h3>
          <p>
            Vectors v₁, v₂ ∈ R² are linearly independent if the only solution to
          </p>
          <code>c₁v₁ + c₂v₂ = 0 is c₁ = c₂ = 0.</code>
          <p>Otherwise, they are linearly dependent.</p>
        </aside>
      </header>
      <nav className="ind361-tabs">
        {["Explore", "Worked Examples", "Concept", "Summary"].map((t) => (
          <button
            className={tab === t ? "active" : ""}
            key={t}
            onClick={() => act(() => setTab(t))}
          >
            {t}
          </button>
        ))}
      </nav>
      <section className="ind361-lab">
        <div className="ind361-plot">
          <h3>VECTOR PLANE</h3>
          <label>
            <input
              type="checkbox"
              checked={snap}
              onChange={() => act(() => setSnap((v) => !v))}
            />
            Snap to axes
          </label>
          <svg
            viewBox="0 0 600 520"
            onPointerMove={pointer}
            onPointerUp={() => setDrag(null)}
            onPointerLeave={() => setDrag(null)}
          >
            <defs>
              <pattern
                id="indgrid"
                width="54"
                height="54"
                patternUnits="userSpaceOnUse"
              >
                <path d="M54 0H0V54" fill="none" stroke="#e5eaf0" />
              </pattern>
            </defs>
            <rect width="600" height="520" fill="url(#indgrid)" />
            <path d="M0 260H600M290 0V520" stroke="#243653" />
            <polygon
              points={`${point([0, 0])} ${point(v1)} ${point(v2)}`}
              fill="#a36eea30"
            />
            {[
              [v1, "v1", "#08b9da"],
              [v2, "v2", "#f4860a"],
            ].map(([v, name, color]) => (
              <g key={String(name)}>
                <line
                  x1="290"
                  y1="260"
                  x2={point(v as Vector).split(",")[0]}
                  y2={point(v as Vector).split(",")[1]}
                  stroke={String(color)}
                  strokeWidth="3"
                />
                <circle
                  cx={point(v as Vector).split(",")[0]}
                  cy={point(v as Vector).split(",")[1]}
                  r="7"
                  fill={String(color)}
                  onPointerDown={() => setDrag(name as "v1" | "v2")}
                />
                <text
                  x={Number(point(v as Vector).split(",")[0]) + 10}
                  y={Number(point(v as Vector).split(",")[1]) - 8}
                >
                  {String(name)} = ({(v as Vector).join(", ")})
                </text>
              </g>
            ))}
          </svg>
          <p>Drag arrow tips to move vectors.</p>
          <button onClick={() => act(reset)}>
            <RotateCcw />
            Reset vectors
          </button>
        </div>
        <aside>
          <h3>VECTOR COMPONENTS</h3>
          {[
            [v1, "v₁", 0, "#06a6ca"],
            [v2, "v₂", 1, "#f47c08"],
          ].map(([v, name, which, color]) => (
            <section key={String(name)}>
              <h2 style={{ color: String(color) }}>
                {String(name)} = ({(v as Vector).join(", ")})
              </h2>
              {(v as Vector).map((n, i) => (
                <label key={i}>
                  {String(name)}
                  {i ? "y" : "x"}
                  <input
                    aria-label={`${name} component ${i + 1}`}
                    type="range"
                    min="-5"
                    max="5"
                    step="0.1"
                    value={n}
                    onChange={(e) =>
                      setComponent(which as 0 | 1, i, e.target.value)
                    }
                  />
                  <output>{n}</output>
                </label>
              ))}
            </section>
          ))}
          <section>
            <h3>COEFFICIENTS (c₁, c₂)</h3>
            {coefficients.map((n, i) => (
              <label key={i}>
                c{i + 1}
                <input
                  aria-label={`Coefficient c${i + 1}`}
                  type="range"
                  min="-5"
                  max="5"
                  step="0.1"
                  value={n}
                  onChange={(e) =>
                    act(() =>
                      setCoefficients(
                        (c) =>
                          c.map((q, j) =>
                            j === i ? Number(e.target.value) : q,
                          ) as Vector,
                      ),
                    )
                  }
                />
                <output>{n}</output>
              </label>
            ))}
          </section>
        </aside>
      </section>
      <section className="ind361-metrics">
        {[
          ["Area of span", area],
          ["Determinant", det],
          ["Rank", rank],
          ["Status", independent ? "Independent" : "Dependent"],
          [
            "Relation",
            nontrivial
              ? `${nontrivial[0]}v₁ + ${nontrivial[1]}v₂ = 0`
              : "c₁v₁ + c₂v₂ = 0",
          ],
        ].map((x, i) => (
          <article key={i}>
            <p>{x[0]}</p>
            <strong
              className={i === 3 ? (independent ? "correct" : "incorrect") : ""}
            >
              {x[1]}
            </strong>
            {i === 4 && (
              <small>Current combination = ({combination.join(", ")})</small>
            )}
          </article>
        ))}
      </section>
      <p className={`ind361-banner ${independent ? "correct" : "incorrect"}`}>
        <CheckCircle2 />
        {independent
          ? "The vectors are linearly independent and span the plane."
          : "The vectors are dependent and span only a line."}
      </p>
      <section className="ind361-relation">
        <div>
          <h3>
            {independent
              ? "Only the trivial relation"
              : "A nontrivial relation exists"}
          </h3>
          <p>
            {independent
              ? "The vectors are linearly independent."
              : "One vector is a scalar multiple of the other."}
          </p>
        </div>
        <strong>
          {nontrivial ? `(c₁,c₂)=(${nontrivial.join(",")})` : `(c₁,c₂)=(0,0)`}
        </strong>
        <code>c₁v₁+c₂v₂=({combination.join(", ")})</code>
      </section>
      <section className="ind361-examples">
        <header>
          <h2>Worked Examples</h2>
          <label>
            Show steps{" "}
            <input
              type="checkbox"
              checked={showSteps}
              onChange={() => act(() => setShowSteps((v) => !v))}
            />
          </label>
        </header>
        <div>
          <article>
            <h3>Independent pair</h3>
            <code>
              v₁=(1,0), v₂=(0,1)
              <br />
              det=1, rank=2
              <br />
              Only c₁=c₂=0
            </code>
            {showSteps && <p>The standard axes add two distinct directions.</p>}
          </article>
          <article>
            <h3>Dependent pair</h3>
            <code>
              v₁=(1,2), v₂=(2,4)
              <br />
              det=0, rank=1
              <br />
              2v₁-v₂=0
            </code>
            {showSteps && <p>The second vector is twice the first.</p>}
          </article>
        </div>
      </section>
      <section className="ind361-challenge">
        <div>
          <h3>Break the dependence</h3>
          <p>Move any vector so the area is nonzero and rank is 2.</p>
        </div>
        <strong>Goal: Status = Independent</strong>
        <button
          onClick={() =>
            act(() => setChallenge(independent ? "correct" : "incorrect"))
          }
        >
          Check
        </button>
        {challenge && (
          <output className={challenge}>
            {challenge === "correct"
              ? "Goal reached"
              : "Vectors are still collinear"}
          </output>
        )}
      </section>
    </section>
  );
}
