import { ExternalLink, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./EulerFormTargetLesson372.css";

type Unit = "Degrees" | "Radians";
const clean = (value: number, digits = 2) => Number(value.toFixed(digits));

export default function EulerFormTargetLesson372({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [radius, setRadius] = useState(5);
  const [degrees, setDegrees] = useState(53.1);
  const [unit, setUnit] = useState<Unit>("Degrees");
  const [circle, setCircle] = useState(true);
  const [bridge, setBridge] = useState(true);
  const [rectangularCheck, setRectangularCheck] = useState(true);
  const [tab, setTab] = useState("Interaction + visualization");
  const [answer, setAnswer] = useState("A");
  const [challenge, setChallenge] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [actions, setActions] = useState(0);
  const draggingRef = useRef(false);

  const radians = clean((degrees * Math.PI) / 180, 3);
  const x = clean(radius * Math.cos((degrees * Math.PI) / 180), 1);
  const y = clean(radius * Math.sin((degrees * Math.PI) / 180), 1);
  const shownAngle = unit === "Degrees" ? `${degrees}°` : `${radians} rad`;
  const rectangular = `${x} ${y < 0 ? "-" : "+"} ${Math.abs(y)}i`;
  const trig = `${radius}(cos ${shownAngle} + i sin ${shownAngle})`;
  const euler = `${radius}e^(i${shownAngle})`;

  const reset = () => {
    setRadius(5);
    setDegrees(53.1);
    setUnit("Degrees");
    setCircle(true);
    setBridge(true);
    setRectangularCheck(true);
    setTab("Interaction + visualization");
    setAnswer("A");
    setChallenge(1);
    setDragging(false);
    draggingRef.current = false;
    setActions(0);
  };
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
    onInteraction();
  };
  useEffect(reset, [resetToken]);

  const origin = { x: 128, y: 271 };
  const scale = 24;
  const point = { x: origin.x + x * scale, y: origin.y - y * scale };
  const drag = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!draggingRef.current) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const dx = ((event.clientX - bounds.left) / bounds.width) * 300 - origin.x;
    const dy = origin.y - ((event.clientY - bounds.top) / bounds.height) * 410;
    act(() => {
      setRadius(
        clean(Math.max(0.1, Math.min(10, Math.hypot(dx, dy) / scale)), 1),
      );
      setDegrees(clean((Math.atan2(dy, dx) * 180) / Math.PI, 1));
    });
  };

  return (
    <section
      className="ef372-page"
      data-testid="complex-mockup-0557"
      data-object-model="draggable-euler-bridge-radius-angle-rectangular-trigonometric-exponential-scale-factor-unit-circle-graded-challenge"
      data-radius={radius}
      data-degrees={degrees}
      data-radians={radians}
      data-point={JSON.stringify([x, y])}
      data-unit={unit.toLowerCase()}
      data-circle={circle}
      data-bridge={bridge}
      data-rectangular-check={rectangularCheck}
      data-answer={answer}
      data-correct={answer === "A"}
      data-challenge={challenge}
      data-tab={tab}
      data-dragging={dragging}
      data-actions={actions}
    >
      <header className="ef372-hero">
        <div>
          <div className="ef372-pills">
            <b>ADVANCED MATHEMATICS</b>
            <b>COMPLEX NUMBERS</b>
          </div>
          <h1>Euler Form</h1>
          <p>Connect exponentials and trigonometry.</p>
          <nav>
            <span>Advanced</span>
            <span>Advanced Lab</span>
            <span>Complex Number View / CAS</span>
            <span>6-10 min</span>
          </nav>
          <div className="ef372-actions">
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
        </div>
        <aside>
          <h2>At a glance</h2>
          <p>
            ● Bridge trig form r(cos theta + i sin theta) to Euler form re^(i
            theta).
          </p>
          <p>● General complex numbers keep the scale factor r.</p>
        </aside>
      </header>

      <nav className="ef372-tabs">
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

      <section className="ef372-work">
        <article className="ef372-lab">
          <header>
            <h2>EULER BRIDGE LAB</h2>
            <p>See how rectangular, trig, and Euler forms connect.</p>
          </header>
          <div className="ef372-lab-body">
            <section className="ef372-plane">
              <svg
                viewBox="0 0 300 410"
                onPointerMove={drag}
                onPointerUp={() => {
                  draggingRef.current = false;
                  setDragging(false);
                }}
                onPointerLeave={() => {
                  draggingRef.current = false;
                  setDragging(false);
                }}
              >
                <defs>
                  <pattern
                    id="ef-grid"
                    width="24"
                    height="24"
                    patternUnits="userSpaceOnUse"
                  >
                    <path d="M24 0H0V24" fill="none" stroke="#dbe6ed" />
                  </pattern>
                </defs>
                <rect
                  x="4"
                  y="20"
                  width="282"
                  height="360"
                  fill="url(#ef-grid)"
                />
                <path d="M4 271H292M128 398V8" className="axis" />
                <path d="M292 271l-7-4v8zM128 8l-4 7h8z" className="arrow" />
                <text x="289" y="258">
                  Re
                </text>
                <text x="116" y="15">
                  Im
                </text>
                {[-6, -4, -2, 2, 4, 6].map((number) => (
                  <g key={number}>
                    <text
                      x={origin.x + number * scale}
                      y="287"
                      textAnchor="middle"
                    >
                      {number}
                    </text>
                    <text
                      x="118"
                      y={origin.y - number * scale + 4}
                      textAnchor="end"
                    >
                      {number}
                    </text>
                  </g>
                ))}
                {circle && (
                  <circle
                    cx={origin.x}
                    cy={origin.y}
                    r={radius * scale}
                    className="unit-circle"
                  />
                )}
                {rectangularCheck && (
                  <path
                    d={`M${point.x} ${point.y}V${origin.y}M${origin.x} ${point.y}H${point.x}`}
                    className="check"
                  />
                )}
                <line
                  x1={origin.x}
                  y1={origin.y}
                  x2={point.x}
                  y2={point.y}
                  className="vector"
                />
                {bridge && (
                  <path
                    d={`M${origin.x + 43} ${origin.y}A43 43 0 0 ${degrees < 0 ? 0 : 1} ${origin.x + 26} ${origin.y - 34}`}
                    className="angle"
                  />
                )}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="7"
                  className="point"
                  onPointerDown={() => {
                    draggingRef.current = true;
                    setDragging(true);
                  }}
                />
                <text x={point.x + 10} y={point.y - 20} className="zlabel">
                  z = {rectangular}
                </text>
                <text x={point.x + 10} y={point.y - 4}>
                  ({x}, {y})
                </text>
                <text
                  x={(origin.x + point.x) / 2 - 35}
                  y={(origin.y + point.y) / 2 - 14}
                  className="rlabel"
                >
                  r = {radius}
                </text>
                <text x={origin.x + 43} y={origin.y - 24} className="theta">
                  theta ~= {shownAngle}
                </text>
              </svg>
              <footer>
                <span>x = {x}</span>
                <span>y = {y}</span>
                <span>r = {radius}</span>
                <span>theta ~= {shownAngle}</span>
              </footer>
            </section>
            <section className="ef372-bridge">
              <FormCard
                number="1"
                kind="Rectangular"
                value={rectangular}
                className="rect"
              />
              <span>↓</span>
              <FormCard number="2" kind="Trig" value={trig} className="trig" />
              <span>↓</span>
              <FormCard
                number="3"
                kind="Euler"
                value={euler}
                className="euler"
              />
            </section>
          </div>
        </article>
        <aside className="ef372-side">
          <section className="ef372-controls">
            <h2>Controls</h2>
            <Control
              label="Radius r"
              min={0.1}
              max={10}
              step={0.1}
              value={radius}
              onChange={(value) => act(() => setRadius(value))}
            />
            <Control
              label="Angle theta"
              min={-180}
              max={180}
              step={0.1}
              value={degrees}
              suffix="degrees"
              onChange={(value) => act(() => setDegrees(value))}
            />
            <h3>Angle unit</h3>
            <div className="ef372-unit">
              {(["Degrees", "Radians"] as Unit[]).map((name) => (
                <button
                  key={name}
                  className={unit === name ? "active" : ""}
                  onClick={() => act(() => setUnit(name))}
                >
                  {name}
                </button>
              ))}
            </div>
            <hr />
            <Toggle
              label="Show unit circle"
              checked={circle}
              setter={setCircle}
              act={act}
            />
            <Toggle
              label="Show trig bridge"
              checked={bridge}
              setter={setBridge}
              act={act}
            />
            <Toggle
              label="Show rectangular check"
              checked={rectangularCheck}
              setter={setRectangularCheck}
              act={act}
            />
          </section>
          <section className="ef372-results">
            <h2>Live results</h2>
            <p>e^(i theta) = cos theta + i sin theta</p>
            <strong>z = {euler}</strong>
            {rectangularCheck && <em>rectangular check ~= {rectangular}</em>}
          </section>
        </aside>
      </section>

      <section className="ef372-learning">
        <article className="ef372-formulas">
          <h2>KEY FORMULAS</h2>
          <div>
            <b>Euler identity</b>
            <p>e^(i theta) = cos theta + i sin theta</p>
          </div>
          <div>
            <b>General complex number</b>
            <p>z = re^(i theta), r &gt;= 0, theta in R</p>
          </div>
        </article>
        <article className="ef372-example">
          <h2>WORKED EXAMPLE</h2>
          <strong>Convert z = 3 + 4i to Euler form.</strong>
          <ol>
            <li>Find r: r = sqrt(3^2 + 4^2) = 5</li>
            <li>Find theta: theta = atan(4/3) ~= 53.1 degrees</li>
            <li>Trig form: 5(cos 53.1 degrees + i sin 53.1 degrees)</li>
            <li>Euler form: 5e^(i53.1 degrees)</li>
          </ol>
          <p>Therefore, 3 + 4i = 5e^(i53.1 degrees).</p>
        </article>
        <article className="ef372-warning">
          <h2>COMMON MISCONCEPTION</h2>
          <h3>Do not drop r!</h3>
          <p>5e^(i53.1 degrees) is not the same as e^(i53.1 degrees).</p>
          <div className="wrong">
            ✕ e^(i53.1 degrees)
            <small>r = 1 (unit circle) -&gt; (0.6, 0.8)</small>
          </div>
          <div className="right">
            ✓ 5e^(i53.1 degrees)<small>r = 5 -&gt; (3, 4)</small>
          </div>
          <p>General complex numbers keep the scale factor r.</p>
        </article>
      </section>

      <section className="ef372-practice">
        <div>
          <h2>PRACTICE CHALLENGE</h2>
          <h3>Write 2(cos 120 degrees + i sin 120 degrees) in Euler form.</h3>
          <p>Choose the correct option.</p>
          <div className="ef372-options">
            {[
              ["A", "2e^(i120 degrees)"],
              ["B", "2e^120 degrees"],
              ["C", "e^(i120 degrees)"],
              ["D", "2e^(-i120 degrees)"],
            ].map(([key, value]) => (
              <button
                key={key}
                className={
                  answer === key
                    ? key === "A"
                      ? "selected correct"
                      : "selected wrong"
                    : ""
                }
                onClick={() => act(() => setAnswer(key))}
              >
                <i>{key}</i>
                {value}
                {answer === key && <b>{key === "A" ? "✓" : "✕"}</b>}
              </button>
            ))}
          </div>
        </div>
        <aside className={answer === "A" ? "correct" : "wrong"}>
          <h2>{answer === "A" ? "Correct!" : "Try again"}</h2>
          <p>2(cos 120 degrees + i sin 120 degrees) = 2e^(i120 degrees)</p>
          <strong>The scale factor r = 2 stays in Euler form.</strong>
          <button
            onClick={() =>
              act(() => {
                setAnswer("");
                setChallenge((value) => value + 1);
              })
            }
          >
            <RotateCcw />
            New challenge
          </button>
        </aside>
      </section>

      <nav className="ef372-nav">
        <a href="/lessons/advanced-mathematics/371-polar-form">
          ←{" "}
          <span>
            <small>PREVIOUS</small>Polar Form
          </span>
        </a>
        <a href="/lessons/advanced-mathematics/373-powers">
          <span>
            <small>NEXT</small>Powers
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}

function FormCard({
  number,
  kind,
  value,
  className,
}: {
  number: string;
  kind: string;
  value: string;
  className: string;
}) {
  return (
    <article className={className}>
      <h3>
        <i>{number}</i>
        {kind}
      </h3>
      <strong>{value}</strong>
    </article>
  );
}
function Control({
  label,
  min,
  max,
  step,
  value,
  suffix,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="ef372-control">
      <b>{label}</b>
      <div>
        <input
          aria-label={label}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <input
          aria-label={`${label} value`}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
      </div>
      <small>
        <span>
          {min}
          {suffix ? " degrees" : ""}
        </span>
        <span>
          {max}
          {suffix ? " degrees" : ""}
        </span>
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
    <label className="ef372-toggle">
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
