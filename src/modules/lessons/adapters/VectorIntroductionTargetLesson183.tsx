import { ArrowLeft, ArrowRight, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./VectorIntroductionTargetLesson183.css";

type Point = { x: number; y: number };
type Drag = "a" | "b";
const START_A = { x: 0, y: 0 };
const START_B = { x: 3, y: 2 };
const clamp = (value: number) => Math.max(-10, Math.min(10, Math.round(value)));

function VectorGraph({
  a,
  b,
  components,
  onPoint,
}: {
  a: Point;
  b: Point;
  components: boolean;
  onPoint: (key: Drag, point: Point) => void;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const dragging = useRef<Drag | null>(null);
  const sx = (x: number) => 315 + x * 25;
  const sy = (y: number) => 265 - y * 25;
  const world = (event: PointerEvent<SVGSVGElement>) => {
    const rect = ref.current!.getBoundingClientRect();
    return {
      x: clamp((((event.clientX - rect.left) / rect.width) * 630 - 315) / 25),
      y: clamp((265 - ((event.clientY - rect.top) / rect.height) * 475) / 25),
    };
  };
  const key = (which: Drag) => (event: KeyboardEvent<SVGCircleElement>) => {
    const delta: Record<string, Point> = {
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
      ArrowUp: { x: 0, y: 1 },
      ArrowDown: { x: 0, y: -1 },
    };
    if (!delta[event.key]) return;
    event.preventDefault();
    const point = which === "a" ? a : b;
    onPoint(which, {
      x: clamp(point.x + delta[event.key].x),
      y: clamp(point.y + delta[event.key].y),
    });
  };
  const u = { x: b.x - a.x, y: b.y - a.y };
  const translatedA = { x: 1, y: -1 };
  const translatedB = { x: translatedA.x + u.x, y: translatedA.y + u.y };
  return (
    <svg
      ref={ref}
      className="vi183-graph"
      viewBox="0 0 630 475"
      aria-label="Interactive vector plane"
      onPointerMove={(event) => {
        if (dragging.current) onPoint(dragging.current, world(event));
      }}
      onPointerUp={() => {
        dragging.current = null;
      }}
      onPointerLeave={() => {
        dragging.current = null;
      }}
    >
      <defs>
        <pattern
          id="vi183Grid"
          width="25"
          height="25"
          patternUnits="userSpaceOnUse"
        >
          <path d="M25 0H0V25" fill="none" stroke="#dfe7ef" />
        </pattern>
        <marker
          id="vi183Blue"
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="4"
          orient="auto"
        >
          <path d="M0 0L8 4L0 8Z" fill="#0397cf" />
        </marker>
        <marker
          id="vi183Purple"
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="4"
          orient="auto"
        >
          <path d="M0 0L8 4L0 8Z" fill="#7c3aed" />
        </marker>
      </defs>
      <rect width="630" height="475" fill="url(#vi183Grid)" />
      <line x1="0" x2="630" y1={sy(0)} y2={sy(0)} className="axis" />
      <line x1={sx(0)} x2={sx(0)} y1="0" y2="475" className="axis" />
      {Array.from({ length: 11 }, (_, i) => i * 2 - 10).map((value) => (
        <g key={value}>
          <text x={sx(value) - 6} y={sy(0) + 18}>
            {value}
          </text>
          {value !== 0 && (
            <text x={sx(0) - 22} y={sy(value) + 4}>
              {value}
            </text>
          )}
        </g>
      ))}
      {components && (
        <>
          <line
            x1={sx(a.x)}
            y1={sy(a.y)}
            x2={sx(b.x)}
            y2={sy(a.y)}
            className="component"
          />
          <line
            x1={sx(b.x)}
            y1={sy(a.y)}
            x2={sx(b.x)}
            y2={sy(b.y)}
            className="component"
          />
        </>
      )}
      <line
        x1={sx(a.x)}
        y1={sy(a.y)}
        x2={sx(b.x)}
        y2={sy(b.y)}
        className="vector"
        markerEnd="url(#vi183Blue)"
      />
      <line
        x1={sx(translatedA.x)}
        y1={sy(translatedA.y)}
        x2={sx(translatedB.x)}
        y2={sy(translatedB.y)}
        className="equivalent"
        markerEnd="url(#vi183Purple)"
      />
      <circle
        data-testid="vector-point-a"
        role="slider"
        aria-label="Initial point A"
        tabIndex={0}
        cx={sx(a.x)}
        cy={sy(a.y)}
        r="8"
        className="point-a"
        onPointerDown={(event) => {
          dragging.current = "a";
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onKeyDown={key("a")}
      />
      <circle
        data-testid="vector-point-b"
        role="slider"
        aria-label="Terminal point B"
        tabIndex={0}
        cx={sx(b.x)}
        cy={sy(b.y)}
        r="8"
        className="point-b"
        onPointerDown={(event) => {
          dragging.current = "b";
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onKeyDown={key("b")}
      />
      <text x={sx(a.x) - 60} y={sy(a.y) - 12} className="label green">
        A ({a.x}, {a.y})
      </text>
      <text x={sx(b.x) + 12} y={sy(b.y) - 12} className="label green">
        B ({b.x}, {b.y})
      </text>
      <text
        x={sx((a.x + b.x) / 2) - 8}
        y={sy((a.y + b.y) / 2) - 12}
        className="label blue"
      >
        u
      </text>
      <text
        x={sx(translatedB.x) + 12}
        y={sy(translatedB.y) + 8}
        className="label purple"
      >
        u′
      </text>
    </svg>
  );
}

function PracticeGraph({
  vector,
  onVector,
}: {
  vector: Point;
  onVector: (point: Point) => void;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const drag = useRef(false);
  const sx = (x: number) => 145 + x * 24;
  const sy = (y: number) => 100 - y * 24;
  const move = (event: PointerEvent<SVGSVGElement>) => {
    const rect = ref.current!.getBoundingClientRect();
    onVector({
      x: clamp((((event.clientX - rect.left) / rect.width) * 290 - 145) / 24),
      y: clamp((100 - ((event.clientY - rect.top) / rect.height) * 190) / 24),
    });
  };
  return (
    <svg
      ref={ref}
      className="vi183-practice-graph"
      viewBox="0 0 290 190"
      aria-label="Practice vector plane"
      onPointerMove={(event) => drag.current && move(event)}
      onPointerUp={() => {
        drag.current = false;
      }}
    >
      <defs>
        <pattern
          id="vi183SmallGrid"
          width="24"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          <path d="M24 0H0V24" fill="none" stroke="#e3eaf0" />
        </pattern>
        <marker
          id="vi183PracticeArrow"
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="4"
          orient="auto"
        >
          <path d="M0 0L8 4L0 8Z" fill="#0397cf" />
        </marker>
      </defs>
      <rect width="290" height="190" fill="url(#vi183SmallGrid)" />
      <line x1="0" x2="290" y1={sy(0)} y2={sy(0)} className="axis" />
      <line x1={sx(0)} x2={sx(0)} y1="0" y2="190" className="axis" />
      <line
        x1={sx(0)}
        y1={sy(0)}
        x2={sx(vector.x)}
        y2={sy(vector.y)}
        className="vector"
        markerEnd="url(#vi183PracticeArrow)"
      />
      <circle
        data-testid="vector-practice-tip"
        role="slider"
        aria-label="Practice vector tip"
        tabIndex={0}
        cx={sx(vector.x)}
        cy={sy(vector.y)}
        r="9"
        onPointerDown={(event) => {
          drag.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onKeyDown={(event) => {
          const d: Record<string, Point> = {
            ArrowLeft: { x: -1, y: 0 },
            ArrowRight: { x: 1, y: 0 },
            ArrowUp: { x: 0, y: 1 },
            ArrowDown: { x: 0, y: -1 },
          };
          if (d[event.key]) {
            event.preventDefault();
            onVector({
              x: clamp(vector.x + d[event.key].x),
              y: clamp(vector.y + d[event.key].y),
            });
          }
        }}
      />
    </svg>
  );
}

export default function VectorIntroductionTargetLesson183({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [a, setA] = useState(START_A),
    [b, setB] = useState(START_B),
    [draftA, setDraftA] = useState(START_A),
    [draftB, setDraftB] = useState(START_B),
    [components, setComponents] = useState(true),
    [stage, setStage] = useState(0),
    [language, setLanguage] = useState("English (English)"),
    [shared, setShared] = useState(false),
    [practice, setPractice] = useState({ x: 2, y: -3 }),
    [answers, setAnswers] = useState({ x: false, y: false }),
    [feedback, setFeedback] = useState("");
  const u = { x: b.x - a.x, y: b.y - a.y },
    magnitude = Math.hypot(u.x, u.y),
    angle = (Math.atan2(u.y, u.x) * 180) / Math.PI;
  const updatePoint = (which: Drag, point: Point) => {
    (which === "a" ? setA : setB)(point);
    (which === "a" ? setDraftA : setDraftB)(point);
    onInteraction();
  };
  const updateComponent = (axis: "x" | "y", value: number) => {
    setB((current) => {
      const next = { ...current, [axis]: a[axis] + value };
      setDraftB(next);
      return next;
    });
    onInteraction();
  };
  const reset = () => {
    setA(START_A);
    setB(START_B);
    setDraftA(START_A);
    setDraftB(START_B);
    setComponents(true);
    setStage(0);
    setLanguage("English (English)");
    setShared(false);
    setPractice({ x: 2, y: -3 });
    setAnswers({ x: false, y: false });
    setFeedback("");
    onInteraction();
  };
  useEffect(() => {
    setA(START_A);
    setB(START_B);
    setDraftA(START_A);
    setDraftB(START_B);
    setComponents(true);
    setStage(0);
    setLanguage("English (English)");
    setShared(false);
    setPractice({ x: 2, y: -3 });
    setAnswers({ x: false, y: false });
    setFeedback("");
  }, [resetToken]);
  const correct =
    practice.x === 2 && practice.y === -3 && answers.x && answers.y;
  return (
    <main
      className="vi183-page"
      data-testid="vector-mockup-0240"
      data-dedicated-lesson="183"
      data-object-model="two-point-vector-component-magnitude-direction-equivalent-translation-practice"
      data-a={`${a.x}:${a.y}`}
      data-b={`${b.x}:${b.y}`}
      data-vector={`${u.x}:${u.y}`}
      data-magnitude={magnitude.toFixed(4)}
      data-angle={angle.toFixed(3)}
      data-components={components}
      data-stage={stage}
      data-practice={`${practice.x}:${practice.y}`}
      data-correct={correct}
      data-language={language}
      data-shared={shared}
    >
      <header className="vi183-header">
        <div>
          <span>GEOMETRY</span>
          <span>VECTORS</span>
          <h1>Vector Introduction</h1>
          <p>Understand magnitude and direction.</p>
          <section>
            <b>♙ Intermediate-Advanced</b>
            <b>ϟ Applied Lab</b>
            <b>▣ Vector Tools</b>
            <b>◷ 6-10 min</b>
          </section>
        </div>
        <aside>
          <select
            aria-label="Lesson language"
            value={language}
            onChange={(event) => {
              setLanguage(event.target.value);
              onInteraction();
            }}
          >
            <option>English (English)</option>
            <option>हिन्दी (Hindi)</option>
          </select>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(`u=<${u.x},${u.y}>`);
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
          <output>{shared ? "Copied" : ""}</output>
        </aside>
      </header>
      <nav className="vi183-stages">
        {[
          ["Observe", "What is a vector?"],
          ["Manipulate", "Drag and explore"],
          ["Pattern", "Notice relationships"],
          ["Rule", "Understand"],
          ["Practice", "Try on your own"],
        ].map(([title, note], index) => (
          <button
            key={title}
            className={stage === index ? "active" : ""}
            onClick={() => {
              setStage(index);
              onInteraction();
            }}
          >
            <b>
              {index + 1} {title}
            </b>
            <small>{note}</small>
          </button>
        ))}
      </nav>
      <section className="vi183-work">
        <article>
          <header>
            <h2>Explore a vector on the plane</h2>
            <button
              onClick={() => {
                setComponents((value) => !value);
                onInteraction();
              }}
            >
              ◉ {components ? "Hide" : "Show"} components
            </button>
          </header>
          <VectorGraph
            a={a}
            b={b}
            components={components}
            onPoint={updatePoint}
          />
          <footer>
            <b>● Initial point (A)</b>
            <b>● Terminal point (B)</b>
            <b>━ Vector u</b>
            <b>┄ Equivalent vector u′ (same)</b>
          </footer>
        </article>
        <aside>
          <h2>Vector u from A to B</h2>
          <div className="vi183-points">
            <label>
              A <small>(initial)</small>
              <input
                aria-label="Point A x"
                type="number"
                value={draftA.x}
                onChange={(e) =>
                  setDraftA({ ...draftA, x: clamp(+e.target.value) })
                }
              />
              ,{" "}
              <input
                aria-label="Point A y"
                type="number"
                value={draftA.y}
                onChange={(e) =>
                  setDraftA({ ...draftA, y: clamp(+e.target.value) })
                }
              />
            </label>
            <label>
              B <small>(terminal)</small>
              <input
                aria-label="Point B x"
                type="number"
                value={draftB.x}
                onChange={(e) =>
                  setDraftB({ ...draftB, x: clamp(+e.target.value) })
                }
              />
              ,{" "}
              <input
                aria-label="Point B y"
                type="number"
                value={draftB.y}
                onChange={(e) =>
                  setDraftB({ ...draftB, y: clamp(+e.target.value) })
                }
              />
            </label>
            <button
              onClick={() => {
                setA(draftA);
                setB(draftB);
                onInteraction();
              }}
            >
              ⌁ Set from points
            </button>
          </div>
          <section>
            <h3>Components</h3>
            <strong>
              u = ⟨ {u.x}, {u.y} ⟩
            </strong>
            {(["x", "y"] as const).map((axis) => (
              <label key={axis}>
                u<sub>{axis}</sub> = {u[axis]}
                <input
                  aria-label={`Vector ${axis} component`}
                  type="range"
                  min="-10"
                  max="10"
                  step="1"
                  value={u[axis]}
                  onChange={(e) => updateComponent(axis, +e.target.value)}
                />
                <input
                  aria-label={`Vector ${axis} exact value`}
                  type="number"
                  min="-10"
                  max="10"
                  value={u[axis]}
                  onChange={(e) =>
                    updateComponent(axis, clamp(+e.target.value))
                  }
                />
              </label>
            ))}
          </section>
          <section>
            <h3>Magnitude |u|</h3>
            <output>
              |u| = √({u.x}² + {u.y}²) = √{u.x * u.x + u.y * u.y} ≈{" "}
              {magnitude.toFixed(2)}
            </output>
            <h3>Direction θ</h3>
            <output>
              θ = tan⁻¹({u.y}/{u.x}) ≈ {angle.toFixed(2)}°
            </output>
          </section>
        </aside>
      </section>
      <section className="vi183-rule">
        <article>
          <h2>What do you notice?</h2>
          <p>✓ The vector has both magnitude and direction.</p>
          <p>✓ Two vectors with same components are equivalent.</p>
          <p>✓ The components determine length and direction.</p>
          <p>✓ Moving the arrow does not change the vector.</p>
        </article>
        <article>
          <h2>Vector rule (definition)</h2>
          <p>
            A vector in the plane is represented by an ordered pair of real
            numbers.
          </p>
          <output>u = ⟨uₓ, uᵧ⟩</output>
          <p>Magnitude: |u| = √(uₓ² + uᵧ²)</p>
          <p>Direction: θ = tan⁻¹(uᵧ/uₓ), measured from +x-axis.</p>
        </article>
      </section>
      <section className="vi183-bottom">
        <article>
          <h2>Example: Construct a vector</h2>
          <p>Construct the vector v = ⟨-4, 3⟩.</p>
          <ol>
            <li>From origin (0,0).</li>
            <li>Go 4 units left.</li>
            <li>Go 3 units up.</li>
            <li>Draw arrow from start to end.</li>
          </ol>
          <svg viewBox="0 0 260 160">
            <line x1="150" y1="130" x2="46" y2="52" />
            <line x1="46" y1="52" x2="46" y2="130" strokeDasharray="5 4" />
          </svg>
        </article>
        <article>
          <h2>Your turn</h2>
          <p>Create the vector w = ⟨2, -3⟩.</p>
          <div>
            <section>
              <p>Adjust the sliders or drag the arrow.</p>
              <label>
                <input
                  type="checkbox"
                  checked={answers.x}
                  onChange={() => {
                    setAnswers((v) => ({ ...v, x: !v.x }));
                    onInteraction();
                  }}
                />{" "}
                wₓ = 2
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={answers.y}
                  onChange={() => {
                    setAnswers((v) => ({ ...v, y: !v.y }));
                    onInteraction();
                  }}
                />{" "}
                wᵧ = -3
              </label>
              <input
                aria-label="Practice x component"
                type="range"
                min="-5"
                max="5"
                value={practice.x}
                onChange={(e) => {
                  setPractice({ ...practice, x: +e.target.value });
                  onInteraction();
                }}
              />
              <input
                aria-label="Practice y component"
                type="range"
                min="-5"
                max="5"
                value={practice.y}
                onChange={(e) => {
                  setPractice({ ...practice, y: +e.target.value });
                  onInteraction();
                }}
              />
              <button
                onClick={() => {
                  setFeedback(
                    correct
                      ? "Correct vector!"
                      : "Check both components and the arrow.",
                  );
                  onInteraction();
                }}
              >
                Check
              </button>
              <output>{feedback}</output>
            </section>
            <PracticeGraph
              vector={practice}
              onVector={(point) => {
                setPractice(point);
                onInteraction();
              }}
            />
          </div>
        </article>
      </section>
      <nav className="vi183-nav">
        <a href="/lessons/geometry/182-barycentric-coordinates">
          <ArrowLeft />
          <span>
            <small>Previous</small>
            <b>Barycentric Coordinates</b>
          </span>
        </a>
        <div>
          <small>Lesson progress</small>
          <progress max="5" value={stage + 1} />
          <b>{stage + 1} / 5</b>
        </div>
        <a href="/lessons/geometry/184-component-form">
          <span>
            <small>Next</small>
            <b>Component Form</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="vi183-footer">
        <b>⌁ Math Universe</b>
        <p>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </p>
        <a>Sitemap</a>
        <a>Docs</a>
        <a>About</a>
        <a>Contact</a>
        <small>
          © 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.
        </small>
      </footer>
    </main>
  );
}
