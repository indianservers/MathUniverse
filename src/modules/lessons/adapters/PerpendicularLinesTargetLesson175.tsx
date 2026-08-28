import {
  ArrowLeft,
  ArrowRight,
  Globe2,
  Lock,
  LockOpen,
  Maximize2,
  RotateCcw,
  Share2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./PerpendicularLinesTargetLesson175.css";

type LineId = 1 | 2;
const normalize = (angle: number) => ((angle % 180) + 180) % 180;
const slopeFor = (angle: number) =>
  Math.abs(Math.cos((angle * Math.PI) / 180)) < 0.0001
    ? null
    : Math.tan((angle * Math.PI) / 180);
const slopeText = (m: number | null) =>
  m === null ? "undefined" : Math.abs(m) < 0.005 ? "0" : m.toFixed(2);
const productText = (a: number | null, b: number | null) =>
  a === null || b === null ? "special pair" : (a * b).toFixed(2);

function PerpendicularGraph({
  theta1,
  theta2,
  onAngle,
  zoom = 1,
  practice = false,
}: {
  theta1: number;
  theta2: number;
  onAngle?: (id: LineId, angle: number) => void;
  zoom?: number;
  practice?: boolean;
}) {
  const ref = useRef<SVGSVGElement>(null),
    drag = useRef<LineId | null>(null),
    W = practice ? 390 : 500,
    H = practice ? 240 : 440,
    ox = W / 2,
    oy = H / 2,
    u = 34 * zoom;
  const end = (angle: number, direction: number) => {
    const r = (angle * Math.PI) / 180;
    return {
      x: ox + direction * Math.cos(r) * u * 8,
      y: oy - direction * Math.sin(r) * u * 8,
    };
  };
  const setFromPointer = (id: LineId, e: PointerEvent<SVGSVGElement>) => {
    const box = ref.current!.getBoundingClientRect(),
      x = ((e.clientX - box.left) / box.width) * W - ox,
      y = oy - ((e.clientY - box.top) / box.height) * H;
    onAngle?.(id, normalize((Math.atan2(y, x) * 180) / Math.PI));
  };
  const key = (id: LineId, e: KeyboardEvent<SVGCircleElement>) => {
    if (!onAngle) return;
    const current = id === 1 ? theta1 : theta2;
    if (e.key === "ArrowUp" || e.key === "ArrowRight") {
      e.preventDefault();
      onAngle(id, normalize(current + 1));
    }
    if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
      e.preventDefault();
      onAngle(id, normalize(current - 1));
    }
  };
  return (
    <svg
      ref={ref}
      className={`perp175-graph${practice ? " practice" : ""}`}
      viewBox={`0 0 ${W} ${H}`}
      onPointerMove={(e) => {
        if (drag.current) setFromPointer(drag.current, e);
      }}
      onPointerUp={() => (drag.current = null)}
      onPointerLeave={() => (drag.current = null)}
    >
      <defs>
        <pattern
          id={practice ? "perp175-pgrid" : "perp175-grid"}
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
        fill={`url(#${practice ? "perp175-pgrid" : "perp175-grid"})`}
      />
      <line x1="0" x2={W} y1={oy} y2={oy} className="axis" />
      <line x1={ox} x2={ox} y1="0" y2={H} className="axis" />
      {[
        [1, theta1, "#1678e8"],
        [2, theta2, "#8337dc"],
      ].map(([id, theta, color]) => {
        const n = id as LineId,
          a = theta as number,
          p1 = end(a, -1),
          p2 = end(a, 1),
        handle = end(a, 0.55);
        return (
          <g key={n}>
            <line
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke={color as string}
              className="line"
            />
            <circle
              data-testid={`${practice ? "practice-" : ""}perpendicular-line-${n}`}
              role="slider"
              tabIndex={0}
              aria-label={`Drag ${practice ? "practice " : ""}line ${n}`}
              cx={handle.x}
              cy={handle.y}
              r="7"
              fill={color as string}
              onPointerDown={(e) => {
                e.stopPropagation();
                drag.current = n;
                e.currentTarget.setPointerCapture(e.pointerId);
              }}
              onKeyDown={(e) => key(n, e)}
            />
            <text x={handle.x + 10} y={handle.y - 10} fill={color as string}>
              m{n} = {slopeText(slopeFor(a))}
            </text>
          </g>
        );
      })}
      <path
        d={`M${ox} ${oy - 18}l18 18 -18 18 -18-18Z`}
        className="right-angle"
      />
    </svg>
  );
}

export default function PerpendicularLinesTargetLesson175({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [theta1, setTheta1] = useState(55),
    [theta2, setTheta2] = useState(145),
    [locked, setLocked] = useState(true),
    [zoom, setZoom] = useState(1),
    [tab, setTab] = useState(0),
    [language, setLanguage] = useState("English (English)"),
    [shared, setShared] = useState(false),
    [practiceTheta, setPracticeTheta] = useState(10),
    [practiceStatus, setPracticeStatus] = useState("");
  const m1 = slopeFor(theta1),
    m2 = slopeFor(theta2),
    perpendicular = Math.abs(normalize(theta2 - theta1) - 90) < 0.05,
    practiceM = slopeFor(practiceTheta),
    practicePurple = -2.75,
    practiceProduct = practiceM === null ? null : practiceM * practicePurple;
  const setAngle = (id: LineId, angle: number) => {
    if (id === 1) {
      setTheta1(angle);
      if (locked) setTheta2(normalize(angle + 90));
    } else if (!locked) setTheta2(angle);
    onInteraction();
  };
  const reset = () => {
    setTheta1(55);
    setTheta2(145);
    setLocked(true);
    setZoom(1);
    setTab(0);
    setLanguage("English (English)");
    setShared(false);
    setPracticeTheta(10);
    setPracticeStatus("");
    onInteraction();
  };
  useEffect(() => {
    setTheta1(55);
    setTheta2(145);
    setLocked(true);
    setZoom(1);
    setTab(0);
    setLanguage("English (English)");
    setShared(false);
    setPracticeTheta(10);
    setPracticeStatus("");
  }, [resetToken]);
  return (
    <main
      className="perp175-page"
      data-testid="geometry-mockup-0232"
      data-dedicated-lesson="175"
      data-object-model="two-angle-pointer-keyboard-draggable-lines-negative-reciprocal-lock-product-right-angle-special-cases-construction-and-independent-graded-practice"
      data-theta1={theta1.toFixed(1)}
      data-theta2={theta2.toFixed(1)}
      data-m1={slopeText(m1)}
      data-m2={slopeText(m2)}
      data-product={productText(m1, m2)}
      data-perpendicular={perpendicular}
      data-locked={locked}
      data-zoom={zoom.toFixed(1)}
      data-tab={tab}
      data-language={language}
      data-practice-angle={practiceTheta.toFixed(1)}
      data-practice-status={practiceStatus}
    >
      <header className="perp175-header">
        <h1>Perpendicular Lines</h1>
        <p>Understand right-angle slopes.</p>
        <div>
          <b>♙ Intermediate</b>
          <b>◉ Construction Lab</b>
          <b>▣ Geometry / Graphing View</b>
          <b>◷ 6-10 min</b>
        </div>
        <aside>
          <label>
            <Globe2 />
            <select
              aria-label="Lesson language"
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                onInteraction();
              }}
            >
              <option>English (English)</option>
              <option>Hindi (हिन्दी)</option>
            </select>
          </label>
          <button
            onClick={() => {
              setShared(true);
              onInteraction();
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
      <nav className="perp175-tabs">
        {[
          ["Explore", "Observe & manipulate"],
          ["Pattern", "Notice the relationship"],
          ["Rule", "Understand the result"],
          ["Practice", "Try it yourself"],
        ].map(([x, y], i) => (
          <button
            key={x}
            className={tab === i ? "active" : ""}
            onClick={() => {
              setTab(i);
              onInteraction();
            }}
          >
            <b>{x}</b>
            <small>{y}</small>
          </button>
        ))}
      </nav>
      <section className="perp175-main">
        <article>
          <header>
            <i>1</i>
            <div>
              <h2>Manipulate the lines</h2>
              <p>
                Rotate the blue line. The purple line stays perpendicular while
                locked.
              </p>
            </div>
            <button
              aria-pressed={locked}
              onClick={() => {
                if (!locked) setTheta2(normalize(theta1 + 90));
                setLocked((v) => !v);
                onInteraction();
              }}
            >
              {locked ? <Lock /> : <LockOpen />}
              {locked ? "Lock perpendicular" : "Unlock lines"}
            </button>
          </header>
          <div className="perp175-stage">
            <aside>
              <section>
                <h3>Blue line (Line 1)</h3>
                <label>
                  Angle θ <b>{theta1.toFixed(0)}°</b>
                  <input
                    aria-label="Blue line angle"
                    type="range"
                    min="0"
                    max="179"
                    value={theta1}
                    onChange={(e) => setAngle(1, Number(e.target.value))}
                  />
                </label>
                <p>
                  Slope m₁ <b>{slopeText(m1)}</b>
                </p>
              </section>
              <section>
                <h3>Purple line (Line 2)</h3>
                <label>
                  Angle θ + 90° <b>{theta2.toFixed(0)}°</b>
                  <input
                    aria-label="Purple line angle"
                    disabled={locked}
                    type="range"
                    min="0"
                    max="179"
                    value={theta2}
                    onChange={(e) => setAngle(2, Number(e.target.value))}
                  />
                </label>
                <p>
                  Slope m₂ <b>{slopeText(m2)}</b>
                </p>
              </section>
            </aside>
            <div>
              <PerpendicularGraph
                theta1={theta1}
                theta2={theta2}
                onAngle={setAngle}
                zoom={zoom}
              />
              <footer>
                <button
                  aria-label="Zoom out"
                  onClick={() => {
                    setZoom((v) => Math.max(0.7, v - 0.1));
                    onInteraction();
                  }}
                >
                  <ZoomOut />
                </button>
                <button
                  aria-label="Zoom in"
                  onClick={() => {
                    setZoom((v) => Math.min(1.4, v + 0.1));
                    onInteraction();
                  }}
                >
                  <ZoomIn />
                </button>
                <button
                  onClick={() => {
                    setZoom(1);
                    onInteraction();
                  }}
                >
                  <Maximize2 />
                  Fit
                </button>
              </footer>
            </div>
          </div>
        </article>
        <aside>
          <header>
            <i>2</i>
            <h2>Observe</h2>
            <p>Check the relationship.</p>
          </header>
          <section>
            <h3>Product of slopes</h3>
            <output>m₁ × m₂ = {productText(m1, m2)}</output>
            <b className={perpendicular ? "correct" : ""}>
              {perpendicular ? "✓ Perpendicular" : "Not perpendicular"}
            </b>
          </section>
          <section>
            <h3>
              Line equations <small>(through origin)</small>
            </h3>
            <p>Line 1: y = {slopeText(m1)}x</p>
            <p>Line 2: y = {slopeText(m2)}x</p>
          </section>
          <section>
            <h3>Special cases</h3>
            <p>
              <b>Horizontal line (m=0)</b>
              <br />
              Perpendicular slope → undefined.
            </p>
            <p>
              <b>Vertical line (m=undefined)</b>
              <br />
              Perpendicular slope → 0.
            </p>
          </section>
        </aside>
      </section>
      <section className="perp175-rule">
        <article>
          <h2>
            <i>3</i> See a construction
          </h2>
          <p>Given Line 1: y=2x+1, construct a perpendicular Line 2.</p>
          <ol>
            <li>Identify slope m₁=2.</li>
            <li>Take negative reciprocal m₂=-1/2.</li>
            <li>Choose (0,1) as the intersection.</li>
            <li>Write y=-1/2x+1.</li>
          </ol>
        </article>
        <article>
          <PerpendicularGraph
            theta1={(Math.atan(2) * 180) / Math.PI}
            theta2={normalize((Math.atan(2) * 180) / Math.PI + 90)}
            zoom={0.7}
          />
        </article>
        <article>
          <h2>
            <i>4</i> Understand the rule
          </h2>
          <section>
            <h3>Rule for perpendicular lines</h3>
            <p>If two non-vertical lines are perpendicular, then</p>
            <output>m₁ × m₂ = -1</output>
            <p>Equivalently, m₂=-1/m₁.</p>
            <b>Special perpendicular pairs</b>
            <p>m=0 ⟂ m=undefined</p>
          </section>
        </article>
      </section>
      <section className="perp175-practice">
        <header>
          <h2>
            <i>5</i> Try it yourself
          </h2>
          <p>
            Drag the blue line to make it perpendicular to the fixed purple
            line. Then check your result.
          </p>
        </header>
        <aside>
          <section>
            <h3>Product check</h3>
            <output>
              m₁ × m₂ ={" "}
              {practiceProduct === null
                ? "undefined"
                : practiceProduct.toFixed(2)}
            </output>
          </section>
          <section>
            <h3>Status</h3>
            <p>{practiceStatus || "Align lines to make product -1."}</p>
          </section>
        </aside>
        <PerpendicularGraph
          practice
          theta1={practiceTheta}
          theta2={normalize((Math.atan(practicePurple) * 180) / Math.PI)}
          onAngle={(id, a) => {
            if (id === 1) {
              setPracticeTheta(a);
              setPracticeStatus("");
              onInteraction();
            }
          }}
        />
        <section>
          <h3>Adjust blue line</h3>
          <label>
            Angle θ <b>{practiceTheta.toFixed(0)}°</b>
            <input
              aria-label="Practice blue angle"
              type="range"
              min="0"
              max="179"
              value={practiceTheta}
              onChange={(e) => {
                setPracticeTheta(Number(e.target.value));
                setPracticeStatus("");
                onInteraction();
              }}
            />
          </label>
          <p>
            Slope m₁ <b>{slopeText(practiceM)}</b>
          </p>
          <output>
            Perpendicular target m₁ = {(-1 / practicePurple).toFixed(2)}
          </output>
          <button
            onClick={() => {
              setPracticeStatus(
                practiceProduct !== null && Math.abs(practiceProduct + 1) < 0.03
                  ? "Correct perpendicular pair"
                  : "Keep rotating the blue line",
              );
              onInteraction();
            }}
          >
            Check
          </button>
        </section>
      </section>
      <nav className="perp175-nav">
        <a href="/lessons/geometry/174-parallel-lines">
          <ArrowLeft />
          <span>
            <small>Previous</small>
            <b>Parallel Lines</b>
          </span>
        </a>
        <a href="/lessons/geometry/176-angle-between-lines">
          <span>
            <small>Next</small>
            <b>Angle Between Lines</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
    </main>
  );
}
