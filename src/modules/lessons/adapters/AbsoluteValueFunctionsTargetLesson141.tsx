import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Expand, Lightbulb } from "lucide-react";
import type { LessonAdapterProps } from "../types";
import "./AbsoluteValueFunctionsTargetLesson141.css";

type Reflection = "none" | "x" | "y";

const clean = (value: number) =>
  Math.abs(value) < 0.0001
    ? "0"
    : Number.isInteger(value)
      ? String(value)
      : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");

const inside = (h: number) =>
  h < 0 ? `x + ${clean(Math.abs(h))}` : h === 0 ? "x" : `x − ${clean(h)}`;

const signedTerm = (value: number) =>
  value === 0
    ? ""
    : value < 0
      ? ` − ${clean(Math.abs(value))}`
      : ` + ${clean(value)}`;

const formula = (a: number, h: number, k: number, name = "f") =>
  `${name}(x) = ${a === 1 ? "" : a === -1 ? "−" : clean(a)}|${inside(h)}|${signedTerm(k)}`;

const linearBranch = (slope: number, intercept: number) => {
  const xTerm = slope === 1 ? "x" : slope === -1 ? "−x" : `${clean(slope)}x`;
  return `${xTerm}${signedTerm(intercept)}`;
};

function AbsoluteFormula({
  a,
  h,
  k,
  name = "f",
}: {
  a: number;
  h: number;
  k: number;
  name?: string;
}) {
  return (
    <span className="abs141-formula">
      <i>{name}(x)</i> = {a === 1 ? "" : a === -1 ? "−" : clean(a)} |
      <b>{inside(h)}</b>|{signedTerm(k)}
    </span>
  );
}

function AbsoluteGraph({
  a,
  h,
  k,
  onVertex,
  onA,
}: {
  a: number;
  h: number;
  k: number;
  onVertex: (h: number, k: number) => void;
  onA: (a: number) => void;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const [drag, setDrag] = useState<"vertex" | "scale" | null>(null);
  const px = (x: number) => 250 + x * 43;
  const py = (y: number) => 280 - y * 43;
  const evaluate = (x: number) => a * Math.abs(x - h) + k;
  const pointer = (event: PointerEvent<SVGSVGElement>) => {
    const box = svg.current?.getBoundingClientRect();
    if (!box || !drag) return;
    const x = (((event.clientX - box.left) / box.width) * 580 - 250) / 43;
    const y = (280 - ((event.clientY - box.top) / box.height) * 520) / 43;
    if (drag === "vertex")
      onVertex(
        Math.max(-5, Math.min(5, Math.round(x * 4) / 4)),
        Math.max(-5, Math.min(5, Math.round(y * 4) / 4)),
      );
    else onA(Math.max(-5, Math.min(5, Math.round(((y - k) / 2) * 4) / 4)));
  };
  const x1 = -5.5,
    x2 = 6.5;
  return (
    <svg
      ref={svg}
      className="abs141-graph"
      viewBox="0 0 580 520"
      role="img"
      aria-label="Absolute-value V graph with draggable vertex and opening point"
      onPointerMove={pointer}
      onPointerUp={() => setDrag(null)}
      onPointerLeave={() => setDrag(null)}
    >
      <defs>
        <pattern
          id="abs141-grid"
          width="43"
          height="43"
          patternUnits="userSpaceOnUse"
        >
          <path d="M43 0H0V43" fill="none" stroke="#dce5ec" />
        </pattern>
        <marker
          id="abs141-teal-arrow"
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="4"
          orient="auto"
        >
          <path d="M0 0L8 4L0 8Z" fill="#09a7b8" />
        </marker>
        <marker
          id="abs141-blue-arrow"
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="4"
          orient="auto"
        >
          <path d="M0 0L8 4L0 8Z" fill="#2b82ee" />
        </marker>
        <marker
          id="abs141-orange-arrow"
          markerWidth="8"
          markerHeight="8"
          refX="4"
          refY="4"
          orient="auto-start-reverse"
        >
          <path d="M0 0L8 4L0 8Z" fill="#ed8b00" />
        </marker>
      </defs>
      <rect width="580" height="520" fill="url(#abs141-grid)" />
      <line x1="8" x2="572" y1={py(0)} y2={py(0)} className="axis" />
      <line x1={px(0)} x2={px(0)} y1="512" y2="8" className="axis" />
      {[-6, -4, -2, 0, 1, 2, 4, 6].map((x) => (
        <text
          key={`x${x}`}
          x={px(x)}
          y={py(0) + 20}
          className={x === h ? "highlight" : ""}
        >
          {x}
        </text>
      ))}
      {[-6, -4, -2, 2, 4, 6].map((y) => (
        <text key={`y${y}`} x={px(0) - 13} y={py(y) + 4}>
          {y}
        </text>
      ))}
      <text x="571" y={py(0) + 18} className="xy">
        x
      </text>
      <text x={px(0) + 13} y="18" className="xy">
        y
      </text>
      <path
        d={`M${px(-5.2)},${py(Math.abs(-5.2))}L${px(0)},${py(0)}L${px(6.2)},${py(6.2)}`}
        className="parent"
      />
      <line x1={px(h)} x2={px(h)} y1="8" y2="512" className="symmetry" />
      <line
        x1={px(x1)}
        y1={py(evaluate(x1))}
        x2={px(h)}
        y2={py(k)}
        className="left-arm"
        markerStart="url(#abs141-teal-arrow)"
      />
      <line
        x1={px(h)}
        y1={py(k)}
        x2={px(x2)}
        y2={py(evaluate(x2))}
        className="right-arm"
        markerEnd="url(#abs141-blue-arrow)"
      />
      <rect
        x={px(h) + 18}
        y="52"
        width="135"
        height="58"
        rx="10"
        className="symmetry-card"
      />
      <text x={px(h) + 85} y="76" className="card-title">
        Axis of symmetry
      </text>
      <text x={px(h) + 85} y="99" className="card-value">
        x = {clean(h)}
      </text>
      <rect
        x="34"
        y="218"
        width="78"
        height="55"
        rx="9"
        className="arm-card left"
      />
      <text x="73" y="242" className="card-title">
        Left arm
      </text>
      <text x="73" y="260" className="card-title">
        reflected
      </text>
      <rect
        x="474"
        y="220"
        width="82"
        height="55"
        rx="9"
        className="arm-card right"
      />
      <text x="515" y="244" className="card-title">
        Right arm
      </text>
      <text x="515" y="262" className="card-title">
        reflected
      </text>
      <circle cx={px(h)} cy={py(k)} r="7" className="vertex" />
      <line
        x1={px(h)}
        y1={py(k)}
        x2={px(h) + 75}
        y2={py(k)}
        className="vertex-link"
      />
      <rect
        x={px(h) + 74}
        y={py(k) - 20}
        width="113"
        height="38"
        rx="8"
        className="vertex-card"
      />
      <text x={px(h) + 130} y={py(k) + 4} className="vertex-text">
        Vertex ({clean(h)}, {clean(k)})
      </text>
      {[h - 2, h + 2].map((x) => (
        <g key={x}>
          <line
            x1={px(x)}
            x2={px(x)}
            y1={py(0)}
            y2={py(-4.7)}
            className="distance-guide"
          />
        </g>
      ))}
      {[
        [px(h) - 245, px(h), px(h) - 122],
        [px(h), px(h) + 215, px(h) + 108],
      ].map(([start, end, center], index) => (
        <g key={`distance-${index}`}>
          <line
            x1={start}
            x2={end}
            y1={py(-4.3)}
            y2={py(-4.3)}
            className="distance-arrow"
            markerStart="url(#abs141-orange-arrow)"
            markerEnd="url(#abs141-orange-arrow)"
          />
          <text x={center} y={py(-4.85)} className="distance-text">
            Distance from vertex
          </text>
          <text x={center} y={py(-5.35)} className="distance-math">
            |x − {clean(h)}|
          </text>
        </g>
      ))}
      <circle
        data-testid="absolute-value-vertex-handle"
        cx={px(h)}
        cy={py(k)}
        r="17"
        className="handle"
        role="slider"
        tabIndex={0}
        aria-label="Drag absolute-value vertex"
        aria-valuetext={`${clean(h)}, ${clean(k)}`}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDrag("vertex");
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") onVertex(Math.max(-5, h - 0.25), k);
          if (event.key === "ArrowRight") onVertex(Math.min(5, h + 0.25), k);
          if (event.key === "ArrowUp") onVertex(h, Math.min(5, k + 0.25));
          if (event.key === "ArrowDown") onVertex(h, Math.max(-5, k - 0.25));
        }}
      />
      <circle
        data-testid="absolute-value-opening-handle"
        cx={px(h + 2)}
        cy={py(k + 2 * a)}
        r="16"
        className="handle"
        role="slider"
        tabIndex={0}
        aria-label="Drag absolute-value opening point"
        aria-valuemin={-5}
        aria-valuemax={5}
        aria-valuenow={a}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDrag("scale");
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowUp") onA(Math.min(5, a + 0.25));
          if (event.key === "ArrowDown") onA(Math.max(-5, a - 0.25));
        }}
      />
    </svg>
  );
}

function DistanceLine({
  h,
  probe,
  onProbe,
}: {
  h: number;
  probe: number;
  onProbe: (value: number) => void;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState(false);
  const px = (x: number) => 45 + (x + 4) * 42;
  const pointer = (event: PointerEvent<SVGSVGElement>) => {
    const box = svg.current?.getBoundingClientRect();
    if (!box || !dragging) return;
    const x = ((event.clientX - box.left) / box.width) * 500;
    onProbe(Math.max(-4, Math.min(6, Math.round(((x - 45) / 42 - 4) * 4) / 4)));
  };
  return (
    <svg
      ref={svg}
      className="abs141-number-line"
      viewBox="0 0 500 125"
      role="img"
      aria-label="Absolute-value distance number line"
      onPointerMove={pointer}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
    >
      <defs>
        <marker
          id="abs141-line-arrow"
          markerWidth="7"
          markerHeight="7"
          refX="5"
          refY="3.5"
          orient="auto-start-reverse"
        >
          <path d="M0 0L7 3.5L0 7Z" fill="#1e2d41" />
        </marker>
        <marker
          id="abs141-arc-arrow"
          markerWidth="7"
          markerHeight="7"
          refX="5"
          refY="3.5"
          orient="auto"
        >
          <path d="M0 0L7 3.5L0 7Z" fill="#ed8b00" />
        </marker>
      </defs>
      <line
        x1="18"
        x2="482"
        y1="54"
        y2="54"
        className="line"
        markerStart="url(#abs141-line-arrow)"
        markerEnd="url(#abs141-line-arrow)"
      />
      {[-4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].map((x) => (
        <g key={x}>
          <line x1={px(x)} x2={px(x)} y1="47" y2="61" />
          <text x={px(x)} y="79">
            {x}
          </text>
        </g>
      ))}
      <path
        d={`M${px(h)},42 Q${(px(h) + px(probe)) / 2},0 ${px(probe)},42`}
        className="arc"
        markerEnd="url(#abs141-arc-arrow)"
      />
      <text x={(px(h) + px(probe)) / 2} y="18" className="distance">
        |{clean(probe)} − {clean(h)}| = {clean(Math.abs(probe - h))}
      </text>
      <circle cx={px(h)} cy="54" r="7" className="center" />
      <text x={px(h)} y="102" className="center-label">
        Vertex
      </text>
      <text x={px(h)} y="121" className="center-label">
        {clean(h)}
      </text>
      <circle
        cx={px(probe)}
        cy="54"
        r="8"
        className="probe"
        role="slider"
        tabIndex={0}
        aria-label="Drag distance probe"
        aria-valuemin={-4}
        aria-valuemax={6}
        aria-valuenow={probe}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDragging(true);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") onProbe(Math.max(-4, probe - 0.25));
          if (event.key === "ArrowRight") onProbe(Math.min(6, probe + 0.25));
        }}
      />
      <text x={px(probe)} y="102" className="probe-label">
        x
      </text>
    </svg>
  );
}

export default function AbsoluteValueFunctionsTargetLesson141({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [a, setA] = useState(1.25),
    [h, setH] = useState(1),
    [k, setK] = useState(-2),
    [reflection, setReflection] = useState<Reflection>("none"),
    [probe, setProbe] = useState(5),
    [tab, setTab] = useState("Explore"),
    [actions, setActions] = useState(0),
    [fullscreen, setFullscreen] = useState(false);
  const effectiveA = reflection === "x" ? -a : a,
    effectiveH = reflection === "y" ? -h : h,
    effectiveK = reflection === "x" ? -k : k;
  const evaluate = (x: number) =>
    effectiveA * Math.abs(x - effectiveH) + effectiveK;
  const leftSlope = -effectiveA,
    rightSlope = effectiveA;
  const leftIntercept = effectiveA * effectiveH + effectiveK,
    rightIntercept = -effectiveA * effectiveH + effectiveK;
  const range =
    effectiveA > 0
      ? `y>=${effectiveK}`
      : effectiveA < 0
        ? `y<=${effectiveK}`
        : `y=${effectiveK}`;
  const act = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const changeA = (value: number) => {
    setA(value);
    act();
  };
  const changeH = (value: number) => {
    setH(value);
    act();
  };
  const changeK = (value: number) => {
    setK(value);
    act();
  };
  const changeVertex = (nextH: number, nextK: number) => {
    setH(reflection === "y" ? -nextH : nextH);
    setK(reflection === "x" ? -nextK : nextK);
    act();
  };
  const changeEffectiveA = (value: number) => {
    setA(reflection === "x" ? -value : value);
    act();
  };
  const changeProbe = (value: number) => {
    setProbe(value);
    act();
  };
  const reset = () => {
    setA(1.25);
    setH(1);
    setK(-2);
    setReflection("none");
    setProbe(5);
    setTab("Explore");
    setActions(0);
    setFullscreen(false);
    onInteraction();
  };
  useEffect(() => reset(), [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div
      className={`abs141-page ${fullscreen ? "fullscreen" : ""}`}
      data-testid="graph-mockup-0198"
      data-dedicated-lesson="141"
      data-object-model="editable-absolute-value-scale-vertex-shift-reflection-pointer-keyboard-draggable-vertex-opening-and-distance-probe-generated-v-graph-parent-axis-piecewise-branches-distance-model-range-model"
      data-a={a}
      data-h={h}
      data-k={k}
      data-reflection={reflection}
      data-effective-a={effectiveA}
      data-effective-h={effectiveH}
      data-effective-k={effectiveK}
      data-formula={formula(effectiveA, effectiveH, effectiveK)}
      data-vertex={`${effectiveH},${effectiveK}`}
      data-probe={probe}
      data-distance={Math.abs(probe - effectiveH)}
      data-probe-output={evaluate(probe)}
      data-range={range}
      data-piecewise={`${linearBranch(leftSlope, leftIntercept)}@x<${effectiveH};${linearBranch(rightSlope, rightIntercept)}@x>=${effectiveH}`}
      data-actions={actions}
      data-direct-interaction="true"
    >
      <nav className="abs141-breadcrumb">
        <a href="/">←</a>
        <a href="/">Home</a>
        <span>&gt;</span>
        <a href="/lessons">Lessons</a>
        <span>&gt;</span>
        <a href="/lessons/graphs-and-functions">Graphs And Functions</a>
        <span>&gt;</span>
        <b>141 Absolute Value Functions</b>
      </nav>
      <section className="abs141-surface">
        <header>
          <small>
            <b>GRAPHS AND FUNCTIONS</b>
            <b>FUNCTIONS</b>
          </small>
          <h1>Absolute-Value Functions</h1>
          <p>Understand piecewise reflection.</p>
          <strong>
            <AbsoluteFormula a={effectiveA} h={effectiveH} k={effectiveK} />
          </strong>
          <button
            aria-label="Expand absolute-value explorer"
            onClick={() => {
              setFullscreen((value) => !value);
              act();
            }}
          >
            <Expand />
          </button>
        </header>
        <nav className="abs141-tabs">
          {["Explore", "Explain", "Examples", "Practice"].map((name) => (
            <button
              key={name}
              className={tab === name ? "active" : ""}
              onClick={() => {
                setTab(name);
                if (name === "Examples") {
                  setA(2);
                  setH(-1);
                  setK(1);
                  setReflection("none");
                }
                if (name === "Practice") {
                  setA(0.75);
                  setH(2);
                  setK(-1);
                  setReflection("none");
                }
                act();
              }}
            >
              {name}
            </button>
          ))}
        </nav>
        <div className="abs141-layout">
          <main>
            <section className="abs141-graph-panel">
              <header>
                <span>
                  <i></i>
                  <AbsoluteFormula
                    a={effectiveA}
                    h={effectiveH}
                    k={effectiveK}
                  />
                </span>
                <span>
                  <i></i>Parent y = |x|
                </span>
              </header>
              <AbsoluteGraph
                a={effectiveA}
                h={effectiveH}
                k={effectiveK}
                onVertex={changeVertex}
                onA={changeEffectiveA}
              />
            </section>
          </main>
          <aside>
            <section className="abs141-controls">
              <h3>Transformations</h3>
              <label>
                Opening scale (a)
                <input
                  aria-label="Absolute-value opening scale"
                  type="range"
                  min="-5"
                  max="5"
                  step=".25"
                  value={a}
                  onChange={(e) => changeA(Number(e.target.value))}
                />
                <output>{clean(a)}</output>
                <small>
                  <span>-5</span>
                  <span>5</span>
                </small>
              </label>
              <label>
                Vertex x (h)
                <input
                  aria-label="Absolute-value vertex x"
                  type="range"
                  min="-6"
                  max="6"
                  step=".25"
                  value={h}
                  onChange={(e) => changeH(Number(e.target.value))}
                />
                <output>{clean(h)}</output>
                <small>
                  <span>-6</span>
                  <span>6</span>
                </small>
              </label>
              <label>
                Vertical shift (k)
                <input
                  aria-label="Absolute-value vertical shift"
                  type="range"
                  min="-6"
                  max="6"
                  step=".25"
                  value={k}
                  onChange={(e) => changeK(Number(e.target.value))}
                />
                <output>{clean(k)}</output>
                <small>
                  <span>-6</span>
                  <span>6</span>
                </small>
              </label>
              <fieldset>
                <legend>Reflection</legend>
                {[
                  ["none", "None"],
                  ["x", "Reflect over x-axis"],
                  ["y", "Reflect over y-axis"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    className={reflection === value ? "active" : ""}
                    onClick={() => {
                      setReflection(value as Reflection);
                      act();
                    }}
                  >
                    {label}
                  </button>
                ))}
              </fieldset>
              <article>
                <h4>Current function</h4>
                <AbsoluteFormula a={effectiveA} h={effectiveH} k={effectiveK} />
              </article>
              <article className="abs141-piecewise">
                <h4>Piecewise form</h4>
                <p>
                  <i>f(x)</i> = {linearBranch(rightSlope, rightIntercept)},{" "}
                  <b>x ≥ {clean(effectiveH)}</b>
                </p>
                <p>
                  <i>f(x)</i> = {linearBranch(leftSlope, leftIntercept)},{" "}
                  <b>x &lt; {clean(effectiveH)}</b>
                </p>
              </article>
            </section>
          </aside>
        </div>
        <div className="abs141-lower">
          <section className="abs141-distance">
            <h3>Distance model on the number line</h3>
            <DistanceLine h={effectiveH} probe={probe} onProbe={changeProbe} />
            <p>
              The output at x = {clean(probe)} is {clean(evaluate(probe))}; its
              horizontal distance from the vertex is{" "}
              {clean(Math.abs(probe - effectiveH))}.
            </p>
          </section>
          <section className="abs141-sides">
            <article>
              <i></i>
              <div>
                <b>Left of the vertex (x &lt; {clean(effectiveH)}):</b>
                <p>
                  Distance is{" "}
                  {effectiveH >= 0
                    ? `${clean(effectiveH)} − x`
                    : `−x − ${clean(Math.abs(effectiveH))}`}
                  . The graph is reflected across x = {clean(effectiveH)}.
                </p>
              </div>
            </article>
            <article>
              <i></i>
              <div>
                <b>Right of the vertex (x ≥ {clean(effectiveH)}):</b>
                <p>
                  Distance is x {effectiveH < 0 ? "+" : "−"}{" "}
                  {clean(Math.abs(effectiveH))}. The graph rises away from the
                  vertex.
                </p>
              </div>
            </article>
          </section>
        </div>
        <footer>
          <Lightbulb />
          <b>
            The absolute-value function measures distance from the vertex (h,
            k). The graph is a V-shape with axis of symmetry x = h.
          </b>
        </footer>
      </section>
    </div>
  );
}
