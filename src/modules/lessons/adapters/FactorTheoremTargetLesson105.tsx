import { useEffect, useMemo, useState, type DragEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleAlert,
  RefreshCw,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";
import type { LessonAdapterProps } from "../types";
import {
  FACTOR_PROBLEMS_105 as problems,
  candidateFactorText105 as factorText,
  complementaryRoot105,
  divideByCandidateFactor105 as divide,
  evaluateFactorPolynomial105 as evaluate,
  factorSubstitutionTerms105 as substitution,
  factorTheoremVerdict105,
  formatFactorPolynomial105 as formatPolynomial,
  isFactorDragPayload105,
  parseCandidateFactor105 as parseFactor,
  parseFactorPolynomial105 as parsePolynomial,
  type FactorDivision105,
} from "./factorTheoremLesson105Model";
import "./FactorTheoremTargetLesson105.css";

type FactorTab105 =
  "Interact" | "Explain" | "Examples" | "Formulas" | "Know more";

export default function FactorTheoremTargetLesson105({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [problemIndex, setProblemIndex] = useState(0);
  const [polynomialInput, setPolynomialInput] = useState(
    problems[0].polynomial,
  );
  const [factorInput, setFactorInput] = useState(problems[0].factor);
  const [testValue, setTestValue] = useState(1);
  const [substitute, setSubstitute] = useState(true);
  const [checkZero, setCheckZero] = useState(true);
  const [revealPair, setRevealPair] = useState(true);
  const [tab, setTab] = useState<FactorTab105>("Interact");
  const [dragging, setDragging] = useState("");
  const [factorDrops, setFactorDrops] = useState(0);
  const [valueDrops, setValueDrops] = useState(0);
  const [invalidDrop, setInvalidDrop] = useState("");
  const [practiceSelected, setPracticeSelected] = useState(3);
  const [actions, setActions] = useState(0);
  const parsed = useMemo(
    () => parsePolynomial(polynomialInput),
    [polynomialInput],
  );
  const factor = useMemo(() => parseFactor(factorInput), [factorInput]);
  const division = useMemo(
    () => divide(parsed.coefficients, factor.root),
    [parsed.coefficients, factor.root],
  );
  const value = evaluate(parsed.coefficients, testValue);
  const isFactor = factorTheoremVerdict105(
    parsed,
    factor,
    testValue,
    value,
    division.remainder,
  );
  const otherRoot = complementaryRoot105(division.quotient);
  const meter = Math.max(0, Math.min(100, 50 + value * 5));
  const practicePolynomial = parsePolynomial("x² − 5x + 6");
  const practiceValue = evaluate(
    practicePolynomial.coefficients,
    practiceSelected,
  );
  const practiceFactorValue = evaluate(practicePolynomial.coefficients, 3);
  const practiceNonFactorValue = evaluate(practicePolynomial.coefficients, 4);
  const act = () => {
    setActions((count) => count + 1);
    onInteraction();
  };
  const reset = (notify = true) => {
    setProblemIndex(0);
    setPolynomialInput(problems[0].polynomial);
    setFactorInput(problems[0].factor);
    setTestValue(1);
    setSubstitute(true);
    setCheckZero(true);
    setRevealPair(true);
    setTab("Interact");
    setDragging("");
    setFactorDrops(0);
    setValueDrops(0);
    setInvalidDrop("");
    setPracticeSelected(3);
    setActions(0);
    if (notify) onInteraction();
  };
  useEffect(() => reset(false), [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps
  const updateFactor = (source: string) => {
    setFactorInput(source);
    const next = parseFactor(source);
    if (next.valid) setTestValue(next.root);
    act();
  };
  const startDrag = (
    event: DragEvent<HTMLButtonElement>,
    kind: "factor" | "value",
  ) => {
    const payload = kind === "factor" ? factorInput : String(testValue);
    event.dataTransfer.setData(`text/factor-theorem-${kind}`, payload);
    setDragging(`${kind}:${payload}`);
    setInvalidDrop("");
    act();
  };
  const drop = (event: DragEvent<HTMLElement>, kind: "factor" | "value") => {
    event.preventDefault();
    const payload = event.dataTransfer.getData(`text/factor-theorem-${kind}`);
    const valid = isFactorDragPayload105(
      payload,
      kind === "factor" ? factorInput : String(testValue),
    );
    if (valid) {
      if (kind === "factor") setFactorDrops((count) => count + 1);
      else setValueDrops((count) => count + 1);
      setInvalidDrop("");
    } else setInvalidDrop(kind);
    setDragging("");
    act();
  };
  const newProblem = () => {
    const next = (problemIndex + 1) % problems.length;
    const problem = problems[next];
    const root = parseFactor(problem.factor).root;
    setProblemIndex(next);
    setPolynomialInput(problem.polynomial);
    setFactorInput(problem.factor);
    setTestValue(root);
    setInvalidDrop("");
    act();
  };

  return (
    <div
      className="factor105-page"
      data-testid="algebra-mockup-0162"
      data-dedicated-lesson="105"
      data-object-model="dedicated-tested-editable-polynomial-candidate-factor-root-extraction-validated-draggable-substitution-zero-meter-synthetic-remainder-factor-pair-calculated-practice-and-functional-tabs-model"
      data-polynomial={formatPolynomial(parsed.coefficients)}
      data-polynomial-valid={parsed.valid}
      data-factor={factorInput}
      data-factor-valid={factor.valid}
      data-factor-root={factor.root}
      data-test-value={testValue}
      data-evaluated={value}
      data-products={division.products.join(",")}
      data-sums={division.sums.join(",")}
      data-quotient={formatPolynomial(division.quotient)}
      data-remainder={division.remainder}
      data-is-factor={isFactor}
      data-other-root={Number.isNaN(otherRoot) ? "" : otherRoot}
      data-meter={meter}
      data-substitute={substitute}
      data-check-zero={checkZero}
      data-reveal-pair={revealPair}
      data-tab={tab}
      data-dragging={dragging}
      data-factor-drops={factorDrops}
      data-value-drops={valueDrops}
      data-invalid-drop={invalidDrop}
      data-practice-selected={practiceSelected}
      data-practice-value={practiceValue}
      data-actions={actions}
    >
      <nav className="factor105-breadcrumb">
        <a href="/">Home</a>
        <span>&gt;</span>
        <a href="/lessons">Lessons</a>
        <span>&gt;</span>
        <a href="/lessons/algebra">Algebra</a>
        <span>&gt;</span>
        <b>105 Factor Theorem</b>
      </nav>
      <header className="factor105-intro">
        <small>
          <b>ALGEBRA</b>
          <b>EXPRESSIONS AND MANIPULATION</b>
        </small>
        <h1>Factor Theorem</h1>
        <p>
          <i>x − a</i> is a factor of <i>f(x)</i> if and only if <i>f(a) = 0</i>
          .
        </p>
        <nav>
          <b>Intermediate Algebra</b>
          <b>6-10 min</b>
          <b>Factor test</b>
        </nav>
      </header>
      <nav className="factor105-tabs">
        {(
          [
            ["Interact", "Test and explore"],
            ["Explain", "Understand the idea"],
            ["Examples", "See it in action"],
            ["Formulas", "Key formulas"],
            ["Know more", "Deepen understanding"],
          ] as [FactorTab105, string][]
        ).map(([name, detail]) => (
          <button
            type="button"
            className={tab === name ? "active" : ""}
            onClick={() => {
              setTab(name);
              act();
            }}
            key={name}
          >
            <b>{name}</b>
            <span>{detail}</span>
          </button>
        ))}
      </nav>
      {tab !== "Interact" && <FactorTabPanel105 tab={tab} />}
      <main
        className={`factor105-station ${tab !== "Interact" ? "hidden" : ""}`}
      >
        <header>
          <h2>Factor Test Station</h2>
          <p>
            Test whether <i>x − a</i> is a factor of <i>f(x)</i>
          </p>
          <button type="button" onClick={() => reset()}>
            <RotateCcw />
            Reset
          </button>
          <button type="button" onClick={newProblem}>
            <RefreshCw />
            New problem
          </button>
        </header>
        <section className="factor105-inputs">
          <label>
            <b>
              <i>1</i>Polynomial f(x)
            </b>
            <small>Enter the function</small>
            <span>
              f(x) =
              <input
                aria-label="Factor theorem polynomial"
                value={polynomialInput}
                onChange={(event) => {
                  setPolynomialInput(event.target.value);
                  act();
                }}
              />
              {parsed.valid && <Check />}
            </span>
          </label>
          <label>
            <b>
              <i>2</i>Candidate factor
            </b>
            <small>Enter divisor of the form x − a</small>
            <span>
              <input
                aria-label="Candidate factor"
                value={factorInput}
                onChange={(event) => updateFactor(event.target.value)}
              />
              {factor.valid && <Check />}
            </span>
          </label>
          <label>
            <b>
              <i>3</i>Test value a
            </b>
            <small>a is the number you substitute</small>
            <span>
              a =
              <input
                aria-label="Factor test value"
                type="number"
                value={testValue}
                onChange={(event) => {
                  setTestValue(Number(event.target.value));
                  act();
                }}
              />
              {testValue === factor.root && <Check />}
            </span>
          </label>
        </section>
        <section className="factor105-pipeline">
          <button
            type="button"
            draggable
            aria-label="Drag candidate factor"
            onDragStart={(event) => startDrag(event, "factor")}
            onDragEnd={() => setDragging("")}
          >
            <b>Divisor</b>
            <strong>{factorInput}</strong>
          </button>
          <i>→</i>
          <article
            aria-label="Factor extraction drop target"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => drop(event, "factor")}
          >
            <b>Extract a</b>
            <strong>
              {factorInput} ⇒ a = {factor.root}
            </strong>
          </article>
          <i>→</i>
          <article
            aria-label="Substitution value drop target"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => drop(event, "value")}
          >
            <b>Substitute a into f(x)</b>
            <p>
              Evaluate{" "}
              <button
                type="button"
                draggable
                aria-label="Drag extracted a"
                onDragStart={(event) => startDrag(event, "value")}
                onDragEnd={() => setDragging("")}
              >
                f({testValue})
              </button>
            </p>
          </article>
        </section>
        <section className="factor105-test">
          <article>
            <h3>Factor Theorem</h3>
            <p>
              <i>x − a</i> is a factor of <i>f(x)</i>
              <br />
              iff <i>f(a) = 0</i>.
            </p>
          </article>
          <i>→</i>
          <article className="meter">
            <h3>Substitution meter</h3>
            {substitute ? (
              <>
                <div>
                  <span style={{ left: `${meter}%` }} />
                </div>
                <nav>
                  <b>−10</b>
                  <b>−5</b>
                  <b>0</b>
                  <b>5</b>
                  <b>10</b>
                </nav>
                <p>
                  <i>f({testValue})</i> ={" "}
                  {substitution(parsed.coefficients, testValue)} ={" "}
                  <b>{value}</b>
                </p>
              </>
            ) : (
              <p>Substitution hidden</p>
            )}
          </article>
          <i>→</i>
          <article className="zero">
            <h3>Zero target</h3>
            {checkZero ? (
              <strong className={value === 0 ? "hit" : "miss"}>{value}</strong>
            ) : (
              <p>Zero check hidden</p>
            )}
          </article>
          <i>→</i>
          <article className={`verdict ${isFactor ? "yes" : "no"}`}>
            <h3>Result</h3>
            <strong>
              f({testValue}) = {value}
            </strong>
            <p>
              {factorInput} is {isFactor ? "a factor" : "not a factor"}
            </p>
            <b>
              {isFactor
                ? `Yes: ${factorInput} is a factor`
                : `No: ${factorInput} is not a factor`}
              {isFactor ? <Check /> : <X />}
            </b>
          </article>
        </section>
        <section className="factor105-controls">
          <h3>Controls</h3>
          <Switch
            label="Substitute"
            detail="Evaluate f(a)"
            value={substitute}
            onToggle={() => {
              setSubstitute((state) => !state);
              act();
            }}
          />
          <Switch
            label="Check zero"
            detail="Compare to 0"
            value={checkZero}
            onToggle={() => {
              setCheckZero((state) => !state);
              act();
            }}
          />
          <Switch
            label="Reveal factor pair"
            detail="Show full factorization"
            value={revealPair}
            onToggle={() => {
              setRevealPair((state) => !state);
              act();
            }}
          />
        </section>
        <section className="factor105-synthetic">
          <header>
            <h2>Check by synthetic division</h2>
            <p>Optional verification: divide f(x) by ({factorInput})</p>
          </header>
          <MiniSynthetic
            coefficients={parsed.coefficients}
            root={factor.root}
            division={division}
          />
          <article>
            <strong>Remainder = {division.remainder}</strong>
            <p>
              Confirms: {factorInput} is{" "}
              {division.remainder === 0 ? "a factor" : "not a factor"}.
            </p>
          </article>
          <aside>
            <h3>Factorization revealed</h3>
            {revealPair && !Number.isNaN(otherRoot) ? (
              <>
                <strong>
                  f(x) = ({factorText(factor.root)})({factorText(otherRoot)})
                </strong>
                <p>
                  Factor pair: ({factor.root}, {otherRoot}){" "}
                  <span>
                    Zeros: x = {factor.root}, x = {otherRoot}
                  </span>
                </p>
              </>
            ) : (
              <p>Factor pair hidden</p>
            )}
          </aside>
        </section>
        <section className="factor105-practice">
          <h2>Practice: Test different factor candidates</h2>
          <article
            className={`factor ${practiceSelected === 3 ? "selected" : ""}`}
          >
            <h3>g(x) = x² − 5x + 6</h3>
            <button
              type="button"
              aria-pressed={practiceSelected === 3}
              onClick={() => {
                setPracticeSelected(3);
                act();
              }}
            >
              Test x − 3<br />a = 3
            </button>
            <div>
              <b>Substitution</b>
              <p>g(3) = 3² − 5(3) + 6 = {practiceFactorValue}</p>
              <strong>
                Yes: x − 3 is a factor <Check />
              </strong>
            </div>
            <footer>
              Factorization <b>g(x) = (x − 2)(x − 3)</b>
              <span>Zeros: x = 2, x = 3</span>
            </footer>
          </article>
          <article
            className={`nonfactor ${practiceSelected === 4 ? "selected" : ""}`}
          >
            <h3>Test a non-factor</h3>
            <button
              type="button"
              aria-pressed={practiceSelected === 4}
              onClick={() => {
                setPracticeSelected(4);
                act();
              }}
            >
              Test x − 4<br />a = 4
            </button>
            <div>
              <b>Substitution</b>
              <p>g(4) = 4² − 5(4) + 6 = {practiceNonFactorValue}</p>
              <strong>
                Not a factor <X />
              </strong>
            </div>
            <footer>
              Remainder = {practiceNonFactorValue} ≠ 0<br />
              <b>So, x − 4 is not a factor of g(x).</b>
            </footer>
          </article>
        </section>
        <aside className="factor105-warning">
          <CircleAlert />
          <b>Important</b>
          <p>
            A nonzero remainder means the candidate is not a factor. Only when
            f(a) = 0 (remainder 0) is x − a a factor.
          </p>
        </aside>
        {invalidDrop && (
          <p className="factor105-invalid">
            Complete the matching {invalidDrop} drag stage.
          </p>
        )}
      </main>
      <nav className="factor105-navigation">
        <a href="/lessons/algebra/104-remainder-theorem">
          <ArrowLeft />
          <span>
            Previous<b>Remainder Theorem</b>
          </span>
        </a>
        <a href="/lessons/algebra/106-identities">
          <span>
            Next<b>More examples</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="factor105-footer">
        <h3>
          <Sparkles />
          Math Universe
        </h3>
        <p>
          Interactive math labs, visual proofs, NCERT explorations,
          <br />
          graphing, CAS-style tools, and classroom-ready activities.
        </p>
        <nav>
          <a href="/sitemap">Sitemap</a>
          <a href="/docs">Docs</a>
          <a href="/about">About</a>
        </nav>
        <hr />
        <small>
          © 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.
        </small>
        <p>www.IndianServers.com info@IndianServers.com</p>
      </footer>
    </div>
  );
}

function FactorTabPanel105({
  tab,
}: {
  tab: Exclude<FactorTab105, "Interact">;
}) {
  const content = {
    Explain: {
      title: "Why a zero remainder proves a factor",
      body: "The division identity is f(x) = (x − a)q(x) + r. Substituting x = a leaves f(a) = r. Therefore x − a divides f(x) exactly when f(a) = 0.",
    },
    Examples: {
      title: "Test a candidate without full division",
      body: "For f(x) = x² − 3x + 2, f(1) = 0 and f(2) = 0. The matching factors are x − 1 and x − 2.",
    },
    Formulas: {
      title: "Factor Theorem",
      body: "x − a is a factor of f(x) if and only if f(a) = 0. Equivalently, a is a zero of f exactly when x − a is a factor.",
    },
    "Know more": {
      title: "Roots, factors, and graph intercepts",
      body: "The same value a links three views: f(a) = 0, x − a is a factor, and the graph of y = f(x) crosses or touches the x-axis at x = a.",
    },
  }[tab];

  return (
    <section className="factor105-tab-panel" aria-live="polite">
      <small>{tab}</small>
      <h2>{content.title}</h2>
      <p>{content.body}</p>
    </section>
  );
}

function Switch({
  label,
  detail,
  value,
  onToggle,
}: {
  label: string;
  detail: string;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <button type="button" role="switch" aria-checked={value} onClick={onToggle}>
      <i className={value ? "on" : ""}>
        <b />
      </i>
      <span>
        <b>{label}</b>
        <small>{detail}</small>
      </span>
    </button>
  );
}
function MiniSynthetic({
  coefficients,
  root,
  division,
}: {
  coefficients: number[];
  root: number;
  division: FactorDivision105;
}) {
  return (
    <div
      className="factor105-mini"
      style={{ "--factor-columns": coefficients.length } as React.CSSProperties}
    >
      <b>{root}</b>
      <header>
        {coefficients.map((value, index) => (
          <span key={index}>{value}</span>
        ))}
      </header>
      <section>
        <i>↓</i>
        {division.products.map((value, index) => (
          <span key={index}>{index ? value : ""}</span>
        ))}
      </section>
      <footer>
        {division.sums.map((value, index) => (
          <span
            className={index === division.sums.length - 1 ? "remainder" : ""}
            key={index}
          >
            {value}
          </span>
        ))}
      </footer>
    </div>
  );
}
