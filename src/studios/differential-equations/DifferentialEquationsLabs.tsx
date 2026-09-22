import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import MathExpression from "../../components/ui/MathExpression";
import CalculusDifferentialEquationsStudio from "../../pages/CalculusDifferentialEquationsStudio";
import type { StudioMockupPage } from "../mockup/studioMockupCatalog";
import {
  bernoulliCases,
  compareMethods,
  contourSegments,
  exactPresets,
  explorerExamples,
  homogeneousPresets,
  applicableMethods,
  integrateField,
  linearPresets,
  methodLabels,
  methodPresets,
  type MethodId,
} from "./firstOrderMath";
import {
  CauchyEulerLab,
  HigherOrderLab,
  LcrLab,
  MechanicalLab,
  NewtonCoolingLab,
  PhasePlaneLab,
  SystemsLab,
  UndeterminedLab,
  VariationLab,
} from "./EngineeringLabs";
import "./differentialEquations.css";

const embedded: Record<string, string> = {
  "slope-fields": "slope",
  "initial-value": "ivp",
  separable: "separable",
  "growth-models": "growth",
  euler: "euler",
  rk4: "rk4",
};

export default function DifferentialEquationsLab({ page }: { page: StudioMockupPage }) {
  const mode = embedded[page.id];
  if (mode) return <CalculusDifferentialEquationsStudio mode={mode} />;
  if (page.id === "explorer") return <ExplorerLab />;
  if (page.id === "method-selector") return <MethodSelectorLab />;
  if (page.id === "homogeneous-first-order") return <HomogeneousLab />;
  if (page.id === "exact") return <ExactLab />;
  if (page.id === "linear-first-order") return <LinearLab />;
  if (page.id === "bernoulli") return <BernoulliLab />;
  if (page.id === "heun") return <HeunLab />;
  if (page.id === "higher-order-linear") return <HigherOrderLab />;
  if (page.id === "undetermined-coefficients") return <UndeterminedLab />;
  if (page.id === "variation-of-parameters") return <VariationLab />;
  if (page.id === "cauchy-euler") return <CauchyEulerLab />;
  if (page.id === "systems") return <SystemsLab />;
  if (page.id === "phase-plane") return <PhasePlaneLab />;
  if (page.id === "mechanical-oscillations") return <MechanicalLab />;
  if (page.id === "lcr-circuit") return <LcrLab />;
  if (page.id === "newton-cooling") return <NewtonCoolingLab />;
  return null;
}

const plotColors = ["#0f766e", "#b45309", "#1d4ed8", "#7c3aed"];

function Plot({
  curves,
  segments,
  label,
}: {
  curves?: Array<Array<{ x: number; y: number }>>;
  segments?: Array<[number, number, number, number]>;
  label: string;
}) {
  const mapX = (x: number) => 28 + ((x + 3) / 6) * 300;
  const mapY = (y: number) => 188 - ((y + 3) / 6) * 160;
  return (
    <svg className="odes-plot" viewBox="0 0 360 210" role="img" aria-label={label}>
      <line x1="28" y1="108" x2="332" y2="108" stroke="currentColor" opacity="0.35" />
      <line x1="180" y1="16" x2="180" y2="196" stroke="currentColor" opacity="0.35" />
      {segments?.map((segment, index) => (
        <line key={index} x1={mapX(segment[0])} y1={mapY(segment[1])} x2={mapX(segment[2])} y2={mapY(segment[3])} stroke="#0f766e" strokeWidth="1.4" />
      ))}
      {curves?.map((curve, index) => (
        <polyline
          key={index}
          fill="none"
          stroke={plotColors[index % plotColors.length]}
          strokeWidth="2"
          points={curve.filter((point) => Math.abs(point.y) < 3.2).map((point) => `${mapX(point.x)},${mapY(point.y)}`).join(" ")}
        />
      ))}
    </svg>
  );
}

function ExplorerLab() {
  const [id, setId] = useState(explorerExamples[0].id);
  const example = explorerExamples.find((item) => item.id === id) ?? explorerExamples[0];
  const curves = example.field ? [0.5, 1.5].map((y0) => integrateField(example.field!, 0.2, y0, 2.6)) : [];
  return (
    <div className="odes-lab">
      <section className="odes-card">
        <h2>Equation explorer</h2>
        <label>Example
          <select aria-label="Differential equation example" value={id} onChange={(event) => setId(event.target.value)}>
            {explorerExamples.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </label>
        <p><MathExpression value={example.equation} /></p>
        {example.field ? <Plot curves={curves} label={`Sample solution curves for ${example.equation}`} /> : <p className="odes-note">This equation is second order, so one slope field is not enough. The family needs two constants.</p>}
      </section>
      <aside className="odes-side">
        <h2>Classification</h2>
        <ul>
          <li>Order {example.order}</li>
          <li>Degree {example.degree}</li>
          <li>{example.linear}</li>
          <li>{example.kind} differential equation</li>
          <li>{example.autonomous}</li>
          <li>{example.balance}</li>
        </ul>
        <p><strong>Known now.</strong> {example.known}</p>
        <p><strong>A solution means.</strong> {example.meaning}</p>
        <p><strong>Family.</strong> {example.family}</p>
        <p><strong>Particular solution.</strong> {example.particular}</p>
      </aside>
    </div>
  );
}

function MethodSelectorLab() {
  const [id, setId] = useState(methodPresets[0].id);
  const [guess, setGuess] = useState<MethodId | null>(null);
  const preset = methodPresets.find((item) => item.id === id) ?? methodPresets[0];
  const applicable = applicableMethods(preset);
  const correct = guess != null && applicable.includes(guess);
  return (
    <div className="odes-lab">
      <section className="odes-card">
        <h2>Choose a method</h2>
        <label>Equation
          <select aria-label="Equation preset" value={id} onChange={(event) => { setId(event.target.value); setGuess(null); }}>
            {methodPresets.map((item) => <option key={item.id} value={item.id}>{item.equation}</option>)}
          </select>
        </label>
        <p><MathExpression value={preset.equation} /></p>
        <div className="odes-choice" role="group" aria-label="Method guess">
          {(Object.keys(methodLabels) as MethodId[]).map((method) => (
            <button key={method} type="button" aria-pressed={guess === method} onClick={() => setGuess(method)}>{methodLabels[method]}</button>
          ))}
        </div>
      </section>
      <aside className="odes-side">
        <h2>Diagnostic</h2>
        {guess == null ? <p>Inspect the structure, then choose a method. The test stays hidden until you answer.</p> : (
          <>
            <p className={correct ? "odes-note" : "odes-warn"}>{correct ? "That method applies." : "That method does not fit this structure."}</p>
            <p><strong>Applicable methods.</strong> {applicable.map((method) => methodLabels[method]).join(", ")}.</p>
            {applicable.length > 1 ? <p>More than one method is valid. Either one can start the solution.</p> : null}
            <p><strong>Test.</strong> {preset.test}</p>
            <p><strong>Rewrite.</strong> {preset.rewrite}</p>
            <p><Link to={preset.lab}>Open the {methodLabels[preset.method]} lab</Link></p>
          </>
        )}
      </aside>
    </div>
  );
}

function HomogeneousLab() {
  const [id, setId] = useState(homogeneousPresets[0].id);
  const [step, setStep] = useState(0);
  const preset = homogeneousPresets.find((item) => item.id === id) ?? homogeneousPresets[0];
  const curves = useMemo(() => [0.6, 1.2, -0.8].map((y0) => integrateField(preset.field, 0.4, y0, 2.8)), [preset]);
  return (
    <div className="odes-lab">
      <section className="odes-card">
        <h2>Homogeneous first-order</h2>
        <label>Preset
          <select aria-label="Homogeneous preset" value={id} onChange={(event) => { setId(event.target.value); setStep(0); }}>
            {homogeneousPresets.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </label>
        <p><MathExpression value={preset.label} /></p>
        <Plot curves={curves} label="Solution curves of the homogeneous equation" />
        <p className="odes-note">Why v = y/x works: scaling (x, y) by the same factor does not change the slope, so the direction depends only on the ray.</p>
        <p className="odes-warn">Common mistake: this is not the same “homogeneous” as y'' + p y' + q y = 0. Here it means the slope depends only on y/x.</p>
      </section>
      <aside className="odes-side">
        <h2>Substitution steps</h2>
        <p>{preset.closedForm}</p>
        <ol className="odes-steps">{preset.steps.slice(0, step + 1).map((item) => <li key={item}>{item}</li>)}</ol>
        <div className="odes-actions">
          <button type="button" onClick={() => setStep((value) => Math.max(0, value - 1))}>Previous step</button>
          <button type="button" onClick={() => setStep((value) => Math.min(preset.steps.length - 1, value + 1))}>Next step</button>
          <button type="button" onClick={() => setStep(0)}>Reset steps</button>
        </div>
      </aside>
    </div>
  );
}

function ExactLab() {
  const [id, setId] = useState(exactPresets[0].id);
  const [level, setLevel] = useState(2);
  const preset = exactPresets.find((item) => item.id === id) ?? exactPresets[0];
  const segments = preset.exact ? contourSegments(preset.field, level) : [];
  return (
    <div className="odes-lab">
      <section className="odes-card">
        <h2>Exactness</h2>
        <label>Preset
          <select aria-label="Exact equation preset" value={id} onChange={(event) => setId(event.target.value)}>
            {exactPresets.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </label>
        <p>M = <MathExpression value={preset.m} /> and N = <MathExpression value={preset.n} /></p>
        <p>∂M/∂y = <MathExpression value={preset.my} /> and ∂N/∂x = <MathExpression value={preset.nx} /></p>
        <p className={preset.exact ? "odes-note" : "odes-warn"}>{preset.exact ? "The partial derivatives agree, so a potential function exists." : "The partial derivatives disagree, so the equation is not exact."}</p>
        {preset.exact ? (
          <>
            <label>Level C
              <input aria-label="Potential level" type="range" min={0.5} max={6} step={0.1} value={level} onChange={(event) => setLevel(Number(event.target.value))} />
            </label>
            <Plot segments={segments} label={`Level curve of the potential at C = ${level.toFixed(1)}`} />
            <p className="odes-note">Solution curves are contours of F. Moving along a contour keeps F constant, so dF = 0.</p>
          </>
        ) : null}
      </section>
      <aside className="odes-side">
        <h2>{preset.exact ? "Build F" : "Stop here"}</h2>
        <ol>{preset.steps.map((step) => <li key={step}>{step}</li>)}</ol>
        {preset.potential ? <p><MathExpression value={preset.potential} /></p> : null}
        <p className="odes-warn">Common mistake: matching ∂F/∂y to M instead of N, or treating unequal partials as exact.</p>
      </aside>
    </div>
  );
}

function LinearLab() {
  const [id, setId] = useState(linearPresets[0].id);
  const [x0, setX0] = useState(0);
  const [y0, setY0] = useState(1);
  const preset = linearPresets.find((item) => item.id === id) ?? linearPresets[0];
  const singular = preset.id === "xsq" || preset.id === "power";
  const safeX0 = singular ? Math.max(0.4, x0) : x0;
  const constant = preset.constantFromPoint(safeX0, y0);
  const curve = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 80; i += 1) {
      const x = (singular ? 0.35 : -1.2) + (i / 80) * (singular ? 2.6 : 3.4);
      const y = preset.solution(x, constant);
      if (Number.isFinite(y) && Math.abs(y) < 8) points.push({ x, y });
    }
    return [points];
  }, [constant, preset, singular]);
  return (
    <div className="odes-lab">
      <section className="odes-card">
        <h2>Integrating factor</h2>
        <label>Preset
          <select aria-label="Linear equation preset" value={id} onChange={(event) => setId(event.target.value)}>
            {linearPresets.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </label>
        <p>{preset.standard}</p>
        <p>P(x) = <MathExpression value={preset.p} />, Q(x) = <MathExpression value={preset.q} /></p>
        <p>IF = <MathExpression value={preset.integratingFactor} /></p>
        <label>Initial x₀
          <input aria-label="Initial x" type="range" min={singular ? 0.4 : -1} max={2} step={0.1} value={safeX0} onChange={(event) => setX0(Number(event.target.value))} />
        </label>
        <label>Initial y₀
          <input aria-label="Initial y" type="range" min={-1} max={3} step={0.1} value={y0} onChange={(event) => setY0(Number(event.target.value))} />
        </label>
        <p>Through ({safeX0.toFixed(1)}, {y0.toFixed(1)}), C = {Number.isFinite(constant) ? constant.toFixed(3) : "undefined"}.</p>
        <Plot curves={curve} label="Solution curve through the chosen initial condition" />
      </section>
      <aside className="odes-side">
        <h2>From standard form to y</h2>
        <ol>{preset.steps.map((step) => <li key={step}>{step}</li>)}</ol>
        <p className="odes-note">{preset.note}</p>
        <p className="odes-note">The integrating factor makes the left side the derivative of IF · y.</p>
        <p className="odes-warn">Common mistake: multiplying by the integrating factor before the equation is in standard form dy/dx + P(x)y = Q(x).</p>
        <p><Link to="/differential-equations/newton-cooling">Newton cooling is this equation with a constant room temperature.</Link></p>
      </aside>
    </div>
  );
}

function BernoulliLab() {
  const [index, setIndex] = useState(2);
  const [constant, setConstant] = useState(1);
  const item = bernoulliCases[index] ?? bernoulliCases[2];
  const curve = item.solution ? [Array.from({ length: 70 }, (_, i) => {
    const x = -1 + (i / 69) * 2.4;
    return { x, y: item.solution!(x, constant) };
  }).filter((point) => Number.isFinite(point.y) && Math.abs(point.y) < 8)] : [];
  return (
    <div className="odes-lab">
      <section className="odes-card">
        <h2>Bernoulli substitution</h2>
        <label>Exponent n
          <select aria-label="Bernoulli exponent" value={item.n} onChange={(event) => setIndex(bernoulliCases.findIndex((entry) => entry.n === Number(event.target.value)))}>
            {bernoulliCases.map((entry) => <option key={entry.n} value={entry.n}>n = {entry.n}</option>)}
          </select>
        </label>
        <p>{item.title}</p>
        <p><MathExpression value={item.equation} /></p>
        {item.n === 2 ? (
          <label>Constant C
            <input aria-label="Bernoulli constant" type="range" min={-1} max={2} step={0.1} value={constant} onChange={(event) => setConstant(Number(event.target.value))} />
          </label>
        ) : null}
        {curve.length ? <Plot curves={curve} label="Bernoulli solution curve" /> : null}
      </section>
      <aside className="odes-side">
        <h2>Transformation</h2>
        <ol>{item.steps.map((step) => <li key={step}>{step}</li>)}</ol>
        <p className="odes-note">n = 0 and n = 1 are already linear. Only other n values need v = y^(1−n).</p>
        <p className="odes-warn">Common mistake: substituting v = y^n. The exponent that linearizes the equation is 1 − n.</p>
      </aside>
    </div>
  );
}

function HeunLab() {
  const [h, setH] = useState(0.4);
  const [y0, setY0] = useState(1);
  const [steps, setSteps] = useState(6);
  const safeH = Number.isFinite(h) && h > 0 ? h : 0.4;
  const rows = compareMethods(0, y0, safeH, steps);
  const finer = compareMethods(0, y0, safeH / 2, steps * 2);
  const last = rows[rows.length - 1];
  const fineLast = finer[finer.length - 1];
  const curves = [
    [{ x: 0, y: y0 }, ...rows.map((row) => ({ x: row.x, y: row.exact }))],
    [{ x: 0, y: y0 }, ...rows.map((row) => ({ x: row.x, y: row.euler }))],
    [{ x: 0, y: y0 }, ...rows.map((row) => ({ x: row.x, y: row.heun }))],
    [{ x: 0, y: y0 }, ...rows.map((row) => ({ x: row.x, y: row.rk4 }))],
  ];
  return (
    <div className="odes-lab">
      <section className="odes-card">
        <h2>Euler, Heun, and RK4</h2>
        <p><MathExpression value="y' = x - y" /></p>
        <p>Supported equation with a known solution. Predictor y* = yₙ + h f(xₙ, yₙ). Corrector yₙ₊₁ = yₙ + (h/2)[f(xₙ, yₙ) + f(xₙ₊₁, y*)].</p>
        <label>Initial y(0)
          <input aria-label="Comparison initial value" type="range" min={-1} max={2} step={0.1} value={y0} onChange={(event) => setY0(Number(event.target.value))} />
        </label>
        <label>Step h
          <input aria-label="Heun step size" type="range" min={0.1} max={0.8} step={0.05} value={safeH} onChange={(event) => setH(Number(event.target.value))} />
        </label>
        <label>Steps
          <input aria-label="Comparison steps" type="range" min={3} max={12} step={1} value={steps} onChange={(event) => setSteps(Number(event.target.value))} />
        </label>
        <Plot curves={curves} label="Exact curve with Euler, Heun, and RK4" />
        <p>Teal is exact, amber is Euler, blue is Heun, purple is RK4. The table names each column, so the colors are not the only cue.</p>
        <div className="odes-scroll">
        <table className="odes-table">
          <thead><tr><th>x</th><th>Euler</th><th>Heun</th><th>RK4</th><th>Exact</th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.x}>
                <td>{row.x.toFixed(2)}</td>
                <td>{row.euler.toFixed(3)}</td>
                <td>{row.heun.toFixed(3)}</td>
                <td>{row.rk4.toFixed(3)}</td>
                <td>{row.exact.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </section>
      <aside className="odes-side">
        <h2>Error at the last step</h2>
        {last ? (
          <ul>
            <li>Euler {last.eulerError.toFixed(4)}</li>
            <li>Heun {last.heunError.toFixed(4)}</li>
            <li>RK4 {last.rk4Error.toFixed(4)}</li>
          </ul>
        ) : null}
        {last && fineLast ? <p>Halving h to {(safeH / 2).toFixed(3)} changes the Euler error from {last.eulerError.toFixed(4)} to {fineLast.eulerError.toFixed(4)}, and the RK4 error from {last.rk4Error.toFixed(4)} to {fineLast.rk4Error.toFixed(4)}.</p> : null}
        <p className="odes-note">Heun averages the slope at the start of the step with the slope at the predicted end. That usually lands between Euler and RK4.</p>
        <p><Link to="/differential-equations/euler">The Euler lab follows one tangent step.</Link></p>
      </aside>
    </div>
  );
}
