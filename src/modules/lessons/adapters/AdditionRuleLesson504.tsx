import { CheckCircle2, CircleAlert, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import type { LessonAdapterProps } from "../types";
import {
  additionRuleSummary,
  outcomeRegion,
  regionIsHighlighted,
  type AdditionRegion,
} from "./additionRuleLessonModel";
import "./AdditionRuleLesson504.css";
import { LessonTopicStudyBoard } from "../components/LessonTopicStudyBoard";

const practiceOptions = ["1/6", "5/12", "7/12", "2/3"];

export default function AdditionRuleLesson504({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  return (
    <AdditionRuleActivity key={resetToken} onInteraction={onInteraction} />
  );
}

function AdditionRuleActivity({
  onInteraction,
}: Pick<LessonAdapterProps, "onInteraction">) {
  const [mutuallyExclusive, setMutuallyExclusive] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<AdditionRegion>("union");
  const [practiceAnswer, setPracticeAnswer] = useState("7/12");
  const [practiceChecked, setPracticeChecked] = useState(false);
  const summary = useMemo(
    () => additionRuleSummary(mutuallyExclusive),
    [mutuallyExclusive],
  );
  const bLabel = mutuallyExclusive ? "Sum is 2" : "First die is 4";

  const chooseRegion = (region: AdditionRegion) => {
    setSelectedRegion(region);
    onInteraction();
  };

  const reset = () => {
    setMutuallyExclusive(false);
    setSelectedRegion("union");
    setPracticeAnswer("7/12");
    setPracticeChecked(false);
    onInteraction();
  };

  return (
    <div
      className="ar504"
      data-testid="probability-mockup-0467"
      data-target-family="probability-and-distributions"
    >
      <header className="ar504-hero">
        <div>
          <span>DATA AND PROBABILITY · PROBABILITY AND DISTRIBUTIONS</span>
          <h2>Addition Rule</h2>
          <p>Calculate unions.</p>
        </div>
        <article>
          <b>Objective</b>
          <p>
            Find the probability of A ∪ B using the Addition Rule. Visualize
            overlap, avoid double-counting, and compute unions accurately.
          </p>
        </article>
      </header>

      <nav aria-label="Lesson sections">
        <b>Interact</b>
        <span>Learn</span>
        <span>Example</span>
        <span>Formula</span>
        <span>Practice</span>
      </nav>

      <section className="ar504-experiment">
        <header>
          <div>
            <h3>1. Interact: Explore events and the Addition Rule</h3>
            <p>
              <b>Experiment</b>
              <br />
              Two dice are rolled.
            </p>
          </div>
          <label className="ar504-switch">
            <input
              type="checkbox"
              checked={mutuallyExclusive}
              onChange={(event) => {
                setMutuallyExclusive(event.target.checked);
                setSelectedRegion("union");
                onInteraction();
              }}
            />
            <span /> Mutually exclusive (no overlap)
          </label>
        </header>

        <div className="ar504-lab">
          <aside className="ar504-events">
            <h4>Events</h4>
            <p>Click cards to highlight regions.</p>
            <EventCard
              tone="a"
              label="A: Sum is 7"
              count={summary.a.length}
              probability={`${summary.a.length}/36 = 1/6`}
              active={selectedRegion === "a"}
              onClick={() => chooseRegion("a")}
            />
            <EventCard
              tone="b"
              label={`B: ${bLabel}`}
              count={summary.b.length}
              probability={`${summary.b.length}/36`}
              active={selectedRegion === "b"}
              onClick={() => chooseRegion("b")}
            />
            <EventCard
              tone="intersection"
              label="A ∩ B"
              count={summary.intersection.length}
              probability={`${summary.intersection.length}/36`}
              active={selectedRegion === "intersection"}
              onClick={() => chooseRegion("intersection")}
            />
            <EventCard
              tone="union"
              label="A ∪ B"
              count={summary.union.length}
              probability={`${summary.union.length}/36`}
              active={selectedRegion === "union"}
              onClick={() => chooseRegion("union")}
            />
          </aside>

          <article className="ar504-space">
            <h4>Sample space (36 outcomes)</h4>
            <div
              className={`ar504-venn ${mutuallyExclusive ? "exclusive" : ""}`}
            >
              <button
                type="button"
                className="circle circle-a"
                onClick={() => chooseRegion("a")}
              >
                <span>
                  A<br />
                  <small>Sum is 7</small>
                </span>
                <b>{summary.a.length - summary.intersection.length}</b>
              </button>
              <button
                type="button"
                className="circle circle-b"
                onClick={() => chooseRegion("b")}
              >
                <span>
                  B<br />
                  <small>{bLabel}</small>
                </span>
                <b>{summary.b.length - summary.intersection.length}</b>
              </button>
              {!mutuallyExclusive && (
                <button
                  type="button"
                  className="venn-overlap"
                  onClick={() => chooseRegion("intersection")}
                >
                  <b>{summary.intersection.length}</b>
                  <small>(4, 3)</small>
                </button>
              )}
            </div>
            <div className="ar504-grid" aria-label="Two dice sample space">
              {Array.from({ length: 6 }, (_, first) => (
                <div className="ar504-row" key={first}>
                  <b>{first + 1} ·</b>
                  {Array.from({ length: 6 }, (_, second) => {
                    const outcome = [first + 1, second + 1] as const;
                    const region = outcomeRegion(outcome, mutuallyExclusive);
                    return (
                      <button
                        type="button"
                        key={second}
                        className={`region-${region} ${regionIsHighlighted(region, selectedRegion) ? "highlight" : ""}`}
                        aria-label={`Outcome ${first + 1}, ${second + 1}`}
                        onClick={() => chooseRegion(region)}
                      >
                        ({first + 1},{second + 1})
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="ar504-legend">
              <span>
                A only ({summary.a.length - summary.intersection.length})
              </span>
              <span>A ∩ B ({summary.intersection.length})</span>
              <span>
                B only ({summary.b.length - summary.intersection.length})
              </span>
              <span>Neither ({summary.neither})</span>
            </div>
          </article>

          <aside className="ar504-calculation">
            <h4>Live calculation</h4>
            <p>
              Total outcomes <b>|S| = {summary.total}</b>
            </p>
            <p>
              |A| = {summary.a.length}
              <b>P(A) = {summary.a.length}/36</b>
            </p>
            <p>
              |B| = {summary.b.length}
              <b>P(B) = {summary.b.length}/36</b>
            </p>
            <p>
              |A ∩ B| = {summary.intersection.length}
              <b>P(A ∩ B) = {summary.intersection.length}/36</b>
            </p>
            <div className="ar504-equation">
              |A ∪ B| = |A| + |B| − |A ∩ B|
              <br />= {summary.a.length} + {summary.b.length} −{" "}
              {summary.intersection.length}
              <br />= {summary.union.length}
            </div>
            <strong>
              P(A ∪ B) = {summary.union.length}/36
              <br />
              <em>{(summary.probability * 100).toFixed(2)}%</em>
            </strong>
            {!mutuallyExclusive && (
              <div className="ar504-warning">
                <CircleAlert size={18} />
                <span>
                  <b>Double-count warning</b> Adding |A| and |B| counts the
                  intersection twice. Subtract |A ∩ B| once.
                </span>
              </div>
            )}
          </aside>
        </div>
      </section>

      <section className="ar504-learn">
        <article>
          <h3>2. Learn: The Addition Rule</h3>
          <p>For any two events A and B,</p>
          <strong>P(A ∪ B) = P(A) + P(B) − P(A ∩ B)</strong>
        </article>
        <article>
          <h3>Notation guide</h3>
          <p>• A ∪ B: A or B or both</p>
          <p>• A ∩ B: A and B</p>
          <p>• |S|: total number of outcomes</p>
        </article>
      </section>

      <section className="ar504-example">
        <h3>3. Worked example</h3>
        <p>
          Two dice are rolled. Let A: “Sum is 7” and B: “First die is 4.” Find
          P(A ∪ B).
        </p>
        <div>
          <article>
            <b>Step 1: Counts</b>
            <p>
              |A| = 6<br />
              |B| = 6<br />
              |A ∩ B| = 1<br />
              |S| = 36
            </p>
          </article>
          <article>
            <b>Step 2: Apply the rule</b>
            <p>P(A ∪ B) = 6/36 + 6/36 − 1/36 = 11/36</p>
          </article>
          <article>
            <b>Result</b>
            <strong>P(A ∪ B) = 11/36 = 30.56%</strong>
          </article>
        </div>
      </section>

      <div className="ar504-bottom">
        <section className="ar504-traps">
          <h3>4. Don’t get tricked</h3>
          <p>✕ Don’t add P(A) and P(B) directly when events overlap.</p>
          <p>✓ If events are mutually exclusive, P(A ∩ B) = 0.</p>
          <p>✓ Check counts using a sample space or Venn diagram.</p>
        </section>
        <section className="ar504-practice">
          <h3>5. Quick practice</h3>
          <p>Let A: “Sum is even” and B: “First die is 1.” Find P(A ∪ B).</p>
          <div className="ar504-options">
            {practiceOptions.map((option) => (
              <label key={option}>
                <input
                  type="radio"
                  name="addition-practice"
                  value={option}
                  checked={practiceAnswer === option}
                  onChange={() => {
                    setPracticeAnswer(option);
                    setPracticeChecked(false);
                    onInteraction();
                  }}
                />{" "}
                {option}
              </label>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setPracticeChecked(true);
              onInteraction();
            }}
          >
            Check answer
          </button>
          {practiceChecked && (
            <div
              className={practiceAnswer === "7/12" ? "correct" : "incorrect"}
              role="status"
            >
              {practiceAnswer === "7/12" ? (
                <CheckCircle2 size={18} />
              ) : (
                <CircleAlert size={18} />
              )}
              <span>
                <b>{practiceAnswer === "7/12" ? "Correct" : "Try again"}</b>
                <br />
                |A| = 18, |B| = 6, |A ∩ B| = 3, so (18 + 6 − 3)/36 = 7/12.
              </span>
            </div>
          )}
        </section>
      </div>

      <footer>
        <button type="button" onClick={reset}>
          <RotateCcw size={14} /> Reset lesson
        </button>
        <span>
          Previous: Complement Rule &nbsp; Next: Multiplication Rule →
        </span>
      </footer>
      <LessonTopicStudyBoard lessonId={504} alwaysVisible onInteraction={onInteraction} />

    </div>
  );
}

function EventCard({
  tone,
  label,
  count,
  probability,
  active,
  onClick,
}: {
  tone: Exclude<AdditionRegion, "neither">;
  label: string;
  count: number;
  probability: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`ar504-event event-${tone} ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <b>{label}</b>
      <span>Count: {count}</span>
      <span>P = {probability}</span>
    </button>
  );
}
