import {
  Columns3,
  Download,
  FileText,
  Grid3X3,
  Palette,
  Plus,
  RotateCcw,
  Share2,
  Tags,
  Trash2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { schoolLessonCatalog } from "../catalog/school/schoolSyllabusCatalog";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./BarGraphTargetLesson10007.css";
type Row = { name: string; value: number };
const colors = ["#18aab0", "#8b4fc9", "#f6a21d", "#287dca", "#e85a73"];
export default function BarGraphTargetLesson10007({
  lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [rows, setRows] = useState<Row[]>([
      { name: "Cricket", value: 42 },
      { name: "Football", value: 28 },
      { name: "Basketball", value: 15 },
      { name: "Badminton", value: 35 },
    ]),
    [scale, setScale] = useState(50),
    [step, setStep] = useState(10),
    [title, setTitle] = useState("Sports Votes in Class 6"),
    [xLabel, setXLabel] = useState("Sports"),
    [yLabel, setYLabel] = useState("Number of Votes"),
    [tab, setTab] = useState("INTERACT"),
    [challenge, setChallenge] = useState(false),
    [showGrid, setShowGrid] = useState(true),
    [showLabels, setShowLabels] = useState(true),
    [alternateColors, setAlternateColors] = useState(true),
    [barWidth, setBarWidth] = useState(38),
    [zoom, setZoom] = useState(1),
    [actions, setActions] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const act = (fn: () => void) => {
      fn();
      setActions((v) => v + 1);
    },
    values = rows.map((r) => r.value),
    max = Math.max(...values, 0),
    min = Math.min(...values),
    total = values.reduce((a, b) => a + b, 0),
    range = max - min,
    valid = scale >= max,
    top = rows.find((r) => r.value === max),
    bottom = rows.find((r) => r.value === min),
    sorted = useMemo(() => [...rows].sort((a, b) => b.value - a.value), [rows]),
    idx = schoolLessonCatalog.findIndex((x) => x.id === lesson.id),
    prev = schoolLessonCatalog[idx - 1],
    next = schoolLessonCatalog[idx + 1];
  const update = (i: number, key: keyof Row, value: string) =>
    act(() =>
      setRows((rs) =>
        rs.map((r, j) =>
          j === i
            ? { ...r, [key]: key === "value" ? Number(value) : value }
            : r,
        ),
      ),
    );
  const resetChart = () =>
    act(() => {
      setRows([
        { name: "Cricket", value: 42 },
        { name: "Football", value: 28 },
        { name: "Basketball", value: 15 },
        { name: "Badminton", value: 35 },
      ]);
      setScale(50);
      setStep(10);
      setZoom(1);
      setShowGrid(true);
      setShowLabels(true);
      setAlternateColors(true);
      setBarWidth(38);
    });
  const exportPng = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const source = new XMLSerializer().serializeToString(svg),
      image = new Image(),
      canvas = document.createElement("canvas");
    canvas.width = 840;
    canvas.height = 1020;
    image.onload = () => {
      canvas.getContext("2d")?.drawImage(image, 0, 0, 840, 1020);
      const link = document.createElement("a");
      link.download = "bar-graph.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      URL.revokeObjectURL(image.src);
    };
    image.src = URL.createObjectURL(
      new Blob([source], { type: "image/svg+xml" }),
    );
    act(() => {});
  };
  const shareChart = async () => {
    const text = `${title}: ${rows.map((r) => `${r.name} ${r.value}`).join(", ")}`;
    if (navigator.share) await navigator.share({ title, text });
    else await navigator.clipboard.writeText(text);
    act(() => {});
  };
  return (
    <section
      className="bg10007-page"
      data-testid="school-mockup-0681"
      data-object-model="dedicated-live-svg-bar-graph-scale-and-analysis-model"
      data-values={values.join(",")}
      data-scale={scale}
      data-valid-scale={valid}
      data-highest={max}
      data-lowest={min}
      data-range={range}
      data-total={total}
      data-zoom={zoom}
      data-grid={showGrid}
      data-labels={showLabels}
      data-bar-width={barWidth}
      data-actions={actions}
    >
      <header className="bg10007-hero">
        <small>CLASS 6 · DATA HANDLING</small>
        <h1>Bar Graph Builder</h1>
        <p>
          <b>Objective:</b> Represent a data set using a bar graph with a
          suitable scale.
        </p>
        <dl>
          <span>18 min</span>
          <span>FOUNDATION</span>
          <span>CONCEPT</span>
          <span>graph</span>
        </dl>
        <aside>
          <div>
            <b>You are learning</b>
            <p>Create bar graphs and choose suitable scales.</p>
          </div>
          <div>
            <b>What you'll master</b>
            <p>
              ✓ Enter data and draw bar graphs
              <br />✓ Choose good scales
              <br />✓ Read and compare values
            </p>
          </div>
        </aside>
      </header>
      <nav className="bg10007-tabs">
        {["INTERACT", "LEARN", "WORKED EXAMPLE", "FORMULA", "PRACTICE"].map(
          (t) => (
            <button
              className={tab === t ? "active" : ""}
              onClick={() => act(() => setTab(t))}
              key={t}
            >
              {t}
            </button>
          ),
        )}
      </nav>
      <section className="bg10007-lab">
        <aside>
          <article>
            <h2>1. OBSERVE & MANIPULATE</h2>
            <p>Enter your data. Bars and scale update live.</p>
            {rows.map((r, i) => (
              <label key={i}>
                <input
                  aria-label={`Category ${i + 1}`}
                  value={r.name}
                  onChange={(e) => update(i, "name", e.target.value)}
                />
                <input
                  aria-label={`Value ${i + 1}`}
                  type="number"
                  value={r.value}
                  onChange={(e) => update(i, "value", e.target.value)}
                />
                <button
                  aria-label={`Delete ${r.name}`}
                  onClick={() =>
                    act(() => setRows((rs) => rs.filter((_, j) => j !== i)))
                  }
                >
                  <Trash2 />
                </button>
              </label>
            ))}
            <button
              onClick={() =>
                act(() => setRows((rs) => [...rs, { name: "New", value: 10 }]))
              }
            >
              <Plus />
              Add category
            </button>
            <input
              aria-label="Graph title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              aria-label="Horizontal axis"
              value={xLabel}
              onChange={(e) => setXLabel(e.target.value)}
            />
            <input
              aria-label="Vertical axis"
              value={yLabel}
              onChange={(e) => setYLabel(e.target.value)}
            />
          </article>
          <article>
            <h2>2. CHOOSE SCALE</h2>
            <p>
              Max value: {max}
              <br />
              Suggested range: 0 to {Math.ceil(max / 10) * 10}
            </p>
            {[
              [50, 10],
              [40, 10],
              [20, 5],
              [100, 20],
            ].map(([m, s]) => (
              <label key={m}>
                <input
                  type="radio"
                  name="scale"
                  checked={scale === m}
                  onChange={() =>
                    act(() => {
                      setScale(m);
                      setStep(s);
                    })
                  }
                />
                0 to {m} by {s}
              </label>
            ))}
            <p className={valid ? "ok" : "bad"}>
              <b>Check your scale</b>
              <br />
              {valid
                ? "The scale includes every value."
                : `Choose a scale that includes ${max}.`}
            </p>
            <div>
              Highest <b>{max}</b> | Lowest <b>{min}</b> | Range <b>{range}</b>|
              Total <b>{total}</b>
            </div>
          </article>
        </aside>
        <article className="bg10007-chart">
          <h2>LIVE BAR GRAPH</h2>
          <p>Bars grow as you change values or scale.</p>
          <nav className="bg10007-tools">
            <button
              onClick={() =>
                act(() => {
                  const fitted = Math.max(10, Math.ceil(max / 10) * 10);
                  setScale(fitted);
                  setStep(Math.max(1, fitted / 5));
                })
              }
            >
              Auto fit
            </button>
            <button
              aria-label="Zoom in"
              onClick={() => act(() => setZoom((v) => Math.min(1.3, v + 0.1)))}
            >
              <ZoomIn />
            </button>
            <button
              aria-label="Zoom out"
              onClick={() => act(() => setZoom((v) => Math.max(0.8, v - 0.1)))}
            >
              <ZoomOut />
            </button>
            <button aria-label="Reset chart" onClick={resetChart}>
              <RotateCcw />
            </button>
          </nav>
          <svg
            ref={svgRef}
            viewBox="0 0 420 510"
            preserveAspectRatio="none"
            role="img"
            aria-label="Live bar graph"
          >
            {Array.from({ length: Math.floor(scale / step) + 1 }, (_, i) => {
              const v = i * step,
                y = 440 - (v / scale) * 405;
              return (
                <g key={v}>
                  {showGrid && <line x1="55" x2="405" y1={y} y2={y} />}
                  <text x="45" y={y + 4}>
                    {v}
                  </text>
                </g>
              );
            })}
            <line className="axis" x1="55" x2="55" y1="35" y2="440" />
            <line className="axis" x1="55" x2="405" y1="440" y2="440" />
            <text className="title" x="230" y="15">
              {title}
            </text>
            {rows.map((r, i) => {
              const h = Math.min(r.value / scale, 1) * 405,
                x = 82 + i * (300 / Math.max(rows.length, 1));
              return (
                <g key={i}>
                  <rect
                    x={x}
                    y={440 - h}
                    width={barWidth}
                    height={h}
                    fill={
                      alternateColors ? colors[i % colors.length] : colors[0]
                    }
                    transform={`translate(${(1 - zoom) * (x + 19)} ${(1 - zoom) * 440}) scale(${zoom})`}
                  />
                  {showLabels && (
                    <text x={x + 19} y={430 - h}>
                      {r.value}
                    </text>
                  )}
                  <text x={x + 19} y="465">
                    {r.name}
                  </text>
                </g>
              );
            })}
            <text x="230" y="495">
              {xLabel}
            </text>
            <text transform="translate(14 310) rotate(-90)">{yLabel}</text>
          </svg>
          <footer>
            Scale: 0 to {scale} by {step} | Values: {values.join(", ")} | Type:
            Bar graph
          </footer>
          <nav className="bg10007-export">
            <button onClick={() => act(() => setShowGrid((v) => !v))}>
              <Grid3X3 />
              Grid
            </button>
            <button onClick={() => act(() => setShowLabels((v) => !v))}>
              <Tags />
              Labels
            </button>
            <button onClick={() => act(() => setAlternateColors((v) => !v))}>
              <Palette />
              Colors
            </button>
            <button
              onClick={() =>
                act(() => setBarWidth((v) => (v === 38 ? 28 : 38)))
              }
            >
              <Columns3 />
              Bar width
            </button>
            <button onClick={exportPng}>
              <Download />
              PNG
            </button>
            <button
              onClick={() => {
                window.print();
                act(() => {});
              }}
            >
              <FileText />
              PDF
            </button>
            <button onClick={shareChart}>
              <Share2 />
              Share
            </button>
          </nav>
          <aside>
            <b>Good scale reminder</b>
            <p>Use a scale that starts at 0 and includes the maximum value.</p>
          </aside>
        </article>
        <aside className="bg10007-rules">
          <article>
            <h2>3. NOTICE THE PATTERN</h2>
            <p>
              Most votes
              <br />
              <b>
                {top?.name} ({max})
              </b>
            </p>
            <p>
              Least votes
              <br />
              <b>
                {bottom?.name} ({min})
              </b>
            </p>
            <p>
              Difference
              <br />
              <b>
                {max} - {min} = {range}
              </b>
            </p>
            <p>
              Order
              <br />
              <b>{sorted.map((r) => r.name).join(" > ")}</b>
            </p>
          </article>
          <article>
            <h2>4. UNDERSTAND THE RULE</h2>
            <h3>Key idea</h3>
            <p>
              Bar graphs compare quantities across categories using equal-width
              bars.
            </p>
            <h3>Good scale rules</h3>
            <p>
              ✓ Start the vertical axis at 0.
              <br />✓ Include the maximum value.
              <br />✓ Use equal intervals.
              <br />✓ Label axes and give a clear title.
            </p>
            <strong>
              Avoid unequal gaps or a scale that misses the maximum.
            </strong>
          </article>
        </aside>
      </section>
      <section className="bg10007-lower">
        <article>
          <h2>WORKED EXAMPLE</h2>
          <h3>Favourite Fruits (votes)</h3>
          <p>Apple = 30, Banana = 20, Mango = 15, Orange = 25.</p>
          <div className="mini-bars">
            {[30, 20, 15, 25].map((v, i) => (
              <i key={v} style={{ height: v * 2, background: colors[i] }}>
                <b>{v}</b>
              </i>
            ))}
          </div>
        </article>
        <article>
          <h2>KEY RULE / DEFINITION</h2>
          <p>
            A bar graph shows data using rectangular bars of equal width with
            equal spacing.
          </p>
          <ol>
            <li>List categories and values.</li>
            <li>Draw perpendicular axes.</li>
            <li>Choose a suitable scale.</li>
            <li>Draw equal-width bars.</li>
            <li>Give a title and labels.</li>
          </ol>
        </article>
        <article>
          <h2>TRY INDEPENDENTLY</h2>
          <h3>Challenge 1: Books Read</h3>
          <p>Story = 18, Adventure = 24, Science = 12, History = 16.</p>
          <button onClick={() => act(() => setChallenge((v) => !v))}>
            {challenge
              ? "Most: Adventure; least: Science; difference: 12"
              : "Start challenge"}
          </button>
        </article>
      </section>
      <nav className="bg10007-adjacent">
        <Link to={prev.route}>
          ← Previous<b>{prev.title}</b>
        </Link>
        <Link to={next.route}>
          Next →<b>{next.title}</b>
        </Link>
      </nav>
    </section>
  );
}
