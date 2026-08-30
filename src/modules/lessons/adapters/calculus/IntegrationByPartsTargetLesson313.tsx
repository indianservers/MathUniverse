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
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import "./IntegrationByPartsTargetLesson313.css";

type UKey = "x" | "x2" | "one";
type DvKey = "exp" | "cos" | "one";
const us: Record<
  UKey,
  { label: string; u: (x: number) => number; du: (x: number) => number }
> = {
  x: { label: "x", u: (x) => x, du: () => 1 },
  x2: { label: "x²", u: (x) => x * x, du: (x) => 2 * x },
  one: { label: "1", u: () => 1, du: () => 0 },
};
const dvs: Record<
  DvKey,
  {
    label: string;
    dv: (x: number) => number;
    v: (x: number) => number;
    vLabel: string;
  }
> = {
  exp: {
    label: "eˣ dx",
    dv: (x) => Math.exp(x),
    v: (x) => Math.exp(x),
    vLabel: "eˣ",
  },
  cos: {
    label: "cos(x) dx",
    dv: (x) => Math.cos(x),
    v: (x) => Math.sin(x),
    vLabel: "sin(x)",
  },
  one: { label: "dx", dv: () => 1, v: (x) => x, vLabel: "x" },
};
const clean = (n: number, p = 8) =>
  Math.abs(n) < 1e-12 ? 0 : Number(n.toFixed(p));
const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/\*/g, "")
    .replace(/\^/g, "")
    .replace(/²/g, "2");
export default function IntegrationByPartsTargetLesson313({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [uKey, setUKey] = useState<UKey>("x"),
    [dvKey, setDvKey] = useState<DvKey>("exp"),
    [x, setX] = useState(0),
    [h, setH] = useState(0.05),
    [tab, setTab] = useState("Interaction + visualization"),
    [answer, setAnswer] = useState(""),
    [result, setResult] = useState<"" | "correct" | "incorrect">(""),
    [steps, setSteps] = useState(false),
    [actions, setActions] = useState(0);
  const U = us[uKey],
    D = dvs[dvKey],
    product = (t: number) => U.u(t) * D.v(t),
    analytic = U.du(x) * D.v(x) + U.u(x) * D.dv(x),
    numeric = (product(x + h) - product(x - h)) / (2 * h),
    residual = Math.abs(numeric - analytic),
    termA = U.du(x) * D.v(x),
    termB = U.u(x) * D.dv(x);
  const reset = () => {
    setUKey("x");
    setDvKey("exp");
    setX(0);
    setH(0.05);
    setTab("Interaction + visualization");
    setAnswer("");
    setResult("");
    setSteps(false);
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
      const value = norm(answer);
      setResult(
        ["ex(x2-2x+2)+c", "(x2-2x+2)ex+c"].includes(value)
          ? "correct"
          : "incorrect",
      );
    });
  return (
    <section
      className="ibp313-page"
      data-testid="calculus-mockup-0392"
      data-dedicated-lesson="313"
      data-object-model="reverse-product-rule-selectable-u-dv-computed-du-v-draggable-evaluation-finite-difference-residual-symbolic-practice"
      data-u={uKey}
      data-dv={dvKey}
      data-x={clean(x)}
      data-h={h}
      data-terma={clean(termA)}
      data-termb={clean(termB)}
      data-analytic={clean(analytic)}
      data-numeric={clean(numeric)}
      data-residual={clean(residual, 12)}
      data-tab={tab}
      data-result={result}
      data-steps={steps}
      data-actions={actions}
    >
      <header className="ibp313-hero">
        <span>
          <b>CALCULUS</b>
          <b>INTEGRAL CALCULUS AND DIFFERENTIAL EQUATIONS</b>
        </span>
        <h1>Integration by Parts</h1>
        <p>Integrate products.</p>
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
      <nav className="ibp313-tabs">
        {[
          "Interaction + visualization",
          "Explain",
          "Examples",
          "Formulas",
          "Know more",
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
      <section className="ibp313-flow">
        {[
          [Eye, "Observe", "See the product rule on the model."],
          [Hand, "Manipulate", "Choose u and dv to split the product."],
          [Lightbulb, "Notice", "Watch how the product is rewritten."],
          [Target, "Understand", "Differentiate the result to verify."],
        ].map(([, title, text], i) => (
          <article key={String(title)}>
            <i>{i + 1}</i>
            <b>{String(title)}</b>
            <p>{String(text)}</p>
          </article>
        ))}
      </section>
      <section className="ibp313-lab">
        <header>
          <div>
            <small>INTERACTION + VISUALIZATION</small>
            <h2>Work directly on the model</h2>
          </div>
          <span>{actions ? "Model updated" : "Awaiting interaction"}</span>
          <b>{actions} actions</b>
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
          <header>
            <h3>Integration by Parts - reverse the product rule</h3>
            <strong>F′(x)=u′(x)v(x)+u(x)v′(x)</strong>
          </header>
          <div>
            <PartsGraph
              U={U}
              D={D}
              x={x}
              onX={(value) => act(() => setX(value))}
            />
            <aside>
              <article>
                <h3>Integration by parts</h3>
                <p>
                  A product integrand is split into u and dv before applying the
                  formula.
                </p>
                <p>
                  The highlighted points and sliders verify the exact calculus
                  rule.
                </p>
              </article>
              <section>
                <h3>Linked controls</h3>
                <label>
                  Choose u and dv
                  <select
                    aria-label="Parts u choice"
                    value={uKey}
                    onChange={(e) => act(() => setUKey(e.target.value as UKey))}
                  >
                    {Object.entries(us).map(([key, value]) => (
                      <option key={key} value={key}>
                        u={value.label}
                      </option>
                    ))}
                  </select>
                  <select
                    aria-label="Parts dv choice"
                    value={dvKey}
                    onChange={(e) =>
                      act(() => setDvKey(e.target.value as DvKey))
                    }
                  >
                    {Object.entries(dvs).map(([key, value]) => (
                      <option key={key} value={key}>
                        dv={value.label}
                      </option>
                    ))}
                  </select>
                </label>
                <h3>u and v (computed)</h3>
                <div>
                  <b>u(x)={U.label}</b>
                  <b>v(x)={D.vLabel}</b>
                </div>
                <label>
                  x (evaluation)
                  <input
                    aria-label="Parts evaluation x"
                    type="range"
                    min="-3"
                    max="3"
                    step=".05"
                    value={x}
                    onChange={(e) => act(() => setX(Number(e.target.value)))}
                  />
                  <output>{x.toFixed(2)}</output>
                </label>
                <label>
                  h (check step)
                  <input
                    aria-label="Parts finite difference h"
                    type="range"
                    min=".005"
                    max=".2"
                    step=".005"
                    value={h}
                    onChange={(e) => act(() => setH(Number(e.target.value)))}
                  />
                  <output>{h.toFixed(3)}</output>
                </label>
                <h3>Output summary</h3>
                <p>uv = {clean(product(x), 5)}</p>
                <p>u′v + uv′ = {clean(analytic, 5)}</p>
              </section>
            </aside>
          </div>
          <footer>
            <CheckCircle2 />
            <b>Check (differentiated)</b>
            <p>Derivative of your product matches F′(x).</p>
            <strong>
              || numeric - analytic || = {residual.toExponential(2)}
            </strong>
            <CheckCircle2 />
            <b>
              Match
              <br />
              <small>{residual < 0.01 ? "Excellent!" : "Reduce h"}</small>
            </b>
          </footer>
        </main>
      </section>
      <section className="ibp313-cards">
        <article>
          <h3>Main rule</h3>
          <strong>∫u dv = uv - ∫v du</strong>
          <p>(Reverse the product rule)</p>
          <b>
            Choose u → differentiates easier
            <br />
            dv → integrates easier
          </b>
        </article>
        <article>
          <h3>Worked example</h3>
          <strong>
            ∫x eˣ dx
            <br />
            u=x, dv=eˣdx ⇒ du=dx, v=eˣ
            <br />
            =xeˣ-∫eˣdx
            <br />
            =eˣ(x-1)+C ✓
          </strong>
        </article>
        <article className="mistake">
          <h3>⚠ Common misconception</h3>
          <b>Forgetting the minus sign.</b>
          <p>
            If you write ∫vdu=uv, you miss the negative sign and remaining
            integral.
          </p>
          <strong>Correct: ∫u dv=uv-∫vdu</strong>
        </article>
      </section>
      <section className="ibp313-practice">
        <header>
          <h3>Practice challenge</h3>
          <p>Split the product and integrate.</p>
          <strong>∫x²eˣ dx</strong>
        </header>
        <main>
          <label>
            Your answer (up to C)
            <input
              aria-label="Integration by parts practice answer"
              value={answer}
              placeholder="e.g., e^x(x^2-2x+2)"
              onChange={(e) => {
                setAnswer(e.target.value);
                setResult("");
              }}
            />
          </label>
          <button type="button" onClick={check}>
            Check
          </button>
          <button type="button" onClick={() => act(() => setSteps((v) => !v))}>
            Show steps
          </button>
          <output className={result}>
            {result === "correct"
              ? "Correct."
              : result === "incorrect"
                ? "Apply parts twice."
                : ""}
          </output>
          {steps && (
            <p>Choose u=x², dv=eˣdx; then apply parts once more to ∫2xeˣdx.</p>
          )}
        </main>
        <aside>
          <h3>Hint</h3>
          <p>Choose u=x² and dv=eˣdx.</p>
        </aside>
      </section>
      <nav className="ibp313-adjacent">
        <a href="/lessons/calculus/312-substitution">
          ←{" "}
          <span>
            <small>PREVIOUS</small>Substitution
          </span>
        </a>
        <a href="/lessons/calculus/314-partial-fractions">
          <span>
            <small>NEXT</small>Partial Fractions
          </span>{" "}
          →
        </a>
      </nav>
      <footer className="ibp313-footer">
        <b>⌁ Math Universe</b>
        <p>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </p>
        <nav>▥ Sitemap | ⚑ Docs | ✉ About</nav>
        <small>© 2026 INDIAN SERVERS PRIVATE LIMITED.</small>
      </footer>
    </section>
  );
}

function PartsGraph({
  U,
  D,
  x,
  onX,
}: {
  U: (typeof us)[UKey];
  D: (typeof dvs)[DvKey];
  x: number;
  onX: (v: number) => void;
}) {
  const w = 480,
    h = 535,
    sx = (v: number) => ((v + 3.5) / 7) * w,
    sy = (v: number) => h - ((v + 3) / 12) * h,
    derivative = (t: number) => U.du(t) * D.v(t) + U.u(t) * D.dv(t),
    path = Array.from({ length: 160 }, (_, i) => {
      const t = -3.2 + (i * 6.4) / 159;
      return `${i ? "L" : "M"}${sx(t)},${sy(derivative(t))}`;
    }).join(" ");
  const drag = (e: ReactPointerEvent<SVGCircleElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const box = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!box) return;
    const move = (p: PointerEvent) =>
      onX(
        Math.max(
          -3,
          Math.min(3, -3.5 + ((p.clientX - box.left) / box.width) * 7),
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
    <svg className="ibp313-graph" viewBox={`0 0 ${w} ${h}`}>
      <line x1="0" y1={sy(0)} x2={w} y2={sy(0)} className="axis" />
      <line x1={sx(0)} y1="0" x2={sx(0)} y2={h} className="axis" />
      <path d={path} className="curve" />
      <line x1="35" y1={h - 100} x2={sx(x)} y2={h - 100} className="blue" />
      <line x1={sx(x)} y1={h - 100} x2={w - 35} y2={h - 100} className="pink" />
      <circle
        data-drag="parts-x"
        cx={sx(x)}
        cy={sy(derivative(x))}
        r="7"
        onPointerDown={drag}
      />
      <circle cx={sx(x)} cy={h - 100} r="6" />
      <text x="85" y={h - 72}>
        u′(x)v(x)
      </text>
      <text x="320" y={h - 72}>
        u(x)v′(x)
      </text>
      <text x="285" y="55">
        F′(x)=u′v+uv′
      </text>
      <rect x="35" y={h - 55} width="410" height="45" rx="7" />
      <text x="95" y={h - 27}>
        F′(x) = u′(x)v(x) + u(x)v′(x)
      </text>
    </svg>
  );
}
