import { useStudioState } from "../phase1/StudioModelProvider";
import { useMemo, useState, useRef, useEffect } from "react";
import { Link, useSearchParams, useParams, useNavigate } from "react-router-dom";
import { ArrowRight, Calculator, Search, SlidersHorizontal, Lightbulb, RotateCcw, HelpCircle, Grid2X2, List, AlertCircle, Home, BookOpen, FlaskConical, ChartNoAxesColumn, Undo2, Redo2 } from "lucide-react";
import WorkbenchVisual from "./WorkbenchVisual";
import "./AlgebraWorkbenchReference.css";
import { workbenchTools } from "./algebraStudioCatalog";
import {
  arithmeticSeries, cancelZeroPairs, changeLogBase, completeSquare,
  composeFunctions, distributeBinomials, evaluatePiecewise, exponentLawCounterexample,
  factorIntegerQuadratic, generateSequences, inverseLinear,
  polynomialFromRoots, quadraticRoots, rationalFunctionAnalysis, solveAbsoluteValue,
  solveLinearEquation, solveLinearInequality, solveThreeByThree, syntheticDivide,
  validateEquivalentExpressions, validateRadicalCandidate, verifyEquationCandidates,
} from "./algebraEnhancementEngine";
import { solveAbsoluteEquation, evaluateAlgebraExpression } from "./algebraStudioMath";
import { useAlgebraHistory } from "./useAlgebraHistory";

function NumericInput({ label, value, onChange, onCommit }: { label: string; value: number; onChange: (value: number) => void; onCommit?: (value: number) => void }) {
  return <label className="alg-field"><span>{label}</span><input type="number" value={Number.isFinite(value) ? value : ""} onChange={(event) => { if (event.target.value !== "" && Number.isFinite(event.target.valueAsNumber)) onChange(event.target.valueAsNumber); }} onBlur={() => onCommit?.(value)} /></label>;
}

function TilesView({ a, b, c }: { a: number; b: number; c: number }) {
  return <ul className="alg-tile-readout">{[[a,"x²"],[b,"x"],[c,"1"]].map(([value,label])=><li key={label}>{Number(value)<0?"−":"+"}{label} × {Math.abs(Number(value))}</li>)}</ul>;
}

export default function AlgebraEnhancementWorkbench() {
  const navigate=useNavigate();
  const [params, setParams] = useSearchParams();
  const filterRef = useRef(params);
  useEffect(()=>{filterRef.current=params;},[params]);
  const { toolId } = useParams();
  const focus = toolId ?? params.get("tool") ?? "";
  const [layout, setLayout] = useState("grid");
  const [help, setHelp] = useState(false);
  const [showProgress,setShowProgress]=useState(false);
  const [completed,setCompleted]=useState<string[]>(()=>{try{const saved=JSON.parse(localStorage.getItem("algebra-workbench:completed")??"[]");return Array.isArray(saved)?saved.filter((id:string)=>workbenchTools.some(tool=>tool.id===id)):[];}catch{return [];}});
  const completeTool=()=>{if(!focus)return;const next=[...new Set([...completed,focus])];setCompleted(next);localStorage.setItem("algebra-workbench:completed",JSON.stringify(next));};
  const [section, setSection] = useState("workspace");
  const query = params.get("q") ?? "";
  const group = params.get("group") ?? "all";
  const [leftExpr, setLeftExpr] = useStudioState("AlgebraEnhancementWorkbench:AlgebraEnhancementWorkbench:leftExpr", "(t+b)^2");
  const [rightExpr, setRightExpr] = useStudioState("AlgebraEnhancementWorkbench:AlgebraEnhancementWorkbench:rightExpr", "t^2+b^2");
  const shared = useAlgebraHistory({
    a: params.has("a") && Number.isFinite(Number(params.get("a"))) ? Number(params.get("a")) : 1,
    b: params.has("b") && Number.isFinite(Number(params.get("b"))) ? Number(params.get("b")) : 1,
    c: params.has("c") && Number.isFinite(Number(params.get("c"))) ? Number(params.get("c")) : -2,
    x: params.has("x") && Number.isFinite(Number(params.get("x"))) ? Number(params.get("x")) : 2,
  }, "AlgebraEnhancementWorkbench.tsx:AlgebraEnhancementWorkbench");
  const { a, b, c, x } = shared.state;
  const setA = (value: number) => shared.replace({ ...shared.state, a: value });
  const setB = (value: number) => shared.replace({ ...shared.state, b: value });
  const setC = (value: number) => shared.replace({ ...shared.state, c: value });
  const setX = (value: number) => shared.replace({ ...shared.state, x: value });
  const factorSupported = [a,b,c].every(value=>Number.isSafeInteger(value)&&Math.abs(value)<=1_000_000);
  const factor = factorSupported ? factorIntegerQuadratic(a,b,c) : null;
  const roots = quadraticRoots(a, b, c);
  const sequences = generateSequences(a, b, 6);
  const intersections = useMemo(() => quadraticRoots(a,b,c-x).filter(root=>root.imaginary===0).map(root=>root.real).filter((root,index,all)=>all.indexOf(root)===index), [a,b,c,x]);
  const inverse = inverseLinear(a, b);
  const system = solveThreeByThree([[1, 1, 1], [2, -1, 1], [1, 2, -1]], [a + b + c, 2 * a - b + c, a + 2 * b - c]);
  const inequality = solveLinearInequality(a, b, "<", c);
  const piecewise = evaluatePiecewise(x, [{ from: -Infinity, to: 0, value: (t) => a * t + b }, { from: 0, to: Infinity, includeFrom: true, value: (t) => t * t + c }]);
  const linear = solveLinearEquation(a, b, c, x);
  const absC = c;
  const absVals = c < 0 ? [] : Math.abs(a) < 1e-12 ? solveAbsoluteEquation(a, b, absC).values : solveAbsoluteValue(a, b, absC);
  const square = completeSquare(a, b, c);
  const rational = rationalFunctionAnalysis([b], [b, c], 1, 2);
  const compose = composeFunctions((t) => a * t + b, (t) => t * t + c, x);
  const synth = syntheticDivide([a, b, c], x);
  const logChange = changeLogBase(x, a, b);
  const series = Number.isInteger(x) && x>0 ? arithmeticSeries(a,b,x) : null;
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
  const radical = validateRadicalCandidate(x, (value) => Math.sqrt(value) - Math.abs(a));
  const meta = (id: string) => workbenchTools.find((item) => item.id === id)!;
  const visible = workbenchTools.filter((item) => {
    const matchesGroup = group === "all" || item.lab === group;
    const matchesQuery = !query.trim() || `${item.title} ${item.goal} ${item.id}`.toLowerCase().includes(query.toLowerCase());
    const matchesFocus = !focus || item.id === focus;
    return matchesGroup && matchesQuery && matchesFocus;
  });
  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(filterRef.current);
    if (!value || value === "all") next.delete(key);
    else next.set(key,value);
    filterRef.current=next;
    setParams(next,{replace:true});
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
      "ALG-04": <p>{factor ? `(${factor.left[0]}x ${factor.left[1] >= 0 ? "+" : "−"} ${Math.abs(factor.left[1])})(${factor.right[0]}x ${factor.right[1] >= 0 ? "+" : "−"} ${Math.abs(factor.right[1])})` : factorSupported ? "No integer-binomial factorization" : "Use integer coefficients with magnitude at most 1,000,000 for this factor preview."}</p>,
      "ALG-05": <p>{a}x + {b} = {c}x + {x} → {linear.kind === "one" ? `x = ${linear.value}` : linear.kind}</p>,
      "ALG-06": <p>{a}x + {b} &lt; {c}. {inequality.kind === "interval" ? `x ${inequality.relation} ${inequality.boundary}${inequality.reversed ? " (sign reversed because a < 0)" : ""}` : `Constant inequality is ${String(inequality.truth)}`}</p>,
      "ALG-07": <p>|{a}x + {b}| = {absC} → {a===0 && Math.abs(b)===c ? "all real numbers" : [...new Set(absVals)].join(", ") || "no real solution"}</p>,
      "ALG-08": <p>{square ? `a(x − ${square.h})² + ${square.k}` : "Need a ≠ 0"}</p>,
      "ALG-09": <p>Holes {rational.holes.join(", ") || "none"}. Vertical asymptotes {rational.verticalAsymptotes.join(", ") || "none"}.</p>,
      "ALG-10": <p>Candidate x={x} in √t = |a|. Residual {Number.isFinite(radical.residual) ? radical.residual : "undefined (outside t ≥ 0)"}. {radical.valid ? "Valid" : "Extraneous or off the branch"}.</p>,
      "ALG-11": <p>f∘g({x}) = {compose.fog}; g∘f({x}) = {compose.gof}.</p>,
      "ALG-12": <p>{inverse ? `f⁻¹(t) = ${inverse.slope}t + ${inverse.intercept}` : "No inverse when a = 0."}</p>,
      "ALG-13": <p>x={x}: {piecewise.matched ? piecewise.value : "no piece"}</p>,
      "ALG-14": <p>Monic polynomial from roots {a}, {b}, {c}: {polynomialFromRoots([a, b, c]).join(" , ")}</p>,
      "ALG-15": <p>{roots.length ? roots.map(root=>`${Number(root.real.toFixed(5))} ${root.imaginary<0?"−":"+"} ${Number(Math.abs(root.imaginary).toFixed(5))}i`).join("; ") : "No isolated roots (constant polynomial)."}</p>,
      "ALG-16": <ol className="alg-synth"><li>Bring down {a}</li><li>Quotient {synth.quotient.join(", ")}; remainder {synth.remainder}</li></ol>,
      "ALG-17": <p>HA = {String(rationalFunctionAnalysis(a===0?[b,c]:[b,b], [b, c], 2, 2, a).horizontalAsymptote)}. Holes {rationalFunctionAnalysis(a===0?[b,c]:[b,b], [b, c], 2, 2, a).holes.join(", ") || "none"}.</p>,
      "ALG-18": <p>Intended solution (a,b,c)=({a},{b},{c}). Computed {system ? `(${system.map((value) => Math.round(value * 1e6) / 1e6).join(", ")})` : "singular"}. Residual of eq1 {system ? a + b + c - (system[0]! + system[1]! + system[2]!) : "—"}.</p>,
      "ALG-19": <p>Intersections of {a}t²+{b}t+{c} = {x}: {a===0&&b===0&&c===x?"every real t":intersections.map(value=>Math.round(value*1000)/1000).join(", ") || "none"}.</p>,
      "ALG-20": <p>{exponentClaim.explanation} Left {exponentClaim.left} vs right {exponentClaim.right}.</p>,
      "ALG-21": <p>{logChange ? `log_${a}(${x}) = log_${b}(${x}) / log_${b}(${a}) = ${logChange.inFromBase}` : "Need positive bases ≠ 1 and a positive argument."}</p>,
      "ALG-22": <div>{(["arithmetic","geometric","recursive"] as const).map(kind=><p key={kind}><b>{kind}</b>: {sequences[kind].join(", ")}</p>)}</div>,
      "ALG-23": <p>{series ? `S_n = ${series.sigma} = ${series.sum}` : "n = x must be a positive integer."}</p>,
      "ALG-24": <>{focus&&<><label className="alg-field">Left<input value={leftExpr} onChange={(event) => setLeftExpr(event.target.value)} /></label><label className="alg-field">Right<input value={rightExpr} onChange={(event) => setRightExpr(event.target.value)} /></label></>}<p>{proofCheck.equivalentOnSamples ? "Agree on sample x values — not a proof." : `Counterexample x = ${"counterexample" in proofCheck ? proofCheck.counterexample : "?"}`}</p></>,
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
    const pack = new URLSearchParams({a:String(a),b:String(b),c:String(c),x:String(x)}).toString();
    return <article key={id} className="awb-tool" data-enhancement-id={id}>
      <header><span className={`awb-tool-icon tint-${item.lab}`}><WorkbenchVisual id={id} a={a} b={b} c={c} x={x} icon /></span><div><h2>{`${order.indexOf(id)+1}. ${item.title.replace(/^\d+\. /, "")}`}</h2><p>{item.goal}</p></div><small>{item.lab}</small></header>
      <div className="awb-model"><WorkbenchVisual id={id} a={a} b={b} c={c} x={x} leftExpr={leftExpr} rightExpr={rightExpr}/><div className="awb-result"><span>Live result</span>{body}</div></div>
      <div className="awb-mistake"><AlertCircle size={15}/><div><strong>Common mistake</strong><p>{item.misuse}</p></div></div>
      {focus ? <Link className="awb-open" to={routes[item.lab] ?? "/algebra"}>Explore the full {item.lab} studio <ArrowRight size={16}/></Link> : <Link className="awb-open" to={`/algebra/advanced/${id}?${pack}`}>Open <ArrowRight size={16}/></Link>}
    </article>;
  };

  const steps:Record<string,string[]>={
    "ALG-01":["Split ax² + bx + c into its three term types.","Count positive and negative tiles separately; the labels carry the signs.","Combine only tiles with the same power of x."],
    "ALG-02":["Start with |a| + 2 positive units and |b| negative units.","Pair each positive unit with a negative unit. Each pair sums to zero.","Remove the smaller count of pairs; read the signed remainder."],
    "ALG-03":["Use (ax + b)(cx + x₀), where x₀ is the target field.","Multiply each term in the first factor by each term in the second.","Combine the two linear terms: ac·x² + (a·x₀ + bc)x + b·x₀."],
    "ALG-04":["Look for integer factors of the leading coefficient and constant.","Check that the cross-products sum to b.","Expand the proposed factors to verify ax² + bx + c."],
    "ALG-05":["Subtract cx from both sides of ax + b = cx + target.","Subtract b: (a − c)x = target − b.","Divide by a − c if nonzero. If zero, compare the constants to distinguish all solutions from none."],
    "ALG-06":["Subtract b from ax + b < c.","Divide by a. Reverse the relation when a is negative.","When a = 0, compare b and c; the statement is true for every x or for no x."],
    "ALG-07":["Check the right side c. An absolute value cannot be negative.","Solve ax + b = c and ax + b = −c.","Substitute each candidate into the original absolute value equation."],
    "ALG-08":["If a ≠ 0, factor a out of the quadratic and linear terms.","Use h = −b/(2a) and k = c − b²/(4a).", "Verify ax² + bx + c = a(x − h)² + k by expansion."],
    "ALG-09":["The model is (t − b)/((t − b)(t − c)).", "Keep t = b and t = c excluded even after cancellation.","The cancelled root is a hole unless another denominator factor remains at that same root."],
    "ALG-10":["The domain of √t is t ≥ 0.","Squaring √t = |a| gives the candidate t = a².","Check the target in the original equation. A small residual confirms the candidate only when it is in the domain."],
    "ALG-11":["Use f(t) = at + b and g(t) = t² + c.","For f ∘ g, evaluate g first, then pass its output into f.","For g ∘ f, reverse the order and compare the two outputs."],
    "ALG-12":["Write y = at + b and swap the input and output.","Subtract b and divide by a: f⁻¹(t) = (t − b)/a.","If a = 0 the function is constant and has no inverse."],
    "ALG-13":["For t < 0 use at + b; for t ≥ 0 use t² + c.","Choose the interval before evaluating the expression.","At the boundary t = 0 only the second piece includes the input."],
    "ALG-14":["Each root r contributes the factor (t − r).", "Multiply (t − a)(t − b)(t − c) to build the monic cubic.","The coefficient list is ordered from highest degree to constant."],
    "ALG-15":["Compute D = b² − 4ac.","For D < 0 use √D = i√(−D) in the quadratic formula.","Plot the conjugate roots on the real and imaginary axes, not as real graph intercepts."],
    "ALG-16":["Divide the coefficient list [a, b, c] by (t − target).", "Bring down a, multiply by target and add b; repeat with c.","The last entry is the remainder, equal to the original polynomial evaluated at target."],
    "ALG-17":["The model is a(t − b)² / ((t − b)(t − c)).", "Preserve the excluded denominator roots when simplifying.","Equal numerator and denominator degree gives horizontal asymptote y = a."],
    "ALG-18":["Build the displayed coefficient matrix and constants from the intended solution (a, b, c).", "Use pivot rows to eliminate each column.","Read the recovered triple and substitute it into all three original equations."],
    "ALG-19":["Set at² + bt + c equal to the horizontal target value.", "Solve at² + bt + (c − target) = 0.","Keep real roots and compare each intersection with the graph; a double root is a tangent."],
    "ALG-20":["This model uses the positive base max(0.1, |a|).", "Compute its powers b and c, then add them.","Compare with its power b + c. Adding exponents is a product law, not a sum law."],
    "ALG-21":["Use value = target, original base = a, new base = b.", "Require positive value and bases, with neither base equal to 1.","Compute log_b(value) / log_b(a); it equals log_a(value)."],
    "ALG-22":["The first term is a; the difference or ratio is b.", "Arithmetic terms add b; geometric terms multiply by b.","The recursive model adds b to the previous term, so it matches the arithmetic sequence."],
    "ALG-23":["Use n = target, requiring a positive integer.", "The last term is a + (n − 1)b.","Pair first and last terms to get Sₙ = n(2a + (n − 1)b)/2."],
    "ALG-24":["Enter two expressions in t, with the shared parameters a, b, c available.", "Compare the outputs at t = −3, −1, 0, 1, 2 and 4.","A failing input disproves equivalence. Agreement on these samples does not prove an identity."],
    "ALG-25":["Compute real candidate roots of at² + bt + c = 0.", "Substitute every candidate into the original polynomial.","Accept candidates only when their absolute residual is at most 10⁻⁸."],
  };
  const selected = workbenchTools.find(item=>item.id===focus);
  const order = ["ALG-01","ALG-02","ALG-03","ALG-04","ALG-05","ALG-06","ALG-20","ALG-21","ALG-22","ALG-24","ALG-11","ALG-12","ALG-10","ALG-14","ALG-15","ALG-07","ALG-08","ALG-09","ALG-13","ALG-16","ALG-17","ALG-18","ALG-19","ALG-23","ALG-25"];
  return <div className="awb-reference" data-complex-owned data-chrome-theme="light" id="algebra-lab-main">
    <nav className="awb-top"><Link to="/" className="awb-brand"><span>◇</span>Math Universe</Link><Link to="/studios/algebra/curriculum">♧ Learn</Link><Link to="/studios/algebra/curriculum">↗ Practice</Link><Link to="/studios/algebra/labs">⊙ Explore</Link><Link to="/algebra">♧ Tools</Link><button onClick={()=>setShowProgress(v=>!v)}>▦ Progress</button><form className="awb-top-search" onSubmit={e=>{e.preventDefault();const q=String(new FormData(e.currentTarget).get("q")??"");navigate(`/algebra/advanced?q=${encodeURIComponent(q)}`);}}><Search size={16}/><input name="q" aria-label="Search Math Universe tools" placeholder="Search Math Universe..."/></form><span className="awb-student">ST <b>Student⌄</b></span></nav>
    <nav className="awb-global">{[["Studio Home","/algebra",Home],["Lessons & Practice","/studios/algebra/curriculum",BookOpen],["Interactive Investigations","/studios/algebra/labs",FlaskConical],["App Home","/",Grid2X2],["Compare & Learn","/algebra/advanced?group=functions",ChartNoAxesColumn]].map(([label,to,Icon])=>{const I=Icon as typeof Home;return <Link key={String(label)} to={String(to)}><I size={17}/>{String(label)}</Link>;})}</nav>
    <div className="awb-section-tabs"><button className={section==="meaning"?"active":""} onClick={()=>setSection("meaning")}>What it means</button><button className={section==="workspace"?"active":""} onClick={()=>setSection("workspace")}>Interactive workspace</button>{focus&&<Link to="/algebra/advanced">← All 25 tools</Link>}</div>
    <header className="awb-hero"><span className="awb-hero-icon"><Calculator/></span><div><h1>{selected?selected.title.replace(/^\d+\. /, ""):"Advanced Algebra Workbench"}</h1><p>{selected?selected.goal:"Twenty-five connected algebra tools. Edit a, b, c, and x to recompute every model."}</p></div><aside><Lightbulb/><div><strong>Explore. Experiment. Build intuition.</strong><small>See connections across algebraic ideas.</small></div></aside><button aria-label="Reset parameters" onClick={()=>shared.reset({a:1,b:1,c:-2,x:2})}><RotateCcw/>Reset</button><button aria-label="Refresh models" onClick={()=>{setFilter("q", "");setFilter("group", "all");setLayout("grid");}}><RotateCcw/>Refresh</button><button aria-label="Workbench help" onClick={()=>setHelp(!help)}><HelpCircle/>Help</button></header>
    {showProgress&&<section className="awb-explanation"><h2>Your exploration progress: {completed.length} / 25</h2><progress max={25} value={completed.length}/><p>Mark a tool explored after trying its parameters and explaining the result.</p><div className="awb-progress-links">{workbenchTools.map(item=><Link key={item.id} to={`/algebra/advanced/${item.id}`}>{completed.includes(item.id)?"✓ ":"○ "}{item.title}</Link>)}</div></section>}
    {(help||section==="meaning")&&<section className="awb-explanation"><h2>One parameter pack, many algebraic connections</h2><p>Change the shared values to compare expressions, solutions, functions and sequences. Open any tool for a focused workspace. Blue tiles represent positive terms; signed labels distinguish negative terms. Check domains before accepting a result, and substitute solutions into the original equation.</p><button onClick={()=>{setHelp(false);setSection("workspace");}}>Return to workspace <ArrowRight size={16}/></button></section>}
    <div className="awb-control-row"><section className="awb-parameters"><h2><SlidersHorizontal size={18}/>Parameters <small>(shared across all tools)</small></h2>{controls}<div className="awb-history"><button onClick={shared.undo} disabled={!shared.canUndo}><Undo2 size={15}/>Undo</button><button onClick={shared.redo} disabled={!shared.canRedo}><Redo2 size={15}/>Redo</button></div></section>{!focus&&<section className="awb-filters"><div><label><Search size={18}/><input aria-label="Search tools" placeholder="Search tools (e.g. factor, graph, sequence...)" value={query} onChange={e=>setFilter("q",e.target.value)}/></label><label>Group<select aria-label="Tool group" value={group} onChange={e=>setFilter("group",e.target.value)}><option value="all">All labs</option>{[...new Set(workbenchTools.map(i=>i.lab))].map(l=><option key={l}>{l}</option>)}</select></label><button aria-label="Grid view" aria-pressed={layout==="grid"} onClick={()=>setLayout("grid")}><Grid2X2 size={19}/></button><button aria-label="List view" aria-pressed={layout==="list"} onClick={()=>setLayout("list")}><List size={19}/></button></div><p><strong>{visible.length} tools</strong><br/>Connected • Interactive • Visual</p></section>}</div>
    <p className="awb-parameter-note">a is the leading coefficient, b the linear coefficient, c the constant, and x the probe or target. All models update as you edit.</p>
    <section className={`awb-grid ${focus?"awb-focused":""} ${layout==="list"?"awb-list":""}`} aria-label={focus?"Focused algebra tool":"Twenty-five Algebra enhancements"}>{order.filter(id=>visible.some(i=>i.id===id)).map(render)}</section>
    {!visible.length&&<section className="awb-empty"><h2>{focus?"Tool not found":"No matching tools"}</h2><Link to="/algebra/advanced">Show all tools</Link></section>}
    {selected&&<><section className="awb-walkthrough"><h2>Step-by-step exploration</h2><button onClick={completeTool} disabled={completed.includes(focus)}>{completed.includes(focus)?"✓ Explored":"Mark explored"}</button><ol>{steps[selected.id].map((step,i)=><li key={step}><span>{i+1}</span>{step}</li>)}</ol></section><section className="awb-learning"><div><h2>Observe</h2><p>{selected.goal}</p></div><div><h2>Try it</h2><p>Change a parameter. Try zero, a negative value and a positive value. Compare the results and look for cases where the operation is undefined.</p></div><div><h2>Explain</h2><p>{selected.misuse} Use the live model to explain why.</p></div><nav>{workbenchTools.map(i=><Link key={i.id} aria-current={i.id===focus?"page":undefined} to={`/algebra/advanced/${i.id}?a=${a}&b=${b}&c=${c}&x=${x}`}>{i.title}</Link>)}</nav></section></>}
    <footer>Math Universe ｜ Making Math Visual, Interactive, and Real.</footer>
  </div>;
}
