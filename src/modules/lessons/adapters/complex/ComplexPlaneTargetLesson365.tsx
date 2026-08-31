import { Maximize2, RotateCcw, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./ComplexPlaneTargetLesson365.css";

const clean = (value: number) => Number(value.toFixed(4));
const signed = (value: number) =>
  (value < 0 ? " - " : " + ") + Math.abs(value).toFixed(3) + "i";

export default function ComplexPlaneTargetLesson365({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [a, setA] = useState(2);
  const [b, setB] = useState(1);
  const [theta, setTheta] = useState(45);
  const [dragging, setDragging] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState("Interaction + visualization");
  const [components, setComponents] = useState(true);
  const [trace, setTrace] = useState(true);
  const [grid, setGrid] = useState(true);
  const [values, setValues] = useState(true);
  const [challenge, setChallenge] = useState(false);
  const [answer, setAnswer] = useState("");
  const [verdict, setVerdict] = useState("");
  const [actions, setActions] = useState(0);

  const radians = (theta * Math.PI) / 180;
  const result = useMemo(
    () => ({
      real: clean(a * Math.cos(radians) - b * Math.sin(radians)),
      imaginary: clean(a * Math.sin(radians) + b * Math.cos(radians)),
      modulus: clean(Math.hypot(a, b)),
      argument: clean((Math.atan2(b, a) * 180) / Math.PI),
    }),
    [a, b, radians],
  );
  const reset = () => {
    setA(2);
    setB(1);
    setTheta(45);
    setDragging(false);
    setZoom(1);
    setExpanded(false);
    setTab("Interaction + visualization");
    setComponents(true);
    setTrace(true);
    setGrid(true);
    setValues(true);
    setChallenge(false);
    setAnswer("");
    setVerdict("");
    setActions(0);
  };
  const act = (work: () => void) => {
    work();
    setActions((value) => value + 1);
    onInteraction();
  };
  useEffect(reset, [resetToken]);

  const px = (x: number) => 310 + x * 62 * zoom;
  const py = (y: number) => 265 - y * 54 * zoom;
  const move = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - box.left) / box.width) * 620;
    const y = ((event.clientY - box.top) / box.height) * 520;
    act(() => {
      setA(clean(Math.max(-4, Math.min(4, (x - 310) / (62 * zoom)))));
      setB(clean(Math.max(-4, Math.min(4, (265 - y) / (54 * zoom)))));
    });
  };
  const check = () =>
    act(() =>
      setVerdict(
        answer.trim().toUpperCase() === "II" ? "correct" : "incorrect",
      ),
    );

  return (
    <section
      className={"cp365-page" + (expanded ? " expanded" : "")}
      data-testid="complex-mockup-0550"
      data-object-model="draggable-argand-point-real-imaginary-components-live-euler-rotation-modulus-argument-controls-toggles-challenge"
      data-z={JSON.stringify([a, b])}
      data-rotated={JSON.stringify([result.real, result.imaginary])}
      data-modulus={result.modulus}
      data-argument={result.argument}
      data-theta={theta}
      data-zoom={zoom}
      data-tab={tab}
      data-components={components}
      data-trace={trace}
      data-grid={grid}
      data-values={values}
      data-challenge={challenge}
      data-verdict={verdict}
      data-actions={actions}
    >
      <header className="cp365-hero">
        <div className="cp365-pills">
          <b>ADVANCED MATHEMATICS</b>
          <b>COMPLEX NUMBERS</b>
        </div>
        <div className="cp365-title">
          <div>
            <h1>Complex Plane</h1>
            <p>Represent complex values geometrically.</p>
          </div>
          <nav>
            <span>Advanced</span>
            <span>Advanced Lab</span>
            <span>Complex Number View / CAS</span>
            <span>6-10 min</span>
          </nav>
        </div>
      </header>
      <nav className="cp365-tabs">
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
      <section className="cp365-workspace">
        <article className="cp365-plane">
          <header>
            <h2>Complex plane (Argand plane)</h2>
            <div>
              <button
                title="Zoom"
                onClick={() => act(() => setZoom(zoom === 1 ? 1.12 : 1))}
              >
                <Search />
              </button>
              <button title="Reset view" onClick={() => act(() => setZoom(1))}>
                <RotateCcw />
              </button>
              <button
                title="Expand graph"
                onClick={() => act(() => setExpanded(!expanded))}
              >
                <Maximize2 />
              </button>
            </div>
          </header>
          <svg
            viewBox="0 0 620 520"
            onPointerMove={move}
            onPointerUp={() => setDragging(false)}
            onPointerLeave={() => setDragging(false)}
          >
            <defs>
              <marker
                id="cp-arrow-cyan"
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="3"
                orient="auto"
              >
                <path d="M0 0L6 3 0 6Z" fill="#06a9cf" />
              </marker>
              <marker
                id="cp-arrow-purple"
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="3"
                orient="auto"
              >
                <path d="M0 0L6 3 0 6Z" fill="#7d38e8" />
              </marker>
              <pattern
                id="cp-grid"
                width={62 * zoom}
                height={54 * zoom}
                patternUnits="userSpaceOnUse"
              >
                <path
                  d={"M" + 62 * zoom + " 0H0V" + 54 * zoom}
                  fill="none"
                  stroke="#dce5ec"
                />
              </pattern>
            </defs>
            {grid && (
              <rect
                x="20"
                y="20"
                width="580"
                height="480"
                fill="url(#cp-grid)"
              />
            )}
            <path d="M20 265H600M310 500V20" className="axis" />
            <text x="592" y="252">
              Re(a)
            </text>
            <text x="321" y="24">
              Im(b)
            </text>
            {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((value) => (
              <g key={value}>
                <text x={px(value)} y="284" textAnchor="middle">
                  {value}
                </text>
                <text x="297" y={py(value) + 4} textAnchor="end">
                  {value}
                </text>
              </g>
            ))}
            {components && (
              <>
                <line
                  x1={px(a)}
                  y1={py(b)}
                  x2={px(a)}
                  y2={py(0)}
                  className="component"
                />
                <line
                  x1={px(a)}
                  y1={py(b)}
                  x2={px(0)}
                  y2={py(b)}
                  className="component"
                />
                <text x={px(a) + 15} y={py(0) - 12} className="cyan">
                  b = {b}
                </text>
                <text x={px(0) - 105} y={py(b) - 12} className="cyan">
                  a = {a}
                </text>
              </>
            )}
            {trace && (
              <path
                d={
                  "M310 265 Q " +
                  (px(a) + px(result.real)) / 2 +
                  " " +
                  (py(b) + py(result.imaginary)) / 2 +
                  " " +
                  px(result.real) +
                  " " +
                  py(result.imaginary)
                }
                className="trace"
              />
            )}
            <line
              x1="310"
              y1="265"
              x2={px(a)}
              y2={py(b)}
              className="zline"
              markerEnd="url(#cp-arrow-cyan)"
            />
            <line
              x1="310"
              y1="265"
              x2={px(result.real)}
              y2={py(result.imaginary)}
              className="rotated"
              markerEnd="url(#cp-arrow-purple)"
            />
            <circle
              cx={px(a)}
              cy={py(b)}
              r="8"
              className="zpoint"
              onPointerDown={() => setDragging(true)}
            />
            <circle
              cx={px(result.real)}
              cy={py(result.imaginary)}
              r="7"
              className="rotated-point"
            />
            <path
              d={
                "M355 265 A45 45 0 0 0 " +
                (310 + 45 * Math.cos(radians)) +
                " " +
                (265 - 45 * Math.sin(radians))
              }
              className="angle"
            />
            <text x="365" y="253" className="orange">
              θ = {theta}°
            </text>
            {values && (
              <>
                <text x={px(a) + 28} y={py(b) - 8} className="cyan">
                  <tspan fontWeight="800">
                    z = {a}
                    {b < 0 ? " - " : " + "}
                    {Math.abs(b)}i
                  </tspan>
                  <tspan x={px(a) + 28} dy="18">
                    ({a}, {b})
                  </tspan>
                </text>
                <text
                  x={px(result.real) + 14}
                  y={py(result.imaginary) - 14}
                  className="purple"
                >
                  <tspan fontWeight="800">
                    rotated z ≈ {result.real}
                    {signed(result.imaginary)}
                  </tspan>
                  <tspan x={px(result.real) + 14} dy="18">
                    ({result.real}, {result.imaginary})
                  </tspan>
                </text>
              </>
            )}
          </svg>
          <div className="cp365-legend">
            <span>
              z = {a}
              {b < 0 ? " - " : " + "}
              {Math.abs(b)}i
            </span>
            <span>rotated z = z · eⁱᶿ</span>
            <span>θ = {theta}°</span>
          </div>
        </article>
        <aside className="cp365-controls">
          <article>
            <h2>Controls</h2>
            <Control
              label="Real part (a)"
              value={a}
              min={-4}
              max={4}
              step={0.1}
              onChange={(value) => act(() => setA(value))}
            />
            <Control
              label="Imaginary part (b)"
              value={b}
              min={-4}
              max={4}
              step={0.1}
              onChange={(value) => act(() => setB(value))}
            />
            <Control
              label="Rotation θ (degrees)"
              value={theta}
              min={-180}
              max={180}
              step={1}
              onChange={(value) => act(() => setTheta(value))}
            />
            {[
              ["Show components (a, b)", components, setComponents],
              ["Show rotation trace", trace, setTrace],
              ["Show grid", grid, setGrid],
              ["Show values on hover", values, setValues],
            ].map(([label, checked, setter]) => (
              <label className="cp365-toggle" key={String(label)}>
                {String(label)}
                <input
                  type="checkbox"
                  checked={Boolean(checked)}
                  onChange={(event) =>
                    act(() =>
                      (setter as React.Dispatch<React.SetStateAction<boolean>>)(
                        event.target.checked,
                      ),
                    )
                  }
                />
              </label>
            ))}
          </article>
          <article className="cp365-results">
            <h2>Results</h2>
            <p>
              <span>|z| (modulus)</span>
              <b>
                {result.modulus}
                <small>≈ √{clean(a * a + b * b)}</small>
              </b>
            </p>
            <p>
              <span>arg(z) (argument)</span>
              <b>{result.argument}°</b>
            </p>
            <p>
              <span>Rotated value</span>
              <b>
                ≈ {result.real}
                {signed(result.imaginary)}
              </b>
            </p>
          </article>
        </aside>
        <aside className="cp365-notes">
          <article>
            <h2>Formula / Key insight</h2>
            <code>
              z = a + bi
              <br />
              |z| = √(a² + b²)
              <br />
              arg(z) = atan2(b, a)
            </code>
            <p>Multiplying by eⁱᶿ rotates z by θ while preserving |z|.</p>
            <svg viewBox="0 0 240 110">
              <path d="M28 92H220M70 108V15" className="axis" />
              <line
                x1="70"
                y1="92"
                x2="157"
                y2="55"
                className="zline"
                markerEnd="url(#cp-arrow-cyan)"
              />
              <line
                x1="70"
                y1="92"
                x2="145"
                y2="30"
                className="rotated"
                markerEnd="url(#cp-arrow-purple)"
              />
              <text x="162" y="55">
                z
              </text>
              <text x="149" y="29" className="purple">
                z eⁱᶿ
              </text>
            </svg>
          </article>
          <article>
            <h2>Worked example</h2>
            <p>
              Given z = {a} {b < 0 ? "−" : "+"} {Math.abs(b)}i and θ = {theta}°.
            </p>
            <ul>
              <li>
                |z| = √({a}² + {b}²) = {result.modulus}
              </li>
              <li>
                arg(z) = atan2({b}, {a}) ≈ {result.argument}°
              </li>
              <li>
                z eⁱᶿ = ({a}+{b}i)(cos {theta}° + i sin {theta}°)
              </li>
            </ul>
            <strong>
              ≈ {result.real}
              {signed(result.imaginary)}
            </strong>
            <p>
              The rotated point is at ({result.real}, {result.imaginary}).
            </p>
          </article>
        </aside>
      </section>
      <section className="cp365-practice">
        <div>
          <b>Practice challenge</b>
          <span>Place w = −3 + 2i, then estimate |w| and its quadrant.</span>
        </div>
        {!challenge ? (
          <button onClick={() => act(() => setChallenge(true))}>
            Start challenge →
          </button>
        ) : (
          <div className="cp365-answer">
            <input
              aria-label="Quadrant answer"
              placeholder="Quadrant"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
            />
            <button onClick={check}>Check</button>
            <output className={verdict}>
              {verdict === "correct"
                ? "Correct: quadrant II"
                : verdict === "incorrect"
                  ? "Try II"
                  : ""}
            </output>
          </div>
        )}
      </section>
      <nav className="cp365-nav">
        <a href="/lessons/advanced-mathematics/371-polar-form">
          ←{" "}
          <span>
            <small>Previous</small>Polar Form
          </span>
        </a>
        <a href="/lessons/advanced-mathematics/366-real-and-imaginary-parts">
          <span>
            <small>Next</small>Real and Imaginary Parts
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}

function Control({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="cp365-control">
      <span>
        {label}
        <output>
          {value}
          {label.includes("degrees") ? "°" : ""}
        </output>
      </span>
      <input
        aria-label={label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <small>
        <i>{min}</i>
        <i>0</i>
        <i>{max}</i>
      </small>
    </label>
  );
}
