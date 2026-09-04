import {
  Calculator,
  Download,
  GripVertical,
  Lightbulb,
  Plus,
  RotateCcw,
} from "lucide-react";
import { type PointerEvent, useRef, useState } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./LessThanOgiveTargetLesson10107.css";

type Point = { id: number; x: number; cf: number };
const defaults: Point[] = [
  { id: 1, x: 10.5, cf: 0 },
  { id: 2, x: 20.5, cf: 4 },
  { id: 3, x: 30.5, cf: 8 },
  { id: 4, x: 40.5, cf: 15 },
  { id: 5, x: 50.5, cf: 22 },
  { id: 6, x: 60.5, cf: 28 },
  { id: 7, x: 70.5, cf: 30 },
];
const round = (value: number, places = 1) => Number(value.toFixed(places));

export default function LessThanOgiveTargetLesson10107({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [points, setPoints] = useState<Point[]>(defaults);
  const [showGuide, setShowGuide] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [dragging, setDragging] = useState<number | null>(null);
  const [actions, setActions] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const total = points.at(-1)?.cf ?? 0;
  const half = total / 2;
  const upper = points.findIndex((point) => point.cf >= half);
  const right = points[Math.max(0, upper)];
  const left = points[Math.max(0, upper - 1)] ?? right;
  const median =
    right && left
      ? round(
          left.x +
            ((half - left.cf) / Math.max(1, right.cf - left.cf)) *
              (right.x - left.x),
        )
      : 0;
  const minX = points[0]?.x ?? 0;
  const maxX = points.at(-1)?.x ?? 1;
  const sx = (x: number) => 55 + ((x - minX) / Math.max(1, maxX - minX)) * 630;
  const sy = (cf: number) => 300 - (cf / Math.max(35, total)) * 245;
  const path = points
    .map((point, index) => `${index ? "L" : "M"}${sx(point.x)},${sy(point.cf)}`)
    .join(" ");
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const updatePoint = (id: number, next: Partial<Point>) =>
    setPoints((current) => {
      const index = current.findIndex((point) => point.id === id);
      if (index < 0) return current;
      const previous = current[index - 1];
      const following = current[index + 1];
      const candidate = { ...current[index], ...next };
      candidate.x = round(
        Math.max(
          previous ? previous.x + 0.5 : 0.5,
          Math.min(following ? following.x - 0.5 : 99.5, candidate.x),
        ),
      );
      candidate.cf = Math.round(
        Math.max(
          previous?.cf ?? 0,
          Math.min(following?.cf ?? 50, candidate.cf),
        ),
      );
      return current.map((point) => (point.id === id ? candidate : point));
    });
  const dragPoint = (event: PointerEvent<SVGCircleElement>, point: Point) => {
    if (dragging !== point.id || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const px = ((event.clientX - rect.left) / rect.width) * 740;
    const py = ((event.clientY - rect.top) / rect.height) * 345;
    updatePoint(point.id, {
      x: minX + ((px - 55) / 630) * (maxX - minX),
      cf: ((300 - py) / 245) * Math.max(35, total),
    });
  };
  const exportPng = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const source = new XMLSerializer().serializeToString(svg);
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1480;
      canvas.height = 690;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.fillStyle = "#06182f";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const anchor = document.createElement("a");
      anchor.download = "less-than-ogive.png";
      anchor.href = canvas.toDataURL("image/png");
      anchor.click();
    };
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`;
    setActions((value) => value + 1);
  };
  const reset = () =>
    act(() => {
      setPoints(defaults);
      setShowGuide(true);
      setShowGrid(false);
      setDragging(null);
    });
  const addRow = () =>
    act(() =>
      setPoints((current) => [
        ...current,
        {
          id: Math.max(...current.map((point) => point.id)) + 1,
          x: round((current.at(-1)?.x ?? 0) + 10),
          cf: current.at(-1)?.cf ?? 0,
        },
      ]),
    );

  return (
    <section
      className="lto10107-page"
      data-testid="school-mockup-0781"
      data-object-model="dedicated-less-than-ogive-median-read-off-engine"
      data-points={points.map((point) => `${point.x}:${point.cf}`).join(",")}
      data-total={total}
      data-half={half}
      data-median={median}
      data-show-guide={String(showGuide)}
      data-show-grid={String(showGrid)}
      data-actions={actions}
    >
      <header className="lto10107-hero">
        <small>CLASS 10 · STATISTICS</small>
        <h1>Less-Than Ogive</h1>
        <p>
          Less-Than Ogive is a school mathematics idea in Statistics. It helps
          students model data, functions, curves, proofs, and 3D directions.
        </p>
        <p>
          We use related ideas in graphs, design, surveys, navigation, and
          measurement.
        </p>
        <nav>
          <span>◷ 18 min</span>
          <span>INTERMEDIATE</span>
          <span>CONCEPT</span>
          <span>statistics</span>
        </nav>
      </header>
      <main className="lto10107-lab">
        <header>
          <div>
            <small>INTERACTIVE LAB</small>
            <h2>Data balance lab</h2>
            <p>
              Edit the table or drag points. The ogive updates instantly. Read
              the median at <i>N/2</i>.
            </p>
          </div>
          <button onClick={reset}>
            <RotateCcw /> Reset lab
          </button>
        </header>
        <div className="lto10107-grid">
          <div className="lto10107-left">
            <section className="lto10107-table">
              <h3>
                DATA TABLE <span>(Editable)</span>
              </h3>
              <table>
                <thead>
                  <tr>
                    <th>Upper class boundary (x)</th>
                    <th>Less-than cumulative frequency (F(&lt; x))</th>
                  </tr>
                </thead>
                <tbody>
                  {points.map((point) => (
                    <tr key={point.id}>
                      <td>
                        <label>
                          <GripVertical />
                          <input
                            aria-label={`Upper boundary row ${point.id}`}
                            type="number"
                            step="0.5"
                            value={point.x}
                            onChange={(event) =>
                              act(() =>
                                updatePoint(point.id, {
                                  x: Number(event.target.value),
                                }),
                              )
                            }
                          />
                        </label>
                      </td>
                      <td>
                        <input
                          aria-label={`Cumulative frequency row ${point.id}`}
                          type="number"
                          min="0"
                          max="50"
                          value={point.cf}
                          onChange={(event) =>
                            act(() =>
                              updatePoint(point.id, {
                                cf: Number(event.target.value),
                              }),
                            )
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <footer>
                Total frequency, <i>N</i> = <b>{total}</b>
                <button onClick={addRow}>
                  <Plus /> Add row
                </button>
              </footer>
            </section>
            <section className="lto10107-formula">
              <h3>OGIVE FORMULA</h3>
              <strong>F(&lt; x) = Σ fᵢ</strong>
              <p>
                Cumulative total of frequencies up to upper boundary <i>x</i>.
              </p>
            </section>
          </div>
          <div className="lto10107-right">
            <section className="lto10107-chart">
              <header>
                <h3>LESS-THAN OGIVE ⓘ</h3>
                <label>
                  <input
                    type="checkbox"
                    checked={showGuide}
                    onChange={(event) =>
                      act(() => setShowGuide(event.target.checked))
                    }
                  />{" "}
                  Show N/2 guide
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={showGrid}
                    onChange={(event) =>
                      act(() => setShowGrid(event.target.checked))
                    }
                  />{" "}
                  Show grid
                </label>
                <button onClick={exportPng}>
                  <Download /> Export PNG
                </button>
              </header>
              <svg
                ref={svgRef}
                viewBox="0 0 740 345"
                aria-label="Interactive less-than ogive"
              >
                <rect width="740" height="345" fill="#06182f" />
                <g className={showGrid ? "grid visible" : "grid"}>
                  {[0, 5, 10, 15, 20, 25, 30, 35].map((v) => (
                    <line
                      key={`h${v}`}
                      x1="55"
                      y1={sy(v)}
                      x2="700"
                      y2={sy(v)}
                    />
                  ))}
                  {points.map((p) => (
                    <line
                      key={`v${p.id}`}
                      x1={sx(p.x)}
                      y1="45"
                      x2={sx(p.x)}
                      y2="300"
                    />
                  ))}
                </g>
                <line x1="55" y1="300" x2="705" y2="300" />
                <line x1="55" y1="305" x2="55" y2="40" />
                <path d={path} />
                {showGuide && (
                  <g className="guide">
                    <line x1="55" y1={sy(half)} x2={sx(median)} y2={sy(half)} />
                    <line
                      x1={sx(median)}
                      y1={sy(half)}
                      x2={sx(median)}
                      y2="300"
                    />
                    <text x="70" y={sy(half) - 10}>
                      N/2 = {half}
                    </text>
                    <text x={sx(median) + 17} y={sy(half) + 32}>
                      Median read-off
                    </text>
                    <text x={sx(median) + 17} y={sy(half) + 57}>
                      x = {median}
                    </text>
                  </g>
                )}
                {points.map((point) => (
                  <g key={point.id}>
                    <circle
                      role="slider"
                      tabIndex={0}
                      aria-label={`Ogive point ${point.id}`}
                      aria-valuemin={points[Math.max(0, point.id - 2)]?.cf ?? 0}
                      aria-valuemax={points[point.id]?.cf ?? 50}
                      aria-valuenow={point.cf}
                      cx={sx(point.x)}
                      cy={sy(point.cf)}
                      r="6"
                      onPointerDown={(event) => {
                        event.currentTarget.setPointerCapture(event.pointerId);
                        act(() => setDragging(point.id));
                      }}
                      onPointerMove={(event) => dragPoint(event, point)}
                      onPointerUp={() =>
                        dragging && act(() => setDragging(null))
                      }
                      onKeyDown={(event) => {
                        if (event.key === "ArrowUp")
                          act(() =>
                            updatePoint(point.id, { cf: point.cf + 1 }),
                          );
                        if (event.key === "ArrowDown")
                          act(() =>
                            updatePoint(point.id, { cf: point.cf - 1 }),
                          );
                        if (event.key === "ArrowRight")
                          act(() =>
                            updatePoint(point.id, { x: point.x + 0.5 }),
                          );
                        if (event.key === "ArrowLeft")
                          act(() =>
                            updatePoint(point.id, { x: point.x - 0.5 }),
                          );
                      }}
                    />
                    <text x={sx(point.x) - 10} y="325">
                      {point.x}
                    </text>
                  </g>
                ))}
              </svg>
            </section>
            <div className="lto10107-read">
              <section>
                <Calculator />
                <div>
                  <b>Median (read-off)</b>
                  <strong>{median}</strong>
                </div>
                <span>
                  <i>N</i> = {total}
                  <br />
                  <i>N</i>/2 = {half}
                </span>
              </section>
              <aside>
                <Lightbulb />
                <div>
                  <b>How to read median</b>
                  <p>
                    Draw a horizontal line at N/2 to meet the ogive, then drop a
                    vertical line to the x-axis. The x value is the median.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}
