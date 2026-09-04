import { useRef, useState } from "react";
import type { PointerEvent } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./TrigDomainRangeTargetLesson10124.css";

type TrigKey = "sin" | "cos" | "tan" | "csc" | "sec" | "cot";
type SpanKey = "two" | "one" | "positive";

const TAU = Math.PI * 2;
const functions: Record<TrigKey, (x: number) => number> = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  csc: (x) => 1 / Math.sin(x),
  sec: (x) => 1 / Math.cos(x),
  cot: (x) => Math.cos(x) / Math.sin(x),
};
const labels: Record<TrigKey, string> = {
  sin: "sin x",
  cos: "cos x",
  tan: "tan x",
  csc: "cosec x",
  sec: "sec x",
  cot: "cot x",
};
const domains: Record<TrigKey, string> = {
  sin: "R",
  cos: "R",
  tan: "R \\ {π/2 + kπ | k ∈ Z}",
  csc: "R \\ {kπ | k ∈ Z}",
  sec: "R \\ {π/2 + kπ | k ∈ Z}",
  cot: "R \\ {kπ | k ∈ Z}",
};
const ranges: Record<TrigKey, string> = {
  sin: "[-1, 1]",
  cos: "[-1, 1]",
  tan: "(-∞, ∞)",
  csc: "(-∞, -1] ∪ [1, ∞)",
  sec: "(-∞, -1] ∪ [1, ∞)",
  cot: "(-∞, ∞)",
};
const colors: Record<TrigKey, string> = {
  sin: "#32dfdb",
  cos: "#3c8df1",
  tan: "#a56aef",
  csc: "#e2bf15",
  sec: "#f27c22",
  cot: "#ef5ca8",
};

const pretty = (value: number) =>
  Number.isFinite(value) && Math.abs(value) < 1000
    ? value.toFixed(4).replace(/\.0000$/, "")
    : "undefined";

function graphSegments(
  key: TrigKey,
  start: number,
  end: number,
  width = 600,
  height = 280,
) {
  const segments: string[] = [];
  let current = "";
  for (let index = 0; index <= 320; index += 1) {
    const x = start + ((end - start) * index) / 320;
    const value = functions[key](x);
    if (!Number.isFinite(value) || Math.abs(value) > 2.15) {
      if (current) segments.push(current);
      current = "";
      continue;
    }
    const px = 35 + ((width - 55) * (x - start)) / (end - start);
    const py = height / 2 - value * 52;
    current += `${current ? " L" : "M"}${px.toFixed(1)} ${py.toFixed(1)}`;
  }
  if (current) segments.push(current);
  return segments;
}

export default function TrigDomainRangeTargetLesson10124({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [angle, setAngle] = useState(Math.PI / 4);
  const [selected, setSelected] = useState<TrigKey>("sin");
  const [radians, setRadians] = useState(true);
  const [trace, setTrace] = useState(true);
  const [span, setSpan] = useState<SpanKey>("two");
  const [tab, setTab] = useState("Overview");
  const [actions, setActions] = useState(0);
  const dragging = useRef(false);
  const range =
    span === "one"
      ? [-Math.PI, Math.PI]
      : span === "positive"
        ? [0, TAU]
        : [-TAU, TAU];
  const value = functions[selected](angle);
  const point = {
    x: 160 + 104 * Math.cos(angle),
    y: 145 - 104 * Math.sin(angle),
  };
  const updateAngle = (next: number) => {
    setAngle(Math.max(-TAU, Math.min(TAU, next)));
    setActions((count) => count + 1);
  };
  const pointerAngle = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragging.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 320;
    const y = ((event.clientY - rect.top) / rect.height) * 300;
    updateAngle(Math.atan2(145 - y, x - 160));
  };
  const chooseFunction = (key: TrigKey) => {
    setSelected(key);
    setActions((count) => count + 1);
  };
  const exact = [
    ["sin θ", Math.sin(angle)],
    ["cos θ", Math.cos(angle)],
    ["tan θ", Math.tan(angle)],
    ["cosec θ", 1 / Math.sin(angle)],
    ["sec θ", 1 / Math.cos(angle)],
    ["cot θ", Math.cos(angle) / Math.sin(angle)],
  ];

  return (
    <section
      className="tr10124-page"
      data-testid="school-mockup-0798"
      data-object-model="dedicated-six-function-domain-range-engine"
      data-function={selected}
      data-angle={angle.toFixed(4)}
      data-value={pretty(value)}
      data-mode={radians ? "radians" : "degrees"}
      data-trace={String(trace)}
      data-span={span}
      data-tab={tab}
      data-actions={actions}
    >
      <header>
        <small>CLASS 11 · TRIGONOMETRY</small>
        <h1>Domain and Range of Trigonometric Functions</h1>
        <p>
          Explore all six trigonometric functions on the unit circle and their
          graphs. Drag the angle to update values, graphs, domains and ranges.
        </p>
        <label>
          Choose function
          <select
            aria-label="Choose function"
            value={selected}
            onChange={(event) => chooseFunction(event.target.value as TrigKey)}
          >
            {(Object.keys(labels) as TrigKey[]).map((key) => (
              <option key={key} value={key}>
                {labels[key]}
              </option>
            ))}
          </select>
        </label>
        <fieldset>
          <legend>Angle mode</legend>
          <button
            className={radians ? "active" : ""}
            onClick={() => setRadians(true)}
          >
            Rad
          </button>
          <button
            className={!radians ? "active" : ""}
            onClick={() => setRadians(false)}
          >
            Deg
          </button>
        </fieldset>
      </header>
      <nav className="tr10124-tabs">
        {["Overview", "Explorer", "Practice"].map((name) => (
          <button
            className={tab === name ? "active" : ""}
            key={name}
            onClick={() => setTab(name)}
          >
            {name}
            {name === "Explorer" && <b>New</b>}
          </button>
        ))}
      </nav>
      <main>
        <section className="tr10124-circle">
          <h2>UNIT CIRCLE & ANGLE</h2>
          <svg
            viewBox="0 0 320 300"
            aria-label="Draggable unit circle angle"
            onPointerMove={pointerAngle}
            onPointerUp={() => {
              dragging.current = false;
            }}
          >
            <line className="axis" x1="30" y1="145" x2="292" y2="145" />
            <line className="axis" x1="160" y1="18" x2="160" y2="278" />
            <circle className="unit" cx="160" cy="145" r="104" />
            <path
              className="angle"
              d={`M200 145 A40 40 0 ${Math.abs(angle) > Math.PI ? 1 : 0} ${angle >= 0 ? 0 : 1} ${160 + 40 * Math.cos(angle)} ${145 - 40 * Math.sin(angle)}`}
            />
            <line className="ray" x1="160" y1="145" x2={point.x} y2={point.y} />
            <line
              className="projection"
              x1={point.x}
              y1={point.y}
              x2={point.x}
              y2="145"
            />
            <circle
              className="handle"
              tabIndex={0}
              cx={point.x}
              cy={point.y}
              r="7"
              onPointerDown={(event) => {
                dragging.current = true;
                event.currentTarget.setPointerCapture(event.pointerId);
              }}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight")
                  updateAngle(angle + Math.PI / 36);
                if (event.key === "ArrowLeft")
                  updateAngle(angle - Math.PI / 36);
              }}
            />
            <text x={Math.min(point.x + 9, 220)} y={Math.max(point.y - 9, 20)}>
              ({pretty(Math.cos(angle))}, {pretty(Math.sin(angle))})
            </text>
            <text x="190" y="132">
              θ
            </text>
            <text x="292" y="140">
              x
            </text>
            <text x="168" y="18">
              y
            </text>
          </svg>
          <label className="tr10124-slider">
            <span>-2π</span>
            <input
              aria-label="Angle"
              type="range"
              min={-TAU}
              max={TAU}
              step={Math.PI / 180}
              value={angle}
              onChange={(event) => updateAngle(Number(event.target.value))}
            />
            <span>2π</span>
          </label>
          <strong>
            θ ={" "}
            {radians
              ? `${(angle / Math.PI).toFixed(2)}π rad`
              : `${((angle * 180) / Math.PI).toFixed(1)}°`}
          </strong>
          <div className="tr10124-presets">
            {[-2, -1, -0.5, 0, 0.5, 1, 2].map((multiple) => (
              <button
                key={multiple}
                onClick={() => updateAngle(multiple * Math.PI)}
              >
                {multiple === 0 ? "0" : `${multiple}π`}
              </button>
            ))}
          </div>
          <footer>
            <span>
              Quadrant:{" "}
              {Math.sin(angle) >= 0
                ? Math.cos(angle) >= 0
                  ? "I"
                  : "II"
                : Math.cos(angle) < 0
                  ? "III"
                  : "IV"}
            </span>
            <span>
              Reference angle:{" "}
              {(
                Math.atan2(
                  Math.abs(Math.sin(angle)),
                  Math.abs(Math.cos(angle)),
                ) / Math.PI
              ).toFixed(2)}
              π
            </span>
          </footer>
        </section>
        <section className="tr10124-graph">
          <h2>
            FUNCTION GRAPH <em>y = {labels[selected]}</em>
          </h2>
          <svg viewBox="0 0 600 280" aria-label={`${labels[selected]} graph`}>
            {Array.from({ length: 9 }, (_, index) => (
              <line
                className="grid"
                key={`v${index}`}
                x1={35 + index * 68}
                y1="25"
                x2={35 + index * 68}
                y2="250"
              />
            ))}
            {Array.from({ length: 5 }, (_, index) => (
              <line
                className="grid"
                key={`h${index}`}
                x1="35"
                y1={36 + index * 52}
                x2="580"
                y2={36 + index * 52}
              />
            ))}
            <line className="axis" x1="35" y1="140" x2="585" y2="140" />
            <line className="axis" x1="307" y1="20" x2="307" y2="255" />
            {graphSegments(selected, range[0], range[1]).map((path, index) => (
              <path key={index} d={path} style={{ stroke: colors[selected] }} />
            ))}
            {trace && Number.isFinite(value) && Math.abs(value) <= 2.15 && (
              <>
                <line
                  className="trace"
                  x1={35 + (545 * (angle - range[0])) / (range[1] - range[0])}
                  y1="140"
                  x2={35 + (545 * (angle - range[0])) / (range[1] - range[0])}
                  y2={140 - value * 52}
                />
                <circle
                  cx={35 + (545 * (angle - range[0])) / (range[1] - range[0])}
                  cy={140 - value * 52}
                  r="6"
                  style={{ fill: colors[selected] }}
                />
              </>
            )}
          </svg>
          <footer>
            <label>
              Show trace{" "}
              <input
                aria-label="Show trace"
                type="checkbox"
                checked={trace}
                onChange={(event) => setTrace(event.target.checked)}
              />
            </label>
            <label>
              x-range:{" "}
              <select
                aria-label="Graph x range"
                value={span}
                onChange={(event) => setSpan(event.target.value as SpanKey)}
              >
                <option value="two">-2π to 2π</option>
                <option value="one">-π to π</option>
                <option value="positive">0 to 2π</option>
              </select>
            </label>
          </footer>
        </section>
        <aside className="tr10124-facts">
          <article>
            <h2>
              EXACT VALUES{" "}
              <small>
                (θ ={" "}
                {radians
                  ? `${(angle / Math.PI).toFixed(2)}π`
                  : `${((angle * 180) / Math.PI).toFixed(1)}°`}
                )
              </small>
            </h2>
            <div>
              {exact.map(([name, number]) => (
                <span key={String(name)}>
                  {name} = <b>{pretty(number as number)}</b>
                </span>
              ))}
            </div>
          </article>
          <article>
            <h2>DOMAIN (EXCLUSIONS)</h2>
            {(Object.keys(labels) as TrigKey[]).map((key) => (
              <p className={selected === key ? "selected" : ""} key={key}>
                <b>{labels[key]}</b>
                <span>{domains[key]}</span>
              </p>
            ))}
          </article>
          <article>
            <h2>RANGE</h2>
            {(Object.keys(labels) as TrigKey[]).map((key) => (
              <p className={selected === key ? "selected" : ""} key={key}>
                <b>{labels[key]}</b>
                <span>{ranges[key]}</span>
              </p>
            ))}
          </article>
        </aside>
      </main>
      <section className="tr10124-gallery">
        <header>
          EXPLORE ALL SIX FUNCTIONS <span>Click any graph to explore</span>
        </header>
        {(Object.keys(labels) as TrigKey[]).map((key) => (
          <button
            className={selected === key ? "active" : ""}
            key={key}
            onClick={() => chooseFunction(key)}
          >
            <strong style={{ color: colors[key] }}>{labels[key]}</strong>
            <svg viewBox="0 0 180 65">
              {graphSegments(key, -TAU, TAU, 180, 65).map((path, index) => (
                <path
                  key={index}
                  d={path}
                  transform="translate(-20 -107) scale(.34)"
                  style={{ stroke: colors[key] }}
                />
              ))}
            </svg>
            <small>Range: {ranges[key]}</small>
            <small>Domain: {domains[key]}</small>
          </button>
        ))}
      </section>
    </section>
  );
}
