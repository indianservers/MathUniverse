import {
  ArrowLeftRight,
  ArrowUp,
  Lightbulb,
  MapPin,
  RefreshCcw,
  Share2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./VerticalTranslationTargetLesson156.css";

const SAMPLES = [-2, -1, 0, 1, 2];
const X_MIN = -5.5;
const X_MAX = 5.5;
const Y_MIN = -3;
const Y_MAX = 8;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const tidy = (value: number) => {
  const rounded = Math.round(value * 100) / 100;
  return Object.is(rounded, -0) ? "0" : String(rounded);
};

const signed = (value: number) =>
  value >= 0 ? `+ ${tidy(value)}` : `− ${tidy(Math.abs(value))}`;

function TranslationGraph({
  k,
  selectedX,
  showParent,
  showTransformed,
  onShift,
  onSample,
  onInteraction,
}: {
  k: number;
  selectedX: number;
  showParent: boolean;
  showTransformed: boolean;
  onShift: (value: number) => void;
  onSample: (value: number) => void;
  onInteraction: () => void;
}) {
  const width = 520;
  const height = 460;
  const left = 44;
  const right = 12;
  const top = 18;
  const bottom = 34;
  const px = (x: number) =>
    left + ((x - X_MIN) / (X_MAX - X_MIN)) * (width - left - right);
  const py = (y: number) =>
    top + ((Y_MAX - y) / (Y_MAX - Y_MIN)) * (height - top - bottom);
  const pathFor = (shift: number) => {
    const points: string[] = [];
    for (let index = 0; index <= 160; index += 1) {
      const x = -5 + (index / 160) * 10;
      const y = x * x + shift;
      if (y < Y_MIN - 1 || y > Y_MAX + 1) continue;
      points.push(
        `${points.length ? "L" : "M"}${px(x).toFixed(2)},${py(y).toFixed(2)}`,
      );
    }
    return points.join(" ");
  };
  const parentPath = useMemo(() => pathFor(0), []); // eslint-disable-line react-hooks/exhaustive-deps
  const transformedPath = useMemo(() => pathFor(k), [k]); // eslint-disable-line react-hooks/exhaustive-deps
  const updateShiftFromPointer = (event: PointerEvent<SVGCircleElement>) => {
    const svg = event.currentTarget.ownerSVGElement;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const svgY = ((event.clientY - rect.top) / rect.height) * height;
    const graphY =
      Y_MAX - ((svgY - top) / (height - top - bottom)) * (Y_MAX - Y_MIN);
    onShift(Math.round(clamp(graphY, -5, 5)));
  };
  const shiftKey = (event: KeyboardEvent<SVGCircleElement>) => {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    event.preventDefault();
    onShift(clamp(k + (event.key === "ArrowUp" ? 1 : -1), -5, 5));
  };
  const sampleFromPointer = (event: PointerEvent<SVGCircleElement>) => {
    const svg = event.currentTarget.ownerSVGElement;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const svgX = ((event.clientX - rect.left) / rect.width) * width;
    const graphX =
      X_MIN + ((svgX - left) / (width - left - right)) * (X_MAX - X_MIN);
    onSample(clamp(Math.round(graphX), -2, 2));
  };
  const sampleKey = (event: KeyboardEvent<SVGCircleElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    onSample(clamp(selectedX + (event.key === "ArrowRight" ? 1 : -1), -2, 2));
  };
  const selectedParent = selectedX * selectedX;
  const selectedOutput = selectedParent + k;

  return (
    <svg
      className="vt156-graph"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Parent parabola and vertically translated parabola"
      onPointerDown={onInteraction}
    >
      <defs>
        <pattern
          id="vt156-grid"
          width="42.18"
          height="37.09"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M42.18 0H0V37.09"
            fill="none"
            stroke="#e5ebf1"
            strokeWidth="1"
          />
        </pattern>
        <marker
          id="vt156-arrow"
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
        fill="url(#vt156-grid)"
      />
      <line x1={left} y1={py(0)} x2={width - 8} y2={py(0)} className="axis" />
      <line
        x1={px(0)}
        y1={height - bottom}
        x2={px(0)}
        y2={12}
        className="axis"
      />
      <text x={width - 9} y={py(0) - 6} className="axis-label">
        x
      </text>
      <text x={px(0) - 7} y={14} className="axis-label">
        y
      </text>
      {[-4, -2, 0, 2, 4].map((x) => (
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
      {[-2, 2, 4, 6].map((y) => (
        <text
          key={`y-${y}`}
          x={px(0) - 13}
          y={py(y) + 4}
          textAnchor="end"
          className="tick"
        >
          {y}
        </text>
      ))}
      {showParent && <path d={parentPath} className="parent-curve" />}
      {showTransformed && (
        <path d={transformedPath} className="translated-curve" />
      )}
      {showParent &&
        showTransformed &&
        [-2, 0, 2].map((x) => {
          const y = x * x;
          return (
            <g key={`shift-${x}`}>
              <line
                x1={px(x)}
                y1={py(y)}
                x2={px(x)}
                y2={py(y + k)}
                className="shift-arrow"
                markerEnd="url(#vt156-arrow)"
              />
              <text
                x={px(x) + 9}
                y={(py(y) + py(y + k)) / 2 + 4}
                className="shift-label"
              >
                k = {tidy(k)}
              </text>
              <line
                x1={px(x)}
                y1={py(0)}
                x2={px(x)}
                y2={py(y)}
                className="projection"
              />
            </g>
          );
        })}
      {showTransformed && (
        <>
          <circle
            cx={px(0)}
            cy={py(k)}
            r="11"
            className="shift-handle-hit"
            role="slider"
            tabIndex={0}
            aria-label="Drag translated parabola vertically"
            aria-valuemin={-5}
            aria-valuemax={5}
            aria-valuenow={k}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              updateShiftFromPointer(event);
            }}
            onPointerMove={(event) => {
              if (event.currentTarget.hasPointerCapture(event.pointerId))
                updateShiftFromPointer(event);
            }}
            onKeyDown={shiftKey}
          />
          <circle
            cx={px(selectedX)}
            cy={py(selectedOutput)}
            r="10"
            className="sample-handle-hit"
            role="slider"
            tabIndex={0}
            aria-label="Drag vertical translation sample point"
            aria-valuemin={-2}
            aria-valuemax={2}
            aria-valuenow={selectedX}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              sampleFromPointer(event);
            }}
            onPointerMove={(event) => {
              if (event.currentTarget.hasPointerCapture(event.pointerId))
                sampleFromPointer(event);
            }}
            onKeyDown={sampleKey}
          />
          <circle
            cx={px(selectedX)}
            cy={py(selectedOutput)}
            r="4.5"
            className="sample-dot"
            pointerEvents="none"
          />
          <text
            x={px(selectedX) + 9}
            y={py(selectedOutput) - 9}
            className="sample-label"
            pointerEvents="none"
          >
            ({selectedX}, {tidy(selectedOutput)})
          </text>
        </>
      )}
      {showParent && (
        <circle
          cx={px(selectedX)}
          cy={py(selectedParent)}
          r="3.5"
          className="parent-dot"
        />
      )}
    </svg>
  );
}

export default function VerticalTranslationTargetLesson156({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [k, setK] = useState(2);
  const [selectedX, setSelectedX] = useState(2);
  const [showParent, setShowParent] = useState(true);
  const [showTransformed, setShowTransformed] = useState(true);
  const [shareStatus, setShareStatus] = useState("");
  const act = () => onInteraction();
  const updateK = (value: number) => {
    setK(clamp(Math.round(value), -5, 5));
    act();
  };
  const updateSample = (value: number) => {
    setSelectedX(clamp(Math.round(value), -2, 2));
    act();
  };
  const reset = (notify = true) => {
    setK(2);
    setSelectedX(2);
    setShowParent(true);
    setShowTransformed(true);
    setShareStatus("");
    if (notify) act();
  };
  useEffect(() => reset(false), [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps
  const rows = SAMPLES.map((x) => ({
    x,
    parent: x * x,
    transformed: x * x + k,
  }));
  const direction = k > 0 ? "up" : k < 0 ? "down" : "in place";
  const share = async () => {
    const text = `g(x)=x^2 ${signed(k)}; selected x=${selectedX}`;
    await navigator.clipboard?.writeText(text);
    setShareStatus("Translation state copied");
    act();
  };

  return (
    <div
      className="vt156-page"
      data-testid="graph-mockup-0213"
      data-dedicated-lesson="156"
      data-object-model="editable-vertical-shift-parent-and-transformed-visibility-pointer-keyboard-draggable-parabola-and-sample-probe-generated-curves-arrows-vertex-table-and-output-invariance"
      data-k={k}
      data-selected-x={selectedX}
      data-parent-visible={showParent}
      data-transformed-visible={showTransformed}
      data-selected-parent={selectedX * selectedX}
      data-selected-output={selectedX * selectedX + k}
    >
      <main className="vt156-surface">
        <header className="vt156-header">
          <span>GRAPHS AND FUNCTIONS</span>
          <h1>Vertical Translation</h1>
          <p>Understand f(x)+k.</p>
          <div className="vt156-meta">
            <b>♙ Intermediate</b>
            <b>ϟ Predict-Test-Explain</b>
            <b>▣ Dynamic Sliders / Graphing</b>
            <b>◷ 6-10 min</b>
          </div>
        </header>

        <section className="vt156-command">
          <div>
            <strong>g(x) = f(x) {signed(k)}</strong>
            <i>→</i>
            <span>
              Move {direction} {Math.abs(k)}
            </span>
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
          </aside>
          {shareStatus && <output role="status">{shareStatus}</output>}
        </section>

        <section className="vt156-workspace">
          <article className="vt156-graph-card">
            <h2>Graph: Parent vs. Vertical Translation</h2>
            <div className="vt156-legend">
              <span>
                <i className="parent" />
                Parent: <em>f(x) = x²</em>
              </span>
              <span>
                <i className="translated" />
                Transformed: <em>g(x) = x² {signed(k)}</em>
              </span>
            </div>
            <TranslationGraph
              k={k}
              selectedX={selectedX}
              showParent={showParent}
              showTransformed={showTransformed}
              onShift={updateK}
              onSample={updateSample}
              onInteraction={act}
            />
            <footer className="vt156-facts">
              <span>
                <i>
                  <ArrowUp />
                </i>
                <b>
                  Move {direction} {Math.abs(k)}
                </b>
                <small>k = {tidy(k)}</small>
              </span>
              <span>
                <i>⋮</i>
                <b>Same x-values</b>
                <small>x unchanged</small>
              </span>
              <span>
                <i>↗</i>
                <b>Every y-value {signed(k)}</b>
                <small>f(x) → f(x) {signed(k)}</small>
              </span>
              <span>
                <i>
                  <MapPin />
                </i>
                <b>Vertex</b>
                <small>(0,0) → (0,{tidy(k)})</small>
              </span>
            </footer>
          </article>

          <aside className="vt156-rail">
            <section className="vt156-controls">
              <h2>Controls</h2>
              <label>
                <span>Vertical shift (k)</span>
                <em>g(x) = f(x) + k</em>
                <div>
                  <input
                    aria-label="Vertical translation amount"
                    type="range"
                    min="-5"
                    max="5"
                    step="1"
                    value={k}
                    onChange={(event) => updateK(Number(event.target.value))}
                  />
                  <output>{tidy(k)}</output>
                </div>
                <small>
                  <span>-5</span>
                  <span>0</span>
                  <b>{tidy(k)}</b>
                  <span>5</span>
                </small>
              </label>
              <div className="vt156-toggles">
                <label>
                  Show parent <em>f(x) = x²</em>
                  <input
                    aria-label="Show parent parabola"
                    type="checkbox"
                    checked={showParent}
                    onChange={(event) => {
                      setShowParent(event.target.checked);
                      act();
                    }}
                  />
                  <i />
                </label>
                <label>
                  Show transformed <em>g(x) = x² {signed(k)}</em>
                  <input
                    aria-label="Show translated parabola"
                    type="checkbox"
                    checked={showTransformed}
                    onChange={(event) => {
                      setShowTransformed(event.target.checked);
                      act();
                    }}
                  />
                  <i />
                </label>
              </div>
              <h3>Sample x-values</h3>
              <nav>
                {SAMPLES.map((x) => (
                  <button
                    key={x}
                    type="button"
                    className={selectedX === x ? "active" : ""}
                    onClick={() => updateSample(x)}
                  >
                    {x}
                  </button>
                ))}
              </nav>
            </section>

            <section className="vt156-values">
              <h2>Function values</h2>
              <table>
                <thead>
                  <tr>
                    <th>x</th>
                    <th>f(x) = x²</th>
                    <th>g(x) = x² {signed(k)}</th>
                    <th>Change</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr
                      key={row.x}
                      className={row.x === selectedX ? "selected" : ""}
                      onClick={() => updateSample(row.x)}
                    >
                      <td>{row.x}</td>
                      <td>{row.parent}</td>
                      <td>{tidy(row.transformed)}</td>
                      <td>{signed(k)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p>
                Every output {k >= 0 ? "increases" : "decreases"} by{" "}
                {Math.abs(k)}.<br />
                x-values stay the same.
              </p>
            </section>
          </aside>
        </section>

        <section className="vt156-explain">
          <h2>What happens in a vertical translation?</h2>
          <div>
            <article>
              <i>
                <ArrowUp />
              </i>
              <p>
                <b>Add k outside the function</b>
                <em>g(x) = f(x) + k</em>
                <span>Adds k to every output (y-value).</span>
              </p>
            </article>
            <article>
              <i>⋮</i>
              <p>
                <b>Vertical movement only</b>
                <span>
                  Graph moves up if k &gt; 0,
                  <br />
                  down if k &lt; 0.
                </span>
              </p>
            </article>
            <article>
              <i>
                <ArrowLeftRight />
              </i>
              <p>
                <b>x-values stay fixed</b>
                <span>
                  Points move vertically;
                  <br />
                  x-locations do not change.
                </span>
              </p>
            </article>
          </div>
          <footer>
            <Lightbulb />
            <b>Key idea:</b> Vertical translation changes outputs by a constant
            amount, without affecting the inputs.
          </footer>
        </section>
      </main>
    </div>
  );
}
