import { Check, Maximize2, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { useMemo, useState } from "react";
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./ContinuityIntervalTargetLesson10167.css";

const value = (x: number) => Math.sqrt(Math.max(0, 4 - x * x));
const f2 = (n: number) => n.toFixed(2);

export default function ContinuityIntervalTargetLesson10167({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [a, setA] = useState(-2),
    [b, setB] = useState(2);
  const [grid, setGrid] = useState(true),
    [zoom, setZoom] = useState(1);
  const [mode, setMode] = useState<"interval" | "break">("interval");
  const [hasBreak, setHasBreak] = useState(false),
    [breakX, setBreakX] = useState(0);
  const [checked, setChecked] = useState(false);
  const interior = !hasBreak || breakX <= a || breakX >= b;
  const continuous = interior;
  const curve = useMemo(
    () =>
      Array.from({ length: 101 }, (_, i) => {
        const x = -2 + i * 0.04;
        return `${40 + (x + 2) * 90},${280 - value(x) * 90}`;
      }).join(" "),
    [],
  );
  const fill = useMemo(() => {
    const pts = Array.from({ length: 81 }, (_, i) => {
      const x = a + ((b - a) * i) / 80;
      return `${40 + (x + 2) * 90},${280 - value(x) * 90}`;
    });
    return `${40 + (a + 2) * 90},280 ${pts.join(" ")} ${40 + (b + 2) * 90},280`;
  }, [a, b]);
  const setEndpoint = (side: "a" | "b", n: number) => {
    if (side === "a") setA(Math.max(-2, Math.min(b - 0.1, n)));
    else setB(Math.min(2, Math.max(a + 0.1, n)));
    setChecked(false);
  };
  const keyEndpoint =
    (side: "a" | "b") => (e: KeyboardEvent<SVGCircleElement>) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowDown")
        setEndpoint(side, (side === "a" ? a : b) - 0.1);
      if (e.key === "ArrowRight" || e.key === "ArrowUp")
        setEndpoint(side, (side === "a" ? a : b) + 0.1);
    };
  const dragEndpoint =
    (side: "a" | "b") => (e: ReactPointerEvent<SVGCircleElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      const svg = e.currentTarget.ownerSVGElement!;
      const move = (event: PointerEvent) =>
        setEndpoint(
          side,
          ((event.clientX - svg.getBoundingClientRect().left) /
            svg.getBoundingClientRect().width) *
            6 -
            2.45,
        );
      const stop = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", stop);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", stop);
    };
  const reset = () => {
    setA(-2);
    setB(2);
    setGrid(true);
    setZoom(1);
    setMode("interval");
    setHasBreak(false);
    setBreakX(0);
    setChecked(false);
  };
  return (
    <main
      className="ci10167-page"
      data-testid="school-mockup-0841"
      data-object-model="dedicated-closed-interval-continuity-engine"
      data-interval={`[${f2(a)}, ${f2(b)}]`}
      data-interior={String(interior)}
      data-continuous={String(continuous)}
    >
      <header>
        <small>CLASS 12 · FORMAL CALCULUS</small>
        <h1>Continuity on an Interval</h1>
        <p>
          Study <b>f(x) = √(4 − x²)</b> on the closed interval [{f2(a)}, {f2(b)}
          ].
        </p>
        <div>
          <span>18 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>graph</span>
          <span>limits</span>
          <span>continuity</span>
        </div>
      </header>
      <section className="ci-graph">
        <div className="ci-title">
          <h3>⌘ &nbsp; INTERACTIVE GRAPH &amp; INTERVAL</h3>
          <div>
            <button aria-label="Reset interval" onClick={reset}>
              <RotateCcw /> Reset
            </button>
            <label>
              Show grid{" "}
              <input
                type="checkbox"
                checked={grid}
                onChange={(e) => setGrid(e.target.checked)}
              />
            </label>
          </div>
        </div>
        <div className="ci-graph-grid">
          <aside>
            <h2>f(x) = √(4 − x²)</h2>
            <p>Upper semicircle of radius 2</p>
            <b>━ &nbsp; f(x) = √(4 − x²)</b>
            <b>● &nbsp; Closed endpoints</b>
            <b>▰ &nbsp; Current interval</b>
            <section>
              <h3>Drag endpoints to change interval</h3>
              <label>
                a (left)<output>{f2(a)}</output>
                <input
                  aria-label="Left endpoint"
                  type="range"
                  min="-2"
                  max={b - 0.1}
                  step=".05"
                  value={a}
                  onInput={(e) =>
                    setEndpoint("a", Number(e.currentTarget.value))
                  }
                />
              </label>
              <label>
                b (right)<output>{f2(b)}</output>
                <input
                  aria-label="Right endpoint"
                  type="range"
                  min={a + 0.1}
                  max="2"
                  step=".05"
                  value={b}
                  onInput={(e) =>
                    setEndpoint("b", Number(e.currentTarget.value))
                  }
                />
              </label>
            </section>
          </aside>
          <article>
            <svg
              viewBox="0 0 540 360"
              aria-label="Interval continuity graph"
              style={{ transform: `scale(${zoom})` }}
            >
              {grid && (
                <defs>
                  <pattern
                    id="cigrid"
                    width="45"
                    height="45"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M45 0H0V45"
                      fill="none"
                      stroke="#dbe5e9"
                      strokeDasharray="4"
                    />
                  </pattern>
                </defs>
              )}
              {grid && <rect width="540" height="360" fill="url(#cigrid)" />}
              <path d="M20 280H520M220 20V340" stroke="#1f2937" />
              <polygon points={fill} fill="#dcecf6" />
              <polyline
                points={curve}
                fill="none"
                stroke="#069fbd"
                strokeWidth="3"
              />
              {hasBreak && breakX > a && breakX < b && (
                <circle
                  cx={40 + (breakX + 2) * 90}
                  cy={280 - value(breakX) * 90}
                  r="7"
                  fill="white"
                  stroke="#e34444"
                  strokeWidth="3"
                />
              )}
              <circle
                role="slider"
                aria-label="Left graph endpoint"
                tabIndex={0}
                onPointerDown={dragEndpoint("a")}
                onKeyDown={keyEndpoint("a")}
                cx={40 + (a + 2) * 90}
                cy={280 - value(a) * 90}
                r="7"
                fill="#1572dc"
              />
              <circle
                role="slider"
                aria-label="Right graph endpoint"
                tabIndex={0}
                onPointerDown={dragEndpoint("b")}
                onKeyDown={keyEndpoint("b")}
                cx={40 + (b + 2) * 90}
                cy={280 - value(b) * 90}
                r="7"
                fill="#1572dc"
              />
              <text x={25 + (a + 2) * 90} y={300 - value(a) * 90}>
                ({f2(a)}, {f2(value(a))})
              </text>
              <text x={385 + (b - 2) * 90} y={300 - value(b) * 90}>
                ({f2(b)}, {f2(value(b))})
              </text>
            </svg>
            <div className="ci-current">
              Current interval: [{f2(a)}, {f2(b)}]
            </div>
            <div className="ci-tools">
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
          </article>
        </div>
      </section>
      <section className="ci-checks">
        <article>
          <h3>CONTINUITY CHECKLIST (CLOSED INTERVAL)</h3>
          {[
            [
              interior,
              "Continuous at every interior point",
              `f is continuous for all x in (${f2(a)}, ${f2(b)}).`,
            ],
            [
              true,
              "Right-continuous at the left endpoint a",
              `lim x→a⁺ f(x) = f(a) = ${f2(value(a))}`,
            ],
            [
              true,
              "Left-continuous at the right endpoint b",
              `lim x→b⁻ f(x) = f(b) = ${f2(value(b))}`,
            ],
          ].map((r, i) => (
            <div className={r[0] ? "yes" : "no"} key={String(r[1])}>
              <strong>{r[0] ? "✓" : "✕"}</strong>
              <b>
                {i + 1} &nbsp; {r[1]}
              </b>
              <small>{r[2]}</small>
            </div>
          ))}
        </article>
        <article>
          <h3>ENDPOINT PROBES</h3>
          <div>
            <section>
              <b>● Left endpoint a = {f2(a)}</b>
              <h2>f(a) = {f2(value(a))}</h2>
              <p>lim x→a⁺ f(x) = {f2(value(a))}</p>
              <strong>Matches f(a) ✓</strong>
            </section>
            <section>
              <b>● Right endpoint b = {f2(b)}</b>
              <h2>f(b) = {f2(value(b))}</h2>
              <p>lim x→b⁻ f(x) = {f2(value(b))}</p>
              <strong>Matches f(b) ✓</strong>
            </section>
          </div>
        </article>
      </section>
      <section className="ci-summary">
        <article>
          <h3>DOMAIN &amp; RANGE</h3>
          <p>
            <b>Domain:</b> [-2, 2]
          </p>
          <p>
            <b>Range:</b> [0, 2]
          </p>
        </article>
        <article>
          <h3>CONTINUITY CONCLUSION</h3>
          <p>
            f(x)=√(4−x²) is {continuous ? "" : "not "}continuous on [{f2(a)},{" "}
            {f2(b)}].
          </p>
          <strong className={continuous ? "yes" : "no"}>
            {continuous ? "CONTINUOUS ✓" : "NOT CONTINUOUS ✕"}
          </strong>
        </article>
        <article>
          <h3>KEY FACT</h3>
          <p>
            The function is continuous on its entire domain [-2,2]. The graph is
            a smooth semicircle with no breaks, jumps, or holes.
          </p>
        </article>
      </section>
      <section className="ci-explain">
        <article>
          <h3>WORKED EXAMPLE</h3>
          <p>Prove f(x)=√(4−x²) is continuous on [-2,2].</p>
          <p>1. Interior points are compositions of continuous functions.</p>
          <p>2. The right-hand limit at -2 equals f(-2)=0.</p>
          <p>3. The left-hand limit at 2 equals f(2)=0.</p>
          <b>Therefore all closed-interval conditions hold.</b>
        </article>
        <article>
          <h3>COMMON MISCONCEPTION</h3>
          <p>“Because the denominator is never zero, it must be continuous.”</p>
          <p>
            Continuity requires limits to match function values at every
            relevant point. Endpoints require one-sided limits.
          </p>
          <strong>Always verify endpoint continuity.</strong>
        </article>
      </section>
      <section className="ci-practice">
        <article>
          <h3>PRACTICE: VERIFY CONTINUITY</h3>
          <table>
            <thead>
              <tr>
                <th>Interval</th>
                <th>Interior</th>
                <th>Left end</th>
                <th>Right end</th>
                <th>Continuous</th>
              </tr>
            </thead>
            <tbody>
              {["[-2,2]", "[-1,2]", "[-2,1]", "(-2,2)"].map((x) => (
                <tr key={x}>
                  <td>{x}</td>
                  {[0, 1, 2, 3].map((i) => (
                    <td key={i}>
                      {checked ? (i > 0 && x === "(-2,2)" ? "N/A" : "✓") : "?"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => setChecked(true)}>
            <Check /> Check answers
          </button>
        </article>
        <article>
          <h3>TRY IT YOURSELF</h3>
          <div className="ci-tabs">
            <button
              className={mode === "interval" ? "active" : ""}
              onClick={() => setMode("interval")}
            >
              Adjust Interval
            </button>
            <button
              className={mode === "break" ? "active" : ""}
              onClick={() => setMode("break")}
            >
              Add a Break
            </button>
          </div>
          {mode === "interval" ? (
            <>
              <label>
                Interval:{" "}
                <input
                  aria-label="Try left endpoint"
                  type="range"
                  min="-2"
                  max={b - 0.1}
                  step=".1"
                  value={a}
                  onInput={(e) =>
                    setEndpoint("a", Number(e.currentTarget.value))
                  }
                />
                <input
                  aria-label="Try right endpoint"
                  type="range"
                  min={a + 0.1}
                  max="2"
                  step=".1"
                  value={b}
                  onInput={(e) =>
                    setEndpoint("b", Number(e.currentTarget.value))
                  }
                />
              </label>
            </>
          ) : (
            <>
              <label>
                Break at x = {f2(breakX)}
                <input
                  aria-label="Break position"
                  type="range"
                  min="-1.9"
                  max="1.9"
                  step=".1"
                  value={breakX}
                  onInput={(e) => setBreakX(Number(e.currentTarget.value))}
                />
              </label>
              <button onClick={() => setHasBreak((v) => !v)}>
                {hasBreak ? "Remove break" : "Insert break"}
              </button>
            </>
          )}
          <div className={continuous ? "yes" : "no"}>
            {continuous ? "CONTINUOUS ✓" : "NOT CONTINUOUS ✕"}
          </div>
          <button onClick={reset}>
            <RotateCcw /> Reset to [-2,2]
          </button>
        </article>
      </section>
      <nav className="ci-adjacent">
        <button>← Previous: Limits and Continuity Basics</button>
        <button>Next: Removable Discontinuity →</button>
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
