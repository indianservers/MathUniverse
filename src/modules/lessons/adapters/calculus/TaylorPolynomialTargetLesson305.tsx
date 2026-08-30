import {
  BookOpen,
  Check,
  Eye,
  Hand,
  Lightbulb,
  Maximize2,
  RotateCcw,
  Share2,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import "./TaylorPolynomialTargetLesson305.css";

const factorial = (n: number) => {
  let value = 1;
  for (let i = 2; i <= n; i++) value *= i;
  return value;
};
const derivativeAt = (order: number, x: number) =>
  [Math.cos(x), -Math.sin(x), -Math.cos(x), Math.sin(x)][order % 4];
const taylor = (x: number, degree: number, a: number) => {
  let sum = 0;
  for (let k = 0; k <= degree; k++)
    sum += (derivativeAt(k, a) * (x - a) ** k) / factorial(k);
  return sum;
};
const clean = (n: number, p = 6) =>
  Math.abs(n) < 1e-10 ? 0 : Number(n.toFixed(p));
const practiceExpected = [
  "1 - x^2/2 + x^4/24",
  1 - 0.8 ** 2 / 2 + 0.8 ** 4 / 24,
  Math.abs(Math.cos(0.8) - (1 - 0.8 ** 2 / 2 + 0.8 ** 4 / 24)),
] as const;

export default function TaylorPolynomialTargetLesson305({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [degree, setDegree] = useState(3),
    [center, setCenter] = useState(0),
    [tab, setTab] = useState("Interact"),
    [polyAnswer, setPolyAnswer] = useState<string>(practiceExpected[0]),
    [valueAnswer, setValueAnswer] = useState(practiceExpected[1].toFixed(6)),
    [errorAnswer, setErrorAnswer] = useState(practiceExpected[2].toFixed(6)),
    [result, setResult] = useState<"" | "correct" | "incorrect">("correct"),
    [actions, setActions] = useState(0);
  const samples = useMemo(
      () =>
        Array.from({ length: 241 }, (_, i) => {
          const x = -2 * Math.PI + i * ((4 * Math.PI) / 240);
          return Math.abs(Math.cos(x) - taylor(x, degree, center));
        }),
      [degree, center],
    ),
    maxError = Math.max(...samples),
    liveX = center,
    liveF = Math.cos(liveX),
    liveT = taylor(liveX, degree, center);
  const reset = () => {
    setDegree(3);
    setCenter(0);
    setTab("Interact");
    setPolyAnswer(practiceExpected[0]);
    setValueAnswer(practiceExpected[1].toFixed(6));
    setErrorAnswer(practiceExpected[2].toFixed(6));
    setResult("correct");
    setActions(0);
  };
  const act = (run: () => void) => {
    run();
    setActions((n) => n + 1);
    onInteraction();
  };
  useEffect(reset, [resetToken]);
  const check = () => {
    const normalized = polyAnswer
      .toLowerCase()
      .replace(/[\s*]/g, "")
      .replaceAll("²", "^2")
      .replaceAll("⁴", "^4");
    act(() =>
      setResult(
        normalized.includes("1-x^2/2+x^4/24") &&
          Math.abs(Number(valueAnswer) - practiceExpected[1]) < 1e-5 &&
          Math.abs(Number(errorAnswer) - practiceExpected[2]) < 1e-5
          ? "correct"
          : "incorrect",
      ),
    );
  };
  return (
    <section
      className="tay305-page"
      data-testid="calculus-mockup-0384"
      data-dedicated-lesson="305"
      data-object-model="cosine-taylor-derivative-cycle-variable-degree-and-center-direct-center-drag-remainder-error-band-three-field-practice"
      data-degree={degree}
      data-center={clean(center)}
      data-live-f={clean(liveF)}
      data-live-t={clean(liveT)}
      data-live-error={clean(liveF - liveT)}
      data-max-error={clean(maxError)}
      data-result={result}
      data-actions={actions}
    >
      <header className="tay305-hero">
        <section>
          <span>
            <b>CALCULUS</b>
            <b>LIMITS AND DIFFERENTIAL CALCULUS</b>
          </span>
          <h1>Taylor Polynomial</h1>
          <p>Approximate functions locally using derivatives.</p>
          <div className="meta">
            <i>♙ Advanced</i>
            <i>ϟ Calculus Lab</i>
            <i>▣ Derivative / Limit / CAS</i>
            <i>◴ 6-10 min</i>
          </div>
          <div className="actions">
            <button>English (English)⌄</button>
            <button onClick={() => act(reset)}>
              <RotateCcw />
              Reset
            </button>
            <button
              onClick={() =>
                act(() =>
                  navigator.clipboard?.writeText(
                    `cos Taylor degree ${degree} about ${clean(center)}`,
                  ),
                )
              }
            >
              <Share2 />
              Share
            </button>
            <a href="/workspace/calculus">↗ Workspace</a>
          </div>
        </section>
        <aside>
          <h3>
            At a glance <Maximize2 />
          </h3>
          <p>
            A Taylor polynomial of degree n about center a approximates f(x)
            near a.
          </p>
          <p>The closer x is to a, the better the match.</p>
          <div>
            <span>━ f(x) (true function)</span>
            <span>┅ Tₙ(x) (Taylor polynomial)</span>
            <span>▬ Error band ±|Rₙ(x)|</span>
            <span>⊙ Center a</span>
          </div>
          <p>Best accuracy near a.</p>
        </aside>
      </header>
      <nav className="tay305-tabs">
        {["Interact", "Explain", "Examples", "Formulas", "Know more"].map(
          (name) => (
            <button
              key={name}
              className={tab === name ? "active" : ""}
              onClick={() => act(() => setTab(name))}
            >
              {name}
            </button>
          ),
        )}
      </nav>
      <section className="tay305-flow">
        {[
          {
            Icon: Eye,
            title: "1. Observe",
            text: "See how the polynomial tracks the function near the center a.",
          },
          {
            Icon: Hand,
            title: "2. Manipulate",
            text: "Change the degree n and center a to explore approximations.",
          },
          {
            Icon: Lightbulb,
            title: "3. Notice",
            text: "Accuracy improves with higher n and near the center.",
          },
          {
            Icon: BookOpen,
            title: "4. Understand",
            text: "Taylor polynomials use derivatives to match function behavior.",
          },
        ].map(({ Icon, title, text }) => (
          <article key={title}>
            <Icon />
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </section>
      <section className="tay305-lab">
        <header>
          <small>INTERACTION · VISUALIZATION</small>
          <h2>Work directly on the model</h2>
          <b>● Real-time</b>
          <output>{actions} actions</output>
          <button>
            <Maximize2 />
          </button>
        </header>
        <main>
          <section className="graph-panel">
            <header>
              <button>Model: f(x)=cos(x)⌄</button>
              <b>Taylor polynomial about a</b>
            </header>
            <TaylorGraph
              degree={degree}
              center={center}
              onCenter={(value) => act(() => setCenter(value))}
            />
            <div className="legend">
              <span>━ f(x)=cos(x)</span>
              <span>┅ Tₙ(x)</span>
              <span>▬ ±|Rₙ(x)|</span>
              <span>⊙ a (center)</span>
            </div>
            <footer>
              <span>Displayed interval: [-2π,2π]</span>
              <span>Best accuracy near x=a</span>
            </footer>
          </section>
          <aside className="controls">
            <h3>Controls</h3>
            <label>
              Degree n
              <input
                aria-label="Taylor degree"
                type="range"
                min="0"
                max="6"
                step="1"
                value={degree}
                onChange={(e) => act(() => setDegree(Number(e.target.value)))}
              />
              <small>0 to 6</small>
              <output>{degree}</output>
            </label>
            <label>
              Center a
              <input
                aria-label="Taylor center"
                type="range"
                min={-2 * Math.PI}
                max={2 * Math.PI}
                step=".05"
                value={center}
                onChange={(e) => act(() => setCenter(Number(e.target.value)))}
              />
              <small>-2π to 2π</small>
              <output>{center.toFixed(2)}</output>
            </label>
            <h3>
              Live values at x <output>{liveX.toFixed(2)}</output>
            </h3>
            <p>
              <i /> f(x)=cos(x)<b>{liveF.toFixed(4)}</b>
            </p>
            <p>
              <i /> T{degree}(x)<b>{liveT.toFixed(4)}</b>
            </p>
            <p>
              <i /> R{degree}(x)=f(x)-T{degree}(x)
              <b>{(liveF - liveT).toFixed(4)}</b>
            </p>
            <section>
              <h3>Domain note</h3>
              <p>Both f and its derivatives exist for all x∈R.</p>
            </section>
          </aside>
        </main>
        <section className="remainder">
          <article>
            <b>Remainder (error) band</b>
            <p>Rₙ(x)=f(x)-Tₙ(x)</p>
            <p>We show ±|Rₙ(x)|.</p>
          </article>
          <output>
            Max error on shown interval<b>{maxError.toFixed(5)}</b>
          </output>
          <article>
            <b>Remainder (Lagrange form)</b>
            <p>Rₙ(x)=f⁽ⁿ⁺¹⁾(ξ)(x-a)ⁿ⁺¹/(n+1)!</p>
          </article>
          <article>
            <b>For f(x)=cos(x)</b>
            <p>|f⁽ⁿ⁺¹⁾(x)|≤1</p>
            <p>so |f⁽ⁿ⁺¹⁾(x)|≤1.</p>
          </article>
        </section>
      </section>
      <section className="tay305-info">
        <article>
          <h3>Why it works</h3>
          <p>
            The Taylor polynomial matches the function and its derivatives up to
            order n at x=a.
          </p>
          <strong>Tₙ(x)=Σ f⁽ᵏ⁾(a)(x-a)ᵏ/k!</strong>
          <p>For f(x)=cos(x) about a=0, odd derivatives vanish.</p>
          <p>T₄(x)=1-x²/2!+x⁴/4!</p>
        </article>
        <article>
          <h3>Worked example</h3>
          <p>
            Find the 4th-degree Taylor polynomial of cos x about a=0.
            Approximate cos(0.6).
          </p>
          <p>T₄(x)=1-x²/2!+x⁴/4!</p>
          <p>T₄(0.6)={taylor(0.6, 4, 0).toFixed(6)}</p>
          <p>True value: cos(0.6)={Math.cos(0.6).toFixed(7)}</p>
          <p>
            Absolute error:{" "}
            {Math.abs(Math.cos(0.6) - taylor(0.6, 4, 0)).toFixed(7)}
          </p>
          <output>✓ The polynomial approximates well near the center.</output>
        </article>
        <article>
          <h3>⚠ Common misconception</h3>
          <p>
            Taylor polynomials are not global approximations. They can diverge
            rapidly far from the center.
          </p>
          <p>For cos x, the degree-4 model becomes inaccurate as |x| grows.</p>
          <MiniTaylor />
        </article>
      </section>
      <section className="tay305-practice">
        <article>
          <h3>
            ♙ Your turn
            <br />
            Practice challenge
          </h3>
          <p>For f(x)=cos(x) about a=0.</p>
          <p>1. Find the 4th-degree Taylor polynomial T₄(x).</p>
          <p>2. Use it to approximate cos(0.8). What is the absolute error?</p>
        </article>
        <section>
          <h3>Your answer</h3>
          <label>
            Enter T₄(x)=
            <input
              aria-label="Taylor polynomial answer"
              value={polyAnswer}
              onChange={(e) => {
                setPolyAnswer(e.target.value);
                setResult("");
              }}
            />
          </label>
          <label>
            T₄(0.8)=
            <input
              aria-label="Taylor value answer"
              value={valueAnswer}
              onChange={(e) => {
                setValueAnswer(e.target.value);
                setResult("");
              }}
            />
          </label>
          <label>
            Absolute error=
            <input
              aria-label="Taylor error answer"
              value={errorAnswer}
              onChange={(e) => {
                setErrorAnswer(e.target.value);
                setResult("");
              }}
            />
          </label>
          <button onClick={check}>Check answers</button>
        </section>
        <aside>
          <h3>Check against true value</h3>
          <b>cos(0.8)={Math.cos(0.8).toFixed(7)}</b>
          <output className={result}>
            <Check />{" "}
            {result === "correct"
              ? "Great! Very accurate near the center."
              : result === "incorrect"
                ? "Recalculate the polynomial and error."
                : "Check your three answers."}
          </output>
        </aside>
      </section>
      <nav className="tay305-adjacent">
        <a href="/lessons/calculus/304-newton-s-method">
          ←{" "}
          <span>
            <small>Previous</small>Newton's Method
          </span>
        </a>
        <a href="/lessons/calculus/306-maclaurin-series">
          <span>
            <small>Next</small>Maclaurin Series
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}

function TaylorGraph({
  degree,
  center,
  onCenter,
}: {
  degree: number;
  center: number;
  onCenter: (value: number) => void;
}) {
  const w = 520,
    h = 360,
    sx = (x: number) => 260 + (x / (2 * Math.PI)) * 235,
    sy = (y: number) => 180 - y * 105,
    path = (fn: (x: number) => number) =>
      Array.from({ length: 241 }, (_, i) => {
        const x = -2 * Math.PI + i * ((4 * Math.PI) / 240),
          y = Math.max(-1.65, Math.min(1.65, fn(x)));
        return `${i ? "L" : "M"}${sx(x)} ${sy(y)}`;
      }).join(" "),
    truePath = path(Math.cos),
    polyPath = path((x) => taylor(x, degree, center)),
    upper = path(
      (x) =>
        Math.cos(x) +
        Math.min(0.7, Math.abs(Math.cos(x) - taylor(x, degree, center))),
    ),
    lower = path(
      (x) =>
        Math.cos(x) -
        Math.min(0.7, Math.abs(Math.cos(x) - taylor(x, degree, center))),
    ),
    drag = (e: ReactPointerEvent<SVGCircleElement>) => {
      if (e.buttons !== 1 && e.type === "pointermove") return;
      if (e.type === "pointerdown")
        e.currentTarget.setPointerCapture(e.pointerId);
      const r = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
      if (r)
        onCenter(
          Math.max(
            -2 * Math.PI,
            Math.min(
              2 * Math.PI,
              ((((e.clientX - r.left) / r.width) * w - 260) / 235) *
                2 *
                Math.PI,
            ),
          ),
        );
    };
  return (
    <svg className="tay305-graph" viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <pattern
          id="tay-grid"
          width="58.75"
          height="52.5"
          patternUnits="userSpaceOnUse"
        >
          <path d="M58.75 0H0V52.5" fill="none" stroke="#e7ecf2" />
        </pattern>
      </defs>
      <rect width={w} height={h} fill="url(#tay-grid)" />
      <path className="band" d={`${upper} ${lower.replaceAll("M", "L")}`} />
      <line className="axis" x1="0" x2={w} y1={sy(0)} y2={sy(0)} />
      <line className="axis" x1={sx(0)} x2={sx(0)} y1="0" y2={h} />
      <path className="true" d={truePath} />
      <path className="poly" d={polyPath} />
      <circle
        data-drag="taylor-center"
        cx={sx(center)}
        cy={sy(0)}
        r="8"
        onPointerDown={drag}
        onPointerMove={drag}
      />
      <text x={Math.min(sx(center) + 12, w - 90)} y={sy(0) + 38}>
        Center a={center.toFixed(2)}
      </text>
    </svg>
  );
}
function MiniTaylor() {
  return (
    <svg viewBox="0 0 190 75">
      <path
        d="M5 55Q45 15 85 45T185 25"
        fill="none"
        stroke="#08a7cb"
        strokeWidth="2"
      />
      <path
        d="M5 8Q50 70 95 25T185 70"
        fill="none"
        stroke="#ef5b92"
        strokeWidth="2"
      />
      <line x1="95" x2="95" y1="5" y2="70" stroke="#26364c" />
    </svg>
  );
}
