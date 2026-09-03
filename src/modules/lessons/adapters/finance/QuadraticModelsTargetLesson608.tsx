import { Check, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./QuadraticModelsTargetLesson608.css";

const round = (value: number, digits = 2) => Number(value.toFixed(digits));
export default function QuadraticModelsTargetLesson608({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [a, setA] = useState(-2),
    [b, setB] = useState(4),
    [c, setC] = useState(-1),
    [mode, setMode] = useState<"coefficients" | "points">("coefficients"),
    [tab, setTab] = useState("Interact"),
    [showAxis, setShowAxis] = useState(true),
    [showVertex, setShowVertex] = useState(true),
    [showRoots, setShowRoots] = useState(true),
    [showPoints, setShowPoints] = useState(true),
    [drag, setDrag] = useState<"vertex" | "a" | "c" | null>(null),
    [help, setHelp] = useState(false),
    [heightAnswer, setHeightAnswer] = useState(""),
    [timeAnswer, setTimeAnswer] = useState(""),
    [graded, setGraded] = useState<boolean | null>(null),
    [actions, setActions] = useState(0);
  const reset = () => {
    setA(-2);
    setB(4);
    setC(-1);
    setMode("coefficients");
    setTab("Interact");
    setShowAxis(true);
    setShowVertex(true);
    setShowRoots(true);
    setShowPoints(true);
    setDrag(null);
    setHelp(false);
    setHeightAnswer("");
    setTimeAnswer("");
    setGraded(null);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (update: () => void) => {
    update();
    setActions((value) => value + 1);
    onInteraction();
  };
  const model = useMemo(() => {
    const h = -b / (2 * a),
      k = a * h * h + b * h + c,
      disc = b * b - 4 * a * c,
      roots =
        disc >= 0
          ? [
              (-b - Math.sqrt(disc)) / (2 * a),
              (-b + Math.sqrt(disc)) / (2 * a),
            ].sort((x, y) => x - y)
          : [];
    return { h, k, disc, roots, value: (x: number) => a * x * x + b * x + c };
  }, [a, b, c]);
  const px = (x: number) => 285 + (x / 7) * 250,
    py = (y: number) => 175 - (y / 6) * 145,
    path = Array.from({ length: 121 }, (_, index) => -5 + (index / 120) * 10)
      .map((x, index) => `${index ? "L" : "M"}${px(x)},${py(model.value(x))}`)
      .join(" ");
  const move = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!drag) return;
    const rect = event.currentTarget.getBoundingClientRect(),
      x = ((event.clientX - rect.left) / rect.width) * 14 - 7,
      y = 6 - ((event.clientY - rect.top) / rect.height) * 12;
    act(() => {
      if (drag === "vertex") {
        const h = round(x, 1),
          k = round(y, 1);
        setB(round(-2 * a * h, 0.1));
        setC(round(k + a * h * h, 0.1));
      } else {
        const fixedX = drag === "a" ? -1 : 3;
        setC(round(y - a * fixedX * fixedX - b * fixedX, 0.1));
      }
    });
  };
  const check = () =>
    act(() =>
      setGraded(
        Math.abs(Number(heightAnswer) - 25) < 0.01 &&
          Math.abs(Number(timeAnswer) - 4.24) < 0.02,
      ),
    );
  const equation = `y = ${a}x² ${b >= 0 ? "+" : "-"} ${Math.abs(b)}x ${c >= 0 ? "+" : "-"} ${Math.abs(c)}`;
  return (
    <section
      className="qm608-page"
      data-testid="finance-mockup-0665"
      data-object-model="dedicated-draggable-coefficient-vertex-roots-quadratic-model"
      data-a={a}
      data-b={b}
      data-c={c}
      data-vertex-x={model.h.toFixed(2)}
      data-vertex-y={model.k.toFixed(2)}
      data-roots={model.roots.map((root) => root.toFixed(2)).join(",")}
      data-mode={mode}
      data-dragging={drag ?? ""}
      data-graded={graded === null ? "" : graded}
      data-actions={actions}
    >
      <header className="qm608-hero">
        <span>DISCRETE AND APPLIED MATHEMATICS</span>
        <h1>608. Quadratic Models</h1>
        <p>
          <b>Objective:</b> Build and interpret quadratic models of the form y =
          ax² + bx + c.
        </p>
        <dl>
          <b>Level: Intermediate-Advanced</b>
          <b>Topic: Financial Mathematics &amp; Modelling</b>
          <b>Lab Type: Modelling Lab</b>
          <b>Time: 10-12 min</b>
        </dl>
      </header>
      <nav className="qm608-tabs">
        {["Interact", "Learn", "Worked Example", "Formula", "Practice"].map(
          (name) => (
            <button
              key={name}
              className={tab === name ? "active" : ""}
              onClick={() => act(() => setTab(name))}
            >
              {name}
            </button>
          ),
        )}
      </nav>
      {tab !== "Interact" && (
        <p className="qm608-note">
          <b>{tab}:</b> The coefficients determine a parabola's shape and
          location.
        </p>
      )}
      <section className="qm608-sequence">
        <b>LEARNING SEQUENCE</b>
        <div>
          {[
            ["Observe", "See the model"],
            ["Manipulate", "Drag & explore"],
            ["Notice Pattern", "Look for relationships"],
            ["Understand Rule", "Generalize"],
            ["Try Independently", "Answer a challenge"],
          ].map(([title, text], index) => (
            <article key={title}>
              <b>
                {index + 1} {title}
              </b>
              <small>{text}</small>
            </article>
          ))}
        </div>
      </section>
      <section className="qm608-lab">
        <header>
          <div>
            <h2>Quadratic Model Lab</h2>
            <p>
              Drag the three points or adjust the coefficients to explore y =
              ax² + bx + c.
            </p>
          </div>
          <button onClick={() => act(reset)}>
            <RotateCcw /> Reset
          </button>
          <button onClick={() => act(() => setHelp((value) => !value))}>
            How to use
          </button>
        </header>
        {help && (
          <p className="qm608-help">
            Drag the colored points or use the model controls. Every readout
            updates immediately.
          </p>
        )}
        <div>
          <main>
            <svg
              viewBox="0 0 570 350"
              aria-label="Interactive quadratic graph"
              onPointerMove={move}
              onPointerUp={() => setDrag(null)}
            >
              <text className="formula" x="18" y="28">
                {equation}
              </text>
              {[-6, -4, -2, 0, 2, 4, 6].map((x) => (
                <line
                  className="grid"
                  key={`x${x}`}
                  x1={px(x)}
                  x2={px(x)}
                  y1="35"
                  y2="320"
                />
              ))}
              {[-6, -4, -2, 0, 2, 4, 6].map((y) => (
                <line
                  className="grid"
                  key={`y${y}`}
                  x1="35"
                  x2="535"
                  y1={py(y)}
                  y2={py(y)}
                />
              ))}
              <line x1="35" x2="535" y1={py(0)} y2={py(0)} />
              <line x1={px(0)} x2={px(0)} y1="35" y2="320" />
              {showAxis && (
                <line
                  className="axis"
                  x1={px(model.h)}
                  x2={px(model.h)}
                  y1="35"
                  y2="320"
                />
              )}
              <path d={path} />
              {showRoots &&
                model.roots.map((root, index) => (
                  <g key={`${root}-${index}`}>
                    <circle className="root" cx={px(root)} cy={py(0)} r="7" />
                    <text x={px(root) - 24} y={py(0) - 12}>
                      ({root.toFixed(2)}, 0)
                    </text>
                  </g>
                ))}
              {showVertex && (
                <g>
                  <circle
                    className="vertex"
                    cx={px(model.h)}
                    cy={py(model.k)}
                    r="7"
                    onPointerDown={() => setDrag("vertex")}
                  />
                  <text x={px(model.h) + 8} y={py(model.k) - 8}>
                    Vertex ({round(model.h)}, {round(model.k)})
                  </text>
                </g>
              )}
              {showPoints && (
                <>
                  <circle
                    className="point-a"
                    cx={px(-1)}
                    cy={py(model.value(-1))}
                    r="7"
                    onPointerDown={() => setDrag("a")}
                  />
                  <text x={px(-1) - 55} y={py(model.value(-1)) - 9}>
                    A (-1, {round(model.value(-1))})
                  </text>
                  <circle
                    className="point-c"
                    cx={px(3)}
                    cy={py(model.value(3))}
                    r="7"
                    onPointerDown={() => setDrag("c")}
                  />
                  <text x={px(3) + 10} y={py(model.value(3)) - 9}>
                    C (3, {round(model.value(3))})
                  </text>
                </>
              )}
            </svg>
            <footer>Drag points A, Vertex, or C to change the model.</footer>
          </main>
          <aside>
            <section className="qm608-controls">
              <nav>
                <button
                  className={mode === "coefficients" ? "active" : ""}
                  onClick={() => act(() => setMode("coefficients"))}
                >
                  Coefficients
                </button>
                <button
                  className={mode === "points" ? "active" : ""}
                  onClick={() => act(() => setMode("points"))}
                >
                  Points
                </button>
              </nav>
              {mode === "coefficients" ? (
                <>
                  <Control
                    label="a"
                    value={a}
                    onChange={(value) => act(() => setA(value || -0.1))}
                  />
                  <Control
                    label="b"
                    value={b}
                    onChange={(value) => act(() => setB(value))}
                  />
                  <Control
                    label="c"
                    value={c}
                    onChange={(value) => act(() => setC(value))}
                  />
                </>
              ) : (
                <>
                  <Control
                    label="Vertex x"
                    value={model.h}
                    onChange={(value) =>
                      act(() => {
                        setB(round(-2 * a * value, 0.1));
                        setC(round(model.k + a * value * value, 0.1));
                      })
                    }
                  />
                  <Control
                    label="Vertex y"
                    value={model.k}
                    onChange={(value) =>
                      act(() =>
                        setC(
                          round(
                            value - a * model.h * model.h - b * model.h,
                            0.1,
                          ),
                        ),
                      )
                    }
                  />
                  <Control
                    label="Point C y"
                    value={model.value(3)}
                    onChange={(value) =>
                      act(() => setC(round(value - a * 9 - b * 3, 0.1)))
                    }
                  />
                </>
              )}
              <strong>{equation}</strong>
            </section>
            <section className="qm608-readouts">
              <h3>KEY READOUTS</h3>
              <p>
                Vertex ({a < 0 ? "maximum" : "minimum"})
                <b>
                  ({round(model.h)}, {round(model.k)})
                </b>
              </p>
              <p>
                {a < 0 ? "Maximum" : "Minimum"} value<b>{round(model.k)}</b>
              </p>
              <p>
                Axis of symmetry<b>x = {round(model.h)}</b>
              </p>
              <p>
                Roots
                <b>
                  {model.roots.length
                    ? model.roots.map((root) => round(root)).join(", ")
                    : "No real roots"}
                </b>
              </p>
              <p>
                y-intercept<b>(0, {c})</b>
              </p>
              <p>
                Concavity<b>Opens {a < 0 ? "downward" : "upward"}</b>
              </p>
            </section>
            <section className="qm608-prediction">
              <b>PREDICTION</b>
              <p>
                Since a {a < 0 ? "<" : ">"} 0, the model has a{" "}
                {a < 0 ? "maximum" : "minimum"} value of {round(model.k)} at x=
                {round(model.h)}.
              </p>
            </section>
          </aside>
        </div>
      </section>
      <section className="qm608-strip">
        <article>
          <h3>TABLE (SAMPLE)</h3>
          <table>
            <tbody>
              <tr>
                <th>x</th>
                {[-1, 0, 1, 2, 3].map((x) => (
                  <td key={x}>{x}</td>
                ))}
              </tr>
              <tr>
                <th>y</th>
                {[-1, 0, 1, 2, 3].map((x) => (
                  <td
                    key={x}
                    className={x === Math.round(model.h) ? "active" : ""}
                  >
                    {round(model.value(x))}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </article>
        <article>
          <h3>TOGGLES</h3>
          {[
            ["Show axis of symmetry", showAxis, setShowAxis],
            ["Show vertex", showVertex, setShowVertex],
            ["Show roots", showRoots, setShowRoots],
            ["Show points", showPoints, setShowPoints],
          ].map(([label, value, setter]) => (
            <label key={String(label)}>
              <input
                aria-label={String(label)}
                type="checkbox"
                checked={Boolean(value)}
                onChange={(event) =>
                  act(() => {
                    (setter as React.Dispatch<React.SetStateAction<boolean>>)(
                      event.target.checked,
                    );
                  })
                }
              />
              {String(label)}
            </label>
          ))}
        </article>
      </section>
      <section className="qm608-theory">
        <article>
          <h2>WORKED EXAMPLE</h2>
          <p>Find the maximum value of {equation}.</p>
          <p>
            <b>Step 1:</b> Vertex x-value = -b/(2a) = {round(model.h)}
          </p>
          <p>
            <b>Step 2:</b> Substitute x={round(model.h)} to get y=
            {round(model.k)}.
          </p>
          <aside>
            {a < 0 ? "Maximum" : "Minimum"} value is {round(model.k)} at x=
            {round(model.h)}. <Check />
          </aside>
        </article>
        <article>
          <h2>KEY RULE</h2>
          <p>For y=ax²+bx+c:</p>
          <p>Axis of symmetry: x=-b/(2a)</p>
          <p>Vertex: (-b/(2a), f(-b/(2a)))</p>
          <p>
            If a&gt;0, the model has a minimum.
            <br />
            If a&lt;0, the model has a maximum.
          </p>
        </article>
        <article>
          <h2>MISCONCEPTION CHECK</h2>
          <p>
            <b>Misconception:</b> The vertex is always at (0,c).
          </p>
          <p>
            <b>Not always!</b> The vertex is at x=-b/(2a), which equals 0 only
            when b=0.
          </p>
        </article>
      </section>
      <section className="qm608-challenge">
        <div>
          <h2>YOUR CHALLENGE</h2>
          <p>
            A projectile's height is h(t)=-5t²+20t+5, where t is time in
            seconds.
          </p>
          <p>
            <b>a)</b> Find the maximum height and time when it occurs.
            <br />
            <b>b)</b> When does the projectile hit the ground?
          </p>
        </div>
        <label>
          Maximum height (m)
          <input
            aria-label="Maximum projectile height"
            value={heightAnswer}
            onChange={(event) =>
              act(() => {
                setHeightAnswer(event.target.value);
                setGraded(null);
              })
            }
          />
        </label>
        <label>
          Ground time (s)
          <input
            aria-label="Projectile ground time"
            value={timeAnswer}
            onChange={(event) =>
              act(() => {
                setTimeAnswer(event.target.value);
                setGraded(null);
              })
            }
          />
        </label>
        <button onClick={check}>Check Answer</button>
        <output className={graded === null ? "" : graded ? "correct" : "wrong"}>
          {graded === null
            ? ""
            : graded
              ? "Correct: maximum 25 m at 2 s; ground at 4.24 s."
              : "Use the vertex and positive quadratic root."}
        </output>
      </section>
      <nav className="qm608-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/607-linear-models">
          &larr;{" "}
          <span>
            Previous Lesson<b>Linear Models</b>
          </span>
        </a>
        <a href="/lessons/discrete-and-applied-mathematics/609-exponential-and-logistic-models">
          <span>
            Next Lesson<b>Exponential and Logistic Models</b>
          </span>{" "}
          &rarr;
        </a>
      </nav>
    </section>
  );
}
function Control({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="qm608-control">
      <b>{label}</b>
      <span>
        -10
        <input
          aria-label={`${label} slider`}
          type="range"
          min="-10"
          max="10"
          step="0.1"
          value={value}
          onChange={(event) => onChange(+event.target.value)}
        />
        10
        <input
          aria-label={label}
          type="number"
          min="-10"
          max="10"
          step="0.1"
          value={round(value, 1)}
          onChange={(event) => onChange(+event.target.value)}
        />
      </span>
    </label>
  );
}
