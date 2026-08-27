import { useEffect, useRef, useState, type PointerEvent } from "react";
import { ExternalLink, RefreshCcw, Share2 } from "lucide-react";
import type { LessonAdapterProps } from "../types";
import "./CompositeFunctionsTargetLesson150.css";

type Order = "fog" | "gof";
const clamp = (v: number, min: number, max: number, step = 0.1) =>
  Math.max(min, Math.min(max, Math.round(v / step) * step));
const tidy = (v: number, digits = 2) =>
  Math.abs(v) < 0.000001
    ? "0"
    : Number.isInteger(v)
      ? String(v)
      : v.toFixed(digits).replace(/0+$/, "").replace(/\.$/, "");
const values = (x: number, h: number, a: number, order: Order) => {
  const inner = order === "fog" ? x + h : a * x * x,
    outer = order === "fog" ? a * inner * inner : inner + h;
  return { inner, outer };
};

function CompositeGraph({
  x,
  h,
  a,
  order,
  onX,
}: {
  x: number;
  h: number;
  a: number;
  order: Order;
  onX: (v: number) => void;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState(false);
  const px = (v: number) => 340 + v * 48,
    py = (v: number) => 385 - v * 29;
  const current = values(x, h, a, order);
  const path = (fn: (v: number) => number) =>
    Array.from({ length: 201 }, (_, i) => {
      const u = -5 + i / 20;
      return `${i ? "L" : "M"}${px(u)},${py(fn(u))}`;
    }).join(" ");
  const move = (e: PointerEvent<SVGSVGElement>) => {
    const box = svg.current?.getBoundingClientRect();
    if (!box || !dragging) return;
    onX(
      clamp(
        (((e.clientX - box.left) / box.width) * 680 - 340) / 48,
        -5,
        5,
        0.1,
      ),
    );
  };
  const composite = (u: number) =>
    order === "fog" ? a * (u + h) ** 2 : a * u * u + h;
  return (
    <svg
      ref={svg}
      className="comp150-graph"
      viewBox="0 0 680 500"
      role="img"
      aria-label="Graphs of g, f, and their composite with draggable input"
      onPointerMove={move}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
    >
      <defs>
        <pattern
          id="comp150-grid"
          width="48"
          height="29"
          patternUnits="userSpaceOnUse"
        >
          <path d="M48 0H0V29" fill="none" stroke="#dce5ed" />
        </pattern>
        <clipPath id="comp150-clip">
          <rect width="680" height="500" />
        </clipPath>
        <marker
          id="comp150-axis"
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0 0L6 3L0 6Z" fill="#24324b" />
        </marker>
      </defs>
      <rect width="680" height="500" fill="#fff" />
      <rect width="680" height="500" fill="url(#comp150-grid)" />
      <line
        x1="8"
        x2="675"
        y1={py(0)}
        y2={py(0)}
        className="axis"
        markerEnd="url(#comp150-axis)"
      />
      <line
        x1={px(0)}
        x2={px(0)}
        y1="492"
        y2="8"
        className="axis"
        markerEnd="url(#comp150-axis)"
      />
      {[-6, -4, -2, 0, 2, 4, 6].map((v) => (
        <text key={`x${v}`} x={px(v) - 7} y={py(0) + 22}>
          {v}
        </text>
      ))}
      {[-2, 2, 4, 6, 8, 10, 12].map((v) => (
        <text key={`y${v}`} x={px(0) - 28} y={py(v) + 5}>
          {v}
        </text>
      ))}
      <path
        d={path((u) => u + h)}
        className="g-curve"
        clipPath="url(#comp150-clip)"
      />
      <path
        d={path((u) => a * u * u)}
        className="f-curve"
        clipPath="url(#comp150-clip)"
      />
      <path
        d={path(composite)}
        className="composite-curve"
        clipPath="url(#comp150-clip)"
      />
      <line x1={px(x)} x2={px(x)} y1="10" y2="490" className="probe-line" />
      <circle
        cx={px(x)}
        cy={py(order === "fog" ? x + h : a * x * x)}
        r="7"
        className="inner-point"
      />
      <circle cx={px(x)} cy={py(current.outer)} r="9" className="outer-point" />
      <rect
        x={Math.min(545, px(x) + 25)}
        y={Math.max(18, py(current.outer) - 18)}
        width="115"
        height="36"
        rx="7"
        className="output-tag"
      />
      <text
        x={Math.min(555, px(x) + 35)}
        y={Math.max(42, py(current.outer) + 5)}
        className="output-text"
      >
        {order === "fog" ? "f(g(x))" : "g(f(x))"} = {tidy(current.outer)}
      </text>
      <circle
        data-testid="composite-input-handle"
        cx={px(x)}
        cy={py(current.outer)}
        r="14"
        className="probe-handle"
        role="slider"
        tabIndex={0}
        aria-label="Drag composite input probe"
        aria-valuemin={-5}
        aria-valuemax={5}
        aria-valuenow={x}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          setDragging(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") onX(clamp(x + 0.1, -5, 5));
          if (e.key === "ArrowLeft") onX(clamp(x - 0.1, -5, 5));
        }}
      />
    </svg>
  );
}

export default function CompositeFunctionsTargetLesson150({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [x, setX] = useState(2),
    [h, setH] = useState(1),
    [a, setA] = useState(1),
    [order, setOrder] = useState<Order>("fog"),
    [workspace, setWorkspace] = useState(false),
    [notice, setNotice] = useState("");
  const update = (setter: (v: number) => void) => (v: number) => {
    setter(v);
    onInteraction();
  };
  const current = values(x, h, a, order),
    fog = a * (x + h) ** 2,
    gof = a * x * x + h;
  const coefficient = Math.abs(a - 1) < 0.000001 ? "" : tidy(a);
  const reset = () => {
    setX(2);
    setH(1);
    setA(1);
    setOrder("fog");
    setWorkspace(false);
    setNotice("");
  };
  useEffect(reset, [resetToken]);
  const innerName = order === "fog" ? "g" : "f",
    outerName = order === "fog" ? "f" : "g",
    innerFormula =
      order === "fog" ? `g(x) = x + ${tidy(h)}` : `f(x) = ${coefficient}x²`,
    outerFormula =
      order === "fog" ? `f(u) = ${coefficient}u²` : `g(u) = u + ${tidy(h)}`;
  const compositeFormula =
    order === "fog"
      ? `${coefficient}(x + ${tidy(h)})²`
      : `${coefficient}x² + ${tidy(h)}`;
  return (
    <section
      className="comp150-page"
      data-testid="graph-mockup-0207"
      data-dedicated-lesson="150"
      data-object-model="editable-composite-input-inner-shift-outer-scale-and-order-pointer-keyboard-draggable-graph-probe-generated-function-machine-three-curves-live-inside-first-evaluation-and-order-comparison"
      data-x={x}
      data-inner-shift={h}
      data-outer-scale={a}
      data-order={order}
      data-inner={current.inner}
      data-result={current.outer}
      data-fog={fog}
      data-gof={gof}
      data-workspace={workspace}
    >
      <nav className="comp150-breadcrumb">
        ← Home › Lessons › Graphs And Functions › <b>150 Composite Functions</b>
      </nav>
      <header className="comp150-header">
        <div>
          <h1>Composite Functions</h1>
          <p>Follow chained mappings.</p>
        </div>
        <aside>
          <button onClick={reset}>
            <RefreshCcw />
            Reset
          </button>
          <button
            onClick={() => {
              void navigator.clipboard?.writeText(window.location.href);
              setNotice("Lesson link copied");
              onInteraction();
            }}
          >
            <Share2 />
            Share
          </button>
          <button
            onClick={() => {
              setWorkspace((v) => !v);
              onInteraction();
            }}
          >
            <ExternalLink />
            Workspace
          </button>
        </aside>
        <section className="comp150-machine">
          <h2>
            x → {innerName}(x) → {outerName}({innerName}(x))
          </h2>
          <div className="input">
            <b>Input</b>
            <i>x</i>
            <output>{tidy(x)}</output>
            <input
              aria-label="Composite input x"
              type="range"
              min="-5"
              max="5"
              step=".1"
              value={x}
              onChange={(e) => update(setX)(Number(e.target.value))}
            />
            <small>
              <span>−5</span>
              <span>5</span>
            </small>
          </div>
          <em>→</em>
          <div className="inner">
            <b>{innerFormula}</b>
            <output>
              {innerName}({tidy(x)}) = {tidy(current.inner)}
            </output>
            <span>
              {order === "fog"
                ? `Shift right by ${tidy(h)}`
                : `Scale square by ${tidy(a)}`}
            </span>
          </div>
          <em>→</em>
          <div className="outer">
            <b>{outerFormula}</b>
            <output>
              {outerName}({innerName}({tidy(x)})) = {tidy(current.outer)}
            </output>
            <span>
              {order === "fog" ? "Square the output" : "Shift the output"}
            </span>
          </div>
          <em>→</em>
          <div className="result">
            <b>Output</b>
            <i>
              {outerName}({innerName}({tidy(x)}))
            </i>
            <output>{tidy(current.outer)}</output>
          </div>
          <strong>
            {outerName}({innerName}(x)) = {compositeFormula}
          </strong>
        </section>
      </header>
      <section className="comp150-body">
        <main>
          <h2>
            Graphs: g(x), f(x) and {outerName}({innerName}(x))
          </h2>
          <div className="comp150-legend">
            <span className="composite">
              {outerName}({innerName}(x)) = {compositeFormula}
            </span>
            <span className="f">f(x) = {coefficient}x²</span>
            <span className="g">g(x) = x + {tidy(h)}</span>
          </div>
          <CompositeGraph x={x} h={h} a={a} order={order} onX={update(setX)} />
          <p>Drag x above to see how each function transforms the value.</p>
        </main>
        <aside>
          <section className="comp150-controls">
            <h2>Function controls</h2>
            <label>
              Inner shift (g)
              <input
                aria-label="Composite inner shift"
                type="range"
                min="-5"
                max="5"
                step=".25"
                value={h}
                onChange={(e) => update(setH)(Number(e.target.value))}
              />
              <output>{tidy(h)}</output>
              <small>
                <span>−5</span>
                <span>5</span>
              </small>
            </label>
            <label>
              Outer scale (f)
              <input
                aria-label="Composite outer scale"
                type="range"
                min=".5"
                max="3"
                step=".25"
                value={a}
                onChange={(e) => update(setA)(Number(e.target.value))}
              />
              <output>{tidy(a)}</output>
              <small>
                <span>0.5</span>
                <span>3</span>
              </small>
            </label>
          </section>
          <section className="comp150-order">
            <h2>Composition order</h2>
            <div>
              <button
                className={order === "fog" ? "active" : ""}
                onClick={() => {
                  setOrder("fog");
                  onInteraction();
                }}
              >
                f ∘ g
              </button>
              <button
                className={order === "gof" ? "active" : ""}
                onClick={() => {
                  setOrder("gof");
                  onInteraction();
                }}
              >
                g ∘ f
              </button>
            </div>
            <p>
              {order === "fog"
                ? "f ∘ g means do g first, then f."
                : "g ∘ f means do f first, then g."}
            </p>
          </section>
          <section className="comp150-live">
            <h2>Live evaluation (x = {tidy(x)})</h2>
            <p>
              <i>1</i>Input <b>x = {tidy(x)}</b>
            </p>
            <p>
              <i>2</i>Inner function <em>{innerFormula}</em>
              <b>
                {innerName}({tidy(x)}) = {tidy(current.inner)}
              </b>
            </p>
            <p>
              <i>3</i>Outer function <em>{outerFormula}</em>
              <b>
                {outerName}({innerName}({tidy(x)})) = {tidy(current.outer)}
              </b>
            </p>
            <strong>
              = Final output{" "}
              <output>
                {outerName}({innerName}({tidy(x)})) = {tidy(current.outer)}
              </output>
            </strong>
          </section>
        </aside>
      </section>
      <section className="comp150-insights">
        <article>
          <h2>◉ Evaluate inside first</h2>
          <p>
            To find f(g(x)), first evaluate the inner function g(x) to get a
            number, then apply the outer function f to that result.
          </p>
          <div>
            x <b>→</b> g(x) <b>→</b> f(g(x))
            <small>input | inner first | outer next</small>
          </div>
        </article>
        <article>
          <h2>◉ Order matters</h2>
          <p>
            In general, f(g(x)) ≠ g(f(x)). Switch the order to see a different
            result.
          </p>
          <div>
            <span>
              f(g(x)) = {coefficient}(x + {tidy(h)})²
              <br />
              (at x = {tidy(x)})<b>= {tidy(fog)}</b>
            </span>
            <i>≠</i>
            <span>
              g(f(x)) = {coefficient}x² + {tidy(h)}
              <br />
              (at x = {tidy(x)})<b>= {tidy(gof)}</b>
            </span>
          </div>
        </article>
      </section>
      {workspace && (
        <button
          className="comp150-workspace"
          onClick={() => setWorkspace(false)}
        >
          Composite workspace active · close
        </button>
      )}
      {notice && (
        <button className="comp150-notice" onClick={() => setNotice("")}>
          {notice}
        </button>
      )}
    </section>
  );
}
