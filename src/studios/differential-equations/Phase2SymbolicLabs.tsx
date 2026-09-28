import { useMemo, useState } from "react";
import { BookOpen, CheckCircle2, GitBranch, Layers3, Sigma, Sparkles } from "lucide-react";
import { compileFunctionExpression } from "../../utils/functionParser";
import { cauchyValue, homogeneousValue, secondOrderConstants, undeterminedPresets, variationPresets } from "./engineeringMath";
import { Card, CheckBox, Formula, Notice, Slider } from "./Phase1Labs";
import { Phase1Graph, type Bounds, type GraphSeries } from "./Phase1Graph";
import { cauchyIndicial, characteristic, fitUndetermined, homogeneousBasis, integrateSecondOrder, integrateVariation, numberText, rootText, samplePoints, type TrialBasis } from "./phase2Math";
import "./phase2Labs.css";

const blue = "#1769f5", violet = "#7838ee", orange = "#f97316", green = "#0aa976";
const secondOrderExamples = [
  { label: "Distinct roots", a: 1, b: -3, c: 2, forcing: "e^x" },
  { label: "Repeated roots", a: 1, b: -2, c: 1, forcing: "0" },
  { label: "Complex roots", a: 1, b: 0, c: 1, forcing: "sin(x)" },
  { label: "Forced response", a: 1, b: 0, c: 4, forcing: "cos(x)" },
];
function compileForcing(expression: string) {
  try {
    const normalized = expression.replace(/[−–]/g, "-").replace(/²/g, "^2").replace(/³/g, "^3")
      .replace(/\b(sin|cos|tan)\s+([+-]?\d*\.?\d*)\s*x\b/gi, (_match, name: string, coefficient: string) => `${name}(${coefficient ? `${coefficient}*` : ""}x)`)
      .replace(/e\^\{([+-]?\d+)x\}/g, "e^($1*x)");
    const fn = compileFunctionExpression(normalized);
    if (!Number.isFinite(fn(.23))) throw new Error("The forcing term is not defined near the sample point.");
    return { fn, error: "" };
  } catch (error) { return { fn: null, error: error instanceof Error ? error.message : "Invalid forcing function." }; }
}
function autoBounds(series: GraphSeries[], xMin: number, xMax: number): Bounds {
  const values = series.flatMap((item) => item.points.map((point) => point.y)).filter((value) => Number.isFinite(value) && Math.abs(value) < 150);
  const lo = Math.min(-1, ...values), hi = Math.max(1, ...values); const pad = Math.max(0.6, (hi - lo) * 0.12);
  return { xMin, xMax, yMin: lo - pad, yMax: hi + pad };
}
function Tabs({ items, selected, onSelect }: { items: string[]; selected: string; onSelect: (next: string) => void }) { return <div className="de2-segmented">{items.map((item) => <button type="button" key={item} aria-pressed={selected === item} onClick={() => onSelect(item)}>{item}</button>)}</div>; }
function CoefficientInputs({ a, b, c, onA, onB, onC }: { a: number; b: number; c: number; onA: (n: number) => void; onB: (n: number) => void; onC: (n: number) => void }) { return <div className="de2-data-grid"><label>y′′ coefficient<input type="number" step="0.1" value={a} onChange={(event) => onA(Number(event.target.value))} /></label><label>y′ coefficient<input type="number" step="0.1" value={b} onChange={(event) => onB(Number(event.target.value))} /></label><label>y coefficient<input type="number" step="0.1" value={c} onChange={(event) => onC(Number(event.target.value))} /></label></div>; }

export function HigherOrderPhase2() {
  const [a, setA] = useState(1), [b, setB] = useState(-3), [c, setC] = useState(2);
  const [forcing, setForcing] = useState("e^x"); const [y0, setY0] = useState(1), [v0, setV0] = useState(0);
  const [tab, setTab] = useState("Characteristic Equation"); const [showHomogeneous, setShowHomogeneous] = useState(true), [showParticular, setShowParticular] = useState(true), [showTotal, setShowTotal] = useState(true);
  const roots = characteristic(a, b, c); const constants = secondOrderConstants(a, b, c, y0, v0);
  const compiled = useMemo(() => compileForcing(forcing), [forcing]);
  const particular = useMemo(() => compiled.fn ? integrateSecondOrder(a, b, c, compiled.fn, 0, 0, 3.5) : [], [a, b, c, compiled.fn]);
  const homogeneous = samplePoints((x) => homogeneousValue(a, b, c, y0, v0, x), 0, 3.5);
  const particularAt = (x: number) => {
    const position = Math.max(0, Math.min(particular.length - 1, x / 0.02));
    const index = Math.floor(position), fraction = position - index;
    return (particular[index]?.y ?? 0) * (1 - fraction) + (particular[Math.min(particular.length - 1, index + 1)]?.y ?? 0) * fraction;
  };
  const series: GraphSeries[] = [];
  if (showHomogeneous) series.push({ label: "Homogeneous", color: blue, dashed: true, points: homogeneous });
  if (showParticular) series.push({ label: "Particular (numerical)", color: orange, dashed: true, points: particular.map((point) => ({ x: point.x, y: point.y })) });
  if (showTotal) series.push({ label: "Total solution", color: violet, points: homogeneous.map((point) => ({ x: point.x, y: point.y + particularAt(point.x) })) });
  const matching = undeterminedPresets.find((item) => item.a === a && item.b === b && item.c === c && item.forcing.replace(/\s/g, "") === forcing.replace(/\s/g, ""));
  const form = roots.kind === "distinct" ? "y_h=C_1e^{r_1x}+C_2e^{r_2x}" : roots.kind === "repeated" ? "y_h=(C_1+C_2x)e^{rx}" : roots.kind === "complex" ? "y_h=e^{\\alpha x}(C_1\\cos\\beta x+C_2\\sin\\beta x)" : "a\\neq0";
  return <div className="de1-page de2-page"><div className="de2-feature-strip"><span><Sigma size={17} /> Characteristic equation</span><span><Layers3 size={17} /> Homogeneous + particular</span><span><GitBranch size={17} /> Root cases</span><span><Sparkles size={17} /> Solution families</span></div><div className="de2-three-col">
    <div className="de1-stack"><Card title="Equation Input"><p>Explore a constant-coefficient second-order equation.</p><div className="de2-formula-box"><Formula value={`${numberText(a)}y''+(${numberText(b)})y'+(${numberText(c)})y=${forcing}`} display /></div><p className="de2-mini-note">Order: 2 (Second Order)</p><CoefficientInputs a={a} b={b} c={c} onA={setA} onB={setB} onC={setC} /><label className="de2-field">Forcing function g(x)<input value={forcing} onChange={(event) => setForcing(event.target.value)} aria-label="Forcing function" /></label>{compiled.error && <p className="de1-error" role="alert">{compiled.error}</p>}{a === 0 && <p className="de1-error" role="alert">The leading coefficient must be nonzero.</p>}<div className="de1-pair"><label>y(0)<input type="number" step="0.1" value={y0} onChange={(event) => setY0(Number(event.target.value))} /></label><label>y′(0)<input type="number" step="0.1" value={v0} onChange={(event) => setV0(Number(event.target.value))} /></label></div><h3>Example problems</h3><div className="de2-choice-grid">{secondOrderExamples.map((item) => <button key={item.label} type="button" onClick={() => { setA(item.a); setB(item.b); setC(item.c); setForcing(item.forcing); }}>{item.label}</button>)}</div></Card></div>
    <div className="de1-stack"><Card title="Solution Workspace"><Tabs items={["Characteristic Equation", "Root Analysis", "General Solution", "Graph"]} selected={tab} onSelect={setTab} />{tab === "Characteristic Equation" && <><p>Remove the forcing term and substitute y = eʳˣ.</p><div className="de2-formula-box"><Formula value={`${numberText(a)}r^2+(${numberText(b)})r+(${numberText(c)})=0`} display /></div><Notice good>{rootText(roots)} · {roots.kind} roots.</Notice></>}{tab === "Root Analysis" && <><p>Discriminant Δ = b² − 4ac = {numberText(roots.discriminant)}.</p><Notice good>Root case: {roots.kind}. {rootText(roots)}</Notice></>}{tab === "General Solution" && <><div className="de2-formula-box"><Formula value={form} display /></div><p>The complete solution adds a particular response to the homogeneous family.</p><div className="de2-result">{matching ? <Formula value={`y=${matching.general.replaceAll("₁", "_1").replaceAll("₂", "_2")}`} /> : <span>y = yₕ + yₚ. The particular response is computed numerically for this forcing term.</span>}</div></>}{tab === "Graph" && <Notice>Toggle each component below to compare natural and forced responses.</Notice>}</Card><Card title="Solution Family (Full Solution)" className="de1-graph-card"><div className="de2-card-toolbar"><CheckBox label="Homogeneous" checked={showHomogeneous} onChange={setShowHomogeneous} /><CheckBox label="Particular" checked={showParticular} onChange={setShowParticular} /><CheckBox label="Total" checked={showTotal} onChange={setShowTotal} /></div><Phase1Graph bounds={autoBounds(series, 0, 3.5)} series={series} height={335} label="Higher order homogeneous particular and total solutions" /></Card></div>
    <div className="de1-stack"><Card title="Root Cases for Second-Order"><div className="de2-metric-list"><div><span>Distinct real</span><strong>C₁eʳ¹ˣ + C₂eʳ²ˣ</strong></div><div><span>Repeated real</span><strong>(C₁ + C₂x)eʳˣ</strong></div><div><span>Complex conjugate</span><strong>eᵅˣ(C₁cosβx+C₂sinβx)</strong></div></div></Card><Card title="Initial Value Fit"><p>For the homogeneous part, y(0) = {numberText(y0)} and y′(0) = {numberText(v0)}.</p><div className="de2-result">C₁ = {numberText(constants.c1)}, C₂ = {numberText(constants.c2)}</div><p className="de2-mini-note">The numerical particular solution is initialized at zero, so these constants fit the total initial values.</p></Card><Card title="Interpretation"><p>Real roots control growth and decay. Complex roots cause oscillation; their real part sets the envelope.</p></Card></div>
  </div><div className="de2-insights"><Card title="Superposition"><p>The total response adds a natural homogeneous part and a forced particular part.</p></Card><Card title="Transient vs Steady State"><p>Negative real roots make natural transients decay.</p></Card><Card title="Oscillation"><p>Complex roots introduce sine and cosine factors.</p></Card><Card title="Damping"><p>A negative real part attenuates oscillation.</p></Card></div></div>;
}

const forcingChoices = [
  { label: "Polynomial", value: "x^2" }, { label: "Exponential", value: "e^x" },
  { label: "Sine / Cosine", value: "sin(x)" }, { label: "Product", value: "x*e^x" },
  { label: "Mixed", value: "e^x+sin(x)" },
];
function trialGuess(forcing: string, a: number, b: number, c: number) {
  const normalized = forcing.replace(/\s/g, "").replace(/[−–]/g, "-");
  const terms = normalized.split(/(?<!\^)(?=\+)/).map((term) => term.replace(/^\+/, "")).filter(Boolean);
  const roots = characteristic(a, b, c);
  const hasRoot = (real: number, imaginary = 0) => roots.kind === "distinct" ? imaginary === 0 && (Math.abs((roots.r1 ?? 1e9) - real) < 1e-5 || Math.abs((roots.r2 ?? 1e9) - real) < 1e-5) : roots.kind === "repeated" ? imaginary === 0 && Math.abs((roots.r1 ?? 1e9) - real) < 1e-5 : roots.kind === "complex" && Math.abs((roots.alpha ?? 1e9) - real) < 1e-5 && Math.abs((roots.beta ?? 1e9) - imaginary) < 1e-5;
  const guesses = terms.map((term) => {
    const exponential = term.match(/(?:e\^\(?([+-]?\d*\.?\d*)\*?x\)?|e\^x)/);
    const trig = term.match(/(?:sin|cos)\(?(\d*\.?\d*)\*?x\)?/);
    const polynomial = term.match(/x\^(\d+)/);
    const product = term.match(/(?:^|[*(])x(?:\^(\d+))?\*/);
    const degree = polynomial ? Math.min(4, Number(polynomial[1])) : product ? Math.min(4, Number(product[1] ?? 1)) : term.includes("x") && !exponential && !trig ? 1 : 0;
    const rate = exponential ? exponential[1] === "" || exponential[1] === "+" ? 1 : exponential[1] === "-" ? -1 : Number(exponential[1]) : 0;
    const frequency = trig ? Number(trig[1] || 1) : 0;
    const root = hasRoot(rate, frequency);
    const power = root ? roots.kind === "repeated" && !trig ? 2 : 1 : 0;
    const multiplier = power === 2 ? "x²·" : power === 1 ? "x·" : "";
    const poly = degree > 0 ? `(A₀ + … + A${degree}x${degree > 1 ? `^${degree}` : ""})` : "A";
    const exponentialText = rate === 1 ? "eˣ" : rate === -1 ? "e⁻ˣ" : `e^(${rate}x)`;
    const trial = trig ? `${multiplier}${poly === "A" ? "" : poly + "·"}(B cos(${frequency}x) + C sin(${frequency}x))` : exponential ? `${multiplier}${poly}${exponentialText}` : `${multiplier}${degree > 0 ? poly : "A"}`;
    return { term, trial, resonance: root, power, degree, rate, frequency };
  });
  return guesses;
}

export function UndeterminedPhase2() {
  const [a, setA] = useState(1), [b, setB] = useState(-3), [c, setC] = useState(2), [forcing, setForcing] = useState("e^x");
  const [showH, setShowH] = useState(true), [showP, setShowP] = useState(true), [showTotal, setShowTotal] = useState(true);
  const [checkResonance, setCheckResonance] = useState(true);
  const compiled = useMemo(() => compileForcing(forcing), [forcing]);
  const guess = trialGuess(forcing, a, b, c);
  const trialBasis: TrialBasis[] = [];
  for (const item of guess) for (let degree = 0; degree <= item.degree; degree += 1) {
    const trigTypes: TrialBasis["trig"][] = item.frequency ? ["cos", "sin"] : ["plain"];
    for (const trig of trigTypes) {
      const term = { power: item.power + degree, rate: item.rate, frequency: item.frequency, trig };
      if (!trialBasis.some((existing) => existing.power === term.power && existing.rate === term.rate && existing.frequency === term.frequency && existing.trig === term.trig)) trialBasis.push(term);
    }
  }
  const fitted = compiled.fn ? fitUndetermined(a, b, c, compiled.fn, trialBasis) : null;
  const coefficientText = fitted ? fitted.coefficients.map((value, index) => {
    const term = trialBasis[index];
    const factors = [term.power ? `x^${term.power}` : "", term.rate ? `e^(${term.rate}x)` : "", term.trig === "plain" ? "" : `${term.trig}(${term.frequency}x)`].filter(Boolean);
    return `${value < 0 ? "−" : "+"} ${numberText(Math.abs(value), 4)}${factors.length ? ` · ${factors.join("·")}` : ""}`;
  }).join(" ").replace(/^\+ /, "") : null;
  const matched = undeterminedPresets.find((item) => item.a === a && item.b === b && item.c === c && item.forcing.replace(/\s/g, "") === forcing.replace(/\s/g, ""));
  const particular = useMemo(() => compiled.fn ? integrateSecondOrder(a, b, c, compiled.fn, 0, 0, 2.7) : [], [a, b, c, compiled.fn]);
  const roots = characteristic(a, b, c); const basis = samplePoints((x) => { const [one, two] = homogeneousBasis(roots, x); return one + two; }, -1, 2.7);
  const p = fitted ? samplePoints(fitted.particular, -1, 2.7) : matched ? samplePoints(matched.particular, -1, 2.7) : particular.map(({ x, y }) => ({ x, y }));
  const series: GraphSeries[] = [];
  if (showH) series.push({ label: "Homogeneous basis", color: blue, dashed: true, points: basis });
  if (showP) series.push({ label: fitted || matched ? "Particular solution" : "Numerical particular", color: orange, dashed: true, points: p });
  if (showTotal) series.push({ label: "Total example", color: violet, points: basis.map((point, index) => ({ x: point.x, y: point.y + (fitted || matched ? p[index]?.y ?? 0 : particular[Math.min(particular.length - 1, Math.max(0, Math.round(point.x / 0.02)))]?.y ?? 0) })) });
  return <div className="de1-page de2-page"><div className="de2-feature-strip"><span><GitBranch size={17} /> Trial functions</span><span><TargetIcon /> Resonance check</span><span><Sigma size={17} /> Particular solution</span><span><BookOpen size={17} /> Worked examples</span></div><div className="de2-three-col">
    <div className="de1-stack"><Card title="Input Differential Equation"><div className="de2-formula-box"><Formula value={`${numberText(a)}y''+(${numberText(b)})y'+(${numberText(c)})y=${forcing}`} display /></div><CoefficientInputs a={a} b={b} c={c} onA={setA} onB={setB} onC={setC} /><label className="de2-field">Forcing term f(x)<input value={forcing} onChange={(event) => setForcing(event.target.value)} /></label>{compiled.error && <p className="de1-error" role="alert">{compiled.error}</p>}<h3>Forcing term type</h3><div className="de2-choice-grid">{forcingChoices.map((item) => <button key={item.label} type="button" aria-pressed={forcing === item.value} onClick={() => setForcing(item.value)}>{item.label}</button>)}</div><h3>Quick examples</h3><div className="de1-chips">{undeterminedPresets.map((item) => <button type="button" key={item.id} onClick={() => { setA(item.a); setB(item.b); setC(item.c); setForcing(item.forcing); }}>{item.equation}</button>)}</div><CheckBox label="Check for resonance" checked={checkResonance} onChange={setCheckResonance} />{checkResonance && <Notice good>{guess.some((item) => item.resonance) ? `Resonance detected: multiply the overlapping trial by x${guess.some((item) => item.power === 2) ? "²" : ""}.` : "No characteristic root overlaps the selected forcing."}</Notice>}</Card></div>
    <div className="de1-stack"><Card title="Step-by-Step Solution"><div className="de2-workflow"><details open><summary>1. Solve the homogeneous equation</summary><div>Characteristic roots: {rootText(roots)}.</div></details><details open><summary>2. Classify the forcing term</summary><div>{guess.map((item) => item.term).join(" + ") || "Enter a forcing term."}</div></details><details open><summary>3. Choose a trial solution</summary><div>{guess.map((item) => item.trial).join(" + ")}</div></details><details><summary>4. Check resonance and modify the trial</summary><div>{guess.some((item) => item.resonance) ? "A forcing component duplicates the homogeneous family; the trial gains the x factor shown above." : "No duplicate characteristic root; retain the ordinary trial."}</div></details><details><summary>5. Substitute and solve coefficients</summary><div>{matched ? matched.steps.at(-2) : coefficientText ? `Solved coefficients: yₚ = ${coefficientText}.` : "This forcing cannot be matched by the trial library; the plotted particular response is integrated numerically."}</div></details><details><summary>6. Compose the complete solution</summary><div>{matched ? matched.general : coefficientText ? `y = C₁y₁ + C₂y₂ + (${coefficientText})` : "y = C₁y₁ + C₂y₂ + yₚ"}</div></details></div></Card><Card title="Resonance / Duplication"><p>If the trial is already part of the homogeneous solution, multiply it by xˢ until it becomes independent.</p><div className="de2-result">{guess.map((item) => `${item.term} → ${item.trial}`).join("; ")}</div></Card></div>
    <div className="de1-stack"><Card title="Guess Library"><div className="de2-table-scroll"><table className="de2-table"><thead><tr><th>Forcing term</th><th>Base trial</th></tr></thead><tbody><tr><td>Polynomial Pₙ(x)</td><td>Polynomial degree n</td></tr><tr><td>eᵃˣ</td><td>Aeᵃˣ</td></tr><tr><td>sin(ax), cos(ax)</td><td>Acos(ax)+Bsin(ax)</td></tr><tr><td>xⁿeᵃˣ</td><td>Polynomial × eᵃˣ</td></tr><tr><td>Polynomial × trig</td><td>Two polynomial trig terms</td></tr><tr><td>Mixed sum</td><td>Sum the component trials</td></tr></tbody></table></div></Card><Card title="Solutions and Graph" className="de1-graph-card"><div className="de2-card-toolbar"><CheckBox label="Homogeneous" checked={showH} onChange={setShowH} /><CheckBox label="Particular" checked={showP} onChange={setShowP} /><CheckBox label="Total" checked={showTotal} onChange={setShowTotal} /></div><Phase1Graph bounds={autoBounds(series, -1, 2.7)} series={series} height={275} label="Undetermined coefficients component plot" /><div className="de2-result">{matched ? matched.general : coefficientText ? `yₚ = ${coefficientText}` : "Numerical particular response shown; this forcing is outside the trial library."}</div></Card></div>
  </div></div>;
}
function TargetIcon() { return <CheckCircle2 size={17} />; }

const variationInputs = [
  { label: "y′′ + y = sec(x)", p: 0, q: 1, g: "sec(x)", id: "sec" },
  { label: "y′′ − y = e^(2x)", p: 0, q: -1, g: "e^(2*x)", id: "exp" },
  { label: "y′′ + 4y = x", p: 0, q: 4, g: "x", id: "custom" },
];
export function VariationPhase2() {
  const [pText, setP] = useState("0"), [qText, setQ] = useState("1"), [g, setG] = useState("sec(x)");
  const [showBasis, setShowBasis] = useState(true), [showW, setShowW] = useState(true), [showParticular, setShowParticular] = useState(true);
  const pCompiled = useMemo(() => compileForcing(pText), [pText]);
  const qCompiled = useMemo(() => compileForcing(qText), [qText]);
  const constant = Number.isFinite(Number(pText)) && Number.isFinite(Number(qText));
  const p = Number(pText), q = Number(qText);
  const roots = characteristic(1, constant ? p : 0, constant ? q : 1);
  const compiled = useMemo(() => compileForcing(g), [g]);
  const xMax = g.includes("sec") ? 1.25 : 3.2;
  const solved = useMemo(() => pCompiled.fn && qCompiled.fn && compiled.fn ? integrateVariation(pCompiled.fn, qCompiled.fn, compiled.fn, xMax) : [], [pCompiled.fn, qCompiled.fn, compiled.fn, xMax]);
  const at = (x: number) => solved[Math.min(solved.length - 1, Math.max(0, Math.round(x / 0.01)))];
  const basis = (x: number): [number, number] => constant ? homogeneousBasis(roots, x) : [at(x)?.y1 ?? Number.NaN, at(x)?.y2 ?? Number.NaN];
  const probe = 0.25, basisAt = at(probe);
  const w = constant ? (() => { const delta = 1e-4; const [one, two] = basis(probe); return one * (basis(probe + delta)[1] - basis(probe - delta)[1]) / (2 * delta) - (basis(probe + delta)[0] - basis(probe - delta)[0]) / (2 * delta) * two; })() : basisAt ? basisAt.y1 * basisAt.v2 - basisAt.v1 * basisAt.y2 : Number.NaN;
  const gAt = compiled.fn?.(probe) ?? Number.NaN;
  const series: GraphSeries[] = [];
  if (showBasis) { series.push({ label: "y₁ basis", color: blue, dashed: true, points: samplePoints((x) => basis(x)[0], 0, xMax) }); series.push({ label: "y₂ basis", color: orange, dashed: true, points: samplePoints((x) => basis(x)[1], 0, xMax) }); }
  if (showParticular) series.push({ label: "Particular response", color: violet, points: solved.map(({ x, yVariation }) => ({ x, y: yVariation })) });
  const recognized = variationInputs.find((item) => constant && item.p === p && item.q === q && item.g === g);
  const known = variationPresets.find((item) => item.id === recognized?.id);
  const basisText = !constant ? "Numerically integrated basis: y₁(0)=1, y₁′(0)=0; y₂(0)=0, y₂′(0)=1" : roots.kind === "complex" ? `${Math.abs(roots.alpha ?? 0) < 1e-8 ? "" : `e^(${numberText(roots.alpha ?? 0)}x)`}cos(${numberText(roots.beta ?? 0)}x), ${Math.abs(roots.alpha ?? 0) < 1e-8 ? "" : `e^(${numberText(roots.alpha ?? 0)}x)`}sin(${numberText(roots.beta ?? 0)}x)` : roots.kind === "repeated" ? `e^(${numberText(roots.r1 ?? 0)}x), xe^(${numberText(roots.r1 ?? 0)}x)` : `e^(${numberText(roots.r1 ?? 0)}x), e^(${numberText(roots.r2 ?? 0)}x)`;
  const knownSolution = known?.id === "sec" ? "y=C_1\\cos x+C_2\\sin x+\\cos x\\ln|\\cos x|+x\\sin x" : known?.id === "exp" ? "y=C_1e^x+C_2e^{-x}+\\frac{e^{2x}}{3}" : null;
  return <div className="de1-page de2-page"><div className="de2-feature-strip"><span><Sigma size={17} /> Wronskian</span><span><Layers3 size={17} /> Parameter functions</span><span><Sparkles size={17} /> Particular solution</span><span><BookOpen size={17} /> Derivation workflow</span></div><div className="de2-three-col">
    <div className="de1-stack"><Card title="Input Differential Equation"><p>Enter y′′ + p(x)y′ + q(x)y = g(x).</p><div className="de2-data-grid"><label>p(x)<input value={pText} onChange={(event) => setP(event.target.value)} /></label><label>q(x)<input value={qText} onChange={(event) => setQ(event.target.value)} /></label></div><label className="de2-field">g(x)<input value={g} onChange={(event) => setG(event.target.value)} /></label>{[pCompiled.error, qCompiled.error, compiled.error].filter(Boolean).map((error, index) => <p key={index} role="alert" className="de1-error">{error}</p>)}<div className="de1-chips">{variationInputs.map((item) => <button type="button" key={item.label} onClick={() => { setP(String(item.p)); setQ(String(item.q)); setG(item.g); }}>{item.label}</button>)}<button type="button" onClick={() => { setP("x"); setQ("1+x^2"); setG("sin(x)"); }}>Variable coefficients</button></div><h3>Plot options</h3><CheckBox label="Fundamental solutions" checked={showBasis} onChange={setShowBasis} /><CheckBox label="Wronskian computation" checked={showW} onChange={setShowW} /><CheckBox label="Particular solution" checked={showParticular} onChange={setShowParticular} /></Card><Card title="Why Use This Method?"><p>Variation of parameters works with forcing functions beyond the polynomial, exponential, and trig forms handled by undetermined coefficients.</p></Card></div>
    <div className="de1-stack"><Card title="Step-by-Step Derivation"><div className="de2-workflow"><details open><summary>1. Solve the homogeneous equation</summary><div>Basis y₁, y₂: {basisText}. {constant ? `Roots: ${rootText(roots)}.` : "Variable coefficients: the basis is integrated numerically from independent initial values."}</div></details><details open><summary>2. Assume a particular solution</summary><div><Formula value="y_p=u_1(x)y_1(x)+u_2(x)y_2(x)" /></div></details><details><summary>3. Impose the auxiliary condition</summary><div><Formula value="u_1'y_1+u_2'y_2=0" /></div></details><details open><summary>4. Compute the Wronskian</summary><div><Formula value="W=y_1y_2'-y_1'y_2" /> At x={numberText(probe)}, W={numberText(w)}.</div></details><details open><summary>5. Find u₁′ and u₂′</summary><div><Formula value="u_1'=-y_2g/W,\quad u_2'=y_1g/W" /> At x={numberText(probe)}, u₁′={numberText(-basis(probe)[1] * gAt / w)}, u₂′={numberText(basis(probe)[0] * gAt / w)}.</div></details><details><summary>6. Integrate parameter functions</summary><div>{known ? known.steps.at(-2) : `Numerical integration at x = ${numberText(xMax)} gives u₁ = ${numberText(solved.at(-1)?.u1 ?? Number.NaN)} and u₂ = ${numberText(solved.at(-1)?.u2 ?? Number.NaN)}.`}</div></details><details open><summary>7. Form the general solution</summary><div>{known ? known.steps.at(-1) : "y = C₁y₁ + C₂y₂ + u₁y₁ + u₂y₂. The plotted particular response is computed numerically."}</div></details></div></Card></div>
    <div className="de1-stack"><Card title="Fundamental Solutions"><p>Solutions of the homogeneous equation:</p><div className="de2-formula-box">{basisText}</div></Card><Card title="Wronskian"><p><Formula value="W(y_1,y_2)=y_1y_2'-y_1'y_2" /></p>{showW && <div className="de2-result">W({numberText(probe)}) = {numberText(w)}</div>}<Notice good>{Math.abs(w) > 1e-7 ? "Nonzero: the basis functions are linearly independent here." : "The Wronskian vanishes here; choose an independent basis or avoid this point."}</Notice></Card><Card title="Final Result"><div className="de2-result">{knownSolution ? <Formula value={knownSolution} display /> : "y = C₁y₁ + C₂y₂ + yₚ (numerically plotted)"}</div></Card><Card title="Solution Plot" className="de1-graph-card"><Phase1Graph bounds={autoBounds(series, 0, xMax)} series={series} height={270} label="Variation of parameters basis and particular solution" /></Card></div>
  </div></div>;
}

const cauchyPresets = [
  { label: "Repeated Roots", a: -3, b: 4 }, { label: "Distinct Roots", a: 1, b: -1 }, { label: "Complex Roots", a: 1, b: 1 }, { label: "Damped Power", a: 3, b: 2 },
];
export function CauchyEulerPhase2() {
  const [a, setA] = useState(-3), [b, setB] = useState(4), [c1, setC1] = useState(1), [c2, setC2] = useState(0.5);
  const [showGrid, setShowGrid] = useState(true), [showLegend, setShowLegend] = useState(true), [logAxis, setLogAxis] = useState(false);
  const roots = cauchyIndicial(1, a, b);
  const solution = roots.kind === "repeated" ? `y=C_1x^{${numberText(roots.r1 ?? 0)}}+C_2x^{${numberText(roots.r1 ?? 0)}}\\ln x` : roots.kind === "complex" ? `y=x^{${numberText(roots.alpha ?? 0)}}[C_1\\cos(${numberText(roots.beta ?? 0)}\\ln x)+C_2\\sin(${numberText(roots.beta ?? 0)}\\ln x)]` : `y=C_1x^{${numberText(roots.r1 ?? 0)}}+C_2x^{${numberText(roots.r2 ?? 0)}}`;
  const values = [-1, 0, 1, 2].map((offset, index) => ({ label: `C₂ = ${numberText(c2 + offset)}`, color: [blue, orange, violet, green][index], points: samplePoints((x) => cauchyValue(1, a, b, c1, c2 + offset, x), logAxis ? 0.1 : 0.2, 5) }));
  return <div className="de1-page de2-page"><div className="de2-feature-strip"><span><Sigma size={17} /> Indicial equation</span><span><GitBranch size={17} /> Root cases</span><span><Layers3 size={17} /> Power solutions</span><span><Sparkles size={17} /> Scale invariance</span></div><div className="de2-three-col">
    <div className="de1-stack"><Card title="Equation Input"><p>Equidimensional form on x &gt; 0:</p><div className="de2-formula-box"><Formula value={`x^2y''+(${numberText(a)})xy'+(${numberText(b)})y=0`} display /></div><div className="de2-data-grid"><label>a (coefficient of xy′)<input type="number" step="0.1" value={a} onChange={(event) => setA(Number(event.target.value))} /></label><label>b (coefficient of y)<input type="number" step="0.1" value={b} onChange={(event) => setB(Number(event.target.value))} /></label></div><h3>Quick examples</h3><div className="de2-choice-grid">{cauchyPresets.map((item) => <button type="button" key={item.label} aria-pressed={item.a === a && item.b === b} onClick={() => { setA(item.a); setB(item.b); }}>{item.label}</button>)}</div></Card><Card title="Domain"><Notice>x &gt; 0 keeps ln(x) and xᵐ real and defined for the displayed family.</Notice></Card><Card title="Power-Form Substitution"><div className="de2-formula-box"><Formula value="y=x^m" display /></div><p>Scale invariance turns the equation into a polynomial in m.</p></Card></div>
    <div className="de1-stack"><Card title="Step-by-Step Solution"><div className="de2-workflow"><details open><summary>1. Start with the Cauchy–Euler equation</summary><div>x²y′′ + ({numberText(a)})xy′ + ({numberText(b)})y = 0</div></details><details open><summary>2. Use the power-form substitution</summary><div><Formula value="y=x^m,\quad y'=mx^{m-1},\quad y''=m(m-1)x^{m-2}" /></div></details><details><summary>3. Substitute and divide by xᵐ</summary><div><Formula value={`m(m-1)+(${numberText(a)})m+(${numberText(b)})=0`} /></div></details><details open><summary>4. Solve the indicial equation</summary><div>m² + ({numberText(a - 1)})m + ({numberText(b)}) = 0.</div></details><details open><summary>5. Classify the roots</summary><div>{rootText(roots)}. {roots.kind} case.</div></details><details open><summary>6. Write the general solution</summary><div><Formula value={solution} /></div></details></div></Card><Card title="Solution Family Visualization" className="de1-graph-card"><Tabs items={["Distinct Roots", "Repeated Roots", "Complex Roots"]} selected={roots.kind === "distinct" ? "Distinct Roots" : roots.kind === "repeated" ? "Repeated Roots" : "Complex Roots"} onSelect={(next) => { const item = cauchyPresets.find((preset) => preset.label === next); if (item) { setA(item.a); setB(item.b); } }} /><Phase1Graph bounds={autoBounds(values, 0, 5)} series={values} showGrid={showGrid} showLegend={showLegend} height={300} label="Cauchy Euler solution family" /><Slider label="C₁" value={c1} min={-2} max={2} step={0.1} onChange={setC1} /><Slider label="C₂" value={c2} min={-2} max={2} step={0.1} onChange={setC2} /><CheckBox label="Show grid" checked={showGrid} onChange={setShowGrid} /><CheckBox label="Show legend" checked={showLegend} onChange={setShowLegend} /><CheckBox label="Start near x = 0.1" checked={logAxis} onChange={setLogAxis} /></Card></div>
    <div className="de1-stack"><Card title="Equation Structure"><div className="de2-metric-list"><div><span>Standard form</span><strong>x²y′′ + axy′ + by = 0</strong></div><div><span>For this equation</span><strong>a = {numberText(a)}, b = {numberText(b)}</strong></div><div><span>Domain</span><strong>x &gt; 0</strong></div></div></Card><Card title="Root Interpretation"><div className="de2-formula-box">m² + ({numberText(a - 1)})m + ({numberText(b)}) = 0</div><p>{rootText(roots)}</p><Notice>{roots.kind === "repeated" ? "A repeated root requires xᵐln(x) as the second solution." : roots.kind === "complex" ? "Complex powers become sine and cosine waves in ln(x)." : "Distinct roots give two independent power functions."}</Notice></Card><Card title="Final Solution"><div className="de2-result"><Formula value={solution} display /></div></Card><Card title="Related Transformation"><p>With t = ln(x), the equation becomes a constant-coefficient ODE:</p><Formula value="Y''+(a-1)Y'+bY=0" display /></Card></div>
  </div></div>;
}
