import { Info, RotateCcw, Shuffle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./EigenTargetLesson359.css";

type Matrix = [number, number, number, number];
type Vector = [number, number];
const initial: Matrix = [2, 1, 1, 2],
  tabs = ["Interactive Lab", "Theory", "Worked Example", "Challenge"],
  gridValues = [-3, -2, -1, 0, 1, 2, 3],
  clean = (n: number) => Number(n.toFixed(3));
const multiply = ([a, b, c, d]: Matrix, [x, y]: Vector): Vector => [
  clean(a * x + b * y),
  clean(c * x + d * y),
];
function eigen(matrix: Matrix) {
  const [a, b, c, d] = matrix,
    tr = a + d,
    det = a * d - b * c,
    disc = tr * tr - 4 * det;
  if (disc < 0)
    return { tr, det, roots: [] as number[], vectors: [] as Vector[] };
  const roots = [
    clean((tr + Math.sqrt(disc)) / 2),
    clean((tr - Math.sqrt(disc)) / 2),
  ];
  const vectors = roots.map((lambda) => {
    let v: Vector = Math.abs(b) > 1e-8 ? [b, lambda - a] : [lambda - d, c];
    if (Math.abs(v[0]) + Math.abs(v[1]) < 1e-8) v = [1, 0];
    const scale = Math.max(Math.abs(v[0]), Math.abs(v[1]));
    return [clean(v[0] / scale), clean(v[1] / scale)] as Vector;
  });
  return { tr, det, roots, vectors };
}
const parallel = (u: Vector, v: Vector) =>
  Math.abs(u[0] * v[1] - u[1] * v[0]) < 0.03;
export default function EigenTargetLesson359({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [matrix, setMatrix] = useState<Matrix>(initial),
    [vector, setVector] = useState<Vector>([1, 1]),
    [tab, setTab] = useState(tabs[0]),
    [drag, setDrag] = useState(false),
    [checked, setChecked] = useState(false),
    [challenge, setChallenge] = useState<[string, string]>(["", ""]),
    [challengeResult, setChallengeResult] = useState<
      "" | "correct" | "incorrect"
    >(""),
    [zoom, setZoom] = useState(1),
    [actions, setActions] = useState(0),
    calculation = useMemo(() => eigen(matrix), [matrix]),
    av = multiply(matrix, vector),
    norm = vector[0] ** 2 + vector[1] ** 2,
    lambda = norm ? clean((av[0] * vector[0] + av[1] * vector[1]) / norm) : 0,
    isEigen = norm > 0 && parallel(av, vector),
    expected = calculation.vectors[1] ?? null;
  const act = (fn: () => void) => {
      fn();
      setActions((v) => v + 1);
      onInteraction();
    },
    reset = () => {
      setMatrix(initial);
      setVector([1, 1]);
      setTab(tabs[0]);
      setDrag(false);
      setChecked(false);
      setChallenge(["", ""]);
      setChallengeResult("");
      setZoom(1);
      setActions(0);
    },
    update = (i: number, value: string) =>
      act(() => {
        setMatrix(
          (m) => m.map((n, j) => (j === i ? Number(value) : n)) as Matrix,
        );
        setChecked(false);
      }),
    random = () =>
      act(() => {
        const options: Matrix[] = [
          [3, 0, 0, 1],
          [1, 2, 2, 1],
          [4, 1, 2, 3],
          [2, -1, -1, 2],
        ];
        setMatrix(options[(actions + 1) % options.length]);
        setChecked(false);
      }),
    checkChallenge = () =>
      act(() => {
        const candidate: Vector = [Number(challenge[0]), Number(challenge[1])];
        setChallengeResult(
          expected && parallel(candidate, expected) && candidate.some(Boolean)
            ? "correct"
            : "incorrect",
        );
      });
  useEffect(reset, [resetToken]);
  const pointer = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!drag) return;
    const box = event.currentTarget.getBoundingClientRect(),
      x = clean(
        (((event.clientX - box.left) / box.width) * 720 - 360) / (76 * zoom),
      ),
      y = clean(
        (300 - ((event.clientY - box.top) / box.height) * 570) / (76 * zoom),
      );
    act(() => setVector([x, y]));
  };
  const point = ([x, y]: Vector) =>
    `${360 + x * 76 * zoom},${300 - y * 76 * zoom}`;
  const mappedSegment = (from: Vector, to: Vector) => {
    const start = point(multiply(matrix, from));
    const end = point(multiply(matrix, to));
    return `M${start} L${end}`;
  };
  return (
    <section
      className="eig359-page"
      data-testid="matrix-mockup-0544"
      data-object-model="editable-real-two-by-two-eigensystem-characteristic-polynomial-derived-eigenpairs-draggable-vector-parallel-check-invariant-direction-challenge"
      data-matrix={JSON.stringify(matrix)}
      data-roots={JSON.stringify(calculation.roots)}
      data-vectors={JSON.stringify(calculation.vectors)}
      data-vector={JSON.stringify(vector)}
      data-av={JSON.stringify(av)}
      data-lambda={lambda}
      data-eigen={isEigen}
      data-tab={tab}
      data-challenge={challengeResult}
      data-actions={actions}
    >
      <header className="eig359-hero">
        <h1>Eigenvalues &amp; Eigenvectors</h1>
        <span className="sr-only">Eigenvalues and Eigenvectors</span>
        <h2>Directions that do not turn</h2>
        <p>
          Eigenvectors are directions that only stretch (or shrink) under the
          transformation A.
        </p>
      </header>
      <nav className="eig359-tabs">
        {tabs.map((t) => (
          <button
            key={t}
            className={tab === t ? "active" : ""}
            onClick={() => act(() => setTab(t))}
          >
            {t}
          </button>
        ))}
      </nav>
      <section className="eig359-setup">
        <article>
          <h3>
            Matrix A <small>(edit the 2×2 matrix)</small>
          </h3>
          <div className="eig359-inputs">
            {matrix.map((v, i) => (
              <input
                aria-label={`Matrix entry ${i + 1}`}
                key={i}
                type="number"
                value={v}
                onChange={(e) => update(i, e.target.value)}
              />
            ))}
          </div>
          <code>
            A = [ {matrix[0]} {matrix[1]} ; {matrix[2]} {matrix[3]} ]
          </code>
          <footer>
            <button onClick={random}>
              <Shuffle />
              Random matrix
            </button>
            <button onClick={() => act(reset)}>
              <RotateCcw />
              Reset
            </button>
          </footer>
        </article>
        <article>
          <h3>Apply transformation A</h3>
          <strong>Av = λv</strong>
          <p>Stretch factor λ</p>
          <b>{isEigen ? lambda : "not parallel"}</b>
          <small>
            <Info /> Drag the purple vector v. When it lies on an eigenline, Av
            is parallel to v.
          </small>
        </article>
        <article>
          <h3>
            Vector v <small>(draggable)</small>
          </h3>
          <code>
            v = [ {vector[0]} ; {vector[1]} ]
          </code>
          <div>
            <button onClick={() => act(() => setVector([1, 1]))}>
              Use preset
            </button>
            <button onClick={() => act(() => setVector([1, -1]))}>
              <RotateCcw />
              Reset
            </button>
          </div>
          <button
            className="eig359-check"
            onClick={() => act(() => setChecked(true))}
          >
            Check eigenpair
          </button>
          {checked && (
            <output className={isEigen ? "correct" : "incorrect"}>
              {isEigen ? "Valid eigenpair" : "Av is not parallel to v"}
            </output>
          )}
        </article>
      </section>
      <section className="eig359-graph">
        <header>
          <h3>See how A transforms the plane</h3>
          <p>
            <i />
            Before (v) <i />
            After (Av) <i />
            Eigenlines
          </p>
        </header>
        <svg
          viewBox="0 0 720 570"
          onPointerMove={pointer}
          onPointerUp={() => setDrag(false)}
          onPointerLeave={() => setDrag(false)}
        >
          <defs>
            <pattern
              id="eiggrid"
              width="76"
              height="76"
              patternUnits="userSpaceOnUse"
            >
              <path d="M76 0H0V76" fill="none" stroke="#dce4ed" />
            </pattern>
          </defs>
          <rect width="720" height="570" fill="url(#eiggrid)" />
          <path d="M0 300H720M360 0V570" stroke="#273957" />
          {gridValues.map((value) => (
            <g key={value}>
              <path
                d={mappedSegment([value, -3], [value, 3])}
                fill="none"
                stroke="#9eacc2"
                strokeDasharray="5 5"
                opacity=".45"
              />
              <path
                d={mappedSegment([-3, value], [3, value])}
                fill="none"
                stroke="#9eacc2"
                strokeDasharray="5 5"
                opacity=".45"
              />
            </g>
          ))}
          {calculation.vectors.map((v, i) => (
            <line
              key={i}
              x1="0"
              y1={
                Number(point(v).split(",")[1]) +
                Number(point(v).split(",")[0]) * (v[1] / v[0] || 0)
              }
              x2="720"
              y2={300 - (720 - 360) * (v[1] / v[0] || 0)}
              stroke={i ? "#08bfe0" : "#ff7c19"}
              strokeWidth="2"
              strokeDasharray={i ? "7 5" : "0"}
            />
          ))}
          {calculation.roots.map((root, index) => (
            <text
              key={root}
              x={index ? 565 : 95}
              y={index ? 505 : 105}
              className="eig359-line-label"
            >
              λ{index + 1} = {root}
            </text>
          ))}
          <line
            x1="360"
            y1="300"
            x2={point(vector).split(",")[0]}
            y2={point(vector).split(",")[1]}
            stroke="#7a35f0"
            strokeWidth="4"
          />
          <line
            x1="360"
            y1="300"
            x2={point(av).split(",")[0]}
            y2={point(av).split(",")[1]}
            stroke="#7a35f0"
            strokeWidth="4"
          />
          <circle
            cx={point(vector).split(",")[0]}
            cy={point(vector).split(",")[1]}
            r="8"
            fill="#7a35f0"
            onPointerDown={() => setDrag(true)}
          />
          <text
            x={Number(point(vector).split(",")[0]) + 10}
            y={Number(point(vector).split(",")[1]) - 8}
          >
            v
          </text>
          <text
            x={Number(point(av).split(",")[0]) + 10}
            y={Number(point(av).split(",")[1]) - 8}
          >
            Av
          </text>
        </svg>
        <aside>
          <button
            onClick={() => act(() => setZoom((z) => Math.min(1.3, z + 0.1)))}
          >
            +
          </button>
          <button
            onClick={() => act(() => setZoom((z) => Math.max(0.7, z - 0.1)))}
          >
            −
          </button>
          <button onClick={() => act(() => setZoom(1))}>↻</button>
        </aside>
        <footer>
          <Info />
          The highlighted lines are invariant directions. Vectors on them do not
          turn.
        </footer>
      </section>
      <section className="eig359-analysis">
        <article>
          <h3>Characteristic polynomial</h3>
          <code>
            det(A - λI) = 0<br />
            <br />
            λ² - {calculation.tr}λ + {calculation.det} = 0<br />
            <br />
            {calculation.roots.length
              ? `λ = ${calculation.roots.join(", ")}`
              : "No real roots"}
          </code>
        </article>
        <article>
          <h3>Eigenpairs</h3>
          {calculation.roots.map((root, i) => (
            <div key={root}>
              <b>
                λ{i + 1} = {root}
              </b>
              <p>Eigenvector direction ({calculation.vectors[i].join(", ")})</p>
              <code>
                v{i + 1} = [{calculation.vectors[i].join(" ; ")}]
              </code>
            </div>
          ))}
        </article>
        <article>
          <h3>Check eigenpair</h3>
          <p>Check whether Av = λv holds.</p>
          <code>
            v = [{vector.join(" ; ")}], λ = {lambda}
            <br />
            <br />
            Av = [{av.join(" ; ")}]
          </code>
          <strong className={isEigen ? "correct" : "incorrect"}>
            {isEigen ? "Av = λv ✓" : "Av is not parallel to v"}
          </strong>
        </article>
      </section>
      <section className="eig359-challenge">
        <div>
          <h3>Challenge: Find the invariant direction</h3>
          <p>Find another eigenvector direction of the current matrix.</p>
          <small>
            Hint: any nonzero multiple of the other eigenvector works.
          </small>
        </div>
        <label>
          My answer{" "}
          <span>
            v ≈ [
            <input
              aria-label="Challenge x"
              type="number"
              value={challenge[0]}
              onChange={(e) =>
                act(() => {
                  setChallenge([e.target.value, challenge[1]]);
                  setChallengeResult("");
                })
              }
            />
            <input
              aria-label="Challenge y"
              type="number"
              value={challenge[1]}
              onChange={(e) =>
                act(() => {
                  setChallenge([challenge[0], e.target.value]);
                  setChallengeResult("");
                })
              }
            />
            ]
          </span>
        </label>
        <aside>
          <button onClick={checkChallenge}>Check direction</button>
          {challengeResult && (
            <output className={challengeResult}>
              {challengeResult === "correct"
                ? "Correct invariant direction"
                : "Try a vector parallel to the second eigenline"}
            </output>
          )}
        </aside>
      </section>
    </section>
  );
}
