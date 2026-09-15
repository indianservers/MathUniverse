import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AlgebraLabHeading from "./AlgebraLabHeading";
import { workbenchTools } from "./algebraStudioCatalog";
import {
  algebraTiles, arithmeticSeries, cancelZeroPairs, changeLogBase, completeSquare,
  composeFunctions, distributeBinomials, evaluatePiecewise, exponentLawCounterexample,
  factorIntegerQuadratic, generateSequences, inverseLinear, numericIntersections,
  polynomialFromRoots, quadraticRoots, rationalFunctionAnalysis, solveAbsoluteValue,
  solveLinearEquation, solveLinearInequality, solveThreeByThree, syntheticDivide,
  validateEquivalentExpressions, validateRadicalCandidate, verifyEquationCandidates,
} from "./algebraEnhancementEngine";
import { solveAbsoluteEquation, evaluateAlgebraExpression } from "./algebraStudioMath";
import { useAlgebraHistory } from "./useAlgebraHistory";

type ToolProps = { id: string; title: string; goal: string; misuse: string; children: React.ReactNode };

function Tool({ id, title, goal, misuse, children }: ToolProps) {
  return (
    <article className="alg-card alg-enhancement-tool" data-enhancement-id={id} id={id}>
      <h2>{title}</h2>
      <p>{goal}</p>
      <small>Common misuse: {misuse}</small>
      {children}
    </article>
  );
}

function NumericInput({ label, value, onChange, onCommit }: { label: string; value: number; onChange: (value: number) => void; onCommit?: (value: number) => void }) {
  return <label className="alg-field"><span>{label}</span><input type="number" value={Number.isFinite(value) ? value : ""} onChange={(event) => { if (event.target.value !== "" && Number.isFinite(event.target.valueAsNumber)) onChange(event.target.valueAsNumber); }} onBlur={() => onCommit?.(value)} /></label>;
}

function TilesView({ a, b, c }: { a: number; b: number; c: number }) {
  const tiles = algebraTiles(a, b, c);
  return (
    <ul className="alg-tile-readout">
      <li>+x² × {tiles.positiveX2}</li>
      <li>−x² × {tiles.negativeX2}</li>
      <li>+x × {tiles.positiveX}</li>
      <li>−x × {tiles.negativeX}</li>
      <li>+1 × {tiles.positiveUnit}</li>
      <li>−1 × {tiles.negativeUnit}</li>
    </ul>
  );
}

export default function AlgebraEnhancementWorkbench() {
  const [params, setParams] = useSearchParams();
  const focus = params.get("tool") ?? "";
  const query = params.get("q") ?? "";
  const group = params.get("group") ?? "all";
  const [leftExpr, setLeftExpr] = useState("(t+b)^2");
  const [rightExpr, setRightExpr] = useState("t^2+b^2");
  const shared = useAlgebraHistory({
    a: Number(params.get("a")) || 1,
    b: Number(params.get("b")) || 1,
    c: Number(params.get("c")) || -2,
    x: Number(params.get("x")) || 2,
  });
  const { a, b, c, x } = shared.state;
  const setA = (value: number) => shared.replace({ ...shared.state, a: value });
  const setB = (value: number) => shared.replace({ ...shared.state, b: value });
  const setC = (value: number) => shared.replace({ ...shared.state, c: value });
  const setX = (value: number) => shared.replace({ ...shared.state, x: value });
  const factor = factorIntegerQuadratic(a, b, c);
  const roots = quadraticRoots(a, b, c);
  const sequences = generateSequences(a, b, 6);
  const intersections = useMemo(() => numericIntersections((value) => a * value * value + b * value + c, () => x, -10, 10), [a, b, c, x]);
  const inverse = inverseLinear(a, b);
  const system = solveThreeByThree([[1, 1, 1], [2, -1, 1], [1, 2, -1]], [a + b + c, 2 * a - b + c, a + 2 * b - c]);
  const inequality = solveLinearInequality(a, b, "<", c);
  const piecewise = evaluatePiecewise(x, [{ from: -Infinity, to: 0, value: (t) => a * t + b }, { from: 0, to: Infinity, includeFrom: true, value: (t) => t * t + c }]);
  const linear = solveLinearEquation(a, b, c, x);
  const absC = Math.abs(c);
  const absVals = Math.abs(a) < 1e-12 ? solveAbsoluteEquation(a, b, absC).values : solveAbsoluteValue(a, b, absC);
  const square = completeSquare(a, b, c);
  const rational = rationalFunctionAnalysis([b], [b, c], 1, 2);
  const compose = composeFunctions((t) => a * t + b, (t) => t * t + c, x);
  const synth = syntheticDivide([a, b, c], x);
  const logChange = changeLogBase(Math.max(1, Math.abs(x)), Math.max(2, Math.abs(a)), Math.max(2, Math.abs(b) + 1));
  const series = arithmeticSeries(a, b, Math.max(1, Math.round(Math.abs(x))));
  const exponentClaim = exponentLawCounterexample(Math.max(0.1, Math.abs(a)), b, c, "sum");
  const proofCheck = validateEquivalentExpressions(
    (t) => {
      const left = evaluateAlgebraExpression(leftExpr, { t, a, b, c, x });
      return left.ok ? left.value : Number.NaN;
    },
    (t) => {
      const right = evaluateAlgebraExpression(rightExpr, { t, a, b, c, x });
      return right.ok ? right.value : Number.NaN;
    },
  );
  const radical = validateRadicalCandidate(x, (value) => Math.sqrt(Math.max(0, value)) - Math.abs(a));
  const meta = (id: string) => workbenchTools.find((item) => item.id === id)!;
  const visible = workbenchTools.filter((item) => {
    const matchesGroup = group === "all" || item.lab === group;
    const matchesQuery = !query.trim() || `${item.title} ${item.goal} ${item.id}`.toLowerCase().includes(query.toLowerCase());
    const matchesFocus = !focus || item.id === focus;
    return matchesGroup && matchesQuery && matchesFocus;
  });
  const setFilter = (key: string, value: string) => {
    setParams((current) => {
      const next = new URLSearchParams(current);
      if (!value || value === "all") next.delete(key);
      else next.set(key, value);
      return next;
    });
  };

  const controls = <div className="alg-enhancement-controls" aria-label="Shared algebra parameters">
    <NumericInput label="a" value={a} onChange={setA} onCommit={() => shared.commit(shared.state)} /><NumericInput label="b" value={b} onChange={setB} onCommit={() => shared.commit(shared.state)} />
    <NumericInput label="c" value={c} onChange={setC} onCommit={() => shared.commit(shared.state)} /><NumericInput label="x / target" value={x} onChange={setX} onCommit={() => shared.commit(shared.state)} />
  </div>;

  const render = (id: string) => {
    const item = meta(id);
    const body = {
      "ALG-01": <TilesView a={a} b={b} c={c} />,
      "ALG-02": <p>Cancelled {cancelZeroPairs(Math.abs(a) + 2, Math.abs(b)).cancelled} zero pairs. Left +{cancelZeroPairs(Math.abs(a) + 2, Math.abs(b)).positive} / −{cancelZeroPairs(Math.abs(a) + 2, Math.abs(b)).negative}.</p>,
      "ALG-03": <p>({a}x {b >= 0 ? "+" : "−"} {Math.abs(b)})({c}x + {x}) expands to {distributeBinomials(a, b, c, x).quadratic}x² + {distributeBinomials(a, b, c, x).linear}x + {distributeBinomials(a, b, c, x).constant}.</p>,
      "ALG-04": <p>{factor ? `(${factor.left[0]}x ${factor.left[1] >= 0 ? "+" : "−"} ${Math.abs(factor.left[1])})(${factor.right[0]}x ${factor.right[1] >= 0 ? "+" : "−"} ${Math.abs(factor.right[1])})` : "No integer-binomial factorization"}</p>,
      "ALG-05": <p>{a}x + {b} = {c}x + {x} → {linear.kind === "one" ? `x = ${linear.value}` : linear.kind}</p>,
      "ALG-06": <p>{a}x + {b} &lt; {c}. {inequality.kind === "interval" ? `x ${inequality.relation} ${inequality.boundary}${inequality.reversed ? " (sign reversed because a < 0)" : ""}` : `Constant inequality is ${String(inequality.truth)}`}</p>,
      "ALG-07": <p>|{a}x + {b}| = {absC} → {absVals.join(", ") || "no real branches"}</p>,
      "ALG-08": <p>{square ? `a(x − ${square.h})² + ${square.k}` : "Need a ≠ 0"}</p>,
      "ALG-09": <p>Holes {rational.holes.join(", ") || "none"}. Vertical asymptotes {rational.verticalAsymptotes.join(", ") || "none"}.</p>,
      "ALG-10": <p>Candidate x={x} in √t = |a|. Residual {radical.residual}. {radical.valid ? "Valid" : "Extraneous or off the branch"}.</p>,
      "ALG-11": <p>f∘g({x}) = {compose.fog}; g∘f({x}) = {compose.gof}.</p>,
      "ALG-12": <p>{inverse ? `f⁻¹(t) = ${inverse.slope}t + ${inverse.intercept}` : "No inverse when a = 0."}</p>,
      "ALG-13": <p>x={x}: {piecewise.matched ? piecewise.value : "no piece"}</p>,
      "ALG-14": <p>Monic polynomial from roots {a}, {b}, {c}: {polynomialFromRoots([a, b, c]).join(" , ")}</p>,
      "ALG-15": <svg viewBox="-2 -2 4 4" className="alg-argand" aria-label="Complex roots">{roots.map((root, index) => <circle key={index} cx={root.real} cy={-root.imaginary} r="0.12" fill="#8b5cf6" />)}</svg>,
      "ALG-16": <ol className="alg-synth"><li>Bring down {a}</li><li>Quotient {synth.quotient.join(", ")}; remainder {synth.remainder}</li></ol>,
      "ALG-17": <p>HA = {String(rationalFunctionAnalysis([b], [b, c], 2, 2, a || 1).horizontalAsymptote)}. Holes {rationalFunctionAnalysis([b], [b, c], 2, 2, a || 1).holes.join(", ") || "none"}.</p>,
      "ALG-18": <p>Intended solution (a,b,c)=({a},{b},{c}). Computed {system ? `(${system.map((value) => Math.round(value * 1e6) / 1e6).join(", ")})` : "singular"}. Residual of eq1 {system ? a + b + c - (system[0]! + system[1]! + system[2]!) : "—"}.</p>,
      "ALG-19": <><p>Intersections of {a}t²+{b}t+{c} = {x}: {intersections.map((value) => Math.round(value * 1000) / 1000).join(", ") || "none in [−10,10]"}.</p><svg viewBox="0 0 160 70" className="alg-mini-parabola" aria-label="Nonlinear intersections"><path d="M8 50 Q 40 8 80 40 T 152 18" fill="none" stroke="#8b5cf6" strokeWidth="3" /><line x1="8" y1="40" x2="152" y2="40" stroke="#0891b2" /></svg></>,
      "ALG-20": <p>{exponentClaim.explanation} Left {exponentClaim.left} vs right {exponentClaim.right}.</p>,
      "ALG-21": <p>{logChange ? `log changes from ${logChange.inFromBase} to ${logChange.inToBase}` : "Need positive bases ≠ 1 and a positive argument."}</p>,
      "ALG-22": <div className="alg-seq-trio">{(["arithmetic", "geometric", "recursive"] as const).map((kind) => <svg key={kind} viewBox="0 0 120 40" aria-label={kind}>{sequences[kind].map((value, index) => <circle key={index} cx={10 + index * 18} cy={30 - Math.max(-10, Math.min(20, value))} r="3" fill="#0891b2" />)}</svg>)}</div>,
      "ALG-23": <p>S_n = {series.sigma} = {series.sum}</p>,
      "ALG-24": <><label className="alg-field">Left<input value={leftExpr} onChange={(event) => setLeftExpr(event.target.value)} /></label><label className="alg-field">Right<input value={rightExpr} onChange={(event) => setRightExpr(event.target.value)} /></label><p>{proofCheck.equivalentOnSamples ? "Agree on sample x values — not a proof." : `Counterexample x = ${"counterexample" in proofCheck ? proofCheck.counterexample : "?"}`}</p></>,
      "ALG-25": <p>{verifyEquationCandidates(roots.filter((root) => root.imaginary === 0).map((root) => root.real), (t) => a * t * t + b * t + c).map((item) => `x=${item.candidate} residual ${item.residual} ${item.valid ? "pass" : "fail"}`).join("; ") || "No real roots to verify."}</p>,
    }[id];
    const routes: Record<string, string> = {
      expressions: "/algebra/expressions",
      equations: "/algebra/equations",
      functions: "/algebra/functions",
      polynomials: "/algebra/polynomials",
      systems: "/algebra/systems",
      exponents: "/algebra/exponents-logs",
      sequences: "/algebra/sequences",
      proof: "/algebra/proof",
      cas: "/algebra/cas",
      structures: "/algebraic-structures",
    };
    return <Tool key={id} id={id} title={item.title} goal={item.goal} misuse={item.misuse}><Link to={routes[item.lab] ?? "/algebra"}>Open {item.lab} lab</Link>{body}</Tool>;
  };

  return <div className="alg-page alg-enhancement-page" id="algebra-lab-main">
    <AlgebraLabHeading labId="advanced" subtitle="Twenty-five connected algebra tools. Edit a, b, c, and x to recompute every model." onUndo={shared.undo} onRedo={shared.redo} canUndo={shared.canUndo} canRedo={shared.canRedo} onReset={() => shared.reset()} helpTitle="Advanced Workbench help" helpBody="Every tool reads the shared a, b, c, and x values. Empty number fields are ignored so values never become NaN. The 3×3 system uses a, b, and c as the intended solution. JSON dumps were replaced by readable cards. Deep-link with ?tool=ALG-16.">Advanced Algebra Workbench</AlgebraLabHeading>
    {controls}
    <p>Now used as leading coefficient a, linear b, constant c, and probe x. Blank number fields are ignored so the last finite value is kept. Visual pending: graphs stay richest in the topic labs. Parameter pack: a={a}, b={b}, c={c}, x={x}.</p>
    <div className="alg-tile-actions">
      <label className="alg-field">Search tools<input value={query} onChange={(event) => setFilter("q", event.target.value)} /></label>
      <label className="alg-field">Group<select value={group} onChange={(event) => setFilter("group", event.target.value)}><option value="all">All labs</option>{[...new Set(workbenchTools.map((item) => item.lab))].map((lab) => <option key={lab}>{lab}</option>)}</select></label>
      {focus ? <button type="button" onClick={() => setFilter("tool", "")}>Show all 25</button> : null}
    </div>
    <section className="alg-enhancement-grid" aria-label="Twenty-five Algebra enhancements">
      {(visible.length ? visible : workbenchTools).map((item) => render(item.id))}
    </section>
  </div>;
}
