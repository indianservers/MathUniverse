import {
  CheckCircle2,
  Eye,
  Hand,
  Lightbulb,
  RotateCcw,
  Share2,
  Target,
  Trash2,
} from "lucide-react";
import {
  useEffect,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import "./PartialFractionsTargetLesson314.css";

const original = (x: number) => 1 / ((x + 2) * (x + 4)),
  split = (x: number) => -0.5 / (x + 4) + 0.5 / (x + 2),
  clean = (n: number, p = 8) =>
    Math.abs(n) < 1e-12 ? 0 : Number(n.toFixed(p));
const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/\*/g, "")
    .replace(/ln\(/g, "ln|")
    .replace(/\)/g, "|");
export default function PartialFractionsTargetLesson314({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [x, setX] = useState(0),
    [zoom, setZoom] = useState(1),
    [showAsymptotes, setShowAsymptotes] = useState(true),
    [showOverlay, setShowOverlay] = useState(true),
    [solved, setSolved] = useState(true),
    [tab, setTab] = useState("Interaction + Visualization"),
    [aAnswer, setAAnswer] = useState(""),
    [bAnswer, setBAnswer] = useState(""),
    [antiAnswer, setAntiAnswer] = useState(""),
    [result, setResult] = useState<"" | "correct" | "incorrect">(""),
    [actions, setActions] = useState(0);
  const raw = Math.abs((x + 2) * (x + 4)) < 1e-6 ? NaN : original(x),
    decomp = Math.abs((x + 2) * (x + 4)) < 1e-6 ? NaN : split(x),
    match = Number.isFinite(raw) && Math.abs(raw - decomp) < 1e-10;
  const reset = () => {
    setX(0);
    setZoom(1);
    setShowAsymptotes(true);
    setShowOverlay(true);
    setSolved(true);
    setTab("Interaction + Visualization");
    setAAnswer("");
    setBAnswer("");
    setAntiAnswer("");
    setResult("");
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((v) => v + 1);
    onInteraction();
  };
  const check = () =>
    act(() => {
      const anti = norm(antiAnswer);
      setResult(
        Math.abs(Number(aAnswer) - 2) < 1e-8 &&
          Math.abs(Number(bAnswer) - 1) < 1e-8 &&
          anti.includes("2ln|x-1|") &&
          anti.includes("ln|x+2|")
          ? "correct"
          : "incorrect",
      );
    });
  return (
    <section
      className="pf314-page"
      data-testid="calculus-mockup-0393"
      data-dedicated-lesson="314"
      data-object-model="factored-rational-coefficient-solver-asymptotes-draggable-probe-component-overlay-recombination-antiderivative-practice"
      data-x={clean(x)}
      data-zoom={zoom}
      data-asymptotes={showAsymptotes}
      data-overlay={showOverlay}
      data-solved={solved}
      data-original={Number.isFinite(raw) ? clean(raw) : "undefined"}
      data-split={Number.isFinite(decomp) ? clean(decomp) : "undefined"}
      data-match={match}
      data-tab={tab}
      data-result={result}
      data-actions={actions}
    >
      <header className="pf314-hero">
        <span>
          <b>CALCULUS</b>
          <b>INTEGRAL CALCULUS AND DIFFERENTIAL EQUATIONS</b>
        </span>
        <h1>Partial Fractions</h1>
        <p>Integrate rational functions.</p>
        <div className="meta">
          <i>♙ Advanced</i>
          <i>ϟ Advanced Lab</i>
          <i>▣ Integral / ODE / CAS</i>
          <i>◷ 6-10 min</i>
        </div>
        <div className="actions">
          <select aria-label="Lesson language">
            <option>English (English)</option>
          </select>
          <button type="button" onClick={() => act(reset)}>
            <RotateCcw />
            Reset
          </button>
          <button
            type="button"
            onClick={() =>
              act(() => void navigator.clipboard?.writeText(location.href))
            }
          >
            <Share2 />
            Share
          </button>
        </div>
        <section>
          {[
            [Eye, "OBSERVE", "Inspect the graph and function behavior."],
            [Hand, "MANIPULATE", "Decompose into partial fractions and solve."],
            [Lightbulb, "NOTICE", "Terms integrate into logarithms."],
            [
              Target,
              "UNDERSTAND",
              "Recombine to verify the original rational function.",
            ],
          ].map(([Icon, title, text]) => (
            <article key={String(title)}>
              <Icon />
              <b>{String(title)}</b>
              <p>{String(text)}</p>
            </article>
          ))}
        </section>
      </header>
      <nav className="pf314-tabs">
        {[
          "Interaction + Visualization",
          "Concept",
          "Examples",
          "Formulas",
          "Misconceptions",
          "Practice",
        ].map((name) => (
          <button
            type="button"
            key={name}
            className={tab === name ? "active" : ""}
            onClick={() => act(() => setTab(name))}
          >
            {name}
          </button>
        ))}
      </nav>
      <section className="pf314-workspace">
        <header>
          <h2>Decompose, integrate and verify</h2>
          <span>
            <CheckCircle2 /> All steps consistent
          </span>
        </header>
        <main>
          <section className="pf314-given">
            <article>
              <h3>Given function</h3>
              <strong>f(x)=1/[(x+2)(x+4)]</strong>
            </article>
            <article>
              <h3>Domain</h3>
              <strong>x≠-4,-2</strong>
            </article>
            <article>
              <h3>Step 1: Factor the denominator</h3>
              <strong>(x+2)(x+4) | ✓ Correct</strong>
            </article>
            <div>
              <h3>Graph of f(x)</h3>
              <RationalGraph
                x={x}
                zoom={zoom}
                asymptotes={showAsymptotes}
                overlay={showOverlay}
                onX={(value) => act(() => setX(value))}
              />
              <p>
                Vertical asymptotes: x=-4, x=-2
                <br />
                Horizontal asymptote: y=0
              </p>
            </div>
          </section>
          <section className="pf314-steps">
            <article>
              <h3>Step 2: Decomposition builder</h3>
              <p>For simple linear factors, use</p>
              <strong>1/[(x+2)(x+4)] = A/(x+4) + B/(x+2)</strong>
              <div>
                <b>A/(x+4)</b>
                <i>+</i>
                <b>B/(x+2)</b>
              </div>
              <button type="button" onClick={() => act(() => setSolved(true))}>
                Solve coefficients
              </button>
            </article>
            <article>
              <h3>Step 3: Coefficients</h3>
              <p>Solved by identity for all x.</p>
              <strong>{solved ? "A=-1/2, B=1/2" : "A=?, B=?"}</strong>
              <span>{solved ? "Verified ✓" : "Waiting"}</span>
            </article>
            <article>
              <h3>Step 4: Termwise integration</h3>
              <p>Integrate each term.</p>
              <strong>∫f(x)dx=-½ln|x+4|+½ln|x+2|+C</strong>
              <span>Done ✓</span>
            </article>
            <article>
              <h3>Step 5: Recombine check</h3>
              <strong>-1/[2(x+4)] + 1/[2(x+2)] = f(x)</strong>
              <span>Match ✓</span>
            </article>
          </section>
          <aside>
            <article>
              <h3>Key rule</h3>
              <p>If Q(x)=a∏(x-rᵢ) with distinct linear factors,</p>
              <strong>P(x)/Q(x)=Σ Aᵢ/(x-rᵢ)</strong>
              <p>Determine Aᵢ by equating numerators or substitution.</p>
            </article>
            <article>
              <h3>Coefficient method: substitution</h3>
              <p>Set x=-4 and x=-2 to isolate the coefficients.</p>
              <strong>
                A=lim(x→-4)(x+4)f(x)
                <br />
                B=lim(x→-2)(x+2)f(x)
              </strong>
            </article>
            <article>
              <h3>Interactive controls</h3>
              <label>
                x
                <input
                  aria-label="Partial fractions x probe"
                  type="range"
                  min="-8"
                  max="4"
                  step=".05"
                  value={x}
                  onChange={(e) => act(() => setX(Number(e.target.value)))}
                />
                <output>{x.toFixed(2)}</output>
              </label>
              <label>
                Zoom
                <input
                  aria-label="Partial fractions zoom"
                  type="range"
                  min=".5"
                  max="3"
                  step=".1"
                  value={zoom}
                  onChange={(e) => act(() => setZoom(Number(e.target.value)))}
                />
                <output>{zoom.toFixed(1)}</output>
              </label>
              <label>
                <input
                  aria-label="Show rational asymptotes"
                  type="checkbox"
                  checked={showAsymptotes}
                  onChange={() => act(() => setShowAsymptotes((v) => !v))}
                />
                Show asymptotes
              </label>
              <label>
                <input
                  aria-label="Show decomposition overlay"
                  type="checkbox"
                  checked={showOverlay}
                  onChange={() => act(() => setShowOverlay((v) => !v))}
                />
                Show decomposition overlay
              </label>
              <button type="button" onClick={() => act(() => setSolved(false))}>
                <Trash2 /> Clear coefficients
              </button>
            </article>
            <article>
              <h3>Live evaluation</h3>
              <p>Domain valid {Number.isFinite(raw) ? "✓" : "✕"}</p>
              <p>
                Original f(x):{" "}
                {Number.isFinite(raw) ? clean(raw, 6) : "undefined"}
              </p>
              <p>
                Decomposition:{" "}
                {Number.isFinite(decomp) ? clean(decomp, 6) : "undefined"}
              </p>
              <p>Recombination match {match ? "✓" : "✕"}</p>
            </article>
          </aside>
        </main>
      </section>
      <section className="pf314-cards">
        <article>
          <h3>Worked example (one correct solution)</h3>
          <p>Find ∫1/[(x+2)(x+4)]dx.</p>
          <ol>
            <li>Factor denominator.</li>
            <li>Set up A/(x+4)+B/(x+2).</li>
            <li>Solve A=-1/2, B=1/2.</li>
            <li>Integrate termwise.</li>
            <li>Recombine to check.</li>
          </ol>
          <strong>Answer: -½ln|x+4|+½ln|x+2|+C</strong>
        </article>
        <article className="mistake">
          <h3>⚠ Common misconception</h3>
          <b>Dropping a leading constant or factor.</b>
          <p>Factor the denominator completely before solving coefficients.</p>
          <strong>Impact: wrong coefficients and antiderivative.</strong>
        </article>
        <article className="practice">
          <h3>Try it yourself (quick practice)</h3>
          <p>Decompose and integrate (x+5)/[(x-1)(x+2)].</p>
          <label>
            A=
            <input
              aria-label="Partial fractions practice A"
              value={aAnswer}
              onChange={(e) => {
                setAAnswer(e.target.value);
                setResult("");
              }}
            />{" "}
            B=
            <input
              aria-label="Partial fractions practice B"
              value={bAnswer}
              onChange={(e) => {
                setBAnswer(e.target.value);
                setResult("");
              }}
            />
          </label>
          <label>
            ∫=
            <input
              aria-label="Partial fractions practice antiderivative"
              value={antiAnswer}
              onChange={(e) => {
                setAntiAnswer(e.target.value);
                setResult("");
              }}
            />
            +C
          </label>
          <button type="button" onClick={check}>
            Check answer
          </button>
          <output className={result}>
            {result === "correct"
              ? "Correct: A=2, B=1."
              : result === "incorrect"
                ? "Recombine A/(x-1)+B/(x+2)."
                : ""}
          </output>
        </article>
      </section>
      <nav className="pf314-adjacent">
        <a href="/lessons/calculus/313-integration-by-parts">
          ←{" "}
          <span>
            <small>Previous</small>Integration by Parts
          </span>
        </a>
        <a href="/lessons/calculus/315-improper-integrals">
          <span>
            <small>Next</small>Improper Integrals
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}

function RationalGraph({
  x,
  zoom,
  asymptotes,
  overlay,
  onX,
}: {
  x: number;
  zoom: number;
  asymptotes: boolean;
  overlay: boolean;
  onX: (v: number) => void;
}) {
  const w = 220,
    h = 360,
    xMin = -8 / zoom,
    xMax = 4 / zoom,
    sx = (v: number) => ((v - xMin) / (xMax - xMin)) * w,
    sy = (v: number) => h - ((v + 4) / 8) * h;
  const segments = [
    [xMin, -4.03],
    [-3.97, -2.03],
    [-1.97, xMax],
  ];
  const path = (fn: (v: number) => number, l: number, r: number) =>
    Array.from({ length: 90 }, (_, i) => {
      const t = l + ((r - l) * i) / 89,
        y = Math.max(-4, Math.min(4, fn(t)));
      return `${i ? "L" : "M"}${sx(t)},${sy(y)}`;
    }).join(" ");
  const drag = (e: ReactPointerEvent<SVGCircleElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const box = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!box) return;
    const move = (p: PointerEvent) =>
      onX(
        Math.max(
          -8,
          Math.min(
            4,
            xMin + ((p.clientX - box.left) / box.width) * (xMax - xMin),
          ),
        ),
      );
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  const y = Number.isFinite(original(x))
    ? Math.max(-4, Math.min(4, original(x)))
    : 0;
  return (
    <svg className="pf314-graph" viewBox={`0 0 ${w} ${h}`}>
      <line x1="0" y1={sy(0)} x2={w} y2={sy(0)} className="axis" />
      <line x1={sx(0)} y1="0" x2={sx(0)} y2={h} className="axis" />
      {asymptotes && (
        <>
          <line x1={sx(-4)} y1="0" x2={sx(-4)} y2={h} className="asym red" />
          <line x1={sx(-2)} y1="0" x2={sx(-2)} y2={h} className="asym purple" />
        </>
      )}
      {segments.map(([l, r], i) => (
        <path key={i} d={path(original, l, r)} className="curve" />
      ))}
      {overlay &&
        segments.map(([l, r], i) => (
          <path key={`o${i}`} d={path(split, l, r)} className="overlay" />
        ))}
      <circle
        data-drag="partial-probe"
        cx={sx(x)}
        cy={sy(y)}
        r="6"
        onPointerDown={drag}
      />
    </svg>
  );
}
