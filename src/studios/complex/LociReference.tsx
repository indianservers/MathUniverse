import { useId, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Bell,
  SlidersHorizontal,
  RotateCcw,
  Target,
  Slash,
  Orbit,
  MoveUpRight,
  Eye,
  ZoomIn,
  ZoomOut,
  Expand,
  Grid3X3,
  Info,
  Lightbulb,
  BookOpen,
  ChartNoAxesColumn,
  ChevronRight,
} from "lucide-react";
import MathExpression from "../../components/ui/MathExpression";
import { useLabMode } from "../mockup/studioLabKit";
import type { StudioMockupPage } from "../mockup/studioMockupCatalog";
import { Planet, Robot, RangeField } from "./ComplexReferenceSuite";
import {
  argandComplex,
  argandNumber,
  complexLabel,
} from "./argandReferenceMath";
import ComplexLearningDepth from "./ComplexLearningDepth";
import { markComplexComplete } from "./complexStudioSession";
import "./lociReference.css";
const n = (v: number) => Number(v.toFixed(3)).toString();
const M = ({ value }: { value: string }) => <MathExpression value={value} />;
export function invertPoint(x: number, y: number, r: number) {
  const den = x * x + y * y;
  return den < 1e-12 ? null : { re: (r * r * x) / den, im: (r * r * y) / den };
}
export function mobiusPoint(
  x: number,
  y: number,
  a: number,
  b: number,
  c: number,
  d: number,
) {
  const dr = c * x + d,
    di = c * y,
    den = dr * dr + di * di;
  return den < 1e-12
    ? null
    : {
        re: ((a * x + b) * dr + a * y * di) / den,
        im: (a * y * dr - (a * x + b) * di) / den,
      };
}
export default function LociReference({ page }: { page: StudioMockupPage }) {
  const { mode, setMode } = useLabMode(page),
    uid = useId().replaceAll(":", "");
  const [r, R] = useState(2),
    [m, S] = useState(-0.3),
    [intercept, I] = useState(0.2),
    [x, X] = useState(1.5),
    [y, Y] = useState(1);
  const [a, A] = useState(1),
    [b, B] = useState(0.5),
    [c, C] = useState(0.5),
    [d, D] = useState(1);
  const [ar, AR] = useState(1.2),
    [ai, AI] = useState(0.8),
    [br, BR] = useState(1),
    [bi, BI] = useState(0.5);
  const [axes, Axes] = useState(true),
    [grid, Grid] = useState(true),
    [labels, Labels] = useState(true),
    [zoom, Z] = useState(1),
    [answer, Answer] = useState(""),
    [feedback, Feedback] = useState(""),
    [dialog, Dialog] = useState(""),
    [search, SearchValue] = useState("");
  const figure = useRef<HTMLElement>(null);
  const inversion = invertPoint(x, y, r),
    det = a * d - b * c;
  const changeMode = (v: string) => {
    setMode(v);
    Answer("");
    Feedback("");
  };
  const reset = () => {
    R(2);
    S(-0.3);
    I(0.2);
    X(1.5);
    Y(1);
    A(1);
    B(0.5);
    C(0.5);
    D(1);
    AR(1.2);
    AI(0.8);
    BR(1);
    BI(0.5);
    Z(1);
    Axes(true);
    Grid(true);
    Labels(true);
    Feedback("");
    Answer("");
  };
  const field = (
    label: string,
    value: number,
    onChange: (v: number) => void,
    min = -3,
    max = 3,
    color = "#258dff",
  ) => (
    <RangeField
      label={label}
      value={value}
      onChange={(v) => {
        onChange(v);
        Feedback("");
      }}
      min={min}
      max={max}
      color={color}
    />
  );
  const affine = mode === "Affine Map",
    mobius = mode === "Möbius",
    inv = mode === "Inversion",
    line = mode === "Line Loci";
  const formula = affine
    ? String.raw`w=(${n(ar)}${ai < 0 ? "-" : "+"}${n(Math.abs(ai))}i)z+(${n(br)}${bi < 0 ? "-" : "+"}${n(Math.abs(bi))}i)`
    : mobius
      ? String.raw`w=\frac{az+b}{cz+d}`
      : inv
        ? String.raw`|z|\,|w|=R^2`
        : line
          ? String.raw`\operatorname{Im}(z)=${n(m)}\operatorname{Re}(z)+${n(intercept)}`
          : String.raw`|z|=${n(r)}`;
  const note = affine
    ? "Complex affine maps rotate, scale, and translate. They preserve parallel lines and angles when a ≠ 0."
    : mobius
      ? "Nondegenerate Möbius maps send generalized circles to generalized circles and preserve angles locally."
      : inv
        ? "Circle inversion preserves direction: points inside map outside, and points outside map inside. The origin has no finite image."
        : line
          ? "A line locus can be written as Im(z) = m Re(z) + c. Lines are special cases of generalized circles."
          : "The locus |z| = r is a circle centered at the origin with radius r.";
  const rows = affine
    ? [
        ["Type", "Complex affine map (linear + translation)"],
        [
          "Preserves",
          ar === 0 && ai === 0
            ? "Collapsed to a point"
            : "Lines, parallelism, and angles",
        ],
        ["Linear coefficient", `a = ${complexLabel(ar, ai)}`],
        ["Translation", `b = ${complexLabel(br, bi)}`],
        [
          "Example image",
          ar === 0 && ai === 0
            ? "Square → Point"
            : "Square → Rotated and scaled square",
        ],
      ]
    : mobius
      ? [
          [
            "Type",
            Math.abs(det) < 1e-10
              ? "Degenerate rational map"
              : "Möbius transformation (fractional linear)",
          ],
          [
            "Mapping",
            Math.abs(det) < 1e-10
              ? "Not invertible"
              : "Generalized circles → generalized circles",
          ],
          ["Fixed points", "cz² + (d − a)z − b = 0"],
          ["Determinant", `ad − bc = ${n(det)}`],
          [
            "Notes",
            Math.abs(det) < 1e-10
              ? "Choose ad − bc ≠ 0"
              : "Conformal away from the pole",
          ],
        ]
      : inv
        ? [
            ["Inversion circle", `|z| = R = ${n(r)}`],
            ["Rule", "w = R² / conjugate(z)"],
            ["Preserves", "Generalized circles and direction"],
            [
              "Image",
              inversion
                ? complexLabel(inversion.re, inversion.im)
                : "Undefined at z = 0",
            ],
          ]
        : line
          ? [
              ["Type", "Line"],
              ["Slope (m)", n(m)],
              ["Intercept (c)", n(intercept)],
              ["Equation", `Im(z) = ${n(m)} Re(z) + ${n(intercept)}`],
            ]
          : [
              ["Type", "Circle (centered at origin)"],
              ["Center", "0"],
              ["Radius", `r = ${n(r)}`],
              ["Equation", "|z| = r"],
            ];
  const question = affine
    ? "Under w = 2z + 1, what is the image of z = 1 + i?"
    : inv
      ? "For circle inversion with R = 2, what is the image of z = 1 + i?"
      : line
        ? "What is the slope of Im(z) = −0.5 Re(z) + 1.2?"
        : "A non-identity Möbius transformation has at most how many fixed points in the extended complex plane?";
  const check = () => {
    let correct = false;
    try {
      if (affine || inv) {
        const z = argandComplex(answer);
        correct =
          Math.abs(z.re - (affine ? 3 : 2)) < 0.02 && Math.abs(z.im - 2) < 0.02;
      } else
        correct = Math.abs(argandNumber(answer) - (line ? -0.5 : 2)) < 0.001;
    } catch {
      correct = false;
    }
    Feedback(correct ? "Correct!" : "Try again. Use the formula above.");
    if (correct) markComplexComplete(page.id);
  };
  const extent = 5 / zoom,
    ox = 350,
    oy = 220,
    scale = 220 / extent,
    px = (v: number) => ox + v * scale,
    py = (v: number) => oy - v * scale;
  const path = (points: ({ re: number; im: number } | null)[]) => {
    let previous: { re: number; im: number } | null = null;
    return points
      .map((p) => {
        if (
          !p ||
          !Number.isFinite(p.re) ||
          !Number.isFinite(p.im) ||
          Math.abs(p.re) > extent * 8 ||
          Math.abs(p.im) > extent * 8
        ) {
          previous = null;
          return "";
        }
        const command =
          previous &&
          Math.hypot(p.re - previous.re, p.im - previous.im) < extent
            ? "L"
            : "M";
        previous = p;
        return `${command}${px(p.re)},${py(p.im)}`;
      })
      .join(" ");
  };
  const circle = Array.from({ length: 721 }, (_, k) => ({
    re: r * Math.cos((k * Math.PI) / 360),
    im: r * Math.sin((k * Math.PI) / 360),
  }));
  const square = [
      { re: -1.8, im: -0.7 },
      { re: -0.4, im: -0.7 },
      { re: -0.4, im: 0.7 },
      { re: -1.8, im: 0.7 },
    ],
    imageSquare = square.map((z) => ({
      re: ar * z.re - ai * z.im + br,
      im: ai * z.re + ar * z.im + bi,
    }));
  const icons = [Target, Slash, Orbit, Orbit, MoveUpRight];
  const fullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void figure.current?.requestFullscreen();
  };
  return (
    <div className="complex-reference-suite lr-suite" data-lab-mode={mode} data-complex-owned="loci">
      <nav className="lr-nav">
        <Link to="/complex-numbers" className="lr-brand">
          <Planet />
          <b>Math Universe</b>
        </Link>
        <Link to="/complex-numbers">Studio Home</Link>
        <Link to="/lessons">Lessons & Practice</Link>
        <Link className="active" to="/complex-numbers/loci">
          Interactive Investigations
        </Link>
        <Link to="/">App Home</Link>
        <label>
          <Search />
          <input
            aria-label="Search lab modes"
            placeholder="Search topics, lessons, or explorations..."
            value={search}
            onChange={(e) => SearchValue(e.target.value)}
          />
        </label>
        <button
          aria-label="Learning notifications"
          onClick={() => Dialog("Learning progress")}
        >
          <Bell />
        </button>
        <button
          aria-label="Profile and help"
          onClick={() => Dialog("Ruhi")}
          className="lr-profile"
        >
          A
        </button>
      </nav>
      {search && (
        <div className="lr-search">
          {page.modes
            .filter((v) => v.toLowerCase().includes(search.toLowerCase()))
            .map((v) => (
              <button
                key={v}
                onClick={() => {
                  changeMode(v);
                  SearchValue("");
                }}
              >
                {v}
              </button>
            ))}
        </div>
      )}
      <header className="lr-hero">
        <small>COMPLEX NUMBERS</small>
        <h1>Loci & Transformations Lab</h1>
        <p>Explore loci and how transformations reshape the complex plane.</p>
        <aside>
          <strong>EXPLORE ✦ VISUALIZE ✦ DISCOVER</strong>
          <em>Complex ideas. A more colorful perspective.</em>
          <Planet />
        </aside>
      </header>
      <div className="lr-modebar">
        {page.modes.map((v, k) => {
          const Icon = icons[k];
          return (
            <button
              key={v}
              aria-pressed={mode === v}
              onClick={() => changeMode(v)}
            >
              <Icon />
              {v}
            </button>
          );
        })}
        <span>
          <Info />
          Explore loci and how transformations reshape the complex plane.
        </span>
      </div>
      <div className="lr-layout">
        <section className="lr-panel lr-controls">
          <header>
            <SlidersHorizontal />
            <h2>Input & Controls</h2>
            <button onClick={reset}>
              <RotateCcw />
              Reset
            </button>
          </header>
          {affine ? (
            <>
              <h3>Affine Transformation</h3>
              <div className="lr-mini-formula">
                <M value="w=az+b" />
              </div>
              <h3>Linear coefficient a</h3>
              {field("Real(a)", ar, AR)}
              {field("Imag(a)", ai, AI, -3, 3, "#9546ff")}
              <h3>Translation b</h3>
              {field("Real(b)", br, BR)}
              {field("Imag(b)", bi, BI, -3, 3, "#9546ff")}
            </>
          ) : mobius ? (
            <>
              <h3>Möbius Transformation</h3>
              <div className="lr-mini-formula">
                <M value={String.raw`w=\frac{az+b}{cz+d}`} />
              </div>
              {field("a", a, A)}
              {field("b", b, B)}
              {field("c", c, C)}
              {field("d", d, D)}
            </>
          ) : inv ? (
            <>
              <h3>Inversion Radius</h3>
              {field("R", r, R, 0.5, 5)}
              <h3>Point Position</h3>
              <M value="z=x+iy" />
              {field("x", x, X, -4, 4)}
              {field("y", y, Y, -4, 4)}
            </>
          ) : line ? (
            <>
              <h3>Line Parameters</h3>
              {field("Slope m", m, S)}
              {field("Intercept c", intercept, I)}
            </>
          ) : (
            <>
              <h3>Circle Radius</h3>
              {field("r", r, R, 0.5, 5)}
            </>
          )}
          <div className="lr-info">
            <Info />
            <p>{note}</p>
          </div>
          {!affine && !mobius && !inv && (
            <div className="lr-display">
              <h3>Display Options</h3>
              <label>
                <input
                  type="checkbox"
                  checked={axes}
                  onChange={(e) => Axes(e.target.checked)}
                />
                Show axes
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={labels}
                  onChange={(e) => Labels(e.target.checked)}
                />
                Show equation
              </label>
            </div>
          )}
        </section>
        <section ref={figure} className="lr-panel lr-figure">
          <header>
            <Eye />
            <div>
              <h2>Complex Plane</h2>
              <p>
                {affine
                  ? "Explore the original figure and its affine image."
                  : mobius
                    ? "Original locus (blue) and its Möbius image (purple)."
                    : inv
                      ? "Visualize inversion in the complex plane."
                      : "Visualize the locus in the complex plane."}
              </p>
            </div>
            <div className="lr-tools">
              <button
                aria-label="Zoom out"
                onClick={() => Z((v) => Math.max(0.5, v - 0.2))}
              >
                <ZoomOut />
              </button>
              <button
                aria-label="Zoom in"
                onClick={() => Z((v) => Math.min(3, v + 0.2))}
              >
                <ZoomIn />
              </button>
              <button aria-label="Fullscreen graph" onClick={fullscreen}>
                <Expand />
              </button>
              <button
                aria-label="Toggle grid"
                aria-pressed={grid}
                onClick={() => Grid((v) => !v)}
              >
                <Grid3X3 />
              </button>
            </div>
          </header>
          <svg
            viewBox="0 0 700 440"
            className="lr-graph"
            role="img"
            aria-label={`${mode} complex plane`}
            data-mode-canvas={mode}
          >
            <defs>
              <marker
                id={`${uid}-arrow`}
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M0 0L10 5L0 10Z" fill="#101b4e" />
              </marker>
              <clipPath id={`${uid}-clip`}>
                <rect width="700" height="440" />
              </clipPath>
            </defs>
            <rect width="700" height="440" fill="#f6fbff" />
            <g clipPath={`url(#${uid}-clip)`}>
              {grid &&
                Array.from({ length: 21 }, (_, k) => k - 10).map((t) => (
                  <g key={t} stroke="#e1edf8">
                    <line x1={px(t)} x2={px(t)} y1="0" y2="440" />
                    <line y1={py(t)} y2={py(t)} x1="0" x2="700" />
                  </g>
                ))}
              {axes && (
                <>
                  <path
                    d="M5 220H695M350 435V5"
                    stroke="#111c4e"
                    strokeWidth="1.8"
                    markerStart={`url(#${uid}-arrow)`}
                    markerEnd={`url(#${uid}-arrow)`}
                  />
                  {[-4, -2, 2, 4].map((t) => (
                    <g key={t}>
                      <path
                        d={`M${px(t)} 216v8M346 ${py(t)}h8`}
                        stroke="#182351"
                      />
                      <text x={px(t)} y="243" textAnchor="middle">
                        {t}
                      </text>
                      <text x="338" y={py(t) + 5} textAnchor="end">
                        {t}
                      </text>
                    </g>
                  ))}
                  <text x="667" y="208" className="lr-axis-name">
                    Re
                  </text>
                  <text x="369" y="24" className="lr-axis-name">
                    Im
                  </text>
                </>
              )}
              {line ? (
                <>
                  <path
                    d={`M0 ${py(m * (-350 / scale) + intercept)}L700 ${py(m * (350 / scale) + intercept)}`}
                    stroke="#087dff"
                    strokeWidth="2.4"
                  />
                  <circle cx={ox} cy={py(intercept)} r="5" fill="#087dff" />
                </>
              ) : affine ? (
                <>
                  {[square, imageSquare].map((pts, k) => (
                    <g key={k}>
                      <polygon
                        points={pts
                          .map((p) => `${px(p.re)},${py(p.im)}`)
                          .join(" ")}
                        stroke={k ? "#903cff" : "#087dff"}
                        fill={k ? "#a469ff30" : "#338dff20"}
                        strokeWidth="2.3"
                      />
                      {pts.map((p, j) => (
                        <circle
                          key={j}
                          cx={px(p.re)}
                          cy={py(p.im)}
                          r="5"
                          fill={k ? "#903cff" : "#087dff"}
                        />
                      ))}
                    </g>
                  ))}
                </>
              ) : (
                <>
                  <path
                    d={path(circle)}
                    fill="none"
                    stroke="#087dff"
                    strokeWidth="2.5"
                  />
                  {mobius && (
                    <path
                      d={path(
                        circle.map((z) => mobiusPoint(z.re, z.im, a, b, c, d)),
                      )}
                      fill="none"
                      stroke="#903cff"
                      strokeWidth="2.3"
                    />
                  )}
                  {inv && (
                    <>
                      <path
                        d={`M${ox} ${oy}L${px(x)} ${py(y)}${inversion ? `L${px(inversion.re)} ${py(inversion.im)}` : ""}`}
                        stroke="#7f8aab"
                        strokeDasharray="6 5"
                        fill="none"
                      />
                      <circle cx={px(x)} cy={py(y)} r="7" fill="#087dff" />
                      {inversion && (
                        <circle
                          cx={px(inversion.re)}
                          cy={py(inversion.im)}
                          r="7"
                          fill="#903cff"
                        />
                      )}
                    </>
                  )}
                </>
              )}
              {labels && (
                <>
                  <rect
                    x={line ? 415 : 445}
                    y={affine ? 30 : line ? 135 : mobius ? 32 : inv ? 110 : 95}
                    width="220"
                    height="42"
                    rx="13"
                    fill={affine || mobius ? "#eee4ff" : "#e6f4ff"}
                  />
                  <text
                    x={line ? 430 : 460}
                    y={affine ? 57 : line ? 161 : mobius ? 59 : inv ? 137 : 122}
                    style={{ fill: affine || mobius ? "#8b38ff" : "#087dff" }}
                  >
                    {affine
                      ? "w = az + b"
                      : mobius
                        ? "Möbius image"
                        : inv
                          ? `z = ${complexLabel(x, y)}`
                          : line
                            ? `Im(z) = ${n(m)} Re(z) + ${n(intercept)}`
                            : `|z| = ${n(r)}`}
                  </text>
                  {inv && inversion && (
                    <text
                      x={Math.min(500, px(inversion.re) + 15)}
                      y={Math.max(25, py(inversion.im) - 15)}
                      style={{ fill: "#8b38ff" }}
                    >
                      w = {complexLabel(inversion.re, inversion.im)}
                    </text>
                  )}
                </>
              )}
            </g>
          </svg>
          {(affine || mobius) && (
            <div className="lr-legend">
              <span>● Original {affine ? "figure" : "locus (circle)"}</span>
              <span>
                ●{" "}
                {affine
                  ? "Affine image (w = az + b)"
                  : "Image under w = (az + b)/(cz + d)"}
              </span>
            </div>
          )}
        </section>
        <div className="lr-right">
          <section className="lr-panel lr-results">
            <header>
              <ChartNoAxesColumn />
              <h2>
                {affine || mobius
                  ? "Transformation Information"
                  : "Locus Information"}
              </h2>
              <span>{mode}</span>
            </header>
            <div className="lr-formula">
              <b>
                {affine
                  ? "Current Transformation"
                  : mobius
                    ? "Möbius Transformation"
                    : inv
                      ? "Inversion formula"
                      : "Current Locus"}
              </b>
              <M value={formula} />
              {inv && (
                <M value={String.raw`w=\frac{R^2}{\overline z}\quad(z\ne0)`} />
              )}
            </div>
            <dl>
              {rows.map(([key, value]) => (
                <div key={key}>
                  <dt>{key}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <div className="lr-info">
              <Info />
              <p>{note}</p>
            </div>
          </section>
          <section className="lr-panel lr-quiz">
            <header>
              <span className="lr-question-icon">?</span>
              <h2>Concept Check</h2>
              <button
                onClick={() => {
                  Answer("");
                  Feedback("");
                }}
              >
                Try it!
              </button>
            </header>
            <p>{question}</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                check();
              }}
            >
              <input
                aria-label="Concept check answer"
                value={answer}
                onChange={(e) => Answer(e.target.value)}
                placeholder={
                  affine
                    ? "e.g. 3 + 2i"
                    : inv
                      ? "a + bi"
                      : "Enter your answer..."
                }
              />
              <button type="submit">Check</button>
            </form>
            {feedback && <p role="status">{feedback}</p>}
          </section>
        </div>
      </div>
      <div className="lr-learning">
        {[
          ["Key Idea", note],
          [
            "Explore Next",
            "Change the parameters and compare the equations with the geometry. Try a circle through the Möbius pole to obtain a line.",
          ],
          [
            "Real-World Connection",
            affine
              ? "Affine transformations model rotation, scaling, and translation in computer graphics."
              : inv
                ? "Circle inversion appears in geometry, electrostatics, and sphere mappings."
                : mobius
                  ? "Möbius transformations appear in fluid dynamics, conformal mapping, and engineering."
                  : "Loci describe geometric constraints in physics, electrical engineering, and computer graphics.",
          ],
        ].map(([title, copy], k) => {
          const Icon = [Lightbulb, BookOpen, ChartNoAxesColumn][k];
          return (
            <button key={title} onClick={() => Dialog(title)}>
              <Icon />
              <div>
                <b>{title}</b>
                <p>{copy}</p>
              </div>
              {k > 0 && <ChevronRight />}
            </button>
          );
        })}
        <Robot family="loci" onClick={() => Dialog("Ruhi")} />
      </div>
      {dialog && (
        <section className="lr-dialog" role="dialog" aria-label={dialog}>
          <button onClick={() => Dialog("")}>Close</button>
          <h2>{dialog}</h2>
          <p>
            {dialog === "Ruhi"
              ? "Try changing a slider to explore the graph. Blue shows the original; purple shows its image. Inversion is undefined at the origin. Möbius maps require ad − bc ≠ 0."
              : note}
          </p>
        </section>
      )}
      <details className="cr-depth">
        <summary>Explore the theory, worked examples, and practice</summary>
        <ComplexLearningDepth pageId={page.id} />
      </details>
    </div>
  );
}
