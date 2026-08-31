import { ExternalLink, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./PolynomialRootsTargetLesson375.css";

type Coefficients = [number, number, number];
const clean = (value: number, digits = 2) => Number(value.toFixed(digits));
const signed = (value: number) =>
  value < 0 ? `- ${Math.abs(value)}` : `+ ${value}`;
const rootText = (real: number, imaginary: number) =>
  imaginary === 0
    ? String(clean(real))
    : `${clean(real)} ${imaginary < 0 ? "-" : "+"} ${Math.abs(clean(imaginary))}i`;

export default function PolynomialRootsTargetLesson375({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [coefficients, setCoefficients] = useState<Coefficients>([1, -2, 5]);
  const [mirror, setMirror] = useState(true);
  const [showDiscriminant, setShowDiscriminant] = useState(true);
  const [showFactors, setShowFactors] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [grade, setGrade] = useState("idle");
  const [tab, setTab] = useState("Interaction + visualization");
  const [dragging, setDragging] = useState(false);
  const [actions, setActions] = useState(0);
  const dragRef = useRef(false);
  const [a, b, c] = coefficients;
  const discriminant = clean(b * b - 4 * a * c);
  const complex = discriminant < 0;
  const repeated = discriminant === 0;
  const rootReal = clean(-b / (2 * a));
  const rootImaginary = complex
    ? clean(Math.sqrt(-discriminant) / (2 * Math.abs(a)))
    : 0;
  const rootOne = complex
    ? [rootReal, rootImaginary]
    : [clean((-b + Math.sqrt(discriminant)) / (2 * a)), 0];
  const rootTwo = complex
    ? [rootReal, -rootImaginary]
    : [clean((-b - Math.sqrt(discriminant)) / (2 * a)), 0];
  const vertexX = clean(-b / (2 * a));
  const vertexY = clean(a * vertexX * vertexX + b * vertexX + c);
  const classification = complex
    ? "Two non-real roots"
    : repeated
      ? "One repeated real root"
      : "Two real roots";

  const reset = () => {
    setCoefficients([1, -2, 5]);
    setMirror(true);
    setShowDiscriminant(true);
    setShowFactors(true);
    setSelectedAnswer("");
    setGrade("idle");
    setTab("Interaction + visualization");
    setDragging(false);
    dragRef.current = false;
    setActions(0);
  };
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
    onInteraction();
  };
  useEffect(reset, [resetToken]);
  const update = (index: number, value: number) =>
    act(() =>
      setCoefficients(
        (current) =>
          current.map((item, itemIndex) =>
            itemIndex === index
              ? index === 0 && value === 0
                ? 0.1
                : clean(value, 1)
              : item,
          ) as Coefficients,
      ),
    );
  const adjust = (index: number, delta: number) =>
    update(index, coefficients[index] + delta);

  const px = (x: number) => 142 + x * 34,
    py = (y: number) => 230 - y * 22;
  const parabolaPath = Array.from(
    { length: 81 },
    (_, index) => -4 + index * 0.1,
  )
    .map(
      (x, index) => `${index ? "L" : "M"}${px(x)} ${py(a * x * x + b * x + c)}`,
    )
    .join(" ");
  const rootOrigin = { x: 145, y: 188 },
    rootScale = 48;
  const rx = (x: number) => rootOrigin.x + x * rootScale,
    ry = (y: number) => rootOrigin.y - y * rootScale;
  const dragRoot = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!dragRef.current) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const real = clean(
      (((event.clientX - bounds.left) / bounds.width) * 290 - rootOrigin.x) /
        rootScale,
      1,
    );
    const imaginary = clean(
      (rootOrigin.y - ((event.clientY - bounds.top) / bounds.height) * 365) /
        rootScale,
      1,
    );
    act(() =>
      setCoefficients([
        a,
        clean(-2 * a * real, 1),
        clean(a * (real * real + imaginary * imaginary), 1),
      ]),
    );
  };
  const checkAnswer = () =>
    act(() => setGrade(selectedAnswer === "A" ? "correct" : "incorrect"));

  return (
    <section
      className="pr375-page"
      data-testid="complex-mockup-0560"
      data-object-model="draggable-quadratic-conjugate-root-coefficients-parabola-discriminant-factor-form-real-intercepts-graded-pair-challenge"
      data-coefficients={JSON.stringify(coefficients)}
      data-discriminant={discriminant}
      data-roots={JSON.stringify([rootOne, rootTwo])}
      data-vertex={JSON.stringify([vertexX, vertexY])}
      data-classification={classification}
      data-mirror={mirror}
      data-show-discriminant={showDiscriminant}
      data-show-factors={showFactors}
      data-answer={selectedAnswer}
      data-grade={grade}
      data-dragging={dragging}
      data-tab={tab}
      data-actions={actions}
    >
      <header className="pr375-hero">
        <div className="pr375-pills">
          <b>ADVANCED MATHEMATICS</b>
          <b>COMPLEX NUMBERS</b>
        </div>
        <h1>Polynomial Roots</h1>
        <p>Include non-real solutions.</p>
        <nav>
          <span>Advanced</span>
          <span>Advanced Lab</span>
          <span>Complex Number View / CAS</span>
          <span>6-10 min</span>
        </nav>
        <div className="pr375-actions">
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
      <nav className="pr375-tabs">
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
      <section className="pr375-explorer">
        <header>
          <div>
            <small>INTERACTION - QUADRATIC ROOTS EXPLORER</small>
            <h2>Explore a quadratic and its complex roots</h2>
          </div>
          <button onClick={() => act(reset)}>
            <RotateCcw />
            Reset all
          </button>
          <span>{actions} actions</span>
        </header>
        <div className="pr375-main">
          <article className="pr375-parabola">
            <h3>Parabola y = p(x)</h3>
            <strong>
              p(x) = {a}x² {signed(b)}x {signed(c)}
            </strong>
            <svg viewBox="0 0 285 350">
              <path d="M5 230H280M142 342V10" className="axis" />
              <path d={parabolaPath} className="curve" />
              <circle cx={px(vertexX)} cy={py(vertexY)} r="6" />
              <text x={px(vertexX) + 12} y={py(vertexY) + 5}>
                ({vertexX}, {vertexY})
              </text>
              {[-4, -2, 0, 2, 4].map((number) => (
                <text key={number} x={px(number)} y="247" textAnchor="middle">
                  {number}
                </text>
              ))}
              {[2, 4, 6, 8].map((number) => (
                <text key={number} x="132" y={py(number) + 4} textAnchor="end">
                  {number}
                </text>
              ))}
            </svg>
            <footer className={complex ? "complex" : "real"}>
              ●{" "}
              {complex
                ? "No real x-intercepts"
                : repeated
                  ? "One real x-intercept"
                  : "Real x-intercepts"}
              <small>
                {complex
                  ? "The parabola stays above or below the x-axis."
                  : "The graph meets the x-axis at its real roots."}
              </small>
            </footer>
          </article>
          <article className="pr375-root-plane">
            <h3>Roots in the complex plane</h3>
            <p>Argand plane</p>
            <svg
              viewBox="0 0 290 365"
              onPointerMove={dragRoot}
              onPointerUp={() => {
                dragRef.current = false;
                setDragging(false);
              }}
              onPointerLeave={() => {
                dragRef.current = false;
                setDragging(false);
              }}
            >
              <path d="M5 188H285M145 350V10" className="axis" />
              {mirror && complex && (
                <line
                  x1={rx(rootReal)}
                  y1="15"
                  x2={rx(rootReal)}
                  y2="350"
                  className="mirror"
                />
              )}
              <circle
                cx={rx(rootOne[0])}
                cy={ry(rootOne[1])}
                r="7"
                className="root"
                onPointerDown={() => {
                  dragRef.current = true;
                  setDragging(true);
                }}
              />
              <text x={rx(rootOne[0]) + 12} y={ry(rootOne[1]) - 8}>
                {rootText(rootOne[0], rootOne[1])}
              </text>
              <circle
                cx={rx(rootTwo[0])}
                cy={ry(rootTwo[1])}
                r="7"
                className="root"
              />
              <text x={rx(rootTwo[0]) + 12} y={ry(rootTwo[1]) + 18}>
                {rootText(rootTwo[0], rootTwo[1])}
              </text>
            </svg>
            <footer>
              {mirror && <span>--- Dashed line: Real part = {rootReal}</span>}
              <b>
                ▰{" "}
                {complex
                  ? `Conjugate pair: ${rootText(rootReal, rootImaginary)}`
                  : "Real polynomial roots"}
              </b>
            </footer>
          </article>
          <aside className="pr375-controls">
            <h3>Coefficients</h3>
            {[
              ["a", a, -5, 5],
              ["b", b, -10, 10],
              ["c", c, -10, 10],
            ].map(([label, value, min, max], index) => (
              <Control
                key={String(label)}
                label={String(label)}
                value={Number(value)}
                min={Number(min)}
                max={Number(max)}
                onChange={(next) => update(index, next)}
                minus={() => adjust(index, -1)}
                plus={() => adjust(index, 1)}
              />
            ))}
            <Toggle
              label="Show conjugate mirror"
              checked={mirror}
              setter={setMirror}
              act={act}
            />
            <Toggle
              label="Show discriminant"
              checked={showDiscriminant}
              setter={setShowDiscriminant}
              act={act}
            />
            <Toggle
              label="Show factor form"
              checked={showFactors}
              setter={setShowFactors}
              act={act}
            />
          </aside>
        </div>
        <section className="pr375-results">
          <article>
            <h3>Discriminant</h3>
            <p>Delta = b² - 4ac</p>
            {showDiscriminant && (
              <strong className={complex ? "negative" : "positive"}>
                Delta = {discriminant}{" "}
                {complex ? "< 0" : discriminant > 0 ? "> 0" : "= 0"}
              </strong>
            )}
            <small>
              {complex
                ? "Negative discriminant, no real roots"
                : classification}
            </small>
          </article>
          <article>
            <h3>Complex roots</h3>
            <p>x = (-b ± sqrt(Delta))/2a</p>
            <strong>
              {rootText(rootOne[0], rootOne[1])},{" "}
              {rootText(rootTwo[0], rootTwo[1])}
            </strong>
            <small>{classification}</small>
          </article>
          <article>
            <h3>Factor form</h3>
            <p>p(x) = a(x-r1)(x-r2)</p>
            {showFactors && (
              <strong>
                {a === 1 ? "" : a}(x - ({rootText(rootOne[0], rootOne[1])}))(x -
                ({rootText(rootTwo[0], rootTwo[1])}))
              </strong>
            )}
            <small>Product of {complex ? "conjugate" : "real"} factors</small>
          </article>
          <article>
            <h3>Real x-intercepts</h3>
            <strong className="none">
              {complex
                ? "None"
                : repeated
                  ? rootOne[0]
                  : `${rootOne[0]}, ${rootTwo[0]}`}
            </strong>
            <small>
              {complex
                ? "No real solutions p(x)=0"
                : "Real solutions of p(x)=0"}
            </small>
          </article>
        </section>
      </section>
      <section className="pr375-learning">
        <article>
          <h2>Rule to remember</h2>
          <p>
            For real coefficients, non-real roots come in{" "}
            <b>conjugate pairs.</b>
          </p>
          <div>
            alpha + beta i<br />↓<br />
            alpha - beta i
          </div>
          <p>Both must appear.</p>
        </article>
        <article>
          <h2>Quadratic formula</h2>
          <p>For ax² + bx + c = 0,</p>
          <strong>x = (-b ± sqrt(b²-4ac))/2a</strong>
          <p>
            <b>Discriminant:</b>
            <br />
            Delta &gt; 0: two real roots
            <br />
            Delta = 0: one real root
            <br />
            Delta &lt; 0: two non-real conjugate roots
          </p>
        </article>
        <article>
          <h2>Worked example</h2>
          <p>Find the roots of x² - 2x + 5 = 0</p>
          <p>
            a=1, b=-2, c=5
            <br />
            Delta = 4 - 20 = -16
            <br />x = (2 ± 4i)/2 = 1 ± 2i
          </p>
          <strong>Roots: 1 + 2i, 1 - 2i</strong>
        </article>
        <article className="pr375-warning">
          <h2>Common misconception</h2>
          <p>
            Do not omit the paired root. Real coefficients force both
            conjugates.
          </p>
          <div>
            1 + 2i
            <br />↕<br />1 - 2i <b>✕</b>
          </div>
          <p>Omitting one root is incorrect.</p>
        </article>
      </section>
      <section className="pr375-challenge">
        <div>
          <h2>Practice challenge</h2>
          <h3>Find the missing root.</h3>
          <p>
            If 3 - 4i is a root of a real polynomial, what root must also
            appear?
          </p>
        </div>
        <div>
          {[
            ["A", "3 + 4i"],
            ["B", "-3 + 4i"],
            ["C", "-3 - 4i"],
            ["D", "4 - 3i"],
          ].map(([key, label], index) => (
            <label
              key={key}
              className={selectedAnswer === key ? "selected" : ""}
            >
              <input
                type="radio"
                name="pair-answer"
                checked={selectedAnswer === key}
                onChange={() =>
                  act(() => {
                    setSelectedAnswer(key);
                    setGrade("idle");
                  })
                }
              />
              <i>{String.fromCharCode(65 + index)}</i>
              {label}
            </label>
          ))}
        </div>
        <button onClick={checkAnswer}>Check answer</button>
        {grade !== "idle" && (
          <strong className={grade}>
            {grade === "correct"
              ? "Correct: 3 + 4i is the conjugate."
              : "Choose the root with the same real part and opposite imaginary sign."}
          </strong>
        )}
      </section>
      <nav className="pr375-nav">
        <a href="/lessons/advanced-mathematics/374-roots">
          ←{" "}
          <span>
            <small>PREVIOUS</small>Roots
          </span>
        </a>
        <a href="/lessons/advanced-mathematics/376-mobius-transformations">
          <span>
            <small>NEXT</small>Mobius Transformations
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
  onChange,
  minus,
  plus,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  minus: () => void;
  plus: () => void;
}) {
  return (
    <section className="pr375-control">
      <b>{label}</b>
      <div>
        <button aria-label={`Decrease ${label}`} onClick={minus}>
          −
        </button>
        <input
          aria-label={`${label} value`}
          type="number"
          min={min}
          max={max}
          step=".1"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <button aria-label={`Increase ${label}`} onClick={plus}>
          +
        </button>
      </div>
      <label>
        <span>{min}</span>
        <input
          aria-label={label}
          type="range"
          min={min}
          max={max}
          step=".1"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <span>{max}</span>
      </label>
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
    <label className="pr375-toggle">
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
