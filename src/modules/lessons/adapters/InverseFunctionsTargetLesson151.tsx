import { useEffect, useRef, useState, type PointerEvent } from "react";
import { ArrowLeft, ArrowRight, RefreshCcw, Share2 } from "lucide-react";
import type { LessonAdapterProps } from "../types";
import "./InverseFunctionsTargetLesson151.css";

type DomainMode = "all" | "positive" | "negative" | "interval";

const clamp = (value: number, min: number, max: number, step = 0.1) =>
  Math.max(min, Math.min(max, Math.round(value / step) * step));
const tidy = (value: number, digits = 2) =>
  Math.abs(value) < 0.000001
    ? "0"
    : Number.isInteger(value)
      ? String(value)
      : value.toFixed(digits).replace(/0+$/, "").replace(/\.$/, "");
const signed = (value: number) =>
  value === 0
    ? ""
    : value > 0
      ? ` + ${tidy(value)}`
      : ` - ${tidy(Math.abs(value))}`;

const domainBounds = (mode: DomainMode) => {
  if (mode === "positive") return { min: 0, max: 6, label: "[0, infinity)" };
  if (mode === "negative") return { min: -6, max: 0, label: "(-infinity, 0]" };
  if (mode === "interval") return { min: -3, max: 3, label: "[-3, 3]" };
  return { min: -6, max: 6, label: "(-infinity, infinity)" };
};

function InverseGraph({
  slope,
  intercept,
  probe,
  domain,
  onProbe,
}: {
  slope: number;
  intercept: number;
  probe: number;
  domain: DomainMode;
  onProbe: (value: number) => void;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState(false);
  const bounds = domainBounds(domain);
  const px = (x: number) => 280 + x * 40;
  const py = (y: number) => 220 - y * 32;
  const f = (x: number) => slope * x + intercept;
  const original = Array.from({ length: 121 }, (_, index) => {
    const x = bounds.min + ((bounds.max - bounds.min) * index) / 120;
    return `${index ? "L" : "M"}${px(x)},${py(f(x))}`;
  }).join(" ");
  const inverse = Array.from({ length: 121 }, (_, index) => {
    const x = bounds.min + ((bounds.max - bounds.min) * index) / 120;
    return `${index ? "L" : "M"}${px(f(x))},${py(x)}`;
  }).join(" ");
  const fx = f(probe);
  const updateFromPointer = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragging || !svg.current) return;
    const box = svg.current.getBoundingClientRect();
    const x = (((event.clientX - box.left) / box.width) * 560 - 280) / 40;
    onProbe(clamp(x, bounds.min, bounds.max));
  };

  return (
    <svg
      ref={svg}
      className="inv151-graph"
      viewBox="0 0 560 440"
      role="img"
      aria-label="Original function and inverse reflected across y equals x"
      onPointerMove={updateFromPointer}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
    >
      <defs>
        <pattern
          id="inv151-grid"
          width="40"
          height="32"
          patternUnits="userSpaceOnUse"
        >
          <path d="M40 0H0V32" fill="none" stroke="#e2e8f0" strokeWidth="1" />
        </pattern>
        <clipPath id="inv151-clip">
          <rect width="560" height="440" />
        </clipPath>
        <marker
          id="inv151-axis-arrow"
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0 0L6 3L0 6Z" fill="#283650" />
        </marker>
        <marker
          id="inv151-swap-arrow"
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0 0L6 3L0 6Z" fill="#ff6a2a" />
        </marker>
      </defs>
      <rect width="560" height="440" fill="#fff" />
      <rect width="560" height="440" fill="url(#inv151-grid)" />
      <g className="inv151-grid-labels">
        {[-6, -4, -2, 2, 4, 6].map((value) => (
          <text key={`x${value}`} x={px(value)} y="237" textAnchor="middle">
            {value}
          </text>
        ))}
        {[-6, -4, -2, 2, 4, 6].map((value) => (
          <text key={`y${value}`} x="270" y={py(value) + 4} textAnchor="end">
            {value}
          </text>
        ))}
      </g>
      <line
        x1="0"
        x2="555"
        y1={py(0)}
        y2={py(0)}
        className="inv151-axis"
        markerEnd="url(#inv151-axis-arrow)"
      />
      <line
        x1={px(0)}
        x2={px(0)}
        y1="438"
        y2="3"
        className="inv151-axis"
        markerEnd="url(#inv151-axis-arrow)"
      />
      <text x="548" y="211" className="inv151-axis-name">
        x
      </text>
      <text x="290" y="14" className="inv151-axis-name">
        y
      </text>
      <g clipPath="url(#inv151-clip)">
        <line
          x1={px(-6)}
          y1={py(-6)}
          x2={px(6)}
          y2={py(6)}
          className="inv151-reflection"
        />
        <path d={original} className="inv151-original-line" />
        <path d={inverse} className="inv151-inverse-line" />
        <path
          d={`M${px(probe) + 8},${py(fx) + 4} Q${(px(probe) + px(fx)) / 2 + 38},${(py(fx) + py(probe)) / 2 - 35} ${px(fx) - 7},${py(probe) - 4}`}
          className="inv151-swap-arc"
          markerEnd="url(#inv151-swap-arrow)"
        />
      </g>
      <text x={px(5.4)} y={py(5.4) - 8} className="inv151-reflection-label">
        y = x
      </text>
      <circle
        cx={px(probe)}
        cy={py(fx)}
        r="8"
        className="inv151-original-point"
        role="slider"
        tabIndex={0}
        aria-label="Drag original function point"
        aria-valuemin={bounds.min}
        aria-valuemax={bounds.max}
        aria-valuenow={probe}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDragging(true);
        }}
        onKeyDown={(event) => {
          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
          event.preventDefault();
          onProbe(
            clamp(
              probe + (event.key === "ArrowRight" ? 0.1 : -0.1),
              bounds.min,
              bounds.max,
            ),
          );
        }}
      />
      <circle
        cx={px(fx)}
        cy={py(probe)}
        r="7"
        className="inv151-inverse-point"
      />
      <text
        x={px(probe) + 16}
        y={py(fx) - 10}
        className="inv151-original-label"
      >
        ({tidy(probe)}, {tidy(fx)})
      </text>
      <text x={px(fx) + 12} y={py(probe) - 12} className="inv151-inverse-label">
        ({tidy(fx)}, {tidy(probe)})
      </text>
      <text
        x={(px(probe) + px(fx)) / 2 - 8}
        y={(py(fx) + py(probe)) / 2 - 12}
        className="inv151-swap-label"
      >
        swap
      </text>
    </svg>
  );
}

export default function InverseFunctionsTargetLesson151({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [slope, setSlope] = useState(2);
  const [intercept, setIntercept] = useState(1);
  const [probe, setProbe] = useState(2);
  const [domain, setDomain] = useState<DomainMode>("all");
  const [shared, setShared] = useState(false);
  const act = () => onInteraction();
  const reset = () => {
    setSlope(2);
    setIntercept(1);
    setProbe(2);
    setDomain("all");
    setShared(false);
    act();
  };
  useEffect(() => {
    setSlope(2);
    setIntercept(1);
    setProbe(2);
    setDomain("all");
    setShared(false);
  }, [resetToken]);
  const bounds = domainBounds(domain);
  const safeSlope = Math.abs(slope) < 0.1 ? (slope < 0 ? -0.5 : 0.5) : slope;
  const f = (x: number) => safeSlope * x + intercept;
  const inverse = (y: number) => (y - intercept) / safeSlope;
  const fx = f(probe);
  const candidates =
    domain === "all"
      ? [0, 2, -1, 3]
      : [
          bounds.min,
          (bounds.min + bounds.max) / 3,
          ((bounds.min + bounds.max) * 2) / 3,
          bounds.max,
        ];
  const rows = candidates.map((x) => ({
    x: clamp(x, bounds.min, bounds.max),
    y: f(x),
  }));
  const originalFormula = `f(x) = ${tidy(safeSlope)}x${signed(intercept)}`;
  const inverseFormula = `f⁻¹(x) = (x${signed(-intercept)}) / ${tidy(safeSlope)}`;
  const updateSlope = (value: number) => {
    let next = clamp(value, -5, 5, 0.5);
    if (Math.abs(next) < 0.1) next = value < 0 ? -0.5 : 0.5;
    setSlope(next);
    act();
  };
  const updateProbe = (value: number) => {
    setProbe(clamp(value, bounds.min, bounds.max));
    act();
  };
  const selectDomain = (value: DomainMode) => {
    const nextBounds = domainBounds(value);
    setDomain(value);
    setProbe((current) => clamp(current, nextBounds.min, nextBounds.max));
    act();
  };

  return (
    <div
      className="inv151-page"
      data-testid="graph-mockup-0208"
      data-dedicated-lesson="151"
      data-object-model="editable-linear-function-slope-intercept-domain-restriction-pointer-keyboard-draggable-source-point-generated-reflected-inverse-swapped-coordinate-mapping-table-live-composition-horizontal-line-test"
      data-slope={safeSlope}
      data-intercept={intercept}
      data-probe={probe}
      data-output={fx}
      data-inverse-output={inverse(fx)}
      data-domain={domain}
      data-domain-label={bounds.label}
      data-shared={shared}
    >
      <main className="inv151-surface">
        <header className="inv151-header">
          <div>
            <div className="inv151-tags">
              <span>GRAPHS AND FUNCTIONS</span>
              <span>FUNCTIONS</span>
            </div>
            <h1>Inverse Functions</h1>
            <p>Understand reversal of mappings.</p>
            <div className="inv151-meta">
              <span>♙ Intermediate–Advanced</span>
              <span>ϟ Graph Explorer</span>
              <span>▤ Graphing Calculator</span>
              <span>◷ 6–10 min</span>
            </div>
          </div>
          <div className="inv151-actions">
            <button type="button" onClick={reset}>
              <RefreshCcw size={16} /> Reset
            </button>
            <button
              type="button"
              onClick={async () => {
                setShared(true);
                act();
                try {
                  await navigator.clipboard?.writeText(window.location.href);
                } catch {
                  /* Clipboard permission is optional. */
                }
              }}
            >
              <Share2 size={16} /> Share
            </button>
          </div>
        </header>
        {shared && (
          <button
            type="button"
            className="inv151-share-notice"
            onClick={() => setShared(false)}
          >
            Lesson link copied
          </button>
        )}

        <section className="inv151-layout">
          <div className="inv151-left">
            <section className="inv151-graph-card">
              <h2>Reflect across y = x</h2>
              <p>Swap input and output</p>
              <div className="inv151-legend">
                <span className="original">{originalFormula}</span>
                <span className="inverse">{inverseFormula}</span>
              </div>
              <InverseGraph
                slope={safeSlope}
                intercept={intercept}
                probe={probe}
                domain={domain}
                onProbe={updateProbe}
              />
              <div className="inv151-drag-tip">
                <strong>☝</strong>
                <span>
                  <b>Drag a point to see its inverse</b>
                  <small>Points reflect across y = x</small>
                </span>
              </div>
            </section>

            <section className="inv151-mapping-card">
              <h2>Input–output mappings</h2>
              <div className="inv151-mapping-head">
                <span>{originalFormula}</span>
                <b>
                  Swap
                  <br />
                  <small>(input ↔ output)</small>
                </b>
                <span>{inverseFormula}</span>
              </div>
              <div className="inv151-mapping-table">
                {rows.map((row, index) => (
                  <button
                    type="button"
                    key={`${row.x}-${index}`}
                    onClick={() => updateProbe(row.x)}
                  >
                    <span>
                      x = {tidy(row.x)} → y = {tidy(row.y)}
                    </span>
                    <b>↔</b>
                    <span>
                      x = {tidy(row.y)} → y = {tidy(inverse(row.y))}
                    </span>
                  </button>
                ))}
              </div>
              <p className="inv151-ordered-note">
                ↔ Each ordered pair (x, y) on f swaps to (y, x) on f⁻¹.
              </p>
            </section>
          </div>

          <aside className="inv151-rail">
            <section className="inv151-control-card">
              <h2>Inverse controls</h2>
              <p className="inv151-current">
                <b>Original function:</b> {originalFormula}
              </p>
              <label>
                Slope (m)
                <div>
                  <input
                    aria-label="Inverse function slope"
                    type="range"
                    min="-5"
                    max="5"
                    step="0.5"
                    value={safeSlope}
                    onChange={(event) =>
                      updateSlope(Number(event.target.value))
                    }
                  />
                  <output>{tidy(safeSlope)}</output>
                </div>
                <small>
                  -5 <span>5</span>
                </small>
              </label>
              <label>
                Y-intercept (b)
                <div>
                  <input
                    aria-label="Inverse function y intercept"
                    type="range"
                    min="-10"
                    max="10"
                    step="0.5"
                    value={intercept}
                    onChange={(event) => {
                      setIntercept(Number(event.target.value));
                      act();
                    }}
                  />
                  <output>{tidy(intercept)}</output>
                </div>
                <small>
                  -10 <span>10</span>
                </small>
              </label>
              <label>
                Domain restriction
                <select
                  aria-label="Inverse function domain restriction"
                  value={domain}
                  onChange={(event) =>
                    selectDomain(event.target.value as DomainMode)
                  }
                >
                  <option value="all">All real numbers (-∞, ∞)</option>
                  <option value="positive">Nonnegative inputs [0, ∞)</option>
                  <option value="negative">Nonpositive inputs (-∞, 0]</option>
                  <option value="interval">Closed interval [-3, 3]</option>
                </select>
              </label>
              <p className="inv151-inverse-current">
                <b>Inverse function:</b> {inverseFormula}
                <small>(Updated automatically)</small>
              </p>
            </section>

            <section className="inv151-check-card">
              <h2>Live checks</h2>
              <p>
                ● f(f⁻¹({tidy(fx)})) = {tidy(f(inverse(fx)))}{" "}
                <b>
                  {tidy(fx)} = {tidy(f(inverse(fx)))}
                </b>
              </p>
              <p>
                ● f⁻¹(f({tidy(probe)})) = {tidy(inverse(f(probe)))}{" "}
                <b>
                  {tidy(probe)} = {tidy(inverse(f(probe)))}
                </b>
              </p>
            </section>

            <section className="inv151-horizontal-card">
              <header>
                <h2>Horizontal-line test</h2>
                <span>One-to-one</span>
              </header>
              <svg
                viewBox="0 0 290 94"
                role="img"
                aria-label="Every horizontal line intersects the function once"
              >
                <line x1="18" x2="270" y1="47" y2="47" />
                <line x1="54" x2="54" y1="10" y2="84" />
                {[24, 47, 70].map((y) => (
                  <line
                    key={y}
                    x1="15"
                    x2="274"
                    y1={y}
                    y2={y}
                    className="test-line"
                  />
                ))}
                <line
                  x1="30"
                  x2="85"
                  y1="84"
                  y2="10"
                  className="mini-original"
                />
                <line
                  x1="112"
                  x2="165"
                  y1="84"
                  y2="10"
                  className="mini-inverse"
                />
                <line
                  x1="195"
                  x2="232"
                  y1="84"
                  y2="10"
                  className="mini-inverse"
                />
              </svg>
              <p>
                Every horizontal line intersects each function at most once.
              </p>
            </section>

            <section className="inv151-compose-card">
              <h2>Composition returns the start</h2>
              <div>
                <i>x</i>
                <span>
                  <b>f →</b>
                  <b>← f⁻¹</b>
                </span>
                <i>x</i>
              </div>
              <p>
                Starting with any x, applying f then f⁻¹ (or f⁻¹ then f) returns
                to x.
              </p>
            </section>
          </aside>
        </section>
      </main>
      <nav className="inv151-neighbors" aria-label="Lesson navigation">
        <a href="/lessons/graphs-and-functions/150-composite-functions">
          <ArrowLeft size={16} />
          <span>
            <small>PREVIOUS</small>Composite Functions
          </span>
        </a>
        <a href="/lessons/graphs-and-functions/152-even-and-odd-functions">
          <span>
            <small>NEXT</small>Even and Odd Functions
          </span>
          <ArrowRight size={16} />
        </a>
      </nav>
    </div>
  );
}
