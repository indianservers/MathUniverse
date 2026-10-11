import { useEffect, useId, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  Search,
  Sun,
  Moon,
  Settings,
  ChartNoAxesColumn,
  Info,
  Lightbulb,
  BookOpen,
  Rocket,
  Globe,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";
import { useLabMode } from "../mockup/studioLabKit";
import type { StudioMockupPage } from "../mockup/studioMockupCatalog";
import { Planet, Robot, RangeField } from "./ComplexReferenceSuite";
import ComplexLearningDepth from "./ComplexLearningDepth";
import MathExpression from "../../components/ui/MathExpression";
import { argandNumber } from "./argandReferenceMath";
import { markComplexComplete } from "./complexStudioSession";
import { circuitValues, circuitSignal } from "./wavesReferenceMath";
import "./wavesReference.css";
const num = (n: number, d = 1) => Number(n.toFixed(d)).toString();
export default function WavesReference({ page }: { page: StudioMockupPage }) {
  const { mode, setMode } = useLabMode(page),
    id = useId().replaceAll(":", "");
  const [f, F] = useState(50),
    [l, L] = useState(0.1),
    [c, C] = useState(0),
    [r, R] = useState(40),
    [answer, A] = useState(""),
    [feedback, Feedback] = useState(""),
    [playing, P] = useState(false),
    [cycle, T] = useState(0),
    [dark, Dark] = useState(false),
    [dialog, Dialog] = useState(""),
    [search, SearchValue] = useState("");
  const q = circuitValues(f, l, c, r),
    phi = q.phase ?? 0,
    deg = (phi * 180) / Math.PI,
    signal = mode === "Signal Rotation",
    ac = mode === "AC Circuits",
    impedance = mode === "Impedance";
  useEffect(() => {
    if (!playing) return;
    let frame = 0,
      last = 0;
    const animate = (now: number) => {
      if (last) T((v) => (v + ((now - last) / 1000) * Math.PI) % (2 * Math.PI));
      last = now;
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [playing]);
  const reset = () => {
    F(50);
    L(0.1);
    C(0);
    R(40);
    T(0);
    P(false);
    A("");
    Feedback("");
  };
  const changeMode = (v: string) => {
    setMode(v);
    A("");
    Feedback("");
    P(false);
    T(0);
  };
  const check = () => {
    try {
      const correct = Math.abs(argandNumber(answer) - 1) < 0.001;
      Feedback(
        correct
          ? "Correct! cos(0°) = 1."
          : "Try again. The power factor is cos(φ).",
      );
      if (correct) markComplexComplete(page.id);
    } catch {
      Feedback("Enter a numeric answer.");
    }
  };
  const extent = Math.max(100, q.magnitude * 1.3),
    scale = 185 / extent,
    ox = 240,
    oy = 220;
  const re = q.magnitude * Math.cos(phi + (signal ? cycle : 0)),
    im = q.magnitude * Math.sin(phi + (signal ? cycle : 0)),
    px = (v: number) => ox + v * scale,
    py = (v: number) => oy - v * scale;
  const arcR = 55,
    arcAngle = signal ? phi + cycle : phi,
    ex = ox + arcR * Math.cos(arcAngle),
    ey = oy - arcR * Math.sin(arcAngle);
  const signalPath = (current: boolean) =>
    Array.from({ length: 241 }, (_, k) => {
      const phase = (k / 240) * 2 * Math.PI;
      const value = circuitSignal(phase, phi)[current ? "current" : "voltage"];
      return `${k ? "L" : "M"}${35 + (k / 240) * 275},${140 - value * 85}`;
    }).join(" ");
  const info = signal
    ? "The rotating phasor projects onto a sinusoid in time. Current phase relative to voltage is −φ."
    : ac
      ? "AC Circuits: R, XL, and XC determine impedance magnitude and phase. Positive reactance makes current lag voltage."
      : impedance
        ? "Impedance represents the total opposition to AC current. Its real part is resistance and its imaginary part is reactance."
        : "Phasors represent sinusoidal quantities as complex numbers in the frequency domain.";
  const rectangular = String.raw`Z=${num(r)}${q.x < 0 ? "-" : "+"}j${num(Math.abs(q.x))}\,\Omega`;
  return (
    <div
      className={`complex-reference-suite wr-suite${dark ? " wr-dark" : ""}`}
      data-complex-owned="waves"
      data-lab-mode={mode}
    >
      <nav className="wr-nav">
        <Link className="wr-brand" to="/complex-numbers">
          <span>
            <Planet />
          </span>
          <b>Math Universe</b>
        </Link>
        <Link to="/complex-numbers">Studio Home</Link>
        <Link to="/lessons">Lessons & Practice</Link>
        <Link to="/complex-numbers/waves-circuits">
          Interactive Investigations
        </Link>
        <Link to="/">App Home</Link>
        <label>
          <Search />
          <input
            value={search}
            onChange={(e) => SearchValue(e.target.value)}
            aria-label="Search lab modes"
            placeholder="Search topics, investigations..."
          />
        </label>
        <button aria-label="Toggle theme" onClick={() => Dark((v) => !v)}>
          {dark ? <Moon /> : <Sun />}
        </button>
        <button
          className="wr-profile"
          aria-label="Learning progress"
          onClick={() => Dialog("Learning progress")}
        >
          S
        </button>
      </nav>
      {search && (
        <div className="wr-search">
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
      <header className="wr-hero">
        <div className="wr-title">
          <span>
            <Activity />
          </span>
          <div>
            <h1>Applications to Waves & Circuits Lab</h1>
            <p>
              Unify phasors, AC circuits, and complex numbers. Visualize
              steady-state behavior.
            </p>
          </div>
        </div>
        <svg viewBox="0 0 600 120" aria-hidden="true">
          {[0, 1, 2].map((k) => (
            <path
              key={k}
              d={Array.from(
                { length: 121 },
                (_, j) =>
                  `${j ? "L" : "M"}${j * 5},${60 + Math.sin(j / 12 + k) * Math.sin((j * Math.PI) / 120) * 45}`,
              ).join(" ")}
              fill="none"
              stroke="white"
              opacity={1 - k * 0.3}
              strokeWidth="1.4"
            />
          ))}
          {Array.from({ length: 48 }, (_, j) => (
            <line
              key={j}
              x1={120 + j * 5}
              x2={120 + j * 5}
              y1={65 - Math.sin(j / 8) ** 2 * 20}
              y2={65 + Math.sin(j / 8) ** 2 * 20}
              stroke="white"
              opacity=".3"
            />
          ))}
        </svg>
        <aside>
          Complex numbers.
          <br />
          Real applications. A more
          <br />
          connected world.
        </aside>
        <div className="wr-tabs">
          {page.modes.map((v) => (
            <button
              key={v}
              aria-pressed={v === mode}
              onClick={() => changeMode(v)}
            >
              {v.toUpperCase()}
            </button>
          ))}
        </div>
      </header>
      <div className="wr-layout">
        <section className="wr-panel wr-controls">
          <header>
            <Settings />
            <h2>RLC in the plane</h2>
            <button aria-label="Reset circuit" onClick={reset}>
              <RotateCcw />
            </button>
          </header>
          <p>
            Adjust the circuit parameters and see the{" "}
            {signal
              ? "rotating phasor and its time-domain signal"
              : impedance
                ? "impedance represented in the complex plane"
                : "phasor representation"}
            .
          </p>
          <RangeField
            label="f  Frequency (Hz)"
            value={f}
            onChange={F}
            min={10}
            max={1000}
            step={1}
          />
          <RangeField
            label="L  Inductance (H)"
            value={l}
            onChange={L}
            min={0}
            max={1}
            color="#09b4d4"
            step={0.001}
          />
          <RangeField
            label="C  Capacitance (F)"
            detail="0 = capacitor bypassed"
            value={c}
            onChange={C}
            min={0}
            max={1}
            color="#9845ff"
            step={0.000001}
            precision={6}
          />
          <RangeField
            label="R  Resistance (Ω)"
            value={r}
            onChange={R}
            min={0}
            max={200}
            step={1}
            color="#ef4fc5"
          />
          <div className="wr-info">
            <Info />
            <p>{info}</p>
          </div>
        </section>
        <section className="wr-panel wr-figure">
          <header>
            <ChartNoAxesColumn />
            <h2>PHASOR DIAGRAM</h2>
            <span>
              {mode.toUpperCase()}
              {mode === "Phasors" ? " MODE" : ""}
            </span>
          </header>
          <div className={`wr-figure-body${signal ? " signal" : ""}`}>
            <svg
              className="wr-phasor"
              viewBox="0 0 480 440"
              role="img"
              aria-label={`${mode} phasor diagram`}
              data-mode-canvas={mode}
            >
              <defs>
                {["#101947", "#007aff", "#ef4fc5", "#a037ff", "#0db1d9"].map(
                  (color, k) => (
                    <marker
                      key={k}
                      id={`${id}-${k}`}
                      viewBox="0 0 10 10"
                      refX="8"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M0 0L10 5L0 10Z" fill={color} />
                    </marker>
                  ),
                )}
              </defs>
              {[0.25, 0.5, 0.75, 1].map((v) => (
                <circle
                  key={v}
                  cx={ox}
                  cy={oy}
                  r={185 * v}
                  fill="none"
                  stroke="#cbdfff"
                  strokeDasharray="3 3"
                />
              ))}
              <path
                d="M20 220H465M240 425V15"
                fill="none"
                stroke="#11194f"
                strokeWidth="1.8"
                markerEnd={`url(#${id}-0)`}
              />
              <text x="452" y="207">
                Re
              </text>
              <text x="248" y="18">
                Im (j)
              </text>
              {[-0.8, -0.4, 0.4, 0.8].map((v) => (
                <g key={v}>
                  <text x={px(v * extent)} y="241" textAnchor="middle">
                    {num(v * extent, 0)}
                  </text>
                  <text x="227" y={py(v * extent) + 4} textAnchor="end">
                    {num(v * extent, 0)}
                  </text>
                </g>
              ))}
              {!signal && (
                <>
                  <text x="150" y="37">
                    Inductive
                  </text>
                  <text x="170" y="54">
                    (+jX)
                  </text>
                  <text x="151" y="409">
                    Capacitive
                  </text>
                  <text x="172" y="427">
                    (−jX)
                  </text>
                </>
              )}
              <path
                d={`M${ox} ${oy}L${px(re)} ${py(im)}`}
                stroke="#087aff"
                strokeWidth="3.3"
                markerEnd={`url(#${id}-1)`}
              />
              <path
                d={`M${px(re)} ${py(im)}V${oy}M${px(re)} ${py(im)}H${ox}`}
                stroke="#849cd3"
                strokeDasharray="4 4"
                fill="none"
              />
              {!signal && (
                <>
                  <path
                    d={`M${ox} ${oy}H${px(r)}`}
                    stroke="#ef4fc5"
                    strokeWidth="2.8"
                    markerEnd={`url(#${id}-2)`}
                  />
                  {impedance && (
                    <path
                      d={`M${px(r)} ${oy}V${py(q.x)}`}
                      stroke="#0bb8dd"
                      strokeWidth="2.8"
                      markerEnd={`url(#${id}-4)`}
                    />
                  )}
                </>
              )}
              <path
                d={`M${ox + arcR} ${oy}A${arcR} ${arcR} 0 ${Math.abs(arcAngle % (2 * Math.PI)) > Math.PI ? 1 : 0} ${arcAngle < 0 ? 1 : 0} ${ex} ${ey}`}
                fill="none"
                stroke="#903bff"
                strokeWidth="2"
              />
              <text x={ox + 65} y={oy - 18} style={{ fill: "#8734ff" }}>
                φ = {q.phase === null ? "undefined" : `${num(deg)}°`}
              </text>
              <text
                x={Math.max(15, Math.min(340, px(re) + 8))}
                y={Math.max(35, py(im) - 12)}
                style={{ fill: "#087aff" }}
              >
                |Z| = {num(q.magnitude)} Ω
              </text>
              {ac && q.current !== null && (
                <>
                  <path
                    d={`M${ox} ${oy}L${ox + 65 * Math.cos(-phi)} ${oy - 65 * Math.sin(-phi)}`}
                    stroke="#ef4fc5"
                    strokeWidth="2.8"
                    markerEnd={`url(#${id}-2)`}
                  />
                  <text x="320" y="72" className="wr-lag">
                    Current{" "}
                    {q.x > 1e-8 ? "lags" : q.x < -1e-8 ? "leads" : "in phase"}
                  </text>
                </>
              )}
              {signal && <circle cx={px(re)} cy={oy} r="5" fill="#b13eff" />}
            </svg>
            {signal ? (
              <div className="wr-signal">
                <h3>Time-domain view (normalized)</h3>
                <svg
                  viewBox="0 0 340 290"
                  role="img"
                  aria-label="Voltage and current waveforms"
                >
                  {[55, 140, 225].map((v) => (
                    <line
                      key={v}
                      x1="35"
                      x2="310"
                      y1={v}
                      y2={v}
                      stroke="#d9e6fa"
                      strokeDasharray="3 3"
                    />
                  ))}
                  {[35, 104, 173, 241, 310].map((v) => (
                    <line
                      key={v}
                      x1={v}
                      x2={v}
                      y1="35"
                      y2="235"
                      stroke="#d9e6fa"
                      strokeDasharray="3 3"
                    />
                  ))}
                  <path d="M35 35V235H310" fill="none" stroke="#182450" />
                  <path
                    d={signalPath(false)}
                    fill="none"
                    stroke="#0088ff"
                    strokeWidth="2.5"
                  />
                  <path
                    d={signalPath(true)}
                    fill="none"
                    stroke="#c146ff"
                    strokeDasharray="6 5"
                    strokeWidth="2.5"
                  />
                  {["0", "T/4", "T/2", "3T/4", "T"].map((v, k) => (
                    <text
                      key={v}
                      x={35 + k * 68.75}
                      y="257"
                      textAnchor="middle"
                    >
                      {v}
                    </text>
                  ))}
                  {[1, 0, -1].map((v, k) => (
                    <text key={v} x="21" y={60 + k * 85}>
                      {v}
                    </text>
                  ))}
                  <text x="155" y="284">
                    time (s)
                  </text>
                </svg>
                <div className="wr-signal-legend">
                  <span>— V(t) / V₀</span>
                  <span>┄ I(t) / I₀</span>
                </div>
                <button onClick={() => P((v) => !v)}>
                  {playing ? <Pause /> : <Play />}
                  {playing ? "Pause rotation" : "Animate rotation"}
                </button>
                <small>T = {num(1 / f, 5)} s · displayed at slowed speed</small>
              </div>
            ) : (
              <aside className="wr-components">
                <section>
                  <h3>Components</h3>
                  {[
                    ["#ef4fc5", `R = ${num(r)} Ω`, "(along +Re)"],
                    ["#0bb8dd", `XL = ${num(q.xl)} Ω`, "(up, +j)"],
                    [
                      "#9845ff",
                      `XC = ${num(q.xc)} Ω`,
                      c === 0 ? "(bypassed)" : "(down, −j)",
                    ],
                    ["#087aff", `Z = ${num(q.magnitude)} Ω`, "(resultant)"],
                  ].map(([color, title, detail]) => (
                    <div key={title}>
                      <i style={{ color }}>➜</i>
                      <p>
                        {title}
                        <small>{detail}</small>
                      </p>
                    </div>
                  ))}
                </section>
                <section>
                  <h3>Impedance {impedance ? "" : "(rectangular)"}</h3>
                  {impedance && (
                    <MathExpression value={String.raw`Z=R+j(X_L-X_C)`} />
                  )}
                  <MathExpression value={rectangular} />
                </section>
                <section>
                  <h3>Polar form</h3>
                  <p>|Z| = {num(q.magnitude)} Ω</p>
                  <p>φ = {q.phase === null ? "undefined" : `${num(deg)}°`}</p>
                </section>
              </aside>
            )}
          </div>
          {signal && (
            <div className="wr-signal-note">
              The rotating phasor projects onto a sinusoid. The angle φ
              determines the voltage–current phase difference.
            </div>
          )}
          {q.magnitude === 0 && (
            <p role="status">
              Z = 0: ideal short circuit. Current for nonzero voltage is
              unbounded; phase and power factor are undefined.
            </p>
          )}
        </section>
        <div className="wr-right">
          <section className="wr-panel wr-quantities">
            <header>
              <ChartNoAxesColumn />
              <h2>Key Quantities</h2>
            </header>
            <div className="wr-values">
              {[
                [
                  "#02bedb",
                  "|Z|",
                  "Impedance magnitude",
                  `${num(q.magnitude)} Ω`,
                ],
                [
                  "#9d45ff",
                  "power factor",
                  "cos(φ)",
                  q.powerFactor === null
                    ? "undefined"
                    : q.powerFactor.toFixed(3),
                ],
                [
                  "#ffa000",
                  "φ",
                  "Phase angle",
                  q.phase === null ? "undefined" : `${num(deg)}°`,
                ],
              ].map(([color, symbol, label, value]) => (
                <div key={symbol}>
                  <i style={{ background: color }} />
                  <b>{symbol}</b>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </section>
          <section className="wr-panel wr-quiz">
            <header>
              <span>?</span>
              <h2>Concept check</h2>
            </header>
            <p>Power factor if φ = 0°?</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                check();
              }}
            >
              <input
                aria-label="Concept check answer"
                value={answer}
                onChange={(e) => A(e.target.value)}
                placeholder="1 or √2/2"
              />
              <button>Check</button>
            </form>
            {feedback && <p role="status">{feedback}</p>}
            <div className="wr-info">
              <Lightbulb />
              <p>
                <b>Hint:</b> Power factor is cos(φ).
              </p>
            </div>
          </section>
        </div>
      </div>
      <div className="wr-learning">
        {[
          [
            "Key Idea",
            impedance
              ? "Impedance is a complex number: Z = R + j(XL − XC). Resistance is the real part and reactance is the imaginary part."
              : ac
                ? "Voltage and current are phasors. Impedance determines the current magnitude and phase relative to voltage."
                : "A sinusoidal signal can be represented as a rotating vector. Its length gives amplitude and its angle gives phase.",
          ],
          [
            "Explore Next",
            "Try changing L, C, or f. Observe when current leads or lags voltage. At XL = XC, impedance is purely real.",
          ],
          [
            "Real-World Connection",
            "Phasors are widely used in power systems, communication and signal processing to analyze AC circuits and waves.",
          ],
        ].map(([title, copy], k) => {
          const Icon = [BookOpen, Rocket, Globe][k];
          return (
            <button key={title} onClick={() => Dialog(title)}>
              <header>
                <Icon />
                <b>{title}</b>
              </header>
              <p>{copy}</p>
            </button>
          );
        })}
        <Robot family="waves" onClick={() => Dialog("Ruhi")} />
      </div>
      <footer className="wr-footer">
        <Link to="/complex-numbers">
          <Planet />
          <b>Math Universe</b>
        </Link>
        <span>
          Explore · Visualize · Understand · Build a Brighter Tomorrow
        </span>
        <em>Aim Higher with Mathematics ✦</em>
      </footer>
      {dialog && (
        <section className="wr-dialog" role="dialog" aria-label={dialog}>
          <button onClick={() => Dialog("")}>Close</button>
          <h2>{dialog}</h2>
          <p>
            Change the sliders to explore impedance. C = 0 bypasses the
            capacitor. Positive reactance makes current lag voltage; negative
            reactance makes it lead. At resonance XL = XC, power factor is 1 if
            R is positive.
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
