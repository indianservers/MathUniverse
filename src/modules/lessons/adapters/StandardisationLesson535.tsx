import { Check, Play, RotateCcw } from "lucide-react";
import { useState, type PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import {
  standardisationAnalysis,
  standardisationTable,
} from "./standardisationLessonModel";
import "./StandardisationLesson535.css";
import { LessonTopicStudyBoard } from "../components/LessonTopicStudyBoard";
export default function StandardisationLesson535({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  return (
    <StandardisationActivity key={resetToken} onInteraction={onInteraction} />
  );
}
function StandardisationActivity({
  onInteraction,
}: Pick<LessonAdapterProps, "onInteraction">) {
  const [mean, setMean] = useState(50),
    [sigma, setSigma] = useState(10),
    [value, setValue] = useState(65),
    [animating, setAnimating] = useState(false),
    [answers, setAnswers] = useState([1, 0, 1, 2]);
  const result = standardisationAnalysis(value, mean, sigma),
    rows = standardisationTable(mean, sigma, value),
    rawMin = mean - 3 * sigma,
    rawMax = mean + 3 * sigma;
  const rawPath = bellPath(rawMin, rawMax, mean, sigma),
    standardPath = bellPath(-3, 3, 0, 1);
  const drag = (event: PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setValue(
      rawMin +
        Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)) *
          (rawMax - rawMin),
    );
    onInteraction();
  };
  const reset = () => {
    setMean(50);
    setSigma(10);
    setValue(65);
    setAnimating(false);
    setAnswers([1, 0, 1, 2]);
    onInteraction();
  };
  const questions = [
    {
      q: "If mu=50, sigma=10 and x=60, what is z?",
      o: ["0.50", "1.00", "1.50", "2.00"],
      c: 1,
    },
    {
      q: "For z=-1.20, what is P(Z<=z)?",
      o: ["0.1151", "0.8849", "0.2301", "0.7699"],
      c: 0,
    },
    {
      q: "If P(X<=x)=0.8413, what is z?",
      o: ["0.84", "1.00", "1.28", "1.64"],
      c: 1,
    },
    {
      q: "If z=2, mu=50, sigma=10, what is x?",
      o: ["60", "65", "70", "72"],
      c: 2,
    },
  ];
  return (
    <div className="sd535" data-testid="probability-mockup-0498">
      <header>
        <span>DATA AND PROBABILITY &nbsp; PROBABILITY AND DISTRIBUTIONS</span>
        <h2>Standardisation</h2>
        <p>Convert to standard normal units.</p>
        <button onClick={reset}>
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
      <main>
        <header>
          <h3>Interaction + visualization</h3>
          <h4>Map raw observations (x) to standard normal (z)</h4>
          <p>
            Adjust mean, standard deviation, and observation to see the
            transformation.
          </p>
        </header>
        <section className="sd535-controls">
          <label>
            Population mean (mu)<b>{mean}</b>
            <input
              type="range"
              min="0"
              max="100"
              value={mean}
              onChange={(e) => {
                setMean(+e.target.value);
                onInteraction();
              }}
            />
          </label>
          <label>
            Population std. dev. (sigma)<b>{sigma}</b>
            <input
              type="range"
              min="1"
              max="30"
              value={sigma}
              onChange={(e) => {
                setSigma(+e.target.value);
                onInteraction();
              }}
            />
          </label>
          <label>
            Observation (x)<b>{value.toFixed(1)}</b>
            <input
              type="range"
              min={rawMin}
              max={rawMax}
              step=".1"
              value={value}
              onChange={(e) => {
                setValue(+e.target.value);
                onInteraction();
              }}
            />
          </label>
        </section>
        <section className={`sd535-map ${animating ? "animating" : ""}`}>
          <Bell
            title="Raw scale X ~ N(mu,sigma)"
            subtitle={`mu=${mean}, sigma=${sigma}`}
            line={rawPath}
            marker={((value - rawMin) / (rawMax - rawMin)) * 90 + 5}
            label={`Raw value x = ${value.toFixed(2)}`}
            drag={drag}
          />
          <article className="sd535-transform">
            <h3>Transformation</h3>
            <b>z = (x - mu) / sigma</b>
            <p>
              z = ({value.toFixed(1)} - {mean}) / {sigma}
            </p>
            <strong>z = {result.z.toFixed(2)}</strong>
            <hr />
            <p>Reversible</p>
            <b>x = mu + z sigma</b>
            <p>
              x = {mean} + ({result.z.toFixed(2)})({sigma})
            </p>
            <strong>x = {value.toFixed(2)}</strong>
          </article>
          <Bell
            title="Standard scale Z ~ N(0,1)"
            subtitle="mu=0, sigma=1"
            line={standardPath}
            marker={((result.z + 3) / 6) * 90 + 5}
            label={`Mapped z = ${result.z.toFixed(2)}`}
          />
        </section>
        <section className="sd535-percent">
          <h3>Percentile (area) is preserved</h3>
          <article>
            Raw scale probability
            <b>
              P(X &lt;= {value.toFixed(0)}) = {result.percentile.toFixed(5)}
            </b>
          </article>
          <strong>=</strong>
          <article>
            Standard scale probability
            <b>
              P(Z &lt;= {result.z.toFixed(2)}) = {result.percentile.toFixed(5)}
            </b>
          </article>
          <i
            style={{
              background: `conic-gradient(#793fe0 ${result.percentile * 360}deg,#e8edf3 0)`,
            }}
          />
          <aside>
            Percentile<b>{(result.percentile * 100).toFixed(2)}nd</b>
            <span>Top {(result.upperTail * 100).toFixed(2)}%</span>
          </aside>
        </section>
        <section className="sd535-table">
          <h3>Value mapping table (point-by-point)</h3>
          <table>
            <thead>
              <tr>
                <th>Percentile</th>
                <th>P</th>
                <th>Raw scale x</th>
                <th>z-score</th>
                <th>Check (x=mu+z sigma)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={`${row.probability}-${i}`}
                  className={i === 4 ? "current" : ""}
                >
                  <td>
                    {i === 4
                      ? `${(row.probability * 100).toFixed(2)}nd (Current)`
                      : i === 2
                        ? "50th (Median)"
                        : `${(row.probability * 100).toFixed(0)}th`}
                  </td>
                  <td>{row.probability.toFixed(5)}</td>
                  <td>{row.raw.toFixed(2)}</td>
                  <td>{row.z.toFixed(3)}</td>
                  <td>
                    {mean}+({row.z.toFixed(3)})({sigma})={row.raw.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="sd535-notes">
          <article>
            <h3>Key insight</h3>
            <p>
              Standardisation changes the scale but not the percentile or
              ordering.
            </p>
          </article>
          <article>
            <h3>Common misconception</h3>
            <p>
              It does not change probability; it is a linear transformation.
            </p>
          </article>
          <article>
            <h3>Assumptions &amp; caution</h3>
            <p>The population is approximately normal and sigma is positive.</p>
          </article>
        </section>
        <section className="sd535-walk">
          <h3>Formula walkthrough</h3>
          <button
            onClick={() => {
              setAnimating((v) => !v);
              onInteraction();
            }}
          >
            <Play size={14} />
            {animating ? "Stop animation" : "Animate transformation"}
          </button>
          <p>1. Convert to z-score: z=(x-mu)/sigma</p>
          <p>2. Use the standard normal CDF.</p>
          <p>3. Convert back: x=mu+z sigma.</p>
        </section>
        <section className="sd535-quiz">
          <h3>Quick knowledge check</h3>
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
                  {String.fromCharCode(65 + j)}. {option}
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
          Previous: Weibull Distribution &nbsp; Next: Distribution Simulation
        </span>
      </footer>
      <LessonTopicStudyBoard lessonId={535} alwaysVisible onInteraction={onInteraction} />

    </div>
  );
}
function bellPath(min: number, max: number, mean: number, sigma: number) {
  return Array.from({ length: 101 }, (_, i) => {
    const x = min + ((max - min) * i) / 100,
      y = Math.exp(-0.5 * ((x - mean) / sigma) ** 2);
    return `${5 + i * 0.9},${88 - y * 68}`;
  }).join(" ");
}
function Bell({
  title,
  subtitle,
  line,
  marker,
  label,
  drag,
}: {
  title: string;
  subtitle: string;
  line: string;
  marker: number;
  label: string;
  drag?: (e: PointerEvent<SVGSVGElement>) => void;
}) {
  return (
    <article className="sd535-bell">
      <h3>{title}</h3>
      <p>{subtitle}</p>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        onPointerDown={
          drag
            ? (e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                drag(e);
              }
            : undefined
        }
        onPointerMove={
          drag
            ? (e) => {
                if (e.currentTarget.hasPointerCapture(e.pointerId)) drag(e);
              }
            : undefined
        }
      >
        <line x1="3" y1="88" x2="98" y2="88" />
        <polyline points={line} />
        <line className="marker" x1={marker} x2={marker} y1="18" y2="90" />
        <circle cx={marker} cy="88" r="1.7" />
      </svg>
      <b>{label}</b>
    </article>
  );
}
