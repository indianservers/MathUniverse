import {
  Home,
  Lightbulb,
  Pause,
  Play,
  RotateCcw,
  SkipForward,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./RateOfChangeTargetLesson10174.css";

const position = (t: number) => t * t + 2 * t;
const velocity = (t: number) => 2 * t + 2;
const fmt = (value: number) => Number(value.toFixed(2));

export default function RateOfChangeTargetLesson10174({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [a, setA] = useState(1);
  const [b, setB] = useState(3);
  const [time, setTime] = useState(2);
  const [units, setUnits] = useState("meters (m)");
  const [secant, setSecant] = useState(true);
  const [tangent, setTangent] = useState(true);
  const [grid, setGrid] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [loop, setLoop] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [solutions, setSolutions] = useState(false);
  const [challengeX, setChallengeX] = useState(2);
  const [hint, setHint] = useState(false);

  const average = (position(b) - position(a)) / (b - a);
  const instant = velocity(time);
  const challengeAverage = challengeX + 2;
  const challengeMatch = Math.abs(challengeAverage - velocity(2)) < 1e-8;
  const curve = useMemo(
    () =>
      Array.from({ length: 121 }, (_, index) => {
        const t = index / 20;
        return `${55 + t * 72},${315 - position(t) * 10.5}`;
      }).join(" "),
    [],
  );
  const px = (t: number) => 55 + t * 72;
  const py = (t: number) => 315 - position(t) * 10.5;
  const unit = units.startsWith("meters") ? "m/s" : "ft/s";
  const scale = units.startsWith("meters") ? 1 : 3.28084;

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setTime((current) => {
        const next = fmt(current + 0.1 * speed);
        if (next <= 4) return next;
        if (loop) return 0;
        setPlaying(false);
        return 4;
      });
    }, 180);
    return () => window.clearInterval(timer);
  }, [loop, playing, speed]);

  const setPoint = (kind: "a" | "b" | "time", value: number) => {
    if (kind === "a") setA(Math.max(0, Math.min(b - 0.1, value)));
    else if (kind === "b") setB(Math.min(5, Math.max(a + 0.1, value)));
    else setTime(Math.max(0, Math.min(5, value)));
  };
  const keyPoint =
    (kind: "a" | "b" | "time") => (event: KeyboardEvent<SVGCircleElement>) => {
      const value = kind === "a" ? a : kind === "b" ? b : time;
      if (event.key === "ArrowLeft" || event.key === "ArrowDown")
        setPoint(kind, value - 0.1);
      if (event.key === "ArrowRight" || event.key === "ArrowUp")
        setPoint(kind, value + 0.1);
    };
  const dragPoint =
    (kind: "a" | "b" | "time") =>
    (event: ReactPointerEvent<SVGCircleElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      const svg = event.currentTarget.ownerSVGElement!;
      const move = (pointer: PointerEvent) => {
        const box = svg.getBoundingClientRect();
        setPoint(kind, ((pointer.clientX - box.left) / box.width) * 7 - 0.75);
      };
      const stop = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", stop);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", stop);
    };

  return (
    <main
      className="roc10174-page"
      data-testid="school-mockup-0848"
      data-object-model="dedicated-position-rate-motion-engine"
      data-interval={`[${fmt(a)}, ${fmt(b)}]`}
      data-time={fmt(time)}
      data-average-rate={fmt(average)}
      data-instantaneous-rate={fmt(instant)}
      data-rates-match={String(Math.abs(average - instant) < 1e-8)}
    >
      <header>
        <small>CLASS 12 · FORMAL CALCULUS</small>
        <h1>Rate of Change</h1>
        <p>
          <b>Position function:</b> s(t)=t²+2t
        </p>
        <p>
          Explore average rate of change between two times and instantaneous
          rate of change at a given time.
        </p>
        <div>
          <span>18 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>graph</span>
          <span>applications</span>
        </div>
      </header>

      <section className="roc-top">
        <article>
          <h3>POSITION GRAPH</h3>
          <div className="roc-tools">
            <button
              aria-label="Zoom in graph"
              onClick={() => setZoom((v) => Math.min(1.4, v + 0.1))}
            >
              <ZoomIn />
            </button>
            <button
              aria-label="Zoom out graph"
              onClick={() => setZoom((v) => Math.max(0.7, v - 0.1))}
            >
              <ZoomOut />
            </button>
            <button aria-label="Fit graph" onClick={() => setZoom(1)}>
              <Home />
            </button>
          </div>
          <svg
            viewBox="0 0 520 370"
            aria-label="Position graph"
            style={{ transform: `scale(${zoom})` }}
          >
            {grid && (
              <defs>
                <pattern
                  id="rocgrid"
                  width="48"
                  height="42"
                  patternUnits="userSpaceOnUse"
                >
                  <path d="M48 0H0V42" fill="none" stroke="#dce6eb" />
                </pattern>
              </defs>
            )}
            <rect
              width="520"
              height="370"
              fill={grid ? "url(#rocgrid)" : "#fff"}
            />
            <path d="M20 315H500M55 15V350" stroke="#263548" />
            <polyline
              points={curve}
              fill="none"
              stroke="#1671f4"
              strokeWidth="3"
            />
            {secant && (
              <line
                x1={px(a)}
                y1={py(a)}
                x2={px(b)}
                y2={py(b)}
                stroke="#1671f4"
                strokeWidth="2.5"
              />
            )}
            {tangent && (
              <line
                x1={px(time) - 70}
                y1={py(time) + 70 * instant * 0.145}
                x2={px(time) + 70}
                y2={py(time) - 70 * instant * 0.145}
                stroke="#159447"
                strokeWidth="3"
              />
            )}
            {(["a", "b", "time"] as const).map((kind) => {
              const value = kind === "a" ? a : kind === "b" ? b : time;
              return (
                <circle
                  key={kind}
                  role="slider"
                  aria-label={`Graph ${kind} point`}
                  tabIndex={0}
                  onPointerDown={dragPoint(kind)}
                  onKeyDown={keyPoint(kind)}
                  cx={px(value)}
                  cy={py(value)}
                  r="7"
                  fill={kind === "time" ? "#159447" : "#1766e9"}
                />
              );
            })}
            <text x={px(a) - 35} y={py(a) - 12}>
              ({fmt(a)}, {fmt(position(a))})
            </text>
            <text x={px(time) + 9} y={py(time) + 4}>
              ({fmt(time)}, {fmt(position(time))})
            </text>
            <text x={px(b) + 9} y={py(b) - 10}>
              ({fmt(b)}, {fmt(position(b))})
            </text>
            <text x="360" y="55" fill="#1766e9">
              s(t)=t²+2t
            </text>
          </svg>
          <b className="roc-drag">
            Drag the blue time points or the green point to explore.
          </b>
        </article>
        <aside>
          <div className="roc-aside-head">
            <h3>RATES AND CALCULATIONS</h3>
            <select
              aria-label="Distance units"
              value={units}
              onChange={(e) => setUnits(e.target.value)}
            >
              <option>meters (m)</option>
              <option>feet (ft)</option>
            </select>
          </div>
          <section>
            <h4>
              Average rate of change from t={fmt(a)} to t={fmt(b)}
            </h4>
            <strong>
              (s({fmt(b)})−s({fmt(a)}))/({fmt(b)}−{fmt(a)}) ={" "}
              {fmt(average * scale)} {unit}
            </strong>
            <p>
              Where s({fmt(a)})={fmt(position(a) * scale)} and s({fmt(b)})=
              {fmt(position(b) * scale)}
            </p>
          </section>
          <section>
            <h4>Instantaneous rate at t={fmt(time)}</h4>
            <strong>v(t)=s'(t)=2t+2</strong>
            <b>
              v({fmt(time)})={fmt(instant * scale)} {unit}
            </b>
          </section>
          <section className="roc-overlays">
            <h4>Graph Overlays</h4>
            <label>
              <input
                type="checkbox"
                checked={secant}
                onChange={(e) => setSecant(e.target.checked)}
              />{" "}
              Show secant
            </label>
            <label>
              <input
                type="checkbox"
                checked={tangent}
                onChange={(e) => setTangent(e.target.checked)}
              />{" "}
              Show tangent
            </label>
            <label>
              <input
                type="checkbox"
                checked={grid}
                onChange={(e) => setGrid(e.target.checked)}
              />{" "}
              Show grid
            </label>
          </section>
        </aside>
      </section>

      <section className="roc-motion">
        <h3>SYNCHRONIZED MOTION STRIP (POSITION ON A LINE)</h3>
        <div className="roc-line">
          <i style={{ left: `${10 + a * 12}%` }} />
          <i style={{ left: `${10 + time * 12}%` }} />
          <i style={{ left: `${10 + b * 12}%` }} />
        </div>
        <div className="roc-motion-values">
          <span>
            t={fmt(a)}
            <b>s={fmt(position(a))} m</b>
          </span>
          <span>
            t={fmt(time)}
            <b>s={fmt(position(time))} m</b>
          </span>
          <span>
            t={fmt(b)}
            <b>s={fmt(position(b))} m</b>
          </span>
        </div>
        <aside>
          <b>Playback</b>
          <div>
            <button aria-label="Play motion" onClick={() => setPlaying(true)}>
              <Play />
            </button>
            <button aria-label="Pause motion" onClick={() => setPlaying(false)}>
              <Pause />
            </button>
            <button
              aria-label="Step motion"
              onClick={() => setPoint("time", time + 0.1)}
            >
              <SkipForward />
            </button>
            <select
              aria-label="Playback speed"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            >
              <option value="1">1x</option>
              <option value="2">2x</option>
            </select>
          </div>
          <label>
            <input
              type="checkbox"
              checked={loop}
              onChange={(e) => setLoop(e.target.checked)}
            />{" "}
            Loop
          </label>
        </aside>
      </section>

      <section className="roc-controls">
        <article>
          <h3>DATA TABLE</h3>
          <table>
            <thead>
              <tr>
                <th>t (s)</th>
                <th>s(t) (m)</th>
                <th>v(t) (m/s)</th>
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2, 3, 4].map((t) => (
                <tr
                  className={Math.abs(t - time) < 0.05 ? "active" : ""}
                  key={t}
                >
                  <td>{t}</td>
                  <td>{position(t)}</td>
                  <td>{velocity(t)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
        <article>
          <h3>TIME INTERVAL (AVERAGE RATE)</h3>
          <label>
            Start time a
            <input
              aria-label="Average start time"
              type="range"
              min="0"
              max={b - 0.1}
              step=".1"
              value={a}
              onInput={(e) => setPoint("a", Number(e.currentTarget.value))}
            />
          </label>
          <label>
            End time b
            <input
              aria-label="Average end time"
              type="range"
              min={a + 0.1}
              max="5"
              step=".1"
              value={b}
              onInput={(e) => setPoint("b", Number(e.currentTarget.value))}
            />
          </label>
          <output>Average rate = {fmt(average)} m/s</output>
        </article>
        <article>
          <h3>INSTANTANEOUS TIME</h3>
          <label>
            Time t
            <input
              aria-label="Instantaneous time"
              type="range"
              min="0"
              max="5"
              step=".1"
              value={time}
              onInput={(e) => setPoint("time", Number(e.currentTarget.value))}
            />
          </label>
          <output>
            v({fmt(time)})={fmt(instant)} m/s
          </output>
        </article>
      </section>

      <section className="roc-interpret">
        <h3>INTERPRETATION</h3>
        <div>
          <article>
            <h4>
              Average rate ({fmt(a)} to {fmt(b)})
            </h4>
            <p>
              The object's average velocity is {fmt(average)} m/s: the slope of
              the secant line.
            </p>
          </article>
          <article>
            <h4>Instantaneous rate (at {fmt(time)})</h4>
            <p>
              The object's velocity is {fmt(instant)} m/s: the slope of the
              tangent line.
            </p>
          </article>
          <article>
            <h4>What does it mean?</h4>
            <p>
              At t={fmt(time)} s, the object moves forward at {fmt(instant)} m/s
              and is at s={fmt(position(time))} m.
            </p>
          </article>
        </div>
      </section>

      <section className="roc-explain">
        <article>
          <h3>WORKED EXAMPLE</h3>
          <p>For t=1 to t=3, average velocity is (15−3)/(3−1)=6 m/s.</p>
          <p>At t=2, v(2)=2(2)+2=6 m/s.</p>
          <b>Both methods give 6 m/s.</b>
        </article>
        <article>
          <h3>COMMON MISCONCEPTION</h3>
          <b>Average rate is not the same as instantaneous rate.</b>
          <p>
            The average rate over an interval is the slope of a secant. The
            instantaneous rate at a point is the slope of a tangent.
          </p>
          <svg viewBox="0 0 300 105">
            <path d="M20 85Q115 5 280 35" fill="none" stroke="#111" />
            <path d="M40 75L240 28" stroke="#1774ef" />
            <path d="M100 78L220 20" stroke="#159447" />
            <path d="M20 90H285" stroke="#111" />
          </svg>
        </article>
      </section>

      <section className="roc-bottom">
        <article>
          <h3>PRACTICE</h3>
          <ol>
            <li>Find average velocity from t=0 to t=4.</li>
            <li>Find instantaneous velocity at t=1.</li>
            <li>At what time is velocity 10 m/s?</li>
          </ol>
          <button onClick={() => setSolutions((v) => !v)}>
            {solutions ? "Hide" : "View"} Solutions
          </button>
          {solutions && <output>1. 6 m/s · 2. 4 m/s · 3. t=4 s</output>}
        </article>
        <article>
          <h3>TRY IT YOURSELF</h3>
          <button
            className="roc-reset"
            aria-label="Reset matching challenge"
            onClick={() => setChallengeX(2)}
          >
            <RotateCcw /> Reset
          </button>
          <p>Make the average rate from t=0 to t=x equal v(2)=6.</p>
          <label>
            Adjust x
            <input
              aria-label="Challenge interval end x"
              type="range"
              min=".5"
              max="5"
              step=".1"
              value={challengeX}
              onInput={(e) => setChallengeX(Number(e.currentTarget.value))}
            />
          </label>
          <output>
            x={fmt(challengeX)} · average={fmt(challengeAverage)} m/s
          </output>
          <b className={challengeMatch ? "match" : "pending"}>
            {challengeMatch
              ? "Match! Both rates are 6 m/s."
              : "Keep adjusting: the rates differ."}
          </b>
        </article>
        <article>
          <h3>REAL-WORLD CONTEXT</h3>
          <p>
            A ball's height after t seconds is s(t)=t²+2t. What are its average
            and instantaneous velocities?
          </p>
          <button onClick={() => setHint((v) => !v)}>
            <Lightbulb /> Hint
          </button>
          {hint && (
            <output>
              Use the secant formula for an interval and s'(t)=2t+2 at one
              instant.
            </output>
          )}
        </article>
      </section>
      <nav className="roc-adjacent">
        <button>← Lagrange Mean Value Theorem</button>
        <button>Tangents and Normals →</button>
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
