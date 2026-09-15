import { useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  Lightbulb,
  Play,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Trophy,
} from "lucide-react";
import type { LessonAdapterProps } from "../types";
import {
  formatSyntheticPolynomial103 as formatPolynomial,
  isSyntheticDrop103,
  isSyntheticPracticeCorrect103,
  parsePolynomial103 as parsePolynomial,
  parseSyntheticDivisor103 as parseDivisor,
  SYNTHETIC_PRACTICES_103 as practices,
  syntheticDivide103 as divide,
  syntheticExpansionMatches103 as expandedMatches,
} from "./syntheticDivisionLesson103Model";
import "./SyntheticDivisionTargetLesson103.css";
import { LessonTopicStudyBoard } from "../components/LessonTopicStudyBoard";

type SyntheticTab103 =
  | "Interaction + Visualization"
  | "Explain"
  | "Examples"
  | "Formulas"
  | "Know more";

export default function SyntheticDivisionTargetLesson103({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [polynomialInput, setPolynomialInput] = useState("x² + 5x + 6");
  const [divisorInput, setDivisorInput] = useState("x + 2");
  const [showCoefficients, setShowCoefficients] = useState(true);
  const [showArrows, setShowArrows] = useState(true);
  const [checkExpansion, setCheckExpansion] = useState(true);
  const [tab, setTab] = useState<SyntheticTab103>(
    "Interaction + Visualization",
  );
  const [stage, setStage] = useState(5);
  const [dragging, setDragging] = useState("");
  const [syntheticDrops, setSyntheticDrops] = useState(0);
  const [invalidDrop, setInvalidDrop] = useState(false);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceProducts, setPracticeProducts] = useState<number[]>([
    Number.NaN,
    Number.NaN,
  ]);
  const [practiceSums, setPracticeSums] = useState<number[]>([
    Number.NaN,
    Number.NaN,
    Number.NaN,
  ]);
  const [practiceQuotient, setPracticeQuotient] = useState<number[]>([
    Number.NaN,
    Number.NaN,
  ]);
  const [practiceRemainder, setPracticeRemainder] = useState(Number.NaN);
  const [practiceChecked, setPracticeChecked] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [actions, setActions] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const parsed = useMemo(
    () => parsePolynomial(polynomialInput),
    [polynomialInput],
  );
  const divisor = useMemo(() => parseDivisor(divisorInput), [divisorInput]);
  const calculation = useMemo(
    () => divide(parsed.coefficients, divisor.synthetic),
    [parsed.coefficients, divisor.synthetic],
  );
  const quotientText = formatPolynomial(calculation.quotient);
  const expansionVerified =
    parsed.valid &&
    divisor.valid &&
    expandedMatches(
      parsed.coefficients,
      divisor.synthetic,
      calculation.quotient,
      calculation.remainder,
    );
  const practice = practices[practiceIndex];
  const practiceParsed = useMemo(
    () => parsePolynomial(practice.polynomial),
    [practice.polynomial],
  );
  const practiceDivisor = useMemo(
    () => parseDivisor(practice.divisor),
    [practice.divisor],
  );
  const practiceCalculation = useMemo(
    () => divide(practiceParsed.coefficients, practiceDivisor.synthetic),
    [practiceParsed.coefficients, practiceDivisor.synthetic],
  );
  const practiceCorrect = isSyntheticPracticeCorrect103(
    practiceProducts,
    practiceSums,
    practiceQuotient,
    practiceRemainder,
    practiceCalculation,
  );
  const act = () => {
    setActions((count) => count + 1);
    onInteraction();
  };
  const clearPractice = (next: number) => {
    const length = parsePolynomial(practices[next].polynomial).coefficients
      .length;
    setPracticeProducts(Array(length - 1).fill(Number.NaN));
    setPracticeSums(Array(length).fill(Number.NaN));
    setPracticeQuotient(Array(length - 1).fill(Number.NaN));
    setPracticeRemainder(Number.NaN);
    setPracticeChecked(false);
    setShowSolution(false);
  };
  const reset = (notify = true) => {
    if (timer.current) clearInterval(timer.current);
    setPolynomialInput("x² + 5x + 6");
    setDivisorInput("x + 2");
    setShowCoefficients(true);
    setShowArrows(true);
    setCheckExpansion(true);
    setTab("Interaction + Visualization");
    setStage(5);
    setDragging("");
    setSyntheticDrops(0);
    setInvalidDrop(false);
    setPracticeIndex(0);
    clearPractice(0);
    setActions(0);
    if (notify) onInteraction();
  };
  useEffect(() => reset(false), [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
    },
    [],
  );
  const animate = () => {
    if (timer.current) clearInterval(timer.current);
    setStage(0);
    let next = 0;
    timer.current = setInterval(() => {
      next += 1;
      setStage(next);
      if (next >= 5 && timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }
    }, 180);
    act();
  };
  const startDrag = (event: DragEvent<HTMLButtonElement>) => {
    event.dataTransfer.setData(
      "text/synthetic-number",
      String(divisor.synthetic),
    );
    setDragging(String(divisor.synthetic));
    setInvalidDrop(false);
    act();
  };
  const dropSynthetic = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    const payload = event.dataTransfer.getData("text/synthetic-number");
    if (isSyntheticDrop103(payload, divisor.synthetic)) {
      setSyntheticDrops((count) => count + 1);
      setInvalidDrop(false);
    } else setInvalidDrop(true);
    setDragging("");
    act();
  };
  const fillSolution = () => {
    setPracticeProducts(practiceCalculation.products.slice(1));
    setPracticeSums(practiceCalculation.sums);
    setPracticeQuotient(practiceCalculation.quotient);
    setPracticeRemainder(practiceCalculation.remainder);
    setPracticeChecked(true);
    setShowSolution(true);
    act();
  };
  const update = (
    setter: React.Dispatch<React.SetStateAction<number[]>>,
    index: number,
    value: number,
  ) => {
    setter((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? value : item)),
    );
    setPracticeChecked(false);
    act();
  };

  return (
    <div
      className="synthetic103-page"
      data-testid="algebra-mockup-0160"
      data-dedicated-lesson="103"
      data-object-model="dedicated-tested-editable-polynomial-coefficient-horner-synthetic-number-validated-draggable-table-quotient-remainder-expansion-graded-practice-functional-tabs-and-animation-model"
      data-polynomial={formatPolynomial(parsed.coefficients)}
      data-polynomial-valid={parsed.valid}
      data-divisor={divisorInput}
      data-divisor-valid={divisor.valid}
      data-synthetic-number={divisor.synthetic}
      data-coefficients={parsed.coefficients.join(",")}
      data-products={calculation.products.join(",")}
      data-sums={calculation.sums.join(",")}
      data-quotient={quotientText}
      data-remainder={calculation.remainder}
      data-expansion-verified={expansionVerified}
      data-show-coefficients={showCoefficients}
      data-show-arrows={showArrows}
      data-check-expansion={checkExpansion}
      data-stage={stage}
      data-tab={tab}
      data-dragging={dragging}
      data-synthetic-drops={syntheticDrops}
      data-invalid-drop={invalidDrop}
      data-practice-index={practiceIndex}
      data-practice-products={practiceProducts.join(",")}
      data-practice-sums={practiceSums.join(",")}
      data-practice-quotient={practiceQuotient.join(",")}
      data-practice-remainder={
        Number.isNaN(practiceRemainder) ? "" : practiceRemainder
      }
      data-practice-correct={practiceChecked && practiceCorrect}
      data-show-solution={showSolution}
      data-actions={actions}
    >
      <nav className="synthetic103-breadcrumb">
        <a href="/">Home</a>
        <span>&gt;</span>
        <a href="/lessons">Lessons</a>
        <span>&gt;</span>
        <a href="/lessons/algebra">Algebra</a>
        <span>&gt;</span>
        <b>103 Synthetic Division</b>
      </nav>
      <header className="synthetic103-intro">
        <section>
          <small>
            <b>ALGEBRA</b>
            <b>EXPRESSIONS AND MANIPULATION</b>
          </small>
          <h1>Synthetic Division</h1>
          <p>
            Divide polynomials of the form <i>P(x)</i> by <i>(x − a)</i> using a
            compact coefficient table.
          </p>
          <nav>
            <b>Intermediate Algebra</b>
            <b>Synthetic Table Method</b>
            <b>Synthetic Number: {divisor.synthetic}</b>
            <b>6-10 min</b>
          </nav>
        </section>
        <aside>
          <Lightbulb />
          <h3>Key Idea</h3>
          <p>
            For a divisor <i>x − a</i>, use the synthetic number <i>a</i>.
          </p>
          <p>
            For <i>x + 2</i>, use −2 (not 2).
          </p>
        </aside>
      </header>
      <nav className="synthetic103-tabs">
        {[
          "Interaction + Visualization",
          "Explain",
          "Examples",
          "Formulas",
          "Know more",
        ].map((name) => (
          <button
            type="button"
            className={tab === name ? "active" : ""}
            onClick={() => {
              setTab(name as SyntheticTab103);
              act();
            }}
            key={name}
          >
            {name}
          </button>
        ))}
      </nav>
      <section className="synthetic103-controls">
        <label>
          Polynomial <i>P(x)</i>
          <input
            aria-label="Polynomial P of x"
            value={polynomialInput}
            onChange={(event) => {
              setPolynomialInput(event.target.value);
              setStage(5);
              act();
            }}
          />
          <small>
            {parsed.valid ? "Enter up to degree 5" : "Enter a polynomial in x"}
          </small>
        </label>
        <label>
          Divisor
          <input
            aria-label="Linear divisor"
            value={divisorInput}
            onChange={(event) => {
              setDivisorInput(event.target.value);
              setStage(5);
              act();
            }}
          />
          <small>
            {divisor.valid
              ? "Divisor must be of the form x − a"
              : "Use a monic linear divisor x − a"}
          </small>
        </label>
        <label>
          Synthetic number
          <output>{divisor.valid ? divisor.synthetic : "—"}</output>
          <small>
            Because {divisorInput} = x − ({divisor.synthetic})
          </small>
        </label>
        <aside>
          <h3>Display options</h3>
          <Switch
            label="Show coefficient row"
            value={showCoefficients}
            onToggle={() => {
              setShowCoefficients((value) => !value);
              act();
            }}
          />
          <Switch
            label="Show multiply/add arrows"
            value={showArrows}
            onToggle={() => {
              setShowArrows((value) => !value);
              act();
            }}
          />
          <Switch
            label="Check by expansion"
            value={checkExpansion}
            onToggle={() => {
              setCheckExpansion((value) => !value);
              act();
            }}
          />
        </aside>
        <button type="button" className="reset" onClick={() => reset()}>
          <RotateCcw />
          Reset
        </button>
      </section>
      {tab !== "Interaction + Visualization" && (
        <SyntheticTabPanel103
          tab={tab}
          quotient={quotientText}
          remainder={calculation.remainder}
        />
      )}
      <main
        className={
          tab === "Interaction + Visualization"
            ? "synthetic103-workspace"
            : "synthetic103-workspace hidden"
        }
      >
        <header>
          <h2>Synthetic division steps</h2>
          <p>
            Divide <i>P(x) = {formatPolynomial(parsed.coefficients)}</i> by{" "}
            <i>{divisorInput}</i>
          </p>
          <button type="button" onClick={animate}>
            <Play />
            Animate steps
          </button>
        </header>
        <div className="synthetic103-method">
          <ol>
            <li>
              <b>Bring down</b>
              <span>Bring down the first coefficient.</span>
            </li>
            <li>
              <b>Multiply</b>
              <span>Multiply by {divisor.synthetic}.</span>
            </li>
            <li>
              <b>Add</b>
              <span>Add the result.</span>
            </li>
            <li>
              <b>Multiply</b>
              <span>Multiply by {divisor.synthetic} again.</span>
            </li>
            <li>
              <b>Add</b>
              <span>Add to get remainder.</span>
            </li>
          </ol>
          <SyntheticTable
            coefficients={parsed.coefficients}
            synthetic={divisor.synthetic}
            calculation={calculation}
            stage={stage}
            showCoefficients={showCoefficients}
            showArrows={showArrows}
            startDrag={startDrag}
            endDrag={() => setDragging("")}
            dropSynthetic={dropSynthetic}
          />
        </div>
        <section className="synthetic103-answer">
          <span>Quotient coefficients:</span>
          {calculation.quotient.map((value, index) => (
            <b key={index}>{value}</b>
          ))}
          <span>Remainder:</span>
          <b>{calculation.remainder}</b>
        </section>
        <h3 className="synthetic103-result-line">
          Quotient: <b>{quotientText}</b>
          <span>
            Remainder: <b>{calculation.remainder}</b>
          </span>
        </h3>
        <section className="synthetic103-proof">
          <article
            className={checkExpansion && expansionVerified ? "verified" : ""}
          >
            <h3>
              <Check />
              Check by expansion{" "}
              <b>
                {checkExpansion && expansionVerified ? "Verified" : "Hidden"}
              </b>
            </h3>
            {checkExpansion && (
              <>
                <p>
                  ({divisorInput})({quotientText}) + {calculation.remainder} ={" "}
                  {formatPolynomial(parsed.coefficients)}
                </p>
                <p>
                  {formatPolynomial(parsed.coefficients)} ={" "}
                  {formatPolynomial(parsed.coefficients)}
                </p>
              </>
            )}
          </article>
          <article>
            <Trophy />
            <h3>Result</h3>
            <dl>
              <dt>Divisor:</dt>
              <dd>{divisorInput}</dd>
              <dt>Quotient:</dt>
              <dd>{quotientText}</dd>
              <dt>Remainder:</dt>
              <dd>{calculation.remainder}</dd>
            </dl>
            <p>
              So,{" "}
              <span>
                {formatPolynomial(parsed.coefficients)} / ({divisorInput})
              </span>{" "}
              = <b>{quotientText}</b>
            </p>
          </article>
        </section>
        <section className="synthetic103-practice">
          <header>
            <h2>Try it yourself</h2>
            <p>Apply synthetic division to the new problem.</p>
            <button
              type="button"
              onClick={() => {
                const next = (practiceIndex + 1) % practices.length;
                setPracticeIndex(next);
                clearPractice(next);
                act();
              }}
            >
              <RefreshCw />
              New problem
            </button>
          </header>
          <div className="synthetic103-practice-inputs">
            <label>
              Polynomial <i>P(x)</i>
              <output>{practice.polynomial}</output>
            </label>
            <label>
              Divisor<output>{practice.divisor}</output>
            </label>
            <label>
              Synthetic number<output>{practiceDivisor.synthetic}</output>
            </label>
            <button
              type="button"
              onClick={() => {
                setPracticeChecked(true);
                act();
              }}
            >
              Check answer
            </button>
          </div>
          <div className="synthetic103-practice-body">
            <PracticeTable
              coefficients={practiceParsed.coefficients}
              synthetic={practiceDivisor.synthetic}
              products={practiceProducts}
              sums={practiceSums}
              quotient={practiceQuotient}
              remainder={practiceRemainder}
              updateProducts={(index, value) =>
                update(setPracticeProducts, index, value)
              }
              updateSums={(index, value) =>
                update(setPracticeSums, index, value)
              }
              updateQuotient={(index, value) =>
                update(setPracticeQuotient, index, value)
              }
              updateRemainder={(value) => {
                setPracticeRemainder(value);
                setPracticeChecked(false);
                act();
              }}
            />
            <aside>
              <article>
                <Lightbulb />
                <h3>Tip</h3>
                <p>
                  For divisor {practice.divisor}, use synthetic number{" "}
                  {practiceDivisor.synthetic}.
                </p>
              </article>
              <article>
                <h3>Solution</h3>
                <button type="button" onClick={fillSolution}>
                  <Eye />
                  Show solution
                </button>
                {practiceChecked && (
                  <p className={practiceCorrect ? "correct" : "wrong"}>
                    {practiceCorrect
                      ? "Correct"
                      : "Check each multiply and add row."}
                  </p>
                )}
              </article>
            </aside>
          </div>
        </section>
      </main>
      <nav className="synthetic103-navigation">
        <a href="/lessons/algebra/102-polynomial-operations">
          <ArrowLeft />
          <span>
            Previous<b>Polynomial Operations</b>
          </span>
        </a>
        <a href="/lessons/algebra/104-remainder-theorem">
          <span>
            Next<b>Remainder Theorem</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="synthetic103-footer">
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
      <LessonTopicStudyBoard lessonId={103} view={tab} onInteraction={onInteraction} />

    </div>
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
      <span>{label}</span>
      <i className={value ? "on" : ""}>
        <b />
      </i>
    </button>
  );
}

function SyntheticTable({
  coefficients,
  synthetic,
  calculation,
  stage,
  showCoefficients,
  showArrows,
  startDrag,
  endDrag,
  dropSynthetic,
}: {
  coefficients: number[];
  synthetic: number;
  calculation: ReturnType<typeof divide>;
  stage: number;
  showCoefficients: boolean;
  showArrows: boolean;
  startDrag: (event: DragEvent<HTMLButtonElement>) => void;
  endDrag: () => void;
  dropSynthetic: (event: DragEvent<HTMLElement>) => void;
}) {
  const productCells = (lastOnly: boolean) =>
    calculation.products.map((value, index) => {
      const visible =
        index > 0 &&
        (!lastOnly || index === coefficients.length - 1) &&
        stage >= Math.min(4, index * 2);
      return (
        <b key={index}>
          {visible ? (
            <>
              {showArrows && <span>→</span>}
              {value}
            </>
          ) : (
            ""
          )}
        </b>
      );
    });
  const sumCells = (final: boolean) =>
    calculation.sums.map((value, index) => (
      <b key={index}>
        {stage >= (final ? 5 : Math.min(5, index * 2 + 1)) ? value : ""}
      </b>
    ));
  return (
    <section
      className="synthetic103-table"
      style={
        { "--synthetic-columns": coefficients.length } as React.CSSProperties
      }
    >
      <button
        type="button"
        draggable
        aria-label="Drag synthetic number"
        onDragStart={startDrag}
        onDragEnd={endDrag}
      >
        {synthetic}
      </button>
      <div
        className="drop"
        aria-label="Synthetic number drop target"
        onDragOver={(event) => event.preventDefault()}
        onDrop={dropSynthetic}
      >
        {synthetic}
      </div>
      <header>
        <span>
          Coefficients of <i>P(x)</i>
        </span>
        {coefficients.map((value, index) => (
          <b draggable key={index}>
            {showCoefficients ? value : "•"}
          </b>
        ))}
      </header>
      <section className="bring">
        <i />
        {calculation.sums.map((value, index) => (
          <b key={index}>{stage >= 1 && index === 0 ? value : ""}</b>
        ))}
      </section>
      <section className="multiply first">
        <i>× {synthetic}</i>
        {productCells(false)}
      </section>
      <section className="add first">
        <i>+</i>
        {sumCells(false)}
      </section>
      <section className="multiply second">
        <i>× {synthetic}</i>
        {productCells(true)}
      </section>
      <section className="add final">
        <i>+</i>
        {sumCells(true)}
      </section>
    </section>
  );
}

function PracticeTable({
  coefficients,
  synthetic,
  products,
  sums,
  quotient,
  remainder,
  updateProducts,
  updateSums,
  updateQuotient,
  updateRemainder,
}: {
  coefficients: number[];
  synthetic: number;
  products: number[];
  sums: number[];
  quotient: number[];
  remainder: number;
  updateProducts: (index: number, value: number) => void;
  updateSums: (index: number, value: number) => void;
  updateQuotient: (index: number, value: number) => void;
  updateRemainder: (value: number) => void;
}) {
  const display = (value: number) => (Number.isNaN(value) ? "" : value);
  return (
    <section
      className="synthetic103-practice-table"
      style={
        { "--synthetic-columns": coefficients.length } as React.CSSProperties
      }
    >
      <b>{synthetic}</b>
      <header>
        <span>
          Coefficients of <i>P(x)</i>
        </span>
        {coefficients.map((value, index) => (
          <strong key={index}>{value}</strong>
        ))}
      </header>
      <section>
        <i>× {synthetic}</i>
        <em />
        <>
          {products.map((value, index) => (
            <input
              aria-label={`Practice product ${index + 1}`}
              type="number"
              value={display(value)}
              onChange={(event) =>
                updateProducts(
                  index,
                  event.target.value === ""
                    ? Number.NaN
                    : Number(event.target.value),
                )
              }
              key={index}
            />
          ))}
        </>
      </section>
      <section>
        <i>+</i>
        {sums.map((value, index) => (
          <input
            aria-label={`Practice sum ${index}`}
            type="number"
            value={display(value)}
            onChange={(event) =>
              updateSums(
                index,
                event.target.value === ""
                  ? Number.NaN
                  : Number(event.target.value),
              )
            }
            key={index}
          />
        ))}
      </section>
      <footer>
        <span>Quotient:</span>
        {quotient.map((value, index) => (
          <label key={index}>
            <input
              aria-label={`Practice quotient coefficient ${index}`}
              type="number"
              value={display(value)}
              onChange={(event) =>
                updateQuotient(
                  index,
                  event.target.value === ""
                    ? Number.NaN
                    : Number(event.target.value),
                )
              }
            />
            {index < quotient.length - 1 && "x +"}
          </label>
        ))}
        <span>Remainder:</span>
        <input
          aria-label="Practice remainder"
          type="number"
          value={display(remainder)}
          onChange={(event) =>
            updateRemainder(
              event.target.value === ""
                ? Number.NaN
                : Number(event.target.value),
            )
          }
        />
      </footer>
    </section>
  );
}

function SyntheticTabPanel103({
  tab,
  quotient,
  remainder,
}: {
  tab: Exclude<SyntheticTab103, "Interaction + Visualization">;
  quotient: string;
  remainder: number;
}) {
  const content =
    tab === "Explain"
      ? [
          "Use the zero of x − a as the synthetic number a.",
          "Bring down, multiply, and add repeatedly across the coefficient row.",
        ]
      : tab === "Examples"
        ? practices.map((item) => {
            const parsed = parsePolynomial(item.polynomial);
            const divisor = parseDivisor(item.divisor);
            const result = divide(parsed.coefficients, divisor.synthetic);
            return `${item.polynomial} ÷ (${item.divisor}) → ${formatPolynomial(result.quotient)}, remainder ${result.remainder}`;
          })
        : tab === "Formulas"
          ? [
              "P(x) = (x − a)Q(x) + R",
              `Current quotient: ${quotient}; remainder: ${remainder}`,
            ]
          : [
              "Synthetic division is Horner's method written as a compact table.",
              "A zero coefficient must be included for every missing power.",
            ];
  return (
    <section className="synthetic103-tab-panel" data-active-learning-tab={tab}>
      <h2>{tab}</h2>
      <strong>
        {quotient}, remainder {remainder}
      </strong>
      {content.map((item) => (
        <p key={item}>{item}</p>
      ))}
    </section>
  );
}
