import {
  ArrowDownUp,
  Expand,
  ExternalLink,
  Languages,
  Lock,
  RefreshCcw,
  Share2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./VerticalStretchCompressionTargetLesson158.css";

const SAMPLE_X = [-2, -1, 1, 2];
const TABLE_X = [-2, -1, 0, 1, 2];
const TABS = [
  "Interaction + visualization",
  "Explain",
  "Examples",
  "Formulas",
  "Know more",
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const tidy = (value: number, places = 2) => {
  const rounded = Math.round(value * 10 ** places) / 10 ** places;
  return Object.is(rounded, -0) ? "0" : String(rounded);
};

function ScaleGraph({
  a,
  samples,
  onScale,
  onInteraction,
}: {
  a: number;
  samples: number[];
  onScale: (value: number) => void;
  onInteraction: () => void;
}) {
  const width = 600;
  const height = 378;
  const left = 10;
  const right = 10;
  const top = 12;
  const bottom = 30;
  const xMin = -4;
  const xMax = 4;
  const yMin = -0.7;
  const yMax = 8;
  const px = (x: number) =>
    left + ((x - xMin) / (xMax - xMin)) * (width - left - right);
  const py = (y: number) =>
    top + ((yMax - y) / (yMax - yMin)) * (height - top - bottom);
  const curve = (scale: number) => {
    const parts: string[] = [];
    for (let index = 0; index <= 200; index += 1) {
      const x = -3.4 + (index / 200) * 6.8;
      const y = scale * x * x;
      if (y > yMax + 0.4) continue;
      parts.push(
        `${parts.length ? "L" : "M"}${px(x).toFixed(2)},${py(y).toFixed(2)}`,
      );
    }
    return parts.join(" ");
  };
  const parentPath = useMemo(() => curve(1), []); // eslint-disable-line react-hooks/exhaustive-deps
  const transformedPath = useMemo(() => curve(a), [a]); // eslint-disable-line react-hooks/exhaustive-deps
  const updateFromPointer = (event: PointerEvent<SVGCircleElement>) => {
    const svg = event.currentTarget.ownerSVGElement;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const svgY = ((event.clientY - rect.top) / rect.height) * height;
    const y = yMax - ((svgY - top) / (height - top - bottom)) * (yMax - yMin);
    onScale(Math.round(clamp(y / 4, 0.1, 3) * 10) / 10);
  };
  const scaleKey = (event: KeyboardEvent<SVGCircleElement>) => {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    event.preventDefault();
    onScale(
      Math.round(
        clamp(a + (event.key === "ArrowUp" ? 0.1 : -0.1), 0.1, 3) * 10,
      ) / 10,
    );
  };

  return (
    <svg
      className="vs158-graph"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Parent parabola and vertical scale transformation"
      onPointerDown={onInteraction}
    >
      <defs>
        <pattern
          id="vs158-grid"
          width="72.5"
          height="38.62"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M72.5 0H0V38.62"
            fill="none"
            stroke="#e4eaf0"
            strokeWidth="1"
          />
        </pattern>
        <marker
          id="vs158-up"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto"
        >
          <path d="M0 0L10 5L0 10Z" fill="#f59e0b" />
        </marker>
      </defs>
      <rect
        x={left}
        y={top}
        width={width - left - right}
        height={height - top - bottom}
        fill="url(#vs158-grid)"
      />
      <line x1={left} y1={py(0)} x2={width - 5} y2={py(0)} className="axis" />
      <line
        x1={px(0)}
        y1={height - bottom}
        x2={px(0)}
        y2={7}
        className="axis"
      />
      <text x={width - 6} y={py(0) - 7} className="axis-label">
        x
      </text>
      <text x={px(0) + 9} y={11} className="axis-label">
        y
      </text>
      {[-3, -2, -1, 0, 1, 2, 3].map((x) => (
        <text
          key={`x-${x}`}
          x={px(x)}
          y={py(0) + 20}
          textAnchor="middle"
          className="tick"
        >
          {x}
        </text>
      ))}
      {[1, 2, 3, 4, 5, 6, 7].map((y) => (
        <text
          key={`y-${y}`}
          x={px(0) - 12}
          y={py(y) + 4}
          textAnchor="end"
          className="tick"
        >
          {y}
        </text>
      ))}
      <path d={parentPath} className="parent-curve" />
      <path d={transformedPath} className="scaled-curve" />
      {samples.map((x) => {
        const parent = x * x;
        const output = a * parent;
        return (
          <g key={x}>
            <line
              x1={px(x)}
              y1={py(parent)}
              x2={px(x)}
              y2={py(output)}
              className="scale-arrow"
              markerEnd="url(#vs158-up)"
            />
            <circle cx={px(x)} cy={py(parent)} r="5" className="parent-dot" />
            <circle cx={px(x)} cy={py(output)} r="5.5" className="scaled-dot" />
            <text
              x={px(x) + (x < 0 ? 8 : -10)}
              y={py(output) - 9}
              textAnchor={x < 0 ? "start" : "end"}
              className="output-label"
            >
              {tidy(output)}
            </text>
            <text
              x={px(x) + (x < 0 ? -8 : 8)}
              y={(py(parent) + py(output)) / 2 + 4}
              textAnchor={x < 0 ? "end" : "start"}
              className="arrow-label"
            >
              y → {tidy(a)}y
            </text>
          </g>
        );
      })}
      <circle
        cx={px(2)}
        cy={py(a * 4)}
        r="14"
        className="scale-handle"
        role="slider"
        tabIndex={0}
        aria-label="Drag vertical scale point"
        aria-valuemin={0.1}
        aria-valuemax={3}
        aria-valuenow={a}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          updateFromPointer(event);
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId))
            updateFromPointer(event);
        }}
        onKeyDown={scaleKey}
      />
      <rect
        x={px(0) - 36}
        y={py(3.1) - 14}
        width="72"
        height="28"
        rx="7"
        className="fixed-chip"
      />
      <text
        x={px(0)}
        y={py(3.1) + 4}
        textAnchor="middle"
        className="fixed-label"
      >
        x fixed
      </text>
    </svg>
  );
}

function CompressionGraph() {
  const points = (scale: number) => {
    const list: string[] = [];
    for (let index = 0; index <= 120; index += 1) {
      const x = -2.8 + (index / 120) * 5.6;
      const y = scale * x * x;
      if (y > 4.5) continue;
      const px = 185 + x * 43;
      const py = 80 - y * 14;
      list.push(`${list.length ? "L" : "M"}${px.toFixed(2)},${py.toFixed(2)}`);
    }
    return list.join(" ");
  };
  return (
    <svg
      viewBox="0 0 390 100"
      role="img"
      aria-label="Vertical compression comparison"
    >
      <line x1="45" y1="81" x2="325" y2="81" className="mini-axis" />
      <line x1="185" y1="8" x2="185" y2="91" className="mini-axis" />
      <path d={points(1)} className="mini-parent" />
      <path d={points(0.5)} className="mini-compressed" />
      <text x="330" y="25">
        Compression when
      </text>
      <text x="345" y="51">
        0 &lt; a &lt; 1
      </text>
    </svg>
  );
}

export default function VerticalStretchCompressionTargetLesson158({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [a, setA] = useState(1.8);
  const [samples, setSamples] = useState<number[]>(SAMPLE_X);
  const [tab, setTab] = useState(TABS[0]);
  const [language, setLanguage] = useState("English (English)");
  const [status, setStatus] = useState("");
  const act = () => onInteraction();
  const updateA = (value: number) => {
    setA(Math.round(clamp(value, 0.1, 3) * 10) / 10);
    act();
  };
  const reset = (notify = true) => {
    setA(1.8);
    setSamples(SAMPLE_X);
    setTab(TABS[0]);
    setLanguage("English (English)");
    setStatus("");
    if (notify) act();
  };
  useEffect(() => reset(false), [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps
  const toggleSample = (x: number) => {
    setSamples((current) =>
      current.includes(x)
        ? current.filter((value) => value !== x)
        : [...current, x],
    );
    act();
  };
  const share = async () => {
    await navigator.clipboard?.writeText(`g(x)=${tidy(a)}x^2`);
    setStatus("Scale state copied");
    act();
  };
  const stretch = a > 1;

  return (
    <div
      className="vs158-page"
      data-testid="graph-mockup-0215"
      data-dedicated-lesson="158"
      data-object-model="editable-vertical-scale-stretch-compression-mode-sample-visibility-pointer-keyboard-draggable-scaled-point-generated-parent-and-transformed-parabolas-fixed-x-arrows-value-table-compression-reference-tabs-language-share-and-workspace"
      data-a={a}
      data-mode={stretch ? "stretch" : "compression"}
      data-samples={[...samples].sort((x, y) => x - y).join(",")}
      data-tab={tab}
      data-language={language}
      data-x-fixed="true"
      data-output-x2={a * 4}
    >
      <header className="vs158-header">
        <h1>Vertical Stretch and Compression</h1>
        <p>Understand af(x).</p>
        <div className="vs158-meta">
          <b>♙ Intermediate</b>
          <b>ϟ Predict-Test-Explain</b>
          <b>▣ Dynamic Sliders / Graphing</b>
          <b>◷ 6-10 min</b>
        </div>
        <footer>
          <label>
            <Languages />
            <select
              aria-label="Vertical scale lesson language"
              value={language}
              onChange={(event) => {
                setLanguage(event.target.value);
                act();
              }}
            >
              <option>English (English)</option>
              <option>Spanish (Español)</option>
            </select>
          </label>
          <button type="button" onClick={() => reset()}>
            <RefreshCcw />
            Reset
          </button>
          <button type="button" onClick={() => void share()}>
            <Share2 />
            Share
          </button>
          <button
            type="button"
            onClick={() => {
              setStatus((current) =>
                current === "Workspace linked" ? "" : "Workspace linked",
              );
              act();
            }}
          >
            <ExternalLink />
            Workspace
          </button>
          {status && <output>{status}</output>}
        </footer>
      </header>

      <nav className="vs158-tabs">
        {TABS.map((name, index) => (
          <button
            key={name}
            type="button"
            className={tab === name ? "active" : ""}
            onClick={() => {
              setTab(name);
              act();
            }}
          >
            <span>{["⊙", "▤", "♧", "Σ", "⌁"][index]}</span>
            {name}
          </button>
        ))}
      </nav>

      <section className="vs158-workspace">
        <article className="vs158-main">
          <h2>
            Primary: {stretch ? "Stretch (a > 1)" : "Compression (0 < a < 1)"}
          </h2>
          <strong>g(x) = {tidy(a)}f(x)</strong>
          <div className="vs158-legend">
            <span>
              <i />
              g(x) = {tidy(a)}f(x)
            </span>
            <span>
              <i />
              f(x) = x²
              <br />
              (parent)
            </span>
          </div>
          <ScaleGraph
            a={a}
            samples={samples}
            onScale={updateA}
            onInteraction={act}
          />
          <section className="vs158-compression">
            <h3>Comparison: Compression (0 &lt; a &lt; 1)</h3>
            <b>g(x) = 0.5f(x)</b>
            <CompressionGraph />
          </section>
        </article>

        <aside className="vs158-rail">
          <section className="vs158-controls">
            <h2>Transform controls</h2>
            <label>
              <span>Vertical scale (a)</span>
              <div>
                <input
                  aria-label="Vertical scale factor"
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.1"
                  value={a}
                  onChange={(event) => updateA(Number(event.target.value))}
                />
                <output>{tidy(a)}</output>
              </div>
              <small>
                <span>0.1</span>
                <span>3</span>
              </small>
            </label>
            <h3>Transform type</h3>
            <nav>
              <button
                type="button"
                className={stretch ? "active" : ""}
                onClick={() => updateA(1.8)}
              >
                Stretch (a &gt; 1)
              </button>
              <button
                type="button"
                className={!stretch ? "active" : ""}
                onClick={() => updateA(0.5)}
              >
                Compression (0 &lt; a &lt; 1)
              </button>
            </nav>
            <h3>Sample x-values</h3>
            <div>
              {SAMPLE_X.map((x) => (
                <label key={x}>
                  <input
                    aria-label={`Show sample x ${x}`}
                    type="checkbox"
                    checked={samples.includes(x)}
                    onChange={() => toggleSample(x)}
                  />
                  <i />
                  {x}
                </label>
              ))}
            </div>
          </section>

          <section className="vs158-table">
            <h2>Value comparison table</h2>
            <table>
              <thead>
                <tr>
                  <th>x</th>
                  <th>f(x) = x²</th>
                  <th>{tidy(a)}f(x)</th>
                  <th>Change (×{tidy(a)})</th>
                </tr>
              </thead>
              <tbody>
                {TABLE_X.map((x) => (
                  <tr
                    key={x}
                    className={samples.includes(x) ? "selected" : ""}
                    onClick={() => x !== 0 && toggleSample(x)}
                  >
                    <td>{x}</td>
                    <td>{x * x}</td>
                    <td>{tidy(a * x * x)}</td>
                    <td>y → {tidy(a)}y</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </aside>
      </section>

      <section className="vs158-concepts">
        <article>
          <i>
            <ArrowDownUp />
          </i>
          <p>
            <b>Every y-value ×{tidy(a)}</b>
            <span>
              All y-values are multiplied by {tidy(a)}
              <br />
              while x-values stay the same.
              <br />
              Points move vertically.
            </span>
          </p>
        </article>
        <article>
          <i>
            <Expand />
          </i>
          <p>
            <b>
              {stretch ? "Stretch away from x-axis" : "Compress toward x-axis"}
            </b>
            <span>
              When a {stretch ? "> 1" : "is between 0 and 1"}, the graph{" "}
              {stretch ? "stretches" : "compresses"}
              <br />
              vertically. Points move{" "}
              {stretch ? "farther away from" : "closer to"} the x-axis.
            </span>
          </p>
        </article>
        <article>
          <i>
            <Lock />
          </i>
          <p>
            <b>x fixed</b>
            <span>
              The x-coordinates of all points
              <br />
              do not change during vertical
              <br />
              scaling.
            </span>
          </p>
        </article>
      </section>
    </div>
  );
}
