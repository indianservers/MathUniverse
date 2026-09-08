import { Check, RotateCcw } from "lucide-react";
import { useState } from "react";
import type { LessonAdapterProps } from "../types";
import { chiSquareIndependence } from "./chiSquareIndependenceLessonModel";
import "./ChiSquareIndependenceLesson550.css";

const defaults = [
    [45, 35],
    [50, 30],
    [35, 25],
    [25, 15],
  ],
  rowNames = ["Freshman", "Sophomore", "Junior", "Senior"],
  columnNames = ["Online: Yes", "Online: No"];
type View = "observed" | "expected" | "residuals" | "contributions";
export default function ChiSquareIndependenceLesson550({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  return (
    <IndependenceActivity key={resetToken} onInteraction={onInteraction} />
  );
}
function IndependenceActivity({
  onInteraction,
}: Pick<LessonAdapterProps, "onInteraction">) {
  const [cells, setCells] = useState(defaults),
    [alpha, setAlpha] = useState(0.05),
    [view, setView] = useState<View>("observed"),
    [highlight, setHighlight] = useState("none"),
    [answer, setAnswer] = useState(0);
  const r = chiSquareIndependence(cells, alpha),
    touch = () => onInteraction(),
    reset = () => {
      setCells(defaults);
      setAlpha(0.05);
      setView("observed");
      setHighlight("none");
      setAnswer(0);
      touch();
    };
  const update = (row: number, column: number, value: number) => {
    setCells((current) =>
      current.map((values, rowIndex) =>
        values.map((item, columnIndex) =>
          rowIndex === row && columnIndex === column
            ? Math.max(0, Math.round(value))
            : item,
        ),
      ),
    );
    touch();
  };
  const matrices = {
      observed: r.observed,
      expected: r.expected,
      residuals: r.residuals,
      contributions: r.contributions,
    },
    shown = matrices[view],
    format = (value: number) =>
      view === "observed" ? value.toFixed(0) : value.toFixed(2),
    pText = r.pValue < 0.000001 ? "< 0.000001" : r.pValue.toFixed(6),
    decision = r.reject ? "Reject H0" : "Fail to reject H0";
  return (
    <div
      className="ci550"
      data-testid="inference-mockup-0513"
      data-lesson-title="Chi-Square Independence"
    >
      <header className="ci550-hero">
        <span>DATA AND PROBABILITY &nbsp; INFERENTIAL STATISTICS</span>
        <h2>Chi-Square Test of Independence</h2>
        <p>Test whether two categorical variables are independent.</p>
        <b>Advanced</b>
        <b>Inference Lab</b>
        <b>Probability Calculator / Statistics</b>
        <button onClick={reset}>
          <RotateCcw size={14} /> Reset
        </button>
      </header>
      <nav>
        <b>Interaction + visualization</b>
        <span>Explain</span>
        <span>Examples</span>
        <span>Formulas</span>
        <span>Know more</span>
      </nav>
      <section className="ci550-intro">
        <article>
          <h3>Learning Objective</h3>
          <p>
            Determine whether two categorical variables are independent using
            the chi-square test.
          </p>
          {[
            "State hypotheses",
            "Compute expected counts",
            "Calculate chi-square and p-value",
            "Make a conclusion about association",
          ].map((step) => (
            <p key={step}>
              <Check size={13} />
              {step}
            </p>
          ))}
        </article>
        <article>
          <h3>Worked Dataset (Editable)</h3>
          <p>Survey: Grade Level by Preference for Online Learning.</p>
          <EditableTable
            cells={r.observed}
            rowTotals={r.rowTotals}
            columnTotals={r.columnTotals}
            total={r.total}
            update={update}
          />
          <small>Click any cell to edit. Totals update automatically.</small>
        </article>
      </section>
      <main>
        <header>
          <div>
            <span>CHI-SQUARE TEST ANALYSIS</span>
            <label>
              View:
              {(
                ["observed", "expected", "residuals", "contributions"] as View[]
              ).map((item) => (
                <button
                  key={item}
                  className={view === item ? "active" : ""}
                  onClick={() => {
                    setView(item);
                    touch();
                  }}
                >
                  {item}
                </button>
              ))}
            </label>
          </div>
          <label>
            Highlight
            <select
              value={highlight}
              onChange={(e) => {
                setHighlight(e.target.value);
                touch();
              }}
            >
              <option value="none">None</option>
              {rowNames.map((name, index) => (
                <option key={name} value={String(index)}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <button onClick={touch}>
            <RotateCcw size={13} /> Recalculate
          </button>
        </header>
        <section className="ci550-analysis">
          <div>
            <article>
              <h3>{view[0].toUpperCase() + view.slice(1)} Frequencies</h3>
              <ResultTable
                values={shown}
                rowTotals={r.rowTotals}
                columnTotals={r.columnTotals}
                total={r.total}
                format={format}
                highlight={highlight}
              />
            </article>
            {view !== "expected" && (
              <article>
                <h3>Expected Frequencies (hover to reveal)</h3>
                <ResultTable
                  values={r.expected}
                  rowTotals={r.rowTotals}
                  columnTotals={r.columnTotals}
                  total={r.total}
                  format={(value) => value.toFixed(2)}
                  highlight={highlight}
                />
              </article>
            )}
            <article>
              <h3>Chi-square Contribution by Cell</h3>
              <ResultTable
                values={r.contributions}
                rowTotals={r.rowTotals}
                columnTotals={r.columnTotals}
                total={r.statistic}
                format={(value) => value.toFixed(3)}
                highlight={highlight}
              />
            </article>
          </div>
          <aside>
            <article>
              <h3>Standardized Residuals = (O-E)/sqrt(E)</h3>
              <table>
                <tbody>
                  {r.residuals.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <th>{rowNames[rowIndex]}</th>
                      {row.map((value, columnIndex) => (
                        <td
                          key={columnIndex}
                          style={{
                            background:
                              value > 0
                                ? `rgba(235,67,67,${Math.min(0.8, Math.abs(value) / 3)})`
                                : `rgba(48,103,230,${Math.min(0.8, Math.abs(value) / 3)})`,
                          }}
                        >
                          {value.toFixed(2)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p>Blue: less than expected &nbsp; Red: more than expected</p>
            </article>
            <article>
              <h3>Test Summary</h3>
              <p>
                Degrees of freedom <b>{r.df}</b>
              </p>
              <p>
                Chi-square statistic <b>{r.statistic.toFixed(3)}</b>
              </p>
              <p>
                p-value <b>{pText}</b>
              </p>
              <p>
                Significance level{" "}
                <input
                  type="number"
                  min=".001"
                  max=".2"
                  step=".01"
                  value={alpha}
                  onChange={(e) => {
                    setAlpha(+e.target.value);
                    touch();
                  }}
                />
              </p>
              <p>
                Cramér&apos;s V <b>{r.cramersV.toFixed(3)}</b>
              </p>
            </article>
            <article className={r.reject ? "associated" : "independent"}>
              <h3>Conclusion</h3>
              <p>
                Since p-value {r.reject ? "<" : ">="} alpha,{" "}
                {decision.toLowerCase()}.
              </p>
              <b>{r.reject ? "Associated" : "No association established"}</b>
            </article>
          </aside>
        </section>
        <section className="ci550-insights">
          <article>
            <h3>Hypotheses</h3>
            <p>
              H0: Grade level and online-learning preference are independent.
            </p>
            <p>Ha: They are not independent.</p>
          </article>
          <article>
            <h3>Key Insight</h3>
            <p>
              Residuals show which cells contribute directionally; Cramér&apos;s
              V measures overall association strength.
            </p>
          </article>
        </section>
        <section className="ci550-guide">
          <h3>Guided Calculation</h3>
          <div>
            <article>
              <b>1. Expected Count</b>
              <p>
                E11 = ({r.rowTotals[0]} × {r.columnTotals[0]})/{r.total}
              </p>
              <strong>{r.expected[0][0].toFixed(3)}</strong>
            </article>
            <article>
              <b>2. Chi-Square Statistic</b>
              <p>Sum of all cell contributions</p>
              <strong>χ² = {r.statistic.toFixed(3)}</strong>
            </article>
            <article>
              <b>3. Degrees of Freedom</b>
              <p>
                ({r.rows}-1)({r.columns}-1)
              </p>
              <strong>df = {r.df}</strong>
            </article>
            <article>
              <b>4. p-Value</b>
              <p>Right-tail area</p>
              <strong>p = {pText}</strong>
            </article>
          </div>
        </section>
        <section className="ci550-cautions">
          <article>
            <h3>Common Misconception</h3>
            <p>
              Percentages alone can mislead. The test compares counts with
              expected variation across the entire table.
            </p>
          </article>
          <article>
            <h3>Assumptions &amp; Cautions</h3>
            <p>
              Independent observations, count data, exclusive categories, and
              expected counts generally at least 5.
            </p>
            <b>
              Minimum expected = {r.minimumExpected.toFixed(2)};{" "}
              {r.conditions.allAtLeastFive
                ? "condition met"
                : "condition needs attention"}
            </b>
          </article>
        </section>
      </main>
      <section className="ci550-quiz">
        <h3>Quick Check</h3>
        <p>
          What is the correct conclusion at alpha = {alpha.toFixed(2)} for this
          dataset?
        </p>
        {[
          r.reject
            ? "Reject H0. There is an association."
            : "Fail to reject H0. Association is not established.",
          r.reject
            ? "Fail to reject H0. Variables are independent."
            : "Reject H0. There is an association.",
          "Reject H0 because percentages differ.",
        ].map((choice, index) => (
          <button
            key={choice}
            className={
              answer === index ? (index === 0 ? "correct" : "incorrect") : ""
            }
            onClick={() => {
              setAnswer(index);
              touch();
            }}
          >
            {String.fromCharCode(65 + index)}. {choice}
          </button>
        ))}
        <aside className={answer === 0 ? "correct" : "incorrect"}>
          <Check size={14} />
          <b>{answer === 0 ? "Correct." : "Compare p-value with alpha."}</b> p ={" "}
          {pText}; {decision}.
        </aside>
      </section>
      <footer>
        <span>Previous &nbsp; Chi-Square Goodness-of-Fit</span>
        <span>Next &nbsp; Fisher&apos;s Exact Test</span>
      </footer>
    </div>
  );
}
function EditableTable({
  cells,
  rowTotals,
  columnTotals,
  total,
  update,
}: {
  cells: number[][];
  rowTotals: number[];
  columnTotals: number[];
  total: number;
  update: (r: number, c: number, v: number) => void;
}) {
  return (
    <table>
      <thead>
        <tr>
          <th>Grade Level</th>
          {columnNames.map((name) => (
            <th key={name}>{name}</th>
          ))}
          <th>Row Total</th>
        </tr>
      </thead>
      <tbody>
        {cells.map((row, rowIndex) => (
          <tr key={rowIndex}>
            <th>{rowNames[rowIndex]}</th>
            {row.map((value, columnIndex) => (
              <td key={columnIndex}>
                <input
                  aria-label={`${rowNames[rowIndex]} ${columnNames[columnIndex]}`}
                  type="number"
                  value={value}
                  onChange={(e) =>
                    update(rowIndex, columnIndex, +e.target.value)
                  }
                />
              </td>
            ))}
            <td>{rowTotals[rowIndex]}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <th>Column Total</th>
          {columnTotals.map((value, index) => (
            <th key={index}>{value}</th>
          ))}
          <th>{total}</th>
        </tr>
      </tfoot>
    </table>
  );
}
function ResultTable({
  values,
  rowTotals,
  columnTotals,
  total,
  format,
  highlight,
}: {
  values: number[][];
  rowTotals: number[];
  columnTotals: number[];
  total: number;
  format: (v: number) => string;
  highlight: string;
}) {
  return (
    <table>
      <thead>
        <tr>
          <th>Grade Level</th>
          {columnNames.map((name) => (
            <th key={name}>{name}</th>
          ))}
          <th>Row Total</th>
        </tr>
      </thead>
      <tbody>
        {values.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            className={highlight === String(rowIndex) ? "highlight" : ""}
          >
            <th>{rowNames[rowIndex]}</th>
            {row.map((value, index) => (
              <td key={index}>{format(value)}</td>
            ))}
            <td>{rowTotals[rowIndex]}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <th>Column Total</th>
          {columnTotals.map((value) => (
            <th key={value}>{value}</th>
          ))}
          <th>{format(total)}</th>
        </tr>
      </tfoot>
    </table>
  );
}
