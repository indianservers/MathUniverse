import { RotateCcw, Send } from "lucide-react";
import { useState } from "react";
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./DifferentiabilityContinuityTargetLesson10171.css";

type Case = "smooth" | "corner" | "step";
const info = {
  smooth: {
    name: "Smooth function",
    formula: "f(x)=x²",
    continuous: true,
    differentiable: true,
    left: 0,
    right: 0,
  },
  corner: {
    name: "Corner function",
    formula: "f(x)=|x|",
    continuous: true,
    differentiable: false,
    left: -1,
    right: 1,
  },
  step: {
    name: "Discontinuous function",
    formula: "f(x)=-1 (x≤0), 1 (x>0)",
    continuous: false,
    differentiable: false,
    left: NaN,
    right: NaN,
  },
};
const fmt = (n: number) =>
  Number.isFinite(n) ? `${n >= 0 ? "+" : ""}${n.toFixed(2)}` : "DNE";
export default function DifferentiabilityContinuityTargetLesson10171({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [active, setActive] = useState<"main" | "compare" | "practice">("main"),
    [kind, setKind] = useState<Case>("corner");
  const [hLeft, setHLeft] = useState(0.25),
    [hRight, setHRight] = useState(0.25),
    [showLeft, setShowLeft] = useState(true),
    [showRight, setShowRight] = useState(true),
    [tangent, setTangent] = useState(false);
  const [answers, setAnswers] = useState(["", "", ""]),
    [feedback, setFeedback] = useState([false, false, false]);
  const model = info[kind];
  const slopes =
    kind === "smooth"
      ? { left: -hLeft, right: hRight }
      : kind === "corner"
        ? { left: -1, right: 1 }
        : { left: NaN, right: NaN };
  const functionY = (x: number) =>
    kind === "smooth"
      ? x * x
      : kind === "corner"
        ? Math.abs(x)
        : x <= 0
          ? -1
          : 1;
  const mapX = (x: number) => 270 + x * 62,
    mapY = (y: number) => 245 - y * 58;
  const curve =
    kind === "smooth"
      ? "M146 13 Q270 477 394 13"
      : kind === "corner"
        ? "M84 71 L270 245 L456 71"
        : "M84 303 H270 M270 187 H456";
  const moveH = (side: "left" | "right", n: number) =>
    side === "left"
      ? setHLeft(Math.max(0.02, Math.min(1, Math.abs(n))))
      : setHRight(Math.max(0.02, Math.min(1, Math.abs(n))));
  const keyProbe =
    (side: "left" | "right") => (e: KeyboardEvent<SVGCircleElement>) => {
      const n = side === "left" ? hLeft : hRight;
      if (e.key === "ArrowLeft" || e.key === "ArrowDown") moveH(side, n + 0.05);
      if (e.key === "ArrowRight" || e.key === "ArrowUp") moveH(side, n - 0.05);
    };
  const dragProbe =
    (side: "left" | "right") => (e: ReactPointerEvent<SVGCircleElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      const svg = e.currentTarget.ownerSVGElement!;
      const move = (ev: PointerEvent) => {
        const x =
          ((ev.clientX - svg.getBoundingClientRect().left) /
            svg.getBoundingClientRect().width) *
            8 -
          4;
        moveH(side, Math.abs(x));
      };
      const stop = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", stop);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", stop);
    };
  const reset = () => {
    setKind("corner");
    setHLeft(0.25);
    setHRight(0.25);
    setShowLeft(true);
    setShowRight(true);
    setTangent(false);
    setAnswers(["", "", ""]);
    setFeedback([false, false, false]);
    setActive("main");
  };
  const submit = (i: number) => {
    const f = [...feedback];
    f[i] = true;
    setFeedback(f);
  };
  return (
    <main
      className="dc10171-page"
      data-testid="school-mockup-0845"
      data-object-model="dedicated-one-sided-derivative-comparison-engine"
      data-case={kind}
      data-continuous={String(model.continuous)}
      data-differentiable={String(model.differentiable)}
      data-left-slope={fmt(slopes.left)}
      data-right-slope={fmt(slopes.right)}
    >
      <header>
        <small>CLASS 12 · FORMAL CALCULUS</small>
        <h1>Differentiability versus Continuity</h1>
        <p>
          Compare function values, limits, and one-sided derivative slopes to
          see why differentiability implies continuity, but continuity need not
          imply differentiability.
        </p>
        <div>
          <span>18 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>graph</span>
        </div>
      </header>
      <nav className="dc-tabs">
        {[
          ["main", "▣ The Main Case"],
          ["compare", "⚖ Compare"],
          ["practice", "✎ More Practice"],
        ].map(([id, label]) => (
          <button
            className={active === id ? "active" : ""}
            onClick={() => {
              setActive(id as typeof active);
              document
                .getElementById(`dc-${id}`)
                ?.scrollIntoView({ block: "nearest" });
            }}
            key={id}
          >
            {label}
          </button>
        ))}
      </nav>
      <section className="dc-main" id="dc-main">
        <aside>
          <article>
            <h3>THE MAIN CASE: {model.formula}</h3>
            <p>
              {model.continuous ? "Continuous" : "Not continuous"} at 0,{" "}
              {model.differentiable
                ? "and differentiable"
                : "but not differentiable"}{" "}
              at 0.
            </p>
            <div className="dc-function">
              <span>
                <b>Function</b>
                <strong>{model.formula}</strong>
              </span>
              <span>
                <b>Point</b>
                <strong>x₀=0</strong>
              </span>
            </div>
            <div className="dc-derivatives">
              <section>
                <b>Left derivative</b>
                <strong>{fmt(slopes.left)}</strong>
              </section>
              <section>
                <b>Right derivative</b>
                <strong>{fmt(slopes.right)}</strong>
              </section>
            </div>
            <p>
              Since left derivative {model.differentiable ? "=" : "≠"} right
              derivative, f is {model.differentiable ? "" : "not "}
              differentiable at x=0.
            </p>
          </article>
          <article className="dc-corner">
            <h3>⌕ CORNER ZOOM</h3>
            <p>Zoom near (0,0) to see how slopes change abruptly.</p>
            <svg viewBox="0 0 210 140">
              <path d="M15 115H200M105 10V130" stroke="#334155" />
              <path
                d={
                  kind === "smooth"
                    ? "M35 115 Q105 75 175 115"
                    : kind === "corner"
                      ? "M35 35L105 115L175 35"
                      : "M35 100H105M105 50H175"
                }
                fill="none"
                stroke="#078bc5"
                strokeWidth="2"
              />
              <circle cx="105" cy="115" r="5" fill="#f2a22b" />
            </svg>
          </article>
        </aside>
        <article className="dc-graph">
          <div className="dc-gtitle">
            <h3>SECANT LINES APPROACHING x=0</h3>
            <label>
              Show{" "}
              <input
                type="checkbox"
                checked={showLeft}
                onChange={(e) => setShowLeft(e.target.checked)}
              />{" "}
              Secant (left)
            </label>
            <label>
              <input
                type="checkbox"
                checked={showRight}
                onChange={(e) => setShowRight(e.target.checked)}
              />{" "}
              Secant (right)
            </label>
            <label>
              <input
                type="checkbox"
                checked={tangent}
                onChange={(e) => setTangent(e.target.checked)}
              />{" "}
              Tangent
            </label>
          </div>
          <div className="dc-chart">
            <svg viewBox="0 0 540 430" aria-label="One-sided derivative graph">
              <defs>
                <pattern
                  id="dcgrid"
                  width="31"
                  height="29"
                  patternUnits="userSpaceOnUse"
                >
                  <path d="M31 0H0V29" fill="none" stroke="#dfe8ec" />
                </pattern>
              </defs>
              <rect width="540" height="430" fill="url(#dcgrid)" />
              <path d="M15 245H525M270 15V415" stroke="#273548" />
              <path d={curve} fill="none" stroke="#078ac6" strokeWidth="3" />
              {showLeft && Number.isFinite(slopes.left) && (
                <path
                  d={`M${mapX(-hLeft) - 100} ${mapY(functionY(-hLeft)) - slopes.left * -100} L${mapX(-hLeft) + 140} ${mapY(functionY(-hLeft)) - slopes.left * 140}`}
                  stroke="#ed343f"
                  strokeWidth="2"
                  strokeDasharray="6"
                />
              )}
              {showRight && Number.isFinite(slopes.right) && (
                <path
                  d={`M${mapX(hRight) - 120} ${mapY(functionY(hRight)) + slopes.right * 120} L${mapX(hRight) + 110} ${mapY(functionY(hRight)) - slopes.right * 110}`}
                  stroke="#48a22a"
                  strokeWidth="2"
                  strokeDasharray="6"
                />
              )}
              {tangent && model.differentiable && (
                <path d="M100 245H440" stroke="#8b48df" strokeWidth="2" />
              )}
              <circle
                role="slider"
                aria-label="Left secant probe"
                tabIndex={0}
                onPointerDown={dragProbe("left")}
                onKeyDown={keyProbe("left")}
                cx={mapX(-hLeft)}
                cy={mapY(functionY(-hLeft))}
                r="7"
                fill="#ed3b42"
              />
              <circle
                role="slider"
                aria-label="Right secant probe"
                tabIndex={0}
                onPointerDown={dragProbe("right")}
                onKeyDown={keyProbe("right")}
                cx={mapX(hRight)}
                cy={mapY(functionY(hRight))}
                r="7"
                fill="#25a178"
              />
            </svg>
            <div className="dc-sliders">
              <label>
                Step h (left)
                <input
                  aria-label="Left secant step"
                  type="range"
                  min=".02"
                  max="1"
                  step=".01"
                  value={hLeft}
                  onInput={(e) => moveH("left", Number(e.currentTarget.value))}
                />
                <b>h&lt;0: {hLeft.toFixed(2)}</b>
              </label>
              <label>
                Step h (right)
                <input
                  aria-label="Right secant step"
                  type="range"
                  min=".02"
                  max="1"
                  step=".01"
                  value={hRight}
                  onInput={(e) => moveH("right", Number(e.currentTarget.value))}
                />
                <b>h&gt;0: {hRight.toFixed(2)}</b>
              </label>
              <button onClick={reset}>
                <RotateCcw /> Reset
              </button>
            </div>
          </div>
          <div className="dc-slope-cards">
            <section>
              <b>Left slope</b>
              <strong>{fmt(slopes.left)}</strong>
            </section>
            <section>
              <b>Right slope</b>
              <strong>{fmt(slopes.right)}</strong>
            </section>
            <section>
              <b>Conclusion</b>
              <strong>
                {model.differentiable ? "Differentiable" : "Not differentiable"}
              </strong>
            </section>
          </div>
        </article>
      </section>
      <section className="dc-checks">
        <article>
          <h3>CONTINUITY CHECKLIST AT x=0</h3>
          {[
            [true, "f(0) is defined."],
            [model.continuous, "Left limit exists."],
            [model.continuous, "Right limit exists."],
            [model.continuous, "lim f(x)=f(0)."],
          ].map((r, i) => (
            <p className={r[0] ? "yes" : "no"} key={i}>
              {r[0] ? "✓" : "✕"} {i + 1}. {r[1]}
            </p>
          ))}
          <strong>
            {model.continuous
              ? "Therefore f is continuous at x=0."
              : "Therefore f is not continuous at x=0."}
          </strong>
        </article>
        <article>
          <h3>DIFFERENTIABILITY CHECKLIST AT x=0</h3>
          {[
            [model.continuous, "f is continuous at 0."],
            [Number.isFinite(slopes.left), "Left derivative exists."],
            [Number.isFinite(slopes.right), "Right derivative exists."],
            [model.differentiable, "Left derivative = Right derivative?"],
          ].map((r, i) => (
            <p className={r[0] ? "yes" : "no"} key={i}>
              {r[0] ? "✓" : "✕"} {i + 1}. {r[1]}
            </p>
          ))}
          <strong>
            {model.differentiable
              ? "Therefore f is differentiable at x=0."
              : "Therefore f is not differentiable at x=0."}
          </strong>
        </article>
        <article>
          <h3>IMPLICATION DIAGRAM</h3>
          <div>Differentiable at a</div>
          <b>↓ Always true</b>
          <div>Continuous at a</div>
          <b>↛ Not converse</b>
        </article>
      </section>
      <section className="dc-compare" id="dc-compare">
        {(["smooth", "corner", "step"] as Case[]).map((c, i) => {
          const m = info[c];
          return (
            <article className={kind === c ? "selected" : ""} key={c}>
              <button onClick={() => setKind(c)}>
                {i + 1} &nbsp; {m.name}: {m.formula}
              </button>
              <svg viewBox="0 0 240 130">
                <path d="M15 105H225M120 10V120" stroke="#334155" />
                <path
                  d={
                    c === "smooth"
                      ? "M35 25Q120 185 205 25"
                      : c === "corner"
                        ? "M35 25L120 105L205 25"
                        : "M35 90H120M120 40H205"
                  }
                  fill="none"
                  stroke="#078ac6"
                  strokeWidth="2"
                />
                <circle
                  cx="120"
                  cy={c === "step" ? 90 : 105}
                  r="5"
                  fill="#f29a22"
                />
              </svg>
              <p className={m.continuous ? "yes" : "no"}>
                {m.continuous ? "✓ Continuous" : "✕ Not continuous"}
              </p>
              <p className={m.differentiable ? "yes" : "no"}>
                {m.differentiable ? "✓ Differentiable" : "✕ Not differentiable"}
              </p>
            </article>
          );
        })}
      </section>
      <section className="dc-notes">
        <article>
          <h3>WORKED EXAMPLE</h3>
          <p>For f(x)=|x|, f(0)=0 and both one-sided function limits are 0.</p>
          <p>The left derivative is -1 while the right derivative is +1.</p>
          <strong>Continuous but not differentiable at 0.</strong>
        </article>
        <article>
          <h3>COMMON MISCONCEPTION</h3>
          <b>“If a function has a corner, it might still be differentiable.”</b>
          <p>Two one-sided slopes must be equal. A corner means they differ.</p>
        </article>
        <article>
          <h3>PRACTICE TABLE</h3>
          <table>
            <thead>
              <tr>
                <th>Function</th>
                <th>Continuous?</th>
                <th>Differentiable?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>x²</td>
                <td>Yes</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>|x|</td>
                <td>Yes</td>
                <td>No</td>
              </tr>
              <tr>
                <td>step</td>
                <td>No</td>
                <td>No</td>
              </tr>
            </tbody>
          </table>
        </article>
      </section>
      <section className="dc-practice" id="dc-practice">
        {[
          "What do the secant slopes do as h approaches 0?",
          "Is sqrt(x) differentiable at x=0?",
          "Is the shown piecewise g differentiable at x=0?",
        ].map((q, i) => (
          <article key={q}>
            <h3>
              {i + 1} &nbsp; {q}
            </h3>
            {i === 0 ? (
              <textarea
                aria-label="Slope observation"
                value={answers[i]}
                onChange={(e) => {
                  const a = [...answers];
                  a[i] = e.target.value;
                  setAnswers(a);
                }}
              />
            ) : (
              <div>
                {["Yes", "No", "I'm not sure"].map((x) => (
                  <label key={x}>
                    <input
                      type="radio"
                      name={`q${i}`}
                      value={x}
                      checked={answers[i] === x}
                      onChange={(e) => {
                        const a = [...answers];
                        a[i] = e.target.value;
                        setAnswers(a);
                      }}
                    />{" "}
                    {x}
                  </label>
                ))}
              </div>
            )}
            <button onClick={() => submit(i)}>
              <Send /> Submit
            </button>
            {feedback[i] && (
              <b
                className={
                  (i === 0 ? answers[i].length > 3 : answers[i] === "No")
                    ? "yes"
                    : "no"
                }
              >
                {i === 0
                  ? answers[i].length > 3
                    ? "✓ Observation recorded"
                    : "Describe both sides."
                  : answers[i] === "No"
                    ? "✓ Correct"
                    : "✕ Recheck the one-sided slopes."}
              </b>
            )}
          </article>
        ))}
      </section>
      <nav className="dc-adjacent">
        <button>← Infinite Discontinuity</button>
        <button>Rolle's Theorem →</button>
      </nav>
      <footer>
        <b>⌁ Math Universe</b>
        <p>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </p>
        <small>
          © 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.
        </small>
      </footer>
    </main>
  );
}
