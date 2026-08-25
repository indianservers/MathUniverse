import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calculator,
  Check,
  CircleHelp,
  Languages,
  RotateCcw,
  Share2,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState, type DragEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./FactorsTargetLesson65.css";

const INITIAL_NUMBER = 42;
const INITIAL_CANDIDATE = 6;
const PRACTICE_CANDIDATE = 5;

function factorPairs(value: number) {
  const pairs: Array<[number, number]> = [];
  for (let left = 1; left <= Math.sqrt(value); left += 1) {
    if (value % left === 0) pairs.push([left, value / left]);
  }
  return pairs;
}

function clampInteger(value: number, minimum: number, maximum: number) {
  if (!Number.isFinite(value)) return minimum;
  return Math.max(minimum, Math.min(maximum, Math.round(value)));
}

export default function FactorsTargetLesson65({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [number, setNumber] = useState(INITIAL_NUMBER);
  const [candidate, setCandidate] = useState(INITIAL_CANDIDATE);
  const [dragPair, setDragPair] = useState("");
  const [tab, setTab] = useState("Interaction + visualization");
  const [language, setLanguage] = useState("English (English)");
  const [workspace, setWorkspace] = useState(false);
  const [shareState, setShareState] = useState("Share");
  const [actions, setActions] = useState(0);
  const pairs = useMemo(() => factorPairs(number), [number]);
  const quotient = Math.floor(number / candidate);
  const remainder = number % candidate;
  const isFactor = remainder === 0;
  const columns = Math.max(1, quotient);
  const groupedCount = quotient * candidate;
  const practiceQuotient = Math.floor(number / PRACTICE_CANDIDATE);
  const practiceRemainder = number % PRACTICE_CANDIDATE;

  const act = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const changeNumber = (value: number) => {
    const next = clampInteger(value, 2, 100);
    setNumber(next);
    setCandidate((current) => Math.min(current, next));
    act();
  };
  const changeCandidate = (value: number) => {
    setCandidate(clampInteger(value, 1, number));
    act();
  };
  const choosePair = (left: number) => {
    setCandidate(left);
    act();
  };
  const dropPair = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    const raw = event.dataTransfer.getData("text/factor-pair") || dragPair;
    if (!raw) return;
    const nextCandidate = Number(raw.split("x")[0]);
    if (!Number.isInteger(nextCandidate)) return;
    setCandidate(nextCandidate);
    setDragPair("");
    act();
  };
  const reset = () => {
    setNumber(INITIAL_NUMBER);
    setCandidate(INITIAL_CANDIDATE);
    setDragPair("");
    setTab("Interaction + visualization");
    setLanguage("English (English)");
    setWorkspace(false);
    setShareState("Share");
    setActions(0);
    onInteraction();
  };
  useEffect(() => {
    setNumber(INITIAL_NUMBER);
    setCandidate(INITIAL_CANDIDATE);
    setDragPair("");
    setTab("Interaction + visualization");
    setLanguage("English (English)");
    setWorkspace(false);
    setShareState("Share");
    setActions(0);
  }, [resetToken]);
  const share = async () => {
    try {
      await navigator.clipboard?.writeText(
        `${candidate} ${isFactor ? "is" : "is not"} a factor of ${number}: ${number} ÷ ${candidate} = ${quotient} remainder ${remainder}.`,
      );
      setShareState("Copied");
    } catch {
      setShareState("Ready");
    }
    act();
  };

  return (
    <div
      className="factors65-page"
      data-testid="number-mockup-0047"
      data-dedicated-lesson="65"
      data-object-model="editable-number-candidate-exact-divisibility-counter-array-factor-pairs-draggable-arrangement-remainder-practice-model"
      data-number={number}
      data-candidate={candidate}
      data-quotient={quotient}
      data-remainder={remainder}
      data-is-factor={isFactor}
      data-rows={candidate}
      data-columns={columns}
      data-grouped-count={groupedCount}
      data-factor-pairs={pairs.map((pair) => pair.join("x")).join(",")}
      data-drag-pair={dragPair}
      data-tab={tab}
      data-language={language}
      data-workspace={workspace}
      data-actions={actions}
    >
      <span className="sr-only">
        Concept trace: Factor pair check. Factor pairs divide exactly. Factors
        divide exactly with remainder zero, while multiples continue by
        repeated multiplication.
      </span>
      <nav className="factors65-breadcrumb">
        <a href="/" aria-label="Back">
          <ArrowLeft />
        </a>
        <a href="/">Home</a>
        <span>›</span>
        <a href="/lessons">Lessons</a>
        <span>›</span>
        <a href="/lessons/numbers-and-arithmetic">Numbers And Arithmetic</a>
        <span>›</span>
        <b>65 Factors</b>
      </nav>

      <header className="factors65-hero">
        <nav>
          <b>NUMBERS AND ARITHMETIC</b>
        </nav>
        <h1>Factors</h1>
        <p>Identify exact divisors.</p>
        <div className="factors65-badges">
          <b>♙ Foundational-Intermediate</b>
          <b>ϟ Concept + Manipulative</b>
          <b>▣ Numbers and Number Theory</b>
          <b>◷ 6-10 min</b>
        </div>
        <aside>
          <button
            type="button"
            onClick={() => {
              setLanguage((value) =>
                value.startsWith("English")
                  ? "Hindi (हिन्दी)"
                  : "English (English)",
              );
              act();
            }}
          >
            <Languages />
            <span>{language}</span>
            <i>⌄</i>
          </button>
          <button type="button" onClick={reset}>
            <RotateCcw /> Reset
          </button>
          <button type="button" onClick={() => void share()}>
            <Share2 /> {shareState}
          </button>
          <button
            type="button"
            className={workspace ? "active" : ""}
            onClick={() => {
              setWorkspace((value) => !value);
              act();
            }}
          >
            ↗ Workspace
          </button>
        </aside>
      </header>

      <nav className="factors65-tabs" aria-label="Factors lesson sections">
        {[
          ["Interaction + visualization", "⊙"],
          ["Explain", "▣"],
          ["Examples", "♧"],
          ["Formulas", "Σ"],
          ["Know more", "✧"],
        ].map(([label, icon]) => (
          <button
            type="button"
            className={tab === label ? "active" : ""}
            onClick={() => {
              setTab(label);
              act();
            }}
            key={label}
          >
            <span>{icon}</span>
            {label}
          </button>
        ))}
      </nav>

      <main className="factors65-main">
        <header>
          <small>INTERACTION + VISUALIZATION</small>
          <h2>Explore factors with the array model</h2>
        </header>
        <section className="factors65-grid">
          <div className="factors65-left">
            <section
              className={`factors65-array-card ${isFactor ? "exact" : "remainder"}`}
              onDragOver={(event) => event.preventDefault()}
              onDrop={dropPair}
              aria-label="Factor pair array drop zone"
            >
              <h3>Array model: {number} counters</h3>
              <div className="factors65-array-wrap">
                <div className="factors65-row-brace">
                  <i />
                  <b>{candidate}</b>
                  <span>rows</span>
                </div>
                <div className="factors65-counter-area">
                  <div
                    className="factors65-counters"
                    style={{
                      gridTemplateColumns: `repeat(${Math.min(columns, 14)}, 1fr)`,
                    }}
                    aria-label={`${candidate} rows by ${columns} columns`}
                  >
                    {Array.from(
                      { length: Math.min(groupedCount, 100) },
                      (_, index) => (
                        <i className="grouped" key={index} />
                      ),
                    )}
                    {Array.from({ length: remainder }, (_, index) => (
                      <i className="leftover" key={`remainder-${index}`} />
                    ))}
                  </div>
                  <div className="factors65-column-brace">
                    <i />
                    <b>{columns}</b>
                    <span>columns</span>
                  </div>
                </div>
              </div>
              <p className={isFactor ? "success" : "warning"}>
                {isFactor ? <Check /> : <AlertCircle />}
                <b>
                  {candidate} rows × {columns} columns = {groupedCount}
                </b>
                {!isFactor ? <span> + {remainder} left over</span> : null}
              </p>
            </section>

            <section className="factors65-pairs">
              <h3>Factor pairs</h3>
              <nav>
                {pairs.map(([left, right]) => (
                  <button
                    type="button"
                    draggable
                    className={
                      candidate === left || candidate === right
                        ? "selected"
                        : ""
                    }
                    onClick={() => choosePair(left)}
                    onDragStart={(event) => {
                      const value = `${left}x${right}`;
                      event.dataTransfer.setData("text/factor-pair", value);
                      event.dataTransfer.effectAllowed = "move";
                      setDragPair(value);
                    }}
                    onDragEnd={() => setDragPair("")}
                    key={left}
                  >
                    <strong>
                      {left} × {right}
                    </strong>
                    <span>
                      {number} ÷ {left} = {right}
                    </span>
                    <span>remainder 0</span>
                  </button>
                ))}
              </nav>
              <p>
                <CircleHelp />
                <b>Factor pairs:</b>{" "}
                {pairs.map((pair) => pair.join("×")).join(", ")}
              </p>
            </section>
          </div>

          <aside className="factors65-side">
            <section className="factors65-inputs">
              <label htmlFor="factors65-number">Number:</label>
              <input
                id="factors65-number"
                aria-label="Number to factor"
                type="number"
                min="2"
                max="100"
                value={number}
                onChange={(event) => changeNumber(Number(event.target.value))}
              />
              <hr />
              <label htmlFor="factors65-candidate">Candidate:</label>
              <input
                id="factors65-candidate"
                aria-label="Candidate divisor"
                type="number"
                min="1"
                max={number}
                value={candidate}
                onChange={(event) =>
                  changeCandidate(Number(event.target.value))
                }
              />
            </section>
            <section className={`factors65-proof ${isFactor ? "yes" : "no"}`}>
              <h3>
                {number} ÷ {candidate} = {quotient} <small>remainder</small>{" "}
                {remainder}
              </h3>
              <hr />
              <div>{isFactor ? <Check /> : <AlertCircle />}</div>
              <p>
                <b>
                  {candidate} {isFactor ? "is" : "is not"} a factor of {number}
                </b>
                <span>
                  {isFactor
                    ? "A factor divides exactly with no remainder."
                    : `There are ${remainder} counters left over.`}
                </span>
              </p>
            </section>
            <button
              type="button"
              className="factors65-practice"
              onClick={() => changeCandidate(PRACTICE_CANDIDATE)}
            >
              <h3>
                Try: Is {PRACTICE_CANDIDATE} a factor of {number}?{" "}
                <b>{practiceRemainder === 0 ? "Yes." : "No."}</b>
              </h3>
              <section>
                <strong>
                  {number} ÷ {PRACTICE_CANDIDATE} = {practiceQuotient}{" "}
                  <small>remainder</small> {practiceRemainder}
                </strong>
                <div className="practice-groups">
                  {Array.from(
                    { length: Math.min(practiceQuotient, 2) },
                    (_, group) => (
                      <i key={group}>
                        {Array.from(
                          { length: PRACTICE_CANDIDATE },
                          (_, dot) => (
                            <span key={dot} />
                          ),
                        )}
                      </i>
                    ),
                  )}
                  {Array.from({ length: practiceRemainder }, (_, dot) => (
                    <em key={dot} />
                  ))}
                </div>
                <p className={practiceRemainder === 0 ? "yes" : "no"}>
                  {practiceRemainder === 0 ? <Check /> : <AlertCircle />}
                  <b>
                    {practiceRemainder === 0
                      ? "It is a factor."
                      : "Not a factor. There is a remainder."}
                  </b>
                </p>
              </section>
            </button>
          </aside>
        </section>

        <nav className="factors65-navigation">
          <a href="/lessons/numbers-and-arithmetic/64-place-value">
            <ArrowLeft />
            <span>
              PREVIOUS<b>Place Value</b>
            </span>
          </a>
          <a href="/lessons/numbers-and-arithmetic/66-multiples">
            <span>
              NEXT<b>Multiples</b>
            </span>
            <ArrowRight />
          </a>
        </nav>
      </main>

      <footer className="factors65-footer">
        <h3>
          <Sparkles /> Math Universe
        </h3>
        <p>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </p>
        <nav>
          <a href="/sitemap">
            <BookOpen /> Sitemap
          </a>
          <a href="/docs">
            <Calculator /> Docs
          </a>
          <a href="/about">✉ About</a>
        </nav>
        <hr />
        <small>
          © 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.
        </small>
        <small>www.IndianServers.com info@IndianServers.com</small>
      </footer>
    </div>
  );
}
