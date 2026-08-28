import {
  ArrowLeft,
  ArrowRight,
  Maximize2,
  MousePointer2,
  Move,
  RotateCcw,
  Share2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./GradientSlopeTargetLesson172.css";

type Point = { x: number; y: number };
type Tool = "move" | "select" | "pan";
const initialA = { x: -4, y: -1 },
  initialB = { x: 3, y: 2 },
  practiceA = { x: -2, y: -3 },
  practiceB = { x: 4, y: 1 };
const slope = (a: Point, b: Point) =>
  b.x === a.x ? null : (b.y - a.y) / (b.x - a.x);
function Graph({
  a,
  b,
  onPoint,
  tool,
  zoom,
  pan,
  onPan,
  practice = false,
  showRiseRun = true,
  showValues = true,
}: {
  a: Point;
  b: Point;
  onPoint: (key: "a" | "b", p: Point) => void;
  tool: Tool;
  zoom: number;
  pan: Point;
  onPan: (p: Point) => void;
  practice?: boolean;
  showRiseRun?: boolean;
  showValues?: boolean;
}) {
  const ref = useRef<SVGSVGElement>(null),
    drag = useRef<{
      key: "a" | "b" | "pan";
      x: number;
      y: number;
      origin: Point;
    } | null>(null),
    W = practice ? 430 : 500,
    H = practice ? 250 : 380,
    u = 35 * zoom,
    ox = W / 2 + pan.x,
    oy = H / 2 + pan.y,
    m = slope(a, b);
  const sx = (x: number) => ox + x * u,
    sy = (y: number) => oy - y * u;
  const move = (e: PointerEvent<SVGSVGElement>) => {
    if (!drag.current) return;
    if (drag.current.key === "pan") {
      onPan({
        x: drag.current.origin.x + e.clientX - drag.current.x,
        y: drag.current.origin.y + e.clientY - drag.current.y,
      });
      return;
    }
    const box = ref.current!.getBoundingClientRect(),
      x = Math.round((((e.clientX - box.left) / box.width) * W - ox) / u),
      y = Math.round((oy - ((e.clientY - box.top) / box.height) * H) / u);
    onPoint(drag.current.key, {
      x: Math.max(-6, Math.min(6, x)),
      y: Math.max(-5, Math.min(5, y)),
    });
  };
  const keyMove = (
    which: "a" | "b",
    p: Point,
    e: KeyboardEvent<SVGCircleElement>,
  ) => {
    const d: { [k: string]: Point } = {
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
      ArrowUp: { x: 0, y: 1 },
      ArrowDown: { x: 0, y: -1 },
    };
    if (d[e.key]) {
      e.preventDefault();
      onPoint(which, { x: p.x + d[e.key].x, y: p.y + d[e.key].y });
    }
  };
  return (
    <svg
      ref={ref}
      className={`gs172-graph${practice ? " practice" : ""}`}
      viewBox={`0 0 ${W} ${H}`}
      onPointerMove={move}
      onPointerUp={() => (drag.current = null)}
      onPointerLeave={() => (drag.current = null)}
      onPointerDown={(e) => {
        if (tool === "pan")
          drag.current = {
            key: "pan",
            x: e.clientX,
            y: e.clientY,
            origin: pan,
          };
      }}
    >
      <defs>
        <pattern
          id={practice ? "gs172-small" : "gs172-grid"}
          width={u}
          height={u}
          patternUnits="userSpaceOnUse"
        >
          <path d={`M${u} 0H0V${u}`} fill="none" stroke="#dfe7ef" />
        </pattern>
      </defs>
      <rect
        width={W}
        height={H}
        fill={`url(#${practice ? "gs172-small" : "gs172-grid"})`}
      />
      <line x1="0" x2={W} y1={oy} y2={oy} className="axis" />
      <line x1={ox} x2={ox} y1="0" y2={H} className="axis" />
      {[-6, -4, -2, 0, 2, 4, 6].map((v) => (
        <g key={v}>
          <text x={sx(v)} y={oy + 15}>
            {v}
          </text>
          {v !== 0 ? (
            <text x={ox - 10} y={sy(v) + 4}>
              {v}
            </text>
          ) : null}
        </g>
      ))}
      <line
        x1={sx(a.x)}
        y1={sy(a.y)}
        x2={sx(b.x)}
        y2={sy(b.y)}
        className="line"
      />
      {!practice && showRiseRun && m !== null ? (
        <>
          <line
            x1={sx(a.x)}
            y1={sy(a.y)}
            x2={sx(b.x)}
            y2={sy(a.y)}
            className="run"
          />
          <line
            x1={sx(b.x)}
            y1={sy(a.y)}
            x2={sx(b.x)}
            y2={sy(b.y)}
            className="rise"
          />
          <text
            x={(sx(a.x) + sx(b.x)) / 2}
            y={sy(a.y) + 20}
            className="run-label"
          >
            run = {b.x - a.x}
          </text>
          <text
            x={sx(b.x) + 28}
            y={(sy(a.y) + sy(b.y)) / 2}
            className="rise-label"
          >
            rise = {b.y - a.y}
          </text>
        </>
      ) : null}
      {[
        ["a", a, "A", "#2384ef"],
        ["b", b, "B", "#8042df"],
      ].map(([id, p, name, color]) => {
        const q = p as Point;
        return (
          <g key={id as string}>
            <circle
              data-testid={`${practice ? "practice-" : ""}slope-point-${id}`}
              role="slider"
              tabIndex={0}
              aria-label={`Drag ${practice ? "practice " : ""}point ${String(name)}`}
              cx={sx(q.x)}
              cy={sy(q.y)}
              r="7"
              fill={color as string}
              onPointerDown={(e) => {
                if (tool !== "pan") {
                  e.stopPropagation();
                  e.currentTarget.setPointerCapture(e.pointerId);
                  drag.current = {
                    key: id as "a" | "b",
                    x: e.clientX,
                    y: e.clientY,
                    origin: q,
                  };
                }
              }}
              onKeyDown={(e) => keyMove(id as "a" | "b", q, e)}
            />
            {showValues ? (
              <text
                className="point-label"
                x={sx(q.x) + (id === "a" ? -42 : 10)}
                y={sy(q.y) + (id === "a" ? 25 : -14)}
              >
                {name} ({q.x}, {q.y})
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

export default function GradientSlopeTargetLesson172({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [a, setA] = useState(initialA),
    [b, setB] = useState(initialB),
    [pa, setPa] = useState(practiceA),
    [pb, setPb] = useState(practiceB),
    [tool, setTool] = useState<Tool>("move"),
    [zoom, setZoom] = useState(1),
    [pan, setPan] = useState({ x: 0, y: 0 }),
    [riseRun, setRiseRun] = useState(true),
    [values, setValues] = useState(true),
    [tab, setTab] = useState(0),
    [answer, setAnswer] = useState(""),
    [attempts, setAttempts] = useState(0),
    [best, setBest] = useState(false),
    [status, setStatus] = useState(""),
    [fullscreen, setFullscreen] = useState(false),
    [shared, setShared] = useState(false);
  const m = slope(a, b),
    pm = slope(pa, pb),
    direction =
      m === null
        ? "Undefined slope"
        : m > 0
          ? "Positive slope"
          : m < 0
            ? "Negative slope"
            : "Zero slope";
  const interact = () => onInteraction();
  const setPoint = (which: "a" | "b", p: Point) => {
    (which === "a" ? setA : setB)(p);
    interact();
  };
  const reset = () => {
    setA(initialA);
    setB(initialB);
    setPa(practiceA);
    setPb(practiceB);
    setTool("move");
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setRiseRun(true);
    setValues(true);
    setTab(0);
    setAnswer("");
    setAttempts(0);
    setBest(false);
    setStatus("");
    setFullscreen(false);
    setShared(false);
    interact();
  };
  useEffect(() => {
    setA(initialA);
    setB(initialB);
    setPa(practiceA);
    setPb(practiceB);
    setTool("move");
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setRiseRun(true);
    setValues(true);
    setTab(0);
    setAnswer("");
    setAttempts(0);
    setBest(false);
    setStatus("");
  }, [resetToken]);
  const check = () => {
    setAttempts((v) => v + 1);
    const ok = pm !== null && Math.abs(Number(answer) - pm) < 0.001;
    setBest((v) => v || ok);
    setStatus(ok ? "Correct slope" : "Recheck rise over run");
    interact();
  };
  return (
    <main
      className={`gs172-page${fullscreen ? " fullscreen" : ""}`}
      data-testid="geometry-mockup-0229"
      data-dedicated-lesson="172"
      data-object-model="two-editable-pointer-keyboard-draggable-points-rise-run-slope-direction-vertical-guard-tools-and-independent-graded-practice"
      data-a={`${a.x}:${a.y}`}
      data-b={`${b.x}:${b.y}`}
      data-slope={m === null ? "undefined" : m.toFixed(4)}
      data-tool={tool}
      data-zoom={zoom}
      data-tab={tab}
      data-rise-run={riseRun}
      data-values={values}
      data-attempts={attempts}
      data-best={best}
      data-status={status}
    >
      <header className="gs172-header">
        <span>COORDINATE GEOMETRY</span>
        <h1>Gradient Slope</h1>
        <p>Understand rise over run and the slope of a line.</p>
        <div>
          <b>
            ▥ Level: <strong>Intermediate</strong>
          </b>
          <b>
            ◷ Duration: <strong>6-10 min</strong>
          </b>
          <b>
            ◎ Focus: <strong>Gradient, slope, line behavior</strong>
          </b>
        </div>
        <aside>
          <button
            onClick={() => {
              setShared(true);
              interact();
            }}
          >
            <Share2 />
            Share
          </button>
          <button onClick={reset}>
            <RotateCcw />
            Reset
          </button>
          <output>{shared ? "Share link ready" : ""}</output>
        </aside>
      </header>
      <nav className="gs172-stages">
        {[
          ["Observe", "See a line"],
          ["Manipulate", "Drag the points"],
          ["Notice", "Pattern & slope"],
          ["Understand", "Rule & formula"],
          ["Try", "Practice"],
        ].map(([x, y], i) => (
          <button
            className={tab === i ? "active" : ""}
            onClick={() => {
              setTab(i);
              interact();
            }}
            key={x}
          >
            <i>{i + 1}</i>
            <span>
              <b>{x}</b>
              <small>{y}</small>
            </span>
          </button>
        ))}
      </nav>
      <section className="gs172-explore">
        <header>
          <div>
            <h2>Explore the line</h2>
            <p>
              Drag points A or B to change the line and see how slope updates.
            </p>
          </div>
          <label>Show</label>
          <label>
            <input
              type="checkbox"
              checked={riseRun}
              onChange={(e) => {
                setRiseRun(e.target.checked);
                interact();
              }}
            />{" "}
            Rise / Run
          </label>
          <label>
            <input
              type="checkbox"
              checked={values}
              onChange={(e) => {
                setValues(e.target.checked);
                interact();
              }}
            />{" "}
            Values
          </label>
        </header>
        <div className="gs172-work">
          <aside>
            {[
              ["A", a, setA, "#2384ef"],
              ["B", b, setB, "#8042df"],
            ].map(([name, p, setter, color]) => (
              <section key={name as string}>
                <h3 style={{ color: color as string }}>
                  ● POINT {name as string}
                </h3>
                <strong>
                  {name as string} (x{String(name) === "A" ? "1" : "2"}, y
                  {String(name) === "A" ? "1" : "2"})
                </strong>
                {(["x", "y"] as const).map((k) => (
                  <label key={k}>
                    {k}
                    <sub>{String(name) === "A" ? "1" : "2"}</sub>
                    <input
                      aria-label={`Point ${name as string} ${k}`}
                      type="number"
                      value={(p as Point)[k]}
                      onChange={(e) => {
                        (setter as (v: Point) => void)({
                          ...(p as Point),
                          [k]: Number(e.target.value),
                        });
                        interact();
                      }}
                    />
                  </label>
                ))}
              </section>
            ))}
          </aside>
          <article>
            <Graph
              a={a}
              b={b}
              onPoint={setPoint}
              tool={tool}
              zoom={zoom}
              pan={pan}
              onPan={setPan}
              showRiseRun={riseRun}
              showValues={values}
            />
            <footer>
              <span>
                Drag the points on the graph
                <br />
                or use the controls above.
              </span>
              {(["move", "select", "pan"] as Tool[]).map((x) => (
                <button
                  key={x}
                  className={tool === x ? "active" : ""}
                  onClick={() => {
                    setTool(x);
                    interact();
                  }}
                >
                  {x === "move" ? (
                    <Move />
                  ) : x === "select" ? (
                    <MousePointer2 />
                  ) : (
                    <Move />
                  )}
                  {x}
                </button>
              ))}
              <button
                aria-label="Zoom in"
                onClick={() => {
                  setZoom((v) => Math.min(1.5, v + 0.1));
                  interact();
                }}
              >
                <ZoomIn />
                Zoom In
              </button>
              <button
                aria-label="Zoom out"
                onClick={() => {
                  setZoom((v) => Math.max(0.7, v - 0.1));
                  interact();
                }}
              >
                <ZoomOut />
                Zoom Out
              </button>
              <button
                onClick={() => {
                  setFullscreen((v) => !v);
                  interact();
                }}
              >
                <Maximize2 />
                Full screen
              </button>
            </footer>
          </article>
          <aside>
            <section>
              <h3>SLOPE (m)</h3>
              <strong>m = rise / run</strong>
              <output>
                {m === null
                  ? "undefined"
                  : `${b.y - a.y} / ${b.x - a.x} = ${m.toFixed(4)}`}
              </output>
            </section>
            <section>
              <h3>DIRECTION</h3>
              <b>{direction}</b>
              <p>
                {m === null
                  ? "Vertical line has no finite slope."
                  : m >= 0
                    ? "Line rises left to right."
                    : "Line falls left to right."}
              </p>
            </section>
            <section>
              <h3>UNDEFINED SLOPE</h3>
              <p>Make a vertical line by setting x₁ = x₂.</p>
              <b>Slope is undefined.</b>
            </section>
          </aside>
        </div>
      </section>
      <section className="gs172-learning">
        <article>
          <h2>How it works</h2>
          <ol>
            <li>Drag either point.</li>
            <li>Rise = change in y.</li>
            <li>Run = change in x.</li>
            <li>Slope m = rise/run.</li>
            <li>Positive rises; negative falls.</li>
          </ol>
        </article>
        <article>
          <h2>Worked example</h2>
          <p>
            Given: A({a.x},{a.y}), B({b.x},{b.y})
          </p>
          <strong>rise = {b.y - a.y}</strong>
          <strong>run = {b.x - a.x}</strong>
          <output>m = {m === null ? "undefined" : m.toFixed(4)}</output>
          <p>Direction: {direction}</p>
        </article>
        <article>
          <h2>Key insight</h2>
          <p>Slope measures steepness and direction.</p>
          <strong>m = (y₂-y₁) / (x₂-x₁)</strong>
          <ul>
            <li>m &gt; 0: rises</li>
            <li>m &lt; 0: falls</li>
            <li>m = 0: horizontal</li>
            <li>Undefined: vertical</li>
          </ul>
        </article>
      </section>
      <section className="gs172-practice">
        <header>
          <h2>Try it yourself</h2>
          <p>
            Find the slope of the line through the given points. Drag the points
            to check your answer.
          </p>
        </header>
        <aside>
          <h3>Task</h3>
          <p>
            Points: A({pa.x},{pa.y}) and B({pb.x},{pb.y})
          </p>
          <b>What is the slope of line AB?</b>
          <input
            aria-label="Practice slope"
            placeholder="Enter slope (e.g., 1/2, -3, 0.5)"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <button onClick={check}>Check</button>
          <output className={status.startsWith("Correct") ? "correct" : ""}>
            {status}
          </output>
        </aside>
        <Graph
          practice
          a={pa}
          b={pb}
          tool="move"
          zoom={1}
          pan={{ x: 0, y: 0 }}
          onPan={() => {}}
          onPoint={(k, p) => {
            (k === "a" ? setPa : setPb)(p);
            interact();
          }}
        />
        <section>
          <h3>You can also...</h3>
          <button onClick={() => setPa({ ...pa, x: pa.x + 1 })}>
            ● Drag point A
          </button>
          <button onClick={() => setPb({ ...pb, y: pb.y + 1 })}>
            ● Drag point B
          </button>
          <button
            onClick={() => {
              setPa(practiceA);
              setPb(practiceB);
              setAnswer("");
              setStatus("");
              interact();
            }}
          >
            <RotateCcw />
            Reset
          </button>
          <hr />
          <h3>Progress</h3>
          <p>
            Attempts <b>{attempts}</b> Best <b>{best ? "Correct" : "-"}</b>
          </p>
        </section>
      </section>
      <nav className="gs172-nav">
        <a href="/lessons/geometry/171-section-formula">
          <ArrowLeft />
          <span>
            <small>Previous</small>
            <b>Section Formula</b>
          </span>
        </a>
        <a href="/lessons/geometry/173-equation-of-a-line">
          <span>
            <small>Next</small>
            <b>Equation of a Line</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="gs172-footer">
        <div>
          <b>⌁ Math Universe</b>
          <p>
            Interactive math labs, visual proofs, NCERT explorations, graphing,
            CAS-style tools, and classroom-ready activities.
          </p>
        </div>
        <a href="#sitemap">▥ Sitemap</a>
        <a href="#docs">▤ Docs</a>
        <a href="#about">✉ About</a>
      </footer>
    </main>
  );
}
