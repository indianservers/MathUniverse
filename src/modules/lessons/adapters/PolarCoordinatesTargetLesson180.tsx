import { ArrowLeft, ArrowRight, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./PolarCoordinatesTargetLesson180.css";
type Point = { x: number; y: number };
const rad = (d: number) => (d * Math.PI) / 180,
  deg = (r: number) => (r * 180) / Math.PI,
  clean = (v: number) => (Math.abs(v) < 0.005 ? 0 : v),
  fmt = (v: number, n = 2) => clean(v).toFixed(n),
  normalize = (v: number) => {
    const x = ((((v + 180) % 360) + 360) % 360) - 180;
    return x === -180 ? 180 : x;
  };
function Cartesian({
  point,
  onPoint,
}: {
  point: Point;
  onPoint: (p: Point) => void;
}) {
  const ref = useRef<SVGSVGElement>(null),
    drag = useRef(false),
    W = 300,
    H = 300,
    u = 20,
    ox = 150,
    oy = 150,
    sx = (x: number) => ox + x * u,
    sy = (y: number) => oy - y * u;
  const from = (e: PointerEvent<SVGSVGElement>) => {
    const b = ref.current!.getBoundingClientRect();
    return {
      x: Math.max(
        -7,
        Math.min(
          7,
          Math.round(((((e.clientX - b.left) / b.width) * W - ox) / u) * 4) / 4,
        ),
      ),
      y: Math.max(
        -7,
        Math.min(
          7,
          Math.round(((oy - ((e.clientY - b.top) / b.height) * H) / u) * 4) / 4,
        ),
      ),
    };
  };
  const key = (e: KeyboardEvent<SVGCircleElement>) => {
    const d: { [k: string]: Point } = {
      ArrowLeft: { x: -0.25, y: 0 },
      ArrowRight: { x: 0.25, y: 0 },
      ArrowUp: { x: 0, y: 0.25 },
      ArrowDown: { x: 0, y: -0.25 },
    };
    if (d[e.key]) {
      e.preventDefault();
      onPoint({ x: point.x + d[e.key].x, y: point.y + d[e.key].y });
    }
  };
  return (
    <svg
      ref={ref}
      className="pc180-cart"
      viewBox={`0 0 ${W} ${H}`}
      onPointerMove={(e) => drag.current && onPoint(from(e))}
      onPointerUp={() => (drag.current = false)}
      onPointerLeave={() => (drag.current = false)}
    >
      <defs>
        <pattern
          id="pc180-grid"
          width={u}
          height={u}
          patternUnits="userSpaceOnUse"
        >
          <path d={`M${u} 0H0V${u}`} fill="none" stroke="#dfe8ef" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill="url(#pc180-grid)" />
      <line x1="0" x2={W} y1={oy} y2={oy} />
      <line x1={ox} x2={ox} y1="0" y2={H} />
      <line
        x1={sx(point.x)}
        x2={sx(point.x)}
        y1={oy}
        y2={sy(point.y)}
        className="pc180-guide"
      />
      <line
        x1={ox}
        x2={sx(point.x)}
        y1={sy(point.y)}
        y2={sy(point.y)}
        className="pc180-guide"
      />
      <circle
        data-testid="polar-cartesian-point"
        role="slider"
        aria-label="Cartesian point P"
        tabIndex={0}
        cx={sx(point.x)}
        cy={sy(point.y)}
        r="7"
        onPointerDown={(e) => {
          drag.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onKeyDown={key}
      />
      <text x={sx(point.x) + 9} y={sy(point.y) - 8}>
        P
      </text>
      <text x={W - 12} y={oy - 8}>
        x
      </text>
      <text x={ox + 8} y="13">
        y
      </text>
    </svg>
  );
}
function Polar({
  r,
  theta,
  onPolar,
}: {
  r: number;
  theta: number;
  onPolar: (r: number, t: number) => void;
}) {
  const ref = useRef<SVGSVGElement>(null),
    drag = useRef(false),
    W = 300,
    H = 300,
    ox = 150,
    oy = 150,
    u = 19,
    sx = (rr: number, t: number) => ox + rr * u * Math.cos(rad(t)),
    sy = (rr: number, t: number) => oy - rr * u * Math.sin(rad(t));
  const from = (e: PointerEvent<SVGSVGElement>) => {
    const b = ref.current!.getBoundingClientRect(),
      x = (((e.clientX - b.left) / b.width) * W - ox) / u,
      y = (oy - ((e.clientY - b.top) / b.height) * H) / u;
    return {
      r: Math.min(7, Math.round(Math.hypot(x, y) * 4) / 4),
      t: normalize(Math.round(deg(Math.atan2(y, x)) * 4) / 4),
    };
  };
  const key = (e: KeyboardEvent<SVGCircleElement>) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      onPolar(r, normalize(theta - 5));
    }
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      onPolar(r, normalize(theta + 5));
    }
  };
  return (
    <svg
      ref={ref}
      className="pc180-polar"
      viewBox={`0 0 ${W} ${H}`}
      onPointerMove={(e) => {
        if (drag.current) {
          const p = from(e);
          onPolar(p.r, p.t);
        }
      }}
      onPointerUp={() => (drag.current = false)}
      onPointerLeave={() => (drag.current = false)}
    >
      {[1, 2, 3, 4, 5, 6, 7].map((v) => (
        <circle key={v} cx={ox} cy={oy} r={v * u} className="ring" />
      ))}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((v) => (
        <g key={v}>
          <line x1={ox} y1={oy} x2={sx(7, v)} y2={sy(7, v)} className="ray" />
          <text x={sx(7.45, v) - 8} y={sy(7.45, v) + 4}>
            {v}°
          </text>
        </g>
      ))}
      <line
        x1={ox}
        y1={oy}
        x2={sx(r, theta)}
        y2={sy(r, theta)}
        className="radius"
      />
      <circle
        data-testid="polar-radius-point"
        role="slider"
        aria-label="Polar point P"
        tabIndex={0}
        cx={sx(r, theta)}
        cy={sy(r, theta)}
        r="7"
        onPointerDown={(e) => {
          drag.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onKeyDown={key}
      />
      <text x={sx(r, theta) + 8} y={sy(r, theta) - 8}>
        P
      </text>
    </svg>
  );
}
export default function PolarCoordinatesTargetLesson180({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [r, setR] = useState(5),
    [theta, setTheta] = useState(53.13),
    [stage, setStage] = useState(0),
    [tab, setTab] = useState(0),
    [shared, setShared] = useState(false),
    [answers, setAnswers] = useState(["", "", "", ""]),
    [status, setStatus] = useState("");
  const point = { x: r * Math.cos(rad(theta)), y: r * Math.sin(rad(theta)) },
    quadrant =
      point.x >= 0 && point.y >= 0
        ? "I"
        : point.x < 0 && point.y >= 0
          ? "II"
          : point.x < 0 && point.y < 0
            ? "III"
            : "IV";
  const updatePolar = (nr: number, nt: number) => {
    setR(Math.max(0, Math.min(10, nr)));
    setTheta(normalize(nt));
    onInteraction();
  };
  const updatePoint = (p: Point) =>
    updatePolar(Math.hypot(p.x, p.y), deg(Math.atan2(p.y, p.x)));
  const reset = () => {
    setR(5);
    setTheta(53.13);
    setStage(0);
    setTab(0);
    setShared(false);
    setAnswers(["", "", "", ""]);
    setStatus("");
    onInteraction();
  };
  useEffect(() => {
    setR(5);
    setTheta(53.13);
    setStage(0);
    setTab(0);
    setShared(false);
    setAnswers(["", "", "", ""]);
    setStatus("");
  }, [resetToken]);
  const expected = [7 * Math.cos(rad(-30)), 7 * Math.sin(rad(-30)), 7, -30],
    correct = answers.every((v, i) => Math.abs(Number(v) - expected[i]) < 0.02);
  return (
    <main
      className="pc180-page"
      data-testid="geometry-mockup-0237"
      data-dedicated-lesson="180"
      data-object-model="bidirectional-cartesian-polar-coordinate-conversion"
      data-r={r.toFixed(3)}
      data-theta={theta.toFixed(3)}
      data-x={point.x.toFixed(3)}
      data-y={point.y.toFixed(3)}
      data-quadrant={quadrant}
      data-stage={stage}
      data-tab={tab}
      data-status={status}
    >
      <header className="pc180-header">
        <span>COORDINATE GEOMETRY</span>
        <h1>Polar Coordinates</h1>
        <p>Connect radius-angle pairs (r, θ) with points on the plane.</p>
        <section>
          <b>♙ Level: Intermediate</b>
          <b>⌁ Lab: Construction</b>
          <b>▣ View: Geometry / Graphing</b>
          <b>◷ Duration: 6-10 min</b>
        </section>
        <aside>
          <h3>Learning goals</h3>
          <p>✓ Plot points using (r, θ)</p>
          <p>✓ Convert between polar and Cartesian</p>
          <p>✓ Understand quadrant signs</p>
          <p>✓ Use the conversion formulas</p>
        </aside>
      </header>
      <nav className="pc180-stages">
        {[
          ["Observe", "See the connection"],
          ["Manipulate", "Drag and adjust"],
          ["Notice", "Find the pattern"],
          ["Understand", "Learn the rule"],
          ["Try", "Practice on your own"],
        ].map(([x, y], i) => (
          <button
            className={stage === i ? "active" : ""}
            key={x}
            onClick={() => {
              setStage(i);
              onInteraction();
            }}
          >
            <i>{i + 1}</i>
            <b>{x}</b>
            <small>{y}</small>
          </button>
        ))}
      </nav>
      <nav className="pc180-tabs">
        {["Interact", "Examples", "Formula", "Notes", "Practice"].map(
          (x, i) => (
            <button
              className={tab === i ? "active" : ""}
              key={x}
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
      <section className="pc180-explore">
        <header>
          <div>
            <h2>Explore the connection</h2>
            <p>Drag the point or adjust r and θ to see both views update.</p>
          </div>
          <div>
            <button onClick={reset}>
              <RotateCcw />
              Reset
            </button>
            <button
              onClick={() => {
                setShared(true);
                navigator.clipboard?.writeText(
                  `(${fmt(r)}, ${fmt(theta)}°) = (${fmt(point.x)}, ${fmt(point.y)})`,
                );
                onInteraction();
              }}
            >
              <Share2 />
              Share
            </button>
            <output>{shared ? "Copied" : ""}</output>
          </div>
        </header>
        <section>
          <article>
            <h3>Cartesian (x, y)</h3>
            <Cartesian point={point} onPoint={updatePoint} />
            <footer>
              Coordinates{" "}
              <output>
                (x, y) = ( <b>{fmt(point.x)}</b> , <b>{fmt(point.y)}</b> )
              </output>
            </footer>
          </article>
          <article>
            <h3>Polar (r, θ)</h3>
            <Polar r={r} theta={theta} onPolar={updatePolar} />
            <footer>
              Polar coordinates{" "}
              <output>
                (r, θ) = ( <b>{fmt(r)}</b> , <b>{fmt(theta)}°</b> )
              </output>
            </footer>
          </article>
          <aside>
            <h3>Adjust polar values</h3>
            <small>Live update</small>
            <label>
              Radius (r)<b>{fmt(r)}</b>
              <input
                aria-label="Polar radius"
                type="range"
                min="0"
                max="10"
                step=".25"
                value={r}
                onChange={(e) => updatePolar(Number(e.target.value), theta)}
              />
              <input
                aria-label="Polar radius value"
                type="number"
                min="0"
                max="10"
                step=".25"
                value={r}
                onChange={(e) => updatePolar(Number(e.target.value), theta)}
              />
            </label>
            <label>
              Angle (θ)<b>{fmt(theta)}°</b>
              <input
                aria-label="Polar angle"
                type="range"
                min="-180"
                max="180"
                step=".25"
                value={theta}
                onChange={(e) => updatePolar(r, Number(e.target.value))}
              />
              <input
                aria-label="Polar angle value"
                type="number"
                min="-180"
                max="180"
                step=".25"
                value={theta}
                onChange={(e) => updatePolar(r, Number(e.target.value))}
              />
            </label>
            <p>Quick angles</p>
            <div>
              {[0, 45, 90, 135, 180, 225, 270, 315].map((v) => (
                <button key={v} onClick={() => updatePolar(r, normalize(v))}>
                  {v}°
                </button>
              ))}
            </div>
            <section>
              <h3>Live conversion</h3>
              <p>
                x = r cos θ = {fmt(r)} cos {fmt(theta)}° = <b>{fmt(point.x)}</b>
              </p>
              <p>
                y = r sin θ = {fmt(r)} sin {fmt(theta)}° = <b>{fmt(point.y)}</b>
              </p>
            </section>
          </aside>
        </section>
        <footer>
          <div>
            <h3>💡 Observation</h3>
            <p>
              The point in the {quadrant} quadrant has{" "}
              {point.x >= 0 ? "x > 0" : "x < 0"},{" "}
              {point.y >= 0 ? "y > 0" : "y < 0"}, and r &gt; 0.
            </p>
          </div>
          {[
            ["I", "x > 0, y > 0", "0° < θ < 90°"],
            ["II", "x < 0, y > 0", "90° < θ < 180°"],
            ["III", "x < 0, y < 0", "180° < θ < 270°"],
            ["IV", "x > 0, y < 0", "270° < θ < 360°"],
          ].map((q) => (
            <div className={quadrant === q[0] ? "active" : ""} key={q[0]}>
              <b>Quadrant {q[0]}</b>
              <span>{q[1]}</span>
              <span>{q[2]}</span>
            </div>
          ))}
        </footer>
      </section>
      <section className="pc180-learn">
        <article>
          <h3>Worked example</h3>
          <b>Plot (r, θ) = (4, 135°).</b>
          <ol>
            <li>Start at the origin.</li>
            <li>Rotate counterclockwise 135°.</li>
            <li>Move out 4 units.</li>
            <li>Read Cartesian coordinates.</li>
          </ol>
          <svg viewBox="0 0 220 120">
            <line x1="10" x2="210" y1="85" y2="85" />
            <line x1="110" x2="110" y1="5" y2="115" />
            <line x1="110" y1="85" x2="60" y2="35" />
            <circle cx="60" cy="35" r="5" />
          </svg>
          <output>Result: (x, y) = (-2.83, 2.83)</output>
        </article>
        <article>
          <h3>The rule</h3>
          <p>Convert between polar and Cartesian coordinates (r ≥ 0).</p>
          <section>
            <b>Polar → Cartesian</b>
            <output>
              x = r cos θ<br />y = r sin θ
            </output>
          </section>
          <section>
            <b>Cartesian → Polar</b>
            <output>
              r = √(x² + y²)
              <br />θ = atan2(y, x)
            </output>
          </section>
          <p>ⓘ Use atan2 to get the correct quadrant.</p>
        </article>
        <article>
          <h3>Practice this</h3>
          <p>Plot (r, θ) = (7, -30°) and find (x, y). Then convert back.</p>
          <svg viewBox="0 0 260 135">
            <line x1="10" x2="250" y1="60" y2="60" />
            <line x1="120" x2="120" y1="5" y2="130" />
            <line x1="120" y1="60" x2="225" y2="115" strokeDasharray="4 3" />
            <circle cx="225" cy="115" r="5" />
          </svg>
          <div>
            {["x coordinate", "y coordinate", "radius back", "angle back"].map(
              (label, i) => (
                <input
                  aria-label={label}
                  type="number"
                  key={label}
                  value={answers[i]}
                  onChange={(e) =>
                    setAnswers((v) =>
                      v.map((x, j) => (i === j ? e.target.value : x)),
                    )
                  }
                />
              ),
            )}
          </div>
          <button
            onClick={() => {
              setStatus(
                correct
                  ? "Correct polar conversion"
                  : "Recheck the formulas and signs",
              );
              onInteraction();
            }}
          >
            Check my answer
          </button>
          <output>{status}</output>
        </article>
      </section>
      <nav className="pc180-nav">
        <a href="/lessons/geometry/179-coordinate-transformations">
          <ArrowLeft />
          <span>
            <small>Previous</small>
            <b>Coordinate Transformations</b>
          </span>
        </a>
        <div>
          {[1, 2, 3, 4, 5].map((x, i) => (
            <button
              className={stage === i ? "active" : ""}
              key={x}
              onClick={() => {
                setStage(i);
                onInteraction();
              }}
            >
              {x}
            </button>
          ))}
        </div>
        <a href="/lessons/geometry/181-parametric-coordinates">
          <span>
            <small>Next</small>
            <b>Parametric Coordinates</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="pc180-footer">
        <div>
          <b>⌁ Math Universe</b>
          <p>
            Interactive math labs, visual proofs, NCERT explorations, and
            classroom-ready activities.
          </p>
        </div>
        <div>
          <b>Quick links</b>
          <a>Sitemap</a>
          <a>Docs</a>
          <a>About</a>
        </div>
        <div>
          <b>Need help?</b>
          <p>
            Explore topics, formulas, and examples with interactive
            visualizations.
          </p>
          <button
            onClick={() => {
              setTab(0);
              onInteraction();
            }}
          >
            Open Math Workspace ↗
          </button>
        </div>
      </footer>
    </main>
  );
}
