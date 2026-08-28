import { ArrowLeftRight, Axis3D, Grid3X3, Route, Table2 } from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import type { LessonAdapterProps } from "../types";
import "./ReflectionYAxisTargetLesson161.css";

type View = "Graph View" | "Table View" | "Step View";
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const snap = (value: number, step: number) => Math.round(value / step) * step;
const tidy = (value: number, places = 2) => {
  const rounded = Math.round(value * 10 ** places) / 10 ** places;
  return Object.is(rounded, -0) ? "0" : String(rounded);
};
const cubeRoot = (value: number) => Math.cbrt(value);
const coordinate = (x: number, y: number) => `(${tidy(x)}, ${tidy(y)})`;

function YReflectionGraph({
  preShift,
  scale,
  yLevel,
  onScale,
  onYLevel,
  onInteraction,
}: {
  preShift: number;
  scale: number;
  yLevel: number;
  onScale: (value: number) => void;
  onYLevel: (value: number) => void;
  onInteraction: () => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const width = 560;
  const height = 510;
  const centerX = 280;
  const centerY = 248;
  const xScale = 88;
  const yScale = 10.2;
  const px = (x: number) => centerX + x * xScale;
  const py = (y: number) => centerY - y * yScale;
  const parent = (x: number) => x ** 3 + preShift;
  const reflected = (x: number) => (-scale * x) ** 3 + preShift;
  const path = (fn: (x: number) => number) => {
    const points: string[] = [];
    for (let index = 0; index <= 300; index += 1) {
      const x = -3.15 + index * 0.021;
      const y = fn(x);
      if (y < -25.5 || y > 25.5) continue;
      points.push(
        `${points.length ? "L" : "M"}${px(x).toFixed(2)},${py(y).toFixed(2)}`,
      );
    }
    return points.join(" ");
  };
  const parentPath = useMemo(
    () => path(parent),
    [preShift], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const reflectedPath = useMemo(
    () => path(reflected),
    [preShift, scale], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const leftX = cubeRoot(yLevel - preShift);
  const rightX = -leftX / scale;
  const secondaryY = yLevel === -1 ? -8 : -1;
  const secondaryLeft = cubeRoot(secondaryY - preShift);
  const secondaryRight = -secondaryLeft / scale;
  const updateFromPointer = (event: PointerEvent<SVGCircleElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const box = svg.getBoundingClientRect();
    const svgX = ((event.clientX - box.left) / box.width) * width;
    const svgY = ((event.clientY - box.top) / box.height) * height;
    const nextY = snap(clamp((centerY - svgY) / yScale, -15, 15), 1);
    const sourceX = cubeRoot(nextY - preShift);
    const graphX = (svgX - centerX) / xScale;
    if (Math.abs(graphX) > 0.15 && Math.abs(sourceX) > 0.05) {
      onScale(snap(clamp(Math.abs(sourceX / graphX), 0.25, 3), 0.25));
    }
    onYLevel(nextY);
  };
  const pointKey = (event: KeyboardEvent<SVGCircleElement>) => {
    if (
      !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)
    )
      return;
    event.preventDefault();
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      onYLevel(clamp(yLevel + (event.key === "ArrowUp" ? 1 : -1), -15, 15));
    } else {
      onScale(
        snap(
          clamp(scale + (event.key === "ArrowLeft" ? 0.25 : -0.25), 0.25, 3),
          0.25,
        ),
      );
    }
  };

  return (
    <svg
      ref={svgRef}
      className="ry161-graph"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Cubic function reflected across the y-axis"
      onPointerDown={onInteraction}
    >
      <defs>
        <pattern
          id="ry161-grid"
          width="44"
          height="51"
          patternUnits="userSpaceOnUse"
        >
          <path d="M44 0H0V51" fill="none" stroke="#e8edf2" strokeWidth="1" />
        </pattern>
        <marker
          id="ry161-axis-arrow"
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0 0 6 3 0 6Z" fill="#273650" />
        </marker>
      </defs>
      <rect width={width} height={height} fill="url(#ry161-grid)" />
      <line
        x1="4"
        x2="556"
        y1={centerY}
        y2={centerY}
        className="axis"
        markerEnd="url(#ry161-axis-arrow)"
      />
      <line
        x1={centerX}
        x2={centerX}
        y1="506"
        y2="5"
        className="axis"
        markerEnd="url(#ry161-axis-arrow)"
      />
      <text x="548" y={centerY - 10} className="axis-label">
        x
      </text>
      <text x={centerX + 10} y="15" className="axis-label">
        y
      </text>
      {[-3, -2, -1, 0, 1, 2, 3].map((tick) => (
        <text
          key={`x-${tick}`}
          x={px(tick)}
          y={centerY + 22}
          textAnchor="middle"
          className="tick"
        >
          {tick}
        </text>
      ))}
      {[-20, -10, 10, 20].map((tick) => (
        <text
          key={`y-${tick}`}
          x={centerX - 13}
          y={py(tick) + 4}
          textAnchor="end"
          className="tick"
        >
          {tick}
        </text>
      ))}
      <path d={parentPath} className="parent-curve" />
      <path d={reflectedPath} className="reflected-curve" />
      {[
        [leftX, rightX, yLevel],
        [secondaryLeft, secondaryRight, secondaryY],
      ].map(([left, right, y]) => (
        <g key={y}>
          <line
            x1={px(left)}
            x2={px(right)}
            y1={py(y)}
            y2={py(y)}
            className="pair-line"
          />
          <circle cx={px(left)} cy={py(y)} r="6" className="parent-point" />
          <circle cx={px(right)} cy={py(y)} r="6" className="reflected-point" />
          <text
            x={px(left) - 13}
            y={py(y) + 5}
            textAnchor="end"
            className="point-label"
          >
            {coordinate(left, y)}
          </text>
          <text
            x={px(right) + 13}
            y={py(y) + 5}
            textAnchor="start"
            className="point-label"
          >
            {coordinate(right, y)}
          </text>
        </g>
      ))}
      <circle
        cx={px(rightX)}
        cy={py(yLevel)}
        r="15"
        className="drag-point"
        role="slider"
        tabIndex={0}
        aria-label="Drag reflected same-y point"
        aria-valuemin={-15}
        aria-valuemax={15}
        aria-valuenow={yLevel}
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

export default function ReflectionYAxisTargetLesson161({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [preShift, setPreShift] = useState(0);
  const [scale, setScale] = useState(1);
  const [yLevel, setYLevel] = useState(-8);
  const [view, setView] = useState<View>("Graph View");
  const act = () => onInteraction();
  const updatePreShift = (value: number) => {
    setPreShift(snap(clamp(value, -5, 5), 0.5));
    act();
  };
  const updateScale = (value: number) => {
    setScale(snap(clamp(value, 0.25, 3), 0.25));
    act();
  };
  const updateYLevel = (value: number) => {
    setYLevel(snap(clamp(value, -15, 15), 1));
    act();
  };
  const reset = (notify = true) => {
    setPreShift(0);
    setScale(1);
    setYLevel(-8);
    setView("Graph View");
    if (notify) act();
  };
  useEffect(() => reset(false), [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps
  const pairFor = (y: number) => {
    const left = cubeRoot(y - preShift);
    return { left, right: -left / scale, y };
  };
  const pairs = [pairFor(yLevel), pairFor(yLevel === -1 ? -8 : -1)];
  return (
    <div
      className="ry161-page"
      data-testid="graph-mockup-0218"
      data-dedicated-lesson="161"
      data-object-model="editable-y-axis-reflection-pre-shift-horizontal-scale-and-y-level-pointer-keyboard-draggable-same-output-point-generated-cubic-curves-horizontal-pairs-table-step-views-concepts-and-rule"
      data-pre-shift={preShift}
      data-scale={scale}
      data-y-level={yLevel}
      data-left-x={pairs[0].left}
      data-right-x={pairs[0].right}
      data-left-output={pairs[0].left ** 3 + preShift}
      data-right-output={(-scale * pairs[0].right) ** 3 + preShift}
      data-view={view}
    >
      <section className="ry161-surface">
        <header className="ry161-header">
          <div>
            <b>GRAPHS AND FUNCTIONS</b>
            <b>FUNCTION TRANSFORMATIONS</b>
          </div>
          <h1>Reflection in y-Axis</h1>
          <p>Understand f(-x).</p>
          <nav>
            <b>♙ Intermediate</b>
            <b>ϟ Predict-Test-Explain</b>
            <b>▣ Dynamic Sliders / Graphing</b>
            <b>◷ 6-10 min</b>
          </nav>
        </header>
        <section className="ry161-viewbar">
          <h2>Choose view</h2>
          <nav>
            {(
              [
                ["Graph View", Route],
                ["Table View", Table2],
                ["Step View", Grid3X3],
              ] as [View, typeof Route][]
            ).map(([label, Icon]) => (
              <button
                key={label}
                type="button"
                className={view === label ? "active" : ""}
                onClick={() => {
                  setView(label);
                  act();
                }}
              >
                <Icon />
                {label}
              </button>
            ))}
          </nav>
          <output>g(x) = f(-{scale === 1 ? "" : tidy(scale)}x)</output>
        </section>
        <section className="ry161-workspace">
          <article className="ry161-plot">
            <h2>
              {view === "Graph View"
                ? "Parent and reflected functions"
                : view === "Table View"
                  ? "Same-output mapping table"
                  : "Reflection construction steps"}
            </h2>
            <div className="ry161-legend">
              <span>
                <i />
                f(x) = x³
                {preShift === 0
                  ? ""
                  : preShift > 0
                    ? ` + ${tidy(preShift)}`
                    : ` - ${tidy(Math.abs(preShift))}`}{" "}
                (parent)
              </span>
              <span>
                <i />
                g(x) = f(-{scale === 1 ? "" : tidy(scale)}x) (reflected)
              </span>
            </div>
            <YReflectionGraph
              preShift={preShift}
              scale={scale}
              yLevel={yLevel}
              onScale={updateScale}
              onYLevel={updateYLevel}
              onInteraction={act}
            />
            <footer>
              <span>
                <i />
                g(x) = f(-x) = -x³<small>Reflected across y-axis</small>
              </span>
              <span>
                <i />
                f(x) = x³<small>Parent function</small>
              </span>
              <span>
                <i />
                Horizontal segments<small>Show equal y-values</small>
              </span>
            </footer>
          </article>
          <aside className="ry161-rail">
            <h2>Controls</h2>
            <label>
              <span>Pre-shift (vertical)</span>
              <input
                type="range"
                min="-5"
                max="5"
                step="0.5"
                value={preShift}
                aria-label="Vertical pre-shift"
                onChange={(event) => updatePreShift(Number(event.target.value))}
              />
              <output>{tidy(preShift)}</output>
              <small>
                <i>-5</i>
                <i>5</i>
              </small>
            </label>
            <label>
              <span>Reflection scale (horizontal)</span>
              <input
                type="range"
                min="0.25"
                max="3"
                step="0.25"
                value={scale}
                aria-label="Horizontal reflection scale"
                onChange={(event) => updateScale(Number(event.target.value))}
              />
              <output>{tidy(scale)}</output>
              <small>
                <i>-3</i>
                <i>3</i>
              </small>
            </label>
            <label>
              <span>Sample y-level</span>
              <input
                type="range"
                min="-15"
                max="15"
                step="1"
                value={yLevel}
                aria-label="Sample y-level"
                onChange={(event) => updateYLevel(Number(event.target.value))}
              />
              <output>{tidy(yLevel)}</output>
              <small>
                <i>-15</i>
                <i>15</i>
              </small>
            </label>
            <section>
              <h3>Point pairs (same y-value)</h3>
              <table>
                <thead>
                  <tr>
                    <th>Left point (x, y)</th>
                    <th>Right point (x, y)</th>
                    <th>Rule</th>
                  </tr>
                </thead>
                <tbody>
                  {pairs.map((pair) => (
                    <tr key={pair.y} onClick={() => updateYLevel(pair.y)}>
                      <td>{coordinate(pair.left, pair.y)}</td>
                      <td>{coordinate(pair.right, pair.y)}</td>
                      <td>x → -x</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
            <footer>
              <i />
              <p>
                <b>Mirror line</b>
                <span>The y-axis (x = 0) is the line of reflection.</span>
              </p>
            </footer>
          </aside>
        </section>
        <section className="ry161-concepts">
          <article>
            <i>
              <Axis3D />
            </i>
            <p>
              <b>Mirror across y-axis</b>
              <span>
                Every point (x, y) is mapped to
                <br />
                (-x, y) across the y-axis.
              </span>
            </p>
          </article>
          <article>
            <i>
              <ArrowLeftRight />
            </i>
            <p>
              <b>x → -x</b>
              <span>
                Input sign flips first.
                <br />
                Reflect the input.
              </span>
            </p>
          </article>
          <article>
            <i>⚑</i>
            <p>
              <b>y unchanged</b>
              <span>
                Output stays the same.
                <br />
                Same height (y-value).
              </span>
            </p>
          </article>
          <article>
            <i>
              <Route />
            </i>
            <p>
              <b>Left and right swap</b>
              <span>
                Left side of f(x) becomes
                <br />
                right side of g(x).
              </span>
            </p>
          </article>
        </section>
        <section className="ry161-rule">
          <h2>Function rule</h2>
          <div>
            <strong>g(x) = f(-x)</strong>
            <span>Replace x with -x to reflect across the y-axis.</span>
          </div>
        </section>
      </section>
    </div>
  );
}
