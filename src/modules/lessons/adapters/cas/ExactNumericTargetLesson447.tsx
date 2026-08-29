import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  RotateCcw,
  Scale,
  Share2,
  Star,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./ExactNumericTargetLesson447.css";

type Mode = "exact" | "numeric";
const initialExpression = "2 × 3² × 5 − 7/4 + √2";
const examples = ["sqrt(2)", "1/3", "2*pi", "3^2+2*sqrt(5)", "exp(1/2)"];

export default function ExactNumericTargetLesson447({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [expression, setExpression] = useState(initialExpression),
    [mode, setMode] = useState<Mode>("exact"),
    [precision, setPrecision] = useState(8),
    [practice, setPractice] = useState<[string, string, string]>(["", "", ""]),
    [feedback, setFeedback] = useState<"" | "correct" | "incorrect">(""),
    [actions, setActions] = useState(0);
  const model = useMemo(
      () => exactNumeric(expression, precision),
      [expression, precision],
    ),
    challenge = useMemo(() => exactNumeric("4*pi-sqrt(3)+2/7", 8), []);
  const act = (run: () => void) => {
    run();
    setActions((value) => value + 1);
    onInteraction();
  };
  useEffect(() => {
    setExpression(initialExpression);
    setMode("exact");
    setPrecision(8);
    setPractice(["", "", ""]);
    setFeedback("");
    setActions(0);
  }, [resetToken]);
  return (
    <section
      className="en447-page"
      data-testid="symbolic-cas-mockup-0353"
      data-dedicated-lesson="447"
      data-object-model="exact-symbolic-numeric-precision-rounding-error-place-value-practice"
      data-expression={expression}
      data-exact={model.exact}
      data-numeric={model.rounded}
      data-error={model.error}
      data-mode={mode}
      data-precision={precision}
      data-feedback={feedback}
      data-actions={actions}
    >
      <header className="en447-hero">
        <span className="pills">
          <b>Symbolic Mathematics</b>
          <b>CAS Workspace</b>
        </span>
        <h1>Exact / Numeric Toggle</h1>
        <p>
          Compare symbolic (exact) and approximate (numeric) results. Toggle
          precision and see rounding error.
        </p>
        <div className="meta">
          <span>♙ Intermediate–Advanced</span>
          <span>⚡ CAS Lab</span>
          <span>▣ CAS Calculator</span>
          <span>◷ 6–10 min</span>
        </div>
        <div className="actions">
          <button>⚒ English (English)⌄</button>
          <button
            data-lesson-control="exact-reset"
            onClick={() =>
              act(() => {
                setExpression(initialExpression);
                setMode("exact");
                setPrecision(8);
              })
            }
          >
            <RotateCcw /> Reset
          </button>
          <button
            data-lesson-control="exact-share"
            onClick={() =>
              act(() =>
                navigator.clipboard?.writeText(
                  `${model.exact} ≈ ${model.rounded}`,
                ),
              )
            }
          >
            <Share2 /> Share
          </button>
          <a href="/workspace/data/cas">↗ Workspace</a>
        </div>
      </header>
      <section className="en447-flow">
        {[
          ["1", "Observe", "Enter an expression."],
          ["2", "Manipulate", "Toggle mode, change precision."],
          ["3", "Notice", "Compare outputs and rounding error."],
          ["4", "Understand", "See when exact math preserves meaning."],
        ].map(([n, t, p]) => (
          <article key={n}>
            <b>{n}</b>
            <h3>{t}</h3>
            <p>{p}</p>
          </article>
        ))}
      </section>
      <section className="en447-workspace">
        <header>
          <b>1</b>
          <h2>CAS Workspace: Exact vs Numeric</h2>
          <p>
            Enter an expression and compare exact (symbolic) vs numeric
            (decimal) results.
          </p>
        </header>
        <div className="en447-controls">
          <div>
            <label>
              Expression input
              <input
                aria-label="Exact numeric expression"
                data-lesson-control="exact-expression"
                value={expression}
                onChange={(event) =>
                  act(() => setExpression(event.target.value))
                }
              />
            </label>
            <h3>Examples</h3>
            <div className="examples">
              {examples.map((example, index) => (
                <button
                  key={example}
                  data-lesson-control={`exact-example-${index + 1}`}
                  onClick={() => act(() => setExpression(example))}
                >
                  {displayInput(example)}
                </button>
              ))}
            </div>
            <label className="precision">
              Precision (digits)
              <button
                data-lesson-control="precision-minus"
                onClick={() =>
                  act(() => setPrecision((value) => Math.max(2, value - 1)))
                }
              >
                −
              </button>
              <output>{precision}</output>
              <button
                data-lesson-control="precision-plus"
                onClick={() =>
                  act(() => setPrecision((value) => Math.min(12, value + 1)))
                }
              >
                +
              </button>
              <small>Used in Numeric mode</small>
            </label>
          </div>
          <div>
            <h3>Mode (toggle)</h3>
            <div className="modes">
              <button
                className={mode === "exact" ? "selected" : ""}
                data-lesson-control="mode-exact"
                onClick={() => act(() => setMode("exact"))}
              >
                <b>π</b>
                <span>
                  EXACT<small>(Symbolic)</small>
                </span>
              </button>
              <button
                className={mode === "numeric" ? "selected" : ""}
                data-lesson-control="mode-numeric"
                onClick={() => act(() => setMode("numeric"))}
              >
                <b>3.14</b>
                <span>
                  NUMERIC<small>(Decimal)</small>
                </span>
              </button>
            </div>
            <article className="rounding">
              <h3>Rounding error ( | Numeric − Exact | )</h3>
              <strong>{model.error}</strong>
              <span>
                {Number(model.error) === 0
                  ? "Exact preserved"
                  : `at ${precision} digits`}
              </span>
              <Check />
            </article>
          </div>
        </div>
        <div className="en447-results">
          <article>
            <header>
              EXACT (Symbolic Result)
              <button
                data-lesson-control="copy-exact"
                onClick={() =>
                  act(() => navigator.clipboard?.writeText(model.exact))
                }
              >
                <Copy />
              </button>
            </header>
            <div className="derivation">
              {model.steps.map((step) => (
                <p key={step}>{step}</p>
              ))}
            </div>
            <b>✓ Simplified (exact)</b>
            <small>Surds and fractions are preserved.</small>
          </article>
          <strong>⇄</strong>
          <article>
            <header>
              NUMERIC (Decimal Result)
              <button
                data-lesson-control="copy-numeric"
                onClick={() =>
                  act(() => navigator.clipboard?.writeText(model.rounded))
                }
              >
                <Copy />
              </button>
            </header>
            <output>{model.rounded}</output>
            <p>(rounded to {precision} digits)</p>
            <PlaceValue value={model.rounded} />
            <b>Computed with {precision}-digit precision.</b>
          </article>
        </div>
      </section>
      <section className="en447-rule">
        <Scale />
        <div>
          <h3>Rule (When to use Exact vs Numeric)</h3>
          <p>
            • Use <b>EXACT</b> when the result contains surds (√), π, fractions,
            exponents, or symbolic parameters.
          </p>
          <p>
            • Use <b>NUMERIC</b> when a decimal approximation is sufficient or
            required for measurement.
          </p>
          <p>
            <b>Key idea:</b> Exact preserves mathematical meaning; numeric
            introduces rounding.
          </p>
        </div>
      </section>
      <section className="en447-misconception">
        <AlertTriangle />
        <div>
          <h3>Common Misconception</h3>
          <p>
            Toggling to Numeric is not “more correct”. It is an approximation.
            Too few digits can hide differences or make non-zero errors appear
            as zero.
          </p>
        </div>
        <aside>
          <b>Example</b>
          <p>1/3 ≈ 0.33333333 (8 digits)</p>
              <p>but a rounded decimal is not exactly 1/3.</p>
        </aside>
      </section>
      <section className="en447-worked">
        <h3>
          <Star /> Worked Example (One complete comparison)
        </h3>
        <div>
          <article>
            <b>Problem</b>
            <output>2√5 + 3/2 − 1/√5</output>
          </article>
          <article>
            <b>Exact</b>
            <p>2√5 + 3/2 − √5/5</p>
            <p>= 9√5/5 + 3/2</p>
          </article>
          <article>
            <b>Numeric (8 digits)</b>
            <output>
              {roundTo(2 * Math.sqrt(5) + 1.5 - 1 / Math.sqrt(5), 8)}
            </output>
            <p>
              Rounding error
              <br />
              0.00000000 ✓
            </p>
          </article>
        </div>
      </section>
      <section className="en447-practice">
        <h3>✎ Your Turn: Practice Challenge</h3>
        <p>
          Enter the expression below, compute both results, and report the
          rounding error.
        </p>
        <div>
          <label>
            Expression
            <input value="4π − √3 + 2/7" readOnly />
          </label>
          <label>
            Your Exact Result
            <input
              aria-label="Practice exact result"
              value={practice[0]}
              onChange={(event) => {
                setPractice([event.target.value, practice[1], practice[2]]);
                setFeedback("");
              }}
            />
          </label>
          <label>
            Your Numeric Result (8 digits)
            <input
              aria-label="Practice numeric result"
              value={practice[1]}
              onChange={(event) => {
                setPractice([practice[0], event.target.value, practice[2]]);
                setFeedback("");
              }}
            />
          </label>
          <label>
            Rounding Error
            <input
              aria-label="Practice rounding error"
              value={practice[2]}
              onChange={(event) => {
                setPractice([practice[0], practice[1], event.target.value]);
                setFeedback("");
              }}
            />
          </label>
          <button
            data-lesson-control="exact-practice-check"
            onClick={() =>
              act(() =>
                setFeedback(
                  normalize(practice[0]) === normalize(challenge.exact) &&
                    Math.abs(Number(practice[1]) - Number(challenge.rounded)) <
                      1e-8 &&
                    Math.abs(Number(practice[2]) - Number(challenge.error)) <
                      1e-8
                    ? "correct"
                    : "incorrect",
                ),
              )
            }
          >
            ▣ Check Answer
          </button>
        </div>
        <output className={feedback}>
          {feedback === "correct"
            ? `Correct: ${challenge.exact} ≈ ${challenge.rounded}`
            : feedback === "incorrect"
              ? "Recheck the exact form, decimal, and rounding error."
              : ""}
        </output>
      </section>
      <nav className="en447-nav">
        <a href="/lessons/symbolic-mathematics/446-assumptions">
          <ArrowLeft />
          <span>
            <small>Previous</small>Assumptions
          </span>
        </a>
        <a href="/lessons/symbolic-mathematics/448-step-by-step-algebra">
          <span>
            <small>Next</small>Step-by-Step Algebra
          </span>
          <ArrowRight />
        </a>
      </nav>
    </section>
  );
}

function exactNumeric(expression: string, precision: number) {
  const key = normalize(expression);
  let exact: string, value: number, steps: string[];
  if (key === normalize(initialExpression)) {
    exact = "353/4 + √2";
    value = 353 / 4 + Math.sqrt(2);
    steps = ["2 × 3² × 5 − 7/4 + √2", "= 90 − 7/4 + √2", "= 353/4 + √2"];
  } else if (key === "sqrt(2)" || key === "√2") {
    exact = "√2";
    value = Math.sqrt(2);
    steps = ["√2"];
  } else if (key === "1/3") {
    exact = "1/3";
    value = 1 / 3;
    steps = ["1/3"];
  } else if (key === "2*pi" || key === "2π") {
    exact = "2π";
    value = 2 * Math.PI;
    steps = ["2π"];
  } else if (key === "3^2+2*sqrt(5)" || key === "9+2√5") {
    exact = "9 + 2√5";
    value = 9 + 2 * Math.sqrt(5);
    steps = ["3² + 2√5", "= 9 + 2√5"];
  } else if (key === "exp(1/2)" || key === "e^(1/2)") {
    exact = "√e";
    value = Math.sqrt(Math.E);
    steps = ["e^(1/2)", "= √e"];
  } else if (key === "4*pi-sqrt(3)+2/7" || key === "4π-√3+2/7") {
    exact = "4π − √3 + 2/7";
    value = 4 * Math.PI - Math.sqrt(3) + 2 / 7;
    steps = [exact];
  } else {
    exact = "Unsupported expression";
    value = Number.NaN;
    steps = ["Use a listed exact-expression form."];
  }
  const rounded = Number.isFinite(value) ? roundTo(value, precision) : "—",
    error = Number.isFinite(value)
      ? Math.abs(Number(rounded) - value).toExponential(2)
      : "—";
  return { exact, value, rounded, error, steps };
}
function roundTo(value: number, digits: number) {
  return value.toFixed(digits).replace(/0+$/, "").replace(/\.$/, "");
}
function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/−/g, "-")
    .replace(/×/g, "*")
    .replace(/²/g, "^2")
    .replace(/√(\d+)/g, "sqrt($1)")
    .replace(/π/g, "pi");
}
function displayInput(value: string) {
  return value
    .replace("sqrt(2)", "√2")
    .replace("pi", "π")
    .replace("sqrt(5)", "√5")
    .replace("exp(1/2)", "e½")
    .replace(/\^2/g, "²");
}
function PlaceValue({ value }: { value: string }) {
  const digits = value.replace("-", "").split(""),
    dot = digits.indexOf(".");
  return (
    <table>
      <thead>
        <tr>
          <th>Tens</th>
          <th>Ones</th>
          <th>.</th>
          <th>Tenths</th>
          <th>Hundredths</th>
          <th>…</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{dot > 1 ? digits[dot - 2] : "0"}</td>
          <td>{dot > 0 ? digits[dot - 1] : digits[0]}</td>
          <td>.</td>
          <td>{dot >= 0 ? (digits[dot + 1] ?? "0") : "0"}</td>
          <td>{dot >= 0 ? (digits[dot + 2] ?? "0") : "0"}</td>
          <td>…</td>
        </tr>
      </tbody>
    </table>
  );
}
