import { Check, RotateCcw } from "lucide-react";
import { useMemo, useState, type PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import {
  confidenceFromMargin,
  confidenceIntervalMean,
  generateMeanSample,
  simulateMeanIntervalCoverage,
  targetMeanSample,
} from "./confidenceMeanLessonModel";
import "./ConfidenceIntervalMeanLesson539.css";
import { LessonTopicStudyBoard } from "../components/LessonTopicStudyBoard";
export default function ConfidenceIntervalMeanLesson539({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  return (
    <MeanIntervalActivity key={resetToken} onInteraction={onInteraction} />
  );
}
function MeanIntervalActivity({
  onInteraction,
}: Pick<LessonAdapterProps, "onInteraction">) {
  const [values, setValues] = useState(targetMeanSample),
    [confidence, setConfidence] = useState(0.95),
    [known, setKnown] = useState(false),
    [knownSigma, setKnownSigma] = useState(2.5),
    [sampleSeed, setSampleSeed] = useState(539),
    [repetitions, setRepetitions] = useState(1000),
    [coverageSeed, setCoverageSeed] = useState(5391),
    [answer, setAnswer] = useState(3);
  const ci = confidenceIntervalMean(
      values,
      confidence,
      known ? knownSigma : undefined,
    ),
    coverage = useMemo(
      () =>
        simulateMeanIntervalCoverage(
          ci.n,
          confidence,
          repetitions,
          coverageSeed,
        ),
      [ci.n, confidence, coverageSeed, repetitions],
    );
  const customConfidence = ![0.9, 0.95, 0.99].includes(confidence);
  const reset = () => {
    setValues(targetMeanSample);
    setConfidence(0.95);
    setKnown(false);
    setKnownSigma(2.5);
    setSampleSeed(539);
    setRepetitions(1000);
    setCoverageSeed(5391);
    setAnswer(3);
    onInteraction();
  };
  const regenerate = () => {
    const next = sampleSeed + 1;
    setSampleSeed(next);
    setValues(generateMeanSample(next));
    onInteraction();
  };
  const drag = (event: PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect(),
      raw = 10.4 + ((event.clientX - rect.left) / rect.width) * 2.1,
      margin = Math.abs(raw - ci.mean);
    setConfidence(
      confidenceFromMargin(margin, ci.se, Math.max(1, ci.n - 1), known),
    );
    onInteraction();
  };
  const sx = (v: number) => 5 + ((v - 10.4) / 2.1) * 90;
  return (
    <div className="cm539" data-testid="inference-mockup-0502">
      <header>
        <span>DATA AND PROBABILITY &nbsp; INFERENTIAL STATISTICS</span>
        <h2>Confidence Interval for Mean</h2>
        <h3>Objective</h3>
        <p>
          Estimate a population mean using a confidence interval when the
          population standard deviation is unknown.
        </p>
        <button onClick={reset}>
          <RotateCcw size={14} />
          Reset
        </button>
      </header>
      <nav>
        <b>Interaction + Visualization</b>
        <span>Explain</span>
        <span>Examples</span>
        <span>Formulas</span>
        <span>Key Ideas</span>
        <span>Know More</span>
      </nav>
      <main>
        <header>
          <h3>Interaction Lab</h3>
          <h4>Build and explore the confidence interval</h4>
          <strong>All changes auto-saved</strong>
        </header>
        <section className="cm539-build">
          <article>
            <h3>1. Sample Data (editable)</h3>
            <p>n={values.length}</p>
            <div>
              {values.map((value, i) => (
                <input
                  key={i}
                  aria-label={`Sample ${i + 1}`}
                  type="number"
                  step=".1"
                  value={value}
                  onChange={(e) => {
                    const next = [...values];
                    next[i] = +e.target.value;
                    setValues(next);
                    onInteraction();
                  }}
                />
              ))}
            </div>
            <button onClick={regenerate}>
              <RotateCcw size={13} />
              Generate new sample
            </button>
            <aside>
              <h3>Sample Summary</h3>
              <p>
                Sample mean <b>{ci.mean.toFixed(2)}</b>
              </p>
              <p>
                Sample std. dev. <b>{ci.sd.toFixed(3)}</b>
              </p>
              <p>
                Sample size <b>{ci.n}</b>
              </p>
              <p>
                Std. error <b>{ci.se.toFixed(4)}</b>
              </p>
            </aside>
          </article>
          <article>
            <h3>2. Settings</h3>
            <label>
              Confidence level
              <select
                value={confidence}
                onChange={(e) => {
                  setConfidence(+e.target.value);
                  onInteraction();
                }}
              >
                {customConfidence && (
                  <option value={confidence}>
                    {(confidence * 100).toFixed(1)}% custom
                  </option>
                )}
                <option value=".9">90%</option>
                <option value=".95">95%</option>
                <option value=".99">99%</option>
              </select>
            </label>
            <h3>Population sigma</h3>
            <label>
              <input
                type="radio"
                checked={!known}
                onChange={() => setKnown(false)}
              />
              Unknown (use t)
            </label>
            <label>
              <input
                type="radio"
                checked={known}
                onChange={() => setKnown(true)}
              />
              Known (use z)
            </label>
            {known && (
              <input
                aria-label="Known sigma"
                type="number"
                min=".01"
                step=".1"
                value={knownSigma}
                onChange={(e) => setKnownSigma(Math.max(0.01, +e.target.value))}
              />
            )}
            <p>
              Critical value <b>{ci.critical.toFixed(3)}</b>
            </p>
          </article>
          <article>
            <h3>3. Confidence Interval (drag endpoints)</h3>
            <svg
              viewBox="0 0 100 60"
              preserveAspectRatio="none"
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                drag(e);
              }}
              onPointerMove={(e) => {
                if (e.currentTarget.hasPointerCapture(e.pointerId)) drag(e);
              }}
            >
              <line x1="4" y1="36" x2="97" y2="36" />
              <line
                className="interval"
                x1={sx(ci.lower)}
                y1="28"
                x2={sx(ci.upper)}
                y2="28"
              />
              <circle cx={sx(ci.lower)} cy="28" r="2" />
              <circle className="mean" cx={sx(ci.mean)} cy="28" r="2" />
              <circle cx={sx(ci.upper)} cy="28" r="2" />
            </svg>
            <div className="cm539-ci">
              <b>{(confidence * 100).toFixed(1)}% Confidence Interval</b>
              <strong>
                ({ci.lower.toFixed(2)}, {ci.upper.toFixed(2)})
              </strong>
              <p>
                We are {(confidence * 100).toFixed(1)}% confident that the
                interval captures the population mean.
              </p>
            </div>
          </article>
        </section>
        <section className="cm539-math">
          <article>
            <h3>4. Formula &amp; Substitution</h3>
            <b>
              Population sigma {known ? "known (use z)" : "unknown (use t)"}
            </b>
            <p>x-bar +/- critical x standard error</p>
            <p>
              {ci.mean.toFixed(2)} +/- {ci.critical.toFixed(3)} x{" "}
              {ci.se.toFixed(4)} = ({ci.lower.toFixed(2)}, {ci.upper.toFixed(2)}
              )
            </p>
          </article>
          <article>
            <h3>5. Margin of Error</h3>
            <p>
              We estimate the true mean within +/- {ci.margin.toFixed(2)} of the
              sample mean.
            </p>
            <strong>ME = {ci.margin.toFixed(2)}</strong>
            <p>Standard error {ci.se.toFixed(4)}</p>
            <p>Critical value {ci.critical.toFixed(3)}</p>
          </article>
        </section>
        <section className="cm539-coverage">
          <header>
            <div>
              <h3>6. Repeated-Interval Coverage Simulation</h3>
              <p>
                Samples of size n={ci.n} from a population with mean 11.50 and
                SD 2.50.
              </p>
            </div>
            <label>
              Number of samples
              <select
                value={repetitions}
                onChange={(e) => setRepetitions(+e.target.value)}
              >
                <option>100</option>
                <option>500</option>
                <option>1000</option>
                <option>5000</option>
              </select>
            </label>
            <button
              onClick={() => {
                setCoverageSeed((v) => v + 1);
                onInteraction();
              }}
            >
              Run Simulation
            </button>
          </header>
          <div>
            <article>
              <h3>Intervals on Number Line (first 15 shown)</h3>
              <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                <line
                  className="truth"
                  x1={sx(11.5)}
                  x2={sx(11.5)}
                  y1="3"
                  y2="96"
                />
                {coverage.intervals.slice(0, 15).map((item, i) => (
                  <g key={i}>
                    <line
                      className={item.captures ? "captured" : "missed"}
                      x1={sx(item.lower)}
                      x2={sx(item.upper)}
                      y1={8 + i * 5.7}
                      y2={8 + i * 5.7}
                    />
                    <circle cx={sx(item.mean)} cy={8 + i * 5.7} r=".8" />
                  </g>
                ))}
              </svg>
            </article>
            <article className="cm539-ring">
              <i
                style={{
                  background: `conic-gradient(#28b86b ${coverage.captureRate * 360}deg,#ef4444 0)`,
                }}
              />
              <b>{(coverage.captureRate * 100).toFixed(1)}% Coverage</b>
              <p>
                Captured {coverage.captured}; missed {coverage.missed}
              </p>
              <p>Average interval width {coverage.averageWidth.toFixed(2)}</p>
              <p>Target coverage {(confidence * 100).toFixed(1)}%</p>
            </article>
          </div>
        </section>
        <section className="cm539-notes">
          <article>
            <h3>Key Insight</h3>
            <p>
              Increasing confidence widens the interval because the critical
              value increases.
            </p>
          </article>
          <article>
            <h3>Common Misconception</h3>
            <p>
              The procedure has long-run success; the fixed true mean is not
              random.
            </p>
          </article>
          <article>
            <h3>Assumptions &amp; Caution</h3>
            <p>
              Random independent observations, approximately normal population,
              and no significant outliers.
            </p>
          </article>
          <article>
            <h3>Notation</h3>
            <p>Parameter mu; statistic x-bar; SE=s/sqrt(n).</p>
          </article>
        </section>
        <section className="cm539-quiz">
          <h3>7. Quick Knowledge Check</h3>
          <article>
            <div>
              <b>
                A sample of size 36 has x-bar=50.2 and s=6.0. Using 90%
                confidence, find the margin of error.
              </b>
              {["0.97", "1.01", "1.19", "1.69"].map((option, i) => (
                <label key={option} className={answer === i ? "selected" : ""}>
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
            <aside className={answer === 3 ? "correct" : "incorrect"}>
              <Check size={15} />
              {answer === 3 ? "Correct" : "Try again"}
              <p>ME=t*(6/sqrt(36))=1.690.</p>
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
          Previous: Central Limit Theorem &nbsp; Next: Confidence Interval for
          Proportion
        </span>
      </footer>
      <LessonTopicStudyBoard lessonId={539} alwaysVisible onInteraction={onInteraction} />

    </div>
  );
}
