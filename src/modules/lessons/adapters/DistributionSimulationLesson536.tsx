import { Check, Pause, Play, RotateCcw, Shuffle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../types";
import {
  binomialTail,
  convergenceSeries,
  simulateBinomial,
} from "./distributionSimulationLessonModel";
import "./DistributionSimulationLesson536.css";
import { LessonTopicStudyBoard } from "../components/LessonTopicStudyBoard";
export default function DistributionSimulationLesson536({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  return (
    <DistributionSimulationActivity
      key={resetToken}
      onInteraction={onInteraction}
    />
  );
}
function DistributionSimulationActivity({
  onInteraction,
}: Pick<LessonAdapterProps, "onInteraction">) {
  const [n, setN] = useState(10),
    [p, setP] = useState(0.3),
    [size, setSize] = useState(10000),
    [seed, setSeed] = useState(56134761),
    [speed, setSpeed] = useState(5),
    [running, setRunning] = useState(true),
    [reveal, setReveal] = useState(20),
    [showTheory, setShowTheory] = useState(true),
    [answer, setAnswer] = useState(1);
  const simulation = useMemo(
      () => simulateBinomial(n, p, size, seed),
      [n, p, seed, size],
    ),
    convergence = useMemo(() => convergenceSeries(n, p, seed), [n, p, seed]);
  useEffect(() => {
    if (!running || reveal >= 20) return;
    const timer = window.setInterval(
      () => setReveal((v) => Math.min(20, v + 1)),
      Math.max(80, 650 - speed * 100),
    );
    return () => window.clearInterval(timer);
  }, [reveal, running, speed]);
  const resample = () => {
    setSeed((v) => v + 1);
    setReveal(0);
    setRunning(true);
    onInteraction();
  };
  const randomize = () => {
    setSeed(Math.floor(Math.random() * 99999999));
    setReveal(0);
    onInteraction();
  };
  const reset = () => {
    setN(10);
    setP(0.3);
    setSize(10000);
    setSeed(56134761);
    setSpeed(5);
    setRunning(true);
    setReveal(20);
    setShowTheory(true);
    setAnswer(1);
    onInteraction();
  };
  const maxProbability = Math.max(
      ...simulation.theoretical,
      ...simulation.counts.map((c) => c / size),
      0.01,
    ),
    chartPoints = simulation.theoretical
      .map(
        (prob, k) =>
          `${7 + (k / (n || 1)) * 88},${88 - (prob / maxProbability) * 70}`,
      )
      .join(" "),
    maxConv = Math.max(
      0.1,
      ...convergence.map((v) => Math.abs(v.mean - n * p)),
    );
  return (
    <div className="ds536" data-testid="probability-mockup-0499">
      <header>
        <span>DATA AND PROBABILITY &nbsp; PROBABILITY AND DISTRIBUTIONS</span>
        <h2>Distribution Simulation</h2>
        <p>Compare theoretical and empirical behaviour.</p>
        <button onClick={reset}>
          <RotateCcw size={14} />
          Reset all
        </button>
      </header>
      <nav>
        <b>Interaction + visualization</b>
        <span>Explain</span>
        <span>Examples</span>
        <span>Formulas</span>
        <span>Know more</span>
      </nav>
      <section className="ds536-intro">
        <article>
          <h3>Objective</h3>
          <p>
            See how an empirical distribution approaches the theoretical
            distribution as trials increase.
          </p>
        </article>
        <article>
          <h3>Key insight</h3>
          <p>
            By the Law of Large Numbers, empirical frequencies converge to
            theoretical probabilities.
          </p>
        </article>
        <article>
          <h3>Common misconception</h3>
          <p>
            A sample histogram will not exactly match the theoretical curve.
          </p>
        </article>
      </section>
      <main>
        <header>
          <div>
            <h3>Interactive Lab</h3>
            <h4>Distribution Simulation Lab</h4>
            <p>
              Set parameters, run simulations, and watch the empirical
              distribution converge.
            </p>
          </div>
          <strong>Live</strong>
          <button onClick={() => setRunning((v) => !v)}>
            {running ? <Pause size={14} /> : <Play size={14} />}{" "}
            {running ? "Pause" : "Resume"}
          </button>
        </header>
        <section className="ds536-controls">
          <article>
            <h3>1. Choose distribution</h3>
            <select aria-label="Distribution" value="binomial">
              <option value="binomial">Binomial</option>
            </select>
            <p>Model number of successes in n independent Bernoulli trials.</p>
            <b>X ~ Bin(n,p)</b>
          </article>
          <article>
            <h3>2. Set parameters</h3>
            <label>
              Number of trials (n)
              <input
                type="number"
                min="1"
                max="30"
                value={n}
                onChange={(e) => {
                  setN(Math.max(1, +e.target.value));
                  onInteraction();
                }}
              />
            </label>
            <label>
              Success probability (p)
              <input
                type="number"
                min="0"
                max="1"
                step=".01"
                value={p}
                onChange={(e) => {
                  setP(Math.max(0, Math.min(1, +e.target.value)));
                  onInteraction();
                }}
              />
            </label>
            <p>Mean np = {(n * p).toFixed(3)}</p>
            <p>Variance np(1-p) = {(n * p * (1 - p)).toFixed(3)}</p>
          </article>
          <article>
            <h3>3. Simulation controls</h3>
            <label>
              Sample size
              <input
                type="range"
                min="100"
                max="100000"
                step="100"
                value={size}
                onChange={(e) => {
                  setSize(+e.target.value);
                  onInteraction();
                }}
              />
              <output>{size.toLocaleString()}</output>
            </label>
            <label>
              Speed
              <input
                type="range"
                min="1"
                max="5"
                value={speed}
                onChange={(e) => setSpeed(+e.target.value)}
              />
            </label>
            <button onClick={resample}>
              <Play size={14} />
              Run / Resample
            </button>
          </article>
          <article>
            <h3>4. Random seed</h3>
            <label>
              Seed
              <input
                type="number"
                value={seed}
                onChange={(e) => {
                  setSeed(+e.target.value);
                  onInteraction();
                }}
              />
            </label>
            <p>Reproducible results.</p>
            <button onClick={randomize}>
              <Shuffle size={14} />
              Randomize seed
            </button>
          </article>
        </section>
        <section className="ds536-results">
          <h3>
            Simulation results: Binomial(n={n}, p={p.toFixed(2)}, sample size=
            {size.toLocaleString()})
          </h3>
          <div>
            <span>
              Empirical mean<b>{simulation.mean.toFixed(3)}</b>
              <small>Theoretical: {(n * p).toFixed(3)}</small>
            </span>
            <span>
              Empirical variance<b>{simulation.variance.toFixed(3)}</b>
              <small>Theoretical: {(n * p * (1 - p)).toFixed(3)}</small>
            </span>
            <span>
              Total simulations<b>{size.toLocaleString()}</b>
            </span>
            <span>
              Total successes<b>{simulation.totalSuccesses.toLocaleString()}</b>
            </span>
            <span>
              Chi-square goodness of fit<b>{simulation.chiSquare.toFixed(2)}</b>
              <small>
                df={simulation.df}, p={simulation.pValue.toFixed(3)}
              </small>
            </span>
          </div>
        </section>
        <section className="ds536-panels">
          <article className="ds536-chart">
            <h3>Empirical distribution vs theoretical PMF</h3>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none">
              <line x1="4" y1="88" x2="98" y2="88" />
              {simulation.counts.map((count, k) => (
                <rect
                  key={k}
                  x={5 + (k / (n + 1)) * 90}
                  y={88 - (count / size / maxProbability) * 70}
                  width={70 / (n + 1)}
                  height={(count / size / maxProbability) * 70}
                />
              ))}
              {showTheory && <polyline points={chartPoints} />}
            </svg>
            <table>
              <tbody>
                <tr>
                  <th>k</th>
                  {simulation.counts.map((_, k) => (
                    <td key={k}>{k}</td>
                  ))}
                </tr>
                <tr>
                  <th>Theoretical</th>
                  {simulation.theoretical.map((v, k) => (
                    <td key={k}>{v.toFixed(4)}</td>
                  ))}
                </tr>
                <tr>
                  <th>Empirical</th>
                  {simulation.counts.map((v, k) => (
                    <td key={k}>{(v / size).toFixed(4)}</td>
                  ))}
                </tr>
                <tr>
                  <th>Count</th>
                  {simulation.counts.map((v, k) => (
                    <td key={k}>{v}</td>
                  ))}
                </tr>
              </tbody>
            </table>
            <button onClick={() => setShowTheory((v) => !v)}>
              Toggle theoretical sticks
            </button>
          </article>
          <aside>
            <article>
              <h3>Live random draws</h3>
              <div className="ds536-draws">
                {simulation.draws.slice(0, reveal).map((draw, i) => (
                  <i key={i}>{draw}</i>
                ))}
              </div>
              <p>
                Successes so far{" "}
                <b>{simulation.totalSuccesses.toLocaleString()}</b>
              </p>
              <progress max="20" value={reveal} />
              <span>{Math.round((reveal / 20) * 100)}%</span>
            </article>
            <article>
              <h3>Convergence over sample size</h3>
              <svg viewBox="0 0 100 70" preserveAspectRatio="none">
                <line x1="5" y1="35" x2="96" y2="35" />
                <polyline
                  points={convergence
                    .map(
                      (point, i) =>
                        `${7 + i * 22},${35 - ((point.mean - n * p) / maxConv) * 25}`,
                    )
                    .join(" ")}
                />
              </svg>
            </article>
          </aside>
        </section>
        <section className="ds536-interpret">
          <h3>Interpretation</h3>
          <p>
            The empirical mean {simulation.mean.toFixed(3)} and variance{" "}
            {simulation.variance.toFixed(3)} are compared with theoretical
            values {(n * p).toFixed(3)} and {(n * p * (1 - p)).toFixed(3)}.
            Larger samples generally converge more closely.
          </p>
        </section>
        <section className="ds536-quiz">
          <h3>Quick knowledge check</h3>
          <article>
            <div>
              <b>For X ~ Bin(10, 0.30), what is P(X &gt;= 4)?</b>
              {[
                "0.3821",
                binomialTail(4, 10, 0.3).toFixed(4),
                "0.6179",
                "0.5000",
              ].map((option, i) => (
                <label
                  key={`${option}-${i}`}
                  className={answer === i ? "selected" : ""}
                >
                  <input
                    type="radio"
                    checked={answer === i}
                    onChange={() => {
                      setAnswer(i);
                      onInteraction();
                    }}
                  />
                  {String.fromCharCode(65 + i)}. {option}
                </label>
              ))}
            </div>
            <aside className={answer === 1 ? "correct" : "incorrect"}>
              <Check size={15} />
              {answer === 1 ? "Correct!" : "Try again."}
              <p>P(X&gt;=4) = {binomialTail(4, 10, 0.3).toFixed(4)}</p>
            </aside>
          </article>
        </section>
      </main>
      <footer>
        <button onClick={reset}>
          <RotateCcw size={14} />
          Reset lesson
        </button>
        <span>Previous: Standardisation &nbsp; Next: Normal Approximation</span>
      </footer>
      <LessonTopicStudyBoard lessonId={536} alwaysVisible onInteraction={onInteraction} />

    </div>
  );
}
