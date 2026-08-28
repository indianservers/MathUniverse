import {
  ArrowLeft,
  ArrowRight,
  Ellipsis,
  Hand,
  Lightbulb,
  MousePointer2,
  RotateCcw,
  Share2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./EquationLineTargetLesson173.css";
type Point = { x: number; y: number };
type Form = "slope" | "point" | "standard";
type Tool = "select" | "pan";
const fmt = (v: number) =>
  Math.abs(v - Math.round(v)) < 0.005 ? String(Math.round(v)) : v.toFixed(2);
function LineGraph({
  m,
  b,
  grid,
  tool,
  pan,
  onPan,
  onLine,
  practice = false,
}: {
  m: number;
  b: number;
  grid: boolean;
  tool: Tool;
  pan: Point;
  onPan: (p: Point) => void;
  onLine?: (m: number, b: number) => void;
  practice?: boolean;
}) {
  const ref = useRef<SVGSVGElement>(null),
    drag = useRef<{
      kind: "point" | "pan";
      x: number;
      y: number;
      origin: Point;
    } | null>(null),
    W = practice ? 390 : 500,
    H = practice ? 250 : 440,
    u = 22,
    ox = W / 2 + pan.x,
    oy = H / 2 + pan.y,
    sx = (x: number) => ox + x * u,
    sy = (y: number) => oy - y * u;
  const move = (e: PointerEvent<SVGSVGElement>) => {
    if (!drag.current) return;
    if (drag.current.kind === "pan") {
      onPan({
        x: drag.current.origin.x + e.clientX - drag.current.x,
        y: drag.current.origin.y + e.clientY - drag.current.y,
      });
      return;
    }
    const box = ref.current!.getBoundingClientRect(),
      x = Math.round((((e.clientX - box.left) / box.width) * W - ox) / u),
      y = Math.round((oy - ((e.clientY - box.top) / box.height) * H) / u);
    if (x !== 0) onLine?.((y - b) / x, b);
  };
  const keyboard = (e: KeyboardEvent<SVGCircleElement>) => {
    if (!onLine) return;
    if (e.key === "ArrowUp" || e.key === "ArrowRight") {
      e.preventDefault();
      onLine(m + 0.25, b);
    }
    if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
      e.preventDefault();
      onLine(m - 0.25, b);
    }
  };
  return (
    <svg
      ref={ref}
      className={`el173-graph${practice ? " practice" : ""}`}
      viewBox={`0 0 ${W} ${H}`}
      onPointerMove={move}
      onPointerUp={() => (drag.current = null)}
      onPointerLeave={() => (drag.current = null)}
      onPointerDown={(e) => {
        if (tool === "pan")
          drag.current = {
            kind: "pan",
            x: e.clientX,
            y: e.clientY,
            origin: pan,
          };
      }}
    >
      <defs>
        <pattern
          id={practice ? "el173-pgrid" : "el173-grid"}
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
        fill={
          grid ? `url(#${practice ? "el173-pgrid" : "el173-grid"})` : "#fff"
        }
      />
      <line x1="0" x2={W} y1={oy} y2={oy} className="axis" />
      <line x1={ox} x2={ox} y1="0" y2={H} className="axis" />
      <line
        x1={sx(-10)}
        y1={sy(-10 * m + b)}
        x2={sx(10)}
        y2={sy(10 * m + b)}
        className="line"
      />
      {practice ? (
        <>
          {[
            [-2, -1],
            [4, 5],
          ].map(([x, y], i) => (
            <g key={x}>
              <circle cx={sx(x)} cy={sy(y)} r="6" className="practice-point" />
              <text x={sx(x) + (i ? 10 : -42)} y={sy(y) - 10}>
                ({x}, {y})
              </text>
            </g>
          ))}
        </>
      ) : (
        <>
          {[-2, 0, 2].map((x, i) => {
            const y = m * x + b;
            return (
              <g key={x}>
                <circle
                  data-testid={i === 2 ? "line-control-point" : undefined}
                  role={i === 2 ? "slider" : undefined}
                  tabIndex={i === 2 ? 0 : undefined}
                  aria-label={i === 2 ? "Drag line point" : undefined}
                  cx={sx(x)}
                  cy={sy(y)}
                  r="6"
                  className="point"
                  onPointerDown={
                    i === 2
                      ? (e) => {
                          e.stopPropagation();
                          drag.current = {
                            kind: "point",
                            x: e.clientX,
                            y: e.clientY,
                            origin: { x, y },
                          };
                        }
                      : undefined
                  }
                  onKeyDown={i === 2 ? keyboard : undefined}
                />
                <text
                  x={sx(x) + (i === 0 ? -42 : 10)}
                  y={sy(y) + (i === 0 ? 24 : -10)}
                >
                  ({x}, {fmt(y)})
                </text>
              </g>
            );
          })}
        </>
      )}
    </svg>
  );
}
export default function EquationLineTargetLesson173({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [m, setM] = useState(2),
    [b, setB] = useState(1),
    [form, setForm] = useState<Form>("slope"),
    [tool, setTool] = useState<Tool>("select"),
    [grid, setGrid] = useState(true),
    [pan, setPan] = useState({ x: 0, y: 0 }),
    [tab, setTab] = useState(1),
    [history, setHistory] = useState<{ m: number; b: number }[]>([]),
    [future, setFuture] = useState<{ m: number; b: number }[]>([]),
    [answer, setAnswer] = useState(""),
    [status, setStatus] = useState(""),
    [hint, setHint] = useState(false),
    [shared, setShared] = useState(false),
    [menu, setMenu] = useState(false);
  const update = (nm: number, nb: number) => {
    setHistory((v) => [...v, { m, b }]);
    setFuture([]);
    setM(nm);
    setB(nb);
    onInteraction();
  };
  const reset = () => {
    setM(2);
    setB(1);
    setForm("slope");
    setTool("select");
    setGrid(true);
    setPan({ x: 0, y: 0 });
    setTab(1);
    setHistory([]);
    setFuture([]);
    setAnswer("");
    setStatus("");
    setHint(false);
    setShared(false);
    setMenu(false);
    onInteraction();
  };
  useEffect(() => {
    setM(2);
    setB(1);
    setForm("slope");
    setTool("select");
    setGrid(true);
    setPan({ x: 0, y: 0 });
    setTab(1);
    setHistory([]);
    setFuture([]);
    setAnswer("");
    setStatus("");
  }, [resetToken]);
  const undo = () => {
    const v = history.at(-1);
    if (v) {
      setFuture((x) => [{ m, b }, ...x]);
      setHistory((x) => x.slice(0, -1));
      setM(v.m);
      setB(v.b);
      onInteraction();
    }
  };
  const redo = () => {
    const v = future[0];
    if (v) {
      setHistory((x) => [...x, { m, b }]);
      setFuture((x) => x.slice(1));
      setM(v.m);
      setB(v.b);
      onInteraction();
    }
  };
  const xint = m === 0 ? null : -b / m,
    pointY = m * 2 + b;
  return (
    <main
      className="el173-page"
      data-testid="geometry-mockup-0230"
      data-dedicated-lesson="173"
      data-object-model="editable-slope-intercept-three-equivalent-line-forms-pointer-keyboard-line-drag-pan-undo-redo-and-graded-practice"
      data-m={m}
      data-b={b}
      data-form={form}
      data-tool={tool}
      data-grid={grid}
      data-tab={tab}
      data-status={status}
    >
      <header className="el173-header">
        <h1>Equation of A Line</h1>
        <p>Connect forms of linear equations.</p>
        <div>
          <b>♙ Intermediate</b>
          <b>⌁ Construction Lab</b>
          <b>▣ Coordinate Geometry</b>
          <b>◷ 6-10 min</b>
        </div>
        <aside>
          <button onClick={reset}>
            <RotateCcw />
            Reset
          </button>
          <button
            onClick={() => {
              setShared(true);
              onInteraction();
            }}
          >
            <Share2 />
            Share
          </button>
          <button aria-expanded={menu} onClick={() => setMenu((v) => !v)}>
            <Ellipsis />
          </button>
          <output>
            {shared ? "Share link ready" : ""}
            {menu ? " More line options" : ""}
          </output>
        </aside>
      </header>
      <nav className="el173-stages">
        {[
          ["Observe", "See the line"],
          ["Manipulate", "Drag & explore"],
          ["Notice", "Find patterns"],
          ["Understand", "Learn the rule"],
          ["Try", "Practice"],
        ].map(([x, y], i) => (
          <button
            key={x}
            className={tab === i ? "active" : ""}
            onClick={() => {
              setTab(i);
              onInteraction();
            }}
          >
            <i>{i + 1}</i>
            <span>
              <b>{x}</b>
              <small>{y}</small>
            </span>
          </button>
        ))}
      </nav>
      <section className="el173-lab">
        <article>
          <header>
            <div>
              <h2>Manipulate the line</h2>
              <p>
                Drag the blue points or adjust the controls. See equations and
                intercepts update in real time.
              </p>
            </div>
            <label>
              <input
                type="checkbox"
                checked={grid}
                onChange={(e) => {
                  setGrid(e.target.checked);
                  onInteraction();
                }}
              />{" "}
              Show grid
            </label>
            <button aria-label="Undo" disabled={!history.length} onClick={undo}>
              ↶
            </button>
            <button aria-label="Redo" disabled={!future.length} onClick={redo}>
              ↷
            </button>
          </header>
          <LineGraph
            m={m}
            b={b}
            grid={grid}
            tool={tool}
            pan={pan}
            onPan={setPan}
            onLine={update}
          />
          <div className="el173-tools">
            <button
              className={tool === "select" ? "active" : ""}
              onClick={() => setTool("select")}
            >
              <MousePointer2 />
              Select
            </button>
            <button
              className={tool === "pan" ? "active" : ""}
              onClick={() => setTool("pan")}
            >
              <Hand />
              Pan
            </button>
          </div>
        </article>
        <aside>
          <h2>Line controls</h2>
          <nav>
            {(["slope", "point", "standard"] as Form[]).map((x) => (
              <button
                key={x}
                className={form === x ? "active" : ""}
                onClick={() => {
                  setForm(x);
                  onInteraction();
                }}
              >
                {x === "slope"
                  ? "Slope-Intercept (y = mx + b)"
                  : x === "point"
                    ? "Point-Slope"
                    : "Standard"}
              </button>
            ))}
          </nav>
          <label>
            Slope (m)
            <input
              aria-label="Line slope"
              type="range"
              min="-10"
              max="10"
              step=".25"
              value={m}
              onChange={(e) => update(Number(e.target.value), b)}
            />
            <input
              aria-label="Line slope value"
              type="number"
              value={m}
              onChange={(e) => update(Number(e.target.value), b)}
            />
          </label>
          <label>
            Y-intercept (b)
            <input
              aria-label="Line intercept"
              type="range"
              min="-10"
              max="10"
              step=".25"
              value={b}
              onChange={(e) => update(m, Number(e.target.value))}
            />
            <input
              aria-label="Line intercept value"
              type="number"
              value={b}
              onChange={(e) => update(m, Number(e.target.value))}
            />
          </label>
          <hr />
          <h3>Live results</h3>
          <p>
            ● Slope (m) <b>{fmt(m)}</b>
          </p>
          <p>
            ● Y-intercept (b) <b>{fmt(b)}</b>
          </p>
          <p>
            ● X-intercept <b>{xint === null ? "none" : `(${fmt(xint)}, 0)`}</b>
          </p>
          <p>
            ● Y-intercept <b>(0, {fmt(b)})</b>
          </p>
          <h3>Equations of the line</h3>
          <output>
            y = {fmt(m)}x + {fmt(b)}
          </output>
          <output>
            y - {fmt(pointY)} = {fmt(m)}(x - 2)
          </output>
          <output>
            {fmt(m)}x - y + {fmt(b)} = 0
          </output>
        </aside>
      </section>
      <section className="el173-learning">
        <article>
          <h2>What's happening?</h2>
          <p>◈ The slope (m) is the rise over run.</p>
          <p>✧ b is where the line crosses the y-axis.</p>
          <p>◷ Changing m rotates the line.</p>
          <p>♢ Changing b shifts the line up or down.</p>
        </article>
        <article>
          <h2>Worked example</h2>
          <p>Construct a line with slope m = -3/2 and y-intercept b = 4.</p>
          <ol>
            <li>Set m and b.</li>
            <li>Plot (0,4) on the y-axis.</li>
            <li>Go right 2 and down 3.</li>
            <li>Draw the line through the points.</li>
          </ol>
        </article>
        <article>
          <h2>Key formulas</h2>
          <strong>y = mx + b</strong>
          <strong>y - y₁ = m(x - x₁)</strong>
          <strong>Ax + By + C = 0</strong>
          <p>Slope: m = -A/B</p>
          <p>Y-intercept: b = -C/B</p>
        </article>
      </section>
      <section className="el173-practice">
        <header>
          <h2>Try it yourself</h2>
          <p>Complete the task using the controls.</p>
        </header>
        <aside>
          <h3>Task</h3>
          <p>Create a line that passes through the points (-2,-1) and (4,5).</p>
          <p>✓ Adjust the controls so the line passes through both points.</p>
          <p>✓ What is the slope of this line?</p>
          <p>✓ What are the equations in different forms?</p>
          <input
            aria-label="Practice line slope"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Slope"
          />
          <button
            onClick={() => {
              setStatus(
                Math.abs(Number(answer) - 1) < 0.001
                  ? "Correct line equations"
                  : "Recheck the slope",
              );
              onInteraction();
            }}
          >
            Check answer
          </button>
          <button
            onClick={() => {
              setHint((v) => !v);
              onInteraction();
            }}
          >
            <Lightbulb />
            Hint
          </button>
          <output>{hint ? "Rise 6 while run is 6." : status}</output>
        </aside>
        <article>
          <LineGraph
            practice
            m={1}
            b={1}
            grid
            tool="select"
            pan={{ x: 0, y: 0 }}
            onPan={() => {}}
          />
          <button
            onClick={() => {
              setAnswer("");
              setStatus("");
              setHint(false);
              onInteraction();
            }}
          >
            <RotateCcw />
            Reset task
          </button>
        </article>
        <section>
          <h3>Your answers</h3>
          <p>
            Slope (m) <b>1</b>
          </p>
          <p>
            Y-intercept (b) <b>1</b>
          </p>
          <output>y = x + 1</output>
          <output>y - 5 = x - 4</output>
          <output>x - y + 1 = 0</output>
          <footer>{status || "All set? Check your answer."}</footer>
        </section>
      </section>
      <nav className="el173-nav">
        <a href="/lessons/geometry/172-gradient-slope">
          <ArrowLeft />
          <span>
            <small>Previous</small>
            <b>Gradient / Slope</b>
          </span>
        </a>
        <a href="/lessons/geometry/174-parallel-lines">
          <span>
            <small>Next</small>
            <b>Parallel Lines</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="el173-footer">
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
