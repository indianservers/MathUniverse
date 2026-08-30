import {
  CheckCircle2,
  Eye,
  Hand,
  Lightbulb,
  Maximize2,
  RotateCcw,
  Share2,
  Target,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import "./AreaBetweenCurvesTargetLesson311.css";

type CurveKey =
  "parabola" | "semicircle" | "tent" | "zero" | "line" | "negative";
const curves: Record<
  CurveKey,
  { label: string; fn: (x: number) => number; color: string }
> = {
  parabola: {
    label: "-(1/3)x² + 4",
    fn: (x) => (-x * x) / 3 + 4,
    color: "#08a6c9",
  },
  semicircle: {
    label: "sqrt(16 - x²)",
    fn: (x) => Math.sqrt(Math.max(0, 16 - x * x)),
    color: "#08a6c9",
  },
  tent: { label: "4 - |x|", fn: (x) => 4 - Math.abs(x), color: "#08a6c9" },
  zero: { label: "0", fn: () => 0, color: "#7043dc" },
  line: { label: "x/4", fn: (x) => x / 4, color: "#7043dc" },
  negative: { label: "-1", fn: () => -1, color: "#7043dc" },
};
const clean = (n: number, p = 6) =>
  Math.abs(n) < 1e-10 ? 0 : Number(n.toFixed(p));
const ROOT_12 = Math.sqrt(12);
function integrate(
  top: CurveKey,
  bottom: CurveKey,
  a: number,
  b: number,
  n: number,
) {
  const dx = (b - a) / n,
    T = curves[top].fn,
    B = curves[bottom].fn;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const x = a + (i + 0.5) * dx;
    sum += Math.max(0, T(x) - B(x)) * dx;
  }
  return sum;
}
export default function AreaBetweenCurvesTargetLesson311({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [top, setTop] = useState<CurveKey>("parabola"),
    [bottom, setBottom] = useState<CurveKey>("zero"),
    [a, setA] = useState(-ROOT_12),
    [b, setB] = useState(ROOT_12),
    [sliceX, setSliceX] = useState(0),
    [slices, setSlices] = useState(100),
    [tab, setTab] = useState("Interaction + Visualization"),
    [topAnswer, setTopAnswer] = useState(""),
    [bottomAnswer, setBottomAnswer] = useState(""),
    [hint, setHint] = useState(false),
    [result, setResult] = useState<"" | "correct" | "incorrect">(""),
    [actions, setActions] = useState(0);
  const area = useMemo(
      () => integrate(top, bottom, a, b, slices),
      [top, bottom, a, b, slices],
    ),
    topY = curves[top].fn(sliceX),
    bottomY = curves[bottom].fn(sliceX),
    height = Math.max(0, topY - bottomY);
  const reset = () => {
    setTop("parabola");
    setBottom("zero");
    setA(-ROOT_12);
    setB(ROOT_12);
    setSliceX(0);
    setSlices(100);
    setTab("Interaction + Visualization");
    setTopAnswer("");
    setBottomAnswer("");
    setHint(false);
    setResult("");
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((v) => v + 1);
    onInteraction();
  };
  const bound = (which: "a" | "b", v: number) =>
    act(() => {
      if (which === "a") setA(Math.min(v, b - 0.25));
      else setB(Math.max(v, a + 0.25));
      setSliceX((x) =>
        Math.max(which === "a" ? v : a, Math.min(which === "b" ? v : b, x)),
      );
    });
  const check = () =>
    act(() =>
      setResult(
        topAnswer
          .toLowerCase()
          .replace(/\s/g, "")
          .replace(/\^2/g, "²")
          .includes("1-x²/4") &&
          ["0", "y=0"].includes(bottomAnswer.toLowerCase().replace(/\s/g, ""))
          ? "correct"
          : "incorrect",
      ),
    );
  return (
    <section
      className="abc311-page"
      data-testid="calculus-mockup-0390"
      data-dedicated-lesson="311"
      data-object-model="selectable-top-bottom-curves-editable-domain-draggable-slice-generated-vertical-slices-area-integration-practice"
      data-top={top}
      data-bottom={bottom}
      data-a={clean(a)}
      data-b={clean(b)}
      data-slice={clean(sliceX)}
      data-slices={slices}
      data-area={clean(area)}
      data-height={clean(height)}
      data-tab={tab}
      data-result={result}
      data-hint={hint}
      data-actions={actions}
    >
      <header className="abc311-hero">
        <span>
          <b>CALCULUS</b>
          <b>INTEGRAL CALCULUS AND DIFFERENTIAL EQUATIONS</b>
        </span>
        <h1>Area Between Curves</h1>
        <p>Measure bounded regions.</p>
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
          <a href="/graphing-calculator">↗ Workspace</a>
        </div>
      </header>
      <nav className="abc311-tabs">
        {[
          "Interaction + Visualization",
          "Explain",
          "Examples",
          "Key Formula",
          "Common Mistake",
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
      <section className="abc311-flow">
        <h3>HOW THIS LESSON WORKS</h3>
        <div>
          {[
            [
              Eye,
              "Observe",
              "Watch the region bounded by two curves and the slices.",
            ],
            [
              Hand,
              "Manipulate",
              "Change curves, domain, and see area update live.",
            ],
            [
              Lightbulb,
              "Notice",
              "Top minus bottom over the domain gives the area.",
            ],
            [
              Target,
              "Understand",
              "Use the correct formula with the right functions.",
            ],
          ].map(([Icon, title, text]) => (
            <article key={String(title)}>
              <Icon />
              <b>{String(title)}</b>
              <p>{String(text)}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="abc311-lab">
        <header>
          <small>INTERACTION</small>
          <h2>Work directly on the model</h2>
          <span>
            <CheckCircle2 /> Model is valid
          </span>
          <button
            type="button"
            aria-label="Full screen model"
            onClick={() =>
              act(() => void document.documentElement.requestFullscreen?.())
            }
          >
            <Maximize2 />
          </button>
        </header>
        <main>
          <CurvesGraph
            top={top}
            bottom={bottom}
            a={a}
            b={b}
            sliceX={sliceX}
            slices={slices}
            onSlice={(v) => act(() => setSliceX(v))}
          />
          <aside>
            <h3>Domain of x</h3>
            <div className="domain">
              <input
                aria-label="Area domain start"
                type="number"
                min="-6"
                max="5"
                step=".25"
                value={clean(a, 3)}
                onChange={(e) => bound("a", Number(e.target.value))}
              />
              <span>to</span>
              <input
                aria-label="Area domain end"
                type="number"
                min="-5"
                max="6"
                step=".25"
                value={clean(b, 3)}
                onChange={(e) => bound("b", Number(e.target.value))}
              />
            </div>
            <label>
              Top function f(x)
              <select
                aria-label="Area top function"
                value={top}
                onChange={(e) => act(() => setTop(e.target.value as CurveKey))}
              >
                {["parabola", "semicircle", "tent"].map((k) => (
                  <option key={k} value={k}>
                    {curves[k as CurveKey].label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Bottom function g(x)
              <select
                aria-label="Area bottom function"
                value={bottom}
                onChange={(e) =>
                  act(() => setBottom(e.target.value as CurveKey))
                }
              >
                {["zero", "line", "negative"].map((k) => (
                  <option key={k} value={k}>
                    {curves[k as CurveKey].label}
                  </option>
                ))}
              </select>
            </label>
            <h3>Linked controls</h3>
            <label>
              x (slice)
              <input
                aria-label="Inspection slice x"
                type="range"
                min={a}
                max={b}
                step=".05"
                value={sliceX}
                onChange={(e) => act(() => setSliceX(Number(e.target.value)))}
              />
              <output>{sliceX.toFixed(2)}</output>
            </label>
            <label>
              Number of slices
              <input
                aria-label="Area slice count"
                type="range"
                min="10"
                max="200"
                step="10"
                value={slices}
                onChange={(e) => act(() => setSlices(Number(e.target.value)))}
              />
              <output>{slices}</output>
            </label>
          </aside>
        </main>
        <footer>
          <article>
            <b>Area of the region (units²)</b>
            <output>{area.toFixed(4)}</output>
            <p>≈ numerical midpoint sum</p>
          </article>
          <article>
            <b>Slice at x={sliceX.toFixed(2)}</b>
            <p>
              Top = {topY.toFixed(4)}
              <br />
              Bottom = {bottomY.toFixed(4)}
              <br />
              Height = {height.toFixed(4)}
            </p>
          </article>
          <article>
            <b>Selected method</b>
            <p>Top minus bottom</p>
            <strong>
              A=∫<sub>{a.toFixed(2)}</sub>
              <sup>{b.toFixed(2)}</sup>[f(x)-g(x)]dx
            </strong>
          </article>
        </footer>
      </section>
      <section className="abc311-concepts">
        <article>
          <h3>What you are seeing</h3>
          <p>
            • The blue curve is above the purple curve on the chosen interval.
            <br />• Each vertical slice has height f(x)-g(x).
            <br />• The sum of all slice areas approaches the exact area.
          </p>
          <strong>
            ━ f(x) top function
            <br />
            <em>━ g(x)</em> bottom function
            <br />▧ Area region between curves
          </strong>
        </article>
        <article>
          <h3>Key Idea</h3>
          <p>The area between two curves on [a,b] is:</p>
          <strong>
            A=∫<sub>a</sub>
            <sup>b</sup>[top(x)-bottom(x)]dx
          </strong>
          <p>
            ☑ Use top minus bottom.
            <br />☑ Integrate over the common domain.
            <br />☑ Result is non-negative.
          </p>
        </article>
        <article className="mistake">
          <h3>⚠ Common Mistake</h3>
          <p>Using bottom - top reverses the sign and gives a negative area.</p>
          <strong>Wrong: A=∫[bottom-top]dx</strong>
          <b>Right: A=∫[top-bottom]dx</b>
        </article>
      </section>
      <section className="abc311-worked">
        <h3>WORKED EXAMPLE</h3>
        <h2>Find the area between y=-(1/3)x²+4 and y=0.</h2>
        <ol>
          <li>Intersect the curves: x=±√12</li>
          <li>Set up top minus bottom.</li>
          <li>Evaluate: ∫[-x²/3+4]dx</li>
          <li>Answer: 32√3/3 ≈ 18.4752 units²</li>
        </ol>
        <MiniGraph />
      </section>
      <section className="abc311-practice">
        <header>
          <small>YOUR TURN</small>
          <h2>Practice Challenge</h2>
          <p>Find the area between the given curves on [-4,4].</p>
          <span>Top: y=1-(1/4)x² | Bottom: y=0 | Interval: [-4,4]</span>
        </header>
        <main>
          <h3>Your setup</h3>
          <label>
            A=∫<sub>-4</sub>
            <sup>4</sup>[
            <input
              aria-label="Area practice top expression"
              value={topAnswer}
              onChange={(e) => {
                setTopAnswer(e.target.value);
                setResult("");
              }}
            />{" "}
            -{" "}
            <input
              aria-label="Area practice bottom expression"
              value={bottomAnswer}
              onChange={(e) => {
                setBottomAnswer(e.target.value);
                setResult("");
              }}
            />
            ]dx
          </label>
          <button type="button" onClick={check}>
            Check Answer
          </button>
          <button type="button" onClick={() => act(() => setHint((v) => !v))}>
            Hint
          </button>
          <output className={result}>
            {result === "correct"
              ? "Correct setup."
              : result === "incorrect"
                ? "Use top minus bottom."
                : ""}
          </output>
        </main>
        <aside>
          <h3>Feedback</h3>
          <p>
            {hint
              ? "The top expression is 1-x²/4 and the bottom is 0."
              : "Enter an expression and click Check Answer to see feedback."}
          </p>
        </aside>
      </section>
      <nav className="abc311-adjacent">
        <a href="/lessons/calculus/310-fundamental-theorem">
          ←{" "}
          <span>
            <small>PREVIOUS</small>Fundamental Theorem
          </span>
        </a>
        <a href="/lessons/calculus/312-substitution">
          <span>
            <small>NEXT</small>Substitution
          </span>{" "}
          →
        </a>
      </nav>
      <footer className="abc311-footer">
        <b>⌁ Math Universe</b>
        <p>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </p>
        <nav>⌘ Sitemap | ⚑ Docs | ⌁ About</nav>
        <small>© 2026 INDIAN SERVERS PRIVATE LIMITED.</small>
      </footer>
    </section>
  );
}

function CurvesGraph({
  top,
  bottom,
  a,
  b,
  sliceX,
  slices,
  onSlice,
}: {
  top: CurveKey;
  bottom: CurveKey;
  a: number;
  b: number;
  sliceX: number;
  slices: number;
  onSlice: (v: number) => void;
}) {
  const w = 480,
    h = 360,
    sx = (x: number) => ((x + 6) / 12) * w,
    sy = (y: number) => h - ((y + 3) / 9) * h,
    T = curves[top].fn,
    B = curves[bottom].fn,
    path = (f: (x: number) => number) =>
      Array.from({ length: 151 }, (_, i) => {
        const x = -5.5 + (i * 11) / 150;
        return `${i ? "L" : "M"}${sx(x)},${sy(f(x))}`;
      }).join(" "),
    region = Array.from({ length: 80 }, (_, i) => {
      const x = a + ((b - a) * i) / 79;
      return `${sx(x)},${sy(T(x))}`;
    }).concat(
      Array.from({ length: 80 }, (_, i) => {
        const x = b - ((b - a) * i) / 79;
        return `${sx(x)},${sy(B(x))}`;
      }),
    );
  const drag = (e: ReactPointerEvent<SVGLineElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const box = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!box) return;
    const move = (p: PointerEvent) =>
      onSlice(
        Math.max(
          a,
          Math.min(b, -6 + ((p.clientX - box.left) / box.width) * 12),
        ),
      );
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  return (
    <svg className="abc311-graph" viewBox={`0 0 ${w} ${h}`}>
      <path d={`M${region.join(" L")} Z`} className="region" />
      {Array.from(
        { length: Math.min(slices, 100) },
        (_, i) => a + ((b - a) * i) / (Math.min(slices, 100) - 1),
      ).map((x) => (
        <line
          key={x}
          x1={sx(x)}
          y1={sy(T(x))}
          x2={sx(x)}
          y2={sy(B(x))}
          className="slice"
        />
      ))}
      <line x1="0" y1={sy(0)} x2={w} y2={sy(0)} className="axis" />
      <line x1={sx(0)} y1="0" x2={sx(0)} y2={h} className="axis" />
      <path d={path(T)} className="top" />
      <path d={path(B)} className="bottom" />
      <line
        data-drag="area-slice"
        x1={sx(sliceX)}
        y1={sy(T(sliceX))}
        x2={sx(sliceX)}
        y2={sy(B(sliceX))}
        className="inspect"
        onPointerDown={drag}
      />
      <circle cx={sx(sliceX)} cy={sy(T(sliceX))} r="5" />
      <circle cx={sx(sliceX)} cy={sy(B(sliceX))} r="5" />
    </svg>
  );
}
function MiniGraph() {
  return (
    <svg className="abc311-mini" viewBox="0 0 250 120">
      <line x1="0" y1="95" x2="250" y2="95" />
      <path d="M20 95 Q125 -15 230 95" />
      <path d="M20 95 Q125 -15 230 95 L230 95 L20 95Z" />
    </svg>
  );
}
