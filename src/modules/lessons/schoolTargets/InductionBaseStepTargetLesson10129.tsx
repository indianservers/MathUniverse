import { Check, Lightbulb, Lock, RotateCcw } from "lucide-react";
import { useState } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./InductionBaseStepTargetLesson10129.css";

const normalize = (value: string) =>
  value.toLowerCase().replace(/[\s*^{}()]/g, "");
const validHypothesis = (value: string) =>
  ["k2", "1+3+...+(2k-1)=k2", "1+3+⋯+(2k-1)=k2"].includes(normalize(value));
const validExpansion = (value: string) =>
  ["k2+2k+1", "k2+(2k+1)", "k2+2k+1="].includes(normalize(value));
const validSquare = (value: string) =>
  ["k+12", "(k+1)2"].includes(normalize(value));

function DotSquare({
  size,
  existingOnly = false,
}: {
  size: number;
  existingOnly?: boolean;
}) {
  const total = existingOnly ? size : size + 1;
  return (
    <svg
      viewBox="0 0 210 210"
      aria-label={`${total} by ${total} generated dot square`}
    >
      {Array.from({ length: total }, (_, row) =>
        Array.from({ length: total }, (_, column) => {
          const added = row === size || column === size;
          return (
            <circle
              className={added ? "new" : "old"}
              key={`${row}-${column}`}
              cx={28 + column * (150 / Math.max(total - 1, 1))}
              cy={28 + row * (150 / Math.max(total - 1, 1))}
              r="6"
            />
          );
        }),
      )}
    </svg>
  );
}

export default function InductionBaseStepTargetLesson10129({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [base, setBase] = useState(true);
  const [hypothesis, setHypothesis] = useState("");
  const [expansion, setExpansion] = useState("");
  const [square, setSquare] = useState("");
  const [complete, setComplete] = useState(false);
  const [k, setK] = useState(5);
  const [actions, setActions] = useState(0);
  const hypothesisOk = base && validHypothesis(hypothesis);
  const expansionOk = hypothesisOk && validExpansion(expansion);
  const squareOk = expansionOk && validSquare(square);
  const proofValid = base && hypothesisOk && expansionOk && squareOk;
  const act = () => setActions((count) => count + 1);
  const reset = () => {
    setBase(true);
    setHypothesis("");
    setExpansion("");
    setSquare("");
    setComplete(false);
    setK(5);
    act();
  };
  const dots = { old: k * k, added: 2 * k + 1, total: (k + 1) ** 2 };

  return (
    <section
      className="bs10129-page"
      data-testid="school-mockup-0803"
      data-object-model="dedicated-gated-induction-algebra-engine"
      data-base={String(base)}
      data-hypothesis={String(hypothesisOk)}
      data-expansion={String(expansionOk)}
      data-square={String(squareOk)}
      data-proof-valid={String(proofValid)}
      data-complete={String(complete)}
      data-k={k}
      data-old-dots={dots.old}
      data-added-dots={dots.added}
      data-total-dots={dots.total}
      data-actions={actions}
    >
      <header>
        <small>CLASS 11 · MATHEMATICAL INDUCTION</small>
        <h1>Base Case and Inductive Step</h1>
        <p>We will prove for all n ∈ N:</p>
        <strong>1 + 3 + 5 + ··· + (2n - 1) = n²</strong>
        <aside>
          <Lightbulb />
          <div>
            <h2>How this works</h2>
            <p>
              Complete each step in order. Each valid step unlocks the next one.
            </p>
            <p>All steps must be valid to complete the proof.</p>
          </div>
        </aside>
      </header>
      <main>
        <section className="bs10129-proof">
          <h2>Build the proof</h2>
          <article className={base ? "valid" : "invalid"}>
            <b>1</b>
            <div>
              <h3>
                Base Case: <span>Check P(1)</span>
              </h3>
              <p>Verify the statement for n = 1.</p>
              <p className="math">
                1 = 1²
                <br />
                P(1) is {base ? "true" : "not established"}.
              </p>
            </div>
            <button
              onClick={() => {
                setBase((value) => !value);
                setComplete(false);
                act();
              }}
            >
              {base ? (
                <>
                  <Check /> Valid
                </>
              ) : (
                "Restore base"
              )}
            </button>
          </article>
          <article
            className={!base ? "locked" : hypothesisOk ? "valid" : "active"}
          >
            <b>2</b>
            <div>
              <h3>
                Inductive Hypothesis: <span>Assume P(k)</span>
              </h3>
              <p>Assume the statement is true for n = k, where k ≥ 1.</p>
              <label>
                Enter the inductive hypothesis P(k).
                <input
                  aria-label="Inductive hypothesis"
                  disabled={!base}
                  value={hypothesis}
                  placeholder="1 + 3 + ... + (2k - 1) = k^2"
                  onChange={(event) => {
                    setHypothesis(event.target.value);
                    setComplete(false);
                    act();
                  }}
                />
              </label>
              <small>
                {!base
                  ? "This step unlocks when Step 1 is valid."
                  : hypothesisOk
                    ? "Valid hypothesis."
                    : "Enter k^2 to unlock Step 3."}
              </small>
            </div>
            {!base ? <Lock /> : hypothesisOk ? <Check /> : null}
          </article>
          <article
            className={
              !hypothesisOk ? "locked" : expansionOk ? "valid" : "active"
            }
          >
            <b>3</b>
            <div>
              <h3>
                Add the next odd term: <span>2k + 1</span>
              </h3>
              <p>Add the next odd number to both sides.</p>
              <label>
                Enter the new expression.
                <input
                  aria-label="Expanded next step"
                  disabled={!hypothesisOk}
                  value={expansion}
                  placeholder="k^2 + 2k + 1"
                  onChange={(event) => {
                    setExpansion(event.target.value);
                    setComplete(false);
                    act();
                  }}
                />
              </label>
              <small>
                {!hypothesisOk
                  ? "This step unlocks when Step 2 is valid."
                  : expansionOk
                    ? "Correct expansion."
                    : "Combine k² with the next odd term."}
              </small>
            </div>
            {!hypothesisOk ? <Lock /> : expansionOk ? <Check /> : null}
          </article>
          <article
            className={!expansionOk ? "locked" : squareOk ? "valid" : "active"}
          >
            <b>4</b>
            <div>
              <h3>
                Simplify to <span>(k + 1)²</span>
              </h3>
              <p>
                Simplify the right-hand side to complete the inductive step.
              </p>
              <label>
                Enter the simplified expression.
                <input
                  aria-label="Simplified square"
                  disabled={!expansionOk}
                  value={square}
                  placeholder="(k + 1)^2"
                  onChange={(event) => {
                    setSquare(event.target.value);
                    setComplete(false);
                    act();
                  }}
                />
              </label>
              <small>
                {!expansionOk
                  ? "This step unlocks when Step 3 is valid."
                  : squareOk
                    ? "Inductive step complete."
                    : "Factor the perfect-square trinomial."}
              </small>
            </div>
            {!expansionOk ? <Lock /> : squareOk ? <Check /> : null}
          </article>
        </section>
        <section className="bs10129-visual">
          <header>
            <h2>Visual proof companion</h2>
            <div>
              <span>■ Existing terms (up to 2k-1)</span>
              <span>■ New term (2k+1)</span>
              <span>■ Forms (k+1)²</span>
            </div>
            <label>
              k ={" "}
              <input
                aria-label="Visual proof k"
                type="number"
                min="2"
                max="7"
                value={k}
                onChange={(event) => {
                  setK(Math.max(2, Math.min(7, Number(event.target.value))));
                  act();
                }}
              />
            </label>
          </header>
          <div className="bs10129-diagrams">
            <article>
              <h3>Up to 2k-1 (assume P(k))</h3>
              <DotSquare size={k} existingOnly />
              <strong>Total dots = {dots.old} = k²</strong>
            </article>
            <b>→</b>
            <article>
              <h3>Add 2k + 1</h3>
              <DotSquare size={k} />
              <strong>
                Total dots = {dots.old} + {dots.added}
              </strong>
            </article>
            <b>→</b>
            <article>
              <h3>Forms (k + 1)²</h3>
              <DotSquare size={k} />
              <strong>Total dots = {dots.total} = (k+1)²</strong>
            </article>
          </div>
          <aside>
            <Lightbulb />
            <div>
              <h3>What's happening?</h3>
              <p>
                We add 2k+1 dots: a new row of k+1 dots and a new column of k
                dots sharing the corner.
              </p>
              <p>This turns the k × k square into a (k+1) × (k+1) square.</p>
            </div>
          </aside>
          <footer className={proofValid ? "ready" : "locked"}>
            {proofValid ? <Check /> : <Lock />}
            <strong>
              {complete
                ? "Proof marked complete."
                : proofValid
                  ? "Every step is valid. Finish the proof."
                  : "Complete all steps correctly to finish the proof."}
            </strong>
            <button
              disabled={!proofValid || complete}
              onClick={() => {
                setComplete(true);
                act();
              }}
            >
              <Check /> Mark proof as complete
            </button>
            <button aria-label="Reset proof" onClick={reset}>
              <RotateCcw />
            </button>
          </footer>
        </section>
      </main>
    </section>
  );
}
