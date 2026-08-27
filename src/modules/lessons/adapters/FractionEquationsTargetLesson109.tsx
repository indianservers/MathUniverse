import { useEffect, useState, type DragEvent, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Calculator,
  Check,
  CircleHelp,
  Clock3,
  Lightbulb,
  Link,
  RefreshCcw,
  RotateCcw,
  Sparkles,
  Trophy,
} from "lucide-react";
import type { LessonAdapterProps } from "../types";
import "./FractionEquationsTargetLesson109.css";

type FractionProblem = {
  id: string;
  variable: string;
  numeratorCoefficient: number;
  denominator: number;
  constant: number;
  rhs: number;
};

const examples: FractionProblem[] = [
  { id: "x-over-three-plus-two", variable: "x", numeratorCoefficient: 1, denominator: 3, constant: 2, rhs: 5 },
  { id: "two-x-over-five-minus-one", variable: "x", numeratorCoefficient: 2, denominator: 5, constant: -1, rhs: 3 },
  { id: "y-over-four-minus-one", variable: "y", numeratorCoefficient: 1, denominator: 4, constant: -1, rhs: 2 },
  { id: "three-z-over-two-plus-four", variable: "z", numeratorCoefficient: 3, denominator: 2, constant: 4, rhs: 10 },
];

const practiceProblems: FractionProblem[] = [
  examples[2],
  { id: "two-p-over-three-plus-one", variable: "p", numeratorCoefficient: 2, denominator: 3, constant: 1, rhs: 7 },
];

const signedTerm = (value: number) => `${value >= 0 ? "+" : "−"} ${Math.abs(value)}`;
const numeratorText = (problem: FractionProblem) => `${problem.numeratorCoefficient === 1 ? "" : problem.numeratorCoefficient}${problem.variable}`;
const equationText = (problem: FractionProblem) => `${numeratorText(problem)}/${problem.denominator} ${signedTerm(problem.constant)} = ${problem.rhs}`;
const solutionOf = (problem: FractionProblem) => ((problem.rhs - problem.constant) * problem.denominator) / problem.numeratorCoefficient;

export default function FractionEquationsTargetLesson109({ resetToken, onInteraction }: LessonAdapterProps) {
  const [exampleIndex, setExampleIndex] = useState(0);
  const [step, setStep] = useState(1);
  const [multipliedTerms, setMultipliedTerms] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const [invalidDrop, setInvalidDrop] = useState("");
  const [activeTab, setActiveTab] = useState("Interact");
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceLcd, setPracticeLcd] = useState("4");
  const [practiceAnswer, setPracticeAnswer] = useState("");
  const [practiceChecked, setPracticeChecked] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);
  const [actions, setActions] = useState(0);

  const problem = examples[exampleIndex];
  const practice = practiceProblems[practiceIndex];
  const solution = solutionOf(problem);
  const practiceSolution = solutionOf(practice);
  const practiceLcdOptions = [...new Set([1, 2, practice.denominator, practice.denominator * 2])];
  const clearedCoefficient = problem.numeratorCoefficient;
  const clearedConstant = problem.constant * problem.denominator;
  const clearedRhs = problem.rhs * problem.denominator;
  const checkFraction = (problem.numeratorCoefficient * solution) / problem.denominator;
  const allTermsMultiplied = ["fraction", "constant", "rhs"].every((term) => multipliedTerms.includes(term));
  const practiceCorrect = Number(practiceLcd) === practice.denominator && Number(practiceAnswer) === practiceSolution;
  const act = () => { setActions((value) => value + 1); onInteraction(); };

  const reset = () => {
    setExampleIndex(0);
    setStep(1);
    setMultipliedTerms([]);
    setDragging(false);
    setInvalidDrop("");
    setActiveTab("Interact");
    setPracticeIndex(0);
    setPracticeLcd("4");
    setPracticeAnswer("");
    setPracticeChecked(false);
    setShowSteps(false);
    setHintOpen(false);
    setActions(0);
    onInteraction();
  };
  useEffect(() => reset(), [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectExample = (index: number) => {
    setExampleIndex(index);
    setStep(1);
    setMultipliedTerms([]);
    setInvalidDrop("");
    setActiveTab("Examples");
    act();
  };
  const dropMultiplier = (event: DragEvent<HTMLElement>, term: "fraction" | "constant" | "rhs") => {
    event.preventDefault();
    const payload = event.dataTransfer.getData("text/fraction-lcd");
    if (payload === `${problem.id}:${problem.denominator}`) {
      setMultipliedTerms((current) => current.includes(term) ? current : [...current, term]);
      setStep(2);
      setInvalidDrop("");
    } else {
      setInvalidDrop(payload || "missing multiplier");
    }
    setDragging(false);
    act();
  };
  const changePractice = (index: number) => {
    const next = practiceProblems[index];
    setPracticeIndex(index);
    setPracticeLcd(String(next.denominator));
    setPracticeAnswer("");
    setPracticeChecked(false);
    setShowSteps(false);
    setHintOpen(false);
    act();
  };

  return (
    <div
      className="fraction109-page"
      data-testid="algebra-mockup-0166"
      data-dedicated-lesson="109"
      data-object-model="selectable-fraction-equation-lcd-three-term-native-drag-clearing-simplification-original-substitution-check-lcd-and-answer-graded-practice-model"
      data-problem={equationText(problem)}
      data-problem-id={problem.id}
      data-denominator={problem.denominator}
      data-lcd={problem.denominator}
      data-cleared-coefficient={clearedCoefficient}
      data-cleared-constant={clearedConstant}
      data-cleared-rhs={clearedRhs}
      data-solution={solution}
      data-check-fraction={checkFraction}
      data-step={step}
      data-multiplied-terms={multipliedTerms.join(",")}
      data-all-terms-multiplied={allTermsMultiplied}
      data-dragging={dragging}
      data-invalid-drop={invalidDrop}
      data-active-tab={activeTab}
      data-practice-index={practiceIndex}
      data-practice-equation={equationText(practice)}
      data-practice-lcd={practiceLcd}
      data-practice-answer={practiceAnswer}
      data-practice-solution={practiceSolution}
      data-practice-correct={practiceChecked && practiceCorrect}
      data-show-steps={showSteps}
      data-hint-open={hintOpen}
      data-actions={actions}
    >
      <nav className="fraction109-breadcrumb"><a href="/">Home</a><span>&gt;</span><a href="/lessons">Lessons</a><span>&gt;</span><a href="/lessons/algebra">Algebra</a><span>&gt;</span><a href="/lessons/algebra">Equations</a><span>&gt;</span><b>Equations with Fractions</b></nav>

      <header className="fraction109-intro">
        <section><h1>Equations with Fractions</h1><p>Clear fractional coefficients by multiplying every term on both sides by the LCD, then solve.</p><nav><b><Lightbulb />Intermediate-Advanced Algebra</b><b><Sparkles />Guided Practice</b><b><Link />LCD Balance Model</b><b><Clock3 />6-10 min</b></nav></section>
        <aside><Lightbulb /><small>KEY RULE</small><strong>Multiply both sides by the LCD.</strong><p>Every term on both sides must be multiplied, not just the fraction term.</p></aside>
      </header>

      <nav className="fraction109-tabs">{["Interact", "Learn", "Examples", "Practice", "Formula", "Know more"].map((tab) => <button type="button" className={activeTab === tab ? "active" : ""} key={tab} onClick={() => { setActiveTab(tab); if (tab === "Practice") setShowSteps(true); if (tab === "Formula") setStep(4); if (tab === "Learn") setStep(2); act(); }}>{tab}</button>)}</nav>

      <main className="fraction109-lab">
        <header><div><small>INTERACT · LCD BALANCE MODEL</small><h2>Example: Solve <Fraction value={numeratorText(problem)} denominator={problem.denominator} /> {signedTerm(problem.constant)} = {problem.rhs}</h2></div><label>LCD (Least Common Denominator)<select aria-label="Fraction equation example" value={exampleIndex} onChange={(event) => selectExample(Number(event.target.value))}>{examples.map((item, index) => <option key={item.id} value={index}>{item.denominator}</option>)}</select></label></header>

        <section className={`fraction109-stage original ${step === 1 ? "current" : ""}`}>
          <h3><b>1</b>Original equation (fraction tiles)</h3>
          <div className="fraction109-original-row">
            <FractionTile problem={problem} multiplied={multipliedTerms.includes("fraction")} onDrop={(event) => dropMultiplier(event, "fraction")} />
            <strong>{problem.constant >= 0 ? "+" : "−"}</strong>
            <UnitTile value={Math.abs(problem.constant)} tone="green" multiplied={multipliedTerms.includes("constant")} label="Constant term multiplier target" onDrop={(event) => dropMultiplier(event, "constant")} />
            <strong>=</strong>
            <UnitTile value={problem.rhs} tone="purple" multiplied={multipliedTerms.includes("rhs")} label="Right side multiplier target" onDrop={(event) => dropMultiplier(event, "rhs")} />
          </div>
          <div className="fraction109-multiply-path"><span>{numeratorText(problem)}/{problem.denominator}</span><span>{problem.constant}</span><span>{problem.rhs}</span><button type="button" draggable aria-label={`Drag LCD multiplier ${problem.denominator}`} onDragStart={(event) => { event.dataTransfer.setData("text/fraction-lcd", `${problem.id}:${problem.denominator}`); setDragging(true); setInvalidDrop(""); act(); }} onDragEnd={() => setDragging(false)} onClick={() => { setMultipliedTerms(["fraction", "constant", "rhs"]); setStep(2); act(); }}>×{problem.denominator}</button></div>
          <p>Multiply every term on both sides by the LCD ({problem.denominator}).</p>
          {invalidDrop && <em>Use the LCD multiplier for the selected equation.</em>}
        </section>

        <section className={`fraction109-stage cleared ${step === 2 ? "current" : ""}`}>
          <h3><b>2</b>After clearing fractions (multiply every term by {problem.denominator})</h3>
          <div><strong>{numeratorText(problem)}</strong><i>{clearedConstant >= 0 ? "+" : "−"}</i><strong>{Math.abs(clearedConstant)}</strong><i>=</i><strong>{clearedRhs}</strong></div>
          <p>{numeratorText(problem)} {signedTerm(clearedConstant)} = {clearedRhs}</p>
        </section>

        <section className={`fraction109-stage solve ${step === 3 ? "current" : ""}`}>
          <h3><b>3</b>Solve the simpler equation</h3>
          <div><article><b>Step 1: {clearedConstant >= 0 ? `Subtract ${clearedConstant}` : `Add ${Math.abs(clearedConstant)}`} from both sides.</b><p>{numeratorText(problem)} {signedTerm(clearedConstant)} {clearedConstant >= 0 ? `− ${clearedConstant}` : `+ ${Math.abs(clearedConstant)}`} = {clearedRhs} {clearedConstant >= 0 ? `− ${clearedConstant}` : `+ ${Math.abs(clearedConstant)}`}</p><strong>{numeratorText(problem)} = {clearedRhs - clearedConstant}</strong></article><article><b>Step 2: Solution</b><strong>{problem.variable} = {solution}</strong></article></div>
        </section>

        <section className={`fraction109-stage verify ${step === 4 ? "current" : ""}`}>
          <h3><b>4</b>Check the solution in the original equation</h3>
          <div><article><p>Substitute <strong>{problem.variable} = {solution}</strong> into the original equation.</p><h2><Fraction value={`${problem.numeratorCoefficient * solution}`} denominator={problem.denominator} /> {signedTerm(problem.constant)} = {checkFraction} {signedTerm(problem.constant)} = {problem.rhs} <Check /> True</h2></article><aside><Trophy /><small>SOLUTION</small><strong>{problem.variable} = {solution}</strong><p>The solution satisfies the original equation.</p></aside></div>
        </section>

        <footer><div><button type="button" onClick={reset}><RotateCcw />Reset</button><button type="button" onClick={() => selectExample((exampleIndex + 1) % examples.length)}><RefreshCcw />New Example</button></div><div><button type="button" disabled={step === 1} onClick={() => { setStep((value) => Math.max(1, value - 1)); act(); }}><ArrowLeft />Previous Step</button><button type="button" disabled={step === 4} onClick={() => { setStep((value) => Math.min(4, value + 1)); act(); }}>Next Step<ArrowRight /></button></div></footer>
      </main>

      <section className="fraction109-practice">
        <header><div><small>GUIDED PRACTICE</small><h2>Try it: Solve the equation <Fraction value={numeratorText(practice)} denominator={practice.denominator} /> {signedTerm(practice.constant)} = {practice.rhs}</h2></div><label>Show steps<input aria-label="Show practice steps" type="checkbox" checked={showSteps} onChange={(event) => { setShowSteps(event.target.checked); act(); }} /><span /></label></header>
        <div className="fraction109-practice-grid"><article><h3>Step 1: LCD</h3><p>Select the LCD (Least Common Denominator).</p><div>{practiceLcdOptions.map((value) => <button type="button" className={practiceLcd === String(value) ? "active" : ""} key={value} onClick={() => { setPracticeLcd(String(value)); setPracticeChecked(false); act(); }}>{value}</button>)}<button type="button" onClick={() => { setPracticeLcd(""); setPracticeChecked(false); act(); }}>Other</button></div></article><article><h3>Step 2: Your answer</h3><p>Solve for {practice.variable}.</p><label>{practice.variable} = <input aria-label="Fraction practice answer" type="number" value={practiceAnswer} onChange={(event) => { setPracticeAnswer(event.target.value); setPracticeChecked(false); act(); }} /></label></article><aside><h3>Check your answer</h3><p>See if your answer is correct and view the full solution.</p><button type="button" onClick={() => { setPracticeChecked(true); act(); }}>Check Answer</button>{practiceChecked && <strong className={practiceCorrect ? "correct" : "wrong"}>{practiceCorrect ? `Correct: ${practice.variable} = ${practiceSolution}` : "Check both the LCD and solution."}</strong>}</aside><aside><h3>Need a hint?</h3>{hintOpen && <p>Multiply every term by {practice.denominator}, then isolate {practice.variable}.</p>}<button type="button" onClick={() => { setHintOpen((value) => !value); act(); }}><CircleHelp />{hintOpen ? "Hide Hint" : "Show Hint"}</button></aside></div>
        {showSteps && <p className="fraction109-practice-steps">×{practice.denominator}: {numeratorText(practice)} {signedTerm(practice.constant * practice.denominator)} = {practice.rhs * practice.denominator}, so {practice.variable} = {practiceSolution}.</p>}
        <footer><Lightbulb />Tip: Multiply every term on both sides by the LCD ({practice.denominator}) to clear the fraction first.<button type="button" onClick={() => changePractice((practiceIndex + 1) % practiceProblems.length)}>Try next</button></footer>
      </section>

      <section className="fraction109-process"><small>GUIDED PRACTICE</small><div><Process icon={<Calculator />} title="Find the LCD" text="of all denominators." /><ArrowRight /><Process icon={<Sparkles />} title="Multiply every term" text="on both sides by the LCD." /><ArrowRight /><Process icon={<RefreshCcw />} title="Solve the simpler" text="equation." /><ArrowRight /><Process icon={<Check />} title="Check the solution" text="in the original equation." /></div></section>
      <nav className="fraction109-navigation"><a href="/lessons/algebra/108-multi-step-equations"><ArrowLeft /><span>PREVIOUS LESSON<b>Multi-Step Equations</b></span></a><a href="/lessons/algebra/110-literal-equations"><span>NEXT LESSON<b>Literal Equations</b></span><ArrowRight /></a></nav>
      <footer className="fraction109-footer"><div><Sparkles /><span><b>Math Universe</b><small>Interactive math labs, visual proofs, NCERT explorations, graphing, CAS-style tools, and classroom-ready activities.</small></span></div><nav><a href="/sitemap">Sitemap</a><a href="/docs">Docs</a><a href="/about">About</a></nav><p>© 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</p><small>www.IndianServers.com · info@IndianServers.com</small></footer>
    </div>
  );
}

function Fraction({ value, denominator }: { value: string; denominator: number }) { return <span className="fraction109-number"><b>{value}</b><i>{denominator}</i></span>; }
function FractionTile({ problem, multiplied, onDrop }: { problem: FractionProblem; multiplied: boolean; onDrop: (event: DragEvent<HTMLElement>) => void }) { return <article className={multiplied ? "multiplied" : ""} aria-label="Fraction term multiplier target" onDragOver={(event) => event.preventDefault()} onDrop={onDrop}><strong>{numeratorText(problem)}</strong><div>{Array.from({ length: problem.denominator }, (_, index) => <span key={index}><Fraction value={numeratorText(problem)} denominator={problem.denominator} /></span>)}</div></article>; }
function UnitTile({ value, tone, multiplied, label, onDrop }: { value: number; tone: string; multiplied: boolean; label: string; onDrop: (event: DragEvent<HTMLElement>) => void }) { return <article className={`${tone} ${multiplied ? "multiplied" : ""}`} aria-label={label} onDragOver={(event) => event.preventDefault()} onDrop={onDrop}><strong>{value}</strong><div>{Array.from({ length: Math.min(value, 8) }, (_, index) => <i key={index} />)}</div></article>; }
function Process({ icon, title, text }: { icon: ReactNode; title: string; text: string }) { return <article>{icon}<span><b>{title}</b><small>{text}</small></span></article>; }
