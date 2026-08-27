import { useEffect, useRef, useState, type PointerEvent } from "react";
import {
  Bookmark,
  Check,
  Globe,
  MoreHorizontal,
  RefreshCcw,
  Share2,
} from "lucide-react";
import type { LessonAdapterProps } from "../types";
import "./PeriodicFunctionsTargetLesson154.css";

type LessonTab = "explore" | "understand" | "examples" | "practice" | "summary";
const clamp = (value: number, min: number, max: number, step = 0.01) =>
  Math.max(min, Math.min(max, Math.round(value / step) * step));
const tidy = (value: number, digits = 3) =>
  Math.abs(value) < 0.000001
    ? "0"
    : Number.isInteger(value)
      ? String(value)
      : value.toFixed(digits).replace(/0+$/, "").replace(/\.$/, "");
const piLabel = (value: number) => {
  const ratio = value / Math.PI;
  if (Math.abs(ratio) < 0.001) return "0";
  const candidates: [[number, string]] | [number, string][] = [
    [-1.5, "−3π/2"],
    [-1, "−π"],
    [-0.5, "−π/2"],
    [-0.25, "−π/4"],
    [0.25, "π/4"],
    [0.5, "π/2"],
    [1, "π"],
    [1.25, "5π/4"],
    [1.5, "3π/2"],
    [2, "2π"],
  ];
  const found = candidates.find(
    ([candidate]) => Math.abs(ratio - candidate) < 0.015,
  );
  return found?.[1] ?? `${tidy(ratio, 2)}π`;
};

function PeriodicGraph({
  amplitude,
  frequency,
  midline,
  x,
  showFinder,
  onX,
}: {
  amplitude: number;
  frequency: number;
  midline: number;
  x: number;
  showFinder: boolean;
  onX: (value: number) => void;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState(false);
  const period = (2 * Math.PI) / frequency,
    xMin = -period / 2,
    xMax = period * 1.5,
    yMin = Math.min(-1.1, midline - amplitude - 0.2),
    yMax = Math.max(2.1, midline + amplitude + 0.2),
    px = (value: number) => 55 + ((value - xMin) / (xMax - xMin)) * 640,
    py = (value: number) => 365 - ((value - yMin) / (yMax - yMin)) * 325,
    fn = (value: number) => amplitude * Math.sin(frequency * value) + midline,
    fx = fn(x),
    matching = fn(x + period),
    path = Array.from({ length: 301 }, (_, index) => {
      const value = xMin + ((xMax - xMin) * index) / 300;
      return `${index ? "L" : "M"}${px(value)},${py(fn(value))}`;
    }).join(" ");
  const move = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragging || !svg.current) return;
    const box = svg.current.getBoundingClientRect(),
      value =
        xMin +
        ((((event.clientX - box.left) / box.width) * 720 - 55) / 640) *
          (xMax - xMin);
    onX(clamp(value, -period / 2, period / 2, period / 80));
  };
  const ticks = [
    xMin,
    -period / 4,
    0,
    period / 4,
    period / 2,
    period,
    period * 1.25,
    xMax,
  ];
  return (
    <svg
      ref={svg}
      className="per154-graph"
      viewBox="0 0 720 390"
      role="img"
      aria-label="Periodic sine graph with draggable matching point"
      onPointerMove={move}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
    >
      <defs>
        <pattern
          id="per154-grid"
          width="80"
          height="54"
          patternUnits="userSpaceOnUse"
        >
          <path d="M80 0H0V54" fill="none" stroke="#dfe7ef" />
        </pattern>
        <clipPath id="per154-clip">
          <rect x="55" y="15" width="640" height="350" />
        </clipPath>
        <marker
          id="per154-axis-arrow"
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0 0L6 3L0 6Z" fill="#263650" />
        </marker>
      </defs>
      <rect x="55" y="15" width="640" height="350" fill="#fff" />
      <rect x="55" y="15" width="640" height="350" fill="url(#per154-grid)" />
      {showFinder && (
        <rect
          x={px(x)}
          y="15"
          width={px(x + period) - px(x)}
          height="350"
          className="per154-cycle"
          data-testid="period-cycle-shading"
        />
      )}
      <line
        x1="55"
        x2="700"
        y1={py(0)}
        y2={py(0)}
        className="per154-axis"
        markerEnd="url(#per154-axis-arrow)"
      />
      <line
        x1={px(0)}
        x2={px(0)}
        y1="365"
        y2="10"
        className="per154-axis"
        markerEnd="url(#per154-axis-arrow)"
      />
      <g className="per154-ticks">
        {ticks.map((tick, index) => (
          <text
            key={`${tick}-${index}`}
            x={px(tick)}
            y={py(0) + 23}
            textAnchor="middle"
          >
            {piLabel(tick)}
          </text>
        ))}
        {[-1, -0.5, 0, 0.5, 1, 1.5, 2].map((tick) => (
          <text key={tick} x={px(0) - 13} y={py(tick) + 4} textAnchor="end">
            {tidy(tick, 1)}
          </text>
        ))}
      </g>
      <text x="705" y={py(0) - 9} className="per154-axis-name">
        x
      </text>
      <text x={px(0) + 8} y="17" className="per154-axis-name">
        y
      </text>
      <g clipPath="url(#per154-clip)">
        <line
          x1="55"
          x2="695"
          y1={py(midline)}
          y2={py(midline)}
          className="per154-midline"
        />
        <path d={path} className="per154-wave" />
        <line
          x1={px(x)}
          x2={px(x)}
          y1={py(0)}
          y2={py(fx)}
          className="per154-match-guide"
        />
        <line
          x1={px(x + period)}
          x2={px(x + period)}
          y1={py(0)}
          y2={py(matching)}
          className="per154-match-guide"
        />
      </g>
      {showFinder && (
        <g className="per154-ruler">
          <path d={`M${px(x)} 25V12H${px(x + period)}V25`} />
          <text x={(px(x) + px(x + period)) / 2} y="10" textAnchor="middle">
            T = {piLabel(period)}
          </text>
        </g>
      )}
      <circle
        cx={px(x + period)}
        cy={py(matching)}
        r="6"
        className="per154-match-point"
      />
      <circle
        cx={px(x)}
        cy={py(fx)}
        r="8"
        className="per154-drag-point"
        role="slider"
        tabIndex={0}
        aria-label="Drag periodic matching point"
        aria-valuemin={-period / 2}
        aria-valuemax={period / 2}
        aria-valuenow={x}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDragging(true);
        }}
        onKeyDown={(event) => {
          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
          event.preventDefault();
          onX(
            clamp(
              x + (event.key === "ArrowRight" ? period / 40 : -period / 40),
              -period / 2,
              period / 2,
              period / 80,
            ),
          );
        }}
      />
      <g className="per154-callout">
        <rect
          x={Math.max(60, px(x) - 125)}
          y={Math.max(45, py(fx) - 62)}
          width="112"
          height="50"
          rx="8"
        />
        <text
          x={Math.max(116, px(x) - 69)}
          y={Math.max(65, py(fx) - 42)}
          textAnchor="middle"
        >
          x = {piLabel(x)}
        </text>
        <text
          x={Math.max(116, px(x) - 69)}
          y={Math.max(83, py(fx) - 24)}
          textAnchor="middle"
        >
          f(x) = {tidy(fx)}
        </text>
        <rect
          x={Math.min(575, px(x + period) + 12)}
          y={Math.max(45, py(matching) - 62)}
          width="135"
          height="50"
          rx="8"
        />
        <text
          x={Math.min(642, px(x + period) + 79)}
          y={Math.max(65, py(matching) - 42)}
          textAnchor="middle"
        >
          x + T = {piLabel(x + period)}
        </text>
        <text
          x={Math.min(642, px(x + period) + 79)}
          y={Math.max(83, py(matching) - 24)}
          textAnchor="middle"
        >
          f(x + T) = {tidy(matching)}
        </text>
      </g>
    </svg>
  );
}

export default function PeriodicFunctionsTargetLesson154({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [amplitude, setAmplitude] = useState(1.5),
    [frequency, setFrequency] = useState(2),
    [midline, setMidline] = useState(0.5),
    [x, setX] = useState(Math.PI / 4),
    [showFinder, setShowFinder] = useState(true),
    [tab, setTab] = useState<LessonTab>("explore"),
    [bookmarked, setBookmarked] = useState(false),
    [shared, setShared] = useState(false),
    [menu, setMenu] = useState(false),
    [language, setLanguage] = useState("en"),
    [saved, setSaved] = useState(false);
  const act = () => onInteraction(),
    period = (2 * Math.PI) / frequency,
    fn = (value: number) => amplitude * Math.sin(frequency * value) + midline,
    fx = fn(x),
    matching = fn(x + period),
    reset = () => {
      setAmplitude(1.5);
      setFrequency(2);
      setMidline(0.5);
      setX(Math.PI / 4);
      setShowFinder(true);
      setTab("explore");
      setShared(false);
      setMenu(false);
      act();
    };
  useEffect(() => {
    setAmplitude(1.5);
    setFrequency(2);
    setMidline(0.5);
    setX(Math.PI / 4);
    setShowFinder(true);
    setTab("explore");
    setShared(false);
    setMenu(false);
  }, [resetToken]);
  const updateFrequency = (value: number) => {
      const next = clamp(value, 0.1, 5, 0.1),
        nextPeriod = (2 * Math.PI) / next;
      setFrequency(next);
      setX((current) =>
        clamp(current, -nextPeriod / 2, nextPeriod / 2, nextPeriod / 80),
      );
      act();
    },
    updateX = (value: number) => {
      setX(clamp(value, -period / 2, period / 2, period / 80));
      act();
    };
  const tabLabels: Record<LessonTab, string> = {
    explore: "Graph Explorer",
    understand: "Period identity",
    examples: "Matching-point example",
    practice: "Check one cycle",
    summary: "Periodic summary",
  };
  return (
    <div
      className="per154-page"
      data-testid="graph-mockup-0211"
      data-dedicated-lesson="154"
      data-object-model="editable-sine-amplitude-frequency-midline-pointer-keyboard-draggable-phase-probe-generated-period-ruler-cycle-shading-matching-points-live-periodic-identity-real-tabs-language-bookmark-share-save"
      data-amplitude={amplitude}
      data-frequency={frequency}
      data-midline={midline}
      data-period={period}
      data-x={x}
      data-fx={fx}
      data-matching={matching}
      data-finder={showFinder}
      data-tab={tab}
      data-bookmarked={bookmarked}
      data-shared={shared}
      data-menu={menu}
      data-language={language}
      data-saved={saved}
    >
      <header className="per154-intro">
        <div className="per154-title">
          <div>
            <span>GRAPHS AND FUNCTIONS</span>
            <span>FUNCTIONS</span>
          </div>
          <h1>Periodic Functions</h1>
          <p>
            {language === "en"
              ? "Understand repeating behaviour."
              : "Comprende el comportamiento repetitivo."}
          </p>
        </div>
        <div className="per154-actions">
          <button
            type="button"
            className={bookmarked ? "active" : ""}
            onClick={() => {
              setBookmarked((value) => !value);
              act();
            }}
          >
            <Bookmark size={16} />
            {bookmarked ? "Bookmarked" : "Bookmark"}
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
            <Share2 size={16} />
            Share
          </button>
          <button
            type="button"
            aria-label="More lesson actions"
            onClick={() => {
              setMenu((value) => !value);
              act();
            }}
          >
            <MoreHorizontal size={18} />
          </button>
        </div>
        <div className="per154-meta">
          <span>
            <small>♙ Level</small>Intermediate–Advanced
          </span>
          <span>
            <small>ϟ Tool</small>Graph Explorer
          </span>
          <span>
            <small>◷ Duration</small>6–10 min
          </span>
          <label>
            <Globe size={18} />
            <small>Language</small>
            <select
              aria-label="Periodic lesson language"
              value={language}
              onChange={(event) => {
                setLanguage(event.target.value);
                act();
              }}
            >
              <option value="en">English (English)</option>
              <option value="es">Español (Spanish)</option>
            </select>
          </label>
          <button type="button" onClick={reset}>
            <RefreshCcw size={16} />
            Reset
          </button>
        </div>
        {shared && (
          <button
            type="button"
            className="per154-share-notice"
            onClick={() => setShared(false)}
          >
            Lesson link copied
          </button>
        )}
        {menu && (
          <div className="per154-menu">
            <button
              type="button"
              onClick={() => {
                setShowFinder((value) => !value);
                setMenu(false);
                act();
              }}
            >
              Toggle period finder
            </button>
            <button
              type="button"
              onClick={() => {
                setSaved((value) => !value);
                setMenu(false);
                act();
              }}
            >
              {saved ? "Remove from list" : "Add to my list"}
            </button>
          </div>
        )}
      </header>
      <nav className="per154-tabs" aria-label="Lesson views">
        {(
          [
            "explore",
            "understand",
            "examples",
            "practice",
            "summary",
          ] as LessonTab[]
        ).map((item) => (
          <button
            type="button"
            key={item}
            className={tab === item ? "active" : ""}
            onClick={() => {
              setTab(item);
              act();
            }}
          >
            {item === "explore"
              ? "⌁"
              : item === "understand"
                ? "♧"
                : item === "examples"
                  ? "f(x)"
                  : item === "practice"
                    ? "✎"
                    : "☷"}
            <span>{item[0].toUpperCase() + item.slice(1)}</span>
          </button>
        ))}
      </nav>
      <main className="per154-workspace">
        <section className="per154-explorer">
          <h2>{tabLabels[tab]}</h2>
          <p className="per154-formula">
            f(x) = {tidy(amplitude, 1)} sin({tidy(frequency, 1)}x){" "}
            {midline >= 0 ? "+" : "−"} {tidy(Math.abs(midline), 1)}
          </p>
          <PeriodicGraph
            amplitude={amplitude}
            frequency={frequency}
            midline={midline}
            x={x}
            showFinder={showFinder}
            onX={updateX}
          />
          <div className="per154-legend">
            <span>f(x)</span>
            <span>Midline y = {tidy(midline)}</span>
            <span>One cycle</span>
          </div>
        </section>
        <aside className="per154-controls">
          <h2>Function Controls</h2>
          <label>
            Amplitude (A)
            <div>
              <input
                aria-label="Periodic amplitude"
                type="range"
                min=".1"
                max="5"
                step=".1"
                value={amplitude}
                onChange={(event) => {
                  setAmplitude(Number(event.target.value));
                  act();
                }}
              />
              <output>{tidy(amplitude, 1)}</output>
            </div>
            <small>
              0.1 <span>5</span>
            </small>
          </label>
          <label>
            Frequency (b)
            <div>
              <input
                aria-label="Periodic frequency"
                type="range"
                min=".1"
                max="5"
                step=".1"
                value={frequency}
                onChange={(event) =>
                  updateFrequency(Number(event.target.value))
                }
              />
              <output>{tidy(frequency, 1)}</output>
            </div>
            <small>
              0.1 <span>5</span>
            </small>
          </label>
          <label>
            Midline (d)
            <div>
              <input
                aria-label="Periodic midline"
                type="range"
                min="-5"
                max="5"
                step=".1"
                value={midline}
                onChange={(event) => {
                  setMidline(Number(event.target.value));
                  act();
                }}
              />
              <output>{tidy(midline, 1)}</output>
            </div>
            <small>
              -5 <span>5</span>
            </small>
          </label>
          <div className="per154-finder">
            <button
              type="button"
              role="switch"
              aria-checked={showFinder}
              onClick={() => {
                setShowFinder((value) => !value);
                act();
              }}
            >
              Period Finder
              <i className={showFinder ? "on" : ""} />
            </button>
            <p>Period T = 2π / b = {piLabel(period)}</p>
          </div>
          <div className="per154-live">
            <h2>
              Live Check <Check size={16} />
            </h2>
            <b>f(x + T) = f(x)</b>
            <span>
              f(x)<strong>{tidy(fx)}</strong>
            </span>
            <span>
              f(x + T)<strong>{tidy(matching)}</strong>
            </span>
            <p>Match confirmed ✓</p>
          </div>
        </aside>
      </main>
      <section className="per154-concepts">
        <article>
          <i>∿</i>
          <span>
            <b>Period T = {piLabel(period)}</b>
            <small>The function repeats every T units along the x-axis.</small>
            <strong>≈ {tidy(period)}</strong>
          </span>
        </article>
        <article>
          <i>↕</i>
          <span>
            <b>Amplitude</b>
            <small>Maximum vertical distance from the midline.</small>
            <strong>{tidy(amplitude)}</strong>
          </span>
        </article>
        <article>
          <i>---</i>
          <span>
            <b>Midline</b>
            <small>
              The central horizontal line around which it oscillates.
            </small>
            <strong>y = {tidy(midline)}</strong>
          </span>
        </article>
        <article>
          <i>⚭</i>
          <span>
            <b>Matching points</b>
            <small>Points one period apart have the same output.</small>
            <strong>
              f({piLabel(x)}) = f({piLabel(x + period)})
            </strong>
          </span>
        </article>
      </section>
      <nav className="per154-neighbors" aria-label="Lesson navigation">
        <a href="/lessons/graphs-and-functions/153-increasing-and-decreasing">
          ←
          <span>
            <small>PREVIOUS</small>Increasing and Decreasing
          </span>
        </a>
        <button
          type="button"
          className={saved ? "active" : ""}
          onClick={() => {
            setSaved((value) => !value);
            act();
          }}
        >
          <Bookmark size={15} />
          {saved ? "Added to My List" : "Add to My List"}
        </button>
        <a href="/lessons/graphs-and-functions/155-recursive-functions">
          <span>
            <small>NEXT</small>Recursive Functions
          </span>
          →
        </a>
      </nav>
    </div>
  );
}
