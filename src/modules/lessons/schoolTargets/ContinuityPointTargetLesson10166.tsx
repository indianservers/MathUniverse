import { Check, Maximize2, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { useMemo, useState } from "react";
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./ContinuityPointTargetLesson10166.css";

const C = 1,
  LIMIT = 2;
const fmt = (n: number, digits = 4) => n.toFixed(digits).replace(/\.0+$/, "");

export default function ContinuityPointTargetLesson10166({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [defined, setDefined] = useState(2);
  const [epsilon, setEpsilon] = useState(0.0001);
  const [layers, setLayers] = useState({
    line: true,
    hole: true,
    point: true,
    guides: true,
    axes: true,
  });
  const [zoom, setZoom] = useState(1);
  const [practice, setPractice] = useState(false);
  const continuous = Math.abs(defined - LIMIT) < 1e-9;
  const leftX = C - epsilon,
    rightX = C + epsilon;
  const conditions = useMemo(
    () => [Number.isFinite(defined), true, continuous],
    [defined, continuous],
  );
  const changeLayer = (key: keyof typeof layers) =>
    setLayers((v) => ({ ...v, [key]: !v[key] }));
  const reset = () => {
    setDefined(2);
    setEpsilon(0.0001);
    setLayers({
      line: true,
      hole: true,
      point: true,
      guides: true,
      axes: true,
    });
    setZoom(1);
    setPractice(false);
  };
  const movePoint = (value: number) =>
    setDefined(Math.max(-2, Math.min(5, Number(value.toFixed(2)))));
  const keyPoint = (e: KeyboardEvent<SVGCircleElement>) => {
    if (e.key === "ArrowUp" || e.key === "ArrowRight")
      movePoint(defined + 0.25);
    if (e.key === "ArrowDown" || e.key === "ArrowLeft")
      movePoint(defined - 0.25);
  };
  const dragPoint = (e: ReactPointerEvent<SVGCircleElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const svg = e.currentTarget.ownerSVGElement!;
    const move = (event: PointerEvent) =>
      movePoint(
        5 -
          ((event.clientY - svg.getBoundingClientRect().top) /
            svg.getBoundingClientRect().height) *
            7,
      );
    const stop = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
  };
  return (
    <main
      className="cp10166-page"
      data-testid="school-mockup-0840"
      data-object-model="dedicated-three-condition-continuity-engine"
      data-defined={fmt(defined)}
      data-limit="2"
      data-continuous={String(continuous)}
    >
      <header>
        <small>CLASS 12 · FORMAL CALCULUS</small>
        <h1>Continuity at a Point</h1>
        <p>
          Check continuity of <b>f(x) = (x² − 1)/(x − 1)</b> for x ≠ 1 with f(1)
          = {fmt(defined)}.
        </p>
        <div>
          <span>20 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>graph</span>
          <span>limits</span>
        </div>
      </header>
      <section className="cp-checker">
        <h3>☷ &nbsp; CONTINUITY CHECKER</h3>
        <div className="cp-main">
          <aside>
            <section>
              <h2>Define f(1)</h2>
              <p>Set the defined value at x = 1</p>
              <label>
                f(1) ={" "}
                <input
                  aria-label="Defined value f(1)"
                  type="number"
                  min="-2"
                  max="5"
                  step="1"
                  value={defined}
                  onChange={(e) => movePoint(Number(e.target.value))}
                />
              </label>
            </section>
            <section>
              <h2>Current rule</h2>
              <div className="cp-rule">
                f(x) = ⎧ (x²−1)/(x−1), x≠1
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp; ⎩ <b>{fmt(defined)}</b>, x=1
              </div>
            </section>
            <section className={continuous ? "cp-status ok" : "cp-status no"}>
              <h3>CONTINUITY STATUS</h3>
              <strong>{continuous ? "✓" : "✕"}</strong>
              <b>{continuous ? "Continuous" : "Not continuous"} at x = 1</b>
              <p>
                {continuous
                  ? "All three conditions are satisfied."
                  : "The limit and function value are not equal."}
              </p>
            </section>
          </aside>
          <article className="cp-canvas">
            <div className="cp-tools">
              <button
                aria-label="Zoom out"
                onClick={() => setZoom((z) => Math.max(0.8, z - 0.1))}
              >
                <ZoomOut />
              </button>
              <button aria-label="Fit graph" onClick={() => setZoom(1)}>
                <Maximize2 />
              </button>
              <button aria-label="Reset continuity checker" onClick={reset}>
                <RotateCcw />
              </button>
              <button
                aria-label="Zoom in"
                onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))}
              >
                <ZoomIn />
              </button>
            </div>
            <svg
              viewBox="0 0 500 340"
              aria-label="Continuity graph"
              style={{ transform: `scale(${zoom})` }}
            >
              <defs>
                <pattern
                  id="cpgrid"
                  width="32"
                  height="32"
                  patternUnits="userSpaceOnUse"
                >
                  <path d="M32 0H0V32" fill="none" stroke="#e5edf1" />
                </pattern>
              </defs>
              <rect width="500" height="340" fill="url(#cpgrid)" />
              {layers.axes && (
                <>
                  <path d="M20 265H485M215 15V330" stroke="#1f2937" />
                  <text x="475" y="255">
                    x
                  </text>
                  <text x="225" y="20">
                    y
                  </text>
                </>
              )}
              {layers.line && (
                <path d="M95 345L415 25" stroke="#2738f2" strokeWidth="3" />
              )}
              {layers.guides && (
                <path
                  d="M255 265V185M20 185H255"
                  stroke="#8d9dae"
                  strokeDasharray="5"
                />
              )}
              {layers.hole && (
                <circle
                  cx="255"
                  cy="185"
                  r="7"
                  fill="white"
                  stroke="#2940ef"
                  strokeWidth="3"
                />
              )}
              {layers.point && (
                <circle
                  role="slider"
                  aria-label="Defined point"
                  tabIndex={0}
                  onPointerDown={dragPoint}
                  onKeyDown={keyPoint}
                  cx="255"
                  cy={265 - defined * 40}
                  r="8"
                  fill="#ee2d2d"
                  stroke="#9f1212"
                />
              )}
              <text x="100" y="315" fill="#4b75b5">
                f(x) = x + 1 for x ≠ 1
              </text>
            </svg>
          </article>
          <aside className="cp-options">
            <section>
              <b>— y = x + 1 (for x ≠ 1)</b>
              <b>🔴 f(1) = {fmt(defined)} (defined point)</b>
              <b>○ hole at (1, 2)</b>
            </section>
            <section>
              <h2>Display options</h2>
              {(["line", "hole", "point", "guides", "axes"] as const).map(
                (k) => (
                  <label key={k}>
                    <input
                      type="checkbox"
                      checked={layers[k]}
                      onChange={() => changeLayer(k)}
                    />{" "}
                    Show {k}
                  </label>
                ),
              )}
            </section>
            <section>
              <h2>Probe x-values</h2>
              <label>
                x → 1
                <input
                  aria-label="Probe distance"
                  type="range"
                  min="0.0001"
                  max="0.2"
                  step="0.0001"
                  value={epsilon}
                  onInput={(e) => setEpsilon(Number(e.currentTarget.value))}
                />
                <output>{epsilon.toFixed(4)}</output>
              </label>
            </section>
          </aside>
        </div>
        <div className="cp-probes">
          <article>
            <h3>LEFT PROBE (x → 1⁻)</h3>
            <b>x = {fmt(leftX)}</b>
            <p>f(x) = {fmt(leftX + 1)}</p>
            <small>Approaching 2 from the left</small>
          </article>
          <b>←</b>
          <article>
            <h3>RIGHT PROBE (x → 1⁺)</h3>
            <b>x = {fmt(rightX)}</b>
            <p>f(x) = {fmt(rightX + 1)}</p>
            <small>Approaching 2 from the right</small>
          </article>
          <b>→</b>
          <article className="limit">
            <h3>TWO-SIDED LIMIT</h3>
            <strong>lim f(x) = 2</strong>
            <p>✓ Left limit = Right limit = 2</p>
          </article>
          <article>
            <h3>FUNCTION VALUE</h3>
            <strong>f(1) = {fmt(defined)}</strong>
          </article>
        </div>
        <section className="cp-conditions">
          <h3>THREE-CONDITION CONTINUITY CHECKER AT x = c (c = 1)</h3>
          <div>
            <table>
              <thead>
                <tr>
                  <th>Condition</th>
                  <th>What we check</th>
                  <th>At x = 1</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>① Existence of f(1)</td>
                  <td>f(1) is defined.</td>
                  <td>f(1) = {fmt(defined)}</td>
                  <td>✓</td>
                </tr>
                <tr>
                  <td>② Existence of limit</td>
                  <td>lim f(x) exists.</td>
                  <td>lim f(x) = 2</td>
                  <td>✓</td>
                </tr>
                <tr>
                  <td>③ Equality</td>
                  <td>lim f(x) = f(1)</td>
                  <td>
                    2 {continuous ? "=" : "≠"} {fmt(defined)}
                  </td>
                  <td className={continuous ? "yes" : "no"}>
                    {continuous ? "✓" : "✕"}
                  </td>
                </tr>
              </tbody>
            </table>
            <article className={continuous ? "ok" : "no"}>
              <h3>Conclusion</h3>
              <strong>{continuous ? "✓" : "✕"}</strong>
              <b>
                {conditions.every(Boolean)
                  ? "All three conditions are satisfied."
                  : "The equality condition fails."}
              </b>
              <p>
                Therefore, f is {continuous ? "" : "not "}continuous at x = 1.
              </p>
            </article>
          </div>
        </section>
      </section>
      <section className="cp-info">
        <article>
          <h3>ALGEBRAIC SIMPLIFICATION (for x ≠ 1)</h3>
          <p>(x²−1)/(x−1) = ((x−1)(x+1))/(x−1) = x+1, x≠1</p>
          <small>
            The graph is the line y=x+1 with a removable discontinuity at x=1.
          </small>
        </article>
        <article>
          <h3>DOMAIN NOTE</h3>
          <p>Original rule is defined piecewise at x=1.</p>
          <p>Domain: ℝ because f(1) is defined separately.</p>
        </article>
      </section>
      <section className="cp-warning">
        <h3>⚠ WHY EXISTENCE OF f(1) ALONE IS NOT ENOUGH</h3>
        <p>
          Consider g(x)=1 for x≠1 and g(1)=5. Here g(1) exists, but lim
          g(x)=1≠5.
        </p>
        <button onClick={() => setDefined(1)}>Try this example</button>
      </section>
      <section className="cp-worked">
        <article>
          <h3>WORKED EXAMPLE</h3>
          <p>1. Simplify the nearby rule to x+1, so the limit is 2.</p>
          <p>2. Function value: f(1)={fmt(defined)}.</p>
          <p>
            3. Compare: 2 {continuous ? "=" : "≠"} {fmt(defined)}.
          </p>
          <b>
            {continuous
              ? "All three conditions are satisfied."
              : "The equality condition fails."}
          </b>
        </article>
        <svg viewBox="0 0 260 130">
          <path d="M15 105H250M110 5V125" stroke="#334155" />
          <path d="M25 125L230 15" stroke="#2738f2" strokeWidth="2" />
          <circle cx="130" cy={105 - defined * 20} r="5" fill="#e83232" />
        </svg>
      </section>
      <section className="cp-practice">
        <article>
          <h3>PRACTICE</h3>
          <table>
            <thead>
              <tr>
                <th>f(1)</th>
                <th>limit</th>
                <th>Continuous?</th>
              </tr>
            </thead>
            <tbody>
              {[
                [0, "No"],
                [2, "Yes"],
                [5, "No"],
              ].map((r) => (
                <tr key={r[0]}>
                  <td>{r[0]}</td>
                  <td>2</td>
                  <td>{practice ? r[1] : "?"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => setPractice(true)}>
            <Check /> Check your answers
          </button>
        </article>
        <article>
          <h3>TRY IT YOURSELF</h3>
          <p>Change f(1) and see the status update.</p>
          <label>
            f(1) = {fmt(defined)}
            <input
              aria-label="Try f(1)"
              type="range"
              min="-2"
              max="5"
              step="1"
              value={defined}
              onInput={(e) => movePoint(Number(e.currentTarget.value))}
            />
          </label>
          <div className={continuous ? "ok" : "no"}>
            {continuous ? "✓ Continuous at x = 1" : "✕ Not continuous at x = 1"}
          </div>
        </article>
      </section>
      <nav className="cp-adjacent">
        <button>← Left-Hand and Right-Hand Limits</button>
        <button>Continuity on an Interval →</button>
      </nav>
      <footer>
        <b>⌁ Math Universe</b>
        <p>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </p>
        <small>
          © 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.
        </small>
      </footer>
    </main>
  );
}
