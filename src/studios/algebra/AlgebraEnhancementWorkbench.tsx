import { useMemo, useState } from "react";
import {
  algebraTiles, arithmeticSeries, cancelZeroPairs, changeLogBase, completeSquare,
  composeFunctions, distributeBinomials, evaluatePiecewise, exponentLawCounterexample,
  factorIntegerQuadratic, generateSequences, inverseLinear, numericIntersections,
  polynomialFromRoots, quadraticRoots, rationalFunctionAnalysis, solveAbsoluteValue,
  solveLinearEquation, solveLinearInequality, solveThreeByThree, syntheticDivide,
  validateEquivalentExpressions, validateRadicalCandidate, verifyEquationCandidates,
} from "./algebraEnhancementEngine";

type ToolProps = { id: string; title: string; children: React.ReactNode };

function Tool({ id, title, children }: ToolProps) {
  return <article className="alg-card alg-enhancement-tool" data-enhancement-id={id}><h2>{title}</h2>{children}</article>;
}

function NumericInput({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return <label className="alg-field"><span>{label}</span><input type="number" value={value} onChange={(event) => onChange(Number(event.target.value))} /></label>;
}

function show(value: unknown) {
  return JSON.stringify(value, (_key, item) => typeof item === "number" ? Math.round(item * 1e6) / 1e6 : item);
}

export default function AlgebraEnhancementWorkbench() {
  const [a, setA] = useState(1), [b, setB] = useState(1), [c, setC] = useState(-2), [x, setX] = useState(2);
  const factor = factorIntegerQuadratic(a, b, c);
  const roots = quadraticRoots(a, b, c);
  const sequences = generateSequences(a, b, 6);
  const intersections = useMemo(() => numericIntersections((value) => a * value * value + b * value + c, () => x, -10, 10), [a, b, c, x]);
  const controls = <div className="alg-enhancement-controls" aria-label="Shared algebra parameters">
    <NumericInput label="a" value={a} onChange={setA} /><NumericInput label="b" value={b} onChange={setB} />
    <NumericInput label="c" value={c} onChange={setC} /><NumericInput label="x / target" value={x} onChange={setX} />
  </div>;

  return <div className="alg-page alg-enhancement-page">
    <header className="alg-header"><div><h1>Advanced Algebra Workbench</h1><p>Twenty-five connected algebra tools. Edit a, b, c, and x to recompute every model.</p></div></header>
    {controls}
    <section className="alg-enhancement-grid" aria-label="Twenty-five Algebra enhancements">
      <Tool id="ALG-01" title="1. Signed algebra tiles"><output>{show(algebraTiles(a, b, c))}</output></Tool>
      <Tool id="ALG-02" title="2. Zero-pair cancellation"><output>{show(cancelZeroPairs(Math.abs(a) + 2, Math.abs(b)))}</output></Tool>
      <Tool id="ALG-03" title="3. Distributive area model"><p>({a}x {b >= 0 ? "+" : "−"} {Math.abs(b)})({c}x + {x})</p><output>{show(distributeBinomials(a, b, c, x))}</output></Tool>
      <Tool id="ALG-04" title="4. Integer factorization"><p>{a}x² {b >= 0 ? "+" : "−"} {Math.abs(b)}x {c >= 0 ? "+" : "−"} {Math.abs(c)}</p><output>{factor ? show(factor) : "No integer-binomial factorization"}</output></Tool>
      <Tool id="ALG-05" title="5. Arbitrary linear balance"><p>{a}x + {b} = {c}x + {x}</p><output>{show(solveLinearEquation(a, b, c, x))}</output></Tool>
      <Tool id="ALG-06" title="6. Inequality sign reversal"><p>{a}x + {b} &lt; {c}</p><output>{show(solveLinearInequality(a, b, "<", c))}</output></Tool>
      <Tool id="ALG-07" title="7. Absolute-value branches"><p>|{a}x + {b}| = {Math.abs(c)}</p><output>{show(solveAbsoluteValue(a, b, Math.abs(c)))}</output></Tool>
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
      <Tool id="ALG-18" title="18. 3×3 row elimination"><p>x+y+z=6; 2x−y+z=3; x+2y−z=2</p><output>{show(solveThreeByThree([[1, 1, 1], [2, -1, 1], [1, 2, -1]], [6, 3, 2]))}</output></Tool>
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
