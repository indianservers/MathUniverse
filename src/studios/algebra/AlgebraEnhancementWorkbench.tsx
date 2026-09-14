import { useMemo } from "react";
import AlgebraLabHeading from "./AlgebraLabHeading";
import {
  algebraTiles, arithmeticSeries, cancelZeroPairs, changeLogBase, completeSquare,
  composeFunctions, distributeBinomials, evaluatePiecewise, exponentLawCounterexample,
  factorIntegerQuadratic, generateSequences, inverseLinear, numericIntersections,
  polynomialFromRoots, quadraticRoots, rationalFunctionAnalysis, solveAbsoluteValue,
  solveLinearEquation, solveLinearInequality, solveThreeByThree, syntheticDivide,
  validateEquivalentExpressions, validateRadicalCandidate, verifyEquationCandidates,
} from "./algebraEnhancementEngine";
import { solveAbsoluteEquation } from "./algebraStudioMath";
import { useAlgebraHistory } from "./useAlgebraHistory";

type ToolProps = { id: string; title: string; children: React.ReactNode };

function Tool({ id, title, children }: ToolProps) {
  return <article className="alg-card alg-enhancement-tool" data-enhancement-id={id}><h2>{title}</h2>{children}</article>;
}

function NumericInput({ label, value, onChange, onCommit }: { label: string; value: number; onChange: (value: number) => void; onCommit?: (value: number) => void }) {
  return <label className="alg-field"><span>{label}</span><input type="number" value={Number.isFinite(value) ? value : ""} onChange={(event) => { if (event.target.value !== "" && Number.isFinite(event.target.valueAsNumber)) onChange(event.target.valueAsNumber); }} onBlur={() => onCommit?.(value)} /></label>;
}

function show(value: unknown) {
  return JSON.stringify(value, (_key, item) => typeof item === "number" ? Math.round(item * 1e6) / 1e6 : item);
}

export default function AlgebraEnhancementWorkbench() {
  const params = useAlgebraHistory({ a: 1, b: 1, c: -2, x: 2 });
  const { a, b, c, x } = params.state;
  const setA = (value: number) => params.replace({ ...params.state, a: value });
  const setB = (value: number) => params.replace({ ...params.state, b: value });
  const setC = (value: number) => params.replace({ ...params.state, c: value });
  const setX = (value: number) => params.replace({ ...params.state, x: value });
  const factor = factorIntegerQuadratic(a, b, c);
  const roots = quadraticRoots(a, b, c);
  const sequences = generateSequences(a, b, 6);
  const intersections = useMemo(() => numericIntersections((value) => a * value * value + b * value + c, () => x, -10, 10), [a, b, c, x]);
  const controls = <div className="alg-enhancement-controls" aria-label="Shared algebra parameters">
    <NumericInput label="a" value={a} onChange={setA} onCommit={() => params.commit(params.state)} /><NumericInput label="b" value={b} onChange={setB} onCommit={() => params.commit(params.state)} />
    <NumericInput label="c" value={c} onChange={setC} onCommit={() => params.commit(params.state)} /><NumericInput label="x / target" value={x} onChange={setX} onCommit={() => params.commit(params.state)} />
  </div>;

  return <div className="alg-page alg-enhancement-page">
    <AlgebraLabHeading subtitle="Twenty-five connected algebra tools. Edit a, b, c, and x to recompute every model." onUndo={params.undo} onRedo={params.redo} canUndo={params.canUndo} canRedo={params.canRedo} onReset={() => params.reset()} helpTitle="Advanced Workbench help" helpBody="Every tool reads the shared a, b, c, and x values. Empty number fields are ignored so values never become NaN. The 3×3 system uses a, b, and c as the intended solution.">Advanced Algebra Workbench</AlgebraLabHeading>
    {controls}
    <section className="alg-enhancement-grid" aria-label="Twenty-five Algebra enhancements">
      <Tool id="ALG-01" title="1. Signed algebra tiles"><output>{show(algebraTiles(a, b, c))}</output></Tool>
      <Tool id="ALG-02" title="2. Zero-pair cancellation"><output>{show(cancelZeroPairs(Math.abs(a) + 2, Math.abs(b)))}</output></Tool>
      <Tool id="ALG-03" title="3. Distributive area model"><p>({a}x {b >= 0 ? "+" : "−"} {Math.abs(b)})({c}x + {x})</p><output>{show(distributeBinomials(a, b, c, x))}</output></Tool>
      <Tool id="ALG-04" title="4. Integer factorization"><p>{a}x² {b >= 0 ? "+" : "−"} {Math.abs(b)}x {c >= 0 ? "+" : "−"} {Math.abs(c)}</p><output>{factor ? show(factor) : "No integer-binomial factorization"}</output></Tool>
      <Tool id="ALG-05" title="5. Arbitrary linear balance"><p>{a}x + {b} = {c}x + {x}</p><output>{show(solveLinearEquation(a, b, c, x))}</output></Tool>
      <Tool id="ALG-06" title="6. Inequality sign reversal"><p>{a}x + {b} &lt; {c}</p><output>{show(solveLinearInequality(a, b, "<", c))}</output></Tool>
      <Tool id="ALG-07" title="7. Absolute-value branches"><p>|{a}x + {b}| = {Math.abs(c)}</p><output>{show(Math.abs(a) < 1e-12 ? solveAbsoluteEquation(a, b, Math.abs(c)) : solveAbsoluteValue(a, b, Math.abs(c)))}</output></Tool>
      <Tool id="ALG-08" title="8. Complete the square"><output>{show(completeSquare(a, b, c))}</output></Tool>
      <Tool id="ALG-09" title="9. Rational excluded values"><p>(x−{b}) / ((x−{b})(x−{c}))</p><output>{show(rationalFunctionAnalysis([b], [b, c], 1, 2))}</output></Tool>
      <Tool id="ALG-10" title="10. Radical extraneous-root check"><p>Candidate x={x} for √x = {Math.sqrt(Math.max(0, x)).toFixed(3)}</p><output>{show(validateRadicalCandidate(x, (value) => Math.sqrt(Math.max(0, value)) - Math.sqrt(Math.max(0, x))))}</output></Tool>
      <Tool id="ALG-11" title="11. Function composition"><p>f(t)={a}t+{b}; g(t)=t²+{c}</p><output>{show(composeFunctions((t) => a * t + b, (t) => t * t + c, x))}</output></Tool>
      <Tool id="ALG-12" title="12. Inverse linear function"><p>f(t)={a}t+{b}</p><output>{show(inverseLinear(a, b) && { slope: inverseLinear(a, b)!.slope, intercept: inverseLinear(a, b)!.intercept })}</output></Tool>
      <Tool id="ALG-13" title="13. Piecewise domain editor"><p>t&lt;0: at+b; t≥0: t²+c</p><output>{show(evaluatePiecewise(x, [{ from: -Infinity, to: 0, value: (t) => a * t + b }, { from: 0, to: Infinity, includeFrom: true, value: (t) => t * t + c }]))}</output></Tool>
      <Tool id="ALG-14" title="14. Roots ↔ coefficients"><p>Roots: {a}, {b}, {c}</p><output>{show(polynomialFromRoots([a, b, c]))}</output></Tool>
      <Tool id="ALG-15" title="15. Complex polynomial roots"><output>{show(roots)}</output></Tool>
      <Tool id="ALG-16" title="16. Synthetic division"><p>({a}x²+{b}x+{c}) ÷ (x−{x})</p><output>{show(syntheticDivide([a, b, c], x))}</output></Tool>
      <Tool id="ALG-17" title="17. Holes and asymptotes"><output>{show(rationalFunctionAnalysis([b], [b, c], 2, 2, a || 1))}</output></Tool>
      <Tool id="ALG-18" title="18. 3×3 row elimination"><p>x+y+z={a + b + c}; 2x−y+z={2 * a - b + c}; x+2y−z={a + 2 * b - c}</p><output>{show(solveThreeByThree([[1, 1, 1], [2, -1, 1], [1, 2, -1]], [a + b + c, 2 * a - b + c, a + 2 * b - c]))}</output></Tool>
      <Tool id="ALG-19" title="19. Nonlinear intersections"><p>{a}t²+{b}t+{c} = {x}</p><output>{show(intersections)}</output></Tool>
      <Tool id="ALG-20" title="20. Exponent-law counterexample"><output>{show(exponentLawCounterexample(Math.max(0.1, Math.abs(a)), b, c, "sum"))}</output></Tool>
      <Tool id="ALG-21" title="21. Change of logarithm base"><p>log base {Math.max(2, Math.abs(a))} of {Math.max(1, Math.abs(x))}</p><output>{show(changeLogBase(Math.max(1, Math.abs(x)), Math.max(2, Math.abs(a)), Math.max(2, Math.abs(b) + 1)))}</output></Tool>
      <Tool id="ALG-22" title="22. Sequence-family comparison"><output>{show(sequences)}</output></Tool>
      <Tool id="ALG-23" title="23. Sigma closed form"><output>{show(arithmeticSeries(a, b, Math.max(1, Math.round(Math.abs(x)))) )}</output></Tool>
      <Tool id="ALG-24" title="24. Proof-step counterexample checker"><p>(t+{b})² ?= t²+{b * b}</p><output>{show(validateEquivalentExpressions((t) => (t + b) ** 2, (t) => t * t + b * b))}</output></Tool>
      <Tool id="ALG-25" title="25. CAS candidate verification"><p>Verify roots in {a}t²+{b}t+{c}=0 with real-domain assumptions.</p><output>{show(verifyEquationCandidates(roots.filter((root) => root.imaginary === 0).map((root) => root.real), (t) => a * t * t + b * t + c))}</output></Tool>
    </section>
  </div>;
}
