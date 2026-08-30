import {
  Check,
  CircleHelp,
  Lightbulb,
  MapPin,
  PlusCircle,
  Share2,
  Trash2,
} from "lucide-react";
import {
  useEffect,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import "./DirectionFieldsTargetLesson323.css";

type Point = { id: number; x: number; y: number; color: string };
const initialSeeds: Point[] = [
  { id: 1, x: 1, y: 1, color: "#7c2ee6" },
  { id: 2, x: 0, y: -1, color: "#00a7df" },
];
const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));
const clean = (v: number) => Number(v.toFixed(6));
const slopeAt = (x: number, y: number) => x - y;
const solutionAt = (seed: Point, x: number) => {
  const c = (seed.y - seed.x + 1) * Math.exp(seed.x);
  return x - 1 + c * Math.exp(-x);
};

export default function DirectionFieldsTargetLesson323({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [density, setDensity] = useState(24);
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);
  const [axes, setAxes] = useState(true);
  const [curves, setCurves] = useState(true);
  const [triangle, setTriangle] = useState(true);
  const [grid, setGrid] = useState(false);
  const [seeds, setSeeds] = useState<Point[]>(initialSeeds);
  const [selectedId, setSelectedId] = useState(1);
  const [tab, setTab] = useState("Interact");
  const [prediction, setPrediction] = useState("");
  const [behavior, setBehavior] = useState("");
  const [result, setResult] = useState<"" | "correct" | "incorrect">("");
  const [hint, setHint] = useState(false);
  const [actions, setActions] = useState(0);
  const selected = seeds.find((seed) => seed.id === selectedId) ?? seeds[0];
  const slope = selected ? slopeAt(selected.x, selected.y) : 0;
  const reset = () => {
    setDensity(24);
    setScaleX(1);
    setScaleY(1);
    setAxes(true);
    setCurves(true);
    setTriangle(true);
    setGrid(false);
    setSeeds(initialSeeds);
    setSelectedId(1);
    setTab("Interact");
    setPrediction("");
    setBehavior("");
    setResult("");
    setHint(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((value) => value + 1);
    onInteraction();
  };
  const moveSeed = (id: number, x: number, y: number) =>
    act(() => {
      setSeeds((items) =>
        items.map((seed) =>
          seed.id === id
            ? { ...seed, x: clamp(x, -4, 4), y: clamp(y, -3.5, 3.5) }
            : seed,
        ),
      );
      setSelectedId(id);
      setResult("");
    });
  const addSeed = () =>
    act(() => {
      const id = Math.max(0, ...seeds.map((seed) => seed.id)) + 1;
      setSeeds((items) => [...items, { id, x: -1, y: 2, color: "#f07b18" }]);
      setSelectedId(id);
    });
  const check = () =>
    act(() => {
      const value = Number(prediction);
      setResult(
        Math.abs(value + 3) <= 0.05 && behavior === "Falls"
          ? "correct"
          : "incorrect",
      );
    });
  return (
    <section
      className="dir323-page"
      data-testid="calculus-mockup-0402"
      data-object-model="direction-field-generated-local-slopes-exact-solution-family-draggable-seeds-slope-triangle-prediction"
      data-density={density}
      data-scale-x={clean(scaleX)}
      data-scale-y={clean(scaleY)}
      data-seeds={seeds.length}
      data-selected={selectedId}
      data-selected-x={clean(selected?.x ?? 0)}
      data-selected-y={clean(selected?.y ?? 0)}
      data-slope={clean(slope)}
      data-axes={axes}
      data-curves={curves}
      data-triangle={triangle}
      data-grid={grid}
      data-tab={tab}
      data-prediction={prediction}
      data-behavior={behavior}
      data-result={result}
      data-hint={hint}
      data-actions={actions}
    >
      <header className="dir323-hero">
        <span>
          <b>CALCULUS</b>
          <b>DIFFERENTIAL EQUATIONS</b>
        </span>
        <h1>Direction Fields</h1>
        <p>Explore how local slopes guide solution curves.</p>
        <div>
          {["Advanced", "Slope Fields", "Interactive", "6-10 min"].map(
            (item) => (
              <i key={item}>{item}</i>
            ),
          )}
        </div>
        <button
          onClick={() =>
            act(() => void navigator.clipboard?.writeText(location.href))
          }
        >
          <Share2 /> Share
        </button>
      </header>
      <nav className="dir323-tabs">
        {[
          ["Interact", "⌁"],
          ["Learn", "▣"],
          ["Example", "▦"],
          ["Formula", "∑"],
          ["Practice", "✎"],
        ].map(([name, icon]) => (
          <button
            key={name}
            className={tab === name ? "active" : ""}
            onClick={() => act(() => setTab(name))}
          >
            <span>{icon}</span>
            {name}
          </button>
        ))}
      </nav>
      <section className="dir323-lab">
        <aside className="dir323-controls">
          <h2>MODEL</h2>
          <strong>dy/dx = x - y</strong>
          <h2>FIELD CONTROLS</h2>
          <Range
            label="Density"
            value={density}
            min={12}
            max={32}
            step={4}
            shown={String(density)}
            onChange={(v) => act(() => setDensity(v))}
          />
          <Range
            label="Scale x"
            value={scaleX}
            min={0.6}
            max={1.5}
            step={0.1}
            shown={scaleX.toFixed(1)}
            onChange={(v) => act(() => setScaleX(v))}
          />
          <Range
            label="Scale y"
            value={scaleY}
            min={0.6}
            max={1.5}
            step={0.1}
            shown={scaleY.toFixed(1)}
            onChange={(v) => act(() => setScaleY(v))}
          />
          <h2>DISPLAY</h2>
          <Toggle
            label="Show axes"
            checked={axes}
            onChange={setAxes}
            act={act}
          />
          <Toggle
            label="Show solution curves"
            checked={curves}
            onChange={setCurves}
            act={act}
          />
          <Toggle
            label="Slope triangle"
            checked={triangle}
            onChange={setTriangle}
            act={act}
          />
          <Toggle label="Grid" checked={grid} onChange={setGrid} act={act} />
          <h2>ACTIONS</h2>
          <button className="primary" onClick={addSeed}>
            <PlusCircle /> Add seed point
          </button>
          <button
            onClick={() =>
              act(() => {
                setSeeds([]);
                setSelectedId(0);
              })
            }
          >
            <Trash2 /> Clear curves
          </button>
        </aside>
        <DirectionPlot
          density={density}
          scaleX={scaleX}
          scaleY={scaleY}
          axes={axes}
          curves={curves}
          triangle={triangle}
          grid={grid}
          seeds={seeds}
          selectedId={selectedId}
          onSelect={(id) => act(() => setSelectedId(id))}
          onMove={moveSeed}
        />
        <aside className="dir323-analysis">
          <h2>SELECTED POINT</h2>
          {selected ? (
            <>
              <strong className="point">
                <i style={{ background: selected.color }} />(
                {selected.x.toFixed(2)}, {selected.y.toFixed(2)})
              </strong>
              <h3>Slope</h3>
              <p className="formula">
                dy/dx = x - y<br />= {selected.x.toFixed(2)} -{" "}
                {selected.y.toFixed(2)} = {slope.toFixed(2)}
              </p>
              <SlopeTriangle slope={slope} visible={triangle} />
            </>
          ) : (
            <p>Select or add a seed point.</p>
          )}
          <section className="key">
            <h3>Slope color key</h3>
            <p>
              <i className="steep-pos" /> Steep +
            </p>
            <p>
              <i className="zero" /> Zero
            </p>
            <p>
              <i className="steep-neg" /> Steep -
            </p>
          </section>
          <p className="tip">
            <CircleHelp /> Drag a seed point to a new location to see how the
            local slopes and solution change.
          </p>
        </aside>
      </section>
      <section className="dir323-learning">
        <article>
          <h2>WHAT'S HAPPENING?</h2>
          <p>
            At each point, the short line segment shows the slope of the
            solution curve that passes through that point.
          </p>
          <p>Solution curves follow these slopes and never cross.</p>
          <MiniField />
          <aside>
            <b>COMMON MISCONCEPTION</b>
            <p>
              Direction fields are not level curves. The dashes do not show
              function values; they show slopes.
            </p>
          </aside>
        </article>
        <article>
          <h2>GOVERNING FORMULA</h2>
          <p>The direction field is determined by:</p>
          <strong className="big-formula">dy/dx = x - y</strong>
          <ul>
            <li>At each point (x, y), the slope is x - y.</li>
            <li>
              A solution curve y(x) satisfies y' = x - y for all x in its
              interval.
            </li>
          </ul>
        </article>
        <article>
          <h2>WORKED EXAMPLE</h2>
          <p>Find the slope at (2, -1) and describe the solution through it.</p>
          <ol>
            <li>
              <b>Slope:</b> 2 - (-1) = 3. The slope is +3 (steep upward).
            </li>
            <li>Local slope line: y + 1 = 3(x - 2), so y = 3x - 7.</li>
            <li>The solution through (2, -1) rises steeply to the right.</li>
          </ol>
          <output>
            Check on field: dashes near (2, -1) tilt steeply upward to the right{" "}
            <Check />
          </output>
        </article>
      </section>
      <section className="dir323-practice">
        <header>
          <h2>TRY IT: YOUR TURN</h2>
          <span>
            Place a seed at (-1, 2) and predict the slope and local behavior.
          </span>
        </header>
        <div>
          <button
            className="place"
            onClick={() =>
              act(() => {
                const existing = seeds.find((s) => s.id === 99);
                if (!existing)
                  setSeeds((items) => [
                    ...items,
                    { id: 99, x: -1, y: 2, color: "#f07b18" },
                  ]);
                setSelectedId(99);
              })
            }
          >
            <MapPin /> Place seed here
          </button>
          <label>
            Predicted slope:
            <input
              aria-label="Predicted slope"
              value={prediction}
              onChange={(e) =>
                act(() => {
                  setPrediction(e.target.value);
                  setResult("");
                })
              }
            />
          </label>
          <fieldset aria-label="Predicted behavior">
            <legend>Behavior:</legend>
            {["Rises", "Falls", "Flat"].map((name) => (
              <button
                type="button"
                className={behavior === name ? "selected" : ""}
                key={name}
                onClick={() =>
                  act(() => {
                    setBehavior(name);
                    setResult("");
                  })
                }
              >
                {name}
              </button>
            ))}
          </fieldset>
          <button className="check" onClick={check}>
            <Check /> Check
          </button>
          <button
            className="hint-button"
            onClick={() => act(() => setHint((v) => !v))}
          >
            <Lightbulb /> Hint
          </button>
        </div>
        <p className="hint">
          Hint: dy/dx = x - y. Substitute x = -1, y = 2.{" "}
          {hint && <b>The slope is -3, so the curve falls.</b>}
        </p>
        <output className={result}>
          {result === "correct"
            ? "Correct: -1 - 2 = -3, so the solution falls."
            : result === "incorrect"
              ? "Check both the sign and the subtraction x - y."
              : ""}
        </output>
      </section>
    </section>
  );
}

function Range({
  label,
  value,
  min,
  max,
  step,
  shown,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  shown: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="dir323-range">
      <span>{label}</span>
      <input
        aria-label={`Direction field ${label}`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <output>{shown}</output>
    </label>
  );
}
function Toggle({
  label,
  checked,
  onChange,
  act,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  act: (run: () => void) => void;
}) {
  return (
    <label className="dir323-toggle">
      <input
        type="checkbox"
        aria-label={label}
        checked={checked}
        onChange={(e) => act(() => onChange(e.target.checked))}
      />
      {label}
    </label>
  );
}

function DirectionPlot({
  density,
  scaleX,
  scaleY,
  axes,
  curves,
  triangle,
  grid,
  seeds,
  selectedId,
  onSelect,
  onMove,
}: {
  density: number;
  scaleX: number;
  scaleY: number;
  axes: boolean;
  curves: boolean;
  triangle: boolean;
  grid: boolean;
  seeds: Point[];
  selectedId: number;
  onSelect: (id: number) => void;
  onMove: (id: number, x: number, y: number) => void;
}) {
  const w = 440,
    h = 536,
    p = 17,
    xmin = -4,
    xmax = 4,
    ymin = -3.5,
    ymax = 3.5;
  const sx = (x: number) => p + ((x - xmin) / (xmax - xmin)) * (w - 2 * p);
  const sy = (y: number) => h - p - ((y - ymin) / (ymax - ymin)) * (h - 2 * p);
  const field = (() => {
    const cols = density,
      rows = Math.max(12, Math.round(density * 0.82));
    return Array.from({ length: cols * rows }, (_, index) => {
      const col = index % cols,
        row = Math.floor(index / cols);
      const x = xmin + (col / (cols - 1)) * (xmax - xmin);
      const y = ymin + (row / (rows - 1)) * (ymax - ymin);
      const m = (x * scaleX - y * scaleY) * (scaleY / scaleX);
      const angle = Math.atan(m),
        length = 10;
      const dx = (Math.cos(angle) * length) / 2,
        dy = (Math.sin(angle) * length) / 2;
      return {
        x,
        y,
        x1: sx(x) - dx,
        x2: sx(x) + dx,
        y1: sy(y) + dy,
        y2: sy(y) - dy,
        m,
      };
    });
  })();
  const drag = (seed: Point, event: ReactPointerEvent<SVGCircleElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    const box = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!box) return;
    const move = (e: PointerEvent) =>
      onMove(
        seed.id,
        xmin + ((e.clientX - box.left) / box.width) * (xmax - xmin),
        ymax - ((e.clientY - box.top) / box.height) * (ymax - ymin),
      );
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  return (
    <section className="dir323-plot-wrap">
      <svg
        className="dir323-plot"
        viewBox={`0 0 ${w} ${h}`}
        aria-label="Interactive direction field"
      >
        {grid && (
          <g className="grid">
            {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((x) => (
              <line key={`x${x}`} x1={sx(x)} x2={sx(x)} y1={p} y2={h - p} />
            ))}
            {[-3, -2, -1, 0, 1, 2, 3].map((y) => (
              <line key={`y${y}`} x1={p} x2={w - p} y1={sy(y)} y2={sy(y)} />
            ))}
          </g>
        )}
        <g className="field">
          {field.map((dash, i) => (
            <line
              key={i}
              x1={dash.x1}
              x2={dash.x2}
              y1={dash.y1}
              y2={dash.y2}
              data-sign={
                Math.abs(dash.m) < 0.15
                  ? "zero"
                  : dash.m > 0
                    ? "positive"
                    : "negative"
              }
            />
          ))}
        </g>
        {axes && (
          <g className="axes">
            <line x1={p} x2={w - p} y1={sy(0)} y2={sy(0)} />
            <line x1={sx(0)} x2={sx(0)} y1={p} y2={h - p} />
            {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((x) => (
              <text key={x} x={sx(x)} y={sy(0) + 17}>
                {x}
              </text>
            ))}
            {[-3, -2, -1, 1, 2, 3].map((y) => (
              <text key={y} x={sx(0) - 9} y={sy(y) + 3}>
                {y}
              </text>
            ))}
            <text x={w - 8} y={sy(0) - 8}>
              x
            </text>
            <text x={sx(0) + 7} y={12}>
              y
            </text>
          </g>
        )}
        {curves &&
          seeds.map((seed) => {
            const points = Array.from({ length: 161 }, (_, i) => {
              const x = xmin + (i / 160) * (xmax - xmin);
              return [x, solutionAt(seed, x)] as const;
            }).filter(([, y]) => y >= ymin - 0.4 && y <= ymax + 0.4);
            const d = points
              .map(([x, y], i) => `${i ? "L" : "M"}${sx(x)},${sy(y)}`)
              .join(" ");
            return (
              <path
                className="solution"
                key={`curve${seed.id}`}
                d={d}
                stroke={seed.color}
              />
            );
          })}
        {seeds.map((seed) => (
          <circle
            key={seed.id}
            data-drag={`direction-seed-${seed.id}`}
            className={seed.id === selectedId ? "seed selected" : "seed"}
            cx={sx(seed.x)}
            cy={sy(seed.y)}
            r={seed.id === selectedId ? 7 : 6}
            fill={seed.color}
            onClick={() => onSelect(seed.id)}
            onPointerDown={(e) => drag(seed, e)}
          />
        ))}
        {triangle &&
          seeds.find((s) => s.id === selectedId) &&
          (() => {
            const seed = seeds.find((s) => s.id === selectedId)!;
            const m = slopeAt(seed.x, seed.y);
            const run = 0.8,
              rise = clamp(m * run, -1.4, 1.4);
            return (
              <g className="slope-triangle">
                <path
                  d={`M${sx(seed.x)},${sy(seed.y)} L${sx(seed.x + run)},${sy(seed.y)} L${sx(seed.x + run)},${sy(seed.y + rise)} Z`}
                />
                <text x={sx(seed.x + run / 2)} y={sy(seed.y) + 16}>
                  1
                </text>
                <text x={sx(seed.x + run) + 8} y={sy(seed.y + rise / 2)}>
                  {m.toFixed(1)}
                </text>
              </g>
            );
          })()}
      </svg>
      <footer>
        {seeds.map((seed) => (
          <button
            key={seed.id}
            className={selectedId === seed.id ? "active" : ""}
            onClick={() => onSelect(seed.id)}
          >
            <i style={{ background: seed.color }} />
            Seed ({seed.x.toFixed(1)}, {seed.y.toFixed(1)})
          </button>
        ))}
      </footer>
    </section>
  );
}

function SlopeTriangle({
  slope,
  visible,
}: {
  slope: number;
  visible: boolean;
}) {
  return (
    <section className="dir323-triangle">
      <h3>Slope triangle</h3>
      {visible ? (
        <svg viewBox="0 0 120 105">
          <path d="M25 82 L98 82 L25 18 Z" />
          <text x="54" y="99">
            run 1
          </text>
          <text x="2" y="54">
            rise
          </text>
          <text x="5" y="68">
            {slope.toFixed(1)}
          </text>
        </svg>
      ) : (
        <p>Enable the slope triangle.</p>
      )}
    </section>
  );
}
function MiniField() {
  return (
    <svg className="dir323-mini" viewBox="0 0 220 100">
      {Array.from({ length: 70 }, (_, i) => {
        const x = 10 + (i % 10) * 22,
          y = 10 + Math.floor(i / 10) * 14,
          m = ((i % 10) - Math.floor(i / 10)) / 5,
          a = Math.atan(m),
          dx = Math.cos(a) * 5,
          dy = Math.sin(a) * 5;
        return <line key={i} x1={x - dx} y1={y + dy} x2={x + dx} y2={y - dy} />;
      })}
      <path d="M10 78 C65 76 72 53 110 48 S170 16 215 27" />
      <circle cx="110" cy="48" r="6" />
    </svg>
  );
}
