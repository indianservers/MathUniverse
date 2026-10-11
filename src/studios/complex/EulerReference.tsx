import { useEulerCursor } from "./EulerCursor";
import { useId, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Infinity as InfinityIcon,
  SlidersHorizontal,
  BookOpen,
  Shapes,
  UserRound,
  Search,
  Sun,
  Moon,
  Settings,
  CircleHelp,
  ZoomIn,
  Expand,
  RotateCcw,
  Grid3X3,
  Play,
  Pause,
  Share2,
  CircleDashed,
  TrendingUp,
  ChartNoAxesCombined,
  Eye,
  Brain,
  FlaskConical,
  Flag,
  ChevronRight,
  Lightbulb,
  Home,
  ClipboardList,
  Grid2X2,
} from "lucide-react";
import MathExpression from "../../components/ui/MathExpression";
import { taylorExpITheta } from "./complexLabMath";
import { markComplexComplete } from "./complexStudioSession";
import { complexLessons } from "./complexLearningContent";
import "./eulerReference.css";
import HelixReference from "./HelixReference";
import ProjectionsReference from "./ProjectionsReference";
import TaylorReference from "./TaylorReference";

type Props = {
  mode: string;
  tabs: string[];
  setMode: (mode: string) => void;
  degrees: number;
  terms: number;
  setDegrees: (n: number) => void;
  setTerms: (n: number) => void;
  playing: boolean;
  play: () => void;
  motionOff: boolean;
  grid: boolean;
  setGrid: (b: boolean) => void;
  zoom: number;
  zoomIn: () => void;
  fit: () => void;
  reset: () => void;
  share: () => void;
  help: () => void;
  scene: ReactNode;
  advanced: () => void;
};
export default function EulerReference(p: Props) {
  const routeTo = useNavigate();
  const id = useId().replace(/:/g, "");
  const [arc, setArc] = useState(true),
    [coordinates, setCoordinates] = useState(true),
    [label, setLabel] = useState(true),
    [taylor, setTaylor] = useState(false),
    [trace, setTrace] = useState(false),
    [circle, setCircle] = useState(true),
    [projections, setProjections] = useState(true);
  const [choice, setChoice] = useState(""),
    [feedback, setFeedback] = useState(""),
    [question, setQuestion] = useState(0),
    [dark, setDark] = useState(false),
    [search, setSearch] = useState("");
  const rad = (p.degrees * Math.PI) / 180,
    re = Math.cos(rad),
    im = Math.sin(rad),
    r = 149 * p.zoom,
    x = 355 + re * r,
    y = 224 - im * r;
  const cursor = useEulerCursor({
    degrees: p.degrees,
    setDegrees: p.setDegrees,
    center: [355, 224],
  });
  const approximation = taylorExpITheta(rad, p.terms);
  const modeTitle = p.mode === "Taylor" ? "Taylor Series" : p.mode;
  const navigate = (pane: string) =>
    document.getElementById(`lab-tab-${pane}`)?.click();
  const formula = String.raw`e^{i\theta}=\cos\theta+i\sin\theta`;
  const questions = [
    {
      formula: String.raw`e^{i\pi}+1=?`,
      options: ["1", "−1", "0", "i"],
      correct: "0",
    },
    {
      formula: String.raw`e^{i\pi}=?`,
      options: ["1", "−1", "0", "i"],
      correct: "−1",
    },
    {
      formula: String.raw`e^{i\pi/2}=?`,
      options: ["1", "−1", "0", "i"],
      correct: "i",
    },
  ];
  const q = questions[question];
  const results = search.trim()
    ? Object.entries(complexLessons)
        .filter(([key, lesson]) =>
          `${key} ${lesson.title} ${lesson.goal} ${lesson.meaning}`
            .toLowerCase()
            .includes(search.trim().toLowerCase()),
        )
        .slice(0, 4)
    : [];
  return (
    <div className={`er-shell${dark ? " er-night" : ""}`}>
      <nav className="er-nav" aria-label="Math Universe navigation">
        <Link className="er-brand" to="/complex-numbers">
          {p.mode === "Helix" ? (
            <svg viewBox="0 0 44 44" aria-hidden="true">
              <defs>
                <linearGradient id={`${id}logo`} x2="1" y2="1">
                  <stop stopColor="#00c9f2" />
                  <stop offset=".45" stopColor="#188cfa" />
                  <stop offset=".75" stopColor="#9231f6" />
                  <stop offset="1" stopColor="#d136ff" />
                </linearGradient>
              </defs>
              <path
                d="M21 2C32 2 42 12 42 23L30 40 17 43 3 29 1 17 10 5Z"
                fill={`url(#${id}logo)`}
              />
              <path
                d="M10 20L20 9 29 13 32 21 25 26 23 36 16 30 14 24Z"
                fill="white"
              />
              <path d="M3 29L12 23 21 38 17 43Z" fill="#00e3c7" />
              <path d="M31 4L40 16 33 23 28 14Z" fill="#b244f9" />
            </svg>
          ) : p.mode === "Taylor" ? (
            <svg viewBox="0 0 64 40" aria-hidden="true">
              <defs>
                <linearGradient id={`${id}taylorlogo`}>
                  <stop stopColor="#00caf0" />
                  <stop offset="1" stopColor="#554aff" />
                </linearGradient>
              </defs>
              <path
                d="M 32 20 C 22 5 8 5 5 17 C 1 35 20 37 32 20 C 44 3 62 5 60 23 C 58 38 42 35 32 20"
                fill="none"
                stroke={`url(#${id}taylorlogo)`}
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <InfinityIcon />
          )}
          <span>
            <strong>Math Universe</strong>
            <small>EXPLORE · LEARN · CREATE</small>
          </span>
        </Link>
        <div className="er-nav-links">
          <Link to="/complex-numbers">
            {p.mode === "Taylor" ? <Home /> : <SlidersHorizontal />}
            Studio Home
          </Link>
          <button onClick={() => navigate("quiz")}>
            {p.mode === "Taylor" ? <ClipboardList /> : <BookOpen />}
            Lessons & Practice
          </button>
          <button onClick={() => navigate("uses")}>
            {p.mode === "Taylor" ? <FlaskConical /> : <Shapes />}
            Interactive Investigations
          </button>
          <Link to="/">
            {p.mode === "Taylor" ? <Grid2X2 /> : <UserRound />}
            App Home
          </Link>
        </div>
        <form
          className="er-search"
          onSubmit={(e) => {
            e.preventDefault();
            if (results.length) {
              routeTo(`/complex-numbers/${results[0][0]}`);
              setSearch("");
            }
          }}
        >
          <Search />
          <input
            aria-label="Search topics, labs, or keywords"
            placeholder="Search topics, labs, or keywords…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search.trim() && (
            <div className="er-search-results">
              {results.length ? (
                results.map(([key, lesson]) => (
                  <Link
                    key={key}
                    to={`/complex-numbers/${key}`}
                    onClick={() => setSearch("")}
                  >
                    <strong>{key.replace(/-/g, " ")}</strong>
                    <small>{lesson.title}</small>
                  </Link>
                ))
              ) : (
                <p>No matching lab. Try “Euler”, “roots”, or “polar”.</p>
              )}
            </div>
          )}
        </form>
        <button
          className="er-theme"
          aria-label="Toggle lab color theme"
          aria-pressed={dark}
          onClick={() => setDark(!dark)}
        >
          <Sun />
          <Moon />
        </button>
        <button
          className="er-settings"
          aria-label="Exploration settings"
          onClick={p.advanced}
        >
          <Settings />
        </button>
        <span className="er-avatar" aria-hidden="true">
          <UserRound />
        </span>
      </nav>
      {p.mode === "Helix" ? (
        <HelixReference
          tabs={p.tabs}
          setMode={p.setMode}
          motionOff={p.motionOff}
          advanced={p.advanced}
        />
      ) : p.mode === "Projections" ? (
        <ProjectionsReference {...p} />
      ) : p.mode === "Taylor" ? (
        <TaylorReference {...p} />
      ) : (
        <>
          <header className="er-hero">
            <svg
              className="er-hero-art"
              viewBox="0 0 1600 180"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
            >
              <defs>
                <radialGradient id={`${id}halo`}>
                  <stop stopColor="#7481ff" stopOpacity=".65" />
                  <stop offset=".42" stopColor="#3137da" stopOpacity=".3" />
                  <stop offset="1" stopColor="#102258" stopOpacity="0" />
                </radialGradient>
                <filter
                  id={`${id}bloom`}
                  x="-100%"
                  y="-100%"
                  width="300%"
                  height="300%"
                >
                  <feGaussianBlur stdDeviation="8" />
                </filter>
                <radialGradient id={`${id}bg`}>
                  <stop stopColor="#193487" />
                  <stop offset="1" stopColor="#020e27" />
                </radialGradient>
                <linearGradient id={`${id}beam`}>
                  <stop stopColor="#007fff" stopOpacity="0" />
                  <stop offset=".5" stopColor="#20dfff" />
                  <stop offset=".75" stopColor="#a773ff" />
                  <stop offset="1" stopColor="#1288ff" stopOpacity="0" />
                </linearGradient>
                <filter id={`${id}blur`}>
                  <feGaussianBlur stdDeviation="5" />
                </filter>
              </defs>
              <rect width="1600" height="180" fill={`url(#${id}bg)`} />
              <ellipse
                cx="1080"
                cy="110"
                rx="220"
                ry="190"
                fill={`url(#${id}halo)`}
              />
              <ellipse
                cx="1300"
                cy="140"
                rx="210"
                ry="180"
                fill={`url(#${id}halo)`}
              />
              <g fill="none" strokeLinecap="round">
                {Array.from({ length: 14 }, (_, i) => (
                  <path
                    key={i}
                    d={`M${520 + i * 6} ${-40 + i * 4} C${850 + i * 8} ${160 + i * 8}, ${920 + i * 5} ${-70 + i * 9}, ${970 + i * 7} 110 S${1100 + i * 4} ${220 - i * 3}, ${1170 + i * 4} 90 S${1330 + i * 4} ${-70 + i * 3}, 1600 ${90 + i * 5}`}
                    stroke={i % 3 === 0 ? "#b179ff" : "#148dff"}
                    strokeWidth={i % 4 === 0 ? 4 : 1}
                    opacity={i % 4 === 0 ? 0.65 : 0.25}
                    filter={i % 4 === 0 ? `url(#${id}bloom)` : undefined}
                  />
                ))}
                <ellipse
                  cx="1080"
                  cy="112"
                  rx="93"
                  ry="97"
                  stroke="#9275ff"
                  strokeWidth="8"
                  filter={`url(#${id}bloom)`}
                />
                <ellipse
                  cx="1080"
                  cy="112"
                  rx="93"
                  ry="97"
                  stroke="#a68cff"
                  strokeWidth="2"
                />
              </g>
              {Array.from({ length: 24 }, (_, i) => (
                <path
                  key={i}
                  d={`M ${390 - i * 13} ${190 + i * 4} C ${720 + i * 7} ${-110 + i * 12}, ${850 + i * 10} ${330 - i * 12}, ${1030 + i * 4} ${-80 + i * 4} S ${1220 + i * 12} ${240 - i * 3}, 1680 ${20 + i * 6}`}
                  fill="none"
                  stroke={`url(#${id}beam)`}
                  strokeWidth={i % 6 === 0 ? 3 : 1}
                  opacity={i % 6 === 0 ? 0.7 : 0.22}
                  filter={i % 6 === 0 ? `url(#${id}blur)` : undefined}
                />
              ))}
              {Array.from({ length: 70 }, (_, i) => (
                <circle
                  key={i}
                  cx={(i * 197) % 1600}
                  cy={(i * 47) % 180}
                  r={i % 7 === 0 ? 2 : 0.7}
                  fill="#74dcff"
                  opacity={i % 7 === 0 ? 0.8 : 0.3}
                />
              ))}
              <g transform="translate(1080 120)" stroke="#71e9ff" fill="none">
                <circle r="74" strokeWidth="2" />
                <circle r="86" stroke="#9279ff" opacity=".6" />
                <path d="M-90 0H98M0 70V-98M0 0L52-53" strokeWidth="2" />
                <path d="M44-50L52-53L50-43" strokeWidth="3" />
                <path d="M24 0A24 24 0 0 0 17-17" />
                <g
                  fill="#d0f8ff"
                  stroke="none"
                  fontFamily="Georgia"
                  fontSize="18"
                >
                  <text x="105" y="6">
                    Re
                  </text>
                  <text x="11" y="-88">
                    Im
                  </text>
                  <text x="26" y="-4">
                    θ
                  </text>
                </g>
              </g>
            </svg>
            <div className="er-hero-copy">
              <h1>Euler’s Formula Lab</h1>
              <h2>{modeTitle}</h2>
              <p>
                Explore <MathExpression value={formula} />, its series, and the
                beautiful identity{" "}
                <MathExpression value={String.raw`e^{i\pi}+1=0`} />.
              </p>
            </div>
            <div className="er-hero-equation">
              <MathExpression value={formula} />
            </div>
            <blockquote>
              “A single formula
              <br />
              that connects five great
              <br />
              fields of mathematics.”
              <small>THE BEAUTY OF EULER’S FORMULA</small>
            </blockquote>
          </header>
          <div className="er-toolbar">
            <div
              className="er-mode-buttons"
              role="group"
              aria-label="Euler lab modes"
            >
              <strong>Mode:</strong>
              {p.tabs.map((tab, i) => {
                const Icon =
                  [
                    CircleDashed,
                    TrendingUp,
                    ChartNoAxesCombined,
                    SlidersHorizontal,
                  ][i] ?? CircleDashed;
                return (
                  <button
                    key={tab}
                    aria-pressed={p.mode === tab}
                    onClick={() => p.setMode(tab)}
                  >
                    <Icon />
                    {tab === "Taylor" ? "Taylor Series" : tab}
                  </button>
                );
              })}
            </div>
            <div className="er-tool-buttons">
              <button onClick={p.zoomIn}>
                <ZoomIn />
                Zoom
              </button>
              <button onClick={p.fit}>
                <Expand />
                Fit
              </button>
              <button onClick={p.reset}>
                <RotateCcw />
                Reset
              </button>
              <button aria-pressed={p.grid} onClick={() => p.setGrid(!p.grid)}>
                <Grid3X3 />
                Grid
              </button>
              <button
                disabled={p.motionOff}
                aria-pressed={p.playing}
                onClick={p.play}
              >
                {p.playing ? <Pause /> : <Play />}Animate
              </button>
              <button onClick={p.share}>
                <Share2 />
                Share
              </button>
              <button onClick={p.help}>
                <CircleHelp />
                Help
              </button>
            </div>
          </div>
          <div className="er-panels">
            <aside className="er-parameters er-panel" aria-label="Parameters">
              <header>
                <SlidersHorizontal />
                <h3>Parameters</h3>
                <span>Live</span>
              </header>
              <div className="er-parameter-body">
                <label className="er-field">
                  <strong>Angle θ</strong>
                  <div className="er-slider-row">
                    <div>
                      <input
                        aria-label="Reference angle θ"
                        type="range"
                        min="0"
                        max="360"
                        value={p.degrees % 360 || (p.degrees ? 360 : 0)}
                        onChange={(e) => p.setDegrees(+e.target.value)}
                      />
                      <div className="er-ticks">
                        <span>0°</span>
                        <span>90°</span>
                        <span>180°</span>
                        <span>270°</span>
                        <span>360°</span>
                      </div>
                    </div>
                    <div>
                      <input
                        aria-label="Exact angle in degrees"
                        type="number"
                        min="0"
                        max="720"
                        value={+p.degrees.toFixed(1)}
                        onChange={(e) => {
                          if (e.target.value) p.setDegrees(+e.target.value);
                        }}
                      />
                      <small>{rad.toFixed(4)} rad</small>
                    </div>
                  </div>
                </label>
                <label className="er-field">
                  <strong>Taylor series terms</strong>
                  <div className="er-slider-row">
                    <div>
                      <input
                        aria-label="Reference Taylor terms"
                        type="range"
                        min="1"
                        max="32"
                        value={p.terms}
                        onChange={(e) => p.setTerms(+e.target.value)}
                      />
                      <div className="er-ticks">
                        <span>1</span>
                        <span>5</span>
                        <span>10</span>
                        <span>20</span>
                        <span>32</span>
                      </div>
                    </div>
                    <input
                      aria-label="Exact Taylor terms"
                      type="number"
                      min="1"
                      max="32"
                      value={p.terms}
                      onChange={(e) => {
                        if (e.target.value)
                          p.setTerms(
                            Math.max(1, Math.min(32, +e.target.value)),
                          );
                      }}
                    />
                  </div>
                </label>
                <div className="er-display">
                  <strong>Display options</strong>
                  {[
                    ["∠", "Show angle arc", arc, setArc],
                    [
                      "⊙",
                      "Show coordinates (cos θ, sin θ)",
                      coordinates,
                      setCoordinates,
                    ],
                    ["z", "Show complex number label", label, setLabel],
                    ["∑", "Show Taylor approximation", taylor, setTaylor],
                    ["∿", "Show trace (animation path)", trace, setTrace],
                  ].map(([icon, text, on, set]) => (
                    <label key={String(text)}>
                      <span>{String(icon)}</span>
                      {String(text)}
                      <input
                        type="checkbox"
                        checked={Boolean(on)}
                        onChange={(e) =>
                          (set as (v: boolean) => void)(e.target.checked)
                        }
                      />
                    </label>
                  ))}
                </div>
              </div>
            </aside>
            <section className="er-canvas" aria-label="Euler visualization">
              <div className="er-canvas-heading">
                <h3>
                  <MathExpression value={String.raw`e^{i\theta}`} />{" "}
                  {p.mode === "Unit Circle" ? "on the Unit Circle" : modeTitle}
                </h3>
                <p>
                  {p.mode === "Helix"
                    ? "Rotation in the complex plane, traced through angle θ"
                    : p.mode === "Taylor"
                      ? "Compare partial sums with the exact exponential"
                      : "A point on the complex plane with magnitude 1"}
                </p>
              </div>
              {p.mode === "Unit Circle" && (
                <div className="er-canvas-legend">
                  {[
                    ["Unit circle", circle, setCircle],
                    ["Angle arc", arc, setArc],
                    ["Projection lines", projections, setProjections],
                  ].map(([text, on, set]) => (
                    <label key={String(text)}>
                      <input
                        type="checkbox"
                        checked={Boolean(on)}
                        onChange={(e) =>
                          (set as (v: boolean) => void)(e.target.checked)
                        }
                      />
                      {String(text)}
                    </label>
                  ))}
                </div>
              )}
              {p.mode === "Unit Circle" && cursor.panel}
              {p.mode === "Unit Circle" ? (
                <svg
                  {...cursor.bind}
                  className="er-circle"
                  viewBox="0 0 710 425"
                  role="slider"
                  aria-label={`Unit circle at ${p.degrees.toFixed(1)} degrees; real ${re.toFixed(3)}, imaginary ${im.toFixed(3)}`}
                >
                  {cursor.hover !== null && (
                    <text x="30" y="30" className="ec-hover-label">
                      Cursor: {cursor.hover.toFixed(1)} degrees
                    </text>
                  )}
                  <defs>
                    <filter
                      id={`${id}glow`}
                      x="-50%"
                      y="-50%"
                      width="200%"
                      height="200%"
                    >
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <marker
                      id={`${id}arrow`}
                      viewBox="0 0 10 10"
                      refX="8"
                      refY="5"
                      markerWidth="7"
                      markerHeight="7"
                      orient="auto-start-reverse"
                    >
                      <path
                        d="M2 1L8 5L2 9"
                        fill="none"
                        stroke="#c0d7fa"
                        strokeWidth="1.5"
                      />
                    </marker>
                  </defs>
                  {p.grid &&
                    Array.from({ length: 9 }, (_, i) => (
                      <path
                        key={i}
                        d={`M${195 + i * 40} 55V390M180 ${65 + i * 40}H535`}
                        stroke="#335178"
                        opacity=".35"
                      />
                    ))}
                  <path
                    d="M150 224H575M355 410V22"
                    stroke="#aac5ec"
                    strokeWidth="1.4"
                    markerEnd={`url(#${id}arrow)`}
                  />
                  <path
                    d="M355 224H575"
                    stroke="#aac5ec"
                    strokeWidth="1.4"
                    markerEnd={`url(#${id}arrow)`}
                  />
                  {circle && (
                    <>
                      <circle
                        cx="355"
                        cy="224"
                        r={r + 18}
                        fill="none"
                        stroke="#258bc3"
                        strokeDasharray="3 4"
                      />
                      <circle
                        cx="355"
                        cy="224"
                        r={r}
                        fill="none"
                        stroke="#27dfff"
                        strokeWidth="2.8"
                        filter={`url(#${id}glow)`}
                      />
                    </>
                  )}
                  {trace && (
                    <path
                      d={`M${355 + r} 224 A${r} ${r} 0 ${p.degrees % 360 > 180 ? 1 : 0} 0 ${x} ${y}`}
                      fill="none"
                      stroke="#9c7dff"
                      strokeWidth="5"
                      opacity=".65"
                    />
                  )}
                  {projections && (
                    <path
                      d={`M355 ${y}H${x}V224`}
                      fill="none"
                      stroke="#b8c7df"
                      strokeDasharray="3 5"
                    />
                  )}
                  <path
                    d={`M355 224L${x} ${y}`}
                    stroke="#ffc546"
                    strokeWidth="2.5"
                  />
                  {arc && (
                    <>
                      <path
                        d={`M400 224 A45 45 0 0 ${p.degrees % 360 > 180 ? 1 : 0} ${355 + 45 * re} ${224 - 45 * im}`}
                        stroke="#ffb92d"
                        fill="none"
                        strokeWidth="1.8"
                      />
                      <text x="412" y="244" fill="#ffc436" fontStyle="italic">
                        θ = {p.degrees.toFixed(0)}°
                      </text>
                    </>
                  )}
                  <circle
                    cx={x}
                    cy={y}
                    r="7.5"
                    fill="#ffc747"
                    stroke="#fff4b4"
                    strokeWidth="2.5"
                    filter={`url(#${id}glow)`}
                  />
                  {[-1, 1].map((n) => (
                    <g key={n} fill="#d5e7ff">
                      <circle cx="355" cy={224 + n * r} r="3" fill="#90f7ff" />
                      <text x="331" y={224 + n * r + (n < 0 ? 22 : -9)}>
                        {-n}
                      </text>
                      <text x={355 + n * r - 5} y="247">
                        {n === -1 ? "−1" : "1"}
                      </text>
                    </g>
                  ))}
                  <g fill="#e8f0ff">
                    <text x="367" y="34">
                      Im
                    </text>
                    <text x="568" y="210">
                      Re
                    </text>
                  </g>
                  {label && (
                    <text
                      x={Math.min(x + 32, 540)}
                      y={y - 6}
                      fill="#ffc747"
                      fontStyle="italic"
                    >
                      z = e
                      <tspan baselineShift="super" fontSize="15">
                        iθ
                      </tspan>
                    </text>
                  )}
                  {coordinates && (
                    <text
                      x={Math.min(x + 32, 525)}
                      y={y + 18}
                      fill="#edf4ff"
                      fontFamily="system-ui"
                      fontSize="16"
                    >
                      ({re.toFixed(3)}, {im.toFixed(3)})
                    </text>
                  )}
                  {taylor && (
                    <g>
                      <path
                        d={`M${x} ${y}L${355 + approximation.re * r} ${224 - approximation.im * r}`}
                        stroke="#fda4f8"
                        strokeDasharray="4 4"
                      />
                      <rect
                        x={355 + approximation.re * r - 5}
                        y={224 - approximation.im * r - 5}
                        width="10"
                        height="10"
                        fill="#fa8bdc"
                        stroke="#ffe3f7"
                      />
                      <text
                        x="22"
                        y="345"
                        fill="#fda4f8"
                        fontFamily="system-ui"
                        fontSize="12"
                      >
                        ■ {p.terms}-term Taylor sum
                      </text>
                    </g>
                  )}
                </svg>
              ) : (
                <div className="er-other-scene">{p.scene}</div>
              )}
              <div className="er-canvas-play">
                <button
                  aria-label={p.playing ? "Pause rotation" : "Play rotation"}
                  disabled={p.motionOff}
                  onClick={p.play}
                >
                  {p.playing ? <Pause /> : <Play fill="currentColor" />}
                </button>
                <label>
                  <input
                    aria-label="Canvas angle"
                    type="range"
                    min="0"
                    max="360"
                    value={p.degrees % 360}
                    onChange={(e) => p.setDegrees(+e.target.value)}
                  />
                  <span>
                    <small>0°</small>
                    <small>360°</small>
                  </span>
                </label>
                <button
                  className="er-auto"
                  disabled={p.motionOff}
                  aria-pressed={p.playing}
                  onClick={p.play}
                >
                  <Play />
                  Auto Rotate
                </button>
              </div>
            </section>
            <aside className="er-result er-panel">
              <header>
                <BookOpen />
                <h3>Euler’s Formula</h3>
                <span>Key Result</span>
              </header>
              <div className="er-equation">
                <MathExpression value={formula} />
              </div>
              <p>
                This elegant formula links exponential functions, trigonometry,
                complex numbers, and geometry.
              </p>
              <div className="er-values">
                <strong>
                  At θ = {p.degrees.toFixed(0)}°{" "}
                  <span>({rad.toFixed(4)} rad)</span>
                </strong>
                <div>
                  <div>
                    <p>cos θ = {re.toFixed(4)}</p>
                    <p>sin θ = {im.toFixed(4)}</p>
                    <p>
                      e<sup>iθ</sup> = {re.toFixed(4)} {im < 0 ? "−" : "+"}{" "}
                      {Math.abs(im).toFixed(4)}i
                    </p>
                  </div>
                  <div>
                    <p>
                      |e<sup>iθ</sup>| = 1
                    </p>
                    <p>
                      arg(e<sup>iθ</sup>) = {(p.degrees % 360).toFixed(0)}°
                    </p>
                    <p>
                      (cos θ, sin θ) = ({re.toFixed(3)}, {im.toFixed(3)})
                    </p>
                  </div>
                </div>
              </div>
              <form
                className="er-concept"
                onSubmit={(e) => {
                  e.preventDefault();
                  setFeedback(
                    !choice
                      ? "Select an answer first."
                      : choice === q.correct
                        ? "Correct! Euler’s formula gives exactly this value."
                        : "Try substituting the angle into cos θ + i sin θ.",
                  );
                  if (choice === q.correct) markComplexComplete("euler");
                }}
              >
                <div>
                  <h4>
                    <Lightbulb />
                    Concept Check
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setQuestion((question + 1) % 3);
                      setChoice("");
                      setFeedback("");
                    }}
                  >
                    New Question
                  </button>
                </div>
                <MathExpression value={q.formula} />
                <div className="er-answers">
                  {q.options.map((option, i) => (
                    <label
                      key={option}
                      className={choice === option ? "is-selected" : ""}
                    >
                      <input
                        type="radio"
                        name="euler-concept"
                        value={option}
                        checked={choice === option}
                        onChange={() => {
                          setChoice(option);
                          setFeedback("");
                        }}
                      />
                      <span>{"ABCD"[i]}</span>
                      {option}
                    </label>
                  ))}
                </div>
                <button className="er-primary" type="submit">
                  Check Answer
                </button>
                {feedback && <p role="status">{feedback}</p>}
              </form>
            </aside>
          </div>
          <div className="er-learning-cards">
            {[
              {
                title: "Observe",
                icon: Eye,
                text: "Watch eⁱθ move on the unit circle and trace the helix in 3D.",
                action: () => p.setMode("Helix"),
              },
              {
                title: "Understand",
                icon: BookOpen,
                text: "eⁱθ has constant magnitude 1 and encodes pure rotation by θ.",
                action: () => navigate("meaning"),
              },
              {
                title: "Why",
                icon: Brain,
                text: "Taylor series of eˣ extends to x = iθ, linking exponentials and trig.",
                action: () => navigate("more"),
              },
              {
                title: "Try",
                icon: FlaskConical,
                text: "Change θ, terms, and trace length. Predict where eⁱθ goes next.",
                action: p.advanced,
              },
              {
                title: "Challenge",
                icon: Flag,
                text: "Prove eⁱπ + 1 = 0 and explore eⁱ²π = 1. Can you generalize?",
                action: () => navigate("quiz"),
              },
            ].map(({ title, icon: Icon, text, action }) => (
              <button key={title} onClick={action}>
                <span className="er-card-icon">
                  <Icon />
                </span>
                <span>
                  <strong>{title}</strong>
                  <small>{text}</small>
                </span>
                <ChevronRight />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
