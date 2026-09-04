import { RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./AbsoluteExtremaTargetLesson10178.css";
const f = (x: number) => x * x * x - 3 * x + 1,
  fmt = (x: number) => Number(x.toFixed(2));
type Candidate = { x: number; kind: string; value: number };
function candidates(a: number, b: number, closed: boolean) {
  const list: Candidate[] = [];
  if (closed) {
    list.push(
      { x: a, kind: "Left endpoint", value: f(a) },
      { x: b, kind: "Right endpoint", value: f(b) },
    );
  }
  for (const x of [-1, 1])
    if (x > a && x < b)
      list.push({ x, kind: "Critical point f'(x)=0", value: f(x) });
  return list.sort((p, q) => p.x - q.x);
}
export default function AbsoluteExtremaTargetLesson10178({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [a, setA] = useState(-2),
    [b, setB] = useState(2),
    [closed, setClosed] = useState(true),
    [pa, setPa] = useState(-1.5),
    [pb, setPb] = useState(3.5),
    [maxAnswer, setMaxAnswer] = useState(""),
    [minAnswer, setMinAnswer] = useState(""),
    [feedback, setFeedback] = useState(""),
    [solution, setSolution] = useState(false);
  const list = candidates(a, b, closed),
    max = list.length ? Math.max(...list.map((c) => c.value)) : NaN,
    min = list.length ? Math.min(...list.map((c) => c.value)) : NaN,
    maxXs = list.filter((c) => c.value === max).map((c) => c.x),
    minXs = list.filter((c) => c.value === min).map((c) => c.x);
  const practice = candidates(pa, pb, true),
    pMax = Math.max(...practice.map((c) => c.value)),
    pMin = Math.min(...practice.map((c) => c.value));
  const curve = useMemo(
    () =>
      Array.from({ length: 161 }, (_, i) => {
        const x = -4 + i * 0.05;
        return `${260 + x * 55},${230 - f(x) * 13}`;
      }).join(" "),
    [],
  );
  const px = (x: number) => 260 + x * 55,
    py = (x: number) => 230 - f(x) * 13;
  const setEnd = (side: "a" | "b", n: number) =>
    side === "a"
      ? setA(Math.max(-4, Math.min(b - 0.1, n)))
      : setB(Math.min(4, Math.max(a + 0.1, n)));
  const key = (side: "a" | "b") => (e: KeyboardEvent<SVGCircleElement>) => {
    const n = side === "a" ? a : b;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") setEnd(side, n - 0.1);
    if (e.key === "ArrowRight" || e.key === "ArrowUp") setEnd(side, n + 0.1);
  };
  const drag =
    (side: "a" | "b") => (e: ReactPointerEvent<SVGCircleElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      const svg = e.currentTarget.ownerSVGElement!;
      const move = (p: PointerEvent) => {
        const r = svg.getBoundingClientRect();
        setEnd(side, ((p.clientX - r.left) / r.width) * 9 - 4.5);
      };
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
    setClosed(true);
  };
  const same = (raw: string, n: number) => Math.abs(Number(raw) - n) < 0.005;
  return (
    <main
      className="ae10178-page"
      data-testid="school-mockup-0852"
      data-object-model="dedicated-closed-interval-candidate-engine"
      data-interval={`[${fmt(a)}, ${fmt(b)}]`}
      data-interval-type={closed ? "closed" : "open"}
      data-absolute-maximum={Number.isFinite(max) ? fmt(max) : "none"}
      data-absolute-minimum={Number.isFinite(min) ? fmt(min) : "none"}
    >
      <header>
        <small>CLASS 12 · FORMAL CALCULUS</small>
        <h1>Absolute Maxima and Minima</h1>
        <p>
          Compare endpoints and critical points to find global extrema on a
          closed interval.
        </p>
        <div>
          <span>18 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>graph</span>
          <span>optimization</span>
        </div>
      </header>
      <nav className="ae-tabs">
        {["INTERACT", "LEARN", "WORKED EXAMPLE", "PRACTICE"].map((v, i) => (
          <label key={v}>
            <input type="radio" name="ae-tab" defaultChecked={i === 0} />
            {v}
          </label>
        ))}
      </nav>
      <section className="ae-main">
        <article>
          <div className="ae-title">
            <div>
              <h3>INTERACTIVE EXPLORER</h3>
              <p>
                Explore f(x)=x³−3x+1 on {closed ? "a closed" : "an open"}{" "}
                interval.
              </p>
            </div>
            <div>
              <span>Interval type</span>
              <button
                className={closed ? "active" : ""}
                onClick={() => setClosed(true)}
              >
                Closed
              </button>
              <button
                className={!closed ? "active" : ""}
                onClick={() => setClosed(false)}
              >
                Open
              </button>
            </div>
          </div>
          <svg viewBox="0 0 520 440" aria-label="Absolute extrema cubic graph">
            <defs>
              <pattern
                id="aegrid"
                width="55"
                height="48"
                patternUnits="userSpaceOnUse"
              >
                <path d="M55 0H0V48" fill="none" stroke="#dce6eb" />
              </pattern>
            </defs>
            <rect width="520" height="440" fill="url(#aegrid)" />
            <path d="M15 230H505M260 15V425" stroke="#273548" />
            <polyline
              points={curve}
              fill="none"
              stroke="#1477ed"
              strokeWidth="3"
            />
            <path
              d={`M${px(a)} ${py(a)}V410H${px(b)}V${py(b)}`}
              fill="#dff1ff"
              opacity=".55"
            />
            {list.map((c) => (
              <g key={c.kind + c.x}>
                <line
                  x1={px(c.x)}
                  y1={py(c.x)}
                  x2={px(c.x)}
                  y2="410"
                  stroke={c.kind.includes("endpoint") ? "#1677ed" : "#16964f"}
                  strokeDasharray="6"
                />
                <circle
                  cx={px(c.x)}
                  cy={py(c.x)}
                  r="7"
                  fill={c.value === max ? "#16964f" : "#1677ed"}
                />
                <text x={px(c.x) - 25} y={py(c.x) - 12}>
                  ({fmt(c.x)}, {fmt(c.value)})
                </text>
              </g>
            ))}
            <circle
              role="slider"
              aria-label="Graph left endpoint"
              tabIndex={0}
              onPointerDown={drag("a")}
              onKeyDown={key("a")}
              cx={px(a)}
              cy={py(a)}
              r="8"
              fill={closed ? "#1677ed" : "#fff"}
              stroke="#1677ed"
              strokeWidth="3"
            />
            <circle
              role="slider"
              aria-label="Graph right endpoint"
              tabIndex={0}
              onPointerDown={drag("b")}
              onKeyDown={key("b")}
              cx={px(b)}
              cy={py(b)}
              r="8"
              fill={closed ? "#1677ed" : "#fff"}
              stroke="#1677ed"
              strokeWidth="3"
            />
          </svg>
          <p className="ae-drag">
            Drag the endpoints or use sliders to change the interval.
          </p>
          <div className="ae-sliders">
            <label>
              Left endpoint a <b>{fmt(a)}</b>
              <input
                aria-label="Left endpoint a"
                type="range"
                min="-4"
                max={b - 0.1}
                step=".1"
                value={a}
                onInput={(e) => setEnd("a", Number(e.currentTarget.value))}
              />
            </label>
            <i>a&lt;b</i>
            <label>
              Right endpoint b <b>{fmt(b)}</b>
              <input
                aria-label="Right endpoint b"
                type="range"
                min={a + 0.1}
                max="4"
                step=".1"
                value={b}
                onInput={(e) => setEnd("b", Number(e.currentTarget.value))}
              />
            </label>
            <button onClick={reset}>
              <RotateCcw /> Reset
            </button>
          </div>
          <section className="ae-table">
            <h3>CANDIDATE COMPARISON ON {closed ? "[a,b]" : "(a,b)"}</h3>
            {list.length ? (
              <>
                <table>
                  <thead>
                    <tr>
                      <th>Candidate x</th>
                      <th>Why a candidate?</th>
                      <th>f(x)</th>
                      <th>Classification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((c) => (
                      <tr key={c.kind + c.x}>
                        <td>x={fmt(c.x)}</td>
                        <td>{c.kind}</td>
                        <td>{fmt(c.value)}</td>
                        <td>
                          {c.value === max
                            ? "ABSOLUTE MAXIMUM"
                            : c.value === min
                              ? "ABSOLUTE MINIMUM"
                              : "Neither"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div>
                  <b>
                    Greatest value={fmt(max)} at x={maxXs.map(fmt).join(", ")}
                  </b>
                  <b>
                    Least value={fmt(min)} at x={minXs.map(fmt).join(", ")}
                  </b>
                </div>
              </>
            ) : (
              <p>No included candidate attains an extremum on this interval.</p>
            )}
          </section>
        </article>
        <aside>
          <section>
            <h3>EXTREME VALUE THEOREM</h3>
            <p>
              If f is continuous on a closed interval [a,b], then f attains an
              absolute maximum and minimum.
            </p>
          </section>
          <section>
            <h3>CLOSED-INTERVAL METHOD</h3>
            <ol>
              <li>Find critical points inside (a,b).</li>
              <li>Evaluate f at critical points and included endpoints.</li>
              <li>Compare all candidate values.</li>
            </ol>
          </section>
          <section className="warn">
            <h3>IMPORTANT WARNING</h3>
            <p>
              Do not assume local extrema are absolute. Always check endpoints.
            </p>
          </section>
          <section>
            <h3>WORKED EXAMPLE</h3>
            <p>On [−2,2], candidates are −2,−1,1,2.</p>
            <table>
              <tbody>
                {[-2, -1, 1, 2].map((x) => (
                  <tr key={x}>
                    <td>{x}</td>
                    <td>{f(x)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <b>
              Absolute maximum=3 at x=−1,2.
              <br />
              Absolute minimum=−1 at x=−2,1.
            </b>
          </section>
        </aside>
      </section>
      <section className="ae-types">
        <article>
          <h3>HOW INTERVAL TYPE AFFECTS EXTREMA</h3>
          <p>
            Closed intervals include endpoints and invoke the Extreme Value
            Theorem. Open intervals exclude endpoints; extrema may or may not
            still be attained at interior critical points.
          </p>
        </article>
        <article>
          <b>Closed interval</b>
          <p>Endpoints included; extrema guaranteed for continuous f.</p>
        </article>
        <article>
          <b>Open interval</b>
          <p>
            Endpoints excluded; inspect interior critical points and limiting
            behavior.
          </p>
        </article>
      </section>
      <section className="ae-practice">
        <h3>PRACTICE CHALLENGE</h3>
        <p>Find absolute extrema of f(x)=x³−3x+1 on a new closed interval.</p>
        <div>
          <article>
            <label>
              Set a
              <input
                aria-label="Practice interval start"
                type="range"
                min="-4"
                max={pb - 0.1}
                step=".1"
                value={pa}
                onInput={(e) => setPa(Number(e.currentTarget.value))}
              />
              <b>{fmt(pa)}</b>
            </label>
            <label>
              Set b
              <input
                aria-label="Practice interval end"
                type="range"
                min={pa + 0.1}
                max="4"
                step=".1"
                value={pb}
                onInput={(e) => setPb(Number(e.currentTarget.value))}
              />
              <b>{fmt(pb)}</b>
            </label>
            <button
              onClick={() =>
                setFeedback(
                  same(maxAnswer, pMax) && same(minAnswer, pMin)
                    ? "Correct: both extrema match the candidate comparison."
                    : "Recheck endpoints and critical points.",
                )
              }
            >
              Check Answer
            </button>
            <button onClick={() => setSolution((v) => !v)}>
              {solution ? "Hide" : "Show"} Solution
            </button>
          </article>
          <article>
            <label>
              Absolute maximum
              <input
                aria-label="Absolute maximum answer"
                type="number"
                value={maxAnswer}
                onChange={(e) => setMaxAnswer(e.target.value)}
              />
            </label>
            <label>
              Absolute minimum
              <input
                aria-label="Absolute minimum answer"
                type="number"
                value={minAnswer}
                onChange={(e) => setMinAnswer(e.target.value)}
              />
            </label>
            {feedback && <output>{feedback}</output>}
            {solution && (
              <output>
                Maximum={fmt(pMax)}; minimum={fmt(pMin)}.
              </output>
            )}
          </article>
          <article>
            <h4>Think about</h4>
            <p>
              What happens if the interval excludes a critical point? Can an
              endpoint be absolute?
            </p>
          </article>
        </div>
      </section>
      <nav className="ae-adjacent">
        <button>← Local Maxima and Minima</button>
        <button>Approximation Using Differentials →</button>
      </nav>
    </main>
  );
}
