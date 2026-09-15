import { Check, Info, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import type { LessonAdapterProps } from "../types";
import {
  bayesQuestions,
  defaultDiagnosticParameters,
  diagnosticSummary,
  questionAnswer,
  type DiagnosticParameters,
} from "./bayesTheoremLessonModel";
import "./BayesTheoremLesson512.css";
import { LessonTopicStudyBoard } from "../components/LessonTopicStudyBoard";
export default function BayesTheoremLesson512({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  return <BayesActivity key={resetToken} onInteraction={onInteraction} />;
}
function BayesActivity({
  onInteraction,
}: Pick<LessonAdapterProps, "onInteraction">) {
  const [parameters, setParameters] = useState(defaultDiagnosticParameters),
    [questionIndex, setQuestionIndex] = useState(0),
    [answer, setAnswer] = useState(3),
    [checked, setChecked] = useState(true),
    [showWhy, setShowWhy] = useState(false);
  const result = useMemo(() => diagnosticSummary(parameters), [parameters]),
    question = bayesQuestions[questionIndex],
    correct = questionAnswer(question);
  const setRate = (key: keyof DiagnosticParameters, value: number) => {
    setParameters((current) => ({ ...current, [key]: value }));
    onInteraction();
  };
  const reset = () => {
    setParameters(defaultDiagnosticParameters);
    setQuestionIndex(0);
    setAnswer(3);
    setChecked(true);
    setShowWhy(false);
    onInteraction();
  };
  const pct = (value: number) => (value * 100).toFixed(1) + "%";
  return (
    <div
      className="bt512"
      data-testid="probability-mockup-0475"
      data-target-family="probability-and-distributions"
    >
      <header className="bt512-hero">
        <h2>Bayes' Theorem</h2>
        <p>Update beliefs with new evidence.</p>
        <button type="button" onClick={reset}>
          <RotateCcw size={14} />
          Reset All
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
      </header>
      <nav aria-label="Lesson sections">
        <b>Interact</b>
        <span>Learn</span>
        <span>Example</span>
        <span>Formula</span>
        <span>Practice</span>
      </nav>
      <section className="bt512-objective">
        <b>Objective:</b> Use Bayes’ Theorem to update the probability of a
        disease (D) given a positive test (+).
        <button type="button" onClick={() => setShowWhy((value) => !value)}>
          <Info size={14} />
          How it works
        </button>
      </section>
      <section className="bt512-setup">
        <article>
          <h3>1. Set up the diagnostic test experiment</h3>
          <p>
            Population of {result.population} individuals. Adjust base rate,
            sensitivity, and specificity.
          </p>
          <div className="bt512-pop">
            <div>
              <h4>Population (N = {result.population})</h4>
              <div className="bt512-people">
                {Array.from({ length: 200 }, (_, index) => {
                  const scaled = index * 5;
                  const kind =
                    scaled < result.truePositive
                      ? "tp"
                      : scaled < result.disease
                        ? "fn"
                        : scaled < result.disease + result.falsePositive
                          ? "fp"
                          : "tn";
                  return <i key={index} className={kind} />;
                })}
              </div>
            </div>
            <aside>
              <p>
                <b>Has disease (D)</b>
                <strong>
                  {result.disease} ({pct(result.disease / result.population)})
                </strong>
              </p>
              <p>
                Test positive (+)<b>{result.truePositive}</b>
              </p>
              <p>
                Test negative (−)<b>{result.falseNegative}</b>
              </p>
              <p>
                <b>No disease (Dᶜ)</b>
                <strong>
                  {result.noDisease} (
                  {pct(result.noDisease / result.population)})
                </strong>
              </p>
              <p>
                Test positive (+)<b>{result.falsePositive}</b>
              </p>
              <p>
                Test negative (−)<b>{result.trueNegative}</b>
              </p>
            </aside>
          </div>
        </article>
        <article className="bt512-tree">
          <h3>Probability tree</h3>
          <div className="tree-root">
            <span>P(D) = {result.baseRate.toFixed(2)}</span>
            <span>P(Dᶜ) = {(1 - result.baseRate).toFixed(2)}</span>
          </div>
          <div className="tree-branches">
            <span>
              +
              <b>
                {(result.baseRate * result.sensitivity).toFixed(2)}
                <small>({result.truePositive})</small>
              </b>
            </span>
            <span>
              −
              <b>
                {(result.baseRate * (1 - result.sensitivity)).toFixed(2)}
                <small>({result.falseNegative})</small>
              </b>
            </span>
            <span>
              +
              <b>
                {((1 - result.baseRate) * (1 - result.specificity)).toFixed(2)}
                <small>({result.falsePositive})</small>
              </b>
            </span>
            <span>
              −
              <b>
                {((1 - result.baseRate) * result.specificity).toFixed(2)}
                <small>({result.trueNegative})</small>
              </b>
            </span>
          </div>
          <footer>
            P(+) = {(result.positive / result.population).toFixed(2)} &nbsp;
            P(−) = {(result.negative / result.population).toFixed(2)}
          </footer>
        </article>
      </section>
      <section className="bt512-sliders">
        <RateControl
          title="Base rate P(D)"
          description="Prevalence of disease in population."
          value={result.baseRate}
          min={0}
          onChange={(value) => setRate("baseRate", value)}
          stats={`D: ${result.disease}   Dᶜ: ${result.noDisease}`}
        />
        <RateControl
          title="Sensitivity P(+|D)"
          description="True positive rate."
          value={result.sensitivity}
          min={0.5}
          onChange={(value) => setRate("sensitivity", value)}
          stats={`TP: ${result.truePositive}   FN: ${result.falseNegative}`}
        />
        <RateControl
          title="Specificity P(−|Dᶜ)"
          description="True negative rate."
          value={result.specificity}
          min={0.5}
          onChange={(value) => setRate("specificity", value)}
          stats={`TN: ${result.trueNegative}   FP: ${result.falsePositive}`}
        />
      </section>
      <section className="bt512-middle">
        <article>
          <h3>2. Summarize outcomes in a 2×2 table</h3>
          <table>
            <thead>
              <tr>
                <th>Condition</th>
                <th>Positive (+)</th>
                <th>Negative (−)</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Has disease (D)</th>
                <td>
                  True Positive
                  <br />
                  {result.truePositive} (
                  {pct(result.truePositive / result.population)})
                </td>
                <td>
                  False Negative
                  <br />
                  {result.falseNegative}
                </td>
                <th>{result.disease}</th>
              </tr>
              <tr>
                <th>No disease (Dᶜ)</th>
                <td>
                  False Positive
                  <br />
                  {result.falsePositive}
                </td>
                <td>
                  True Negative
                  <br />
                  {result.trueNegative}
                </td>
                <th>{result.noDisease}</th>
              </tr>
              <tr>
                <th>Total</th>
                <th>{result.positive}</th>
                <th>{result.negative}</th>
                <th>{result.population}</th>
              </tr>
            </tbody>
          </table>
        </article>
        <article>
          <h3>3. Calculate using Bayes’ Theorem</h3>
          <p>Update the probability of disease given a positive test.</p>
          <strong>P(D|+) = P(+|D)P(D) / [P(+|D)P(D) + P(+|Dᶜ)P(Dᶜ)]</strong>
          <p>Substitute values:</p>
          <strong>
            {result.sensitivity.toFixed(2)} × {result.baseRate.toFixed(2)} / (
            {result.sensitivity.toFixed(2)} × {result.baseRate.toFixed(2)} +{" "}
            {(1 - result.specificity).toFixed(2)} ×{" "}
            {(1 - result.baseRate).toFixed(2)})
          </strong>
          <div>
            P(D|+) = {result.posterior.toFixed(3)}{" "}
            <b>{pct(result.posterior)} Posterior probability</b>
          </div>
        </article>
      </section>
      <section className="bt512-insight">
        <article>
          <h3>4. Result & insight</h3>
          <div
            className="bt512-gauge"
            style={{
              background: `conic-gradient(#078fa9 ${result.posterior * 360}deg,#e4e9ee 0)`,
            }}
          >
            <span>{pct(result.posterior)}</span>
          </div>
          <p>
            If a person tests positive, the probability they have the disease is{" "}
            <b>{pct(result.posterior)}</b>.<br />A strong test can still produce
            many false positives when the condition is uncommon.
          </p>
        </article>
        <article>
          <h3>Common misconception</h3>
          <b>
            “A {pct(result.sensitivity)} sensitive test means there’s a{" "}
            {pct(result.sensitivity)} chance I have the disease if I test
            positive.”
          </b>
          <p>Not quite. Sensitivity is P(+|D), not the posterior P(D|+).</p>
          <button type="button" onClick={() => setShowWhy((value) => !value)}>
            Why this matters
          </button>
          {showWhy && (
            <p className="why">
              Base rates determine how many healthy people can produce false
              positives. Bayes combines that prior information with test
              accuracy.
            </p>
          )}
        </article>
      </section>
      <section className="bt512-practice">
        <header>
          <div>
            <h3>5. Check your understanding</h3>
            <p>
              If the base rate is {pct(question.baseRate)}, sensitivity is{" "}
              {pct(question.sensitivity)}, and specificity is{" "}
              {pct(question.specificity)}, what is P(D|+)?
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const next = (questionIndex + 1) % bayesQuestions.length;
              setQuestionIndex(next);
              setAnswer(0);
              setChecked(false);
              onInteraction();
            }}
          >
            New question
          </button>
        </header>
        <div>
          {question.options.map((option, index) => (
            <label key={option} className={answer === index ? "selected" : ""}>
              <input
                type="radio"
                checked={answer === index}
                onChange={() => {
                  setAnswer(index);
                  setChecked(false);
                  onInteraction();
                }}
              />
              <i>{String.fromCharCode(65 + index)}</i>
              {pct(option)}
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
        {checked && (
          <aside
            className={
              Math.abs(question.options[answer] - correct) < 0.015
                ? "correct"
                : "incorrect"
            }
          >
            <Check size={17} />
            <p>
              <b>
                {Math.abs(question.options[answer] - correct) < 0.015
                  ? "Correct!"
                  : "Try again"}
              </b>
              <br />
              Bayes gives approximately {pct(correct)}.
            </p>
          </aside>
        )}
      </section>
      <footer>
        <button type="button" onClick={reset}>
          <RotateCcw size={14} />
          Reset lesson
        </button>
        <span>Previous: Two-Way Tables &nbsp; Next: Expected Value →</span>
      </footer>
      <LessonTopicStudyBoard lessonId={512} alwaysVisible onInteraction={onInteraction} />

    </div>
  );
}
function RateControl({
  title,
  description,
  value,
  min,
  onChange,
  stats,
}: {
  title: string;
  description: string;
  value: number;
  min: number;
  onChange: (value: number) => void;
  stats: string;
}) {
  return (
    <article>
      <h3>{title}</h3>
      <p>{description}</p>
      <input
        type="range"
        min={min}
        max="1"
        step="0.01"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <strong>{Math.round(value * 100)}%</strong>
      <b>{stats}</b>
    </article>
  );
}
