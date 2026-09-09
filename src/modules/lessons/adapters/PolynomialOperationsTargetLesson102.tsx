import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ExternalLink,
  Languages,
  RefreshCw,
  RotateCcw,
  Share2,
  XCircle,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type DragEvent,
} from "react";
import type { LessonAdapterProps } from "../types";
import {
  evaluatePolynomial102 as evaluate,
  formatPolynomial102 as polynomial,
  INITIAL_POLYNOMIAL_A_102 as initialA,
  INITIAL_POLYNOMIAL_B_102 as initialB,
  isPolynomialPracticeCorrect102,
  operationValues102,
  parsePolynomialTile102,
  POLYNOMIAL_PRACTICES_102 as practiceSets,
  polynomialTileLabel102 as tileLabel,
  type PolynomialCoefficients102 as Coefficients,
  type PolynomialOperation102 as Operation,
  type PolynomialTile102 as Tile,
} from "./polynomialOperationsLesson102Model";
import "./PolynomialOperationsTargetLesson102.css";

type PolynomialTab102 =
  "Interact" | "Explain" | "Examples" | "Rules" | "Practice" | "Know more";

export default function PolynomialOperationsTargetLesson102({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [operation, setOperation] = useState<Operation>("add");
  const [alignPowers, setAlignPowers] = useState(true);
  const [combineColumns, setCombineColumns] = useState(true);
  const [substitutionCheck, setSubstitutionCheck] = useState(true);
  const [checkValue, setCheckValue] = useState(1);
  const [tab, setTab] = useState<PolynomialTab102>("Interact");
  const [language, setLanguage] = useState("en");
  const [showGuided, setShowGuided] = useState(true);
  const [selectedTile, setSelectedTile] = useState("");
  const [dragging, setDragging] = useState("");
  const [tileDrops, setTileDrops] = useState<string[]>([]);
  const [invalidDrop, setInvalidDrop] = useState("");
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceAnswer, setPracticeAnswer] = useState([5, 6, 3]);
  const [practiceChecked, setPracticeChecked] = useState(true);
  const [shareCount, setShareCount] = useState(0);
  const [actions, setActions] = useState(0);
  const proof = useMemo(
    () => operationValues102(initialA, initialB, operation, checkValue),
    [operation, checkValue],
  );
  const result = proof.result;
  const degrees = operation === "multiply" ? [3, 2, 1, 0] : [2, 1, 0];
  const operationSymbol =
    operation === "add" ? "+" : operation === "subtract" ? "−" : "×";
  const leftValue = proof.left;
  const resultValue = proof.right;
  const equal = proof.equal;
  const tiles: Tile[] = [
    ...Object.entries(initialA),
    ...Object.entries(initialB),
  ]
    .map(([degree, coefficient], index) => {
      const row: Tile["row"] = index < 3 ? "A" : "B";
      return {
        id: `${row}-${degree}`,
        row,
        degree: Number(degree),
        coefficient,
      };
    })
    .filter((tile) => tile.coefficient !== 0);
  const currentPractice = practiceSets[practiceIndex];
  const practiceCorrect = isPolynomialPracticeCorrect102(
    practiceAnswer,
    currentPractice.answer,
  );
  const copy =
    language === "hi"
      ? {
          intro: "समान घातों को एक सीध में रखकर बहुपदों को जोड़ें या घटाएँ।",
          workspace: "बहुपद सारणी कार्यक्षेत्र",
          help: "पद टाइलों को सही घात वाले स्तंभों में खींचें।",
        }
      : {
          intro: "Add or subtract polynomials by aligning like powers.",
          workspace: "Polynomial table workspace",
          help: "Drag term tiles into the correct degree columns. Like powers align vertically and combine.",
        };
  const act = () => {
    setActions((count) => count + 1);
    onInteraction();
  };
  const reset = (notify = true) => {
    setOperation("add");
    setAlignPowers(true);
    setCombineColumns(true);
    setSubstitutionCheck(true);
    setCheckValue(1);
    setTab("Interact");
    setLanguage("en");
    setShowGuided(true);
    setSelectedTile("");
    setDragging("");
    setTileDrops([]);
    setInvalidDrop("");
    setPracticeIndex(0);
    setPracticeAnswer([5, 6, 3]);
    setPracticeChecked(true);
    setShareCount(0);
    setActions(0);
    if (notify) onInteraction();
  };
  useEffect(() => {
    reset(false);
  }, [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps
  const chooseOperation = (next: Operation) => {
    setOperation(next);
    setInvalidDrop("");
    act();
  };
  const startDrag = (event: DragEvent<HTMLButtonElement>, tile: Tile) => {
    event.dataTransfer.setData("text/polynomial-tile", JSON.stringify(tile));
    setDragging(tile.id);
    setSelectedTile(tile.id);
  };
  const dropTile = (
    event: DragEvent<HTMLElement>,
    row: "A" | "B",
    degree: number,
  ) => {
    event.preventDefault();
    const tile = parsePolynomialTile102(
      event.dataTransfer.getData("text/polynomial-tile"),
    );
    if (!tile) {
      setDragging("");
      return;
    }
    if (tile.row === row && tile.degree === degree) {
      setTileDrops((current) =>
        current.includes(tile.id) ? current : [...current, tile.id],
      );
      setInvalidDrop("");
    } else setInvalidDrop(`${tile.id}->${row}-${degree}`);
    setDragging("");
    act();
  };
  const nextPractice = () => {
    const next = (practiceIndex + 1) % practiceSets.length;
    setPracticeIndex(next);
    setPracticeAnswer([0, 0, 0]);
    setPracticeChecked(false);
    act();
  };
  const shareLesson = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: "Polynomial Operations", url });
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
    }
    setShareCount((count) => count + 1);
    act();
  };

  return (
    <div
      className="poly102-page"
      data-testid="algebra-mockup-0159"
      data-dedicated-lesson="102"
      data-object-model="dedicated-tested-coefficient-map-polynomial-add-subtract-convolution-validated-draggable-degree-columns-substitution-equivalence-graded-practice-functional-tabs-language-and-native-sharing-model"
      data-operation={operation}
      data-polynomial-a={polynomial(initialA)}
      data-polynomial-b={polynomial(initialB)}
      data-result={polynomial(result)}
      data-degree={Math.max(
        ...Object.keys(result)
          .filter((key) => result[Number(key)])
          .map(Number),
      )}
      data-align-powers={alignPowers}
      data-combine-columns={combineColumns}
      data-substitution-check={substitutionCheck}
      data-check-value={checkValue}
      data-left-value={leftValue}
      data-result-value={resultValue}
      data-equal={equal}
      data-tab={tab}
      data-language={language}
      data-selected-tile={selectedTile}
      data-dragging={dragging}
      data-tile-drops={tileDrops.join(",")}
      data-invalid-drop={invalidDrop}
      data-practice-index={practiceIndex}
      data-practice-answer={practiceAnswer.join(",")}
      data-practice-correct={practiceChecked && practiceCorrect}
      data-share-count={shareCount}
      data-actions={actions}
    >
      <nav className="poly102-breadcrumb">
        <a href="/">Home</a>
        <span>&gt;</span>
        <a href="/lessons">Lessons</a>
        <span>&gt;</span>
        <a href="/lessons/algebra">Algebra</a>
        <span>&gt;</span>
        <b>102 Polynomial Operations</b>
      </nav>
      <header className="poly102-intro">
        <small>
          <b>ALGEBRA</b>
          <b>EXPRESSIONS AND MANIPULATION</b>
        </small>
        <h1>Polynomial Operations</h1>
        <p>{copy.intro}</p>
        <nav>
          <b>Intermediate Algebra</b>
          <b>Worked Example</b>
          <b>Polynomial table</b>
          <b>6-10 min</b>
        </nav>
        <aside>
          <label>
            <Languages />
            <select
              aria-label="Lesson language"
              value={language}
              onChange={(event) => {
                setLanguage(event.target.value);
                act();
              }}
            >
              <option value="en">English (English)</option>
              <option value="hi">Hindi (हिन्दी)</option>
            </select>
          </label>
          <button type="button" onClick={() => reset()}>
            <RotateCcw />
            Reset
          </button>
          <button type="button" onClick={shareLesson}>
            <Share2 />
            Share
          </button>
          <a href="/workspace">
            <ExternalLink />
            Workspace
          </a>
        </aside>
      </header>
      <nav className="poly102-tabs">
        {[
          "Interact",
          "Explain",
          "Examples",
          "Rules",
          "Practice",
          "Know more",
        ].map((name) => (
          <button
            type="button"
            className={tab === name ? "active" : ""}
            key={name}
            onClick={() => {
              setTab(name as PolynomialTab102);
              act();
            }}
          >
            {name}
          </button>
        ))}
      </nav>
      {tab !== "Interact" && (
        <PolynomialTabPanel102 tab={tab} result={polynomial(result)} />
      )}
      <section
        className={
          tab === "Interact" ? "poly102-dashboard" : "poly102-dashboard hidden"
        }
      >
        <header>
          <nav>
            {(["add", "subtract", "multiply"] as Operation[]).map((name) => (
              <button
                type="button"
                className={operation === name ? "active" : ""}
                key={name}
                onClick={() => chooseOperation(name)}
              >
                {name[0].toUpperCase() + name.slice(1)}
              </button>
            ))}
          </nav>
          <Toggle
            label="Align powers"
            value={alignPowers}
            onToggle={() => {
              setAlignPowers((current) => !current);
              act();
            }}
          />
          <Toggle
            label="Combine columns"
            value={combineColumns}
            onToggle={() => {
              setCombineColumns((current) => !current);
              act();
            }}
          />
          <Toggle
            label="Check by substitution"
            value={substitutionCheck}
            onToggle={() => {
              setSubstitutionCheck((current) => !current);
              act();
            }}
          />
          <label>
            x check value
            <input
              aria-label="x check value"
              type="number"
              min="-5"
              max="5"
              value={checkValue}
              onChange={(event) => {
                setCheckValue(
                  Math.max(-5, Math.min(5, Number(event.target.value))),
                );
                act();
              }}
            />
          </label>
        </header>
        <div className="poly102-body">
          <section className="poly102-left">
            <article className="poly102-table-card">
              <h2>{copy.workspace}</h2>
              <p>{copy.help}</p>
              {alignPowers ? (
                <PolynomialTable
                  degrees={degrees}
                  operation={operation}
                  result={result}
                  combine={combineColumns}
                  onDrop={dropTile}
                />
              ) : (
                <section className="poly102-unaligned">
                  <p>{polynomial(initialA)}</p>
                  <b>{operationSymbol}</b>
                  <p>{polynomial(initialB)}</p>
                  <strong>
                    {combineColumns
                      ? polynomial(result)
                      : "Align powers before combining"}
                  </strong>
                </section>
              )}
              <h3>
                ({polynomial(initialA)}) {operationSymbol} (
                {polynomial(initialB)}) ={" "}
                {combineColumns ? polynomial(result) : "combine columns"}
              </h3>
              {substitutionCheck && (
                <section className="poly102-check">
                  <h3>
                    <CheckCircle2 />
                    Substitution check (x = {checkValue})
                  </h3>
                  <div>
                    <article>
                      <b>Result polynomial</b>
                      <p>
                        {polynomial(result).replaceAll("x", `(${checkValue})`)}
                      </p>
                      <p>= {resultValue}</p>
                    </article>
                    <article>
                      <b>Original expression</b>
                      <p>
                        ({polynomial(initialA)}) {operationSymbol} (
                        {polynomial(initialB)})
                      </p>
                      <p>= {leftValue}</p>
                    </article>
                  </div>
                </section>
              )}
              <aside>
                <AlertTriangle />
                <b>Do not combine unlike powers.</b>
                <p>
                  x² + x is not 2x² or 2x. Only terms with the same power can be
                  combined.
                </p>
              </aside>
            </article>
            <article className="poly102-guided">
              <section>
                <h3>Guided steps</h3>
                {showGuided && (
                  <ol>
                    <li>Write each polynomial in standard form.</li>
                    <li>Set up columns for each power.</li>
                    <li>Place each term in its degree column.</li>
                    <li>
                      {operation === "multiply"
                        ? "Multiply every term and collect equal powers."
                        : "Add the coefficients in each column."}
                    </li>
                    <li>Write the final polynomial in standard form.</li>
                  </ol>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setShowGuided((current) => !current);
                    act();
                  }}
                >
                  {showGuided ? "Show less⌃" : "Show steps⌄"}
                </button>
              </section>
              <article>
                <h3>Worked example summary</h3>
                <p>A = {polynomial(initialA)}</p>
                <p>B = {polynomial(initialB)}</p>
                <p>
                  A {operationSymbol} B = {polynomial(result)}
                </p>
                <div>
                  {degrees
                    .filter((degree) => result[degree])
                    .map((degree) => (
                      <b className={`degree-${degree}`} key={degree}>
                        {tileLabel(result[degree], degree).replace("+", "")}
                      </b>
                    ))}
                </div>
              </article>
            </article>
          </section>
          <aside className="poly102-rail">
            <article>
              <h3>What's happening?</h3>
              <ol>
                <li>
                  <i>1</i>
                  <b>Align like powers in columns</b>
                  <p>Place each term under its degree: x², x¹, and constant.</p>
                </li>
                <li>
                  <i>2</i>
                  <b>
                    {operation === "multiply"
                      ? "Distribute every term"
                      : `${operation === "add" ? "Add" : "Subtract"} coefficients vertically`}
                  </b>
                  <p>Combine the numbers contributing to each power.</p>
                </li>
                <li>
                  <i>3</i>
                  <b>Write the result</b>
                  <p>Keep powers and write coefficients in standard form.</p>
                </li>
              </ol>
            </article>
            <article>
              <h3>Rule</h3>
              <p>For any real numbers a, b and integer n ≥ 0:</p>
              <strong>axⁿ + bxⁿ = (a + b)xⁿ</strong>
              <p>Only like powers can be combined.</p>
            </article>
            <article className="poly102-bank">
              <h3>Term tiles</h3>
              <p>Drag tiles into the columns above</p>
              {[2, 1, 0].map((degree) => (
                <section key={degree}>
                  <b>
                    {degree === 2
                      ? "Degree x²"
                      : degree === 1
                        ? "Degree x"
                        : "Constant"}
                  </b>
                  <div>
                    {tiles
                      .filter((tile) => tile.degree === degree)
                      .map((tile) => (
                        <button
                          type="button"
                          draggable
                          aria-label={`Drag ${tile.row} degree ${degree} term`}
                          className={`degree-${degree} ${selectedTile === tile.id ? "selected" : ""}`}
                          key={tile.id}
                          onClick={() => {
                            setSelectedTile(tile.id);
                            act();
                          }}
                          onDragStart={(event) => startDrag(event, tile)}
                          onDragEnd={() => setDragging("")}
                        >
                          {tileLabel(tile.coefficient, tile.degree)}
                        </button>
                      ))}
                  </div>
                </section>
              ))}
            </article>
            <article>
              <h3>Tips</h3>
              <ul>
                <li>Missing terms? That's okay—use a 0 placeholder.</li>
                <li>Keep the sign with the coefficient.</li>
                <li>After combining, write terms in descending order.</li>
              </ul>
              {invalidDrop && (
                <p className="invalid">
                  <XCircle />
                  That tile belongs in its matching row and degree.
                </p>
              )}
            </article>
          </aside>
        </div>
      </section>
      <section className="poly102-practice">
        <header>
          <h2>Try it yourself</h2>
          <p>Practice addition by aligning like powers.</p>
        </header>
        <section>
          <PracticeTable
            set={currentPractice}
            answer={practiceAnswer}
            onAnswer={(index, value) => {
              setPracticeAnswer((current) =>
                current.map((coefficient, itemIndex) =>
                  itemIndex === index ? value : coefficient,
                ),
              );
              setPracticeChecked(false);
              act();
            }}
          />
        </section>
        <article>
          <h3>Your turn</h3>
          <p>Compute and check by substitution.</p>
          <strong>
            ({polynomial(currentPractice.a, "y")}) + (
            {polynomial(currentPractice.b, "y")}) ={" "}
            {polynomial(
              {
                2: practiceAnswer[0],
                1: practiceAnswer[1],
                0: practiceAnswer[2],
              },
              "y",
            )}{" "}
            {practiceChecked && practiceCorrect && <Check />}
          </strong>
          <p>Check with y = 1</p>
          <div>
            <span>
              <b>Result</b>
              <br />
              {practiceAnswer[0]}(1)² + {practiceAnswer[1]}(1) +{" "}
              {practiceAnswer[2]} ={" "}
              <em>{practiceAnswer.reduce((sum, value) => sum + value, 0)}</em>
            </span>
            <span>
              <b>Original</b>
              <br />({evaluate(currentPractice.a, 1)}) + (
              {evaluate(currentPractice.b, 1)}) ={" "}
              <em>
                {evaluate(currentPractice.a, 1) +
                  evaluate(currentPractice.b, 1)}
              </em>
            </span>
          </div>
          {(!practiceChecked || !practiceCorrect) && (
            <button
              type="button"
              className="check"
              onClick={() => {
                setPracticeChecked(true);
                act();
              }}
            >
              {practiceChecked ? "Try again" : "Check answer"}
            </button>
          )}
          <button type="button" className="new" onClick={nextPractice}>
            <RefreshCw />
            New practice
          </button>
        </article>
      </section>
      <nav className="poly102-navigation">
        <a href="/lessons/algebra/101-order-of-operations">
          <ArrowLeft />
          <span>
            Previous<b>Order of Operations</b>
          </span>
        </a>
        <a href="/lessons/algebra/103-synthetic-division">
          <span>
            Next<b>Synthetic Division</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="poly102-footer">
        <h3>Math Universe</h3>
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
    </div>
  );
}

function Toggle({
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
function PolynomialTable({
  degrees,
  operation,
  result,
  combine,
  onDrop,
}: {
  degrees: number[];
  operation: Operation;
  result: Coefficients;
  combine: boolean;
  onDrop: (
    event: DragEvent<HTMLElement>,
    row: "A" | "B",
    degree: number,
  ) => void;
}) {
  const columns = { "--poly-columns": degrees.length } as CSSProperties;
  return (
    <section className="poly102-table" style={columns}>
      <header>
        <b />
        <>
          {degrees.map((degree) => (
            <b className={`degree-${degree}`} key={degree}>
              {degree === 0
                ? "Constant"
                : degree === 1
                  ? "x"
                  : `x${["⁰", "¹", "²", "³", "⁴"][degree]}`}
            </b>
          ))}
        </>
      </header>
      <TableRow
        label={`Polynomial A|${polynomial(initialA)}`}
        degrees={degrees}
        coefficients={initialA}
        row="A"
        onDrop={onDrop}
      />
      <TableRow
        label={`Operation|${operation === "add" ? "+" : operation === "subtract" ? "−" : "×"}`}
        degrees={degrees}
        coefficients={Object.fromEntries(
          degrees.map((degree) => [degree, NaN]),
        )}
        row="A"
        onDrop={onDrop}
        operation
      />
      <TableRow
        label={`Polynomial B|${polynomial(initialB)}`}
        degrees={degrees}
        coefficients={initialB}
        row="B"
        onDrop={onDrop}
      />
      <TableRow
        label="Add coefficients|(column result)"
        degrees={degrees}
        coefficients={result}
        row="A"
        onDrop={onDrop}
        sum
      />
      <TableRow
        label="Result|"
        degrees={degrees}
        coefficients={combine ? result : {}}
        row="A"
        onDrop={onDrop}
        result
      />
    </section>
  );
}
function TableRow({
  label,
  degrees,
  coefficients,
  row,
  onDrop,
  operation = false,
  sum = false,
  result = false,
}: {
  label: string;
  degrees: number[];
  coefficients: Coefficients;
  row: "A" | "B";
  onDrop: (
    event: DragEvent<HTMLElement>,
    row: "A" | "B",
    degree: number,
  ) => void;
  operation?: boolean;
  sum?: boolean;
  result?: boolean;
}) {
  const [title, detail] = label.split("|");
  return (
    <section
      className={`${operation ? "operation" : ""} ${sum ? "sum" : ""} ${result ? "result" : ""}`}
    >
      <header>
        <b>{title}</b>
        <span>{detail}</span>
      </header>
      {degrees.map((degree) => (
        <div
          className={`degree-${degree}`}
          aria-label={`${row} degree ${degree} drop target`}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => onDrop(event, row, degree)}
          key={degree}
        >
          {operation ? (
            <b>{Number.isNaN(coefficients[degree]) ? detail : ""}</b>
          ) : coefficients[degree] ? (
            <b>
              {result && coefficients[degree] === 1 && degree > 0
                ? tileLabel(coefficients[degree], degree).replace("+1", "")
                : tileLabel(coefficients[degree], degree)}
            </b>
          ) : (
            <i>—</i>
          )}
        </div>
      ))}
    </section>
  );
}
function PracticeTable({
  set,
  answer,
  onAnswer,
}: {
  set: { a: Coefficients; b: Coefficients };
  answer: number[];
  onAnswer: (index: number, value: number) => void;
}) {
  return (
    <div className="poly102-practice-table">
      <header>
        <b>Problem</b>
        <b>y²</b>
        <b>y</b>
        <b>Constant</b>
      </header>
      <PracticeRow name="A" values={[set.a[2], set.a[1], set.a[0]]} />
      <PracticeRow name="+" values={[NaN, NaN, NaN]} />
      <PracticeRow name="B" values={[set.b[2], set.b[1], set.b[0]]} />
      <section>
        <b>Sum (Combine)</b>
        {answer.map((value, index) => (
          <input
            aria-label={`Practice coefficient ${["y squared", "y", "constant"][index]}`}
            type="number"
            value={value}
            onChange={(event) => onAnswer(index, Number(event.target.value))}
            key={index}
          />
        ))}
      </section>
      <footer>
        <b>Result</b>
        <strong>
          {polynomial({ 2: answer[0], 1: answer[1], 0: answer[2] }, "y")}
        </strong>
      </footer>
    </div>
  );
}
function PracticeRow({ name, values }: { name: string; values: number[] }) {
  return (
    <section>
      <b>{name}</b>
      {values.map((value, index) => (
        <span key={index}>
          {Number.isNaN(value) ? "+" : tileLabel(value, 2 - index, "y", false)}
        </span>
      ))}
    </section>
  );
}

function PolynomialTabPanel102({
  tab,
  result,
}: {
  tab: Exclude<PolynomialTab102, "Interact">;
  result: string;
}) {
  const content =
    tab === "Explain"
      ? [
          "Align terms with the same degree before operating on coefficients.",
          "Keep unlike powers in separate columns.",
        ]
      : tab === "Examples"
        ? [
            "(x² + 3x + 2) + (2x + 3) = x² + 5x + 5",
            "(x² + 3x + 2) − (2x + 3) = x² + x − 1",
          ]
        : tab === "Rules"
          ? [
              "axⁿ + bxⁿ = (a + b)xⁿ",
              "Polynomial multiplication uses coefficient convolution.",
            ]
          : tab === "Practice"
            ? practiceSets.map(
                (set) =>
                  `Add ${polynomial(set.a, "y")} and ${polynomial(set.b, "y")}`,
              )
            : [
                "A missing degree has coefficient zero.",
                "Write final terms in descending degree order.",
              ];
  return (
    <section className="poly102-tab-panel" data-active-learning-tab={tab}>
      <h2>{tab}</h2>
      <strong>{result}</strong>
      {content.map((item) => (
        <p key={item}>{item}</p>
      ))}
    </section>
  );
}
