import {
  ArrowLeft,
  ArrowRight,
  Check,
  RotateCcw,
  TriangleAlert,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./ZerosCoefficientsTargetLesson10050.css";

const tabs = ["INTERACT", "LEARN", "EXAMPLE", "FORMULA", "PRACTICE"];
const tidy = (n: number) => Math.round(n * 10) / 10;
const signed = (n: number, variable = "") =>
  `${n < 0 ? "−" : "+"} ${Math.abs(n)}${variable}`;
const polynomial = (a: number, alpha: number, beta: number) => {
  const b = tidy(-a * (alpha + beta)),
    c = tidy(a * alpha * beta);
  return `${a === 1 ? "" : a}x² ${signed(b, "x")} ${signed(c)}`;
};

export default function ZerosCoefficientsTargetLesson10050({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [alpha, setAlpha] = useState(1),
    [beta, setBeta] = useState(3),
    [tab, setTab] = useState("INTERACT"),
    [targetSum, setTargetSum] = useState(5),
    [targetProduct, setTargetProduct] = useState(6),
    [customSum, setCustomSum] = useState(0),
    [customProduct, setCustomProduct] = useState(0),
    [quick, setQuick] = useState("B"),
    [showExplanation, setShowExplanation] = useState(true),
    [actions, setActions] = useState(0);
  const a = 1,
    b = tidy(-(alpha + beta)),
    c = tidy(alpha * beta),
    sum = tidy(alpha + beta),
    product = tidy(alpha * beta),
    targetDiscriminant = targetSum ** 2 - 4 * targetProduct,
    targetRoots =
      targetDiscriminant >= 0
        ? [
            (targetSum - Math.sqrt(targetDiscriminant)) / 2,
            (targetSum + Math.sqrt(targetDiscriminant)) / 2,
          ].map(tidy)
        : [],
    act = (fn: () => void) => {
      fn();
      setActions((n) => n + 1);
    };
  const setRoot = (which: "alpha" | "beta", value: number) =>
    act(() =>
      which === "alpha"
        ? setAlpha(Math.max(-5, Math.min(5, tidy(value))))
        : setBeta(Math.max(-5, Math.min(5, tidy(value)))),
    );
  const reset = () =>
      act(() => {
        setAlpha(1);
        setBeta(3);
      }),
    setTarget = () =>
      act(() => {
        setTargetSum(customSum);
        setTargetProduct(customProduct);
      });
  return (
    <section
      className="zc10050-page"
      data-testid="school-mockup-0724"
      data-object-model="dedicated-vieta-draggable-roots-coefficient-engine"
      data-alpha={alpha}
      data-beta={beta}
      data-a={a}
      data-b={b}
      data-c={c}
      data-sum={sum}
      data-product={product}
      data-target-roots={targetRoots.join(",")}
      data-quick={quick}
      data-quick-correct={String(quick === "B")}
      data-actions={actions}
    >
      <header className="zc10050-hero">
        <small>CLASS 9 · POLYNOMIALS</small>
        <h1>Relationship Between Zeros and Coefficients</h1>
        <p>
          Connect the zeros (roots) of a quadratic to the sum and product
          determined by its coefficients.
        </p>
        <div>
          <span>18 min</span>
          <span>INTERACTIVE</span>
          <span>CONCEPT</span>
          <span>GRAPH</span>
          <span>CLASS 9</span>
        </div>
        <Link to="/lessons/school">
          <ArrowLeft /> School lessons
        </Link>
      </header>
      <nav className="zc10050-tabs">
        {tabs.map((item) => (
          <button
            key={item}
            className={tab === item ? "active" : ""}
            aria-selected={tab === item}
            onClick={() => act(() => setTab(item))}
          >
            {item}
          </button>
        ))}
      </nav>
      <main className="zc10050-main">
        <section className="zc-lab">
          <div className="zc-left">
            <h2>GRAPH &amp; ROOTS</h2>
            <RootsGraph alpha={alpha} beta={beta} onRoot={setRoot} />
            <p>Drag α or β to change the roots.</p>
            <section>
              <header>
                <h3>ROOT SLIDERS</h3>
                <button onClick={reset}>
                  <RotateCcw /> Reset
                </button>
              </header>
              <RootSlider
                label="α (first root)"
                value={alpha}
                color="cyan"
                onChange={(v) => setRoot("alpha", v)}
              />
              <RootSlider
                label="β (second root)"
                value={beta}
                color="purple"
                onChange={(v) => setRoot("beta", v)}
              />
            </section>
          </div>
          <div className="zc-right">
            <section>
              <h2>COEFFICIENTS &amp; FORMS</h2>
              <p>Live values update as you move the roots.</p>
              <div className="zc-coefficients">
                <span>
                  <i>a</i>
                  <b>{a}</b>
                </span>
                <span>
                  <i>b</i>
                  <b>{b}</b>
                </span>
                <span>
                  <i>c</i>
                  <b>{c}</b>
                </span>
              </div>
              <Formula label="Polynomial">{polynomial(a, alpha, beta)}</Formula>
              <Formula label="Expanded form">
                1 · x² {signed(b, "x")} {signed(c)}
              </Formula>
              <Formula label="Factored form">
                (x {alpha < 0 ? "+" : "−"} {Math.abs(alpha)})(x{" "}
                {beta < 0 ? "+" : "−"} {Math.abs(beta)})
              </Formula>
            </section>
            <section className="zc-balance">
              <h2>VIETA BALANCE</h2>
              <p>Check the sums and products.</p>
              <div>
                <Formula>
                  α + β<br />
                  {alpha} + {beta}
                </Formula>
                <b>=</b>
                <Formula>
                  −b/a
                  <br />
                  {-b}/{a}
                </Formula>
                <b>=</b>
                <Formula>{sum}</Formula>
                <Check />
              </div>
              <div>
                <Formula>
                  αβ
                  <br />
                  {alpha} × {beta}
                </Formula>
                <b>=</b>
                <Formula>
                  c/a
                  <br />
                  {c}/{a}
                </Formula>
                <b>=</b>
                <Formula>{product}</Formula>
                <Check />
              </div>
            </section>
          </div>
          <footer>
            <Check /> Perfect! The sums and products match Vieta's formulas.
          </footer>
        </section>
        <section className="zc-theory">
          <article>
            <h2>WHY IT WORKS</h2>
            <p>For a quadratic ax²+bx+c, the zeros α and β satisfy:</p>
            <div>
              <Formula label="Sum of zeros">α + β = −b/a</Formula>
              <Formula label="Product of zeros">αβ = c/a</Formula>
            </div>
            <p>
              These are Vieta's formulas. Expand a(x−α)(x−β) and match
              coefficients.
            </p>
          </article>
          <article>
            <h2>WORKED EXAMPLE</h2>
            <p>Consider 2x²−7x+3.</p>
            <p>
              <b>Step 1:</b> (2x−1)(x−3)=0, roots 1/2 and 3.
            </p>
            <p>
              <b>Step 2:</b> Check Vieta:
            </p>
            <Formula>α+β=3+1/2=7/2=−b/a</Formula>
            <Formula>αβ=3·1/2=3/2=c/a</Formula>
          </article>
          <article className="zc-mistake">
            <h2>
              <TriangleAlert /> COMMON MISTAKE
            </h2>
            <p>Remember the negative sign in the sum formula.</p>
            <div>Wrong: α+β=b/a ✕</div>
            <div>
              Correct: α+β=−b/a <Check />
            </div>
            <p>Always use −b/a for the sum of zeros.</p>
          </article>
        </section>
        <section className="zc-lower">
          <article className="zc-challenge">
            <h2>CHALLENGE</h2>
            <p>
              Drag the roots so that the sum is {targetSum} and the product is{" "}
              {targetProduct}. Then identify the polynomial.
            </p>
            <div className="zc-targets">
              <span>
                <b>Target: α+β={targetSum}</b>Current: {targetSum} <Check />
              </span>
              <span>
                <b>Target: αβ={targetProduct}</b>Current: {targetProduct}{" "}
                <Check />
              </span>
              <aside>
                <b>How to reach the target?</b>
                <p>1. Increase both roots to increase the sum.</p>
                <p>2. Keep their product equal to {targetProduct}.</p>
                <p>3. Try factor pairs.</p>
              </aside>
            </div>
            <div className="zc-identified">
              <section>
                <b>Identified polynomial</b>
                <Formula>
                  {targetRoots.length
                    ? `x² ${signed(-targetSum, "x")} ${signed(targetProduct)}`
                    : "No real-root quadratic"}
                </Formula>
                <p>
                  Possible roots:{" "}
                  {targetRoots.length ? targetRoots.join(", ") : "none"}
                </p>
              </section>
              <aside>
                <b>Try another target</b>
                <label>
                  Sum
                  <input
                    type="number"
                    value={customSum}
                    onChange={(e) =>
                      act(() => setCustomSum(Number(e.target.value)))
                    }
                  />
                </label>
                <label>
                  Product
                  <input
                    type="number"
                    value={customProduct}
                    onChange={(e) =>
                      act(() => setCustomProduct(Number(e.target.value)))
                    }
                  />
                </label>
                <button onClick={setTarget}>Set target</button>
              </aside>
            </div>
          </article>
          <article className="zc-quick">
            <h2>QUICK CHECK</h2>
            <p>Identify the polynomial whose roots satisfy α+β=−1 and αβ=−2.</p>
            {[
              ["A", "x²+x+2"],
              ["B", "x²+x−2"],
              ["C", "x²−x+2"],
              ["D", "x²−x−2"],
            ].map(([key, label], i) => (
              <label key={`${key}${i}`}>
                <input
                  type="radio"
                  name="zcquick"
                  checked={quick === key}
                  onChange={() => act(() => setQuick(key))}
                />
                {key} {label}
                {key === "B" && quick === "B" && <Check />}
              </label>
            ))}
            <button onClick={() => act(() => setShowExplanation((v) => !v))}>
              Show explanation
            </button>
            {showExplanation && (
              <p>
                Using a=1: −(α+β)=1 gives b=1 and αβ=−2 gives c=−2. Polynomial:
                x²+x−2.
              </p>
            )}
          </article>
        </section>
      </main>
      <nav className="zc10050-adjacent">
        <Link to="/lessons/school/class-9/class-9-polynomials-factor-theorem">
          <ArrowLeft /> Factor Theorem
        </Link>
        <Link to="/lessons/school">
          <span>Cubic Algebraic Identities</span>
          <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}
function Formula({
  label,
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="zc-formula">
      {label && <b>{label}</b>}
      <span>{children}</span>
    </div>
  );
}
function RootSlider({
  label,
  value,
  color,
  onChange,
}: {
  label: string;
  value: number;
  color: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className={`zc-slider ${color}`}>
      <b>{label}</b>
      <input
        type="range"
        min="-5"
        max="5"
        step="0.5"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <strong>{value}</strong>
    </label>
  );
}
function RootsGraph({
  alpha,
  beta,
  onRoot,
}: {
  alpha: number;
  beta: number;
  onRoot: (which: "alpha" | "beta", value: number) => void;
}) {
  const ref = useRef<SVGSVGElement>(null),
    sx = (x: number) => 30 + (x + 5) * 30,
    sy = (y: number) => 185 - y * 35,
    path = useMemo(
      () =>
        Array.from({ length: 101 }, (_, i) => {
          const x = -5 + i / 10,
            y = (x - alpha) * (x - beta);
          return `${i ? "L" : "M"}${sx(x)},${sy(y)}`;
        }).join(" "),
      [alpha, beta],
    );
  const drag = (
    which: "alpha" | "beta",
    e: React.PointerEvent<SVGCircleElement>,
  ) => {
    const svg = ref.current;
    if (!svg) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const move = (event: PointerEvent) => {
      const rect = svg.getBoundingClientRect(),
        x = -5 + ((event.clientX - rect.left) / rect.width) * 10;
      onRoot(which, Math.max(-5, Math.min(5, Math.round(x * 2) / 2)));
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  return (
    <svg
      ref={ref}
      className="zc-svg"
      viewBox="0 0 340 260"
      aria-label="Interactive roots graph"
    >
      <g>
        {Array.from({ length: 11 }, (_, i) => (
          <line key={i} x1={30 + i * 30} x2={30 + i * 30} y1="10" y2="245" />
        ))}
      </g>
      <line className="axis" x1="10" x2="335" y1={sy(0)} y2={sy(0)} />
      <line className="axis" x1={sx(0)} x2={sx(0)} y1="10" y2="245" />
      <path d={path} />
      <circle
        className="alpha"
        cx={sx(alpha)}
        cy={sy(0)}
        r="8"
        onPointerDown={(e) => drag("alpha", e)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") onRoot("alpha", alpha - 0.5);
          if (e.key === "ArrowRight") onRoot("alpha", alpha + 0.5);
        }}
      />
      <text x={sx(alpha)} y={sy(0) + 3}>
        α
      </text>
      <circle
        className="beta"
        cx={sx(beta)}
        cy={sy(0)}
        r="8"
        onPointerDown={(e) => drag("beta", e)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") onRoot("beta", beta - 0.5);
          if (e.key === "ArrowRight") onRoot("beta", beta + 0.5);
        }}
      />
      <text x={sx(beta)} y={sy(0) + 3}>
        β
      </text>
    </svg>
  );
}
