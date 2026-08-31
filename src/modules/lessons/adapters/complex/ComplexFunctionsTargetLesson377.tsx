import { ExternalLink, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./ComplexFunctionsTargetLesson377.css";

type Pair = [number, number];
type FunctionKind = "square" | "cube" | "reciprocal" | "conjugate";
const clean = (value: number, digits = 3) => Number(value.toFixed(digits));
const text = ([x, y]: Pair) =>
  `${clean(x, 2)} ${y < 0 ? "-" : "+"} ${Math.abs(clean(y, 2))}i`;
const multiply = ([a, b]: Pair, [c, d]: Pair): Pair => [
  clean(a * c - b * d),
  clean(a * d + b * c),
];
function evaluate(z: Pair, kind: FunctionKind): Pair | null {
  if (kind === "square") return multiply(z, z);
  if (kind === "cube") return multiply(multiply(z, z), z);
  if (kind === "conjugate") return [z[0], -z[1]];
  const den = z[0] * z[0] + z[1] * z[1];
  return den < 0.0001 ? null : [clean(z[0] / den), clean(-z[1] / den)];
}
const labels: Record<FunctionKind, string> = {
  square: "f(z) = z²",
  cube: "f(z) = z³",
  reciprocal: "f(z) = 1/z",
  conjugate: "f(z) = conjugate(z)",
};

export default function ComplexFunctionsTargetLesson377({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [kind, setKind] = useState<FunctionKind>("square"),
    [z, setZ] = useState<Pair>([2, 1]),
    [grid, setGrid] = useState(true),
    [components, setComponents] = useState(true),
    [polar, setPolar] = useState(true),
    [challenge, setChallenge] = useState(false),
    [dragging, setDragging] = useState(false),
    [tab, setTab] = useState("Interaction + visualization"),
    [actions, setActions] = useState(0);
  const dragRef = useRef(false),
    fz = evaluate(z, kind),
    modulus = clean(Math.hypot(...z)),
    argument = clean((Math.atan2(z[1], z[0]) * 180) / Math.PI, 1),
    outputModulus = fz ? clean(Math.hypot(...fz)) : null,
    outputArgument = fz
      ? clean((Math.atan2(fz[1], fz[0]) * 180) / Math.PI, 1)
      : null;
  const reset = () => {
    setKind("square");
    setZ([2, 1]);
    setGrid(true);
    setComponents(true);
    setPolar(true);
    setChallenge(false);
    setDragging(false);
    dragRef.current = false;
    setTab("Interaction + visualization");
    setActions(0);
  };
  const act = (fn: () => void) => {
    fn();
    setActions((v) => v + 1);
    onInteraction();
  };
  useEffect(reset, [resetToken]);
  const update = (index: number, value: number) =>
    act(() =>
      setZ(
        (current) =>
          current.map((item, itemIndex) =>
            itemIndex === index ? clean(value, 1) : item,
          ) as Pair,
      ),
    );
  const inputOrigin = { x: 145, y: 190 },
    inputScale = 50,
    outputOrigin = { x: 145, y: 190 },
    outputScale = 25;
  const drag = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!dragRef.current) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    act(() =>
      setZ([
        clean(
          (((event.clientX - bounds.left) / bounds.width) * 290 -
            inputOrigin.x) /
            inputScale,
          1,
        ),
        clean(
          (inputOrigin.y -
            ((event.clientY - bounds.top) / bounds.height) * 380) /
            inputScale,
          1,
        ),
      ]),
    );
  };
  const sourceImageRadius =
    kind === "square"
      ? modulus * modulus
      : kind === "cube"
        ? modulus ** 3
        : kind === "reciprocal"
          ? 1 / Math.max(0.001, modulus)
          : modulus;
  const angleEffect =
    kind === "square"
      ? 2
      : kind === "cube"
        ? 3
        : kind === "reciprocal"
          ? -1
          : -1;
  const componentFormula =
    kind === "square"
      ? `(${z[0]} + ${z[1]}i)² = (${z[0] * z[0]} - ${z[1] * z[1]}) + ${2 * z[0] * z[1]}i = ${fz ? text(fz) : "undefined"}`
      : kind === "cube"
        ? `z³ = z²·z = ${fz ? text(fz) : "undefined"}`
        : kind === "reciprocal"
          ? `1/z = conjugate(z)/|z|² = ${fz ? text(fz) : "undefined"}`
          : `conjugate(${text(z)}) = ${fz ? text(fz) : "undefined"}`;
  return (
    <section
      className="cf377-page"
      data-testid="complex-mockup-0562"
      data-object-model="draggable-complex-function-mapper-selectable-square-cube-reciprocal-conjugate-component-polar-modulus-argument-challenge"
      data-function={kind}
      data-z={JSON.stringify(z)}
      data-output={fz ? JSON.stringify(fz) : "undefined"}
      data-modulus={modulus}
      data-argument={argument}
      data-output-modulus={outputModulus ?? "undefined"}
      data-output-argument={outputArgument ?? "undefined"}
      data-grid={grid}
      data-components={components}
      data-polar={polar}
      data-challenge={challenge}
      data-dragging={dragging}
      data-tab={tab}
      data-actions={actions}
    >
      <header className="cf377-hero">
        <div className="cf377-pills">
          <b>ADVANCED MATHEMATICS</b>
          <b>COMPLEX NUMBERS</b>
        </div>
        <h1>Complex Functions</h1>
        <p>Visualise mappings.</p>
        <nav>
          <span>Advanced</span>
          <span>Advanced Lab</span>
          <span>Complex Number View / CAS</span>
          <span>6-10 min</span>
        </nav>
        <div className="cf377-actions">
          <select aria-label="Language">
            <option>English (English)</option>
          </select>
          <button onClick={() => act(reset)}>
            <RotateCcw />
            Reset
          </button>
          <button onClick={() => act(() => {})}>
            <Share2 />
            Share
          </button>
          <button onClick={() => act(() => {})}>
            <ExternalLink />
            Workspace
          </button>
        </div>
      </header>
      <nav className="cf377-tabs">
        {[
          "Interaction + visualization",
          "Explain",
          "Examples",
          "Formulas",
          "Know more",
        ].map((name) => (
          <button
            key={name}
            className={tab === name ? "active" : ""}
            onClick={() => act(() => setTab(name))}
          >
            {name}
          </button>
        ))}
      </nav>
      <section className="cf377-lab">
        <header>
          <div>
            <small>INTERACTION + VISUALIZATION</small>
            <h2>Map z → f(z) with {labels[kind]}</h2>
          </div>
          <strong>{actions ? "Live mapping" : "Awaiting interaction"}</strong>
          <span>{actions} actions</span>
        </header>
        <div className="cf377-main">
          <article className="cf377-plane input">
            <h3>
              <i>1</i> Input: z-plane
            </h3>
            <header>
              <b>z-plane</b>
              <span>z = {text(z)}</span>
            </header>
            <svg
              viewBox="0 0 290 380"
              onPointerMove={drag}
              onPointerUp={() => {
                dragRef.current = false;
                setDragging(false);
              }}
              onPointerLeave={() => {
                dragRef.current = false;
                setDragging(false);
              }}
            >
              {grid && (
                <PolarGrid
                  cx={inputOrigin.x}
                  cy={inputOrigin.y}
                  scale={inputScale}
                  max={3}
                />
              )}
              <Axes
                cx={inputOrigin.x}
                cy={inputOrigin.y}
                scale={inputScale}
                max={3}
              />
              <line
                x1={inputOrigin.x}
                y1={inputOrigin.y}
                x2={inputOrigin.x + z[0] * inputScale}
                y2={inputOrigin.y - z[1] * inputScale}
                className="radius"
              />
              <circle
                cx={inputOrigin.x + z[0] * inputScale}
                cy={inputOrigin.y - z[1] * inputScale}
                r="8"
                className="point"
                onPointerDown={() => {
                  dragRef.current = true;
                  setDragging(true);
                }}
              />
              <text
                x={inputOrigin.x + z[0] * inputScale + 9}
                y={inputOrigin.y - z[1] * inputScale - 10}
                className="point-label"
              >
                z = {text(z)}
              </text>
            </svg>
            <footer>
              <h4>Source circle (radius r)</h4>
              <div className="cf377-circle">
                <svg viewBox="0 0 100 80">
                  <circle cx="40" cy="40" r="28" />
                  <line x1="40" y1="40" x2="60" y2="20" />
                </svg>
                <p>
                  |z| = r ≈ {modulus}
                  <br />
                  <b>arg(z) ≈ {argument}°</b>
                </p>
              </div>
            </footer>
          </article>
          <div className="cf377-map-arrow">
            <b>{labels[kind]}</b>
            <span>→</span>
          </div>
          <article className="cf377-plane output">
            <h3>
              <i>2</i> Output: f(z)-plane
            </h3>
            <header>
              <b>f(z)-plane</b>
              <span>f(z) = {fz ? text(fz) : "undefined"}</span>
            </header>
            <svg viewBox="0 0 290 380">
              {grid && (
                <PolarGrid
                  cx={outputOrigin.x}
                  cy={outputOrigin.y}
                  scale={outputScale}
                  max={6}
                />
              )}
              <Axes
                cx={outputOrigin.x}
                cy={outputOrigin.y}
                scale={outputScale}
                max={6}
              />
              {fz && (
                <>
                  <line
                    x1={outputOrigin.x}
                    y1={outputOrigin.y}
                    x2={outputOrigin.x + fz[0] * outputScale}
                    y2={outputOrigin.y - fz[1] * outputScale}
                    className="radius"
                  />
                  <circle
                    cx={outputOrigin.x + fz[0] * outputScale}
                    cy={outputOrigin.y - fz[1] * outputScale}
                    r="8"
                    className="point"
                  />
                  <text
                    x={outputOrigin.x + fz[0] * outputScale + 8}
                    y={outputOrigin.y - fz[1] * outputScale - 10}
                    className="point-label"
                  >
                    f(z) = {text(fz)}
                  </text>
                </>
              )}
            </svg>
            <footer>
              <h4>Image of circle</h4>
              <div className="cf377-circle">
                <svg viewBox="0 0 100 80">
                  <circle cx="40" cy="40" r="28" className="image-circle" />
                  <path
                    d={`M40 40L${40 + 25 * Math.cos((angleEffect * argument * Math.PI) / 180)} ${40 - 25 * Math.sin((angleEffect * argument * Math.PI) / 180)}`}
                  />
                </svg>
                <p>
                  Modulus maps to {clean(sourceImageRadius)}
                  <br />
                  Argument maps to {clean(angleEffect * argument, 1)}°
                </p>
              </div>
            </footer>
          </article>
          <aside className="cf377-controls">
            <section>
              <h3>Controls</h3>
              <label>
                Function
                <select
                  aria-label="Function"
                  value={kind}
                  onChange={(event) =>
                    act(() => setKind(event.target.value as FunctionKind))
                  }
                >
                  {Object.entries(labels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <Control
                label="Real part Re(z)"
                value={z[0]}
                onChange={(value) => update(0, value)}
              />
              <Control
                label="Imaginary part Im(z)"
                value={z[1]}
                onChange={(value) => update(1, value)}
              />
              <Toggle
                label="Show grid image"
                checked={grid}
                setter={setGrid}
                act={act}
              />
              <Toggle
                label="Show component calculation"
                checked={components}
                setter={setComponents}
                act={act}
              />
              <Toggle
                label="Show polar effect"
                checked={polar}
                setter={setPolar}
                act={act}
              />
            </section>
            <section className="cf377-results">
              <h3>Live results</h3>
              <p>z = {text(z)}</p>
              <p>
                |z| ≈ {modulus}
                <br />
                arg(z) ≈ {argument}°
              </p>
              <strong>f(z) = {fz ? text(fz) : "undefined"}</strong>
              {polar && (
                <p>
                  |f(z)| ≈ {outputModulus ?? "undefined"}
                  <br />
                  arg(f(z)) ≈ {outputArgument ?? "undefined"}°
                </p>
              )}
            </section>
          </aside>
        </div>
        {components && (
          <section className="cf377-component">
            <h3>Component calculation</h3>
            <p>{componentFormula}</p>
          </section>
        )}
      </section>
      <section className="cf377-learning">
        <article>
          <h2>Rule</h2>
          <p>A complex function returns another complex number:</p>
          <strong>f(z) = u + vi</strong>
          <p>where u=Re(f(z)) and v=Im(f(z)). Both parts matter.</p>
        </article>
        <article>
          <h2>Worked example</h2>
          <p>Compute f(z)=z² for z=2+i.</p>
          <p>z²=(2+i)²=4+2i+2i+i²=4+4i-1=3+4i</p>
          <strong>So, f(2+i)=3+4i.</strong>
        </article>
        <article className="cf377-challenge">
          <h2>Practice challenge</h2>
          <p>If z=1+2i, find f(z)=z² and plot its output.</p>
          <button
            onClick={() =>
              act(() => {
                setKind("square");
                setZ([1, 2]);
                setChallenge(true);
              })
            }
          >
            Try it now
          </button>
          {challenge && <strong>(1+2i)² = -3+4i</strong>}
          <small>Hint: (1+2i)² = ?</small>
        </article>
        <article className="cf377-warning">
          <h2>Common misconception</h2>
          <p>Checking only the real output misses half the mapping.</p>
          <p>Track both u=Re(f(z)) and v=Im(f(z)).</p>
        </article>
      </section>
      <section className="cf377-insights">
        <article>
          <h2>Key insights</h2>
          <p>
            ✓ Complex functions map the plane to the plane.
            <br />✓ For f(z)=z²: |f(z)|=|z|² and arg(f(z))=2arg(z).
            <br />✓ A real-only check is incomplete.
          </p>
        </article>
        <article>
          <h3>Mapping summary for {labels[kind]}</h3>
          <div>
            <span>
              Point
              <br />
              z={text(z)}
            </span>
            <b>→</b>
            <span>
              Image
              <br />
              {fz ? text(fz) : "undefined"}
            </span>
          </div>
        </article>
        <article>
          <h3>Effect on geometry</h3>
          <p>
            ◉ Circles → circles
            <br />◌ Angles →{" "}
            {kind === "square"
              ? "doubled"
              : kind === "cube"
                ? "tripled"
                : "transformed"}
          </p>
        </article>
      </section>
      <section className="cf377-next">
        <h2>What to try next</h2>
        <span>Change z and observe the pattern.</span>
        <span>Try f(z)=z³ or f(z)=1/z.</span>
        <span>Toggle polar effect to see modulus and argument changes.</span>
      </section>
      <nav className="cf377-nav">
        <a href="/lessons/advanced-mathematics/376-mobius-transformations">
          ←{" "}
          <span>
            <small>PREVIOUS</small>Mobius Transformations
          </span>
        </a>
      </nav>
    </section>
  );
}
function PolarGrid({
  cx,
  cy,
  scale,
  max,
}: {
  cx: number;
  cy: number;
  scale: number;
  max: number;
}) {
  return (
    <g>
      {[1, 2, 3].map((n) => (
        <circle key={n} cx={cx} cy={cy} r={n * scale} className="polar-grid" />
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={cx + max * scale * Math.cos((i * Math.PI) / 6)}
          y2={cy - max * scale * Math.sin((i * Math.PI) / 6)}
          className="polar-grid"
        />
      ))}
    </g>
  );
}
function Axes({
  cx,
  cy,
  scale,
  max,
}: {
  cx: number;
  cy: number;
  scale: number;
  max: number;
}) {
  return (
    <g>
      <path d={`M5 ${cy}H285M${cx} 375V5`} className="axis" />
      {[-max, -max / 2, 0, max / 2, max].map((n) => (
        <g key={n}>
          <text x={cx + n * scale} y={cy + 16} textAnchor="middle">
            {n}
          </text>
          <text x={cx - 8} y={cy - n * scale + 4} textAnchor="end">
            {n}
          </text>
        </g>
      ))}
    </g>
  );
}
function Control({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="cf377-control">
      <b>{label}</b>
      <div>
        <input
          aria-label={label}
          type="range"
          min="-5"
          max="5"
          step=".1"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <input
          aria-label={`${label} value`}
          type="number"
          min="-5"
          max="5"
          step=".1"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
      </div>
      <small>
        <span>-5</span>
        <span>5</span>
      </small>
    </label>
  );
}
function Toggle({
  label,
  checked,
  setter,
  act,
}: {
  label: string;
  checked: boolean;
  setter: (value: boolean) => void;
  act: (fn: () => void) => void;
}) {
  return (
    <label className="cf377-toggle">
      {label}
      <input
        aria-label={label}
        type="checkbox"
        checked={checked}
        onChange={(event) => act(() => setter(event.target.checked))}
      />
    </label>
  );
}
