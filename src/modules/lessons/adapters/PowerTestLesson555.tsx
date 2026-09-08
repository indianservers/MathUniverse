import { RotateCcw } from "lucide-react";
import { useState, type PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import {
  powerCurve,
  requiredSampleSize,
  zTestPower,
  type PowerTail,
} from "./powerTestLessonModel";
import "./PowerTestLesson555.css";

export default function PowerTestLesson555({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  return <Activity key={resetToken} onInteraction={onInteraction} />;
}
function Activity({
  onInteraction,
}: Pick<LessonAdapterProps, "onInteraction">) {
  const [tail, setTail] = useState<PowerTail>("two-sided"),
    [mu0, setMu0] = useState(100),
    [mu1, setMu1] = useState(105),
    [sigma, setSigma] = useState(10),
    [sampleSize, setSampleSize] = useState(64),
    [alpha, setAlpha] = useState(0.05),
    [targetPower, setTargetPower] = useState(0.8),
    [targetEffect, setTargetEffect] = useState(0.5),
    [answer, setAnswer] = useState("0.9793"),
    r = zTestPower(mu0, mu1, sigma, sampleSize, alpha, tail),
    curve = powerCurve(r.effectSize, sigma, alpha, tail),
    required = requiredSampleSize(targetEffect, alpha, targetPower, tail),
    touch = () => onInteraction(),
    reset = () => {
      setTail("two-sided");
      setMu0(100);
      setMu1(105);
      setSigma(10);
      setSampleSize(64);
      setAlpha(0.05);
      setTargetPower(0.8);
      setTargetEffect(0.5);
      setAnswer("0.9793");
      touch();
    };
  return (
    <div className="pw555" data-testid="inference-mockup-0518">
      <header className="pw555-hero">
        <span>DATA AND PROBABILITY &nbsp; INFERENTIAL STATISTICS</span>
        <h2>Power of a Test</h2>
        <h3>Probability of correctly rejecting a false null hypothesis.</h3>
        <div>
          <b>Advanced</b>
          <b>Inference Lab</b>
          <b>Probability Calculator / Statistics</b>
          <b>15–20 min</b>
        </div>
        <button onClick={reset}>
          <RotateCcw size={13} /> Reset
        </button>
      </header>
      <nav>
        <b>Interaction + Visualization</b>
        <span>Explain</span>
        <span>Examples</span>
        <span>Formulas</span>
        <span>Know more</span>
      </nav>
      <main>
        <header>
          <div>
            <h3>Power explorer: one-sample mean (z-test)</h3>
            <p>
              Investigate how effect size, sample size, significance level, and
              variability shape power.
            </p>
          </div>
          <b>Live updates</b>
        </header>
        <section className="pw555-explorer">
          <aside>
            <h3>Test setup</h3>
            {(["two-sided", "right", "left"] as PowerTail[]).map((value) => (
              <label key={value}>
                <input
                  type="radio"
                  checked={tail === value}
                  onChange={() => {
                    setTail(value);
                    touch();
                  }}
                />
                {value === "two-sided"
                  ? "Two-sided (μ ≠ μ0)"
                  : value === "right"
                    ? "Right-tailed (μ > μ0)"
                    : "Left-tailed (μ < μ0)"}
              </label>
            ))}
            <h3>Parameters</h3>
            <Control
              label="Null mean, μ0"
              value={mu0}
              min={80}
              max={120}
              step={1}
              set={setMu0}
              touch={touch}
            />
            <Control
              label="True mean, μ1"
              value={mu1}
              min={80}
              max={120}
              step={1}
              set={setMu1}
              touch={touch}
            />
            <Control
              label="Effect size, δ"
              value={r.effectSize}
              min={-2}
              max={2}
              step={0.05}
              set={(value) => setMu1(mu0 + value * sigma)}
              touch={touch}
            />
            <Control
              label="Sample size, n"
              value={sampleSize}
              min={10}
              max={500}
              step={1}
              set={setSampleSize}
              touch={touch}
            />
            <Control
              label="Std. deviation, σ"
              value={sigma}
              min={1}
              max={30}
              step={1}
              set={setSigma}
              touch={touch}
            />
            <label>
              Significance level, α
              <select
                value={alpha}
                onChange={(e) => {
                  setAlpha(+e.target.value);
                  touch();
                }}
              >
                <option value=".1">0.10</option>
                <option value=".05">0.05</option>
                <option value=".01">0.01</option>
                <option value=".001">0.001</option>
              </select>
            </label>
            <p className="summary">
              δ = {r.effectSize.toFixed(2)} &nbsp; n = {sampleSize} &nbsp; σ ={" "}
              {sigma} &nbsp; α = {alpha}
            </p>
          </aside>
          <article>
            <h3>Sampling distributions of X̄</h3>
            <PowerPlot
              result={r}
              onMu1={(value) => {
                setMu1(value);
                touch();
              }}
            />
            <div className="pw555-metrics">
              <Metric label="Power (1 − β)" value={r.power} />
              <Metric label="β (Type II error)" value={r.beta} />
              <Metric label="α (Type I error)" value={r.alpha} />
              <Metric label="Effect size (δ)" value={r.effectSize} />
              <Metric label="SE(X̄)" value={r.standardError} />
            </div>
          </article>
        </section>
      </main>
      <section className="pw555-planning">
        <article>
          <h3>Power curve (vs. sample size)</h3>
          <Curve points={curve} selected={sampleSize} target={targetPower} />
          <p>
            Power increases with sample size and larger absolute effect size.
          </p>
        </article>
        <article>
          <h3>Target power: find required sample size</h3>
          <Control
            label="Desired power (1 − β)"
            value={targetPower}
            min={0.5}
            max={0.99}
            step={0.01}
            set={setTargetPower}
            touch={touch}
          />
          <Control
            label="Effect size, δ"
            value={targetEffect}
            min={0.1}
            max={1.5}
            step={0.05}
            set={setTargetEffect}
            touch={touch}
          />
          <label>
            Significance level, α
            <select
              value={alpha}
              onChange={(e) => {
                setAlpha(+e.target.value);
                touch();
              }}
            >
              <option value=".1">0.10</option>
              <option value=".05">0.05</option>
              <option value=".01">0.01</option>
            </select>
          </label>
          <div className="required">
            <span>
              Required sample size (minimum)
              <strong>n = {required.sampleSize}</strong>
            </span>
            <span>
              Achieved power<strong>{required.achievedPower.toFixed(4)}</strong>
            </span>
          </div>
        </article>
      </section>
      <section className="pw555-notes">
        <article>
          <h3>Guided calculation</h3>
          <p>
            1 &nbsp; SE = {sigma} / √{sampleSize} ={" "}
            <b>{r.standardError.toFixed(3)}</b>
          </p>
          <p>
            2 &nbsp; Critical boundary ={" "}
            <b>
              {tail === "two-sided"
                ? `±${r.criticalHigh.toFixed(3)}`
                : tail === "right"
                  ? r.criticalHigh.toFixed(3)
                  : r.criticalLow.toFixed(3)}
            </b>
          </p>
          <p>
            3 &nbsp; Noncentrality = ({mu1} − {mu0}) /{" "}
            {r.standardError.toFixed(3)} = <b>{r.noncentrality.toFixed(3)}</b>
          </p>
          <p>
            4 &nbsp; Power = <b>{r.power.toFixed(4)}</b>
          </p>
        </article>
        <article>
          <h3>Key Insight</h3>
          <p>
            Power rises with larger effect size, larger sample size, lower
            variability, or a more liberal alpha.
          </p>
          <table>
            <tbody>
              <tr>
                <td>↑ Effect size</td>
                <td>Strongly increases</td>
              </tr>
              <tr>
                <td>↑ Sample size</td>
                <td>Strongly increases</td>
              </tr>
              <tr>
                <td>↓ Variability</td>
                <td>Increases</td>
              </tr>
              <tr>
                <td>↑ α</td>
                <td>Increases</td>
              </tr>
            </tbody>
          </table>
        </article>
        <article>
          <h3>Common misconception</h3>
          <p>
            Failing to reject H0 does not prove it true. A non-significant
            result may reflect low power.
          </p>
          <h3>Assumptions &amp; cautions</h3>
          <p>
            Independent random sample; population approximately normal or n ≥
            30; known σ for this z-test.
          </p>
        </article>
      </section>
      <section className="pw555-quiz">
        <h3>Quick check</h3>
        <p>
          With the current parameters, what is the power? Round to four decimal
          places.
        </p>
        <input
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            touch();
          }}
        />
        <b
          className={
            Math.abs(+answer - r.power) < 0.00011 ? "correct" : "incorrect"
          }
        >
          {Math.abs(+answer - r.power) < 0.00011
            ? "Correct!"
            : `Current answer: ${r.power.toFixed(4)}`}
        </b>
      </section>
    </div>
  );
}
function Control({
  label,
  value,
  min,
  max,
  step,
  set,
  touch,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  set: (value: number) => void;
  touch: () => void;
}) {
  return (
    <label>
      {label}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => {
          set(+e.target.value);
          touch();
        }}
      />
      <input
        type="number"
        step={step}
        value={+value.toFixed(4)}
        onChange={(e) => {
          set(+e.target.value);
          touch();
        }}
      />
    </label>
  );
}
function Metric({ label, value }: { label: string; value: number }) {
  return (
    <span>
      <small>{label}</small>
      <b>{value.toFixed(value >= 10 ? 3 : 4)}</b>
    </span>
  );
}
function PowerPlot({
  result,
  onMu1,
}: {
  result: ReturnType<typeof zTestPower>;
  onMu1: (value: number) => void;
}) {
  const min = result.mu0 - 4 * result.standardError,
    max =
      result.mu0 +
      Math.max(
        4 * result.standardError,
        result.mu1 - result.mu0 + 4 * result.standardError,
      ),
    sx = (x: number) => 25 + ((x - min) / (max - min)) * 720,
    sy = (x: number, mean: number) =>
      245 - Math.exp(-(((x - mean) / result.standardError) ** 2) / 2) * 175,
    curve = (mean: number) =>
      Array.from({ length: 161 }, (_, i) => {
        const x = min + (i / 160) * (max - min);
        return `${sx(x)},${sy(x, mean)}`;
      }).join(" "),
    criticalMean = (z: number) => result.mu0 + z * result.standardError,
    drag = (event: PointerEvent<SVGSVGElement>) => {
      if (event.buttons !== 1 && event.type === "pointermove") return;
      const rect = event.currentTarget.getBoundingClientRect(),
        value =
          min +
          Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)) *
            (max - min);
      onMu1(Math.round(value * 10) / 10);
    };
  return (
    <svg
      viewBox="0 0 770 285"
      role="img"
      aria-label="Null and alternative sampling distributions"
      onPointerDown={drag}
      onPointerMove={drag}
    >
      <line className="axis" x1="20" x2="750" y1="245" y2="245" />
      <polyline className="null" points={curve(result.mu0)} />
      <polyline className="alt" points={curve(result.mu1)} />
      {Number.isFinite(result.criticalLow) && (
        <line
          className="critical"
          x1={sx(criticalMean(result.criticalLow))}
          x2={sx(criticalMean(result.criticalLow))}
          y1="30"
          y2="245"
        />
      )}
      {Number.isFinite(result.criticalHigh) && (
        <line
          className="critical"
          x1={sx(criticalMean(result.criticalHigh))}
          x2={sx(criticalMean(result.criticalHigh))}
          y1="30"
          y2="245"
        />
      )}
      <text x="30" y="20">
        Null H0: μ = {result.mu0}
      </text>
      <text x="530" y="20">
        Alternative H1: μ = {result.mu1}
      </text>
      <text x="385" y="275" textAnchor="middle">
        Sampling mean X̄ — drag to change μ1
      </text>
    </svg>
  );
}
function Curve({
  points,
  selected,
  target,
}: {
  points: ReturnType<typeof powerCurve>;
  selected: number;
  target: number;
}) {
  const sx = (n: number) => 35 + ((n - 10) / 190) * 700,
    sy = (p: number) => 245 - p * 210,
    poly = points.map((p) => `${sx(p.sampleSize)},${sy(p.power)}`).join(" ");
  return (
    <svg viewBox="0 0 770 275" role="img" aria-label="Power versus sample size">
      <line
        x1="30"
        x2="750"
        y1={sy(target)}
        y2={sy(target)}
        className="target"
      />
      <polyline points={poly} />
      {points.map((p) => (
        <circle
          key={p.sampleSize}
          cx={sx(p.sampleSize)}
          cy={sy(p.power)}
          r={p.sampleSize === selected ? 7 : 4}
        />
      ))}
    </svg>
  );
}
