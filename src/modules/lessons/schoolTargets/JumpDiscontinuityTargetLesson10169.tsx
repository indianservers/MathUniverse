import {
  Check,
  Eye,
  Maximize2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./JumpDiscontinuityTargetLesson10169.css";

type Scenario = "jump" | "removable" | "infinite";
const fmt = (n: number) =>
  Math.abs(n) >= 1000
    ? "∞"
    : n.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
export default function JumpDiscontinuityTargetLesson10169({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [scenario, setScenario] = useState<Scenario>("jump"),
    [epsilon, setEpsilon] = useState(0.1),
    [defined, setDefined] = useState(3);
  const [editing, setEditing] = useState(false),
    [draft, setDraft] = useState(3),
    [zoom, setZoom] = useState(1),
    [hints, setHints] = useState(false);
  const limits =
    scenario === "jump"
      ? { left: 1, right: 3 }
      : scenario === "removable"
        ? { left: 1, right: 1 }
        : { left: Infinity, right: Infinity };
  const equal = limits.left === limits.right,
    jumpSize =
      Number.isFinite(limits.left) && Number.isFinite(limits.right)
        ? Math.abs(limits.right - limits.left)
        : Infinity;
  const classification =
    scenario === "jump"
      ? "Jump Discontinuity"
      : scenario === "removable"
        ? defined === 1
          ? "Continuous"
          : "Removable Discontinuity"
        : "Infinite Discontinuity";
  const leftX = -epsilon,
    rightX = epsilon;
  const leftValue = scenario === "infinite" ? -1 / leftX : leftX + 1,
    rightValue =
      scenario === "jump"
        ? rightX + 3
        : scenario === "removable"
          ? rightX + 1
          : 1 / rightX;
  const rows = useMemo(() => [-0.1, -0.01, -0.001, 0, 0.001, 0.01, 0.1], []);
  const choose = (s: Scenario) => {
    setScenario(s);
    setEpsilon(0.1);
    setDefined(s === "removable" ? 3 : 3);
    setDraft(3);
    setEditing(false);
  };
  const moveProbe = (n: number) =>
    setEpsilon(Math.max(0.001, Math.min(0.5, Number(n.toFixed(3)))));
  const keyProbe = (e: KeyboardEvent<SVGCircleElement>) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowDown")
      moveProbe(epsilon + 0.01);
    if (e.key === "ArrowRight" || e.key === "ArrowUp")
      moveProbe(epsilon - 0.01);
  };
  const dragProbe = (e: ReactPointerEvent<SVGCircleElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const svg = e.currentTarget.ownerSVGElement!;
    const move = (ev: PointerEvent) =>
      moveProbe(
        Math.abs(
          ((ev.clientX - svg.getBoundingClientRect().left) /
            svg.getBoundingClientRect().width) *
            8 -
            4,
        ),
      );
    const stop = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
  };
  const reset = () => {
    setScenario("jump");
    setEpsilon(0.1);
    setDefined(3);
    setDraft(3);
    setEditing(false);
    setZoom(1);
    setHints(false);
  };
  const graphY = (v: number) => 250 - v * 35;
  return (
    <main
      className="jd10169-page"
      data-testid="school-mockup-0843"
      data-object-model="dedicated-piecewise-jump-comparison-engine"
      data-scenario={scenario}
      data-left-limit={fmt(limits.left)}
      data-right-limit={fmt(limits.right)}
      data-jump-size={fmt(jumpSize)}
      data-classification={classification}
    >
      <header>
        <small>CLASS 12 · FORMAL CALCULUS</small>
        <h1>Jump Discontinuity</h1>
        <p>
          Explore finite unequal one-sided limits with a live piecewise editor,
          synchronized probes, and comparison scenarios.
        </p>
        <div>
          <span>18 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>graph</span>
        </div>
      </header>
      <section className="jd-lab">
        <div className="jd-title">
          <div>
            <h3>☷ &nbsp; INTERACTIVE LAB</h3>
            <h2>Explore the jump</h2>
          </div>
          <button onClick={reset}>
            <RotateCcw /> Reset lab
          </button>
        </div>
        <div className="jd-work">
          <aside>
            <h3>LIVE PIECEWISE EDITOR</h3>
            <div className="jd-rule">
              f(x)= ⎧ {scenario === "infinite" ? "−1/x" : "x + 1"} &nbsp; for
              x&lt;0
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp; ⎩{" "}
              {scenario === "jump"
                ? "x + 3"
                : scenario === "removable"
                  ? "x + 1"
                  : "1/x"}{" "}
              &nbsp; for x≥0
            </div>
            <b>
              {scenario === "jump"
                ? "Jump"
                : scenario === "removable"
                  ? "Hole"
                  : "Vertical asymptote"}{" "}
              at x=0
            </b>
            <p>Change scenario</p>
            <div className="jd-scenario">
              {(["jump", "removable", "infinite"] as Scenario[]).map((s) => (
                <button
                  className={scenario === s ? "active" : ""}
                  onClick={() => choose(s)}
                  key={s}
                >
                  {s[0].toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
            <small>
              Try changing the rules and see how the graph and values update.
            </small>
          </aside>
          <article>
            <h3>GRAPH &amp; PROBES</h3>
            <div className="jd-graph-wrap">
              <svg
                viewBox="0 0 520 390"
                aria-label="Jump discontinuity graph"
                style={{ transform: `scale(${zoom})` }}
              >
                <defs>
                  <pattern
                    id="jdgrid"
                    width="32"
                    height="32"
                    patternUnits="userSpaceOnUse"
                  >
                    <path d="M32 0H0V32" fill="none" stroke="#dce6eb" />
                  </pattern>
                </defs>
                <rect width="520" height="390" fill="url(#jdgrid)" />
                <path d="M10 250H510M250 10V380" stroke="#1f2937" />
                {scenario !== "infinite" ? (
                  <>
                    <path
                      d="M40 320L250 215"
                      stroke="#1689f5"
                      strokeWidth="3"
                    />
                    <path
                      d={
                        scenario === "jump"
                          ? "M250 145L445 40"
                          : "M250 215L445 110"
                      }
                      stroke="#279b2b"
                      strokeWidth="3"
                    />
                    <circle
                      cx="250"
                      cy="215"
                      r="7"
                      fill="white"
                      stroke="#1689f5"
                      strokeWidth="3"
                    />
                    <circle
                      cx="250"
                      cy={scenario === "jump" ? 145 : graphY(defined)}
                      r="7"
                      fill={scenario === "jump" ? "#269b2c" : "#25364d"}
                    />
                  </>
                ) : (
                  <>
                    <path
                      d="M40 215Q180 205 235 30"
                      fill="none"
                      stroke="#1689f5"
                      strokeWidth="3"
                    />
                    <path
                      d="M265 30Q320 205 460 215"
                      fill="none"
                      stroke="#279b2b"
                      strokeWidth="3"
                    />
                    <path
                      d="M250 10V380"
                      stroke="#dc3a48"
                      strokeDasharray="6"
                    />
                  </>
                )}
                <path
                  d={`M${250 - epsilon * 65} 30V350`}
                  stroke="#1689f5"
                  strokeDasharray="5"
                />
                <path
                  d={`M${250 + epsilon * 65} 30V350`}
                  stroke="#279b2b"
                  strokeDasharray="5"
                />
                <circle
                  role="slider"
                  aria-label="Left probe"
                  tabIndex={0}
                  onPointerDown={dragProbe}
                  onKeyDown={keyProbe}
                  cx={250 - epsilon * 65}
                  cy={graphY(Math.min(6, leftValue))}
                  r="6"
                  fill="#1689f5"
                />
                <circle
                  role="slider"
                  aria-label="Right probe"
                  tabIndex={0}
                  onPointerDown={dragProbe}
                  onKeyDown={keyProbe}
                  cx={250 + epsilon * 65}
                  cy={graphY(Math.min(6, rightValue))}
                  r="6"
                  fill="#279b2b"
                />
              </svg>
              <div className="jd-legend">
                <b>━ Left (x&lt;0)</b>
                <b>━ Right (x≥0)</b>
                <span>○ Open point</span>
                <span>● Closed point</span>
              </div>
              <div className="jd-tools">
                <button
                  aria-label="Zoom in"
                  onClick={() => setZoom((z) => Math.min(1.3, z + 0.1))}
                >
                  <ZoomIn />
                </button>
                <button
                  aria-label="Zoom out"
                  onClick={() => setZoom((z) => Math.max(0.8, z - 0.1))}
                >
                  <ZoomOut />
                </button>
                <button aria-label="Fit graph" onClick={() => setZoom(1)}>
                  <Maximize2 />
                </button>
              </div>
            </div>
          </article>
        </div>
        <div className="jd-data">
          <article>
            <h3>VALUE TABLE (Auto-synced)</h3>
            <table>
              <thead>
                <tr>
                  <th>x</th>
                  <th>Left</th>
                  <th>Right</th>
                  <th>f(x)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((x) => {
                  const lv = scenario === "infinite" ? -1 / x : x + 1,
                    rv =
                      scenario === "jump"
                        ? x + 3
                        : scenario === "removable"
                          ? x + 1
                          : 1 / x;
                  return (
                    <tr key={x}>
                      <td>{x}</td>
                      <td>{x < 0 ? fmt(lv) : "—"}</td>
                      <td>
                        {x >= 0
                          ? x === 0 && scenario === "infinite"
                            ? "undefined"
                            : fmt(rv)
                          : "—"}
                      </td>
                      <td>{x === 0 ? fmt(defined) : fmt(x < 0 ? lv : rv)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </article>
          <article>
            <h3>LIMIT COMPARISON AT x→0</h3>
            <div>
              <b>Left-hand limit</b>
              <strong>{fmt(limits.left)}</strong>
            </div>
            <div>
              <b>Right-hand limit</b>
              <strong>{fmt(limits.right)}</strong>
            </div>
            <p>
              Are LHL and RHL equal?{" "}
              <b className={equal ? "yes" : "no"}>{equal ? "✓ Yes" : "✕ No"}</b>
            </p>
            <p>
              Jump size <strong>{fmt(jumpSize)}</strong>
            </p>
          </article>
          <article>
            <h3>AT x=0 (Function value)</h3>
            <p>f(0)={fmt(defined)}</p>
            <label>
              <input
                type="checkbox"
                checked={editing}
                onChange={(e) => setEditing(e.target.checked)}
              />{" "}
              Change f(0) and test
            </label>
            <div>
              <input
                aria-label="Draft f(0)"
                type="number"
                disabled={!editing}
                value={draft}
                onChange={(e) => setDraft(Number(e.target.value))}
              />
              <button disabled={!editing} onClick={() => setDefined(draft)}>
                Apply
              </button>
            </div>
            <aside>Changing f(0) does not change the one-sided limits.</aside>
          </article>
        </div>
      </section>
      <section className="jd-why">
        <article>
          <h3>WHY THIS IS A {classification.toUpperCase()}</h3>
          <p>
            At x=0, the left-hand limit is {fmt(limits.left)} and the right-hand
            limit is {fmt(limits.right)}.
          </p>
          <p>
            {scenario === "jump"
              ? "They are finite but unequal; their difference is a jump."
              : scenario === "removable"
                ? "The limits agree, but the point value can leave a removable hole."
                : "At least one one-sided limit is unbounded."}
          </p>
          <b>Therefore: {classification}.</b>
        </article>
        <article>
          <h3>COMMON MISCONCEPTION</h3>
          <b>“If I change f(0), I can remove the jump.”</b>
          <p>
            False. Changing f(0) only affects the point at x=0, not the nearby
            one-sided limits.
          </p>
        </article>
      </section>
      <section className="jd-notes">
        <article>
          <h3>CLASSIFICATION CHECKLIST</h3>
          {[
            [true, "LHL exists"],
            [true, "RHL exists"],
            [equal, "LHL = RHL"],
            [jumpSize > 0, "Jump size > 0"],
          ].map((r, i) => (
            <p className={r[0] ? "yes" : "no"} key={i}>
              {r[0] ? "☑" : "☒"} &nbsp; {r[1]}
            </p>
          ))}
          <strong>Result: {classification}</strong>
        </article>
        <article>
          <h3>WORKED EXAMPLE</h3>
          <p>1. Compute the left-hand limit: {fmt(limits.left)}.</p>
          <p>2. Compute the right-hand limit: {fmt(limits.right)}.</p>
          <p>3. Compare the two values.</p>
          <p>4. Jump size = {fmt(jumpSize)}.</p>
        </article>
        <article>
          <h3>KEY TAKEAWAYS</h3>
          <ul>
            <li>Both one-sided limits may exist.</li>
            <li>A jump requires finite unequal limits.</li>
            <li>Changing f(0) cannot change nearby limits.</li>
          </ul>
        </article>
      </section>
      <section className="jd-practice">
        <article>
          <h3>PRACTICE TASKS</h3>
          <p>
            1. Find LHL, RHL, and jump size for g(x)=2x−1 (x&lt;0), x+4 (x≥0).
          </p>
          <p>2. Is x²+1 / x+1 a jump at x=1? Justify.</p>
          <p>3. Construct a piecewise function with jump size 5.</p>
          <button onClick={() => setHints((v) => !v)}>
            <Eye /> {hints ? "Hide hints" : "Show hints"}
          </button>
          {hints && <b>LHL=-1, RHL=4, jump size=5.</b>}
        </article>
        <article>
          <h3>EXPLORATION PROMPT</h3>
          <p>Increase the gap between the rules. What happens to jump size?</p>
          <p>Make the rules meet at x=0. What type of discontinuity remains?</p>
          <p>What if one side goes to infinity?</p>
        </article>
      </section>
      <section className="jd-toggle">
        <h3>SCENARIO TOGGLE</h3>
        {(["jump", "removable", "infinite"] as Scenario[]).map((s) => (
          <button
            className={scenario === s ? "active" : ""}
            onClick={() => choose(s)}
            key={s}
          >
            {scenario === s ? <Check /> : null}
            {s[0].toUpperCase() + s.slice(1)}
            <small>
              {s === "jump"
                ? "Different finite one-sided limits"
                : s === "removable"
                  ? "Equal limits, value undefined or different"
                  : "At least one one-sided limit is infinite"}
            </small>
          </button>
        ))}
      </section>
      <nav className="jd-adjacent">
        <button>← Removable Discontinuity</button>
        <button>Infinite Discontinuity →</button>
      </nav>
    </main>
  );
}
