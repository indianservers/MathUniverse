import { ExternalLink, Maximize2, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./ComplexConjugateTargetLesson369.css";
type Pair = [number, number];
const clean = (n: number) => Number(n.toFixed(2));
const text = ([a, b]: Pair) => a + (b < 0 ? " - " : " + ") + Math.abs(b) + "i";
export default function ComplexConjugateTargetLesson369({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [z, setZ] = useState<Pair>([2, 1]),
    [dragging, setDragging] = useState(false),
    [mirror, setMirror] = useState(true),
    [distances, setDistances] = useState(true),
    [productCheck, setProductCheck] = useState(true),
    [tab, setTab] = useState("Interaction + visualization"),
    [hint, setHint] = useState(false),
    [answerA, setAnswerA] = useState(""),
    [answerB, setAnswerB] = useState(""),
    [pointA, setPointA] = useState(""),
    [pointB, setPointB] = useState(""),
    [verdict, setVerdict] = useState(""),
    [actions, setActions] = useState(0);
  const conjugate: Pair = [z[0], clean(-z[1])],
    product = clean(z[0] * z[0] + z[1] * z[1]),
    argument = clean((Math.atan2(z[1], z[0]) * 180) / Math.PI);
  const reset = () => {
    setZ([2, 1]);
    setDragging(false);
    setMirror(true);
    setDistances(true);
    setProductCheck(true);
    setTab("Interaction + visualization");
    setHint(false);
    setAnswerA("");
    setAnswerB("");
    setPointA("");
    setPointB("");
    setVerdict("");
    setActions(0);
  };
  const act = (work: () => void) => {
    work();
    setActions((v) => v + 1);
    onInteraction();
  };
  useEffect(reset, [resetToken]);
  const px = (x: number) => 255 + x * 55,
    py = (y: number) => 300 - y * 65;
  const move = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const r = e.currentTarget.getBoundingClientRect(),
      x = (((e.clientX - r.left) / r.width) * 530 - 255) / 55,
      y = (300 - ((e.clientY - r.top) / r.height) * 590) / 65;
    act(() => {
      setZ([
        clean(Math.max(-4, Math.min(4, x))),
        clean(Math.max(-3, Math.min(3, y))),
      ]);
      setVerdict("");
    });
  };
  const update = (i: 0 | 1, v: number) =>
    act(() => {
      setZ((pair) => pair.map((p, index) => (index === i ? v : p)) as Pair);
      setVerdict("");
    });
  const check = () =>
    act(() =>
      setVerdict(
        Number(answerA) === -3 &&
          Number(answerB) === -4 &&
          Number(pointA) === -3 &&
          Number(pointB) === -4
          ? "correct"
          : "incorrect",
      ),
    );
  return (
    <section
      className="cc369-page"
      data-testid="complex-mockup-0554"
      data-object-model="draggable-complex-point-real-axis-reflection-conjugate-equal-modulus-opposite-argument-real-product-synchronized-controls-graded-point"
      data-z={JSON.stringify(z)}
      data-conjugate={JSON.stringify(conjugate)}
      data-product={product}
      data-argument={argument}
      data-mirror={mirror}
      data-distances={distances}
      data-product-check={productCheck}
      data-tab={tab}
      data-verdict={verdict}
      data-actions={actions}
    >
      <header className="cc369-hero">
        <div className="cc369-pills">
          <b>ADVANCED MATHEMATICS</b>
          <b>COMPLEX NUMBERS</b>
        </div>
        <h1>Complex Conjugate</h1>
        <p>Understand reflection.</p>
        <nav>
          <span>Advanced</span>
          <span>Advanced Lab</span>
          <span>Complex Number View / CAS</span>
          <span>6-10 min</span>
        </nav>
        <div>
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
      <nav className="cc369-tabs">
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
      <section className="cc369-work">
        <article className="cc369-lab">
          <header>
            <div>
              <b>INTERACTION + VISUALIZATION</b>
              <h2>Reflection Lab: Argand Plane</h2>
            </div>
            <span>● Live</span>
            <button title="Expand graph">
              <Maximize2 />
            </button>
          </header>
          <svg
            viewBox="0 0 530 590"
            onPointerMove={move}
            onPointerUp={() => setDragging(false)}
            onPointerLeave={() => setDragging(false)}
          >
            <defs>
              <pattern
                id="cc-grid"
                width="55"
                height="65"
                patternUnits="userSpaceOnUse"
              >
                <path d="M55 0H0V65" fill="none" stroke="#dce5ee" />
              </pattern>
            </defs>
            <rect x="25" y="45" width="475" height="475" fill="url(#cc-grid)" />
            <path d="M25 300H500M255 525V40" className="axis" />
            <text x="493" y="288">
              Re
            </text>
            <text x="263" y="35">
              Im
            </text>
            {[-3, -2, -1, 0, 1, 2, 3, 4].map((n) => (
              <g key={n}>
                <text x={px(n)} y="319" textAnchor="middle">
                  {n}
                </text>
                <text x="242" y={py(n) + 4} textAnchor="end">
                  {n}
                </text>
              </g>
            ))}
            {mirror && (
              <line x1="25" y1={py(0)} x2="500" y2={py(0)} className="mirror" />
            )}
            {distances && (
              <line
                x1={px(z[0])}
                y1={py(z[1])}
                x2={px(conjugate[0])}
                y2={py(conjugate[1])}
                className="reflection"
              />
            )}
            <line
              x1={px(0)}
              y1={py(0)}
              x2={px(z[0])}
              y2={py(z[1])}
              className="z-vector"
            />
            <line
              x1={px(0)}
              y1={py(0)}
              x2={px(conjugate[0])}
              y2={py(conjugate[1])}
              className="conjugate-vector"
            />
            <circle
              cx={px(z[0])}
              cy={py(z[1])}
              r="7"
              className="z-point"
              onPointerDown={() => setDragging(true)}
            />
            <circle
              cx={px(conjugate[0])}
              cy={py(conjugate[1])}
              r="7"
              className="conjugate-point"
            />
            <text x={px(z[0]) + 12} y={py(z[1]) - 15} className="z-label">
              z = {text(z)}
            </text>
            <text
              x={px(conjugate[0]) + 12}
              y={py(conjugate[1]) + 27}
              className="conjugate-label"
            >
              z̄ = {text(conjugate)}
            </text>
            <text x={px(0) + 18} y={py(0) - 45} className="angle">
              +{argument}°
            </text>
            <text x={px(0) + 18} y={py(0) + 58} className="conjugate-angle">
              -{argument}°
            </text>
          </svg>
          <div className="cc369-note">
            Point z reflects across the real axis (mirror line) to give its
            conjugate z̄. The real part stays the same; the imaginary part
            changes sign.
          </div>
        </article>
        <aside className="cc369-controls">
          <h2>CONTROLS</h2>
          <Control
            label="Real part (a)"
            value={z[0]}
            onChange={(v) => update(0, v)}
          />
          <Control
            label="Imaginary part (b)"
            value={z[1]}
            onChange={(v) => update(1, v)}
          />
          <section>
            <h3>DISPLAY OPTIONS</h3>
            {[
              ["Show mirror line (Im = 0)", mirror, setMirror],
              ["Show equal distances", distances, setDistances],
              ["Show product check", productCheck, setProductCheck],
            ].map(([name, checked, setter]) => (
              <label key={String(name)}>
                {String(name)}
                <input
                  aria-label={String(name)}
                  type="checkbox"
                  checked={Boolean(checked)}
                  onChange={(e) =>
                    act(() =>
                      (setter as React.Dispatch<React.SetStateAction<boolean>>)(
                        e.target.checked,
                      ),
                    )
                  }
                />
              </label>
            ))}
          </section>
          <section className="cc369-results">
            <h3>LIVE RESULTS</h3>
            <strong>
              z = {text(z)}
              <small>(a,b)=({z.join(", ")})</small>
            </strong>
            <strong>
              conjugate z = {text(conjugate)}
              <small>(a,-b)=({conjugate.join(", ")})</small>
            </strong>
            <p>
              <b>Re unchanged</b> Re(z)={z[0]}=Re(z̄)
            </p>
            <p>
              <b>Im changes</b> Im(z): {z[1]} → {conjugate[1]}
            </p>
            {productCheck && (
              <p>
                <b>Product check</b> z·conjugate(z)={product}
                <br />
                |z|²={product}
              </p>
            )}
          </section>
        </aside>
      </section>
      <section className="cc369-learning">
        <article>
          <h2>FORMULA / RULE</h2>
          <p>If z=a+bi, then</p>
          <code>conjugate(z)=a-bi</code>
          <p>z times conjugate(z)=a²+b²=|z|²</p>
        </article>
        <article>
          <h2>WORKED EXAMPLE</h2>
          <p>For z=2+i:</p>
          <ul>
            <li>conjugate(z)=2-i</li>
            <li>(2+i)(2-i)=4-i²=5</li>
          </ul>
          <strong>The product equals the squared modulus: |z|²=5.</strong>
        </article>
        <article>
          <h2>COMMON MISCONCEPTION</h2>
          <p>
            Only the imaginary sign changes; the real part does not become
            negative.
          </p>
          <code>
            Wrong: 2+i → -2-i
            <br />
            Correct: 2+i → 2-i
          </code>
        </article>
      </section>
      <section className="cc369-practice">
        <div>
          <h2>PRACTICE CHALLENGE</h2>
          <b>Find the conjugate of -3+4i and predict its reflected point.</b>
          {hint && (
            <p>Keep the real coordinate and negate the imaginary coordinate.</p>
          )}
          <button onClick={() => act(() => setHint(!hint))}>Show Hint</button>
        </div>
        <label>
          Your answer
          <span>
            <input
              aria-label="Conjugate real answer"
              value={answerA}
              onChange={(e) => setAnswerA(e.target.value)}
            />
            <input
              aria-label="Conjugate imaginary answer"
              value={answerB}
              onChange={(e) => setAnswerB(e.target.value)}
            />
            i
          </span>
          <button onClick={check}>Check</button>
        </label>
        <label>
          Reflected point (a,b)
          <span>
            (
            <input
              aria-label="Reflected real answer"
              value={pointA}
              onChange={(e) => setPointA(e.target.value)}
            />
            ,
            <input
              aria-label="Reflected imaginary answer"
              value={pointB}
              onChange={(e) => setPointB(e.target.value)}
            />
            )
          </span>
          <button onClick={check}>Plot</button>
        </label>
        <output className={verdict}>
          {verdict === "correct"
            ? "conjugate(z)=-3-4i; reflected point (-3,-4)"
            : verdict === "incorrect"
              ? "Keep -3 and change +4 to -4."
              : ""}
        </output>
      </section>
      <nav className="cc369-nav">
        <a href="/lessons/advanced-mathematics/368-complex-multiplication">
          ←{" "}
          <span>
            <small>Previous</small>Complex Multiplication
          </span>
        </a>
        <a href="/lessons/advanced-mathematics/370-modulus-and-argument">
          <span>
            <small>Next</small>Modulus and Argument
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
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="cc369-control">
      <b>
        {label}
        <output>
          {label.startsWith("Real") ? "a" : "b"} = {value}
        </output>
      </b>
      <input
        aria-label={label}
        type="range"
        min="-5"
        max="5"
        step=".1"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <span>
        <button
          aria-label={"Decrease " + label}
          onClick={() => onChange(clean(value - 1))}
        >
          −
        </button>
        <output>{value}</output>
        <button
          aria-label={"Increase " + label}
          onClick={() => onChange(clean(value + 1))}
        >
          +
        </button>
      </span>
    </label>
  );
}
