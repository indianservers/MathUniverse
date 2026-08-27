import { useEffect, useRef, useState, type PointerEvent } from "react";
import { ArrowLeft, ArrowRight, Check, Info, RefreshCw } from "lucide-react";
import type { LessonAdapterProps } from "../types";
import "./EvenOddFunctionsTargetLesson152.css";

type Family = "even" | "odd" | "neither";

const clamp = (value: number, min: number, max: number, step = 0.1) =>
  Math.max(min, Math.min(max, Math.round(value / step) * step));
const tidy = (value: number, digits = 2) =>
  Math.abs(value) < 0.000001
    ? "0"
    : Number.isInteger(value)
      ? String(value)
      : value.toFixed(digits).replace(/0+$/, "").replace(/\.$/, "");
const formulaFor = (family: Family) =>
  family === "even"
    ? "f(x) = x²"
    : family === "odd"
      ? "f(x) = x³"
      : "f(x) = x² + x";
const valueFor = (family: Family, x: number) =>
  family === "even" ? x * x : family === "odd" ? x * x * x : x * x + x;
const verdictFor = (family: Family) =>
  family === "even"
    ? {
        title: "Verdict: even",
        equation: "f(-x) = f(x) holds",
        detail: "The function is even.",
      }
    : family === "odd"
      ? {
          title: "Verdict: odd",
          equation: "f(-x) = -f(x) holds",
          detail: "The function is odd.",
        }
      : {
          title: "Verdict: neither",
          equation: "Both symmetry tests fail",
          detail: "The function is neither.",
        };

function SymmetryGraph({
  family,
  x,
  mirror,
  rotate,
  onX,
}: {
  family: Family;
  x: number;
  mirror: boolean;
  rotate: boolean;
  onX: (value: number) => void;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState(false);
  const px = (value: number) => 280 + value * 58;
  const py = (value: number) => 286 - value * 57;
  const fn = (value: number) => valueFor(family, value);
  const path = (transform: (value: number) => number) =>
    Array.from({ length: 241 }, (_, index) => {
      const input = -4.2 + index * 0.035;
      return `${index ? "L" : "M"}${px(input)},${py(transform(input))}`;
    }).join(" ");
  const fx = fn(x),
    negativeFx = fn(-x);
  const updateFromPointer = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragging || !svg.current) return;
    const box = svg.current.getBoundingClientRect();
    const next = (((event.clientX - box.left) / box.width) * 560 - 280) / 58;
    onX(clamp(next, -4, 4));
  };

  return (
    <svg
      ref={svg}
      className="eo152-graph"
      viewBox="0 0 560 530"
      role="img"
      aria-label="Function graph with x and negative x symmetry points"
      onPointerMove={updateFromPointer}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
    >
      <defs>
        <pattern
          id="eo152-grid"
          width="58"
          height="57"
          patternUnits="userSpaceOnUse"
        >
          <path d="M58 0H0V57" fill="none" stroke="#dfe7ef" />
        </pattern>
        <clipPath id="eo152-clip">
          <rect width="560" height="530" />
        </clipPath>
        <marker
          id="eo152-axis-arrow"
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0 0L6 3L0 6Z" fill="#283650" />
        </marker>
      </defs>
      <rect width="560" height="530" fill="#fff" />
      <rect width="560" height="530" fill="url(#eo152-grid)" />
      <g className="eo152-ticks">
        {[-4, -3, -2, -1, 1, 2, 3, 4].map((tick) => (
          <text
            key={`x-${tick}`}
            x={px(tick)}
            y={py(0) + 23}
            textAnchor="middle"
          >
            {tick}
          </text>
        ))}
        {[-4, -3, -2, -1, 1, 2, 3, 4].map((tick) => (
          <text
            key={`y-${tick}`}
            x={px(0) - 14}
            y={py(tick) + 4}
            textAnchor="end"
          >
            {tick}
          </text>
        ))}
      </g>
      <line
        x1="5"
        x2="555"
        y1={py(0)}
        y2={py(0)}
        className="eo152-axis"
        markerEnd="url(#eo152-axis-arrow)"
      />
      <line
        x1={px(0)}
        x2={px(0)}
        y1="525"
        y2="4"
        className="eo152-axis"
        markerEnd="url(#eo152-axis-arrow)"
      />
      <text x="548" y={py(0) - 10} className="eo152-axis-label">
        x
      </text>
      <text x={px(0) + 10} y="16" className="eo152-axis-label">
        y
      </text>
      <g clipPath="url(#eo152-clip)">
        {mirror && (
          <path
            d={path((input) => fn(-input))}
            className="eo152-mirror-ghost"
            data-testid="even-mirror-overlay"
          />
        )}
        {rotate && family !== "even" && (
          <path
            d={path((input) => -fn(-input))}
            className="eo152-rotate-ghost"
            data-testid="odd-rotation-overlay"
          />
        )}
        <path d={path(fn)} className={`eo152-curve ${family}`} />
        <line
          x1={px(x)}
          x2={px(x)}
          y1={py(0)}
          y2={py(fx)}
          className="eo152-projection"
        />
        <line
          x1={px(-x)}
          x2={px(-x)}
          y1={py(0)}
          y2={py(negativeFx)}
          className="eo152-projection"
        />
      </g>
      {mirror && family === "even" && (
        <>
          <line
            x1={px(0)}
            x2={px(0)}
            y1="28"
            y2={py(0)}
            className="eo152-mirror-axis"
          />
          <text x={px(0) - 48} y="31" className="eo152-mirror-title">
            Mirror over y-axis
          </text>
        </>
      )}
      {rotate && family === "odd" && (
        <>
          <path
            d={`M${px(0) - 30},${py(0)} A30 30 0 1 1 ${px(0) + 29},${py(0) - 2}`}
            className="eo152-rotation-arrow"
          />
          <text x={px(0) + 40} y={py(0) - 18} className="eo152-rotation-title">
            Rotate 180°
          </text>
        </>
      )}
      <circle
        cx={px(-x)}
        cy={py(negativeFx)}
        r="7"
        className={`eo152-point ${family}`}
      />
      <circle
        cx={px(x)}
        cy={py(fx)}
        r="8"
        className={`eo152-point eo152-drag-point ${family}`}
        role="slider"
        tabIndex={0}
        aria-label="Drag symmetry test point"
        aria-valuemin="-4"
        aria-valuemax="4"
        aria-valuenow={x}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDragging(true);
        }}
        onKeyDown={(event) => {
          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
          event.preventDefault();
          onX(clamp(x + (event.key === "ArrowRight" ? 0.1 : -0.1), -4, 4));
        }}
      />
      <g className="eo152-point-label">
        <rect
          x={px(-x) - 80}
          y={py(negativeFx) + 8}
          width="70"
          height="35"
          rx="7"
        />
        <text x={px(-x) - 45} y={py(negativeFx) + 31} textAnchor="middle">
          ({tidy(-x)}, {tidy(negativeFx)})
        </text>
        <rect x={px(x) + 10} y={py(fx) + 8} width="70" height="35" rx="7" />
        <text x={px(x) + 45} y={py(fx) + 31} textAnchor="middle">
          ({tidy(x)}, {tidy(fx)})
        </text>
      </g>
    </svg>
  );
}

function ConceptCard({
  family,
  active,
  onSelect,
}: {
  family: Family;
  active: boolean;
  onSelect: () => void;
}) {
  const details =
    family === "even"
      ? [
          "Even: f(-x) = f(x)",
          "Mirror over y-axis",
          "If you fold the graph along the y-axis, both sides match.",
        ]
      : family === "odd"
        ? [
            "Odd: f(-x) = -f(x)",
            "Rotate around origin",
            "Rotate the graph 180° about the origin, and it matches.",
          ]
        : [
            "Neither",
            "No symmetry",
            "Does not match by either mirror or 180° rotation.",
          ];
  return (
    <button
      type="button"
      className={`eo152-concept ${family} ${active ? "active" : ""}`}
      onClick={onSelect}
    >
      <b>{details[0]}</b>
      <span>{details[1]}</span>
      <svg viewBox="0 0 150 105" aria-hidden="true">
        <line x1="12" x2="138" y1="86" y2="86" />
        {family === "even" && (
          <>
            <path d="M18 20Q75 132 132 20" />
            <line x1="75" x2="75" y1="12" y2="96" className="guide" />
            <circle cx="18" cy="20" r="5" />
            <circle cx="132" cy="20" r="5" />
          </>
        )}
        {family === "odd" && (
          <>
            <path d="M15 96C34 18 58 88 75 54C92 20 116 90 137 10" />
            <circle cx="75" cy="54" r="18" className="orbit" />
          </>
        )}
        {family === "neither" && (
          <>
            <path d="M18 10C30 88 47 100 66 48C83 7 105 73 135 16" />
            <line x1="15" x2="137" y1="54" y2="54" className="guide" />
          </>
        )}
      </svg>
      <small>{details[2]}</small>
    </button>
  );
}

export default function EvenOddFunctionsTargetLesson152({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [family, setFamily] = useState<Family>("even");
  const [x, setX] = useState(2);
  const [mirror, setMirror] = useState(true);
  const [rotate, setRotate] = useState(true);
  const act = () => onInteraction();
  const selectFamily = (next: Family) => {
    setFamily(next);
    act();
  };
  const updateX = (next: number) => {
    setX(clamp(next, -4, 4));
    act();
  };
  useEffect(() => {
    setFamily("even");
    setX(2);
    setMirror(true);
    setRotate(true);
  }, [resetToken]);
  const fx = valueFor(family, x),
    negativeFx = valueFor(family, -x),
    verdict = verdictFor(family),
    verdictClass =
      family === "even" ? "even" : family === "odd" ? "odd" : "neither";

  return (
    <div
      className="eo152-page"
      data-testid="graph-mockup-0209"
      data-dedicated-lesson="152"
      data-object-model="selectable-even-odd-neither-polynomial-family-pointer-keyboard-draggable-x-probe-generated-x-negative-x-points-mirror-and-rotation-overlays-live-algebraic-symmetry-verdict"
      data-family={family}
      data-x={x}
      data-fx={fx}
      data-negative-fx={negativeFx}
      data-mirror={mirror}
      data-rotate={rotate}
      data-verdict={verdictClass}
    >
      <main className="eo152-surface">
        <header className="eo152-header">
          <h1>Even and Odd Functions</h1>
          <p>Recognise symmetry.</p>
          <div className="eo152-summary">
            <button
              type="button"
              className="even"
              onClick={() => selectFamily("even")}
            >
              <strong>↕</strong>
              <span>
                <b>Even: f(-x) = f(x)</b>
                <small>Mirror over y-axis</small>
              </span>
            </button>
            <button
              type="button"
              className="odd"
              onClick={() => selectFamily("odd")}
            >
              <strong>
                <RefreshCw />
              </strong>
              <span>
                <b>Odd: f(-x) = -f(x)</b>
                <small>Rotate around origin</small>
              </span>
            </button>
            <button type="button" onClick={() => updateX(-x)}>
              <strong>▣</strong>
              <span>
                <b>Test x and -x</b>
                <small>Compare f(x) and f(-x)</small>
              </span>
            </button>
          </div>
        </header>

        <section className="eo152-layout">
          <section className="eo152-left">
            <div
              className="eo152-tabs"
              role="tablist"
              aria-label="Symmetry families"
            >
              {(["even", "odd", "neither"] as Family[]).map((item) => (
                <button
                  type="button"
                  role="tab"
                  aria-selected={family === item}
                  className={item}
                  key={item}
                  onClick={() => selectFamily(item)}
                >
                  {item[0].toUpperCase() + item.slice(1)}
                </button>
              ))}
            </div>
            <SymmetryGraph
              family={family}
              x={x}
              mirror={mirror}
              rotate={rotate}
              onX={updateX}
            />
            <div className="eo152-concepts">
              {(["even", "odd", "neither"] as Family[]).map((item) => (
                <ConceptCard
                  key={item}
                  family={item}
                  active={family === item}
                  onSelect={() => selectFamily(item)}
                />
              ))}
            </div>
          </section>

          <aside className="eo152-rail">
            <section className="eo152-choose-card">
              <h2>
                1. Choose function <Info size={13} />
              </h2>
              <select
                aria-label="Symmetry function family"
                value={family}
                onChange={(event) => selectFamily(event.target.value as Family)}
              >
                <option value="even">f(x) = x²</option>
                <option value="odd">f(x) = x³</option>
                <option value="neither">f(x) = x² + x</option>
              </select>
              {(["even", "odd", "neither"] as Family[]).map((item) => (
                <button
                  type="button"
                  className={family === item ? "active" : ""}
                  key={item}
                  onClick={() => selectFamily(item)}
                >
                  {formulaFor(item)}
                </button>
              ))}
            </section>
            <section className="eo152-x-card">
              <h2>
                2. Choose x <Info size={13} />
                <output>x = {tidy(x)}</output>
              </h2>
              <input
                aria-label="Symmetry test x"
                type="range"
                min="-4"
                max="4"
                step="0.1"
                value={x}
                onChange={(event) => updateX(Number(event.target.value))}
              />
              <div className="eo152-range-labels">
                <span>-4</span>
                <span>4</span>
              </div>
              <div className="eo152-x-values">
                <span>
                  <small>x</small>
                  {tidy(x)}
                </span>
                <span>
                  <small>-x</small>
                  {tidy(-x)}
                </span>
              </div>
            </section>
            <section className="eo152-compare-card">
              <h2>
                3. Compare values <Info size={13} />
              </h2>
              <div>
                <span>
                  <b>f({tidy(x)})</b>= {tidy(fx)}
                </span>
                <span>
                  <b>f({tidy(-x)})</b>= {tidy(negativeFx)}
                </span>
              </div>
            </section>
            <section className="eo152-overlay-card">
              <h2>
                4. Symmetry overlays <Info size={13} />
              </h2>
              <button
                type="button"
                role="switch"
                aria-checked={mirror}
                onClick={() => {
                  setMirror((value) => !value);
                  act();
                }}
              >
                <strong>↕</strong>
                <span>
                  <b>Mirror over y-axis</b>
                  <small>(even test)</small>
                </span>
                <i className={mirror ? "on" : ""} />
              </button>
              <button
                type="button"
                role="switch"
                aria-checked={rotate}
                onClick={() => {
                  setRotate((value) => !value);
                  act();
                }}
              >
                <strong>⟳</strong>
                <span>
                  <b>Rotate around origin</b>
                  <small>(odd test)</small>
                </span>
                <i className={rotate ? "on" : ""} />
              </button>
            </section>
            <section className={`eo152-verdict-card ${verdictClass}`}>
              <h2>
                5. Live test <Info size={13} />
              </h2>
              <div>
                <i>
                  <Check size={24} />
                </i>
                <span>
                  <b>{verdict.title}</b>
                  <small>
                    {verdict.equation}
                    <br />
                    {verdict.detail}
                  </small>
                </span>
              </div>
            </section>
          </aside>
        </section>
      </main>
      <nav className="eo152-neighbors" aria-label="Lesson navigation">
        <a href="/lessons/graphs-and-functions/151-inverse-functions">
          <ArrowLeft size={16} />
          <span>
            <small>PREVIOUS</small>Inverse Functions
          </span>
        </a>
        <a href="/lessons/graphs-and-functions/153-increasing-and-decreasing">
          <span>
            <small>NEXT</small>Increasing and Decreasing
          </span>
          <ArrowRight size={16} />
        </a>
      </nav>
    </div>
  );
}
