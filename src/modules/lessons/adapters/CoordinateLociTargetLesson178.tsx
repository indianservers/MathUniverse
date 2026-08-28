import {
  ArrowLeft,
  ArrowRight,
  Grid3X3,
  Languages,
  Maximize2,
  Play,
  RotateCcw,
  Share2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./CoordinateLociTargetLesson178.css";

type Point = { x: number; y: number };
const INITIAL_RADIUS = 3;
const INITIAL_ANGLE = 0;
const fmt = (value: number) =>
  Math.abs(value - Math.round(value)) < 0.005
    ? String(Math.round(value))
    : value.toFixed(2);

function LocusGraph({
  radius,
  angle,
  grid,
  axes,
  trace,
  zoom,
  onAngle,
  onZoom,
}: {
  radius: number;
  angle: number;
  grid: boolean;
  axes: boolean;
  trace: number[];
  zoom: number;
  onAngle: (value: number) => void;
  onZoom: (value: number) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);
  const width = 560;
  const height = 400;
  const origin = { x: 280, y: 200 };
  const unit = 42 * zoom;
  const point = {
    x: radius * Math.cos(angle),
    y: radius * Math.sin(angle),
  };
  const sx = (x: number) => origin.x + x * unit;
  const sy = (y: number) => origin.y - y * unit;
  const setFromPointer = (event: PointerEvent<SVGSVGElement>) => {
    const box = svgRef.current?.getBoundingClientRect();
    if (!box) return;
    const px = ((event.clientX - box.left) / box.width) * width;
    const py = ((event.clientY - box.top) / box.height) * height;
    onAngle(Math.atan2(origin.y - py, px - origin.x));
  };
  const onKeyDown = (event: KeyboardEvent<SVGCircleElement>) => {
    if (
      !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)
    )
      return;
    event.preventDefault();
    onAngle(
      angle +
        (event.key === "ArrowLeft" || event.key === "ArrowDown"
          ? -Math.PI / 36
          : Math.PI / 36),
    );
  };
  const tracePath = trace
    .map((value, index) => {
      const x = sx(radius * Math.cos(value));
      const y = sy(radius * Math.sin(value));
      return `${index ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <div className="cl178-graph-wrap">
      <svg
        ref={svgRef}
        className="cl178-graph"
        viewBox={`0 0 ${width} ${height}`}
        onPointerMove={(event) => dragging.current && setFromPointer(event)}
        onPointerUp={() => (dragging.current = false)}
        onPointerLeave={() => (dragging.current = false)}
      >
        <defs>
          <pattern
            id="cl178-grid"
            width={unit}
            height={unit}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${unit} 0 L 0 0 0 ${unit}`}
              fill="none"
              stroke="#dfe8f1"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect
          width={width}
          height={height}
          fill={grid ? "url(#cl178-grid)" : "#fff"}
        />
        {axes && (
          <>
            <line
              x1="0"
              x2={width}
              y1={origin.y}
              y2={origin.y}
              className="cl178-axis"
            />
            <line
              x1={origin.x}
              x2={origin.x}
              y1="0"
              y2={height}
              className="cl178-axis"
            />
            <text x={width - 15} y={origin.y - 9}>
              x
            </text>
            <text x={origin.x + 9} y="16">
              y
            </text>
          </>
        )}
        <circle
          data-testid="coordinate-locus-circle"
          cx={origin.x}
          cy={origin.y}
          r={radius * unit}
          className="cl178-locus"
        />
        {tracePath && (
          <path
            data-testid="coordinate-locus-trace"
            d={tracePath}
            className="cl178-trace"
          />
        )}
        <line
          x1={origin.x}
          y1={origin.y}
          x2={sx(point.x)}
          y2={sy(point.y)}
          className="cl178-radius"
        />
        <circle cx={origin.x} cy={origin.y} r="5" className="cl178-focus" />
        <circle
          data-testid="coordinate-locus-point"
          role="slider"
          aria-label="Generator point P"
          tabIndex={0}
          cx={sx(point.x)}
          cy={sy(point.y)}
          r="10"
          className="cl178-point"
          onPointerDown={(event) => {
            dragging.current = true;
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onKeyDown={onKeyDown}
        />
        <text x={origin.x + 9} y={origin.y + 20} className="cl178-focus-label">
          F(0, 0)
        </text>
        <g
          className="cl178-point-label"
          transform={`translate(${sx(point.x) + 14} ${sy(point.y) - 12})`}
        >
          <rect x="-5" y="-17" width="86" height="28" rx="4" />
          <text>
            P({point.x.toFixed(2)}, {point.y.toFixed(2)})
          </text>
        </g>
      </svg>
      <div className="cl178-legend">
        <span>
          <i />
          Generator P(x, y)
        </span>
        <span>
          <i />
          Focus F(0, 0)
        </span>
      </div>
      <div className="cl178-zoom">
        <button
          aria-label="Zoom in"
          onClick={() => onZoom(Math.min(1.2, zoom + 0.1))}
        >
          <ZoomIn />
        </button>
        <button
          aria-label="Zoom out"
          onClick={() => onZoom(Math.max(0.7, zoom - 0.1))}
        >
          <ZoomOut />
        </button>
        <button aria-label="Fit graph" onClick={() => onZoom(1)}>
          <Maximize2 />
        </button>
      </div>
    </div>
  );
}

export default function CoordinateLociTargetLesson178({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [radius, setRadius] = useState(INITIAL_RADIUS);
  const [angle, setAngle] = useState(INITIAL_ANGLE);
  const [grid, setGrid] = useState(true);
  const [axes, setAxes] = useState(true);
  const [trace, setTrace] = useState<number[]>([INITIAL_ANGLE]);
  const [zoom, setZoom] = useState(1);
  const [tab, setTab] = useState(0);
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("Haven't started yet");
  const [solution, setSolution] = useState(false);
  const [shared, setShared] = useState(false);
  const [checks, setChecks] = useState([false, false, false]);
  const point: Point = {
    x: radius * Math.cos(angle),
    y: radius * Math.sin(angle),
  };
  const equation = `x² + y² = ${fmt(radius * radius)}`;
  const updateAngle = (value: number) => {
    setAngle(value);
    setTrace((current) => [...current.slice(-120), value]);
    onInteraction();
  };
  const updateRadius = (value: number) => {
    setRadius(value);
    setTrace([angle]);
    onInteraction();
  };
  const reset = () => {
    setRadius(INITIAL_RADIUS);
    setAngle(INITIAL_ANGLE);
    setGrid(true);
    setAxes(true);
    setTrace([INITIAL_ANGLE]);
    setZoom(1);
    setTab(0);
    setAnswer("");
    setStatus("Haven't started yet");
    setSolution(false);
    setShared(false);
    setChecks([false, false, false]);
    onInteraction();
  };
  useEffect(() => {
    setRadius(INITIAL_RADIUS);
    setAngle(INITIAL_ANGLE);
    setGrid(true);
    setAxes(true);
    setTrace([INITIAL_ANGLE]);
    setZoom(1);
    setTab(0);
    setAnswer("");
    setStatus("Haven't started yet");
    setSolution(false);
    setShared(false);
    setChecks([false, false, false]);
  }, [resetToken]);
  const normalized = answer
    .toLowerCase()
    .replace(/\s/g, "")
    .replace(/\^2/g, "²");
  const correct = normalized === "(x-1)²+(y-1)²=16";
  return (
    <main
      className="cl178-page"
      data-testid="geometry-mockup-0235"
      data-dedicated-lesson="178"
      data-object-model="fixed-focus-variable-radius-constrained-generator-circle-locus"
      data-radius={radius.toFixed(2)}
      data-angle={angle.toFixed(4)}
      data-point={`${point.x.toFixed(2)}:${point.y.toFixed(2)}`}
      data-distance={Math.hypot(point.x, point.y).toFixed(3)}
      data-equation={equation}
      data-trace-count={trace.length}
      data-grid={grid}
      data-axes={axes}
      data-zoom={zoom.toFixed(1)}
      data-tab={tab}
      data-status={status}
    >
      <header className="cl178-header">
        <span>COORDINATE GEOMETRY</span>
        <h1>Coordinate Loci</h1>
        <p>Explore points that satisfy a distance condition - the locus.</p>
        <section>
          <b>♙ Intermediate</b>
          <b>⌁ Construction Lab</b>
          <b>▣ Geometry / Graphing View</b>
          <b>◷ 6-10 min</b>
        </section>
        <footer>
          <button>
            <Languages />
            English (English)⌄
          </button>
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
          <button
            onClick={() => {
              setZoom(1.1);
              onInteraction();
            }}
          >
            ↗ Workspace
          </button>
          <output>{shared ? "Locus state copied" : ""}</output>
        </footer>
      </header>
      <nav className="cl178-tabs">
        {[
          ["Explore", "Observe & manipulate"],
          ["Construct", "Build the locus"],
          ["Rule", "Understand the idea"],
          ["Practice", "Try on your own"],
        ].map(([name, note], index) => (
          <button
            key={name}
            className={tab === index ? "active" : ""}
            onClick={() => {
              setTab(index);
              onInteraction();
            }}
          >
            <b>{name}</b>
            <small>{note}</small>
          </button>
        ))}
      </nav>
      <section className="cl178-lab">
        <article className="cl178-explore">
          <header>
            <div>
              <span>OBSERVE & MANIPULATE</span>
              <h2>Drag the point and watch the locus</h2>
            </div>
            <div>
              <button
                onClick={() => {
                  setAxes((v) => !v);
                  onInteraction();
                }}
              >
                A <i className={axes ? "on" : ""} />
              </button>
              <button
                onClick={() => {
                  setGrid((v) => !v);
                  onInteraction();
                }}
              >
                <Grid3X3 /> Grid <i className={grid ? "on" : ""} />
              </button>
              <button
                onClick={() => {
                  setTrace([angle]);
                  onInteraction();
                }}
              >
                Clear trace
              </button>
            </div>
          </header>
          <LocusGraph
            radius={radius}
            angle={angle}
            grid={grid}
            axes={axes}
            trace={trace}
            zoom={zoom}
            onAngle={updateAngle}
            onZoom={(value) => {
              setZoom(value);
              onInteraction();
            }}
          />
          <footer>
            <div>
              <b>Distance PF = {radius.toFixed(2)}</b>
              <span>To focus F(0, 0)</span>
            </div>
            <div>
              <b>Radius r = {fmt(radius)}</b>
              <span>Constant distance</span>
            </div>
            <div>
              <b>Locus</b>
              <span>Circle: {equation}</span>
            </div>
          </footer>
        </article>
        <aside className="cl178-controls">
          <section>
            <span>DISTANCE CONDITION</span>
            <h3>
              Points P at a fixed distance r<br />
              from focus F(0, 0)
            </h3>
          </section>
          <section>
            <label>
              Choose r
              <input
                aria-label="Locus radius"
                type="range"
                min="1"
                max="6"
                step=".25"
                value={radius}
                onChange={(event) => updateRadius(Number(event.target.value))}
              />
            </label>
            <input
              aria-label="Locus radius value"
              type="number"
              min="1"
              max="6"
              step=".25"
              value={radius}
              onChange={(event) =>
                updateRadius(
                  Math.max(1, Math.min(6, Number(event.target.value))),
                )
              }
            />
          </section>
          <section>
            <b>Equation of locus</b>
            <output>
              x² + y² = r²
              <br />= x² + y² = {radius.toFixed(2)}²<br />
              <strong>{equation}</strong>
            </output>
          </section>
          <section>
            <h3>Understand the rule</h3>
            <p>
              All points P whose distance from a fixed point F is constant r
              form a <b>circle</b> with centre F and radius r.
            </p>
          </section>
          <section>
            <h3>Checklist</h3>
            {[
              "Drag P around the circle.",
              "Change r and observe.",
              "What do you notice?",
            ].map((label, index) => (
              <label key={label}>
                <input
                  type="checkbox"
                  checked={checks[index]}
                  onChange={() => {
                    setChecks((current) =>
                      current.map((value, i) => (i === index ? !value : value)),
                    );
                    onInteraction();
                  }}
                />
                {label}
              </label>
            ))}
            <button
              onClick={() => {
                setChecks([true, true, true]);
                setStatus("The distance stays constant");
                onInteraction();
              }}
            >
              Check my idea
            </button>
          </section>
        </aside>
      </section>
      <section className="cl178-learning">
        <article>
          <span>WORKED EXAMPLE</span>
          <h3>Construct: Circle with centre (0, 0) and radius 3</h3>
          <div className="cl178-worked">
            <ol>
              <li>Mark the centre F(0, 0) on the plane.</li>
              <li>Choose radius r = 3.</li>
              <li>Take any point P such that PF = 3.</li>
              <li>Move P around while keeping PF = 3.</li>
            </ol>
            <svg viewBox="0 0 180 130">
              <line x1="10" x2="170" y1="75" y2="75" />
              <line x1="90" x2="90" y1="10" y2="125" />
              <circle cx="90" cy="75" r="46" />
              <line x1="90" y1="75" x2="126" y2="46" />
              <circle cx="90" cy="75" r="4" />
              <circle cx="126" cy="46" r="4" />
              <text x="96" y="87">
                F(0, 0)
              </text>
              <text x="130" y="43">
                P(x, y)
              </text>
              <text x="108" y="58">
                r
              </text>
            </svg>
          </div>
          <p>The path traced is the circle x² + y² = 9.</p>
          <footer>
            <b>Locus rule:</b> x² + y² = r²
            <br />
            <span>All points whose distance from origin is r units.</span>
          </footer>
        </article>
        <article>
          <span>TRY IT YOURSELF</span>
          <h3>Find the locus of points that are 4 units from F(1, 1).</h3>
          <p className="cl178-hint">ⓘ Hint: Move the point and observe.</p>
          <label>
            Equation of locus:
            <input
              aria-label="Practice locus equation"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder="(x - 1)² + (y - 1)² = 16"
            />
          </label>
          <div>
            <button
              onClick={() => {
                setStatus(
                  correct
                    ? "Correct locus equation"
                    : "Use centre (1, 1) and radius 4",
                );
                onInteraction();
              }}
            >
              Check answer
            </button>
            <button
              onClick={() => {
                setSolution((value) => !value);
                onInteraction();
              }}
            >
              Show solution
            </button>
          </div>
          <output>{solution ? "(x - 1)² + (y - 1)² = 16" : status}</output>
          <button
            className="cl178-start"
            onClick={() => {
              setStatus("Exploration started");
              updateAngle(Math.PI / 4);
            }}
          >
            <Play />
            Start exploration
          </button>
        </article>
      </section>
      <nav className="cl178-nav">
        <a href="/lessons/geometry/177-point-to-line-distance">
          <ArrowLeft />
          <span>
            <small>Previous</small>
            <b>Point-to-Line Distance</b>
          </span>
        </a>
        <div>
          <span>Lesson progress</span>
          <i />
          <b>1 of 4</b>
        </div>
        <a href="/lessons/geometry/179-coordinate-transformations">
          <span>
            <small>Next</small>
            <b>Coordinate Transformations</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="cl178-footer">
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
