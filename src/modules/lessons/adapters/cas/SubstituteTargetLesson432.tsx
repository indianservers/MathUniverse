import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  Hand,
  Lightbulb,
  Scale,
  Target,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState, type DragEvent, type KeyboardEvent } from "react";
import type { LessonAdapterProps } from "../../types";
import "./SubstituteTargetLesson432.css";

type Slot = number | null;
type Chip = { label: string; value: number; tone: string };
const CHIPS: Chip[] = [
  { label: "x = 3", value: 3, tone: "blue" },
  { label: "y = 4", value: 4, tone: "violet" },
  { label: "a = -2", value: -2, tone: "green" },
];

export default function SubstituteTargetLesson432({ resetToken, onInteraction }: LessonAdapterProps) {
  const [slots, setSlots] = useState<[Slot, Slot]>([3, 3]);
  const [practiceSlots, setPracticeSlots] = useState<[Slot, Slot]>([null, null]);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<"idle" | "correct" | "incorrect">("idle");
  const [actions, setActions] = useState(0);
  const exact = evaluateSlots(slots);
  const practiceExact = evaluateSlots(practiceSlots);
  const complete = slots.every((value) => value !== null);
  const practiceComplete = practiceSlots.every((value) => value !== null);
  const selected = slots[0] === slots[1] ? slots[0] : null;
  const stages = useMemo(() => evaluationStages(selected), [selected]);

  useEffect(() => {
    setSlots([3, 3]);
    setPracticeSlots([null, null]);
    setAnswer("");
    setFeedback("idle");
    setActions(0);
  }, [resetToken]);
  const act = (run: () => void) => { run(); setActions((value) => value + 1); onInteraction(); };
  const applyAll = (value: number) => act(() => setSlots([value, value]));
  const place = (practice: boolean, index: number, value: number) => act(() => {
    const setter = practice ? setPracticeSlots : setSlots;
    setter((current) => current.map((slot, slotIndex) => slotIndex === index ? value : slot) as [Slot, Slot]);
    if (practice) setFeedback("idle");
  });
  const check = () => act(() => setFeedback(practiceComplete && Number(answer) === practiceExact ? "correct" : "incorrect"));

  return <section
    className="sub432-page"
    data-testid="symbolic-cas-mockup-0338"
    data-dedicated-lesson="432"
    data-object-model="dual-occurrence-substitution-tree-order-of-operations-practice"
    data-slots={slots.map(showSlot).join(",")}
    data-value={selected ?? "mixed"}
    data-result={complete ? exact : "incomplete"}
    data-practice-slots={practiceSlots.map(showSlot).join(",")}
    data-practice-result={practiceComplete ? practiceExact : "incomplete"}
    data-feedback={feedback}
    data-actions={actions}
  >
    <section className="sub432-flow">
      {[
        [Eye, "1 OBSERVE", "See the expression and the values to substitute."],
        [Hand, "2 MANIPULATE", "Drag values into the variables in the expression."],
        [Lightbulb, "3 NOTICE", "Watch each step as the expression is evaluated."],
        [Target, "4 UNDERSTAND", "Substitution is replacement followed by simplification."],
      ].map(([Icon, title, text], index) => <article key={String(title)}><Icon/><div><h3>{String(title)}</h3><p>{String(text)}</p></div>{index < 3 && <ArrowRight/>}</article>)}
    </section>

    <section className="sub432-work">
      <header><h2>Work directly on the model</h2><span><CheckCircle2/> {complete ? "All steps correct" : "Complete both substitutions"}</span></header>
      <div className="sub432-grid">
        <aside className="sub432-params">
          <h2>CAS params</h2><section><b>STEP 1</b><p>Start with x^2 + 2^2 x.</p></section>
          <h3>Values to substitute</h3>
          <div>{CHIPS.map((chip) => <ValueChip key={chip.label} chip={chip} onApply={applyAll}/>)}</div>
          <section className="tip"><Lightbulb/><b>Tip</b><p>Drag a value onto a variable in the expression tree.</p></section>
        </aside>
        <article className="sub432-tree-card">
          <h2>Expression tree (order of operations)</h2>
          <SubstitutionTree slots={slots} result={complete ? exact : null} onDrop={(index, value) => place(false, index, value)}/>
          <div className="sub432-legend"><span/>Variable <span/>Power <span/>Multiplication <span/>Result</div>
        </article>
        <article className="sub432-steps">
          <h2>Step-by-step evaluation</h2>
          {stages.map((stage, index) => <div key={stage.title}><i>{index + 1}</i><span><b>{stage.title}</b><p>{stage.value}</p></span></div>)}
          <output><b>Exact result</b>{complete ? exact : "?"}</output>
        </article>
      </div>
    </section>

    <section className="sub432-learning">
      <article><h2><Scale/> Rule (Substitution)</h2><h3>To substitute a value for a variable:</h3><p><i>1</i>Replace every occurrence of the variable with its value.</p><p><i>2</i>Follow the order of operations (PEMDAS/BODMAS).</p><p><i>3</i>Simplify to get the exact result.</p></article>
      <article><h2>▣ Worked example</h2><h3>Evaluate x^2 + 2^2x for x = 3.</h3><b>Solution:</b><p>x^2 + 2^2x<br/>= 3^2 + 2^2 x 3<br/>= 9 + 4 x 3<br/>= 9 + 12<br/>= 21</p><strong>Exact result: 21</strong></article>
      <article><h2><XCircle/> Common misconception</h2><h3>Do not substitute only some parts.</h3><b>Not correct:</b><p><XCircle/> x^2 + 2^2x → 3^2 + 2^2x (still has x)</p><b>Correct:</b><p><CheckCircle2/> x^2 + 2^2x → 3^2 + 2^2 x 3 → 21</p><small>Always replace every occurrence before simplifying.</small></article>
    </section>

    <section className="sub432-practice">
      <header><h2>Your turn: practice</h2><p>Evaluate x^2 + 2^2x for x = -2.</p></header>
      <div className="sub432-practice-grid">
        <ol><li>Drag -2 into both x boxes in the tree.</li><li>View the steps and enter the final result.</li></ol>
        <SubstitutionTree slots={practiceSlots} result={practiceComplete ? practiceExact : null} onDrop={(index, value) => place(true, index, value)}/>
        <aside><h3><Lightbulb/> Hints</h3><p>- (-2)^2 = 4</p><p>- 2^2 = 4</p><p>- 4 x (-2) = -8</p><p>- 4 + (-8) = -4</p><label>Enter the exact number<input data-lesson-control="substitute-practice-answer" aria-label="Substitution practice answer" type="number" value={answer} onChange={(event) => { setAnswer(event.target.value); setFeedback("idle"); }}/></label></aside>
      </div>
      <button type="button" data-lesson-control="substitute-practice-check" onClick={check}>Check answer</button>
      {feedback !== "idle" && <span className={feedback}>{feedback === "correct" ? "Correct: -4." : "Replace both x values, then follow the powers."}</span>}
    </section>
    <nav className="sub432-nav" aria-label="Adjacent lessons"><a href="/lessons/symbolic-mathematics/431-factor"><ArrowLeft/><span><small>Previous</small>Factor</span></a><a href="/lessons/symbolic-mathematics/433-solve"><span><small>Next</small>Solve</span><ArrowRight/></a></nav>
  </section>;
}

function ValueChip({ chip, onApply }: { chip: Chip; onApply: (value: number) => void }) {
  const drag = (event: DragEvent<HTMLButtonElement>) => event.dataTransfer.setData("application/x-substitution-value", String(chip.value));
  return <button type="button" draggable className={chip.tone} data-lesson-control={`substitute-value-${chip.value}`} onDragStart={drag} onClick={() => onApply(chip.value)}>{chip.label}</button>;
}
function SubstitutionTree({ slots, result, onDrop }: { slots: [Slot, Slot]; result: number | null; onDrop: (index: number, value: number) => void }) {
  return <div className="sub432-tree"><strong>x² + 2²x</strong><div className="branches"><VariableNode index={0} value={slots[0]} onDrop={onDrop}/><span>2²</span><VariableNode index={1} value={slots[1]} onDrop={onDrop}/></div><div className="values"><b>{slots[0] === null ? "?" : `${slots[0]}² = ${slots[0] ** 2}`}</b><b>2² = 4</b><b>{slots[1] === null ? "?" : `4 x ${slots[1]} = ${4 * slots[1]}`}</b></div><output>{result ?? "?"}</output></div>;
}
function VariableNode({ index, value, onDrop }: { index: number; value: Slot; onDrop: (index: number, value: number) => void }) {
  const drop = (event: DragEvent<HTMLElement>) => { event.preventDefault(); const value = Number(event.dataTransfer.getData("application/x-substitution-value")); if (Number.isFinite(value)) onDrop(index, value); };
  const key = (event: KeyboardEvent<HTMLElement>) => { if (event.key === "Delete" || event.key === "Backspace") onDrop(index, 0); };
  return <i role="button" tabIndex={0} data-lesson-control={`substitute-slot-${index}`} aria-label={`Variable occurrence ${index + 1}${value === null ? " empty" : ` value ${value}`}`} onDragOver={(event) => event.preventDefault()} onDrop={drop} onKeyDown={key}><span>x</span><b>{value ?? "?"}</b></i>;
}
function evaluateSlots([left, right]: [Slot, Slot]) { return left === null || right === null ? Number.NaN : left ** 2 + 4 * right; }
function evaluationStages(value: Slot) { const shown = value ?? 0; return [{ title: `Substitute x = ${value ?? "?"}.`, value: `${shown}² + 2² x ${shown}` }, { title: "Evaluate powers.", value: `${shown ** 2} + 4 x ${shown}` }, { title: "Multiply.", value: `${shown ** 2} + ${4 * shown}` }, { title: "Add.", value: String(shown ** 2 + 4 * shown) }]; }
function showSlot(value: Slot) { return value === null ? "empty" : String(value); }
