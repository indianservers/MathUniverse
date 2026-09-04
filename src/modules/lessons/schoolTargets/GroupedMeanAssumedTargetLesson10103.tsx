import {
  ArrowLeft,
  ArrowRight,
  Edit3,
  Minus,
  Plus,
  RotateCcw,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { type PointerEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./GroupedMeanAssumedTargetLesson10103.css";

type MeanRow = { id: number; lower: number; upper: number; frequency: number };
const defaults: MeanRow[] = [
  { id: 1, lower: 0, upper: 10, frequency: 4 },
  { id: 2, lower: 10, upper: 20, frequency: 8 },
  { id: 3, lower: 20, upper: 30, frequency: 12 },
  { id: 4, lower: 30, upper: 40, frequency: 10 },
  { id: 5, lower: 40, upper: 50, frequency: 6 },
];
const round = (value: number, places = 2) =>
  Math.round(value * 10 ** places) / 10 ** places;

export default function GroupedMeanAssumedTargetLesson10103({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [rows, setRows] = useState<MeanRow[]>(defaults);
  const [assumed, setAssumed] = useState(25);
  const [dragging, setDragging] = useState(false);
  const [editing, setEditing] = useState(false);
  const [actions, setActions] = useState(0);
  const lineRef = useRef<SVGSVGElement>(null);
  const enriched = rows.map((row) => {
    const midpoint = (row.lower + row.upper) / 2;
    const deviation = midpoint - assumed;
    return { ...row, midpoint, deviation, product: row.frequency * deviation };
  });
  const totalFrequency = enriched.reduce((sum, row) => sum + row.frequency, 0);
  const totalDeviation = enriched.reduce((sum, row) => sum + row.product, 0);
  const mean = totalFrequency ? assumed + totalDeviation / totalFrequency : 0;
  const directMean = totalFrequency
    ? enriched.reduce((sum, row) => sum + row.frequency * row.midpoint, 0) /
      totalFrequency
    : 0;
  const invariant = Math.abs(mean - directMean) < 0.0001;
  const markerX = 30 + (assumed / 50) * 580;

  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const setA = (value: number) =>
    setAssumed(Math.max(0, Math.min(50, round(value, 1))));
  const updateRow = (id: number, patch: Partial<MeanRow>) =>
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    );
  const updateMarker = (event: PointerEvent<SVGSVGElement>) => {
    const box = lineRef.current?.getBoundingClientRect();
    if (!box) return;
    const x = ((event.clientX - box.left) / box.width) * 640;
    setA(((Math.max(30, Math.min(610, x)) - 30) / 580) * 50);
  };
  const reset = () =>
    act(() => {
      setRows(defaults);
      setAssumed(25);
      setEditing(false);
    });

  return (
    <section
      className="gma10103-page"
      data-testid="school-mockup-0777"
      data-object-model="dedicated-assumed-mean-deviation-invariant-engine"
      data-assumed-mean={assumed}
      data-total-frequency={round(totalFrequency)}
      data-total-deviation={round(totalDeviation)}
      data-mean={round(mean)}
      data-direct-mean={round(directMean)}
      data-invariant={String(invariant)}
      data-actions={actions}
    >
      <header className="gma10103-hero">
        <div>
          <small>CLASS 10 · STATISTICS</small>
          <h1>Grouped Mean by Assumed Mean</h1>
          <p>
            Use a convenient assumed mean A to simplify calculations. The final
            mean stays the same for any valid A.
          </p>
          <nav>
            <span>18 min</span>
            <span>INTERMEDIATE</span>
            <span>CONCEPT</span>
            <span>statistics</span>
          </nav>
        </div>
        <button onClick={reset}>
          <RotateCcw /> Reset all
        </button>
      </header>
      <main>
        <section className="gma10103-workbench">
          <h2>
            <b>1</b> ASSUMED-MEAN WORKBENCH
          </h2>
          <p>Edit the table below. Changes update everything instantly.</p>
          <div>
            <table>
              <thead>
                <tr>
                  <th>Class interval</th>
                  <th>fᵢ</th>
                  <th>Midpoint xᵢ</th>
                  <th>Deviation dᵢ = xᵢ − A</th>
                  <th>fᵢ · dᵢ</th>
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
                    <td>{round(row.midpoint)}</td>
                    <td
                      className={
                        row.deviation < 0
                          ? "negative"
                          : row.deviation > 0
                            ? "positive"
                            : "zero"
                      }
                    >
                      {round(row.deviation)}
                    </td>
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
                  <td>Total</td>
                  <td>
                    Σfᵢ = <strong>{round(totalFrequency)}</strong>
                  </td>
                  <td />
                  <td />
                  <td>
                    Σfᵢdᵢ = <strong>{round(totalDeviation)}</strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <aside>
            <TriangleAlert />
            <p>
              <strong>
                A (assumed mean) is only a convenient reference, <i>not</i> the
                answer.
              </strong>
              <br />
              The final mean remains invariant for any choice of A.
            </p>
          </aside>
        </section>
        <section className="gma10103-model">
          <article>
            <header>
              <h2>
                <b>2</b> ASSUMED MEAN ON NUMBER LINE
              </h2>
              <div>
                <label>
                  Assumed mean A{" "}
                  {editing && (
                    <input
                      aria-label="Assumed mean"
                      type="number"
                      min="0"
                      max="50"
                      value={assumed}
                      onChange={(event) => setA(+event.target.value)}
                    />
                  )}
                </label>
                <button
                  aria-label="Decrease assumed mean"
                  onClick={() => act(() => setA(assumed - 1))}
                >
                  <Minus />
                </button>
                <strong>{assumed.toFixed(1)}</strong>
                <button
                  aria-label="Increase assumed mean"
                  onClick={() => act(() => setA(assumed + 1))}
                >
                  <Plus />
                </button>
                <button
                  aria-label="Edit assumed mean"
                  onClick={() => act(() => setEditing((value) => !value))}
                >
                  <Edit3 />
                </button>
              </div>
            </header>
            <p>Choose A. Deviations dᵢ = xᵢ − A update automatically.</p>
            <svg
              ref={lineRef}
              viewBox="0 0 640 190"
              aria-label="Assumed mean number line"
              onPointerMove={(event) => dragging && updateMarker(event)}
              onPointerUp={() => dragging && act(() => setDragging(false))}
              onPointerLeave={() => dragging && act(() => setDragging(false))}
            >
              <line className="axis" x1="30" y1="75" x2="610" y2="75" />
              {Array.from({ length: 51 }, (_, i) => (
                <line
                  key={i}
                  x1={30 + i * 11.6}
                  y1={i % 5 === 0 ? 68 : 72}
                  x2={30 + i * 11.6}
                  y2={i % 5 === 0 ? 82 : 78}
                />
              ))}
              {[0, 10, 20, 30, 40, 50].map((tick) => (
                <text key={tick} x={26 + tick * 11.6} y="98">
                  {tick}
                </text>
              ))}
              {enriched.map((row, index) => {
                const x = 30 + (row.midpoint / 50) * 580;
                return (
                  <g key={row.id} onClick={() => act(() => setA(row.midpoint))}>
                    <circle cx={x} cy="68" r="6" />
                    <text x={x - 5} y="45">
                      {round(row.midpoint)}
                    </text>
                    <path
                      className={
                        row.deviation < 0
                          ? "negative"
                          : row.deviation > 0
                            ? "positive"
                            : "zero"
                      }
                      d={`M${markerX} 86 Q${(markerX + x) / 2} ${120 + index * 8} ${x} 88`}
                    />
                    <text
                      className={
                        row.deviation < 0
                          ? "negative"
                          : row.deviation > 0
                            ? "positive"
                            : "zero"
                      }
                      x={(markerX + x) / 2 - 8}
                      y={142 + index * 7}
                    >
                      {round(row.deviation)}
                    </text>
                  </g>
                );
              })}
              <circle
                className="assumed-marker"
                cx={markerX}
                cy="75"
                r="9"
                role="slider"
                tabIndex={0}
                aria-label="Assumed mean marker"
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
            <footer>
              <span className="negative">dᵢ negative</span>
              <span>dᵢ zero</span>
              <span className="positive">dᵢ positive</span>
            </footer>
          </article>
          <article className="gma10103-result">
            <div>
              <h2>
                <b>3</b> MEAN USING ASSUMED MEAN METHOD
              </h2>
              <p>x̄ = A + Σfᵢdᵢ / Σfᵢ</p>
              <p>
                = {assumed.toFixed(1)} + {round(totalDeviation)} /{" "}
                {round(totalFrequency)}
              </p>
              <p>
                = {assumed.toFixed(1)} +{" "}
                {(totalDeviation / totalFrequency).toFixed(2)}
              </p>
              <strong>= {mean.toFixed(2)}</strong>
            </div>
            <aside>
              <h3>Mean (invariant)</h3>
              <strong>{mean.toFixed(2)}</strong>
              <p>
                The mean remains {directMean.toFixed(2)} for any valid choice of
                A.
              </p>
              <b>{invariant ? "Verified" : "Check data"}</b>
            </aside>
          </article>
        </section>
      </main>
      <nav className="gma10103-next">
        <Link to="/lessons/school/class-10/class-10-statistics-grouped-mean-by-direct-method">
          <ArrowLeft /> Grouped Mean by Direct Method
        </Link>
        <Link to="/lessons/school/class-10/class-10-statistics-grouped-mean-by-step-deviation">
          Grouped Mean by Step Deviation <ArrowRight />
        </Link>
      </nav>
      <footer className="gma10103-footer">
        <div>
          <Sparkles />
          <span>
            <b>Math Universe</b>Interactive math labs, visual proofs, NCERT
            explorations, graphing, CAS-style tools, and classroom-ready
            activities.
          </span>
        </div>
        <p>© 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</p>
      </footer>
    </section>
  );
}
