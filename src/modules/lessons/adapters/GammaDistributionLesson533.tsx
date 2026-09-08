import { Check, Play, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import type { LessonAdapterProps } from "../types";
import {
  gammaAnalysis,
  gammaCdf,
  gammaDensity,
  simulateGammaArrival,
} from "./gammaLessonModel";
import "./GammaDistributionLesson533.css";
export default function GammaDistributionLesson533({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  return <GammaActivity key={resetToken} onInteraction={onInteraction} />;
}
function GammaActivity({
  onInteraction,
}: Pick<LessonAdapterProps, "onInteraction">) {
  const [shape, setShape] = useState(3),
    [scale, setScale] = useState(2),
    [mode, setMode] = useState<"scale" | "rate">("scale"),
    [arrivalRate, setArrivalRate] = useState(0.5),
    [eventNumber, setEventNumber] = useState(3),
    [seed, setSeed] = useState(533),
    [x, setX] = useState(8);
  const result = gammaAnalysis(shape, scale),
    sim = useMemo(
      () => simulateGammaArrival(arrivalRate, eventNumber, seed),
      [arrivalRate, eventNumber, seed],
    );
  const domain = 16,
    samples = Array.from({ length: 121 }, (_, i) => {
      const value = 0.02 + (domain * i) / 120;
      return { x: value, y: gammaDensity(value, shape, scale) };
    }),
    max = Math.max(...samples.map((p) => p.y)),
    line = samples
      .map((p) => `${5 + (p.x / domain) * 90},${88 - (p.y / max) * 68}`)
      .join(" ");
  const cdfLine = samples
    .map(
      (p) =>
        `${5 + (p.x / domain) * 90},${88 - gammaCdf(p.x, shape, scale) * 68}`,
    )
    .join(" ");
  const families = [1, 2, 3, 5, 9];
  const reset = () => {
    setShape(3);
    setScale(2);
    setMode("scale");
    setArrivalRate(0.5);
    setEventNumber(3);
    setSeed(533);
    setX(8);
    onInteraction();
  };
  return (
    <div className="gm533" data-testid="probability-mockup-0496">
      <header>
        <span>DATA AND PROBABILITY &nbsp; PROBABILITY AND DISTRIBUTIONS</span>
        <h2>Gamma Distribution</h2>
        <p>
          Model positive waiting times for the r-th event in a Poisson process.
        </p>
        <button onClick={reset}>
          <RotateCcw size={14} />
          Reset
        </button>
      </header>
      <nav>
        <b>Interactive Lab</b>
        <span>Theory</span>
        <span>Examples</span>
        <span>Formulas</span>
        <span>Key Ideas</span>
        <span>Practice</span>
      </nav>
      <main>
        <section className="gm533-top">
          <aside>
            <h3>1. Distribution controls</h3>
            <fieldset>
              <legend>Choose parameterization</legend>
              <button
                className={mode === "scale" ? "active" : ""}
                onClick={() => setMode("scale")}
              >
                Scale theta
              </button>
              <button
                className={mode === "rate" ? "active" : ""}
                onClick={() => setMode("rate")}
              >
                Rate beta
              </button>
            </fieldset>
            <label>
              Shape (k)
              <input
                type="range"
                min=".1"
                max="20"
                step=".1"
                value={shape}
                onChange={(e) => {
                  setShape(+e.target.value);
                  onInteraction();
                }}
              />
              <output>{shape.toFixed(1)}</output>
            </label>
            <label>
              {mode === "scale" ? "Scale (theta)" : "Rate (beta)"}
              <input
                type="range"
                min=".1"
                max="5"
                step=".05"
                value={mode === "scale" ? scale : 1 / scale}
                onChange={(e) => {
                  const v = +e.target.value;
                  setScale(mode === "scale" ? v : 1 / v);
                  onInteraction();
                }}
              />
              <output>
                {(mode === "scale" ? scale : 1 / scale).toFixed(2)}
              </output>
            </label>
            <p>
              Mean <b>{result.mean.toFixed(3)}</b>
            </p>
            <p>
              Variance <b>{result.variance.toFixed(3)}</b>
            </p>
          </aside>
          <article>
            <h3>
              2. Gamma(k={shape.toFixed(1)}, theta={scale.toFixed(2)}) density
            </h3>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none">
              {families.map((k, i) => {
                const pts = Array.from({ length: 100 }, (_, j) => {
                  const z = 0.02 + (domain * j) / 99;
                  return `${5 + (z / domain) * 90},${88 - (gammaDensity(z, k, scale) / Math.max(max, 0.01)) * 68}`;
                }).join(" ");
                return (
                  <polyline key={k} className={`family f${i}`} points={pts} />
                );
              })}
              <polyline className="selected" points={line} />
            </svg>
            <footer>
              Mode: {result.mode.toFixed(3)} &nbsp; Mean:{" "}
              {result.mean.toFixed(3)} &nbsp; Variance:{" "}
              {result.variance.toFixed(3)} &nbsp; SD: {result.std.toFixed(3)}
            </footer>
          </article>
        </section>
        <section className="gm533-arrival">
          <aside>
            <h3>3. Waiting time for the r-th event</h3>
            <label>
              Rate lambda
              <input
                type="range"
                min=".1"
                max="2"
                step=".05"
                value={arrivalRate}
                onChange={(e) => {
                  setArrivalRate(+e.target.value);
                  onInteraction();
                }}
              />
              <output>{arrivalRate.toFixed(2)}</output>
            </label>
            <label>
              Event number r
              <input
                type="range"
                min="1"
                max="10"
                value={eventNumber}
                onChange={(e) => {
                  setEventNumber(+e.target.value);
                  onInteraction();
                }}
              />
              <output>{eventNumber}</output>
            </label>
          </aside>
          <article>
            <h3>Simulated arrival times (one trial)</h3>
            <div className="timeline">
              {sim.arrivals.map((value, i) => (
                <i
                  key={i}
                  style={{
                    left: `${Math.min(96, (value / Math.max(sim.arrivals.at(-1) ?? 1, 1)) * 92 + 4)}%`,
                  }}
                >
                  <span>{value.toFixed(2)}</span>
                </i>
              ))}
            </div>
            <strong>
              T{eventNumber}, waiting time to event {eventNumber} ={" "}
              {sim.waitingTime.toFixed(2)}
            </strong>
            <button
              onClick={() => {
                setSeed((v) => v + 1);
                onInteraction();
              }}
            >
              <Play size={14} />
              Simulate many trials
            </button>
            <p>
              Theory: mean={(eventNumber / arrivalRate).toFixed(2)}; variance=
              {(eventNumber / arrivalRate ** 2).toFixed(3)}
            </p>
          </article>
        </section>
        <section className="gm533-prob">
          <article>
            <h3>Density with interval [2, {x.toFixed(0)}]</h3>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none">
              <polyline points={line} />
            </svg>
            <b>
              P(2 &lt;= T &lt;= {x.toFixed(0)}) ={" "}
              {(gammaCdf(x, shape, scale) - gammaCdf(2, shape, scale)).toFixed(
                4,
              )}
            </b>
          </article>
          <article>
            <h3>Cumulative distribution F(x)</h3>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none">
              <polyline points={cdfLine} />
            </svg>
            <b>
              P(T &lt;= {x.toFixed(0)}) = {gammaCdf(x, shape, scale).toFixed(4)}
            </b>
          </article>
          <aside>
            <h3>Probability calculator</h3>
            <label>
              x
              <input
                type="number"
                min="0"
                step=".5"
                value={x}
                onChange={(e) => {
                  setX(Math.max(0, +e.target.value));
                  onInteraction();
                }}
              />
            </label>
            <strong>
              P(T &lt;= {x}) = {gammaCdf(x, shape, scale).toFixed(4)}
            </strong>
            <strong>
              P(T &gt; {x}) = {(1 - gammaCdf(x, shape, scale)).toFixed(4)}
            </strong>
          </aside>
        </section>
        <section className="gm533-summary">
          <article>
            <h3>Summary</h3>
            <p>Shape {shape.toFixed(2)}</p>
            <p>Scale {scale.toFixed(2)}</p>
            <p>Mean {result.mean.toFixed(3)}</p>
            <p>Variance {result.variance.toFixed(3)}</p>
            <p>Support [0, infinity)</p>
          </article>
          <article>
            <h3>Some CDF values</h3>
            {[2, 4, 6, 8, 10, 12].map((v) => (
              <p key={v}>
                F({v}) = {gammaCdf(v, shape, scale).toFixed(4)} &nbsp; tail{" "}
                {(1 - gammaCdf(v, shape, scale)).toFixed(4)}
              </p>
            ))}
          </article>
          <article>
            <h3>Key properties</h3>
            <p>
              <Check size={13} /> Sum of independent exponentials is Gamma.
            </p>
            <p>
              <Check size={13} /> Memorylessness generally does not hold.
            </p>
            <p>
              <Check size={13} /> Support is positive.
            </p>
          </article>
        </section>
      </main>
      <footer>
        <button onClick={reset}>
          <RotateCcw size={14} />
          Reset lesson
        </button>
        <span>
          Previous: Exponential Distribution &nbsp; Next: Weibull Distribution
        </span>
      </footer>
    </div>
  );
}
