import {
  ArrowLeft,
  ArrowRight,
  Expand,
  Lightbulb,
  RotateCcw,
  Share2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./PointLineDistanceTargetLesson177.css";
type Point = { x: number; y: number };
const fmt = (v: number) =>
  Math.abs(v - Math.round(v)) < 0.005 ? String(Math.round(v)) : v.toFixed(2);
const project = (p: Point, m: number, c: number) => {
  const t = (m * p.x - p.y + c) / (m * m + 1);
  const foot = { x: p.x - m * t, y: p.y + t };
  return { foot, distance: Math.abs(m * p.x - p.y + c) / Math.sqrt(m * m + 1) };
};
function DistanceGraph({
  point,
  m,
  c,
  onPoint,
  onLine,
}: {
  point: Point;
  m: number;
  c: number;
  onPoint: (p: Point) => void;
  onLine: (m: number) => void;
}) {
  const ref = useRef<SVGSVGElement>(null),
    drag = useRef<"point" | "line" | null>(null),
    W = 500,
    H = 360,
    u = 30,
    ox = 250,
    oy = 180,
    sx = (x: number) => ox + x * u,
    sy = (y: number) => oy - y * u,
    { foot, distance } = project(point, m, c);
  const from = (e: PointerEvent<SVGSVGElement>) => {
    const box = ref.current!.getBoundingClientRect();
    return {
      x: (((e.clientX - box.left) / box.width) * W - ox) / u,
      y: (oy - ((e.clientY - box.top) / box.height) * H) / u,
    };
  };
  const move = (e: PointerEvent<SVGSVGElement>) => {
    if (!drag.current) return;
    const p = from(e);
    if (drag.current === "point")
      onPoint({ x: Math.round(p.x * 2) / 2, y: Math.round(p.y * 2) / 2 });
    else if (Math.abs(p.x) > 0.3) onLine((p.y - c) / p.x);
  };
  const keyPoint = (e: KeyboardEvent<SVGCircleElement>) => {
    const d: { [k: string]: Point } = {
      ArrowLeft: { x: -0.5, y: 0 },
      ArrowRight: { x: 0.5, y: 0 },
      ArrowUp: { x: 0, y: 0.5 },
      ArrowDown: { x: 0, y: -0.5 },
    };
    if (d[e.key]) {
      e.preventDefault();
      onPoint({ x: point.x + d[e.key].x, y: point.y + d[e.key].y });
    }
  };
  const keyLine = (e: KeyboardEvent<SVGCircleElement>) => {
    if (e.key === "ArrowUp" || e.key === "ArrowRight") {
      e.preventDefault();
      onLine(m + 0.1);
    }
    if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
      e.preventDefault();
      onLine(m - 0.1);
    }
  };
  return (
    <svg
      ref={ref}
      className="pld177-graph"
      viewBox={`0 0 ${W} ${H}`}
      onPointerMove={move}
      onPointerUp={() => (drag.current = null)}
      onPointerLeave={() => (drag.current = null)}
    >
      <defs>
        <pattern
          id="pld177-grid"
          width={u}
          height={u}
          patternUnits="userSpaceOnUse"
        >
          <path d={`M${u} 0H0V${u}`} fill="none" stroke="#dfe7ef" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill="url(#pld177-grid)" />
      <line x1="0" x2={W} y1={oy} y2={oy} className="axis" />
      <line x1={ox} x2={ox} y1="0" y2={H} className="axis" />
      <line
        x1={sx(-8)}
        y1={sy(-8 * m + c)}
        x2={sx(8)}
        y2={sy(8 * m + c)}
        className="line"
      />
      <line
        x1={sx(point.x)}
        y1={sy(point.y)}
        x2={sx(foot.x)}
        y2={sy(foot.y)}
        className="distance"
      />
      <path
        d={`M${sx(foot.x)} ${sy(foot.y)}l10 ${-10 * m}l${-10 * m} -10`}
        className="right"
      />
      <circle
        data-testid="distance-point"
        role="slider"
        tabIndex={0}
        aria-label="Drag point P"
        cx={sx(point.x)}
        cy={sy(point.y)}
        r="7"
        className="point"
        onPointerDown={(e) => {
          e.stopPropagation();
          drag.current = "point";
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onKeyDown={keyPoint}
      />
      <circle
        data-testid="distance-line-handle"
        role="slider"
        tabIndex={0}
        aria-label="Drag line"
        cx={sx(4)}
        cy={sy(4 * m + c)}
        r="7"
        className="handle"
        onPointerDown={(e) => {
          e.stopPropagation();
          drag.current = "line";
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onKeyDown={keyLine}
      />
      <text x={sx(point.x) + 10} y={sy(point.y) - 10}>
        P ({fmt(point.x)}, {fmt(point.y)})
      </text>
      <text x={sx(foot.x) + 10} y={sy(foot.y) + 20}>
        F ({fmt(foot.x)}, {fmt(foot.y)})
      </text>
      <text
        x={(sx(point.x) + sx(foot.x)) / 2 + 8}
        y={(sy(point.y) + sy(foot.y)) / 2}
      >
        d={distance.toFixed(3)}
      </text>
    </svg>
  );
}
export default function PointLineDistanceTargetLesson177({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [point, setPoint] = useState({ x: 2, y: 5 }),
    [m, setM] = useState(1),
    [c, setC] = useState(0),
    [tab, setTab] = useState(0),
    [expanded, setExpanded] = useState(false),
    [shared, setShared] = useState(false),
    [answer, setAnswer] = useState(""),
    [status, setStatus] = useState(""),
    [hint, setHint] = useState(false);
  const { foot, distance } = project(point, m, c),
    vertical = Math.abs(point.y - (m * point.x + c)),
    slanted = Math.hypot(3, point.y - (m * (point.x + 3) + c));
  const updatePoint = (p: Point) => {
    setPoint(p);
    onInteraction();
  };
  const updateM = (v: number) => {
    setM(v);
    onInteraction();
  };
  const reset = () => {
    setPoint({ x: 2, y: 5 });
    setM(1);
    setC(0);
    setTab(0);
    setExpanded(false);
    setShared(false);
    setAnswer("");
    setStatus("");
    setHint(false);
    onInteraction();
  };
  useEffect(() => {
    setPoint({ x: 2, y: 5 });
    setM(1);
    setC(0);
    setTab(0);
    setExpanded(false);
    setShared(false);
    setAnswer("");
    setStatus("");
    setHint(false);
  }, [resetToken]);
  const answerValue = answer.trim().toLowerCase().replace(/\s/g, "");
  const correct =
    answerValue === "sqrt(5)" ||
    answerValue === "√5" ||
    Math.abs(Number(answerValue) - Math.sqrt(5)) < 0.01;
  return (
    <main
      className={`pld177-page${expanded ? " expanded" : ""}`}
      data-testid="geometry-mockup-0234"
      data-dedicated-lesson="177"
      data-object-model="pointer-keyboard-draggable-point-and-line-exact-orthogonal-projection-distance-formula-path-comparison-and-graded-exact-practice"
      data-point={`${point.x}:${point.y}`}
      data-m={m.toFixed(2)}
      data-c={c.toFixed(2)}
      data-foot={`${foot.x.toFixed(2)}:${foot.y.toFixed(2)}`}
      data-distance={distance.toFixed(3)}
      data-tab={tab}
      data-expanded={expanded}
      data-status={status}
    >
      <header className="pld177-header">
        <span>COORDINATE GEOMETRY</span>
        <h1>Point to Line Distance</h1>
        <p>Shortest distance from a point to a line.</p>
        <div>
          <b>Level: Intermediate</b>
          <b>Topic: Coordinate Geometry</b>
          <b>Est. time: 8-10 min</b>
          <button
            onClick={() => {
              setShared(true);
              onInteraction();
            }}
          >
            <Share2 />
            Share
          </button>
        </div>
        <aside>
          <h3>Learning flow</h3>
          <p>1 Observe & manipulate</p>
          <p>2 Notice the pattern</p>
          <p>3 Understand the rule</p>
          <p>4 Try independently</p>
          <output>{shared ? "Share link ready" : ""}</output>
        </aside>
      </header>
      <nav className="pld177-tabs">
        {["Explore", "Construct", "Formula", "Compare Paths", "Practice"].map(
          (x, i) => (
            <button
              key={x}
              className={tab === i ? "active" : ""}
              onClick={() => {
                setTab(i);
                onInteraction();
              }}
            >
              {x}
            </button>
          ),
        )}
      </nav>
      <section className="pld177-main">
        <article>
          <header>
            <h2>DRAG TO EXPLORE</h2>
            <p>Drag the point or the line to see the shortest distance.</p>
          </header>
          <DistanceGraph
            point={point}
            m={m}
            c={c}
            onPoint={updatePoint}
            onLine={updateM}
          />
        </article>
        <aside>
          <h2>Objects</h2>
          <section>
            <h3>
              ● Point P ({fmt(point.x)}, {fmt(point.y)})
            </h3>
            {(["x", "y"] as const).map((k) => (
              <label key={k}>
                {k}
                <input
                  aria-label={`Point P ${k}`}
                  type="range"
                  min="-6"
                  max="6"
                  step=".5"
                  value={point[k]}
                  onChange={(e) =>
                    updatePoint({ ...point, [k]: Number(e.target.value) })
                  }
                />
                <input
                  aria-label={`Point P ${k} value`}
                  type="number"
                  step=".5"
                  value={point[k]}
                  onChange={(e) =>
                    updatePoint({ ...point, [k]: Number(e.target.value) })
                  }
                />
              </label>
            ))}
          </section>
          <section>
            <h3>
              Line ℓ: y={fmt(m)}x+{fmt(c)}
            </h3>
            <label>
              m
              <input
                aria-label="Distance line slope"
                type="range"
                min="-6"
                max="6"
                step=".1"
                value={m}
                onChange={(e) => updateM(Number(e.target.value))}
              />
              <input
                aria-label="Distance line slope value"
                type="number"
                step=".1"
                value={m}
                onChange={(e) => updateM(Number(e.target.value))}
              />
            </label>
            <label>
              c
              <input
                aria-label="Distance line intercept"
                type="range"
                min="-6"
                max="6"
                step=".5"
                value={c}
                onChange={(e) => {
                  setC(Number(e.target.value));
                  onInteraction();
                }}
              />
              <input
                aria-label="Distance line intercept value"
                type="number"
                step=".5"
                value={c}
                onChange={(e) => {
                  setC(Number(e.target.value));
                  onInteraction();
                }}
              />
            </label>
          </section>
          <footer>
            <button onClick={reset}>
              <RotateCcw />
              Reset view
            </button>
            <button
              aria-label="Expand view"
              onClick={() => {
                setExpanded((v) => !v);
                onInteraction();
              }}
            >
              <Expand />
            </button>
          </footer>
        </aside>
      </section>
      <section className="pld177-observation">
        <h2>Observation</h2>
        <div>
          <b>Foot of perpendicular</b>
          <output>
            F ({fmt(foot.x)}, {fmt(foot.y)})
          </output>
        </div>
        <div>
          <b>Shortest distance PF</b>
          <output>{distance.toFixed(3)}</output>
        </div>
        <div>
          <b>Line equation</b>
          <output>
            y={fmt(m)}x+{fmt(c)}
          </output>
        </div>
        <div>
          <b>Segment</b>
          <output>PF ⟂ ℓ</output>
        </div>
      </section>
      <section className="pld177-proof">
        <article>
          <h2>Construction steps</h2>
          <ol>
            <li>Drop a perpendicular from P to line ℓ.</li>
            <li>The meeting point F is the foot.</li>
            <li>Segment PF is perpendicular to ℓ.</li>
            <li>PF is the shortest distance.</li>
            <li>Any other path is longer.</li>
          </ol>
        </article>
        <article>
          <h2>Why is PF the shortest?</h2>
          <p>In ΔPFA, the right angle is at F.</p>
          <p>By Pythagoras, PA²=PF²+FA², so PA&gt;PF.</p>
          <p>Hence, perpendicular distance PF is minimum.</p>
        </article>
      </section>
      <section className="pld177-formula">
        <article>
          <h2>Formula (Distance from point to line)</h2>
          <output>d=|Ax₁+By₁+C|/√(A²+B²)</output>
        </article>
        <article>
          <h2>Substitution (current values)</h2>
          <p>
            Line: {fmt(m)}x-y+{fmt(c)}=0
          </p>
          <p>
            Point: P({fmt(point.x)},{fmt(point.y)})
          </p>
          <output>d={distance.toFixed(3)}</output>
        </article>
      </section>
      <section className="pld177-compare">
        <h2>Compare different paths</h2>
        <article>
          <b>Perpendicular (shortest)</b>
          <output>{distance.toFixed(3)}</output>
        </article>
        <article>
          <b>Vertical path</b>
          <output>{vertical.toFixed(3)}</output>
        </article>
        <article>
          <b>Slanted path</b>
          <output>{slanted.toFixed(3)}</output>
        </article>
      </section>
      <section className="pld177-practice">
        <div>
          <h2>Try it yourself</h2>
          <p>
            Given line 2x-y+1=0 and point P(3,2), find the shortest distance.
          </p>
        </div>
        <label>
          Your answer
          <input
            aria-label="Practice distance answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="exact value or decimal"
          />
        </label>
        <button
          onClick={() => {
            setStatus(
              correct
                ? "Correct shortest distance"
                : "Recheck the distance formula",
            );
            onInteraction();
          }}
        >
          Check
        </button>
        <button
          onClick={() => {
            setHint((v) => !v);
            onInteraction();
          }}
        >
          <Lightbulb />
          Show hint
        </button>
        <output>{hint ? "Use |2(3)-2+1|/√(2²+(-1)²)." : status}</output>
      </section>
      <nav className="pld177-nav">
        <a href="/lessons/geometry/176-angle-between-lines">
          <ArrowLeft />
          <span>
            <small>Previous</small>
            <b>Angle Between Lines</b>
          </span>
        </a>
        <a href="/lessons/geometry/178-coordinate-loci">
          <span>
            <small>Next</small>
            <b>Coordinate Loci</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="pld177-footer">
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
