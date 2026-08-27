import { useEffect, useRef, useState, type PointerEvent } from "react";
import {
  Bookmark,
  Check,
  Expand,
  Home,
  Minus,
  Plus,
  Share2,
} from "lucide-react";
import type { LessonAdapterProps } from "../types";
import "./HyperbolicFunctionsTargetLesson145.css";

type CurveKey = "sinh" | "cosh" | "tanh" | "exp" | "inverseExp";
const clean = (value: number, digits = 4) =>
  Math.abs(value) < 0.00005 ? (0).toFixed(digits) : value.toFixed(digits);
const clampT = (value: number) =>
  Math.max(-3, Math.min(3, Math.round(value * 20) / 20));
const valuesAt = (t: number) => {
  const exp = Math.exp(t),
    inverseExp = Math.exp(-t);
  const sinh = (exp - inverseExp) / 2,
    cosh = (exp + inverseExp) / 2;
  return { exp, inverseExp, sinh, cosh, tanh: sinh / cosh };
};

function UnitHyperbola({
  t,
  onT,
}: {
  t: number;
  onT: (value: number) => void;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState(false);
  const data = valuesAt(t),
    px = (x: number) => 152 + x * 58,
    py = (y: number) => 173 - y * 58;
  const branch = (sign: 1 | -1) =>
    Array.from({ length: 121 }, (_, index) => {
      const u = -2.25 + (index / 120) * 4.5;
      return `${index ? "L" : "M"}${px(sign * Math.cosh(u))},${py(Math.sinh(u))}`;
    }).join(" ");
  const move = (event: PointerEvent<SVGSVGElement>) => {
    const box = svg.current?.getBoundingClientRect();
    if (!box || !dragging) return;
    const localY = ((event.clientY - box.top) / box.height) * 340;
    onT(clampT(Math.asinh((173 - localY) / 58)));
  };
  return (
    <svg
      ref={svg}
      className="hyp145-hyperbola"
      viewBox="0 0 305 340"
      role="img"
      aria-label="Unit hyperbola with draggable exponential parameter point"
      onPointerMove={move}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
    >
      <defs>
        <clipPath id="hyp145-hyperbola-clip">
          <rect width="305" height="340" />
        </clipPath>
      </defs>
      <line x1="5" x2="300" y1={py(0)} y2={py(0)} className="axis" />
      <line x1={px(0)} x2={px(0)} y1="8" y2="332" className="axis" />
      {[-2, -1, 1, 2].map((x) => (
        <text key={`x${x}`} x={px(x) - 5} y={py(0) + 19}>
          {x}
        </text>
      ))}
      {[-2, -1, 1, 2].map((y) => (
        <text key={`y${y}`} x={px(0) - 20} y={py(y) + 4}>
          {y}
        </text>
      ))}
      <path
        d={branch(1)}
        className="branch"
        clipPath="url(#hyp145-hyperbola-clip)"
      />
      <path
        d={branch(-1)}
        className="branch"
        clipPath="url(#hyp145-hyperbola-clip)"
      />
      <line
        x1={px(0)}
        x2={px(data.cosh)}
        y1={py(data.sinh)}
        y2={py(data.sinh)}
        className="sinh-guide"
      />
      <line
        x1={px(data.cosh)}
        x2={px(data.cosh)}
        y1={py(0)}
        y2={py(data.sinh)}
        className="cosh-guide"
      />
      <text x="15" y="25" className="identity">
        x² − y² = 1
      </text>
      <text
        x={Math.min(225, px(data.cosh) + 8)}
        y={Math.max(20, py(data.sinh) - 8)}
        className="point-label"
      >
        P(t)
      </text>
      <text
        x={data.cosh > 1.4 ? px(data.cosh) - 45 : px(data.cosh) + 5}
        y={py(data.sinh) + 24}
      >
        ({clean(data.cosh, 2)}, {clean(data.sinh, 2)})
      </text>
      <circle
        data-testid="hyperbolic-hyperbola-handle"
        cx={px(data.cosh)}
        cy={py(data.sinh)}
        r="13"
        className="handle"
        role="slider"
        tabIndex={0}
        aria-label="Drag point on unit hyperbola"
        aria-valuemin={-3}
        aria-valuemax={3}
        aria-valuenow={t}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDragging(true);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowUp") onT(clampT(t + 0.1));
          if (event.key === "ArrowDown") onT(clampT(t - 0.1));
        }}
      />
    </svg>
  );
}

function HyperbolicGraph({
  t,
  span,
  visible,
  onT,
}: {
  t: number;
  span: number;
  visible: Record<CurveKey, boolean>;
  onT: (value: number) => void;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState(false);
  const data = valuesAt(t);
  const px = (x: number) => 320 + (x / span) * 278,
    py = (y: number) => 292 - y * 64;
  const path = (evaluate: (x: number) => number) =>
    Array.from({ length: 241 }, (_, index) => {
      const x = -span + (index / 240) * span * 2;
      return `${index ? "L" : "M"}${px(x)},${py(evaluate(x))}`;
    }).join(" ");
  const move = (event: PointerEvent<SVGSVGElement>) => {
    const box = svg.current?.getBoundingClientRect();
    if (!box || !dragging) return;
    const sx = ((event.clientX - box.left) / box.width) * 650;
    onT(clampT(((sx - 320) / 278) * span));
  };
  const curves: {
    key: CurveKey;
    evaluate: (x: number) => number;
    className: string;
  }[] = [
    { key: "sinh", evaluate: (x) => Math.sinh(x), className: "sinh" },
    { key: "cosh", evaluate: (x) => Math.cosh(x), className: "cosh" },
    { key: "tanh", evaluate: (x) => Math.tanh(x), className: "tanh" },
    { key: "exp", evaluate: (x) => Math.exp(x), className: "exp" },
    {
      key: "inverseExp",
      evaluate: (x) => Math.exp(-x),
      className: "inverse-exp",
    },
  ];
  return (
    <svg
      ref={svg}
      className="hyp145-graph"
      viewBox="0 0 650 430"
      role="img"
      aria-label="Hyperbolic and exponential curves with draggable t probe"
      onPointerMove={move}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
    >
      <defs>
        <pattern
          id="hyp145-grid"
          width="52"
          height="47"
          patternUnits="userSpaceOnUse"
        >
          <path d="M52 0H0V47" fill="none" stroke="#243349" />
        </pattern>
        <clipPath id="hyp145-graph-clip">
          <rect width="650" height="430" />
        </clipPath>
      </defs>
      <rect width="650" height="430" fill="#0a1522" />
      <rect width="650" height="430" fill="url(#hyp145-grid)" />
      <line x1="10" x2="640" y1={py(0)} y2={py(0)} className="axis" />
      <line x1={px(0)} x2={px(0)} y1="10" y2="420" className="axis" />
      {[-3, -2, -1, 0, 1, 2, 3].map((x) => (
        <text key={`x${x}`} x={px(x) - 5} y={py(0) + 20}>
          {x}
        </text>
      ))}
      {[-2, -1, 1, 2, 3].map((y) => (
        <text key={`y${y}`} x={px(0) - 23} y={py(y) + 4}>
          {y}
        </text>
      ))}
      {curves.map(
        (curve) =>
          visible[curve.key] && (
            <path
              key={curve.key}
              d={path(curve.evaluate)}
              className={curve.className}
              clipPath="url(#hyp145-graph-clip)"
            />
          ),
      )}
      <line x1={px(t)} x2={px(t)} y1="12" y2="419" className="probe-line" />
      <line
        x1="8"
        x2="642"
        y1={py(data.tanh)}
        y2={py(data.tanh)}
        className="tanh-guide"
      />
      {visible.sinh && (
        <circle cx={px(t)} cy={py(data.sinh)} r="6" className="sinh-point" />
      )}
      {visible.cosh && (
        <circle cx={px(t)} cy={py(data.cosh)} r="6" className="cosh-point" />
      )}
      {visible.tanh && (
        <circle cx={px(t)} cy={py(data.tanh)} r="6" className="tanh-point" />
      )}
      {visible.exp && (
        <circle cx={px(t)} cy={py(data.exp)} r="5" className="exp-point" />
      )}
      {visible.inverseExp && (
        <circle
          cx={px(t)}
          cy={py(data.inverseExp)}
          r="5"
          className="inverse-exp-point"
        />
      )}
      <g className="probe-label">
        <rect x={px(t) - 42} y="17" width="84" height="35" rx="6" />
        <text x={px(t) - 31} y="40">
          t = {t.toFixed(2)}
        </text>
      </g>
      <circle
        data-testid="hyperbolic-graph-probe"
        cx={px(t)}
        cy={py(0)}
        r="13"
        className="handle"
        role="slider"
        tabIndex={0}
        aria-label="Drag hyperbolic graph probe"
        aria-valuemin={-3}
        aria-valuemax={3}
        aria-valuenow={t}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDragging(true);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") onT(clampT(t + 0.1));
          if (event.key === "ArrowLeft") onT(clampT(t - 0.1));
        }}
      />
    </svg>
  );
}

export default function HyperbolicFunctionsTargetLesson145({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [t, setT] = useState(1.2),
    [challengeT, setChallengeT] = useState(0.55),
    [span, setSpan] = useState(3.5),
    [tab, setTab] = useState("Lab"),
    [bookmarked, setBookmarked] = useState(false),
    [shared, setShared] = useState(false),
    [fullscreen, setFullscreen] = useState(false),
    [checked, setChecked] = useState(true),
    [actions, setActions] = useState(0);
  const [visible, setVisible] = useState<Record<CurveKey, boolean>>({
    sinh: true,
    cosh: true,
    tanh: true,
    exp: true,
    inverseExp: true,
  });
  const data = valuesAt(t),
    identity = data.cosh ** 2 - data.sinh ** 2,
    challengeTarget = Math.atanh(0.5),
    challengeError = Math.abs(Math.tanh(challengeT) - 0.5),
    challengeCorrect = challengeError <= 0.01;
  const act = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const changeT = (value: number) => {
    setT(clampT(value));
    setChecked(false);
    act();
  };
  const reset = () => {
    setT(1.2);
    setChallengeT(0.55);
    setSpan(3.5);
    setTab("Lab");
    setBookmarked(false);
    setShared(false);
    setFullscreen(false);
    setChecked(true);
    setVisible({
      sinh: true,
      cosh: true,
      tanh: true,
      exp: true,
      inverseExp: true,
    });
    setActions(0);
    onInteraction();
  };
  useEffect(() => reset(), [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps
  const rows: [string, string, string, number, string][] = [
    ["Hyperbolic sine", "sinh t", "(eᵗ − e⁻ᵗ) / 2", data.sinh, "sinh"],
    ["Hyperbolic cosine", "cosh t", "(eᵗ + e⁻ᵗ) / 2", data.cosh, "cosh"],
    ["Hyperbolic tangent", "tanh t", "sinh t / cosh t", data.tanh, "tanh"],
    ["Exponential", "eᵗ", "—", data.exp, "exp"],
    ["Exponential", "e⁻ᵗ", "—", data.inverseExp, "inverseExp"],
  ];
  return (
    <div
      className={`hyp145-page ${fullscreen ? "fullscreen" : ""}`}
      data-testid="graph-mockup-0202"
      data-dedicated-lesson="145"
      data-object-model="linked-unit-hyperbola-exponential-decomposition-sinh-cosh-tanh-pointer-keyboard-draggable-hyperbola-point-and-graph-probe-generated-five-curves-table-identity-residual-real-challenge-curve-toggles-zoom-fullscreen"
      data-t={t}
      data-exp={data.exp}
      data-inverse-exp={data.inverseExp}
      data-sinh={data.sinh}
      data-cosh={data.cosh}
      data-tanh={data.tanh}
      data-identity={identity}
      data-challenge-t={challengeT}
      data-challenge-error={challengeError}
      data-challenge-correct={checked && challengeCorrect}
      data-span={span}
      data-visible={Object.entries(visible)
        .filter(([, on]) => on)
        .map(([key]) => key)
        .join(",")}
      data-actions={actions}
      data-direct-interaction="true"
    >
      <header className="hyp145-header">
        <nav>
          <small>
            Calculus &gt; Hyperbolic Functions &gt; Hyperbolic Functions Lab
          </small>
          <div>
            <button
              onClick={() => {
                void navigator.clipboard?.writeText(window.location.href);
                setShared(true);
                act();
              }}
            >
              <Share2 />
              {shared ? "Link copied" : "Share"}
            </button>
            <button
              onClick={() => {
                setBookmarked((value) => !value);
                act();
              }}
            >
              <Bookmark />
              {bookmarked ? "Saved" : "Bookmark"}
            </button>
            <button
              onClick={() => {
                setFullscreen((value) => !value);
                act();
              }}
            >
              <Expand />
              {fullscreen ? "Exit" : "Fullscreen"}
            </button>
          </div>
        </nav>
        <h1>Hyperbolic Functions ☆</h1>
        <p>
          Explore hyperbolic functions as exponential combinations and as
          coordinates on the unit hyperbola.
        </p>
        <div className="hyp145-tabs">
          {[
            "Overview",
            "Lab",
            "Examples",
            "Derivatives",
            "Integrals",
            "Applications",
            "History",
          ].map((name) => (
            <button
              key={name}
              className={tab === name ? "active" : ""}
              onClick={() => {
                setTab(name);
                act();
              }}
            >
              {name}
            </button>
          ))}
        </div>
      </header>
      <section className="hyp145-layout">
        <main>
          <section className="hyp145-upper">
            <article className="hyp145-unit">
              <h2>Unit hyperbola</h2>
              <strong>x² − y² = 1</strong>
              <UnitHyperbola t={t} onT={changeT} />
              <footer>
                <p>
                  <i></i>P(t) = (cosh t, sinh t)
                </p>
                <p>
                  <i></i>Horizontal coordinate = cosh t
                </p>
                <p>
                  <i></i>Vertical coordinate = sinh t
                </p>
              </footer>
            </article>
            <article className="hyp145-plot">
              <nav>
                {(
                  [
                    ["sinh", "y = sinh t"],
                    ["cosh", "y = cosh t"],
                    ["tanh", "y = tanh t"],
                    ["exp", "y = eᵗ"],
                    ["inverseExp", "y = e⁻ᵗ"],
                  ] as [CurveKey, string][]
                ).map(([key, label]) => (
                  <label key={key} className={key}>
                    <input
                      type="checkbox"
                      checked={visible[key]}
                      onChange={(event) => {
                        setVisible((state) => ({
                          ...state,
                          [key]: event.target.checked,
                        }));
                        act();
                      }}
                    />
                    {label}
                  </label>
                ))}
              </nav>
              <HyperbolicGraph
                t={t}
                span={span}
                visible={visible}
                onT={changeT}
              />
              <footer>
                <button
                  aria-label="Zoom out hyperbolic graph"
                  onClick={() => {
                    setSpan(Math.min(5, span + 0.5));
                    act();
                  }}
                >
                  <Minus />
                </button>
                <button
                  aria-label="Zoom in hyperbolic graph"
                  onClick={() => {
                    setSpan(Math.max(2, span - 0.5));
                    act();
                  }}
                >
                  <Plus />
                </button>
                <button
                  aria-label="Reset hyperbolic graph view"
                  onClick={() => {
                    setSpan(3.5);
                    act();
                  }}
                >
                  <Home />
                </button>
              </footer>
            </article>
          </section>
          <section className="hyp145-lower">
            <article className="hyp145-values">
              <h2>
                Values at <i>t</i> = {t.toFixed(2)}
              </h2>
              <table>
                <thead>
                  <tr>
                    <th>Function</th>
                    <th>Symbol</th>
                    <th>Definition</th>
                    <th>Value</th>
                    <th>Point on graph</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(([name, symbol, definition, value, key]) => (
                    <tr key={symbol}>
                      <td>
                        <i className={key}></i>
                        {name}
                      </td>
                      <td>{symbol}</td>
                      <td>{definition}</td>
                      <td>{clean(value)}</td>
                      <td>
                        ({t.toFixed(2)}, {clean(value)})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
            <article className="hyp145-challenge">
              <h2>Quick challenge</h2>
              <p>Drag the slider to a value of t (−2 ≤ t ≤ 2) so that</p>
              <strong>tanh t = 0.5</strong>
              <small>(within ±0.01)</small>
              <input
                aria-label="Hyperbolic challenge t"
                type="range"
                min="-2"
                max="2"
                step=".01"
                value={challengeT}
                onChange={(event) => {
                  setChallengeT(Number(event.target.value));
                  setChecked(false);
                  act();
                }}
              />
              <p>💡 Hint: Use the graph or the formula.</p>
              <button
                onClick={() => {
                  setChecked(true);
                  act();
                }}
              >
                Check Answer
              </button>
              {checked && (
                <footer className={challengeCorrect ? "correct" : "wrong"}>
                  <span>Your answer: t = {challengeT.toFixed(2)}</span>
                  <b>{challengeCorrect ? "Close!" : "Keep adjusting"}</b>
                  <span>Error: {challengeError.toFixed(3)}</span>
                </footer>
              )}
              <em>Exact target t = {challengeTarget.toFixed(4)}</em>
            </article>
          </section>
        </main>
        <aside className="hyp145-rail">
          <section className="hyp145-parameter">
            <header>
              <h2>Parameters</h2>
              <b>t = {t.toFixed(2)}</b>
            </header>
            <label>
              <i>t</i>
              <input
                aria-label="Hyperbolic parameter t"
                type="range"
                min="-3"
                max="3"
                step=".05"
                value={t}
                onChange={(event) => changeT(Number(event.target.value))}
              />
              <output>{t.toFixed(2)}</output>
            </label>
          </section>
          <section className="hyp145-decomposition">
            <h2>Exponential decomposition</h2>
            <p>
              <i className="exp"></i>eᵗ = <b>{clean(data.exp)}</b>
            </p>
            <p>
              <i className="inverseExp"></i>e⁻ᵗ ={" "}
              <b>{clean(data.inverseExp)}</b>
            </p>
            <hr />
            <p>
              <i className="sinh"></i>sinh t = (eᵗ − e⁻ᵗ)/2 ={" "}
              <b>{clean(data.sinh)}</b>
            </p>
            <p>
              <i className="cosh"></i>cosh t = (eᵗ + e⁻ᵗ)/2 ={" "}
              <b>{clean(data.cosh)}</b>
            </p>
            <p>
              <i className="tanh"></i>tanh t = sinh t/cosh t ={" "}
              <b>{clean(data.tanh)}</b>
            </p>
          </section>
          <section className="hyp145-identities">
            <h2>Identities &amp; properties</h2>
            <div>
              <strong>cosh² t − sinh² t = 1</strong>
              <span>
                Left side = {clean(identity)} <Check />
              </span>
            </div>
            <p>Not periodic</p>
            <em>HYPERBOLA_IDENTITY_REQUIRED</em>
          </section>
          <section className="hyp145-compare">
            <h2>Compare with circular trig</h2>
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Circular</th>
                    <th>Hyperbolic</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>sin θ</td>
                    <td>sinh t</td>
                  </tr>
                  <tr>
                    <td>cos θ</td>
                    <td>cosh t</td>
                  </tr>
                  <tr>
                    <td>tan θ</td>
                    <td>tanh t</td>
                  </tr>
                </tbody>
              </table>
              <svg viewBox="0 0 125 105">
                <line x1="5" x2="120" y1="55" y2="55" />
                <line x1="62" x2="62" y1="5" y2="100" />
                <path d="M20 95 C50 68,50 42,20 10 M105 95 C75 68,75 42,105 10" />
                <circle cx="40" cy="55" r="3" />
                <circle cx="84" cy="55" r="3" />
              </svg>
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}
