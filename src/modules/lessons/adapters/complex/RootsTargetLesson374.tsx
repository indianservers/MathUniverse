import { ExternalLink, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./RootsTargetLesson374.css";

type Unit = "Degrees" | "Radians";
const clean = (value: number, digits = 3) => Number(value.toFixed(digits));
const complexText = (x: number, y: number) => {
  if (Math.abs(y) < 0.005) return String(clean(x, 2));
  if (Math.abs(x) < 0.005) return `${clean(y, 2)}i`;
  return `${clean(x, 2)} ${y < 0 ? "-" : "+"} ${Math.abs(clean(y, 2))}i`;
};

export default function RootsTargetLesson374({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [targetRadius, setTargetRadius] = useState(16);
  const [targetAngle, setTargetAngle] = useState(0);
  const [index, setIndex] = useState(4);
  const [unit, setUnit] = useState<Unit>("Degrees");
  const [spacing, setSpacing] = useState(true);
  const [powerCheck, setPowerCheck] = useState(true);
  const [allRoots, setAllRoots] = useState(true);
  const [selected, setSelected] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [challenge, setChallenge] = useState(false);
  const [tab, setTab] = useState("Interaction + visualization");
  const [actions, setActions] = useState(0);
  const dragRoot = useRef<number | null>(null);

  const rootRadius = clean(targetRadius ** (1 / index));
  const angleStep = clean(360 / index, 2);
  const roots = Array.from({ length: index }, (_, k) => {
    const degrees = clean((targetAngle + 360 * k) / index, 2);
    const radians = clean((degrees * Math.PI) / 180, 3);
    return {
      k,
      degrees,
      radians,
      x: clean(rootRadius * Math.cos((degrees * Math.PI) / 180), 3),
      y: clean(rootRadius * Math.sin((degrees * Math.PI) / 180), 3),
    };
  });
  const selectedRoot = roots[Math.min(selected, roots.length - 1)];

  const reset = () => {
    setTargetRadius(16);
    setTargetAngle(0);
    setIndex(4);
    setUnit("Degrees");
    setSpacing(true);
    setPowerCheck(true);
    setAllRoots(true);
    setSelected(1);
    setDragging(false);
    dragRoot.current = null;
    setChallenge(false);
    setTab("Interaction + visualization");
    setActions(0);
  };
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
    onInteraction();
  };
  useEffect(reset, [resetToken]);
  const changeIndex = (value: number) =>
    act(() => {
      setIndex(Math.max(2, Math.min(8, value)));
      setSelected(0);
    });

  const origin = { x: 245, y: 250 },
    scale = 78;
  const sx = (x: number) => origin.x + x * scale,
    sy = (y: number) => origin.y - y * scale;
  const drag = (event: React.PointerEvent<SVGSVGElement>) => {
    if (dragRoot.current === null) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const dx = ((event.clientX - bounds.left) / bounds.width) * 490 - origin.x;
    const dy = origin.y - ((event.clientY - bounds.top) / bounds.height) * 460;
    const rootDegrees = (Math.atan2(dy, dx) * 180) / Math.PI;
    const theta = clean(rootDegrees * index - 360 * dragRoot.current, 1);
    act(() => setTargetAngle(Math.max(-360, Math.min(360, theta))));
  };
  const shownTargetAngle =
    unit === "Degrees"
      ? `${targetAngle}°`
      : `${clean((targetAngle * Math.PI) / 180, 3)} rad`;
  const shownStep =
    unit === "Degrees"
      ? `${angleStep}°`
      : `${clean((2 * Math.PI) / index, 3)} rad`;

  return (
    <section
      className="rt374-page"
      data-testid="complex-mockup-0559"
      data-object-model="draggable-nth-root-wheel-polar-target-root-radius-equal-angle-spacing-selectable-power-check-degree-radian-challenge"
      data-target-radius={targetRadius}
      data-target-angle={targetAngle}
      data-index={index}
      data-root-radius={rootRadius}
      data-angle-step={angleStep}
      data-roots={JSON.stringify(roots.map(({ x, y }) => [x, y]))}
      data-selected={selectedRoot.k}
      data-unit={unit.toLowerCase()}
      data-spacing={spacing}
      data-power-check={powerCheck}
      data-all-roots={allRoots}
      data-dragging={dragging}
      data-challenge={challenge}
      data-tab={tab}
      data-actions={actions}
    >
      <header className="rt374-hero">
        <div className="rt374-pills">
          <b>ADVANCED MATHEMATICS</b>
          <b>COMPLEX NUMBERS</b>
        </div>
        <h1>Roots</h1>
        <p>Find evenly spaced complex roots.</p>
        <nav>
          <span>Advanced</span>
          <span>Advanced Lab</span>
          <span>Complex Number View / CAS</span>
          <span>6-10 min</span>
        </nav>
        <div className="rt374-actions">
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
      <nav className="rt374-tabs">
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
      <section className="rt374-lab">
        <header>
          <div>
            <small>INTERACTION + VISUALIZATION</small>
            <h2>nth-root wheel</h2>
          </div>
          <strong>
            ✓ Each root raised to the {index}th power returns {targetRadius}.
          </strong>
          <span>{actions} actions</span>
        </header>
        <div className="rt374-main">
          <article className="rt374-wheel">
            <h3>
              Target:{" "}
              <em>
                {targetRadius} = {targetRadius}e^(i{shownTargetAngle})
              </em>{" "}
              | n = {index}
            </h3>
            <svg
              viewBox="0 0 490 460"
              onPointerMove={drag}
              onPointerUp={() => {
                dragRoot.current = null;
                setDragging(false);
              }}
              onPointerLeave={() => {
                dragRoot.current = null;
                setDragging(false);
              }}
            >
              <path d="M12 250H480M245 450V12" className="axis" />
              <path d="M480 250l-8-5v10zM245 12l-5 8h10z" className="arrow" />
              <text x="463" y="236">
                Re
              </text>
              <text x="256" y="20">
                Im
              </text>
              {spacing &&
                roots.map((root) => (
                  <line
                    key={`guide-${root.k}`}
                    x1={origin.x}
                    y1={origin.y}
                    x2={sx(root.x)}
                    y2={sy(root.y)}
                    className="guide"
                  />
                ))}
              <circle
                cx={origin.x}
                cy={origin.y}
                r={rootRadius * scale}
                className="root-circle"
              />
              <circle
                cx={origin.x}
                cy={origin.y}
                r={Math.min(62, (rootRadius * scale) / 2)}
                className="angle-circle"
              />
              {spacing &&
                roots.map((root) => (
                  <text
                    key={`angle-${root.k}`}
                    x={origin.x + Math.cos((root.degrees * Math.PI) / 180) * 72}
                    y={origin.y - Math.sin((root.degrees * Math.PI) / 180) * 72}
                    className="angle-label"
                  >
                    {unit === "Degrees" ? `${root.degrees}°` : root.radians}
                  </text>
                ))}
              {roots.map((root) => (
                <g
                  key={root.k}
                  opacity={allRoots || root.k === selected ? 1 : 0.16}
                >
                  <circle
                    cx={sx(root.x)}
                    cy={sy(root.y)}
                    r={root.k === selected ? 8 : 7}
                    className={root.k === selected ? "root selected" : "root"}
                    onPointerDown={() => {
                      dragRoot.current = root.k;
                      setDragging(true);
                      setSelected(root.k);
                    }}
                    onClick={() => act(() => setSelected(root.k))}
                  />
                  <text
                    x={sx(root.x) + (root.x >= 0 ? 10 : -28)}
                    y={sy(root.y) - 12}
                    className="root-label"
                  >
                    {complexText(root.x, root.y)}
                  </text>
                </g>
              ))}
            </svg>
            <footer>
              <span>● Roots ({index} total)</span>
              <span>--&gt; Equal angle spacing ({shownStep})</span>
            </footer>
            <div className="rt374-selected">
              <b>
                Selected root:{" "}
                <em>{complexText(selectedRoot.x, selectedRoot.y)}</em>
              </b>
              {powerCheck && (
                <strong>
                  Check: ({complexText(selectedRoot.x, selectedRoot.y)})^{index}{" "}
                  = {targetRadius}e^(i{shownTargetAngle}) ✓
                </strong>
              )}
            </div>
          </article>
          <aside className="rt374-controls">
            <section>
              <h3>Target number (polar form)</h3>
              <div className="rt374-pair">
                <label>
                  R (modulus)
                  <input
                    aria-label="Target modulus"
                    type="number"
                    min="1"
                    max="100"
                    value={targetRadius}
                    onChange={(event) =>
                      act(() =>
                        setTargetRadius(
                          Math.max(1, Number(event.target.value)),
                        ),
                      )
                    }
                  />
                </label>
                <label>
                  theta (angle)
                  <input
                    aria-label="Target angle"
                    type="number"
                    min="-360"
                    max="360"
                    value={targetAngle}
                    onChange={(event) =>
                      act(() => setTargetAngle(Number(event.target.value)))
                    }
                  />
                </label>
              </div>
              <h3>Root index</h3>
              <div className="rt374-stepper">
                <span>n</span>
                <button
                  aria-label="Decrease root index"
                  onClick={() => changeIndex(index - 1)}
                >
                  −
                </button>
                <b>{index}</b>
                <button
                  aria-label="Increase root index"
                  onClick={() => changeIndex(index + 1)}
                >
                  +
                </button>
              </div>
              <h3>Angle unit</h3>
              <div className="rt374-unit">
                {(["Degrees", "Radians"] as Unit[]).map((name) => (
                  <label key={name}>
                    <input
                      type="radio"
                      name="root-unit"
                      checked={unit === name}
                      onChange={() => act(() => setUnit(name))}
                    />
                    {name}
                  </label>
                ))}
              </div>
              <Toggle
                label="Show equal spacing"
                checked={spacing}
                setter={setSpacing}
                act={act}
              />
              <Toggle
                label="Show power check"
                checked={powerCheck}
                setter={setPowerCheck}
                act={act}
              />
              <Toggle
                label="Show all roots"
                checked={allRoots}
                setter={setAllRoots}
                act={act}
              />
            </section>
            <section className="rt374-results">
              <h3>Live results</h3>
              <p>
                Root radius{" "}
                <b>
                  R^(1/n) = {targetRadius}^(1/{index}) = {rootRadius}
                </b>
              </p>
              <p>
                Angle step{" "}
                <b>
                  {unit === "Degrees"
                    ? `360°/${index} = ${angleStep}°`
                    : `2pi/${index} = ${shownStep}`}
                </b>
              </p>
              <p>Roots (k = 0, 1, ..., {index - 1})</p>
              {roots.map((root) => (
                <p key={root.k}>
                  <i>k = {root.k}:</i>
                  <span>
                    {rootRadius}e^(i
                    {unit === "Degrees"
                      ? `${root.degrees}°`
                      : `${root.radians}`}
                    )
                  </span>
                  <b>{complexText(root.x, root.y)}</b>
                </p>
              ))}
            </section>
          </aside>
        </div>
      </section>
      <section className="rt374-learning">
        <article>
          <h2>Formula</h2>
          <p>The nth roots of Re^(i theta) are</p>
          <strong>z_k = R^(1/n)e^(i(theta + 360°k)/n)</strong>
          <p>for k = 0, 1, 2, ..., n - 1.</p>
          <hr />
          <small>Key ideas</small>
          <p>
            ✓ Take the nth root of the modulus.
            <br />✓ Divide the circle into n equal angles.
            <br />✓ Add k = 0...n-1 to get all roots.
          </p>
        </article>
        <article>
          <h2>Worked example</h2>
          <p>Find the fourth roots of 16.</p>
          <p>
            • Write 16 = 16e^(i0°)
            <br />• n = 4 -&gt; radius = 16^(1/4) = 2.
            <br />• Angle step = 360°/4 = 90°.
            <br />• Roots:
            <br />
            k=0: 2<br />
            k=1: 2i
            <br />
            k=2: -2
            <br />
            k=3: -2i
          </p>
          <p>These four points are equally spaced on the circle.</p>
        </article>
        <article className="rt374-challenge">
          <h2>Practice challenge</h2>
          <p>Find the cube roots of 8; predict the angle spacing first.</p>
          <p>
            • Target: 8 = 8e^(i0°)
            <br />• n = 3<br />• Predict angle step = ?
          </p>
          <button onClick={() => act(() => setChallenge(!challenge))}>
            Start challenge
          </button>
          {challenge && (
            <strong>
              Radius 2, step 120°: 2, -1 + sqrt(3)i, -1 - sqrt(3)i.
            </strong>
          )}
          <small>Hint: The step is 360°/n.</small>
        </article>
      </section>
      <section className="rt374-warning">
        <b>⚠ Common misconception</b>
        <p>A nonzero complex number has n nth-roots, not just one.</p>
        <p>
          All roots have the same distance from the origin but different angles.
          Only when n=1 do we get a single root.
        </p>
        <span>◆</span>
      </section>
      <nav className="rt374-nav">
        <a href="/lessons/advanced-mathematics/373-powers">
          ←{" "}
          <span>
            <small>PREVIOUS</small>Powers
          </span>
        </a>
        <a href="/lessons/advanced-mathematics/375-polynomial-roots">
          <span>
            <small>NEXT</small>Polynomial Roots
          </span>{" "}
          →
        </a>
      </nav>
    </section>
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
    <label className="rt374-toggle">
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
