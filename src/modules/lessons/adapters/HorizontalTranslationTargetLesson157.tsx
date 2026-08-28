import { ArrowRight, Equal, Shuffle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./HorizontalTranslationTargetLesson157.css";

const LEVELS = [4, 2, 1, 0];
const X_MIN = -4;
const X_MAX = 6;
const Y_MIN = -1.5;
const Y_MAX = 5.5;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const tidy = (value: number, places = 3) => {
  const rounded = Math.round(value * 10 ** places) / 10 ** places;
  return Object.is(rounded, -0) ? "0" : String(rounded);
};

const inside = (h: number) =>
  h >= 0 ? `x − ${tidy(h)}` : `x + ${tidy(Math.abs(h))}`;

const moveText = (h: number) =>
  h > 0
    ? `Move right ${tidy(h)}`
    : h < 0
      ? `Move left ${tidy(Math.abs(h))}`
      : "No horizontal shift";

const inputText = (level: number) => {
  if (level === 0) return "x = 0";
  const root = Math.sqrt(level);
  return `x = ±${tidy(root)}`;
};

const shiftedInputs = (level: number, h: number) => {
  if (level === 0) return tidy(h);
  const root = Math.sqrt(level);
  return `${tidy(h + root)}, ${tidy(h - root)}`;
};

function HorizontalGraph({
  h,
  level,
  showParent,
  onShift,
  onLevel,
  onInteraction,
}: {
  h: number;
  level: number;
  showParent: boolean;
  onShift: (value: number) => void;
  onLevel: (value: number) => void;
  onInteraction: () => void;
}) {
  const width = 590;
  const height = 430;
  const left = 18;
  const right = 24;
  const top = 13;
  const bottom = 30;
  const px = (x: number) =>
    left + ((x - X_MIN) / (X_MAX - X_MIN)) * (width - left - right);
  const py = (y: number) =>
    top + ((Y_MAX - y) / (Y_MAX - Y_MIN)) * (height - top - bottom);
  const curve = (shift: number) => {
    const points: string[] = [];
    for (let index = 0; index <= 220; index += 1) {
      const x = X_MIN + (index / 220) * (X_MAX - X_MIN);
      const y = (x - shift) ** 2;
      if (y > Y_MAX + 0.5) continue;
      points.push(
        `${points.length ? "L" : "M"}${px(x).toFixed(2)},${py(y).toFixed(2)}`,
      );
    }
    return points.join(" ");
  };
  const parentPath = useMemo(() => curve(0), []); // eslint-disable-line react-hooks/exhaustive-deps
  const shiftedPath = useMemo(() => curve(h), [h]); // eslint-disable-line react-hooks/exhaustive-deps
  const updateShiftFromPointer = (event: PointerEvent<SVGCircleElement>) => {
    const svg = event.currentTarget.ownerSVGElement;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const svgX = ((event.clientX - rect.left) / rect.width) * width;
    const graphX =
      X_MIN + ((svgX - left) / (width - left - right)) * (X_MAX - X_MIN);
    onShift(clamp(Math.round(graphX), -5, 5));
  };
  const shiftKey = (event: KeyboardEvent<SVGCircleElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    onShift(clamp(h + (event.key === "ArrowRight" ? 1 : -1), -5, 5));
  };
  const updateLevelFromPointer = (event: PointerEvent<SVGCircleElement>) => {
    const svg = event.currentTarget.ownerSVGElement;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const svgY = ((event.clientY - rect.top) / rect.height) * height;
    const graphY =
      Y_MAX - ((svgY - top) / (height - top - bottom)) * (Y_MAX - Y_MIN);
    const next = LEVELS.reduce((closest, candidate) =>
      Math.abs(candidate - graphY) < Math.abs(closest - graphY)
        ? candidate
        : closest,
    );
    onLevel(next);
  };
  const levelKey = (event: KeyboardEvent<SVGCircleElement>) => {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    event.preventDefault();
    const ascending = [...LEVELS].sort((a, b) => a - b);
    const index = ascending.indexOf(level);
    onLevel(
      ascending[
        clamp(
          index + (event.key === "ArrowUp" ? 1 : -1),
          0,
          ascending.length - 1,
        )
      ],
    );
  };
  const activeRoot = Math.sqrt(level);
  const activeX = h + activeRoot;

  return (
    <svg
      className="ht157-graph"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Parent parabola and horizontally translated parabola"
      onPointerDown={onInteraction}
    >
      <defs>
        <pattern
          id="ht157-grid"
          width="54.8"
          height="55.3"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M54.8 0H0V55.3"
            fill="none"
            stroke="#e6ecf2"
            strokeWidth="1"
          />
        </pattern>
        <marker
          id="ht157-arrow"
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
        fill="url(#ht157-grid)"
      />
      <line x1={left} y1={py(0)} x2={width - 12} y2={py(0)} className="axis" />
      <line
        x1={px(0)}
        y1={height - bottom}
        x2={px(0)}
        y2={8}
        className="axis"
      />
      <text x={width - 11} y={py(0) + 18} className="axis-label">
        x
      </text>
      <text x={px(0) - 8} y={12} className="axis-label">
        y
      </text>
      {[-3, -2, -1, 0, 1, 2, 3, 4, 5].map((x) => (
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
      {[-1, 1, 2, 3, 4, 5].map((y) => (
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
      {showParent && <path d={parentPath} className="parent-curve" />}
      <path d={shiftedPath} className="shifted-curve" />
      {LEVELS.map((y) => {
        const root = Math.sqrt(y);
        const sources = y === 0 ? [0] : [-root, root];
        return sources.map((source, index) => (
          <g
            key={`${y}-${index}`}
            className={level === y ? "active-level" : ""}
          >
            <line
              x1={px(source)}
              y1={py(y)}
              x2={px(source + h)}
              y2={py(y)}
              className="level-arrow"
              markerEnd="url(#ht157-arrow)"
            />
            {showParent && (
              <circle
                cx={px(source)}
                cy={py(y)}
                r="4.5"
                className="parent-point"
              />
            )}
            <circle
              cx={px(source + h)}
              cy={py(y)}
              r="5"
              className="shifted-point"
            />
          </g>
        ));
      })}
      <circle
        cx={px(h)}
        cy={py(0)}
        r="13"
        className="shift-handle"
        role="slider"
        tabIndex={0}
        aria-label="Drag horizontal translation vertex"
        aria-valuemin={-5}
        aria-valuemax={5}
        aria-valuenow={h}
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
        cx={px(activeX)}
        cy={py(level)}
        r="12"
        className="level-handle"
        role="slider"
        tabIndex={0}
        aria-label="Drag horizontal comparison level"
        aria-valuemin={0}
        aria-valuemax={4}
        aria-valuenow={level}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          updateLevelFromPointer(event);
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId))
            updateLevelFromPointer(event);
        }}
        onKeyDown={levelKey}
      />
      <circle
        cx={px(activeX)}
        cy={py(level)}
        r="5"
        className="active-dot"
        pointerEvents="none"
      />
    </svg>
  );
}

export default function HorizontalTranslationTargetLesson157({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [h, setH] = useState(2);
  const [level, setLevel] = useState(2);
  const [showParent, setShowParent] = useState(true);
  const act = () => onInteraction();
  const updateH = (value: number) => {
    setH(clamp(Math.round(value), -5, 5));
    act();
  };
  const updateLevel = (value: number) => {
    setLevel(LEVELS.includes(value) ? value : 2);
    act();
  };
  useEffect(() => {
    setH(2);
    setLevel(2);
    setShowParent(true);
  }, [resetToken]);
  const rows = LEVELS.map((target) => ({
    target,
    parent: inputText(target),
    shifted: shiftedInputs(target, h),
    check: target,
  }));

  return (
    <div
      className="ht157-page"
      data-testid="graph-mockup-0214"
      data-dedicated-lesson="157"
      data-object-model="editable-horizontal-shift-parent-visibility-and-comparison-level-pointer-keyboard-draggable-vertex-and-level-probe-generated-parabolas-same-height-arrows-input-remapping-table-and-vertex-proof"
      data-h={h}
      data-level={level}
      data-parent-visible={showParent}
      data-vertex-x={h}
      data-parent-input={Math.sqrt(level)}
      data-shifted-input={h + Math.sqrt(level)}
      data-output={level}
    >
      <header className="ht157-header">
        <div>
          <h1>Horizontal Translation</h1>
          <p>Understand f(x-h).</p>
          <nav>
            <b>♙ Interactive</b>
            <b>ϟ Predict-Test-Explain</b>
            <b>▣ Dynamic Sliders / Graphing</b>
            <b>◷ 6-10 min</b>
          </nav>
        </div>
        <aside>
          <strong>g(x) = f({inside(h)})</strong>
          <span>{moveText(h)}</span>
        </aside>
      </header>

      <section className="ht157-workspace">
        <article className="ht157-graph-card">
          <h2>Compare the parent function with its horizontal translation</h2>
          <div className="ht157-legend">
            <span>
              <i />
              f(x) = x² <small>(parent)</small>
            </span>
            <span>
              <i />
              g(x) = ({inside(h)})² <small>(translated)</small>
            </span>
          </div>
          <HorizontalGraph
            h={h}
            level={level}
            showParent={showParent}
            onShift={updateH}
            onLevel={updateLevel}
            onInteraction={act}
          />
          <footer>Vertex: (0,0) → ({tidy(h)},0)</footer>
        </article>

        <aside className="ht157-rail">
          <section className="ht157-controls">
            <h2>Horizontal shift (h)</h2>
            <p>In g(x) = f(x − h), positive h moves right.</p>
            <label>
              <span>Move right</span>
              <span>Move left</span>
              <div>
                <input
                  aria-label="Horizontal translation amount"
                  type="range"
                  min="-5"
                  max="5"
                  step="1"
                  value={h}
                  onChange={(event) => updateH(Number(event.target.value))}
                />
                <output>{tidy(h)}</output>
              </div>
              <small>
                {[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map((value) => (
                  <i key={value} className={value === h ? "active" : ""}>
                    {value}
                  </i>
                ))}
              </small>
            </label>
            <div className="ht157-toggle">
              <label>
                Show parent function <em>f(x) = x²</em>
                <input
                  aria-label="Show horizontal parent function"
                  type="checkbox"
                  checked={showParent}
                  onChange={(event) => {
                    setShowParent(event.target.checked);
                    act();
                  }}
                />
                <i />
              </label>
            </div>
            <label className="ht157-level">
              Sample y-level to compare
              <select
                aria-label="Horizontal comparison y level"
                value={level}
                onChange={(event) => updateLevel(Number(event.target.value))}
              >
                {LEVELS.map((value) => (
                  <option key={value} value={value}>
                    y = {value}
                  </option>
                ))}
              </select>
            </label>
          </section>

          <section className="ht157-inputs">
            <h2>Input changes first</h2>
            <p>To get the same y, inputs change by h.</p>
            <table>
              <thead>
                <tr>
                  <th>Target y</th>
                  <th>
                    Parent f(x)=x²
                    <br />
                    (Input x)
                  </th>
                  <th>
                    Use x = x<sub>target</sub> + {tidy(h)}
                    <br />
                    (Input for g)
                  </th>
                  <th>
                    Check
                    <br />
                    g(x) = ({inside(h)})²
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.target}
                    className={level === row.target ? "selected" : ""}
                    onClick={() => updateLevel(row.target)}
                  >
                    <td>{row.target}</td>
                    <td>{row.parent}</td>
                    <td>{row.shifted}</td>
                    <td>{row.check}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <footer>
              To get parent input 0, use x = <b>{tidy(h)}</b> in g(x).
            </footer>
          </section>
        </aside>
      </section>

      <section className="ht157-concepts">
        <article>
          <i>
            <ArrowRight />
          </i>
          <p>
            <b>Inside subtraction shifts right</b>
            <span>
              In f(x − h), subtracting h inside the function
              <br />
              requires a larger input to get the same output.
            </span>
          </p>
          <footer>Positive h → right shift</footer>
        </article>
        <article>
          <i>
            <Equal />
          </i>
          <p>
            <b>Same y-levels</b>
            <span>
              Horizontal translations keep y-values the same.
              <br />
              Only the x-inputs change.
            </span>
          </p>
          <footer>Heights match across parabolas</footer>
        </article>
        <article>
          <i>
            <Shuffle />
          </i>
          <p>
            <b>Opposite-feeling movement</b>
            <span>
              The graph moves in the opposite direction of h<br />
              because of the “−h” inside.
            </span>
          </p>
          <footer>Right in formula → right on graph</footer>
        </article>
      </section>
    </div>
  );
}
