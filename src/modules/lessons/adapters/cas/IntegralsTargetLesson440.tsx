import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Check,
  Eye,
  Hand,
  Info,
  Lightbulb,
  RefreshCw,
  Sigma,
  Target,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./IntegralsTargetLesson440.css";

type Term = { coefficient: number; power: number };
type Feedback = "idle" | "correct" | "incorrect";
const INITIAL = "3*x^2+2",
  CHALLENGES = ["5*x^4-3*x+7", "4*x^3+6*x-5", "2*x^5-8*x^2+1"];
export default function IntegralsTargetLesson440({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [input, setInput] = useState(INITIAL),
    [tab, setTab] = useState("Interaction + visualization"),
    [auto, setAuto] = useState(true),
    [integrated, setIntegrated] = useState(true),
    [challengeIndex, setChallengeIndex] = useState(0),
    [answer, setAnswer] = useState(""),
    [feedback, setFeedback] = useState<Feedback>("idle");
  const parsed = useMemo(() => parsePolynomial(input), [input]),
    challenge = CHALLENGES[challengeIndex],
    challengeTerms = useMemo(() => parsePolynomial(challenge), [challenge]),
    challengeAnswer = integralText(challengeTerms.terms),
    answerTerms = useMemo(
      () => parsePolynomial(answer.replace(/\+?c/gi, "")),
      [answer],
    );
  const act = (run: () => void) => {
    run();
    onInteraction();
  };
  useEffect(() => {
    setInput(INITIAL);
    setTab("Interaction + visualization");
    setAuto(true);
    setIntegrated(true);
    setChallengeIndex(0);
    setAnswer("");
    setFeedback("idle");
  }, [resetToken]);
  const check = () =>
    act(() =>
      setFeedback(
        answerTerms.valid &&
          sameTerms(deriveTerms(answerTerms.terms), challengeTerms.terms)
          ? "correct"
          : "incorrect",
      ),
    );
  return (
    <section
      className="in440-page"
      data-testid="symbolic-cas-mockup-0346"
      data-dedicated-lesson="440"
      data-object-model="parsed-polynomial-exact-power-rule-antiderivative-derivative-verification-challenge"
      data-input={input}
      data-valid={parsed.valid}
      data-antiderivative={
        parsed.valid ? integralText(parsed.terms) : "invalid"
      }
      data-auto={auto}
      data-challenge={challenge}
      data-feedback={feedback}
    >
      <h2 className="sr-only">Integrals</h2>
      <nav className="in440-tabs">
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
            data-lesson-control={`integral-tab-${index}`}
            onClick={() => act(() => setTab(name))}
          >
            {index === 0 && <Eye />}
            {index === 3 && <Sigma />}
            {name}
          </button>
        ))}
      </nav>
      <section className="in440-flow">
        {[
          [
            Eye,
            "1 Observe",
            "See the integrand and its structure. Look for sums, factors, and power rules.",
          ],
          [
            Hand,
            "2 Manipulate",
            "Use CAS to integrate symbolically. A constant +C always appears.",
          ],
          [
            Lightbulb,
            "3 Notice",
            "Integrating produces an antiderivative family. Check by differentiating.",
          ],
          [
            Brain,
            "4 Understand",
            "Integrals undo derivatives. All antiderivatives differ by a constant.",
          ],
        ].map(([Icon, title, text], i) => (
          <article key={String(title)}>
            <Icon />
            <span>
              <b>{String(title)}</b>
              <p>{String(text)}</p>
            </span>
            {i < 3 && <ArrowRight />}
          </article>
        ))}
      </section>
      <section className="in440-work">
        <header>
          <h2>CAS Workspace</h2>
          <label>
            <input
              data-lesson-control="integral-auto-check"
              type="checkbox"
              checked={auto}
              onChange={(e) => act(() => setAuto(e.target.checked))}
            />
            <Check /> Auto-check: {auto ? "On" : "Off"}
          </label>
        </header>
        <div className="in440-process">
          <article>
            <h3>
              <i>1</i> INPUT: Integrand
            </h3>
            <input
              data-lesson-control="integral-input"
              aria-label="Integrand"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setIntegrated(false);
              }}
            />
            <aside>
              <Lightbulb />
              <b>Tip:</b> Type with * for multiply and ^ for powers.
            </aside>
            {!parsed.valid && <em>Enter a polynomial such as 3*x^2+2.</em>}
          </article>
          <ArrowRight />
          <article>
            <h3>
              <i>2</i> PROCESS: Integrate symbolically
            </h3>
            <button
              data-lesson-control="integral-run"
              onClick={() => act(() => setIntegrated(true))}
            >
              Integrate &nbsp; ∫
            </button>
            <aside>
              <b>Rule used</b>
              <p>∫ x^n dx = x^(n+1)/(n+1) + C</p>
              <p>Linearity applies term by term.</p>
            </aside>
          </article>
          <ArrowRight />
          <article>
            <h3>
              <i>3</i> OUTPUT: Antiderivative (family)
            </h3>
            <output>
              {integrated && parsed.valid ? integralText(parsed.terms) : "—"}
            </output>
            {integrated && parsed.valid && (
              <strong>
                <Check /> Correct
              </strong>
            )}
            <p>This represents the family F(x) + C for any real constant C.</p>
          </article>
        </div>
        <div className="in440-verify">
          <b>
            <i>4</i> VERIFY: Differentiate the result
          </b>
          <output>
            d/dx ({parsed.valid ? integralText(parsed.terms) : "—"})
          </output>
          <span>=</span>
          <output>
            {integrated && parsed.valid
              ? polynomialText(deriveTerms(integrateTerms(parsed.terms)))
              : "—"}
          </output>
          {integrated && parsed.valid && (
            <strong>
              <Check /> Verified
            </strong>
          )}
        </div>
        <footer>
          <Info /> Every antiderivative differs by a constant +C. There are
          infinitely many correct answers.
        </footer>
      </section>
      <section className="in440-cards">
        <article>
          <h2>
            <Target /> Worked Example
          </h2>
          <p>Find ∫ (3x² + 2) dx.</p>
          <b>Step 1</b>
          <p>Apply linearity.</p>
          <b>Step 2</b>
          <p>Integrate term by term.</p>
          <b>Step 3</b>
          <p>Use the Power Rule.</p>
          <output>x³ + 2x + C</output>
          <small>Domain: All real numbers</small>
        </article>
        <article>
          <h2>
            <Sigma /> Key Rule: Power Rule
          </h2>
          <p>For any real number n != -1,</p>
          <strong>∫ x^n dx = x^(n+1)/(n+1) + C</strong>
          <h3>Special cases</h3>
          <p>• ∫ k dx = kx + C</p>
          <p>• ∫ (f+g) dx = ∫f dx + ∫g dx</p>
          <p>• Always include +C</p>
        </article>
        <article className="pitfall">
          <h2>
            <TriangleAlert /> Common Pitfall
          </h2>
          <h3>Forgetting the Constant +C.</h3>
          <p>Many students omit +C.</p>
          <h3>Why it's wrong:</h3>
          <p>All antiderivatives form a family F(x)+C.</p>
          <h3>Remember:</h3>
          <p>Different constants have the same derivative.</p>
        </article>
      </section>
      <section className="in440-practice">
        <header>
          <span>
            <h2>Try It: Your Turn</h2>
            <p>Find the antiderivative and verify.</p>
          </span>
          <button
            data-lesson-control="integral-new-challenge"
            onClick={() =>
              act(() => {
                setChallengeIndex((i) => (i + 1) % CHALLENGES.length);
                setAnswer("");
                setFeedback("idle");
              })
            }
          >
            <RefreshCw /> New challenge
          </button>
        </header>
        <h3>Integrate: &nbsp; {challenge}</h3>
        <div>
          <label>
            <b>1 INPUT</b>
            <input value={challenge} readOnly />
          </label>
          <span>=</span>
          <button
            data-lesson-control="integral-practice-run"
            onClick={() => act(() => setAnswer(challengeAnswer))}
          >
            Integrate &nbsp; ∫
          </button>
          <label>
            <b>3 YOUR ANSWER (family)</b>
            <input
              data-lesson-control="integral-answer"
              aria-label="Challenge antiderivative"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </label>
          <label>
            <b>4 VERIFY</b>
            <output>
              {answerTerms.valid && answer
                ? polynomialText(deriveTerms(answerTerms.terms))
                : ""}
            </output>
          </label>
        </div>
        <footer>
          <span>
            {feedback === "correct"
              ? "Verified derivative matches the integrand."
              : feedback === "incorrect"
                ? "Differentiate your answer and compare coefficients."
                : "Check your answer and verification to earn full credit."}
          </span>
          <button
            data-lesson-control="integral-check"
            disabled={!answer}
            onClick={check}
          >
            <Check /> Check Answer
          </button>
        </footer>
      </section>
      <nav className="in440-nav">
        <a href="/lessons/symbolic-mathematics/439-derivatives">
          <ArrowLeft />
          <span>
            <small>Previous</small>Derivatives
          </span>
        </a>
        <a href="/lessons/symbolic-mathematics/441-limits">
          <span>
            <small>Next</small>Limits
          </span>
          <ArrowRight />
        </a>
      </nav>
    </section>
  );
}
function parsePolynomial(source: string) {
  const clean = source
    .toLowerCase()
    .replaceAll(" ", "")
    .replace(/^-/, "-1*")
    .replaceAll("-", "+-");
  if (!clean || /[()]/.test(clean))
    return { valid: false, terms: [] as Term[] };
  try {
    const terms = clean
      .split("+")
      .filter(Boolean)
      .map((part) => {
        if (!part.includes("x"))
          return { coefficient: parseScalar(part), power: 0 };
        const [before, after] = part.split("x"),
          coefficient =
            before === ""
              ? 1
              : before === "-"
                ? -1
                : parseScalar(before.replace(/\*$/, "")),
          power = after.startsWith("^") ? Number(after.slice(1)) : 1;
        if (
          !Number.isFinite(coefficient) ||
          !Number.isInteger(power) ||
          power < 0
        )
          throw Error();
        return { coefficient, power };
      });
    return {
      valid:
        terms.length > 0 && terms.every((t) => Number.isFinite(t.coefficient)),
      terms: combine(terms),
    };
  } catch {
    return { valid: false, terms: [] as Term[] };
  }
}
function parseScalar(source: string) {
  if (source.includes("/")) {
    const [numerator, denominator] = source.split("/").map(Number);
    return numerator / denominator;
  }
  return Number(source);
}
function combine(terms: Term[]) {
  const map = new Map<number, number>();
  terms.forEach((t) =>
    map.set(t.power, (map.get(t.power) || 0) + t.coefficient),
  );
  return [...map]
    .map(([power, coefficient]) => ({ coefficient, power }))
    .filter((t) => Math.abs(t.coefficient) > 1e-9)
    .sort((a, b) => b.power - a.power);
}
function integrateTerms(terms: Term[]) {
  return terms.map((t) => ({
    coefficient: t.coefficient / (t.power + 1),
    power: t.power + 1,
  }));
}
function deriveTerms(terms: Term[]) {
  return combine(
    terms
      .filter((t) => t.power)
      .map((t) => ({
        coefficient: t.coefficient * t.power,
        power: t.power - 1,
      })),
  );
}
function sameTerms(a: Term[], b: Term[]) {
  const aa = combine(a),
    bb = combine(b);
  return (
    aa.length === bb.length &&
    aa.every(
      (t, i) =>
        t.power === bb[i].power &&
        Math.abs(t.coefficient - bb[i].coefficient) < 1e-7,
    )
  );
}
function integralText(terms: Term[]) {
  return `${polynomialText(integrateTerms(terms))} + C`;
}
function polynomialText(terms: Term[]) {
  return (
    combine(terms)
      .map((t, i) => {
        const sign = t.coefficient < 0 ? "-" : i ? "+" : "",
          abs = Math.abs(t.coefficient),
          coef = t.power && Math.abs(abs - 1) < 1e-9 ? "" : fraction(abs),
          variable = t.power === 0 ? "" : t.power === 1 ? "x" : `x^${t.power}`;
        return `${sign}${coef}${variable}`;
      })
      .join(" ") || "0"
  );
}
function fraction(value: number) {
  if (Number.isInteger(value)) return String(value);
  for (let d = 2; d <= 12; d++) {
    const n = Math.round(value * d);
    if (Math.abs(n / d - value) < 1e-8) return `${n}/${d}`;
  }
  return String(Number(value.toFixed(4)));
}
