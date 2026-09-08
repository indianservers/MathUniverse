import { useState } from "react";
import { CheckCircle2, RotateCcw, Shuffle } from "lucide-react";
import type { LessonAdapterProps } from "../types";
import { quartiles, quartilesDefault } from "./quartilesLessonModel";
import "./BoxPlotLesson480.css";
export default function BoxPlotLesson480({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  return <BoxPlotActivity key={resetToken} onInteraction={onInteraction} />;
}
function BoxPlotActivity({
  onInteraction,
}: Pick<LessonAdapterProps, "onInteraction">) {
  const [values, setValues] = useState([
    2, 3, 4, 4, 5, 6, 7, 8, 20, 23, 24, 25, 30, 34, 35, 40, 42, 45, 48, 50,
  ]);
  const [practice, setPractice] = useState(["", ""]);
  const [checked, setChecked] = useState<boolean[]>([]);
  const result = quartiles(values);
  const ordered = [...values].sort((a, b) => a - b);
  function edit(index: number, raw: string) {
    const value = Number(raw);
    if (!Number.isFinite(value)) return;
    const next = [...values];
    next[index] = value;
    setValues(next);
    setChecked([]);
    onInteraction();
  }
  return (
    <div
      className="box480"
      data-testid="statistics-mockup-0443"
      data-target-family="statistics-and-regression"
    >
      <header>
        <div>
          <span className="box480-eyebrow">Data and Probability</span>
          <h2>Box Plot</h2>
          <p>Explore distributions with the five-number summary.</p>
        </div>
        <span>Level 8-10 · 20-30 min · IQR · Outliers</span>
      </header>
      <div className="box480-tabs">
        <b>Interact</b>
        <span>Learn</span>
        <span>Example</span>
        <span>Formula</span>
        <span>Practice</span>
      </div>
      <section className="box480-work">
        <div className="box480-title">
          <div>
            <b>1 &nbsp; Observe</b>
            <h3>A data set shown in order.</h3>
          </div>
          <button
            type="button"
            onClick={() => {
              setValues([...quartilesDefault]);
              onInteraction();
            }}
          >
            Use sample data
          </button>
          <button
            type="button"
            onClick={() => {
              setValues([]);
              onInteraction();
            }}
          >
            Clear
          </button>
        </div>
        <div className="box480-ordered">
          <h3>
            Ordered data <small>(n = {values.length})</small>
          </h3>
          <div>
            {ordered.map((value, index) => (
              <input
                key={`${index}-${value}`}
                aria-label={`Box plot data value ${index + 1}`}
                value={value}
                onChange={(event) =>
                  edit(values.indexOf(value), event.target.value)
                }
              />
            ))}
          </div>
          <p>
            Min = {result?.min ?? "-"} &nbsp;&nbsp; Max = {result?.max ?? "-"}
          </p>
        </div>
        <section className="box480-plot">
          <h3>2 &nbsp; Manipulate · Box plot (IQR = {result?.iqr ?? "-"})</h3>
          <div className="box480-whisker">
            <span className="bmin">
              Min
              <br />
              <b>{result?.min ?? "-"}</b>
            </span>
            <span className="bq1">
              Q1
              <br />
              <b>{result?.q1 ?? "-"}</b>
            </span>
            <span className="bmed">
              Median
              <br />
              <b>{result?.median ?? "-"}</b>
            </span>
            <span className="bq3">
              Q3
              <br />
              <b>{result?.q3 ?? "-"}</b>
            </span>
            <span className="bmax">
              Max
              <br />
              <b>{result?.max ?? "-"}</b>
            </span>
          </div>
          <div className="box480-cards">
            <span>
              Center (Median)<b>{result?.median ?? "-"}</b>
            </span>
            <span>
              Middle 50% (IQR)<b>{result?.iqr ?? "-"}</b>
            </span>
            <span>
              Spread (Range)<b>{result ? result.max - result.min : "-"}</b>
            </span>
            <span>
              Skew
              <b>
                {result && result.max - result.q3 > result.q1 - result.min
                  ? "Right"
                  : "Left"}
              </b>
            </span>
          </div>
        </section>
        <section className="box480-fences">
          <h3>Outlier fences (optional)</h3>
          <p>
            Lower fence = Q1 − 1.5×IQR: <b>{result?.lowerFence ?? "-"}</b> ·
            Upper fence = Q3 + 1.5×IQR: <b>{result?.upperFence ?? "-"}</b>
          </p>
          <p className="box480-ok">
            <CheckCircle2 size={15} /> Whiskers show the data range within the
            fences.
          </p>
        </section>
      </section>
      <div className="box480-learn">
        <section>
          <h3>Notice</h3>
          <p>
            The box shows the middle 50% of data. Whiskers extend to the
            smallest and largest values within the fences.
          </p>
        </section>
        <section>
          <h3>Rule</h3>
          <p>
            A box plot summarizes data using minimum, Q1, median, Q3 and
            maximum.
          </p>
        </section>
        <section className="box480-warning">
          <h3>Common misconception</h3>
          <p>
            The box does not show the full range. It shows the middle 50%;
            whiskers do not always end at the minimum and maximum.
          </p>
        </section>
      </div>
      <section className="box480-practice">
        <h3>5 &nbsp; Try it: build the box plot and answer</h3>
        <p>
          Data: 12, 14, 15, 17, 21, 23, 23, 24, 26, 28, 29, 31, 33, 34, 37, 40,
          43, 46, 52
        </p>
        <label>
          Q1{" "}
          <input
            aria-label="Box plot Q1 answer"
            value={practice[0]}
            onChange={(event) => {
              const next = [...practice];
              next[0] = event.target.value;
              setPractice(next);
            }}
          />
          <button
            type="button"
            onClick={() => {
              const next = [...checked];
              next[0] = Number(practice[0]) === 17;
              setChecked(next);
              onInteraction();
            }}
          >
            Check
          </button>
        </label>
        <label>
          IQR{" "}
          <input
            aria-label="Box plot IQR answer"
            value={practice[1]}
            onChange={(event) => {
              const next = [...practice];
              next[1] = event.target.value;
              setPractice(next);
            }}
          />
          <button
            type="button"
            onClick={() => {
              const next = [...checked];
              next[1] = Number(practice[1]) === 20;
              setChecked(next);
              onInteraction();
            }}
          >
            Check
          </button>
        </label>
        {checked.map((ok, index) => (
          <span key={index} className={ok ? "box480-ok" : "box480-bad"}>
            {ok ? "Correct" : "Review"}
          </span>
        ))}
      </section>
      <footer>
        <button
          type="button"
          onClick={() => {
            setValues([
              2, 3, 4, 4, 5, 6, 7, 8, 20, 23, 24, 25, 30, 34, 35, 40, 42, 45,
              48, 50,
            ]);
            setPractice(["", ""]);
            setChecked([]);
            onInteraction();
          }}
        >
          <RotateCcw size={14} /> Reset lesson
        </button>
        <button
          type="button"
          onClick={() => {
            setValues([...values].sort(() => Math.random() - 0.5));
            onInteraction();
          }}
        >
          <Shuffle size={14} /> Randomize
        </button>
        <span>Next: Dot Plot →</span>
      </footer>
    </div>
  );
}
