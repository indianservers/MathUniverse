import { Eye, Grip, Lightbulb, RotateCcw } from "lucide-react";
import { type PointerEvent, useRef, useState } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./MoreThanOgiveTargetLesson10108.css";

type Row = { id: number; boundary: number; frequency: number };
const defaults: Row[] = [
  { id: 1, boundary: 0, frequency: 4 },
  { id: 2, boundary: 10, frequency: 6 },
  { id: 3, boundary: 20, frequency: 8 },
  { id: 4, boundary: 30, frequency: 7 },
  { id: 5, boundary: 40, frequency: 5 },
];
const round = (value: number) => Number(value.toFixed(1));

export default function MoreThanOgiveTargetLesson10108({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [rows, setRows] = useState(defaults);
  const [guide, setGuide] = useState(true);
  const [mode, setMode] = useState<"table" | "graph">("graph");
  const [dragging, setDragging] = useState<number | null>(null);
  const [actions, setActions] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const total = rows.reduce((sum, row) => sum + row.frequency, 0);
  let remaining = total;
  const points = rows.map((row) => ({
    ...row,
    cf: (remaining -= row.id === 1 ? 0 : rows[row.id - 2].frequency),
  }));
  points.push({
    id: rows.length + 1,
    boundary: (rows.at(-1)?.boundary ?? 0) + 10,
    frequency: 0,
    cf: 0,
  });
  const half = total / 2;
  const crossing = points.findIndex((point) => point.cf <= half);
  const right = points[Math.max(1, crossing)];
  const left = points[Math.max(0, crossing - 1)];
  const median =
    left && right
      ? round(
          left.boundary +
            ((left.cf - half) / Math.max(1, left.cf - right.cf)) *
              (right.boundary - left.boundary),
        )
      : 0;
  const maxBoundary = points.at(-1)?.boundary ?? 50;
  const sx = (x: number) => 55 + (x / maxBoundary) * 560;
  const sy = (cf: number) => 275 - (cf / Math.max(35, total)) * 220;
  const path = points
    .map(
      (point, index) =>
        `${index ? "L" : "M"}${sx(point.boundary)},${sy(point.cf)}`,
    )
    .join(" ");
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const setFrequency = (id: number, value: number) =>
    setRows((current) =>
      current.map((row) =>
        row.id === id
          ? { ...row, frequency: Math.max(0, Math.min(20, Math.round(value))) }
          : row,
      ),
    );
  const dragPoint = (
    event: PointerEvent<SVGCircleElement>,
    pointId: number,
  ) => {
    if (dragging !== pointId || pointId > rows.length || !svgRef.current)
      return;
    const rect = svgRef.current.getBoundingClientRect();
    const y = ((event.clientY - rect.top) / rect.height) * 330;
    const desiredCf = ((275 - y) / 220) * Math.max(35, total);
    const previousCf = points[pointId - 2]?.cf ?? total;
    setFrequency(pointId, previousCf - desiredCf);
  };
  const reset = () =>
    act(() => {
      setRows(defaults);
      setGuide(true);
      setMode("graph");
      setDragging(null);
    });

  return (
    <section
      className="mto10108-page"
      data-testid="school-mockup-0782"
      data-object-model="dedicated-more-than-ogive-descending-median-engine"
      data-frequencies={rows.map((row) => row.frequency).join(",")}
      data-more-than={points.map((point) => point.cf).join(",")}
      data-total={total}
      data-half={half}
      data-median={median}
      data-guide={String(guide)}
      data-mode={mode}
      data-actions={actions}
    >
      <header className="mto10108-hero">
        <small>CLASS 10 · STATISTICS</small>
        <h1>More-Than Ogive</h1>
        <p>
          More-Than Ogive is a school mathematical idea in Statistics. It helps
          students model data, functions, curves, proofs, and 3D directions. We
          use related ideas in graphs, design, surveys, navigation, and
          measurement.
        </p>
        <nav>
          <span>18 min</span>
          <span>INTERMEDIATE</span>
          <span>CONCEPT</span>
          <span>statistics</span>
        </nav>
      </header>
      <main className="mto10108-lab">
        <header>
          <div>
            <small>☷ INTERACTIVE LAB</small>
            <h2>Data &amp; More-Than Ogive lab</h2>
            <p>
              Edit the table or drag the plotted points. The ogive updates live.
              Read the median from the curve.
            </p>
          </div>
          <button onClick={reset}>
            <RotateCcw /> Reset lab
          </button>
        </header>
        <div className="mto10108-workspace">
          <section className="mto10108-table">
            <h3>
              DATA TABLE <span>(More-Than Cumulative Frequencies)</span>
            </h3>
            <table>
              <thead>
                <tr>
                  <th>Lower class boundary (x)</th>
                  <th>Frequency (f)</th>
                  <th>More-than c.f. (Nₓ)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={row.id}>
                    <td>
                      <input
                        aria-label={`Lower boundary row ${row.id}`}
                        type="number"
                        value={row.boundary}
                        onChange={(event) =>
                          act(() =>
                            setRows((current) =>
                              current.map((item) =>
                                item.id === row.id
                                  ? {
                                      ...item,
                                      boundary: Number(event.target.value),
                                    }
                                  : item,
                              ),
                            ),
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        aria-label={`Frequency row ${row.id}`}
                        type="number"
                        min="0"
                        max="20"
                        value={row.frequency}
                        onChange={(event) =>
                          act(() =>
                            setFrequency(row.id, Number(event.target.value)),
                          )
                        }
                      />
                    </td>
                    <td>
                      <b>{points[index].cf}</b>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td>Total (N)</td>
                  <td>{total}</td>
                  <td>N = {total}</td>
                </tr>
              </tfoot>
            </table>
            <aside>
              <Lightbulb />
              <div>
                <b>Why does the curve start at N?</b>
                <p>
                  At the smallest lower class boundary (0), all observations are
                  “more than or equal to 0”. Hence the curve starts at total N.
                </p>
              </div>
            </aside>
          </section>
          <section className="mto10108-chart">
            <header>
              <h3>
                MORE-THAN OGIVE <span>(Drag points or edit table)</span>
              </h3>
              <button
                aria-pressed={mode === "table"}
                onClick={() =>
                  act(() => setMode(mode === "graph" ? "table" : "graph"))
                }
              >
                {mode === "graph" ? "Focus table" : "Focus graph"} ⇄
              </button>
              <button onClick={() => act(() => setGuide(!guide))}>
                <Eye /> Guide
              </button>
            </header>
            <div className="mto10108-plot">
              <svg
                ref={svgRef}
                viewBox="0 0 650 330"
                aria-label="Interactive more-than ogive"
              >
                <g className="grid">
                  {[0, 5, 10, 15, 20, 25, 30, 35].map((value) => (
                    <line
                      key={value}
                      x1="55"
                      y1={sy(value)}
                      x2="625"
                      y2={sy(value)}
                    />
                  ))}
                </g>
                <line x1="55" y1="275" x2="630" y2="275" />
                <line x1="55" y1="280" x2="55" y2="45" />
                <path d={path} />
                {guide && (
                  <g className="guide">
                    <line x1="55" y1={sy(half)} x2={sx(median)} y2={sy(half)} />
                    <line
                      x1={sx(median)}
                      y1={sy(half)}
                      x2={sx(median)}
                      y2="275"
                    />
                    <text x="70" y={sy(half) - 8}>
                      N/2 = {half}
                    </text>
                  </g>
                )}
                {points.map((point) => (
                  <g key={point.id}>
                    <circle
                      role="slider"
                      tabIndex={0}
                      aria-label={`More-than point ${point.id}`}
                      aria-valuemin="0"
                      aria-valuemax={total}
                      aria-valuenow={point.cf}
                      cx={sx(point.boundary)}
                      cy={sy(point.cf)}
                      r="6"
                      onPointerDown={(event) => {
                        event.currentTarget.setPointerCapture(event.pointerId);
                        act(() => setDragging(point.id));
                      }}
                      onPointerMove={(event) => dragPoint(event, point.id)}
                      onPointerUp={() =>
                        dragging && act(() => setDragging(null))
                      }
                      onKeyDown={(event) => {
                        if (point.id <= rows.length && event.key === "ArrowUp")
                          act(() =>
                            setFrequency(
                              point.id,
                              rows[point.id - 1].frequency - 1,
                            ),
                          );
                        if (
                          point.id <= rows.length &&
                          event.key === "ArrowDown"
                        )
                          act(() =>
                            setFrequency(
                              point.id,
                              rows[point.id - 1].frequency + 1,
                            ),
                          );
                      }}
                    />
                    <text x={sx(point.boundary) - 5} y="300">
                      {point.boundary}
                    </text>
                  </g>
                ))}
              </svg>
              <aside>
                <p>— More-Than Ogive</p>
                <p>-- Horizontal N/2</p>
                <b>
                  N = {total}
                  <br />
                  N/2 = {half}
                </b>
                <strong>
                  Median (M)
                  <br />≈ {median}
                </strong>
              </aside>
            </div>
            <footer>
              <Grip /> Drag points on the curve or edit the table to see the
              ogive update in real time.
            </footer>
          </section>
        </div>
        <section className="mto10108-explain">
          <h3>How the median is read:</h3>
          <p>
            For a more-than ogive, the median is read at the value of x where
            the ogive cuts the horizontal line at N/2.
          </p>
          <p>
            Here, the curve cuts N/2 = {half} at x ≈ {median}. So, the median of
            the distribution is approximately <b>{median}</b>.
          </p>
        </section>
      </main>
    </section>
  );
}
