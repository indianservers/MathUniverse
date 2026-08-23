import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, Dispatch, ReactNode, SetStateAction } from "react";
import { ArrowLeft, ArrowRight, Bookmark, BookmarkCheck, Check, CheckCircle2, ChevronDown, ChevronUp, HelpCircle, Pause, Play, RotateCcw, SkipBack, SkipForward, TriangleAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import {
  analyzeDecimalExpansion,
  factorizationText,
  predictionFeedback,
  validateExitTicket,
  validateFraction,
  validatePracticeAnswer,
  type DecimalAnalysis,
} from "./decimalExpansionEngine";

const DECIMAL_LESSON_SLUG = "class-9-real-numbers-decimal-expansion-of-rational-numbers";
const previousRoute = "/lessons/school/class-9/class-9-real-numbers-rational-and-irrational-classification";
const nextRoute = "/lessons/school/class-9/class-9-real-numbers-terminating-and-non-terminating-decimals";
const realNumbersRoute = "/lessons/school/class-9";

type LessonMode = "learn" | "explore" | "practice" | "challenge";
type Prediction = "terminating" | "repeating" | "unsure";
type Speed = "slow" | "normal" | "fast";

type LessonState = {
  saved: boolean;
  complete: boolean;
  progress: number;
};

const speedMs: Record<Speed, number> = { slow: 1600, normal: 950, fast: 480 };

export function DecimalExpansionLessonPage({ lesson }: { lesson: SchoolSyllabusLesson }) {
  const [stored, setStored] = useLocalStorage<LessonState>(`math-universe-school-lesson:${DECIMAL_LESSON_SLUG}`, { saved: false, complete: false, progress: 32 });
  const [numerator, setNumerator] = useState(7);
  const [denominator, setDenominator] = useState(12);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [hasRun, setHasRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<Speed>("normal");
  const [mode, setMode] = useState<LessonMode>("explore");
  const [practice, setPractice] = useState({ q1: "", q2: "", q3: "", checked: false, hint: 0 });
  const [exitAnswer, setExitAnswer] = useState("");
  const validation = validateFraction(numerator, denominator);
  const analysis = useMemo(() => validation.ok ? analyzeDecimalExpansion(numerator, denominator) : null, [denominator, numerator, validation.ok]);
  const visibleStep = analysis ? Math.min(stepIndex, analysis.steps.length - 1) : 0;
  const stage = mode === "explore" ? "Explore" : mode === "learn" ? "Understand" : mode === "practice" ? "Practice" : "Reflect";

  useEffect(() => {
    setHasRun(false);
    setStepIndex(0);
    setPlaying(false);
  }, [numerator, denominator]);

  useEffect(() => {
    if (!playing || !analysis || stepIndex >= analysis.steps.length - 1) return undefined;
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return undefined;
    const timer = window.setTimeout(() => setStepIndex((current) => Math.min(current + 1, analysis.steps.length - 1)), speedMs[speed]);
    return () => window.clearTimeout(timer);
  }, [analysis, playing, speed, stepIndex]);

  useEffect(() => {
    if (playing && analysis && stepIndex >= analysis.steps.length - 1) setPlaying(false);
  }, [analysis, playing, stepIndex]);

  function runDivision() {
    if (!analysis) return;
    setHasRun(true);
    setStepIndex(analysis.steps.length > 1 ? 1 : 0);
    setStored((current) => ({ ...current, progress: Math.max(current.progress, 40) }));
  }

  function setFraction(nextNumerator: number, nextDenominator: number) {
    setNumerator(nextNumerator);
    setDenominator(nextDenominator);
  }

  function markComplete() {
    setStored((current) => ({ ...current, complete: true, progress: 100 }));
  }

  const practiceResults = {
    q1: practice.checked && validatePracticeAnswer("13/125", practice.q1),
    q2: practice.checked && validatePracticeAnswer("7/30", practice.q2),
    q3: practice.checked && validatePracticeAnswer("11/24", practice.q3),
  };
  const mastery = [practiceResults.q1, practiceResults.q2, practiceResults.q3].filter(Boolean).length;

  return (
    <div className="decimal-lesson-page" data-testid="decimal-expansion-lesson-page">
      <nav className="decimal-breadcrumb" aria-label="Lesson breadcrumb">
        <Link to="/lessons">Lessons</Link><span>/</span><Link to="/lessons/school/class-9">Class 9</Link><span>/</span><Link to={realNumbersRoute}>Real Numbers</Link><span>/</span><strong>Decimal Expansions</strong>
      </nav>

      <header className="decimal-lesson-header">
        <div>
          <p>Class 9 · Real Numbers</p>
          <h1>{lesson.title}</h1>
          <span>Discover why every rational decimal either terminates or repeats.</span>
          <div className="decimal-header-pills">
            <Chip>18 min</Chip><Chip>Intermediate</Chip><Chip>Concept + Investigation</Chip>
          </div>
        </div>
        <ProgressRing value={stored.progress} complete={stored.complete} />
        <div className="decimal-header-actions">
          <button type="button" onClick={() => setStored((current) => ({ ...current, saved: !current.saved }))}>
            {stored.saved ? <BookmarkCheck /> : <Bookmark />} {stored.saved ? "Saved" : "Save lesson"}
          </button>
          <Link to={realNumbersRoute}><ArrowLeft /> Back to Real Numbers</Link>
        </div>
      </header>

      <LessonStageRail active={stage} />

      <section className="decimal-lab-shell">
        <aside className="decimal-lab-controls">
          <h2>Decimal Pattern Lab</h2>
          <p>Will this fraction terminate or repeat?</p>
          <FractionInput label="Numerator" value={numerator} onChange={setNumerator} />
          <span className="decimal-fraction-slash">/</span>
          <FractionInput label="Denominator" value={denominator} onChange={setDenominator} />
          {!validation.ok ? <p className="decimal-error"><TriangleAlert />{validation.error}</p> : null}
          {analysis ? <p className="decimal-reduced">Reduced fraction: <strong>{analysis.reducedNumerator}/{analysis.reducedDenominator}</strong></p> : null}
          <div className="decimal-quick-picks" aria-label="Quick fraction selections">
            {[[1, 8], [3, 20], [5, 6], [7, 12]].map(([n, d]) => <button key={`${n}/${d}`} type="button" onClick={() => setFraction(n, d)}>{n}/{d}</button>)}
          </div>
          <button type="button" className="decimal-primary" disabled={!analysis} onClick={runDivision}><Play /> Run long division</button>
          <fieldset className="decimal-prediction">
            <legend>Live prediction <HelpCircle /></legend>
            {(["terminating", "repeating", "unsure"] as Prediction[]).map((item) => (
              <label key={item}>
                <input type="radio" name="prediction" checked={prediction === item} onChange={() => setPrediction(item)} />
                {item === "unsure" ? "Not sure" : item[0].toUpperCase() + item.slice(1)}
              </label>
            ))}
          </fieldset>
          <p className="decimal-feedback">{predictionFeedback(prediction, hasRun ? analysis : null)}</p>
        </aside>

        <LongDivisionStage analysis={analysis} stepIndex={visibleStep} hasRun={hasRun} />
        <DecimalResultPanel analysis={analysis} hasRun={hasRun} />

        <div className="decimal-playback">
          <button type="button" disabled={!analysis || visibleStep === 0} onClick={() => setStepIndex((current) => Math.max(0, current - 1))}><SkipBack />Previous step</button>
          <button type="button" disabled={!analysis || !hasRun} onClick={() => setPlaying((current) => !current)}>{playing ? <Pause /> : <Play />}{playing ? "Pause" : "Play"}</button>
          <button type="button" disabled={!analysis || visibleStep >= (analysis.steps.length - 1)} onClick={() => setStepIndex((current) => Math.min((analysis?.steps.length ?? 1) - 1, current + 1))}><SkipForward />Next step</button>
          <button type="button" disabled={!analysis} onClick={() => { setStepIndex(0); setPlaying(false); setHasRun(false); }}><RotateCcw />Reset</button>
          <label>Speed<select value={speed} onChange={(event) => setSpeed(event.target.value as Speed)}><option value="slow">Slow</option><option value="normal">Normal</option><option value="fast">Fast</option></select></label>
        </div>
      </section>

      <ReasoningFlow />

      <main className="decimal-content-grid">
        <section className="decimal-mode-card">
          <div className="decimal-mode-tabs" role="tablist" aria-label="Learning modes">
            {(["learn", "explore", "practice", "challenge"] as LessonMode[]).map((item) => <button key={item} type="button" role="tab" aria-selected={mode === item} onClick={() => setMode(item)}>{item[0].toUpperCase() + item.slice(1)}</button>)}
          </div>
          {mode === "learn" ? <LearnMode /> : null}
          {mode === "explore" ? <ExploreMode onPick={setFraction} /> : null}
          {mode === "practice" ? <PracticeMode practice={practice} setPractice={setPractice} results={practiceResults} mastery={mastery} /> : null}
          {mode === "challenge" ? <ChallengeMode onPick={setFraction} /> : null}
        </section>

        <aside className="decimal-support-stack">
          <InfoCard tone="amber" title="Common misconception" icon={<TriangleAlert />}>
            <strong>A long decimal is not automatically irrational.</strong>
            <p>A terminating or repeating decimal is rational. For example, 0.58333... repeats, so it is rational.</p>
          </InfoCard>
          <InfoCard tone="green" title="Learning objectives" icon={<CheckCircle2 />}>
            <ul>
              <li>Convert a fraction into a decimal using long division.</li>
              <li>Identify terminating and repeating decimal expansions.</li>
              <li>Explain repetition using repeated remainders.</li>
              <li>Classify using the reduced denominator’s prime factors.</li>
            </ul>
          </InfoCard>
          <section className="decimal-exit-ticket">
            <h2>Exit ticket</h2>
            <p>Without dividing, will <strong>17/200</strong> terminate? Explain.</p>
            <textarea value={exitAnswer} onChange={(event) => setExitAnswer(event.target.value)} maxLength={150} placeholder="Type your explanation..." />
            <span>{exitAnswer.length} / 150</span>
            {exitAnswer ? <p className={validateExitTicket(exitAnswer) ? "is-correct" : "is-waiting"}>{validateExitTicket(exitAnswer) ? "Strong reasoning: 200 has only prime factors 2 and 5." : "Mention the reduced denominator and its prime factors."}</p> : null}
          </section>
        </aside>
      </main>

      <nav className="decimal-bottom-nav" aria-label="Lesson navigation">
        <Link to={previousRoute}><ArrowLeft /><span><small>Previous lesson</small>Irrational Numbers</span></Link>
        <button type="button" onClick={markComplete}><Check />{stored.complete ? "Lesson complete" : "Mark lesson complete"}</button>
        <Link to={nextRoute}><span><small>Next lesson</small>Terminating & Non-Terminating Decimals</span><ArrowRight /></Link>
      </nav>
    </div>
  );
}

function LessonStageRail({ active }: { active: string }) {
  const stages = ["Explore", "Understand", "Practice", "Check", "Reflect"];
  return <div className="decimal-stage-rail" role="list" aria-label="Lesson journey stages">{stages.map((stage) => <span key={stage} role="listitem" className={active === stage ? "is-active" : ""}>{stage}</span>)}</div>;
}

function FractionInput({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="decimal-number-input">
      <span className="sr-only">{label}</span>
      <input aria-label={label} type="number" step="1" value={value} onChange={(event) => onChange(Number(event.target.value))} />
      <span>
        <button type="button" aria-label={`Increase ${label}`} onClick={() => onChange(value + 1)}><ChevronUp /></button>
        <button type="button" aria-label={`Decrease ${label}`} onClick={() => onChange(value - 1)}><ChevronDown /></button>
      </span>
    </label>
  );
}

function LongDivisionStage({ analysis, stepIndex, hasRun }: { analysis: DecimalAnalysis | null; stepIndex: number; hasRun: boolean }) {
  if (!analysis) return <section className="decimal-stage"><p>Enter a valid fraction to begin.</p></section>;
  const shownDigits = hasRun ? analysis.digits.slice(0, Math.max(0, stepIndex)).join("") : "";
  return (
    <section className="decimal-stage" aria-label="Long division visualization">
      <div className="decimal-stage-top">
        <strong>{analysis.reducedNumerator.toString().replace("-", "")}.000 ÷ {analysis.reducedDenominator}</strong>
        <span>Quotient: <b>{hasRun ? analysis.decimalDisplay.replace(/[()]/g, "") : "Predict first"}</b></span>
      </div>
      <div className="decimal-long-division">
        <div className="decimal-division-stack">
          <p><span>{analysis.reducedDenominator}</span><i>{Math.abs(analysis.reducedNumerator)}.0000</i></p>
          <strong>0.{shownDigits || "?"}</strong>
          {analysis.steps.slice(1, Math.max(2, stepIndex + 1)).map((step) => (
            <div key={step.index} className={step.index === stepIndex ? "is-active" : ""}>
              <span>{step.dividend}</span>
              <em>- {step.product}</em>
              <b>{step.nextRemainder}</b>
            </div>
          ))}
        </div>
        <table>
          <thead><tr><th>Step</th><th>Remainder</th><th>Next digit</th></tr></thead>
          <tbody>{analysis.steps.slice(0, Math.max(1, stepIndex + 1)).map((step) => <tr key={step.index} className={step.index === stepIndex ? "is-active" : ""}><td>{step.index === 0 ? "Start" : step.index}</td><td>{step.remainder}</td><td>{step.digit ?? "-"}</td></tr>)}</tbody>
        </table>
        <RemainderCycle analysis={analysis} stepIndex={stepIndex} />
      </div>
    </section>
  );
}

function RemainderCycle({ analysis, stepIndex }: { analysis: DecimalAnalysis; stepIndex: number }) {
  const shown = analysis.remainders.slice(0, Math.max(1, stepIndex + 1));
  const repeat = analysis.classification === "repeating" ? shown.at(-1) : null;
  return (
    <div className="decimal-remainder-cycle">
      <p>{analysis.classification === "repeating" && stepIndex >= analysis.steps.length - 1 ? "Remainder repeats → decimal repeats." : "Remainder states"}</p>
      <div>{shown.map((value, index) => <span key={`${value}-${index}`} className={repeat === value && index === shown.length - 1 ? "is-repeat" : ""}>{value}</span>)}</div>
    </div>
  );
}

function DecimalResultPanel({ analysis, hasRun }: { analysis: DecimalAnalysis | null; hasRun: boolean }) {
  if (!analysis) return <aside className="decimal-result-panel"><p>Fix the fraction to see a result.</p></aside>;
  const hasOnlyTwoFive = analysis.factorization.every((factor) => factor.prime === 2 || factor.prime === 5);
  return (
    <aside className="decimal-result-panel">
      <p>Result</p>
      <strong className={hasRun ? `is-${analysis.classification}` : ""}>{hasRun ? analysis.decimalDisplay : "Hidden"}</strong>
      <span>{hasRun ? analysis.classification : "Run long division"}</span>
      <div><small>Simplified fraction</small><b>{analysis.reducedNumerator}/{analysis.reducedDenominator}</b></div>
      <div><small>Denominator factorization</small><b>{analysis.reducedDenominator} = {factorizationText(analysis.factorization)}</b></div>
      <div><small>Rule feedback</small><b>{hasOnlyTwoFive ? "Only factors 2 and/or 5." : "Contains a prime factor other than 2 or 5."}</b></div>
    </aside>
  );
}

function ReasoningFlow() {
  return (
    <section className="decimal-reasoning-flow">
      {[
        ["Reduce the fraction", "Make sure p/q is in lowest terms.", "Example: 7/12 is already in lowest terms."],
        ["Factor the denominator", "Write q as a product of primes.", "Example: 12 = 2² × 3"],
        ["Decide", "For p/q in lowest terms: decimal terminates iff q = 2ᵐ5ⁿ.", ""],
        ["Terminates", "3/40", "40 = 2³ × 5. Only 2s and 5s."],
        ["Repeats", "5/6", "6 = 2 × 3. Factor 3 causes repeat."],
      ].map(([title, main, note]) => <article key={title}><h3>{title}</h3><p>{main}</p>{note ? <span>{note}</span> : null}</article>)}
    </section>
  );
}

function LearnMode() {
  return (
    <div className="decimal-mode-content">
      <h2>Understand rational decimal expansions</h2>
      <p>A rational decimal expansion is the decimal form of a number that can be written as p/q, where p and q are integers and q is not 0.</p>
      <p>A decimal <strong>terminates</strong> when long division reaches remainder 0. A decimal <strong>repeats</strong> when a non-zero remainder appears again.</p>
      <p>For a reduced fraction p/q, the decimal terminates exactly when q has no prime factors except 2 and 5.</p>
      <p>Repeating-bar notation writes only the repeating block under a bar, such as 0.58<span className="decimal-overline">3</span> for 7/12.</p>
      <article><h3>Worked example: 7/12</h3><p>12 = 2² × 3, so the reduced denominator contains 3. Long division gives remainders 7 → 10 → 4 → 4, so the digit 3 repeats.</p></article>
    </div>
  );
}

function ExploreMode({ onPick }: { onPick: (n: number, d: number) => void }) {
  return (
    <div className="decimal-mode-content">
      <h2>Guided experiments</h2>
      {[["Compare 1/8 and 1/3", 1, 8], ["Compare 3/20 and 7/30", 7, 30], ["Keep denominator 12 and change the numerator", 5, 12], ["Change only the denominator", 7, 40]].map(([text, n, d]) => <button key={text} type="button" onClick={() => onPick(Number(n), Number(d))}>{text}<ArrowRight /></button>)}
      <p>Observe whether the reduced denominator changes. The numerator changes the decimal value; the reduced denominator decides whether it terminates or repeats.</p>
    </div>
  );
}

function PracticeMode({ practice, setPractice, results, mastery }: { practice: { q1: string; q2: string; q3: string; checked: boolean; hint: number }; setPractice: Dispatch<SetStateAction<{ q1: string; q2: string; q3: string; checked: boolean; hint: number }>>; results: Record<"q1" | "q2" | "q3", boolean>; mastery: number }) {
  return (
    <div className="decimal-practice">
      <PracticeQuestion number={1} prompt="Classify: Will 13/125 terminate or repeat?" value={practice.q1} result={results.q1} checked={practice.checked} onChange={(value) => setPractice((current) => ({ ...current, q1: value, checked: false }))} />
      <PracticeQuestion number={2} prompt="Predict: Will 7/30 terminate or repeat?" value={practice.q2} result={results.q2} checked={practice.checked} onChange={(value) => setPractice((current) => ({ ...current, q2: value, checked: false }))} />
      <div className="decimal-practice-question"><strong>3</strong><p>Explain: Why does 11/24 repeat?</p><textarea value={practice.q3} onChange={(event) => setPractice((current) => ({ ...current, q3: event.target.value, checked: false }))} placeholder="Type your explanation..." />{practice.hint > 0 ? <small>Hint: factor 24 as 2³ × 3, then look for prime factors other than 2 and 5.</small> : null}{practice.checked ? <Feedback ok={results.q3} /> : null}</div>
      <div className="decimal-practice-footer">
        <button type="button" onClick={() => setPractice((current) => ({ ...current, hint: current.hint + 1 }))}>Hint</button>
        <button type="button" onClick={() => setPractice((current) => ({ ...current, checked: true }))}>Check answers</button>
        <button type="button" onClick={() => setPractice({ q1: "", q2: "", q3: "", checked: false, hint: 0 })}>Retry</button>
        <span>Mastery {mastery}/3</span>
      </div>
    </div>
  );
}

function PracticeQuestion({ number, prompt, value, result, checked, onChange }: { number: number; prompt: string; value: string; result: boolean; checked: boolean; onChange: (value: string) => void }) {
  return (
    <div className="decimal-practice-question">
      <strong>{number}</strong><p>{prompt}</p>
      {["Terminates", "Repeats", "Not sure"].map((choice) => <label key={choice}><input type="radio" name={`practice-${number}`} checked={value === choice} onChange={() => onChange(choice)} />{choice}</label>)}
      {checked ? <Feedback ok={result} /> : null}
    </div>
  );
}

function ChallengeMode({ onPick }: { onPick: (n: number, d: number) => void }) {
  return (
    <div className="decimal-mode-content">
      <h2>Challenge</h2>
      <p>Find three different fractions whose decimal expansions have exactly one non-repeating digit followed by a repeating cycle.</p>
      <p>Try fractions with denominators that include 2 or 5 and another prime factor, such as 6, 12, or 30.</p>
      <button type="button" onClick={() => onPick(7, 12)}>Test 7/12 in the lab</button>
    </div>
  );
}

function Feedback({ ok }: { ok: boolean }) {
  return <small className={ok ? "is-correct" : "is-wrong"}>{ok ? "Correct." : "Not yet. Check the reduced denominator and its prime factors."}</small>;
}

function InfoCard({ title, icon, tone, children }: { title: string; icon: JSX.Element; tone: "amber" | "green"; children: ReactNode }) {
  return <section className={`decimal-info-card is-${tone}`}><h2>{icon}{title}</h2>{children}</section>;
}

function ProgressRing({ value, complete }: { value: number; complete: boolean }) {
  return <div className="decimal-progress-ring" style={{ "--progress": `${Math.min(100, value)}%` } as CSSProperties}><strong>{complete ? "100%" : `${value}%`}</strong><span>Complete</span></div>;
}

function Chip({ children }: { children: ReactNode }) {
  return <span>{children}</span>;
}
