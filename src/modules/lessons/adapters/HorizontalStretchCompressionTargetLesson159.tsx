import {
  Calculator,
  CircleGauge,
  RefreshCcw,
  Share2,
  Star,
  ExternalLink,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./HorizontalStretchCompressionTargetLesson159.css";

const LEVELS = [1, 2, 4, 6];
const TABLE_LEVELS = [1, 4, 6];

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const tidy = (value: number, places = 2) => {
  const rounded = Math.round(value * 10 ** places) / 10 ** places;
  return Object.is(rounded, -0) ? "0" : String(rounded);
};

function HorizontalScaleGraph({
  b,
  levels,
  onScale,
  onInteraction,
}: {
  b: number;
  levels: number[];
  onScale: (value: number) => void;
  onInteraction: () => void;
}) {
  const width = 640;
  const height = 500;
  const left = 20;
  const right = 80;
  const top = 16;
  const bottom = 185;
  const xMin = -7;
  const xMax = 7;
  const yMin = 0;
  const yMax = 7;
  const px = (x: number) =>
    left + ((x - xMin) / (xMax - xMin)) * (width - left - right);
  const py = (y: number) =>
    top + ((yMax - y) / (yMax - yMin)) * (height - top - bottom);
  const curve = (insideScale: number) => {
    const parts: string[] = [];
    for (let index = 0; index <= 260; index += 1) {
      const x = xMin + (index / 260) * (xMax - xMin);
      const y = (insideScale * x) ** 2;
      if (y > yMax + 0.4) continue;
      parts.push(
        `${parts.length ? "L" : "M"}${px(x).toFixed(2)},${py(y).toFixed(2)}`,
      );
    }
    return parts.join(" ");
  };
  const parentPath = useMemo(() => curve(1), []); // eslint-disable-line react-hooks/exhaustive-deps
  const scaledPath = useMemo(() => curve(b), [b]); // eslint-disable-line react-hooks/exhaustive-deps
  const probeLevel = levels.includes(4) ? 4 : (levels[0] ?? 1);
  const probeX = Math.sqrt(probeLevel) / b;
  const updateFromPointer = (event: PointerEvent<SVGCircleElement>) => {
    const svg = event.currentTarget.ownerSVGElement;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const svgX = ((event.clientX - rect.left) / rect.width) * width;
    const graphX =
      xMin + ((svgX - left) / (width - left - right)) * (xMax - xMin);
    if (graphX <= 0.15) return;
    onScale(
      Math.round(clamp(Math.sqrt(probeLevel) / graphX, 0.2, 3) * 10) / 10,
    );
  };
  const scaleKey = (event: KeyboardEvent<SVGCircleElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    onScale(
      Math.round(
        clamp(b + (event.key === "ArrowLeft" ? 0.1 : -0.1), 0.2, 3) * 10,
      ) / 10,
    );
  };
  const parentWidth = 2;
  const scaledWidth = 2 / b;

  return (
    <svg
      className="hs159-graph"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Parent parabola and horizontal scale transformation"
      onPointerDown={onInteraction}
    >
      <defs>
        <marker
          id="hs159-arrow-ink"
          viewBox="0 0 8 8"
          refX="4"
          refY="4"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M8 1 2 4l6 3" fill="none" stroke="#4f6077" />
        </marker>
        <marker
          id="hs159-arrow-cyan"
          viewBox="0 0 8 8"
          refX="4"
          refY="4"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M8 1 2 4l6 3" fill="none" stroke="#079dac" />
        </marker>
        <marker
          id="hs159-arrow-orange"
          viewBox="0 0 8 8"
          refX="4"
          refY="4"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M8 1 2 4l6 3" fill="none" stroke="#df8700" />
        </marker>
        <pattern
          id="hs159-grid"
          width="42.14"
          height="55.14"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M42.14 0H0V55.14"
            fill="none"
            stroke="#e5ebf1"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect
        x={left}
        y={top}
        width={width - left - right}
        height={height - top - bottom}
        fill="url(#hs159-grid)"
      />
      <line
        x1={left}
        y1={py(0)}
        x2={width - right + 8}
        y2={py(0)}
        className="axis"
      />
      <line
        x1={px(0)}
        y1={height - bottom + 12}
        x2={px(0)}
        y2={8}
        className="axis"
      />
      <text x={width - right + 13} y={py(0) + 4} className="axis-label">
        x
      </text>
      <text x={px(0) + 8} y={12} className="axis-label">
        y
      </text>
      {[-6, -4, -2, 0, 2, 4, 6].map((x) => (
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
      {[1, 2, 3, 4, 5, 6].map((y) => (
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
      <path d={scaledPath} className="scaled-curve" />
      {levels.map((level) => {
        const parentX = Math.sqrt(level);
        const transformedX = parentX / b;
        return (
          <g key={level}>
            <line
              x1={px(-transformedX)}
              y1={py(level)}
              x2={px(transformedX)}
              y2={py(level)}
              className="level-line"
            />
            <circle
              cx={px(-parentX)}
              cy={py(level)}
              r="4"
              className="parent-dot"
            />
            <circle
              cx={px(parentX)}
              cy={py(level)}
              r="4"
              className="parent-dot"
            />
            <circle
              cx={px(-transformedX)}
              cy={py(level)}
              r="4.5"
              className="scaled-dot"
            />
            <circle
              cx={px(transformedX)}
              cy={py(level)}
              r="4.5"
              className="scaled-dot"
            />
            <rect
              x={left - 3}
              y={py(level) - 12}
              width="42"
              height="24"
              rx="6"
              className="level-chip"
            />
            <text
              x={left + 18}
              y={py(level) + 4}
              textAnchor="middle"
              className="level-label"
            >
              y = {level}
            </text>
          </g>
        );
      })}
      <g className="same-level-bracket">
        <path d={`M${width - right + 12} ${py(4)}h9v${py(1) - py(4)}h-9`} />
        <rect
          x={width - right + 29}
          y={(py(4) + py(1)) / 2 - 22}
          width="52"
          height="44"
          rx="8"
        />
        <text
          x={width - right + 55}
          y={(py(4) + py(1)) / 2 - 4}
          textAnchor="middle"
        >
          Same
        </text>
        <text
          x={width - right + 55}
          y={(py(4) + py(1)) / 2 + 12}
          textAnchor="middle"
        >
          y-levels
        </text>
      </g>
      <circle
        cx={px(probeX)}
        cy={py(probeLevel)}
        r="13"
        className="scale-handle"
        role="slider"
        tabIndex={0}
        aria-label="Drag horizontal scale point"
        aria-valuemin={0.2}
        aria-valuemax={3}
        aria-valuenow={b}
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
      <g className="width-rulers">
        <line
          x1={px(-1)}
          y1={py(0) + 36}
          x2={px(1)}
          y2={py(0) + 36}
          markerStart="url(#hs159-arrow-ink)"
          markerEnd="url(#hs159-arrow-ink)"
        />
        <text x={px(-1)} y={py(0) + 57} textAnchor="middle">
          −1
        </text>
        <text x={px(1)} y={py(0) + 57} textAnchor="middle">
          1
        </text>
        <text x={px(1) + 57} y={py(0) + 46} textAnchor="start">
          Width: {tidy(parentWidth)}
        </text>
        <line
          x1={px(-1 / b)}
          y1={py(0) + 72}
          x2={px(1 / b)}
          y2={py(0) + 72}
          className="scaled-width"
          markerStart="url(#hs159-arrow-cyan)"
          markerEnd="url(#hs159-arrow-cyan)"
        />
        <text x={px(-1 / b)} y={py(0) + 93} textAnchor="middle">
          −{tidy(1 / b)}
        </text>
        <text x={px(1 / b)} y={py(0) + 93} textAnchor="middle">
          {tidy(1 / b)}
        </text>
        <text x={px(1 / b) + 28} y={py(0) + 82} textAnchor="start">
          Width: {tidy(scaledWidth)}
        </text>
        <line
          x1={px(-2.4)}
          y1={py(0) + 116}
          x2={px(2.4)}
          y2={py(0) + 116}
          className="inverse-scale"
          markerStart="url(#hs159-arrow-orange)"
          markerEnd="url(#hs159-arrow-orange)"
        />
        <text x={px(0)} y={py(0) + 137} textAnchor="middle" className="ratio">
          Width × 1/{tidy(b)} ≈ {tidy(1 / b)}
        </text>
        <text
          x={px(0)}
          y={py(0) + 154}
          textAnchor="middle"
          className="inverse-note"
        >
          Horizontal distances scale inversely
        </text>
      </g>
    </svg>
  );
}

function CompressionPreview() {
  const path = (b: number) => {
    const parts: string[] = [];
    for (let index = 0; index <= 100; index += 1) {
      const x = -2.5 + (index / 100) * 5;
      const y = (b * x) ** 2;
      if (y > 5) continue;
      parts.push(`${parts.length ? "L" : "M"}${90 + x * 32},${115 - y * 18}`);
    }
    return parts.join(" ");
  };
  return (
    <svg
      viewBox="0 0 350 145"
      role="img"
      aria-label="Horizontal compression preview"
    >
      <line x1="18" y1="116" x2="183" y2="116" />
      <line x1="100" y1="20" x2="100" y2="132" />
      <path d={path(1)} className="parent" />
      <path d={path(1.8)} className="compressed" />
      <text x="205" y="37">
        g(x) = f(1.8x)
      </text>
      <text x="205" y="62">
        Horizontal compression
      </text>
      <text x="205" y="102">
        At the same y-levels, x-values are
      </text>
      <text x="205" y="121">
        closer to the y-axis.
      </text>
    </svg>
  );
}

export default function HorizontalStretchCompressionTargetLesson159({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [b, setB] = useState(0.7);
  const [levels, setLevels] = useState<number[]>([1, 4]);
  const [status, setStatus] = useState("");
  const act = () => onInteraction();
  const updateB = (value: number) => {
    setB(Math.round(clamp(value, 0.2, 3) * 10) / 10);
    act();
  };
  const reset = (notify = true) => {
    setB(0.7);
    setLevels([1, 4]);
    setStatus("");
    if (notify) act();
  };
  useEffect(() => reset(false), [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps
  const toggleLevel = (level: number) => {
    setLevels((current) =>
      current.includes(level)
        ? current.filter((value) => value !== level)
        : [...current, level],
    );
    act();
  };
  const share = async () => {
    await navigator.clipboard?.writeText(
      `g(x)=f(${tidy(b)}x), width ratio=${tidy(1 / b)}`,
    );
    setStatus("Scale state copied");
    act();
  };
  const stretch = b < 1;
  return (
    <div
      className="hs159-page"
      data-testid="graph-mockup-0216"
      data-dedicated-lesson="159"
      data-object-model="editable-inside-horizontal-scale-stretch-compression-mode-and-y-levels-pointer-keyboard-draggable-same-output-point-generated-parent-and-transformed-parabolas-reciprocal-width-rulers-input-table-preview-actions-and-navigation"
      data-b={b}
      data-mode={stretch ? "stretch" : "compression"}
      data-levels={[...levels].sort((x, y) => x - y).join(",")}
      data-width-ratio={1 / b}
      data-parent-x-at-4={2}
      data-scaled-x-at-4={2 / b}
      data-output-at-scaled-x={(b * (2 / b)) ** 2}
    >
      <header className="hs159-header">
        <div>
          <h1>Horizontal Stretch and Compression</h1>
          <p>Understand f(bx).</p>
          <nav>
            <b>♙ Intermediate</b>
            <b>ϟ Predict-Test-Explain</b>
            <b>▣ Dynamic Sliders / Graphing</b>
            <b>◷ 6-10 min</b>
          </nav>
        </div>
        <aside>
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
        </aside>
      </header>

      <section className="hs159-workspace">
        <article className="hs159-main">
          <small>GRAPH COMPARISON</small>
          <h2>
            Compare the parent function with a horizontal stretch and
            compression.
          </h2>
          <div className="hs159-legend">
            <span>
              <i />
              Parent f(x) = x²
            </span>
            <span>
              <i />
              g(x) = f({tidy(b)}x)
              <b>{stretch ? "Horizontal stretch" : "Horizontal compression"}</b>
            </span>
          </div>
          <HorizontalScaleGraph
            b={b}
            levels={levels}
            onScale={updateB}
            onInteraction={act}
          />
          <footer>
            <Calculator />
            <span>
              At the same y-levels, the x-values of g(x) = f({tidy(b)}x) are{" "}
              {stretch ? "farther from" : "closer to"} the y-axis.
            </span>
            <b>|b| {stretch ? "<" : ">"} 1</b>
            <i>→</i>
            <span>Horizontal {stretch ? "stretch" : "compression"}</span>
          </footer>
        </article>

        <aside className="hs159-rail">
          <section className="hs159-controls">
            <small>TRANSFORMATION CONTROLS</small>
            <header>
              <h2>Inside scale (b)</h2>
              <output>{tidy(b, 2)}</output>
            </header>
            <label>
              <button
                type="button"
                aria-label="Decrease inside scale"
                onClick={() => updateB(b - 0.1)}
              >
                −
              </button>
              <input
                aria-label="Horizontal inside scale"
                type="range"
                min="0.2"
                max="3"
                step="0.1"
                value={b}
                onChange={(event) => updateB(Number(event.target.value))}
              />
              <button
                type="button"
                aria-label="Increase inside scale"
                onClick={() => updateB(b + 0.1)}
              >
                +
              </button>
              <span>
                <i>0.2</i>
                <i>1</i>
                <i>3</i>
              </span>
            </label>
            <h3>Transformation type</h3>
            <nav>
              <button
                type="button"
                className={stretch ? "active" : ""}
                onClick={() => updateB(0.7)}
              >
                Stretch (|b| &lt; 1)
              </button>
              <button
                type="button"
                className={!stretch ? "active" : ""}
                onClick={() => updateB(1.8)}
              >
                Compression (|b| &gt; 1)
              </button>
            </nav>
            <h3>Sample y-levels to compare</h3>
            <div>
              {LEVELS.map((level) => (
                <button
                  key={level}
                  type="button"
                  className={levels.includes(level) ? "active" : ""}
                  onClick={() => toggleLevel(level)}
                >
                  {level}
                </button>
              ))}
            </div>
          </section>

          <section className="hs159-table">
            <small>SAME Y-LEVELS COMPARISON (b = {tidy(b, 2)})</small>
            <table>
              <thead>
                <tr>
                  <th>y-level</th>
                  <th>
                    Parent f(x) = x²
                    <br />
                    x-values (±x)
                  </th>
                  <th>
                    g(x) = f({tidy(b)}x)
                    <br />
                    x-values (±x)
                  </th>
                  <th>
                    Width ratio
                    <br />× 1/{tidy(b)}
                  </th>
                </tr>
              </thead>
              <tbody>
                {TABLE_LEVELS.map((level) => {
                  const root = Math.sqrt(level);
                  return (
                    <tr
                      key={level}
                      className={levels.includes(level) ? "selected" : ""}
                      onClick={() => toggleLevel(level)}
                    >
                      <td>{level}</td>
                      <td>±{tidy(root)}</td>
                      <td>±{tidy(root / b)}</td>
                      <td>{tidy(1 / b)}×</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>

          <section className="hs159-preview">
            <small>COMPRESSION PREVIEW (b = 1.8)</small>
            <CompressionPreview />
          </section>
        </aside>
      </section>

      <section className="hs159-concepts">
        <article>
          <i>
            <CircleGauge />
          </i>
          <p>
            <b>Inside multiplication changes input first</b>
            <span>
              g(x) = f(bx) multiplies the input x before
              <br />
              the function is applied.
            </span>
          </p>
          <footer>Affects horizontal distances (x-axis)</footer>
        </article>
        <article>
          <i>↔</i>
          <p>
            <b>Horizontal distances scale inversely</b>
            <span>
              All horizontal distances are multiplied by 1/|b|.
              <br />b &lt; 1 → stretch | b &gt; 1 → compression
            </span>
          </p>
          <footer>New width = Old width × 1/|b|</footer>
        </article>
        <article>
          <h3>
            <Star />
            Key takeaway
          </h3>
          <p>
            Inside scaling changes how far you move left or right
            <br />
            to get the same output y. It does not change the
            <br />
            output values, only the horizontal distances.
          </p>
        </article>
      </section>
    </div>
  );
}
