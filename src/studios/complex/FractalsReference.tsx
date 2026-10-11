import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Atom,
  Settings,
  Layers,
  ChartNoAxesColumn,
  Lightbulb,
  ZoomIn,
  ZoomOut,
  Maximize,
  Grid3X3,
  Download,
  RotateCcw,
  Search,
  Compass,
  BookOpen,
} from "lucide-react";
import { useStudioState } from "../phase1/StudioModelProvider";
import { useLabMode } from "../mockup/studioLabKit";
import type { StudioMockupPage } from "../mockup/studioMockupCatalog";
import { escapeTime, orbit, periodBulbLabel } from "./fractalMath";
import { Planet, Robot } from "./ComplexReferenceSuite";
import "./fractalsReference.css";
import ComplexLearningDepth from "./ComplexLearningDepth";
const number = (n: number, d = 3) => Number(n.toFixed(d)).toString();
const complex = (x: number, y: number) =>
  `${number(x)} ${y < 0 ? "−" : "+"} ${number(Math.abs(y))}i`;
function FractalPlot({
  kind,
  cx,
  cy,
  iterations,
  zoom,
  grid,
  step,
  onPick,
}: {
  kind: "mandel" | "julia";
  cx: number;
  cy: number;
  iterations: number;
  zoom: number;
  grid: boolean;
  step: number;
  onPick?: (x: number, y: number) => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const width = 440,
    height = 370,
    span = 3.2 / zoom,
    xmid = kind === "mandel" ? -0.6 : 0,
    yspan = (span * height) / width;
  useEffect(() => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    const image = ctx.createImageData(width, height);
    const stops = [
      [5, 3, 45],
      [29, 4, 108],
      [92, 0, 158],
      [210, 0, 183],
      [255, 37, 94],
      [255, 180, 35],
      [255, 246, 133],
    ];
    const colors = Array.from({ length: iterations }, (_, k) => {
      const t = Math.min(
          5.999,
          Math.max(0, ((k - 1) / Math.max(7, iterations * 0.34)) * 6),
        ),
        i = Math.floor(t),
        f = t - i;
      return stops[i].map((v, j) => Math.round(v + (stops[i + 1][j] - v) * f));
    });
    for (let row = 0; row < height; row++)
      for (let col = 0; col < width; col++) {
        const x = xmid + (col / (width - 1) - 0.5) * span,
          y = (0.5 - row / (height - 1)) * yspan;
        const k =
          kind === "mandel"
            ? escapeTime(0, 0, x, y, iterations)
            : escapeTime(x, y, cx, cy, iterations);
        const rgb = k >= iterations ? [2, 6, 12] : colors[k],
          p = (row * width + col) * 4;
        image.data[p] = rgb[0];
        image.data[p + 1] = rgb[1];
        image.data[p + 2] = rgb[2];
        image.data[p + 3] = 255;
      }
    ctx.putImageData(image, 0, 0);
  }, [cx, cy, iterations, kind, span, xmid, yspan]);
  const px = (x: number) => ((x - xmid) / span + 0.5) * 100,
    py = (y: number) => (0.5 - y / yspan) * 100;
  const points = orbit(0, 0, cx, cy, step + 1);
  return (
    <div
      className="fr-plot"
      role={onPick ? "slider" : "img"}
      tabIndex={onPick ? 0 : undefined}
      aria-label={
        kind === "mandel"
          ? "Mandelbrot parameter picker"
          : "Julia set for selected c"
      }
      aria-valuetext={onPick ? complex(cx, cy) : undefined}
      onKeyDown={(e) => {
        if (!onPick) return;
        const d = e.shiftKey ? 0.001 : 0.01;
        if (e.key.startsWith("Arrow")) {
          e.preventDefault();
          onPick(
            cx + (e.key === "ArrowRight" ? d : e.key === "ArrowLeft" ? -d : 0),
            cy + (e.key === "ArrowUp" ? d : e.key === "ArrowDown" ? -d : 0),
          );
        }
      }}
      onPointerDown={(e) => {
        if (!onPick) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        const r = e.currentTarget.getBoundingClientRect();
        onPick(
          xmid + ((e.clientX - r.left) / r.width - 0.5) * span,
          (0.5 - (e.clientY - r.top) / r.height) * yspan,
        );
      }}
      onPointerMove={(e) => {
        if (!onPick || !e.currentTarget.hasPointerCapture(e.pointerId)) return;
        const r = e.currentTarget.getBoundingClientRect();
        onPick(
          xmid + ((e.clientX - r.left) / r.width - 0.5) * span,
          (0.5 - (e.clientY - r.top) / r.height) * yspan,
        );
      }}
      onPointerUp={(e) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId))
          e.currentTarget.releasePointerCapture(e.pointerId);
      }}
    >
      <canvas ref={canvas} width={width} height={height} />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {grid &&
          Array.from({ length: 9 }, (_, i) => (
            <g key={i}>
              <path
                d={`M${i * 12.5} 0V100M0 ${i * 12.5}H100`}
                stroke="#ffffff"
                opacity=".09"
                strokeWidth=".15"
              />
            </g>
          ))}
        {kind === "mandel" ? (
          <>
            <circle
              cx={px(cx)}
              cy={py(cy)}
              r="2.5"
              fill="#ffe17c"
              stroke="white"
              strokeWidth=".6"
            />
          </>
        ) : (
          points
            .filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y))
            .map((p, i) => (
              <circle
                key={i}
                cx={px(p.x)}
                cy={py(p.y)}
                r={i === points.length - 1 ? 1 : 0.4}
                fill="#ff7b9c"
              />
            ))
        )}
      </svg>
      {kind === "mandel" && (
        <span
          className="fr-point"
          style={{
            left: `${Math.min(65, Math.max(3, px(cx) + 4))}%`,
            top: `${Math.min(90, Math.max(15, py(cy) - 12))}%`,
          }}
        >
          c = {complex(cx, cy)}
        </span>
      )}
    </div>
  );
}
export default function FractalsReference({
  page,
}: {
  page: StudioMockupPage;
}) {
  const { mode, setMode } = useLabMode(page);
  const [cx, setCx] = useStudioState(
      "ComplexNumbersStudioLabs:FractalsLab:cx",
      -0.123,
    ),
    [cy, setCy] = useStudioState(
      "ComplexNumbersStudioLabs:FractalsLab:cy",
      0.745,
    ),
    [iterations, setIterations] = useStudioState(
      "ComplexNumbersStudioLabs:FractalsLab:iter",
      40,
    ),
    [step, setStep] = useStudioState(
      "ComplexNumbersStudioLabs:FractalsLab:orbitStep",
      7,
    );
  const [zoom, setZoom] = useState(1),
    [grid, setGrid] = useState(false),
    [settings, setSettings] = useState(false),
    [answer, setAnswer] = useState(""),
    [feedback, setFeedback] = useState(""),
    [help, setHelp] = useState(false);
  const stage = useRef<HTMLElement>(null),
    points = orbit(0, 0, cx, cy, 18),
    escaped = points.findIndex((p) => p.x * p.x + p.y * p.y > 4);
  const pick = (x: number, y: number) => {
    setCx(Math.max(-2, Math.min(2, x)));
    setCy(Math.max(-2, Math.min(2, y)));
  };
  const slider = (
    label: string,
    value: number,
    min: number,
    max: number,
    increment: number,
    change: (n: number) => void,
  ) => (
    <label className="fr-slider">
      <b>{label}</b>
      <div>
        <input
          aria-label={label}
          type="range"
          min={min}
          max={max}
          step={increment}
          value={value}
          onChange={(e) => change(Number(e.target.value))}
        />
        <input
          aria-label={`${label} value`}
          type="number"
          min={min}
          max={max}
          step={increment}
          value={Number(value.toFixed(label.includes(" c") ? 3 : 0))}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (Number.isFinite(v)) change(Math.max(min, Math.min(max, v)));
          }}
        />
      </div>
      <small>
        <span>{min}</span>
        <span>{max}</span>
      </small>
    </label>
  );
  return (
    <div className="fr-reference" data-lab-mode={mode} data-mode-canvas={mode}>
      <nav className="fr-nav">
        <Link to="/complex-numbers" className="fr-brand">
          <Planet small />
          <b>Math Universe</b>
        </Link>
        <Link to="/complex-numbers">Studio Home</Link>
        <Link to="/complex-numbers?tab=lessons">Lessons & Practice</Link>
        <span className="active">Interactive Investigations</span>
        <Link to="/">App Home</Link>
        <label>
          <Search size={18} />
          <input
            placeholder="Search Math Universe..."
            aria-label="Search Math Universe"
            onKeyDown={(e) => {
              if (e.key === "Enter")
                window.location.href = `/complex-numbers?q=${encodeURIComponent(e.currentTarget.value)}`;
            }}
          />
        </label>
        <span className="fr-avatar">A</span>
      </nav>
      <header className="fr-hero">
        <div>
          <Atom />
          <section>
            <h1>Mandelbrot & Julia Sets Lab</h1>
            <p>Explore complex dynamics and fractal beauty.</p>
          </section>
        </div>
        <em>Simple rules. Infinite beauty.</em>
        <blockquote>
          “In mathematics, beauty
          <br /> emerges from iteration.”<small>— Benoit Mandelbrot</small>
        </blockquote>
      </header>
      <div className="fr-bar">
        <div className="fr-tabs">
          {["Mandelbrot Set", "Julia Set"].map((m) => (
            <button
              key={m}
              aria-pressed={mode === m}
              className={mode === m ? "active" : ""}
              onClick={() => setMode(m)}
            >
              <Atom />
              {m.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="fr-tools">
          <button
            aria-label="Zoom in"
            onClick={() => setZoom(Math.min(8, zoom * 1.25))}
          >
            <ZoomIn />
          </button>
          <button
            aria-label="Zoom out"
            onClick={() => setZoom(Math.max(0.5, zoom / 1.25))}
          >
            <ZoomOut />
          </button>
          <button
            aria-label="Fullscreen fractals"
            onClick={() => {
              if (document.fullscreenElement) void document.exitFullscreen();
              else void stage.current?.requestFullscreen();
            }}
          >
            <Maximize />
          </button>
          <button
            aria-label="Toggle grid"
            aria-pressed={grid}
            onClick={() => setGrid(!grid)}
          >
            <Grid3X3 />
          </button>
          <button
            aria-label="Download fractal"
            onClick={() => {
              const canvas =
                stage.current?.querySelectorAll("canvas")[
                  mode === "Julia Set" ? 1 : 0
                ];
              if (canvas) {
                const a = document.createElement("a");
                a.href = canvas.toDataURL();
                a.download = "math-universe-fractal.png";
                a.click();
              }
            }}
          >
            <Download />
          </button>
          <button
            aria-label="Reset view"
            onClick={() => {
              setZoom(1);
              pick(-0.123, 0.745);
              setIterations(40);
              setStep(7);
            }}
          >
            <RotateCcw />
          </button>
          <button
            aria-label="Fractal settings"
            aria-expanded={settings}
            onClick={() => setSettings(!settings)}
          >
            <Settings />
          </button>
        </div>
      </div>
      {settings && (
        <div className="fr-settings">
          Drag on Mandelbrot to choose c. Use arrow keys for precise changes;
          hold Shift for smaller steps. Zoom: {number(zoom, 2)}×. Higher
          iteration limits reveal finer boundaries.
        </div>
      )}
      <main className="fr-columns">
        <section className="fr-card fr-controls">
          <h2>
            <Settings />
            Fractal controls
          </h2>
          <p>Adjust parameters and see the fractal come to life.</p>
          {slider("Re c", cx, -2, 2, 0.001, setCx)}
          {slider("Im c", cy, -2, 2, 0.001, setCy)}
          {slider("Max iterations", iterations, 10, 500, 1, setIterations)}
          {slider("Orbit step", step, 1, 50, 1, setStep)}
          <div className="fr-presets">
            <b>✦ &nbsp; Presets</b>
            <button onClick={() => pick(-0.123, 0.745)}>
              <Atom />
              Douady rabbit<span>›</span>
            </button>
          </div>
        </section>
        <section ref={stage} className="fr-card fr-stage">
          <h2>
            <Layers />
            MANDELBROT & JULIA<span>{mode.toUpperCase()}</span>
          </h2>
          <div className="fr-pair">
            {(["mandel", "julia"] as const).map((kind) => (
              <figure
                key={kind}
                className={
                  mode === "Julia Set" && kind === "julia" ? "selected" : ""
                }
              >
                <figcaption>
                  <b>
                    {kind === "mandel"
                      ? "Mandelbrot set"
                      : "Julia set (for selected c)"}
                  </b>
                  <small>
                    {kind === "mandel"
                      ? `Mandelbrot set – ${periodBulbLabel(cx, cy)}`
                      : "Julia set for c – explore its connected components"}
                  </small>
                </figcaption>
                <FractalPlot
                  kind={kind}
                  cx={cx}
                  cy={cy}
                  iterations={iterations}
                  zoom={zoom}
                  grid={grid}
                  step={step}
                  onPick={kind === "mandel" ? pick : undefined}
                />
              </figure>
            ))}
          </div>
          <div className="fr-recurrence">
            <span>〈/〉 &nbsp; z₀ = 0; &nbsp; zₙ₊₁ = zₙ² + c</span>
            <span>
              Selected c <b>{complex(cx, cy)}</b>
            </span>
            <span className={escaped < 0 ? "bounded" : "escaped"}>
              ● &nbsp;{" "}
              {escaped < 0
                ? "No escape observed in 18 steps."
                : `Escapes at step ${escaped}.`}
            </span>
          </div>
        </section>
        <aside className="fr-right">
          <section className="fr-card">
            <h2>
              <ChartNoAxesColumn />
              Current parameters
            </h2>
            <div className="fr-value">
              <b>c =</b>
              <strong>{complex(cx, cy)}</strong>
            </div>
            <div className="fr-value orbit">
              <span>✦ &nbsp; Orbit steps</span>
              <strong>{points.length}</strong>
            </div>
          </section>
          <section className="fr-card fr-check">
            <h2>
              <Lightbulb />
              Concept check
            </h2>
            <p>
              For c = 0, is 0 in the Mandelbrot set?
              <br />
              Enter 1 for yes.
            </p>
            <input
              aria-label="Concept check answer"
              value={answer}
              placeholder="1 or √2/2"
              onChange={(e) => {
                setAnswer(e.target.value);
                setFeedback("");
              }}
            />
            <button
              onClick={() =>
                setFeedback(
                  answer.trim() === "1"
                    ? "Correct! The orbit stays at 0 forever."
                    : "Try 1: with c = 0, each iteration remains 0.",
                )
              }
            >
              Check ›
            </button>
            {feedback && <p role="status">{feedback}</p>}
          </section>
        </aside>
      </main>
      <section className="fr-learning">
        <article>
          <BookOpen />
          <div>
            <h3>Key Idea</h3>
            <p>
              The Mandelbrot set is the set of all complex numbers c for which
              the orbit of 0 under zₙ₊₁ = zₙ² + c remains bounded.
            </p>
          </div>
        </article>
        <article>
          <Compass />
          <div>
            <h3>Explore Next</h3>
            <p>
              Try different values of c, increase the iteration limit, or switch
              to the Julia set to see how the dynamics change.
            </p>
          </div>
        </article>
        <article>
          <ChartNoAxesColumn />
          <div>
            <h3>Why It Matters</h3>
            <p>
              The Mandelbrot set reveals a stunning universe of structure,
              connecting math, art, and the natural world.
            </p>
          </div>
        </article>
        <div className="fr-ruhi">
          <div>
            {help
              ? "Drag the gold point to explore c. Black regions have not escaped within the iteration limit."
              : "Hi! I’m Ruhi. Ask me anything!"}
          </div>
          <Robot family="fractals" onClick={() => setHelp(!help)} />
        </div>
      </section>
      <footer>
        <b>✦ &nbsp; Math Universe</b>
        <span>Explore · Learn · Discover</span>
        <span>Mathematics for a brighter tomorrow. &nbsp; ♡</span>
      </footer><details className="cr-depth"><summary>Explore the theory, worked examples, and practice</summary><ComplexLearningDepth pageId={page.id}/></details>
    </div>
  );
}

