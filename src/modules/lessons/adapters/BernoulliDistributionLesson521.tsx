import { Check, Play, RotateCcw, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { LessonAdapterProps } from "../types";
import { bernoulliStats, simulateBernoulli } from "./bernoulliLessonModel";
import "./BernoulliDistributionLesson521.css";

export default function BernoulliDistributionLesson521({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  return <BernoulliActivity key={resetToken} onInteraction={onInteraction} />;
}
function BernoulliActivity({
  onInteraction,
}: Pick<LessonAdapterProps, "onInteraction">) {
  const [p, setP] = useState(0.65),
    [outcome, setOutcome] = useState<0 | 1>(1),
    [trials, setTrials] = useState(1000),
    [run, setRun] = useState(1),
    [answer, setAnswer] = useState(1),
    [checked, setChecked] = useState(true);
  const stats = bernoulliStats(p),
    simulation = useMemo(
      () => simulateBernoulli(p, trials, 521 + run),
      [p, run, trials],
    );
  const reset = () => {
    setP(0.65);
    setOutcome(1);
    setTrials(1000);
    setRun(1);
    setAnswer(1);
    setChecked(true);
    onInteraction();
  };
  return (
    <div
      className="be521"
      data-testid="probability-mockup-0484"
      data-target-family="probability-and-distributions"
    >
      <header className="be521-hero">
        <span>DATA &amp; PROBABILITY &nbsp; PROBABILITY AND DISTRIBUTIONS</span>
        <h2>Bernoulli Distribution</h2>
        <p>Model one binary trial (success or failure).</p>
        <aside>
          <article>
            <b>Learning objective</b>
            <p>
              Model a single yes/no trial, compute the PMF, mean, variance, and
              simulate outcomes.
            </p>
          </article>
          <article>
            <b>Key insight</b>
            <p>
              For a single trial, only 0 (failure) and 1 (success) can occur.
              Everything is determined by p.
            </p>
          </article>
        </aside>
        <button type="button" onClick={reset}>
          <RotateCcw size={14} />
          Reset Lab
        </button>
      </header>
      <nav>
        <b>Interactive Lab</b>
        <span>Theory &amp; Formulas</span>
        <span>Examples</span>
        <span>Quick Check</span>
        <span>Notes</span>
      </nav>
      <section className="be521-lab">
        <header>
          <div>
            <h3>Interactive Lab: One Bernoulli Trial</h3>
            <p>
              Adjust probability p and run repeated trials to explore the
              Bernoulli distribution.
            </p>
          </div>
          <strong>Live</strong>
        </header>
        <div className="be521-work">
          <aside>
            <section>
              <h3>1. Set probability of success</h3>
              <label>
                p = P(X = 1)<output>{p.toFixed(2)}</output>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={p}
                  onChange={(event) => {
                    setP(Number(event.target.value));
                    onInteraction();
                  }}
                />
              </label>
              <b>p (success probability) = {p.toFixed(2)}</b>
            </section>
            <section>
              <h3>2. One trial outcome</h3>
              <p>
                Flip once: result is{" "}
                <b>
                  {outcome} ({outcome ? "success" : "failure"})
                </b>
              </p>
              <div className="be521-outcome">
                <span className={!outcome ? "active" : ""}>
                  0<small>Failure</small>
                </span>
                <i />{" "}
                <span className={outcome ? "active" : ""}>
                  1<small>Success</small>
                </span>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setOutcome(Math.random() < p ? 1 : 0);
                    onInteraction();
                  }}
                >
                  Flip once
                </button>
                <button type="button" onClick={() => setOutcome(1)}>
                  <RotateCcw size={13} />
                  Reset
                </button>
              </div>
            </section>
            <section>
              <h3>3. Repeated trials simulator</h3>
              <label>
                Number of trials (n)<output>{trials}</output>
                <input
                  type="range"
                  min="10"
                  max="50000"
                  step="10"
                  value={trials}
                  onChange={(event) => setTrials(Number(event.target.value))}
                />
              </label>
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setRun((value) => value + 1);
                    onInteraction();
                  }}
                >
                  <Play size={13} />
                  Run simulation
                </button>
                <button type="button" onClick={() => setRun(1)}>
                  <RotateCcw size={13} />
                  Reset
                </button>
              </div>
              <article>
                <b>
                  <Check size={14} />
                  Simulation complete!
                </b>
                <p>Out of {simulation.trials} trials:</p>
                <p>
                  Successes (1): <strong>{simulation.successes}</strong>
                </p>
                <p>
                  Failures (0): <strong>{simulation.failures}</strong>
                </p>
                <p>Empirical P(1) = {simulation.empiricalSuccess.toFixed(3)}</p>
                <p>Empirical P(0) = {simulation.empiricalFailure.toFixed(3)}</p>
              </article>
            </section>
          </aside>
          <main>
            <article className="be521-pmf">
              <h3>Probability Mass Function (PMF)</h3>
              <p>For p = {p.toFixed(2)}</p>
              <div>
                <span style={{ height: `${stats.failure * 190}px` }}>
                  <b>{stats.failure.toFixed(2)}</b>
                </span>
                <span style={{ height: `${stats.p * 190}px` }}>
                  <b>{stats.p.toFixed(2)}</b>
                </span>
              </div>
              <footer>
                <span>P(X = 0) = 1 - p = {stats.failure.toFixed(2)}</span>
                <span>P(X = 1) = p = {stats.p.toFixed(2)}</span>
              </footer>
            </article>
            <article>
              <h3>PMF Table</h3>
              <table>
                <thead>
                  <tr>
                    <th>x</th>
                    <th>Meaning</th>
                    <th>P(X = x)</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>0</td>
                    <td>Failure</td>
                    <td>1 - p</td>
                    <td>{stats.failure.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>Success</td>
                    <td>p</td>
                    <td>{stats.p.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3}>Sum</td>
                    <td>1.00</td>
                  </tr>
                </tbody>
              </table>
            </article>
            <article className="be521-moments">
              <h3>Mean and Variance</h3>
              <div>
                <strong>E[X] = p</strong>
                <strong>Var(X) = p(1 - p)</strong>
              </div>
              <div>
                <strong>E[X] = {stats.mean.toFixed(2)}</strong>
                <strong>
                  Var(X) = {stats.p.toFixed(2)}(1 - {stats.p.toFixed(2)}) ={" "}
                  {stats.variance.toFixed(4)}
                </strong>
              </div>
              <p>
                <Check size={14} />
                From simulation: mean = {simulation.empiricalSuccess.toFixed(
                  3,
                )}{" "}
                approximately {stats.mean.toFixed(2)}
              </p>
            </article>
          </main>
        </div>
        <section className="be521-definition">
          <article>
            <h3>What does X represent?</h3>
            <p>X is the number of successes in a single Bernoulli trial.</p>
            <p>X = 1 means success; X = 0 means failure.</p>
          </article>
          <article>
            <h3>Notation</h3>
            <p>X ~ Bernoulli(p)</p>
            <p>X is in {`{0, 1}`}</p>
          </article>
        </section>
      </section>
      <section className="be521-insights">
        <article>
          <h3>Common Misconception</h3>
          <p>
            p is the probability of success, P(X = 1). Therefore P(X = 0) = 1 -
            p.
          </p>
        </article>
        <article>
          <h3>When to use</h3>
          <p>
            Use Bernoulli for a single yes/no trial, such as a coin toss or
            whether a light bulb works.
          </p>
        </article>
      </section>
      <section className="be521-quiz">
        <h3>Quick Check</h3>
        <p>
          A device has success probability p = 0.65. Find P(X = 1) and Var(X).
        </p>
        <div>
          {[
            "P(X=1)=0.35, Var=0.2275",
            "P(X=1)=0.65, Var=0.2275",
            "P(X=1)=0.65, Var=0.35",
            "P(X=1)=0.35, Var=0.2275",
          ].map((option, index) => (
            <label
              key={`${option}-${index}`}
              className={answer === index ? "selected" : ""}
            >
              <input
                type="radio"
                checked={answer === index}
                onChange={() => {
                  setAnswer(index);
                  setChecked(false);
                  onInteraction();
                }}
              />
              {String.fromCharCode(65 + index)}. {option}
            </label>
          ))}
        </div>
        <button type="button" onClick={() => setChecked(true)}>
          Check answer
        </button>
        {checked && (
          <aside className={answer === 1 ? "correct" : "incorrect"}>
            {answer === 1 ? <Check size={15} /> : <X size={15} />}
            <b>
              {answer === 1
                ? "Correct! P(X=1)=p and Var(X)=p(1-p)=0.2275."
                : "Review the PMF and variance formula."}
            </b>
          </aside>
        )}
      </section>
      <footer>
        <button type="button" onClick={reset}>
          <RotateCcw size={14} />
          Reset lesson
        </button>
        <span>
          Previous: Inverse Probability &nbsp; Next: Binomial Distribution
        </span>
      </footer>
    </div>
  );
}
