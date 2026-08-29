import { ArrowLeft, ArrowRight, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./BarycentricCoordinatesTargetLesson182.css";
type Point = { x: number; y: number };
type Weights = { a: number; b: number; c: number };
const A = { x: 0, y: 6 },
  B = { x: -6, y: -2 },
  C = { x: 6, y: -2 },
  INITIAL = { a: 0.5, b: 0.2, c: 0.3 },
  TARGETS: [Weights, Weights, Weights] = [
    { a: 0.2, b: 0.5, c: 0.3 },
    { a: 0.6, b: 0.1, c: 0.3 },
    { a: 0.25, b: 0.25, c: 0.5 },
  ],
  fmt = (v: number) => v.toFixed(2),
  pointFrom = (w: Weights) => ({
    x: w.a * A.x + w.b * B.x + w.c * C.x,
    y: w.a * A.y + w.b * B.y + w.c * C.y,
  }),
  weightsFrom = (p: Point): Weights => {
    const den = (B.y - C.y) * (A.x - C.x) + (C.x - B.x) * (A.y - C.y),
      a = ((B.y - C.y) * (p.x - C.x) + (C.x - B.x) * (p.y - C.y)) / den,
      b = ((C.y - A.y) * (p.x - C.x) + (A.x - C.x) * (p.y - C.y)) / den;
    return { a, b, c: 1 - a - b };
  },
  clampWeights = (w: Weights) => {
    const x = { a: Math.max(0, w.a), b: Math.max(0, w.b), c: Math.max(0, w.c) },
      s = x.a + x.b + x.c || 1;
    return { a: x.a / s, b: x.b / s, c: x.c / s };
  };
function Triangle({
  weights,
  onWeights,
  small = false,
}: {
  weights: Weights;
  onWeights: (w: Weights) => void;
  small?: boolean;
}) {
  const ref = useRef<SVGSVGElement>(null),
    drag = useRef(false),
    W = small ? 260 : 520,
    H = small ? 190 : 500,
    scaleX = small ? 15 : 32.2,
    scaleY = small ? 19.1 : 52.7,
    ox = small ? 113 : 233,
    oy = small ? 130 : 333,
    sx = (x: number) => ox + x * scaleX,
    sy = (y: number) => oy - y * scaleY,
    p = pointFrom(weights);
  const from = (e: PointerEvent<SVGSVGElement>) => {
    const r = ref.current!.getBoundingClientRect(),
      q = {
        x: (((e.clientX - r.left) / r.width) * W - ox) / scaleX,
        y: (oy - ((e.clientY - r.top) / r.height) * H) / scaleY,
      };
    return clampWeights(weightsFrom(q));
  };
  const key = (e: KeyboardEvent<SVGCircleElement>) => {
    const d: { [k: string]: Point } = {
      ArrowLeft: { x: -0.2, y: 0 },
      ArrowRight: { x: 0.2, y: 0 },
      ArrowUp: { x: 0, y: 0.2 },
      ArrowDown: { x: 0, y: -0.2 },
    };
    if (d[e.key]) {
      e.preventDefault();
      onWeights(
        clampWeights(weightsFrom({ x: p.x + d[e.key].x, y: p.y + d[e.key].y })),
      );
    }
  };
  return (
    <svg
      ref={ref}
      className={small ? "bc182-triangle small" : "bc182-triangle"}
      viewBox={`0 0 ${W} ${H}`}
      onPointerMove={(e) => drag.current && onWeights(from(e))}
      onPointerUp={() => (drag.current = false)}
      onPointerLeave={() => (drag.current = false)}
    >
      <polygon
        points={`${sx(A.x)},${sy(A.y)} ${sx(B.x)},${sy(B.y)} ${sx(C.x)},${sy(C.y)}`}
        className="outer"
      />
      <polygon
        points={`${sx(p.x)},${sy(p.y)} ${sx(B.x)},${sy(B.y)} ${sx(C.x)},${sy(C.y)}`}
        className="area-a"
      />
      <polygon
        points={`${sx(p.x)},${sy(p.y)} ${sx(C.x)},${sy(C.y)} ${sx(A.x)},${sy(A.y)}`}
        className="area-b"
      />
      <polygon
        points={`${sx(p.x)},${sy(p.y)} ${sx(A.x)},${sy(A.y)} ${sx(B.x)},${sy(B.y)}`}
        className="area-c"
      />
      <g className="medians">
        <line
          x1={sx(A.x)}
          y1={sy(A.y)}
          x2={sx((B.x + C.x) / 2)}
          y2={sy((B.y + C.y) / 2)}
        />
        <line
          x1={sx(B.x)}
          y1={sy(B.y)}
          x2={sx((A.x + C.x) / 2)}
          y2={sy((A.y + C.y) / 2)}
        />
        <line
          x1={sx(C.x)}
          y1={sy(C.y)}
          x2={sx((A.x + B.x) / 2)}
          y2={sy((A.y + B.y) / 2)}
        />
      </g>
      <g className="point-guides">
        <line x1={sx(p.x)} y1={sy(p.y)} x2={sx(A.x)} y2={sy(A.y)} />
        <line x1={sx(p.x)} y1={sy(p.y)} x2={sx(B.x)} y2={sy(B.y)} />
        <line x1={sx(p.x)} y1={sy(p.y)} x2={sx(C.x)} y2={sy(C.y)} />
      </g>
      {[
        [A, "A"],
        [B, "B"],
        [C, "C"],
      ].map(([q, n]) => (
        <g key={String(n)}>
          <circle
            cx={sx((q as Point).x)}
            cy={sy((q as Point).y)}
            r={small ? 5 : 7}
            className={`vertex ${String(n).toLowerCase()}`}
          />
          <text
            x={sx((q as Point).x) + (n === "B" ? -22 : 10)}
            y={sy((q as Point).y) + (n === "A" ? -10 : 23)}
          >
            {n}
            {small ? "" : ` (${(q as Point).x}, ${(q as Point).y})`}
          </text>
        </g>
      ))}
      <circle
        data-testid={
          small ? "barycentric-practice-point" : "barycentric-main-point"
        }
        role="slider"
        aria-label={small ? "Practice point P" : "Barycentric point P"}
        tabIndex={0}
        cx={sx(p.x)}
        cy={sy(p.y)}
        r={small ? 6 : 9}
        className="point"
        onPointerDown={(e) => {
          drag.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onKeyDown={key}
      />
      <text x={sx(p.x) + 12} y={sy(p.y) - 8}>
        P
      </text>
      {small ? null : (
        <>
          <text x={sx((p.x + A.x) / 2) - 10} y={sy((p.y + A.y) / 2)}>
            <tspan>α = {fmt(weights.a)}</tspan>
            <tspan x={sx((p.x + A.x) / 2) - 10} dy="16">
              {(weights.a * 100).toFixed(1)}%
            </tspan>
          </text>
          <text x={sx((p.x + B.x) / 2) - 30} y={sy((p.y + B.y) / 2)}>
            <tspan>β = {fmt(weights.b)}</tspan>
            <tspan x={sx((p.x + B.x) / 2) - 30} dy="16">
              {(weights.b * 100).toFixed(1)}%
            </tspan>
          </text>
          <text x={sx((p.x + C.x) / 2) + 5} y={sy((p.y + C.y) / 2)}>
            <tspan>γ = {fmt(weights.c)}</tspan>
            <tspan x={sx((p.x + C.x) / 2) + 5} dy="16">
              {(weights.c * 100).toFixed(1)}%
            </tspan>
          </text>
        </>
      )}
    </svg>
  );
}
export default function BarycentricCoordinatesTargetLesson182({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [weights, setWeights] = useState(INITIAL),
    [practice, setPractice] = useState(TARGETS[0]),
    [targetIndex, setTargetIndex] = useState(0),
    [stage, setStage] = useState(0),
    [medians, setMedians] = useState(false),
    [areas, setAreas] = useState(true),
    [grid, setGrid] = useState(false),
    [language, setLanguage] = useState("English (English)"),
    [shared, setShared] = useState(false);
  const p = pointFrom(weights),
    target = TARGETS[targetIndex],
    difference =
      Math.abs(practice.a - target.a) +
      Math.abs(practice.b - target.b) +
      Math.abs(practice.c - target.c),
    matched = difference < 0.03;
  const update = (w: Weights, practiceMode = false) => {
    (practiceMode ? setPractice : setWeights)(clampWeights(w));
    onInteraction();
  };
  const setWeight = (key: keyof Weights, value: number) => {
    const rest = (1 - value) / (1 - weights[key] || 1),
      next = { ...weights, [key]: value };
    for (const k of ["a", "b", "c"] as const)
      if (k !== key) next[k] = weights[k] * rest;
    update(next);
  };
  const reset = () => {
    setWeights(INITIAL);
    setPractice(TARGETS[0]);
    setTargetIndex(0);
    setStage(0);
    setMedians(false);
    setAreas(true);
    setGrid(false);
    setLanguage("English (English)");
    setShared(false);
    onInteraction();
  };
  useEffect(() => {
    setWeights(INITIAL);
    setPractice(TARGETS[0]);
    setTargetIndex(0);
    setStage(0);
    setMedians(false);
    setAreas(true);
    setGrid(false);
    setLanguage("English (English)");
    setShared(false);
  }, [resetToken]);
  return (
    <main
      className={`bc182-page${grid ? " grid" : ""}${areas ? " areas" : ""}${medians ? " medians" : ""}`}
      data-testid="geometry-mockup-0239"
      data-dedicated-lesson="182"
      data-object-model="triangle-area-normalized-barycentric-weight-reconstruction"
      data-weights={`${weights.a.toFixed(4)}:${weights.b.toFixed(4)}:${weights.c.toFixed(4)}`}
      data-point={`${p.x.toFixed(3)}:${p.y.toFixed(3)}`}
      data-sum={(weights.a + weights.b + weights.c).toFixed(4)}
      data-practice={`${practice.a.toFixed(4)}:${practice.b.toFixed(4)}:${practice.c.toFixed(4)}`}
      data-target={`${target.a}:${target.b}:${target.c}`}
      data-matched={matched}
      data-stage={stage}
      data-medians={medians}
      data-areas={areas}
      data-grid={grid}
      data-language={language}
      data-shared={shared}
    >
      <header className="bc182-header">
        <span>COORDINATE GEOMETRY</span>
        <h1>Barycentric Coordinates</h1>
        <p>Represent points relative to a triangle.</p>
        <section>
          <b>♙ Intermediate</b>
          <b>⌁ Interactive</b>
          <b>◷ 6-10 min</b>
          <b>▣ Geometry / Graphing</b>
        </section>
        <footer>
          <select
            aria-label="Lesson language"
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              onInteraction();
            }}
          >
            <option>English (English)</option>
            <option>हिन्दी (Hindi)</option>
          </select>
          <button onClick={reset}>
            <RotateCcw />
            Reset
          </button>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(
                `P(${fmt(p.x)},${fmt(p.y)}) α=${fmt(weights.a)} β=${fmt(weights.b)} γ=${fmt(weights.c)}`,
              );
              setShared(true);
              onInteraction();
            }}
          >
            <Share2 />
            Share
          </button>
          <output>{shared ? "Copied" : ""}</output>
        </footer>
      </header>
      <nav className="bc182-stages">
        {[
          ["Observe", "See the model"],
          ["Manipulate", "Move the point"],
          ["Pattern", "What changes?"],
          ["Rule", "Understand"],
          ["Try", "Practice"],
        ].map(([a, b], i) => (
          <button
            className={stage === i ? "active" : ""}
            onClick={() => {
              setStage(i);
              onInteraction();
            }}
            key={a}
          >
            <b>{a}</b>
            <small>{b}</small>
          </button>
        ))}
      </nav>
      <section className="bc182-model">
        <article>
          <h2>INTERACTIVE MODEL ⓘ</h2>
          <button
            onClick={() => {
              setStage(1);
              onInteraction();
            }}
          >
            ☝ Drag P
          </button>
          <Triangle weights={weights} onWeights={(w) => update(w)} />
          <footer>
            <label>
              <input
                type="checkbox"
                checked={medians}
                onChange={() => {
                  setMedians((v) => !v);
                  onInteraction();
                }}
              />
              Show medians
            </label>
            <label>
              <input
                type="checkbox"
                checked={areas}
                onChange={() => {
                  setAreas((v) => !v);
                  onInteraction();
                }}
              />
              Show areas
            </label>
            <label>
              <input
                type="checkbox"
                checked={grid}
                onChange={() => {
                  setGrid((v) => !v);
                  onInteraction();
                }}
              />
              Grid
            </label>
          </footer>
          <p>
            Drag point P inside the triangle. Areas and coordinates update in
            real time.
          </p>
        </article>
        <aside>
          <h2>OBSERVATION</h2>
          <section>
            <h3>Barycentric coordinates of P</h3>
            <p>
              <b>α (at A)</b>
              <output>{weights.a.toFixed(4)}</output>
            </p>
            <p>
              <b>β (at B)</b>
              <output>{weights.b.toFixed(4)}</output>
            </p>
            <p>
              <b>γ (at C)</b>
              <output>{weights.c.toFixed(4)}</output>
            </p>
            <hr />
            <p>
              <b>Sum</b>
              <output>
                ✓ {(weights.a + weights.b + weights.c).toFixed(4)}
              </output>
            </p>
          </section>
          <section>
            <h3>Vertex influence (weights)</h3>
            {(["a", "b", "c"] as const).map((k, i) => (
              <label key={k}>
                {["A", "B", "C"][i]}
                <input
                  aria-label={`Weight ${k}`}
                  type="range"
                  min="0"
                  max="1"
                  step=".01"
                  value={weights[k]}
                  onChange={(e) => setWeight(k, Number(e.target.value))}
                />
                <output>{weights[k].toFixed(2)}</output>
              </label>
            ))}
          </section>
          <section>
            <h3>Point coordinates</h3>
            <output>
              P (x, y) = ({p.x.toFixed(3)}, {p.y.toFixed(3)})
            </output>
          </section>
          <section>
            <p>💡 The weights show how much each vertex influences point P.</p>
            <p>Areas are proportional to weights.</p>
          </section>
        </aside>
      </section>
      <section className="bc182-learn">
        <article>
          <h3>CONSTRUCTION (HOW IT WORKS)</h3>
          <ol>
            <li>Draw triangle ABC.</li>
            <li>Draw lines from P to each vertex.</li>
            <li>Let Sₐ, Sᵦ, S꜀ be sub-triangle areas.</li>
            <li>Weights are proportional to areas.</li>
            <li>Then α+β+γ=1.</li>
          </ol>
        </article>
        <article>
          <h3>THE RULE (DEFINITION)</h3>
          <p>For any point P inside triangle ABC,</p>
          <output>P=αA+βB+γC</output>
          <p>where α+β+γ=1 and α,β,γ≥0.</p>
          <p>These are the barycentric coordinates of P.</p>
        </article>
        <article>
          <h3>WORKED EXAMPLE</h3>
          <p>Let A(0,6), B(-6,-2), C(6,-2).</p>
          <p>Barycentric coordinates:</p>
          <output>
            α={fmt(weights.a)} β={fmt(weights.b)} γ={fmt(weights.c)}
          </output>
          <p>Check: {(weights.a + weights.b + weights.c).toFixed(2)} ✓</p>
          <p>
            P={fmt(weights.a)}A+{fmt(weights.b)}B+{fmt(weights.c)}C=({fmt(p.x)},
            {fmt(p.y)}) ✓
          </p>
        </article>
      </section>
      <section className="bc182-practice">
        <h3>TRY IT YOURSELF</h3>
        <p>
          Move point P to match the given barycentric coordinates as closely as
          possible.
        </p>
        <article>
          <section>
            <b>TARGET WEIGHTS</b>
            <p>
              α (at A)<output>{target.a.toFixed(2)}</output>
            </p>
            <p>
              β (at B)<output>{target.b.toFixed(2)}</output>
            </p>
            <p>
              γ (at C)<output>{target.c.toFixed(2)}</output>
            </p>
            <hr />
            <p>
              Sum<output>1.00</output>
            </p>
          </section>
          <Triangle
            small
            weights={practice}
            onWeights={(w) => update(w, true)}
          />
          <section>
            <b>YOUR RESULT</b>
            <p>
              α<output>{practice.a.toFixed(2)}</output>
            </p>
            <p>
              β<output>{practice.b.toFixed(2)}</output>
            </p>
            <p>
              γ<output>{practice.c.toFixed(2)}</output>
            </p>
            <hr />
            <p>
              Sum
              <output>
                {(practice.a + practice.b + practice.c).toFixed(2)}{" "}
                {matched ? "✓" : ""}
              </output>
            </p>
          </section>
          <aside>
            <p>
              {matched
                ? "Target matched!"
                : "Goal: Adjust P so your weights match the target weights."}
            </p>
            <button
              onClick={() => {
                setTargetIndex((i) => (i + 1) % TARGETS.length);
                setPractice({ a: 1 / 3, b: 1 / 3, c: 1 / 3 });
                onInteraction();
              }}
            >
              ↻ New target
            </button>
          </aside>
        </article>
      </section>
      <nav className="bc182-nav">
        <a href="/lessons/geometry/181-parametric-coordinates">
          <ArrowLeft />
          <span>
            <small>Previous</small>
            <b>Parametric Coordinates</b>
          </span>
        </a>
        <a href="/lessons/geometry/183-vector-introduction">
          <span>
            <small>Next</small>
            <b>Vector Introduction</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="bc182-footer">
        <div>
          <b>⌁ Math Universe</b>
          <p>
            Interactive math labs, visual proofs, NCERT explorations, graphing,
            CAS-style tools, and classroom-ready activities.
          </p>
        </div>
        <a>Sitemap</a>
        <a>Docs</a>
        <a>About</a>
        <p>© 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</p>
      </footer>
    </main>
  );
}
