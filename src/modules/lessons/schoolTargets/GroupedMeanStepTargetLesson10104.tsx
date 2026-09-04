import {
  AlertTriangle,
  CheckCircle2,
  Info,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import { type PointerEvent, useRef, useState } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./GroupedMeanStepTargetLesson10104.css";

type StepRow = {
  id: number;
  lower: number;
  upper: number;
  frequency: number;
  midpoint: number;
};
const defaults: StepRow[] = [
  { id: 1, lower: 0, upper: 10, frequency: 4, midpoint: 5 },
  { id: 2, lower: 10, upper: 20, frequency: 9, midpoint: 15 },
  { id: 3, lower: 20, upper: 30, frequency: 13, midpoint: 25 },
  { id: 4, lower: 30, upper: 40, frequency: 10, midpoint: 35 },
  { id: 5, lower: 40, upper: 50, frequency: 4, midpoint: 45 },
];
const round = (value: number, places = 2) =>
  Math.round(value * 10 ** places) / 10 ** places;

export default function GroupedMeanStepTargetLesson10104({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [rows, setRows] = useState<StepRow[]>(defaults);
  const [assumed, setAssumed] = useState(25);
  const [classWidth, setClassWidth] = useState(10);
  const [dragging, setDragging] = useState(false);
  const [actions, setActions] = useState(0);
  const lineRef = useRef<SVGSVGElement>(null);
  const enriched = rows.map((row) => {
    const deviation = (row.midpoint - assumed) / classWidth;
    return {
      ...row,
      deviation,
      product: row.frequency * deviation,
      width: row.upper - row.lower,
    };
  });
  const totalFrequency = enriched.reduce((sum, row) => sum + row.frequency, 0);
  const totalStep = enriched.reduce((sum, row) => sum + row.product, 0);
  const mean = totalFrequency
    ? assumed + classWidth * (totalStep / totalFrequency)
    : 0;
  const widths = enriched.map((row) => row.width);
  const equalWidth =
    widths.every((width) => Math.abs(width - widths[0]) < 0.001) &&
    Math.abs(widths[0] - classWidth) < 0.001;
  const markerX = 40 + (assumed / 50) * 560;

  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const setA = (value: number) =>
    setAssumed(Math.max(0, Math.min(50, round(value, 1))));
  const setH = (value: number) =>
    setClassWidth(Math.max(1, Math.min(25, round(value, 1))));
  const updateRow = (id: number, patch: Partial<StepRow>) =>
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    );
  const updateMarker = (event: PointerEvent<SVGSVGElement>) => {
    const box = lineRef.current?.getBoundingClientRect();
    if (!box) return;
    const x = ((event.clientX - box.left) / box.width) * 640;
    setA(((Math.max(40, Math.min(600, x)) - 40) / 560) * 50);
  };
  const reset = () =>
    act(() => {
      setRows(defaults);
      setAssumed(25);
      setClassWidth(10);
    });

  return (
    <section
      className="gms10104-page"
      data-testid="school-mockup-0778"
      data-object-model="dedicated-step-deviation-common-width-engine"
      data-assumed-mean={assumed}
      data-class-width={classWidth}
      data-total-frequency={round(totalFrequency)}
      data-total-step={round(totalStep)}
      data-mean={round(mean)}
      data-equal-width={String(equalWidth)}
      data-widths={widths.join(",")}
      data-actions={actions}
    >
      <header className="gms10104-hero">
        <small>CLASS 10 · STATISTICS</small>
        <h1>Grouped Mean by Step Deviation</h1>
        <p>
          A shortcut to find the mean of grouped data using deviation method
          with a common class width.
        </p>
        <nav>
          <span>18 min</span>
          <span>INTERMEDIATE</span>
          <span>CONCEPT</span>
          <span>statistics</span>
        </nav>
      </header>
      <main>
        <section className="gms10104-lab">
          <header>
            <div>
              <h2>
                <SlidersHorizontal /> INTERACTIVE LAB
              </h2>
              <h3>Equal-width Grouped-Data Lab</h3>
              <p>
                Enter grouped data with a common class width to use step
                deviation.
              </p>
            </div>
            <button onClick={reset}>
              <RotateCcw /> Reset lab
            </button>
          </header>
          <div className="gms10104-table">
            <table>
              <thead>
                <tr>
                  <th>Interval (Class)</th>
                  <th>fᵢ</th>
                  <th>Midpoint xᵢ</th>
                  <th>uᵢ = (xᵢ − A) / h</th>
                  <th>fᵢ · uᵢ</th>
                </tr>
              </thead>
              <tbody>
                {enriched.map((row, index) => (
                  <tr key={row.id}>
                    <td>
                      <input
                        aria-label={`Lower bound row ${index + 1}`}
                        type="number"
                        value={row.lower}
                        onChange={(event) =>
                          updateRow(row.id, { lower: +event.target.value })
                        }
                      />
                      <span>–</span>
                      <input
                        aria-label={`Upper bound row ${index + 1}`}
                        type="number"
                        value={row.upper}
                        onChange={(event) =>
                          updateRow(row.id, { upper: +event.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        aria-label={`Frequency row ${index + 1}`}
                        type="number"
                        min="0"
                        value={row.frequency}
                        onChange={(event) =>
                          updateRow(row.id, {
                            frequency: Math.max(0, +event.target.value),
                          })
                        }
                      />
                    </td>
                    <td>
                      <input
                        aria-label={`Midpoint row ${index + 1}`}
                        type="number"
                        value={row.midpoint}
                        onChange={(event) =>
                          updateRow(row.id, { midpoint: +event.target.value })
                        }
                      />
                    </td>
                    <td>{round(row.deviation)}</td>
                    <td
                      className={
                        row.product < 0
                          ? "negative"
                          : row.product > 0
                            ? "positive"
                            : "zero"
                      }
                    >
                      {round(row.product)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td>Totals</td>
                  <td>
                    Σfᵢ = <b>{round(totalFrequency)}</b>
                  </td>
                  <td />
                  <td />
                  <td>
                    Σfᵢuᵢ = <b>{round(totalStep)}</b>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <footer>
            <label>
              Assumed mean A{" "}
              <input
                aria-label="Assumed mean"
                type="number"
                min="0"
                max="50"
                value={assumed}
                onChange={(event) => setA(+event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    act(() => setA(assumed - 1));
                  }
                  if (event.key === "ArrowRight") {
                    event.preventDefault();
                    act(() => setA(assumed + 1));
                  }
                }}
              />
            </label>
            <label>
              Class width h (common){" "}
              <input
                aria-label="Common class width"
                type="number"
                min="1"
                max="25"
                value={classWidth}
                onChange={(event) => setH(+event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    act(() => setH(classWidth - 1));
                  }
                  if (event.key === "ArrowRight") {
                    event.preventDefault();
                    act(() => setH(classWidth + 1));
                  }
                }}
              />
            </label>
            <strong>
              x̄ = A + h(Σfᵢuᵢ/Σfᵢ) = {assumed} + {classWidth}({round(totalStep)}
              /{round(totalFrequency)}) = {mean.toFixed(2)}
            </strong>
          </footer>
        </section>
        <section className="gms10104-side">
          <article className="gms10104-line">
            <h2>
              Deviation Number Line <small>(in units of h)</small>
            </h2>
            <svg
              ref={lineRef}
              viewBox="0 0 640 130"
              aria-label="Step deviation number line"
              onPointerMove={(event) => dragging && updateMarker(event)}
              onPointerUp={() => dragging && act(() => setDragging(false))}
              onPointerLeave={() => dragging && act(() => setDragging(false))}
            >
              <line x1="40" y1="58" x2="600" y2="58" />
              {enriched.map((row) => {
                const x = 40 + (row.midpoint / 50) * 560;
                return (
                  <g key={row.id} onClick={() => act(() => setA(row.midpoint))}>
                    <circle cx={x} cy="58" r="6" />
                    <text x={x - 8} y="35">
                      {round(row.deviation)}
                    </text>
                    <text x={x - 5} y="85">
                      {round(row.midpoint)}
                    </text>
                  </g>
                );
              })}
              <circle
                className="gms10104-marker"
                cx={markerX}
                cy="58"
                r="9"
                role="slider"
                tabIndex={0}
                aria-label="Assumed mean step marker"
                aria-valuemin="0"
                aria-valuemax="50"
                aria-valuenow={assumed}
                onPointerDown={(event) => {
                  event.currentTarget.setPointerCapture(event.pointerId);
                  act(() => setDragging(true));
                }}
                onKeyDown={(event) => {
                  if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    act(() => setA(assumed - 1));
                  }
                  if (event.key === "ArrowRight") {
                    event.preventDefault();
                    act(() => setA(assumed + 1));
                  }
                  if (event.key === "Home") {
                    event.preventDefault();
                    act(() => setA(25));
                  }
                }}
              />
            </svg>
          </article>
          <article className="gms10104-summary">
            <h2>Live Summary</h2>
            <div>
              <span>
                Σfᵢ <b>{round(totalFrequency)}</b>
              </span>
              <span>
                Σfᵢuᵢ <b>{round(totalStep)}</b>
              </span>
              <span>
                x̄ <b>{mean.toFixed(2)}</b>
              </span>
            </div>
          </article>
          <article
            className={`gms10104-detector ${equalWidth ? "valid" : "invalid"}`}
          >
            {equalWidth ? <CheckCircle2 /> : <AlertTriangle />}
            <div>
              <header>
                <h2>Equal-Class-Width Detector</h2>
                <b>{equalWidth ? "EQUAL WIDTH" : "NOT EQUAL-WIDTH"}</b>
              </header>
              <p>
                {equalWidth
                  ? "All class widths match the common class width h. Step deviation is valid."
                  : "Class widths are not equal. Step deviation requires a common class width h."}
              </p>
              <aside>
                Detected class widths <strong>{widths.join(", ")}</strong> →{" "}
                {equalWidth ? "All equal" : "Not all equal"}
              </aside>
            </div>
          </article>
          <article className="gms10104-why">
            <Info />
            <div>
              <h3>Why a common h is required</h3>
              <p>
                The step deviation method uses uᵢ=(xᵢ−A)/h so that deviations
                are measured in the same units.
              </p>
              <p>
                If class widths differ, uᵢ would not be comparable. Hence this
                shortcut is not valid.
              </p>
            </div>
          </article>
        </section>
      </main>
    </section>
  );
}
