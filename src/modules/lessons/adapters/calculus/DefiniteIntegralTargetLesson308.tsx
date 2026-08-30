import {
  CheckCircle2,
  Eye,
  Hand,
  Lightbulb,
  Maximize2,
  RotateCcw,
  Share2,
  Target,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import "./DefiniteIntegralTargetLesson308.css";

const fn = (x: number) => -(x - 1) * (x + 3);
const primitive = (x: number) => -(x ** 3) / 3 - x ** 2 + 3 * x;
const clean = (n: number, places = 6) =>
  Math.abs(n) < 1e-10 ? 0 : Number(n.toFixed(places));
const integral = (a: number, b: number) => primitive(b) - primitive(a);
type Layer = "axes" | "grid" | "curve" | "areas" | "labels";

function splitAreas(a: number, b: number) {
  const direction = b >= a ? 1 : -1;
  const low = Math.min(a, b),
    high = Math.max(a, b);
  const cuts = [low, -3, 1, high]
    .filter(
      (x, i, all) => x >= low && x <= high && (i === 0 || x !== all[i - 1]),
    )
    .sort((x, y) => x - y);
  const pieces = cuts.slice(0, -1).map((x0, i) => {
    const x1 = cuts[i + 1],
      value = direction * integral(x0, x1);
    return { x0, x1, value };
  });
  return {
    pieces,
    positive: pieces
      .filter((p) => p.value > 0)
      .reduce((sum, p) => sum + p.value, 0),
    negative: pieces
      .filter((p) => p.value < 0)
      .reduce((sum, p) => sum + p.value, 0),
    total: integral(a, b),
  };
}

export default function DefiniteIntegralTargetLesson308({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [a, setA] = useState(-4),
    [b, setB] = useState(4),
    [zoom, setZoom] = useState(1);
  const [layers, setLayers] = useState<Record<Layer, boolean>>({
    axes: true,
    grid: true,
    curve: true,
    areas: true,
    labels: true,
  });
  const [tab, setTab] = useState("Interaction + visualization"),
    [answer, setAnswer] = useState("");
  const [result, setResult] = useState<"" | "correct" | "incorrect">(""),
    [actions, setActions] = useState(0);
  const model = useMemo(() => splitAreas(a, b), [a, b]);
  const reset = () => {
    setA(-4);
    setB(4);
    setZoom(1);
    setLayers({
      axes: true,
      grid: true,
      curve: true,
      areas: true,
      labels: true,
    });
    setTab("Interaction + visualization");
    setAnswer("");
    setResult("");
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((v) => v + 1);
    onInteraction();
  };
  const setBound = (which: "a" | "b", value: number) =>
    act(() => (which === "a" ? setA(value) : setB(value)));
  const toggle = (layer: Layer) =>
    act(() => setLayers((value) => ({ ...value, [layer]: !value[layer] })));
  const check = () =>
    act(() =>
      setResult(
        Math.abs(Number(answer) - 20 / 3) < 1e-5 ? "correct" : "incorrect",
      ),
    );
  return (
    <section
      className="def308-page"
      data-testid="calculus-mockup-0387"
      data-dedicated-lesson="308"
      data-object-model="quadratic-oriented-area-dual-bound-drag-signed-region-decomposition-limit-swap-layer-visibility-zoom-practice"
      data-a={clean(a)}
      data-b={clean(b)}
      data-total={clean(model.total)}
      data-positive={clean(model.positive)}
      data-negative={clean(model.negative)}
      data-zoom={zoom}
      data-result={result}
      data-actions={actions}
      data-layers={Object.entries(layers)
        .filter(([, value]) => value)
        .map(([key]) => key)
        .join(",")}
    >
      <header className="def308-hero">
        <span>
          <b>CALCULUS</b>
          <b>INTEGRAL CALCULUS AND DIFFERENTIAL EQUATIONS</b>
        </span>
        <h1>Definite Integral</h1>
        <p>Calculate signed area.</p>
        <div className="meta">
          <i>⚿ Advanced</i>
          <i>ϟ Advanced Lab</i>
          <i>▣ Integral / ODE / CAS</i>
          <i>◷ 6-10 min</i>
        </div>
        <div className="actions">
          <select aria-label="Lesson language">
            <option>English (English)</option>
          </select>
          <button type="button" onClick={() => act(reset)}>
            <RotateCcw />
            Reset
          </button>
          <button
            type="button"
            onClick={() =>
              act(() => void navigator.clipboard?.writeText(location.href))
            }
          >
            <Share2 />
            Share
          </button>
          <a href="/graphing-calculator">↗ Workspace</a>
        </div>
      </header>
      <nav className="def308-tabs">
        {[
          "Interaction + visualization",
          "Explain",
          "Examples",
          "Formulas",
          "Know more",
        ].map((name) => (
          <button
            key={name}
            type="button"
            className={tab === name ? "active" : ""}
            onClick={() => act(() => setTab(name))}
          >
            {name}
          </button>
        ))}
      </nav>
      <section className="def308-lab">
        <header>
          <div>
            <small>INTERACTION + VISUALIZATION</small>
            <h2>Oriented-area accumulator</h2>
          </div>
          <span>All good! ◔</span>
          <b>{actions} actions</b>
          <button
            type="button"
            aria-label="Full screen model"
            onClick={() =>
              act(() => void document.documentElement.requestFullscreen?.())
            }
          >
            <Maximize2 />
          </button>
        </header>
        <main>
          <header>
            <h3>Definite Integral - graph + CAS</h3>
            <strong>f(x) = -(x - 1)(x + 3) = -x² - 2x + 3</strong>
          </header>
          <div className="def308-workspace">
            <aside className="def308-controls">
              <h3>Function</h3>
              <strong>f(x) = -(x - 1)(x + 3)</strong>
              <h3>Interval [a, b]</h3>
              <label>
                a{" "}
                <input
                  aria-label="Lower integration bound"
                  type="range"
                  min="-5"
                  max="5"
                  step="0.25"
                  value={a}
                  onChange={(e) => setBound("a", Number(e.target.value))}
                />
                <output>{a}</output>
              </label>
              <label>
                b{" "}
                <input
                  aria-label="Upper integration bound"
                  type="range"
                  min="-5"
                  max="5"
                  step="0.25"
                  value={b}
                  onChange={(e) => setBound("b", Number(e.target.value))}
                />
                <output>{b}</output>
              </label>
              <button
                type="button"
                onClick={() =>
                  act(() => {
                    setA(b);
                    setB(a);
                  })
                }
              >
                ⇄ Swap limits
              </button>
              <hr />
              <h3>View</h3>
              {(["axes", "grid", "curve", "areas", "labels"] as Layer[]).map(
                (layer) => (
                  <label className="check" key={layer}>
                    <input
                      aria-label={`Show ${layer}`}
                      type="checkbox"
                      checked={layers[layer]}
                      onChange={() => toggle(layer)}
                    />
                    Show {layer}
                  </label>
                ),
              )}
              <hr />
              <h3>Zoom</h3>
              <div className="zoom">
                <button
                  type="button"
                  aria-label="Zoom out"
                  onClick={() =>
                    act(() => setZoom((v) => Math.max(0.7, clean(v - 0.1, 1))))
                  }
                >
                  <ZoomOut />
                </button>
                <button
                  type="button"
                  aria-label="Zoom in"
                  onClick={() =>
                    act(() => setZoom((v) => Math.min(1.4, clean(v + 0.1, 1))))
                  }
                >
                  <ZoomIn />
                </button>
                <button type="button" onClick={() => act(() => setZoom(1))}>
                  Fit
                </button>
              </div>
            </aside>
            <IntegralGraph
              a={a}
              b={b}
              zoom={zoom}
              layers={layers}
              onBound={setBound}
            />
            <aside className="def308-summary">
              <h3>
                Signed area <em>(Accumulator)</em>
              </h3>
              <output>{clean(model.total, 2).toFixed(2)}</output>
              <h3>Breakdown</h3>
              {model.pieces.map((piece) => (
                <p key={`${piece.x0}-${piece.x1}`}>
                  <i className={piece.value >= 0 ? "pos" : "neg"} />
                  {piece.value >= 0 ? "Positive" : "Negative"} ({piece.x0} to{" "}
                  {piece.x1}): <b>{clean(piece.value, 2).toFixed(2)}</b>
                </p>
              ))}
              <hr />
              <h3>Integral</h3>
              <strong>
                ∫<sub>{a}</sub>
                <sup>{b}</sup> f(x) dx = {clean(model.total, 4)}
              </strong>
              <article>
                <h3>Definite integral rule</h3>
                <p>
                  A definite integral accumulates function values with sign
                  across an interval:
                </p>
                <b>
                  ∫<sub>a</sub>
                  <sup>b</sup> f(x) dx = F(b) - F(a)
                </b>
                <p>Above x-axis → positive</p>
                <p>Below x-axis → negative</p>
              </article>
            </aside>
          </div>
        </main>
        <footer>
          {[
            [
              Eye,
              "Observe",
              "Watch how shaded regions above the x-axis count positive area and below count negative area.",
            ],
            [
              Hand,
              "Manipulate",
              "Drag a and b to change the limits. Notice the areas and accumulator update.",
            ],
            [
              Lightbulb,
              "Notice",
              "The integral adds signed areas. Positive and negative parts can cancel.",
            ],
            [
              Target,
              "Understand",
              `The integral ${clean(model.total, 2)} is the net oriented area from x=${a} to x=${b}.`,
            ],
          ].map(([Icon, title, text], i) => (
            <article key={String(title)}>
              <Icon />
              <b>
                {i + 1} {String(title)}
              </b>
              <p>{String(text)}</p>
            </article>
          ))}
        </footer>
      </section>
      <section className="def308-learning">
        <article>
          <h3>
            <CheckCircle2 /> Worked example <small>(one correct)</small>
          </h3>
          <p>
            Evaluate ∫<sub>-3</sub>
            <sup>1</sup> -(x - 1)(x + 3) dx.
          </p>
          <b>Solution</b>
          <p>
            The region is above the x-axis, so the integral is positive. Using
            F(x) = -x³/3 - x² + 3x:
          </p>
          <strong>F(1) - F(-3) = 5/3 - (-9) = 32/3 ≈ 10.667</strong>
        </article>
        <aside>
          <article>
            <h3>⚠ Common misconception</h3>
            <b>Ignoring sign and adding absolute areas.</b>
            <p>
              Area below the x-axis must be negative. The integral returns net
              oriented area, not total area.
            </p>
            <strong>Correct approach: add each region with its sign.</strong>
          </article>
          <article>
            <h3>☆ Pro tip</h3>
            <p>Reverse the limits to flip the sign:</p>
            <b>
              ∫<sub>b</sub>
              <sup>a</sup> f(x) dx = -∫<sub>a</sub>
              <sup>b</sup> f(x) dx
            </b>
          </article>
        </aside>
      </section>
      <section className="def308-practice">
        <header>
          <Target />
          <h3>Practice challenge</h3>
        </header>
        <p>
          Let f(x) = -(x - 1)(x + 3). Find ∫<sub>-2</sub>
          <sup>2</sup> f(x) dx.
        </p>
        <div>
          {[-2, -1, 0, 1, 20 / 3].map((value, i) => (
            <label key={value}>
              <input
                type="radio"
                name="def308-answer"
                value={value}
                checked={answer === String(value)}
                onChange={(e) =>
                  act(() => {
                    setAnswer(e.target.value);
                    setResult("");
                  })
                }
              />
              <b>{String.fromCharCode(65 + i)}</b>
              <span>{value === 20 / 3 ? "20/3" : value}</span>
            </label>
          ))}
        </div>
        <button type="button" onClick={check}>
          Check answer
        </button>
        <output className={result}>
          {result === "correct"
            ? "Correct: F(2)-F(-2)=20/3."
            : result === "incorrect"
              ? "Try evaluating both antiderivative endpoints."
              : ""}
        </output>
      </section>
    </section>
  );
}

function IntegralGraph({
  a,
  b,
  zoom,
  layers,
  onBound,
}: {
  a: number;
  b: number;
  zoom: number;
  layers: Record<Layer, boolean>;
  onBound: (which: "a" | "b", value: number) => void;
}) {
  const w = 372,
    h = 438,
    xMin = -6 / zoom,
    xMax = 6 / zoom,
    yMin = -5 / zoom,
    yMax = 7 / zoom;
  const sx = (x: number) => ((x - xMin) / (xMax - xMin)) * w,
    sy = (y: number) => h - ((y - yMin) / (yMax - yMin)) * h;
  const curve = Array.from({ length: 161 }, (_, i) => {
    const x = xMin + ((xMax - xMin) * i) / 160;
    return `${i ? "L" : "M"}${sx(x)},${sy(fn(x))}`;
  }).join(" ");
  const region = (x0: number, x1: number) => {
    const points = Array.from({ length: 45 }, (_, i) => {
      const x = x0 + ((x1 - x0) * i) / 44;
      return `${sx(x)},${sy(fn(x))}`;
    });
    return `M${sx(x0)},${sy(0)} L${points.join(" L")} L${sx(x1)},${sy(0)} Z`;
  };
  const drag =
    (which: "a" | "b") => (event: ReactPointerEvent<SVGCircleElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      const box = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
      if (!box) return;
      const move = (e: PointerEvent) =>
        onBound(
          which,
          clean(
            Math.max(
              -5,
              Math.min(
                5,
                xMin + ((e.clientX - box.left) / box.width) * (xMax - xMin),
              ),
            ) * 4,
          ) / 4,
        );
      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    };
  const parts = splitAreas(a, b).pieces;
  return (
    <svg
      className="def308-graph"
      viewBox={`0 0 ${w} ${h}`}
      aria-label="Interactive signed-area graph"
    >
      {layers.grid &&
        Array.from({ length: 13 }, (_, i) => -6 + i).map((x) => (
          <line
            key={`x${x}`}
            x1={sx(x)}
            y1="0"
            x2={sx(x)}
            y2={h}
            className="grid"
          />
        ))}
      {layers.grid &&
        Array.from({ length: 13 }, (_, i) => -5 + i).map((y) => (
          <line
            key={`y${y}`}
            x1="0"
            y1={sy(y)}
            x2={w}
            y2={sy(y)}
            className="grid"
          />
        ))}
      {layers.areas &&
        parts.map((p) => (
          <path
            key={`${p.x0}-${p.x1}`}
            d={region(p.x0, p.x1)}
            className={p.value >= 0 ? "area pos" : "area neg"}
          />
        ))}
      {layers.axes && (
        <>
          <line x1="0" y1={sy(0)} x2={w} y2={sy(0)} className="axis" />
          <line x1={sx(0)} y1="0" x2={sx(0)} y2={h} className="axis" />
        </>
      )}
      {layers.curve && <path d={curve} className="curve" />}
      {[
        { which: "a" as const, value: a, color: "#1687e8" },
        { which: "b" as const, value: b, color: "#753ee8" },
      ].map(({ which, value, color }) => (
        <g key={which}>
          <line
            x1={sx(value)}
            y1={sy(0)}
            x2={sx(value)}
            y2={h}
            className="bound"
          />
          <circle
            data-drag={`definite-${which}`}
            cx={sx(value)}
            cy={sy(0)}
            r="7"
            fill={color}
            onPointerDown={drag(which)}
          />
          <text
            x={sx(value) + (which === "a" ? -22 : 8)}
            y={sy(0) - 10}
            fill={color}
          >
            {which} = {value}
          </text>
        </g>
      ))}
      {layers.labels &&
        parts.map((p) => (
          <text
            key={`label${p.x0}`}
            x={sx((p.x0 + p.x1) / 2)}
            y={sy(fn((p.x0 + p.x1) / 2) / 2)}
            className={p.value >= 0 ? "label pos" : "label neg"}
          >
            {clean(p.value, 2).toFixed(2)}
          </text>
        ))}
    </svg>
  );
}
