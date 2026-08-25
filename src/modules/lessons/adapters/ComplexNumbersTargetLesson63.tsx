import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calculator,
  CircleHelp,
  Eye,
  Languages,
  Lightbulb,
  RotateCcw,
  Share2,
  Sparkles,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../types";
import "./ComplexNumbersTargetLesson63.css";

const INITIAL_REAL = 3;
const INITIAL_IMAGINARY = 2;
const X_MIN = -4;
const X_MAX = 6;
const Y_MIN = -4;
const Y_MAX = 4;
const ORIGIN_X = 203;
const ORIGIN_Y = 312;
const X_SCALE = 77;
const TICK_X_SCALE = 50;
const Y_SCALE = 66;

function signedImaginary(value: number) {
  if (value === 0) return "";
  return `${value > 0 ? "+" : "-"} ${Math.abs(value)}i`;
}

function complexText(real: number, imaginary: number) {
  if (imaginary === 0) return `${real}`;
  if (real === 0)
    return `${imaginary === 1 ? "" : imaginary === -1 ? "-" : imaginary}i`;
  return `${real} ${signedImaginary(imaginary)}`;
}

function polarValues(real: number, imaginary: number) {
  const modulus = Math.hypot(real, imaginary);
  const angle = (Math.atan2(imaginary, real) * 180) / Math.PI;
  return { modulus, angle };
}

export default function ComplexNumbersTargetLesson63({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [real, setReal] = useState(INITIAL_REAL);
  const [imaginary, setImaginary] = useState(INITIAL_IMAGINARY);
  const [dragging, setDragging] = useState(false);
  const [tab, setTab] = useState("Complex Plane Lab");
  const [language, setLanguage] = useState("English (English)");
  const [workspace, setWorkspace] = useState(false);
  const [shareState, setShareState] = useState("Share");
  const [answerVisible, setAnswerVisible] = useState(false);
  const [actions, setActions] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const { modulus, angle } = polarValues(real, imaginary);
  const pointX = ORIGIN_X + real * X_SCALE;
  const pointY = ORIGIN_Y - imaginary * Y_SCALE;
  const conjugateY = ORIGIN_Y + imaginary * Y_SCALE;

  const act = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const updateReal = (value: number) => {
    setReal(Math.max(-10, Math.min(10, Math.round(value))));
    act();
  };
  const updateImaginary = (value: number) => {
    setImaginary(Math.max(-10, Math.min(10, Math.round(value))));
    act();
  };
  const reset = () => {
    setReal(INITIAL_REAL);
    setImaginary(INITIAL_IMAGINARY);
    setDragging(false);
    setTab("Complex Plane Lab");
    setLanguage("English (English)");
    setWorkspace(false);
    setShareState("Share");
    setAnswerVisible(false);
    setActions(0);
    onInteraction();
  };
  useEffect(() => {
    setReal(INITIAL_REAL);
    setImaginary(INITIAL_IMAGINARY);
    setDragging(false);
    setTab("Complex Plane Lab");
    setLanguage("English (English)");
    setWorkspace(false);
    setShareState("Share");
    setAnswerVisible(false);
    setActions(0);
  }, [resetToken]);

  const movePoint = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((event.clientX - rect.left) / rect.width) * 530;
    const y = ((event.clientY - rect.top) / rect.height) * 600;
    setReal(
      Math.max(X_MIN, Math.min(X_MAX, Math.round((x - ORIGIN_X) / X_SCALE))),
    );
    setImaginary(
      Math.max(Y_MIN, Math.min(Y_MAX, Math.round((ORIGIN_Y - y) / Y_SCALE))),
    );
    act();
  };
  const share = async () => {
    try {
      await navigator.clipboard?.writeText(
        `z = ${complexText(real, imaginary)}, conjugate = ${complexText(real, -imaginary)}, |z| = ${modulus.toFixed(3)}`,
      );
      setShareState("Copied");
    } catch {
      setShareState("Ready");
    }
    act();
  };
  const sqrtTerm = real * real + imaginary * imaginary;
  const formulaAngle =
    real === 0
      ? `${imaginary >= 0 ? "90" : "-90"}°`
      : `tan⁻¹(${imaginary}/${real})`;

  return (
    <div
      className="complex63-page"
      data-testid="number-mockup-0045"
      data-dedicated-lesson="63"
      data-object-model="complex-coefficients-draggable-plane-point-conjugate-vector-modulus-argument-projection-model"
      data-real={real}
      data-imaginary={imaginary}
      data-complex={complexText(real, imaginary)}
      data-conjugate={complexText(real, -imaginary)}
      data-modulus={modulus.toFixed(3)}
      data-argument={angle.toFixed(2)}
      data-dragging={dragging}
      data-tab={tab}
      data-language={language}
      data-workspace={workspace}
      data-answer-visible={answerVisible}
      data-actions={actions}
    >
      <span className="sr-only">
        Concept trace: Complex plane coordinates show a complex number with a
        real part and an imaginary part.
      </span>
      <nav className="complex63-breadcrumb">
        <a href="/" aria-label="Back">
          <ArrowLeft />
        </a>
        <a href="/">Home</a>
        <span>›</span>
        <a href="/lessons">Lessons</a>
        <span>›</span>
        <a href="/lessons/numbers-and-arithmetic">Numbers And Arithmetic</a>
        <span>›</span>
        <b>63 Complex Numbers</b>
      </nav>

      <header className="complex63-hero">
        <nav>
          <b>NUMBERS AND ARITHMETIC</b>
          <b>NUMBERS AND NUMBER THEORY</b>
        </nav>
        <h1>Complex Numbers</h1>
        <p>Extend numbers beyond the real line.</p>
        <div className="complex63-badges">
          <b>♙ Interactive Lab</b>
          <b>◇ Visual &amp; Exploratory</b>
          <b>▣ Concept + Manipulative</b>
          <b>▤ Grades 9-12</b>
          <b>◷ 6-10 min</b>
        </div>
        <aside>
          <button
            type="button"
            onClick={() => {
              setLanguage((value) =>
                value.startsWith("English")
                  ? "Hindi (हिन्दी)"
                  : "English (English)",
              );
              act();
            }}
          >
            <Languages /> <span>{language}</span>
            <i>⌄</i>
          </button>
          <button type="button" onClick={reset}>
            <RotateCcw /> Reset
          </button>
          <button type="button" onClick={() => void share()}>
            <Share2 /> {shareState}
          </button>
          <button
            type="button"
            className={workspace ? "active" : ""}
            onClick={() => {
              setWorkspace((value) => !value);
              act();
            }}
          >
            ↗ Workspace
          </button>
        </aside>
      </header>

      <nav
        className="complex63-tabs"
        aria-label="Complex number lesson sections"
      >
        {[
          ["Complex Plane Lab", "◇"],
          ["Explore", "▦"],
          ["Properties", "♧"],
          ["Examples", "Σ"],
          ["Know more", "✧"],
        ].map(([label, icon]) => (
          <button
            type="button"
            className={tab === label ? "active" : ""}
            onClick={() => {
              setTab(label);
              act();
            }}
            key={label}
          >
            <span>{icon}</span>
            {label}
          </button>
        ))}
      </nav>

      <main className="complex63-layout">
        <section className="complex63-work">
          <header>
            <h2>Complex Plane</h2>
            <p>
              A complex number <i>z = a + bi</i> is a point <b>(a, b)</b> on the
              complex plane.
            </p>
            <p>Drag the sliders to explore.</p>
          </header>
          <svg
            ref={svgRef}
            className="complex63-plane"
            viewBox="0 0 530 600"
            role="img"
            aria-label="Interactive complex plane"
            onPointerMove={movePoint}
            onPointerUp={() => setDragging(false)}
            onPointerLeave={() => setDragging(false)}
          >
            <defs>
              <pattern
                id="complex63-grid"
                width="50"
                height="66"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 50 0 L 0 0 0 66"
                  fill="none"
                  stroke="#edf1f5"
                  strokeWidth="1"
                />
              </pattern>
              <marker
                id="complex63-arrow-blue"
                markerWidth="8"
                markerHeight="8"
                refX="7"
                refY="4"
                orient="auto"
              >
                <path d="M0,0 L8,4 L0,8 z" fill="#1265f2" />
              </marker>
              <marker
                id="complex63-axis-arrow"
                markerWidth="8"
                markerHeight="8"
                refX="7"
                refY="4"
                orient="auto"
              >
                <path d="M0,0 L8,4 L0,8 z" fill="#152238" />
              </marker>
            </defs>
            <rect
              x="10"
              y="36"
              width="510"
              height="545"
              fill="url(#complex63-grid)"
            />
            <line
              x1="18"
              y1={ORIGIN_Y}
              x2="516"
              y2={ORIGIN_Y}
              className="axis"
              markerEnd="url(#complex63-axis-arrow)"
            />
            <line
              x1={ORIGIN_X}
              y1="580"
              x2={ORIGIN_X}
              y2="14"
              className="axis"
              markerEnd="url(#complex63-axis-arrow)"
            />
            {Array.from(
              { length: X_MAX - X_MIN + 1 },
              (_, index) => index + X_MIN,
            ).map((value) => (
              <g key={`x-${value}`}>
                <line
                  x1={ORIGIN_X + value * TICK_X_SCALE}
                  y1={ORIGIN_Y - 5}
                  x2={ORIGIN_X + value * TICK_X_SCALE}
                  y2={ORIGIN_Y + 5}
                  className="tick"
                />
                {value !== 0 ? (
                  <text
                    x={ORIGIN_X + value * TICK_X_SCALE}
                    y={ORIGIN_Y + 24}
                    textAnchor="middle"
                  >
                    {value}
                  </text>
                ) : null}
              </g>
            ))}
            {Array.from(
              { length: Y_MAX - Y_MIN + 1 },
              (_, index) => index + Y_MIN,
            ).map((value) => (
              <g key={`y-${value}`}>
                <line
                  x1={ORIGIN_X - 5}
                  y1={ORIGIN_Y - value * Y_SCALE}
                  x2={ORIGIN_X + 5}
                  y2={ORIGIN_Y - value * Y_SCALE}
                  className="tick"
                />
                {value !== 0 ? (
                  <text
                    x={ORIGIN_X - 15}
                    y={ORIGIN_Y - value * Y_SCALE + 5}
                    textAnchor="end"
                  >
                    {value}
                  </text>
                ) : null}
              </g>
            ))}
            <text x={ORIGIN_X - 7} y={ORIGIN_Y + 25} textAnchor="end">
              0
            </text>
            <text
              x="514"
              y={ORIGIN_Y + 25}
              textAnchor="end"
              className="axis-label"
            >
              Real
            </text>
            <text x={ORIGIN_X} y="2" textAnchor="middle" className="axis-label">
              Imaginary
            </text>

            <line
              x1={ORIGIN_X}
              y1={ORIGIN_Y}
              x2={pointX}
              y2={pointY}
              className="modulus-line"
              markerEnd="url(#complex63-arrow-blue)"
            />
            <line
              x1={pointX}
              y1={ORIGIN_Y}
              x2={pointX}
              y2={pointY}
              className="imaginary-projection"
            />
            <line
              x1={ORIGIN_X}
              y1={ORIGIN_Y}
              x2={pointX}
              y2={ORIGIN_Y}
              className="real-projection"
            />
            <line
              x1="18"
              y1={conjugateY}
              x2={pointX}
              y2={conjugateY}
              className="conjugate-guide"
            />
            <line
              x1={pointX}
              y1={ORIGIN_Y}
              x2={pointX}
              y2={conjugateY}
              className="conjugate-guide"
            />
            <path
              d={`M ${ORIGIN_X + 54} ${ORIGIN_Y} A 54 54 0 0 ${imaginary >= 0 ? 0 : 1} ${ORIGIN_X + 49} ${ORIGIN_Y - Math.sign(imaginary || 1) * 23}`}
              className="angle-arc"
            />
            <text
              x={ORIGIN_X + 65}
              y={ORIGIN_Y - Math.sign(imaginary || 1) * 15}
              className="theta"
            >
              θ
            </text>
            <text
              x={(ORIGIN_X + pointX) / 2 - 12}
              y={(ORIGIN_Y + pointY) / 2 - 20}
              className="modulus-label"
            >
              |z| = √{sqrtTerm}
            </text>
            <text x={pointX + 14} y={pointY - 42} className="z-label">
              z = {complexText(real, imaginary)}
            </text>
            <text x={pointX + 14} y={pointY - 17} className="coordinate-label">
              ({real}, {imaginary})
            </text>
            <text x={pointX + 13} y={ORIGIN_Y + 23} className="real-value">
              ({real}, 0)
            </text>
            <text
              x={pointX + 14}
              y={conjugateY + 40}
              className="conjugate-label"
            >
              z̄ = {complexText(real, -imaginary)}
            </text>
            <text
              x={pointX + 14}
              y={conjugateY + 66}
              className="conjugate-coordinate"
            >
              ({real}, {-imaginary})
            </text>
            <text
              x={(ORIGIN_X + pointX) / 2}
              y={ORIGIN_Y + 24}
              className="real-component"
            >
              {real}
            </text>
            <text
              x={pointX + 14}
              y={(ORIGIN_Y + pointY) / 2}
              className="imaginary-component"
            >
              {imaginary}
            </text>
            <circle cx={pointX} cy={pointY} r="8" className="complex-point" />
            <circle
              cx={pointX}
              cy={pointY}
              r="20"
              className="complex-hit-area"
              aria-label="Drag complex number point"
              role="button"
              tabIndex={0}
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                setDragging(true);
                act();
              }}
            />
            <circle cx={pointX} cy={ORIGIN_Y} r="7" className="real-point" />
            <circle
              cx={pointX}
              cy={conjugateY}
              r="7"
              className="conjugate-point"
            />
          </svg>

          <section className="complex63-legend">
            <p>
              <i className="real-dot" />
              <span>
                <b>Real component</b>
                <em>a = {real}</em>
              </span>
            </p>
            <p>
              <i className="imaginary-dot" />
              <span>
                <b>Imaginary component</b>
                <em>b = {imaginary}</em>
              </span>
            </p>
            <p>
              <i className="conjugate-dot" />
              <span>
                <b>Conjugate (reflection)</b>
                <em>(a, −b)</em>
              </span>
            </p>
          </section>
          <p className="complex63-info">
            <CircleHelp /> The complex plane lets us add, subtract, multiply,
            and divide complex numbers as points and vectors.
          </p>
        </section>

        <aside className="complex63-side">
          <section className="complex63-builder">
            <h2>Build your complex number</h2>
            <label htmlFor="complex63-real">
              Real part: <b>{real}</b>
            </label>
            <input
              id="complex63-real"
              aria-label="Real part"
              type="range"
              min="-10"
              max="10"
              value={real}
              onChange={(event) => updateReal(Number(event.target.value))}
            />
            <div className="range-scale">
              <span>-10</span>
              <span>0</span>
              <span>10</span>
            </div>
            <output>{real}</output>
            <label htmlFor="complex63-imaginary">
              Imaginary part: <b>{imaginary}</b>
            </label>
            <input
              id="complex63-imaginary"
              aria-label="Imaginary part"
              className="imaginary-range"
              type="range"
              min="-10"
              max="10"
              value={imaginary}
              onChange={(event) => updateImaginary(Number(event.target.value))}
            />
            <div className="range-scale">
              <span>-10</span>
              <span>0</span>
              <span>10</span>
            </div>
            <output>{imaginary}</output>
          </section>
          <section className="complex63-results">
            <h3>Your complex number</h3>
            <output className="complex-value">
              z = {complexText(real, imaginary)}
            </output>
            <h3>Conjugate</h3>
            <output className="conjugate-value">
              {complexText(real, -imaginary)}
            </output>
            <h3>Modulus (distance from origin)</h3>
            <output className="modulus-value">
              <b>|z| = √{sqrtTerm}</b>
              <small>≈ {modulus.toFixed(3)}</small>
            </output>
            <h3>Argument (angle)</h3>
            <output className="argument-value">
              <b>θ = {formulaAngle}</b>
              <small>≈ {angle.toFixed(2)}°</small>
            </output>
          </section>
          <p className="complex63-tip">
            <Lightbulb />{" "}
            <b>Complex numbers need a plane, not only a number line.</b>
          </p>
          <section className="complex63-try">
            <h2>
              <CircleHelp /> Try this
            </h2>
            <p>Try: What is the conjugate of 4 + i?</p>
            {answerVisible ? <strong>4 − i</strong> : null}
            <button
              type="button"
              onClick={() => {
                setAnswerVisible((value) => !value);
                act();
              }}
            >
              <Eye /> {answerVisible ? "Hide answer" : "Reveal answer"}
            </button>
          </section>
        </aside>
      </main>

      <nav className="complex63-navigation">
        <a href="/lessons/numbers-and-arithmetic/62-real-numbers">
          <ArrowLeft />
          <span>
            PREVIOUS<b>Real Numbers</b>
          </span>
        </a>
        <a href="/lessons/numbers-and-arithmetic/64-place-value">
          <span>
            NEXT<b>Place Value</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="complex63-footer">
        <h3>
          <Sparkles /> Math Universe
        </h3>
        <p>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </p>
        <nav>
          <a href="/sitemap">
            <BookOpen /> Sitemap
          </a>
          <a href="/docs">
            <Calculator /> Docs
          </a>
          <a href="/about">✉ About</a>
        </nav>
        <hr />
        <small>
          © 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.
        </small>
        <small>www.IndianServers.com info@IndianServers.com</small>
      </footer>
    </div>
  );
}
