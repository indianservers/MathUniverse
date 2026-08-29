import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Brain,
  Check,
  CheckCircle2,
  Eye,
  Hand,
  Lightbulb,
  RefreshCcw,
  Scale,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./SimplifyTargetLesson429.css";

type Factor = { root: number; label: string };
type RationalModel = {
  valid: boolean;
  coefficient: number;
  numerator: Factor[];
  denominator: Factor[];
  remainingNumerator: Factor[];
  remainingDenominator: Factor[];
  cancelled: Factor[];
  restrictions: number[];
  simplified: string;
};
const INITIAL = "2*(x+3)*(x-2)/(x*(x+3))";

export default function SimplifyTargetLesson429({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [expression, setExpression] = useState(INITIAL);
  const [simplified, setSimplified] = useState(true);
  const [testValue, setTestValue] = useState(1);
  const [checkedValues, setCheckedValues] = useState<number[]>([1, 2]);
  const [answer, setAnswer] = useState("");
  const [domainAnswer, setDomainAnswer] = useState("");
  const [feedback, setFeedback] = useState<"idle" | "correct" | "incorrect">(
    "idle",
  );
  const model = useMemo(() => simplifyRational(expression), [expression]);
  useEffect(() => {
    setExpression(INITIAL);
    setSimplified(true);
    setTestValue(1);
    setCheckedValues([1, 2]);
    setAnswer("");
    setDomainAnswer("");
    setFeedback("idle");
  }, [resetToken]);
  const evaluate = (value: number) => ({
    original: evaluateRational(model, value, false),
    reduced: evaluateRational(model, value, true),
  });
  const test = () => {
    if (!model.restrictions.includes(testValue))
      setCheckedValues((current) =>
        current.includes(testValue) ? current : [...current, testValue],
      );
    onInteraction();
  };
  const checkPractice = () => {
    const answerOk = normalize(answer) === "4(x+2)/x";
    const roots = domainAnswer
      .split(/[, ]+/)
      .map(Number)
      .filter(Number.isFinite)
      .sort((a, b) => a - b);
    setFeedback(
      answerOk && roots.join(",") === "0,1" ? "correct" : "incorrect",
    );
    onInteraction();
  };
  return (
    <section
      className="simp429-page"
      data-testid="symbolic-cas-mockup-0335"
      data-dedicated-lesson="429"
      data-object-model="factor-multiset-cancellation-preserved-domain-equivalence-practice"
      data-expression={expression}
      data-valid={model.valid}
      data-simplified={model.simplified}
      data-cancelled={model.cancelled.map((f) => f.label).join("|")}
      data-restrictions={model.restrictions.join(",")}
      data-test-value={testValue}
      data-checked-values={checkedValues.join(",")}
      data-feedback={feedback}
    >
      <span className="sr-only">
        Simplify. Dedicated rational factor cancellation with domain
        restrictions.
      </span>
      <section className="simp429-flow">
        {[
          [
            Eye,
            "OBSERVE",
            "Expressions can often be rewritten in simpler, equivalent forms.",
          ],
          [
            Hand,
            "MANIPULATE",
            "Use the CAS to transform an expression step by step.",
          ],
          [
            Lightbulb,
            "NOTICE",
            "Common factors cancel; domain restrictions appear.",
          ],
          [
            Brain,
            "UNDERSTAND",
            "Simplification produces an equivalent expression with the same domain.",
          ],
        ].map(([Icon, title, text], index) => (
          <article key={String(title)}>
            <Icon />
            <div>
              <h3>{String(title)}</h3>
              <p>{String(text)}</p>
            </div>
            {index < 3 && <ArrowRight />}
          </article>
        ))}
      </section>
      <section className="simp429-workspace">
        <article className="simp429-main">
          <h2>CAS WORKSPACE</h2>
          <div className="simp429-stage">
            <i>1</i>
            <b>Input</b>
            <div>
              <label>
                Enter an expression
                <input
                  data-lesson-control="simplify-expression"
                  aria-label="Rational expression"
                  value={expression}
                  onChange={(event) => {
                    setExpression(event.target.value);
                    setSimplified(false);
                    setCheckedValues([]);
                    onInteraction();
                  }}
                />
              </label>
              <p>Domain: {restrictionText(model.restrictions)}</p>
            </div>
          </div>
          <div className="simp429-stage active">
            <i>2</i>
            <b>Simplify</b>
            <div>
              <h3>CAS simplification (cancellation shown)</h3>
              <p className="simp429-fraction">
                <span>{factorText(model.coefficient, model.numerator)}</span>
                <span>{factorText(1, model.denominator)}</span>
                <ArrowRight />
                <span>{model.simplified}</span>
              </p>
              <button
                type="button"
                data-lesson-control="simplify-run"
                onClick={() => {
                  setSimplified(true);
                  onInteraction();
                }}
              >
                Cancel common factor:{" "}
                {model.cancelled.map((f) => f.label).join(", ") || "none"}
              </button>
            </div>
          </div>
          <div className="simp429-stage result">
            <i>3</i>
            <b>Result</b>
            <div>
              <h3>Simplified result</h3>
              <output>
                {simplified ? model.simplified : "Apply simplification"}
              </output>
              {simplified && (
                <span>
                  <Check />
                  Equivalent
                </span>
              )}
              <p>Domain: {restrictionText(model.restrictions)}</p>
            </div>
          </div>
        </article>
        <aside className="simp429-checks">
          <h2>DOMAIN RESTRICTIONS</h2>
          <p>Exclude values that make the denominator zero.</p>
          <h3>From input:</h3>
          <strong>
            {model.denominator.map((f) => f.label).join(" ")} != 0
          </strong>
          <strong>{restrictionText(model.restrictions)}</strong>
          <hr />
          <h2>EQUIVALENCE CHECK</h2>
          <p>Test values not excluded from the domain.</p>
          <label>
            x ={" "}
            <input
              data-lesson-control="simplify-test-value"
              aria-label="Equivalence test value"
              type="number"
              value={testValue}
              onChange={(e) => setTestValue(Number(e.target.value))}
            />
            <button
              type="button"
              data-lesson-control="simplify-test-check"
              onClick={test}
            >
              Check
            </button>
          </label>
          {checkedValues.map((value) => {
            const values = evaluate(value);
            return (
              <div className="simp429-value" key={value}>
                <b>x = {value}</b>
                <span>Input = {format(values.original)}</span>
                <span>
                  Simplified = {format(values.reduced)} <Check />
                </span>
              </div>
            );
          })}
          <p className="simp429-match">
            Values match. Expressions are equivalent.
          </p>
        </aside>
      </section>
      <section className="simp429-learning">
        <article>
          <h2>THE RULE (WHAT MADE IT WORK)</h2>
          <p>Cancel common factors, but keep the domain restrictions.</p>
          <strong>A(x)B(x) / A(x)C(x) = B(x) / C(x)</strong>
          <p>if A(x) != 0</p>
          <p>Here, A(x)=x+3. Must keep x != -3 and x != 0.</p>
          <Scale />
        </article>
        <article>
          <h2>
            <AlertTriangle />
            COMMON MISCONCEPTION
          </h2>
          <p>
            Cancelling terms can create extraneous solutions if you ignore the
            domain.
          </p>
          <div>
            <b>Solve (x+3)/(x+3)=1</b>
            <p>
              <b>Incorrect:</b> Cancel (x+3) to get 1=1, all x.
            </p>
            <p>
              <b>Correct:</b> Domain requires x != -3.
            </p>
          </div>
        </article>
        <article>
          <h2>WORKED EXAMPLE</h2>
          <p>Simplify completely.</p>
          <strong>3x^2-12x / (x^2-4)</strong>
          <p>= 3x(x-4) / ((x-2)(x+2))</p>
          <p>= 3x / (x+2)</p>
          <p>Domain: x != +/-2</p>
          <CheckCircle2 />
        </article>
      </section>
      <section className="simp429-practice">
        <header>
          <h2>TRY IT: SIMPLIFY THIS EXPRESSION</h2>
          <p>Simplify completely. Show cancellations. State the domain.</p>
        </header>
        <div>
          <strong>4(x-1)(x+2) / x(x-1)</strong>
          <label>
            Your simplified answer
            <input
              data-lesson-control="simplify-practice-answer"
              aria-label="Simplified practice answer"
              value={answer}
              placeholder="e.g., 4(x+2)/x"
              onChange={(e) => {
                setAnswer(e.target.value);
                setFeedback("idle");
              }}
            />
          </label>
          <label>
            Domain (exclude values)<span>x !=</span>
            <input
              data-lesson-control="simplify-practice-domain"
              aria-label="Practice excluded values"
              value={domainAnswer}
              placeholder="e.g., 0, 1"
              onChange={(e) => {
                setDomainAnswer(e.target.value);
                setFeedback("idle");
              }}
            />
          </label>
          <aside>
            <h3>Hints</h3>
            <p>- Cancel the common factor (x-1).</p>
            <p>- Keep values that make the original denominator zero.</p>
            <button
              type="button"
              data-lesson-control="simplify-practice-check"
              onClick={checkPractice}
            >
              Check Answer
            </button>
            <button
              type="button"
              data-lesson-control="simplify-practice-reset"
              aria-label="Reset simplify practice"
              onClick={() => {
                setAnswer("");
                setDomainAnswer("");
                setFeedback("idle");
                onInteraction();
              }}
            >
              <RefreshCcw />
            </button>
          </aside>
        </div>
        {feedback !== "idle" && (
          <p role="status" className={feedback}>
            {feedback === "correct"
              ? "Correct simplification and domain."
              : "Check the cancelled factor and both excluded values."}
          </p>
        )}
      </section>
      <nav className="simp429-nav" aria-label="Adjacent lessons">
        <a href="/lessons/symbolic-mathematics/428-symbolic-evaluation">
          <ArrowLeft />
          <span>
            <small>Previous</small>Symbolic Evaluation
          </span>
        </a>
        <a href="/lessons/symbolic-mathematics/430-expand">
          <span>
            <small>Next</small>Expand
          </span>
          <ArrowRight />
        </a>
      </nav>
    </section>
  );
}

function simplifyRational(expression: string): RationalModel {
  const cleaned = expression.replaceAll(" ", "");
  const slash = cleaned.indexOf("/");
  if (slash < 0)
    return {
      valid: false,
      coefficient: 1,
      numerator: [],
      denominator: [],
      remainingNumerator: [],
      remainingDenominator: [],
      cancelled: [],
      restrictions: [],
      simplified: "Invalid expression",
    };
  const top = parseProduct(cleaned.slice(0, slash)),
    bottom = parseProduct(cleaned.slice(slash + 1));
  const remainingDenominator = [...bottom.factors],
    cancelled: Factor[] = [];
  const remainingNumerator = top.factors.filter((f) => {
    const index = remainingDenominator.findIndex((d) => d.root === f.root);
    if (index < 0) return true;
    cancelled.push(f);
    remainingDenominator.splice(index, 1);
    return false;
  });
  const restrictions = [...new Set(bottom.factors.map((f) => f.root))].sort(
    (a, b) => a - b,
  );
  return {
    valid: top.valid && bottom.valid,
    coefficient: top.coefficient / bottom.coefficient,
    numerator: top.factors,
    denominator: bottom.factors,
    remainingNumerator,
    remainingDenominator,
    cancelled,
    restrictions,
    simplified: fractionText(
      top.coefficient / bottom.coefficient,
      remainingNumerator,
      remainingDenominator,
    ),
  };
}
function parseProduct(value: string) {
  let source = value.replace(/^\((.*)\)$/, "$1"),
    coefficient = 1,
    valid = true;
  const factors: Factor[] = [];
  const number = source.match(/^-?\d+(?:\.\d+)?/);
  if (number) {
    coefficient = Number(number[0]);
    source = source.slice(number[0].length).replace(/^\*/, "");
  }
  const regex = /\*?\(x([+-]\d+)\)|\*?x/g;
  let match;
  while ((match = regex.exec(source))) {
    const root = match[0].replace("*", "") === "x" ? 0 : -Number(match[1]);
    factors.push({
      root,
      label: root === 0 ? "x" : root < 0 ? `(x+${-root})` : `(x-${root})`,
    });
  }
  if (!factors.length) valid = false;
  return { coefficient, factors, valid };
}
function factorText(coefficient: number, factors: Factor[]) {
  return `${coefficient === 1 ? "" : coefficient}${factors.map((f) => f.label).join("") || "1"}`;
}
function fractionText(coefficient: number, top: Factor[], bottom: Factor[]) {
  const numerator = factorText(coefficient, top),
    denominator = factorText(1, bottom);
  return denominator === "1" ? numerator : `${numerator}/${denominator}`;
}
function restrictionText(values: number[]) {
  return values.length ? `x != ${values.join(", ")}` : "no restrictions";
}
function evaluateRational(model: RationalModel, x: number, reduced: boolean) {
  if (model.restrictions.includes(x)) return Number.NaN;
  const product = (factors: Factor[]) =>
    factors.reduce((value, f) => value * (x - f.root), 1);
  return (
    (model.coefficient *
      product(reduced ? model.remainingNumerator : model.numerator)) /
    product(reduced ? model.remainingDenominator : model.denominator)
  );
}
function normalize(value: string) {
  return value.replaceAll(" ", "").replaceAll("*", "").replaceAll("−", "-");
}
function format(value: number) {
  return Number.isFinite(value)
    ? Number(value.toFixed(4)).toString()
    : "undefined";
}
