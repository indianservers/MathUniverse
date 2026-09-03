import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleAlert,
  Lightbulb,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./RationalisationTargetLesson10044.css";

const tiles = ["1", "√3", "−1", "√5", "2", "√3 − 1", "√5 − 2", "2√3", "2√5"];
const tabs = ["Interact", "Learn", "Example", "Formula", "Practice"];

export default function RationalisationTargetLesson10044({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [numerator, setNumerator] = useState("√3 − 1"),
    [denominator, setDenominator] = useState("√3 − 1"),
    [conjugate, setConjugate] = useState("√3 − 1"),
    [checked, setChecked] = useState(true),
    [hinted, setHinted] = useState(false),
    [tab, setTab] = useState("Interact"),
    [challenge, setChallenge] = useState("3(√5 − 2)"),
    [challengeChecked, setChallengeChecked] = useState(true),
    [actions, setActions] = useState(0);
  const validFactor = numerator === denominator && numerator === conjugate;
  const challengeNormalised = challenge
    .replaceAll(" ", "")
    .replaceAll("-", "−");
  const challengeCorrect = ["3(√5−2)", "3√5−6"].includes(challengeNormalised);
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const place = (slot: "numerator" | "denominator", value: string) =>
    act(() => {
      if (slot === "numerator") setNumerator(value);
      else setDenominator(value);
      setChecked(false);
    });
  const chooseTile = (value: string) => {
    if (!numerator || numerator === denominator) place("numerator", value);
    else place("denominator", value);
  };
  const reset = () =>
    act(() => {
      setNumerator("");
      setDenominator("");
      setConjugate("√3 − 1");
      setChecked(false);
      setHinted(false);
    });
  const useHint = () =>
    act(() => {
      setConjugate("√3 − 1");
      setNumerator("√3 − 1");
      setDenominator("√3 − 1");
      setHinted(true);
      setChecked(false);
    });
  const numerical = useMemo(() => 3 / (2 + Math.sqrt(5)), []);

  return (
    <section
      className="rat10044-page"
      data-testid="school-mockup-0718"
      data-object-model="dedicated-conjugate-rationalisation-equivalence-engine"
      data-numerator={numerator}
      data-denominator={denominator}
      data-valid={checked ? String(validFactor) : "idle"}
      data-challenge={challengeChecked ? String(challengeCorrect) : "idle"}
      data-actions={actions}
    >
      <header className="rat10044-hero">
        <small>CLASS 9 · REAL NUMBERS</small>
        <h1>Rationalisation of Denominators</h1>
        <p>
          <b>Objective:</b> Remove radicals from denominators by multiplying by
          a suitable radical or conjugate.
        </p>
        <div>
          <span>16 min</span>
          <span>INTERMEDIATE</span>
          <span>CONCEPT</span>
          <span>number</span>
        </div>
        <Link to="/lessons/school">
          <ArrowLeft /> School lessons
        </Link>
      </header>
      <nav className="rat10044-tabs">
        {tabs.map((item) => (
          <button
            key={item}
            className={tab === item ? "active" : ""}
            onClick={() => act(() => setTab(item))}
          >
            {item}
          </button>
        ))}
      </nav>
      <main className="rat10044-main">
        <section className="rat-workbench">
          <header>
            <div>
              <b>EXPRESSION WORKBENCH</b>
              <p>
                Build an equivalent expression by rationalising the denominator.
              </p>
            </div>
            <button onClick={reset}>
              <RotateCcw /> Reset
            </button>
            <button onClick={useHint}>
              <Lightbulb /> Hint
            </button>
            <button
              className="check"
              onClick={() => act(() => setChecked(true))}
            >
              <ShieldCheck /> Check
            </button>
          </header>
          <div className="rat-work-grid">
            <aside>
              <section className="rat-expression">
                <h3>CURRENT EXPRESSION</h3>
                <div className="rat-factor-builder">
                  <Fraction top="1" bottom="√3 + 1" />
                  <b>=</b>
                  <div>
                    <DropBox
                      label="Numerator"
                      value={numerator}
                      onDrop={(v) => place("numerator", v)}
                    />
                    <DropBox
                      label="Denominator"
                      value={denominator}
                      onDrop={(v) => place("denominator", v)}
                    />
                  </div>
                </div>
              </section>
              <section className="rat-palette">
                <h3>
                  AVAILABLE TILES <small>(drag to boxes)</small>
                </h3>
                <div>
                  {tiles.map((tile) => (
                    <button
                      key={tile}
                      draggable
                      onDragStart={(e) =>
                        e.dataTransfer.setData("text/plain", tile)
                      }
                      onClick={() => chooseTile(tile)}
                    >
                      {tile}
                    </button>
                  ))}
                </div>
              </section>
              <section className="rat-conjugate">
                <h3>CONJUGATE SELECTOR</h3>
                <p>Choose the conjugate of the denominator.</p>
                {["√3 + 1", "√3 − 1"].map((value) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name="conjugate"
                      checked={conjugate === value}
                      onChange={() =>
                        act(() => {
                          setConjugate(value);
                          setChecked(false);
                        })
                      }
                    />{" "}
                    {value}{" "}
                    <small>
                      {value.endsWith("− 1")
                        ? "(conjugate)"
                        : "(current denominator)"}
                    </small>
                  </label>
                ))}
                <aside>
                  <Lightbulb />
                  <b>TIP</b>
                  <small>
                    Multiply numerator and denominator by the conjugate to
                    remove the radical.
                  </small>
                </aside>
              </section>
            </aside>
            <section className="rat-steps">
              <h3>
                YOUR STEPS{" "}
                <small>(Each step is an equivalent transformation)</small>
              </h3>
              <Step number={1} title="Multiply by conjugate">
                <Fraction top="1" bottom="√3 + 1" /> ×{" "}
                <Fraction top={numerator || "?"} bottom={denominator || "?"} />
              </Step>
              <Step number={2} title="Simplify numerator">
                <Fraction top={numerator || "?"} bottom="√3 + 1" />
              </Step>
              <Step
                number={3}
                title="Simplify denominator (difference of squares)"
              >
                <Fraction top={numerator || "?"} bottom="(√3)² − 1²" />
              </Step>
              <Step
                number={4}
                title="Simplify"
                success={checked && validFactor}
              >
                <Fraction
                  top={validFactor ? "√3 − 1" : numerator || "?"}
                  bottom={validFactor ? "2" : "?"}
                />
              </Step>
              <footer
                className={
                  checked && validFactor
                    ? "success"
                    : checked
                      ? "error"
                      : "idle"
                }
              >
                <div>
                  <b>
                    {checked
                      ? validFactor
                        ? "Well done! The denominator is rational."
                        : "The factor must be the same conjugate above and below."
                      : hinted
                        ? "Hint loaded. Check the equivalent factor."
                        : "Build a factor equal to 1, then check it."}
                  </b>
                  <span>
                    Final answer:{" "}
                    {validFactor ? (
                      <Fraction top="√3 − 1" bottom="2" />
                    ) : (
                      "pending"
                    )}
                  </span>
                </div>
                {checked && validFactor && (
                  <span>
                    Simplified <Check />
                  </span>
                )}
              </footer>
            </section>
          </div>
        </section>
        <section className="rat-rules">
          <article>
            <h2>KEY RULES</h2>
            <div>
              <b>Multiply by the same nonzero factor</b>
              <p>
                Multiply numerator and denominator by the same nonzero factor.
              </p>
              <Formula>a / b = (a · k) / (b · k), &nbsp; k ≠ 0</Formula>
            </div>
            <div>
              <b>Difference of squares</b>
              <Formula>(a + b)(a − b) = a² − b²</Formula>
            </div>
          </article>
          <article className="mistake">
            <h2>
              <CircleAlert /> COMMON MISTAKE
            </h2>
            <b>Multiplying only the denominator changes the value.</b>
            <Formula>1/(√3 + 1) ≠ 1/2</Formula>
          </article>
        </section>
        <section className="rat-theory">
          <article>
            <h2>WHY IT WORKS</h2>
            <p>
              Multiplying by the conjugate removes the radical using the
              difference of squares.
            </p>
            <Formula>1/(√3 + 1) × (√3 − 1)/(√3 − 1)</Formula>
            <Formula>= (√3 − 1) / ((√3)² − 1²)</Formula>
            <Formula>= (√3 − 1) / (3 − 1) = (√3 − 1)/2</Formula>
          </article>
          <article>
            <h2>WORKED EXAMPLE</h2>
            <b>Rationalise: 1/(√3 + 1)</b>
            <p>
              <b>1.</b> Multiply by the conjugate
            </p>
            <Formula>1/(√3 + 1) × (√3 − 1)/(√3 − 1)</Formula>
            <p>
              <b>2.</b> Simplify numerator and denominator.
            </p>
            <Formula>(√3 − 1)/(3 − 1) = (√3 − 1)/2</Formula>
          </article>
          <article className="rat-challenge">
            <h2>MINI CHALLENGE</h2>
            <p>Rationalise and verify equivalence.</p>
            <b>Rationalise: 3/(2 + √5)</b>
            <label>
              Your answer
              <input
                value={challenge}
                onChange={(e) =>
                  act(() => {
                    setChallenge(e.target.value);
                    setChallengeChecked(false);
                  })
                }
              />
            </label>
            <button onClick={() => act(() => setChallengeChecked(true))}>
              Check equivalence
            </button>
            <h3>Numerical check</h3>
            <div>
              <span>
                Original value<b>{numerical.toFixed(6)}</b>
              </span>
              <span>
                Your value<b>{challengeCorrect ? numerical.toFixed(6) : "—"}</b>
              </span>
            </div>
            <footer
              className={
                challengeChecked && challengeCorrect ? "correct" : "retry"
              }
            >
              {challengeChecked
                ? challengeCorrect
                  ? "Values match! Expressions are equivalent."
                  : "Not equivalent yet. Use the conjugate √5 − 2."
                : "Check your expression."}
              <Check />
            </footer>
          </article>
        </section>
        <aside className="rat-remember">
          <Lightbulb />
          <div>
            <b>REMEMBER</b>
            <p>
              Always multiply numerator and denominator by the same nonzero
              factor. This keeps the value unchanged while removing radicals
              from the denominator.
            </p>
          </div>
          <button onClick={() => act(() => setTab("Practice"))}>
            See more practice <Check />
          </button>
        </aside>
      </main>
      <nav className="rat10044-adjacent">
        <Link to="/lessons/school/class-9/class-9-real-numbers-successive-magnification-on-the-number-line">
          <ArrowLeft />{" "}
          <span>
            <small>Previous:</small> Real Numbers on Number Line
          </span>
        </Link>
        <Link to="/lessons/school/class-9/class-9-real-numbers-nth-roots-and-radical-meaning">
          <span>
            <small>Next:</small> nth Roots and Radical Meaning
          </span>{" "}
          <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}

function DropBox({
  label,
  value,
  onDrop,
}: {
  label: string;
  value: string;
  onDrop: (value: string) => void;
}) {
  return (
    <button
      className="rat-drop"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        onDrop(e.dataTransfer.getData("text/plain"));
      }}
      onClick={() => onDrop("")}
    >
      <span>{value || label}</span>
    </button>
  );
}
function Fraction({ top, bottom }: { top: string; bottom: string }) {
  return (
    <span className="rat-fraction">
      <span>{top}</span>
      <span>{bottom}</span>
    </span>
  );
}
function Formula({ children }: { children: React.ReactNode }) {
  return <div className="rat-formula">{children}</div>;
}
function Step({
  number,
  title,
  success,
  children,
}: {
  number: number;
  title: string;
  success?: boolean;
  children: React.ReactNode;
}) {
  return (
    <article className={success ? "done" : ""}>
      <header>
        <b>{number}</b>
        <strong>{title}</strong>
      </header>
      <div>{children}</div>
      {success && <Check />}
    </article>
  );
}
