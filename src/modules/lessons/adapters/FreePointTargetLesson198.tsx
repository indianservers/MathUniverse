import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Circle,
  Eye,
  Grid3X3,
  Hand,
  HelpCircle,
  Maximize,
  MousePointer2,
  RotateCcw,
  Trash2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./FreePointTargetLesson198.css";

type Point = { x: number; y: number };
type Tool = "point" | "select" | "pan" | "zoom" | "delete";
const initialPoint = { x: 2, y: 1 };
const initialHistory = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 1, y: 1 },
  initialPoint,
];
const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));
const clean = (value: number) => (Math.abs(value) < 0.005 ? 0 : value);

function CoordinatePlane({
  point,
  exists,
  label,
  color,
  size,
  dashed,
  snap,
  tool,
  zoom,
  pan,
  onPoint,
  onPan,
  onDelete,
}: {
  point: Point;
  exists: boolean;
  label: string;
  color: string;
  size: number;
  dashed: boolean;
  snap: boolean;
  tool: Tool;
  zoom: number;
  pan: Point;
  onPoint: (point: Point) => void;
  onPan: (point: Point) => void;
  onDelete: () => void;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const action = useRef<"point" | "pan" | null>(null);
  const last = useRef({ x: 0, y: 0 });
  const origin = { x: 245 + pan.x, y: 225 + pan.y };
  const scale = 31 * zoom;
  const fromPointer = (event: PointerEvent<SVGSVGElement>) => {
    const box = ref.current!.getBoundingClientRect();
    const sx = ((event.clientX - box.left) / box.width) * 490;
    const sy = ((event.clientY - box.top) / box.height) * 450;
    const precision = snap ? 1 : 10;
    return {
      x: clamp(
        Math.round(((sx - origin.x) / scale) * precision) / precision,
        -7,
        7,
      ),
      y: clamp(
        Math.round(((origin.y - sy) / scale) * precision) / precision,
        -6,
        6,
      ),
    };
  };
  const px = origin.x + point.x * scale;
  const py = origin.y - point.y * scale;
  const start = (event: PointerEvent<SVGSVGElement>) => {
    if (tool === "delete" && exists) return onDelete();
    if (tool === "pan") {
      action.current = "pan";
      last.current = { x: event.clientX, y: event.clientY };
    } else if (tool === "point" || tool === "select") {
      action.current = "point";
      onPoint(fromPointer(event));
    }
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  return (
    <svg
      ref={ref}
      className={`fp198-plane tool-${tool}`}
      viewBox="0 0 490 450"
      role="img"
      aria-label="Free point P coordinate plane"
      tabIndex={0}
      onPointerDown={start}
      onPointerMove={(event) => {
        if (action.current === "point") onPoint(fromPointer(event));
        if (action.current === "pan") {
          onPan({
            x: pan.x + event.clientX - last.current.x,
            y: pan.y + event.clientY - last.current.y,
          });
          last.current = { x: event.clientX, y: event.clientY };
        }
      }}
      onPointerUp={() => (action.current = null)}
      onPointerCancel={() => (action.current = null)}
      onKeyDown={(event) => {
        const delta = snap ? 1 : 0.1;
        const moves: Record<string, Point> = {
          ArrowLeft: { x: -delta, y: 0 },
          ArrowRight: { x: delta, y: 0 },
          ArrowUp: { x: 0, y: delta },
          ArrowDown: { x: 0, y: -delta },
        };
        if (exists && moves[event.key]) {
          event.preventDefault();
          onPoint({
            x: clamp(clean(point.x + moves[event.key].x), -7, 7),
            y: clamp(clean(point.y + moves[event.key].y), -6, 6),
          });
        }
      }}
    >
      <defs>
        <pattern
          id="fp198-grid"
          width={scale}
          height={scale}
          patternUnits="userSpaceOnUse"
          x={origin.x}
          y={origin.y}
        >
          <path
            d={`M${scale} 0H0V${scale}`}
            fill="none"
            stroke="#dce6ef"
            strokeDasharray="3 3"
          />
        </pattern>
        <marker
          id="fp198-arrow"
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3.5"
          orient="auto"
        >
          <path d="M0 0L7 3.5L0 7Z" fill="#151b2d" />
        </marker>
      </defs>
      <rect width="490" height="450" fill="#fff" />
      <rect width="490" height="450" fill="url(#fp198-grid)" />
      <line
        x1="8"
        y1={origin.y}
        x2="482"
        y2={origin.y}
        className="axis"
        markerEnd="url(#fp198-arrow)"
      />
      <line
        x1={origin.x}
        y1="442"
        x2={origin.x}
        y2="8"
        className="axis"
        markerEnd="url(#fp198-arrow)"
      />
      {[-6, -4, -2, 0, 2, 4, 6].map((tick) => (
        <g key={`x-${tick}`}>
          <line
            x1={origin.x + tick * scale}
            y1={origin.y - 4}
            x2={origin.x + tick * scale}
            y2={origin.y + 4}
            className="tick"
          />
          <text x={origin.x + tick * scale} y={origin.y + 20}>
            {tick}
          </text>
        </g>
      ))}
      {[-6, -4, -2, 2, 4, 6].map((tick) => (
        <g key={`y-${tick}`}>
          <line
            x1={origin.x - 4}
            y1={origin.y - tick * scale}
            x2={origin.x + 4}
            y2={origin.y - tick * scale}
            className="tick"
          />
          <text
            x={origin.x - 12}
            y={origin.y - tick * scale + 4}
            textAnchor="end"
          >
            {tick}
          </text>
        </g>
      ))}
      <text x="474" y={origin.y - 10} className="axis-label">
        x
      </text>
      <text x={origin.x + 10} y="15" className="axis-label">
        y
      </text>
      {exists && (
        <g data-testid="free-point-handle" transform={`translate(${px} ${py})`}>
          <circle r={size + 4} fill="#fff" />
          <circle
            r={size}
            fill={color}
            stroke={dashed ? "#17213e" : color}
            strokeDasharray={dashed ? "2 2" : undefined}
          />
          <text x="16" y="-12" fill={color} className="point-label">
            {label}
          </text>
        </g>
      )}
      <g className="coordinate-chip" transform="translate(84 392)">
        <rect width="285" height="46" rx="8" />
        <circle cx="20" cy="23" r="6" fill={color} />
        <text x="35" y="27" className="chip-name">
          {exists ? label : "No point"}
        </text>
        <rect x="70" y="9" width="80" height="28" rx="5" />
        <text x="82" y="27">
          x
        </text>
        <text x="110" y="27" className="chip-value">
          {exists ? point.x.toFixed(2) : "--"}
        </text>
        <rect x="158" y="9" width="80" height="28" rx="5" />
        <text x="170" y="27">
          y
        </text>
        <text x="198" y="27" className="chip-value">
          {exists ? point.y.toFixed(2) : "--"}
        </text>
        <text x="258" y="28">
          {snap ? "▣" : "□"}
        </text>
      </g>
    </svg>
  );
}

const tools: Array<[Tool, string, typeof Circle]> = [
  ["point", "Point", Circle],
  ["select", "Select", MousePointer2],
  ["pan", "Pan", Hand],
  ["zoom", "Zoom", ZoomIn],
  ["delete", "Delete", Trash2],
];

export default function FreePointTargetLesson198({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [point, setPoint] = useState<Point>(initialPoint);
  const [exists, setExists] = useState(true);
  const [label, setLabel] = useState("P");
  const [color, setColor] = useState("#246be8");
  const [dashed, setDashed] = useState(false);
  const [size, setSize] = useState(6);
  const [snap, setSnap] = useState(true);
  const [tool, setTool] = useState<Tool>("point");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [history, setHistory] = useState<Point[]>(initialHistory);
  const [tab, setTab] = useState("Construction");
  const [step, setStep] = useState(0);
  const [worked, setWorked] = useState(true);
  const [qx, setQx] = useState(0);
  const [qy, setQy] = useState(0);
  const [qExists, setQExists] = useState(false);
  const [practice, setPractice] = useState<"idle" | "correct" | "incorrect">(
    "idle",
  );
  const interact = () => onInteraction();
  const reset = () => {
    setPoint(initialPoint);
    setExists(true);
    setLabel("P");
    setColor("#246be8");
    setDashed(false);
    setSize(6);
    setSnap(true);
    setTool("point");
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setHistory(initialHistory);
    setTab("Construction");
    setStep(0);
    setWorked(true);
    setQx(0);
    setQy(0);
    setQExists(false);
    setPractice("idle");
  };
  useEffect(reset, [resetToken]);
  const move = (next: Point) => {
    const normalized = {
      x: clean(Number(next.x.toFixed(2))),
      y: clean(Number(next.y.toFixed(2))),
    };
    setPoint(normalized);
    setExists(true);
    setHistory((items) => [...items.slice(-3), normalized]);
    interact();
  };
  const checked = qExists && qx === 4 && qy === -2;
  return (
    <main
      className="fp198-page"
      data-testid="dynamic-geometry-mockup-0255"
      data-dedicated-lesson="198"
      data-object-model="independent-free-point-coordinate-construction"
      data-point={`${point.x}:${point.y}`}
      data-tool={tool}
      data-snap={snap}
      data-exists={exists}
      data-practice={practice}
      data-tab={tab}
    >
      <header className="fp198-header">
        <section>
          <small>DYNAMIC GEOMETRY CONSTRUCTIONS</small>
          <h1>
            Free Point <span>♧</span>
          </h1>
          <p>Create independent points anywhere in the plane.</p>
        </section>
        <aside>
          <b>◷ &nbsp; 6-10 min</b>
          <b>▥ &nbsp; Beginner</b>
          <b>▧ &nbsp; Geometry Basics</b>
        </aside>
        <nav>
          {[
            ["Observe", "What is a free point?"],
            ["Manipulate", "Drag the point"],
            ["Notice", "Independent coordinates"],
            ["Understand", "Free point rule"],
            ["Try", "Practice it"],
          ].map(([title, body], index) => (
            <button
              key={title}
              className={step === index ? "active" : ""}
              onClick={() => {
                setStep(index);
                interact();
              }}
            >
              <i>{index + 1}</i>
              <strong>{title}</strong>
              <span>{body}</span>
            </button>
          ))}
        </nav>
      </header>
      <nav className="fp198-tabs">
        {["Construction", "Explain", "Examples", "Formulas", "Know more"].map(
          (name) => (
            <button
              key={name}
              className={tab === name ? "active" : ""}
              onClick={() => {
                setTab(name);
                interact();
              }}
            >
              {name === "Construction" ? "◉" : name === "Formulas" ? "∑" : "▧"}{" "}
              {name}
            </button>
          ),
        )}
      </nav>
      <section className="fp198-main">
        <article className="fp198-workspace">
          <header>
            <h2>
              Construction Workspace <HelpCircle />
            </h2>
          </header>
          <section className="fp198-stage">
            <nav className="fp198-tools">
              {tools.map(([id, name, Icon]) => (
                <button
                  key={id}
                  className={tool === id ? "active" : ""}
                  onClick={() => {
                    setTool(id);
                    interact();
                  }}
                >
                  <Icon />
                  {name}
                </button>
              ))}
            </nav>
            <div className="fp198-canvas-wrap">
              <button
                className={`fp198-snap ${snap ? "active" : ""}`}
                onClick={() => {
                  setSnap((v) => !v);
                  interact();
                }}
              >
                <Grid3X3 />
                Snap
                <br />
                to grid
              </button>
              <CoordinatePlane
                point={point}
                exists={exists}
                label={label || "P"}
                color={color}
                size={size}
                dashed={dashed}
                snap={snap}
                tool={tool}
                zoom={zoom}
                pan={pan}
                onPoint={move}
                onPan={(p) => {
                  setPan(p);
                  interact();
                }}
                onDelete={() => {
                  setExists(false);
                  setHistory([]);
                  interact();
                }}
              />
              <div className="fp198-zoom">
                <button
                  aria-label="Zoom in"
                  onClick={() => {
                    setZoom((v) => clamp(v + 0.15, 0.7, 1.45));
                    interact();
                  }}
                >
                  <ZoomIn />
                </button>
                <button
                  aria-label="Zoom out"
                  onClick={() => {
                    setZoom((v) => clamp(v - 0.15, 0.7, 1.45));
                    interact();
                  }}
                >
                  <ZoomOut />
                </button>
                <button
                  aria-label="Reset view"
                  onClick={() => {
                    setZoom(1);
                    setPan({ x: 0, y: 0 });
                    interact();
                  }}
                >
                  <Maximize />
                </button>
              </div>
            </div>
          </section>
          <footer className="fp198-history">
            <h3>
              <RotateCcw /> Undo history
            </h3>
            <div>
              <button
                onClick={() => {
                  setExists(false);
                  interact();
                }}
              >
                <span>○</span>Start
              </button>
              {history.map((item, index) => (
                <button
                  key={`${item.x}-${item.y}-${index}`}
                  onClick={() => {
                    setPoint(item);
                    setExists(true);
                    setHistory((all) => all.slice(0, index + 1));
                    interact();
                  }}
                >
                  <span>●</span>
                  {index ? "Move P" : "Add P"}
                </button>
              ))}
            </div>
          </footer>
        </article>
        <aside className="fp198-side">
          <article className="fp198-properties">
            <header>
              <h2>Point Properties</h2>
              <ChevronDown />
            </header>
            <p>
              <i style={{ background: color }} /> <b>{label || "P"}</b>{" "}
              <span>{exists ? "Free Point" : "Deleted"}</span>
            </p>
            <h3>Coordinates</h3>
            <div className="coords">
              <label>
                x
                <input
                  aria-label="Point x coordinate"
                  type="number"
                  step={snap ? 1 : 0.1}
                  value={point.x}
                  onChange={(e) =>
                    move({
                      x: clamp(Number(e.target.value), -7, 7),
                      y: point.y,
                    })
                  }
                />
              </label>
              <label>
                y
                <input
                  aria-label="Point y coordinate"
                  type="number"
                  step={snap ? 1 : 0.1}
                  value={point.y}
                  onChange={(e) =>
                    move({
                      x: point.x,
                      y: clamp(Number(e.target.value), -6, 6),
                    })
                  }
                />
              </label>
            </div>
            <label className="wide">
              Label
              <input
                aria-label="Point label"
                value={label}
                maxLength={3}
                onChange={(e) => {
                  setLabel(e.target.value);
                  interact();
                }}
              />
            </label>
            <h3>Appearance</h3>
            <div className="appearance">
              <label>
                <input
                  aria-label="Point color"
                  type="color"
                  value={color}
                  onChange={(e) => {
                    setColor(e.target.value);
                    interact();
                  }}
                />{" "}
                Color
              </label>
              <select
                aria-label="Point line style"
                value={dashed ? "dashed" : "solid"}
                onChange={(e) => {
                  setDashed(e.target.value === "dashed");
                  interact();
                }}
              >
                <option value="solid">━━ Solid</option>
                <option value="dashed">┅┅ Dashed</option>
              </select>
            </div>
            <h3>Point size</h3>
            <div className="stepper">
              <button
                aria-label="Decrease point size"
                onClick={() => {
                  setSize((v) => clamp(v - 1, 3, 10));
                  interact();
                }}
              >
                −
              </button>
              <output>{size}</output>
              <button
                aria-label="Increase point size"
                onClick={() => {
                  setSize((v) => clamp(v + 1, 3, 10));
                  interact();
                }}
              >
                +
              </button>
            </div>
          </article>
          <article className="fp198-observe">
            <h3>
              <Eye /> Observe
            </h3>
            <p>
              {exists
                ? `${label || "P"} = (${point.x.toFixed(2)}, ${point.y.toFixed(2)})`
                : "Point P is deleted"}
            </p>
            <b>Drag point P.</b>
            <span>Its coordinates change freely on both axes.</span>
          </article>
          <article className="fp198-tips">
            <h3>▣ &nbsp; Tools &amp; Tips</h3>
            <ul>
              <li>
                Use <b>Point</b> tool to add a free point.
              </li>
              <li>Drag to move the point anywhere.</li>
              <li>
                Toggle <b>Snap to grid</b> for precision.
              </li>
            </ul>
          </article>
        </aside>
      </section>
      <section className="fp198-cards">
        <article className="worked">
          <header>
            <h2>Worked Example</h2>
            <button
              onClick={() => {
                setWorked((v) => !v);
                interact();
              }}
            >
              {worked ? "Hide⌃" : "Show⌄"}
            </button>
          </header>
          {worked && (
            <>
              <p>Construct a free point at (-3, 4).</p>
              <ol>
                <li>
                  <i>1</i>Choose the <b>Point</b> tool.
                </li>
                <li>
                  <i>2</i>Click on (-3, 4) on the plane.
                </li>
                <li>
                  <i>3</i>A point P appears at (-3, 4).
                </li>
              </ol>
              <svg
                viewBox="0 0 250 150"
                aria-label="Worked example point negative three four"
              >
                <path d="M0 75H250M125 0V150" />
                <circle cx="65" cy="35" r="5" />
                <text x="72" y="30">
                  P(-3, 4)
                </text>
              </svg>
            </>
          )}
        </article>
        <article className="rule">
          <h2>☼ &nbsp; Understand the Rule</h2>
          <p>
            A <b>free point</b> is defined by any ordered pair of real numbers.
          </p>
          <strong>P = (x, y)</strong>
          <p>
            There are no constraints between x and y. Both coordinates can be
            any real number.
          </p>
          <section>
            <h3>Key Facts</h3>
            <p>✓ &nbsp; The point is independent of other objects.</p>
            <p>✓ &nbsp; It can be moved freely on the plane.</p>
            <p>✓ &nbsp; Its coordinates update continuously.</p>
          </section>
        </article>
        <article className="practice">
          <header>
            <h2>Try It: Your Turn</h2>
            <span>Practice⌄</span>
          </header>
          <p>Add a free point Q and place it at (4, -2).</p>
          <label>
            <input
              type="checkbox"
              checked={qExists}
              onChange={(e) => {
                setQExists(e.target.checked);
                setPractice("idle");
                interact();
              }}
            />{" "}
            Create point Q.
          </label>
          <div className="qcoords">
            <label>
              x
              <input
                aria-label="Practice Q x coordinate"
                type="number"
                value={qx}
                onChange={(e) => {
                  setQx(Number(e.target.value));
                  setPractice("idle");
                  interact();
                }}
              />
            </label>
            <label>
              y
              <input
                aria-label="Practice Q y coordinate"
                type="number"
                value={qy}
                onChange={(e) => {
                  setQy(Number(e.target.value));
                  setPractice("idle");
                  interact();
                }}
              />
            </label>
          </div>
          <label>
            <input type="checkbox" checked={checked} readOnly /> Set Q to (4,
            -2).
          </label>
          <label>
            <input type="checkbox" checked={practice === "correct"} readOnly />{" "}
            Verify the coordinates.
          </label>
          <button
            onClick={() => {
              setPractice(checked ? "correct" : "incorrect");
              interact();
            }}
          >
            <CheckCircle2 /> Check Answer
          </button>
          <output className={practice}>
            {practice === "correct"
              ? "Correct. Q is free at (4, -2)."
              : practice === "incorrect"
                ? "Create Q and enter (4, -2)."
                : "Need help? Toggle Snap to grid and use coordinate inputs."}
          </output>
        </article>
      </section>
      <nav className="fp198-nav">
        <a href="/lessons/geometry/197-force-vectors">
          <ArrowLeft />
          <span>
            Previous<b>Dynamic Geometry Intro</b>
          </span>
        </a>
        <div>
          Lesson 1 of 12
          <i>
            <b />
          </i>
        </div>
        <a href="/lessons/geometry/199-point-on-object">
          <span>
            Next<b>Point on Object</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="fp198-footer">
        <b>⚙ &nbsp; Math Universe</b>
        <span>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </span>
        <nav>
          <a href="/sitemap">Sitemap</a>
          <a href="/docs">Docs</a>
          <a href="/about">About</a>
        </nav>
        <small>© 2026 INDIAN SERVERS PRIVATE LIMITED.</small>
      </footer>
    </main>
  );
}
