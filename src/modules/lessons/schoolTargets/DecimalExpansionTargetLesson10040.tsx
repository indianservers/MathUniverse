import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  CheckCircle2,
  FlaskConical,
  Lightbulb,
  Play,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  analyzeDecimalExpansion,
  type DecimalAnalysis,
} from "../decimalExpansion/decimalExpansionEngine";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./DecimalExpansionTargetLesson10040.css";

const tabs = ["Interact", "Learn", "Example", "Formula", "Practice"];
const fractionOptions = [
  [3, 11],
  [1, 8],
  [5, 12],
  [7, 20],
] as const;
const previousRoute =
  "/lessons/school/class-9/class-9-real-numbers-rational-and-irrational-classification";
const nextRoute =
  "/lessons/school/class-9/class-9-real-numbers-terminating-and-non-terminating-decimals";

export default function DecimalExpansionTargetLesson10040({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const target = useMemo(() => analyzeDecimalExpansion(1, 7), []);
  const challenge = useMemo(() => analyzeDecimalExpansion(5, 12), []);
  const [activeTab, setActiveTab] = useState("Interact");
  const [saved, setSaved] = useState(false);
  const [complete, setComplete] = useState(false);
  const [selected, setSelected] = useState("3/11");
  const [tryAnalysis, setTryAnalysis] = useState<DecimalAnalysis | null>(null);
  const [solutionShown, setSolutionShown] = useState(true);
  const [actions, setActions] = useState(0);
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const runSelected = () => {
    const [numerator, denominator] = selected.split("/").map(Number);
    act(() => setTryAnalysis(analyzeDecimalExpansion(numerator, denominator)));
  };

  return (
    <div
      className="decimal-target"
      data-testid="school-mockup-0714"
      data-object-model="dedicated-long-division-remainder-cycle-engine"
      data-actions={actions}
      data-main-fraction="1/7"
      data-main-cycle={target.repeatingDigits.join("")}
      data-try-result={tryAnalysis?.decimalDisplay ?? "idle"}
    >
      <header className="dt-hero">
        <div className="dt-hero-copy">
          <p>CLASS 9 · REAL NUMBERS</p>
          <h1>Decimal Expansion of Rational Numbers</h1>
          <span>
            Connect fraction division to terminating or recurring decimal
            expansions.
          </span>
          <div className="dt-pills">
            <b>18 min</b>
            <b>Intermediate</b>
            <b>Concept + Investigation</b>
          </div>
        </div>
        <button
          className={`dt-progress${complete ? " is-complete" : ""}`}
          type="button"
          onClick={() => act(() => setComplete((value) => !value))}
          aria-label="Toggle lesson completion"
        >
          <strong>{complete ? "100%" : "32%"}</strong>
          <small>Complete</small>
        </button>
        <div className="dt-hero-actions">
          <button type="button" onClick={() => act(() => setSaved(!saved))}>
            {saved ? <Check /> : <Bookmark />}
            {saved ? "Saved" : "Save lesson"}
          </button>
          <Link to="/lessons/school/class-9">
            <ArrowLeft /> Back to Real Numbers
          </Link>
        </div>
      </header>

      <nav className="dt-tabs" aria-label="Lesson sections">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            type="button"
            className={activeTab === tab ? "is-active" : ""}
            onClick={() => act(() => setActiveTab(tab))}
          >
            {index === 0 ? <FlaskConical /> : <span>{index + 1}</span>}
            {tab}
          </button>
        ))}
      </nav>

      <main className="dt-main">
        <section className="dt-worked">
          <h2>Long division, remainders and decimal expansion</h2>
          <div className="dt-work-grid">
            <FractionResult analysis={target} />
            <LongDivision analysis={target} title="Long division workspace" />
            <CycleTracker analysis={target} />
            <PlaceValueStrip analysis={target} />
          </div>
        </section>

        <section className="dt-rule">
          <Lightbulb />
          <div>
            <h2>The rule</h2>
            <p>
              A rational number terminates or eventually repeats; repeating a
              remainder repeats the subsequent digits.
            </p>
          </div>
        </section>

        <section className="dt-theory">
          <article>
            <h2>Why it works</h2>
            <p>
              At each step of long division, the remainder is always an integer
              between 0 and d - 1, where d is the denominator.
            </p>
            <p>There are only d - 1 possible non-zero remainders.</p>
            <p>
              By the Pigeonhole Principle, some remainder must repeat. If
              remainder 0 appears, the decimal terminates.
            </p>
            <small>
              This is why every rational number has a decimal expansion that
              terminates or eventually repeats.
            </small>
          </article>
          <article>
            <h2>
              Worked example <b>1/7</b>
            </h2>
            <p className="dt-equation">
              1/7 = <DecimalValue analysis={target} />
            </p>
            <p>Remainder cycle:</p>
            <CyclePills analysis={target} />
            <p>Repeating block length: 6</p>
            <p>Every time remainder 1 reappears, the next six digits repeat.</p>
          </article>
          <article className="dt-warning">
            <h2>
              <AlertTriangle /> Common misconception
            </h2>
            <p>
              “If I stop a recurring decimal after a few digits, it’s still the
              same number.”
            </p>
            <div>
              <span>
                <b>Correct</b>
                1/7 = 0.142857...
              </span>
              <span>
                <b>Not equal</b>
                0.142857 (terminates)
              </span>
            </div>
            <p>
              Truncating a repeating decimal gives a different rational number.
            </p>
          </article>
        </section>

        <section className="dt-bottom-grid">
          <article className="dt-challenge">
            <div className="dt-card-heading">
              <div>
                <h2>Mini challenge</h2>
                <p>
                  Run long division for 5/12. Mark the non-repeating and
                  repeating parts.
                </p>
              </div>
              <button
                type="button"
                onClick={() => act(() => setSolutionShown(!solutionShown))}
              >
                {solutionShown ? "Hide solution" : "Show solution"}
              </button>
            </div>
            {solutionShown ? (
              <div className="dt-challenge-solution">
                <LongDivision analysis={challenge} compact />
                <div>
                  <p>Remainder sequence: 5 → 2 → 8 → 8 → ...</p>
                  <p>Remainder 8 repeats at step 3.</p>
                  <p>
                    <i className="is-lilac" /> Non-repeating part: 0.41 (2
                    digits)
                  </p>
                  <p>
                    <i className="is-blue" /> Repeating part: 6 (1 digit)
                  </p>
                  <strong>
                    5/12 = <DecimalValue analysis={challenge} />
                  </strong>
                </div>
              </div>
            ) : (
              <p className="dt-hidden-solution">
                Use the remainders to find where the cycle begins.
              </p>
            )}
          </article>

          <aside className="dt-try">
            <h2>Try another</h2>
            <p>Select a fraction to explore.</p>
            <select
              value={selected}
              onChange={(event) =>
                act(() => {
                  setSelected(event.target.value);
                  setTryAnalysis(null);
                })
              }
            >
              {fractionOptions.map(([n, d]) => (
                <option key={`${n}/${d}`}>
                  {n}/{d}
                </option>
              ))}
            </select>
            <button type="button" onClick={runSelected}>
              <Play /> Run division
            </button>
            {tryAnalysis ? (
              <div className="dt-try-result" aria-live="polite">
                <DecimalValue analysis={tryAnalysis} />
                <small>
                  {tryAnalysis.classification}; remainders{" "}
                  {tryAnalysis.remainders.join(" → ")}
                </small>
              </div>
            ) : (
              <p>Look for when a remainder repeats (or reaches 0).</p>
            )}
          </aside>
        </section>
      </main>

      <nav className="dt-bottom-nav" aria-label="Lesson navigation">
        <Link to={previousRoute}>
          <ArrowLeft />
          <span>
            <small>Previous lesson</small>Irrational Numbers
          </span>
        </Link>
        <button type="button" onClick={() => act(() => setComplete(true))}>
          <Check />
          {complete ? "Lesson complete" : "Mark lesson complete"}
        </button>
        <Link to={nextRoute}>
          <span>
            <small>Next lesson</small>Terminating & Non-Terminating Decimals
          </span>
          <ArrowRight />
        </Link>
      </nav>
    </div>
  );
}

function DecimalValue({ analysis }: { analysis: DecimalAnalysis }) {
  return (
    <span className="dt-decimal-value">
      {analysis.integerPart}.{analysis.nonRepeatingDigits.join("")}
      {analysis.repeatingDigits.length ? (
        <u>{analysis.repeatingDigits.join("")}</u>
      ) : null}
    </span>
  );
}

function FractionResult({ analysis }: { analysis: DecimalAnalysis }) {
  return (
    <article className="dt-fraction-card">
      <h3>
        <b>1</b> Choose a fraction
      </h3>
      <div className="dt-fraction">
        <strong>1</strong>
        <span />
        <strong>7</strong>
        <b>⌄</b>
      </div>
      <p>Decimal result</p>
      <DecimalValue analysis={analysis} />
      <ul>
        <li>
          <i className="is-lilac" /> Non-repeating part
        </li>
        <li>
          <i className="is-blue" /> Repeating part (6 digits)
        </li>
      </ul>
      <strong>Overbar shows repeating block</strong>
      <aside>
        <AlertTriangle /> Stopping a recurring decimal after a few digits
        changes its exact value.
      </aside>
    </article>
  );
}

function LongDivision({
  analysis,
  title,
  compact = false,
}: {
  analysis: DecimalAnalysis;
  title?: string;
  compact?: boolean;
}) {
  const rows = analysis.steps.slice(1);
  return (
    <article className={`dt-division${compact ? " is-compact" : ""}`}>
      {title ? (
        <h3>
          <b>2</b> {title}
        </h3>
      ) : null}
      <div className="dt-division-number">
        <span>{analysis.reducedDenominator}</span>
        <b>{Math.abs(analysis.reducedNumerator)}.000000...</b>
      </div>
      <DecimalValue analysis={analysis} />
      <div className="dt-division-steps">
        {rows.map((step) => (
          <span key={step.index}>
            <em>- {step.product}</em>
            <b>
              {step.nextRemainder}
              {step.nextRemainder !== 0 ? "0" : ""}
            </b>
          </span>
        ))}
      </div>
      <ArrowRight className="dt-down-arrow" />
    </article>
  );
}

function CycleTracker({ analysis }: { analysis: DecimalAnalysis }) {
  return (
    <article className="dt-cycle">
      <h3>
        <b>3</b> Remainder cycle tracker
      </h3>
      <table>
        <thead>
          <tr>
            <th>Step</th>
            <th>Remainder</th>
            <th>Next digit</th>
            <th>Cycle</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Start</td>
            <td>1</td>
            <td>1</td>
            <td>—</td>
          </tr>
          {analysis.steps.slice(1).map((step, index) => (
            <tr key={step.index}>
              <td>{index + 1}</td>
              <td>{step.nextRemainder}</td>
              <td>{analysis.digits[(index + 1) % analysis.digits.length]}</td>
              <td>
                {analysis.remainders[index]} → {step.nextRemainder}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="dt-cycle-success">
        <CheckCircle2 />
        <span>
          <b>Remainder 1 repeats.</b>The cycle 1 → 3 → 2 → 6 → 4 → 5 → 1
          repeats.
        </span>
      </div>
    </article>
  );
}

function PlaceValueStrip({ analysis }: { analysis: DecimalAnalysis }) {
  const labels = [
    "Ones",
    "Tenths",
    "Hundredths",
    "Thousandths",
    "Ten-thousandths",
    "Hundred-thousandths",
    "Millionths",
  ];
  const values = [analysis.wholePart, ...analysis.digits];
  return (
    <article className="dt-place-value">
      <h3>
        <b>4</b> Place-value strip for the quotient
      </h3>
      <div>
        {labels.map((label, index) => (
          <span key={label}>
            <b>{label}</b>
            <strong className={index > 0 ? "is-repeat" : ""}>
              {values[index]}
            </strong>
          </span>
        ))}
      </div>
      <p>Repeating block (6 digits)</p>
    </article>
  );
}

function CyclePills({ analysis }: { analysis: DecimalAnalysis }) {
  return (
    <div className="dt-cycle-pills">
      {analysis.remainders.map((remainder, index) => (
        <span key={`${remainder}-${index}`}>
          {remainder}
          {index < analysis.remainders.length - 1 ? " →" : ""}
        </span>
      ))}
    </div>
  );
}
