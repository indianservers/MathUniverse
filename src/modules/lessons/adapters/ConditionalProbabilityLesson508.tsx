import { Check, RotateCcw, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import type { LessonAdapterProps } from "../types";
import {
  cellRegion,
  conditionalSummary,
  eventALabels,
  eventBLabels,
  formatSet,
  type EventAKind,
  type EventBKind,
} from "./conditionalProbabilityLessonModel";
import "./ConditionalProbabilityLesson508.css";

const answers = ["1/36", "1/6", "5/36", "5/6"];

export default function ConditionalProbabilityLesson508({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  return (
    <ConditionalProbabilityActivity
      key={resetToken}
      onInteraction={onInteraction}
    />
  );
}

function ConditionalProbabilityActivity({
  onInteraction,
}: Pick<LessonAdapterProps, "onInteraction">) {
  const [aKind, setAKind] = useState<EventAKind>("sum7");
  const [bKind, setBKind] = useState<EventBKind>("first1");
  const [answer, setAnswer] = useState("1/6");
  const [checked, setChecked] = useState(false);
  const summary = useMemo(
    () => conditionalSummary(aKind, bKind),
    [aKind, bKind],
  );
  const reset = () => {
    setAKind("sum7");
    setBKind("first1");
    setAnswer("1/6");
    setChecked(false);
    onInteraction();
  };
  const percent = (summary.probability * 100).toFixed(2);

  return (
    <div
      className="cp508"
      data-testid="probability-mockup-0471"
      data-target-family="probability-and-distributions"
    >
      <header className="cp508-hero">
        <div>
          <span>DATA AND PROBABILITY · PROBABILITY AND DISTRIBUTIONS</span>
          <h2>Conditional Probability</h2>
          <p>Understand probability with a condition.</p>
        </div>
        <div className="cp508-actions">
          <button type="button" onClick={reset}>
            <RotateCcw size={14} /> Reset
          </button>
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard?.writeText(window.location.href);
              onInteraction();
            }}
          >
            Share
          </button>
        </div>
      </header>
      <nav aria-label="Lesson sections">
        <b>Interact</b>
        <span>Learn</span>
        <span>Example</span>
        <span>Formula</span>
        <span>Practice</span>
      </nav>
      <section className="cp508-intro">
        <article>
          <h3>Objective</h3>
          <p>Find probability of an event A given that event B has occurred.</p>
        </article>
        <article>
          <ShieldCheck size={22} />
          <div>
            <h3>The rule</h3>
            <b>Conditional Probability</b>
            <strong>P(A|B) = |A ∩ B| / |B|, P(B) &gt; 0</strong>
            <p>
              We restrict the sample space to B and then compute the probability
              of A within B.
            </p>
          </div>
        </article>
      </section>
      <section className="cp508-experiment">
        <header>
          <h3>Experiment: Two Dice</h3>
          <p>Sample space of 36 equally likely outcomes (ordered pairs).</p>
        </header>
        <div className="cp508-workspace">
          <aside className="cp508-select">
            <h3>Select events</h3>
            <label>
              Event A (numerator)
              <select
                value={aKind}
                onChange={(event) => {
                  setAKind(event.target.value as EventAKind);
                  onInteraction();
                }}
              >
                {Object.entries(eventALabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <p className="set-a">
              A = {formatSet(summary.a)}
              <br />
              |A| = {summary.a.length}
            </p>
            <label>
              Event B (condition)
              <select
                value={bKind}
                onChange={(event) => {
                  setBKind(event.target.value as EventBKind);
                  onInteraction();
                }}
              >
                {Object.entries(eventBLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <p className="set-b">
              B = {formatSet(summary.b)}
              <br />
              |B| = {summary.b.length}
            </p>
            <aside>
              Selecting B dims outcomes outside B and rescales the denominator
              to |B|.
            </aside>
            <div className="cp508-legend">
              <span>A ∩ B (both)</span>
              <span>A only</span>
              <span>B only</span>
              <span>Neither</span>
              <span>Dimmed (outside B)</span>
            </div>
          </aside>
          <article className="cp508-grid">
            <h3>Population grid (sample space)</h3>
            <p>Rows = first die, Columns = second die</p>
            <div className="cp508-gridhead">
              <i />
              {[1, 2, 3, 4, 5, 6].map((value) => (
                <b key={value}>{value}</b>
              ))}
            </div>
            {[1, 2, 3, 4, 5, 6].map((first) => (
              <div className="cp508-row" key={first}>
                <b>{first}</b>
                {[1, 2, 3, 4, 5, 6].map((second) => {
                  const pair = [first, second] as const;
                  const region = cellRegion(pair, aKind, bKind);
                  return (
                    <button
                      type="button"
                      key={second}
                      className={`region-${region} ${region === "a" || region === "neither" ? "dimmed" : ""}`}
                      onClick={() => onInteraction()}
                    >
                      ({first},{second})
                    </button>
                  );
                })}
              </div>
            ))}
            <aside>
              Condition B: {eventBLabels[bKind]}. Denominator rescales to |B| ={" "}
              {summary.b.length}.
            </aside>
          </article>
          <aside className="cp508-table">
            <h3>Two-way table</h3>
            <p>Counts for A and B</p>
            <table>
              <thead>
                <tr>
                  <th />
                  <th>A</th>
                  <th>Aᶜ</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>B</th>
                  <td>{summary.intersection.length}</td>
                  <td>{summary.neitherAWithinB}</td>
                  <td>{summary.b.length}</td>
                </tr>
                <tr>
                  <th>Bᶜ</th>
                  <td>{summary.aOutsideB}</td>
                  <td>{summary.outsideBoth}</td>
                  <td>{36 - summary.b.length}</td>
                </tr>
                <tr>
                  <th>Total</th>
                  <td>{summary.a.length}</td>
                  <td>{36 - summary.a.length}</td>
                  <td>36</td>
                </tr>
              </tbody>
            </table>
            <article>
              <h3>Counts summary</h3>
              <p>|A ∩ B| = {summary.intersection.length}</p>
              <p>|B| = {summary.b.length}</p>
              <p>|A| = {summary.a.length}</p>
              <p>Total |S| = 36</p>
            </article>
          </aside>
        </div>
      </section>
      <section className="cp508-result">
        <article>
          <h3>Calculation</h3>
          <p>Using the conditional probability rule:</p>
          <strong>
            P(A|B) = |A ∩ B| / |B| = {summary.intersection.length}/
            {summary.b.length}
          </strong>
          <p>
            Also: P(Aᶜ|B) = 1 − P(A|B) = {(1 - summary.probability).toFixed(4)}
            <br />
            P(B) = {summary.b.length}/36
            <br />
            P(A) = {summary.a.length}/36
          </p>
        </article>
        <article>
          <h3>Result</h3>
          <strong>
            P({eventALabels[aKind]} | {eventBLabels[bKind]}) ={" "}
            {summary.intersection.length}/{summary.b.length}
            <br />≈ {summary.probability.toFixed(4)} ({percent}%)
          </strong>
          <p>
            Within the {summary.b.length} possible outcomes in B,{" "}
            {summary.intersection.length} also belong to A.
          </p>
        </article>
      </section>
      <section className="cp508-warning">
        <h3>Misconception guard</h3>
        <div>
          <article>
            <b>Common mistake</b>
            <p>
              Dividing by the total outcomes instead of the condition: |A ∩ B| /
              |S|.
            </p>
          </article>
          <article>
            <b>Why it’s wrong</b>
            <p>
              Conditional probability restricts the sample space to B. The
              denominator must be |B|, not |S|.
            </p>
          </article>
        </div>
      </section>
      <section className="cp508-practice">
        <article>
          <h3>Check yourself</h3>
          <p>Let A: “sum is 7” and B: “first die is 1.” What is P(A|B)?</p>
          <div>
            {answers.map((option, index) => (
              <label
                key={option}
                className={answer === option ? "selected" : ""}
              >
                <input
                  type="radio"
                  checked={answer === option}
                  onChange={() => {
                    setAnswer(option);
                    setChecked(false);
                    onInteraction();
                  }}
                />
                <i>{String.fromCharCode(65 + index)}</i>
                {option}
              </label>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setChecked(true);
              onInteraction();
            }}
          >
            Check answer
          </button>
        </article>
        <aside className={checked && answer !== "1/6" ? "incorrect" : ""}>
          <Check size={18} />
          <div>
            <b>
              {checked
                ? answer === "1/6"
                  ? "Correct!"
                  : "Try again"
                : "Self-check"}
            </b>
            <p>
              Within B there are 6 outcomes, and 1 of them is also in A. So
              P(A|B) = 1/6.
            </p>
          </div>
        </aside>
      </section>
      <footer>
        <button type="button" onClick={reset}>
          <RotateCcw size={14} /> Reset lesson
        </button>
        <span>
          Previous: Mutually Exclusive Events &nbsp; Next: Tree Diagrams →
        </span>
      </footer>
    </div>
  );
}
