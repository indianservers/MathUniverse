import { Check, RotateCcw, Target } from "lucide-react";
import { useMemo, useState } from "react";
import type { LessonAdapterProps } from "../types";
import {
  firstOutcomes,
  multiplicationTree,
  probabilityFraction,
  type StageOneKind,
  type StageTwoKind,
} from "./multiplicationRuleLessonModel";
import "./MultiplicationRuleLesson505.css";

export default function MultiplicationRuleLesson505({ resetToken, onInteraction }: LessonAdapterProps) {
  return <MultiplicationRuleActivity key={resetToken} onInteraction={onInteraction} />;
}

function MultiplicationRuleActivity({ onInteraction }: Pick<LessonAdapterProps, "onInteraction">) {
  const [firstKind, setFirstKind] = useState<StageOneKind>("die");
  const [secondKind, setSecondKind] = useState<StageTwoKind>("fair");
  const [dependent, setDependent] = useState(false);
  const [selectedFirst, setSelectedFirst] = useState("3");
  const [selectedSecond, setSelectedSecond] = useState<"H" | "T">("H");
  const [checkedPractice, setCheckedPractice] = useState<number[]>([]);
  const paths = useMemo(
    () => multiplicationTree(firstKind, secondKind, dependent),
    [dependent, firstKind, secondKind],
  );
  const selected = paths.find((path) => path.first === selectedFirst && path.second === selectedSecond) ?? paths[0];
  const outcomes = firstOutcomes(firstKind);
  const total = paths.reduce((sum, path) => sum + path.probability, 0);

  const reset = () => {
    setFirstKind("die");
    setSecondKind("fair");
    setDependent(false);
    setSelectedFirst("3");
    setSelectedSecond("H");
    setCheckedPractice([]);
    onInteraction();
  };

  return (
    <div className="mr505" data-testid="probability-mockup-0468" data-target-family="probability-and-distributions">
      <header className="mr505-hero">
        <div><span>DATA AND PROBABILITY · PROBABILITY AND DISTRIBUTIONS</span><h2>Multiplication Rule</h2><p>Calculate joint events in sequential experiments.</p></div>
        <article><Target size={25} /><div><b>Objective</b><p>Find the probability of joint events in sequential experiments using the Multiplication Rule.</p></div></article>
      </header>
      <nav aria-label="Lesson sections"><b>Interact</b><span>Learn</span><span>Example</span><span>Formula</span><span>Practice</span></nav>

      <section className="mr505-builder">
        <header>
          <div><h3>Sequential experiment builder</h3><p><b>Example experiment</b><br />{firstKind === "die" ? "Roll a die" : "Flip a coin"}, then flip a {secondKind === "fair" ? "fair" : "biased"} coin.</p></div>
          <div className="mr505-mode"><b>Model type</b><button type="button" className={!dependent ? "active" : ""} onClick={() => { setDependent(false); onInteraction(); }}>Independent</button><button type="button" className={dependent ? "active" : ""} onClick={() => { setDependent(true); onInteraction(); }}>Dependent</button></div>
        </header>
        <div className="mr505-workspace">
          <aside className="mr505-stages">
            <article><h4>⚄ Stage 1</h4><select aria-label="Stage one experiment" value={firstKind} onChange={(event) => { const next = event.target.value as StageOneKind; setFirstKind(next); setSelectedFirst(next === "die" ? "3" : "H"); onInteraction(); }}><option value="die">Die ({outcomes.length} faces)</option><option value="coin">Fair coin</option></select><p>Outcomes <b>{outcomes.length}</b></p><p>P(each) <b>{probabilityFraction(1 / outcomes.length)}</b></p></article>
            <article><h4>◉ Stage 2</h4><p>After any stage-one outcome</p><select aria-label="Stage two experiment" value={secondKind} onChange={(event) => { setSecondKind(event.target.value as StageTwoKind); onInteraction(); }}><option value="fair">Fair coin</option><option value="biased">Biased coin</option></select><p>Outcomes <b>2</b></p><p>{dependent ? "P(H | first) varies" : `P(H) ${secondKind === "fair" ? "1/2" : "7/10"}`}</p></article>
          </aside>

          <article className="mr505-tree">
            <header><h4>Experiment tree</h4><span>Selected path</span><i>Other paths</i><button type="button" onClick={reset}><RotateCcw size={13} /> Reset</button></header>
            <div className="mr505-start">Start</div>
            <div className="mr505-branches">
              {outcomes.map((first) => (
                <div className={`mr505-branch ${selectedFirst === first ? "selected" : ""}`} key={first}>
                  <button type="button" onClick={() => { setSelectedFirst(first); onInteraction(); }}><b>{first}</b><small>({probabilityFraction(1 / outcomes.length)})</small></button>
                  <div>
                    {(["H", "T"] as const).map((second) => {
                      const path = paths.find((item) => item.first === first && item.second === second)!;
                      return <button type="button" className={selectedFirst === first && selectedSecond === second ? "active" : ""} key={second} onClick={() => { setSelectedFirst(first); setSelectedSecond(second); onInteraction(); }}><b>{second}</b><small>({probabilityFraction(path.conditionalProbability)})</small></button>;
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="mr505-selected"><span>Selected path <b>{selected.first} → {selected.second}</b></span><span>Path probability <b>P({selected.first}) × P({selected.second}|{selected.first}) = {probabilityFraction(selected.firstProbability)} × {probabilityFraction(selected.conditionalProbability)} = {probabilityFraction(selected.probability)}</b></span></div>
          </article>
        </div>
      </section>

      <section className="mr505-summary">
        <article><h3>Sample space</h3><b>All possible outcomes ({paths.length})</b><div className="mr505-outcomes">{paths.map((path) => <button type="button" key={`${path.first}${path.second}`} className={path === selected ? "active" : ""} onClick={() => { setSelectedFirst(path.first); setSelectedSecond(path.second); onInteraction(); }}>{path.first}{path.second}</button>)}</div><p>S = {`{${paths.map((path) => `${path.first}${path.second}`).join(", ")}}`}</p><p>|S| = {paths.length}</p></article>
        <article><h3>Path probabilities</h3><p>{dependent ? "Conditional probabilities change after stage one." : "All outcomes follow the selected independent probabilities."}</p>{paths.slice(0, 5).map((path) => <p key={`${path.first}${path.second}`}>P({path.first}{path.second}) = {probabilityFraction(path.firstProbability)} × {probabilityFraction(path.conditionalProbability)} = {probabilityFraction(path.probability)}</p>)}</article>
        <article><h3>Total probability check</h3><div className="mr505-total">Σ path probabilities = {total.toFixed(2)} <Check size={18} /></div><p><b>All probabilities sum to 1.</b><br />This is a valid probability model.</p></article>
      </section>

      <section className="mr505-rule">
        <article><h3>Multiplication Rule</h3><p>For two events A and B in sequence,</p><strong>P(A and B) = P(A) × P(B|A)</strong><p>Special case (independent events):</p><strong>P(A and B) = P(A) × P(B)</strong></article>
        <article><h3>In this experiment ({dependent ? "dependent" : "independent"} events)</h3><p>The selected path requires both events to happen.</p><strong>P({selected.first} followed by {selected.second}) = {probabilityFraction(selected.firstProbability)} × {probabilityFraction(selected.conditionalProbability)} = {probabilityFraction(selected.probability)}</strong></article>
        <article className="mr505-misconception"><h3>Common misconception</h3><b>Adding instead of multiplying.</b><p>Incorrect: P(3 and H) = 1/6 + 1/2</p><p>Correct: P(3 and H) = 1/6 × 1/2 = 1/12</p><p>We multiply because both events must happen.</p></article>
      </section>

      <section className="mr505-practice"><h3>Practice: Use the Multiplication Rule</h3><div>{[
        ["A card is drawn, then a coin is tossed. Find P(ace and head).", "1/3 × 1/2 = 1/6"],
        ["A die is rolled, then a coin is tossed. Find P(even and tails).", "1/2 × 1/2 = 1/4"],
        ["Two fair coins are tossed. Find P(H then T).", "1/2 × 1/2 = 1/4"],
      ].map(([question, answer], index) => <article key={question}><b><i>{index + 1}</i>{question}</b><p>{answer}</p><button type="button" onClick={() => { setCheckedPractice((current) => current.includes(index) ? current : [...current, index]); onInteraction(); }}>Check answer</button>{checkedPractice.includes(index) && <span><Check size={13} /> Correct</span>}</article>)}</div></section>

      <footer><button type="button" onClick={reset}><RotateCcw size={14} /> Reset lesson</button><span>Previous: Addition Rule &nbsp; Next: Independent Events →</span></footer>
    </div>
  );
}
