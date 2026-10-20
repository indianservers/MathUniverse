import { InteractiveScatterPlot } from "../components/InteractiveScatterPlot";
import { useState } from "react";
import { RotateCcw } from "lucide-react";
import type { LessonAdapterProps } from "../types";
import {
  exponentialDefault,
  exponentialFit,
} from "./exponentialRegressionLessonModel";
import "./ExponentialRegressionLesson492.css";
import { LessonTopicStudyBoard } from "../components/LessonTopicStudyBoard";
export default function ExponentialRegressionLesson492({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  return <ExponentialActivity key={resetToken} onInteraction={onInteraction} />;
}
function ExponentialActivity({
  onInteraction,
}: Pick<LessonAdapterProps, "onInteraction">) {
  const [points, setPoints] = useState(exponentialDefault),
    [prediction, setPrediction] = useState(10), [practice, setPractice] = useState(false), [answer, setAnswer] = useState(""), [graded, setGraded] = useState<boolean|null>(null);
  const fit = exponentialFit(points);
  const format=(value:number,places=3)=>fit.defined && Number.isFinite(value)?value.toFixed(places):"Undefined";
  const update = (index: number, axis: "x" | "y", raw: string) => {
    const value = Number(raw);
    if (!Number.isFinite(value)) return;
    setPoints(
      points.map((point, i) =>
        i === index ? { ...point, [axis]: value } : point,
      ),
    );
    onInteraction();
  };
  return (
    <div
      className="er492"
      data-testid="statistics-mockup-0455"
      data-target-family="statistics-and-regression"
    >
      <header>
        <div>
          <span>DATA AND PROBABILITY · STATISTICS AND REGRESSION</span>
          <h2>Exponential Regression</h2>
          <p>Model multiplicative growth and decay trends: y = abˣ.</p>
        </div>
        <span>Lesson 492 · Share</span>
      </header>
      <nav>
        <b>Interact</b>
        <span>Learn</span>
        <span>Example</span>
        <span>Formula</span>
        <span>Practice</span>
      </nav>
      <section className="er492-work">
        <section className="er492-chart">
          <h3>Data & model fit</h3>
          <InteractiveScatterPlot points={points} label="Exponential regression curve" predict={fit.defined ? x => fit.a * fit.b ** x : undefined} onPointChange={(index, point) => { setPoints(points.map((old, i) => i === index ? point : old)); onInteraction(); }} positiveY />
          <p>Drag points to explore. The model updates in real time.</p>
        </section>
        <aside className="er492-model">
          <h3>Model form</h3>
          <div className="er492-equation">y = abˣ</div>
          <h3>Key results</h3>{!fit.defined && <p role="status">Use positive y values and at least two distinct x values to fit an exponential model.</p>}
          <p>
            a (initial value)<b>{format(fit.a)}</b>
          </p>
          <p>
            b (growth factor)<b>{format(fit.b)}</b>
          </p>
          <p>
            r (rate per x)<b>{format(fit.rate,2)}%</b>
          </p>
          <p>
            R²<b>{format(fit.r2,4)}</b>
          </p>
          <div className="er492-interpret">
            For each 1 unit increase in x, y is multiplied by {format(fit.b)}
            .
          </div>
          <h3>Predictions</h3>
          <label>
            x
            <input
              aria-label="Exponential prediction x"
              type="number"
              value={prediction}
              onChange={(event) => setPrediction(Number(event.target.value))}
            />
          </label>
          <strong>ŷ = {format(fit.a * fit.b ** prediction,2)}</strong>
        </aside>
        <aside className="er492-data">
          <h3>Data input</h3>
          <table>
            <thead>
              <tr>
                <th>x</th>
                <th>y</th>
              </tr>
            </thead>
            <tbody>
              {points.map((point, index) => (
                <tr key={index}>
                  <td>
                    <input
                      aria-label={`Exponential x ${index + 1}`}
                      value={point.x}
                      onChange={(event) =>
                        update(index, "x", event.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      aria-label={`Exponential y ${index + 1}`}
                      value={point.y}
                      onChange={(event) =>
                        update(index, "y", event.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            onClick={() => {
              setPoints(exponentialDefault);
              onInteraction();
            }}
          >
            <RotateCcw size={14} /> Reset
          </button>
        </aside>
      </section>
      <section className="er492-results">
        <article>
          <h3>Log-linear view</h3>
          <p>Linearize with ln(y) = ln(a) + x ln(b).</p>
          <p>ln(b) = {format(Math.log(fit.b))}</p>
        </article>
        <article>
          <h3>Residuals</h3>
          <div className="er492-residuals">
            {fit.residuals.map((value, index) => (
              <i
                key={index}
                style={{ height: `${Math.abs(value) * 6 + 3}px` }}
                title={`${value.toFixed(2)}`}
              />
            ))}
          </div>
          <p>RMSE = {format(Math.sqrt(fit.sse / points.length))}</p>
        </article>
        <article>
          <h3>Model explained</h3>
          <p>
            y = abˣ; b &gt; 1 means growth, while 0 &lt; b &lt; 1 means decay.
          </p>
        </article>
      </section>
      <section className="er492-lower">
        <article>
          <h3>Worked Example</h3>
          <p>
            Fit y = abˣ, interpret the growth rate, and predict y at x = 10.
          </p>
          <p>
            Doubling time:{" "}
            {fit.defined && fit.b > 1 ? (Math.log(2) / Math.log(fit.b)).toFixed(2) : "–"}{" "}
            units.
          </p>
        </article>
        <article>
          <h3>Common Misconception</h3>
          <p>
            Do not fit a linear model to multiplicative data. Use a log-linear
            transformation.
          </p>
        </article>
        <article>
          <h3>Key formulas</h3>
          <p>Growth rate = (b − 1) × 100%; doubling time = ln(2) / ln(b).</p>
        </article>
      </section>
      <section className="er492-practice">
        <h3>Practice · Exponential regression</h3>
        <p>
          Fit the model to a new data set, predict a value, and identify growth
          or decay.
        </p>
        <button type="button" onClick={() => {setPractice(true);setAnswer("");setGraded(null);onInteraction();}}>
          Start problem
        </button>{practice && <div><p>A model is y = 3 × 2ˣ. Predict y at x = 4.</p><label>Your prediction<input type="number" aria-label="Exponential practice prediction" value={answer} onChange={event=>{setAnswer(event.target.value);setGraded(null);onInteraction();}} /></label><button onClick={()=>{setGraded(answer.trim()!=="" && Number(answer)===48);onInteraction();}}>Check prediction</button>{graded!==null && <p role="status">{graded ? "Correct: 3 times 16 is 48." : "Try again: calculate 2 to the fourth power, then multiply by 3."}</p>}</div>}
      </section>
      <footer>
        <button
          type="button"
          onClick={() => {
            setPoints(exponentialDefault);
            onInteraction();
          }}
        >
          <RotateCcw size={14} /> Reset lesson
        </button>
        <span>
          Previous: Polynomial Regression &nbsp; Next: Logarithmic Regression →
        </span>
      </footer>
      <LessonTopicStudyBoard lessonId={492} alwaysVisible onInteraction={onInteraction} />

    </div>
  );
}
