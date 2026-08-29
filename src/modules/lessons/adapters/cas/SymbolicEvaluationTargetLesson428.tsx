import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Eye,
  Maximize2,
  Pencil,
  Play,
  Sparkles,
  Target,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./SymbolicEvaluationTargetLesson428.css";

type Linear = {
  coefficient: number;
  constant: number;
  valid: boolean;
  terms: Array<{ raw: string; coefficient: number; variable: boolean }>;
};
const INITIAL = "2*x+3*x-x+4-2";

export default function SymbolicEvaluationTargetLesson428({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [expression, setExpression] = useState(INITIAL);
  const [evaluated, setEvaluated] = useState(false);
  const [substitution, setSubstitution] = useState(3);
  const [substitutionChecked, setSubstitutionChecked] = useState(false);
  const [assumptionEditing, setAssumptionEditing] = useState(false);
  const [domain, setDomain] = useState("R (all real numbers)");
  const [practice, setPractice] = useState("");
  const [practiceChecked, setPracticeChecked] = useState(false);
  const [solution, setSolution] = useState(false);
  const [copyCount, setCopyCount] = useState(0);
  const model = useMemo(() => parseLinear(expression, "x"), [expression]);
  const exact = model.valid
    ? formatLinear(model.coefficient, model.constant, "x")
    : "Invalid expression";
  const originalAtValue = model.valid
    ? model.coefficient * substitution + model.constant
    : Number.NaN;
  const practiceModel = useMemo(() => parseLinear("4*y-2*y+y-5+3", "y"), []);
  const practiceExpected = formatLinear(
    practiceModel.coefficient,
    practiceModel.constant,
    "y",
  );
  const practiceCorrect = normalize(practice) === normalize(practiceExpected);

  useEffect(() => {
    setExpression(INITIAL);
    setEvaluated(false);
    setSubstitution(3);
    setSubstitutionChecked(false);
    setAssumptionEditing(false);
    setDomain("R (all real numbers)");
    setPractice("");
    setPracticeChecked(false);
    setSolution(false);
    setCopyCount(0);
  }, [resetToken]);
  const run = () => {
    setEvaluated(true);
    setSubstitutionChecked(false);
    onInteraction();
  };
  const clear = () => {
    setExpression("");
    setEvaluated(false);
    setSubstitutionChecked(false);
    onInteraction();
  };

  return (
    <section
      className="sym428-page"
      data-testid="symbolic-cas-mockup-0334"
      data-dedicated-lesson="428"
      data-object-model="editable-linear-expression-parse-transform-substitution-practice"
      data-expression={expression}
      data-coefficient={model.coefficient}
      data-constant={model.constant}
      data-result={exact}
      data-valid={model.valid}
      data-evaluated={evaluated}
      data-substitution={substitution}
      data-substitution-value={
        Number.isNaN(originalAtValue) ? "invalid" : originalAtValue
      }
      data-substitution-checked={substitutionChecked}
      data-domain={domain}
      data-practice-result={
        practiceChecked ? (practiceCorrect ? "correct" : "incorrect") : "idle"
      }
      data-solution={solution}
      data-copy-count={copyCount}
    >
      <span className="sr-only">
        Symbolic Evaluation. Dedicated symbolic evaluation model with live parse
        tree and exact verification.
      </span>
      <section className="sym428-flow">
        {[
          [
            Eye,
            "1. Observe",
            "Enter an expression and see how the CAS interprets it and produces an exact result.",
          ],
          [
            Pencil,
            "2. Manipulate",
            "Change the expression or assumptions and watch the result update instantly.",
          ],
          [
            Sparkles,
            "3. Notice",
            "Track structure using the parse tree and verify via substitution.",
          ],
          [
            Target,
            "4. Understand",
            "Connect input, transformations, exact output, and rigorous rules.",
          ],
        ].map(([Icon, title, text], index) => (
          <article key={String(title)}>
            <Icon className={`icon-${index}`} />
            <div>
              <h3>{String(title)}</h3>
              <p>{String(text)}</p>
            </div>
            {index < 3 && <ArrowRight />}
          </article>
        ))}
      </section>
      <section className="sym428-lab">
        <header>
          <h2>Work directly on the model</h2>
          <div>
            <b className={evaluated && model.valid ? "ready" : "waiting"}>
              {evaluated && model.valid ? <CheckCircle2 /> : null}
              {evaluated && model.valid
                ? "Exact result"
                : "Awaiting interaction"}
            </b>
            <span>
              {
                [evaluated, substitutionChecked, practiceChecked].filter(
                  Boolean,
                ).length
              }{" "}
              actions
            </span>
            <button
              type="button"
              data-lesson-control="symbolic-fullscreen"
              aria-label="Expand symbolic model"
              onClick={() =>
                document
                  .querySelector<HTMLElement>(".sym428-lab")
                  ?.requestFullscreen?.()
              }
            >
              <Maximize2 />
            </button>
          </div>
        </header>
        <div className="sym428-grid">
          <article className="sym428-input">
            <h3>
              <i>1</i> Input
            </h3>
            <label>
              Expression
              <input
                data-lesson-control="symbolic-expression"
                aria-label="Symbolic expression"
                value={expression}
                onChange={(event) => {
                  setExpression(event.target.value);
                  setEvaluated(false);
                  setSubstitutionChecked(false);
                  onInteraction();
                }}
              />
            </label>
            <label>
              Assumptions
              <div>
                {assumptionEditing ? (
                  <select
                    aria-label="Variable domain"
                    value={domain}
                    onChange={(event) => {
                      setDomain(event.target.value);
                      onInteraction();
                    }}
                  >
                    <option>R (all real numbers)</option>
                    <option>Z (integers)</option>
                    <option>x &gt; 0</option>
                  </select>
                ) : (
                  <span>x in {domain}</span>
                )}
                <button
                  type="button"
                  data-lesson-control="symbolic-assumptions"
                  aria-label="Edit assumptions"
                  onClick={() => {
                    setAssumptionEditing((value) => !value);
                    onInteraction();
                  }}
                >
                  <Pencil />
                </button>
              </div>
            </label>
            <h4>Controls</h4>
            <div className="sym428-control-row">
              <button
                type="button"
                data-lesson-control="symbolic-evaluate"
                onClick={run}
              >
                <Play />
                Evaluate
              </button>
              <button
                type="button"
                data-lesson-control="symbolic-clear"
                onClick={clear}
              >
                <Trash2 />
                Clear
              </button>
            </div>
            <small>Evaluation is exact and symbolic.</small>
          </article>
          <article className="sym428-evaluation">
            <h3>
              <i>2</i> CAS Evaluation{" "}
              <span>
                <CheckCircle2 />
                Exact
              </span>
            </h3>
            <h4>Step-by-step transformation</h4>
            <Step
              number="1"
              title="Read signed terms"
              value={
                model.terms.map((term) => term.raw).join("  ") ||
                "Awaiting expression"
              }
            />
            <Step
              number="2"
              title="Combine like terms (x-terms)"
              value={`${model.coefficient}x + ${model.constant}`}
            />
            <Step number="3" title="Write canonical form" value={exact} />
            <div
              className={`sym428-result ${evaluated && model.valid ? "active" : ""}`}
            >
              <b>Exact Result</b>
              <strong>{evaluated ? exact : "Apply Evaluate"}</strong>
            </div>
            <h4>Substitution Check</h4>
            <div className="sym428-sub-control">
              <span>Choose a value for x</span>
              <label>
                x ={" "}
                <input
                  data-lesson-control="symbolic-substitution"
                  aria-label="Substitution value"
                  type="number"
                  value={substitution}
                  onChange={(event) => {
                    setSubstitution(Number(event.target.value));
                    setSubstitutionChecked(false);
                  }}
                />
              </label>
              <button
                type="button"
                onClick={() => {
                  setSubstitutionChecked(true);
                  onInteraction();
                }}
              >
                Check
              </button>
            </div>
            <div className="sym428-sub-table">
              <div>
                <b>Original</b>
                <span>{expression.replaceAll("x", `(${substitution})`)}</span>
                <strong>
                  ={" "}
                  {Number.isNaN(originalAtValue) ? "invalid" : originalAtValue}
                </strong>
              </div>
              <div>
                <b>Result</b>
                <span>{exact.replace("x", `(${substitution})`)}</span>
                <strong>
                  ={" "}
                  {Number.isNaN(originalAtValue) ? "invalid" : originalAtValue}
                </strong>
              </div>
            </div>
            {substitutionChecked && (
              <p className="sym428-verified">
                <Check />
                Verified: Both sides give {originalAtValue}.
              </p>
            )}
          </article>
          <aside className="sym428-side">
            <article>
              <h3>
                <i>3</i> Parse Tree
              </h3>
              <ParseTree terms={model.terms} />
              <p>
                <b>Infix:</b> {expression || "empty"}
              </p>
            </article>
            <article>
              <h3>
                <i>4</i> Assumptions &amp; Domain
              </h3>
              <p>
                <b>Variable:</b> x
              </p>
              <p>
                <b>Domain:</b> {domain}
              </p>
              <p className="ok">
                <CheckCircle2 />
                No restrictions detected.
              </p>
            </article>
          </aside>
        </div>
        <section className="sym428-action">
          <article>
            <h3>The Model in Action</h3>
            <p>This CAS engine applies exact algebraic rules.</p>
            <div>
              <span>
                Input
                <br />
                Expression
              </span>
              <ArrowRight />
              <span>
                Transformations
                <br />
                (Algebraic Rules)
              </span>
              <ArrowRight />
              <span>
                Exact
                <br />
                Result
              </span>
            </div>
          </article>
          <article>
            <h3>
              Rule Used <small>(Combine Like Terms)</small>
            </h3>
            <p>Terms with the same variable and exponent combine.</p>
            <strong>ax^n + bx^n = (a + b)x^n</strong>
            <p>Constants add: p + q = p + q</p>
          </article>
          <article>
            <h3>
              <AlertTriangle />
              Common Misconception
            </h3>
            <b>Do not add unlike terms.</b>
            <p>
              For example, 2x + 4 is not 6x. Only terms with the same variable
              and exponent can combine.
            </p>
          </article>
        </section>
        <section className="sym428-practice">
          <header>
            <h3>
              Practice Challenge <small>(Try it)</small>
            </h3>
            <span>+10 XP</span>
          </header>
          <div>
            <label>
              Challenge
              <input readOnly value="4*y-2*y+y-5+3" />
            </label>
            <label>
              Your Result
              <div>
                <input
                  data-lesson-control="symbolic-practice"
                  aria-label="Symbolic practice result"
                  value={practice}
                  placeholder="Enter or evaluate to see result"
                  onChange={(event) => {
                    setPractice(event.target.value);
                    setPracticeChecked(false);
                  }}
                />
                <button
                  type="button"
                  data-lesson-control="symbolic-practice-copy"
                  aria-label="Copy practice result"
                  onClick={async () => {
                    try {
                      await navigator.clipboard?.writeText(practice);
                    } finally {
                      setCopyCount((value) => value + 1);
                      onInteraction();
                    }
                  }}
                >
                  <Copy />
                </button>
              </div>
              <span>
                <button
                  type="button"
                  onClick={() => {
                    setPracticeChecked(true);
                    onInteraction();
                  }}
                >
                  Check
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSolution((value) => !value);
                    onInteraction();
                  }}
                >
                  Show Solution
                </button>
              </span>
            </label>
            <aside>
              <h4>Quick Check (y = 2)</h4>
              <div>
                <b>Expression</b>
                <b>Your Result</b>
                <span>
                  {practiceChecked
                    ? practiceModel.coefficient * 2 + practiceModel.constant
                    : "-"}
                </span>
                <span>
                  {practiceChecked && practiceCorrect
                    ? practiceModel.coefficient * 2 + practiceModel.constant
                    : "-"}
                </span>
              </div>
              <p>
                {practiceChecked
                  ? practiceCorrect
                    ? "Correct exact simplification."
                    : "Combine all y-terms and constants separately."
                  : "Enter your result and click Check."}
              </p>
            </aside>
          </div>
          {solution && (
            <p className="sym428-solution">
              4y - 2y + y = 3y and -5 + 3 = -2, so the exact result is{" "}
              <b>{practiceExpected}</b>.
            </p>
          )}
        </section>
        <footer>
          This lesson uses a dedicated symbolic parser, exact result model,
          substitution verifier, and practice checker.
        </footer>
      </section>
      <section className="sym428-tags">
        <span>primary-control</span>
        <span>expression</span>
        <span>CAS result</span>
      </section>
    </section>
  );
}

function parseLinear(input: string, variable: string): Linear {
  const cleaned = input.replaceAll(" ", "").replaceAll("−", "-");
  if (!cleaned) return { coefficient: 0, constant: 0, valid: false, terms: [] };
  const signed =
    (cleaned.startsWith("-") ? cleaned : `+${cleaned}`).match(/[+-][^+-]+/g) ??
    [];
  let coefficient = 0,
    constant = 0,
    valid = signed.length > 0;
  const terms = signed.map((raw) => {
    const sign = raw[0] === "-" ? -1 : 1,
      body = raw.slice(1);
    if (body.includes(variable)) {
      const factor = body.replace(`*${variable}`, "").replace(variable, "");
      const value = factor === "" ? 1 : Number(factor);
      if (!Number.isFinite(value)) valid = false;
      coefficient += sign * (Number.isFinite(value) ? value : 0);
      return {
        raw: (raw[0] === "+" ? "" : raw[0]) + body,
        coefficient: sign * value,
        variable: true,
      };
    }
    const value = Number(body);
    if (!Number.isFinite(value)) valid = false;
    constant += sign * (Number.isFinite(value) ? value : 0);
    return {
      raw: (raw[0] === "+" ? "" : raw[0]) + body,
      coefficient: sign * value,
      variable: false,
    };
  });
  return { coefficient, constant, valid, terms };
}
function formatLinear(coefficient: number, constant: number, variable: string) {
  const variablePart =
    coefficient === 0
      ? ""
      : coefficient === 1
        ? variable
        : coefficient === -1
          ? `-${variable}`
          : `${coefficient}${variable}`;
  if (constant === 0) return variablePart || "0";
  if (!variablePart) return String(constant);
  return `${variablePart} ${constant > 0 ? "+" : "-"} ${Math.abs(constant)}`;
}
function normalize(value: string) {
  return value
    .toLowerCase()
    .replaceAll(" ", "")
    .replaceAll("*", "")
    .replaceAll("−", "-");
}
function Step({
  number,
  title,
  value,
}: {
  number: string;
  title: string;
  value: string;
}) {
  return (
    <div className="sym428-step">
      <i>{number}</i>
      <span>
        <b>{title}</b>
        <strong>{value}</strong>
      </span>
    </div>
  );
}
function ParseTree({ terms }: { terms: Linear["terms"] }) {
  return (
    <div className="sym428-tree">
      <b>+</b>
      <div>
        {terms.map((term, index) => (
          <span key={`${term.raw}-${index}`}>
            <i>{term.variable ? "x" : "#"}</i>
            <small>{term.raw}</small>
          </span>
        ))}
      </div>
    </div>
  );
}
