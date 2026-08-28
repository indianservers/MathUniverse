import {
  ArrowLeft,
  ArrowRight,
  Check,
  Expand,
  Eye,
  HelpCircle,
  Lightbulb,
  Maximize2,
  RotateCcw,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { LessonAdapterProps } from "../types";
import "./ParameterExplorerTargetLesson164.css";

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));
const snap = (n: number, step = 0.5) => Math.round(n / step) * step;
const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));
const signed = (n: number) => (n < 0 ? `- ${fmt(Math.abs(n))}` : `+ ${fmt(n)}`);

type Model = { a: number; h: number; k: number };
const initial: Model = { a: 1.5, h: 1, k: 2 };

function Equation({ model }: { model: Model }) {
  const inside =
    model.h === 0
      ? "x"
      : `x ${model.h > 0 ? "-" : "+"} ${fmt(Math.abs(model.h))}`;
  return (
    <span>
      y = <b>{fmt(model.a)}</b>f({inside}) {signed(model.k)}
    </span>
  );
}

function ParameterGraph({
  model,
  onChange,
}: {
  model: Model;
  onChange: (next: Model) => void;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const W = 438,
    H = 338,
    ox = 218,
    oy = 175,
    unit = 29;
  const xToPx = (x: number) => ox + x * unit;
  const yToPx = (y: number) => oy - y * unit;
  const path = (fn: (x: number) => number) =>
    Array.from({ length: 161 }, (_, i) => -6.5 + (i * 13) / 160)
      .map(
        (x, i) =>
          `${i ? "L" : "M"}${xToPx(x).toFixed(1)} ${yToPx(fn(x)).toFixed(1)}`,
      )
      .join(" ");
  const move = (clientX: number, clientY: number, shiftKey: boolean) => {
    const box = ref.current?.getBoundingClientRect();
    if (!box) return;
    const x = ((clientX - box.left) / box.width) * W;
    const y = ((clientY - box.top) / box.height) * H;
    const h = snap(clamp((x - ox) / unit, -6, 6));
    const k = snap(clamp((oy - y) / unit, -6, 6));
    onChange(shiftKey ? { ...model, h } : { ...model, h, k });
  };
  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${H}`}
      className="pe164-graph"
      role="img"
      aria-label="Interactive transformed quadratic graph"
    >
      <defs>
        <pattern
          id="pe164-grid"
          width={unit}
          height={unit}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M${unit} 0H0V${unit}`}
            fill="none"
            stroke="#dfe8f1"
            strokeWidth="0.8"
          />
        </pattern>
        <marker
          id="pe164-arrow"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0 0 6 3 0 6Z" fill="#16243d" />
        </marker>
      </defs>
      <rect width={W} height={H} fill="url(#pe164-grid)" />
      <line
        x1="4"
        x2={W - 5}
        y1={oy}
        y2={oy}
        className="axis"
        markerEnd="url(#pe164-arrow)"
      />
      <line
        x1={ox}
        x2={ox}
        y1={H - 4}
        y2="5"
        className="axis"
        markerEnd="url(#pe164-arrow)"
      />
      {[-6, -4, -2, 0, 2, 4, 6].map((n) => (
        <text
          key={`x${n}`}
          x={xToPx(n)}
          y={oy + 18}
          className="tick"
          textAnchor="middle"
        >
          {n}
        </text>
      ))}
      {[-5, -3, -1, 1, 3, 5].map((n) => (
        <text
          key={`y${n}`}
          x={ox - 9}
          y={yToPx(n) + 3}
          className="tick"
          textAnchor="end"
        >
          {n}
        </text>
      ))}
      <text x={W - 12} y={oy - 8}>
        x
      </text>
      <text x={ox + 9} y="13">
        y
      </text>
      <path d={path((x) => x * x - 2)} className="parent" />
      <path
        d={path((x) => model.a * (x - model.h) * (x - model.h) + model.k)}
        className="active"
      />
      <circle
        cx={xToPx(model.h)}
        cy={yToPx(model.k)}
        r="6"
        className="vertex"
      />
      <g transform={`translate(${xToPx(model.h) - 25} ${yToPx(model.k) - 47})`}>
        <rect width="70" height="38" rx="5" />
        <text x="35" y="14" textAnchor="middle">
          Vertex (h, k)
        </text>
        <text x="35" y="29" textAnchor="middle">
          ({fmt(model.h)}, {fmt(model.k)})
        </text>
      </g>
      <circle
        data-testid="parameter-vertex-handle"
        tabIndex={0}
        role="slider"
        aria-label="Drag transformed vertex"
        aria-valuetext={`(${fmt(model.h)}, ${fmt(model.k)})`}
        cx={xToPx(model.h)}
        cy={yToPx(model.k)}
        r="15"
        className="handle"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          move(e.clientX, e.clientY, e.shiftKey);
        }}
        onPointerMove={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId))
            move(e.clientX, e.clientY, e.shiftKey);
        }}
        onKeyDown={(e) => {
          const d = e.shiftKey ? 1 : 0.5;
          if (e.key === "ArrowLeft")
            onChange({ ...model, h: clamp(model.h - d, -6, 6) });
          if (e.key === "ArrowRight")
            onChange({ ...model, h: clamp(model.h + d, -6, 6) });
          if (e.key === "ArrowUp")
            onChange({ ...model, k: clamp(model.k + d, -6, 6) });
          if (e.key === "ArrowDown")
            onChange({ ...model, k: clamp(model.k - d, -6, 6) });
        }}
      />
    </svg>
  );
}

function ParamControl({
  symbol,
  label,
  min,
  max,
  value,
  onChange,
}: {
  symbol: string;
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="pe164-control">
      <header>
        <b>{symbol}</b>
        <span>{label}</span>
        <HelpCircle />
      </header>
      <div>
        <small>{min}</small>
        <input
          aria-label={`${symbol} ${label}`}
          type="range"
          min={min}
          max={max}
          step="0.5"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <small>{max}</small>
        <input
          aria-label={`${symbol} value`}
          type="number"
          min={min}
          max={max}
          step="0.5"
          value={value}
          onChange={(e) => onChange(clamp(Number(e.target.value), min, max))}
        />
      </div>
    </label>
  );
}

export default function ParameterExplorerTargetLesson164({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [model, setModelState] = useState(initial);
  const [stage, setStage] = useState("Explore");
  const [practice, setPractice] = useState<Model>({ a: 1, h: -2, k: -1 });
  const [status, setStatus] = useState("");
  const [hint, setHint] = useState(false);
  const setModel = (next: Model) => {
    setModelState(next);
    onInteraction();
  };
  useEffect(() => {
    setModelState(initial);
    setPractice({ a: 1, h: -2, k: -1 });
    setStatus("");
    setHint(false);
  }, [resetToken]);
  const reset = () => {
    setModelState(initial);
    setStatus("");
    setHint(false);
    onInteraction();
  };
  const equation = useMemo(
    () =>
      `${fmt(model.a)}(x ${model.h >= 0 ? "-" : "+"} ${fmt(Math.abs(model.h))})² ${signed(model.k)}`,
    [model],
  );
  const effectA =
    model.a < 0
      ? "Reflection and vertical stretch"
      : Math.abs(model.a) > 1
        ? "Vertical stretch"
        : Math.abs(model.a) < 1
          ? "Vertical compression"
          : "Parent width";
  const check = () =>
    setStatus(
      practice.a === 1 && practice.h === -2 && practice.k === -1
        ? "Correct - the target graph is matched."
        : "Not yet - compare the vertex and opening.",
    );
  return (
    <main
      className="pe164-page"
      data-testid="graph-mockup-0221"
      data-dedicated-lesson="164"
      data-object-model="editable-quadratic-a-h-k-parameters-pointer-keyboard-draggable-vertex-generated-parent-transformed-curves-equation-effects-worked-example-graded-practice-and-navigation"
      data-a={model.a}
      data-h={model.h}
      data-k={model.k}
      data-equation={equation}
      data-stage={stage}
    >
      <header className="pe164-header">
        <div className="pe164-logo">∿</div>
        <section>
          <h1>Parameter Explorer</h1>
          <p>
            Explore <i>y = af(x - h) + k</i> and see how each parameter
            transforms the graph.
          </p>
          <div>
            <span>♙ Intermediate</span>
            <span>ϟ Transformations</span>
            <span>▣ Interactive</span>
            <span>◷ 6-10 min</span>
          </div>
        </section>
        <aside>
          <b>Learning flow</b>
          {[
            "Observe the parent function",
            "Manipulate parameters",
            "Notice patterns in changes",
            "Understand the rule",
            "Try independently",
          ].map((x, i) => (
            <span key={x}>
              <i>{i + 1}</i>
              {x}
            </span>
          ))}
        </aside>
      </header>
      <nav className="pe164-tabs">
        {[
          ["Explore", "◉"],
          ["Observe", "◉"],
          ["Understand", "♧"],
          ["Example", "▤"],
          ["Practice", "⌁"],
        ].map(([x, icon]) => (
          <button
            key={x}
            className={stage === x ? "active" : ""}
            onClick={() => {
              setStage(x);
              onInteraction();
            }}
          >
            <i aria-hidden="true">{icon}</i>
            {x}
          </button>
        ))}
      </nav>
      <section className="pe164-lab">
        <article className="pe164-live">
          <header>
            <h2>Live Graph</h2>
            <div>
              <span className="cyan-line" /> y = af(x - h) + k{" "}
              <span className="dash-line" /> y = f(x) (parent)
            </div>
            <button title="Fit graph" onClick={reset}>
              <Maximize2 /> Fit
            </button>
            <button title="Expand graph" onClick={() => setStage("Observe")}>
              <Expand />
            </button>
          </header>
          <ParameterGraph model={model} onChange={setModel} />
        </article>
        <aside className="pe164-controls">
          <h2>Transform&nbsp; y = af(x - h) + k</h2>
          <ParamControl
            symbol="a"
            label="Vertical stretch/compression & reflection"
            min={-3}
            max={3}
            value={model.a}
            onChange={(a) => setModel({ ...model, a: a === 0 ? 0.5 : a })}
          />
          <ParamControl
            symbol="h"
            label="Horizontal shift"
            min={-6}
            max={6}
            value={model.h}
            onChange={(h) => setModel({ ...model, h })}
          />
          <ParamControl
            symbol="k"
            label="Vertical shift"
            min={-6}
            max={6}
            value={model.k}
            onChange={(k) => setModel({ ...model, k })}
          />
          <section className="pe164-readout">
            <small>Function</small>
            <Equation model={model} />
          </section>
          <section className="pe164-readout">
            <small>Vertex (h, k)</small>
            <b>
              ({fmt(model.h)}, {fmt(model.k)})
            </b>
          </section>
        </aside>
      </section>
      <section className="pe164-observe">
        <article>
          <header>
            <Eye />
            <div>
              <h2>Observe</h2>
              <p>How the graph has changed</p>
            </div>
          </header>
          <div className="effect-grid">
            <span>
              <i>↕</i>
              <b>{effectA}</b>
              <small>Factor |a| = {fmt(Math.abs(model.a))}</small>
              <small>
                {model.a < 0
                  ? "Graph is reflected"
                  : "Graph is " +
                    (Math.abs(model.a) > 1
                      ? "taller"
                      : Math.abs(model.a) < 1
                        ? "wider"
                        : "unchanged")}
              </small>
            </span>
            <span>
              <i>↕</i>
              <b>Vertical shift</b>
              <small>
                {model.k >= 0 ? "Up" : "Down"} by {fmt(Math.abs(model.k))} units
              </small>
            </span>
            <span>
              <i>→</i>
              <b>Horizontal shift</b>
              <small>
                {model.h >= 0 ? "Right" : "Left"} by {fmt(Math.abs(model.h))}{" "}
                unit{Math.abs(model.h) === 1 ? "" : "s"}
              </small>
            </span>
            <span>
              <i>●</i>
              <b>Turning point</b>
              <small>
                {model.a < 0 ? "Maximum" : "Minimum"} at ({fmt(model.h)},{" "}
                {fmt(model.k)})
              </small>
            </span>
          </div>
        </article>
        <article className="pe164-effects">
          <h2>⚒ Parameter Effects</h2>
          {[
            [
              "a",
              "Controls vertical stretch/compression and reflection.",
              "|a| > 1 → stretch (taller) · 0 < |a| < 1 → compression (shorter) · a < 0 → reflection across x-axis",
            ],
            [
              "h",
              "Controls horizontal shift.",
              "h > 0 → shift right by h units · h < 0 → shift left by |h| units",
            ],
            [
              "k",
              "Controls vertical shift.",
              "k > 0 → shift up by k units · k < 0 → shift down by |k| units",
            ],
          ].map(([s, t, d]) => (
            <section key={s}>
              <i>{s}</i>
              <div>
                <b>{t}</b>
                <p>{d}</p>
              </div>
            </section>
          ))}
        </article>
      </section>
      <section className="pe164-rule-row">
        <article>
          <h2>▤ Worked Example</h2>
          <p>
            Find the vertex and sketch <i>y = -2f(x + 3) + 1</i> for{" "}
            <i>f(x)=x²</i>.
          </p>
          <div className="worked">
            <ol>
              <li>Start with parent: y = x² → vertex at (0, 0).</li>
              <li>a = -2 → reflect across x-axis and stretch by 2.</li>
              <li>h = -3 → shift left by 3 units.</li>
              <li>k = 1 → shift up by 1 unit.</li>
            </ol>
            <svg viewBox="0 0 160 120">
              <line x1="10" x2="150" y1="75" y2="75" />
              <line x1="116" x2="116" y1="8" y2="112" />
              <path d="M48 116 Q67 20 86 116" />
              <circle cx="67" cy="34" r="4" />
              <text x="48" y="27">
                (-3, 1)
              </text>
            </svg>
          </div>
          <footer>
            <b>Vertex: (-3, 1)</b>
            <small>The graph is a downward-opening parabola.</small>
          </footer>
        </article>
        <article className="pe164-rule">
          <h2>⚒ The Rule</h2>
          <p>General transformation:</p>
          <strong>y = af(x - h) + k</strong>
          <span>Vertex: (h, k)</span>
          <p>Apply in order:</p>
          <div>
            <b>
              1&nbsp; a<small>stretch/reflect</small>
            </b>
            <em>→</em>
            <b>
              2&nbsp; h<small>shift horizontally</small>
            </b>
            <em>→</em>
            <b>
              3&nbsp; k<small>shift vertically</small>
            </b>
          </div>
        </article>
      </section>
      <section className="pe164-practice">
        <header>
          <h2>▣ Try It Yourself</h2>
          <p>Given f(x) = x², choose parameters to match the target graph.</p>
        </header>
        <svg viewBox="0 0 170 115">
          <line x1="8" x2="162" y1="73" y2="73" />
          <line x1="86" x2="86" y1="8" y2="110" />
          <path d="M22 8 Q50 132 78 8" />
          <circle cx="50" cy="87" r="4" />
          <text x="12" y="106">
            (-2, -1)
          </text>
        </svg>
        <div className="pe164-practice-controls">
          <b>Adjust the parameters to match the target graph.</b>
          {(["a", "h", "k"] as const).map((key) => (
            <label key={key}>
              <span>{key}</span>
              <input
                aria-label={`Practice ${key}`}
                type="range"
                min={key === "a" ? -3 : -6}
                max={key === "a" ? 3 : 6}
                step="0.5"
                value={practice[key]}
                onChange={(e) => {
                  setPractice({ ...practice, [key]: Number(e.target.value) });
                  setStatus("");
                }}
              />
              <input
                aria-label={`Practice ${key} value`}
                type="number"
                value={practice[key]}
                step="0.5"
                onChange={(e) =>
                  setPractice({ ...practice, [key]: Number(e.target.value) })
                }
              />
            </label>
          ))}
          <button onClick={check}>
            <Check /> Check
          </button>
          <button
            onClick={() => {
              setPractice({ a: 1, h: -2, k: -1 });
              setStatus("");
            }}
          >
            <RotateCcw /> Reset
          </button>
          <p
            role="status"
            className={status.startsWith("Correct") ? "correct" : ""}
          >
            {status}
          </p>
        </div>
        <aside>
          <b>Hint</b>
          <p>Vertex of target is (-2, -1).</p>
          <p>The parabola opens upward and looks like the parent.</p>
          <button onClick={() => setHint((v) => !v)}>
            <Lightbulb /> Need help?
          </button>
          {hint ? <small>Use a = 1, h = -2, k = -1.</small> : null}
        </aside>
      </section>
      <nav className="pe164-nav">
        <a href="/lessons/graphs-and-functions/163-transformation-order">
          <ArrowLeft />
          <span>
            <small>Previous</small>
            <b>Transformation Order</b>
          </span>
        </a>
        <a href="/lessons/graphs-and-functions/165-parent-function-library">
          <span>
            <small>Next</small>
            <b>Parent-Function Library</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="pe164-footer">
        <section>
          <b>✧ Math Universe</b>
          <p>
            Interactive math labs, visual proofs, NCERT explorations, graphing,
            CAS-style tools, and classroom-ready activities.
          </p>
        </section>
        <nav>
          <a href="/sitemap">▤ Sitemap</a>
          <a href="/docs">▱ Docs</a>
          <a href="/about">✉ About</a>
        </nav>
        <aside>
          <b>
            © 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.
          </b>
          <span>www.IndianServers.com&nbsp;&nbsp; info@IndianServers.com</span>
        </aside>
      </footer>
    </main>
  );
}
