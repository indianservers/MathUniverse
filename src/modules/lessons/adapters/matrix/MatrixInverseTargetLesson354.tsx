import { Eye, Play, RotateCcw, Share2, Shuffle } from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./MatrixInverseTargetLesson354.css";
type Matrix = [[number, number], [number, number]];
type Aug = [number, number, number, number][];
const initial: Matrix = [
    [2, 1],
    [1, 1],
  ],
  tabs = ["Interact", "Learn", "Example", "Formula", "Practice"],
  clean = (n: number) => (Math.abs(n) < 1e-10 ? 0 : Number(n.toFixed(4)));
const det = (m: Matrix) => m[0][0] * m[1][1] - m[0][1] * m[1][0],
  inverse = (m: Matrix): Matrix | null => {
    const d = det(m);
    return d === 0
      ? null
      : [
          [clean(m[1][1] / d), clean(-m[0][1] / d)],
          [clean(-m[1][0] / d), clean(m[0][0] / d)],
        ];
  },
  augment = (m: Matrix): Aug => [
    [m[0][0], m[0][1], 1, 0],
    [m[1][0], m[1][1], 0, 1],
  ];
function eliminationStates(m: Matrix) {
  let x = augment(m);
  const states: [string, Aug][] = [
    ["Start with [A | I]", x.map((r) => [...r]) as Aug],
  ];
  const swap = () => {
    x = [x[1], x[0]];
  };
  if (Math.abs(x[0][0]) < 1e-10) swap();
  if (Math.abs(x[0][0]) < 1e-10) return states;
  let p = x[0][0];
  x = x.map((r, i) =>
    i ? ([...r] as typeof r) : (r.map((v) => clean(v / p)) as typeof r),
  );
  states.push([`R1 <- R1 / ${clean(p)}`, x.map((r) => [...r]) as Aug]);
  const f = x[1][0];
  x = [x[0], x[1].map((v, j) => clean(v - f * x[0][j])) as (typeof x)[1]];
  states.push([`R2 <- R2 - ${clean(f)}R1`, x.map((r) => [...r]) as Aug]);
  p = x[1][1];
  if (Math.abs(p) < 1e-10) return states;
  x = [x[0], x[1].map((v) => clean(v / p)) as (typeof x)[1]];
  states.push([`R2 <- R2 / ${clean(p)}`, x.map((r) => [...r]) as Aug]);
  const g = x[0][1];
  x = [x[0].map((v, j) => clean(v - g * x[1][j])) as (typeof x)[0], x[1]];
  states.push([`R1 <- R1 - ${clean(g)}R2`, x.map((r) => [...r]) as Aug]);
  return states;
}
export default function MatrixInverseTargetLesson354({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [matrix, setMatrix] = useState<Matrix>(initial),
    [step, setStep] = useState(0),
    [playing, setPlaying] = useState(false),
    [hints, setHints] = useState(true),
    [answer, setAnswer] = useState(["", ""]),
    [check, setCheck] = useState<"" | "correct" | "incorrect">(""),
    [solution, setSolution] = useState(false),
    [tab, setTab] = useState(tabs[0]),
    [actions, setActions] = useState(0);
  const determinant = det(matrix),
    inv = inverse(matrix),
    invertible = inv !== null,
    states = eliminationStates(matrix),
    safeStep = Math.min(step, states.length - 1),
    aug = states[safeStep][1],
    target = [3, 2],
    expected = inv
      ? [
          clean(inv[0][0] * target[0] + inv[0][1] * target[1]),
          clean(inv[1][0] * target[0] + inv[1][1] * target[1]),
        ]
      : [NaN, NaN],
    transformed = [
      [0, 0],
      [matrix[0][0], matrix[1][0]],
      [matrix[0][0] + matrix[0][1], matrix[1][0] + matrix[1][1]],
      [matrix[0][1], matrix[1][1]],
    ];
  const act = (fn: () => void) => {
      fn();
      setActions((v) => v + 1);
      onInteraction();
    },
    reset = () => {
      setMatrix(initial);
      setStep(0);
      setPlaying(false);
      setHints(true);
      setAnswer(["", ""]);
      setCheck("");
      setSolution(false);
      setTab(tabs[0]);
      setActions(0);
    };
  useEffect(reset, [resetToken]);
  useEffect(() => {
    if (!playing || !invertible) return;
    const id = window.setInterval(
      () =>
        setStep((s) => {
          if (s >= states.length - 1) {
            setPlaying(false);
            return s;
          }
          return s + 1;
        }),
      700,
    );
    return () => clearInterval(id);
  }, [playing, invertible, states.length]);
  const edit = (r: number, c: number, v: number) =>
      act(() => {
        setMatrix(
          (m) =>
            m.map((row, i) =>
              row.map((x, j) => (i === r && j === c ? v : x)),
            ) as Matrix,
        );
        setStep(0);
        setPlaying(false);
        setCheck("");
        setSolution(false);
      }),
    randomize = () =>
      act(() => {
        let m: Matrix;
        do
          m = [
            [rand(), rand()],
            [rand(), rand()],
          ];
        while (det(m) === 0);
        setMatrix(m);
        setStep(0);
        setPlaying(false);
      });
  return (
    <section
      className="mat354-page"
      data-testid="matrix-mockup-0539"
      data-object-model="editable-two-by-two-matrix-determinant-invertibility-gated-formula-inverse-real-gauss-jordan-states-autoplay-geometric-transform-undo-linear-solve-challenge"
      data-matrix={matrix.flat().join(",")}
      data-det={determinant}
      data-invertible={invertible}
      data-inverse={inv ? inv.flat().join(",") : "none"}
      data-step={safeStep}
      data-steps={states.length}
      data-augmented={aug.flat().join(",")}
      data-playing={playing}
      data-hints={hints}
      data-expected={expected.join(",")}
      data-answer={answer.join(",")}
      data-check={check}
      data-solution={solution}
      data-tab={tab}
      data-actions={actions}
    >
      <header className="mat354-hero">
        <div>
          <span>
            <b>ADVANCED MATHEMATICS</b>
            <b>MATRICES AND LINEAR ALGEBRA</b>
          </span>
          <h1>Matrix Inverse</h1>
          <p>The transformation that reverses A</p>
          <section>
            <b>Advanced</b>
            <b>Linear Algebra Lab</b>
            <b>Matrix Commands / CAS</b>
            <b>8-12 min</b>
          </section>
        </div>
        <nav>
          <select aria-label="Language">
            <option>English (English)</option>
          </select>
          <button onClick={reset}>
            <RotateCcw />
            Reset
          </button>
          <button onClick={() => act(() => {})}>
            <Share2 />
            Share
          </button>
          <button>Workspace</button>
        </nav>
      </header>
      <nav className="mat354-tabs">
        {tabs.map((name) => (
          <button
            className={tab === name ? "active" : ""}
            key={name}
            onClick={() => act(() => setTab(name))}
          >
            {name}
          </button>
        ))}
      </nav>
      <section className="mat354-intro">
        <article>
          <h3>1. DEFINE A 2x2 MATRIX A</h3>
          <p>Edit the entries of A.</p>
          <MatrixInputs matrix={matrix} onEdit={edit} />
          <footer>
            <button onClick={randomize}>
              <Shuffle />
              Random 2x2
            </button>
            <button
              onClick={() =>
                act(() => {
                  setMatrix(initial);
                  setStep(0);
                })
              }
            >
              Use example
            </button>
          </footer>
        </article>
        <article>
          <h3>2. DETERMINANT & INVERTIBILITY</h3>
          <code>det(A) = ad - bc</code>
          <strong>= {determinant}</strong>
          <p className={invertible ? "valid" : "invalid"}>
            {invertible
              ? "✓ A is invertible (det(A) != 0)"
              : "× A is singular (det(A) = 0)"}
          </p>
        </article>
        <article>
          <h3>FORMULA</h3>
          <p>For A=[a b; c d] with ad-bc != 0</p>
          <code>
            A<sup>-1</sup> = 1/(ad-bc) [d -b; -c a]
          </code>
          {inv ? (
            <strong>
              [{inv[0].join(" ")}; {inv[1].join(" ")}]
            </strong>
          ) : (
            <strong>Inverse undefined</strong>
          )}
        </article>
      </section>
      <section className="mat354-gauss">
        <header>
          <h3>
            3. GAUSS-JORDAN ELIMINATION: TRANSFORM [A | I] INTO [I | A
            <sup>-1</sup>]
          </h3>
          <label>
            Show hints{" "}
            <input
              aria-label="Show hints"
              type="checkbox"
              checked={hints}
              onChange={() => act(() => setHints((v) => !v))}
            />
          </label>
        </header>
        {invertible ? (
          <div>
            <ol>
              {states.map(([name], i) => (
                <li
                  className={
                    i === safeStep ? "active" : i < safeStep ? "done" : ""
                  }
                  key={name}
                >
                  <b>{i + 1}</b>
                  {hints || i <= safeStep ? name : `Step ${i + 1}`}
                </li>
              ))}
            </ol>
            <article>
              <h4>AUGMENTED MATRIX</h4>
              <Augmented matrix={aug} />
              <b>
                STEP {safeStep + 1} OF {states.length}
              </b>
              <footer>
                <button
                  disabled={!safeStep}
                  onClick={() => act(() => setStep((s) => Math.max(0, s - 1)))}
                >
                  Previous
                </button>
                <button
                  disabled={safeStep === states.length - 1}
                  onClick={() =>
                    act(() =>
                      setStep((s) => Math.min(states.length - 1, s + 1)),
                    )
                  }
                >
                  Next step
                </button>
                <button onClick={() => act(() => setPlaying((v) => !v))}>
                  <Play />
                  {playing ? "Pause" : "Auto play"}
                </button>
              </footer>
            </article>
            <aside>
              <h4>RESULT SO FAR</h4>
              <code>{states[safeStep][0]}</code>
              <p>
                [{aug[0].join(" ")}; {aug[1].join(" ")}]
              </p>
            </aside>
          </div>
        ) : (
          <p className="mat354-singular">
            Gauss-Jordan cannot produce an inverse because the left side has no
            second pivot.
          </p>
        )}
      </section>
      <section className="mat354-geometry">
        <h3>4. GEOMETRIC VIEW: TRANSFORMATION AND ITS INVERSE</h3>
        <div>
          <Shape
            title="Original shape"
            points={[
              [0, 0],
              [1, 0],
              [1, 1],
              [0, 1],
            ]}
          />
          <b>Apply A →</b>
          <Shape title="After applying A" points={transformed} />
          <b>Apply A^-1 →</b>
          <Shape
            title="After applying A^-1"
            points={
              invertible
                ? [
                    [0, 0],
                    [1, 0],
                    [1, 1],
                    [0, 1],
                  ]
                : transformed
            }
          />
        </div>
        <p>
          Applying A changes the shape. Applying A<sup>-1</sup>{" "}
          {invertible
            ? "restores the original."
            : "is unavailable for a singular matrix."}
        </p>
      </section>
      <section className="mat354-bottom">
        <article>
          <h3>5. WORKED EXAMPLE</h3>
          <p>
            Let A=[{matrix[0].join(" ")}; {matrix[1].join(" ")}]. Find A
            <sup>-1</sup>.
          </p>
          <code>det(A) = {determinant}</code>
          <code>
            A<sup>-1</sup> = 1/{determinant} [{matrix[1][1]} {-matrix[0][1]};{" "}
            {-matrix[1][0]} {matrix[0][0]}]
          </code>
          <strong>
            {inv
              ? `A^-1 = [${inv[0].join(" ")}; ${inv[1].join(" ")}]`
              : "No inverse exists."}
          </strong>
        </article>
        <article>
          <h3>6. CHALLENGE</h3>
          <p>
            Undo the transformation. Given y = Ax where A=[{matrix[0].join(" ")}
            ; {matrix[1].join(" ")}] and y=[3,2]. Find x=A<sup>-1</sup>y.
          </p>
          <div>
            {answer.map((v, i) => (
              <input
                aria-label={`Inverse challenge x${i + 1}`}
                key={i}
                type="number"
                value={v}
                disabled={!invertible}
                onChange={(e) =>
                  act(() => {
                    setAnswer((a) =>
                      a.map((x, j) => (j === i ? e.target.value : x)),
                    );
                    setCheck("");
                  })
                }
              />
            ))}
          </div>
          <button
            disabled={!invertible}
            onClick={() =>
              act(() =>
                setCheck(
                  answer.every((v, i) => Number(v) === expected[i])
                    ? "correct"
                    : "incorrect",
                ),
              )
            }
          >
            Check answer
          </button>
          <button onClick={() => act(() => setSolution((v) => !v))}>
            <Eye />
            Show solution
          </button>
          <output>
            {solution && invertible
              ? `x = [${expected.join(", ")}]`
              : check === "correct"
                ? "Correct: A^-1 y recovers x."
                : check === "incorrect"
                  ? "Check the inverse-vector product."
                  : ""}
          </output>
        </article>
      </section>
    </section>
  );
}
const rand = () => Math.floor(Math.random() * 7) - 3;
function MatrixInputs({
  matrix,
  onEdit,
}: {
  matrix: Matrix;
  onEdit: (r: number, c: number, v: number) => void;
}) {
  return (
    <div className="mat354-matrix-inputs">
      {matrix.flatMap((row, r) =>
        row.map((v, c) => (
          <input
            aria-label={`Inverse matrix row ${r + 1} column ${c + 1}`}
            key={`${r}-${c}`}
            type="number"
            value={v}
            onChange={(e) => onEdit(r, c, Number(e.target.value))}
          />
        )),
      )}
    </div>
  );
}
function Augmented({ matrix }: { matrix: Aug }) {
  return (
    <div className="mat354-augmented">
      {matrix.flatMap((row, r) =>
        row.map((v, c) => (
          <b className={c > 1 ? "right" : ""} key={`${r}-${c}`}>
            {v}
          </b>
        )),
      )}
    </div>
  );
}
function Shape({ title, points }: { title: string; points: number[][] }) {
  const map = ([x, y]: number[]) => `${65 + x * 42},${105 - y * 42}`;
  return (
    <article>
      <h4>{title}</h4>
      <svg viewBox="0 0 150 145" role="img" aria-label={title}>
        <path d="M20 105H135M65 130V15" />
        <polygon points={points.map(map).join(" ")} />
        {points.map((p, i) => {
          const [x, y] = map(p).split(",").map(Number);
          return <circle key={i} cx={x} cy={y} r="3" />;
        })}
      </svg>
    </article>
  );
}
