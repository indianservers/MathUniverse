import { Check, GripVertical, RotateCcw, Shuffle } from "lucide-react";
import { useMemo, useState, type DragEvent, type PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import { clampCenter, defaultCenters, eventRadiusX, eventRadiusY, exclusiveSummary, outcomePoints, type Point, type SetKey } from "./mutuallyExclusiveLessonModel";
import "./MutuallyExclusiveEventsLesson507.css";

type DisplaySet = SetKey | "ac" | "bc";
const presets: Array<Record<SetKey, Point>> = [
  defaultCenters,
  { a: { x: 0.42, y: 0.43 }, b: { x: 0.58, y: 0.43 } },
  { a: { x: 0.28, y: 0.28 }, b: { x: 0.62, y: 0.63 } },
];

export default function MutuallyExclusiveEventsLesson507({ resetToken, onInteraction }: LessonAdapterProps) {
  return <MutuallyExclusiveActivity key={resetToken} onInteraction={onInteraction} />;
}

function MutuallyExclusiveActivity({ onInteraction }: Pick<LessonAdapterProps, "onInteraction">) {
  const [centers, setCenters] = useState(defaultCenters);
  const [dragging, setDragging] = useState<SetKey | null>(null);
  const [displaySet, setDisplaySet] = useState<DisplaySet>("a");
  const [preset, setPreset] = useState(0);
  const [answers, setAnswers] = useState({ first: "yes", union: "1/2", third: "no" });
  const [checked, setChecked] = useState(false);
  const summary = useMemo(() => exclusiveSummary(centers), [centers]);

  const reset = () => { setCenters(defaultCenters); setDisplaySet("a"); setPreset(0); setChecked(false); onInteraction(); };
  const nextExperiment = () => { const next = (preset + 1) % presets.length; setPreset(next); setCenters(presets[next]); setChecked(false); onInteraction(); };
  const moveSet = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    setCenters((current) => ({ ...current, [dragging]: clampCenter({ x: (event.clientX - bounds.left) / bounds.width, y: (event.clientY - bounds.top) / bounds.height }) }));
  };
  const dropCard = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const key = event.dataTransfer.getData("set") as DisplaySet;
    if (!key) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const base: SetKey = key.startsWith("a") ? "a" : "b";
    setDisplaySet(key);
    setCenters((current) => ({ ...current, [base]: clampCenter({ x: (event.clientX - bounds.left) / bounds.width, y: (event.clientY - bounds.top) / bounds.height }) }));
    onInteraction();
  };
  const highlighted = (value: number) => displaySet === "a" ? summary.a.includes(value) : displaySet === "b" ? summary.b.includes(value) : displaySet === "ac" ? !summary.a.includes(value) : !summary.b.includes(value);

  return <div className="me507" data-testid="probability-mockup-0470" data-target-family="probability-and-distributions">
    <header className="me507-hero"><div><span>DATA AND PROBABILITY · PROBABILITY AND DISTRIBUTIONS</span><h2>Mutually Exclusive Events</h2><p>Recognise disjoint events and use P(A ∪ B) = P(A) + P(B).</p></div><aside><span>6–10 min</span><button type="button" onClick={() => onInteraction()}>Share</button></aside></header>
    <nav aria-label="Lesson sections"><b>Interact</b><span>Learn</span><span>Example</span><span>Formula</span><span>Practice</span></nav>
    <section className="me507-explore"><header><div><h3><i>1</i> Explore: Drag event sets into the sample space</h3><p>Create events A and B. See when they are mutually exclusive.</p></div><button type="button" onClick={nextExperiment}><Shuffle size={14} /> New experiment</button><button type="button" onClick={reset}><RotateCcw size={14} /> Reset</button></header>
      <div className="me507-workspace"><aside className="me507-palette"><h3>Drag event sets</h3><p>Drag the event cards to the sample space.</p>{(["a", "b", "ac", "bc"] as DisplaySet[]).map((key) => <button type="button" draggable key={key} className={displaySet === key ? "active" : ""} onClick={() => { setDisplaySet(key); onInteraction(); }} onDragStart={(event) => event.dataTransfer.setData("set", key)}><b>{key === "a" ? "A" : key === "b" ? "B" : key === "ac" ? "Aᶜ" : "Bᶜ"}</b><span>{key === "a" ? "Event A" : key === "b" ? "Event B" : key === "ac" ? "Not A" : "Not B"}</span><GripVertical size={15} /></button>)}<hr /><h3>Tips</h3><p>Drag A and B anywhere inside Ω.</p><p>No overlap means mutually exclusive.</p><p>Overlap means not mutually exclusive.</p></aside>
        <article className="me507-space"><h3>Sample space Ω <span>(12 outcomes)</span></h3><div className={`me507-board show-${displaySet}`} onPointerMove={moveSet} onPointerUp={() => { setDragging(null); onInteraction(); }} onPointerLeave={() => setDragging(null)} onDragOver={(event) => event.preventDefault()} onDrop={dropCard}>{outcomePoints.map((outcome) => <b key={outcome.value} className={highlighted(outcome.value) ? "highlighted" : ""} style={{ left: `${outcome.x * 100}%`, top: `${outcome.y * 100}%` }}>{outcome.value}</b>)}{(["a", "b"] as SetKey[]).map((key) => <button type="button" aria-label={`Drag event ${key.toUpperCase()}`} key={key} className={`me507-circle circle-${key}`} style={{ width: `${eventRadiusX * 200}%`, height: `${eventRadiusY * 200}%`, left: `${(centers[key].x - eventRadiusX) * 100}%`, top: `${(centers[key].y - eventRadiusY) * 100}%` }} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); setDragging(key); setDisplaySet(key); }}>{key.toUpperCase()}</button>)}</div><p>Drag A, B, Aᶜ or Bᶜ here</p></article>
        <aside className="me507-summary"><h3>Are A and B mutually exclusive? <strong className={summary.exclusive ? "yes" : "no"}>{summary.exclusive ? "Yes" : "No"}</strong></h3><h3>Intersection meter</h3><label>A ∩ B <span>{summary.intersection.length} / 12</span><meter min="0" max="12" value={summary.intersection.length} /></label><article><h3>Event sizes</h3><p>A <b>{summary.a.length} outcomes</b></p><p>B <b>{summary.b.length} outcomes</b></p><p>A ∩ B <b>{summary.intersection.length} outcomes</b></p><p>Ω <b>12 outcomes</b></p></article><article><h3>Probability summary</h3><p>P(A) = {summary.a.length}/12</p><p>P(B) = {summary.b.length}/12</p><p>P(A ∩ B) = {summary.intersection.length}/12</p><strong>P(A ∪ B) = {summary.union.length}/12 = {(summary.union.length / 12).toFixed(2)}</strong></article></aside></div>
    </section>
    <section className="me507-overlap"><h3>Overlap vs No Overlap</h3><div><article><b>No overlap (Mutually exclusive)</b><div className="mini disjoint"><i /><i /></div><p>A ∩ B = ∅</p><strong>P(A ∪ B) = P(A) + P(B)</strong></article><article><b>With overlap (Not mutually exclusive)</b><div className="mini touching"><i /><i /></div><p>A ∩ B ≠ ∅</p><strong>P(A ∪ B) = P(A) + P(B) − P(A ∩ B)</strong></article></div></section>
    <div className="me507-lessons"><section><h3><i>2</i> What just happened?</h3><p>When A and B do not overlap, they are disjoint (mutually exclusive). So the probability of either event is the sum of their individual probabilities.</p><article><b>Key rule — Mutually Exclusive Events</b><strong>If A ∩ B = ∅, then P(A ∪ B) = P(A) + P(B)</strong></article><aside><b>Common misconception</b><p>Mutually exclusive does not mean independent. If both have positive probability, mutually exclusive events are dependent.</p></aside></section><section><h3><i>3</i> Calculation</h3><table><tbody><tr><th>Total outcomes in Ω</th><td>12</td></tr><tr><th>Outcomes in A</th><td>{summary.a.length} &nbsp; {`{${summary.a.join(", ")}}`}</td></tr><tr><th>Outcomes in B</th><td>{summary.b.length} &nbsp; {`{${summary.b.join(", ")}}`}</td></tr><tr><th>Outcomes in A ∩ B</th><td>{summary.intersection.length} &nbsp; {summary.intersection.length ? `{${summary.intersection.join(", ")}}` : "∅"}</td></tr></tbody></table><article><b>Compute union</b><strong>P(A ∪ B) = ({summary.a.length} + {summary.b.length} − {summary.intersection.length})/12 = {summary.union.length}/12</strong><Check size={18} /></article></section></div>
    <section className="me507-practice"><header><div><h3><i>4</i> Try it yourself</h3><p>Create other mutually exclusive events in Ω.</p></div><button type="button" onClick={() => setChecked(true)}>Check my answer</button></header><div><PracticeChoice title="Create A = {2,3,6} and B = {7,10,11}. Are they mutually exclusive?" value={answers.first} options={["yes","no"]} onChange={(value) => setAnswers((current) => ({ ...current, first: value }))} result={checked ? "Correct! A ∩ B = ∅." : undefined} correct={answers.first === "yes"} /><PracticeChoice title="What is P(A ∪ B) for these sets?" value={answers.union} options={["1/2","1/3","2/3"]} onChange={(value) => setAnswers((current) => ({ ...current, union: value }))} result={checked ? "Correct! P(A ∪ B) = 1/2." : undefined} correct={answers.union === "1/2"} /><PracticeChoice title="A = {1,2,3}, B = {3,4,5}. Are they mutually exclusive?" value={answers.third} options={["yes","no"]} onChange={(value) => setAnswers((current) => ({ ...current, third: value }))} result={checked ? "Not mutually exclusive because 3 ∈ A ∩ B." : undefined} correct={answers.third === "no"} /></div></section>
    <footer><button type="button" onClick={reset}><RotateCcw size={14} /> Reset lesson</button><span>Previous: Independent Events &nbsp; Next: Conditional Probability →</span></footer>
  </div>;
}

function PracticeChoice({ title, value, options, onChange, result, correct }: { title: string; value: string; options: string[]; onChange: (value: string) => void; result?: string; correct: boolean }) {
  return <article><b>{title}</b><div>{options.map((option) => <label key={option}><input type="radio" checked={value === option} onChange={() => onChange(option)} /> {option}</label>)}</div>{result && <p className={correct ? "correct" : "incorrect"}>{correct ? result : "Try again."}</p>}</article>;
}
