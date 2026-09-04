import { CheckCircle2, Lightbulb, RotateCcw, XCircle } from "lucide-react";
import { useState } from "react";
import type { DragEvent } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./IntegrationByPartsTargetLesson10181.css";

type Example = {
  integral: string;
  u: string;
  dv: string;
  du: string;
  v: string;
  remaining: string;
  answer: string;
};

const examples: Example[] = [
  {
    integral: "∫ x eˣ dx",
    u: "x",
    dv: "eˣ dx",
    du: "dx",
    v: "eˣ",
    remaining: "∫ eˣ dx",
    answer: "eˣ(x − 1) + C",
  },
  {
    integral: "∫ x sin(x) dx",
    u: "x",
    dv: "sin(x) dx",
    du: "dx",
    v: "−cos(x)",
    remaining: "∫ −cos(x) dx",
    answer: "−x cos(x) + sin(x) + C",
  },
];

const clean = (value: string) =>
  value
    .toLowerCase()
    .replace(/\s|\*|\^|−|∫/g, "")
    .replace(/²/g, "2")
    .replace(/ˣ/g, "x");

export default function IntegrationByPartsTargetLesson10181({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [exampleIndex, setExampleIndex] = useState(0);
  const [u, setU] = useState("");
  const [dv, setDv] = useState("");
  const [liate, setLiate] = useState("L");
  const [quick, setQuick] = useState("");
  const [quickFeedback, setQuickFeedback] = useState("");
  const [challenge, setChallenge] = useState({
    u: "",
    dv: "",
    du: "",
    v: "",
    uv: "",
    rest: "",
    answer: "",
  });
  const [challengeFeedback, setChallengeFeedback] = useState("");
  const [revealSteps, setRevealSteps] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const example = examples[exampleIndex];
  const assignmentCorrect = u === example.u && dv === example.dv;
  const showWorked = (!u && !dv) || assignmentCorrect;

  const reset = () => {
    setU("");
    setDv("");
    setLiate("L");
    setQuick("");
    setQuickFeedback("");
    setChallenge({
      u: "",
      dv: "",
      du: "",
      v: "",
      uv: "",
      rest: "",
      answer: "",
    });
    setChallengeFeedback("");
    setRevealSteps(false);
    setShowSolution(false);
  };
  const changeExample = () => {
    setExampleIndex((value) => (value + 1) % examples.length);
    reset();
  };
  const assign = (value: string, slot?: "u" | "dv") => {
    if (slot === "u" || (!slot && value === example.u)) setU(value);
    else if (slot === "dv" || !slot) setDv(value);
  };
  const drop = (event: DragEvent<HTMLButtonElement>, slot: "u" | "dv") => {
    event.preventDefault();
    assign(event.dataTransfer.getData("text/plain"), slot);
  };
  const updateChallenge = (key: keyof typeof challenge, value: string) =>
    setChallenge((current) => ({ ...current, [key]: value }));
  const checkChallenge = () => {
    const accepted =
      clean(challenge.u) === "x2" &&
      clean(challenge.dv) === "exdx" &&
      clean(challenge.du) === "2xdx" &&
      clean(challenge.v) === "ex" &&
      ["x2ex", "exx2"].includes(clean(challenge.uv)) &&
      ["2xexdx", "2exxdx"].includes(clean(challenge.rest)) &&
      ["ex(x2-2x+2)+c", "x2ex-2xex+2ex+c"].includes(clean(challenge.answer));
    setChallengeFeedback(
      accepted
        ? "Correct: repeated integration by parts gives eˣ(x²−2x+2)+C."
        : "Recheck LIATE, then apply integration by parts twice.",
    );
  };

  return (
    <main
      className="ib10181-page"
      data-testid="school-mockup-0855"
      data-object-model="dedicated-integration-by-parts-product-rule-engine"
      data-example={exampleIndex + 1}
      data-u={u || "unassigned"}
      data-dv={dv || "unassigned"}
      data-assignment-correct={String(assignmentCorrect)}
      data-result={assignmentCorrect ? example.answer : "pending"}
    >
      <header>
        <small>CLASS 12 · FORMAL CALCULUS</small>
        <h1>Integration by Parts</h1>
        <p>
          Use the product rule d(uv)=u(dv)+v(du) to evaluate integrals of
          products.
        </p>
        <div>
          <span>Class 12</span>
          <span>Advanced</span>
          <span>Concept</span>
          <span>Worked Examples</span>
          <span>Practice</span>
        </div>
      </header>

      <section className="ib-rule-strip">
        <h3>FROM PRODUCT RULE TO INTEGRATION BY PARTS</h3>
        <div>
          <article>
            <b>Product rule</b>
            <h2>d(uv) = u dv + v du</h2>
          </article>
          <strong>→</strong>
          <article>
            <b>Rearrange and integrate</b>
            <h2>∫u dv = uv − ∫v du</h2>
          </article>
          <aside>
            <b>Remember</b>
            <ol>
              <li>Choose u and dv</li>
              <li>Find du and v</li>
              <li>Apply formula</li>
              <li>Simplify</li>
            </ol>
          </aside>
        </div>
      </section>

      <section className="ib-workspace">
        <div className="ib-workspace-title">
          <div>
            <h3>EXPLORE: DECISION WORKSPACE</h3>
            <p>
              Evaluate <b>{example.integral}</b> using integration by parts.
            </p>
          </div>
          <div>
            <button onClick={reset}>
              <RotateCcw /> Reset
            </button>
            <button onClick={changeExample}>New example</button>
          </div>
        </div>
        <div className="ib-main-grid">
          <article className="ib-builder">
            <h4>
              <i>1</i> Assign u and dv (drag or click)
            </h4>
            <p>Drag the expression chips to a slot, or click to assign.</p>
            <div className="ib-chips">
              {[example.u, example.dv].map((value) => (
                <button
                  draggable
                  onDragStart={(event) =>
                    event.dataTransfer.setData("text/plain", value)
                  }
                  onClick={() => assign(value)}
                  key={value}
                >
                  {value}
                </button>
              ))}
            </div>
            <div className="ib-slots">
              <span>u =</span>
              <button
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => drop(event, "u")}
                onClick={() => setU(example.u)}
              >
                {u || "drop here"}
              </button>
              <span>dv =</span>
              <button
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => drop(event, "dv")}
                onClick={() => setDv(example.dv)}
              >
                {dv || "drop here"}
              </button>
            </div>
            <hr />
            <h4>
              <i>2</i> Compute du and v
            </h4>
            <div className="ib-compute">
              <span>du =</span>
              <output>{showWorked || u ? example.du : "—"}</output>
              <span>v =</span>
              <output>{showWorked || dv ? example.v : "—"}</output>
            </div>
            <hr />
            <h4>
              <i>3</i> Apply integration by parts
            </h4>
            <h2>∫u dv = uv − ∫v du</h2>
            <h2>
              {showWorked
                ? `${example.integral} = ${example.u}(${example.v}) − ${example.remaining}`
                : "Assign both expressions to build the transformed integral."}
            </h2>
            <hr />
            <h4>
              <i>4</i> Evaluate the remaining integral
            </h4>
            <p>
              {showWorked
                ? `${example.remaining} is evaluated directly.`
                : "The remaining integral appears after a valid assignment."}
            </p>
            <div className={showWorked ? "ib-answer correct" : "ib-answer"}>
              {showWorked
                ? `${example.integral} = ${example.answer}`
                : "Final answer pending"}
              {showWorked && <CheckCircle2 />}
            </div>
          </article>

          <aside className="ib-guidance">
            <section>
              <h3>LIATE: How to choose</h3>
              <div className="ib-liate">
                {["L", "I", "A", "T", "E"].map((letter) => (
                  <button
                    className={liate === letter ? "active" : ""}
                    onClick={() => setLiate(letter)}
                    key={letter}
                  >
                    {letter}
                  </button>
                ))}
              </div>
              <p>
                <b>{liate}</b>:{" "}
                {
                  {
                    L: "Logarithmic expressions usually become simpler when differentiated.",
                    I: "Inverse trigonometric expressions are strong u choices.",
                    A: "Algebraic powers reduce degree when differentiated.",
                    T: "Trigonometric factors are often selected as dv.",
                    E: "Exponential factors are convenient to integrate.",
                  }[liate]
                }
              </p>
              <small>
                Goal: Differentiate u to make it simpler; integrate dv to get v.
              </small>
            </section>
            <section>
              <h3>COMMON DERIVATIVES AND INTEGRALS</h3>
              <table>
                <thead>
                  <tr>
                    <th>Expression</th>
                    <th>du</th>
                    <th>∫ dv</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>xⁿ</td>
                    <td>nxⁿ⁻¹ dx</td>
                    <td>xⁿ⁺¹/(n+1)</td>
                  </tr>
                  <tr>
                    <td>ln x</td>
                    <td>dx/x</td>
                    <td>x ln x−x</td>
                  </tr>
                  <tr>
                    <td>eˣ</td>
                    <td>eˣ dx</td>
                    <td>eˣ+C</td>
                  </tr>
                  <tr>
                    <td>sin x</td>
                    <td>cos x dx</td>
                    <td>−cos x+C</td>
                  </tr>
                  <tr>
                    <td>cos x</td>
                    <td>−sin x dx</td>
                    <td>sin x+C</td>
                  </tr>
                </tbody>
              </table>
            </section>
          </aside>
        </div>

        <section className="ib-verify">
          <div>
            <h3>VERIFY YOUR ANSWER</h3>
            <p>Differentiate the result to check.</p>
            <h2>F(x) = eˣ(x−1)+C</h2>
            <article>
              F′(x)=eˣ(x−1)+eˣ = xeˣ{" "}
              <b>
                <CheckCircle2 /> Matches the integrand.
              </b>
            </article>
          </div>
          <article>
            <b>Visual check: F′(x) and xeˣ</b>
            <svg
              viewBox="0 0 340 180"
              aria-label="Derivative verification graph"
            >
              <path d="M20 145H325M130 15V165" stroke="#65758a" />
              <path
                d="M30 145 C95 145 128 142 160 125 C205 100 245 54 300 18"
                fill="none"
                stroke="#285df4"
                strokeWidth="2.5"
              />
              <path
                d="M30 145 C95 145 128 142 160 125 C205 100 245 54 300 18"
                fill="none"
                stroke="#8b45ed"
                strokeDasharray="6 4"
                strokeWidth="2"
              />
            </svg>
          </article>
        </section>
      </section>

      <section className="ib-lessons-row">
        <article>
          <h3>WORKED EXAMPLE</h3>
          <p>Evaluate ∫x ln x dx.</p>
          <ol>
            <li>Choose u=ln x and dv=x dx.</li>
            <li>Then du=dx/x and v=x²/2.</li>
            <li>Apply ∫u dv=uv−∫v du.</li>
            <li>Simplify to x²ln(x)/2−x²/4+C.</li>
          </ol>
          <div>
            ∫x ln x dx = x²ln(x)/2 − x²/4 + C <CheckCircle2 />
          </div>
        </article>
        <aside>
          <section>
            <h3>COMMON MISTAKES</h3>
            <p>
              <XCircle /> Do not differentiate dv; integrate it to find v.
            </p>
            <p>
              <XCircle /> Keep the minus sign in uv−∫v du.
            </p>
          </section>
          <section>
            <h3>QUICK CHECK</h3>
            <p>Which step is correct for ∫xeˣ dx?</p>
            {["u=eˣ, dv=x dx", "u=x, dv=eˣ dx", "u=eˣ dx, dv=x"].map(
              (value, index) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="ib-quick"
                    checked={quick === String(index)}
                    onChange={() => setQuick(String(index))}
                  />
                  {value}
                </label>
              ),
            )}
            <button
              onClick={() =>
                setQuickFeedback(
                  quick === "1"
                    ? "Correct: algebraic x is u and eˣ dx is dv."
                    : "Use LIATE: choose the algebraic factor as u.",
                )
              }
            >
              Check
            </button>
            {quickFeedback && <output>{quickFeedback}</output>}
          </section>
        </aside>
      </section>

      <section className="ib-challenge">
        <div>
          <h3>PRACTICE CHALLENGE</h3>
          <p>Evaluate ∫x²eˣ dx using integration by parts.</p>
          <div className="ib-challenge-grid">
            <label>
              u =
              <input
                value={challenge.u}
                onChange={(e) => updateChallenge("u", e.target.value)}
                placeholder="drop u"
              />
            </label>
            <label>
              dv =
              <input
                value={challenge.dv}
                onChange={(e) => updateChallenge("dv", e.target.value)}
                placeholder="drop dv"
              />
            </label>
            <label>
              du =
              <input
                value={challenge.du}
                onChange={(e) => updateChallenge("du", e.target.value)}
                placeholder="typed answer"
              />
            </label>
            <label>
              v =
              <input
                value={challenge.v}
                onChange={(e) => updateChallenge("v", e.target.value)}
                placeholder="typed answer"
              />
            </label>
            <label>
              uv =
              <input
                value={challenge.uv}
                onChange={(e) => updateChallenge("uv", e.target.value)}
                placeholder="first term"
              />
            </label>
            <label>
              ∫v du =
              <input
                value={challenge.rest}
                onChange={(e) => updateChallenge("rest", e.target.value)}
                placeholder="remaining integral"
              />
            </label>
            <label className="wide">
              Final answer
              <input
                aria-label="Challenge final answer"
                value={challenge.answer}
                onChange={(e) => updateChallenge("answer", e.target.value)}
                placeholder="your final answer"
              />
            </label>
          </div>
          <button onClick={checkChallenge}>Check challenge</button>
          {challengeFeedback && <output>{challengeFeedback}</output>}
        </div>
        <aside>
          <section>
            <h3>
              <Lightbulb /> HINT
            </h3>
            <p>Use LIATE: choose u=x² and dv=eˣ dx.</p>
            <button onClick={() => setRevealSteps((value) => !value)}>
              {revealSteps ? "Hide steps" : "Reveal steps"}
            </button>
            {revealSteps && (
              <p>du=2x dx, v=eˣ. Apply parts again to ∫2xeˣ dx.</p>
            )}
          </section>
          <section>
            <h3>TIP</h3>
            <p>Each repeated application reduces the polynomial degree by 1.</p>
            <button onClick={() => setShowSolution((value) => !value)}>
              {showSolution ? "Hide full solution" : "Show full solution"}
            </button>
            {showSolution && <p>∫x²eˣdx=eˣ(x²−2x+2)+C.</p>}
          </section>
        </aside>
      </section>

      <nav className="ib-adjacent">
        <Link to="/lessons/school/class-12/class-12-formal-calculus-integration-by-substitution">
          ← Previous: Integration by Substitution
        </Link>
        <Link to="/lessons/school/class-12/class-12-formal-calculus-integration-by-partial-fractions">
          Next: Integration by Partial Fractions →
        </Link>
      </nav>
    </main>
  );
}
