import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  Lightbulb,
  RotateCcw,
  Share2,
} from "lucide-react";
import { useEffect, useMemo, useState, type DragEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./PrimeNumbersTargetLesson67.css";

const INITIAL_NUMBER = 17;
const INITIAL_DIVISOR = 17;

function clampInteger(value: number, minimum: number, maximum: number) {
  if (!Number.isFinite(value)) return minimum;
  return Math.max(minimum, Math.min(maximum, Math.round(value)));
}

function factorsOf(value: number) {
  return Array.from({ length: value }, (_, index) => index + 1).filter(
    (candidate) => value % candidate === 0,
  );
}

export default function PrimeNumbersTargetLesson67({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [number, setNumber] = useState(INITIAL_NUMBER);
  const [selectedDivisor, setSelectedDivisor] = useState(INITIAL_DIVISOR);
  const [dragCounter, setDragCounter] = useState("");
  const [saved, setSaved] = useState(false);
  const [shareState, setShareState] = useState("Share");
  const [actions, setActions] = useState(0);
  const factors = useMemo(() => factorsOf(number), [number]);
  const isPrime = factors.length === 2;
  const scanner = useMemo(
    () => Array.from({ length: number }, (_, index) => index + 1),
    [number],
  );
  const rowDivisors = useMemo(
    () => Array.from(new Set([1, 2, 3, 4, number])),
    [number],
  );

  const act = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const chooseDivisor = (divisor: number) => {
    setSelectedDivisor(divisor);
    act();
  };
  const changeNumber = (value: number) => {
    const next = clampInteger(value, 2, 25);
    setNumber(next);
    setSelectedDivisor(next);
    act();
  };
  const dropCounter = (event: DragEvent<HTMLElement>, divisor: number) => {
    event.preventDefault();
    const raw = event.dataTransfer.getData("text/counter") || dragCounter;
    if (!raw) return;
    setSelectedDivisor(divisor);
    setDragCounter("");
    act();
  };
  const reset = () => {
    setNumber(INITIAL_NUMBER);
    setSelectedDivisor(INITIAL_DIVISOR);
    setDragCounter("");
    setSaved(false);
    setShareState("Share");
    setActions(0);
    onInteraction();
  };
  useEffect(() => {
    setNumber(INITIAL_NUMBER);
    setSelectedDivisor(INITIAL_DIVISOR);
    setDragCounter("");
    setSaved(false);
    setShareState("Share");
    setActions(0);
  }, [resetToken]);
  const share = async () => {
    try {
      await navigator.clipboard?.writeText(
        `${number} ${isPrime ? "is prime" : "is composite"}; factors: ${factors.join(", ")}.`,
      );
      setShareState("Copied");
    } catch {
      setShareState("Ready");
    }
    act();
  };

  return (
    <div
      className="prime67-page"
      data-testid="number-mockup-0049"
      data-dedicated-lesson="67"
      data-object-model="editable-number-divisor-scanner-exact-factor-count-draggable-counter-equal-group-quotient-remainder-prime-composite-practice-model"
      data-number={number}
      data-selected-divisor={selectedDivisor}
      data-factors={factors.join(",")}
      data-factor-count={factors.length}
      data-is-prime={isPrime}
      data-selected-quotient={Math.floor(number / selectedDivisor)}
      data-selected-remainder={number % selectedDivisor}
      data-drag-counter={dragCounter}
      data-saved={saved}
      data-actions={actions}
    >
      <span className="sr-only">
        Concept trace: Prime factor-count test. Prime numbers have exactly two
        positive factors. Equal grouping tests each possible divisor and exposes
        every remainder.
      </span>
      <nav className="prime67-breadcrumb">
        <a href="/" aria-label="Back">
          <ArrowLeft />
        </a>
        <a href="/">Home</a>
        <span>›</span>
        <a href="/lessons">Lessons</a>
        <span>›</span>
        <a href="/lessons/numbers-and-arithmetic">Numbers And Arithmetic</a>
        <span>›</span>
        <b>67 Prime Numbers</b>
      </nav>

      <header className="prime67-hero">
        <div>
          <h1>Prime Numbers</h1>
          <p>Recognise primes and composites.</p>
        </div>
        <nav>
          <button
            type="button"
            className={saved ? "active" : ""}
            onClick={() => {
              setSaved((value) => !value);
              act();
            }}
          >
            <Bookmark /> {saved ? "Progress saved" : "Save progress"}
          </button>
          <button type="button" onClick={() => void share()}>
            <Share2 /> {shareState}
          </button>
        </nav>
      </header>

      <main className="prime67-layout">
        <section className="prime67-lab">
          <header>
            <h2>Test divisors by grouping counters</h2>
            <p>
              Drag and drop to make equal groups. See if any remainder is left.
            </p>
          </header>
          <section className="prime67-scanner">
            <h3>Divisor scanner</h3>
            <nav aria-label="Divisor scanner">
              {scanner.map((divisor) => {
                const exact = number % divisor === 0;
                return (
                  <button
                    type="button"
                    className={`${exact ? "exact" : "remainder"} ${selectedDivisor === divisor ? "selected" : ""}`}
                    onClick={() => chooseDivisor(divisor)}
                    key={divisor}
                  >
                    {divisor}
                  </button>
                );
              })}
            </nav>
          </section>
          <nav className="prime67-legend">
            <span>
              <i className="exact" />
              Exact divisor (no remainder)
            </span>
            <span>
              <i className="remainder" />
              Not a divisor (remainder left)
            </span>
            <span>
              <i className="selected" />
              Selected number
            </span>
          </nav>

          <section className="prime67-groups">
            {rowDivisors.map((divisor) => {
              const quotient = Math.floor(number / divisor);
              const remainder = number % divisor;
              const exact = remainder === 0;
              return (
                <article
                  className={`${exact ? "exact" : "remainder"} ${selectedDivisor === divisor ? "selected" : ""}`}
                  aria-label={`Group counters by divisor ${divisor}`}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => dropCounter(event, divisor)}
                  onClick={() => chooseDivisor(divisor)}
                  key={divisor}
                >
                  <span className="prime67-status">
                    {exact ? <Check /> : <AlertCircle />}
                  </span>
                  <strong>
                    ÷ {divisor}
                    <i />
                  </strong>
                  <div className="prime67-counter-field">
                    <b>
                      {divisor} {divisor === 1 ? "group" : "groups"}
                      {exact ? ` of ${quotient}` : ""}
                    </b>
                    <div
                      style={{
                        gridTemplateRows: `repeat(${divisor === number ? 1 : Math.min(divisor, 4)}, 1fr)`,
                      }}
                    >
                      {Array.from(
                        { length: number - remainder },
                        (_, index) => (
                          <button
                            type="button"
                            draggable
                            aria-label={`Counter ${index + 1}`}
                            onDragStart={(event) => {
                              event.stopPropagation();
                              event.dataTransfer.setData(
                                "text/counter",
                                String(index + 1),
                              );
                              setDragCounter(String(index + 1));
                            }}
                            onDragEnd={() => setDragCounter("")}
                            onClick={(event) => event.stopPropagation()}
                            key={index}
                          >
                            1
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                  <aside>
                    {exact ? (
                      <b>No remainder</b>
                    ) : (
                      <>
                        <span>Remainder</span>
                        <div>
                          {Array.from({ length: remainder }, (_, index) => (
                            <i key={index}>1</i>
                          ))}
                        </div>
                      </>
                    )}
                  </aside>
                </article>
              );
            })}
          </section>
          <p className="prime67-proof">
            <Lightbulb />
            <b>
              {factors.join(" and ")} divide {number} exactly with no remainder.
            </b>
          </p>
        </section>

        <aside className="prime67-side">
          <section className="prime67-number">
            <label htmlFor="prime67-number">Number:</label>
            <input
              id="prime67-number"
              aria-label="Number to test"
              type="number"
              min="2"
              max="25"
              value={number}
              onChange={(event) => changeNumber(Number(event.target.value))}
            />
          </section>
          <section className="prime67-factors">
            <h3>Factors of {number}</h3>
            <p>Exact divisors (no remainder)</p>
            <div>
              {factors.map((factor) => (
                <button
                  type="button"
                  onClick={() => chooseDivisor(factor)}
                  key={factor}
                >
                  {factor}
                </button>
              ))}
            </div>
          </section>
          <section className="prime67-count">
            <h3>Factor count:</h3>
            <b>{factors.length}</b>
          </section>
          <section
            className={`prime67-verdict ${isPrime ? "prime" : "composite"}`}
          >
            <span>{isPrime ? <Check /> : <AlertCircle />}</span>
            <p>
              <b>
                {number} is {isPrime ? "prime" : "composite"}
              </b>
              <em>
                {isPrime
                  ? "Prime numbers have exactly two positive factors."
                  : `${number} has ${factors.length} positive factors.`}
              </em>
            </p>
          </section>
          <section className="prime67-one">
            <AlertCircle />
            <p>
              <b>1 is not prime</b>
              <span>because it has only one positive factor.</span>
            </p>
          </section>
          <button
            type="button"
            className="prime67-practice"
            onClick={() => changeNumber(18)}
          >
            <b>Try: Is 18 prime? No.</b>
            <span>18 has more than two factors.</span>
            <em>Factors of 18:</em>
            <div>
              {[1, 2, 3, 6, 9, 18].map((factor) => (
                <i key={factor}>{factor}</i>
              ))}
            </div>
          </button>
        </aside>
      </main>

      <nav className="prime67-navigation">
        <a href="/lessons/numbers-and-arithmetic/66-multiples">
          <ArrowLeft />
          <span>
            Previous<b>Multiples</b>
          </span>
        </a>
        <button type="button" onClick={reset}>
          <RotateCcw /> Reset counters
        </button>
        <a href="/lessons/numbers-and-arithmetic/68-prime-factorisation">
          <span>
            Next<b>Prime Factorisation</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
    </div>
  );
}
