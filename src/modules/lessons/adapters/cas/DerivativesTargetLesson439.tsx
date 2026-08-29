import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  Hand,
  Lightbulb,
  Play,
  Sigma,
  Target,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./DerivativesTargetLesson439.css";

type Feedback = "idle" | "correct" | "incorrect";
export default function DerivativesTargetLesson439({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [k, setK] = useState(2),
    [point, setPoint] = useState(1),
    [tab, setTab] = useState("Interaction + visualization"),
    [actions, setActions] = useState(0),
    [practice, setPractice] = useState(["", ""]),
    [feedback, setFeedback] = useState<Feedback>("idle"),
    [solution, setSolution] = useState(false);
  const model = useMemo(() => derivativeModel(k, point), [k, point]);
  const act = (run: () => void) => {
    run();
    setActions((v) => v + 1);
    onInteraction();
  };
  useEffect(() => {
    setK(2);
    setPoint(1);
    setTab("Interaction + visualization");
    setActions(0);
    setPractice(["", ""]);
    setFeedback("idle");
    setSolution(false);
  }, [resetToken]);
  const check = () =>
    act(() =>
      setFeedback(
        normalize(practice[0]) ===
          normalize("(3x^5-10x^4+x^3-6x^2+2x+4)/(x-2)^3") &&
          normalize(practice[1]) === normalize("6x-6")
          ? "correct"
          : "incorrect",
      ),
    );
  return (
    <section
      className="dv439-page"
      data-testid="symbolic-cas-mockup-0345"
      data-dedicated-lesson="439"
      data-object-model="quotient-product-chain-symbolic-derivative-domain-tangent-practice"
      data-k={k}
      data-point={point}
      data-numerator={model.numerator.join(",")}
      data-slope={model.slope}
      data-actions={actions}
      data-feedback={feedback}
    >
      <h2 className="sr-only">Derivatives</h2>
      <nav className="dv439-tabs">
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
            data-lesson-control={`derivative-tab-${index}`}
            onClick={() => act(() => setTab(name))}
          >
            {index === 0 && <Eye />}
            {index === 3 && <Sigma />}
            {name}
          </button>
        ))}
      </nav>
      <div className="dv439-grid">
        <main className="dv439-lab">
          <header>
            <span>
              <b>INTERACTION + VISUALIZATION</b>
              <h2>Work directly on the model</h2>
            </span>
            <strong>
              <Check /> All steps correct
            </strong>
            <em>{actions} actions</em>
          </header>
          <section className="dv439-engine">
            <h3>Derivatives - reusable CAS engine</h3>
            <p>
              Differentiate with step-by-step rules and tangent verification.
            </p>
            <div className="dv439-model">
              <aside>
                <h4>Enter function f(x)</h4>
                <output>(x³ + {k}x)(x² - 1) / (x - 2)²</output>
                <label>
                  Linear coefficient k
                  <input
                    type="number"
                    data-lesson-control="derivative-k"
                    value={k}
                    onChange={(e) => act(() => setK(Number(e.target.value)))}
                  />
                </label>
                <label>
                  Point a (for tangent check)
                  <input
                    type="number"
                    data-lesson-control="derivative-point"
                    value={point}
                    onChange={(e) =>
                      act(() => setPoint(Number(e.target.value)))
                    }
                  />
                </label>
                <button
                  data-lesson-control="derivative-run"
                  onClick={() => act(() => {})}
                >
                  <Play /> Differentiate
                </button>
              </aside>
              <section className="dv439-tree">
                <h4>Derivative tree with rule annotations</h4>
                <p className="function">f(x) = u / v</p>
                <Node
                  tone="blue"
                  title="Quotient Rule"
                  text="(u'v - uv') / v²"
                />
                <div className="branches">
                  <Node title="u = (x³+kx)(x²-1)" text="Product Rule" />
                  <Node title="v = (x-2)²" text="Chain Rule" />
                </div>
                <div className="branches">
                  <Node
                    title={`u' = ${poly(model.uPrime)}`}
                    text="Differentiate factors"
                  />
                  <Node title="v' = 2(x-2)" text="Power + chain" />
                </div>
                <Node
                  tone="purple"
                  title="Assemble and simplify"
                  text={`f'(x) = ${model.derivativeText}`}
                />
              </section>
              <section className="dv439-steps">
                <h4>Simplification steps</h4>
                <p>u = {poly(model.u)}</p>
                <p>u' = {poly(model.uPrime)}</p>
                <p>v = (x - 2)²</p>
                <p>v' = 2(x - 2)</p>
                <p>u'v - uv'</p>
                <strong>f'(x) = {model.derivativeText}</strong>
                <article>
                  <h4>Tangent verification at a = {point}</h4>
                  <p>
                    f({point}) = {fmt(model.value)}
                  </p>
                  <p>
                    f'({point}) = {fmt(model.slope)}
                  </p>
                  <b>Tangent: y = {model.tangent}</b>
                </article>
              </section>
            </div>
            <footer>
              {[
                [
                  Eye,
                  "1 Observe",
                  "See the function, domain, and all rule-based steps.",
                ],
                [
                  Hand,
                  "2 Manipulate",
                  "Change k or a to explore how the derivative updates.",
                ],
                [
                  Lightbulb,
                  "3 Notice",
                  "Each rule transforms parts systematically.",
                ],
                [
                  Target,
                  "4 Understand",
                  "The derivative is verified by the tangent.",
                ],
              ].map(([Icon, title, text]) => (
                <article key={String(title)}>
                  <Icon />
                  <span>
                    <b>{String(title)}</b>
                    <p>{String(text)}</p>
                  </span>
                </article>
              ))}
            </footer>
          </section>
        </main>
        <aside className="dv439-side">
          <article>
            <h3>Key formula / rules</h3>
            <Rule title="Quotient Rule" text="(u/v)' = (u'v - uv')/v²" />
            <Rule title="Product Rule" text="(uv)' = u'v + uv'" />
            <Rule title="Chain Rule" text="(g(h))' = g'(h)h'" />
          </article>
          <article className="good">
            <h3>
              <Check /> What's happening?
            </h3>
            <p>✓ Applied Quotient Rule.</p>
            <p>✓ Expanded u using Product Rule.</p>
            <p>✓ Applied Chain Rule to v.</p>
            <p>✓ Assembled and simplified.</p>
          </article>
          <article className="bad">
            <h3>
              <TriangleAlert /> Common misconception
            </h3>
            <p>
              Forgetting the negative sign on -uv' in the Quotient Rule flips
              the derivative.
            </p>
            <b>(u/v)' = (u'v - uv')/v²</b>
          </article>
          <article>
            <h3>Domain & behavior</h3>
            <p>Domain: x != 2</p>
            <p>Vertical asymptote: x = 2</p>
            <p>Numerator degree: {model.numerator.length - 1}</p>
          </article>
        </aside>
      </div>
      <section className="dv439-bottom">
        <article>
          <h3>Worked example (one complete solution)</h3>
          <p>Find f'(x) and the tangent line at x = {point}.</p>
          <output>{model.derivativeText}</output>
          <b>Tangent line: y = {model.tangent}</b>
        </article>
        <article>
          <h3>Verify your understanding</h3>
          <p>✓ Domain excludes x = 2.</p>
          <p>✓ Quotient → Product → Chain.</p>
          <p>✓ Simplification is linked to the tangent.</p>
        </article>
        <article>
          <h3>Quick practice</h3>
          <p>For the target function at x = 1:</p>
          <label>
            f'(x) ={" "}
            <input
              data-lesson-control="derivative-practice-expression"
              value={practice[0]}
              onChange={(e) => setPractice([e.target.value, practice[1]])}
            />
          </label>
          <label>
            Tangent y ={" "}
            <input
              data-lesson-control="derivative-practice-tangent"
              value={practice[1]}
              onChange={(e) => setPractice([practice[0], e.target.value])}
            />
          </label>
          <button data-lesson-control="derivative-check" onClick={check}>
            Check answer
          </button>
          <button
            data-lesson-control="derivative-solution"
            onClick={() => act(() => setSolution((v) => !v))}
          >
            Show solution
          </button>
          {solution && <em>f'(x)=(3x^5-10x^4+x^3-6x^2+2x+4)/(x-2)^3; y=6x-6</em>}
          {feedback !== "idle" && (
            <strong className={feedback}>
              {feedback === "correct"
                ? "Correct."
                : "Check the quotient-rule sign and tangent."}
            </strong>
          )}
        </article>
      </section>
      <nav className="dv439-nav">
        <a href="/lessons/symbolic-mathematics/438-polynomial-division">
          <ArrowLeft />
          <span>
            <small>Previous</small>Polynomial Division
          </span>
        </a>
        <a href="/lessons/symbolic-mathematics/440-integrals">
          <span>
            <small>Next</small>Integrals
          </span>
          <ArrowRight />
        </a>
      </nav>
    </section>
  );
}
function Node({
  title,
  text,
  tone = "",
}: {
  title: string;
  text: string;
  tone?: string;
}) {
  return (
    <div className={`node ${tone}`}>
      <b>{title}</b>
      <span>{text}</span>
    </div>
  );
}
function Rule({ title, text }: { title: string; text: string }) {
  return (
    <section>
      <b>{title}</b>
      <p>{text}</p>
    </section>
  );
}
function derivativeModel(k: number, a: number) {
  const u = [1, 0, k - 1, 0, -k, 0],
    uPrime = derive(u),
    v = [1, -4, 4],
    vPrime = derive(v),
    raw = sub(multiply(uPrime, v), multiply(u, vPrime)),
    division = divideByLinear(raw, 2),
    numerator = division.quotient,
    denominator = (x: number) => Math.pow(x - 2, 3),
    value = ((Math.pow(a, 3) + k * a) * (a * a - 1)) / Math.pow(a - 2, 2),
    slope = evaluate(numerator, a) / denominator(a),
    intercept = value - slope * a;
  return {
    u,
    uPrime,
    numerator,
    value,
    slope,
    tangent: line(slope, intercept),
    derivativeText: `(${poly(numerator)}) / (x - 2)³`,
  };
}
function derive(p: number[]) {
  const d = p.length - 1;
  return p.slice(0, -1).map((v, i) => v * (d - i));
}
function multiply(a: number[], b: number[]) {
  const out = Array(a.length + b.length - 1).fill(0);
  a.forEach((x, i) => b.forEach((y, j) => (out[i + j] += x * y)));
  return out;
}
function sub(a: number[], b: number[]) {
  const n = Math.max(a.length, b.length),
    aa = [...Array(n - a.length).fill(0), ...a],
    bb = [...Array(n - b.length).fill(0), ...b];
  return aa.map((v, i) => v - bb[i]);
}
function divideByLinear(p: number[], root: number) {
  const q = [p[0]];
  for (let i = 1; i < p.length - 1; i++) q.push(p[i] + q[i - 1] * root);
  return { quotient: q, remainder: p.at(-1)! + q.at(-1)! * root };
}
function evaluate(p: number[], x: number) {
  return p.reduce((sum, c) => sum * x + c, 0);
}
function poly(p: number[]) {
  const degree = p.length - 1,
    terms = p
      .map((v, i) => {
        if (!v) return "";
        const power = degree - i,
          sign = v < 0 ? "-" : "+",
          abs = Math.abs(v),
          coef = power && abs === 1 ? "" : fmt(abs),
          variable = power === 0 ? "" : power === 1 ? "x" : `x^${power}`;
        return `${sign} ${coef}${variable}`;
      })
      .filter(Boolean);
  return terms.join(" ").replace(/^\+ /, "") || "0";
}
function line(m: number, b: number) {
  return `${fmt(m)}x ${b < 0 ? "-" : "+"} ${fmt(Math.abs(b))}`;
}
function fmt(v: number) {
  return Number.isInteger(v) ? String(v) : String(Number(v.toFixed(3)));
}
function normalize(v: string) {
  return v
    .toLowerCase()
    .replaceAll(" ", "")
    .replaceAll("³", "^3")
    .replaceAll("⁴", "^4");
}
