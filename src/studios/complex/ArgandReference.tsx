import {
  useId,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import { Link } from "react-router-dom";
import {
  Home,
  BookOpen,
  FlaskConical,
  Grid2X2,
  Search,
  Sun,
  Moon,
  CircleHelp,
  Bell,
  Target,
  ChartNoAxesColumn,
  Triangle,
  CircleDashed,
  Ruler,
  Settings,
  Plus,
  ZoomIn,
  ZoomOut,
  Expand,
  RotateCcw,
  Lightbulb,
  Binoculars,
  Brain,
  Trophy,
  ChevronRight,
  Check,
  Bot,
  X,
  GitCommitHorizontal,
  ChartPie,
} from "lucide-react";
import MathExpression from "../../components/ui/MathExpression";
import { useLabMode } from "../mockup/studioLabKit";
import type { StudioMockupPage } from "../mockup/studioMockupCatalog";
import { useStudioState } from "../phase1/StudioModelProvider";
import ComplexLearningDepth from "./ComplexLearningDepth";
import {
  argandComplex,
  argandNumber,
  complexLabel,
} from "./argandReferenceMath";
import { markComplexComplete } from "./complexStudioSession";
import "./argandReference.css";

const icons = [
  Target,
  ChartNoAxesColumn,
  Triangle,
  GitCommitHorizontal,
  Ruler,
  CircleDashed,
];
const f = (n: number, digits = 1) => Number(n.toFixed(digits)).toString();
const M = ({ value }: { value: string }) => <MathExpression value={value} />;
const descriptions: Record<string, string> = {
  Plot: "Set the real and imaginary parts to plot a complex number on the Argand plane.",
  Modulus:
    "Set the real and imaginary parts to explore the modulus |z|, the distance from the origin.",
  Argument:
    "Set the real and imaginary parts to explore the argument (angle) of a complex number on the Argand plane.",
  Conjugate:
    "Set the real and imaginary parts to plot a complex number and its conjugate. The conjugate reflects the point across the real axis.",
  Distance:
    "Set the two complex numbers and explore the distance between them on the Argand plane.",
  Locus:
    "Explore the set of points that satisfy a condition on the complex plane.",
};

function Field({
  label,
  value,
  change,
  color = "#168fff",
  min = -10,
  max = 10,
}: {
  label: string;
  value: number;
  change: (n: number) => void;
  color?: string;
  min?: number;
  max?: number;
}) {
  const update = (raw: string) => {
    if (raw !== "" && Number.isFinite(Number(raw)))
      change(Math.min(max, Math.max(min, Number(raw))));
  };
  return (
    <label className="ar-field">
      <strong>{label}</strong>
      <div>
        <div className="ar-range">
          <input
            aria-label={`${label} slider`}
            type="range"
            min={min}
            max={max}
            step="0.1"
            value={value}
            onChange={(e) => update(e.target.value)}
            style={
              {
                "--fill": `${((value - min) / (max - min)) * 100}%`,
                "--accent": color,
              } as CSSProperties
            }
          />
          <small>
            <span>{min}</span>
            <span>{max}</span>
          </small>
        </div>
        <input
          aria-label={label}
          type="number"
          min={min}
          max={max}
          step="0.1"
          value={value}
          onChange={(e) => update(e.target.value)}
        />
      </div>
    </label>
  );
}
function Toggle({
  label,
  checked,
  change,
  detail,
}: {
  label: string;
  checked: boolean;
  change: (v: boolean) => void;
  detail?: string;
}) {
  return (
    <label className="ar-toggle">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => change(e.target.checked)}
      />
      <span>
        <b>{label}</b>
        {detail && <small>{detail}</small>}
      </span>
    </label>
  );
}

export default function ArgandReference({ page }: { page: StudioMockupPage }) {
  const { tabs, mode, setMode } = useLabMode(page);
  const [a, setA] = useStudioState("ComplexNumbersStudioLabs:ArgandLab:re", 3);
  const [b, setB] = useStudioState("ComplexNumbersStudioLabs:ArgandLab:im", 4);
  const [c, setC] = useStudioState("ArgandReference:c", -1),
    [d, setD] = useStudioState("ArgandReference:d", 2);
  const [radius, setRadius] = useStudioState("ArgandReference:radius", 5);
  const [centerA, setCenterA] = useState(0),
    [centerB, setCenterB] = useState(0);
  const [grid, setGrid] = useState(true),
    [axes, setAxes] = useState(true),
    [guides, setGuides] = useState(true),
    [arc, setArc] = useState(true),
    [hover, setHover] = useState(true),
    [radians, setRadians] = useState(false),
    [locus, setLocus] = useState(true),
    [sample, setSample] = useState(true),
    [reference, setReference] = useState(false),
    [locusType, setLocusType] = useState("circle");
  const [zoom, setZoom] = useState(1),
    [answer, setAnswer] = useState(""),
    [feedback, setFeedback] = useState(""),
    [choice, setChoice] = useState<number | null>(null),
    [night, setNight] = useState(false),
    [search, setSearch] = useState(""),
    [help, setHelp] = useState(false),
    [lesson, setLesson] = useState<string | null>(null),
    [full, setFull] = useState(false);
  const figure = useRef<HTMLElement>(null),
    uid = useId().replace(/:/g, "");
  useEffect(() => {
    const syncFullscreen = () =>
      setFull(document.fullscreenElement === figure.current);
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () =>
      document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);
  useEffect(() => {
    setFeedback("");
    setChoice(null);
  }, [a, b, c, d, radius, centerA, centerB, locusType, radians]);
  const r = Math.hypot(a, b),
    theta = Math.atan2(b, a),
    angle = (theta * 180) / Math.PI,
    dist = Math.hypot(a - c, b - d);
  const arg =
    r < 1e-10
      ? "\\text{undefined}"
      : radians
        ? `${f(theta, 3)}\\,\\text{rad}`
        : `${f(angle)}^\\circ`;
  const rect = complexLabel(a, b),
    conjugate = complexLabel(a, -b),
    w = complexLabel(c, d);
  const tex = (real: number, imaginary: number) =>
    `${f(real, 2)}${imaginary < 0 ? "-" : "+"}${f(Math.abs(imaginary), 2)}i`;
  const rr = Math.hypot(a - centerA, b - centerB),
    satisfied =
      locusType === "circle"
        ? Math.abs(rr - radius) < 0.025
        : locusType === "disk"
          ? rr <= radius + 0.025
          : Math.abs(a - centerA) < 0.025;
  const locusFormula =
    locusType === "line"
      ? `\\operatorname{Re}z=${f(centerA)}`
      : `${centerA || centerB ? `|z-(${tex(centerA, centerB)})|` : "|z|"}${locusType === "disk" ? "\\le" : "="}${f(radius)}`;
  const extent =
    (mode === "Locus"
      ? Math.max(
          8,
          Math.abs(centerA) + radius + 1,
          Math.abs(centerB) + radius + 1,
        )
      : Math.max(
          6.5,
          Math.abs(a) + 1,
          Math.abs(b) + 1,
          mode === "Distance" ? Math.abs(c) + 1 : 0,
          mode === "Distance" ? Math.abs(d) + 1 : 0,
        )) / zoom;
  const scale = 236 / extent,
    ox = 265,
    oy = 242,
    px = (v: number) => ox + v * scale,
    py = (v: number) => oy - v * scale;
  const tickStep = extent > 12 ? 5 : extent > 8 ? 2 : 1;
  const ticks = Array.from(
    { length: Math.floor(extent / tickStep) * 2 + 1 },
    (_, i) => (i - Math.floor(extent / tickStep)) * tickStep,
  );
  const zX = px(a),
    zY = py(b),
    arcR = 36;
  const pick = (event: PointerEvent<SVGSVGElement>) => {
    if (event.type === "pointermove" && !(event.buttons & 1)) return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - box.left,
      y = event.clientY - box.top;
    const renderedScale = Math.min(box.width / 530, box.height / 484);
    const localX = (x - (box.width - 530 * renderedScale) / 2) / renderedScale,
      localY = (y - (box.height - 484 * renderedScale) / 2) / renderedScale;
    const real = Math.max(
        -10,
        Math.min(10, Math.round(((localX - ox) / scale) * 10) / 10),
      ),
      imaginary = Math.max(
        -10,
        Math.min(10, Math.round(((oy - localY) / scale) * 10) / 10),
      );
    if (event.shiftKey && mode === "Distance") {
      setC(real);
      setD(imaginary);
    } else {
      setA(real);
      setB(imaginary);
    }
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const reset = () => {
    setA(3);
    setB(4);
    setC(-1);
    setD(2);
    setRadius(5);
    setCenterA(0);
    setCenterB(0);
    setGrid(true);
    setAxes(true);
    setGuides(true);
    setArc(true);
    setHover(true);
    setRadians(false);
    setLocus(true);
    setSample(true);
    setReference(false);
    setLocusType("circle");
    setZoom(1);
    setAnswer("");
    setFeedback("");
    setChoice(null);
  };
  const changeMode = (value: string) => {
    setMode(value);
    setAnswer("");
    setFeedback("");
    setChoice(null);
    setLesson(null);
  };
  const checkAnswer = () => {
    let correct = false;
    if (mode === "Locus") correct = choice === 0;
    else if (mode === "Conjugate") {
      const result = argandComplex(answer);
      correct =
        !!result &&
        Math.abs(result[0] - a) < 0.01 &&
        Math.abs(result[1] + b) < 0.01;
    } else {
      const result = argandNumber(answer);
      const expected =
        mode === "Distance"
          ? dist
          : mode === "Argument"
            ? radians
              ? theta
              : angle
            : r;
      correct =
        r > 1e-10 || mode !== "Argument"
          ? Number.isFinite(result) &&
            Math.abs(result - expected) < (mode === "Argument" ? 0.06 : 0.02)
          : answer.trim().toLowerCase() === "undefined";
    }
    setFeedback(
      correct
        ? "Correct! Your answer matches the live figure."
        : "Try again. Use the highlighted property and the values in the figure.",
    );
    if (correct) markComplexComplete("argand-plane");
  };
  const question =
    mode === "Distance"
      ? `What is the distance between z and w?`
      : mode === "Argument"
        ? `What is the argument of ${rect}?`
        : mode === "Conjugate"
          ? `What is the conjugate of ${rect}?`
          : mode === "Locus"
            ? `Which set of points satisfies the current locus?`
            : `What is |${rect}|?`;
  const learning = [
    [
      "Observe",
      mode === "Distance"
        ? "Move the points and see how the distance changes."
        : `Move the point and see how the ${mode === "Plot" ? "coordinates" : mode.toLowerCase()} changes.`,
    ],
    [
      "Understand",
      mode === "Conjugate"
        ? "Learn why the conjugate reflects across the real axis."
        : mode === "Locus"
          ? "Learn the equations behind common loci."
          : `See how ${mode.toLowerCase()} represents complex numbers.`,
    ],
    ["Why", "Learn the connection between algebra and geometry."],
    ["Try", "Set your own values and explore patterns."],
    [
      "Challenge",
      mode === "Conjugate"
        ? "If z = 2 − 5i, what is its conjugate?"
        : mode === "Distance"
          ? "Can you find w such that d(z, w) = 5?"
          : mode === "Locus"
            ? "Can you find the locus |z − 2 − 3i| = 4?"
            : mode === "Argument"
              ? "Find a complex number with a given argument."
              : mode === "Modulus"
                ? "Find all numbers with |z| = 5. What shape is it?"
                : "Can you plot |z| = 5 and arg z = 120°?",
    ],
  ];
  const learnIcons = [Binoculars, BookOpen, Brain, FlaskConical, Trophy];
  const row = (
    label: string,
    formula: string,
    color: string,
    Icon = ChartNoAxesColumn,
    active = false,
  ) => (
    <div className={`ar-insight-row ${color}${active ? " selected" : ""}`}>
      <Icon />
      <b>{label}</b>
      <M value={formula} />
    </div>
  );
  return (
    <div
      className={`argand-reference${night ? " ar-night" : ""}`}
      data-complex-owned
      data-lab-pane="workspace"
      data-lab-mode={mode}
      data-cx-mode={mode}
      data-mode-canvas={mode}
    >
      <nav className="ar-nav" aria-label="Math Universe navigation">
        <Link className="ar-brand" to="/complex-numbers">
          <svg viewBox="0 0 48 48" aria-hidden="true">
            <defs>
              <linearGradient id={`${uid}logo`}>
                <stop stopColor="#02c8ef" />
                <stop offset=".5" stopColor="#236dff" />
                <stop offset="1" stopColor="#963dff" />
              </linearGradient>
            </defs>
            <rect x="1" y="1" width="46" height="46" rx="14" fill="#edf5ff" />
            <path
              d="M8 34 15 12Q19 8 25 17L38 35Q42 42 38 13Q36 5 29 16L13 35Q5 43 8 34Z"
              fill="none"
              stroke={`url(#${uid}logo)`}
              strokeWidth="6"
              strokeLinejoin="round"
            />
          </svg>
          <b>Math Universe</b>
        </Link>
        <div className="ar-links">
          <Link to="/complex-numbers">
            <Home />
            Studio Home
          </Link>
          <Link to="/lessons">
            <BookOpen />
            Lessons & Practice
          </Link>
          <Link className="active" to="/complex-numbers/argand-plane">
            <FlaskConical />
            Interactive Investigations
          </Link>
          <Link to="/">
            <Grid2X2 />
            App Home
          </Link>
        </div>
        <label className="ar-search">
          <Search />
          <input
            aria-label="Search studio modes"
            placeholder="Search topics, skills, or investigations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <div>
              {tabs
                .filter((t) => t.toLowerCase().includes(search.toLowerCase()))
                .map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      changeMode(t);
                      setSearch("");
                    }}
                  >
                    {t}
                  </button>
                ))}
              {!tabs.some((t) =>
                t.toLowerCase().includes(search.toLowerCase()),
              ) && <span>No matching modes</span>}
            </div>
          )}
        </label>
        <button aria-label="Toggle theme" onClick={() => setNight(!night)}>
          {night ? <Moon /> : <Sun />}
        </button>
        <button aria-label="Help" onClick={() => setHelp(!help)}>
          <CircleHelp />
        </button>
        <button
          aria-label="Learning progress"
          onClick={() => setLesson("Progress")}
        >
          <Bell />
        </button>
        <button
          className="ar-avatar"
          aria-label="Studio profile"
          onClick={() => setLesson("Progress")}
        >
          A
        </button>
      </nav>
      <header className="ar-hero">
        <div className="ar-hero-icon">
          <Plus />
          <span>↔</span>
        </div>
        <div>
          <small>COMPLEX NUMBERS STUDIO</small>
          <h1>Argand Plane Lab</h1>
          <p>Plot z, modulus, argument, conjugate, distance, locus.</p>
        </div>
        <div className="ar-hero-math">
          <M value="z=a+bi" />
          <p>
            See complex numbers.
            <br />
            Explore their geometry.
            <br />
            Build deeper intuition.
          </p>
        </div>
        <svg className="ar-hero-plane" viewBox="0 0 300 170" aria-hidden="true">
          <defs>
            <radialGradient id={`${uid}orb`}>
              <stop stopColor="#b5f4ff" />
              <stop offset="1" stopColor="#c795fb" stopOpacity=".7" />
            </radialGradient>
          </defs>
          <circle cx="230" cy="66" r="45" fill={`url(#${uid}orb)`} />
          {[42, 64, 86].map((r) => (
            <circle
              key={r}
              cx="93"
              cy="97"
              r={r}
              fill="none"
              stroke="#83c3fb"
              opacity=".45"
            />
          ))}
          <path d="M0 97H195M93 166V4" stroke="#6596d7" />
          <path d="m190 93 6 4-6 4M89 10l4-7 4 7" fill="#6596d7" />
          <text x="201" y="116">
            Re
          </text>
          <text x="104" y="25">
            Im
          </text>
        </svg>
        <blockquote>
          “Numbers become
          <br />
          clearer when you
          <br />
          see them.”<small>— MATH UNIVERSE</small>
        </blockquote>
      </header>
      {help && (
        <section className="ar-message" role="dialog" aria-label="Argand help">
          <b>Explore the Argand plane</b>
          <p>
            Drag or click the graph to move z. In Distance mode, hold Shift to
            move w. Use the sliders or number fields for precise values. Zoom
            changes the scale; Reset restores 3 + 4i.
          </p>
          <button onClick={() => setHelp(false)}>Close</button>
        </section>
      )}
      <nav className="ar-modes" aria-label="Argand Plane Lab modes">
        {tabs.map((t, i) => {
          const Icon = icons[i];
          return (
            <button
              key={t}
              aria-pressed={mode === t}
              className={mode === t ? "active" : ""}
              onClick={() => changeMode(t)}
            >
              <Icon />
              {t}
            </button>
          );
        })}
      </nav>
      <div className="ar-panes">
        <section className="ar-panel ar-controls">
          <h2>
            <span>{mode === "Argument" ? <Triangle /> : <Settings />}</span>
            {mode === "Plot" ? "Plot z" : mode}
          </h2>
          <p>{descriptions[mode]}</p>
          {mode === "Locus" ? (
            <>
              <label className="ar-locus-select">
                <b>Locus type</b>
                <select
                  value={locusType}
                  onChange={(e) => {
                    setLocusType(e.target.value);
                    setFeedback("");
                    setChoice(null);
                  }}
                >
                  <option value="circle">Circle: |z − center| = r</option>
                  <option value="disk">Disk: |z − center| ≤ r</option>
                  <option value="line">Vertical line: Re z = a</option>
                </select>
              </label>
              <p className="ar-subtext">
                {locusType === "circle"
                  ? "All complex numbers at a fixed distance from the center."
                  : locusType === "disk"
                    ? "All complex numbers within the selected radius."
                    : "All complex numbers with the selected real part."}
              </p>
              {locusType !== "line" && (
                <Field
                  label="Radius r"
                  value={radius}
                  min={0.5}
                  max={10}
                  change={setRadius}
                />
              )}
              <h3>Center (optional)</h3>
              <Field
                label="Real part a"
                value={centerA}
                change={setCenterA}
                color="#8d4bff"
              />
              <Field
                label="Imaginary part b"
                value={centerB}
                change={setCenterB}
                color="#8d4bff"
              />
              <div className="ar-locus-toggles">
                <Toggle
                  label="Show locus (traced set)"
                  checked={locus}
                  change={setLocus}
                />
                <Toggle
                  label={`Show sample point z = ${rect}`}
                  checked={sample}
                  change={setSample}
                />
                {locusType !== "line" && (
                  <Toggle
                    label="Show grid circle at r/2"
                    checked={reference}
                    change={setReference}
                  />
                )}
              </div>
            </>
          ) : (
            <>
              {mode === "Distance" && <h3>Point z = a + bi</h3>}
              <Field label="Real part a" value={a} change={setA} />
              <Field
                label="Imaginary part b"
                value={b}
                change={setB}
                color="#8d4bff"
              />
              {mode === "Distance" ? (
                <>
                  <hr />
                  <h3>Point w = c + di</h3>
                  <Field
                    label="Real part c"
                    value={c}
                    change={setC}
                    color="#04c5e5"
                  />
                  <Field
                    label="Imaginary part d"
                    value={d}
                    change={setD}
                    color="#8d4bff"
                  />
                  <Toggle
                    label="Show measurement guides"
                    checked={guides}
                    change={setGuides}
                    detail="Show projections to axes and distance label"
                  />
                </>
              ) : mode === "Argument" ? (
                <>
                  <hr />
                  <h3>Angle display</h3>
                  <Toggle
                    label="Show angle arc (argument)"
                    checked={arc}
                    change={setArc}
                  />
                  <div className="ar-units">
                    <b>Angle units</b>
                    <label>
                      <input
                        type="radio"
                        name={`${uid}units`}
                        checked={!radians}
                        onChange={() => setRadians(false)}
                      />
                      Degrees (°)
                    </label>
                    <label>
                      <input
                        type="radio"
                        name={`${uid}units`}
                        checked={radians}
                        onChange={() => setRadians(true)}
                      />
                      Radians (rad)
                    </label>
                  </div>
                </>
              ) : mode === "Conjugate" ? (
                <>
                  <hr />
                  <Toggle
                    label="Show reflection guides"
                    checked={guides}
                    change={setGuides}
                    detail="Show the line of symmetry and guides across the real axis"
                  />
                </>
              ) : (
                <>
                  {mode === "Modulus" ? (
                    <div className="ar-modulus">
                      <b>Modulus (radius)</b>
                      <M
                        value={`|z|=\\sqrt{a^2+b^2}=\\sqrt{(${f(a)})^2+(${f(b)})^2}=${f(r, 2)}`}
                      />
                    </div>
                  ) : (
                    <div className="ar-complex-input">
                      <h3>Complex number</h3>
                      <span>
                        z ={" "}
                        <input
                          aria-label="Complex real part"
                          type="number"
                          step="0.1"
                          min="-10"
                          max="10"
                          value={a}
                          onChange={(e) => {
                            if (e.target.value)
                              setA(
                                Math.max(
                                  -10,
                                  Math.min(10, Number(e.target.value)),
                                ),
                              );
                          }}
                        />{" "}
                        +{" "}
                        <input
                          aria-label="Complex imaginary part"
                          type="number"
                          step="0.1"
                          min="-10"
                          max="10"
                          value={b}
                          onChange={(e) => {
                            if (e.target.value)
                              setB(
                                Math.max(
                                  -10,
                                  Math.min(10, Number(e.target.value)),
                                ),
                              );
                          }}
                        />{" "}
                        i
                      </span>
                    </div>
                  )}
                  <h3>Quick presets</h3>
                  <div className="ar-presets">
                    {[
                      [1, 1],
                      [1, -1],
                      [2, 3],
                      [-1, 2],
                    ].map(([re, im]) => (
                      <button
                        key={`${re},${im}`}
                        onClick={() => {
                          setA(re);
                          setB(im);
                        }}
                      >
                        {complexLabel(re, im)}
                      </button>
                    ))}
                  </div>
                  <Toggle
                    label="Show coordinates on hover"
                    checked={hover}
                    change={setHover}
                  />
                </>
              )}
            </>
          )}
        </section>
        <section className="ar-panel ar-figure" ref={figure}>
          <header>
            <h2>
              <span>
                <Plus />
              </span>
              Argand Plane
            </h2>
            <div className="ar-tools">
              <button aria-pressed={grid} onClick={() => setGrid(!grid)}>
                <span className="ar-check">{grid && <Check />}</span>Grid
              </button>
              <button aria-pressed={axes} onClick={() => setAxes(!axes)}>
                <Plus />
                Axes
              </button>
              <button
                aria-label="Zoom out"
                onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
              >
                <ZoomOut />
              </button>
              <button
                aria-label="Zoom in"
                onClick={() => setZoom(Math.min(3, zoom + 0.25))}
              >
                <ZoomIn />
              </button>
              <button
                aria-label={full ? "Exit fullscreen" : "Fullscreen"}
                onClick={async () => {
                  if (document.fullscreenElement) {
                    await document.exitFullscreen();
                    setFull(false);
                  } else if (figure.current) {
                    await figure.current.requestFullscreen();
                    setFull(true);
                  }
                }}
              >
                <Expand />
              </button>
              <button onClick={reset}>
                <RotateCcw />
                Reset
              </button>
            </div>
          </header>
          <div className="ar-graph-layout">
            <svg
              className="ar-graph"
              viewBox="0 0 530 484"
              aria-label={`Argand plane, z = ${rect}${mode === "Distance" ? `, w = ${w}` : ""}`}
              role="img"
              tabIndex={0}
              onPointerDown={pick}
              onPointerMove={pick}
              onKeyDown={(e) => {
                const delta = e.shiftKey ? 1 : 0.1;
                if (
                  ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
                    e.key,
                  )
                ) {
                  e.preventDefault();
                  if (e.key === "ArrowUp") setB(Math.min(10, b + delta));
                  if (e.key === "ArrowDown") setB(Math.max(-10, b - delta));
                  if (e.key === "ArrowLeft") setA(Math.max(-10, a - delta));
                  if (e.key === "ArrowRight") setA(Math.min(10, a + delta));
                }
              }}
            >
              <defs>
                <clipPath id={`${uid}clip`}>
                  <rect x="5" y="5" width="520" height="474" />
                </clipPath>
                <marker
                  id={`${uid}arrow`}
                  markerWidth="6"
                  markerHeight="6"
                  refX="3"
                  refY="3"
                  orient="auto-start-reverse"
                >
                  <path d="M0 0 6 3 0 6" fill="#536d9b" />
                </marker>
              </defs>
              <g clipPath={`url(#${uid}clip)`}>
                {grid &&
                  ticks.map((v) => (
                    <g key={v} stroke="#e2edf9" strokeWidth="1">
                      <path d={`M${px(v)} 5V479M5 ${py(v)}H525`} />
                    </g>
                  ))}
                {mode === "Locus" &&
                  locus &&
                  (locusType === "line" ? (
                    <path
                      d={`M${px(centerA)} 0V484`}
                      stroke="#078dff"
                      strokeWidth="2"
                      strokeDasharray="8 5"
                    />
                  ) : (
                    <circle
                      cx={px(centerA)}
                      cy={py(centerB)}
                      r={radius * scale}
                      fill={locusType === "disk" ? "#16a9ff15" : "none"}
                      stroke="#078dff"
                      strokeWidth="2"
                      strokeDasharray="8 5"
                    />
                  ))}
                {mode === "Locus" && reference && locusType !== "line" && (
                  <circle
                    cx={px(centerA)}
                    cy={py(centerB)}
                    r={(radius * scale) / 2}
                    fill="none"
                    stroke="#acbce0"
                    strokeDasharray="5 3"
                  />
                )}
                {mode === "Modulus" && (
                  <circle
                    cx={ox}
                    cy={oy}
                    r={r * scale}
                    fill="none"
                    stroke="#05bcef"
                    strokeWidth="1.4"
                    strokeDasharray="8 5"
                  />
                )}
                {axes && (
                  <>
                    <path
                      d="M8 242H521M265 476V9"
                      fill="none"
                      stroke="#536d9b"
                      strokeWidth="1.2"
                      markerEnd={`url(#${uid}arrow)`}
                      markerStart={`url(#${uid}arrow)`}
                    />
                    {ticks
                      .filter((v) => v !== 0)
                      .map((v) => (
                        <g key={v}>
                          <path
                            d={`M${px(v)} 238v8M261 ${py(v)}h8`}
                            stroke="#536d9b"
                          />
                          {(Math.abs(v) % 2 === 0 || tickStep > 1) && (
                            <>
                              <text x={px(v)} y={oy + 24} textAnchor="middle">
                                {v}
                              </text>
                              <text x={ox - 12} y={py(v) + 4} textAnchor="end">
                                {v}
                              </text>
                            </>
                          )}
                        </g>
                      ))}
                    <text x="515" y="234">
                      Re
                    </text>
                    <text x="277" y="12">
                      Im
                    </text>
                  </>
                )}
                {(mode !== "Locus" || sample) && (
                  <>
                    <path
                      d={`M${ox} ${oy}L${zX} ${zY}`}
                      stroke="#00b8e8"
                      strokeWidth="3.3"
                      fill="none"
                    />
                    {mode !== "Conjugate" &&
                      mode !== "Distance" &&
                      mode !== "Locus" &&
                      arc &&
                      r > 1e-10 && (
                        <>
                          <path
                            d={`M${ox} ${oy}h${arcR}A${arcR} ${arcR} 0 ${Math.abs(theta) > Math.PI ? 1 : 0} ${theta < 0 ? 1 : 0} ${ox + Math.cos(theta) * arcR} ${oy - Math.sin(theta) * arcR}Z`}
                            fill="#ffcb362d"
                            stroke="#ffa000"
                            strokeWidth="1.5"
                          />
                          <text
                            className="ar-angle-text"
                            x={ox + arcR + 8}
                            y={oy - 17}
                          >
                            {radians ? `${f(theta, 3)} rad` : `${f(angle)}°`}
                          </text>
                        </>
                      )}
                    {guides && mode !== "Locus" && (
                      <path
                        d={`M${ox} ${zY}H${zX}V${oy}`}
                        stroke="#00b5ee"
                        strokeDasharray="7 5"
                        strokeWidth="1.5"
                        fill="none"
                      />
                    )}
                    {guides &&
                      ["Plot", "Modulus", "Argument"].includes(mode) && (
                        <g fill="#058eff">
                          <text
                            x={zX}
                            y={oy + 24}
                            textAnchor="middle"
                            style={{ fill: "#058eff", fontWeight: 650 }}
                          >
                            {f(a)}
                          </text>
                          <text
                            x={ox + 10}
                            y={zY - 7}
                            style={{ fill: "#058eff", fontWeight: 650 }}
                          >
                            {f(b)}
                          </text>
                        </g>
                      )}
                    {mode === "Modulus" && (
                      <g
                        transform={`translate(${Math.max(10, ox - r * scale * 0.6)} ${Math.max(28, oy - r * scale - 25)})`}
                      >
                        <rect
                          width="76"
                          height="32"
                          rx="6"
                          fill="#e9f7ff"
                          stroke="#6dc9ff"
                        />
                        <text
                          x="8"
                          y="22"
                          style={{ fill: "#0088ff", fontWeight: 650 }}
                        >
                          |z| = {f(r, 2)}
                        </text>
                      </g>
                    )}
                    <circle
                      cx={zX}
                      cy={zY}
                      r="9"
                      fill="white"
                      stroke="#098aff"
                      strokeWidth="2"
                    />
                    <circle cx={zX} cy={zY} r="5.5" fill="#098aff" />
                    <g
                      className="ar-point-label"
                      transform={`translate(${Math.min(420, Math.max(10, zX + 8))} ${Math.min(435, Math.max(26, zY - 39))})`}
                    >
                      <rect
                        width="100"
                        height="34"
                        rx="8"
                        fill="white"
                        stroke="#c7ddff"
                      />
                      <text x="10" y="23">
                        z = {rect}
                      </text>
                    </g>
                    {hover && (
                      <title>
                        z = {rect}; modulus {f(r, 3)}; argument{" "}
                        {r ? f(angle) : "undefined"}°
                      </title>
                    )}
                  </>
                )}
                {mode === "Conjugate" && (
                  <>
                    <path
                      d={`M${ox} ${oy}L${zX} ${py(-b)}`}
                      stroke="#9745ff"
                      strokeWidth="3"
                      strokeDasharray="8 5"
                      fill="none"
                    />
                    {guides && (
                      <>
                        <path
                          d={`M${ox} ${py(-b)}H${zX}V${zY}`}
                          stroke="#9954ff"
                          strokeDasharray="6 5"
                          fill="none"
                        />
                        <path
                          d={`M${zX + 23} ${zY + 12}V${oy - 14}M${zX + 23} ${oy + 14}V${py(-b) - 12}`}
                          stroke="#8b92a2"
                          markerStart={`url(#${uid}arrow)`}
                          markerEnd={`url(#${uid}arrow)`}
                        />
                      </>
                    )}
                    <circle
                      cx={zX}
                      cy={py(-b)}
                      r="9"
                      fill="white"
                      stroke="#9745ff"
                      strokeWidth="2"
                    />
                    <circle cx={zX} cy={py(-b)} r="5.5" fill="#9745ff" />
                    <text
                      x={Math.min(390, zX + 18)}
                      y={Math.min(469, py(-b) + 30)}
                      fill="#8036e9"
                    >
                      z̄ = {conjugate}
                    </text>
                  </>
                )}
                {mode === "Distance" && (
                  <>
                    <path
                      d={`M${zX} ${zY}L${px(c)} ${py(d)}`}
                      stroke="#fc2caf"
                      strokeWidth="2.5"
                    />
                    {guides && (
                      <path
                        d={`M${ox} ${py(d)}H${px(c)}V${oy}`}
                        stroke="#9745ff"
                        strokeDasharray="7 5"
                        fill="none"
                      />
                    )}
                    <circle
                      cx={px(c)}
                      cy={py(d)}
                      r="9"
                      stroke="#9745ff"
                      fill="white"
                      strokeWidth="2"
                    />
                    <circle cx={px(c)} cy={py(d)} r="5.5" fill="#9745ff" />
                    <text
                      x={Math.max(12, px(c) - 96)}
                      y={Math.max(22, py(d) - 20)}
                      fill="#8036e9"
                    >
                      w = {w}
                    </text>
                    {guides && (
                      <g
                        transform={`translate(${(zX + px(c)) / 2 - 25} ${(zY + py(d)) / 2 + 14})`}
                      >
                        <rect
                          width="165"
                          height="31"
                          rx="6"
                          fill="#fff6fc"
                          stroke="#ffc4e9"
                        />
                        <text x="8" y="21" fill="#b90973">
                          d(z, w) ≈ {f(dist, 2)}
                        </text>
                      </g>
                    )}
                  </>
                )}
                <circle cx={ox} cy={oy} r="3.5" fill="#415989" />
              </g>
            </svg>
            <aside className="ar-legend">
              <div>
                <i />z = {rect}
              </div>
              {mode === "Distance" ? (
                <>
                  <div className="purple">
                    <i />w = {w}
                  </div>
                  <div className="pink">
                    <em />
                    Distance d(z, w)
                  </div>
                  <div className="dashed">
                    <em />z projections
                  </div>
                  <div className="purple dashed">
                    <em />w projections
                  </div>
                </>
              ) : mode === "Conjugate" ? (
                <>
                  <div className="purple">
                    <i />
                    z̄ = {conjugate}
                  </div>
                  <div>
                    <em />
                    |z| (modulus)
                  </div>
                  <div className="purple dashed">
                    <em />
                    |z̄| (modulus)
                  </div>
                  <div className="gray dashed">
                    <em />
                    Reflection guides
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <em />
                    {mode === "Modulus" ? `|z| = ${f(r)}` : "|z| (modulus)"}
                  </div>
                  <div className="orange">
                    <Triangle />
                    arg z{" "}
                    {r
                      ? `= ${radians ? f(theta, 3) + " rad" : f(angle) + "°"}`
                      : "undefined"}
                  </div>
                  {mode === "Locus" ? (
                    <>
                      <div className="dashed">
                        <em />
                        Locus: <M value={locusFormula} />
                      </div>
                      {reference && (
                        <div className="gray dashed">
                          <em />
                          Reference: r/2
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="purple dashed">
                      <em />
                      {mode === "Argument"
                        ? "Projections to axes"
                        : mode === "Modulus"
                          ? "Projection lines"
                          : `conjugate ${conjugate}`}
                    </div>
                  )}
                </>
              )}
              {mode === "Conjugate" && guides && (
                <div className="ar-legend-note">
                  Same real part
                  <br />
                  <b>a = {f(a)}</b>
                  <hr />
                  Imaginary part changes sign
                  <br />
                  <M value={String.raw`b\longrightarrow-b`} />
                </div>
              )}
            </aside>
            {mode === "Distance" && (
              <div className="ar-distance-note">
                Distance in the Argand plane behaves like Euclidean distance.
                <M value={String.raw`d(z,w)=|z-w|=\sqrt{(a-c)^2+(b-d)^2}`} />
              </div>
            )}
          </div>
        </section>
        <aside className="ar-right">
          <section className="ar-panel ar-insights">
            <h2>
              <span>
                <ChartNoAxesColumn />
              </span>
              {mode === "Locus" ? "Locus Insight" : "Complex Number Insight"}
            </h2>
            <p>
              {mode === "Locus"
                ? "Visualize and understand the set of points for a condition."
                : mode === "Distance"
                  ? "Explore the properties of z and the distance to w."
                  : "Different forms and key properties of your complex number."}
            </p>
            {mode === "Distance" && (
              <div className="ar-distance-formula">
                <b>
                  <Ruler />
                  Distance between z and w
                </b>
                <M
                  value={`d(z,w)=\\sqrt{(${f(a)}-(${f(c)}))^2+(${f(b)}-(${f(d)}))^2}`}
                />
                <M
                  value={`=\\sqrt{${f(dist * dist, 2)}}\\approx ${f(dist, 2)}`}
                />
              </div>
            )}
            {mode === "Locus" ? (
              <>
                {row("Current locus", locusFormula, "blue", CircleDashed)}
                {row("Sample point", `z=${tex(a, b)}`, "blue", Target)}
                {row(
                  satisfied ? "Condition satisfied" : "Outside current locus",
                  `${locusType === "line" ? `\\operatorname{Re}z=${f(a)}` : `|z-(${tex(centerA, centerB)})|=${f(rr, 2)}`}${satisfied ? "\\;\\checkmark" : ""}`,
                  "green",
                  Check,
                )}
                {row("Rectangular form", `z=${tex(a, b)}`, "purple")}
                {row(
                  "Polar form",
                  `z=${f(r, 2)}\\operatorname{cis}${arg}`,
                  "pink",
                  ChartPie,
                )}
                <div className="ar-locus-description">
                  <b>Locus description</b>
                  <span>
                    {locusType === "line"
                      ? `All points with real part ${f(centerA)}.`
                      : `All points ${locusType === "disk" ? "within" : "at"} distance ${f(radius)} from ${centerA || centerB ? "the selected center" : "the origin"}.`}
                  </span>
                </div>
              </>
            ) : (
              <>
                {row(
                  mode === "Distance"
                    ? "z (rectangular form)"
                    : "Rectangular form",
                  `z=${tex(a, b)}`,
                  "blue",
                  GitCommitHorizontal,
                )}
                {mode !== "Distance" &&
                  row(
                    "Polar form",
                    `z=${f(r, 2)}\\operatorname{cis}${arg}`,
                    "cyan",
                    ChartPie,
                  )}
                {row(
                  mode === "Distance" ? "Modulus of z" : "Modulus",
                  `|z|=${f(r, 2)}`,
                  "purple",
                  ChartNoAxesColumn,
                  mode === "Modulus",
                )}
                {row(
                  mode === "Distance" ? "Argument of z" : "Argument",
                  `\\arg z=${arg}`,
                  "gold",
                  Triangle,
                  mode === "Argument",
                )}
                {row(
                  mode === "Distance" ? "Conjugate of z" : "Conjugate",
                  `\\bar z=${tex(a, -b)}`,
                  "pink",
                  GitCommitHorizontal,
                  mode === "Conjugate",
                )}
              </>
            )}
          </section>
          <section className="ar-panel ar-quiz">
            <h2>
              <span>
                <Lightbulb />
              </span>
              Concept Check
            </h2>
            <p>{question}</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                checkAnswer();
              }}
            >
              {mode === "Locus" ? (
                <div className="ar-quiz-choices">
                  {[
                    locusType === "line"
                      ? `All numbers with real part ${f(centerA)}`
                      : locusType === "disk"
                        ? `All numbers within distance ${f(radius)} of the center`
                        : `All numbers at distance ${f(radius)} from the center`,
                    "All numbers with imaginary part 5",
                    `All numbers with real part ${locusType === "line" ? f(centerA + 1) : "5"}`,
                    "Only the point 3 + 4i",
                  ].map((value, i) => (
                    <button
                      type="button"
                      key={i}
                      aria-pressed={choice === i}
                      className={choice === i ? "selected" : ""}
                      onClick={() => setChoice(i)}
                    >
                      <span>{"ABCD"[i]}</span>
                      {value}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  aria-label="Concept check answer"
                  value={answer}
                  onChange={(e) => {
                    setAnswer(e.target.value);
                    setFeedback("");
                  }}
                  placeholder={
                    mode === "Conjugate"
                      ? "Enter your answer (e.g. 3 − 4i)"
                      : mode === "Argument"
                        ? `Enter your answer (${radians ? "radians" : "degrees"})`
                        : "Enter your answer (e.g. 5 or √20)"
                  }
                />
              )}
              <button type="submit" className="ar-primary">
                Check
              </button>
            </form>
            {feedback && (
              <p className="ar-feedback" role="status">
                {feedback}
              </p>
            )}
          </section>
        </aside>
      </div>
      <section className="ar-learning" aria-label="Keep exploring">
        <div>
          <h2>Keep Exploring</h2>
          <p>
            Build intuition with guided
            <br />
            explorations and challenges.
          </p>
        </div>
        {learning.map(([title, copy], i) => {
          const Icon = learnIcons[i];
          return (
            <button
              key={title}
              onClick={() => {
                setLesson(title);
                if (title === "Observe") {
                  setA(3);
                  setB(4);
                }
                if (title === "Try") {
                  setA(2);
                  setB(3);
                }
              }}
            >
              <span>
                <Icon />
              </span>
              <div>
                <b>{title}</b>
                <small>{copy}</small>
              </div>
              <ChevronRight />
            </button>
          );
        })}
        <button
          className="ar-ruhi"
          aria-label="Ask Ruhi about this lab"
          onClick={() => setHelp(true)}
        >
          <span>
            Hi! I'm Ruhi<small>Your learning companion.</small>
          </span>
          <i>
            <Bot />
          </i>
        </button>
      </section>
      {lesson && (
        <section
          className="ar-message"
          role="region"
          aria-label={`${lesson} exploration`}
        >
          <button
            className="ar-close"
            aria-label="Close exploration"
            onClick={() => setLesson(null)}
          >
            <X />
          </button>
          <h2>
            {lesson} · {mode}
          </h2>
          <p>
            {lesson === "Progress"
              ? "Complete concept checks in each mode to explore the geometry of complex numbers."
              : lesson === "Challenge"
                ? learning[4][1]
                : lesson === "Understand"
                  ? "A complex number a + bi is the point (a, b). Its modulus is the distance from the origin, its argument is the direction, and conjugation reflects it across the real axis."
                  : lesson === "Why"
                    ? "The distance formula comes from Pythagoras. Conjugation preserves distances while reversing angles. A circle is the set of points at a constant distance from a center."
                    : lesson === "Try"
                      ? "Change a and b, switch modes, and predict the result before reading the insight panel."
                      : learning[0][1]}
          </p>
        </section>
      )}
      <details className="ar-depth">
        <summary>Explore the theory, examples, and practice</summary>
        <ComplexLearningDepth pageId="argand-plane" />
      </details>
    </div>
  );
}
