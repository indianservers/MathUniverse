import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  Hand,
  Lightbulb,
  Sigma,
  Target,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./PolynomialDivisionTargetLesson438.css";

const INITIAL_DIVIDEND = [2, 3, -1, 4, -2];
const INITIAL_DIVISOR = [2, -4];
type Feedback = "idle" | "correct" | "incorrect";

export default function PolynomialDivisionTargetLesson438({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [dividend, setDividend] = useState(INITIAL_DIVIDEND);
  const [divisor, setDivisor] = useState(INITIAL_DIVISOR);
  const [mode, setMode] = useState<"long" | "synthetic">("long");
  const [tab, setTab] = useState("Interaction + visualization");
  const [practice, setPractice] = useState(["", "", "", ""]);
  const [feedback, setFeedback] = useState<Feedback>("idle");
  const [showAnswer, setShowAnswer] = useState(false);
  const model = useMemo(
    () => dividePolynomials(dividend, divisor),
    [dividend, divisor],
  );
  const identity = useMemo(
    () =>
      addPolynomials(multiplyPolynomials(divisor, model.quotient), [
        model.remainder,
      ]),
    [divisor, model],
  );
  const interact = (run: () => void) => {
    run();
    onInteraction();
  };

  useEffect(() => {
    setDividend(INITIAL_DIVIDEND);
    setDivisor(INITIAL_DIVISOR);
    setMode("long");
    setTab("Interaction + visualization");
    setPractice(["", "", "", ""]);
    setFeedback("idle");
    setShowAnswer(false);
  }, [resetToken]);

  const updateCoefficient = (
    kind: "dividend" | "divisor",
    index: number,
    value: string,
  ) => {
    const numeric = value === "" ? 0 : Number(value);
    interact(() =>
      kind === "dividend"
        ? setDividend((current) =>
            current.map((item, i) => (i === index ? numeric : item)),
          )
        : setDivisor((current) =>
            current.map((item, i) => (i === index ? numeric : item)),
          ),
    );
  };
  const checkPractice = () =>
    interact(() => {
      const answer = [3, 8, 11, 23];
      setFeedback(
        practice.every((value, index) => Number(value) === answer[index])
          ? "correct"
          : "incorrect",
      );
    });

  return (
    <section
      className="pd438-page"
      data-testid="symbolic-cas-mockup-0344"
      data-dedicated-lesson="438"
      data-object-model="linked-polynomial-long-synthetic-division-identity-practice"
      data-mode={mode}
      data-quotient={model.quotient.join(",")}
      data-remainder={model.remainder}
      data-identity={identity.join(",")}
      data-feedback={feedback}
    >
      <h2 className="sr-only">Polynomial Division</h2>
      <nav className="pd438-tabs" aria-label="Lesson views">
        {[
          "Interaction + visualization",
          "Explain",
          "Examples",
          "Formulas",
          "Know more",
        ].map((name, index) => (
          <button
            key={name}
            className={tab === name ? "active" : ""}
            data-lesson-control={`division-tab-${index}`}
            onClick={() => interact(() => setTab(name))}
          >
            {index === 0 && <Eye />}
            {index === 3 && <Sigma />}
            {name}
          </button>
        ))}
      </nav>
      <section className="pd438-flow">
        {[
          [Eye, "1 Observe", "See the dividend, divisor and division layout."],
          [
            Hand,
            "2 Manipulate",
            "Enter or change terms to see results update instantly.",
          ],
          [
            Lightbulb,
            "3 Notice",
            "Watch how quotient terms appear and remainder shrinks.",
          ],
          [
            Target,
            "4 Understand",
            "Link the result to the Division Algorithm.",
          ],
        ].map(([Icon, title, text], index) => (
          <article key={String(title)}>
            <Icon />
            <span>
              <b>{String(title)}</b>
              <p>{String(text)}</p>
            </span>
            {index < 3 && <ArrowRight />}
          </article>
        ))}
      </section>
      <section className="pd438-workspace">
        <header>
          <span>
            <b>CAS WORKSPACE</b>
            <small>
              Linked long division + synthetic division + results + identity
              check
            </small>
          </span>
          <strong>
            <Check /> All good
          </strong>
          <button
            data-lesson-control="division-clear"
            onClick={() =>
              interact(() => {
                setDividend([0, 0, 0, 0, 0]);
                setDivisor([1, 0]);
              })
            }
          >
            Clear all
          </button>
        </header>
        <div className="pd438-main">
          <aside className="pd438-input">
            <h3>INPUT</h3>
            <h4>Dividend &nbsp; P(x)</h4>
            <CoefficientInputs
              values={dividend}
              name="dividend"
              onChange={(i, v) => updateCoefficient("dividend", i, v)}
            />
            <h4>Divisor &nbsp; D(x)</h4>
            <CoefficientInputs
              values={divisor}
              name="divisor"
              onChange={(i, v) => updateCoefficient("divisor", i, v)}
            />
            {divisor[0] === 0 && <em>Leading coefficient must be non-zero.</em>}
            <h4>Mode</h4>
            <div className="mode">
              <button
                className={mode === "long" ? "active" : ""}
                data-lesson-control="division-long-mode"
                onClick={() => interact(() => setMode("long"))}
              >
                Long Division
              </button>
              <button
                className={mode === "synthetic" ? "active" : ""}
                data-lesson-control="division-synthetic-mode"
                disabled={!canSynthetic(divisor)}
                onClick={() => interact(() => setMode("synthetic"))}
              >
                Synthetic
              </button>
            </div>
            <article>
              <b>Division Algorithm</b>
              <p>
                For divisor D(x) != 0, there exist unique polynomials Q(x) and
                R(x) such that
              </p>
              <strong>P(x) = D(x) Q(x) + R(x)</strong>
              <p>where degree R(x) is less than degree D(x).</p>
            </article>
          </aside>
          <section className="pd438-long">
            <h3>
              {mode === "long"
                ? "LONG DIVISION (LINKED)"
                : "SYNTHETIC DIVISION (LINKED)"}
            </h3>
            {divisor[0] === 0 ? (
              <div className="invalid">
                Enter a non-zero leading divisor coefficient.
              </div>
            ) : mode === "long" ? (
              <LongDivision
                model={model}
                dividend={dividend}
                divisor={divisor}
              />
            ) : (
              <SyntheticDivision
                dividend={dividend}
                divisor={divisor}
                model={model}
              />
            )}
          </section>
          <aside className="pd438-results">
            <h3>RESULTS</h3>
            <h4>Quotient &nbsp; Q(x)</h4>
            <output>{polynomialText(model.quotient)}</output>
            <h4>Remainder &nbsp; R(x)</h4>
            <output>{formatNumber(model.remainder)}</output>
            <hr />
            <h3>Division Identity Check</h3>
            <i>P(x)</i>
            <output>{polynomialText(dividend)}</output>
            <b>=</b>
            <i>D(x) Q(x) + R(x)</i>
            <output>{polynomialText(identity)}</output>
            <footer
              className={
                arraysEqual(dividend, identity) ? "verified" : "failed"
              }
            >
              <Check />{" "}
              {arraysEqual(dividend, identity)
                ? "Identity verified"
                : "Check inputs"}
            </footer>
          </aside>
        </div>
        <SyntheticStrip dividend={dividend} divisor={divisor} model={model} />
      </section>
      <section className="pd438-learning">
        <article className="mistake">
          <h3>
            <TriangleAlert /> Common Misconception
          </h3>
          <b>Dividing each term of the divisor.</b>
          <p>
            Polynomial division is not term-by-term division. Use the algorithm
            to subtract multiples and reduce degree step by step.
          </p>
        </article>
        <article>
          <h3>
            <Target /> Worked Example (One Look)
          </h3>
          <p>Divide x³ - 2x² + 3x + 4 by x - 1.</p>
          <b>Result:</b>
          <strong>Q(x) = x² - x + 2, &nbsp; R(x) = 6</strong>
        </article>
        <article className="takeaway">
          <h3>
            <Check /> Key Takeaways
          </h3>
          <p>✓ degree R(x) &lt; degree D(x)</p>
          <p>✓ P(x) = D(x)Q(x) + R(x)</p>
          <p>✓ Synthetic division is fast for linear divisors.</p>
        </article>
      </section>
      <section className="pd438-practice">
        <span>
          <b>Practice Challenge (Your Turn)</b>
          <p>Divide 3x³ + 2x² - 5x + 1 by x - 2.</p>
        </span>
        <div>
          Q(x) ={" "}
          <input
            data-lesson-control="division-practice-q2"
            aria-label="Practice x squared coefficient"
            value={practice[0]}
            onChange={(e) =>
              setPractice([e.target.value, ...practice.slice(1)])
            }
          />{" "}
          x² +{" "}
          <input
            data-lesson-control="division-practice-q1"
            aria-label="Practice x coefficient"
            value={practice[1]}
            onChange={(e) =>
              setPractice([practice[0], e.target.value, ...practice.slice(2)])
            }
          />{" "}
          x +{" "}
          <input
            data-lesson-control="division-practice-q0"
            aria-label="Practice constant"
            value={practice[2]}
            onChange={(e) =>
              setPractice([
                ...practice.slice(0, 2),
                e.target.value,
                practice[3],
              ])
            }
          />{" "}
          &nbsp; R(x) ={" "}
          <input
            data-lesson-control="division-practice-r"
            aria-label="Practice remainder"
            value={practice[3]}
            onChange={(e) =>
              setPractice([...practice.slice(0, 3), e.target.value])
            }
          />
        </div>
        <button
          data-lesson-control="division-practice-check"
          onClick={checkPractice}
        >
          Check
        </button>
        <button
          data-lesson-control="division-show-answer"
          onClick={() => interact(() => setShowAnswer((value) => !value))}
        >
          Show answer
        </button>
        {showAnswer && <em>Q(x) = 3x² + 8x + 11, R = 23</em>}
        {feedback !== "idle" && (
          <strong className={feedback}>
            {feedback === "correct" ? "Correct." : "Recheck each coefficient."}
          </strong>
        )}
      </section>
      <nav className="pd438-nav">
        <a href="/lessons/symbolic-mathematics/437-partial-fractions">
          <ArrowLeft />
          <span>
            <small>Previous</small>Partial Fractions
          </span>
        </a>
        <a href="/lessons/symbolic-mathematics/439-derivatives">
          <span>
            <small>Next</small>Derivatives
          </span>
          <ArrowRight />
        </a>
      </nav>
    </section>
  );
}

function CoefficientInputs({
  values,
  name,
  onChange,
}: {
  values: number[];
  name: string;
  onChange: (index: number, value: string) => void;
}) {
  return (
    <div className="coeff-inputs">
      {values.map((value, index) => (
        <label key={index}>
          <span>
            x<sup>{values.length - index - 1}</sup>
          </span>
          <input
            type="number"
            data-lesson-control={`division-${name}-${index}`}
            aria-label={`${name} coefficient ${index + 1}`}
            value={value}
            onChange={(e) => onChange(index, e.target.value)}
          />
        </label>
      ))}
    </div>
  );
}
function LongDivision({
  model,
  dividend,
  divisor,
}: {
  model: DivisionModel;
  dividend: number[];
  divisor: number[];
}) {
  return (
    <div className="long-layout">
      <div className="quotient">
        {polynomialText(model.quotient)} <small>Quotient Q(x)</small>
      </div>
      <div className="division-line">
        <b>{polynomialText(divisor)}</b>
        <span>{polynomialText(dividend)}</span>
      </div>
      {model.steps.map((step, index) => (
        <div className="long-step" key={index}>
          <i>- ({polynomialText(step.subtracted)})</i>
          <hr />
          <b>{polynomialText(step.remaining)}</b>
        </div>
      ))}
      <div className="legend">
        <span>━ Bring down</span>
        <span>━ Subtract</span>
        <span>━ Remainder</span>
      </div>
    </div>
  );
}
function SyntheticDivision({
  dividend,
  divisor,
  model,
}: {
  dividend: number[];
  divisor: number[];
  model: DivisionModel;
}) {
  const root = -divisor[1] / divisor[0];
  const normalized = dividend.map((v) => v / divisor[0]);
  return (
    <div className="synthetic-large">
      <b>
        x - {formatNumber(root)} = 0 &nbsp; → &nbsp; x = {formatNumber(root)}
      </b>
      <div>
        <strong>{formatNumber(root)}</strong>
        <span>{normalized.map(formatNumber).join("     ")}</span>
        <hr />
        <span>
          {model.quotient.map(formatNumber).join("     ")} &nbsp; | &nbsp;{" "}
          {formatNumber(model.remainder)}
        </span>
      </div>
    </div>
  );
}
function SyntheticStrip({
  dividend,
  divisor,
  model,
}: {
  dividend: number[];
  divisor: number[];
  model: DivisionModel;
}) {
  if (!canSynthetic(divisor))
    return (
      <section className="pd438-synthetic">
        <h3>SYNTHETIC DIVISION (LINKED)</h3>
        <p>Synthetic division is available when the divisor is linear.</p>
      </section>
    );
  const root = -divisor[1] / divisor[0];
  const bottom: number[] = [];
  const products: number[] = [];
  dividend.forEach((coefficient, index) => {
    bottom[index] = cleanNumber(coefficient + (products[index - 1] ?? 0));
    if (index < dividend.length - 1)
      products[index] = cleanNumber(bottom[index] * root);
  });
  return (
    <section className="pd438-synthetic">
      <h3>SYNTHETIC DIVISION (LINKED)</h3>
      <b>
        Solve {polynomialText(divisor)} = 0 &nbsp; → &nbsp; x ={" "}
        {formatNumber(root)}
      </b>
      <div className="synthetic-row">
        <strong>{formatNumber(root)}</strong>
        <span>{dividend.map(formatNumber).join("       ")}</span>
        <ArrowRight />
        <small>Coefficients of P(x)</small>
        <span className="products">
          {["", ...products.map(formatNumber)].join("       ")}
        </span>
        <ArrowRight />
        <small>Products</small>
        <hr />
        <span>
          {bottom.slice(0, -1).map(formatNumber).join("       ")} &nbsp;{" "}
          <mark>{formatNumber(bottom.at(-1) ?? 0)}</mark>
        </span>
        <ArrowRight />
        <small>Accumulated row</small>
      </div>
      <aside>
        Synthetic division works when the divisor is linear of the form x - c.
      </aside>
      <footer>
        Q coefficients: {model.quotient.map(formatNumber).join(", ")} &nbsp; •
        &nbsp; R = {formatNumber(model.remainder)}
      </footer>
    </section>
  );
}

type DivisionModel = {
  quotient: number[];
  remainder: number;
  steps: { subtracted: number[]; remaining: number[] }[];
};
function dividePolynomials(
  dividend: number[],
  divisor: number[],
): DivisionModel {
  if (!divisor.length || Math.abs(divisor[0]) < 1e-12)
    return { quotient: [0], remainder: 0, steps: [] };
  const work = [...dividend],
    degree = dividend.length - divisor.length,
    quotient = Array(Math.max(0, degree + 1)).fill(0),
    steps = [] as DivisionModel["steps"];
  for (let i = 0; i <= degree; i++) {
    const factor = work[i] / divisor[0];
    quotient[i] = factor;
    const subtracted = Array(dividend.length).fill(0);
    for (let j = 0; j < divisor.length; j++) {
      const value = factor * divisor[j];
      subtracted[i + j] = value;
      work[i + j] -= value;
    }
    steps.push({
      subtracted: trimLeading(subtracted),
      remaining: trimLeading(
        work
          .slice(0, i + 1)
          .map(() => 0)
          .concat(work.slice(i + 1)),
      ),
    });
  }
  return {
    quotient: clean(quotient),
    remainder: cleanNumber(work.at(-1) ?? 0),
    steps,
  };
}
function multiplyPolynomials(a: number[], b: number[]) {
  const out = Array(a.length + b.length - 1).fill(0);
  a.forEach((x, i) => b.forEach((y, j) => (out[i + j] += x * y)));
  return clean(out);
}
function addPolynomials(a: number[], b: number[]) {
  const size = Math.max(a.length, b.length),
    left = [...Array(size - a.length).fill(0), ...a],
    right = [...Array(size - b.length).fill(0), ...b];
  return clean(left.map((v, i) => v + right[i]));
}
function polynomialText(values: number[]) {
  const degree = values.length - 1;
  const terms = values
    .map((raw, index) => {
      const value = cleanNumber(raw),
        power = degree - index;
      if (value === 0) return "";
      const sign = value < 0 ? "-" : "+",
        absolute = Math.abs(value),
        coefficient = power > 0 && absolute === 1 ? "" : formatNumber(absolute),
        variable = power === 0 ? "" : power === 1 ? "x" : `x^${power}`;
      return `${sign} ${coefficient}${variable}`;
    })
    .filter(Boolean);
  if (!terms.length) return "0";
  return terms.join(" ").replace(/^\+ /, "");
}
function trimLeading(values: number[]) {
  const copy = clean(values);
  while (copy.length > 1 && copy[0] === 0) copy.shift();
  return copy;
}
function clean(values: number[]) {
  return values.map(cleanNumber);
}
function cleanNumber(value: number) {
  return Math.abs(value) < 1e-9 ? 0 : Number(value.toFixed(6));
}
function formatNumber(value: number) {
  return Number.isInteger(value)
    ? String(value)
    : String(Number(value.toFixed(3)));
}
function canSynthetic(divisor: number[]) {
  return divisor.length === 2 && Math.abs(divisor[0]) > 1e-12;
}
function arraysEqual(a: number[], b: number[]) {
  return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) < 1e-8);
}
