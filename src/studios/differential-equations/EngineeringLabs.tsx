import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import MathExpression from "../../components/ui/MathExpression";
import {
  cauchyIndicial,
  cauchyValue,
  characteristic,
  classifySystem,
  homogeneousValue,
  newtonHalfLife,
  newtonTemperature,
  newtonTimeTo,
  oscillatorSample,
  secondOrderConstants,
  trajectory,
  undeterminedPresets,
  variationPresets,
} from "./engineeringMath";
import "./differentialEquations.css";

type Point = { x: number; y: number };

function samples(fn: (x: number) => number, x0: number, x1: number, count = 90): Point[] {
  return Array.from({ length: count + 1 }, (_, index) => {
    const x = x0 + (index / count) * (x1 - x0);
    return { x, y: fn(x) };
  });
}

function CurvePlot({ curves, label, xMin = -2, xMax = 4, yMin = -3, yMax = 3 }: { curves: Point[][]; label: string; xMin?: number; xMax?: number; yMin?: number; yMax?: number }) {
  const mapX = (x: number) => 24 + ((x - xMin) / (xMax - xMin)) * 312;
  const mapY = (y: number) => 176 - ((y - yMin) / (yMax - yMin)) * 156;
  return (
    <svg className="odes-plot" viewBox="0 0 360 200" role="img" aria-label={label}>
      <line x1={mapX(xMin)} y1={mapY(0)} x2={mapX(xMax)} y2={mapY(0)} stroke="currentColor" opacity="0.35" />
      <line x1={mapX(0)} y1={mapY(yMin)} x2={mapX(0)} y2={mapY(yMax)} stroke="currentColor" opacity="0.35" />
      {curves.map((curve, index) => {
        let open = false;
        const d = curve.map((point) => {
          if (!Number.isFinite(point.y) || point.y < yMin - 0.4 || point.y > yMax + 0.4) {
            open = false;
            return "";
          }
          const command = open ? "L" : "M";
          open = true;
          return `${command}${mapX(point.x).toFixed(1)},${mapY(point.y).toFixed(1)}`;
        }).join(" ");
        return <path key={index} d={d} fill="none" stroke={index === 0 ? "#0f766e" : "#b45309"} strokeWidth="2" />;
      })}
    </svg>
  );
}

function RootPlane({ real, imag, label }: { real: number[]; imag: number[]; label: string }) {
  const map = (value: number) => 90 + value * 22;
  return (
    <svg className="odes-plot" viewBox="0 0 180 160" role="img" aria-label={label}>
      <line x1="16" y1="80" x2="164" y2="80" stroke="currentColor" opacity="0.35" />
      <line x1="90" y1="12" x2="90" y2="148" stroke="currentColor" opacity="0.35" />
      <text x="148" y="74" fontSize="10">Re</text>
      <text x="94" y="18" fontSize="10">Im</text>
      {real.map((value, index) => (
        <circle key={index} cx={map(value)} cy={map(-(imag[index] ?? 0))} r="5" fill="#0f766e" />
      ))}
    </svg>
  );
}

export function HigherOrderLab() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);
  const [c, setC] = useState(1);
  const [y0, setY0] = useState(1);
  const [v0, setV0] = useState(0);
  const roots = characteristic(a, b, c);
  const constants = secondOrderConstants(a, b, c, y0, v0);
  const curve = useMemo(() => [samples((x) => homogeneousValue(a, b, c, y0, v0, x), -1, 3)], [a, b, c, y0, v0]);
  const real = roots.kind === "complex" ? [roots.alpha ?? 0, roots.alpha ?? 0] : [roots.r1 ?? 0, roots.r2 ?? roots.r1 ?? 0];
  const imag = roots.kind === "complex" ? [roots.beta ?? 0, -(roots.beta ?? 0)] : [0, 0];
  const form = roots.kind === "distinct"
    ? "y = C₁ e^{r₁ x} + C₂ e^{r₂ x}"
    : roots.kind === "repeated"
      ? "y = (C₁ + C₂ x) e^{r x}"
      : roots.kind === "complex"
        ? "y = e^{α x} (C₁ cos β x + C₂ sin β x)"
        : "Need a ≠ 0";
  return (
    <div className="odes-lab">
      <section className="odes-card">
        <h2>Characteristic roots</h2>
        <p><MathExpression value="a y'' + b y' + c y = 0" /></p>
        <label>a <input aria-label="Coefficient a" type="range" min={0.5} max={3} step={0.1} value={a} onChange={(event) => setA(Number(event.target.value))} /></label>
        <label>b <input aria-label="Coefficient b" type="range" min={-4} max={4} step={0.1} value={b} onChange={(event) => setB(Number(event.target.value))} /></label>
        <label>c <input aria-label="Coefficient c" type="range" min={-4} max={4} step={0.1} value={c} onChange={(event) => setC(Number(event.target.value))} /></label>
        <div className="odes-actions">
          <button type="button" onClick={() => { setA(1); setB(-3); setC(2); }}>Distinct roots</button>
          <button type="button" onClick={() => { setA(1); setB(-2); setC(1); }}>Repeated root</button>
          <button type="button" onClick={() => { setA(1); setB(0); setC(1); }}>Complex roots</button>
        </div>
        <p>Δ = b² − 4ac = {roots.discriminant.toFixed(3)}. Root type: {roots.kind}.</p>
        <RootPlane real={real} imag={imag} label="Characteristic roots in the complex plane" />
        <CurvePlot curves={curve} label="Solution through the chosen initial conditions" />
      </section>
      <aside className="odes-side">
        <h2>What the roots do</h2>
        <p><MathExpression value={form} /></p>
        <p>Through y(0) = {y0.toFixed(1)}, y'(0) = {v0.toFixed(1)}: C₁ = {constants.c1.toFixed(3)}, C₂ = {constants.c2.toFixed(3)}.</p>
        <label>y(0) <input aria-label="Initial value" type="range" min={-2} max={2} step={0.1} value={y0} onChange={(event) => setY0(Number(event.target.value))} /></label>
        <label>y'(0) <input aria-label="Initial derivative" type="range" min={-2} max={2} step={0.1} value={v0} onChange={(event) => setV0(Number(event.target.value))} /></label>
        {roots.kind === "complex" ? <p className="odes-note">α = {(roots.alpha ?? 0).toFixed(3)} sets growth or decay. β = {(roots.beta ?? 0).toFixed(3)} sets the oscillation frequency.</p> : null}
        {roots.kind === "repeated" ? <p className="odes-note">One exponential is not enough. The second independent solution is x times that exponential, which is why the family carries the factor (C₁ + C₂ x).</p> : null}
        <p className="odes-warn">Common mistake: adding two plain exponentials when the discriminant is zero. The second solution must be multiplied by x.</p>
        <p><Link to="/linear-algebra/eigenvectors">Eigenvalues use the same root idea for a matrix.</Link></p>
        <p><Link to="/differential-equations/mechanical-oscillations">A spring uses this equation.</Link> <Link to="/differential-equations/lcr-circuit">An LCR circuit uses the same form.</Link></p>
      </aside>
    </div>
  );
}

export function UndeterminedLab() {
  const [id, setId] = useState(undeterminedPresets[0].id);
  const [step, setStep] = useState(0);
  const preset = undeterminedPresets.find((item) => item.id === id) ?? undeterminedPresets[0];
  const curve = useMemo(() => [samples(preset.particular, -1, 2)], [preset]);
  return (
    <div className="odes-lab">
      <section className="odes-card">
        <h2>Choose the trial</h2>
        <label>Equation
          <select aria-label="Undetermined coefficient preset" value={id} onChange={(event) => { setId(event.target.value); setStep(0); }}>
            {undeterminedPresets.map((item) => <option key={item.id} value={item.id}>{item.equation}</option>)}
          </select>
        </label>
        <p><MathExpression value={preset.equation} /></p>
        <p>{preset.resonance ? "The forcing resonates with the complementary function, so the naive trial is multiplied by x." : "The forcing is not a solution of the homogeneous equation, so the naive trial is kept."}</p>
        <p>Trial: {preset.trial}</p>
        <CurvePlot curves={curve} label="Particular integral" xMin={-1} xMax={2} />
      </section>
      <aside className="odes-side">
        <h2>Coefficient match</h2>
        <ol>{preset.steps.slice(0, step + 1).map((item) => <li key={item}>{item}</li>)}</ol>
        <div className="odes-actions">
          <button type="button" onClick={() => setStep((value) => Math.max(0, value - 1))}>Previous</button>
          <button type="button" onClick={() => setStep((value) => Math.min(preset.steps.length - 1, value + 1))}>Next</button>
        </div>
        <p><MathExpression value={preset.general} /></p>
      </aside>
    </div>
  );
}

export function VariationLab() {
  const [id, setId] = useState(variationPresets[0].id);
  const preset = variationPresets.find((item) => item.id === id) ?? variationPresets[0];
  const curves = useMemo(() => [
    samples(preset.y1Value, 0.2, 1.2),
    samples(preset.wronskianValue, 0.2, 1.2),
  ], [preset]);
  return (
    <div className="odes-lab">
      <section className="odes-card">
        <h2>Wronskian</h2>
        <label>Preset
          <select aria-label="Variation preset" value={id} onChange={(event) => setId(event.target.value)}>
            {variationPresets.map((item) => <option key={item.id} value={item.id}>{item.equation}</option>)}
          </select>
        </label>
        <p>y₁ = {preset.y1}, y₂ = {preset.y2}, W = {preset.wronskian}</p>
        <CurvePlot curves={curves} label="First fundamental solution and Wronskian" xMin={0.2} xMax={1.2} yMin={-2.5} yMax={2.5} />
        <p className="odes-note">Teal is y₁. Amber is W. A zero Wronskian would mean the two solutions are not independent.</p>
      </section>
      <aside className="odes-side">
        <h2>Build u₁ and u₂</h2>
        <ol>{preset.steps.map((step) => <li key={step}>{step}</li>)}</ol>
        <p className="odes-warn">Common mistake: dividing by W before checking that y₁ and y₂ are independent on the interval.</p>
      </aside>
    </div>
  );
}

export function CauchyEulerLab() {
  const presets = [
    { id: "repeat", label: "x² y'' − 3x y' + 4y = 0", a: 1, b: -3, c: 4 },
    { id: "real", label: "x² y'' + x y' − y = 0", a: 1, b: 1, c: -1 },
    { id: "complex", label: "x² y'' + x y' + y = 0", a: 1, b: 1, c: 1 },
  ];
  const [id, setId] = useState(presets[0].id);
  const [c1, setC1] = useState(1);
  const [c2, setC2] = useState(0.4);
  const preset = presets.find((item) => item.id === id) ?? presets[0];
  const roots = cauchyIndicial(preset.a, preset.b, preset.c);
  const curve = useMemo(() => [samples((x) => cauchyValue(preset.a, preset.b, preset.c, c1, c2, x), 0.2, 4)], [preset, c1, c2]);
  const form = roots.kind === "repeated"
    ? "y = (C₁ + C₂ ln x) x^m"
    : roots.kind === "complex"
      ? "y = x^α (C₁ cos(β ln x) + C₂ sin(β ln x))"
      : "y = C₁ x^{m₁} + C₂ x^{m₂}";
  return (
    <div className="odes-lab">
      <section className="odes-card">
        <h2>Indicial equation</h2>
        <label>Preset
          <select aria-label="Cauchy Euler preset" value={id} onChange={(event) => setId(event.target.value)}>
            {presets.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </label>
        <p>Assume y = x^m for x &gt; 0. Then the first derivative is m times x to the power m−1, and the second is m(m−1) times x to the power m−2.</p>
        <p>The indicial equation is a m(m−1) + b m + c = 0. Here the root type is {roots.kind}.</p>
        <label>C₁ <input aria-label="Cauchy constant one" type="range" min={-1} max={2} step={0.1} value={c1} onChange={(event) => setC1(Number(event.target.value))} /></label>
        <label>C₂ <input aria-label="Cauchy constant two" type="range" min={-1} max={2} step={0.1} value={c2} onChange={(event) => setC2(Number(event.target.value))} /></label>
        <CurvePlot curves={curve} label="Cauchy Euler solution for positive x" xMin={0.2} xMax={4} />
      </section>
      <aside className="odes-side">
        <h2>Log substitution</h2>
        <p><MathExpression value={form} /></p>
        <p className="odes-note">Set t = ln x, so x = e^t and the equation in t has constant coefficients. That substitution needs x &gt; 0.</p>
        <p className="odes-warn">Common mistake: plotting the logarithm through x = 0 or using x^m for a negative base when m is not an integer.</p>
      </aside>
    </div>
  );
}

const systemPresets = [
  { id: "node", label: "Stable node", a: -2, b: 0, c: 0, d: -1 },
  { id: "saddle", label: "Saddle", a: 1, b: 0, c: 0, d: -1 },
  { id: "center", label: "Center", a: 0, b: 1, c: -1, d: 0 },
  { id: "spiral", label: "Stable spiral", a: -1, b: -1, c: 1, d: -1 },
];

function Portrait({ a, b, c, d, starts }: { a: number; b: number; c: number; d: number; starts: Array<[number, number]> }) {
  const info = classifySystem(a, b, c, d);
  const map = (value: number) => 180 + value * 42;
  const arrows = [];
  for (let i = -3; i <= 3; i += 1) {
    for (let j = -3; j <= 3; j += 1) {
      const vx = a * i + b * j;
      const vy = c * i + d * j;
      const scale = 14 / Math.max(1.2, Math.hypot(vx, vy));
      arrows.push([i, j, vx * scale / 42, vy * scale / 42]);
    }
  }
  const paths = starts.map((start) => trajectory(a, b, c, d, start[0], start[1]));
  return (
    <svg className="odes-plot" viewBox="0 0 360 220" role="img" aria-label={`Phase portrait, ${info.label}`}>
      <line x1="20" y1={map(0)} x2="340" y2={map(0)} stroke="currentColor" opacity="0.3" />
      <line x1={map(0)} y1="16" x2={map(0)} y2="204" stroke="currentColor" opacity="0.3" />
      {arrows.map((arrow) => (
        <line key={`${arrow[0]}-${arrow[1]}`} x1={map(arrow[0])} y1={map(-arrow[1])} x2={map(arrow[0] + arrow[2])} y2={map(-(arrow[1] + arrow[3]))} stroke="#64748b" strokeWidth="1" />
      ))}
      {info.vectors.map((vector, index) => (
        <line key={index} x1={map(-vector[0] * 3)} y1={map(vector[1] * 3)} x2={map(vector[0] * 3)} y2={map(-vector[1] * 3)} stroke="#b45309" strokeDasharray="4 3" />
      ))}
      {paths.map((path, index) => (
        <polyline key={index} fill="none" stroke="#0f766e" strokeWidth="2" points={path.map((point) => `${map(point.x)},${map(-point.y)}`).join(" ")} />
      ))}
    </svg>
  );
}

export function SystemsLab() {
  const [id, setId] = useState(systemPresets[0].id);
  const preset = systemPresets.find((item) => item.id === id) ?? systemPresets[0];
  const info = classifySystem(preset.a, preset.b, preset.c, preset.d);
  return (
    <div className="odes-lab">
      <section className="odes-card">
        <h2>X' = A X</h2>
        <label>Preset
          <select aria-label="Linear system preset" value={id} onChange={(event) => setId(event.target.value)}>
            {systemPresets.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </label>
        <p>A = [[{preset.a}, {preset.b}], [{preset.c}, {preset.d}]]. Equilibrium at the origin.</p>
        <Portrait a={preset.a} b={preset.b} c={preset.c} d={preset.d} starts={[[1, 0.4], [-0.8, 1]]} />
      </section>
      <aside className="odes-side">
        <h2>{info.label}</h2>
        <ul>
          <li>Trace {info.trace.toFixed(2)}</li>
          <li>Determinant {info.determinant.toFixed(2)}</li>
          <li>Discriminant {info.discriminant.toFixed(2)}</li>
          <li>Eigenvalues {info.lambda1.toFixed(2)}{info.beta ? ` ± ${info.beta.toFixed(2)} i` : `, ${info.lambda2.toFixed(2)}`}</li>
        </ul>
        <p className="odes-note">Amber dashed lines are eigenvector directions when the eigenvalues are real. Teal curves are trajectories.</p>
        <p><Link to="/linear-algebra/eigenvectors">Open the eigenvector lab for the same matrix idea.</Link></p>
        <p><Link to="/differential-equations/phase-plane">Drag an initial condition on the phase plane.</Link></p>
      </aside>
    </div>
  );
}

export function PhasePlaneLab() {
  const [presetId, setPresetId] = useState("spiral");
  const [start, setStart] = useState<[number, number]>([1.2, 0.4]);
  const [showField, setShowField] = useState(true);
  const preset = systemPresets.find((item) => item.id === presetId) ?? systemPresets[2];
  const info = classifySystem(preset.a, preset.b, preset.c, preset.d);
  const map = (value: number) => 180 + value * 42;
  const unmap = (pixel: number) => (pixel - 180) / 42;
  const path = useMemo(() => trajectory(preset.a, preset.b, preset.c, preset.d, start[0], start[1], 120, 0.06), [preset, start]);
  return (
    <div className="odes-lab">
      <section className="odes-card">
        <h2>Click an initial condition</h2>
        <label>Preset
          <select aria-label="Phase plane preset" value={presetId} onChange={(event) => setPresetId(event.target.value)}>
            {systemPresets.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </label>
        <label><input type="checkbox" checked={showField} onChange={(event) => setShowField(event.target.checked)} /> Vector field</label>
        <svg className="odes-plot" viewBox="0 0 360 220" role="img" aria-label="Interactive phase plane"
          onClick={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 360;
            const y = ((event.clientY - rect.top) / rect.height) * 220;
            setStart([unmap(x), -unmap(y)]);
          }}>
          <line x1="20" y1={map(0)} x2="340" y2={map(0)} stroke="currentColor" opacity="0.3" />
          <line x1={map(0)} y1="16" x2={map(0)} y2="204" stroke="currentColor" opacity="0.3" />
          {showField ? [-3, -2, -1, 0, 1, 2, 3].flatMap((i) => [-3, -2, -1, 0, 1, 2, 3].map((j) => {
            const vx = preset.a * i + preset.b * j;
            const vy = preset.c * i + preset.d * j;
            const scale = 12 / Math.max(1.2, Math.hypot(vx, vy));
            return <line key={`${i}${j}`} x1={map(i)} y1={map(-j)} x2={map(i + (vx * scale) / 42)} y2={map(-(j + (vy * scale) / 42))} stroke="#64748b" />;
          })) : null}
          <polyline fill="none" stroke="#0f766e" strokeWidth="2" points={path.map((point) => `${map(point.x)},${map(-point.y)}`).join(" ")} />
          <circle cx={map(start[0])} cy={map(-start[1])} r="5" fill="#b45309" />
        </svg>
      </section>
      <aside className="odes-side">
        <h2>{info.label}</h2>
        <p>Initial point ({start[0].toFixed(2)}, {start[1].toFixed(2)}). The arrow of time follows X' = A X.</p>
        <p className="odes-note">Nullclines are the lines where one component of the vector field vanishes. For these diagonal and rotation examples they are the axes or the eigenvector lines.</p>
      </aside>
    </div>
  );
}

export function MechanicalLab() {
  const [mass, setMass] = useState(1);
  const [damping, setDamping] = useState(0.4);
  const [stiffness, setStiffness] = useState(4);
  const [x0, setX0] = useState(1);
  const [v0, setV0] = useState(0);
  const [time, setTime] = useState(1.2);
  const [forced, setForced] = useState(false);
  const sample = oscillatorSample(mass, damping, stiffness, x0, v0, time, forced ? 1 : 0, 1.2);
  const curve = useMemo(() => [samples((t) => oscillatorSample(mass, damping, stiffness, x0, v0, t, forced ? 1 : 0, 1.2).x, 0, 8)], [mass, damping, stiffness, x0, v0, forced]);
  const offset = 160 + Math.max(-70, Math.min(70, sample.x * 36));
  return (
    <div className="odes-lab">
      <section className="odes-card">
        <h2>Spring and mass</h2>
        <svg className="odes-plot" viewBox="0 0 360 120" role="img" aria-label="Spring mass animation">
          <line x1="30" y1="20" x2="30" y2="100" stroke="currentColor" />
          <path d={`M30 60 L50 60 L58 42 L74 78 L90 42 L106 78 L122 60 L${offset} 60`} fill="none" stroke="#0f766e" strokeWidth="2" />
          <rect x={offset} y="42" width="36" height="36" fill="#b45309" />
        </svg>
        <CurvePlot curves={curve} label="Displacement versus time" xMin={0} xMax={8} yMin={-2} yMax={2} />
        <label>Time <input aria-label="Oscillator time" type="range" min={0} max={8} step={0.05} value={time} onChange={(event) => setTime(Number(event.target.value))} /></label>
      </section>
      <aside className="odes-side">
        <h2>{sample.kind}</h2>
        <p>ωₙ = {sample.omega.toFixed(3)}, ζ = {sample.zeta.toFixed(3)}. {sample.zeta < 1 ? "ζ < 1 underdamped." : sample.kind === "critical" ? "ζ = 1 critical." : "ζ > 1 overdamped."}</p>
        <label>Mass <input aria-label="Mass" type="range" min={0.4} max={2} step={0.1} value={mass} onChange={(event) => setMass(Number(event.target.value))} /></label>
        <label>Damping <input aria-label="Damping" type="range" min={0} max={6} step={0.1} value={damping} onChange={(event) => setDamping(Number(event.target.value))} /></label>
        <label>Stiffness <input aria-label="Stiffness" type="range" min={1} max={8} step={0.1} value={stiffness} onChange={(event) => setStiffness(Number(event.target.value))} /></label>
        <label>x(0) <input aria-label="Initial displacement" type="range" min={-1.5} max={1.5} step={0.1} value={x0} onChange={(event) => setX0(Number(event.target.value))} /></label>
        <label>v(0) <input aria-label="Initial velocity" type="range" min={-2} max={2} step={0.1} value={v0} onChange={(event) => setV0(Number(event.target.value))} /></label>
        <label><input type="checkbox" checked={forced} onChange={(event) => setForced(event.target.checked)} /> Add F = cos(1.2 t)</label>
        <p>x({time.toFixed(2)}) = {sample.x.toFixed(3)}, v = {sample.v.toFixed(3)}</p>
        <p><Link to="/differential-equations/higher-order-linear">The same roots classify the free motion.</Link></p>
      </aside>
    </div>
  );
}

export function LcrLab() {
  const [resistance, setResistance] = useState(2);
  const [inductance, setInductance] = useState(1);
  const [capacitance, setCapacitance] = useState(0.25);
  const [time, setTime] = useState(1);
  const stiffness = 1 / capacitance;
  const sample = oscillatorSample(inductance, resistance, stiffness, 1, 0, time);
  const charge = useMemo(() => [samples((t) => oscillatorSample(inductance, resistance, stiffness, 1, 0, t).x, 0, 8)], [inductance, resistance, stiffness]);
  return (
    <div className="odes-lab">
      <section className="odes-card">
        <h2>Series RLC</h2>
        <svg className="odes-plot" viewBox="0 0 360 90" role="img" aria-label="Series RLC schematic">
          <rect x="40" y="30" width="50" height="24" fill="none" stroke="currentColor" />
          <text x="52" y="46" fontSize="12">R</text>
          <path d="M100 42 h20 l6 -10 l12 20 l12 -20 l12 20 l12 -20 l6 10 h16" fill="none" stroke="currentColor" />
          <path d="M210 30 v24 M226 30 v24" fill="none" stroke="currentColor" />
          <text x="214" y="24" fontSize="12">C</text>
          <path d="M250 42 H320 V70 H40 V42" fill="none" stroke="currentColor" />
        </svg>
        <p><MathExpression value="L q'' + R q' + q/C = 0" /></p>
        <CurvePlot curves={charge} label="Charge versus time" xMin={0} xMax={8} yMin={-1.5} yMax={1.5} />
        <label>Time <input aria-label="Circuit time" type="range" min={0} max={8} step={0.05} value={time} onChange={(event) => setTime(Number(event.target.value))} /></label>
      </section>
      <aside className="odes-side">
        <h2>Same second-order pattern</h2>
        <p>Mass ↔ L, damping ↔ R, stiffness ↔ 1/C. ζ = {sample.zeta.toFixed(3)}, ωₙ = {sample.omega.toFixed(3)}.</p>
        <p>q = {sample.x.toFixed(3)}, current i = q' = {sample.v.toFixed(3)}.</p>
        <label>R <input aria-label="Resistance" type="range" min={0} max={8} step={0.1} value={resistance} onChange={(event) => setResistance(Number(event.target.value))} /></label>
        <label>L <input aria-label="Inductance" type="range" min={0.4} max={2} step={0.1} value={inductance} onChange={(event) => setInductance(Number(event.target.value))} /></label>
        <label>C <input aria-label="Capacitance" type="range" min={0.08} max={1} step={0.02} value={capacitance} onChange={(event) => setCapacitance(Number(event.target.value))} /></label>
        <p className="odes-note">Behavior: {sample.kind}. Compare with the spring by matching ζ.</p>
        <p><Link to="/differential-equations/mechanical-oscillations">Open the mechanical twin of this circuit.</Link></p>
      </aside>
    </div>
  );
}

export function NewtonCoolingLab() {
  const [initial, setInitial] = useState(90);
  const [ambient, setAmbient] = useState(22);
  const [k, setK] = useState(0.3);
  const [time, setTime] = useState(2);
  const temperature = newtonTemperature(initial, ambient, k, time);
  const curve = useMemo(() => [samples((t) => newtonTemperature(initial, ambient, k, t), 0, 12)], [initial, ambient, k]);
  const height = 20 + ((temperature - 0) / 120) * 70;
  const threshold = ambient + (initial - ambient) / 2;
  return (
    <div className="odes-lab">
      <section className="odes-card">
        <h2>Temperature gap</h2>
        <svg className="odes-plot" viewBox="0 0 120 140" role="img" aria-label="Thermometer">
          <rect x="48" y="16" width="18" height="90" rx="9" fill="none" stroke="currentColor" />
          <rect x="52" y={106 - height} width="10" height={height} fill={temperature > ambient ? "#b45309" : "#0f766e"} />
          <circle cx="57" cy="112" r="14" fill={temperature > ambient ? "#b45309" : "#0f766e"} />
        </svg>
        <CurvePlot curves={curve} label="Temperature versus time" xMin={0} xMax={12} yMin={0} yMax={120} />
        <label>Time <input aria-label="Cooling time" type="range" min={0} max={12} step={0.1} value={time} onChange={(event) => setTime(Number(event.target.value))} /></label>
      </section>
      <aside className="odes-side">
        <h2>{temperature >= ambient ? "Cooling or steady" : "Warming toward the room"}</h2>
        <p>Temperature is {temperature.toFixed(2)}. The gap to the room decays by the factor e to the power −kt.</p>
        <p>Half-gap time: {Number.isFinite(newtonHalfLife(k)) ? newtonHalfLife(k).toFixed(2) : "—"}. Time to the midpoint {threshold.toFixed(1)}: {newtonTimeTo(initial, ambient, k, threshold).toFixed(2)}.</p>
        <label>Initial <input aria-label="Initial temperature" type="range" min={0} max={100} step={1} value={initial} onChange={(event) => setInitial(Number(event.target.value))} /></label>
        <label>Ambient <input aria-label="Ambient temperature" type="range" min={0} max={40} step={1} value={ambient} onChange={(event) => setAmbient(Number(event.target.value))} /></label>
        <label>k <input aria-label="Cooling constant" type="range" min={0.05} max={1.2} step={0.05} value={k} onChange={(event) => setK(Number(event.target.value))} /></label>
        <p className="odes-note">If the object starts below the room, the same equation heats it. The gap still shrinks exponentially.</p>
        <p><Link to="/differential-equations/separable">This is the separable equation dT/dt = −k(T − Tₐ).</Link></p>
      </aside>
    </div>
  );
}
