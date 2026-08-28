import { ArrowDown, RefreshCcw, RotateCcw, X } from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import type { LessonAdapterProps } from "../types";
import "./ReflectionXAxisTargetLesson160.css";

const SAMPLES = [-2, 0, 2];
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const rounded = (value: number, step: number) =>
  Math.round(value / step) * step;
const tidy = (value: number, places = 2) => {
  const result = Math.round(value * 10 ** places) / 10 ** places;
  return Object.is(result, -0) ? "0" : String(result);
};
const coordinate = (x: number, y: number) => `(${tidy(x)}, ${tidy(y)})`;

function ReflectionGraph({
  scale,
  shift,
  sample,
  onScale,
  onShift,
  onSample,
  onInteraction,
}: {
  scale: number;
  shift: number;
  sample: number;
  onScale: (value: number) => void;
  onShift: (value: number) => void;
  onSample: (value: number) => void;
  onInteraction: () => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const width = 560;
  const height = 500;
  const centerX = 274;
  const centerY = 243;
  const xScale = 64;
  const yScale = 48;
  const px = (x: number) => centerX + x * xScale;
  const py = (y: number) => centerY - y * yScale;
  const parent = (x: number) => x * x;
  const reflected = (x: number) => -scale * x * x + shift;
  const path = (fn: (x: number) => number) => {
    const points: string[] = [];
    for (let index = 0; index <= 300; index += 1) {
      const x = -4.5 + index * 0.03;
      const y = fn(x);
      if (y < -5.2 || y > 5.2) continue;
      points.push(
        `${points.length ? "L" : "M"}${px(x).toFixed(2)},${py(y).toFixed(2)}`,
      );
    }
    return points.join(" ");
  };
  const parentPath = useMemo(() => path(parent), []); // eslint-disable-line react-hooks/exhaustive-deps
  const reflectedPath = useMemo(
    () => path(reflected),
    [scale, shift], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const updateFromPointer = (event: PointerEvent<SVGCircleElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const box = svg.getBoundingClientRect();
    const y =
      (centerY - ((event.clientY - box.top) / box.height) * height) / yScale;
    if (Math.abs(sample) < 0.01) {
      onShift(rounded(clamp(y, -5, 5), 0.5));
      return;
    }
    onScale(rounded(clamp((shift - y) / (sample * sample), 0.25, 3), 0.25));
  };
  const pointKey = (event: KeyboardEvent<SVGCircleElement>) => {
    if (
      !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)
    )
      return;
    event.preventDefault();
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      const direction = event.key === "ArrowRight" ? 1 : -1;
      onSample(clamp(rounded(sample + direction * 0.5, 0.5), -4, 4));
      return;
    }
    const direction = event.key === "ArrowDown" ? 1 : -1;
    if (Math.abs(sample) < 0.01) {
      onShift(rounded(clamp(shift + direction * 0.5, -5, 5), 0.5));
    } else {
      onScale(rounded(clamp(scale + direction * 0.25, 0.25, 3), 0.25));
    }
  };

  return (
    <svg
      ref={svgRef}
      className="rx160-graph"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Parent parabola reflected across the x-axis"
      onPointerDown={onInteraction}
    >
      <defs>
        <pattern
          id="rx160-grid"
          width="59"
          height="48"
          patternUnits="userSpaceOnUse"
        >
          <path d="M59 0H0V48" fill="none" stroke="#e6ebf1" strokeWidth="1" />
        </pattern>
        <marker
          id="rx160-axis-arrow"
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0 0 6 3 0 6Z" fill="#273650" />
        </marker>
      </defs>
      <rect width={width} height={height} fill="url(#rx160-grid)" />
      <line
        x1="5"
        x2="555"
        y1={centerY}
        y2={centerY}
        className="axis"
        markerEnd="url(#rx160-axis-arrow)"
      />
      <line
        x1={centerX}
        x2={centerX}
        y1="496"
        y2="5"
        className="axis"
        markerEnd="url(#rx160-axis-arrow)"
      />
      <text x="548" y={centerY - 10} className="axis-label">
        x
      </text>
      <text x={centerX + 10} y="16" className="axis-label">
        y
      </text>
      {[-4, -3, -2, -1, 1, 2, 3, 4].map((tick) => (
        <text
          key={`x-${tick}`}
          x={px(tick)}
          y={centerY + 23}
          textAnchor="middle"
          className="tick"
        >
          {tick}
        </text>
      ))}
      {[-4, -3, -2, -1, 1, 2, 3, 4].map((tick) => (
        <text
          key={`y-${tick}`}
          x={centerX - 14}
          y={py(tick) + 4}
          textAnchor="end"
          className="tick"
        >
          {tick}
        </text>
      ))}
      <path d={parentPath} className="parent-curve" />
      <path d={reflectedPath} className="reflected-curve" />
      {SAMPLES.map((x) => {
        const parentY = parent(x);
        const reflectedY = reflected(x);
        return (
          <g key={x}>
            <line
              x1={px(x)}
              x2={px(x)}
              y1={py(parentY)}
              y2={py(reflectedY)}
              className="mirror-line"
            />
            <circle
              cx={px(x)}
              cy={py(parentY)}
              r="5.5"
              className="parent-point"
            />
            <circle
              cx={px(x)}
              cy={py(reflectedY)}
              r="6"
              className="reflected-point"
            />
            <text
              x={px(x) + (x < 0 ? -13 : 13)}
              y={py(parentY) - 8}
              textAnchor={x < 0 ? "end" : "start"}
              className="parent-label"
            >
              {coordinate(x, parentY)}
            </text>
            <text
              x={px(x) + (x < 0 ? -13 : 13)}
              y={py(reflectedY) + 17}
              textAnchor={x < 0 ? "end" : "start"}
              className="reflected-label"
            >
              {coordinate(x, reflectedY)}
            </text>
          </g>
        );
      })}
      <circle
        cx={px(sample)}
        cy={py(reflected(sample))}
        r="15"
        className="drag-point"
        role="slider"
        tabIndex={0}
        aria-label="Drag reflected point"
        aria-valuemin={0.25}
        aria-valuemax={3}
        aria-valuenow={scale}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          updateFromPointer(event);
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId))
            updateFromPointer(event);
        }}
        onKeyDown={pointKey}
      />
    </svg>
  );
}

export default function ReflectionXAxisTargetLesson160({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [scale, setScale] = useState(1);
  const [shift, setShift] = useState(0);
  const [sample, setSample] = useState(-2);
  const act = () => onInteraction();
  const updateScale = (value: number) => {
    setScale(rounded(clamp(value, 0.25, 3), 0.25));
    act();
  };
  const updateShift = (value: number) => {
    setShift(rounded(clamp(value, -5, 5), 0.5));
    act();
  };
  const updateSample = (value: number) => {
    setSample(rounded(clamp(value, -4, 4), 0.5));
    act();
  };
  const reset = (notify = true) => {
    setScale(1);
    setShift(0);
    setSample(-2);
    if (notify) act();
  };
  useEffect(() => reset(false), [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps
  const reflectedAtSample = -scale * sample * sample + shift;

  return (
    <div
      className="rx160-page"
      data-testid="graph-mockup-0217"
      data-dedicated-lesson="160"
      data-object-model="editable-x-axis-reflection-scale-shift-and-sample-pointer-keyboard-draggable-reflected-point-generated-parent-and-reflected-parabolas-mirror-lines-point-mapping-rule-cards-and-navigation"
      data-scale={scale}
      data-shift={shift}
      data-sample={sample}
      data-parent-output={sample * sample}
      data-reflected-output={reflectedAtSample}
      data-x-unchanged="true"
    >
      <section className="rx160-surface">
        <header className="rx160-header">
          <div className="rx160-kickers">
            <b>GRAPHS AND FUNCTIONS</b>
            <b>FUNCTION TRANSFORMATIONS</b>
          </div>
          <h1>Reflection in x-Axis</h1>
          <p>Understand -f(x).</p>
          <nav>
            <b>♙ Intermediate</b>
            <b>ϟ Predict-Test-Explain</b>
            <b>▣ Dynamic Sliders / Graphing</b>
            <b>◷ 6-10 min</b>
          </nav>
          <h2>
            g(x) = -{scale === 1 ? "" : `${tidy(scale)}·`}f(x)
            {shift === 0
              ? ""
              : shift > 0
                ? ` + ${tidy(shift)}`
                : ` - ${tidy(Math.abs(shift))}`}
          </h2>
          <h3>Mirror across x-axis</h3>
        </header>

        <section className="rx160-workspace">
          <article className="rx160-plot">
            <div className="rx160-legend">
              <span>
                <i />
                Parent: <b>f(x) = x²</b>
              </span>
              <span>
                <i />
                Reflected:{" "}
                <b>
                  g(x) = -{scale === 1 ? "" : `${tidy(scale)}·`}x²
                  {shift === 0
                    ? ""
                    : shift > 0
                      ? ` + ${tidy(shift)}`
                      : ` - ${tidy(Math.abs(shift))}`}
                </b>
              </span>
            </div>
            <ReflectionGraph
              scale={scale}
              shift={shift}
              sample={sample}
              onScale={updateScale}
              onShift={updateShift}
              onSample={updateSample}
              onInteraction={act}
            />
            <footer>
              <span>
                <i />
                x-axis is the mirror line
              </span>
              <span>
                <i />
                Parent: <b>f(x) = x²</b>
              </span>
              <span>
                <i />
                Reflected: <b>g(x) = -f(x)</b>
              </span>
            </footer>
          </article>

          <aside className="rx160-rail">
            <section className="rx160-controls">
              <header>
                <h2>Transform Controls</h2>
                <button
                  type="button"
                  aria-label="Reset transform controls"
                  onClick={() => reset()}
                >
                  <RotateCcw />
                </button>
              </header>
              <label>
                <span>Reflection scale</span>
                <input
                  type="range"
                  min="0.25"
                  max="3"
                  step="0.25"
                  value={scale}
                  aria-label="Reflection scale"
                  onChange={(event) => updateScale(Number(event.target.value))}
                />
                <output>{tidy(scale)}</output>
                <small>
                  <i>0.25</i>
                  <i>3</i>
                </small>
              </label>
              <label>
                <span>Vertical shift</span>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.5"
                  value={shift}
                  aria-label="Vertical shift"
                  onChange={(event) => updateShift(Number(event.target.value))}
                />
                <output>{tidy(shift)}</output>
                <small>
                  <i>-5</i>
                  <i>5</i>
                </small>
              </label>
              <div className="rx160-samples">
                <span>Sample x value</span>
                <nav>
                  {SAMPLES.map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={sample === value ? "active" : ""}
                      onClick={() => updateSample(value)}
                    >
                      {value}
                    </button>
                  ))}
                </nav>
                <output>{tidy(sample)}</output>
              </div>
            </section>

            <section className="rx160-table">
              <h2>Point Mapping</h2>
              <table>
                <thead>
                  <tr>
                    <th>x</th>
                    <th>f(x) = x² (parent)</th>
                    <th>
                      g(x) = -{scale === 1 ? "" : `${tidy(scale)}·`}f(x)
                      {shift === 0
                        ? ""
                        : shift > 0
                          ? ` + ${tidy(shift)}`
                          : ` - ${tidy(Math.abs(shift))}`}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {SAMPLES.map((x) => (
                    <tr
                      key={x}
                      className={sample === x ? "selected" : ""}
                      onClick={() => updateSample(x)}
                    >
                      <td>{x}</td>
                      <td>{coordinate(x, x * x)}</td>
                      <td>{coordinate(x, -scale * x * x + shift)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="rx160-rule">
              <h2>Key Rule</h2>
              <p>
                <i>
                  <X />
                </i>
                <span>x unchanged</span>
              </p>
              <p>
                <i>y</i>
                <span>
                  y →{" "}
                  {shift === 0
                    ? "-y"
                    : `-${tidy(scale)}y ${shift > 0 ? "+" : "-"} ${tidy(Math.abs(shift))}`}
                </span>
              </p>
              <p>
                <i>
                  <ArrowDown />
                </i>
                <span>Up becomes down</span>
              </p>
            </section>
          </aside>
        </section>

        <section className="rx160-concepts">
          <article>
            <i>
              <RefreshCcw />
            </i>
            <p>
              <b>Mirror across x-axis</b>
              <span>
                Every point (x, y) maps to (x, -y).
                <br />
                The x-value stays the same.
              </span>
            </p>
          </article>
          <article>
            <i>
              <X />
            </i>
            <p>
              <b>x unchanged</b>
              <span>
                The horizontal position of points
                <br />
                does not change.
              </span>
            </p>
          </article>
          <article>
            <i>
              <ArrowDown />
            </i>
            <p>
              <b>y → -y</b>
              <span>
                All y-values change sign.
                <br />
                Up becomes down.
              </span>
            </p>
          </article>
        </section>
      </section>
    </div>
  );
}
