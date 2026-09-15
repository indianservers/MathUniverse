import { Check, Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../types";
import {
  samplingConvergence,
  simulateSamplingDistribution,
  type PopulationShape,
} from "./samplingDistributionsLessonModel";
import "./SamplingDistributionsLesson537.css";
import { LessonTopicStudyBoard } from "../components/LessonTopicStudyBoard";
const shapes: [PopulationShape, string][] = [
  ["normal", "Normal"],
  ["uniform", "Uniform"],
  ["right", "Skewed Right"],
  ["left", "Skewed Left"],
  ["bimodal", "Bimodal"],
];
export default function SamplingDistributionsLesson537({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  return <SamplingActivity key={resetToken} onInteraction={onInteraction} />;
}
function SamplingActivity({
  onInteraction,
}: Pick<LessonAdapterProps, "onInteraction">) {
  const [shape, setShape] = useState<PopulationShape>("normal"),
    [sampleSize, setSampleSize] = useState(25),
    [repetitions, setRepetitions] = useState(20000),
    [replacement, setReplacement] = useState(true),
    [speed, setSpeed] = useState(1),
    [seed, setSeed] = useState(537),
    [running, setRunning] = useState(true),
    [visible, setVisible] = useState(30),
    [answer, setAnswer] = useState(0);
  const result = useMemo(
      () =>
        simulateSamplingDistribution(
          shape,
          sampleSize,
          repetitions,
          seed,
          replacement,
        ),
      [replacement, repetitions, sampleSize, seed, shape],
    ),
    convergence = useMemo(
      () => samplingConvergence(shape, sampleSize, seed),
      [sampleSize, seed, shape],
    );
  useEffect(() => {
    if (!running || visible >= 100) return;
    const timer = window.setInterval(
      () => setVisible((v) => Math.min(100, v + 1)),
      speed === 2 ? 60 : speed === 0.5 ? 240 : 120,
    );
    return () => window.clearInterval(timer);
  }, [running, speed, visible]);
  const rerun = () => {
    setSeed((v) => v + 1);
    setVisible(0);
    setRunning(true);
    onInteraction();
  };
  const reset = () => {
    setShape("normal");
    setSampleSize(25);
    setRepetitions(20000);
    setReplacement(true);
    setSpeed(1);
    setSeed(537);
    setRunning(true);
    setVisible(30);
    setAnswer(0);
    onInteraction();
  };
  const maxBin = Math.max(1, ...result.bins),
    normalLine = Array.from({ length: 101 }, (_, i) => {
      const z = -4 + (8 * i) / 100,
        y = Math.exp(-0.5 * z * z);
      return `${5 + i * 0.9},${88 - y * 70}`;
    }).join(" ");
  return (
    <div className="sp537" data-testid="inference-mockup-0500">
      <header>
        <span>DATA AND PROBABILITY &nbsp; INFERENTIAL STATISTICS</span>
        <h2>Sampling Distributions</h2>
        <p>Understand sample variability and how it shapes our inferences.</p>
        <aside>
          <h3>Learning objective</h3>
          <p>
            Explore how the sampling distribution of the sample mean is
            approximately normal with mean mu and standard error sigma/sqrt(n).
          </p>
        </aside>
      </header>
      <nav>
        <b>Interaction + visualization</b>
        <span>Explain</span>
        <span>Examples</span>
        <span>Formulas</span>
        <span>Know more</span>
      </nav>
      <main>
        <header>
          <div>
            <h3>Interaction + visualization</h3>
            <h4>Build the sampling distribution</h4>
          </div>
          <strong>
            {running ? "Simulation running" : "Simulation paused"}
          </strong>
          <button onClick={() => setRunning((v) => !v)}>
            {running ? <Pause size={14} /> : <Play size={14} />}{" "}
            {running ? "Pause" : "Resume"}
          </button>
          <span>{repetitions.toLocaleString()} samples</span>
        </header>
        <section className="sp537-pop">
          <article>
            <h3>1. Choose a population</h3>
            <div>
              {shapes.map(([id, label]) => (
                <button
                  key={id}
                  className={shape === id ? "active" : id}
                  onClick={() => {
                    setShape(id);
                    setVisible(0);
                    onInteraction();
                  }}
                >
                  <i />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </article>
          <aside>
            <h3>Population parameters</h3>
            <p>
              mu (mean) <b>50</b>
            </p>
            <p>
              sigma (std. dev.) <b>10</b>
            </p>
          </aside>
        </section>
        <section className="sp537-controls">
          <article>
            <h3>2. Sample size (n)</h3>
            <input
              type="range"
              min="5"
              max="200"
              step="5"
              value={sampleSize}
              onChange={(e) => {
                setSampleSize(+e.target.value);
                setVisible(0);
                onInteraction();
              }}
            />
            <output>n = {sampleSize}</output>
            <p>
              Standard error <b>{result.standardError.toFixed(3)}</b>
            </p>
          </article>
          <article>
            <h3>3. Sampling method</h3>
            <label>
              <input
                type="radio"
                checked={replacement}
                onChange={() => {
                  setReplacement(true);
                  onInteraction();
                }}
              />
              With replacement
            </label>
            <label>
              <input
                type="radio"
                checked={!replacement}
                onChange={() => {
                  setReplacement(false);
                  onInteraction();
                }}
              />
              Without replacement
            </label>
            <p>
              Statistic <b>Sample mean x-bar</b>
            </p>
          </article>
          <article>
            <h3>4. Number of repeated samples</h3>
            <input
              type="range"
              min="100"
              max="50000"
              step="100"
              value={repetitions}
              onChange={(e) => {
                setRepetitions(+e.target.value);
                setVisible(0);
                onInteraction();
              }}
            />
            <output>{repetitions.toLocaleString()}</output>
            <fieldset>
              <legend>Speed</legend>
              {[0.5, 1, 2].map((v) => (
                <button
                  key={v}
                  className={speed === v ? "active" : ""}
                  onClick={() => setSpeed(v)}
                >
                  {v}x
                </button>
              ))}
            </fieldset>
            <button onClick={rerun}>
              <RotateCcw size={14} />
              Run again
            </button>
          </article>
          <aside>
            <h3>Real-time results</h3>
            <p>
              Samples collected{" "}
              <b>
                {Math.round((repetitions * visible) / 100).toLocaleString()}
              </b>
            </p>
            <p>
              Mean of x-bar <b>{result.empiricalMean.toFixed(2)}</b>
            </p>
            <p>
              Std. dev. of x-bar <b>{result.empiricalStd.toFixed(2)}</b>
            </p>
            <p>
              Min / Max{" "}
              <b>
                {result.min.toFixed(1)} / {result.max.toFixed(1)}
              </b>
            </p>
          </aside>
        </section>
        <section className="sp537-visual">
          <article>
            <h3>Individual repeated samples (n={sampleSize})</h3>
            <p>Last sample (sorted)</p>
            <div className="sp537-values">
              {result.lastSample.slice(0, 12).map((v, i) => (
                <i key={i}>{v.toFixed(1)}</i>
              ))}
            </div>
            <p>
              Sample mean x-bar ={" "}
              <b>
                {(
                  result.lastSample.reduce((a, b) => a + b, 0) /
                  result.lastSample.length
                ).toFixed(2)}
              </b>
            </p>
            <h3>Recent sample means</h3>
            <div className="sp537-dots">
              {result.means.slice(-40).map((v, i) => (
                <i
                  key={i}
                  style={{
                    left: `${Math.max(1, Math.min(98, ((v - 40) / 20) * 100))}%`,
                  }}
                />
              ))}
            </div>
          </article>
          <article>
            <h3>Sampling distribution of x-bar (n={sampleSize})</h3>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none">
              <line x1="3" y1="88" x2="98" y2="88" />
              {result.bins.map((count, i) => (
                <rect
                  key={i}
                  x={5 + i * 2.8}
                  y={88 - (count / maxBin) * 70}
                  width="2.5"
                  height={(count / maxBin) * 70}
                />
              ))}
              <polyline points={normalLine} />
            </svg>
            <p>
              Mean x-bar = {result.empiricalMean.toFixed(2)}; Normal(mu=50, SE=
              {result.standardError.toFixed(2)})
            </p>
          </article>
        </section>
        <section className="sp537-metrics">
          <article>
            <h3>Center (bias)</h3>
            <b>{result.bias.toFixed(2)}</b>
            <p>Nearly unbiased</p>
          </article>
          <article>
            <h3>Spread (standard error)</h3>
            <b>{result.empiricalStd.toFixed(2)}</b>
            <p>Theoretical SE {result.standardError.toFixed(2)}</p>
          </article>
          <article>
            <h3>95% of sample means fall within</h3>
            <b>
              {result.lower95.toFixed(2)} to {result.upper95.toFixed(2)}
            </b>
            <p>
              Theoretical: {(50 - 1.96 * result.standardError).toFixed(2)} to{" "}
              {(50 + 1.96 * result.standardError).toFixed(2)}
            </p>
          </article>
        </section>
        <section className="sp537-notes">
          <article>
            <h3>Key insight</h3>
            <p>
              The sampling distribution has mean mu and standard error
              sigma/sqrt(n).
            </p>
          </article>
          <article>
            <h3>Common misconception</h3>
            <p>
              The population itself need not be normal when n is sufficiently
              large.
            </p>
          </article>
          <article>
            <h3>Assumptions &amp; cautions</h3>
            <p>
              Use a random sample, independent observations, and the 10%
              condition without replacement.
            </p>
          </article>
        </section>
        <section className="sp537-table">
          <h3>Sample statistics (live)</h3>
          <table>
            <thead>
              <tr>
                <th>Samples</th>
                <th>Mean of x-bar</th>
                <th>Std. dev.</th>
                <th>SE theoretical</th>
                <th>Bias</th>
                <th>95% range empirical</th>
              </tr>
            </thead>
            <tbody>
              {convergence.map((row) => (
                <tr
                  key={row.repetitions}
                  className={row.repetitions === 20000 ? "current" : ""}
                >
                  <td>{row.repetitions.toLocaleString()}</td>
                  <td>{row.mean.toFixed(2)}</td>
                  <td>{row.std.toFixed(2)}</td>
                  <td>{result.standardError.toFixed(2)}</td>
                  <td>{(row.mean - 50).toFixed(2)}</td>
                  <td>
                    {result.lower95.toFixed(2)} - {result.upper95.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="sp537-quiz">
          <h3>Quick check</h3>
          <article>
            <div>
              <b>
                Which statement about the sampling distribution of the sample
                mean is true?
              </b>
              {[
                "Its mean is equal to the population mean mu.",
                "Its standard deviation equals population sigma.",
                "It is always uniform.",
                "It becomes more spread out as n increases.",
              ].map((option, i) => (
                <label key={option} className={answer === i ? "selected" : ""}>
                  <input
                    type="radio"
                    checked={answer === i}
                    onChange={() => {
                      setAnswer(i);
                      onInteraction();
                    }}
                  />
                  {option}
                </label>
              ))}
            </div>
            <aside className={answer === 0 ? "correct" : "incorrect"}>
              <Check size={15} />
              {answer === 0 ? "Correct!" : "Try again."}
              <p>Its mean is mu and standard error is sigma/sqrt(n).</p>
            </aside>
          </article>
        </section>
      </main>
      <footer>
        <button onClick={reset}>
          <RotateCcw size={14} />
          Reset lesson
        </button>
        <span>
          Previous: Distribution Simulation &nbsp; Next: Central Limit Theorem
        </span>
      </footer>
      <LessonTopicStudyBoard lessonId={537} alwaysVisible onInteraction={onInteraction} />

    </div>
  );
}
