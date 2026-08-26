import { useEffect, useMemo, useState, type DragEvent, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  CircleAlert,
  Equal,
  NotebookPen,
  PartyPopper,
  Scale,
  Sparkles,
} from "lucide-react";
import type { LessonAdapterProps } from "../types";
import "./OneStepEquationsTargetLesson107.css";

type Equation = {
  id: string;
  label: string;
  inverse: string;
  inverseSymbol: string;
  solution: number;
  checkLeft: (value: number) => number;
  leftVariables: number;
  leftUnits: number;
  rightUnits: number;
  unitTone?: "negative";
};

const equations: Equation[] = [
  { id: "add-five", label: "x + 5 = 12", inverse: "Subtract 5", inverseSymbol: "− 5", solution: 7, checkLeft: (x) => x + 5, leftVariables: 1, leftUnits: 5, rightUnits: 12 },
  { id: "subtract-four", label: "x − 4 = 9", inverse: "Add 4", inverseSymbol: "+ 4", solution: 13, checkLeft: (x) => x - 4, leftVariables: 1, leftUnits: 4, rightUnits: 9, unitTone: "negative" },
  { id: "triple", label: "3x = 18", inverse: "Divide by 3", inverseSymbol: "÷ 3", solution: 6, checkLeft: (x) => 3 * x, leftVariables: 3, leftUnits: 0, rightUnits: 18 },
  { id: "quarter", label: "x ÷ 4 = 5", inverse: "Multiply by 4", inverseSymbol: "× 4", solution: 20, checkLeft: (x) => x / 4, leftVariables: 1, leftUnits: 0, rightUnits: 5 },
];

const practiceEquations = [
  { id: "y-minus-four", label: "y − 4 = 9", variable: "y", solution: 13, check: (value: number) => value - 4, right: 9 },
  { id: "p-plus-six", label: "p + 6 = 15", variable: "p", solution: 9, check: (value: number) => value + 6, right: 15 },
];

export default function OneStepEquationsTargetLesson107({ resetToken, onInteraction }: LessonAdapterProps) {
  const [equationId, setEquationId] = useState(equations[0].id);
  const [showBalance, setShowBalance] = useState(true);
  const [applyBoth, setApplyBoth] = useState(true);
  const [checkValue, setCheckValue] = useState("7");
  const [checkAttempted, setCheckAttempted] = useState(true);
  const [tab, setTab] = useState("Interact");
  const [dragging, setDragging] = useState("");
  const [operationDrops, setOperationDrops] = useState<string[]>([]);
  const [invalidDrop, setInvalidDrop] = useState("");
  const [guidedOpen, setGuidedOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceAnswer, setPracticeAnswer] = useState("13");
  const [practiceChecked, setPracticeChecked] = useState(true);
  const [actions, setActions] = useState(0);

  const equation = useMemo(() => equations.find((item) => item.id === equationId) ?? equations[0], [equationId]);
  const practice = practiceEquations[practiceIndex];
  const numericCheck = Number(checkValue);
  const checkLeft = Number.isFinite(numericCheck) ? equation.checkLeft(numericCheck) : Number.NaN;
  const checkRight = equation.checkLeft(equation.solution);
  const checkCorrect = Number.isFinite(checkLeft) && Math.abs(checkLeft - checkRight) < 1e-9;
  const numericPractice = Number(practiceAnswer);
  const practiceCorrect = Number.isFinite(numericPractice) && Math.abs(practice.check(numericPractice) - practice.right) < 1e-9;
  const bothDropped = operationDrops.includes("left") && operationDrops.includes("right");
  const act = () => { setActions((count) => count + 1); onInteraction(); };

  const chooseEquation = (id: string) => {
    const next = equations.find((item) => item.id === id) ?? equations[0];
    setEquationId(next.id);
    setCheckValue(String(next.solution));
    setCheckAttempted(true);
    setOperationDrops([]);
    setInvalidDrop("");
    act();
  };
  const choosePractice = (index: number) => {
    setPracticeIndex(index);
    setPracticeAnswer("");
    setPracticeChecked(false);
    act();
  };
  const reset = () => {
    setEquationId(equations[0].id);
    setShowBalance(true);
    setApplyBoth(true);
    setCheckValue("7");
    setCheckAttempted(true);
    setTab("Interact");
    setDragging("");
    setOperationDrops([]);
    setInvalidDrop("");
    setGuidedOpen(false);
    setNotesOpen(false);
    setPracticeIndex(0);
    setPracticeAnswer("13");
    setPracticeChecked(true);
    setActions(0);
    onInteraction();
  };
  useEffect(() => reset(), [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps

  const startDrag = (event: DragEvent<HTMLButtonElement>) => {
    event.dataTransfer.setData("text/one-step-operation", equation.id);
    setDragging(equation.id);
    setInvalidDrop("");
    act();
  };
  const dropOperation = (event: DragEvent<HTMLElement>, side: "left" | "right") => {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/one-step-operation");
    if (id === equation.id) {
      setOperationDrops((current) => current.includes(side) ? current : [...current, side]);
      setInvalidDrop("");
    } else {
      setInvalidDrop(id || "unknown");
    }
    setDragging("");
    act();
  };

  return (
    <div
      className="oneStep107-page"
      data-testid="algebra-mockup-0164"
      data-dedicated-lesson="107"
      data-object-model="selectable-one-step-equation-dynamic-balance-draggable-inverse-operation-both-sides-substitution-check-graded-practice-model"
      data-equation={equation.label}
      data-equation-id={equation.id}
      data-inverse={equation.inverse}
      data-solution={equation.solution}
      data-check-value={checkValue}
      data-check-left={Number.isFinite(checkLeft) ? checkLeft : "invalid"}
      data-check-right={checkRight}
      data-check-correct={checkAttempted && checkCorrect}
      data-show-balance={showBalance}
      data-apply-both={applyBoth}
      data-tab={tab}
      data-dragging={dragging}
      data-operation-drops={operationDrops.join(",")}
      data-both-dropped={bothDropped}
      data-invalid-drop={invalidDrop}
      data-guided-open={guidedOpen}
      data-notes-open={notesOpen}
      data-practice-index={practiceIndex}
      data-practice-equation={practice.label}
      data-practice-answer={practiceAnswer}
      data-practice-correct={practiceChecked && practiceCorrect}
      data-actions={actions}
    >
      <nav className="oneStep107-breadcrumb"><a href="/">Home</a><span>&gt;</span><a href="/lessons">Lessons</a><span>&gt;</span><a href="/lessons/algebra">Algebra</a><span>&gt;</span><a href="/lessons/algebra">Equations and Inequalities</a><span>&gt;</span><b>One-Step Equations</b></nav>

      <header className="oneStep107-intro">
        <small><b>ALGEBRA</b><b>EQUATIONS AND INEQUALITIES</b></small>
        <h1>One-Step Equations</h1>
        <p>Solve by applying one inverse operation to both sides.</p>
        <nav>
          <b>Intermediate-Advanced Algebra</b><b>Balance model</b><b>6-10 min</b>
          <button type="button" onClick={() => { setGuidedOpen((value) => !value); act(); }}><NotebookPen />Guided Practice</button>
          <button type="button" onClick={() => { setNotesOpen((value) => !value); act(); }}><BookOpen />Notes</button>
        </nav>
        {guidedOpen && <aside className="guided">Apply the inverse operation to the left and right pans, then check the solution.</aside>}
        {notesOpen && <aside className="notes">The same operation on both sides preserves equality.</aside>}
      </header>

      <nav className="oneStep107-tabs">
        {["Interact", "Explain", "Examples", "Formulas", "Practice", "Know more"].map((name) => <button type="button" className={tab === name ? "active" : ""} key={name} onClick={() => { setTab(name); act(); }}>{name}</button>)}
      </nav>

      <main className="oneStep107-workspace">
        <header>
          <small>BALANCE MODEL</small><h2>Solve using the balance model</h2><p>Keep both sides balanced by applying the same inverse operation.</p>
          <div><Switch label="Show balance" icon={<Scale />} value={showBalance} onToggle={() => { setShowBalance((value) => !value); act(); }} /><Switch label="Apply to both sides" icon={<Equal />} value={applyBoth} onToggle={() => { setApplyBoth((value) => !value); act(); }} /></div>
        </header>
        <section className="oneStep107-workspace-body">
          <article className="oneStep107-balance-card">
            <label>Initial equation:<select aria-label="Initial one-step equation" value={equation.id} onChange={(event) => chooseEquation(event.target.value)}>{equations.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}</select><ChevronDown /></label>
            {showBalance ? <BalanceModel equation={equation} applyBoth={applyBoth} operationDrops={operationDrops} onDrop={dropOperation} /> : <div className="oneStep107-balance-hidden">Balance model hidden</div>}
            <button className="oneStep107-operation-token" type="button" draggable aria-label={`Drag inverse operation ${equation.inverse}`} onDragStart={startDrag} onDragEnd={() => setDragging("")}><ArrowRight />{equation.inverse} from both sides</button>
            <p>Remove the same amount from each side.</p>
            <strong>Solution: <i>x = {equation.solution}</i><Check /></strong>
            {invalidDrop && <em>Use the inverse operation for the selected equation.</em>}
          </article>

          <article className="oneStep107-steps">
            <small>EQUATION STEPS</small>
            <section><b>Step 1</b><p>Start with the equation.</p><strong>{equation.label}</strong></section>
            <section><b>Step 2</b><p>{equation.inverse} from both sides.</p><strong>{applyBoth ? `${equation.label.split("=")[0].trim()} ${equation.inverseSymbol} = ${equation.label.split("=")[1].trim()} ${equation.inverseSymbol}` : "Apply mode paused"}</strong></section>
            <section><b>Step 3</b><p>Simplify both sides.</p><strong>x = {equation.solution}</strong></section>
            <aside><Check /><h3>Check the solution</h3><p>Substitute x = {equation.solution} into the original equation.</p><strong>{equation.checkLeft(equation.solution)} = {checkRight}</strong><b><Check />True</b></aside>
          </article>
        </section>
      </main>

      <section className="oneStep107-controls">
        <label>Choose equation<select aria-label="Choose equation" value={equation.id} onChange={(event) => chooseEquation(event.target.value)}>{equations.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}</select></label>
        <label>Inverse operation<select aria-label="Inverse operation" value={equation.inverse} onChange={(event) => { const next = equations.find((item) => item.inverse === event.target.value); if (next) chooseEquation(next.id); }}>{equations.map((item) => <option value={item.inverse} key={item.id}>{item.inverse}</option>)}</select></label>
        <label>Check value for x<input aria-label="Check value for x" type="number" value={checkValue} onChange={(event) => { setCheckValue(event.target.value); setCheckAttempted(false); act(); }} /></label>
        <button type="button" onClick={() => { setCheckAttempted(true); act(); }}><Check />Check solution<ChevronDown /></button>
      </section>

      <section className="oneStep107-info">
        <article><small>THE RULE</small><h2>One-Step Equation Rule</h2><strong>x + a = b&nbsp;&nbsp;⇒&nbsp;&nbsp;x = b − a</strong><p>To isolate x, subtract a from both sides.</p><footer><b>Example</b><p>x + 5 = 12&nbsp;&nbsp;⇒&nbsp;&nbsp;x = 12 − 5 = 7</p></footer></article>
        <article><small>WHY IT WORKS</small><h2>Balance Principle</h2><p>Whatever you do to one side of an equation, do to the other side to keep the balance.</p><Scale /><footer>Equality stays true.</footer></article>
        <article><small>WARNING</small><h2>Don’t break the balance!</h2><p>Changing only one side changes the value.</p><footer><b>Wrong:</b><p>x + 5 = 12<br />x = 12 − 5<br />x = 7 <strong>(not equal!)</strong></p><CircleAlert /></footer></article>
      </section>

      <section className="oneStep107-practice">
        <small>PRACTICE</small><h2>Try one on your own</h2><p>Solve the equation. Use the balance model if needed.</p>
        <div>
          <label>Equation<select aria-label="Practice equation" value={practiceIndex} onChange={(event) => choosePractice(Number(event.target.value))}>{practiceEquations.map((item, index) => <option value={index} key={item.id}>{item.label}</option>)}</select></label>
          <label>Your answer<span>{practice.variable} =</span><input aria-label="Practice one-step answer" type="number" value={practiceAnswer} onChange={(event) => { setPracticeAnswer(event.target.value); setPracticeChecked(false); act(); }} onBlur={() => setPracticeChecked(true)} /></label>
          <article><h3>Check your answer</h3><p>Substitute {practice.variable} = {practiceAnswer || "?"}.</p><strong>{Number.isFinite(numericPractice) ? practice.check(numericPractice) : "?"} = {practice.right}</strong>{practiceChecked && <b className={practiceCorrect ? "correct" : "wrong"}>{practiceCorrect ? <><Check />True</> : "Try again"}</b>}</article>
        </div>
        {practiceChecked && <footer className={practiceCorrect ? "correct" : "wrong"}>{practiceCorrect ? <><PartyPopper />Great job! {practice.variable} = {practice.solution} is correct.</> : "Apply the inverse operation to both sides."}</footer>}
      </section>

      <nav className="oneStep107-navigation"><a href="/lessons/algebra/106-identities"><ArrowLeft /><span>Previous<b>Linear Expressions</b></span></a><a href="/lessons/algebra/108-multi-step-equations"><span>Next<b>Multi-Step Equations</b></span><ArrowRight /></a></nav>
      <footer className="oneStep107-footer"><h3><Sparkles />Math Universe</h3><p>Interactive math labs, visual proofs, NCERT explorations, graphing, CAS-style tools, and classroom-ready activities.</p><nav><a href="/sitemap">Sitemap</a><a href="/docs">Docs</a><a href="/about">About</a></nav><hr /><small>© 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</small><p>www.IndianServers.com&nbsp;&nbsp; info@IndianServers.com</p></footer>
    </div>
  );
}

function BalanceModel({ equation, applyBoth, operationDrops, onDrop }: { equation: Equation; applyBoth: boolean; operationDrops: string[]; onDrop: (event: DragEvent<HTMLElement>, side: "left" | "right") => void }) {
  return <div className="oneStep107-scales" aria-label={`Balance model for ${equation.label}`}>
    <ScaleRow equation={equation} resolved={false} operationDrops={operationDrops} onDrop={onDrop} />
    <ArrowRight />
    <ScaleRow equation={equation} resolved applyBoth={applyBoth} operationDrops={operationDrops} onDrop={onDrop} />
  </div>;
}

function ScaleRow({ equation, resolved, applyBoth = true, operationDrops, onDrop }: { equation: Equation; resolved: boolean; applyBoth?: boolean; operationDrops: string[]; onDrop: (event: DragEvent<HTMLElement>, side: "left" | "right") => void }) {
  const leftVariables = resolved ? 1 : equation.leftVariables;
  const leftUnits = resolved ? 0 : equation.leftUnits;
  const rightUnits = resolved ? equation.solution : equation.rightUnits;
  return <div className={`oneStep107-scale ${resolved && !applyBoth ? "paused" : ""}`}>
    <div className="beam" /><div className="stand" /><div className="base" />
    <section className={`pan left ${operationDrops.includes("left") ? "dropped" : ""}`} aria-label="Apply inverse operation to left side" onDragOver={(event) => event.preventDefault()} onDrop={(event) => onDrop(event, "left")}>
      <div>{Array.from({ length: leftVariables }, (_, index) => <b className="variable" key={`x-${index}`}>x</b>)}{Array.from({ length: Math.min(leftUnits, 12) }, (_, index) => <i className={equation.unitTone ?? ""} key={`l-${index}`} />)}</div>
    </section>
    <section className={`pan right ${operationDrops.includes("right") ? "dropped" : ""}`} aria-label="Apply inverse operation to right side" onDragOver={(event) => event.preventDefault()} onDrop={(event) => onDrop(event, "right")}>
      <div>{Array.from({ length: Math.min(rightUnits, 20) }, (_, index) => <i key={`r-${index}`} />)}</div>
    </section>
  </div>;
}

function Switch({ label, icon, value, onToggle }: { label: string; icon: ReactNode; value: boolean; onToggle: () => void }) {
  return <button type="button" role="switch" aria-checked={value} onClick={onToggle}>{icon}<span>{label}</span><i className={value ? "on" : ""}><b /></i></button>;
}
