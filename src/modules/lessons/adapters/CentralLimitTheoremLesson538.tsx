import { Check, Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../types";
import {
  cltCheckpoints,
  simulateCentralLimit,
  type CltPopulation,
} from "./centralLimitLessonModel";
import "./CentralLimitTheoremLesson538.css";
import { LessonTopicStudyBoard } from "../components/LessonTopicStudyBoard";
export default function CentralLimitTheoremLesson538({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  return <CltActivity key={resetToken} onInteraction={onInteraction} />;
}
function CltActivity({
  onInteraction,
}: Pick<LessonAdapterProps, "onInteraction">) {
  const [population, setPopulation] = useState<CltPopulation>("exponential"),
    [n, setN] = useState(30),
    [seed, setSeed] = useState(538),
    [running, setRunning] = useState(true),
    [progress, setProgress] = useState(100),
    [answers, setAnswers] = useState([1, 2, 3]);
  const result = useMemo(
      () => simulateCentralLimit(population, n, 10000, seed),
      [n, population, seed],
    ),
    checkpoints = useMemo(
      () => cltCheckpoints(population, seed),
      [population, seed],
    );
  useEffect(() => {
    if (!running || progress >= 100) return;
    const timer = window.setInterval(
      () => setProgress((v) => Math.min(100, v + 4)),
      80,
    );
    return () => window.clearInterval(timer);
  }, [progress, running]);
  const replay = () => {
    setSeed((v) => v + 1);
    setProgress(0);
    setRunning(true);
    onInteraction();
  };
  const reset = () => {
    setPopulation("exponential");
    setN(30);
    setSeed(538);
    setRunning(true);
    setProgress(100);
    setAnswers([1, 2, 3]);
    onInteraction();
  };
  const maxBin = Math.max(1, ...result.bins),
    normalLine = Array.from({ length: 101 }, (_, i) => {
      const z = -4 + (8 * i) / 100;
      return `${5 + i * 0.9},${88 - Math.exp(-0.5 * z * z) * 70}`;
    }).join(" ");
  const questions = [
    {
      q: "Which statement best describes the Central Limit Theorem?",
      o: [
        "It makes the original data normal.",
        "The sampling distribution of the mean becomes approximately normal as n increases.",
        "It requires a normal population.",
        "It applies only to medians.",
      ],
      c: 1,
    },
    {
      q: "For mu=1 and sigma=1, what is the standard error when n=50?",
      o: ["0.050", "0.100", "0.141", "0.500"],
      c: 2,
    },
    {
      q: "If sample size doubles from n to 4n, what happens to standard error?",
      o: [
        "It stays the same.",
        "It doubles.",
        "It becomes half.",
        "It becomes one-fourth.",
      ],
      c: 3,
    },
  ];
  return (
    <div className="cl538" data-testid="inference-mockup-0501">
      <header>
        <span>DATA AND PROBABILITY &nbsp; INFERENTIAL STATISTICS</span>
        <h2>Central Limit Theorem</h2>
        <p>Observe normal approximation of sampling distributions.</p>
        <aside>
          <h3>Objective</h3>
          <p>
            Repeatedly sample from a non-normal population and see the sampling
            distribution of the mean approach normal as sample size increases.
          </p>
        </aside>
      </header>
      <nav>
        <b>Interaction + visualization</b>
        <span>Explain</span>
        <span>Examples</span>
        <span>Formulas</span>
        <span>Key Insights</span>
        <span>Assumptions</span>
      </nav>
      <main>
        <header>
          <div>
            <h3>Interaction + visualization</h3>
            <h4>Central Limit Theorem Lab</h4>
            <p>
              Sample from a non-normal population and watch sample means
              approach normality.
            </p>
          </div>
          <strong>{running ? "In progress" : "Paused"}</strong>
          <button onClick={replay}>
            <RotateCcw size={14} />
            Replay animation
          </button>
        </header>
        <section className="cl538-lab">
          <aside>
            <h3>1. Choose a population</h3>
            <select
              value={population}
              onChange={(e) => {
                setPopulation(e.target.value as CltPopulation);
                setProgress(0);
                onInteraction();
              }}
            >
              <option value="exponential">Exponential(lambda=1)</option>
              <option value="uniform">Uniform(0,2)</option>
              <option value="bernoulli">Bernoulli(p=.3)</option>
              <option value="lognormal">Lognormal(0,1)</option>
            </select>
            <svg viewBox="0 0 100 70" preserveAspectRatio="none">
              <line x1="5" y1="62" x2="96" y2="62" />
              <path
                d={
                  population === "exponential"
                    ? "M5 8 C15 25 25 44 96 61"
                    : population === "uniform"
                      ? "M8 55 L8 18 L92 18 L92 55"
                      : population === "bernoulli"
                        ? "M10 62 L10 20 M90 62 L90 45"
                        : "M5 62 C25 60 25 12 40 10 C58 12 62 55 96 62"
                }
              />
            </svg>
            <p>
              Population mean={result.mean.toFixed(3)}, SD=
              {result.sd.toFixed(3)}
            </p>
            <h3>2. Sample size (n)</h3>
            <input
              type="range"
              min="2"
              max="100"
              value={n}
              onChange={(e) => {
                setN(+e.target.value);
                setProgress(0);
                onInteraction();
              }}
            />
            <output>n={n}</output>
            <p>
              SE={result.sd.toFixed(3)}/sqrt({n})=
              {result.theoreticalSe.toFixed(4)}
            </p>
            <h3>3. Repeated sampling</h3>
            <progress max="100" value={progress} />
            <p>
              {Math.round((10000 * progress) / 100).toLocaleString()} / 10,000
            </p>
            <button onClick={() => setRunning((v) => !v)}>
              {running ? <Pause size={14} /> : <Play size={14} />}{" "}
              {running ? "Pause" : "Resume"}
            </button>
          </aside>
          <article>
            <h3>Sampling distribution of the mean, X-bar</h3>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none">
              <line x1="3" y1="88" x2="98" y2="88" />
              {result.bins.map((count, i) => (
                <rect
                  key={i}
                  x={5 + i * 2.5}
                  y={88 - (count / maxBin) * 70}
                  width="2.2"
                  height={(count / maxBin) * 70}
                />
              ))}
              <polyline points={normalLine} />
            </svg>
            <footer>
              <span>
                Population mean <b>{result.mean.toFixed(3)}</b>
              </span>
              <span>
                Population SD <b>{result.sd.toFixed(3)}</b>
              </span>
              <span>
                SE of X-bar <b>{result.theoreticalSe.toFixed(4)}</b>
              </span>
              <span>
                Mean simulated <b>{result.simulatedMean.toFixed(4)}</b>
              </span>
              <span>
                SD simulated <b>{result.simulatedSd.toFixed(4)}</b>
              </span>
            </footer>
            <p>
              The sampling distribution is approximately normal with mean mu and
              standard deviation sigma/sqrt(n).
            </p>
          </article>
        </section>
        <section className="cl538-check">
          <h3>4. Convergence checkpoints</h3>
          <div>
            {checkpoints.map((row) => (
              <button
                key={row.n}
                className={row.n === n ? "active" : ""}
                onClick={() => {
                  setN(row.n);
                  onInteraction();
                }}
              >
                <b>n={row.n}</b>
                <span>SE={row.se.toFixed(3)}</span>
                <span>Skewness={row.skewness.toFixed(3)}</span>
                <span>Excess kurtosis={row.excessKurtosis.toFixed(2)}</span>
                <strong>
                  {Math.abs(row.skewness) < 0.25
                    ? "Approximately Normal"
                    : Math.abs(row.skewness) < 0.6
                      ? "Nearly Normal"
                      : "Skewed"}
                </strong>
              </button>
            ))}
          </div>
        </section>
        <section className="cl538-theory">
          <article>
            <h3>5. Theorem at a glance</h3>
            <p>
              For independent, identically distributed observations with finite
              mean and variance:
            </p>
            <b>X-bar is approximately N(mu, sigma squared / n) for large n.</b>
            <p>
              <Check size={13} /> Mean of X-bar = mu
            </p>
            <p>
              <Check size={13} /> Standard deviation = sigma/sqrt(n)
            </p>
          </article>
          <div>
            <article>
              <h3>6. Key insight</h3>
              <p>
                No matter the original shape, the sampling distribution of the
                mean becomes normal as n grows.
              </p>
            </article>
            <article>
              <h3>7. Common misconception</h3>
              <p>
                The original population does not become normal; the theorem
                concerns sample means.
              </p>
            </article>
          </div>
        </section>
        <section className="cl538-assume">
          <h3>8. Assumptions &amp; cautions</h3>
          <p>
            Random sample, independent observations, finite mean and variance,
            and caution for very small n with extreme skew.
          </p>
        </section>
        <section className="cl538-example">
          <article>
            <h3>9. Worked example</h3>
            <p>
              Population {population}; mu={result.mean.toFixed(3)}; sigma=
              {result.sd.toFixed(3)}
            </p>
            <p>
              Sample size {n}; theoretical SE {result.theoreticalSe.toFixed(4)}
            </p>
            <p>
              Simulated mean {result.simulatedMean.toFixed(4)}; simulated SD{" "}
              {result.simulatedSd.toFixed(4)}
            </p>
            <p>
              Last sample:{" "}
              {result.lastSample
                .slice(0, 10)
                .map((v) => v.toFixed(2))
                .join(", ")}
            </p>
          </article>
          <article>
            <h3>Normal overlay check (n={n})</h3>
            <svg viewBox="0 0 100 70" preserveAspectRatio="none">
              <line x1="5" y1="62" x2="96" y2="10" />
              {result.qq.map((point, i) => (
                <circle
                  key={i}
                  cx={5 + ((point.theoretical + 3) / 6) * 90}
                  cy={62 - ((point.sample + 3) / 6) * 52}
                  r="1"
                />
              ))}
            </svg>
          </article>
        </section>
        <section className="cl538-quiz">
          <h3>10. Quick knowledge check</h3>
          {questions.map((question, i) => (
            <article key={question.q}>
              <b>
                {i + 1}. {question.q}
              </b>
              {question.o.map((option, j) => (
                <label
                  key={option}
                  className={answers[i] === j ? "selected" : ""}
                >
                  <input
                    type="radio"
                    checked={answers[i] === j}
                    onChange={() => {
                      const next = [...answers];
                      next[i] = j;
                      setAnswers(next);
                      onInteraction();
                    }}
                  />
                  {option}
                </label>
              ))}
              <strong
                className={answers[i] === question.c ? "correct" : "incorrect"}
              >
                <Check size={13} />
                {answers[i] === question.c ? "Correct" : "Try again"}
              </strong>
            </article>
          ))}
        </section>
      </main>
      <footer>
        <button onClick={reset}>
          <RotateCcw size={14} />
          Reset lesson
        </button>
        <span>
          Previous: Sampling Distributions &nbsp; Next: Confidence Interval for
          Mean
        </span>
      </footer>
      <LessonTopicStudyBoard lessonId={538} alwaysVisible onInteraction={onInteraction} />

    </div>
  );
}
