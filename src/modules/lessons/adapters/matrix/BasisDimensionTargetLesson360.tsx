import { CheckCircle2, Info, RotateCcw, Shuffle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./BasisDimensionTargetLesson360.css";
type Vector = [number, number];
const defaults = {
    v1: [1, 1] as Vector,
    v2: [1, -1] as Vector,
    x: [4, 2] as Vector,
  },
  candidates: Vector[] = [
    [1, 0],
    [0, 1],
    [1, 1],
    [2, 2],
    [1, -1],
    [-1, 2],
    [1, 3],
  ],
  graphOrigin: Vector = [260, 290],
  graphScale = 70,
  clean = (n: number) => Number(n.toFixed(2));
const determinant = (u: Vector, v: Vector) => clean(u[0] * v[1] - u[1] * v[0]);
function coordinates(v1: Vector, v2: Vector, x: Vector) {
  const det = determinant(v1, v2);
  return Math.abs(det) < 1e-8
    ? null
    : ([
        clean((x[0] * v2[1] - x[1] * v2[0]) / det),
        clean((v1[0] * x[1] - v1[1] * x[0]) / det),
      ] as Vector);
}
export default function BasisDimensionTargetLesson360({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [v1, setV1] = useState<Vector>(defaults.v1),
    [v2, setV2] = useState<Vector>(defaults.v2),
    [target, setTarget] = useState<Vector>(defaults.x),
    [drag, setDrag] = useState<"v1" | "v2" | "x" | null>(null),
    [answers, setAnswers] = useState<[string, string]>(["3", "1"]),
    [result, setResult] = useState<"" | "correct" | "incorrect">("correct"),
    [selected, setSelected] = useState<number[]>([]),
    [basisResult, setBasisResult] = useState<"" | "correct" | "incorrect">(""),
    [tab, setTab] = useState("Explore"),
    [actions, setActions] = useState(0),
    det = determinant(v1, v2),
    independent = Math.abs(det) > 1e-8,
    coords = useMemo(() => coordinates(v1, v2, target), [v1, v2, target]);
  const act = (fn: () => void) => {
      fn();
      setActions((v) => v + 1);
      onInteraction();
    },
    reset = () => {
      setV1(defaults.v1);
      setV2(defaults.v2);
      setTarget(defaults.x);
      setDrag(null);
      setAnswers(["3", "1"]);
      setResult("correct");
      setSelected([]);
      setBasisResult("");
      setTab("Explore");
      setActions(0);
    },
    random = () =>
      act(() => {
        const sets: [[Vector, Vector]] | [Vector, Vector][] = [
          [
            [2, 1],
            [-1, 2],
          ],
          [
            [1, 2],
            [2, 4],
          ],
          [
            [3, -1],
            [1, 1],
          ],
        ];
        const pair = sets[(actions + 1) % sets.length];
        setV1(pair[0]);
        setV2(pair[1]);
        setResult("");
      }),
    check = () =>
      act(() =>
        setResult(
          coords && answers.every((v, i) => Number(v) === coords[i])
            ? "correct"
            : "incorrect",
        ),
      ),
    toggle = (i: number) =>
      act(() => {
        setSelected((s) =>
          s.includes(i)
            ? s.filter((v) => v !== i)
            : s.length < 2
              ? [...s, i]
              : s,
        );
        setBasisResult("");
      }),
    checkBasis = () =>
      act(() =>
        setBasisResult(
          selected.length === 2 &&
            Math.abs(
              determinant(candidates[selected[0]], candidates[selected[1]]),
            ) > 1e-8
            ? "correct"
            : "incorrect",
        ),
      );
  useEffect(reset, [resetToken]);
  const point = ([x, y]: Vector) =>
      `${graphOrigin[0] + x * graphScale},${graphOrigin[1] - y * graphScale}`,
    pointer = (e: React.PointerEvent<SVGSVGElement>) => {
      if (!drag) return;
      const b = e.currentTarget.getBoundingClientRect(),
        value: [number, number] = [
          clean(
            (((e.clientX - b.left) / b.width) * 600 - graphOrigin[0]) /
              graphScale,
          ),
          clean(
            (graphOrigin[1] - ((e.clientY - b.top) / b.height) * 510) /
              graphScale,
          ),
        ];
      act(() => {
        if (drag === "v1") setV1(value);
        if (drag === "v2") setV2(value);
        if (drag === "x") setTarget(value);
        setResult("");
      });
    },
    component = coords
      ? ([clean(coords[0] * v1[0]), clean(coords[0] * v1[1])] as Vector)
      : null;
  return (
    <section
      className="basis360-page"
      data-testid="matrix-mockup-0545"
      data-object-model="draggable-two-vector-basis-determinant-independence-span-dimension-coordinate-solve-reconstruction-selectable-basis-challenge"
      data-v1={JSON.stringify(v1)}
      data-v2={JSON.stringify(v2)}
      data-target={JSON.stringify(target)}
      data-det={det}
      data-independent={independent}
      data-coordinates={JSON.stringify(coords)}
      data-result={result}
      data-selected={selected.join(",")}
      data-basis-result={basisResult}
      data-tab={tab}
      data-actions={actions}
    >
      <header>
        <h1>Basis &amp; Dimension</h1>
        <span className="sr-only">Basis and Dimension</span>
        <p>Enough independent directions to build the space.</p>
        <span>Matrix / CAS &nbsp; 6-10 min</span>
      </header>
      <nav className="basis360-tabs">
        {["Explore", "Definition", "Worked Example", "Challenge", "Notes"].map(
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
      <section className="basis360-summary">
        {[
          [
            "Independent?",
            independent ? "YES" : "NO",
            independent
              ? "The selected vectors are linearly independent."
              : "The vectors are collinear.",
          ],
          [
            "Span",
            independent ? "R²" : "a line",
            independent
              ? "They span the entire plane."
              : "They span one direction.",
          ],
          [
            "Number of basis vectors",
            independent ? "2" : "1",
            "A basis for R² has 2 vectors.",
          ],
          [
            "Dimension",
            independent ? "dim(R²) = 2" : "dim(span) = 1",
            "Dimension counts independent directions.",
          ],
        ].map((x, i) => (
          <article key={i}>
            <b>{i === 0 ? <CheckCircle2 /> : "#"}</b>
            <h3>{x[0]}</h3>
            <strong>{x[1]}</strong>
            <p>{x[2]}</p>
          </article>
        ))}
      </section>
      <section className="basis360-lab">
        <header>
          <b>1</b>
          <h2>Build a basis by selecting vectors</h2>
          <p>
            Drag the vector handles to choose your candidate vectors v₁ and v₂.
          </p>
          <nav>
            <button onClick={() => act(reset)}>
              <RotateCcw />
              Reset
            </button>
            <button onClick={random}>
              <Shuffle />
              Randomize
            </button>
          </nav>
        </header>
        <div className="basis360-work">
          <svg
            viewBox="0 0 600 510"
            onPointerMove={pointer}
            onPointerUp={() => setDrag(null)}
            onPointerLeave={() => setDrag(null)}
          >
            <defs>
              <pattern
                id="basisgrid"
                width={graphScale}
                height={graphScale}
                patternUnits="userSpaceOnUse"
              >
                <path
                  d={`M${graphScale} 0H0V${graphScale}`}
                  fill="none"
                  stroke="#e2e6ef"
                />
              </pattern>
            </defs>
            <rect width="600" height="510" fill="url(#basisgrid)" />
            <path
              d={`M0 ${graphOrigin[1]}H600M${graphOrigin[0]} 0V510`}
              stroke="#253651"
            />
            <polygon
              points={`${point([0, 0])} ${component ? point(component) : point([0, 0])} ${point(target)} ${coords ? point([coords[1] * v2[0], coords[1] * v2[1]]) : point([0, 0])}`}
              fill="#a76ef020"
              stroke="#aa74ef"
              strokeDasharray="6 5"
            />
            {[
              [v1, "v1", "#08b9d1"],
              [v2, "v2", "#8735ea"],
              [target, "x", "#f57b0a"],
            ].map(([v, name, color]) => (
              <g key={String(name)}>
                <line
                  x1={graphOrigin[0]}
                  y1={graphOrigin[1]}
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
                  onPointerDown={() => setDrag(name as "v1" | "v2" | "x")}
                />
                <text
                  x={Number(point(v as Vector).split(",")[0]) + 10}
                  y={Number(point(v as Vector).split(",")[1]) - 9}
                >
                  {String(name)} = ({(v as Vector).join(", ")})
                </text>
              </g>
            ))}
          </svg>
          <footer>
            <i />
            v₁ <i />
            v₂ <i />x <span />
            Span(v₁,v₂)
          </footer>
          <aside>
            <h3>Candidate vectors (drag to change)</h3>
            {[
              ["v₁", v1],
              ["v₂", v2],
              ["x", target],
            ].map(([name, v], i) => (
              <label key={String(name)}>
                <b>{String(name)}</b>
                {(v as Vector).map((n, j) => (
                  <input
                    key={j}
                    aria-label={`${name} coordinate ${j + 1}`}
                    type="number"
                    value={n}
                    onChange={(e) =>
                      act(() => {
                        const next = (v as Vector).map((q, k) =>
                          k === j ? Number(e.target.value) : q,
                        ) as Vector;
                        if (i === 0) setV1(next);
                        if (i === 1) setV2(next);
                        if (i === 2) setTarget(next);
                        setResult("");
                      })
                    }
                  />
                ))}
              </label>
            ))}
            <section>
              <h3>Coordinates in this basis</h3>
              <p>Find scalars c₁, c₂ such that x = c₁v₁ + c₂v₂</p>
              <div>
                {answers.map((v, i) => (
                  <input
                    aria-label={`Coefficient c${i + 1}`}
                    key={i}
                    type="number"
                    value={v}
                    onChange={(e) =>
                      act(() => {
                        setAnswers(
                          (a) =>
                            a.map((q, j) => (j === i ? e.target.value : q)) as [
                              string,
                              string,
                            ],
                        );
                        setResult("");
                      })
                    }
                  />
                ))}
              </div>
              <button onClick={check}>Check decomposition</button>
              {result && (
                <output className={result}>
                  {result === "correct" && coords
                    ? `Correct! x = ${coords[0]}v₁ + ${coords[1]}v₂`
                    : "Recompute the two coefficients."}
                </output>
              )}
            </section>
          </aside>
        </div>
      </section>
      <section className="basis360-info">
        <article>
          <h3>
            <Info />
            What is a basis?
          </h3>
          <p>
            A basis is a linearly independent set that spans the space. Every
            vector has a unique coordinate representation.
          </p>
        </article>
        <article>
          <h3>Span Visualization</h3>
          <p>
            The shaded parallelogram combines c₁v₁ and c₂v₂ to reconstruct x.
          </p>
        </article>
      </section>
      <section className="basis360-example">
        <h3>
          <b>2</b>Worked Example
        </h3>
        <p>Let v₁=(1,1), v₂=(1,-1), and x=(4,2). Find the coordinates of x.</p>
        <div>
          <article>
            <b>Step 1: Linear combination</b>
            <code>x = c₁v₁ + c₂v₂</code>
          </article>
          <article>
            <b>Step 2: Solve</b>
            <code>
              c₁+c₂=4
              <br />
              c₁-c₂=2
              <br />
              c₁=3, c₂=1
            </code>
          </article>
          <article>
            <b>Step 3: Answer</b>
            <code>x = 3v₁ + 1v₂</code>
          </article>
          <article>
            <b>Check</b>
            <code>3(1,1)+(1,-1)=(4,2)</code>
          </article>
        </div>
      </section>
      <section className="basis360-challenge">
        <h3>
          <b>3</b>Challenge: Choose a basis for R²
        </h3>
        <p>Select two vectors that form a basis.</p>
        <div>
          {candidates.map((v, i) => (
            <button
              className={selected.includes(i) ? "selected" : ""}
              key={i}
              onClick={() => toggle(i)}
            >
              <i />
              {`[${v.join(" ; ")}]`}
            </button>
          ))}
        </div>
        <footer>
          <strong>Selected: {selected.length} / 2</strong>
          <button onClick={checkBasis}>Check basis</button>
          {basisResult && (
            <output className={basisResult}>
              {basisResult === "correct"
                ? "Correct: determinant is nonzero."
                : "Choose two non-collinear vectors."}
            </output>
          )}
        </footer>
      </section>
    </section>
  );
}
