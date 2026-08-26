import { useEffect, useMemo, useState, type DragEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleAlert,
  CircleHelp,
  Equal,
  Lightbulb,
  RotateCcw,
  Scale,
  Star,
} from "lucide-react";
import type { LessonAdapterProps } from "../types";
import "./MultiStepEquationsTargetLesson108.css";

type Problem = {
  id: string;
  variable: string;
  coefficient: number;
  constant: number;
  rhs: number;
};

const problems: Problem[] = [
  { id: "two-x-plus-three", variable: "x", coefficient: 2, constant: 3, rhs: 11 },
  { id: "three-x-plus-two", variable: "x", coefficient: 3, constant: 2, rhs: 14 },
  { id: "four-x-minus-five", variable: "x", coefficient: 4, constant: -5, rhs: 15 },
  { id: "five-x-plus-four", variable: "x", coefficient: 5, constant: 4, rhs: 29 },
];

const practiceProblems: Problem[] = [
  { id: "three-y-plus-two", variable: "y", coefficient: 3, constant: 2, rhs: 14 },
  { id: "two-p-minus-six", variable: "p", coefficient: 2, constant: -6, rhs: 12 },
];

function solutionOf(problem: Problem) { return (problem.rhs - problem.constant) / problem.coefficient; }
function expressionOf(problem: Problem) {
  const constant = problem.constant === 0 ? "" : problem.constant > 0 ? ` + ${problem.constant}` : ` − ${Math.abs(problem.constant)}`;
  return `${problem.coefficient}${problem.variable}${constant} = ${problem.rhs}`;
}
function inverseText(problem: Problem) { return problem.constant >= 0 ? `Subtract ${problem.constant}` : `Add ${Math.abs(problem.constant)}`; }

export default function MultiStepEquationsTargetLesson108({ resetToken, onInteraction }: LessonAdapterProps) {
  const [problemId, setProblemId] = useState(problems[0].id);
  const [step, setStep] = useState(3);
  const [dragging, setDragging] = useState("");
  const [operationDrops, setOperationDrops] = useState<string[]>([]);
  const [invalidDrop, setInvalidDrop] = useState("");
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceAnswer, setPracticeAnswer] = useState("4");
  const [practiceChecked, setPracticeChecked] = useState(true);
  const [stepGuide, setStepGuide] = useState(true);
  const [nudgeOpen, setNudgeOpen] = useState(true);
  const [actions, setActions] = useState(0);

  const problem = useMemo(() => problems.find((item) => item.id === problemId) ?? problems[0], [problemId]);
  const solution = solutionOf(problem);
  const intermediate = problem.rhs - problem.constant;
  const practice = practiceProblems[practiceIndex];
  const practiceSolution = solutionOf(practice);
  const numericPractice = Number(practiceAnswer);
  const practiceCorrect = Number.isFinite(numericPractice) && Math.abs(numericPractice - practiceSolution) < 1e-9;
  const checkedValue = problem.coefficient * solution + problem.constant;
  const bothOperationsDropped = operationDrops.includes("constant") && operationDrops.includes("groups");
  const act = () => { setActions((value) => value + 1); onInteraction(); };

  const selectProblem = (id: string) => {
    const next = problems.find((item) => item.id === id) ?? problems[0];
    setProblemId(next.id);
    setStep(0);
    setOperationDrops([]);
    setInvalidDrop("");
    act();
  };
  const reset = () => {
    setProblemId(problems[0].id);
    setStep(3);
    setDragging("");
    setOperationDrops([]);
    setInvalidDrop("");
    setPracticeIndex(0);
    setPracticeAnswer("4");
    setPracticeChecked(true);
    setStepGuide(true);
    setNudgeOpen(true);
    setActions(0);
    onInteraction();
  };
  useEffect(() => reset(), [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps

  const startDrag = (event: DragEvent<HTMLButtonElement>, operation: "constant" | "groups") => {
    event.dataTransfer.setData("text/multi-step-operation", `${problem.id}:${operation}`);
    setDragging(operation);
    setInvalidDrop("");
    act();
  };
  const dropOperation = (event: DragEvent<HTMLElement>, expected: "constant" | "groups") => {
    event.preventDefault();
    const payload = event.dataTransfer.getData("text/multi-step-operation");
    if (payload === `${problem.id}:${expected}`) {
      setOperationDrops((current) => current.includes(expected) ? current : [...current, expected]);
      setStep(expected === "constant" ? 1 : 2);
      setInvalidDrop("");
    } else {
      setInvalidDrop(payload || "unknown");
    }
    setDragging("");
    act();
  };

  return (
    <div
      className="multi108-page"
      data-testid="algebra-mockup-0165"
      data-dedicated-lesson="108"
      data-object-model="selectable-linear-expression-balance-sequence-draggable-constant-removal-equal-group-division-ordered-inverse-operations-substitution-check-graded-practice-model"
      data-problem={expressionOf(problem)}
      data-problem-id={problem.id}
      data-coefficient={problem.coefficient}
      data-constant={problem.constant}
      data-rhs={problem.rhs}
      data-intermediate={intermediate}
      data-solution={solution}
      data-check-value={checkedValue}
      data-step={step}
      data-inverse={inverseText(problem)}
      data-dragging={dragging}
      data-operation-drops={operationDrops.join(",")}
      data-both-operations-dropped={bothOperationsDropped}
      data-invalid-drop={invalidDrop}
      data-practice-index={practiceIndex}
      data-practice-equation={expressionOf(practice)}
      data-practice-answer={practiceAnswer}
      data-practice-solution={practiceSolution}
      data-practice-correct={practiceChecked && practiceCorrect}
      data-step-guide={stepGuide}
      data-nudge-open={nudgeOpen}
      data-actions={actions}
    >
      <nav className="multi108-breadcrumb"><a href="/">Home</a><span>&gt;</span><a href="/lessons">Lessons</a><span>&gt;</span><a href="/lessons/algebra">Algebra</a><span>&gt;</span><b>Multi-Step Equations</b></nav>

      <header className="multi108-intro">
        <section><small><b>ALGEBRA</b><b>EQUATIONS AND INEQUALITIES</b></small><h1>Multi-Step Equations</h1><p>Isolate the unknown by undoing addition/subtraction before multiplication/division.</p><nav><b>Intermediate-Advanced Algebra</b><b>6-10 min</b><b>Balance sequence</b></nav></section>
        <article><Lightbulb /><small>Rule</small><strong>ax + b = c&nbsp;&nbsp;⇒&nbsp;&nbsp;x = <span>c − b<i>a</i></span></strong><p>Undo + or − before × or ÷.</p></article>
      </header>

      <main className="multi108-workspace">
        <header><h2><Scale />EXPLORE WITH THE BALANCE MODEL</h2><nav><span>Step</span>{[[0, "Start"], [1, "1"], [2, "2"], [3, "3"], [4, "Result"]].map(([value, label]) => <button type="button" className={step === value ? "active" : ""} key={value} onClick={() => { setStep(Number(value)); act(); }}>{label}</button>)}</nav></header>
        <section className="multi108-workspace-grid">
          <article className="multi108-model">
            <header><label>Equation<select aria-label="Multi-step equation" value={problem.id} onChange={(event) => selectProblem(event.target.value)}>{problems.map((item) => <option value={item.id} key={item.id}>{expressionOf(item)}</option>)}</select></label><button type="button" onClick={reset}><RotateCcw />Reset</button></header>
            <section className="multi108-current"><h3>Step {Math.min(step, 3)} of 3: {step === 0 ? "Start" : step === 1 ? "Remove constant" : step === 2 ? "Split into equal groups" : "Result"}</h3><p>{step < 2 ? `${inverseText(problem)} from both sides.` : `Each ${problem.variable} has ${solution} units.`}</p></section>
            <BalanceBlocks problem={problem} operationDrops={operationDrops} onDrop={dropOperation} />
            <div className="multi108-intermediate">{problem.coefficient}{problem.variable} = {intermediate}</div>
            <div className="multi108-groups" aria-label="Equal groups drop target" onDragOver={(event) => event.preventDefault()} onDrop={(event) => dropOperation(event, "groups")}>
              {Array.from({ length: problem.coefficient }, (_, group) => <section key={group}><b>{problem.variable}</b><div>{Array.from({ length: Math.min(solution, 8) }, (_, unit) => <i key={unit} />)}</div></section>)}
            </div>
            <div className="multi108-result">{problem.variable} = <b>{solution}</b></div>
            <footer><h3>Step-by-step summary</h3><div><StepCard number="1" title="Remove constant" text={`${inverseText(problem)} from both sides.`} equation={`${problem.coefficient}${problem.variable} = ${intermediate}`} /><ArrowRight /><StepCard number="2" title="Split into equal groups" text={`Divide both sides by ${problem.coefficient}.`} equation={`${problem.variable} = ${solution}`} /><ArrowRight /><StepCard number="3" title="Result" text={`Each ${problem.variable} equals ${solution}.`} equation={`${problem.variable} = ${solution}`} /></div></footer>
            {invalidDrop && <em>Use the matching operation card on its highlighted target.</em>}
          </article>

          <aside className="multi108-side">
            <section className="current"><small>Current Step</small><h2>{step === 0 ? "Start with the equation" : step === 1 ? `Step 1: ${inverseText(problem)}` : step === 2 ? `Step 2: Divide by ${problem.coefficient}` : "Step 3: Check the result"}</h2><p>{step <= 1 ? `${inverseText(problem)} on both sides keeps equality.` : `Split ${intermediate} units into ${problem.coefficient} equal groups.`}</p><strong>{problem.coefficient}{problem.variable} = {intermediate}&nbsp;&nbsp;⇒&nbsp;&nbsp;{problem.variable} = {solution}</strong></section>
            <section className="actions"><small>ACTIONS</small><button type="button" draggable aria-label={`Drag remove constant ${inverseText(problem)}`} onDragStart={(event) => startDrag(event, "constant")} onDragEnd={() => setDragging("")} onClick={() => { setStep(1); act(); }}><Equal /><span><b>Remove constant</b><small>{inverseText(problem)} from both sides.</small></span></button><button type="button" draggable aria-label={`Drag split into ${problem.coefficient} equal groups`} onDragStart={(event) => startDrag(event, "groups")} onDragEnd={() => setDragging("")} onClick={() => { setStep(2); act(); }}><Scale /><span><b>Split into equal groups</b><small>Divide both sides by the coefficient.</small></span></button><button type="button" onClick={() => { setStep(3); act(); }}><Check /><span><b>Check answer</b><small>Verify your solution.</small></span></button></section>
            <section className="solution"><small>Result</small><h2>{problem.variable} = {solution}</h2><p>Solution<br /><i>{problem.variable} = {solution}</i></p><p>Check<br /><strong>{problem.coefficient}({solution}) {problem.constant >= 0 ? "+" : "−"} {Math.abs(problem.constant)} = {checkedValue} <Check /></strong></p></section>
            <section className="warning"><CircleAlert /><small>Warning</small><h3>Wrong Step Order</h3><p>Dividing before {problem.constant >= 0 ? "subtracting" : "adding"} {Math.abs(problem.constant)} is not correct for ax + b = c.</p><p>Undo the constant before dividing by the coefficient.</p></section>
          </aside>
        </section>
      </main>

      <section className="multi108-practice">
        <header><h2><Star />TRY IT YOURSELF</h2></header>
        <div className="multi108-practice-grid">
          <article className="problem"><p>Practice: Solve the equation.</p><label><select aria-label="Multi-step practice equation" value={practiceIndex} onChange={(event) => { const index = Number(event.target.value); setPracticeIndex(index); setPracticeAnswer(""); setPracticeChecked(false); act(); }}>{practiceProblems.map((item, index) => <option value={index} key={item.id}>{expressionOf(item)}</option>)}</select></label><button type="button" onClick={() => { setStepGuide((value) => !value); act(); }}><CircleHelp />Step guide</button><MiniBalance problem={practice} /><label className="answer">Your answer<input aria-label="Multi-step practice answer" type="number" value={practiceAnswer} onChange={(event) => { setPracticeAnswer(event.target.value); setPracticeChecked(false); act(); }} /></label><button className="check" type="button" onClick={() => { setPracticeChecked(true); act(); }}><Check />Check answer</button></article>
          <article className="hints"><h3>Steps (hints)</h3>{stepGuide ? <><section><b>1</b><p>{inverseText(practice)} from both sides.</p><strong>{practice.coefficient}{practice.variable} = {practice.rhs - practice.constant}</strong></section><section><b>2</b><p>Divide both sides by {practice.coefficient}.</p><strong>{practice.variable} = {practiceSolution}</strong></section></> : <p className="hidden">Step guide hidden</p>}{practiceChecked && <footer className={practiceCorrect ? "correct" : "wrong"}>{practiceCorrect ? <><Lightbulb /><b>Great! {practice.variable} = {practiceSolution}</b><span>Check: {practice.coefficient}({practiceSolution}) {practice.constant >= 0 ? "+" : "−"} {Math.abs(practice.constant)} = {practice.rhs} <Check /></span></> : "Check the order of inverse operations."}</footer>}</article>
          <aside><Lightbulb /><h3>Need a nudge?</h3>{nudgeOpen && <p>Undo the constant first. Then undo multiplication by dividing by {practice.coefficient}.</p>}<button type="button" onClick={() => { setNudgeOpen((value) => !value); act(); }}>{nudgeOpen ? "Hide the steps" : "Show me the steps"}</button></aside>
        </div>
        <footer><CircleAlert />Remember: Undo addition or subtraction first. Then undo multiplication or division.</footer>
      </section>

      <nav className="multi108-navigation"><a href="/lessons/algebra/107-one-step-equations"><ArrowLeft /><span>PREVIOUS<b>One-Step Equations</b></span></a><a href="/lessons/algebra/109-equations-with-fractions"><span>NEXT<b>Equations with Fractions</b></span><ArrowRight /></a></nav>
    </div>
  );
}

function BalanceBlocks({ problem, operationDrops, onDrop }: { problem: Problem; operationDrops: string[]; onDrop: (event: DragEvent<HTMLElement>, expected: "constant" | "groups") => void }) {
  return <div className="multi108-balance" aria-label={`Balance blocks for ${expressionOf(problem)}`}><div className="beam" /><div className="stand" /><section className="pan left"><div>{Array.from({ length: problem.coefficient }, (_, index) => <b key={index}>{problem.variable}</b>)}<span className={problem.constant < 0 ? "negative" : ""} aria-label="Remove constant drop target" onDragOver={(event) => event.preventDefault()} onDrop={(event) => onDrop(event, "constant")}>{Array.from({ length: Math.min(Math.abs(problem.constant), 6) }, (_, index) => <i key={index} />)}</span></div></section><section className="pan right"><div>{Array.from({ length: Math.min(problem.rhs, 15) }, (_, index) => <i key={index} />)}</div></section>{operationDrops.includes("constant") && <em>{inverseText(problem)} applied</em>}</div>;
}

function MiniBalance({ problem }: { problem: Problem }) { return <div className="multi108-mini"><div /><section>{Array.from({ length: problem.coefficient }, (_, index) => <b key={index}>{problem.variable}</b>)}{Array.from({ length: Math.abs(problem.constant) }, (_, index) => <i key={index} />)}</section><section>{Array.from({ length: Math.min(problem.rhs, 14) }, (_, index) => <i key={index} />)}</section></div>; }

function StepCard({ number, title, text, equation }: { number: string; title: string; text: string; equation: string }) { return <article><b>{number}</b><h3>{title}</h3><p>{text}</p><strong>{equation}</strong></article>; }
