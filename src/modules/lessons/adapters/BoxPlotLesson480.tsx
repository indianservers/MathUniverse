import { useState } from "react";
import { CheckCircle2, RotateCcw, Shuffle } from "lucide-react";
import type { LessonAdapterProps } from "../types";
import { quartiles, quartilesDefault } from "./quartilesLessonModel";
import "./BoxPlotLesson480.css";
import { LessonTopicStudyBoard } from "../components/LessonTopicStudyBoard";
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
  const practiceResult = quartiles([12,14,15,17,21,23,23,24,26,28,29,31,33,34,37,40,43,46,52])!;
  const ordered = values.map((value, index) => ({value, index})).sort((a, b) => a.value - b.value);
  const span = result ? result.max - result.min || 1 : 1;
  const position = (value: number) => 45 + (value - (result?.min ?? 0)) / span * 510;
  const inliers = result ? values.filter(value => value >= result.lowerFence && value <= result.upperFence) : [];
  const low = Math.min(...inliers), high = Math.max(...inliers);
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
            {ordered.map(({value, index}, order) => (
              <input
                key={index}
                aria-label={`Box plot data value ${order + 1}`}
                value={value}
                onChange={(event) =>
                  edit(index, event.target.value)
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
          {result ? <svg viewBox="0 0 600 190" role="img" aria-label="Box plot scaled to data" data-summary={JSON.stringify(result)}>
            <line x1={position(low)} x2={position(high)} y1="90" y2="90" stroke="#2472a4" strokeWidth="3" />
            {[low, high].map((value, i) => <line key={i} x1={position(value)} x2={position(value)} y1="65" y2="115" stroke="#2472a4" strokeWidth="3" />)}
            <rect x={position(result.q1)} y="55" width={Math.max(0, position(result.q3)-position(result.q1))} height="70" fill="#cae8f5" stroke="#277ccb" strokeWidth="2" />
            <line x1={position(result.median)} x2={position(result.median)} y1="55" y2="125" stroke="#b45a12" strokeWidth="3" />
            {values.filter(value => value < result.lowerFence || value > result.upperFence).map((value, i) => <circle key={i} cx={position(value)} cy="90" r="5" fill="#b33" data-outlier={value} />)}
            {[{label:'Min',value:result.min},{label:'Q1',value:result.q1},{label:'Median',value:result.median},{label:'Q3',value:result.q3},{label:'Max',value:result.max}].map(({label,value},i) => <text key={label} x={45+i*127.5} y="165" textAnchor="middle" fontSize="13">{label}: {value}</text>)}
          </svg> : <p>Add sample data to draw a box plot.</p>}
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
                  : result && result.max - result.q3 < result.q1 - result.min ? "Left" : "Balanced"}
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
              setChecked([]);
            }}
          />
          <button
            type="button"
            onClick={() => {
              const next = [...checked];
              next[0] = practice[0].trim() !== "" && Number(practice[0]) === practiceResult.q1;
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
              setChecked([]);
            }}
          />
          <button
            type="button"
            onClick={() => {
              const next = [...checked];
              next[1] = practice[1].trim() !== "" && Number(practice[1]) === practiceResult.iqr;
              setChecked(next);
              onInteraction();
            }}
          >
            Check
          </button>
        </label>
        {checked.map((ok, index) => (
          <span role="status" key={index} className={ok ? "box480-ok" : "box480-bad"}>
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
            setValues(Array.from({length:20}, () => Math.floor(Math.random()*60)));
            onInteraction();
          }}
        >
          <Shuffle size={14} /> Randomize
        </button>
        <span>Next: Dot Plot →</span>
      </footer>
      <LessonTopicStudyBoard lessonId={480} alwaysVisible onInteraction={onInteraction} />

    </div>
  );
}
