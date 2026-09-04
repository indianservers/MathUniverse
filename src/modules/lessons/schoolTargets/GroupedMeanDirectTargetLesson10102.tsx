import {
  AlertTriangle,
  Calculator,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { type PointerEvent, useRef, useState } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./GroupedMeanDirectTargetLesson10102.css";

type GroupRow = { id: number; lower: number; upper: number; frequency: number };
const initialRows: GroupRow[] = [
  { id: 1, lower: 0, upper: 10, frequency: 4 },
  { id: 2, lower: 10, upper: 20, frequency: 6 },
  { id: 3, lower: 20, upper: 30, frequency: 10 },
  { id: 4, lower: 30, upper: 40, frequency: 12 },
  { id: 5, lower: 40, upper: 50, frequency: 8 },
];
const round = (value: number, places = 2) =>
  Math.round(value * 10 ** places) / 10 ** places;

export default function GroupedMeanDirectTargetLesson10102({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [rows, setRows] = useState<GroupRow[]>(initialRows);
  const [selected, setSelected] = useState(4);
  const [dragging, setDragging] = useState<number | null>(null);
  const [calculated, setCalculated] = useState(true);
  const [actions, setActions] = useState(0);
  const visualRef = useRef<SVGSVGElement>(null);
  const enriched = rows.map((row) => {
    const midpoint = (row.lower + row.upper) / 2;
    return { ...row, midpoint, product: midpoint * row.frequency };
  });
  const totalFrequency = enriched.reduce((sum, row) => sum + row.frequency, 0);
  const totalProduct = enriched.reduce((sum, row) => sum + row.product, 0);
  const mean = totalFrequency ? totalProduct / totalFrequency : 0;
  const selectedRow =
    enriched.find((row) => row.id === selected) ?? enriched[0];
  const maxProduct = Math.max(1, ...enriched.map((row) => row.product));

  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const updateRow = (id: number, patch: Partial<GroupRow>) => {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    );
    setCalculated(false);
  };
  const setMidpoint = (id: number, midpoint: number) => {
    const row = rows.find((item) => item.id === id);
    if (!row) return;
    const width = Math.max(1, row.upper - row.lower);
    const center = Math.max(
      width / 2,
      Math.min(50 - width / 2, round(midpoint, 1)),
    );
    updateRow(id, {
      lower: round(center - width / 2, 1),
      upper: round(center + width / 2, 1),
    });
  };
  const updateMarker = (event: PointerEvent<SVGSVGElement>) => {
    if (dragging === null) return;
    const box = visualRef.current?.getBoundingClientRect();
    if (!box) return;
    const x = ((event.clientX - box.left) / box.width) * 640;
    setMidpoint(dragging, ((Math.max(115, Math.min(335, x)) - 115) / 220) * 50);
  };
  const addRow = () =>
    act(() => {
      const upper = Math.max(...rows.map((row) => row.upper));
      const id = Math.max(...rows.map((row) => row.id)) + 1;
      setRows((current) => [
        ...current,
        { id, lower: upper, upper: upper + 10, frequency: 1 },
      ]);
      setSelected(id);
      setCalculated(false);
    });
  const removeRow = (id: number) =>
    act(() => {
      if (rows.length <= 2) return;
      const remaining = rows.filter((row) => row.id !== id);
      setRows(remaining);
      if (selected === id) setSelected(remaining[0].id);
      setCalculated(false);
    });
  const reset = () =>
    act(() => {
      setRows(initialRows);
      setSelected(4);
      setCalculated(true);
    });

  return (
    <section
      className="gmd10102-page"
      data-testid="school-mockup-0776"
      data-object-model="dedicated-grouped-frequency-direct-mean-engine"
      data-row-count={rows.length}
      data-selected-row={selected}
      data-total-frequency={round(totalFrequency)}
      data-total-product={round(totalProduct)}
      data-mean={round(mean)}
      data-calculated={String(calculated)}
      data-actions={actions}
    >
      <header className="gmd10102-hero">
        <div>
          <small>CLASS 10 · STATISTICS</small>
          <h1>Grouped Mean by Direct Method</h1>
          <p>
            Use the Direct Method to find the mean of grouped data. Compute
            midpoints xᵢ, multiply by frequencies fᵢ, sum the products and
            divide by total frequency.
          </p>
          <nav>
            <span>16 min</span>
            <span>INTERMEDIATE</span>
            <span>CONCEPT</span>
            <span>statistics</span>
          </nav>
        </div>
        <button onClick={reset}>
          <RotateCcw /> Reset workbench
        </button>
      </header>
      <main>
        <section className="gmd10102-left">
          <div className="gmd10102-table">
            <table>
              <thead>
                <tr>
                  <th>S. No.</th>
                  <th>
                    Class Interval
                    <br />
                    (Lower – Upper)
                  </th>
                  <th>
                    Frequency
                    <br />
                    fᵢ
                  </th>
                  <th>
                    Midpoint
                    <br />
                    xᵢ = (L+U)/2
                  </th>
                  <th>
                    Product
                    <br />
                    fᵢ · xᵢ
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {enriched.map((row, index) => (
                  <tr
                    key={row.id}
                    className={selected === row.id ? "selected" : ""}
                    onClick={() => act(() => setSelected(row.id))}
                  >
                    <td>{index + 1}</td>
                    <td>
                      <input
                        aria-label={`Lower bound row ${index + 1}`}
                        type="number"
                        value={row.lower}
                        onChange={(event) =>
                          updateRow(row.id, { lower: +event.target.value })
                        }
                      />
                      <b>–</b>
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
                      <strong>{round(row.midpoint)}</strong>
                      {selected === row.id && (
                        <small>
                          = ({row.lower} + {row.upper}) / 2
                        </small>
                      )}
                    </td>
                    <td>
                      <strong>{round(row.product)}</strong>
                    </td>
                    <td>
                      <button
                        aria-label={`Remove row ${index + 1}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          removeRow(row.id);
                        }}
                      >
                        <Trash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2}>
                    <button onClick={addRow}>
                      <Plus /> Add Row
                    </button>
                  </td>
                  <td>
                    <span>Σfᵢ</span>
                    <strong>{round(totalFrequency)}</strong>
                  </td>
                  <td>Totals</td>
                  <td>
                    <span>Σfᵢxᵢ</span>
                    <strong>{round(totalProduct).toLocaleString()}</strong>
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
          <section className="gmd10102-formula">
            <article>
              <b>Direct Method Formula</b>
              <p>x̄ = Σfᵢxᵢ / Σfᵢ</p>
            </article>
            <i>→</i>
            <article>
              <b>Substitute</b>
              <p>
                x̄ = {round(totalProduct).toLocaleString()} /{" "}
                {round(totalFrequency)}
              </p>
            </article>
            <i>→</i>
            <strong>x̄ = {mean.toFixed(2)}</strong>
          </section>
          <button
            className="gmd10102-calculate"
            onClick={() => act(() => setCalculated(true))}
          >
            <Calculator /> Calculate Mean
          </button>
        </section>
        <section className="gmd10102-right">
          <header>
            <h2>
              <span>Visual:</span> Frequency-weighted accumulation of fᵢ · xᵢ
            </h2>
            <p>
              Midpoints xᵢ are centred on each class interval. Bar length = fᵢ ·
              xᵢ
            </p>
          </header>
          <svg
            ref={visualRef}
            viewBox={`0 0 640 ${100 + enriched.length * 58}`}
            aria-label="Frequency weighted midpoint visualization"
            onPointerMove={(event) => dragging !== null && updateMarker(event)}
            onPointerUp={() =>
              dragging !== null && act(() => setDragging(null))
            }
            onPointerLeave={() =>
              dragging !== null && act(() => setDragging(null))
            }
          >
            <text x="25" y="24">
              Class Interval (L – U)
            </text>
            <text x="165" y="24">
              Midpoint xᵢ
            </text>
            <text x="390" y="24">
              Frequency fᵢ
            </text>
            <text x="555" y="24">
              fᵢ · xᵢ
            </text>
            {[0, 10, 20, 30, 40, 50].map((tick) => (
              <g key={tick}>
                <text x={110 + tick * 4.4} y="45">
                  {tick}
                </text>
                <line
                  x1={115 + tick * 4.4}
                  y1="50"
                  x2={115 + tick * 4.4}
                  y2="58"
                />
              </g>
            ))}
            {enriched.map((row, index) => {
              const y = 80 + index * 58;
              const dotX =
                115 + (Math.max(0, Math.min(50, row.midpoint)) / 50) * 220;
              const barWidth = (row.product / maxProduct) * 130;
              return (
                <g
                  key={row.id}
                  className={selected === row.id ? "selected" : ""}
                  onClick={() => act(() => setSelected(row.id))}
                >
                  <line x1="115" y1={y} x2="335" y2={y} />
                  <line
                    x1={115 + (row.lower / 50) * 220}
                    y1={y - 6}
                    x2={115 + (row.lower / 50) * 220}
                    y2={y + 6}
                  />
                  <line
                    x1={115 + (row.upper / 50) * 220}
                    y1={y - 6}
                    x2={115 + (row.upper / 50) * 220}
                    y2={y + 6}
                  />
                  <text x="25" y={y + 5}>
                    {row.lower} – {row.upper}
                  </text>
                  <circle
                    className="gmd10102-marker"
                    cx={dotX}
                    cy={y}
                    r="7"
                    role="slider"
                    tabIndex={0}
                    aria-label={`Midpoint row ${index + 1}`}
                    aria-valuemin="0"
                    aria-valuemax="50"
                    aria-valuenow={row.midpoint}
                    onPointerDown={(event) => {
                      event.currentTarget.setPointerCapture(event.pointerId);
                      act(() => setDragging(row.id));
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "ArrowLeft") {
                        event.preventDefault();
                        act(() => setMidpoint(row.id, row.midpoint - 1));
                      }
                      if (event.key === "ArrowRight") {
                        event.preventDefault();
                        act(() => setMidpoint(row.id, row.midpoint + 1));
                      }
                    }}
                  />
                  <text x="405" y={y + 5}>
                    {row.frequency}
                  </text>
                  <rect x="455" y={y - 9} width={barWidth} height="18" />
                  <text x="600" y={y + 5}>
                    {round(row.product)}
                  </text>
                </g>
              );
            })}
          </svg>
          <footer>
            <span>
              Total frequency Σfᵢ = <b>{round(totalFrequency)}</b>
            </span>
            <span>
              Total Σfᵢxᵢ = <b>{round(totalProduct).toLocaleString()}</b>
            </span>
          </footer>
          <aside>
            <AlertTriangle />
            <div>
              <strong>
                Common mistake: Do NOT take the average of midpoints.
              </strong>
              <p>
                The mean depends on frequencies. Always use x̄ = Σfᵢxᵢ / Σfᵢ.
              </p>
            </div>
          </aside>
        </section>
      </main>
      <footer className="gmd10102-tip">
        ⓘ Edit any frequency or interval to see all values update live.{" "}
        {selectedRow && `Selected midpoint: ${selectedRow.midpoint}.`}
      </footer>
    </section>
  );
}
