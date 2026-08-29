import { ArrowLeft, ArrowRight, Lightbulb, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./ComponentFormTargetLesson184.css";

type Point = { x: number; y: number };
const INITIAL = { x: 3, y: 2 };
const TARGET = { x: -4, y: 1 };
const clamp = (value: number) => Math.max(-5, Math.min(5, Math.round(value)));

function ComponentGraph({
  vector,
  onVector,
}: {
  vector: Point;
  onVector: (point: Point) => void;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);
  const sx = (x: number) => 315 + x * 48;
  const sy = (y: number) => 275 - y * 48;
  const fromPointer = (event: PointerEvent<SVGSVGElement>) => {
    const rect = ref.current!.getBoundingClientRect();
    return {
      x: clamp((((event.clientX - rect.left) / rect.width) * 630 - 315) / 48),
      y: clamp((275 - ((event.clientY - rect.top) / rect.height) * 550) / 48),
    };
  };
  const onKeyDown = (event: KeyboardEvent<SVGCircleElement>) => {
    const moves: Record<string, Point> = {
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
      ArrowUp: { x: 0, y: 1 },
      ArrowDown: { x: 0, y: -1 },
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    onVector({ x: clamp(vector.x + move.x), y: clamp(vector.y + move.y) });
  };
  return (
    <svg
      ref={ref}
      className="cf184-graph"
      viewBox="0 0 630 550"
      aria-label="Component form vector plane"
      onPointerMove={(event) =>
        dragging.current && onVector(fromPointer(event))
      }
      onPointerUp={() => {
        dragging.current = false;
      }}
      onPointerLeave={() => {
        dragging.current = false;
      }}
    >
      <defs>
        <pattern
          id="cf184Grid"
          width="48"
          height="48"
          patternUnits="userSpaceOnUse"
        >
          <path d="M48 0H0V48" fill="none" stroke="#dce6ee" />
        </pattern>
        <marker
          id="cf184Arrow"
          markerWidth="9"
          markerHeight="9"
          refX="8"
          refY="4.5"
          orient="auto"
        >
          <path d="M0 0L9 4.5L0 9Z" fill="#0494be" />
        </marker>
        <marker
          id="cf184AxisArrow"
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3.5"
          orient="auto"
        >
          <path d="M0 0L7 3.5L0 7Z" fill="#27364b" />
        </marker>
      </defs>
      <rect width="630" height="550" fill="url(#cf184Grid)" />
      <line
        x1="0"
        x2="630"
        y1={sy(0)}
        y2={sy(0)}
        className="axis"
        markerEnd="url(#cf184AxisArrow)"
      />
      <line
        x1={sx(0)}
        x2={sx(0)}
        y1="550"
        y2="0"
        className="axis"
        markerEnd="url(#cf184AxisArrow)"
      />
      {Array.from({ length: 11 }, (_, index) => index - 5).map((value) => (
        <g key={value}>
          {value !== 0 && (
            <>
              <text x={sx(value) - 5} y={sy(0) + 20}>
                {value}
              </text>
              <text x={sx(0) - 21} y={sy(value) + 4}>
                {value}
              </text>
            </>
          )}
        </g>
      ))}
      <line
        x1={sx(0)}
        y1={sy(0)}
        x2={sx(vector.x)}
        y2={sy(0)}
        className="horizontal"
      />
      <line
        x1={sx(vector.x)}
        y1={sy(0)}
        x2={sx(vector.x)}
        y2={sy(vector.y)}
        className="vertical"
      />
      <line
        x1={sx(0)}
        y1={sy(0)}
        x2={sx(vector.x)}
        y2={sy(vector.y)}
        className="vector"
        markerEnd="url(#cf184Arrow)"
      />
      <circle
        data-testid="component-vector-tip"
        role="slider"
        aria-label="Component vector tip"
        tabIndex={0}
        cx={sx(vector.x)}
        cy={sy(vector.y)}
        r="10"
        onPointerDown={(event) => {
          dragging.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onKeyDown={onKeyDown}
      />
      <text x={sx(vector.x) + 14} y={sy(vector.y) - 12} className="tip-label">
        u ({vector.x}, {vector.y})
      </text>
      <text x={sx(vector.x / 2) - 10} y={sy(0) + 42} className="x-label">
        uₓ
      </text>
      <text x={sx(vector.x) + 25} y={sy(vector.y / 2)} className="y-label">
        uᵧ
      </text>
      <g className="cf184-legend">
        <rect x="10" y="10" width="160" height="130" rx="8" />
        <text x="25" y="34" className="title">
          Legend
        </text>
        <line x1="25" x2="52" y1="57" y2="57" className="vector" />
        <text x="62" y="61">
          Vector u
        </text>
        <line x1="25" x2="52" y1="82" y2="82" className="horizontal" />
        <text x="62" y="86">
          Horizontal (uₓ)
        </text>
        <line x1="25" x2="52" y1="107" y2="107" className="vertical" />
        <text x="62" y="111">
          Vertical (uᵧ)
        </text>
        <line x1="25" x2="52" y1="132" y2="132" className="projection" />
        <text x="62" y="136">
          Projection
        </text>
      </g>
      <g className="cf184-help">
        <rect x="12" y="405" width="164" height="125" rx="8" />
        <text x="27" y="430" className="title">
          How to interact
        </text>
        <text x="27" y="455">
          Drag the tip of u
        </text>
        <text x="27" y="473">
          or adjust the sliders.
        </text>
        <text x="27" y="496">
          Projections update
        </text>
        <text x="27" y="514">
          in real time.
        </text>
      </g>
    </svg>
  );
}

function Control({
  axis,
  value,
  onChange,
}: {
  axis: "x" | "y";
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="cf184-control">
      <b>
        {axis}-component (u<sub>{axis}</sub>)
      </b>
      <span>-5</span>
      <input
        aria-label={`${axis} component slider`}
        type="range"
        min="-5"
        max="5"
        step="1"
        value={value}
        onChange={(event) => onChange(+event.target.value)}
      />
      <span>5</span>
      <input
        aria-label={`${axis} component value`}
        type="number"
        min="-5"
        max="5"
        value={value}
        onChange={(event) => onChange(clamp(+event.target.value))}
      />
    </label>
  );
}

export default function ComponentFormTargetLesson184({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [vector, setVector] = useState(INITIAL),
    [stage, setStage] = useState(0),
    [hint, setHint] = useState(false),
    [feedback, setFeedback] = useState("");
  const magnitude = Math.hypot(vector.x, vector.y),
    angle = (Math.atan2(vector.y, vector.x) * 180) / Math.PI,
    distance = Math.abs(vector.x - TARGET.x) + Math.abs(vector.y - TARGET.y),
    stars = Math.max(0, 4 - Math.min(4, distance)),
    correct = distance === 0;
  const update = (next: Point) => {
    setVector(next);
    setFeedback("");
    onInteraction();
  };
  const reset = () => {
    setVector(INITIAL);
    setStage(0);
    setHint(false);
    setFeedback("");
    onInteraction();
  };
  useEffect(() => {
    setVector(INITIAL);
    setStage(0);
    setHint(false);
    setFeedback("");
  }, [resetToken]);
  return (
    <main
      className="cf184-page"
      data-testid="vector-mockup-0241"
      data-dedicated-lesson="184"
      data-object-model="signed-axis-projection-component-reconstruction-magnitude-direction-practice"
      data-vector={`${vector.x}:${vector.y}`}
      data-magnitude={magnitude.toFixed(4)}
      data-angle={angle.toFixed(3)}
      data-stage={stage}
      data-hint={hint}
      data-feedback={feedback}
      data-correct={correct}
    >
      <header className="cf184-header">
        <div>
          <span>GEOMETRY</span>
          <span>VECTORS</span>
          <h1>Component Form</h1>
          <p>Express vectors numerically.</p>
          <section>
            <b>◷ 6-10 min</b>
            <b>♙ Intermediate-Advanced</b>
            <b>ϟ Vector Tools</b>
            <b>◇ Applied Lab</b>
          </section>
        </div>
        <aside>
          <h2>You will learn to</h2>
          <p>✓ Find horizontal and vertical components</p>
          <p>✓ Write vectors in component (ordered-pair) form</p>
          <p>✓ Reconstruct a vector from its components</p>
        </aside>
      </header>
      <nav className="cf184-stages">
        {[
          ["Observe", "See the model"],
          ["Manipulate", "Drag & explore"],
          ["Notice", "Pattern & signs"],
          ["Understand", "The rule"],
          ["Try", "Apply it"],
        ].map(([title, note], index) => (
          <button
            key={title}
            className={stage === index ? "active" : ""}
            onClick={() => {
              setStage(index);
              onInteraction();
            }}
          >
            <i>{index + 1}</i>
            <b>{title}</b>
            <small>{note}</small>
          </button>
        ))}
      </nav>
      <section className="cf184-work">
        <article>
          <h2>Explore a Vector and Its Components</h2>
          <ComponentGraph vector={vector} onVector={update} />
          <button className="cf184-reset-view" onClick={reset}>
            <RotateCcw />
            Reset View
          </button>
        </article>
        <aside>
          <section>
            <h2>Adjust the vector</h2>
            <Control
              axis="x"
              value={vector.x}
              onChange={(value) => update({ ...vector, x: value })}
            />
            <Control
              axis="y"
              value={vector.y}
              onChange={(value) => update({ ...vector, y: value })}
            />
          </section>
          <section>
            <h2>Component Form</h2>
            <p>Ordered pair (uₓ, uᵧ)</p>
            <output>
              u = ( <b>{vector.x}</b> , <b>{vector.y}</b> )
            </output>
          </section>
          <section>
            <h2>Lengths (signed)</h2>
            <div>
              <output>
                |uₓ| with sign{" "}
                <b>
                  {vector.x >= 0 ? "+" : ""}
                  {vector.x}
                </b>
              </output>
              <output>
                |uᵧ| with sign{" "}
                <b>
                  {vector.y >= 0 ? "+" : ""}
                  {vector.y}
                </b>
              </output>
            </div>
          </section>
          <section>
            <h2>Magnitude & Angle</h2>
            <p>
              |u| = √(uₓ² + uᵧ²) <output>{magnitude.toFixed(2)}</output>
            </p>
            <p>
              Angle θ (from +x axis) <output>{angle.toFixed(2)}°</output>
            </p>
          </section>
          <section className="cf184-observation">
            <Lightbulb />
            <p>
              <b>Observation</b>
              <br />
              The projections on the axes are the components of u. Their signed
              lengths form the ordered pair (uₓ, uᵧ).
            </p>
          </section>
        </aside>
      </section>
      <section className="cf184-learn">
        <article id="component-example">
          <h2>Worked Example</h2>
          <h3>Find component form.</h3>
          <p>Let v have components vₓ = -2 and vᵧ = 4.</p>
          <ol>
            <li>From origin, go -2 units along x.</li>
            <li>From there, go +4 units along y.</li>
            <li>The vector ends at (-2,4).</li>
          </ol>
          <b>So, v = (-2, 4).</b>
          <svg viewBox="0 0 170 130">
            <line x1="100" y1="110" x2="55" y2="25" />
            <line x1="55" y1="25" x2="55" y2="110" strokeDasharray="5 4" />
          </svg>
        </article>
        <article id="component-formula">
          <h2>The Rule</h2>
          <h3>Component Form</h3>
          <output>u = (uₓ, uᵧ)</output>
          <p>uₓ = horizontal component (along x-axis)</p>
          <p>uᵧ = vertical component (along y-axis)</p>
          <p>u = uₓ i + uᵧ j</p>
          <h3>Reconstruction</h3>
          <p>From (uₓ,uᵧ), go uₓ units along x, then uᵧ units along y.</p>
        </article>
        <article id="component-practice">
          <header>
            <h2>Try It</h2>
            <b>Your Turn</b>
          </header>
          <p>Set the sliders to match the given component form.</p>
          <h3>Target: w = (-4, 1)</h3>
          <p>Adjust uₓ and uᵧ to reach the target.</p>
          <div className="cf184-stars">
            {Array.from({ length: 4 }, (_, index) => (
              <span key={index} className={index < stars ? "on" : ""}>
                ☆
              </span>
            ))}
          </div>
          <footer>
            <button
              onClick={() => {
                setFeedback(
                  correct
                    ? "Correct: w = (-4, 1)."
                    : "Not yet. Match both signed components.",
                );
                onInteraction();
              }}
            >
              Check Answer
            </button>
            <button
              onClick={() => {
                setHint((value) => !value);
                onInteraction();
              }}
            >
              <Lightbulb />
              Hint
            </button>
          </footer>
          <output>{feedback}</output>
          {hint && (
            <p className="cf184-hint">Move left to -4, then up to +1.</p>
          )}
        </article>
      </section>
      <nav className="cf184-nav">
        <a href="/lessons/geometry/183-vector-introduction">
          <ArrowLeft />
          <span>
            <small>Previous</small>
            <b>Vector Introduction</b>
          </span>
        </a>
        <div>
          <b>More on Vectors</b>
          <section>
            <a href="#component-example">▣ Examples</a>
            <a href="#component-formula">▤ Formulas</a>
            <a href="#component-practice">⌁ Practice Set</a>
          </section>
        </div>
        <a href="/lessons/geometry/185-position-vectors">
          <span>
            <small>Next</small>
            <b>Position Vectors</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="cf184-footer">
        <section>
          <b>⌁ Math Universe</b>
          <p>
            Interactive math labs, visual proofs, NCERT explorations, graphing,
            CAS-style tools, and classroom-ready activities.
          </p>
        </section>
        <section>
          <b>Resources</b>
          <a>Docs</a>
          <a>Formula Library</a>
          <a>Sitemap</a>
        </section>
        <section>
          <b>Community</b>
          <a>Blog</a>
          <a>Support</a>
          <a>Contact</a>
        </section>
        <section>
          <b>Company</b>
          <a>About</a>
          <a>Privacy</a>
          <a>Terms</a>
        </section>
        <section>
          <b>Stay Connected</b>
          <p>▶ ◎ ♥ in</p>
        </section>
        <small>
          © 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.
        </small>
      </footer>
    </main>
  );
}
