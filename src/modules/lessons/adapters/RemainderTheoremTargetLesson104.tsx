import { useEffect, useMemo, useState, type DragEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleAlert,
  Edit3,
  Info,
  Lightbulb,
  RefreshCw,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import type { LessonAdapterProps } from "../types";
import {
  REMAINDER_PRACTICES_104,
  evaluateRemainderPolynomial104,
  formatRemainderPolynomial104,
  isRemainderPracticeCorrect104,
  isRemainderValueDrop104,
  parseRemainderDivisor104,
  parseRemainderPolynomial104,
  remainderEvaluatedTerms104,
  remainderMethodsAgree104,
  remainderReconstructionMatches104,
  remainderSubstitutionText104,
  syntheticRemainderDivision104,
  type RemainderDivision104,
} from "./remainderTheoremLesson104Model";
import "./RemainderTheoremTargetLesson104.css";
import { LessonTopicStudyBoard } from "../components/LessonTopicStudyBoard";

type RemainderTab104 =
  "Interact" | "Explain" | "Examples" | "Practice" | "Know more";

export default function RemainderTheoremTargetLesson104({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [polynomialInput, setPolynomialInput] = useState("x² + 3x + 2");
  const [divisorInput, setDivisorInput] = useState("x − 1");
  const [valueA, setValueA] = useState(1);
  const [substituteA, setSubstituteA] = useState(true);
  const [showDivision, setShowDivision] = useState(true);
  const [checkReconstruction, setCheckReconstruction] = useState(true);
  const [tab, setTab] = useState<RemainderTab104>("Interact");
  const [dragging, setDragging] = useState("");
  const [valueDrops, setValueDrops] = useState(0);
  const [invalidDrop, setInvalidDrop] = useState(false);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practicePolynomial, setPracticePolynomial] = useState(
    REMAINDER_PRACTICES_104[0].polynomial,
  );
  const [practiceDivisor, setPracticeDivisor] = useState(
    REMAINDER_PRACTICES_104[0].divisor,
  );
  const [practiceA, setPracticeA] = useState(2);
  const [practiceAnswer, setPracticeAnswer] = useState(-3);
  const [practiceChecked, setPracticeChecked] = useState(true);
  const [actions, setActions] = useState(0);
  const parsed = useMemo(
    () => parseRemainderPolynomial104(polynomialInput),
    [polynomialInput],
  );
  const divisor = useMemo(
    () => parseRemainderDivisor104(divisorInput),
    [divisorInput],
  );
  const division = useMemo(
    () => syntheticRemainderDivision104(parsed.coefficients, divisor.root),
    [parsed.coefficients, divisor.root],
  );
  const evaluated = evaluateRemainderPolynomial104(parsed.coefficients, valueA);
  const agree = remainderMethodsAgree104(
    parsed,
    divisor,
    valueA,
    evaluated,
    division.remainder,
  );
  const identityVerified =
    parsed.valid &&
    divisor.valid &&
    remainderReconstructionMatches104(
      parsed.coefficients,
      divisor.root,
      division.quotient,
      division.remainder,
    );
  const practiceParsed = useMemo(
    () => parseRemainderPolynomial104(practicePolynomial),
    [practicePolynomial],
  );
  const practiceDivisorModel = useMemo(
    () => parseRemainderDivisor104(practiceDivisor),
    [practiceDivisor],
  );
  const practiceDivision = useMemo(
    () =>
      syntheticRemainderDivision104(
        practiceParsed.coefficients,
        practiceDivisorModel.root,
      ),
    [practiceParsed.coefficients, practiceDivisorModel.root],
  );
  const practiceEvaluation = evaluateRemainderPolynomial104(
    practiceParsed.coefficients,
    practiceA,
  );
  const practiceCorrect = isRemainderPracticeCorrect104(
    practiceParsed,
    practiceDivisorModel,
    practiceA,
    practiceEvaluation,
    practiceDivision.remainder,
    practiceAnswer,
  );
  const act = () => {
    setActions((count) => count + 1);
    onInteraction();
  };
  const reset = (notify = true) => {
    setPolynomialInput("x² + 3x + 2");
    setDivisorInput("x − 1");
    setValueA(1);
    setSubstituteA(true);
    setShowDivision(true);
    setCheckReconstruction(true);
    setTab("Interact");
    setDragging("");
    setValueDrops(0);
    setInvalidDrop(false);
    setPracticeIndex(0);
    setPracticePolynomial(REMAINDER_PRACTICES_104[0].polynomial);
    setPracticeDivisor(REMAINDER_PRACTICES_104[0].divisor);
    setPracticeA(2);
    setPracticeAnswer(-3);
    setPracticeChecked(true);
    setActions(0);
    if (notify) onInteraction();
  };
  useEffect(() => reset(false), [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps
  const updateDivisor = (source: string) => {
    setDivisorInput(source);
    const next = parseRemainderDivisor104(source);
    if (next.valid) setValueA(next.root);
    act();
  };
  const startDrag = (event: DragEvent<HTMLButtonElement>) => {
    event.dataTransfer.setData("text/remainder-value-a", String(valueA));
    setDragging(String(valueA));
    setInvalidDrop(false);
    act();
  };
  const dropValue = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    const payload = event.dataTransfer.getData("text/remainder-value-a");
    if (isRemainderValueDrop104(payload, valueA)) {
      setValueDrops((count) => count + 1);
      setInvalidDrop(false);
    } else setInvalidDrop(true);
    setDragging("");
    act();
  };
  const nextPractice = () => {
    const next = (practiceIndex + 1) % REMAINDER_PRACTICES_104.length;
    const set = REMAINDER_PRACTICES_104[next];
    const root = parseRemainderDivisor104(set.divisor).root;
    const remainder = syntheticRemainderDivision104(
      parseRemainderPolynomial104(set.polynomial).coefficients,
      root,
    ).remainder;
    setPracticeIndex(next);
    setPracticePolynomial(set.polynomial);
    setPracticeDivisor(set.divisor);
    setPracticeA(root);
    setPracticeAnswer(remainder + 1);
    setPracticeChecked(false);
    act();
  };

  return (
    <div
      className="remainder104-page"
      data-testid="algebra-mockup-0161"
      data-dedicated-lesson="104"
      data-object-model="dedicated-tested-editable-polynomial-independent-evaluation-synthetic-division-validated-draggable-a-remainder-agreement-reconstruction-graded-practice-and-functional-tabs-model"
      data-polynomial={formatRemainderPolynomial104(parsed.coefficients)}
      data-polynomial-valid={parsed.valid}
      data-divisor={divisorInput}
      data-divisor-valid={divisor.valid}
      data-divisor-root={divisor.root}
      data-value-a={valueA}
      data-evaluated={evaluated}
      data-products={division.products.join(",")}
      data-sums={division.sums.join(",")}
      data-quotient={formatRemainderPolynomial104(division.quotient)}
      data-remainder={division.remainder}
      data-agree={agree}
      data-identity-verified={identityVerified}
      data-substitute-a={substituteA}
      data-show-division={showDivision}
      data-check-reconstruction={checkReconstruction}
      data-tab={tab}
      data-dragging={dragging}
      data-value-drops={valueDrops}
      data-invalid-drop={invalidDrop}
      data-practice-index={practiceIndex}
      data-practice-evaluated={practiceEvaluation}
      data-practice-products={practiceDivision.products.join(",")}
      data-practice-sums={practiceDivision.sums.join(",")}
      data-practice-quotient={formatRemainderPolynomial104(
        practiceDivision.quotient,
      )}
      data-practice-remainder={practiceDivision.remainder}
      data-practice-answer={practiceAnswer}
      data-practice-correct={practiceChecked && practiceCorrect}
      data-actions={actions}
    >
      <nav className="remainder104-breadcrumb">
        <a href="/">Home</a>
        <span>&gt;</span>
        <a href="/lessons">Lessons</a>
        <span>&gt;</span>
        <a href="/lessons/algebra">Algebra</a>
        <span>&gt;</span>
        <b>Remainder Theorem</b>
      </nav>
      <header className="remainder104-intro">
        <section>
          <small>
            <b>ALGEBRA</b>
            <b>EXPRESSIONS AND MANIPULATION</b>
          </small>
          <h1>Remainder Theorem</h1>
          <p>
            When a polynomial <i>f(x)</i> is divided by <i>(x − a)</i>, the
            remainder is <i>f(a)</i>.
          </p>
          <nav>
            <b>Intermediate Algebra</b>
            <b>6-10 min</b>
            <b>Remainder Theorem</b>
          </nav>
        </section>
        <aside>
          <Lightbulb />
          <h3>Key Idea</h3>
          <p>
            If <i>f(x)</i> is divided by <i>x − a</i>,
          </p>
          <strong>
            remainder = <i>f(a)</i>
          </strong>
          <p>
            Use <i>a</i>, not <i>−a</i>.
          </p>
        </aside>
      </header>
      <nav className="remainder104-tabs">
        {(
          [
            "Interact",
            "Explain",
            "Examples",
            "Practice",
            "Know more",
          ] as RemainderTab104[]
        ).map((name) => (
          <button
            type="button"
            className={tab === name ? "active" : ""}
            onClick={() => {
              setTab(name);
              act();
            }}
            key={name}
          >
            {name}
          </button>
        ))}
      </nav>
      {tab !== "Interact" && (
        <RemainderTabPanel104
          tab={tab}
          onOpenPractice={() => {
            setTab("Interact");
            document
              .querySelector(".remainder104-practice")
              ?.scrollIntoView({ behavior: "smooth", block: "center" });
            act();
          }}
        />
      )}
      <main
        className={`remainder104-workspace ${tab === "Interact" ? "" : "hidden"}`}
      >
        <header>
          <label>
            Polynomial <i>f(x)</i>
            <span>
              <input
                aria-label="Polynomial f of x"
                value={polynomialInput}
                onChange={(event) => {
                  setPolynomialInput(event.target.value);
                  act();
                }}
              />
              <Edit3 />
            </span>
          </label>
          <label>
            Divisor
            <span>
              <input
                aria-label="Remainder divisor"
                value={divisorInput}
                onChange={(event) => updateDivisor(event.target.value)}
              />
              <Edit3 />
            </span>
          </label>
          <label>
            Value <i>a</i>
            <input
              aria-label="Value a"
              type="number"
              value={valueA}
              onChange={(event) => {
                setValueA(Number(event.target.value));
                act();
              }}
            />
          </label>
          <div>
            <Switch
              label="Substitute a"
              value={substituteA}
              onToggle={() => {
                setSubstituteA((value) => !value);
                act();
              }}
            />
            <Switch
              label="Show division row"
              value={showDivision}
              onToggle={() => {
                setShowDivision((value) => !value);
                act();
              }}
            />
            <Switch
              label="Check reconstruction"
              value={checkReconstruction}
              onToggle={() => {
                setCheckReconstruction((value) => !value);
                act();
              }}
            />
          </div>
          <button type="button" onClick={() => reset()}>
            <RotateCcw />
            Reset
          </button>
        </header>
        <section className="remainder104-methods">
          <article
            className="remainder104-evaluate"
            aria-label="Evaluation value drop target"
            onDragOver={(event) => event.preventDefault()}
            onDrop={dropValue}
          >
            <h2>
              <i>1</i>Evaluate <em>f(a)</em>
            </h2>
            <p>
              Substitute{" "}
              <button
                type="button"
                className="drag-value"
                draggable
                aria-label="Drag value a"
                onDragStart={startDrag}
                onDragEnd={() => setDragging("")}
              >
                a = {valueA}
              </button>{" "}
              into <i>f(x)</i>.
            </p>
            {substituteA ? (
              <div className="equations">
                <p>
                  <i>f({valueA})</i> ={" "}
                  {remainderSubstitutionText104(parsed.coefficients, valueA)}
                </p>
                <p>
                  = {remainderEvaluatedTerms104(parsed.coefficients, valueA)}
                </p>
                <strong>= {evaluated}</strong>
              </div>
            ) : (
              <div className="hidden-method">Substitution is hidden</div>
            )}
            <aside>
              <Info />
              <p>
                We used <i>a = {valueA}</i> (from the divisor{" "}
                <i>{divisorInput}</i>),
                <br />
                not <i>−{valueA}</i>.
              </p>
            </aside>
            {invalidDrop && (
              <p className="invalid">
                Drop the active value a into this method.
              </p>
            )}
          </article>
          <article className="remainder104-division">
            <h2>
              <i>2</i>Synthetic division by <em>x − a</em>
            </h2>
            <p>
              Divide by <i>{divisorInput}</i> using synthetic division.
            </p>
            {showDivision ? (
              <MiniDivision
                coefficients={parsed.coefficients}
                root={divisor.root}
                calculation={division}
              />
            ) : (
              <div className="hidden-method">Division row is hidden</div>
            )}
            <footer>
              <span>
                Quotient:{" "}
                <b>{formatRemainderPolynomial104(division.quotient)}</b>
              </span>
              <strong>Remainder: {division.remainder}</strong>
            </footer>
          </article>
        </section>
        <section
          className={`remainder104-agreement ${agree ? "agree" : "disagree"}`}
        >
          <div>
            <Check />
          </div>
          <strong>Remainder = {agree ? evaluated : "?"}</strong>
          <p>
            {agree
              ? "Both methods agree."
              : `f(${valueA}) = ${evaluated}, but division gives ${division.remainder}.`}
          </p>
        </section>
        <section className="remainder104-reconstruction">
          <h2>
            <i>3</i>Check reconstruction
          </h2>
          {checkReconstruction ? (
            <>
              <p>
                Verify that{" "}
                <i>
                  f(x) = ({divisorInput})($
                  {formatRemainderPolynomial104(division.quotient)}) + $
                  {division.remainder}
                </i>
                .
              </p>
              <strong>
                ({divisorInput})(
                {formatRemainderPolynomial104(division.quotient)}) +{" "}
                {division.remainder} ={" "}
                {formatRemainderPolynomial104(parsed.coefficients)} = f(x)
              </strong>
              <footer>
                <Check />
                {identityVerified
                  ? "Identity verified."
                  : "Identity not verified."}
              </footer>
            </>
          ) : (
            <div className="hidden-method">Reconstruction is hidden</div>
          )}
        </section>
        <aside className="remainder104-warning">
          <CircleAlert />
          <b>Remember</b>
          <p>
            For divisor <i>x − a</i>, use <i>a</i> in <i>f(a)</i>. For example,{" "}
            <i>x − 1 ⇒ a = 1</i>, not −1.
          </p>
        </aside>
        <section className="remainder104-practice">
          <header>
            <h2>
              Practice <small>(Your turn)</small>
            </h2>
            <p>Try a similar problem.</p>
          </header>
          <div className="remainder104-practice-controls">
            <label>
              <i>f(x)</i>
              <span>
                <input
                  aria-label="Practice polynomial"
                  value={practicePolynomial}
                  onChange={(event) => {
                    setPracticePolynomial(event.target.value);
                    setPracticeChecked(false);
                    act();
                  }}
                />
                <Edit3 />
              </span>
            </label>
            <label>
              Divisor
              <span>
                <input
                  aria-label="Practice divisor"
                  value={practiceDivisor}
                  onChange={(event) => {
                    const source = event.target.value;
                    setPracticeDivisor(source);
                    const model = parseRemainderDivisor104(source);
                    if (model.valid) setPracticeA(model.root);
                    setPracticeChecked(false);
                    act();
                  }}
                />
                <Edit3 />
              </span>
            </label>
            <label>
              <i>a</i>
              <input
                aria-label="Practice a"
                type="number"
                value={practiceA}
                onChange={(event) => {
                  setPracticeA(Number(event.target.value));
                  setPracticeChecked(false);
                  act();
                }}
              />
            </label>
            <button
              type="button"
              onClick={() => {
                setPracticeChecked(true);
                act();
              }}
            >
              Check my work
            </button>
            <button type="button" onClick={nextPractice}>
              <RefreshCw />
              New problem
            </button>
          </div>
          <div className="remainder104-practice-methods">
            <article>
              <h3>
                Evaluate <i>f({practiceA})</i>
              </h3>
              <p>
                f({practiceA}) ={" "}
                {remainderSubstitutionText104(
                  practiceParsed.coefficients,
                  practiceA,
                )}
              </p>
              <p>= {practiceEvaluation}</p>
            </article>
            <article>
              <h3>Synthetic division</h3>
              <MiniDivision
                coefficients={practiceParsed.coefficients}
                root={practiceDivisorModel.root}
                calculation={practiceDivision}
                compact
              />
              <p>
                Quotient:{" "}
                <b>{formatRemainderPolynomial104(practiceDivision.quotient)}</b>
              </p>
              <p>
                Remainder: <b>{practiceDivision.remainder}</b>
              </p>
            </article>
          </div>
          <footer
            className={practiceChecked && practiceCorrect ? "correct" : "wrong"}
          >
            Answer: <b>Remainder =</b>
            <input
              aria-label="Practice remainder answer"
              type="number"
              value={practiceAnswer}
              onChange={(event) => {
                setPracticeAnswer(Number(event.target.value));
                setPracticeChecked(false);
                act();
              }}
            />
            {practiceChecked && practiceCorrect && <Check />}
          </footer>
        </section>
      </main>
      <nav className="remainder104-navigation">
        <a href="/lessons/algebra/103-synthetic-division">
          <ArrowLeft />
          <span>
            Previous<b>Synthetic Division</b>
          </span>
        </a>
        <a href="/lessons/algebra/105-factor-theorem">
          <span>
            Next<b>Factor Theorem</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="remainder104-footer">
        <h3>
          <Sparkles />
          Math Universe
        </h3>
        <p>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
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
      <LessonTopicStudyBoard lessonId={104} view={tab} onInteraction={onInteraction} />

    </div>
  );
}

function RemainderTabPanel104({
  tab,
  onOpenPractice,
}: {
  tab: Exclude<RemainderTab104, "Interact">;
  onOpenPractice: () => void;
}) {
  const content = {
    Explain: {
      title: "Why substitution gives the remainder",
      body: "Write f(x) = (x − a)q(x) + r. At x = a, the product term becomes zero, so f(a) = r.",
    },
    Examples: {
      title: "Read the sign from the divisor",
      body: "For x − 3 use a = 3. For x + 2, rewrite it as x − (−2), so use a = −2.",
    },
    Practice: {
      title: "Apply both methods",
      body: "Evaluate f(a), run synthetic division, and check that both methods produce the same remainder.",
    },
    "Know more": {
      title: "Connection to the Factor Theorem",
      body: "When f(a) = 0, the remainder vanishes. That makes x − a a factor and a a root of the polynomial.",
    },
  }[tab];

  return (
    <section className="remainder104-tab-panel" aria-live="polite">
      <div>
        <small>{tab}</small>
        <h2>{content.title}</h2>
        <p>{content.body}</p>
      </div>
      {tab === "Practice" && (
        <button type="button" onClick={onOpenPractice}>
          Open practice
          <ArrowRight />
        </button>
      )}
    </section>
  );
}

function Switch({
  label,
  value,
  onToggle,
}: {
  label: string;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <button type="button" role="switch" aria-checked={value} onClick={onToggle}>
      <i className={value ? "on" : ""}>
        <b />
      </i>
      <span>{label}</span>
    </button>
  );
}
function MiniDivision({
  coefficients,
  root,
  calculation,
  compact = false,
}: {
  coefficients: number[];
  root: number;
  calculation: RemainderDivision104;
  compact?: boolean;
}) {
  return (
    <div
      className={`remainder104-mini ${compact ? "compact" : ""}`}
      style={
        { "--remainder-columns": coefficients.length } as React.CSSProperties
      }
    >
      <b>{root}</b>
      <header>
        {coefficients.map((value, index) => (
          <span key={index}>{value}</span>
        ))}
      </header>
      <section>
        <i>↓</i>
        {calculation.products.map((value, index) => (
          <span key={index}>{index ? value : ""}</span>
        ))}
      </section>
      <footer>
        {calculation.sums.map((value, index) => (
          <span
            className={index === calculation.sums.length - 1 ? "remainder" : ""}
            key={index}
          >
            {value}
          </span>
        ))}
      </footer>
    </div>
  );
}
