import { ExternalLink, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./MobiusTargetLesson376.css";

type Pair = [number, number];
type Quad = [number, number, number, number];
const clean = (value: number, digits = 3) => Number(value.toFixed(digits));
const text = ([x, y]: Pair) =>
  `${clean(x, 2)} ${y < 0 ? "-" : "+"} ${Math.abs(clean(y, 2))}i`;
function transform(z: Pair, [a, b, c, d]: Quad): Pair | null {
  const nr = a * z[0] + b,
    ni = a * z[1],
    dr = c * z[0] + d,
    di = c * z[1],
    den = dr * dr + di * di;
  if (den < 0.0001) return null;
  return [clean((nr * dr + ni * di) / den), clean((ni * dr - nr * di) / den)];
}

export default function MobiusTargetLesson376({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [coefficients, setCoefficients] = useState<Quad>([1, -1, 1, 1]);
  const [z, setZ] = useState<Pair>([2, 1]);
  const [grid, setGrid] = useState(true),
    [circle, setCircle] = useState(true),
    [showPole, setShowPole] = useState(true),
    [calculation, setCalculation] = useState(true);
  const [tab, setTab] = useState("Interaction + visualization"),
    [challenge, setChallenge] = useState(false),
    [dragging, setDragging] = useState(false),
    [actions, setActions] = useState(0);
  const dragRef = useRef(false);
  const [a, b, c, d] = coefficients,
    w = transform(z, coefficients),
    pole = c === 0 ? null : clean(-d / c),
    determinant = clean(a * d - b * c),
    defined = w !== null;
  const reset = () => {
    setCoefficients([1, -1, 1, 1]);
    setZ([2, 1]);
    setGrid(true);
    setCircle(true);
    setShowPole(true);
    setCalculation(true);
    setTab("Interaction + visualization");
    setChallenge(false);
    setDragging(false);
    dragRef.current = false;
    setActions(0);
  };
  const act = (fn: () => void) => {
    fn();
    setActions((v) => v + 1);
    onInteraction();
  };
  useEffect(reset, [resetToken]);
  const updateCoefficient = (index: number, value: number) =>
    act(() =>
      setCoefficients(
        (current) =>
          current.map((item, itemIndex) =>
            itemIndex === index ? clean(value, 1) : item,
          ) as Quad,
      ),
    );
  const updateZ = (index: number, value: number) =>
    act(() =>
      setZ(
        (current) =>
          current.map((item, itemIndex) =>
            itemIndex === index ? clean(value, 1) : item,
          ) as Pair,
      ),
    );
  const origin = { x: 150, y: 215 },
    scale = 47,
    sx = (x: number) => origin.x + x * scale,
    sy = (y: number) => origin.y - y * scale;
  const drag = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!dragRef.current) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    act(() =>
      setZ([
        clean(
          (((event.clientX - bounds.left) / bounds.width) * 300 - origin.x) /
            scale,
          1,
        ),
        clean(
          (origin.y - ((event.clientY - bounds.top) / bounds.height) * 430) /
            scale,
          1,
        ),
      ]),
    );
  };
  const linePoints = Array.from(
      { length: 61 },
      (_, index) => [1, -3 + index * 0.1] as Pair,
    ),
    circlePoints = Array.from(
      { length: 81 },
      (_, index) =>
        [
          2 * Math.cos((index * Math.PI) / 40),
          2 * Math.sin((index * Math.PI) / 40),
        ] as Pair,
    );
  const mappedLine = linePoints
      .map((point) => transform(point, coefficients))
      .filter(Boolean) as Pair[],
    mappedCircle = circlePoints
      .map((point) => transform(point, coefficients))
      .filter(Boolean) as Pair[];
  const path = (points: Pair[]) =>
    points
      .map(
        (point, index) =>
          `${index ? "L" : "M"}${sx(Math.max(-3, Math.min(3, point[0])))} ${sy(Math.max(-3, Math.min(3, point[1])))}`,
      )
      .join(" ");
  const tryChallenge = () =>
    act(() => {
      setChallenge(true);
      setCoefficients([0, 1, 1, 0]);
      setZ([1, 0.5]);
    });
  return (
    <section
      className="mb376-page"
      data-testid="complex-mockup-0561"
      data-object-model="draggable-two-plane-mobius-fractional-linear-complex-division-live-pole-line-circle-image-undefined-state-challenge"
      data-coefficients={JSON.stringify(coefficients)}
      data-z={JSON.stringify(z)}
      data-w={w ? JSON.stringify(w) : "undefined"}
      data-pole={pole === null ? "infinity" : pole}
      data-determinant={determinant}
      data-defined={defined}
      data-grid={grid}
      data-circle={circle}
      data-show-pole={showPole}
      data-calculation={calculation}
      data-challenge={challenge}
      data-dragging={dragging}
      data-tab={tab}
      data-actions={actions}
    >
      <header className="mb376-hero">
        <div className="mb376-pills">
          <b>ADVANCED MATHEMATICS</b>
          <b>COMPLEX NUMBERS</b>
        </div>
        <h1>Möbius Transformations</h1>
        <p>Explore complex mappings.</p>
        <nav>
          <span>Advanced</span>
          <span>Advanced Lab</span>
          <span>Complex Number View / CAS</span>
          <span>6-10 min</span>
        </nav>
        <div className="mb376-actions">
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
      <nav className="mb376-tabs">
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
      <section className="mb376-lab">
        <header>
          <div>
            <small>INTERACTION + VISUALIZATION</small>
            <h2>Two-Plane Mapping Lab</h2>
          </div>
          <strong>Live computation ●</strong>
          <span>{actions} actions</span>
        </header>
        <div className="mb376-main">
          <Plane title="z-plane (input)" badge={`z = ${text(z)}`}>
            <svg
              viewBox="0 0 300 430"
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
              {grid && <Grid />}
              <Axes />
              {circle && (
                <circle
                  cx={origin.x}
                  cy={origin.y}
                  r={2 * scale}
                  className="sample-circle"
                />
              )}
              <line
                x1={sx(1)}
                y1="15"
                x2={sx(1)}
                y2="410"
                className="sample-line"
              />
              {showPole && pole !== null && pole >= -3 && pole <= 3 && (
                <g>
                  <text x={sx(pole) - 5} y={sy(0) + 22} className="pole">
                    ✕
                  </text>
                  <text x={sx(pole) - 35} y={sy(0) + 45} className="pole-label">
                    z = {pole}
                    <tspan x={sx(pole) - 40} dy="14">
                      denominator zero
                    </tspan>
                  </text>
                </g>
              )}
              <circle
                cx={sx(z[0])}
                cy={sy(z[1])}
                r="8"
                className="point"
                onPointerDown={() => {
                  dragRef.current = true;
                  setDragging(true);
                }}
              />
              <text x={sx(z[0]) + 10} y={sy(z[1]) - 12} className="point-label">
                z = {text(z)}
              </text>
            </svg>
            <footer>
              <span>━ Line sample: Re(z) = 1</span>
              <span>--- Circle sample: |z| = 2</span>
              <span>✕ Pole: z = {pole ?? "∞"}</span>
            </footer>
          </Plane>
          <div className="mb376-arrow">➜</div>
          <Plane
            title="w-plane (image)"
            badge={defined ? `w ≈ ${text(w!)}` : "w = ∞"}
          >
            <svg viewBox="0 0 300 430">
              {grid && <Grid />}
              <Axes />
              {grid && <path d={path(mappedLine)} className="mapped-line" />}
              {circle && (
                <path d={path(mappedCircle)} className="mapped-circle" />
              )}
              {showPole && (
                <g>
                  <text x={sx(0) - 5} y={sy(0) + 22} className="pole">
                    ✕
                  </text>
                  <text x={sx(0) - 30} y={sy(0) + 45} className="pole-label">
                    w = ∞
                    <tspan x={sx(0) - 32} dy="14">
                      image of pole
                    </tspan>
                  </text>
                </g>
              )}
              {w && (
                <>
                  <circle cx={sx(w[0])} cy={sy(w[1])} r="8" className="point" />
                  <text
                    x={sx(w[0]) + 10}
                    y={sy(w[1]) - 12}
                    className="point-label"
                  >
                    w ≈ {text(w)}
                  </text>
                </>
              )}
            </svg>
            <footer>
              <span>━ Image of line</span>
              <span>--- Image of circle</span>
              <span>✕ Image of pole: w = ∞</span>
            </footer>
          </Plane>
          <aside className="mb376-controls">
            <section>
              <h3>Transformation</h3>
              <strong>w = (az + b)/(cz + d)</strong>
              <h3>Coefficients</h3>
              <div className="mb376-coefficients">
                {["a", "b", "c", "d"].map((label, index) => (
                  <label key={label}>
                    {label}
                    <input
                      aria-label={`${label} coefficient`}
                      type="number"
                      min="-5"
                      max="5"
                      step=".1"
                      value={coefficients[index]}
                      onChange={(event) =>
                        updateCoefficient(index, Number(event.target.value))
                      }
                    />
                  </label>
                ))}
              </div>
              <hr />
              <h3>Point z</h3>
              <Control
                label="Re(z)"
                value={z[0]}
                onChange={(value) => updateZ(0, value)}
              />
              <Control
                label="Im(z)"
                value={z[1]}
                onChange={(value) => updateZ(1, value)}
              />
              <Toggle
                label="Show grid image"
                checked={grid}
                setter={setGrid}
                act={act}
              />
              <Toggle
                label="Show circle image"
                checked={circle}
                setter={setCircle}
                act={act}
              />
              <Toggle
                label="Show pole"
                checked={showPole}
                setter={setShowPole}
                act={act}
              />
              <Toggle
                label="Show point calculation"
                checked={calculation}
                setter={setCalculation}
                act={act}
              />
            </section>
            <section className="mb376-results">
              <h3>Live results</h3>
              <p>
                w = ({a}z {b < 0 ? "-" : "+"} {Math.abs(b)})/({c}z{" "}
                {d < 0 ? "-" : "+"} {Math.abs(d)})
              </p>
              <p>
                Pole (denominator zero)
                <br />
                cz+d=0 -&gt; z={pole ?? "∞"}
              </p>
              <p>ad-bc = {determinant}</p>
              {calculation && (
                <strong>
                  {defined
                    ? `For z=${text(z)}, w=${text(w!)}`
                    : "At the pole, w is undefined (∞)."}
                </strong>
              )}
            </section>
          </aside>
        </div>
      </section>
      <section className="mb376-learning">
        <article>
          <h2>Formula</h2>
          <p>w = (az+b)/(cz+d)</p>
          <p>defined when cz+d ≠ 0</p>
          <small>Lines and circles map to lines or circles (or points).</small>
        </article>
        <article>
          <h2>Worked Example</h2>
          <p>Compute w for z=2+i using w=(z-1)/(z+1).</p>
          <p>w=((2+i)-1)/((2+i)+1)=(1+i)/(3+i)=(4+2i)/10=0.40+0.20i</p>
        </article>
        <article className="mb376-challenge">
          <h2>Practice Challenge</h2>
          <p>For w=1/z, where is the pole and what happens near it?</p>
          <button onClick={tryChallenge}>Try it in the lab</button>
          {challenge && (
            <strong>
              Pole z=0. As z approaches 0, |w| grows without bound.
            </strong>
          )}
        </article>
        <article className="mb376-warning">
          <h2>Common Misconception</h2>
          <p>
            Do not plug in z values that make cz+d=0; the transformation is
            undefined there. The point maps to ∞, not a finite complex number.
          </p>
        </article>
      </section>
      <nav className="mb376-nav">
        <a href="/lessons/advanced-mathematics/375-polynomial-roots">
          ←{" "}
          <span>
            <small>PREVIOUS</small>Polynomial Roots
          </span>
        </a>
        <a href="/lessons/advanced-mathematics/377-complex-functions">
          <span>
            <small>NEXT</small>Complex Functions
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}
function Grid() {
  return (
    <g>
      {Array.from({ length: 7 }, (_, i) => (
        <line
          key={`v${i}`}
          x1={9 + i * 47}
          x2={9 + i * 47}
          y1="12"
          y2="415"
          className="grid"
        />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <line
          key={`h${i}`}
          x1="8"
          x2="292"
          y1={27 + i * 47}
          y2={27 + i * 47}
          className="grid"
        />
      ))}
    </g>
  );
}
function Axes() {
  return (
    <g>
      <path d="M8 215H292M150 416V12" className="axis" />
      <text x="275" y="203">
        Re
      </text>
      <text x="159" y="20">
        Im
      </text>
      {[-3, -2, -1, 0, 1, 2, 3].map((n) => (
        <g key={n}>
          <text x={150 + n * 47} y="231" textAnchor="middle">
            {n}
          </text>
          <text x="139" y={215 - n * 47 + 4} textAnchor="end">
            {n}
          </text>
        </g>
      ))}
    </g>
  );
}
function Plane({
  title,
  badge,
  children,
}: {
  title: string;
  badge: string;
  children: React.ReactNode;
}) {
  return (
    <article className="mb376-plane">
      <header>
        <h3>{title}</h3>
        <span>{badge}</span>
      </header>
      {children}
    </article>
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
    <label className="mb376-control">
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
    <label className="mb376-toggle">
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
