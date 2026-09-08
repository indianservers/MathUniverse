import { Check, Minus, Play, Plus, RotateCcw, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { LessonAdapterProps } from "../types";
import {
  binomialAnalysis,
  binomialChoose,
  simulateBinomial,
} from "./binomialLessonModel";
import "./BinomialDistributionLesson522.css";

export default function BinomialDistributionLesson522({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  return <BinomialActivity key={resetToken} onInteraction={onInteraction} />;
}
function BinomialActivity({
  onInteraction,
}: Pick<LessonAdapterProps, "onInteraction">) {
  const [n, setN] = useState(10),
    [p, setP] = useState(0.6),
    [event, setEvent] = useState<"exact" | "range">("exact"),
    [k, setK] = useState(6),
    [a, setA] = useState(4),
    [b, setB] = useState(7),
    [simulations, setSimulations] = useState(10000),
    [run, setRun] = useState(1),
    [answers, setAnswers] = useState([1, 2, 0]),
    [checked, setChecked] = useState([true, true, true]);
  const result = useMemo(
      () => binomialAnalysis(n, p, k, a, b),
      [a, b, k, n, p],
    ),
    simulation = useMemo(
      () => simulateBinomial(n, p, simulations, 522 + run),
      [n, p, run, simulations],
    ),
    max = Math.max(...result.pmf.map((item) => item.probability), 0.001),
    tvd =
      result.pmf.reduce(
        (sum, item, index) =>
          sum + Math.abs(item.probability - simulation.frequencies[index]),
        0,
      ) / 2;
  const reset = () => {
    setN(10);
    setP(0.6);
    setEvent("exact");
    setK(6);
    setA(4);
    setB(7);
    setSimulations(10000);
    setRun(1);
    setAnswers([1, 2, 0]);
    setChecked([true, true, true]);
    onInteraction();
  };
  const answerQuestions = [
    {
      text: "If X ~ Bin(10, 0.6), what is P(X = 6)?",
      options: [0.2001, 0.2508, 0.1715, 0.227],
      correct: 1,
    },
    {
      text: "What is E[X] for X ~ Bin(10, 0.6)?",
      options: [4, 5, 6, 10],
      correct: 2,
    },
    {
      text: "What is P(X <= 6)?",
      options: [0.6177, 0.5701, 0.7015, 0.7475],
      correct: 0,
    },
  ];
  return (
    <div
      className="bi522"
      data-testid="probability-mockup-0485"
      data-target-family="probability-and-distributions"
    >
      <header className="bi522-hero">
        <span>DATA AND PROBABILITY &nbsp; PROBABILITY AND DISTRIBUTIONS</span>
        <h2>Binomial Distribution</h2>
        <p>Model repeated binary trials with a fixed probability of success.</p>
        <article>
          <b>Learning objective</b>
          <p>
            Model a binomial experiment, compute probabilities using the PMF and
            CDF, simulate trials, and compare theoretical vs empirical results.
          </p>
        </article>
        <button type="button" onClick={reset}>
          <RotateCcw size={14} />
          Reset Lesson
        </button>
      </header>
      <nav>
        <b>Interaction + Visualization</b>
        <span>Explain</span>
        <span>Examples</span>
        <span>Formulas</span>
        <span>Know More</span>
      </nav>
      <section className="bi522-lab">
        <header>
          <div>
            <h3>Interaction + Visualization</h3>
            <h4>Binomial Distribution Lab</h4>
            <p>
              Adjust n and p to explore the PMF, exact and range probabilities,
              and simulation.
            </p>
          </div>
          <strong>All in sync</strong>
        </header>
        <div className="bi522-controls">
          <article>
            <h3>Experiment parameters</h3>
            <label>
              Number of trials, n <output>{n}</output>
              <input
                type="range"
                min="1"
                max="100"
                value={n}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setN(value);
                  setK(Math.min(k, value));
                  setB(Math.min(b, value));
                  onInteraction();
                }}
              />
            </label>
            <label>
              Probability of success, p <output>{p.toFixed(2)}</output>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={p}
                onChange={(e) => {
                  setP(Number(e.target.value));
                  onInteraction();
                }}
              />
            </label>
          </article>
          <article>
            <h3>Event selection</h3>
            <label>
              <input
                type="radio"
                checked={event === "exact"}
                onChange={() => setEvent("exact")}
              />
              Exact: X = k
            </label>
            <label>
              <input
                type="radio"
                checked={event === "range"}
                onChange={() => setEvent("range")}
              />
              Range: a &lt;= X &lt;= b
            </label>
            <Stepper label="k" value={k} max={n} onChange={setK} />
            <p>
              Event:{" "}
              <b>
                {event === "exact"
                  ? `X = ${result.k}`
                  : `${result.a} <= X <= ${result.b}`}
              </b>
            </p>
          </article>
          <article>
            <h3>Distribution summary</h3>
            <p>
              Mean <b>E[X] = np = {result.mean.toFixed(2)}</b>
            </p>
            <p>
              Variance <b>np(1-p) = {result.variance.toFixed(2)}</b>
            </p>
            <p>
              Std. dev. <b>{result.std.toFixed(2)}</b>
            </p>
          </article>
        </div>
        <div className="bi522-main">
          <article className="bi522-pmf">
            <h3>Probability Mass Function (PMF)</h3>
            <div>
              {result.pmf.map((item) => (
                <button
                  type="button"
                  key={item.k}
                  className={item.k === result.k ? "selected" : ""}
                  style={{
                    height: `${Math.max(3, (item.probability / max) * 210)}px`,
                  }}
                  onClick={() => {
                    setK(item.k);
                    setEvent("exact");
                    onInteraction();
                  }}
                >
                  <b>{item.probability.toFixed(3)}</b>
                  <span>{item.k}</span>
                </button>
              ))}
            </div>
          </article>
          <article className="bi522-exact">
            <h3>
              {event === "exact"
                ? "Exact probability (PMF)"
                : "Selected range probability"}
            </h3>
            <strong>P(X = k) = C(n,k) p^k (1-p)^(n-k)</strong>
            {event === "exact" ? (
              <>
                <p>Substitution</p>
                <strong>
                  P(X={result.k}) = C({n},{result.k})({p.toFixed(2)})^{result.k}
                  ({(1 - p).toFixed(2)})^{n - result.k}
                </strong>
                <p>
                  {binomialChoose(n, result.k)} x {p.toFixed(5)}^{result.k} x{" "}
                  {(1 - p).toFixed(5)}^{n - result.k}
                </p>
                <output>
                  P(X = {result.k}) = {result.exact.toFixed(4)}
                </output>
              </>
            ) : (
              <output>
                P({result.a} &lt;= X &lt;= {result.b}) ={" "}
                {result.range.toFixed(4)}
              </output>
            )}
          </article>
        </div>
        <div className="bi522-tables">
          <article>
            <h3>Probability table</h3>
            <table>
              <thead>
                <tr>
                  <th>k</th>
                  <th>P(X=k)</th>
                  <th>P(X&lt;=k)</th>
                </tr>
              </thead>
              <tbody>
                {result.pmf.map((item, index) => (
                  <tr
                    key={item.k}
                    className={item.k === result.k ? "selected" : ""}
                  >
                    <td>{item.k}</td>
                    <td>{item.probability.toFixed(4)}</td>
                    <td>{result.cdf[index].toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
          <article>
            <h3>Range probability</h3>
            <Stepper label="a" value={a} max={n} onChange={setA} />
            <Stepper label="b" value={b} max={n} onChange={setB} />
            <p>
              P({result.a} &lt;= X &lt;= {result.b}) = sum from {result.a} to{" "}
              {result.b}
            </p>
            <output>{result.range.toFixed(4)}</output>
          </article>
          <article>
            <h3>Cumulative probability</h3>
            <Stepper label="k" value={k} max={n} onChange={setK} />
            <p>
              P(X &lt;= {result.k}) = sum from 0 to {result.k}
            </p>
            <output>{result.cumulative.toFixed(4)}</output>
          </article>
        </div>
        <section className="bi522-sim">
          <h3>Coin-flip simulation (matches theory)</h3>
          <div className="bi522-simgrid">
            <article>
              <label>
                Number of simulations{" "}
                <output>{simulations.toLocaleString()}</output>
                <input
                  type="range"
                  min="100"
                  max="100000"
                  step="100"
                  value={simulations}
                  onChange={(e) => setSimulations(Number(e.target.value))}
                />
              </label>
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
            </article>
            <article className="bi522-compare">
              <div>
                {result.pmf.map((item, index) => (
                  <span key={item.k}>
                    <i
                      style={{ height: `${(item.probability / max) * 130}px` }}
                    />
                    <i
                      style={{
                        height: `${(simulation.frequencies[index] / max) * 130}px`,
                      }}
                    />
                    <b>{item.k}</b>
                  </span>
                ))}
              </div>
            </article>
            <article>
              <h3>Goodness of fit</h3>
              <p>
                Mean (empirical) <b>{simulation.mean.toFixed(2)}</b>
              </p>
              <p>
                Variance (empirical) <b>{simulation.variance.toFixed(2)}</b>
              </p>
              <p>
                Total variation dist. <b>{tvd.toFixed(3)}</b>
              </p>
              <strong>
                <Check size={15} />
                Excellent match!
              </strong>
            </article>
          </div>
        </section>
      </section>
      <section className="bi522-insights">
        <article>
          <h3>Key Insight</h3>
          <p>
            The binomial distribution models the number of successes in n
            independent Bernoulli trials with constant success probability p.
          </p>
        </article>
        <article>
          <h3>Common misconception</h3>
          <p>
            The trials need not be fair. The model only requires independence
            and a constant probability of success.
          </p>
        </article>
      </section>
      <section className="bi522-quiz">
        <h3>Quick knowledge check</h3>
        <div>
          {answerQuestions.map((question, index) => (
            <article key={question.text}>
              <b>
                {index + 1}. {question.text}
              </b>
              {question.options.map((option, optionIndex) => (
                <label
                  key={option}
                  className={answers[index] === optionIndex ? "selected" : ""}
                >
                  <input
                    type="radio"
                    checked={answers[index] === optionIndex}
                    onChange={() => {
                      const next = [...answers];
                      next[index] = optionIndex;
                      setAnswers(next);
                      const nextChecked = [...checked];
                      nextChecked[index] = false;
                      setChecked(nextChecked);
                      onInteraction();
                    }}
                  />
                  {String.fromCharCode(65 + optionIndex)}. {option}
                </label>
              ))}
              <button
                type="button"
                onClick={() => {
                  const next = [...checked];
                  next[index] = true;
                  setChecked(next);
                }}
              >
                Check
              </button>
              {checked[index] && (
                <p
                  className={
                    answers[index] === question.correct
                      ? "correct"
                      : "incorrect"
                  }
                >
                  {answers[index] === question.correct ? (
                    <Check size={13} />
                  ) : (
                    <X size={13} />
                  )}{" "}
                  {answers[index] === question.correct
                    ? "Correct"
                    : "Try again"}
                </p>
              )}
            </article>
          ))}
        </div>
      </section>
      <footer>
        <button type="button" onClick={reset}>
          <RotateCcw size={14} />
          Reset lesson
        </button>
        <span>
          Previous: Bernoulli Distribution &nbsp; Next: Hypergeometric
          Distribution
        </span>
      </footer>
    </div>
  );
}
function Stepper({
  label,
  value,
  max,
  onChange,
}: {
  label: string;
  value: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="bi522-step">
      {label}
      <span>
        <input
          type="number"
          min="0"
          max={max}
          value={value}
          onChange={(e) =>
            onChange(
              Math.max(0, Math.min(max, Math.round(Number(e.target.value)))),
            )
          }
        />
        <button type="button" onClick={() => onChange(Math.max(0, value - 1))}>
          <Minus size={12} />
        </button>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
        >
          <Plus size={12} />
        </button>
      </span>
    </label>
  );
}
