import { Check, Minus, Plus, RotateCcw, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { LessonAdapterProps } from "../types";
import {
  defaultDistributionParameters,
  distributionCdf,
  distributionDensity,
  distributionDomain,
  distributionQuery,
  type DistributionKind,
  type DistributionParameters,
  type QueryMode,
} from "./distributionCalculatorLessonModel";
import "./DistributionCalculatorLesson516.css";
const names: Record<DistributionKind, string> = {
  normal: "Normal (Gaussian)",
  binomial: "Binomial",
  exponential: "Exponential",
};
export default function DistributionCalculatorLesson516({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  return <CalculatorActivity key={resetToken} onInteraction={onInteraction} />;
}
function CalculatorActivity({
  onInteraction,
}: Pick<LessonAdapterProps, "onInteraction">) {
  const [kind, setKind] = useState<DistributionKind>("normal"),
    [parameters, setParameters] = useState(defaultDistributionParameters),
    [mode, setMode] = useState<QueryMode>("between"),
    [a, setA] = useState(40),
    [b, setB] = useState(60),
    [symmetric, setSymmetric] = useState(false),
    [showPdf, setShowPdf] = useState(true),
    [showCdf, setShowCdf] = useState(true),
    [showGrid, setShowGrid] = useState(false),
    [actions, setActions] = useState(0),
    [answers, setAnswers] = useState([1, 0]),
    [checked, setChecked] = useState([true, true]);
  const result = useMemo(
      () => distributionQuery(kind, mode, a, b, parameters),
      [a, b, kind, mode, parameters],
    ),
    domain = distributionDomain(kind, parameters),
    samples = Array.from({ length: 101 }, (_, index) => {
      const x = domain.min + ((domain.max - domain.min) * index) / 100;
      return {
        x,
        pdf: distributionDensity(kind, x, parameters),
        cdf: distributionCdf(kind, x, parameters),
      };
    }),
    maxPdf = Math.max(...samples.map((point) => point.pdf), 0.001),
    pdfLine = samples
      .map((point, index) => `${index},${95 - (point.pdf / maxPdf) * 85}`)
      .join(" "),
    cdfLine = samples
      .map((point, index) => `${index},${95 - point.cdf * 85}`)
      .join(" ");
  const setParam = (key: keyof DistributionParameters, value: number) => {
    setParameters((current) => ({ ...current, [key]: value }));
    if (symmetric && kind === "normal") {
      const distance = Math.abs(a - (key === "mean" ? value : parameters.mean));
      setA((key === "mean" ? value : parameters.mean) - distance);
      setB((key === "mean" ? value : parameters.mean) + distance);
    }
    onInteraction();
  };
  const reset = () => {
    setKind("normal");
    setParameters(defaultDistributionParameters);
    setMode("between");
    setA(40);
    setB(60);
    setSymmetric(false);
    setShowPdf(true);
    setShowCdf(true);
    setShowGrid(false);
    setActions(0);
    setAnswers([1, 0]);
    setChecked([true, true]);
    onInteraction();
  };
  const queryText =
    mode === "between"
      ? `${result.low} ≤ X ≤ ${result.high}`
      : mode === "left"
        ? `X ≤ ${result.high}`
        : `X ≥ ${result.low}`;
  return (
    <div
      className="dc516"
      data-testid="probability-mockup-0479"
      data-target-family="probability-and-distributions"
    >
      <header className="dc516-hero">
        <span>DATA AND PROBABILITY · PROBABILITY AND DISTRIBUTIONS</span>
        <h2>Distribution Calculator</h2>
        <p>
          Explore probability distributions, visualize probabilities, and
          compute exact values.
        </p>
        <article>
          <b>Learning objective</b>
          <p>
            Visualize probability distributions, find interval or tail
            probabilities, and understand parameters.
          </p>
        </article>
        <button type="button" onClick={reset}>
          <RotateCcw size={14} />
          Reset
        </button>
      </header>
      <nav>
        <b>Interaction + visualization</b>
        <span>Explain</span>
        <span>Examples</span>
        <span>Formulas</span>
        <span>Know more</span>
      </nav>
      <section className="dc516-lab">
        <header>
          <div>
            <h3>Interaction + visualization</h3>
            <h4>Distribution Lab</h4>
          </div>
          <span>Interactive</span>
          <b>{actions} actions</b>
        </header>
        <div className="dc516-work">
          <aside>
            <h3>1. Choose distribution</h3>
            <select
              value={kind}
              onChange={(event) => {
                const next = event.target.value as DistributionKind;
                setKind(next);
                if (next === "binomial") {
                  setA(6);
                  setB(14);
                } else if (next === "exponential") {
                  setA(2);
                  setB(8);
                } else {
                  setA(40);
                  setB(60);
                }
                onInteraction();
              }}
            >
              {Object.entries(names).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <h3>Parameters</h3>
            {kind === "normal" && (
              <>
                <NumberControl
                  label="μ (mean)"
                  value={parameters.mean}
                  onChange={(value) => setParam("mean", value)}
                />
                <NumberControl
                  label="σ (std. dev.)"
                  value={parameters.sigma}
                  min={0.1}
                  onChange={(value) => setParam("sigma", Math.max(0.1, value))}
                />
              </>
            )}
            {kind === "binomial" && (
              <>
                <NumberControl
                  label="n (trials)"
                  value={parameters.n}
                  min={1}
                  onChange={(value) =>
                    setParam("n", Math.max(1, Math.round(value)))
                  }
                />
                <NumberControl
                  label="p (success)"
                  value={parameters.p}
                  min={0}
                  step={0.05}
                  onChange={(value) =>
                    setParam("p", Math.max(0, Math.min(1, value)))
                  }
                />
              </>
            )}
            {kind === "exponential" && (
              <NumberControl
                label="λ (rate)"
                value={parameters.lambda}
                min={0.01}
                step={0.05}
                onChange={(value) => setParam("lambda", Math.max(0.01, value))}
              />
            )}
            <h3>2. Interval of interest</h3>
            <fieldset>
              {(["between", "left", "right"] as QueryMode[]).map((value) => (
                <label key={value}>
                  <input
                    type="radio"
                    checked={mode === value}
                    onChange={() => {
                      setMode(value);
                      onInteraction();
                    }}
                  />
                  {value === "between"
                    ? "Between"
                    : value === "left"
                      ? "Left tail"
                      : "Right tail"}
                </label>
              ))}
            </fieldset>
            {mode !== "right" && (
              <NumberControl
                label={mode === "between" ? "a" : "x"}
                value={mode === "between" ? a : b}
                onChange={(value) =>
                  mode === "between" ? setA(value) : setB(value)
                }
              />
            )}{" "}
            {mode !== "left" && (
              <NumberControl
                label={mode === "between" ? "b" : "x"}
                value={mode === "between" ? b : a}
                onChange={(value) =>
                  mode === "between" ? setB(value) : setA(value)
                }
              />
            )}{" "}
            {kind === "normal" && (
              <label>
                <input
                  type="checkbox"
                  checked={symmetric}
                  onChange={(event) => {
                    setSymmetric(event.target.checked);
                    if (event.target.checked) {
                      const distance = Math.abs(a - parameters.mean);
                      setB(parameters.mean + distance);
                    }
                  }}
                />
                Symmetric about mean
              </label>
            )}
            <h3>3. Display options</h3>
            <label>
              <input
                type="checkbox"
                checked={showPdf}
                onChange={(event) => setShowPdf(event.target.checked)}
              />
              Show PDF
            </label>
            <label>
              <input
                type="checkbox"
                checked={showCdf}
                onChange={(event) => setShowCdf(event.target.checked)}
              />
              Show CDF
            </label>
            <label>
              <input
                type="checkbox"
                checked={showGrid}
                onChange={(event) => setShowGrid(event.target.checked)}
              />
              Show grid
            </label>
            <button
              type="button"
              onClick={() => {
                setActions((value) => value + 1);
                onInteraction();
              }}
            >
              Update visualization
            </button>
          </aside>
          <main>
            <section className="dc516-answer">
              P({queryText}) = <b>{result.probability.toFixed(4)}</b>
              <span>
                F(b) = {result.right.toFixed(4)} &nbsp; F(a) ={" "}
                {result.left.toFixed(4)}
              </span>
            </section>
            {showPdf && (
              <DistributionPlot
                title="Probability Density Function (PDF)"
                line={pdfLine}
                grid={showGrid}
                kind="pdf"
                result={result}
                domain={domain}
              />
            )}{" "}
            {showCdf && (
              <DistributionPlot
                title="Cumulative Distribution Function (CDF)"
                line={cdfLine}
                grid={showGrid}
                kind="cdf"
                result={result}
                domain={domain}
              />
            )}
            <section className="dc516-metrics">
              <p>
                Probability (area)
                <b>
                  {result.probability.toFixed(4)}
                  <small>{(result.probability * 100).toFixed(2)}%</small>
                </b>
              </p>
              <p>
                Standard score (a)<b>{result.zLow.toFixed(4)}</b>
              </p>
              <p>
                Standard score (b)<b>{result.zHigh.toFixed(4)}</b>
              </p>
              <p>
                Interpretation
                <b>
                  About {(result.probability * 100).toFixed(2)}% lies in the
                  selected region.
                </b>
              </p>
            </section>
          </main>
        </div>
      </section>
      <section className="dc516-exact">
        <article>
          <h3>Exact calculation</h3>
          <p>Formula with substitution</p>
          <strong>
            {kind === "normal"
              ? `P(${queryText}) = Φ(${result.zHigh.toFixed(2)}) − Φ(${result.zLow.toFixed(2)}) = ${result.right.toFixed(4)} − ${result.left.toFixed(4)} = ${result.probability.toFixed(4)}`
              : `P(${queryText}) = ${result.probability.toFixed(4)}`}
          </strong>
        </article>
        <aside>
          <h3>Distribution summary</h3>
          <p>{names[kind]}</p>
          {kind === "normal" && (
            <>
              <p>
                Mean μ <b>{parameters.mean}</b>
              </p>
              <p>
                Variance σ² <b>{parameters.sigma ** 2}</b>
              </p>
              <p>
                Std. deviation σ <b>{parameters.sigma}</b>
              </p>
            </>
          )}
        </aside>
      </section>
      <section className="dc516-insights">
        <article>
          <h3>Key insight</h3>
          <p>
            Probability is represented by area under the distribution curve.
          </p>
        </article>
        <article>
          <h3>Common misconception</h3>
          <p>
            Changing spread changes the curve shape, but total area remains 1.
          </p>
        </article>
        <article>
          <h3>Why this matters</h3>
          <p>
            Distribution calculations support inference, quality control, test
            scores, and risk analysis.
          </p>
        </article>
      </section>
      <section className="dc516-quiz">
        <h3>Quick knowledge check</h3>
        <div>
          {[
            {
              text: "For X ~ N(50,10²), what is P(40 ≤ X ≤ 60)?",
              options: [0.3413, 0.6827, 0.9545, 0.9973],
              correct: 1,
            },
            {
              text: "What is P(X ≤ 60) for X ~ N(50,10²)?",
              options: [0.5, 0.6827, 0.8413, 0.9772],
              correct: 2,
            },
          ].map((question, index) => (
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
                    }}
                  />
                  {String.fromCharCode(65 + optionIndex)}. {option.toFixed(4)}
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
                    <Check size={14} />
                  ) : (
                    <X size={14} />
                  )}{" "}
                  {answers[index] === question.correct
                    ? "Correct"
                    : "Not quite"}
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
          Previous: Law of Large Numbers &nbsp; Next: Probability Plot →
        </span>
      </footer>
    </div>
  );
}
function NumberControl({
  label,
  value,
  onChange,
  min = -1000,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  step?: number;
}) {
  return (
    <label className="number">
      {label}
      <span>
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - step))}
        >
          <Minus size={12} />
        </button>
        <input
          type="number"
          min={min}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <button type="button" onClick={() => onChange(value + step)}>
          <Plus size={12} />
        </button>
      </span>
    </label>
  );
}
function DistributionPlot({
  title,
  line,
  grid,
  kind,
  result,
  domain,
}: {
  title: string;
  line: string;
  grid: boolean;
  kind: "pdf" | "cdf";
  result: ReturnType<typeof distributionQuery>;
  domain: { min: number; max: number };
}) {
  const x = (value: number) =>
    ((value - domain.min) / (domain.max - domain.min)) * 100;
  return (
    <section className={`dc516-plot ${grid ? "grid" : ""}`}>
      <h3>{title}</h3>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline points={line} />
        {kind === "pdf" && (
          <polygon
            points={`${Math.max(0, x(result.low))},95 ${Math.max(0, x(result.low))},45 ${Math.min(100, x(result.high))},45 ${Math.min(100, x(result.high))},95`}
          />
        )}
        <line x1={x(result.low)} y1="10" x2={x(result.low)} y2="95" />
        <line x1={x(result.high)} y1="10" x2={x(result.high)} y2="95" />
      </svg>
    </section>
  );
}
